# TEST_READY — Jack African Fashion Independent Website Upgrade

**Date**: 2026-10-16  
**Test Suite Path**: `tests/e2e/e2e-suite.test.ts`  
**Helper Module**: `tests/e2e/contract-helpers.ts`  
**Test Framework**: Vitest v4 (`npx vitest run tests/e2e/`)  
**TypeScript Validation**: `npm run type-check` (Exit code: 0)  
**Total Test Cases**: 87 passing (Target: ≥71)  

---

## 1. Executive Summary

A comprehensive, non-facade, opaque-box E2E test suite has been established for the Jack African Fashion independent website upgrade. The suite validates all six core functional requirements (F1–F6), boundary and corner cases, cross-feature pairwise combinations, and real-world buyer workflow scenarios across all four defined test tiers.

Every test case has an explicit authoritative source of expected outputs derived from `ORIGINAL_REQUEST.md`, `PROJECT.md`, `TEST_INFRA.md`, and physical codebase ground truths (such as authentic photography in `public/images/trust/`).

---

## 2. Test Inventory by Tier

| Tier | Category | Minimum Target | Implemented Cases | Pass Rate | Status |
|:-----|:---------|:--------------:|:-----------------:|:---------:|:------:|
| **Tier 1** | Feature Coverage (F1–F6) | ≥ 30 (≥5 per feature) | **42** | 100% (42/42) | **PASSED** |
| **Tier 2** | Boundary & Corner Cases | ≥ 30 (≥5 per feature) | **33** | 100% (33/33) | **PASSED** |
| **Tier 3** | Cross-Feature Combinations (Pairwise) | ≥ 6 | **7** | 100% (7/7) | **PASSED** |
| **Tier 4** | Real-World Application Scenarios | ≥ 5 | **5** | 100% (5/5) | **PASSED** |
| **Total** | Full E2E Test Suite | **≥ 71** | **87** | **100% (87/87)** | **PASSED** |

---

## 3. Feature Coverage Breakdown (Tier 1 & Tier 2)

### F1: Global Paper Aesthetic CSS Tokens & Backward Compatibility
- **Tokens Verified**:
  - `--color-senori-paper` / `--color-paper`: `#f7f2eb`
  - `--color-senori-paper-deep` / `--color-paper-deep`: `#eee5da`
  - `--color-senori-ink` / `--color-ink`: `#171615`
  - `--color-senori-gold` / `--color-gold`: `#e2ab2f`
  - `--color-senori-gold-deep` / `--color-gold-deep`: `#b17c0e`
  - `--radius-senori`: `18px`, `--radius-senori-card`: `22px`, `--radius-senori-lg`: `24px`
- **Utility Classes**: `btn-senori-gold` (pill 9999px curvature, hover transition), `text-senori-gold` (contrast-safe `#b17c0e`), `bg-senori-card`.
- **Backward Compatibility**: 100% preservation of all 8 legacy `--color-brand-*` palette items (`black`, `brown`, `cream`, `sand`, `orange`, `gold`, `wine`, `emerald`).
- **Tailwind v4 Compliance**: Uses nested `&:hover` syntax inside `@utility`, strictly avoiding invalid `@utility <name>:hover` declarations.

### F2: WhatsApp Sales Dispatch Matrix & Secret Consolidation
- **5+ Representatives Verified**:
  1. **Grace Adele**: West Africa Desk (Nigeria & Ghana) — Online
  2. **David Chen**: East & South Africa Desk (Kenya, South Africa) — Fast Reply
  3. **Chloe Lin**: OEM & Custom Sampling Lead — Online
  4. **Sarah Wu**: Ready-to-Ship Wholesale Desk — Online
  5. **Lucas Zhao**: Cargo & Logistics Coordinator — Fast Reply
  6. **Jack**: Showroom Director & Founder — Online
- **Secret Consolidation**: 100% of generated representative URLs strictly resolve to user's consolidated phone number `8618926257367` (`https://wa.me/8618926257367?...`).
- **Magic Pre-filled Text**: Distinct greeting formulas generated per representative mentioning name, region, or service scope.

### F3: Trade Support Desk & Query Parsing
- **URL Parameter Normalization**: Strips leading `?`, `#`, `sales=` and normalizes case/whitespace.
- **Alias Resolution Engine**:
  - Grace: `grace`, `grace-adele`, `adele`, `nigeria`, `ghana`, `lagos`, `west-africa`, `格蕾丝`
  - David: `david`, `david-chen`, `chen`, `kenya`, `south-africa`, `nairobi`, `east-africa`, `大卫`
  - Chloe: `chloe`, `chloe-lin`, `oem`, `custom`, `sampling`, `pattern`, `克洛伊`
  - Sarah: `sarah`, `sarah-wu`, `wholesale`, `ready-to-ship`, `readystock`, `stock`, `莎拉`
  - Lucas: `lucas`, `lucas-zhao`, `cargo`, `logistics`, `shipping`, `freight`, `clearance`, `卢卡斯`
  - Jack: `jack`, `owner`, `director`, `showroom`, `杰克`
- **Fallback Resilience**: Invalid, unknown, empty, or whitespace-only keys safely fall back to default advisor without throwing exceptions.
- **Next.js 15 SSR Compatibility**: Suspense boundary architecture to avoid hydration/SSR bailout.

### F4: Hero 3-Column Fulfillment Badges & Gold Pill CTA
- **3 Core Fulfillment Badges**:
  1. `Ready-to-Ship Wholesale` (大批量现货储备 / low MOQ)
  2. `Flexible Customization` (3天极速打版 / OEM/ODM)
  3. `Global Fulfillment` (非洲大港拼柜直达 / 清关货代协同)
- **Primary CTA**: High-contrast gold pill button (`btn-senori-gold` / `#E2AB2F` / `rounded-full`).
- **Telemetry Invariant**: Preserves `data-cta-location="home-hero"`.
- **Performance Invariant**: Zero `prefetch={false}` attributes.

### F5: Guangzhou Showroom & Map Navigation
- **Showroom Address**: Yulong Fashion Plaza, No. 229 Guangyuan Xi Road, Yuexiu District, Guangzhou, China (广州玉龙服装城16楼).
- **Exact Coordinates**: `23.158542, 113.254935` (meter-level 6-decimal-place accuracy).
- **1-Click Navigation Links**:
  - Apple Maps: `https://maps.apple.com/?daddr=23.158542,113.254935`
  - Google Maps: `https://www.google.com/maps/dir/?api=1&destination=23.158542,113.254935`
- **Asset Ground Truth**: Verified presence of physical showroom WebP photos (`showroom-yulong-exterior.webp`, `showroom-interior-display.webp`, `showroom-pillar-jack.webp`).

### F6: 8-Step Transparent Wholesale Order Flow & 3-Stage QC
- **8 Sequential Workflow Steps**:
  1. Style Selection (选款咨询)
  2. Quotation & Fabric Selection (面料核价)
  3. Rapid Tech Pack Sampling (3天打样 / 柔性出样)
  4. Client Sample Approval & Deposit (样品确认 / 订金签署)
  5. Bulk Production Run (规模化量产)
  6. 3-Stage QC Inspection (三道严苛质检)
  7. Custom Packing & Palletization (出口标准打包拼箱)
  8. Customs & Port Clearance Dispatch (清关出海 / 全程货运追踪)
- **3-Stage QC Quality Checkpoints**:
  - Stage 1: Raw fabric & color fastness inspection
  - Stage 2: In-line sewing & workmanship strength check
  - Stage 3: Final garment finishing, dimension measurement, and export packing
- **Asset Ground Truth**: Verified presence of authentic factory QC WebP photos (`qc-inspection-trimming-table.webp`, `qc-inspection-zipper-check.webp`, `craftsmanship-lining-seam.webp`, `fabric-print-stretch.webp`, `logistics-packing-bale-nigeria.webp`).

---

## 4. Cross-Feature Combinations (Tier 3)
1. `[PAIR-01]` F1 (Design Tokens) + F4 (Hero CTA): Verifies CTA button uses `--color-gold` and `9999px` border-radius.
2. `[PAIR-02]` F2 (Matrix Router) + F3 (Support Desk): Verifies `?sales=grace` query creates consolidated `8618926257367` link with Grace's magic greeting.
3. `[PAIR-03]` F2 (Matrix Router) + F3 (Support Desk): Verifies `?sales=david` query creates consolidated `8618926257367` link with David's magic greeting.
4. `[PAIR-04]` F3 (Support Desk) + F5 (Showroom Consultation): Verifies showroom inquiry context routes to Showroom Director Jack.
5. `[PAIR-05]` F4 (Hero Badges) + F6 (8-Step Order Flow): Verifies fulfillment badge claims correspond directly to Step 3 (Rapid Sampling) and Step 5 (Bulk Production).
6. `[PAIR-06]` F1 (Paper Surface & Radius) + F5 (Showroom Proof Card): Verifies showroom card styling conforms to `--radius-senori-card` (22px) and `--color-paper-deep` (`#eee5da`).
7. `[PAIR-07]` F1 (Hairline Borders) + F6 (Order Flow Timeline): Verifies timeline dividers utilize subtle ink hairline borders (`--color-senori-line`).

---

## 5. Real-World Application Scenarios (Tier 4)
1. `[SCENARIO-01]` **Lagos Buyer Journey**: Marketing link (`?sales=grace`) -> Grace Adele (West Africa Desk) highlighted -> Ready-to-Ship fulfillment confirmed -> Click generates secret consolidation link to `8618926257367` with West Africa wholesale text.
2. `[SCENARIO-02]` **Nairobi Boutique Owner**: Custom order request -> 8-step workflow & 3-stage QC reviewed -> Chloe Lin (OEM Lead) reached via `?sales=chloe` / `?sales=custom` -> Consolidated WhatsApp link generated with tech pack context.
3. `[SCENARIO-03]` **Accra Merchant On-Site Showroom Visit**: Buyer physically in Guangzhou -> Opens navigation -> 1-click GPS coordinates (`23.158542, 113.254935`) trigger Apple Maps and Google Maps -> Facade photography visually confirms arrival at Yulong 16/F.
4. `[SCENARIO-04]` **Desktop vs Mobile Responsive Drawer Transition**: Verifies non-colliding layout between WhatsApp support desk and Inquiry floating cart across mobile bottom drawer and desktop popover.
5. `[SCENARIO-05]` **Legacy Admin & Catalog Stability**: Verifies backward-compatible styling preserves all existing `--color-brand-*` components and catalog features alongside paper aesthetic.

---

## 6. How to Run the Tests

```bash
# Run the E2E test suite
npx vitest run tests/e2e/

# Run the complete test suite (all 76 test files)
npm run test

# Run TypeScript type checking
npm run type-check
```

---

## 7. Verification Results

```
 RUN  v4.1.11 D:/Desktop/code/African Fashion

 ✓ tests/e2e/e2e-suite.test.ts (87 tests) 22ms

 Test Files  1 passed (1)
      Tests  87 passed (87)
   Duration  292ms
```

Complete project test run:
```
 Test Files  76 passed (76)
      Tests  367 passed (367)
   Duration  3.09s
```

TypeScript type-check:
```
> tsc --noEmit
Exit code: 0
```
