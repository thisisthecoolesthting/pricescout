# PriceScout — Thrift Store Pricing Scanner

A pricing scanner SaaS for **thrift stores, estate sale operators, yard sale runners, and flea market dealers** — the people pricing the table. Live target: **pricescout.pro**.

## What it does

Point any phone at a donation, garage-sale find, or estate-sale lot. PriceScout takes a photo, identifies the item with a vision LLM, looks up live eBay sold-comps, and tells you the resale price + the right tag price + the buy/skip verdict. Up to **4 scanner installs** per subscription so the whole back room scans together.

## Pricing

| Tier | Price | Devices | Use case |
|---|---|---|---|
| Week Pass | $29 / week | 4 | One-weekend estate sales, yard sales |
| Pro Monthly | $49 / month | 4 | Stores running month-to-month |
| Pro Annual | $490 / year | 4 | Stores running year-round (~17% saving) |
| Founders Lifetime | $699 once | 4 | First 100 customers, lifetime access |
| **+ Scanner add-on** | **$15 / month each** | beyond 4 | Bigger crews |

## Run it locally (web)

```bash
cd apps/thrift-store-scanner
npm install
cp .env.example .env.local   # leave keys blank for mock mode
npm run dev
# http://localhost:3300
```

Mock mode: vision identify and resale comps both return realistic deterministic data — full flow exercisable without API keys.

## Run it locally (mobile)

```bash
cd apps/thrift-store-scanner/mobile
npm install
cp .env.example .env.local   # set EXPO_PUBLIC_API_URL=http://10.0.2.2:3300 for emulator -> host
npm start
# press 'a' for Android, 'i' for iOS in the Metro UI
```

## Deploy

Web is deployed to the Hostinger VPS via PM2 + Caddy (see `cursor-dispatch/outbox/078-pricescout-vps-deploy.prompt.md` for the SSH-as-root deploy block).

Android via EAS: `cd mobile && eas build --platform android --profile production`. iOS coming once Apple Developer account is approved.

## Layout

```
apps/thrift-store-scanner/
├── src/                       # Next.js 15 web app
│   ├── app/
│   │   ├── page.tsx           # marketing home
│   │   ├── pricing/page.tsx   # pricing
│   │   ├── scan/page.tsx      # web scanner
│   │   └── api/
│   │       ├── identify/      # POST image → identify + comp + verdict
│   │       ├── lookup/[upc]/  # GET barcode → identify + comp + verdict
│   │       └── billing/       # Stripe checkout + webhook (stubs)
│   ├── components/
│   │   ├── Header.tsx         # mobile drawer + desktop nav
│   │   ├── Footer.tsx
│   │   ├── PricingTiers.tsx   # 4-tier grid + scanner add-on callout
│   │   ├── FAQ.tsx            # accordion
│   │   ├── Reveal.tsx         # IntersectionObserver wrapper
│   │   ├── Scanner.tsx        # web camera + barcode + manual
│   │   └── PriceVerdict.tsx   # verdict card
│   └── lib/
│       ├── brand.ts           # name, tagline, hero copy
│       ├── identify.ts        # Anthropic / OpenRouter / mock
│       ├── lookup.ts          # mock / eBay / Keepa switch
│       └── score.ts           # buy/skip verdict math
├── mobile/                    # Expo React Native app
│   ├── app/                   # Expo Router (tabs)
│   │   ├── _layout.tsx
│   │   └── (tabs)/
│   │       ├── _layout.tsx    # tab bar (Scan / Flip log / Pricing)
│   │       ├── index.tsx      # Scan
│   │       ├── log.tsx        # Saved scans
│   │       └── pricing.tsx    # Pricing
│   ├── lib/
│   │   ├── brand.ts           # mirrors web brand
│   │   ├── api.ts             # PriceScout API client
│   │   └── storage.ts         # AsyncStorage flip log
│   ├── package.json           # Expo 52, RN 0.76
│   ├── app.json               # bundle id pro.pricescout.app, mint splash, camera permission
│   └── eas.json               # development / preview / production build profiles
├── public/images/             # 3 Leonardo Flux Schnell phone mockups
├── scripts/
│   └── fire_marketing_images.py  # Leonardo image generator
├── package.json
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## EAS Build (Android)

Once Google Play Console + EAS CLI are set up:

```bash
cd mobile
npm install -g eas-cli
eas login
eas init                 # connects to your Expo project
eas build --platform android --profile preview     # APK for internal testing
eas build --platform android --profile production  # AAB for Play Store
eas submit --platform android                      # uploads to Play Console internal track
```

Operator-side checklist before first Play submission:
- Generate app icon (1024×1024 PNG) at `mobile/assets/icon.png`
- Generate adaptive icon foreground (1024×1024 PNG, with 264px padding) at `mobile/assets/icon-foreground.png`
- Generate splash (1284×2778 or similar) at `mobile/assets/splash.png`
- Privacy policy URL (Play Store requires one) — host at `pricescout.pro/privacy`
- Play Console listing: short description (80 char), long description (4000 char), 2 screenshots minimum, content rating questionnaire, target audience age (13+ since no risky content)
- $25 one-time Play Console signup fee

## Status

- Web: source on GitHub at `thisisthecoolesthting/thrift-store-scanner` (latest commit on main). VPS deploy still in flight (dispatch 078).
- Mobile: scaffold complete, scan/log/pricing screens working in mock mode locally. Awaiting EAS init + first preview build.
- Stripe: env-stubbed; tier checkout returns 503 until real Price IDs land. Multi-device add-on metering needs RevenueCat or per-device line item — defer until we have the first 10 paying stores asking for it.
- Comp provider: mock until Keepa or eBay Marketplace Insights wired.
