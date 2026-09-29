# CI Production Security Smoke Implementation Plan

> **For agentic workers:** Execute this plan after the asset and data slices. Do not commit changes unless the user explicitly authorizes Git history mutation.

**Goal:** Make CI start the built Next.js app with temporary production credentials and run the existing security regression checks against an isolated local port.

**Architecture:** Keep the existing verify job and append asset verification before build plus one Bash step after build. The step exports ephemeral values in-process, starts `next start` on `127.0.0.1:3100`, waits with `curl`, runs `tests/e2e/test_security.py`, prints the server log on startup failure, and always kills the child process.

**Tech Stack:** GitHub Actions, Ubuntu Bash, Node/Next.js, Python standard library, existing security smoke script.

**Spec:** `docs/superpowers/specs/2026-09-24-ci-security-smoke-design.md`

## Global Constraints

- Never use production credentials, GitHub secrets, or a real URL.
- Do not add browser dependencies or full Playwright execution in this slice.
- Use port `3100` and `127.0.0.1` for the temporary server.
- Keep the existing lint, type-check, unit-test, build, and Python syntax steps.
- Changes remain uncommitted unless separately authorized.

## Review Focus

- The server must be ready before the Python test runs; covered by the bounded curl loop.
- A startup failure must expose the Next.js log and fail the job; covered by the shell branch.
- A Python assertion failure must preserve its non-zero status while still cleaning the process; covered by `trap` and saved status.
- The production auth secret must meet the application minimum without appearing as a tracked literal; covered by in-step generated secret.
- The CI step must not leave a background process on success or failure; covered by the cleanup trap.

### Task 1: Add asset verification to the existing CI pipeline

**Files:**
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: the `verify:assets` npm script produced by the asset-integrity plan.
- Produces: a CI failure when a tracked product image reference is missing or unsafe, while allowing the current unregistered batch warning.

- [ ] **Step 1: Add the pre-build asset step**

Insert immediately before the existing `Build` step:

```yaml
      - name: Product asset integrity
        run: npm run verify:assets
```

- [ ] **Step 2: Run the local equivalent**

Run: `npm run verify:assets`

Expected: exit `0` with a report, confirming the CI command resolves to the checked-in script.

### Task 2: Add isolated production security smoke

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Add the post-build Bash step**

Append after the existing build step and before E2E syntax checking:

```yaml
      - name: Production security smoke
        shell: bash
        run: |
          set -euo pipefail
          export NODE_ENV=production
          export NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3100
          export BASE_URL=http://127.0.0.1:3100
          export PORT=3100
          export ADMIN_USERNAME=ci-admin
          export ADMIN_PASSWORD=ci-only
          export ADMIN_SECRET="$(printf 'x%.0s' {1..40})"
          log_file="$RUNNER_TEMP/jack-next.log"
          server_pid=''
          cleanup() {
            local status=$?
            if [[ -n "$server_pid" ]] && kill -0 "$server_pid" 2>/dev/null; then
              kill "$server_pid" 2>/dev/null || true
              wait "$server_pid" 2>/dev/null || true
            fi
            if [[ "$status" -ne 0 ]] && [[ -f "$log_file" ]]; then
              cat "$log_file"
            fi
            exit "$status"
          }
          trap cleanup EXIT
          npm run start -- --hostname 127.0.0.1 --port 3100 >"$log_file" 2>&1 &
          server_pid=$!
          for attempt in {1..30}; do
            if curl --fail --silent --show-error http://127.0.0.1:3100/ >/dev/null; then
              break
            fi
            if [[ "$attempt" -eq 30 ]]; then
              echo "Next.js did not become ready on port 3100" >&2
              exit 1
            fi
            sleep 1
          done
          python3 tests/e2e/test_security.py
```

The generated secret is created inside the step and is not stored in YAML as a credential-like literal.

- [ ] **Step 2: Validate the same flow locally**

Build first with `npm run build`, then in one PowerShell session set equivalent temporary variables, start `npm run start -- --hostname 127.0.0.1 --port 3100`, wait for `http://127.0.0.1:3100/`, and run `python tests/e2e/test_security.py`. Stop only the process started for this check.

### Task 3: Final CI and repository verification

- [ ] **Step 1: Validate workflow text and credential scan behavior**

Run: `git diff --check`; inspect `.github/workflows/ci.yml`; run the repository’s existing config-sanity shell logic in a temporary shell if GitHub Actions is unavailable.

Expected: no whitespace errors, no real credentials, no production URL, and no removal of existing checks.

- [ ] **Step 2: Run the complete local verification suite**

Run: `npm test; npm run lint; npm run type-check; npm run build`

Expected: every command exits `0`; report CI-only behavior separately if GitHub Actions itself cannot be executed locally.

