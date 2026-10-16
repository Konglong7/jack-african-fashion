"""Read-only HTTP audit of public sitemap pages; writes reproducible JSON evidence."""
import argparse
import concurrent.futures
import json
import time
import urllib.parse
import xml.etree.ElementTree as ET
from pathlib import Path

import requests
from bs4 import BeautifulSoup


def audit(base, output):
    base = base.rstrip('/')
    headers = {'User-Agent': 'JackFashionSiteAudit/1.0 (read-only site-owner audit)'}
    sitemap = requests.get(base + '/sitemap.xml', headers=headers, timeout=35)
    sitemap.raise_for_status()
    root = ET.fromstring(sitemap.content)
    urls = [node.text for node in root.findall('{*}url/{*}loc')]

    def inspect(source):
        parsed = urllib.parse.urlsplit(source)
        url = base + parsed.path
        start = time.monotonic()
        try:
            r = requests.get(url, headers=headers, timeout=40)
            soup = BeautifulSoup(r.content, 'html.parser')
            canonical = soup.select_one('link[rel="canonical"]')
            description = soup.select_one('meta[name="description"]')
            schemas, errors = [], []
            for script in soup.select('script[type="application/ld+json"]'):
                try:
                    data = json.loads(script.get_text())
                    nodes = data.get('@graph', [data]) if isinstance(data, dict) else data
                    schemas.extend(node.get('@type') for node in nodes)
                except (ValueError, AttributeError) as exc:
                    errors.append(str(exc))
            return {
                'path': parsed.path or '/', 'status': r.status_code, 'final': r.url,
                'seconds': round(time.monotonic() - start, 3), 'bytes': len(r.content),
                'title': soup.title.get_text() if soup.title else None,
                'description': description.get('content') if description else None,
                'h1': [h.get_text(' ', strip=True) for h in soup.select('h1')],
                'canonical': canonical.get('href') if canonical else None,
                'robots': [m.get('content') for m in soup.select('meta[name="robots"]')],
                'og_url': [m.get('content') for m in soup.select('meta[property="og:url"]')],
                'og_image': [m.get('content') for m in soup.select('meta[property="og:image"]')],
                'schemas': schemas, 'schema_errors': errors,
                'product_links': len(soup.select('a[href^="/products/"]')),
                'images': len(soup.select('img')),
                'missing_alt': len(soup.select('img:not([alt])')),
                'cache': r.headers.get('cf-cache-status'),
                'cache_control': r.headers.get('cache-control'),
                'cache_age': r.headers.get('age'),
                'content_type': r.headers.get('content-type'),
                'encoding': r.headers.get('content-encoding'),
            }
        except Exception as exc:
            return {'path': parsed.path or '/', 'error': str(exc)}

    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        pages = list(pool.map(inspect, urls))
    extras = []
    for path in ['/robots.txt', '/llms.txt', '/admin/login', '/inquiry',
                 '/nonexistent-seo-audit-page', '/products/nonexistent-seo-audit-product']:
        extras.append(inspect(base + path))
    summary = {
        'base': base, 'sitemap_count': len(urls), 'pages': pages, 'extras': extras,
        'non_200': [p for p in pages if p.get('status') != 200],
        'missing_canonical': [p['path'] for p in pages if not p.get('canonical')],
        'invalid_h1': [p['path'] for p in pages if len(p.get('h1', [])) != 1],
        'invalid_schema': [p['path'] for p in pages if p.get('schema_errors')],
    }
    Path(output).parent.mkdir(parents=True, exist_ok=True)
    Path(output).write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding='utf-8')
    print(json.dumps({k: v for k, v in summary.items() if k not in ('pages', 'extras')}, ensure_ascii=False))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', default='https://zamique.com')
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    audit(args.base, args.output)
