---
to: cursor
from: claude (DEv1 cowork)
date: 2026-04-29
priority: P0-CRITICAL
project: pricescout
fleet: pricescout-product
machine: office-pc
working_dir: E:\Projects\pricescout
branch: feat/demo-seed-shop-data
dispatch_id: PRICESCOUT-DEMO-SEED-017
depends_on: [PRICESCOUT-SHOP-LANGUAGE-006, PRICESCOUT-FB-MARKETPLACE-007, PRICESCOUT-ADMIN-STUBS-FILL-015]
blockedBy: []
parallel_safe: false
order: 17
agent: cursor
operator_blocked_on: []
reply: cursor-dispatch/inbox/2026-04-29-017-pricescout-demo-seed.reply.md
tools: ["read_file", "write_file", "edit_block", "bash_command", "git_operation"]
dangerously_allow_bash: true
---

# 017 — Seed shop demo data so /admin looks alive for tomorrow's demo

## Why this matters

Operator is demoing PriceScout to thrift-store buyers tomorrow. After 006 (shop language) + 007 (Marketplace) + 015 (admin stubs filled) ship, the admin shell will be code-complete but **empty**. Walking a buyer through `/admin` showing zero scans, zero crew, zero Marketplace activity makes the product look unused even when it&apos;s working perfectly.

This dispatch ships a demo-tenant seed: a realistic "Greenfield Thrift" tenant with crew, devices, scans across 14 days, FB Marketplace drafts/posts in flight, and a few "Sold" rows for today's standup. Reusable for any future demo, partner pitch, or screenshot session.

## Tasks

### A — `prisma/demo-seed.ts`

Create a SEPARATE seed file (do NOT modify `prisma/seed.ts` — that may already be wired into `prisma migrate dev` and we want the demo seed to be opt-in).

```ts
// prisma/demo-seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding demo tenant: Greenfield Thrift...");

  // Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: "greenfield-thrift" },
    create: {
      name: "Greenfield Thrift",
      slug: "greenfield-thrift",
      subscriptionStatus: "active",
      stripeCustomerId: "cus_demo_greenfield",
      foundersTier: true,
      deviceLimit: 4,
      storeAddress: "412 Magnolia Ave, Winter Park, FL 32789",
      defaultCurrency: "USD",
      tagPriceRounding: "nearest_1",
      defaultScannerRole: "scanner_and_marketplace",
    },
    update: {},
  });

  // Crew (5 users)
  const passwordHash = await bcrypt.hash("demo-password!", 10);
  const crew = [
    { email: "maria@greenfield.shop",   name: "Maria Rodriguez",  role: "owner" },
    { email: "carlos@greenfield.shop",  name: "Carlos Diaz",      role: "admin" },
    { email: "priya@greenfield.shop",   name: "Priya Patel",      role: "scanner" },
    { email: "june@greenfield.shop",    name: "June Whitfield",   role: "scanner" },
    { email: "kenji@greenfield.shop",   name: "Kenji Tanaka",     role: "scanner" },
  ];
  const userRecords = [];
  for (const u of crew) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      create: { ...u, passwordHash, tenantId: tenant.id },
      update: {},
    });
    userRecords.push(user);
  }

  // Devices (4 — at the device limit)
  const devices = [
    { name: "Maria's Pixel 7",   kind: "phone",   installFingerprint: "demo-pix7-maria"  },
    { name: "Carlos's iPhone 14", kind: "phone",   installFingerprint: "demo-iph14-carlos" },
    { name: "Back-room laptop (Chrome)", kind: "browser", installFingerprint: "demo-chrome-backroom" },
    { name: "Counter-top tablet", kind: "browser", installFingerprint: "demo-ipad-counter" },
  ];
  const deviceRecords = [];
  for (const d of devices) {
    const dev = await prisma.device.upsert({
      where: { installFingerprint: d.installFingerprint },
      create: { ...d, tenantId: tenant.id, status: "active", lastSeenAt: new Date() },
      update: { lastSeenAt: new Date() },
    });
    deviceRecords.push(dev);
  }

  // Scans — 80 rows distributed across 14 days, varied items + Marketplace status
  // Use realistic categories the audience handles: Apparel, Books, Home, Electronics, Toys
  const items = [
    { title: "Vintage Wool Cardigan",      category: "Apparel",     median: 22,  range: [18, 28], demand: "high" },
    { title: "Hardcover Cookbook Set (3)", category: "Books",       median: 15,  range: [12, 22], demand: "high" },
    { title: "Brass Mid-Century Lamp",     category: "Home",        median: 48,  range: [38, 64], demand: "high" },
    { title: "Le Creuset 5.5qt Dutch Oven", category: "Home",       median: 145, range: [120, 180], demand: "high" },
    { title: "Pyrex Mixing Bowl Set",      category: "Home",        median: 32,  range: [22, 48], demand: "high" },
    { title: "Levi's 501 Jeans (W34)",     category: "Apparel",     median: 28,  range: [20, 38], demand: "high" },
    { title: "Vintage Polaroid Camera",    category: "Electronics", median: 65,  range: [40, 110], demand: "high" },
    { title: "Wooden Toy Train Set",       category: "Toys",        median: 18,  range: [12, 28], demand: "low" },
    { title: "Coach Leather Handbag",      category: "Apparel",     median: 78,  range: [55, 110], demand: "high" },
    { title: "Antique Wooden Picture Frame", category: "Home",      median: 14,  range: [8, 22],  demand: "low" },
    { title: "Stoneware Dinnerware Set",   category: "Home",        median: 38,  range: [28, 55], demand: "low" },
    { title: "Vintage Vinyl Record Lot",   category: "Other",       median: 42,  range: [30, 70], demand: "low" },
    { title: "Cast Iron Skillet",          category: "Home",        median: 22,  range: [16, 32], demand: "high" },
    { title: "Vintage Denim Jacket",       category: "Apparel",     median: 35,  range: [25, 55], demand: "high" },
    { title: "Hardcover Bird Field Guide", category: "Books",       median: 8,   range: [5, 14],  demand: "low" },
  ];

  const today = new Date();
  const marketplaceStatuses = ["not_yet", "draft", "copied", "posted", "sold"];

  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const scanDay = new Date(today);
    scanDay.setDate(today.getDate() - dayOffset);
    // 4-8 scans per day, more on recent days
    const scansToday = dayOffset === 0 ? 8 : Math.max(3, 8 - Math.floor(dayOffset / 2));
    for (let i = 0; i < scansToday; i++) {
      const item = items[Math.floor(Math.random() * items.length)];
      const user = userRecords[Math.floor(Math.random() * userRecords.length)];
      const device = deviceRecords[Math.floor(Math.random() * deviceRecords.length)];
      const tagPrice = item.median + (Math.floor(Math.random() * 7) - 3); // wobble +/- 3
      // Older scans more likely to have moved through Marketplace lifecycle
      let mpStatus = "not_yet";
      if (dayOffset > 0) {
        const r = Math.random();
        if (r < 0.15) mpStatus = "draft";
        else if (r < 0.4) mpStatus = "copied";
        else if (r < 0.75) mpStatus = "posted";
        else if (r < 0.95) mpStatus = "sold";
      } else {
        // Today: mostly fresh scans, a few drafts
        const r = Math.random();
        if (r < 0.6) mpStatus = "not_yet";
        else if (r < 0.9) mpStatus = "draft";
        else mpStatus = "copied";
      }
      const scannedAt = new Date(scanDay);
      scannedAt.setHours(8 + Math.floor(Math.random() * 10));
      scannedAt.setMinutes(Math.floor(Math.random() * 60));

      await prisma.scan.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          deviceId: device.id,
          identifyTitle: item.title,
          identifyCategory: item.category,
          identifyConfidence: 0.78 + Math.random() * 0.2,
          compMedian: item.median,
          compSampleSize: 8 + Math.floor(Math.random() * 25),
          compSource: Math.random() > 0.5 ? "ebay" : "keepa",
          // post-006 shop-language fields:
          demand: item.demand,
          priceConfidence: 0.7 + Math.random() * 0.3,
          recommendationSuggestedLow: item.range[0],
          recommendationSuggestedMid: item.median,
          recommendationSuggestedHigh: item.range[1],
          tagPriceCents: tagPrice * 100,
          imageUrl: `/images/seed/items/${item.category.toLowerCase()}-${Math.floor(Math.random() * 4) + 1}.jpg`,
          scannedAt,
          // post-007 FB fields:
          fbListingTitle: mpStatus !== "not_yet" ? item.title : null,
          fbListingDescription: mpStatus !== "not_yet" ? `${item.title} in good condition. Available for local pickup at Greenfield Thrift, 412 Magnolia Ave Winter Park.` : null,
          fbListingCategory: mpStatus !== "not_yet" ? item.category : null,
          fbListingPriceCents: mpStatus !== "not_yet" ? tagPrice * 100 : null,
          fbListingStatus: mpStatus,
          fbListingPostedAt: ["posted", "sold"].includes(mpStatus) ? scannedAt : null,
        },
      });
    }
  }

  // Pending invites (1)
  await prisma.invite.upsert({
    where: { token: "demo-invite-token-newscanner" },
    create: {
      tenantId: tenant.id,
      email: "newscanner@greenfield.shop",
      role: "scanner",
      token: "demo-invite-token-newscanner",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sentByUserId: userRecords[0].id,
    },
    update: {},
  });

  console.log(`Demo seed complete:`);
  console.log(`  Tenant: ${tenant.name} (${tenant.slug})`);
  console.log(`  Crew: ${userRecords.length} users`);
  console.log(`  Devices: ${deviceRecords.length}`);
  const scanCount = await prisma.scan.count({ where: { tenantId: tenant.id } });
  console.log(`  Scans: ${scanCount}`);
  console.log(``);
  console.log(`Login as: maria@greenfield.shop / demo-password!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
```

### B — Seed image assets

Drop 20 placeholder item photos under `public/images/seed/items/` — 4 per category (apparel-1.jpg through toys-4.jpg). Use the Leonardo clip first-frames if available (from dispatch 016 Task C extraction), otherwise generate simple solid-color placeholders with the item name overlay using ImageMagick or a small Node script:

```ts
// scripts/generate-seed-thumbs.ts
import { promises as fs } from "fs";
import sharp from "sharp";

const categories = {
  apparel: { color: "#C9A87A", titles: ["Vintage Cardigan", "Levi's Jeans", "Denim Jacket", "Coach Bag"] },
  books:   { color: "#8B6F47", titles: ["Cookbook Set", "Field Guide", "Hardcover Lot", "Vintage Atlas"] },
  home:    { color: "#A87C6F", titles: ["Brass Lamp", "Pyrex Bowls", "Dutch Oven", "Cast Iron Skillet"] },
  electronics: { color: "#5A7C8A", titles: ["Polaroid Camera", "Vinyl Player", "Vintage Radio", "Film Camera"] },
  other:   { color: "#7A8C80", titles: ["Vinyl Lot", "Frame Set", "Misc Lot", "Stoneware Set"] },
  toys:    { color: "#E8B87A", titles: ["Wooden Train", "Plush Set", "Board Games", "Puzzles"] },
};

for (const [cat, { color, titles }] of Object.entries(categories)) {
  for (let i = 0; i < 4; i++) {
    const svg = `<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="800" fill="${color}"/>
      <text x="400" y="380" text-anchor="middle" font-family="system-ui" font-size="40" font-weight="700" fill="#04342C" opacity="0.9">${titles[i]}</text>
      <text x="400" y="440" text-anchor="middle" font-family="system-ui" font-size="22" fill="#04342C" opacity="0.6">${cat}</text>
    </svg>`;
    await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(`public/images/seed/items/${cat}-${i + 1}.jpg`);
  }
}
console.log("Seed thumbs generated");
```

Run: `npx tsx scripts/generate-seed-thumbs.ts` (install tsx + sharp if missing).

### C — Wire `package.json`

Add a script:

```json
"scripts": {
  // ... existing
  "demo-seed": "tsx prisma/demo-seed.ts"
}
```

So operator can run `npm run demo-seed` to seed any environment (dev, VPS production, future staging).

### D — Run the seed on the VPS

After build + restart, run on VPS via SSH:

```bash
cd /var/www/pricescout
NODE_ENV=production npx tsx prisma/demo-seed.ts
```

Verify counts match expected output (1 tenant, 5 users, 4 devices, ~75-90 scans depending on randomness, 1 invite).

### E — Update `/admin` dashboard tile values

Once seeded, `/admin` should show realistic numbers for the demo:

- Today&apos;s pricings: 6-8 (matches `dayOffset === 0` count)
- Drafted listings: ~12 (sum of `mpStatus="draft"` across 14 days)
- Posted to FB: ~25 (sum of `mpStatus="posted"`)
- Sold this week: ~8-10 (sum of `mpStatus="sold"` last 7 days)

Verify these surface correctly on `/admin` — if dispatch 015 Task G ("Tag list dashboard tile") shipped, the tile reads from these fields. If not, defer; the existing `/admin` page that 008 left in place will still show populated tables.

### F — Reusable demo reset

Add `scripts/demo-reset.ts` — wipes the demo tenant cleanly so operator can re-seed before each demo:

```ts
// scripts/demo-reset.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const tenant = await prisma.tenant.findUnique({ where: { slug: "greenfield-thrift" } });
if (tenant) {
  await prisma.scan.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.device.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.invite.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.user.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.wpbsGrant.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.tenant.delete({ where: { id: tenant.id } });
  console.log("Demo tenant wiped");
} else {
  console.log("No demo tenant found");
}
prisma.$disconnect();
```

Add to `package.json`: `"demo-reset": "tsx scripts/demo-reset.ts"`.

## Done-when

- [ ] `prisma/demo-seed.ts` runs cleanly on dev DB and VPS production DB
- [ ] 20 seed item thumbnails exist in `public/images/seed/items/`
- [ ] `npm run demo-seed` works
- [ ] `npm run demo-reset` works
- [ ] `/admin/scans` shows ~80 rows with realistic items + tag prices + Marketplace status mix
- [ ] `/admin/devices` shows the 4 devices (2 phones, 2 browsers)
- [ ] `/admin/team` shows the 5 crew members + 1 pending invite
- [ ] Login flow works: `maria@greenfield.shop` / `demo-password!` lands at `/admin`
- [ ] Reply documents the demo login credentials and the reset/re-seed workflow
- [ ] `npm run typecheck && npm run test && npm run build` green
- [ ] git mv outbox→done + proof JSON `build/proof/PRICESCOUT-DEMO-SEED-017.json`

## Out of scope

- Multi-tenant demo (just Greenfield for now)
- Real photos of the seed items (placeholder thumbnails are fine)
- Realistic FB Marketplace listing photos (we use the same placeholder thumbs)
- Anonymizing the demo data (it's intentionally fictional — no PII concerns)
- Auto-running the seed on every deploy (operator runs manually before each demo)
