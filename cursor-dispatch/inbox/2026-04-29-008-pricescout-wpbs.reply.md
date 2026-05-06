# Reply — PRICESCOUT-WPBS-AND-APP-DOWNLOAD-008

## Shipped

- **Prisma:** `Tenant.wpbsGrantedAt`, `wpbsExpiresAt`, `wpbsSourceIp`; new `WpbsGrant` model + migration `20260506120000_wpbs_bypass_fields`.
- **API:** `POST /api/auth/wpbs-grant` (Zod email, 5/IP/24h, 409 on duplicate email, tenant `subscriptionStatus: WPBS`, magic link); `GET /api/auth/magic-login?token=` sets `ps_session` → `/admin`.
- **Email:** `src/lib/email.ts` (Resend). If `RESEND_API_KEY` set, sends subject **Your Winter Park Benefit Shop / PriceScout access**; on send failure returns inline `magicLinkUrl` like dev.
- **Marketing:** `WpbsButton` on `/` in low-key strip above final CTA; button label exactly **WPBS**; `title="Partner access"`; modal CTA **Get my access link**.
- **Admin:** `MobileAppCard` on `/admin` and `/admin/devices` — Play Store link, placeholder APK state when manifest `0.0.0-dev`, QR targets Play Store until real APK exists.
- **Manifest:** `public/downloads/pricescout-android-latest.json` placeholder.
- **Team:** Banner when `subscriptionStatus === "WPBS"` with grant/expiry; notes superuser cross-tenant tools not in this shell.

## Operator

- Run **`npx prisma migrate deploy`** against production DB after merge.
- Configure **Resend** (`RESEND_API_KEY`, optional `RESEND_FROM`).
- **131:** APK + manifest update (see proof JSON).

## Visual diff

Not attached; verify `/` partner strip, WPBS slide-over, `/admin/devices` mobile card + QR.

## Proof

`build/proof/PRICESCOUT-WPBS-AND-APP-DOWNLOAD-008.json`
