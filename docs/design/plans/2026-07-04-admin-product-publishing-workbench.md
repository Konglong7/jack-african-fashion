# Admin Product Publishing Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the admin product publishing flow feel like a dedicated B2B merchandising workbench instead of a raw product-data editor embedded in the public website.

**Architecture:** Keep the existing JSON-backed product API and Next.js App Router pages. Add a small shared readiness utility for testable status logic, isolate admin chrome from public site chrome, then reshape the product manager/editor around publishing tasks.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS 4, TypeScript, Vitest, Playwright MCP for browser verification.

---

### Task 1: Testable Product Readiness Logic

**Files:**
- Create: `src/lib/productReadiness.ts`
- Create: `src/lib/productReadiness.test.ts`
- Modify: `src/app/admin/products/ProductsManager.tsx`
- Modify: `src/app/admin/products/ProductEditor.tsx`

- [ ] **Step 1: Write failing tests**
  - Test that a product with image/gallery, size rows, logistics, and WhatsApp copy is publish-ready.
  - Test that a sparse product reports missing cover image, gallery/story images, size chart, logistics, and WhatsApp copy.
  - Test that status groups map to `ready`, `needs-content`, and `needs-media`.

- [ ] **Step 2: Run the tests and verify RED**
  - Run: `npm test -- src/lib/productReadiness.test.ts`
  - Expected: FAIL because `src/lib/productReadiness.ts` does not exist.

- [ ] **Step 3: Implement readiness utility**
  - Export `getProductReadiness(product)`, `getReadinessSummary(product)`, and `getReadinessStatus(product)`.
  - Keep the current readiness criteria but add cover image and clearer status categories.

- [ ] **Step 4: Run tests and verify GREEN**
  - Run: `npm test -- src/lib/productReadiness.test.ts`
  - Expected: PASS.

### Task 2: Isolate Admin App Shell

**Files:**
- Create: `src/components/RootChrome.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/admin/layout.tsx`

- [ ] **Step 1: Add a client chrome switch**
  - Public paths render skip link, `Header`, public `<main>`, `Footer`, and `WhatsAppFloating`.
  - `/admin` paths render only the admin route content.

- [ ] **Step 2: Tighten admin layout**
  - Ensure admin content owns the full viewport and is not offset by public header/footer.
  - Keep `View Website` as an explicit sidebar action.

- [ ] **Step 3: Browser verify**
  - Open `/admin/products`.
  - Expected: no public header, no public footer, no floating WhatsApp, sidebar starts at viewport top.

### Task 3: Reshape Product Editor Into Publishing Workbench

**Files:**
- Modify: `src/app/admin/products/ProductEditor.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace pill tabs with task navigation**
  - Use a left rail with steps: Essentials, Media, Buying, Story, Conversion.
  - Add a right sticky publishing checklist driven by `getProductReadiness`.

- [ ] **Step 2: Improve media workflow**
  - Show uploaded/current image thumbnails.
  - Add one-click set cover and remove image actions.
  - Keep URL textarea as an advanced fallback, not the primary experience.

- [ ] **Step 3: Improve save flow**
  - Sticky footer shows `Publish product` for new products.
  - Error box stays visible and switches the user to the relevant step for required fields.

### Task 4: Improve Product List Operations

**Files:**
- Modify: `src/app/admin/products/ProductsManager.tsx`

- [ ] **Step 1: Add operational filters**
  - Add status filter: All, Ready, Needs media, Needs content.
  - Keep category and search.

- [ ] **Step 2: Make readiness actionable**
  - Replace raw missing badges with a concise status pill and the next missing tasks.
  - Add `Open` link to the public product page.

- [ ] **Step 3: Add fetch error handling**
  - Show refresh/delete errors in a visible admin alert.
  - Disable delete while deleting.

### Task 5: Verification

**Files:**
- No production file changes.

- [ ] **Step 1: Run unit tests**
  - Run: `npm test`
  - Expected: all Vitest tests pass.

- [ ] **Step 2: Run type check**
  - Run: `npm run type-check`
  - Expected: exit 0.

- [ ] **Step 3: Run lint**
  - Run: `npm run lint`
  - Expected: exit 0 or report existing unrelated lint problems with exact details.

- [ ] **Step 4: Browser smoke test**
  - Start Next dev on an unused port.
  - Login, open `/admin/products`, open Add Product, switch steps, upload area visible, checklist visible.
