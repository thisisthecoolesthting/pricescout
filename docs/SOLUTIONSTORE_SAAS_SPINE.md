================================================================================
SOLUTIONSTORE SAAS PAGE DESIGN — THE SHIFTDECK SPINE
The reusable template for every SaaS site sold at solutionstore.com
================================================================================
Version 1.0  |  2026-04-29  |  Source of truth: shiftdeck.tech / E:\Projects\Time clock

This file describes the marketing-site pattern proven on ShiftDeck. Every new
SaaS we ship through solutionstore should clone this spine, swap brand tokens
+ copy + product screenshots, and ship in a few hours rather than a few weeks.

--------------------------------------------------------------------------------
TABLE OF CONTENTS
--------------------------------------------------------------------------------
  1. Stack
  2. Repo + monorepo layout
  3. Visual tokens (colors, fonts, spacing, radius, motion)
  4. The 6-section page recipe
  5. Routes — every page that ships
  6. Component library
  7. Header + footer (the chrome)
  8. Mobile rules (the gotchas we already solved)
  9. Form pattern + visible-error UX
 10. Auth + Stripe billing logic
 11. Database schema (Prisma)
 12. DB seed pattern — DO THIS BEFORE SCREENSHOTS
 13. Asset pipeline — Playwright screenshots + walkthrough video
 14. Image swap pattern (Leonardo placeholders -> real screenshots)
 15. Deploy pattern (VPS + Caddy + pm2)
 16. CTA + copy conventions
 17. SEO + metadata
 18. Things to never do (lessons learned)
 19. Per-tenant brand swap to spawn a new SaaS

--------------------------------------------------------------------------------
1. STACK
--------------------------------------------------------------------------------
- Next.js 15.x  (App Router, async server components, route groups)
- React 19, TypeScript strict
- Tailwind CSS 3.x with custom sd- prefix tokens (no @apply spaghetti)
- Prisma 6.x  ->  PostgreSQL 17  (one DB per tenant or per-row tenantId)
- Stripe 15.x SDK (live + test mode toggle via env)
- bcryptjs for password hashing
- Caddy reverse proxy + Let's Encrypt TLS
- pm2 (cluster or fork; Next runs fine in fork)
- Hostinger or DO VPS (Ubuntu 22)

Why this stack: every piece runs on a $12/mo VPS, has zero vendor lock-in, and
the LLM tooling around it is mature. Every site we ship should look identical
under the hood so we can rotate AI agents across them without re-learning.

--------------------------------------------------------------------------------
2. REPO + MONOREPO LAYOUT
--------------------------------------------------------------------------------
On disk the SaaS lives inside the dev1 monorepo (or its own repo if exported):

  apps/<saas-slug>/
    ├── apps/
    │   ├── web/                         # the Next.js marketing + admin app
    │   │   ├── src/
    │   │   │   ├── app/
    │   │   │   │   ├── (marketing)/     # route group — public pages
    │   │   │   │   │   ├── page.tsx                  # /
    │   │   │   │   │   ├── pricing/
    │   │   │   │   │   ├── features/
    │   │   │   │   │   │   ├── page.tsx              # /features
    │   │   │   │   │   │   └── [slug]/page.tsx       # /features/<slug>
    │   │   │   │   │   ├── industries/[slug]/page.tsx
    │   │   │   │   │   ├── compare/[slug]/page.tsx
    │   │   │   │   │   ├── resources/guides/[slug]/page.tsx
    │   │   │   │   │   ├── support/[slug]/page.tsx
    │   │   │   │   │   ├── how-it-works/page.tsx
    │   │   │   │   │   ├── about/page.tsx
    │   │   │   │   │   ├── contact/page.tsx
    │   │   │   │   │   ├── watch/page.tsx            # 1-min walkthrough
    │   │   │   │   │   ├── trial/page.tsx            # signup form
    │   │   │   │   │   ├── faq/page.tsx
    │   │   │   │   │   ├── security/page.tsx
    │   │   │   │   │   ├── legal/{privacy,terms}/page.tsx
    │   │   │   │   │   └── blog/[slug]/page.tsx
    │   │   │   │   ├── (auth)/login + forgot-password
    │   │   │   │   ├── admin/                        # the actual product
    │   │   │   │   ├── api/                          # route handlers
    │   │   │   │   └── layout.tsx                    # global root
    │   │   │   ├── components/
    │   │   │   │   ├── marketing/                    # Section, Card, Header, Footer
    │   │   │   │   └── ui/                           # shadcn-style primitives
    │   │   │   ├── content/                          # static page data (TS)
    │   │   │   │   ├── feature-pages.ts
    │   │   │   │   ├── industry-pages.ts
    │   │   │   │   ├── compare-pages.ts
    │   │   │   │   └── faq-hub.ts
    │   │   │   ├── lib/
    │   │   │   │   ├── urls.ts                       # canonical url helpers
    │   │   │   │   ├── site-url.ts                   # base URL + canonical
    │   │   │   │   └── stripe.ts
    │   │   │   └── server/                           # server-only modules
    │   │   ├── public/
    │   │   │   ├── images/site/
    │   │   │   │   ├── screens/                      # real product shots
    │   │   │   │   ├── features/<slug>-hero.jpg
    │   │   │   │   ├── industries/<slug>-hero.jpg
    │   │   │   │   └── _leonardo_backup/             # placeholder fallback
    │   │   │   └── videos/
    │   │   │       ├── walkthrough.webm              # 1-min product tour
    │   │   │       └── broll/*.mp4                   # hero loops
    │   │   └── prisma/
    │   │       └── schema.prisma
    │   └── mobile/                                   # if shipping native (Expo)
    └── ...

Every SaaS uses the SAME directory layout. AI agents looking for "the pricing
page" can always go straight to apps/web/src/app/(marketing)/pricing/page.tsx.

--------------------------------------------------------------------------------
3. VISUAL TOKENS — COLORS, FONTS, SPACING, RADIUS, MOTION
--------------------------------------------------------------------------------

# COLORS (the spine — three brand colors plus neutrals)

  Primary teal       #0F6E56     hero gradient start, eyebrow accents
  Primary blue       #0C5A8A     hero gradient end
  Dark teal          #04342C     final-CTA section, video frame bg
  CTA orange         #C44E0B     ALL primary call-to-action buttons
  Eyebrow / accent   #9FE1CB     small uppercase labels above h1
  Body on dark       #E1F5EE     paragraph text inside teal hero
  Sub-accent         #5DCAA5     pricing line under final CTA

  Hero gradient (literal):
    background: linear-gradient(103deg, #0F6E56 0%, #0C5A8A 100%);

  These are the ONLY brand colors. When cloning the spine for a new SaaS,
  rename them in src/app/globals.css and pick a new primary + accent — that's
  the fastest way to make a site feel different. Keep the orange CTA orange-
  ish unless the brand demands otherwise; it converts.

  Tailwind tokens (custom in tailwind.config.ts):
    sd-primary:   #04342C      (text on white background, headings)
    sd-text:      #1F2937      (body text)
    sd-muted:     #6B7280      (helper text)
    sd-info:      #0C5A8A      (in-text link color)
    sd-accent:    #0F6E56      (secondary text on white)

# TYPOGRAPHY

  Font stack:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
  (no Google Fonts — stays fast, no FOUT, no privacy nonsense)

  Headings:
    h1   text-4xl md:text-5xl font-bold leading-tight tracking-tight   color white on hero, sd-primary on white
    h2   text-2xl md:text-3xl font-semibold tracking-tight
    h3   text-lg font-semibold

  Eyebrow above h1:
    color #9FE1CB on hero (or #0F6E56 on white)
    fontSize 13, fontWeight 500, letterSpacing 0.04em
    margin 0 0 12px
    text content ALL-UPPERCASE, e.g. "FEATURE DEEP DIVE"

  Body:
    text-base md:text-lg, line-height 1.55, max-width 540px
    color #E1F5EE on hero, sd-muted on white

# SPACING

  Section padding: 72px 0   (the major rhythmic unit)
  Card padding:    24px (Card default) or 32px on large
  Button padding:  12px 22px
  Page max-width:  max-w-6xl  for hero,  max-w-3xl for final CTA, max-w-5xl for /watch

# BORDER RADIUS

  Buttons:        6px              (tight — clockshark-style, not rounded-pill)
  Cards:          rounded-2xl (16px)
  Image frames:   rounded-2xl
  Captions/pills: rounded-full

# SHADOWS

  Cards on hover: shadow-md
  Hero image:     shadow-2xl on /watch video; none on hero photo
  Modal/drawer:   shadow-2xl, ring-1 ring-black/5

# MOTION

  All transitions: 0.2s-0.25s ease
  Caption fade:    opacity transition 0.25s ease
  Button hover:    background brighten via opacity:0.9 (not a darken)
  Don't use Framer Motion for marketing — pure CSS keeps the bundle small.

--------------------------------------------------------------------------------
4. THE 6-SECTION PAGE RECIPE
--------------------------------------------------------------------------------
Every dynamic page (features, industries, compare, support article) follows
the SAME six sections in this order. This is the spine.

  1. TEAL HERO
     - bg: linear-gradient(103deg, #0F6E56 0%, #0C5A8A 100%)
     - color white, padding 72px 0
     - eyebrow (e.g. "FEATURE DEEP DIVE") in #9FE1CB
     - h1
     - subhead body
     - trust strip: "14-day free trial · No credit card · 5-minute setup"
     - 2 buttons: orange #C44E0B "Start 14-day free trial" + ghost "Watch 1-min demo"
     - hero image (16:10 aspect, real product screenshot, rounded-2xl)

  2. PROBLEM + WHO IT'S FOR
     - 2-column grid of Card components on white
     - Card 1: "Problem it solves" — 1 paragraph
     - Card 2: "Who it's for" — 1 paragraph

  3. CAPABILITIES + HOW IT WORKS
     - 2-column grid on white
     - Left: bullet list of capabilities
     - Right: numbered list of how-it-works steps
     - Both lists are short — 5 bullets, 5 steps

  4. FAQ
     - <FaqAccordion items={...} />
     - 5-7 questions, owner-operator-language answers
     - max-w-3xl, h2 left-aligned

  5. RELATED LINKS
     - 2-column: "Related features" + "Related industries"
     - Followed by a strip of 5 in-text underlined links to pricing/faq/demo/support

  6. DARK TEAL FINAL CTA
     - bg #04342C, color white, padding 72px 0, max-w-3xl, text-center
     - h2: "Put <feature> to work this week"
     - subhead: "Set up in five minutes, see results on Friday's payroll."
     - 2 buttons: orange Start trial + ghost Watch demo
     - pricing line in #9FE1CB, fontSize 13

The home page (/) extends this with: customer-logos strip, video block,
testimonial cards, pricing teaser, integration logo grid. Pricing page
collapses to: hero + 3 pricing cards + FAQ + final CTA.

--------------------------------------------------------------------------------
5. ROUTES — EVERY PAGE THAT SHIPS
--------------------------------------------------------------------------------
Public (marketing):

  /                           home
  /pricing                    3 tiers + comparison + FAQ
  /features                   hub linking to all feature deep-dives
  /features/<slug>            ~15-20 dynamic feature pages
  /industries                 hub
  /industries/<slug>          ~6-8 dynamic industry pages (construction, restaurants, ...)
  /how-it-works               narrative walkthrough
  /compare                    hub of competitor compares
  /compare/<slug>             vs Competitor pages
  /resources                  hub
  /resources/guides/<slug>    long-form guides (SEO bait)
  /resources/product-updates  changelog
  /support                    hub
  /support/<slug>             help articles
  /faq                        cross-cutting FAQ
  /security                   trust page
  /about                      mission + team + investors
  /contact                    one form
  /watch                      1-minute product walkthrough (this is the demo)
  /trial                      signup form + visible error banner
  /blog/<slug>                content marketing
  /legal/privacy + /legal/terms

Auth:

  /login
  /forgot-password

Product (admin shell — gated):

  /admin                      dashboard
  /admin/live                 live attendance
  /admin/schedule             drag-drop schedule
  /admin/timesheets           punch list + approval
  /admin/jobs                 jobs list + cost
  /admin/team                 employee roster
  /admin/reports              payroll exports
  /admin/kiosk                kiosk PIN preview
  /admin/requests             PTO + swap requests
  /admin/settings/*           company / brand / imports / integrations / users

API route handlers:

  /api/auth/login + /api/auth/logout + /api/auth/forgot
  /api/trial                  signup -> Stripe customer + bcrypt + cookie
  /api/billing/*              Stripe webhook + portal session
  /api/kiosk/punch            QR/PIN punch endpoint
  /api/admin/*                product endpoints (CSRF + session-gated)

Removed: /demo and /book-demo. Replaced site-wide with /watch (1-min video)
and /trial (signup). Lesson from ShiftDeck: separating "watch" from "try"
beats a sales-call demo for SMB SaaS — let people self-serve.

--------------------------------------------------------------------------------
6. COMPONENT LIBRARY
--------------------------------------------------------------------------------
src/components/marketing/:

  Section            wraps content with consistent vertical rhythm + max-width
  Card               white surface, rounded-2xl, p-6 lg:p-8, shadow-md on hover
  FaqAccordion       items: { q, a }[] — auto open/close, schema.org JSON-LD
  RelatedBlock       title + links[] — used in section 5
  CtaBanner          orange button + ghost button row
  MarketingHeader    sticky, z-40, mobile drawer (see section 7)
  MarketingFooter    columns: Product / Company / Resources / Legal / Social
  TrustStrip         "14-day · No credit card · 5-min setup" — used in heroes

src/components/ui/ (shadcn-style):

  Button             variants: primary (orange), secondary (ghost), link
  Input + Textarea   field + label + error
  Dialog             modal
  Toast              react-hot-toast wrapper

NEVER pass `style` to Card — use min-h-[220px] Tailwind class instead. The
Card component intentionally rejects style props (we tripped this build
break twice on ShiftDeck).

--------------------------------------------------------------------------------
7. HEADER + FOOTER (THE CHROME)
--------------------------------------------------------------------------------
HEADER (marketing-header.tsx):

  - sticky top-0, backdrop-blur, border-b, z-40
  - desktop layout (md+): logo left, nav center, [Login] [Start free trial] right
  - mobile layout: 3-col grid — hamburger / centered logo / compact "Try it"
  - mobile drawer:
      * MUST be hoisted OUT of <header> as a sibling element (escapes the
        sticky+backdrop-blur stacking context)
      * z-[60] overlay, z-[70] drawer panel
      * body scroll-lock while drawer open (overflow:hidden on <html>)
      * drawer width 320px, slides from left
      * close on overlay click, Escape key, or any link click
  - nav items (typical): Features, Industries, Pricing, Compare, Resources
    (no "Demo" — replaced by inline /watch link)

FOOTER (marketing-footer.tsx):

  - bg #04342C, color white, padding 56px 0
  - 4 columns:
      Product:   Features hub, Pricing, How it works, Watch, Security
      Company:   About, Contact, Careers, Press
      Resources: Guides, Product updates, Support, FAQ, Blog
      Legal:     Privacy, Terms, Cookies, Acceptable use
  - bottom strip: brand mark + copyright + social icons

--------------------------------------------------------------------------------
8. MOBILE RULES (THE GOTCHAS WE ALREADY SOLVED)
--------------------------------------------------------------------------------
- Header on mobile uses a 3-col grid so the hamburger doesn't yank the page
  left. Don't use flex justify-between with a wide CTA pill on the right —
  the column shifts when the CTA wraps.

- Drawer must not be a child of <header>. Sticky + backdrop-blur creates a
  new stacking context; any z-index inside it is trapped below position:fixed
  siblings of the header. Hoist the drawer to a top-level <aside>.

- All <video> tags MUST have autoPlay muted playsInline together — Safari
  iOS otherwise refuses to autoplay. Always provide a poster image so the
  first frame on slow networks is the real product, not a black square.

- Never use rounded-full on small buttons under 36px tall — looks like a
  pill on desktop but like a sticker on mobile. Use rounded-md or 6px.

- Tap targets minimum 44x44 px. Audit every <a> in mobile nav.

- font-size 16px minimum on input fields to prevent iOS zoom-in.

--------------------------------------------------------------------------------
9. FORM PATTERN + VISIBLE-ERROR UX
--------------------------------------------------------------------------------
Every form uses the SAME pattern:

  1. Server component reads searchParams: { error?: string }
  2. errorMessages map turns error code -> human sentence
  3. If errorMsg, render a red banner ABOVE the form:

       <div role="alert" className="mb-4 rounded-2xl border-2 px-4 py-3 text-sm"
            style={{ background: "#FEF2F2", borderColor: "#FECACA",
                     color: "#991B1B" }}>
         <strong className="font-semibold">Couldn&apos;t create your account.</strong>{" "}
         {errorMsg}
       </div>

  4. Form action is a server route (POST -> redirect with ?error= or ?ok=)
  5. NEVER use silent redirect-on-failure without an error banner — we hit
     this exact bug on ShiftDeck /trial. The page reloaded and the user had
     no idea what went wrong.

Error codes (canonical):

  invalid   — field validation (length, format, missing) — show specifics
  exists    — duplicate email — suggest /login
  server    — anything else — apologize, give support email

In Next 15, searchParams is a Promise — await it before reading.

--------------------------------------------------------------------------------
10. AUTH + STRIPE BILLING LOGIC
--------------------------------------------------------------------------------
- bcryptjs hashSync(password, 10) on signup. Cost 10 not 12 — the VPS is
  small and 12 makes /login take 600ms.
- Cookie: sd_session, httpOnly, secure, sameSite lax, 30-day max-age.
- Session payload: { userId, tenantId, role, exp }, signed with HS256.
- middleware.ts gates /admin/* — redirects to /login?next=<path>.

- Stripe SDK 15.x. Three live-mode prices created via API at deploy time:
    PRICE_MONTHLY_ID    $X/mo
    PRICE_YEARLY_ID     $Y/yr   (~17% off the monthly run-rate)
    PRICE_FOUNDER_ID    $Z one-time, capped at 100 customers (metadata gate)
- /api/trial creates Stripe Customer, then PaymentIntent or Subscription
  depending on tier choice. 14-day trial => no card up front.
- Webhook: /api/billing/webhook updates User.subscriptionStatus.
- Founder cap enforced in app code by reading
  `stripe.subscriptions.list({ price: PRICE_FOUNDER_ID }).length < 100`.

--------------------------------------------------------------------------------
11. DATABASE SCHEMA (PRISMA)
--------------------------------------------------------------------------------
Minimum tables every SaaS gets. Adapt domain tables (TimePunch is shift-deck
specific) to whatever the SaaS does:

  Tenant {
    id String @id @default(cuid())
    name String
    slug String @unique
    stripeCustomerId String?
    subscriptionStatus String?     // active | trialing | past_due | canceled
    foundersTier Boolean @default(false)
    createdAt DateTime @default(now())
  }

  User {
    id String @id @default(cuid())
    email String @unique
    name String
    passwordHash String
    role String          // OWNER | ADMIN | EMPLOYEE
    tenantId String
    tenant Tenant @relation(fields: [tenantId], references: [id])
    pinHash String?      // for kiosk-style apps
    avatarUrl String?
    createdAt DateTime @default(now())
  }

  Session {
    id String @id @default(cuid())
    userId String
    expiresAt DateTime
    user User @relation(fields: [userId], references: [id])
  }

  // Domain tables — example from ShiftDeck:
  Job, Shift, TimePunch, BreakLog, PtoRequest, AuditLog

Always include createdAt + updatedAt on every table. tenantId on EVERY
domain row — never query without filtering by tenant.

--------------------------------------------------------------------------------
12. DB SEED PATTERN — DO THIS BEFORE SCREENSHOTS
--------------------------------------------------------------------------------
This is the lesson we learned the hard way on ShiftDeck. The marketing
screenshots and the walkthrough video both look uninhabited if the admin
shell is empty.

Every new SaaS spawn must, BEFORE any Playwright screenshot run:

  1. Seed an admin user (the one Playwright logs in as)
  2. Seed 5+ realistic non-admin entities — for ShiftDeck it's 5 employees;
     for an inventory SaaS it's 25 SKUs; for a CRM it's 30 contacts.
     Names should be diverse (Maria Rodriguez, Marcus Johnson, Sarah Chen,
     David Park, Jamal Williams) — NOT "Test User 1, Test User 2".
  3. Seed at least a week of activity so time-series views show curves:
     - For ShiftDeck: 5-7 days of TimePunch rows, mix of regular/OT/breaks
     - Generic: anything that gives the dashboard's main chart real data

  Provide a script: scripts/seed_demo_data.ts that's idempotent (UPSERT
  on email/slug). Include profile photos so /admin/team isn't gray circles.

  After seeding, Playwright runs see real data and the screenshots have
  curves and names. If you skip this, the marketing site will advertise
  blank dashboards and your conversion rate will tank.

--------------------------------------------------------------------------------
13. ASSET PIPELINE — PLAYWRIGHT SCREENSHOTS + WALKTHROUGH VIDEO
--------------------------------------------------------------------------------
Two scripts live in a sibling temp folder (so they don't pollute the repo's
node_modules with playwright + chromium):

  C:\Users\reasn\AppData\Local\Temp\pw-runner\
    package.json          # { "dependencies": { "playwright": "^1.59.1" } }
    admin-shots.cjs       # captures 11 admin views as .jpg
    walkthrough.cjs       # records a 1-min .webm with caption overlays

# admin-shots.cjs (high-level)
- chromium.launch headless, viewport 1440x900, deviceScaleFactor 2
- POST to /login with SD_ADMIN_EMAIL + SD_ADMIN_PASSWORD env vars
- waitForURL /admin
- For each TARGET (10 admin URLs): goto, sleep 1500, screenshot type:jpeg q:86
- Output: <repo>/apps/web/public/images/site/screens/<slug>.jpg

# walkthrough.cjs (high-level)
- Same launch, viewport 1280x720, deviceScaleFactor 1
- recordVideo: { dir: <repo>/apps/web/public/videos/, size: 1280x720 }
- Tour 8 sections: login, dashboard, live, schedule, timesheets, jobs,
  reports, pricing CTA. Each section ~7-10s.
- Inject a fixed-position caption overlay via page.evaluate at each step.
  Caption styling: bg rgba(4,52,44,0.92), color white, fontSize 22,
  border-radius 10, padding 14px 28px, bottom 36, max-width 78%, z-index
  2147483647 (max int — beats every product z-index).
- After last sleep, page.close + context.close + browser.close
- Rename newest .webm in OUT_DIR to walkthrough.webm

# Why no audio
- We tried OpenAI tts-1 + ffmpeg mux. Skipped because:
    * adds ffmpeg as a dep (70 MB binary)
    * synced audio with screen recordings is brittle
    * muted autoplay is the dominant browser behavior anyway
    * captions baked into frames are clearer for hard-of-hearing users
- The .webm plays directly in <video> — no transcode to mp4 needed.

# Caption overlay snippet (use verbatim)

  async function showCaption(page, text) {
    await page.evaluate((txt) => {
      let el = document.getElementById("__sd_caption__");
      if (!el) {
        el = document.createElement("div");
        el.id = "__sd_caption__";
        el.style.cssText = [
          "position:fixed", "bottom:36px", "left:50%",
          "transform:translateX(-50%)",
          "background:rgba(4,52,44,0.92)", "color:#FFFFFF",
          "padding:14px 28px", "border-radius:10px",
          "font:600 22px/1.3 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          "letter-spacing:-0.01em",
          "max-width:78%", "text-align:center",
          "z-index:2147483647",
          "box-shadow:0 12px 36px rgba(0,0,0,0.35)",
          "border:1px solid rgba(159,225,203,0.45)",
          "transition:opacity 0.25s ease",
          "pointer-events:none",
        ].join(";");
        document.body.appendChild(el);
      }
      el.textContent = txt;
      el.style.opacity = "1";
    }, text);
  }

--------------------------------------------------------------------------------
14. IMAGE SWAP PATTERN (LEONARDO PLACEHOLDERS -> REAL SCREENSHOTS)
--------------------------------------------------------------------------------
Every new SaaS starts with Leonardo Flux Schnell-generated hero images
(~0.4 credits each, 3s each, looks fine but obviously not the product).
Once Playwright has real screenshots:

  1. Mkdir <public>/images/site/_leonardo_backup/
  2. For each hero image referenced in (marketing) pages, copy the original
     into _leonardo_backup/ with a flattened name (features_gps-hero.jpg)
  3. Copy the matching real screenshot from /screens/ over the original
     filename — no code changes needed because <Image src="..."/> just
     reads the same path.

Reference script: build/proof/_swap_leonardo_for_real.py — keep it as a
template. The SWAPS dict is the single point of intent:

  SWAPS = {
    "features/time-tracking-hero.jpg": "admin-live.jpg",
    "features/scheduling-hero.jpg":    "admin-schedule.jpg",
    ...
  }

This pattern means Leonardo placeholders ALWAYS exist as a fallback, and
swapping back is a one-liner if a screenshot regresses (e.g. the product
broke a UI before the next capture).

--------------------------------------------------------------------------------
15. DEPLOY PATTERN (VPS + CADDY + PM2)
--------------------------------------------------------------------------------
Every SaaS deploys to /var/www/<slug> on the dev1 VPS. Caddy reverse-
proxies <slug>.tld to the local pm2 process.

# Caddy block (in /etc/caddy/Caddyfile):

  shiftdeck.tech {
    reverse_proxy localhost:3001     # each SaaS picks a free 3000+ port
    encode zstd gzip
  }

# pm2 ecosystem block (per-saas):

  {
    name: "shiftdeck",
    script: "./apps/web/server.js",   # or `npm start --workspace web`
    cwd: "/var/www/shiftdeck",
    env: { PORT: 3001, NODE_ENV: "production" },
    instances: 1,
    exec_mode: "fork",
  }

# Deploy command (encode this in build/proof/_ship_<task>.bat for every
# significant change):

  ssh root@<vps> "
    cd /var/www/<slug> &&
    git fetch origin main && git reset --hard origin/main &&
    cd apps/web && npm run build &&
    cd ../.. &&
    sudo pm2 stop <slug> && sudo pm2 start <slug> --update-env"

# CRITICAL: Always pm2 stop + pm2 start --update-env — never pm2 reload.
# Reload doesn't pick up the new .next directory and you'll serve a 502.
# This bit us 3 times on ShiftDeck before we wrote it down.

--------------------------------------------------------------------------------
16. CTA + COPY CONVENTIONS
--------------------------------------------------------------------------------
- Every section that asks the reader to do anything ends with a CTA.
- Primary CTA is ALWAYS:
    text: "Start 14-day free trial"
    href: urls.trial
    bg:   #C44E0B  color: white  border-radius: 6  padding: 12px 22px
- Secondary CTA is ALWAYS one of:
    "Watch 1-min demo"  href: /watch  (transparent w/ #9FE1CB border)
    "See pricing"       href: /pricing
- "Book a demo" / "Schedule a call" are FORBIDDEN. We are not running a
  sales-call SaaS. Self-serve only.
- Trust strip under hero CTA: "14-day free trial · No credit card · 5-minute setup"
- Pricing line under final CTA: "$<m>/mo · $<y>/yr · $<f> Founders Lifetime (100 spots)"

# Voice
- Owner-operator language. Not "leverage synergies" but "your Friday
  afternoon back."
- Never say "stub", "MVP", "WIP", "coming soon", "roadmap" on a marketing
  page. If a feature isn't ready, hide it. The site advertises shipped
  product, not promises.
- Never say "platform", "solution", "world-class". Say what it does.
- Apostrophes: use &apos; in JSX strings — Next.js's no-unescaped-entities
  rule will fail the build otherwise. We hit this six times on ShiftDeck.

--------------------------------------------------------------------------------
17. SEO + METADATA
--------------------------------------------------------------------------------
- Every page exports `metadata` (or `generateMetadata` for dynamic routes).
- Title format: "<page-specific> — <Brand>"
- Description: 1 sentence, includes the primary keyword, ends with a verb.
- og:image: 1200x630, generated via opengraph-image.tsx in each route folder.
- robots.txt: allow all, sitemap at /sitemap.xml
- sitemap.xml generated by app/sitemap.ts (Next 15 native).
- Every dynamic page emits BreadcrumbList JSON-LD (see ShiftDeck
  features/[slug] for the FeatureBreadcrumbJsonLd helper).
- /faq emits FAQPage JSON-LD via the FaqAccordion component.

--------------------------------------------------------------------------------
18. THINGS TO NEVER DO (LESSONS LEARNED)
--------------------------------------------------------------------------------
- Never pass `style` to Card. Use min-h-[N] etc. Tailwind classes.
- Never use raw apostrophes in JSX strings — &apos; or rewrite to "is" / "are".
- Never silent-redirect on form failure. Always render a visible error banner.
- Never put the mobile drawer inside <header>. Stacking-context trap.
- Never `pm2 reload` after a Next build. Always stop + start --update-env.
- Never run Playwright screenshots before the DB has realistic seed data.
- Never ship Leonardo placeholders to prod without _leonardo_backup/ copies
  saved in the repo first — you'll lose the only consistent fallback.
- Never `git reset --hard origin/main` without `git status -s` first to
  confirm there's nothing uncommitted to lose. We clobbered ~1100 lines
  on ShiftDeck this way (commit 9a5cbf8 — reverted in 5023c24).
- Never use `find . -delete` or `rm -rf` from a script without a guard.
- Never store a GitHub token inside the repo, even gitignored — write to
  %TEMP% outside the repo entirely.
- Never use `gpt-5` for anything that needs all completion tokens to land
  as visible text. It eats the budget on hidden reasoning. gpt-4o is safer
  for drafting copy at length.
- Never write the next AI a paste-prompt. Drop a numbered .prompt.md in
  cursor-dispatch/outbox/ and push — the watcher picks it up.

--------------------------------------------------------------------------------
19. PER-TENANT BRAND SWAP TO SPAWN A NEW SAAS
--------------------------------------------------------------------------------
The cheapest way to start a new SaaS at solutionstore.com is to clone the
ShiftDeck spine and swap brand tokens. Concretely:

  1. cp -r apps/shiftdeck apps/<new-slug>
  2. Find/replace literal "ShiftDeck" -> "<NewBrand>" across apps/<new-slug>
  3. Edit src/app/globals.css — replace the 5 brand colors
  4. Edit src/lib/site-url.ts — set canonical domain
  5. Edit src/components/marketing/MarketingFooter.tsx — swap logo + social
  6. Replace public/favicon.ico + public/og-default.png + brand mark SVG
  7. Edit src/content/feature-pages.ts — rewrite to the new product's features
  8. Edit src/content/industry-pages.ts — different verticals if relevant
  9. Edit prisma/schema.prisma — swap domain tables
 10. Run: pnpm install && pnpm prisma migrate dev && pnpm seed
 11. Run admin-shots.cjs + walkthrough.cjs against the new local
 12. Swap Leonardo placeholders with the new screenshots
 13. Set up Caddy + pm2 + DNS
 14. Push to GitHub, deploy via _ship_<slug>.bat

After step 14 you have a fully-deployed marketing site + admin shell + 1-min
walkthrough video. The product code (the actual /admin/* features) is the
only thing that should differ between SaaS clones.

A new solutionstore SaaS should be ship-ready in <3 days end to end if the
domain features map cleanly onto admin/{live,schedule,timesheets,jobs,reports}.
The marketing scaffold itself is <2 hours of swap work.

================================================================================
END OF FILE
Source pages this is derived from:
  E:\Projects\Time clock\apps\web\src\app\(marketing)\**
  E:\Projects\Time clock\apps\web\src\components\marketing\**
  C:\Users\reasn\AppData\Local\Temp\pw-runner\walkthrough.cjs
  C:\Users\reasn\AppData\Local\Temp\pw-runner\admin-shots.cjs
  C:\Users\reasn\Documents\Claude\Projects\DEv1\build\proof\
Maintained by: Ricky Reasner + the Dev 1 factory.
================================================================================
