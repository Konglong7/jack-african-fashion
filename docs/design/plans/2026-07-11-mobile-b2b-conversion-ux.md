# Mobile B2B Conversion UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make mobile browsing and product inquiry unambiguous while retaining the existing Guangzhou wholesale visual identity across phone, tablet, and desktop.

**Architecture:** Keep the existing page structure and Tailwind breakpoints. The shared chrome owns which floating controls can appear per route; page-specific product CTA remains the sole mobile conversion action on product pages. Catalog filtering stays client-side but category chips become a horizontally scrollable control on phones.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Vitest, Playwright CLI.

## Global Constraints

- Do not add dependencies or new visual frameworks.
- Preserve the existing brand palette, real product imagery, reduced-motion support, and keyboard focus styles.
- Mobile product pages show one fixed conversion action only.
- Desktop and tablet retain access to WhatsApp and the inquiry list.
- Published catalog data must not contain the placeholder product named `test`.

---

### Task 1: Define the mobile conversion hierarchy

**Files:**
- Modify: `src/components/RootChrome.tsx`
- Modify: `src/components/InquiryFloating.tsx`
- Modify: `src/components/WhatsAppFloating.tsx`
- Test: `src/components/mobileConversionLayout.test.ts`

**Interfaces:**
- Consumes: `usePathname()` from Next navigation and the existing `ProductInfo` mobile sticky price CTA.
- Produces: one product-page mobile CTA; a non-product mobile inquiry control only when the inquiry count is nonzero.

- [ ] **Step 1: Write a failing source-layout regression test**

```ts
expect(readComponent('RootChrome.tsx')).toContain("pathname.startsWith('/products/')");
expect(readComponent('RootChrome.tsx')).toContain("hidden md:block");
expect(readComponent('InquiryFloating.tsx')).toContain('if (count === 0)');
expect(readComponent('InquiryFloating.tsx')).toContain('left-4 bottom-4');
```

- [ ] **Step 2: Run the test to verify RED**

Run: `npm test -- mobileConversionLayout.test.ts`

Expected: FAIL because the product-route floating-action boundary and empty-cart suppression are absent.

- [ ] **Step 3: Implement the smallest route-aware layout change**

```tsx
const isProductPage = pathname.startsWith('/products/');

{isProductPage ? (
  <div className='hidden md:block'>
    <InquiryFloating />
    <WhatsAppFloating siteContent={siteContent} />
  </div>
) : (
  <>
    <InquiryFloating />
    <WhatsAppFloating siteContent={siteContent} />
  </>
)}
```

Make `InquiryFloating` return `null` for an empty inquiry list and place its mobile control at the lower left; retain its existing right-side desktop position. Keep WhatsApp at the lower right.

- [ ] **Step 4: Run the test to verify GREEN**

Run: `npm test -- mobileConversionLayout.test.ts`

Expected: PASS.

### Task 2: Improve browsing density and primary navigation

**Files:**
- Modify: `src/app/catalog/CatalogClient.tsx`
- Modify: `src/components/Header.tsx`
- Test: `src/components/mobileConversionLayout.test.ts`

**Interfaces:**
- Consumes: existing `navLinks`, catalog category state, and `siteWhatsAppLink`.
- Produces: a horizontal mobile category rail and a five-item desktop/tablet navigation set.

- [ ] **Step 1: Extend the failing regression test**

```ts
expect(readComponent('CatalogClient.tsx')).toContain('overflow-x-auto');
expect(readComponent('CatalogClient.tsx')).toContain('flex-nowrap');
expect(readComponent('Header.tsx')).toContain("{ label: 'Catalog', href: '/catalog' }");
expect(readComponent('Header.tsx')).toContain('hidden items-center gap-4 md:flex');
```

- [ ] **Step 2: Run the test to verify RED**

Run: `npm test -- mobileConversionLayout.test.ts`

Expected: FAIL because categories currently wrap and desktop navigation is built from eight equal-priority links.

- [ ] **Step 3: Implement the compact controls**

Replace the catalog category wrapper with a horizontal overflow rail below `sm`, keeping wrapped filters at `sm` and up. Give chips `shrink-0 whitespace-nowrap` so category names remain readable.

In `Header`, create a local `desktopNavLinks` constant containing Catalog, New Arrivals, Custom Orders, About Us, and Contact. Use it for the `md` desktop navigation; retain the complete `navLinks` set in the mobile drawer. Align the drawer toggle breakpoint with `md`.

- [ ] **Step 4: Run the test to verify GREEN**

Run: `npm test -- mobileConversionLayout.test.ts`

Expected: PASS.

### Task 3: Refine the home hero and eliminate placeholder/ambiguous content

**Files:**
- Modify: `src/components/home/Hero.tsx`
- Modify: `src/components/home/Categories.tsx`
- Modify: `src/lib/productDefaults.ts`
- Modify: `data/products.json`
- Modify: `src/components/home/homeImageLayout.test.ts`
- Create: `src/lib/productDefaults.test.ts`

**Interfaces:**
- Consumes: Hero WhatsApp link, category entrance animation, product-specific size array.
- Produces: legible desktop Hero text, two clear mobile Hero actions, immediate category-section entrance, and size copy that reflects selected values only.

- [ ] **Step 1: Write failing tests**

```ts
expect(readHomeComponent('Hero.tsx')).toContain('sm:inline-flex');
expect(readHomeComponent('Categories.tsx')).toContain("<section ref={ref}");
expect(SIZE_REQUIREMENT_NOTE).toBe(
  'Available sizes are shown above. Send your preferred size ratio on WhatsApp before quotation.'
);
```

- [ ] **Step 2: Run the tests to verify RED**

Run: `npm test -- homeImageLayout.test.ts productDefaults.test.ts`

Expected: FAIL because the mobile WhatsApp CTA is hidden, the category observer starts after the heading, and size copy promises unlisted defaults.

- [ ] **Step 3: Implement the content and visual changes**

Keep the Hero image-led. Strengthen its left-to-right dark overlay and cap its desktop copy width so the headline does not compete with the models. Expose the existing secondary WhatsApp CTA on mobile as the secondary action below `View Catalog`.

Move the Categories viewport observer ref from the grid to the section so the next section starts entering as soon as it reaches the viewport. Replace the generic size claim with copy tied to the visible size choices. Remove the complete placeholder `test` object from `data/products.json`.

- [ ] **Step 4: Run the tests to verify GREEN**

Run: `npm test -- homeImageLayout.test.ts productDefaults.test.ts`

Expected: PASS.

### Task 4: Validate the real responsive flows

**Files:**
- No production-file changes expected.

**Interfaces:**
- Consumes: local Next server and Playwright CLI.
- Produces: visual evidence at 390px, 768px, and 1440px.

- [ ] **Step 1: Run static verification**

Run: `npm run lint && npm run type-check && npm test`

Expected: all commands exit 0.

- [ ] **Step 2: Run visual verification**

Use Playwright to check:

```text
390px product: only the fixed “Ask price” bar is present; no cart or WhatsApp float overlaps the gallery.
390px catalog: category filters are one horizontal rail; the placeholder product is absent.
768px home: compact desktop navigation and hero follow the same interaction mode.
1440px home: title remains within a readable darkened area and desktop actions remain available.
```

- [ ] **Step 3: Review changed files**

Run: `git diff --check` when a Git worktree is available; otherwise inspect the changed files and test output directly.
