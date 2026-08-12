import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import test from "node:test";
import { chromium } from "playwright";

const cwd = process.cwd();
const port = 3425;
const host = "127.0.0.1";
const baseUrl = `http://${host}:${port}`;
const serverEntry = path.join(cwd, ".output", "server", "index.mjs");
let server;
let browser;

async function waitForServerReady() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`${baseUrl}/__resux/health`);
      if (response.ok) return;
    } catch {}
    await wait(250);
  }
  throw new Error("Timed out waiting for Resux Lab preview server.");
}

function routePayloadPath(url) {
  const parsed = new URL(url);
  return parsed.pathname === "/__resux/route" ? parsed.searchParams.get("path") : null;
}

test.before(async () => {
  assert.equal(existsSync(serverEntry), true, "Run `npm run build` before E2E tests.");
  server = spawn(process.execPath, [serverEntry], {
    cwd,
    env: {
      ...process.env,
      HOST: host,
      PORT: String(port),
      NITRO_HOST: host,
      NITRO_PORT: String(port),
    },
    stdio: "ignore",
  });
  await waitForServerReady();
  browser = await chromium.launch({ headless: true });
});

test.after(async () => {
  await browser?.close();
  if (server && !server.killed) {
    server.kill("SIGTERM");
    await wait(200);
  }
});

test("speculative failure cools down repeated triggers and click retries authoritatively", async () => {
  const page = await browser.newPage();
  let mediaRequests = 0;

  await page.route("**/__resux/route?*", async (route) => {
    if (routePayloadPath(route.request().url()) !== "/media") {
      await route.continue();
      return;
    }
    mediaRequests += 1;
    if (mediaRequests === 1) {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "intentional speculative failure" }),
      });
      return;
    }
    await route.continue();
  });

  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  const mediaLink = page.locator('a[href="/media"]').first();
  await mediaLink.waitFor();

  const failedPrefetch = page.waitForResponse(
    (response) => routePayloadPath(response.url()) === "/media",
  );
  await mediaLink.hover();
  const failedResponse = await failedPrefetch;
  assert.equal(failedResponse.status(), 500, "First speculative /media prefetch should fail intentionally.");
  assert.equal(mediaRequests, 1, "First speculative hover should issue exactly one failed request.");

  for (let index = 0; index < 8; index++) {
    await page.locator("h1").hover();
    await mediaLink.hover();
  }
  await mediaLink.focus();
  await wait(150);
  assert.equal(mediaRequests, 1, "Failure cooldown must suppress immediate hover/focus retries.");

  await mediaLink.click();
  await page.waitForURL(`${baseUrl}/media`);
  assert.equal(mediaRequests, 2, "Intentional navigation should retry once after speculative failure.");

  await page.close();
});
