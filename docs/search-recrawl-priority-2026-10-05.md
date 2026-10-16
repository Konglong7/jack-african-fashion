# Search recrawl priority — 2026-10-05

Public search results observed before this implementation still showed stale snippets. Submit only the affected canonical URLs after deployment and do not repeatedly resubmit unchanged pages.

| Priority | Canonical URL | Stale result observed | Required live state before submission |
| --- | --- | --- | --- |
| P1 | https://zamique.com/ | Old `Jack African Fashion` and unsupported strong business claims | Jack Fashion primary identity and current conservative sourcing copy |
| P1 | https://zamique.com/about | Old factory, delivery and customer-proof wording | Evidence-governed identity, sourcing and WhatsApp copy |
| P1 | https://zamique.com/catalog | Old 12/68-product and MOQ 500 snippets | Product count and MOQ derived from current catalog data |
| P1 | https://zamique.com/faq | Old 68-product count | No hard-coded stale product count |
| P2 | https://zamique.com/custom-orders | Old form-based flow | Current direct-WhatsApp custom enquiry flow |
| Remove stale result | https://zamique.com/products/customer-spotlight-holiday-dress-01 | Old customer/repeat-order claims | Keep the genuine 404 unless a verified product is deliberately restored |

Before submission verify the canonical, HTTP status, current visible text, JSON-LD and edge cache. Search engines decide when snippets change; submission is not proof of recrawl, indexing or replacement.
