---
to: cursor
from: claude (DEv1 cowork)
date: 2026-04-29
priority: P0-CRITICAL
project: pricescout
fleet: pricescout-product
machine: office-pc
working_dir: E:\Projects\pricescout
branch: feat/wpbs-and-admin-app-download
dispatch_id: PRICESCOUT-WPBS-AND-APP-DOWNLOAD-008
depends_on: [PRICESCOUT-DUAL-SURFACE-COPY-002]
blockedBy: []
parallel_safe: true
order: 8
agent: cursor
operator_blocked_on:
  - "Once Android APK production build lands (dispatch 131 / EAS Mobile) drop the latest signed APK at E:\\Projects\\pricescout\\public\\downloads\\pricescout-android-latest.apk and SHA256 it"
wpbs_meaning: "Winter Park Benefit Shop — a thrift-store nonprofit partner. Visible button label stays exactly 'WPBS' (operator wants the letters only on-page). Internal code comments + admin reports + the email subject line MAY expand to 'Winter Park Benefit Shop' for clarity. Public copy never expands the acronym."
reply: cursor-dispatch/inbox/2026-04-29-008-pricescout-wpbs.reply.md
tools: ["read_file", "write_file", "edit_block", "bash_command", "git_operation"]
dangerously_allow_bash: true
---

Read **`docs/SOLUTIONSTORE_SAAS_SPINE.md`** §10 (auth + billing logic) and §16 (copy conventions) before acting. The WPBS bypass coexists alongside the standard Stripe-checkout path in dispatch 003 — do not delete or short-circuit Stripe checkout.

# 008 — WPBS bypass button on homepage + Android app download in admin shell

## Two parallel scopes

This dispatch ships two unrelated-but-bundled features. They&apos;re bundled because they&apos;re both small, both touch `/admin`, and both unblock the operator&apos;s "use it tomorrow" demo path.

### Scope A — WPBS bypass button

**WPBS = Winter Park Benefit Shop** (a thrift-store nonprofit partner). Operator wants a button labeled exactly **"WPBS"** on the homepage — **the letters only, no expansion anywhere visible to the public**. It bypasses the Stripe checkout flow and grants the user an account directly. **Place it LOW on the page** — not in the hero, not in the main CTA stack. Footer-adjacent or just above the final CTA banner.

The full name "Winter Park Benefit Shop" MAY appear in:
- Code comments (for future Cursor sessions to understand context)
- The Resend email&apos;s subject line and body (where the WPBS user receives their access link — they know who they are)
- `/admin/team` superuser panel labels (operator-facing only)
- The Tenant.name default fallback when the user doesn&apos;t supply a name (set to "Winter Park Benefit Shop" rather than the email prefix)

The full name MUST NOT appear in:
- Any text rendered on `/`, `/pricing`, `/about`, `/scan`, or any other public page
- `<meta>` tags, OG tags, JSON-LD
- Any tooltip on the WPBS button itself (tooltip stays "Partner access" or omitted entirely)

Mechanics:
1. User clicks "WPBS" → opens a small modal asking for **email** (and optional name)
2. POST `/api/auth/wpbs-grant` with `{ email, name }`
3. Server-side: creates a Tenant + User row, sets `subscriptionStatus="WPBS"` (custom non-Stripe status), `foundersTier=false`, `deviceLimit=4`. Generates a magic-link login token, emails it via Resend (if `RESEND_API_KEY` is set) OR returns it inline if not. The user lands at `/admin` with full Pro-tier access.
4. The Tenant row has `wpbsGrantedAt: DateTime` and `wpbsExpiresAt: DateTime` (default 30 days from grant — operator-extendable from `/admin/team`).
5. Bypass is **rate-limited** to 5 per IP per day to prevent farm abuse. Track via simple Postgres counter on `WpbsGrant` model or via Redis if available.

The button placement on `/` should be:
- A small footer-zone strip with: "Already with WPBS? [Open your account](#)" rendered as a subtle link/button
- OR a separate small section just above the dark final CTA labeled something like "Beta access?" with the WPBS button inside
- Avoid making it look like a primary purchase path — it&apos;s an alternate entry for known partners

**WPBS-specific UI language:** the button itself just says "WPBS." Tooltip on hover stays minimal ("Partner access") or is omitted. The Tenant row created by the bypass should default `name = "Winter Park Benefit Shop"` if the user submits the form without a custom name. The Tenant `slug` should be `wpbs-<8-char-uuid>` (already specified in Task B&apos;s schema). The email Resend sends should have subject `"Your Winter Park Benefit Shop / PriceScout access"` so the recipient recognizes it.

### Scope B — Android app download in admin shell

The admin shell should let a logged-in user download the Android app for sideloading or reading the Play Store URL.

In `/admin/devices/page.tsx` (or `/admin/page.tsx` as a tile), add a section/tile titled **"Get the mobile app"** with:

- **Android — direct download:** big button "Download Android APK" → links to `/downloads/pricescout-android-latest.apk` (file lives at `public/downloads/pricescout-android-latest.apk`; populated by dispatch 131 EAS build)
- **Android — Play Store:** smaller text link "Or install via Google Play" → links to `https://play.google.com/store/apps/details?id=pro.pricescout.app` (the package ID — verify against `mobile/app.json` for the actual `android.package`)
- **iOS:** subtle text "iPhone app — coming soon, awaiting App Store approval"
- **QR code:** generate a QR code at runtime that encodes the APK URL (or Play Store URL once published) — scannable from the operator&apos;s phone for quick install
- **Version + SHA256:** read `public/downloads/pricescout-android-latest.json` (a small manifest containing `{ version, sha256, sizeBytes, releasedAt }`) and display: "Version 1.0.3 · 24.7 MB · Released 2026-04-28"

Until dispatch 131 lands the actual APK, this section gracefully degrades:
- Show "APK in build — internal beta available soon" with a link to the EAS internal-track Play Console URL (operator-supplied)
- The QR generator + Play Store link still work

## Tasks

### A — Schema additions

`prisma/schema.prisma`:

```prisma
model Tenant {
  // ... existing
  wpbsGrantedAt    DateTime?
  wpbsExpiresAt    DateTime?
  wpbsSourceIp     String?
}

model WpbsGrant {
  id          String   @id @default(cuid())
  email       String
  ip          String
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  @@index([ip, createdAt])
}
```

Migration: `npx prisma migrate dev --name wpbs_bypass_fields`.

### B — `/api/auth/wpbs-grant` route

```ts
// POST { email, name? } -> { magicLinkUrl, tenantId } | { error }
import { prisma } from "@/lib/prisma";
import { createMagicLink } from "@/lib/auth";  // existing helper from 095
import { sendEmail } from "@/lib/email";  // wraps Resend

export async function POST(req: Request) {
  const { email, name } = await req.json();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "0.0.0.0";

  // Rate limit: 5 grants per IP per 24h
  const recent = await prisma.wpbsGrant.count({
    where: { ip, createdAt: { gte: new Date(Date.now() - 24*60*60*1000) } }
  });
  if (recent >= 5) {
    return Response.json({ error: "Too many grants from this network. Try again tomorrow." }, { status: 429 });
  }

  // Create Tenant + User + magic link
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);  // 30 days
  const tenant = await prisma.tenant.create({
    data: {
      name: name ?? "Winter Park Benefit Shop",  // default to the partner&apos;s full org name
      slug: `wpbs-${crypto.randomUUID().slice(0, 8)}`,
      subscriptionStatus: "WPBS",
      deviceLimit: 4,
      wpbsGrantedAt: new Date(),
      wpbsExpiresAt: expiresAt,
      wpbsSourceIp: ip,
      users: {
        create: {
          email,
          name: name ?? email.split("@")[0],
          passwordHash: "",  // magic-link only; no password set
          role: "owner",
        }
      }
    },
    include: { users: true }
  });

  await prisma.wpbsGrant.create({
    data: { email, ip, tenantId: tenant.id }
  });

  const magicLink = await createMagicLink(tenant.users[0].id);

  if (process.env.RESEND_API_KEY) {
    await sendEmail({
      to: email,
      subject: "Your Winter Park Benefit Shop / PriceScout access",
      body: `Click to access your account (link valid 24 hours): ${magicLink}\n\nYour 30-day Pro access expires ${expiresAt.toDateString()}.\n\n— PriceScout, on behalf of WPBS`
    });
    return Response.json({ ok: true, sent: true });
  }
  // Dev / no email configured: return inline
  return Response.json({ ok: true, sent: false, magicLinkUrl: magicLink, tenantId: tenant.id });
}
```

### C — WPBS modal component

`src/components/marketing/WpbsButton.tsx` — client component:
- Renders a button labeled exactly "WPBS"
- Click opens a slide-over (or modal — use the same primitive as the FB Marketplace slide-over from 007 if it exists, else a basic Dialog)
- Form: `email` (required, email-validated), `name` (optional)
- Submit → POST `/api/auth/wpbs-grant`
- On success with `sent: true`: show "Check your email for the access link"
- On success with `sent: false` (dev / no email): show the magic link inline + "Click to enter your account"
- On 429: surface the rate-limit message politely

### D — Place WPBS on `/`

In `src/app/page.tsx`, just above the final dark CTA section, add a small subtle strip:

```tsx
<section className="py-10 border-t border-line/30 bg-cream/40">
  <div className="container-pricescout flex flex-wrap items-center justify-between gap-4">
    <p className="text-sm text-soft">Coming from a partner program?</p>
    <WpbsButton />
  </div>
</section>
```

Trust strip + final CTA stay unchanged. Do NOT add WPBS to nav, hero, or any pricing CTAs — it&apos;s a low-key alternate entry, not a primary path.

### E — Admin app download tile/section

Create `src/components/admin/MobileAppCard.tsx`:

```tsx
"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";  // npm i qrcode (lightweight, ~30KB)

export function MobileAppCard() {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [manifest, setManifest] = useState<{ version: string; sha256: string; sizeBytes: number; releasedAt: string } | null>(null);

  useEffect(() => {
    const apkUrl = `${window.location.origin}/downloads/pricescout-android-latest.apk`;
    QRCode.toDataURL(apkUrl, { width: 200 }).then(setQrDataUrl);
    fetch("/downloads/pricescout-android-latest.json").then(r => r.ok ? r.json() : null).then(setManifest);
  }, []);

  return (
    <section className="card p-6">
      <h2 className="font-display text-xl font-semibold">Get the mobile app</h2>
      <p className="mt-1 text-sm text-muted">Install on your crew&apos;s phones — counts toward your 4 included installs per device.</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto] items-center">
        <div className="space-y-3">
          <a href="/downloads/pricescout-android-latest.apk" className="btn-primary btn-large">Download Android APK</a>
          <p className="text-xs text-soft">Or install via <a href="https://play.google.com/store/apps/details?id=pro.pricescout.app" className="underline">Google Play</a></p>
          <p className="text-xs text-soft italic">iPhone app — awaiting App Store approval</p>
          {manifest && (
            <p className="text-xs text-soft">Version {manifest.version} · {(manifest.sizeBytes / 1024 / 1024).toFixed(1)} MB · Released {new Date(manifest.releasedAt).toLocaleDateString()}</p>
          )}
        </div>
        {qrDataUrl && (
          <div className="text-center">
            <img src={qrDataUrl} alt="Scan to install" className="rounded-lg border border-line" />
            <p className="mt-2 text-xs text-soft">Scan with your phone</p>
          </div>
        )}
      </div>
    </section>
  );
}
```

Mount it on:
- `/admin/devices/page.tsx` (top of page, before the device list)
- `/admin/page.tsx` (as a dashboard tile alongside the existing tiles)

### F — Placeholder APK manifest

Until 131 ships the real APK, create `public/downloads/pricescout-android-latest.json` with placeholder data:

```json
{
  "version": "0.0.0-dev",
  "sha256": "pending",
  "sizeBytes": 0,
  "releasedAt": "2026-04-29T00:00:00.000Z",
  "note": "Placeholder. Real APK ships from dispatch 131 (EAS Mobile production build)."
}
```

Don&apos;t commit a fake APK file. The download link will 404 until 131 lands a real one — that&apos;s OK; the tile shows "internal beta available soon" if `manifest.version === "0.0.0-dev"`.

### G — Admin team page extension (operator manages WPBS grants)

In `/admin/team/page.tsx`, add a small panel "WPBS grants in this org":
- Lists Tenants in WPBS status with grant date + expiry
- Operator (logged in as superuser, separate concept — defer to existing role gating) can extend or revoke

Out of scope if `/admin/team` doesn&apos;t already have a multi-tenant superuser view — skip and note in reply.

### H — Spine compliance

- Slide-over component must follow §8 mobile drawer rules (sibling-mounted)
- Trust strips, pills, padding tokens — §7 only, no ad-hoc Tailwind
- Button copy: "WPBS" exactly; modal CTA "Get my access link" (NOT "Submit," NOT "Sign me up")

## Done-when

- [ ] Prisma schema migration `wpbs_bypass_fields` applied
- [ ] `/api/auth/wpbs-grant` works end-to-end with rate limit + email/inline fallback
- [ ] `<WpbsButton>` mounted on `/` between trust section and final CTA, low-key style
- [ ] Modal/slide-over collects email, posts, surfaces success/error states
- [ ] `<MobileAppCard>` mounted on `/admin/devices` AND `/admin` dashboard
- [ ] QR code generates client-side from APK URL
- [ ] Manifest at `public/downloads/pricescout-android-latest.json` exists with placeholder
- [ ] Graceful degradation when manifest version is "0.0.0-dev" (shows "internal beta soon")
- [ ] `/admin/team` WPBS-grants panel (or skipped + noted in reply if superuser context isn&apos;t set up)
- [ ] `npm run typecheck && npm run test && npm run build` green
- [ ] Visual diff screenshots: `/` (with new WPBS strip), `/admin/devices` (with mobile card), modal flow, QR rendering
- [ ] git mv outbox→done + proof JSON `build/proof/PRICESCOUT-WPBS-AND-APP-DOWNLOAD-008.json`

## Out of scope

- Real APK upload (131)
- iOS App Store integration (Apple Dev approval pending)
- Multi-tenant superuser admin (separate dispatch if needed)
- WPBS partner-portal page (this is just the entry button — partner backend is a separate dispatch)
- Stripe customer-portal integration (003 ships that)
- Anything that touches `/api/billing/*` — WPBS is intentionally Stripe-free
