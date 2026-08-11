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
      const response = await fetch(`${baseUrl}/__resux/health`);
      if (response.ok) return;
    } catch {}
    await wait(250);
  }
  throw new Error("Timed out waiting for Resux Lab preview server.");
}

let browser;
try {
  await waitForServerReady();
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

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

  console.log("Browser integration verification passed.");
} finally {
  await browser?.close();
  if (!server.killed) {
    server.kill("SIGTERM");
    await wait(200);
  }
}
