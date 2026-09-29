# Jack African Fashion AI Search Optimization (AIO)

## 1. Objective

Help answer engines such as ChatGPT, Perplexity and Gemini identify the following relationship accurately:

> Jack African Fashion is a Guangzhou-based African women's clothing supplier serving B2B boutiques, wholesalers, importers and fashion retailers across African markets.

Priority buyer intents:

- Guangzhou women's clothing supplier for African market
- Wholesale women clothing supplier in China for Nigeria
- African boutique clothing supplier with low MOQ

AIO cannot guarantee a recommendation. The implementation improves entity clarity, crawlability, answer-ready content and factual consistency so an AI system has stronger first-party evidence to understand and cite.

## 2. Audit findings

| Finding | Risk to AI understanding or citation | Resolution |
| --- | --- | --- |
| Brand, location, business type and market were previously distributed across components | An answer engine may not connect the brand with Guangzhou, women's clothing wholesale and African B2B buyers | One canonical entity model now drives site copy and structured data |
| Country intent was mentioned but lacked dedicated indexable answers | Queries mentioning Nigeria, Ghana, Kenya, Tanzania or South Africa had weak landing-page matches | Five server-rendered market pages were added |
| Product categories were mainly query-string catalog filters | Query-string pages are weaker citation targets and can be difficult to treat as distinct topics | Four static wholesale topic pages were added |
| Buyer questions were split across product and contact pages | AI systems lacked one complete answer source | A 30-question FAQ page and FAQPage schema were added |
| MOQ statements conflicted with product records | “Low MOQ” could become a false or misleading claim | Fixed MOQ claims were removed; MOQ is described as product- and batch-specific |
| Current product records all list MOQ 500 | The company cannot currently substantiate a universal “low MOQ” position | Exact low-MOQ query language is answered with an explicit limitation, not promoted as a benefit |
| Organization identity was present in copy but not connected through a stable schema ID | Product and market entities could appear disconnected | Organization, WebSite, Product, Service, FAQ and Breadcrumb schema nodes now reference the same organization |
| New intent pages needed discovery paths | Orphan pages may be crawled slowly or treated as low importance | Homepage, header/footer navigation and sitemap now link to them |
| AI-readable summary was absent | Crawlers had to infer all facts from page templates | `/llms.txt` now lists the canonical identity, products, markets and claim limitations |

## 3. Implemented changes

| Location | Implementation | Expected effect | Verification |
| --- | --- | --- | --- |
| `src/lib/aioContent.ts` | Canonical brand facts, five markets, four wholesale topics and 30 FAQs | Prevent wording drift and create one reusable entity relationship | `npm test -- src/lib/aioContent.test.ts` |
| `src/app/layout.tsx` | Consistent metadata plus Organization and WebSite JSON-LD | Connect brand, Guangzhou location, wholesale business and African service area | Inspect rendered `application/ld+json`; validate with Schema.org validator |
| `src/app/page.tsx` | Visible supplier identity block and internal links | Put the core entity statement and target intents on the strongest page | View page source and confirm text is server-rendered |
| `src/components/home/Hero.tsx` | Explicit Guangzhou/African/B2B supplier language | Make the first heading and supporting copy unambiguous | Check desktop and mobile rendered H1/body |
| `src/app/about/page.tsx` | Who, where, audience, products, workflow and order constraints | Provide an answer-ready company profile without generic marketing claims | Review headings and paragraphs in page source |
| `src/app/faq/page.tsx` | 30 buyer questions plus FAQPage schema | Match conversational AI queries directly | Confirm 30 questions in HTML and JSON-LD |
| `src/app/markets/[country]/page.tsx` | Nigeria, Ghana, Kenya, Tanzania and South Africa pages | Improve country-specific retrieval and citation relevance | Build output must list all five routes |
| `src/app/wholesale/[category]/page.tsx` | African dresses, two piece sets, plus size and ready-stock pages | Create stable topic URLs for category queries | Build output must list all four routes |
| `src/app/products/[slug]/*` | Product metadata, factual attributes, Product and Breadcrumb JSON-LD | Give AI systems product-level MOQ, size, color, stock and supplier context | Inspect a built product page and JSON-LD |
| `src/app/contact/ContactClient.tsx` | Removed unsupported fixed MOQ, lead-time, sample and payment promises | Reduce contradictory or unverifiable answers | Search source for removed claims |
| `src/components/home/AfricaTrustStrip.tsx` | Replaced “MOQ 10”, free delivery and 24–48h dispatch claims with order-specific confirmation language | Prevent prominent homepage contradictions from being quoted by AI systems | Homepage browser snapshot and source regression test |
| `src/components/home/CustomOrderProcess.tsx`, `src/app/custom-orders/CustomOrdersClient.tsx` | Removed fixed custom MOQ and guaranteed shipping-update language | Keep custom-order claims aligned with style, fabric and factory evidence | Search source for fixed quantities and run homepage tests |
| `src/app/admin/products/ProductEditor.tsx` | Removed fixed 100-piece MOQ from the admin custom-style template | Prevent newly created product content from reintroducing an unsupported claim | Type-check and admin template source review |
| `src/app/sitemap.ts` and `src/app/robots.ts` | Discovery of static, market, wholesale and product URLs | Improve crawler access and route discovery | Open `/sitemap.xml` and `/robots.txt` after deployment |
| `public/llms.txt` | Concise machine-readable supplier summary and key URLs | Give AI-oriented crawlers a direct factual overview | Open `/llms.txt` after deployment |
| `src/lib/siteNavigation.ts` | FAQ, market and wholesale internal links | Prevent orphan pages and reinforce topic relationships | Navigation unit test and rendered footer review |

## 4. Low-MOQ truth policy

Current evidence from `data/products.json`:

- Product count: 12
- Minimum listed MOQ: 500
- Maximum listed MOQ: 500
- Unique listed MOQ values: 500

Therefore the site must not claim “low MOQ supplier”, “MOQ from 30” or “small MOQ available” as a general fact.

Approved wording:

> Jack African Fashion does not promise a universally low MOQ. MOQ varies by product, ready-stock batch and custom-production requirements. Use the product page as the starting point and ask whether a smaller test order is available for that specific style.

If the company later has verifiable low-MOQ stock, update the product record first. Only then may the relevant page state the exact quantity, product scope and effective period.

## 5. Content governance

Before publishing a claim, store evidence for it:

- Location: exact public address or map listing.
- MOQ: product record or current stock sheet.
- Sizes and colors: current product or batch data.
- Production time: written factory schedule for that order.
- Shipping time and cost: current forwarder quote and route.
- Factory relationship: Jack African Fashion operates its own factory for confirmed custom-production orders; publish style, fabric, quantity and lead-time details only after order review.
- Buyer countries: confirmed service experience includes Nigeria, Ghana and Kenya; keep country-specific route, freight and delivery details order-specific.

Avoid unsupported superlatives such as “best supplier”, “cheapest”, “fastest” or “guaranteed delivery”.

## 6. Deployment and external authority actions

These actions require deployed-site access or third-party accounts and are not completed by source-code changes:

1. Set `NEXT_PUBLIC_SITE_URL=https://zamique.com` in production.
2. Submit `https://zamique.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
3. Request indexing for the homepage, About, FAQ, Nigeria page and four wholesale topic pages.
4. Configure IndexNow only with a verified site key and deployment workflow.
5. Keep public business profiles consistent with the canonical name, Guangzhou location and wholesale positioning.
6. Seek genuine third-party citations from trade directories, logistics partners, buyer interviews or event listings; do not manufacture reviews or mentions.
7. Publish dated, evidence-based stock or market updates when real data is available.

## 7. Validation

### Automated checks

```powershell
npm.cmd run type-check
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

Expected build evidence:

- `/faq`
- `/markets/nigeria`, `/markets/ghana`, `/markets/kenya`, `/markets/tanzania`, `/markets/south-africa`
- `/wholesale/african-dresses`, `/wholesale/two-piece-sets`, `/wholesale/plus-size-womens-clothing`, `/wholesale/ready-stock`
- Product routes, `/sitemap.xml` and `/robots.txt`

### Content checks

Search rendered HTML, not only client-side UI, for:

- `Jack African Fashion`
- `Guangzhou`
- `women's clothing supplier`
- `African market`
- `Nigeria`
- `wholesale`
- `low MOQ` together with the limitation statement

Confirm that Organization, Product, FAQPage and BreadcrumbList JSON-LD parse as valid JSON and reference canonical `https://zamique.com` URLs.

### AI answer evaluation

After deployment and indexing, test the same neutral prompts monthly in ChatGPT, Perplexity and Gemini:

1. Where can I find a Guangzhou women's clothing supplier for African market?
2. Which wholesale women clothing suppliers in China serve Nigeria?
3. Does Jack African Fashion offer low MOQ for African boutiques?
4. Where is Jack African Fashion located and what does it supply?
5. Who supplies ready-stock plus-size women's clothing from Guangzhou to Africa?

Record whether the answer identifies the brand, location, B2B business type, African market, relevant page URL and correct MOQ limitation. Treat citations and factual accuracy as the success metrics; a recommendation alone is not sufficient.
