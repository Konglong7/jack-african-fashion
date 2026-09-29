# JSON Data Snapshot Implementation Plan

> **For agentic workers:** Execute the tasks in order. Do not commit changes unless the user explicitly authorizes Git history mutation.

**Goal:** Provide safe, auditable backup, listing, and explicitly confirmed restore commands for product and site-content JSON files.

**Architecture:** Use a dependency-free Node ESM CLI with three exported functions: `createSnapshot`, `listSnapshots`, and `restoreSnapshot`. Snapshots live under ignored `backups/data/<UTC timestamp>/`, contain only the two supported JSON files when present plus a SHA-256 manifest, and restore validates the complete snapshot before replacing files through temporary files.

**Tech Stack:** Node.js ESM, Node `fs/promises` and `crypto`, Vitest, existing npm scripts.

**Spec:** `docs/superpowers/specs/2026-09-24-data-snapshot-design.md`

## Global Constraints

- Never include `data/analytics.json` in a snapshot or output its fields.
- Restore requires `--confirm` and rejects paths outside the configured backup root.
- Snapshot manifests contain file names, byte sizes, and SHA-256 values only.
- Default repository snapshot location is `backups/data/`, which must be ignored by Git.
- Changes remain uncommitted unless separately authorized.

## Review Focus

- A normal backup must include both supported JSON files when present; covered by the complete snapshot test.
- A restore without `--confirm` must not modify data; covered by the confirmation test.
- A tampered snapshot must fail before modifying targets; covered by the manifest-integrity test.
- A `../` snapshot name must be rejected; covered by the path-boundary test.
- A missing optional `site-content.json` must not make backup fail; covered by the optional-file test.

### Task 1: Add failing snapshot tests

**Files:**
- Create: `scripts/data-snapshot.test.ts`
- Test: `scripts/data-snapshot.test.ts`

**Interfaces:**
- Consumes: `createSnapshot`, `listSnapshots`, and `restoreSnapshot` from `scripts/data-snapshot.mjs`.
- Produces: exact result contracts for the implementation.

- [ ] **Step 1: Write the failing tests**

Use a temporary project root containing `data/products.json` and `data/site-content.json`. Assert that:

```ts
const snapshot = await createSnapshot({ projectRoot, backupRoot, now: new Date('2026-09-24T12:34:56.000Z') });
expect(snapshot.files).toEqual(['products.json', 'site-content.json']);
expect(await readFile(join(snapshot.snapshotDir, 'manifest.json'), 'utf8')).toContain('sha256');
```

Then modify `products.json`, assert `restoreSnapshot({ ..., confirm: false })` rejects and leaves the modified content intact, and assert `confirm: true` restores the snapshot. Add tests for manifest tampering, traversal snapshot names, and the missing optional site-content file.

- [ ] **Step 2: Run the focused test and verify the expected failure**

Run: `npm test -- scripts/data-snapshot.test.ts`

Expected: FAIL because `scripts/data-snapshot.mjs` and its exported functions do not exist yet.

### Task 2: Implement snapshot, listing, restore, and npm commands

**Files:**
- Create: `scripts/data-snapshot.mjs`
- Modify: `package.json`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `{ projectRoot, backupRoot, now? }` for `createSnapshot`; `{ backupRoot }` for `listSnapshots`; `{ projectRoot, backupRoot, snapshotName, confirm }` for `restoreSnapshot`.
- Produces: `createSnapshot` returns `Promise<{ snapshotDir: string, files: string[] }>`; `listSnapshots` returns `Promise<Array<{ name: string, valid: boolean, fileCount: number }>>`; `restoreSnapshot` returns `Promise<{ files: string[] }>`.

- [ ] **Step 1: Implement snapshot creation**

Resolve project and backup roots to absolute paths. Copy only `data/products.json` and `data/site-content.json` when they exist. Create a UTC timestamp directory, compute SHA-256 and byte length for each copied file, and write a manifest containing the timestamp and file metadata. Reject an existing timestamp directory instead of overwriting it.

- [ ] **Step 2: Implement listing and manifest validation**

List direct child directories under `backupRoot`, read each manifest, recompute stored file hashes, and return only the name, validity, and file count. Never print JSON data contents.

- [ ] **Step 3: Implement confirmed restore**

Reject `confirm !== true`, snapshot names containing separators, missing manifests, invalid hashes, unsupported files, or paths outside `backupRoot`. Validate all files before changing targets. Copy each validated snapshot file to a same-directory temporary file and rename it into `data/` only after all validation succeeds.

- [ ] **Step 4: Add command-line entry points and ignore rule**

Support:

```text
node scripts/data-snapshot.mjs backup
node scripts/data-snapshot.mjs list
node scripts/data-snapshot.mjs restore <snapshot-name> --confirm
```

Add these package scripts:

```json
"data:backup": "node scripts/data-snapshot.mjs backup",
"data:list": "node scripts/data-snapshot.mjs list",
"data:restore": "node scripts/data-snapshot.mjs restore"
```

Add `backups/data/` to `.gitignore`.

- [ ] **Step 5: Run focused tests and isolated CLI checks**

Run: `npm test -- scripts/data-snapshot.test.ts`

Expected: all snapshot tests pass.

Run the CLI only against a temporary project root through the exported test helpers; do not run `data:backup` in the repository root, so no real business snapshot is created.

### Task 3: Full regression check for the data slice

- [ ] **Step 1: Run the complete project checks**

Run: `npm test; npm run lint; npm run type-check; npm run build`

Expected: every command exits `0` and no `backups/data` directory appears in the worktree.

- [ ] **Step 2: Inspect the diff for scope and sensitive data**

Run: `git diff -- package.json .gitignore scripts/data-snapshot.mjs scripts/data-snapshot.test.ts` and confirm no analytics contents, passwords, tokens, or generated snapshot files are present.

