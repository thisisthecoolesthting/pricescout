import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { expect, type Page, test } from "@playwright/test";

const DISPATCH_ID = "PRICESCOUT-CODEX-DEMO-QA-018";
const SCREENSHOT_DIR = path.join("tests", "__screenshots__", "demo-walkthrough");
const PROOF_DIR = path.join("build", "proof");
const REPORT_PATH = path.join(PROOF_DIR, `${DISPATCH_ID}-report.md`);
const PROOF_PATH = path.join(PROOF_DIR, `${DISPATCH_ID}.json`);

const DESKTOP = { name: "desktop" as const, width: 1440, height: 900 };
const MOBILE = { name: "mobile" as const, width: 412, height: 892 };

const FLIPPER_LANGUAGE_FORBIDDEN = [
  /flip log/i,
  /\bbuy\s*\/\s*skip\b/i,
  /\bbuy\s*\/\s*maybe\s*\/\s*skip\b/i,
  /your cost/i,
  /net (margin|profit)/i,
  /deal score/i,
  /shared flip/i,
  /flippers? (welcome|use|love)/i,
];

type ViewportName = typeof DESKTOP.name | typeof MOBILE.name;

type ForbiddenHit = {
  beat: number;
  viewport: ViewportName;
  path: string;
  pattern: string;
  match: string;
};

type BeatResult = {
  beat: number;
  name: string;
  path: string;
  viewport: ViewportName;
  status: "PASS" | "FAIL";
  durationMs: number;
  screenshot: string;
  errors: string[];
  forbiddenHits: ForbiddenHit[];
};

type Beat = {
  id: number;
  name: string;
  path: string;
  run: (page: Page) => Promise<void>;
};

test.describe.configure({ mode: "serial" });

test("PriceScout demo walkthrough regression", async ({ browser }) => {
  test.setTimeout(240_000);
  await mkdir(SCREENSHOT_DIR, { recursive: true });
  await mkdir(PROOF_DIR, { recursive: true });

  const desktopContext = await browser.newContext({
    viewport: { width: DESKTOP.width, height: DESKTOP.height },
  });
  const mobileContext = await browser.newContext({
    viewport: { width: MOBILE.width, height: MOBILE.height },
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36",
  });

  const desktopPage = await desktopContext.newPage();
  const mobilePage = await mobileContext.newPage();
  const results: BeatResult[] = [];
  const infrastructureErrors = collectInfrastructureErrors();

  try {
    for (const beat of beats) {
      results.push(await runBeat(desktopPage, beat, DESKTOP.name));
      results.push(await runBeat(mobilePage, beat, MOBILE.name));
    }
  } finally {
    await desktopContext.close();
    await mobileContext.close();
  }

  await writeArtifacts(results, process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3300", infrastructureErrors);

  const failing = results.filter((r) => r.status === "FAIL");
  expect(infrastructureErrors, `Infrastructure errors; see ${REPORT_PATH}`).toEqual([]);
  expect(failing, `${failing.length} viewport beat runs failed; see ${REPORT_PATH}`).toEqual([]);
});

const beats: Beat[] = [
  {
    id: 1,
    name: "Home hero",
    path: "/",
    run: async (page) => {
      await page.goto("/", { waitUntil: "networkidle" });
      await assertPageText(page, /Snap\. Price\. Post\./i, "hero Snap. Price. Post. copy");
      await assertPageText(page, /Phones \+ browsers both count/i, "trust strip");
      await expect(page.getByAltText(/phone scanning/i).first()).toBeVisible();
      await expect(page.getByAltText(/laptop browser|USB webcam|triage table/i).first()).toBeVisible();
    },
  },
  {
    id: 2,
    name: "Scanner sandbox",
    path: "/scan",
    run: async (page) => {
      await page.goto("/scan", { waitUntil: "networkidle" });
      await assertPageText(page, /Scanner/i, "scanner heading");
      await page.getByRole("button", { name: /Type it/i }).click();
      await expect(page.getByRole("textbox", { name: /What is it/i })).toBeVisible();
      await assertPageText(page, /tag price|tag range/i, "tag price wording");
      await assertPageText(page, /suggested/i, "suggested wording");
    },
  },
  {
    id: 3,
    name: "Pricing",
    path: "/pricing",
    run: async (page) => {
      await page.goto("/pricing", { waitUntil: "networkidle" });
      await page.getByText(/Founders Lifetime/i).first().hover();
      await assertPageText(page, /Founders Lifetime/i, "Founders Lifetime tier");
      await assertPageText(page, /\$699|699\s*once/i, "Founders Lifetime $699 price");
      await assertPageText(page, /Marketplace listing helper/i, "Marketplace listing helper bullet");
    },
  },
  {
    id: 4,
    name: "Marketplace helper feature",
    path: "/features/marketplace-helper",
    run: async (page) => {
      await page.goto("/features/marketplace-helper", { waitUntil: "networkidle" });
      await assertNotNotFound(page);
      await assertPageText(page, /Facebook|Marketplace/i, "FB listing flow");
      await assertPageText(page, /listing|post/i, "listing flow copy");
    },
  },
  {
    id: 5,
    name: "Browser scanner feature",
    path: "/features/browser-scanner",
    run: async (page) => {
      await page.goto("/features/browser-scanner", { waitUntil: "networkidle" });
      await assertNotNotFound(page);
      await assertPageText(page, /laptop|browser scanner|webcam/i, "browser scanner page");
      await assertPageText(page, /phones? \+ browsers?|same tag list|same .* phones/i, "dual-surface copy");
    },
  },
  {
    id: 6,
    name: "Thrift stores industry",
    path: "/industries/thrift-stores",
    run: async (page) => {
      await page.goto("/industries/thrift-stores", { waitUntil: "networkidle" });
      await assertNotNotFound(page);
      await assertPageText(page, /back-room laptop with (an )?(overhead )?USB cam/i, "USB cam copy");
    },
  },
  {
    id: 7,
    name: "Walkthrough video",
    path: "/watch",
    run: async (page) => {
      await page.goto("/watch", { waitUntil: "networkidle" });
      await assertNotNotFound(page);
      const videoCount = await page.locator("video").count();
      if (videoCount > 0) {
        const hasBrokenVideo = await page.locator("video").first().evaluate((video) => {
          const media = video as HTMLVideoElement;
          return Boolean(media.error) || media.networkState === HTMLMediaElement.NETWORK_NO_SOURCE;
        });
        expect(hasBrokenVideo, "video element should not be broken").toBe(false);
      } else {
        await assertPageText(page, /Snap\. Price\. Post\.|tag price|shared tag list/i, "HeroScanFlowEmbed fallback");
      }
    },
  },
  {
    id: 8,
    name: "Login",
    path: "/login",
    run: async (page) => {
      await page.goto("/login", { waitUntil: "networkidle" });
      await page.getByLabel("Email").fill("maria@greenfield.shop");
      await page.getByLabel("Password").fill("demo-password!");
      await Promise.all([
        page.waitForURL(/\/admin(?:$|\?)/, { timeout: 15_000 }),
        page.getByRole("button", { name: /Sign in/i }).click(),
      ]);
      expect(new URL(page.url()).pathname).toBe("/admin");
    },
  },
  {
    id: 9,
    name: "Admin dashboard",
    path: "/admin",
    run: async (page) => {
      await page.goto("/admin", { waitUntil: "networkidle" });
      await assertPageText(page, /Dashboard/i, "dashboard heading");
      await assertPageText(page, /Today.s pricings|Total scans|Recent scans/i, "pricing activity metrics");
      const recentRows = await page.locator("section:has-text('Recent scans') tbody tr").count();
      expect(recentRows, "recent scans table populated").toBeGreaterThan(0);
      const totalText = await page.locator("text=/Total scans/i").locator("..").textContent();
      const total = Number(totalText?.match(/\d+/)?.[0] ?? 0);
      expect(total, "pricing count > 0").toBeGreaterThan(0);
    },
  },
  {
    id: 10,
    name: "Admin scans",
    path: "/admin/scans",
    run: async (page) => {
      await page.goto("/admin/scans", { waitUntil: "networkidle" });
      await assertPageText(page, /Scan history/i, "scan history heading");
      let visibleRows = await page.locator("tbody tr").count();
      const next = page.getByRole("link", { name: /Next/i });
      if (await next.isVisible().catch(() => false)) {
        await Promise.all([page.waitForLoadState("networkidle"), next.click()]);
        visibleRows += await page.locator("tbody tr").count();
      }
      expect(visibleRows, "at least 50 rows visible across pagination").toBeGreaterThanOrEqual(50);
      await assertPageText(page, /Marketplace/i, "Marketplace status column");
      await assertPageText(page, /Posted/i, "Posted Marketplace status");
      await assertPageText(page, /Sold/i, "Sold Marketplace status");
      await assertPageText(page, /Draft/i, "Draft Marketplace status");
    },
  },
  {
    id: 11,
    name: "Admin devices",
    path: "/admin/devices",
    run: async (page) => {
      await page.goto("/admin/devices", { waitUntil: "networkidle" });
      await assertPageText(page, /Devices/i, "devices heading");
      const deviceCards = await page.locator("text=/Fingerprint/i").count();
      expect(deviceCards, "4 devices listed").toBe(4);
      await assertPageText(page, /Get the mobile app/i, "MobileAppCard");
      await expect(page.getByAltText(/Scan to install/i)).toBeVisible();
    },
  },
  {
    id: 12,
    name: "WPBS smoke",
    path: "/",
    run: async (page) => {
      await page.goto("/", { waitUntil: "networkidle" });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.getByRole("button", { name: "WPBS" }).click();
      await expect(page.getByRole("dialog", { name: /Partner access/i })).toBeVisible();
      await page.getByLabel("Email").fill("audit@example.com");
      await page.getByRole("button", { name: /Get my access link/i }).click();
      await assertPageText(page, /Check your email|access link|Request received/i, "WPBS success or inline magic link");
    },
  },
];

async function runBeat(page: Page, beat: Beat, viewport: ViewportName): Promise<BeatResult> {
  const start = Date.now();
  const errors: string[] = [];
  const screenshot = path.join(SCREENSHOT_DIR, `${String(beat.id).padStart(2, "0")}-${slugify(beat.name)}-${viewport}.png`);

  try {
    await beat.run(page);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }

  const forbiddenHits = await collectForbiddenHits(page, beat, viewport);
  for (const hit of forbiddenHits) {
    errors.push(`Forbidden language matched ${hit.pattern}: "${hit.match}"`);
  }

  try {
    await page.screenshot({ path: screenshot, fullPage: true });
  } catch (error) {
    errors.push(`Screenshot failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  return {
    beat: beat.id,
    name: beat.name,
    path: beat.path,
    viewport,
    status: errors.length === 0 ? "PASS" : "FAIL",
    durationMs: Date.now() - start,
    screenshot,
    errors,
    forbiddenHits,
  };
}

async function assertPageText(page: Page, expected: RegExp, label: string) {
  const bodyText = await page.locator("body").innerText({ timeout: 10_000 });
  if (!expected.test(bodyText)) {
    throw new Error(`Expected ${label} matching ${expected}; page text began "${oneLine(bodyText).slice(0, 240)}"`);
  }
}

async function assertNotNotFound(page: Page) {
  if (/\/404(?:$|\?)/.test(page.url())) {
    throw new Error(`Page routed to Next.js 404 at ${page.url()}`);
  }
  const bodyText = await page.locator("body").innerText({ timeout: 10_000 });
  if (/404|This page could not be found/i.test(bodyText)) {
    throw new Error(`Page rendered a 404; page text began "${oneLine(bodyText).slice(0, 240)}"`);
  }
}

async function collectForbiddenHits(page: Page, beat: Beat, viewport: ViewportName): Promise<ForbiddenHit[]> {
  const text = await page.locator("body").innerText({ timeout: 5_000 }).catch(() => "");
  const hits: ForbiddenHit[] = [];
  for (const pattern of FLIPPER_LANGUAGE_FORBIDDEN) {
    const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
    const globalPattern = new RegExp(pattern.source, flags);
    for (const match of text.matchAll(globalPattern)) {
      hits.push({
        beat: beat.id,
        viewport,
        path: beat.path,
        pattern: pattern.toString(),
        match: match[0],
      });
    }
  }
  return hits;
}

async function writeArtifacts(results: BeatResult[], baseURL: string, infrastructureErrors: string[]) {
  const beatIds = [...new Set(results.map((r) => r.beat))];
  const passedBeats = beatIds.filter((beat) => results.filter((r) => r.beat === beat).every((r) => r.status === "PASS"));
  const allHits = results.flatMap((r) => r.forbiddenHits);
  const readiness = passedBeats.length === beatIds.length && allHits.length === 0
    ? "green"
    : passedBeats.length >= 9 && allHits.length === 0
      ? "yellow"
      : "red";

  const report = [
    `# ${DISPATCH_ID} Demo Walkthrough QA`,
    "",
    `**Summary:** ${passedBeats.length} of ${beatIds.length} beats passed (${results.filter((r) => r.status === "PASS").length}/${results.length} viewport runs passed).`,
    `**Base URL:** ${baseURL}`,
    `**Generated:** ${new Date().toISOString()}`,
    infrastructureErrors.length ? `**Infrastructure:** FAIL - ${infrastructureErrors.join("; ")}` : "**Infrastructure:** PASS",
    "",
    "## Per-Beat Results",
    "",
    ...beatIds.flatMap((beat) => {
      const rows = results.filter((r) => r.beat === beat);
      const first = rows[0];
      return [
        `### ${String(beat).padStart(2, "0")} - ${first.name}: ${rows.every((r) => r.status === "PASS") ? "PASS" : "FAIL"}`,
        "",
        ...rows.map((r) => [
          `- ${r.viewport}: ${r.status} in ${r.durationMs}ms`,
          `  - screenshot: [${path.basename(r.screenshot)}](../../${r.screenshot.replace(/\\/g, "/")})`,
          ...(r.errors.length ? r.errors.map((e) => `  - issue: ${oneLine(e)}`) : []),
        ].join("\n")),
        "",
      ];
    }),
    "## Forbidden-Language Hits",
    "",
    allHits.length
      ? allHits.map((h) => `- Beat ${h.beat} ${h.viewport} ${h.path}: \`${h.pattern}\` matched "${h.match}"`).join("\n")
      : "- None",
    "",
    "## Demo Readiness Assessment",
    "",
    readiness === "green"
      ? "GREEN - all beats passed and no forbidden shop-language regressions were detected."
      : readiness === "yellow"
        ? "YELLOW - core flow mostly works, but review failed beats before the live demo."
        : "RED - one or more core demo beats or language guards failed; do not treat this as demo-ready without operator review.",
    "",
  ].join("\n");

  const proof = {
    dispatch_id: DISPATCH_ID,
    branch: "feat/codex-demo-walkthrough-qa",
    depends_on: ["PRICESCOUT-DEMO-SEED-017"],
    completed_at: new Date().toISOString(),
    summary: `${passedBeats.length} of ${beatIds.length} demo beats passed; ${allHits.length} forbidden-language hits.`,
    base_url: baseURL,
    command: "npm run demo-qa",
    infrastructure: {
      result: infrastructureErrors.length ? "fail" : "pass",
      errors: infrastructureErrors,
    },
    screenshots_dir: SCREENSHOT_DIR,
    report: REPORT_PATH,
    readiness,
    beats_total: beatIds.length,
    beats_passed: passedBeats.length,
    viewport_runs_total: results.length,
    viewport_runs_passed: results.filter((r) => r.status === "PASS").length,
    forbidden_language_hits: allHits,
    results,
  };

  await writeFile(REPORT_PATH, report, "utf8");
  await writeFile(PROOF_PATH, `${JSON.stringify(proof, null, 2)}\n`, "utf8");
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function oneLine(value: string) {
  return value
    .replace(/\u001b\[[0-9;]*m/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function collectInfrastructureErrors() {
  const errors: string[] = [];
  if (!process.env.PLAYWRIGHT_BASE_URL && !process.env.DATABASE_URL) {
    errors.push("DATABASE_URL is not set for local Prisma-backed login/admin/WPBS demo beats");
  }
  if (!process.env.PLAYWRIGHT_BASE_URL && !process.env.PS_SESSION_SECRET) {
    errors.push("PS_SESSION_SECRET is not set for local auth/session demo beats");
  }
  return errors;
}
