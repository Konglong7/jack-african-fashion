> 本文档原位于仓库根目录，现归档至 `docs/`。内容为开发期记录，可能早于当前代码实现。

# Test Plan

## Project And Safe Local Run Mode

- Stack: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, Vitest, ESLint.
- Data store: local JSON file at `data/products.json`; no live database is configured.
- Auth: local env variables `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SECRET`; admin session is an HttpOnly cookie.
- External services: WhatsApp links only. No real payment, SMS, email, or production database calls should be made during testing.
- Safe local mode: run with `.env.local` or `.env.example` values, use local ports only, and back up `data/products.json` before mutation tests.

## Command Matrix

| Area | Command | Expected Result |
| --- | --- | --- |
| Dependency install | `npm install` | Installs from `package-lock.json` without production credentials. |
| Lint | `npm run lint` | No blocking errors; warnings documented. |
| Type check | `npm run type-check` | TypeScript exits 0. |
| Unit tests | `npm test` | Vitest exits 0. |
| Production build | `npm run build` | Next build exits 0 and does not require production-only services. |
| Dev server | `npm run dev -- --port <free-port>` | App serves home, catalog, product detail, admin login. |
| Production server | `npm run start -- --port <free-port>` after build | App serves production build locally. |

## Scenario Matrix

| Category | Scenarios |
| --- | --- |
| Startup and config | Missing `.env.local`; missing admin variables in development; production env with missing `ADMIN_*`; short `ADMIN_SECRET`; port 3000 occupied; Chinese path in workspace. |
| Public pages | Home load; catalog load; search/filter/sort; empty search result; product detail for valid slug; product detail for invalid slug; refresh/back navigation. |
| Admin auth | Valid login; invalid login; malformed JSON login body; missing username/password; repeated failures trigger rate limit; expired/tampered token; unauthenticated admin page redirect; unauthenticated API 401; logout clears session. |
| Product API | GET list; POST valid product; POST invalid category; POST duplicate slug; POST empty body; POST malformed JSON; PUT valid update; PUT missing ID; DELETE missing ID; repeated deletes; concurrent creates. |
| Product data | Empty `products.json`; invalid JSON; non-array JSON; duplicate product IDs; non-numeric IDs; missing optional fields; missing required fields; very long strings; Unicode and Chinese text; invalid color hex; negative/zero MOQ. |
| File and upload | No files; empty file; oversized file; MIME/extension mismatch; fake image content; valid JPG/PNG/WebP; filename sanitization; slug with spaces/Unicode/special chars; upload dir missing; write permission denied; duplicate rapid uploads. |
| Frontend admin UX | Product list refresh failure; delete API failure; double-click delete; rapid save; failed save response; network failure during upload/save; modal close; tab switching preserves input; long text in fields. |
| Network and third party | WhatsApp link generation; external link does not block page; simulated fetch failures in admin components. |
| Recovery and logging | JSON write failure reports API error; corrupted JSON does not crash public pages; server restarts after failed write; logs contain actionable errors without leaking secrets. |
| Build and runtime | Static/ISR pages build; dynamic admin API routes work after build; production server uses secure cookie setting under `NODE_ENV=production`. |

## Initial High-Risk Focus

1. API request parsing failures: `req.json()` and `req.formData()` can throw before validation.
2. Local JSON data integrity: invalid or non-array content can turn into runtime crashes later.
3. Admin product UX: refresh/delete requests lack explicit error handling.
4. Upload write path: filesystem failures should return friendly JSON instead of uncaught 500s.
5. Production build/runtime: auth env requirements and Next dynamic API behavior must be verified.

## Bug Record Template

For every confirmed issue:

- Reproduction steps:
- Error output:
- Root cause:
- Impact:
- Fix:
- Regression test:
- Verification command:
