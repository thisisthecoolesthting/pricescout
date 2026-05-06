---
to: codex
from: claude (DEv1 cowork)
date: 2026-04-29
priority: P1-HIGH
project: pricescout
fleet: pricescout-product
machine: office-pc
working_dir: E:\Projects\pricescout
branch: feat/admin-reports-dashboard
dispatch_id: PRICESCOUT-ADMIN-REPORTS-021
depends_on: [PRICESCOUT-DEMO-SEED-017, PRICESCOUT-FB-MARKETPLACE-007, PRICESCOUT-SHOP-LANGUAGE-006]
blockedBy: []
parallel_safe: true
order: 21
agent: codex
operator_blocked_on: []
reply: cursor-dispatch/inbox/2026-04-29-021-pricescout-admin-reports.reply.md
tools: ["read_file", "write_file", "edit_block", "bash_command", "git_operation"]
dangerously_allow_bash: true
---

Read **`docs/SOLUTIONSTORE_SAAS_SPINE.md`** §6 (page recipe) before acting.

# 021 — `/admin/reports` weekly insights dashboard

## Why for Codex

Chart-heavy + Prisma-aggregation work. Mechanical, parallel-safe, no design judgment beyond following the spine&apos;s visual tokens. Closes the demo&apos;s "here&apos;s the value" loop — buyers ask "show me what I&apos;d see after a week" and Maria&apos;s seeded shop has the answer.

## Tasks

### A — `/admin/reports/page.tsx` route

Server-side page that pulls aggregations from Prisma and hands them to a client `<ReportsClient>` component for the chart rendering.

Aggregations needed (group by tenantId from session):

```ts
// Server-side queries — all scoped to current tenant
const sevenDaysAgo  = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000);
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

// 1. Time-series: scans/day for last 30 days (count grouped by date)
const dailyScans = await prisma.$queryRaw`
  SELECT DATE("scannedAt") as day, COUNT(*)::int as count
  FROM "Scan"
  WHERE "tenantId" = ${tenantId} AND "scannedAt" > ${thirtyDaysAgo}
  GROUP BY DATE("scannedAt") ORDER BY day ASC
`;

// 2. Marketplace status breakdown (current — not historical)
const statusBreakdown = await prisma.scan.groupBy({
  by: ["fbListingStatus"],
  where: { tenantId, scannedAt: { gte: thirtyDaysAgo } },
  _count: true,
});

// 3. Category breakdown
const categoryBreakdown = await prisma.scan.groupBy({
  by: ["identifyCategory"],
  where: { tenantId, scannedAt: { gte: thirtyDaysAgo } },
  _count: true,
  _avg: { tagPriceCents: true },
});

// 4. Crew leaderboard (top 5 by scan count last 7 days)
const crewLeaderboard = await prisma.scan.groupBy({
  by: ["userId"],
  where: { tenantId, scannedAt: { gte: sevenDaysAgo } },
  _count: true,
  orderBy: { _count: { userId: "desc" } },
  take: 5,
});
// Hydrate user names
const userIds = crewLeaderboard.map(r => r.userId);
const users = await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } });

// 5. Conversion funnel — counts at each Marketplace stage in last 30 days
// not_yet → draft → copied → posted → sold
const funnel = ["not_yet", "draft", "copied", "posted", "sold"].map(s =>
  statusBreakdown.find(r => r.fbListingStatus === s)?._count ?? 0
);

// 6. Slow movers — drafts older than 14 days that never posted
const slowMovers = await prisma.scan.findMany({
  where: {
    tenantId,
    fbListingStatus: { in: ["draft", "copied"] },
    scannedAt: { lt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
  },
  select: { id: true, identifyTitle: true, tagPriceCents: true, scannedAt: true, fbListingStatus: true },
  orderBy: { scannedAt: "asc" },
  take: 10,
});

// 7. Average days from scan → sold (only for items that sold)
const sold = await prisma.scan.findMany({
  where: { tenantId, fbListingStatus: "sold", fbListingPostedAt: { not: null } },
  select: { scannedAt: true, fbListingPostedAt: true },
});
const avgDaysToSell = sold.length > 0
  ? sold.reduce((acc, r) => acc + (r.fbListingPostedAt!.getTime() - r.scannedAt.getTime()) / (1000 * 60 * 60 * 24), 0) / sold.length
  : null;
```

### B — `<ReportsClient>` client component (charts)

Use **Recharts** (already in package.json from PriceScout&apos;s React stack — verify: `npm ls recharts`; install if missing). Render:

1. **Top KPI band (4 tiles):**
   - Items priced (last 7 days)
   - Posted to Marketplace (last 7 days)
   - Sold (last 7 days)
   - Avg days from scan → sold (or "Not enough data" if null)

2. **Time-series line chart** — daily scans for last 30 days. Mint-500 line on cream background, grid lines subtle, x-axis labeled by date (every 5 days), y-axis labeled "scans/day."

3. **Funnel chart** — Marketplace conversion (5 bars: Not yet / Draft / Copied / Posted / Sold). Use horizontal bars with mint gradient. Show count + percentage of total at each stage.

4. **Category breakdown** — horizontal stacked bar (or pie, your call) of last-30-day scans by category, with avg tag price annotation.

5. **Crew leaderboard table** — name, scans this week, items posted, items sold (sub-queries per user). Sortable.

6. **Slow movers list** — top 10 drafted-but-not-posted items older than 14 days. Each row has the item title, tag price, days since scan, and a "Mark as posted" / "Discard" action button stub (post action TBD in a follow-up).

### C — Date range picker (defaulting to last 30 days)

Top-right of `/admin/reports` — a small select with options: `Last 7 days · Last 30 days · Last 90 days · This year`. Selection re-runs the page with `?range=N` query param. Server reads the param and adjusts queries.

Don&apos;t over-engineer this — preset ranges only, no custom date picker. Keep it tight.

### D — Export buttons

Two buttons at the top of the page:

- **Export CSV** — generates a CSV of every scan in the date range. Server route `/api/admin/reports/export?range=N&format=csv` returns a `text/csv` blob with `Content-Disposition: attachment`.
- **Export PDF** — uses Puppeteer or `html-pdf-node` to render the entire reports page as a PDF (single page, landscape). Same `/api/admin/reports/export?format=pdf`. If the dependency adds significant weight, defer to a future dispatch and just hide the button.

### E — Add to admin nav

Edit `src/app/admin/layout.tsx` (or wherever the admin sidebar lives) — add "Reports" between "Scans" and "Devices."

### F — Caching / perf

The aggregations for last 30 days run on every page load. For tomorrow&apos;s demo this is fine (small dataset, ~80 rows). For production, add a 2-minute cache on the server-side queries via `unstable_cache` or an in-memory Map keyed by tenantId.

```ts
import { unstable_cache } from "next/cache";

export const getReportData = unstable_cache(
  async (tenantId: string, days: number) => { /* ... queries ... */ },
  ["admin-reports"],
  { revalidate: 120 }
);
```

### G — Spine compliance

- Use spine §7 palette only (mint-500 `#11CB9D`, ink `#04342C`, accent `#0C5A8A`, cream backgrounds)
- Card padding/spacing tokens — no ad-hoc margins
- All charts use the mint gradient — no rainbow colors
- Loading state: skeleton tiles + "Crunching numbers..." line for charts
- Empty state (no scans yet): friendly message + CTA to `/scan` instead of empty charts

## Spine references

- §6 — admin pages don&apos;t use the marketing six-section recipe; just stay consistent with the existing `/admin`, `/admin/scans`, `/admin/devices` styling
- §7 — charts use mint as the primary color, accent blue (`#0C5A8A`) for secondary, no rainbow

## Done-when

- [ ] `/admin/reports` route renders all 6 sections (KPIs + 3 charts + leaderboard + slow-movers)
- [ ] Date range picker with 4 presets works
- [ ] CSV export works (PDF deferred is OK — document in reply)
- [ ] Cache layer wraps the heavy queries (2-min revalidate)
- [ ] Admin sidebar has "Reports" link
- [ ] Empty state + loading state both render correctly
- [ ] Visual diff screenshots in reply: `/admin/reports` desktop + mobile
- [ ] `npm run typecheck && npm run test && npm run build` green
- [ ] git mv outbox→done + proof JSON `build/proof/PRICESCOUT-ADMIN-REPORTS-021.json`

## Out of scope

- Custom date range picker (presets only)
- Multi-tenant comparison reports (single tenant only — superuser feature for later)
- PDF export if it adds >5MB to the bundle (CSV is enough for demo; defer PDF)
- Email-the-report scheduling (a future "Weekly digest email" dispatch)
- Real-time updates (polling or SSE)
- Drilldown from a chart segment to the underlying scan list (link to `/admin/scans?filter=...` is fine)
