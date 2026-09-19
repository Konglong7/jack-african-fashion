# Admin Location, Category Grid, and Product Detail Spec + Plan

> Handoff target: Claude Code. Implement task by task. Do not add npm dependencies. This project is not currently a git repository, so skip commit steps unless the executor initializes git separately.

## Goal

Make the site easier for buyers to find the offline shop, and make `/admin/products` faster for the owner to classify products by looking at large product images. Keep product detail pages generic, image-led, and WhatsApp-first, with optional admin customization only when needed.

## Current Project Facts

- Framework: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4.
- Data store: local JSON files.
- Products: `data/products.json`, managed through `src/lib/db.ts`.
- Site settings: `data/site-content.json`, normalized by `src/lib/siteContentTypes.ts`.
- Admin product page: `src/app/admin/products/page.tsx`.
- Admin product client: `src/app/admin/products/ProductsManager.tsx`.
- Admin product editor modal: `src/app/admin/products/ProductEditor.tsx`.
- Product API:
  - list/create: `src/app/api/admin/products/route.ts`
  - get/update/delete: `src/app/api/admin/products/[id]/route.ts`
- Product detail page:
  - shell: `src/app/products/[slug]/page.tsx`
  - buy/info area: `src/app/products/[slug]/ProductInfo.tsx`
  - detail sections: `src/app/products/[slug]/ProductDetailSections.tsx`
- Public location text currently appears in:
  - `src/components/Footer.tsx`
  - `src/app/contact/page.tsx`
  - default/data settings in `src/lib/siteContentTypes.ts` and `data/site-content.json`
- Product defaults/readiness already exist:
  - `src/lib/productDefaults.ts`
  - `src/lib/productReadiness.ts`

## Product Decisions

### 1. Location Link

All public places that show the business location should link to Google Maps.

Use this exact URL:

```text
https://www.google.com/maps/place/Yulong+Fashion+Plaza/data=!4m2!3m1!1s0x0:0xfeceff2a7477a8a?sa=X&ved=1t:2428&ictx=111
```

Display text should be:

```text
Yulong Fashion Plaza
```

The old text `Guangzhou, China` can remain only as secondary context if useful, but the clickable visible location should be `Yulong Fashion Plaza`.

### 2. Admin Products Page

The owner mostly needs to classify products into categories by inspecting style images. The current desktop table uses small thumbnails and is inefficient.

Replace the main admin product list with an image-first grid similar to the customer catalog:

- Large product image, aspect ratio `3 / 4`.
- Product name, slug, current category, readiness status.
- Search, category filter, and readiness filter remain.
- Each card has normal click actions:
  - `Open` public product page.
  - `Edit` opens the existing `ProductEditor`.
  - `Delete` remains available but less visually dominant.
- Right-clicking a product image/card opens a custom category menu.
- Category menu lets the admin assign one existing category immediately.
- Saving category uses the existing `PUT /api/admin/products/[id]` endpoint with the full product payload plus changed `category`.
- No new category-only API is needed.
- Mobile and touch devices need a visible fallback button, for example `Category`, because right-click is desktop-only.

### 3. Product Editor

Keep the existing editor. It already supports:

- upload images,
- set cover image,
- remove gallery image,
- edit gallery paths,
- edit detail modules,
- edit description/features,
- edit FAQ/specs,
- edit WhatsApp copy.

Improve only what helps the owner:

- Make the media tab the place to add detail/back/detail photos.
- Keep category selector in Essentials.
- Keep default product detail content for most products.
- Admin can override description/features/FAQ/detail modules only when needed.
- Do not build a separate image-management page.

### 4. Product Detail Page

Keep detail pages generic and WhatsApp-first:

- Product gallery.
- Product name, category, SKU.
- MOQ and quantity.
- Size selector using existing defaults from `src/lib/productDefaults.ts`.
- Color selector using existing defaults from `src/lib/productDefaults.ts`.
- WhatsApp CTA remains primary.
- Inquiry list CTA remains secondary.
- Description/features can remain but should be compact.
- FAQ can remain.
- Similar styles can remain.
- Avoid heavy per-product content requirements.
- Do not require the admin to manually write full product detail pages for most styles.

## Non-Goals

- Do not add a database.
- Do not add a new state library.
- Do not add a new UI component library.
- Do not implement AI category detection.
- Do not implement bulk category edit in this pass.
- Do not create a separate admin category management page unless the current settings category list is insufficient.

## Acceptance Criteria

### Public Site

- Footer location row links to Google Maps and displays `Yulong Fashion Plaza`.
- Contact page location row links to Google Maps and displays `Yulong Fashion Plaza`.
- External map links use `target="_blank"` and `rel="noopener noreferrer"`.
- Admin settings can edit both location display text and map URL.
- Existing settings without `locationUrl` still normalize safely to the default Google Maps URL.

### Admin Products

- `/admin/products` shows products as large image cards on desktop and mobile.
- Images are large enough to inspect product style without opening edit modal.
- Search still filters by product name and slug.
- Category filter still works.
- Readiness filter still works.
- Right-clicking a product card opens a category menu instead of the browser context menu.
- Choosing a category updates the product category and refreshes local UI.
- Category update errors show a visible admin error message.
- Touch/mobile users can open the same category menu from a visible button.
- Existing edit modal still works.
- Existing delete flow still works.
- Public product open link still works.

### Product Detail and Editor

- Product detail pages remain usable when `detailPage` is missing.
- WhatsApp CTA message still includes selected size, selected color, and quantity.
- Admin editor can add more product images through the existing upload flow.
- Admin editor can add detail modules with image/text when a product needs custom detail content.
- Default product content remains enough for most products.

## Implementation Plan

### Task 1: Add Location URL to Site Settings

Files:

- Modify: `src/lib/siteContentTypes.ts`
- Modify: `data/site-content.json`
- Modify: `src/lib/siteContentTypes.test.ts`
- Modify: `src/app/admin/settings/SettingsForm.tsx`

Steps:

1. Add `locationUrl: string` to `SiteContent`.
2. Add this to `DEFAULT_SITE_CONTENT`:

```ts
location: 'Yulong Fashion Plaza',
locationUrl:
  'https://www.google.com/maps/place/Yulong+Fashion+Plaza/data=!4m2!3m1!1s0x0:0xfeceff2a7477a8a?sa=X&ved=1t:2428&ictx=111',
```

3. In `normalizeSiteContent`, normalize `locationUrl` with a small URL helper.
4. Helper rule: accept only strings starting with `/`, `http://`, or `https://`; otherwise fallback to `DEFAULT_SITE_CONTENT.locationUrl`.
5. Update `data/site-content.json` with:

```json
"location": "Yulong Fashion Plaza",
"locationUrl": "https://www.google.com/maps/place/Yulong+Fashion+Plaza/data=!4m2!3m1!1s0x0:0xfeceff2a7477a8a?sa=X&ved=1t:2428&ictx=111"
```

6. Add a `Location URL` field under the existing `Location` field in `SettingsForm`.
7. Add/update tests:

```ts
it('normalizes location url with default fallback', () => {
  expect(normalizeSiteContent({ locationUrl: 'not-a-url' }).locationUrl).toBe(
    DEFAULT_SITE_CONTENT.locationUrl
  );
  expect(normalizeSiteContent({ locationUrl: 'https://example.com/maps' }).locationUrl).toBe(
    'https://example.com/maps'
  );
});
```

8. Run:

```bash
npm test -- src/lib/siteContentTypes.test.ts
npm run type-check
```

### Task 2: Link Public Location Displays

Files:

- Modify: `src/components/Footer.tsx`
- Modify: `src/app/contact/page.tsx`

Steps:

1. In `Footer.tsx`, replace plain `{siteContent.location}` with:

```tsx
<a
  href={siteContent.locationUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="transition-colors hover:text-white"
>
  {siteContent.location}
</a>
```

2. In `contact/page.tsx`, replace the plain location paragraph with a map link:

```tsx
<a
  href={siteContent.locationUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="text-brand-orange hover:text-brand-gold text-sm transition-colors"
>
  {siteContent.location}
</a>
```

3. Keep the small helper text `Yuexiu District, Guangzhou` if desired.
4. Run:

```bash
npm run type-check
```

Manual check:

- Open `/`.
- Footer location is clickable.
- Open `/contact`.
- Contact location is clickable.
- Both open Google Maps in a new tab.

### Task 3: Create a Tiny Product Category Update Helper

Files:

- Modify: `src/app/admin/products/ProductsManager.tsx`

Steps:

1. Add local state:

```ts
const [savingCategoryId, setSavingCategoryId] = useState('');
const [categoryMenu, setCategoryMenu] = useState<{
  product: Product;
  x: number;
  y: number;
} | null>(null);
```

2. Add helper:

```ts
async function updateCategory(product: Product, category: string) {
  if (product.category === category) {
    setCategoryMenu(null);
    return;
  }

  setSavingCategoryId(product.id);
  setError('');
  try {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, category })
    });
    const data = await res.json();
    if (!res.ok || data.ok === false) {
      throw new Error(data.error || 'Failed to update category');
    }
    setProducts((current) =>
      current.map((item) => (item.id === product.id ? { ...item, category } : item))
    );
    setCategoryMenu(null);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to update category');
  } finally {
    setSavingCategoryId('');
  }
}
```

3. This intentionally reuses the current API. Do not add a new endpoint.
4. Run:

```bash
npm run type-check
```

### Task 4: Replace Admin Table with Image Grid

Files:

- Modify: `src/app/admin/products/ProductsManager.tsx`

Steps:

1. Keep the existing header, refresh button, add product button, search input, category filter, and status filter.
2. Remove the desktop table block.
3. Replace both desktop table and mobile cards with one responsive grid:

```tsx
<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
  {filtered.map((p) => (
    <ProductAdminCard
      key={p.id}
      product={p}
      savingCategory={savingCategoryId === p.id}
      onContextMenu={(event) => {
        event.preventDefault();
        setCategoryMenu({ product: p, x: event.clientX, y: event.clientY });
      }}
      onOpenCategoryMenu={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCategoryMenu({ product: p, x: rect.left, y: rect.bottom + 8 });
      }}
      onEdit={() => setEditing(p)}
      onDelete={() => handleDelete(p.id, p.name)}
      deleting={deletingId === p.id}
    />
  ))}
</div>
```

4. Add a local `ProductAdminCard` component in the same file. Keep it boring:
   - `Image` at `aspect-[3/4]`, `fill`, `object-cover`.
   - name and slug below image.
   - category pill.
   - `PublishingStatus`.
   - actions row: `Open`, `Category`, `Edit`, `Delete`.
5. Use `Link` for public product open:

```tsx
<Link href={`/products/${product.slug}`} target="_blank">Open</Link>
```

6. Keep delete confirmation behavior unchanged.
7. Empty state remains `No products found.`
8. Run:

```bash
npm run type-check
```

### Task 5: Add the Category Context Menu

Files:

- Modify: `src/app/admin/products/ProductsManager.tsx`

Steps:

1. Add a local `CategoryMenu` component in the same file.
2. Render it near the end of `ProductsManager`, before the editor modal.
3. Position with `position: fixed`, using the stored `x` and `y`.
4. Clamp menu position enough to avoid going off-screen:

```ts
const left = Math.min(x, window.innerWidth - 260);
const top = Math.min(y, window.innerHeight - 320);
```

5. Menu contents:
   - product name,
   - current category,
   - button for each category,
   - current category marked as active,
   - close button.
6. Add `useEffect` to close menu on `Escape`, window scroll, or normal click outside.
7. Category buttons call `updateCategory(categoryMenu.product, category)`.
8. Disable category buttons while `savingCategoryId` matches current product id.
9. Run:

```bash
npm run type-check
```

Manual check:

- Right-click card image.
- Browser context menu does not appear.
- Custom category menu appears.
- Pick category.
- Card category updates.
- Refresh page; category persists.

### Task 6: Tighten Product Detail Defaults Only If Needed

Files:

- Check: `src/app/products/[slug]/ProductInfo.tsx`
- Check: `src/app/products/[slug]/ProductDetailSections.tsx`
- Check: `src/lib/productDefaults.ts`

Steps:

1. Confirm `ProductInfo` uses:

```ts
getProductSizes(product.sizes)
getProductColors(product.colors)
SIZE_REQUIREMENT_NOTE
```

2. Confirm WhatsApp link still appends selected size, selected color, and quantity.
3. Confirm `ProductDetailSections` has fallback specs and FAQ when `product.detailPage` is missing.
4. Do not remove more sections unless they are creating manual work for the admin.
5. If details feel too heavy, remove only extra marketing copy, not the CTA or gallery.
6. Run:

```bash
npm run type-check
```

### Task 7: Make Product Editor Media Workflow Obvious

Files:

- Modify only if needed: `src/app/admin/products/ProductEditor.tsx`

Steps:

1. Keep existing upload behavior.
2. In the `Media` tab copy, make it clear this is for cover, back image, and detail images.
3. Keep `MediaManager` thumbnail grid.
4. Keep `DetailSectionsEditor`.
5. Do not add a second upload widget unless the existing one fails.
6. Run:

```bash
npm run type-check
```

### Task 8: Full Verification

Run:

```bash
npm test
npm run type-check
npm run lint
npm run build
```

Manual browser flow:

1. Start dev server:

```bash
npm run dev
```

2. Open:

```text
http://localhost:3000/
http://localhost:3000/contact
http://localhost:3000/admin/products
```

3. Verify:
   - Footer location says `Yulong Fashion Plaza` and opens Google Maps.
   - Contact location says `Yulong Fashion Plaza` and opens Google Maps.
   - Admin product cards show large images.
   - Right-click category menu works.
   - Visible `Category` button works for touch/mobile fallback.
   - Category persists after refresh.
   - Edit modal still opens.
   - Media upload area still exists.
   - Product detail page still leads buyers to WhatsApp.

## Expected Files Changed

- `data/site-content.json`
- `src/lib/siteContentTypes.ts`
- `src/lib/siteContentTypes.test.ts`
- `src/components/Footer.tsx`
- `src/app/contact/page.tsx`
- `src/app/admin/settings/SettingsForm.tsx`
- `src/app/admin/products/ProductsManager.tsx`
- Possibly `src/app/admin/products/ProductEditor.tsx` only for copy/clarity

## Risk Notes

- `PUT /api/admin/products/[id]` validates the full product payload, so category quick-save must send the whole product object with the new category.
- Right-click menus do not work on touch screens, so the visible `Category` button is required.
- `locationUrl` must be added to normalization before `data/site-content.json` is trusted, otherwise old settings can drop the new field.
- `window` access for menu clamping must happen in client event/render code only; `ProductsManager.tsx` is already a client component.

