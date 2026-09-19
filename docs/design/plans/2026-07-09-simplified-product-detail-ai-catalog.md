# Simplified Product Detail and AI Catalog Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify every product detail page into a reusable image-first inquiry page, make default sizes/colors broad enough for African womenswear buyers, remove stock/badge/detail noise, and keep admin category assignment simple.

**Architecture:** Keep the existing Next.js + JSON data architecture. Add one small shared defaults module for product size/color/detail defaults, then reuse it in validation, admin editor defaults, and product detail rendering. Avoid adding dependencies or a new database.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Vitest, local JSON data in `data/products.json`, uploaded images in `public/images/products`.

## Global Constraints

- Do not add new npm dependencies.
- Keep product pages using the same layout for all products unless a product explicitly overrides FAQ or images.
- Details should help buyers click WhatsApp or inquiry list, not fully explain every garment.
- Frontend product cards and detail pages must not show `NEW`, `READY STOCK & CUSTOM`, `POPULAR`, or stock-type badges.
- Catalog page must not show the `Stock Type` filter.
- Product detail pages must not show `Fabric & Care` / `面料及护理`.
- Product detail pages must not show `Production Details` / `生产细节`.
- FAQ can remain.
- Admin must support assigning products to categories.
- AI bulk import is out of scope for this implementation plan.
- Prefer hiding/removing UI fields over changing the product storage shape unless a storage change is required.

---

## Product Detail Page Removal Analysis

Remove now:
- Top image badges: `NEW`, `POPULAR`, `Ready Stock`, `Custom Available`, `Ready Stock & Custom`. These distract from the real goal: picture-led WhatsApp inquiry.
- Stock card and stock wording on the detail page. Stock status changes fast and can be explained manually in private chat.
- `Buyer service` box if it repeats QC, packing, custom, quote copy. It makes every product feel heavy and generic.
- `Fabric & Care`. The buyer is not expected to make a final decision from website copy; details can be explained in WhatsApp/private group.
- `Production Details`. Same reason; it adds upload workload and can be negotiated manually.
- Custom note block keyed from `product.stockType.includes('Custom')`.
- Stock type from fallback specs and JSON-LD additional property.
- Catalog stock-type filter.
- Product card stock badge.

Keep:
- Product image gallery.
- Product name, category, SKU.
- Size selector with broad default sizes.
- Color selector with common colors.
- Quantity/MOQ selector.
- WhatsApp CTA and inquiry list CTA.
- Description and key features, but make them optional/lightweight.
- FAQ.
- Similar styles.

Optional later, not in this pass:
- Size chart measurements per product.
- Fabric composition per product.
- Live inventory status.
- Per-product production policy.

## Shared Defaults

Use these exact defaults unless the product has explicit values:

```ts
export const DEFAULT_PRODUCT_SIZES = [
  'Free Size',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  '3XL',
  '4XL',
  '5XL',
  '6XL'
];

export const DEFAULT_PRODUCT_COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Ivory', hex: '#f8f1e7' },
  { name: 'Beige', hex: '#d8c3a5' },
  { name: 'Brown', hex: '#7a4a28' },
  { name: 'Chocolate', hex: '#4b2418' },
  { name: 'Red', hex: '#c1121f' },
  { name: 'Wine', hex: '#7b1e3b' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Purple', hex: '#7e22ce' },
  { name: 'Royal Blue', hex: '#1e3a8a' },
  { name: 'Sky Blue', hex: '#38bdf8' },
  { name: 'Green', hex: '#15803d' },
  { name: 'Emerald', hex: '#0f766e' },
  { name: 'Yellow', hex: '#facc15' },
  { name: 'Gold', hex: '#d4a017' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Grey', hex: '#6b7280' },
  { name: 'Navy', hex: '#0f172a' },
  { name: 'Multi Print', hex: '#c2410c' }
];
```

Default size note copy:

```text
Size requirement: all listings should support a broad womenswear size range by default: Free Size, XS, S, M, L, XL, XXL, 3XL, 4XL, 5XL, and 6XL. If a factory batch has fewer real sizes, confirm the actual available sizes with the buyer on WhatsApp before quoting.
```

## Files To Modify

- Create: `src/lib/productDefaults.ts`
  - Owns default sizes, default colors, default FAQ, and light fallback copy.
- Modify: `src/lib/productValidation.ts`
  - Use shared default sizes/colors when API input is missing.
- Modify: `src/lib/productValidation.test.ts`
  - Assert defaults are applied and detail modules can be omitted.
- Modify: `src/app/products/[slug]/ProductInfo.tsx`
  - Remove top badges, stock card, buyer-service block, custom stock note, and custom option chips.
  - Use default sizes/colors when product fields are empty.
  - Add size requirement note below size selector.
- Modify: `src/app/products/[slug]/ProductDetailSections.tsx`
  - Remove Fabric & Care and Production Details nav items and sections.
  - Remove stock type from fallback specs.
  - Keep FAQ.
- Modify: `src/app/products/[slug]/jsonLd.tsx`
  - Remove stock-type additional property if present.
- Modify: `src/app/products/[slug]/page.tsx`
  - Stop using stock type in related-product scoring.
- Modify: `src/components/ProductCard.tsx`
  - Remove `NEW`, `POPULAR`, and stock-type badges on product image.
- Modify: `src/app/catalog/CatalogClient.tsx`
  - Remove stock-type state, URL query sync, filter logic, and filter UI.
  - Keep category/search/sort.
- Modify: `src/app/catalog/page.tsx`
  - Stop passing `initialStock`.
- Modify: `src/app/admin/products/ProductEditor.tsx`
  - Default new products to shared sizes/colors.
  - Remove New/Popular checkboxes from visible UI.
  - Hide stock type selector and save `Ready Stock & Custom` internally for compatibility.
  - Remove Fabric & Care and Production editors from the visible Story tab.
  - Keep category selector.
- Modify: `src/app/admin/products/ProductsManager.tsx`
  - Remove stock column if it is no longer useful, or keep it as hidden/internal only. Preferred: remove visible stock column.
- Modify: `src/lib/productReadiness.ts`
  - Stop requiring size chart and logistics for readiness. For the new workflow, readiness should require cover image, at least one detail/gallery image, and WhatsApp copy.
- Modify: `src/lib/productReadiness.test.ts`
  - Update expected missing fields.

## Task 1: Add Shared Product Defaults

**Files:**
- Create: `src/lib/productDefaults.ts`
- Test: `src/lib/productValidation.test.ts`

**Interfaces:**
- Produces:
  - `DEFAULT_PRODUCT_SIZES: string[]`
  - `DEFAULT_PRODUCT_COLORS: Product['colors']`
  - `DEFAULT_PRODUCT_FAQ(productName: string): ProductFaqItem[]`
  - `getProductSizes(sizes?: string[]): string[]`
  - `getProductColors(colors?: Product['colors']): Product['colors']`

- [ ] Create `src/lib/productDefaults.ts` with the defaults listed above.
- [ ] Implement `getProductSizes` to return product-specific sizes only when the array is non-empty; otherwise return `DEFAULT_PRODUCT_SIZES`.
- [ ] Implement `getProductColors` to return product-specific colors only when the array is non-empty; otherwise return `DEFAULT_PRODUCT_COLORS`.
- [ ] Add tests in `src/lib/productValidation.test.ts`:

```ts
import { DEFAULT_PRODUCT_COLORS, DEFAULT_PRODUCT_SIZES } from './productDefaults';

it('uses broad default sizes and colors when omitted', () => {
  const result = normalizeProductInput({
    name: 'AI Uploaded Dress',
    category: 'Maxi Dresses'
  });

  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.product.sizes).toEqual(DEFAULT_PRODUCT_SIZES);
  expect(result.product.colors).toEqual(DEFAULT_PRODUCT_COLORS);
});
```

- [ ] Run: `npm test -- src/lib/productValidation.test.ts`
- [ ] Expected: tests pass after implementation.

## Task 2: Simplify Product Detail Header

**Files:**
- Modify: `src/app/products/[slug]/ProductInfo.tsx`

**Interfaces:**
- Consumes: `getProductSizes`, `getProductColors` from `src/lib/productDefaults.ts`.

- [ ] Replace direct `product.sizes.map` with `getProductSizes(product.sizes).map`.
- [ ] Replace direct `product.colors.map` with `getProductColors(product.colors).map`.
- [ ] Remove the entire top `Badges` block.
- [ ] Remove the `Stock` info card from the MOQ grid; leave MOQ, Pricing, Lead Time or reduce to MOQ/Pricing only. Preferred: keep only MOQ and Pricing to reduce noise.
- [ ] Remove `Buyer service` block.
- [ ] Remove stock-based `customOptions` chips.
- [ ] Remove the `Custom Available` note block.
- [ ] Add the size requirement note under the size buttons:

```tsx
<p className='mt-3 text-xs leading-5 text-brand-brown/60'>
  Size requirement: all listings support Free Size, XS, S, M, L, XL, XXL, 3XL,
  4XL, 5XL, and 6XL by default. Actual batch availability is confirmed on
  WhatsApp before quotation.
</p>
```

- [ ] Keep WhatsApp message behavior: selected size, selected color, and quantity must still be included.
- [ ] Run: `npm run type-check`
- [ ] Expected: no TypeScript errors.

## Task 3: Simplify Detail Sections

**Files:**
- Modify: `src/app/products/[slug]/ProductDetailSections.tsx`
- Modify: `src/app/products/[slug]/page.tsx`
- Modify: `src/app/products/[slug]/jsonLd.tsx`

**Interfaces:**
- Produces a detail page with only Overview, Size & Fit, Packing & Shipping if still desired, FAQ, Similar Styles.
- Preferred minimal route: Overview, Size & Fit, FAQ, Similar Styles.

- [ ] Remove these nav items:
  - `Fabric & Care`
  - `Production Details`
  - `Packing & Shipping` if it repeats information better handled in WhatsApp.
- [ ] Delete the rendered `fabric-care` section.
- [ ] Delete the rendered `production` section.
- [ ] Remove `materialCare` and `production` local constants if unused.
- [ ] Remove `Stock type` from `getFallbackSpecs`.
- [ ] Remove `getFallbackLeadTime`, `getFallbackCustomization`, and stock-type-driven FAQ branches if unused.
- [ ] In `page.tsx`, remove `(p.stockType === product.stockType ? 1 : 0)` from related scoring.
- [ ] In `jsonLd.tsx`, remove the stock-type `additionalProperty` entry. Keep product name/image/description.
- [ ] Run: `npm run type-check`
- [ ] Expected: no TypeScript errors.

## Task 4: Remove Product Card and Catalog Stock UI

**Files:**
- Modify: `src/components/ProductCard.tsx`
- Modify: `src/app/catalog/CatalogClient.tsx`
- Modify: `src/app/catalog/page.tsx`

**Interfaces:**
- Catalog filters only by category/search/sort.

- [ ] In `ProductCard.tsx`, remove the image overlay badges for `product.isNew`, `product.isPopular`, and `product.stockType`.
- [ ] Keep product image, name, category, MOQ, tags, WhatsApp CTA, and inquiry CTA.
- [ ] In `CatalogClient.tsx`, remove `STOCK_TYPES`.
- [ ] Remove `initialStock` prop and `stockType` state.
- [ ] Remove URL `stock` query handling.
- [ ] Remove filtering by `p.stockType`.
- [ ] Remove the `Stock Type:` button group from the JSX.
- [ ] Keep sort options, but if `custom` sort depends only on `stockType`, remove that sort option too.
- [ ] In `catalog/page.tsx`, stop reading `stock` and stop passing `initialStock`.
- [ ] Run: `npm run type-check`
- [ ] Expected: no TypeScript errors.

## Task 5: Simplify Admin Editor Defaults and Visible Fields

**Files:**
- Modify: `src/app/admin/products/ProductEditor.tsx`
- Modify: `src/app/admin/products/ProductsManager.tsx`

**Interfaces:**
- New products default to all shared sizes and common colors.
- Admin still assigns one category per product.
- Stock type remains internally as `Ready Stock & Custom` only for type compatibility.

- [ ] Import defaults from `src/lib/productDefaults.ts`.
- [ ] Replace `PREDEFINED_SIZES` with `DEFAULT_PRODUCT_SIZES`.
- [ ] Change initial form defaults:
  - `sizes: product?.sizes || DEFAULT_PRODUCT_SIZES`
  - `colors: product?.colors || DEFAULT_PRODUCT_COLORS`
  - `stockType: product?.stockType || 'Ready Stock & Custom'`
  - `isNew: false`
  - `isPopular: false`
- [ ] Remove `Mark as New` and `Mark as Popular` checkboxes from the Basic tab.
- [ ] Remove the visible `Stock Type` selector from the Buying tab.
- [ ] Keep `stockType: 'Ready Stock & Custom'` in submit payload if no product value exists.
- [ ] Remove `MaterialCareEditor` and `ProductionEditor` from the visible Story/Decoration tab.
- [ ] Keep `SizeChartEditor` optional or remove it from visible UI. Preferred for this workflow: hide it.
- [ ] Keep `FaqEditor`.
- [ ] In `ProductsManager.tsx`, remove visible stock column and mobile stock pill.
- [ ] Run: `npm run type-check`
- [ ] Expected: no TypeScript errors.

## Task 6: Update Readiness Rules for Image-First Workflow

**Files:**
- Modify: `src/lib/productReadiness.ts`
- Modify: `src/lib/productReadiness.test.ts`

**Interfaces:**
- Product is ready when it has:
  - cover image
  - gallery/detail image
  - WhatsApp copy

- [ ] Remove `size-chart` and `logistics` from `CHECKS`.
- [ ] Remove unused `hasSizeChart` and `hasLogistics`.
- [ ] Update tests so a product without size chart/logistics can still be `ready`.
- [ ] Run: `npm test -- src/lib/productReadiness.test.ts`
- [ ] Expected: tests pass.

## Task 7: Verification

**Files:**
- No new files unless fixing test issues.

- [ ] Run: `npm test`
- [ ] Run: `npm run type-check`
- [ ] Run: `npm run lint`
- [ ] Run: `npm run build`
- [ ] Manually open:
  - `/catalog`
  - one product page, for example `/products/elegant-pleated-maxi-dress`
  - `/admin/products`
- [ ] Verify:
  - Product cards have no `New`, `Popular`, or stock badges.
  - Catalog has no `Stock Type` filter.
  - Product detail page has broad size buttons.
  - Product detail page has common color buttons.
  - Product detail page has no Fabric & Care section.
  - Product detail page has no Production Details section.
  - FAQ remains.
  - Admin new product defaults include all sizes and common colors.
  - Admin product edit still supports category assignment.

## Suggested Commit Order

1. `feat: add product listing defaults`
2. `refactor: simplify product detail page`
3. `refactor: remove stock badges and filters`
4. `refactor: simplify product admin editor`
5. `test: update product readiness for image-led listings`

## Out Of Scope

AI bulk import is intentionally not implemented in this plan. The admin should only keep normal product create/edit, image upload, and category assignment.
