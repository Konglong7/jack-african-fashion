"""Read-only, dependency-free release check of every canonical sitemap page."""
import argparse
import concurrent.futures
import datetime
import json
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.description = ""
        self.canonical = ""
        self.h1 = []
        self.robots = []
        self.schemas = []
        self.image_count = 0
        self.missing_alt = 0
        self.missing_dimensions = 0
        self.headings = []
        self.languages = {}
        self.social = {}
        self.whatsapp = []
        self.icons = []
        self.links = []
        self.body_text = []
        self.breadcrumb_text = []
        self._body = False
        self._ignored = 0
        self._breadcrumb = False
        self._title = False
        self._h1 = False
        self._jsonld = False
        self._script = ""

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "body":
            self._body = True
        if tag in ("script", "style"):
            self._ignored += 1
        if tag == "nav" and attrs.get("aria-label", "").lower() == "breadcrumb":
            self._breadcrumb = True
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self.headings.append(int(tag[1]))
        if tag == "title":
            self._title = True
        elif tag == "h1":
            self._h1 = True
            self.h1.append("")
        elif tag == "meta":
            name = attrs.get("name", "").lower()
            key = attrs.get("property", name)
            if key.startswith(("og:", "twitter:")):
                self.social[key] = attrs.get("content", "")
            if name == "description":
                self.description = attrs.get("content", "")
            elif name == "robots":
                self.robots.append(attrs.get("content", ""))
        elif tag == "link":
            rel = attrs.get("rel", "").split()
            if "canonical" in rel:
                self.canonical = attrs.get("href", "")
            if "alternate" in rel and attrs.get("hreflang"):
                self.languages[attrs["hreflang"]] = attrs.get("href", "")
            if any("icon" in value for value in rel):
                self.icons.append(attrs.get("href", ""))
        elif tag == "img":
            self.image_count += 1
            self.missing_alt += "alt" not in attrs
            self.missing_dimensions += not all(
                attrs.get(key, "").isdigit() and int(attrs[key]) > 0 for key in ("width", "height")
            )
        elif tag == "a" and (
            attrs.get("href", "").startswith("https://wa.me/")
            or attrs.get("href", "") == "/api/whatsapp"
            or attrs.get("href", "").startswith("/api/whatsapp?")
        ):
            self.whatsapp.append(attrs["href"])
        elif tag == "script" and attrs.get("type") == "application/ld+json":
            self._jsonld = True
            self._script = ""

    def handle_data(self, value):
        if self._body and not self._ignored:
            self.body_text.append(value)
            if self._breadcrumb:
                self.breadcrumb_text.append(value)
        if self._title:
            self.title += value
        if self._h1:
            self.h1[-1] += value
        if self._jsonld:
            self._script += value

    def handle_endtag(self, tag):
        if tag == "body":
            self._body = False
        if tag in ("script", "style"):
            self._ignored = max(0, self._ignored - 1)
        if tag == "nav":
            self._breadcrumb = False
        if tag == "title":
            self._title = False
        elif tag == "h1":
            self._h1 = False
        elif tag == "script" and self._jsonld:
            self.schemas.append(self._script)
            self._jsonld = False


def normalize_text(value):
    return " ".join(value.split())


def approved_social_profiles(site=None, claims=None, as_of=None):
    """Require a configured profile and a currently valid owner-verification record."""
    root = Path(__file__).resolve().parents[1]
    if site is None:
        site = json.loads((root / "data/site-content.json").read_text(encoding="utf-8-sig"))
    if claims is None:
        claims = json.loads((root / "data/content-claims.json").read_text(encoding="utf-8-sig"))
    date = as_of or datetime.datetime.now(datetime.timezone.utc).date().isoformat()
    configured = set()
    for value in site.get("socialLinks", {}).values():
        if not isinstance(value, str):
            continue
        parsed = urllib.parse.urlsplit(value)
        if parsed.scheme in ("http", "https") and parsed.netloc and parsed.path.strip("/"):
            configured.add(value)
    return {
        claim["publicValue"] for claim in claims
        if claim.get("subjectType") == "brand" and claim.get("subjectId") == "jack-fashion"
        and claim.get("field") == "socialProfile" and claim.get("status") == "verified"
        and claim.get("verifiedAt") and claim["verifiedAt"] <= date
        and (not claim.get("expiresAt") or claim["expiresAt"] >= date)
        and claim.get("publicValue") in configured
    }


def inspect_schema(page, url, path, nodes):
    """Check emitted facts and their visible counterparts, not rich-result eligibility."""
    issues = []
    by_type = {}
    for node in nodes:
        by_type.setdefault(node.get("@type"), []).append(node)
    origin = "https://zamique.com"
    organizations = by_type.get("Organization", [])
    if len(organizations) != 1:
        issues.append("organization must appear once")
    else:
        org = organizations[0]
        if org.get("@id") != origin + "/#organization" or org.get("name") != "Jack Fashion":
            issues.append("organization identity mismatch")
        profiles = org.get("sameAs", [])
        if not isinstance(profiles, list) or not all(isinstance(value, str) for value in profiles):
            issues.append("invalid organization social profiles")
        elif len(set(profiles)) != len(profiles) or set(profiles) != approved_social_profiles():
            issues.append("unverified or missing organization social profiles")
        elif any(value not in page.links for value in profiles):
            issues.append("organization social profile absent from visible links")
    text = normalize_text(" ".join(page.body_text))
    breadcrumb = normalize_text(" ".join(page.breadcrumb_text))
    links = {urllib.parse.urljoin(url, link) for link in page.links}
    for node in by_type.get("BreadcrumbList", []):
        crumbs = node.get("itemListElement", [])
        if len(crumbs) < 2:
            issues.append("incomplete breadcrumb schema")
        for position, crumb in enumerate(crumbs, 1):
            if crumb.get("position") != position or not crumb.get("item", "").startswith(origin):
                issues.append("invalid breadcrumb position/URL")
            if normalize_text(crumb.get("name", "")) not in breadcrumb:
                issues.append("breadcrumb not present in page navigation")
    for node in by_type.get("FAQPage", []):
        questions = node.get("mainEntity", [])
        if not questions:
            issues.append("empty FAQ schema")
        for question in questions:
            answer = question.get("acceptedAnswer", {})
            if question.get("@type") != "Question" or answer.get("@type") != "Answer":
                issues.append("invalid FAQ types")
            for value in (question.get("name", ""), answer.get("text", "")):
                if not value or normalize_text(value) not in text:
                    issues.append("FAQ content absent from visible page")
    if path.startswith("/products/"):
        products = by_type.get("Product", [])
        if len(products) != 1 or len(by_type.get("FAQPage", [])) != 1:
            issues.append("product/FAQ schema count mismatch")
        for product in products:
            if product.get("url") != url or not product.get("sku"):
                issues.append("product URL/SKU missing")
            if product.get("brand") != {"@id": origin + "/#organization"}:
                issues.append("product brand reference mismatch")
            if not product.get("image") or any(not image.startswith("https://") for image in product["image"]):
                issues.append("invalid product images")
            if any(key in product for key in ("offers", "review", "aggregateRating")):
                issues.append("unverified product offer/review/rating")
    if path == "/catalog" or path.startswith(("/wholesale/", "/markets/")):
        collections = by_type.get("CollectionPage", [])
        lists = by_type.get("ItemList", [])
        if len(collections) != 1 or len(lists) != 1:
            issues.append("collection/list schema count mismatch")
        else:
            collection, items = collections[0], lists[0]
            if collection.get("mainEntity") != {"@id": items.get("@id")}:
                issues.append("collection main entity mismatch")
            entries = items.get("itemListElement", [])
            if items.get("numberOfItems") != len(entries):
                issues.append("collection item count mismatch")
            for position, item in enumerate(entries, 1):
                if item.get("position") != position or item.get("url") not in links:
                    issues.append("collection entry absent from visible links")
            if path == "/catalog":
                visible_products = {link for link in links if urllib.parse.urlsplit(link).path.startswith("/products/")}
                if {item.get("url") for item in entries} != visible_products:
                    issues.append("catalog schema omits published directory products")
    if path.startswith("/guides/"):
        articles = by_type.get("Article", [])
        faqs = by_type.get("FAQPage", [])
        if len(articles) != 1 or len(faqs) != 1 or len(faqs[0].get("mainEntity", [])) != 2:
            issues.append("guide article/FAQ schema mismatch")
        for article in articles:
            if article.get("datePublished") != "2026-10-03" or article.get("dateModified") != "2026-10-09":
                issues.append("guide publication/modification date mismatch")
    return issues


def fetch(url, attempts=3):
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    request = urllib.request.Request(url, headers={"User-Agent": "JackFashionOwnerAudit/1.0"})
    for attempt in range(attempts):
        try:
            try:
                response = opener.open(request, timeout=35)
            except urllib.error.HTTPError as error:
                response = error
            with response:
                return response.status, response.read().decode("utf-8"), {
                    k.lower(): v for k, v in response.headers.items()
                }
        except (urllib.error.URLError, TimeoutError):
            if attempt + 1 == attempts:
                raise
            time.sleep(0.5 * (attempt + 1))


def sitemap_page_urls(xml):
    # Image sitemap locations describe media, not additional HTML pages.
    return [node.text for node in ET.fromstring(xml).findall('{*}url/{*}loc')]


def verify(base, expected, output):
    base = base.rstrip("/")
    status, sitemap, _ = fetch(base + "/sitemap.xml")
    assert status == 200, "Sitemap unavailable"
    urls = sitemap_page_urls(sitemap)
    assert len(urls) == expected and len(set(urls)) == expected, "Unexpected sitemap count"
    for url in urls:
        parsed = urllib.parse.urlsplit(url)
        assert parsed.scheme == "https" and parsed.netloc == "zamique.com"
        assert not parsed.query and not parsed.fragment
        assert not parsed.path.startswith(("/admin", "/api", "/inquiry", "/_next"))

    def inspect(url):
        path = urllib.parse.urlsplit(url).path or "/"
        try:
            status, html, headers = fetch(base + path)
            page = Page()
            page.feed(html)
            issues = []
            if status != 200:
                issues.append(f"HTTP {status}")
            if page.canonical.rstrip("/") != url.rstrip("/"):
                issues.append("canonical mismatch")
            if len(page.h1) != 1 or not page.h1[0].strip():
                issues.append("invalid H1")
            if not page.title or "Jack Fashion" not in page.title:
                issues.append("missing brand/title")
            if not page.description:
                issues.append("missing description")
            if any("noindex" in value for value in page.robots):
                issues.append("public page noindex")
            if page.missing_alt:
                issues.append("missing image alt")
            if page.missing_dimensions:
                issues.append("missing image dimensions")
            if any(b > a + 1 for a, b in zip(page.headings, page.headings[1:])):
                issues.append("skipped heading level")
            for language in ("en", "x-default"):
                if page.languages.get(language, "").rstrip("/") != url.rstrip("/"):
                    issues.append(f"invalid {language} alternate")
            for key in ("og:title", "og:description", "og:url", "og:image",
                        "twitter:card", "twitter:title", "twitter:description", "twitter:image"):
                if not page.social.get(key):
                    issues.append(f"missing {key}")
            for key in ("og:image", "twitter:image"):
                if not page.social.get(key, "").startswith("https://"):
                    issues.append(f"non-absolute {key}")
            if not page.schemas:
                issues.append("missing schema")
            schema_types = []
            schema_nodes = []
            for source in page.schemas:
                try:
                    data = json.loads(source)
                    nodes = data.get("@graph", [data]) if isinstance(data, dict) else data
                    schema_types.extend(node.get("@type") for node in nodes)
                    schema_nodes.extend(nodes)
                except (ValueError, AttributeError, TypeError):
                    issues.append("invalid schema JSON")
            issues.extend(inspect_schema(page, url, path, schema_nodes))
            if not page.whatsapp:
                issues.append("missing WhatsApp path")
            if any("logo-192.png" in value and "jack-fashion" not in value for value in page.icons):
                issues.append("old icon")
            return {"path": path, "status": status, "title": page.title,
                    "canonical": page.canonical, "h1": page.h1,
                    "images": page.image_count, "languages": page.languages,
                    "schema_types": schema_types,
                    "cache": headers.get("cf-cache-status"), "issues": issues}
        except Exception as error:
            return {"path": path, "issues": [type(error).__name__ + ": " + str(error)]}

    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        pages = list(pool.map(inspect, urls))
    title_counts = Counter(page.get("title") for page in pages)
    duplicate_titles = [title for title, count in title_counts.items() if title and count > 1]
    extras = []
    for path in ["/products/nonexistent-release-check", "/markets/nonexistent-release-check", "/guides/nonexistent-release-check",
                 "/wholesale/nonexistent-release-check", "/admin/login", "/inquiry"]:
        status, html, headers = fetch(base + path)
        page = Page()
        page.feed(html)
        if headers.get("x-robots-tag"):
            page.robots.append(headers["x-robots-tag"])
        passed = status == 404 if "nonexistent" in path else any("noindex" in r for r in page.robots)
        extras.append({"path": path, "status": status, "robots": page.robots, "passed": passed})
    robots_status, robots, _ = fetch(base + "/robots.txt")
    robots_ok = robots_status == 200 and "Sitemap: https://zamique.com/sitemap.xml" in robots
    for path in ["/api/admin/leads", "/api/admin/leads/anonymous-check", "/api/admin/indexnow"]:
        status, _, headers = fetch(base + path)
        extras.append({"path": path, "status": status, "passed": status == 401})
    filter_status, filter_html, _ = fetch(base + "/catalog?category=Plus%20Size%20Dresses&sort=newest")
    filtered = Page()
    filtered.feed(filter_html)
    extras.append({"path": "/catalog?category=Plus%20Size%20Dresses&sort=newest", "status": filter_status,
                   "canonical": filtered.canonical, "passed": filter_status == 200 and filtered.canonical == "https://zamique.com/catalog"})
    failed = [page for page in pages if page["issues"]]
    result = {"time": datetime.datetime.now(datetime.timezone.utc).isoformat(), "base": base,
              "sitemap_count": len(urls), "page_count": len(pages), "pages": pages,
              "failed_pages": failed, "duplicate_titles": duplicate_titles,
              "extras": extras, "robots_ok": robots_ok,
              "passed": not failed and not duplicate_titles and robots_ok and all(x["passed"] for x in extras)}
    Path(output).parent.mkdir(parents=True, exist_ok=True)
    Path(output).write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({key: value for key, value in result.items() if key not in ("pages",)}, ensure_ascii=False))
    return result["passed"]


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="https://zamique.com")
    parser.add_argument("--expected", type=int, required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    raise SystemExit(0 if verify(args.base, args.expected, args.output) else 1)
