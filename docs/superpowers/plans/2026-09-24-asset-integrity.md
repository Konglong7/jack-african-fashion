# Asset Integrity Verification Implementation Plan

> **For agentic workers:** Execute the tasks in order. Do not commit changes unless the user explicitly authorizes Git history mutation.

**Goal:** Verify every local product image reference before build while reporting, but not deleting, the unregistered `0921*.png` batch.

**Architecture:** Add a dependency-free ESM verifier with exported pure-ish filesystem functions and a small CLI wrapper. Unit tests use temporary directories; the repository command reads the real product JSON and `public` tree. Missing or unsafe local references fail; external URLs and unregistered batch files are reported separately.

**Tech Stack:** Node.js ESM, Vitest, existing `package.json` scripts, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-24-asset-integrity-design.md`

## Global Constraints

- Do not delete, rename, convert, compress, or register the 56 `0921*.png` files.
- Do not add dependencies.
- Only local paths beginning with `/` are checked against `public`.
- Path traversal and missing local references return a non-zero exit code.
- Changes remain uncommitted unless separately authorized.

## Review Focus

- A missing referenced file must fail with the exact missing path in the report; covered by the missing-reference test.
- An external `https://` image must not be treated as a local missing file; covered by the external-reference test.
- A `../` image path must fail rather than escape `public`; covered by the traversal test.
- An unregistered `0921*.png` must warn but keep exit code zero; covered by the batch-warning test.
- Nested `detailPage.detailSections[].image` and `images[]` fields must be collected; covered by the nested-reference test.

### Task 1: Add failing asset-verifier tests

**Files:**
- Create: `scripts/verify-assets.test.ts`
- Test: `scripts/verify-assets.test.ts`

**Interfaces:**
- Consumes: `verifyAssetManifest(options)` from `scripts/verify-assets.mjs`.
- Produces: the expected result shape `{ referencedCount, missing, invalidLocal, externalCount, unregisteredBatch }` used by the implementation and CLI.

- [ ] **Step 1: Write the failing tests**

Create temporary fixtures with `mkdtemp`, write a small product JSON file, create selected files under a temporary `public/images/products` directory, and assert these cases:

```ts
const result = await verifyAssetManifest({
  publicDir,
  productFile,
});

expect(result.referencedCount).toBe(3);
expect(result.externalCount).toBe(1);
expect(result.missing).toEqual([]);
expect(result.invalidLocal).toEqual([]);
expect(result.unregisteredBatch).toEqual(['0921002.png']);
```

Add separate tests for a missing file, a `../secret.png` traversal reference, and a nested `detailPage.detailSections` image. Import the not-yet-created module so the test fails because the module/function is missing.

- [ ] **Step 2: Run the focused test and verify the expected failure**

Run: `npm test -- scripts/verify-assets.test.ts`

Expected: FAIL because `scripts/verify-assets.mjs` and `verifyAssetManifest` do not exist yet.

### Task 2: Implement the verifier and command-line behavior

**Files:**
- Create: `scripts/verify-assets.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: product JSON path, public directory path, and optional batch filename pattern.
- Produces: `verifyAssetManifest({ publicDir, productFile, batchPattern })` returning `Promise<{ referencedCount: number, missing: string[], invalidLocal: string[], externalCount: number, unregisteredBatch: string[] }>`.

- [ ] **Step 1: Implement the minimal exported verifier**

Implement recursive collection of values under keys `image` and `images`. Count external `http://` and `https://` URLs without resolving them. For local `/...` values, resolve `publicDir` plus the path after the leading slash, reject any resolved path outside `publicDir`, and record missing files. Scan `public/images/products` for `/^0921.*\.png$/i`, compare basenames to local referenced basenames, and record only unreferenced files.

- [ ] **Step 2: Add the CLI and exit policy**

The CLI should read `data/products.json` relative to the repository root, print counts and each problem, exit `1` when `missing` or `invalidLocal` is non-empty, and exit `0` for warnings-only unregistered files. Add this package script:

```json
"verify:assets": "node scripts/verify-assets.mjs"
```

- [ ] **Step 3: Run the focused tests and real repository check**

Run: `npm test -- scripts/verify-assets.test.ts`

Expected: all asset verifier tests pass.

Run: `npm run verify:assets`

Expected: exit `0`, with any unregistered `0921*.png` files listed as warnings and no missing local references.

### Task 3: Full regression check for the asset slice

- [ ] **Step 1: Run the complete project checks**

Run: `npm test; npm run lint; npm run type-check; npm run build`

Expected: every command exits `0`; report the exact failing command if any does not.

- [ ] **Step 2: Inspect the diff and asset hashes**

Run: `git diff -- package.json scripts/verify-assets.mjs scripts/verify-assets.test.ts` and compare SHA-256 hashes for `public/images/products/0921*.png` before and after the slice.

Expected: only the verifier, its test, and the package script are new/changed; image hashes are unchanged.

