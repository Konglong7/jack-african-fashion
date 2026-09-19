# WhatsApp Analytics Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a conversion-first admin analytics dashboard with lifetime visitors, a daily funnel, seven-day WhatsApp trend, lead rankings, and high-intent activity.

**Architecture:** Extend the existing JSON summary with irreversible lifetime visitor IDs and a tracking start timestamp. Derive visual metrics server-side from the retained event list, use CSS for charts, and preserve UTM attribution in session storage without adding cookies or dependencies.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Vitest, JSON file storage.

## Global Constraints

- Do not add a database, chart package, cookie, or external analytics service.
- Never store a full IP address or fabricate legacy unique visitors.
- Keep `/api/analytics` backward compatible and retain the 30-day/5,000-event limits.
- Display all dashboard timestamps in Beijing time.

---

### Task 1: Lifetime visitor aggregation

**Files:**
- Modify: `src/lib/analyticsStore.ts`
- Test: `src/lib/analyticsStore.test.ts`

**Interfaces:**
- `AnalyticsSummary.knownVisitors: string[]`
- `AnalyticsSummary.statsStartedAt: string`

- [ ] Add failing tests proving legacy identifiable events seed lifetime visitors and a new anonymous ID is counted once.
- [ ] Run `npm test -- src/lib/analyticsStore.test.ts` and confirm the new assertions fail.
- [ ] Normalize the new fields, initialize `statsStartedAt` from the earliest identifiable event, and append unseen visitor IDs when events are recorded.
- [ ] Run the targeted test and confirm it passes.

### Task 2: Session attribution

**Files:**
- Create: `src/lib/analyticsAttribution.ts`
- Create: `src/lib/analyticsAttribution.test.ts`
- Modify: `src/components/Analytics.tsx`

**Interfaces:**
- `resolveAttribution(search: string, stored: string | null): { source: string; campaign: string; serialized: string }`

- [ ] Add failing tests for URL attribution, stored attribution fallback, field limits, and malformed storage.
- [ ] Run the targeted test and confirm the module is missing.
- [ ] Implement the pure resolver and wire `sessionStorage` into local analytics event creation with safe read/write fallbacks.
- [ ] Run attribution and existing integration tests.

### Task 3: Conversion dashboard

**Files:**
- Create: `src/app/admin/AnalyticsDashboard.tsx`
- Modify: `src/app/admin/page.tsx`
- Modify: `src/components/Analytics.test.ts`

**Interfaces:**
- `AnalyticsDashboard({ analytics, products, siteUrl })`

- [ ] Add failing source/integration assertions for lifetime metrics, conversion funnel, seven-day trend, lead sources, top products, and high-intent activity.
- [ ] Run the focused tests and confirm the dashboard assertions fail.
- [ ] Move analytics presentation into `AnalyticsDashboard`, derive all metrics from real summary events, render CSS bars and responsive rows, and collapse the detailed visitor trail.
- [ ] Move product-management cards below analytics so conversion information is the first dashboard content.
- [ ] Run focused tests and type checking.

### Task 4: Verification

- [ ] Run `npm run type-check`, `npm run lint`, `npm test`, and `npm run build`.
- [ ] Open `/admin` with real local data and verify desktop and 390px mobile layouts.
- [ ] Confirm empty analytics data renders zero states without sample records.
- [ ] Confirm no production analytics file is changed by UI verification.
