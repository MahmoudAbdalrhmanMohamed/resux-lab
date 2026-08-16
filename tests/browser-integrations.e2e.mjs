import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import { chromium } from "playwright";

const cwd = process.cwd();
const port = 3420;
const host = "127.0.0.1";
const baseUrl = `http://${host}:${port}`;
const serverEntry = path.join(cwd, ".output", "server", "index.mjs");

if (!existsSync(serverEntry)) {
  throw new Error("Missing .output/server/index.mjs. Run `npm run build` before `npm run test:browser`.");
}

const server = spawn(process.execPath, [serverEntry], {
  cwd,
  env: {
    ...process.env,
    HOST: host,
    PORT: String(port),
    NITRO_HOST: host,
    NITRO_PORT: String(port),
  },
  stdio: ["ignore", "pipe", "pipe"],
});

async function waitForServerReady() {
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      const response = await fetch(`${baseUrl}/__resux/health`, {
        signal: AbortSignal.timeout(1_000),
      });
      if (response.ok) return;
    } catch {}
    await wait(250);
  }
  throw new Error("Timed out waiting for Resux Lab preview server.");
}

function routePayloadPath(url) {
  const parsed = new URL(url);
  if (parsed.pathname !== "/__resux/route") return null;
  return parsed.searchParams.get("path");
}

async function waitForRequestCount(requests, expected) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (requests.length >= expected) return;
    await wait(50);
  }
  throw new Error(`Timed out waiting for ${expected} route payload request(s); saw ${requests.length}.`);
}

async function assertLocaleState(page, { locale, dir, welcome }) {
  await page.locator("#i18n-locale").waitFor();
  assert.match(await page.locator("#i18n-locale").textContent(), new RegExp(`locale=${locale}`));
  assert.match(await page.locator("#i18n-dir").textContent(), new RegExp(`dir=${dir}`));
  assert.match(await page.locator("#t-welcome").textContent(), welcome);
  assert.equal(await page.locator("html").getAttribute("lang"), locale);
  assert.equal(await page.locator("html").getAttribute("dir"), dir);
}

let browser;
try {
  await waitForServerReady();
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const mediaRouteRequests = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("request", (request) => {
    if (routePayloadPath(request.url()) === "/media") {
      mediaRouteRequests.push(request.url());
    }
  });

  await page.goto(`${baseUrl}/ui`, { waitUntil: "networkidle" });
  await page.locator('[data-testid="ui-showcase"]').waitFor();

  await page.locator('[data-testid="ui-input"]').fill("Resux Browser Test");
  await page.locator('[data-testid="ui-date-picker"]').fill("2026-12-31");
  const summary = page.locator('[data-testid="ui-model-summary"]');
  await assert.doesNotReject(async () => {
    await summary.waitFor();
  });
  assert.match(await summary.textContent(), /Resux Browser Test/);
  assert.match(await summary.textContent(), /2026-12-31/);

  await page.locator('[data-testid="ui-open-modal"]').click();
  await page.getByText("Resux UI modal").waitFor();
  await page.getByText("Modal content is mounted only while open.").waitFor();

  await page.goto(`${baseUrl}/integrations/browser-capabilities`, { waitUntil: "networkidle" });
  await page.locator('[data-testid="browser-capabilities"]').waitFor();
  await page.locator('[data-testid="file-picker"]').setInputFiles({
    name: "audit.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4\n% Resux integration test\n"),
  });
  assert.match(
    await page.locator('[data-testid="file-picker-result"]').textContent(),
    /audit\.pdf/,
  );

  await page.locator('[data-testid="check-camera-permission"]').click();
  await page.waitForFunction(() => (
    document.querySelector('[data-testid="camera-permission-result"]')?.textContent?.trim()
      !== "Permission: not checked"
  ));
  const permissionText = await page.locator('[data-testid="camera-permission-result"]').textContent();
  assert.ok(permissionText?.startsWith("Permission:"));
  assert.notEqual(permissionText?.trim(), "Permission: not checked");

  await page.goto(`${baseUrl}/features/i18n`, { waitUntil: "networkidle" });
  await assertLocaleState(page, {
    locale: "en",
    dir: "ltr",
    welcome: /Welcome to Resux/,
  });

  await page.locator("#lang-ar").click();
  await page.waitForURL(`${baseUrl}/ar/features/i18n`);
  await assertLocaleState(page, {
    locale: "ar",
    dir: "rtl",
    welcome: /مرحبًا بك في Resux/,
  });

  await page.locator("#lang-en").click();
  await page.waitForURL(`${baseUrl}/features/i18n`);
  await assertLocaleState(page, {
    locale: "en",
    dir: "ltr",
    welcome: /Welcome to Resux/,
  });

  await page.goBack({ waitUntil: "networkidle" });
  assert.equal(new URL(page.url()).pathname, "/ar/features/i18n");
  await assertLocaleState(page, {
    locale: "ar",
    dir: "rtl",
    welcome: /مرحبًا بك في Resux/,
  });

  await page.goForward({ waitUntil: "networkidle" });
  assert.equal(new URL(page.url()).pathname, "/features/i18n");
  await assertLocaleState(page, {
    locale: "en",
    dir: "ltr",
    welcome: /Welcome to Resux/,
  });

  mediaRouteRequests.length = 0;
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  const mediaLink = page.locator('a[href="/media"]').first();
  await mediaLink.waitFor();

  const firstPrefetch = page.waitForResponse((response) => routePayloadPath(response.url()) === "/media");
  await mediaLink.hover();
  const firstResponse = await firstPrefetch;
  assert.equal(firstResponse.status(), 200);

  for (let index = 0; index < 10; index++) {
    await page.locator("h1").hover();
    await mediaLink.hover();
  }
  await mediaLink.focus();
  await wait(100);
  assert.equal(mediaRouteRequests.length, 1, "Repeated hover/focus should reuse one /media route payload request.");

  await mediaLink.click();
  await page.waitForURL(`${baseUrl}/media`);
  await page.locator("h1", { hasText: "ResuxImg, ResuxPicture, ResuxVideo" }).waitFor();
  await wait(100);
  assert.equal(mediaRouteRequests.length, 1, "Navigation should reuse the prefetched /media route payload.");

  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  const reloadedMediaLink = page.locator('a[href="/media"]').first();
  await reloadedMediaLink.waitFor();
  if (mediaRouteRequests.length === 1) {
    await reloadedMediaLink.hover();
  }
  await waitForRequestCount(mediaRouteRequests, 2);
  await wait(100);
  assert.equal(mediaRouteRequests.length, 2, "A new browser document should issue exactly one fresh /media route payload request.");

  assert.deepEqual(pageErrors, [], `Unexpected page errors: ${pageErrors.join("\n")}`);
  assert.deepEqual(
    consoleErrors.filter((message) => !/favicon/i.test(message)),
    [],
    `Unexpected console errors: ${consoleErrors.join("\n")}`,
  );

  console.log("Browser integration verification passed.");
} finally {
  await browser?.close();
  if (!server.killed) {
    server.kill("SIGTERM");
    await wait(200);
  }
}
