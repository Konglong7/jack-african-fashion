# Project: Jack African Fashion Independent Website Upgrade

## Architecture
- **Framework & Runtime**: Next.js 15.5.27 (App Router), React 19, Node.js.
- **Styling & Design System**: Tailwind CSS v4 (@tailwindcss/postcss), CSS variables in `@theme` block (`src/app/globals.css`), CSS modules (`homepage.module.css`).
- **Icons Strategy**: Inline native React SVG / `src/components/Icons.tsx` (Note: `lucide-react` is not in package.json; strictly avoid importing from external icon packages).
- **Client/Server Boundary**:
  - Global styles and layout: `src/app/globals.css`, `src/app/layout.tsx`.
  - Leaf Suspense Boundary: `WhatsAppFloating.tsx` uses `<SalesUrlSync />` wrapped in `<Suspense fallback={null}>` to read `useSearchParams()` without causing SSR bailout.
  - Showroom & Hero: Server components or standard client components mounted cleanly on homepage (`src/app/page.tsx`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Global Paper Aesthetic Tokens | Integrate `--color-paper` (#F7F2EB), `--color-paper-deep` (#EEE5DA), `--color-ink` (#171615), `--color-gold` (#E2AB2F / #B17C0E), card radius 18-24px, pill CTA utilities into `src/app/globals.css` with 100% backward compatibility for `--color-brand-*` | M1 | ORIGINAL_REQUEST §R1 |
| F2 | WhatsApp Sales Matrix Router | Create `src/lib/whatsappRouter.ts` with 5+ representatives (Grace Adele, David Chen, Chloe Lin, Sarah Wu, Lucas Zhao, Jack), secret consolidation to `8618926257367`, and magic greeting text generation | M2 | ORIGINAL_REQUEST §R2 |
| F3 | Trade Support Desk Drawer & Query Sync | Upgrade `src/components/WhatsAppFloating.tsx` with floating desk drawer, mobile bottom-sheet / desktop popover, dynamic `?sales=xxx` highlighting with Next.js 15 Suspense leaf | M2 | ORIGINAL_REQUEST §R2 |
| F4 | Hero 3-Column Fulfillment Badges & Gold CTA | Upgrade `src/components/home/Hero.tsx` with 3 fulfillment badges (Ready-to-Ship Wholesale, Flexible Customization, Global Fulfillment) and gold pill CTA button (#E2AB2F) | M3 | ORIGINAL_REQUEST §R3 |
| F5 | Guangzhou Yulong Showroom & Map Navigation | Create `src/components/home/ShowroomProof.tsx` with Yulong Building 2 Shop 3063 showroom address, direct Apple Maps & Google Maps navigation (coordinates 23.158542, 113.254935), and mount in `src/app/page.tsx` | M4 | ORIGINAL_REQUEST §R4 |
| F6 | 8-Step Transparent Wholesale Order Flow & QC | Upgrade `src/components/home/CustomOrderProcess.tsx` to 8-step transparent workflow with 3-stage QC and real WebP trust photographic evidence | M4 | ORIGINAL_REQUEST §R4 |
| F7 | E2E Testing Suite (Tiers 1-4) | Comprehensive opaque-box test suite covering all 6 features, boundary cases, pairwise combinations, and real-world buyer scenarios | M-TEST | ORIGINAL_REQUEST §Acceptance Criteria |
| F8 | Final Integration, Build & Audit Verification | Verify `npm run type-check`, `npm run test`, `npm run build`, and forensic audit verification | M5 | ORIGINAL_REQUEST §Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Global Visual Design Language Upgrade | `src/app/globals.css` (tokens, utilities, backwards compatibility) | none | DONE |
| M2 | Virtual WhatsApp Receptionist Matrix | `src/lib/whatsappRouter.ts`, `src/components/WhatsAppFloating.tsx` | none | DONE |
| M3 | Hero Screen Redesign | `src/components/home/Hero.tsx` | M1 | DONE |
| M4 | Guangzhou Showroom & Factory Proof | `src/components/home/ShowroomProof.tsx`, `src/components/home/CustomOrderProcess.tsx`, `src/app/page.tsx` | M1 | DONE |
| M-TEST | E2E Test Suite Creation | `tests/e2e/`, test runner, Tiers 1-4 test cases | none | DONE |
| M5 | E2E Verification & Hardening | Phase 1: 100% E2E test pass + type-check + build; Phase 2: Tier 5 adversarial hardening | M1, M2, M3, M4, M-TEST | DONE |

## Interface Contracts
### Design Tokens ↔ Components
- CSS Variables exported via `@theme`:
  - `--color-senori-paper` / `--color-paper`: `#f7f2eb`
  - `--color-senori-paper-deep` / `--color-paper-deep`: `#eee5da`
  - `--color-senori-ink` / `--color-ink`: `#171615`
  - `--color-senori-gold` / `--color-gold`: `#e2ab2f`
  - `--color-senori-gold-deep` / `--color-gold-deep`: `#b17c0e`
  - `--radius-senori`: `18px`, `--radius-senori-card`: `22px`
- Utilities available:
  - `btn-senori-gold` (`rounded-full`, bg `#e2ab2f`, text `#171615`, hover `#b17c0e` + `#fff`)
  - `bg-senori-paper`, `bg-senori-card`, `text-senori-ink`, `text-senori-gold`

### `src/lib/whatsappRouter.ts` ↔ `src/components/WhatsAppFloating.tsx`
- Exported Types & Constants:
  - `SalesAccount`: `{ id: string; name: string; title: string; desk: string; region: string; status: 'online' | 'fast_reply'; avatarText: string; highlightKeywords: string[] }`
  - `AFRICAN_FASHION_SALES_ACCOUNTS`: Array of 5+ accounts.
  - `AFRICAN_FASHION_SALES_ALIASES`: Alias map (e.g., `'grace' -> 'grace-adele'`, `'david' -> 'david-chen'`).
  - `CONSOLIDATED_WHATSAPP_NUMBER`: `'8618926257367'`.
  - `resolveSalesAccount(queryKey?: string | null): SalesAccount`.
  - `buildWhatsAppLink(account: SalesAccount, customContext?: string): string`.
  - Returns `https://wa.me/8618926257367?text=${encodeURIComponent(personalizedGreeting)}`.

### Showroom & QC Flow ↔ Homepage (`src/app/page.tsx`)
- `ShowroomProof` accepts `{ siteContent: SiteContent }`, renders Yulong 16/F showroom, coordinates `23.158542, 113.254935`, Apple Maps driving link, Google Maps link, and showroom WebP pictures.
- `CustomOrderProcess` renders 8 steps with 3-stage QC and trust pictures, without breaking existing layout or introducing `prefetch={false}`.

## Code Layout
- `src/app/globals.css`: Global design tokens and utilities (Owned by M1 Worker)
- `src/lib/whatsappRouter.ts`: Sales matrix routing logic (Owned by M2 Worker)
- `src/components/WhatsAppFloating.tsx`: Floating drawer & query sync (Owned by M2 Worker)
- `src/components/home/Hero.tsx`: Hero section & fulfillment badges (Owned by M3 Worker)
- `src/components/home/ShowroomProof.tsx`: Showroom & factory proof (Owned by M4 Worker)
- `src/components/home/CustomOrderProcess.tsx`: 8-step QC flow (Owned by M4 Worker)
- `src/app/page.tsx`: Homepage assembly (Owned by M4 Worker)
- `tests/e2e/`: E2E test files (Owned by M-TEST Test Writer)
