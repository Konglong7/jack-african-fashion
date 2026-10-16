# E2E Test Infra: Jack African Fashion Upgrade

## Test Philosophy
- Opaque-box, requirement-driven. Derived from `ORIGINAL_REQUEST.md` and user acceptance criteria.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial Testing + Real-World Workload Testing.
- Non-invasive: Exercises public APIs, URL params, component exports, routing, and styling contracts.

## Feature Inventory
| # | Feature | Source | Tier 1 (Features) | Tier 2 (Boundaries) | Tier 3 (Pairwise) | Tier 4 (Real-World) |
|---|---------|--------|:-----------------:|:-------------------:|:-----------------:|:-------------------:|
| F1 | Global Paper Design Tokens & Backward Compatibility | ORIGINAL_REQUEST §R1 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| F2 | WhatsApp Matrix Router & Secret Consolidation | ORIGINAL_REQUEST §R2 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| F3 | Trade Support Desk Drawer & Query Parsing | ORIGINAL_REQUEST §R2 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| F4 | Hero 3-Column Fulfillment Badges & Gold CTA | ORIGINAL_REQUEST §R3 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| F5 | Guangzhou Showroom & Direct Map Navigation | ORIGINAL_REQUEST §R4 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| F6 | 8-Step Transparent Wholesale Order Flow & QC | ORIGINAL_REQUEST §R4 | ≥5 cases | ≥5 cases | ✓ | ✓ |

## Test Architecture
- Test Runner: Vitest (`npx vitest run tests/e2e/e2e-suite.test.ts`)
- TypeScript Verification: `npm run type-check`
- Production Build Verification: `npm run build`
- Existing Unit Test Verification: `npm run test`

## Real-World Application Scenarios (Tier 4)
1. **Lagos Importer Journey**: Visits homepage via `?sales=grace` campaign, sees West Africa desk highlighted in WhatsApp drawer, verifies Hero Ready-to-Ship badge, clicks direct WhatsApp pre-filled link.
2. **Nairobi Boutique Owner**: Needs OEM customized batch, inspects 8-step transparent workflow with 3-stage QC photos, clicks Chloe Lin (Custom Sampling Lead) via drawer, gets correct pre-filled greeting.
3. **Accra Wholesale Merchant on-site Visit**: In Guangzhou visiting Yulong Garment City, clicks 1-click Apple Maps / Google Maps coordinates (23.158542, 113.254935) to find 16/F showroom.
4. **Desktop vs Mobile Responsive Transition**: Verifies drawer renders as popover on desktop and bottom sheet on mobile, coexisting with Inquiry cart without layout overlap.
5. **Legacy Admin & Catalog Stability**: Ensures all legacy `--color-brand-*` palette items render intact and catalog filtering remains 100% operational alongside paper aesthetic.

## Coverage Thresholds
- Tier 1: ≥30 test cases (≥5 per feature across 6 features)
- Tier 2: ≥30 boundary/edge test cases
- Tier 3: ≥6 pairwise interaction test cases
- Tier 4: ≥5 realistic buyer workflow tests
- **Total Minimum Target**: ≥71 test cases
