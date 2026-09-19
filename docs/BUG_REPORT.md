> 本文档原位于仓库根目录，现归档至 `docs/`。内容为开发期记录，可能早于当前代码实现。

# Bug Report

## Tested Scenarios

- Dependency install: `npm install`
- Dependency audit: `npm audit --json`
- Static checks: `npm run lint`, `npm run type-check`
- Unit tests: `npm test`
- Production build: `npm run build`
- Development runtime: direct `next dev -p 3000`
- Production runtime: `next start -p 3000`
- Security regression: `python test_security.py`
- Browser regression: `python test_full.py`
- Manual HTTP checks: `/`, `/catalog`, `/admin`, `/api/admin/products`

## Found And Fixed

### 1. Admin middleware was not active

- Reproduction: start the app, request `/admin` without cookies.
- Error: before fix, `/admin` returned `200 OK` with Dashboard HTML.
- Root cause: project uses `src/app`, but middleware was at repository root; Next 15.5 did not include it in `.next/server/middleware-manifest.json`.
- Impact: admin pages and admin APIs were not protected.
- Fix: moved `middleware.ts` to `src/middleware.ts`.
- Regression: `test_security.py` checks `/admin` redirects to login and `/api/admin/products` returns 401 when unauthenticated.

### 2. Middleware imported Node-only crypto

- Reproduction: build after moving middleware.
- Error: Next warning: Node module `crypto` is not supported in Edge Runtime.
- Root cause: `src/lib/auth.ts` used Node `createHmac`, `timingSafeEqual`, and `Buffer` while also being imported by middleware.
- Impact: middleware authentication could fail or behave inconsistently in Edge runtime.
- Fix: replaced signing with Web Crypto HMAC-SHA256 and constant-time string comparison.
- Regression: `src/lib/auth.edge.test.ts` prevents Node-only crypto imports in middleware-shared auth code.

### 3. Malformed JSON API bodies threw before validation

- Reproduction: POST malformed JSON to `/api/admin/login` or product endpoints.
- Error: uncaught JSON parsing exception, resulting in server error behavior.
- Root cause: handlers used `await req.json()` directly before validation.
- Impact: bad clients could trigger 500-style failures instead of clear 400 responses.
- Fix: added `readJsonBody()` helper and used it in login, create product, and update product routes.
- Regression: `src/lib/apiRequest.test.ts` and `test_security.py` cover malformed login JSON returning 400.

### 4. Malformed multipart upload bodies could throw

- Reproduction: POST invalid multipart data to upload route.
- Error: `req.formData()` could throw before returning JSON.
- Root cause: upload route parsed form data directly.
- Impact: malformed upload requests could produce uncaught errors.
- Fix: added `readFormDataBody()` and upload storage write error handling.
- Regression: `src/lib/apiRequest.test.ts` covers malformed form data.

### 5. Non-array `products.json` could poison product reads

- Reproduction: make `data/products.json` valid JSON but not an array, e.g. `{"products":[]}`.
- Error: product pages could later call array methods on an object.
- Root cause: `readAll()` cast parsed JSON to `Product[]` without structural validation.
- Impact: corrupted or incorrectly edited data file could crash pages.
- Fix: validate parsed value is an array; otherwise log in development and return an empty list.
- Regression: `src/lib/db.test.ts`.

### 6. Existing browser test script had false failures and false positives

- Reproduction: run `python test_full.py`.
- Error: invalid Playwright regex selector, product card selector did not match actual DOM, login URL was checked before navigation completed, and Next dev HMR made `load/networkidle` flaky.
- Root cause: broad selectors and timing-based waits.
- Impact: UI test could fail when the app worked, or pass while still on the login page.
- Fix: added condition-based waits, stable selectors, explicit URL waits, and test order separation between public and admin flows.
- Regression: final `test_full.py` run passed 8/8 flows.

## Verification Results

- `npm install`: pass
- `npm run lint`: pass
- `npm run type-check`: pass
- `npm test`: pass, 6 files / 14 tests
- `npm run build`: pass, middleware included
- `python test_security.py`: pass
- `python test_full.py`: pass, 8/8 flows
- `next start -p 3000`: pass for `/`, `/admin` redirect, and admin API 401

## Open Risks

- `npm audit` reports 2 moderate vulnerabilities from Next's bundled PostCSS. npm's suggested automatic fix is a major downgrade to Next 9.3.3, so it was not applied.
- Product storage is still a JSON file. Atomic writes and validation reduce risk, but this is not a transactional database.
- Browser tests cover core flows but do not yet perform create/update/delete product mutations against an isolated temporary data file.
- Production login over plain `http://localhost` was not tested because production cookies are `Secure`; this should be tested behind HTTPS or with a deployment preview.

## Recommendations

- Add an isolated test data mode so admin create/update/delete E2E tests can run without touching real `data/products.json`.
- Consider SQLite for local/production persistence if product count or concurrent admin edits grow.
- Track Next/PostCSS advisories and upgrade Next to a patched minor/major when available instead of using `npm audit fix --force`.
- Add CI commands for `npm run lint`, `npm run type-check`, `npm test`, `npm run build`, and `python test_security.py`.
