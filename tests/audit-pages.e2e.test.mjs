import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import test from "node:test";

const cwd = process.cwd();
const port = 3421;
const host = "127.0.0.1";
const baseUrl = `http://${host}:${port}`;
const serverEntry = path.join(cwd, ".output", "server", "index.mjs");
let serverProcess = null;

async function waitForServerReady() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`${baseUrl}/__resux/health`);
      if (response.ok) return;
    } catch {}
    await wait(250);
  }
  throw new Error("Timed out waiting for preview server to become ready.");
}

async function fetchHtml(routePath) {
  const response = await fetch(`${baseUrl}${routePath}`);
  assert.equal(response.status, 200, `Expected 200 for ${routePath}`);
  return response.text();
}

test.before(async () => {
  assert.equal(
    existsSync(serverEntry),
    true,
    "Missing .output/server/index.mjs. Run `npm run build` before `npm run test:e2e`.",
  );

  serverProcess = spawn(process.execPath, [serverEntry], {
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

  await waitForServerReady();
});

test.after(async () => {
  if (!serverProcess || serverProcess.killed) return;
  serverProcess.kill("SIGTERM");
  await wait(200);
});

test("UI showcase keeps an SSR shell around the Vue island", async () => {
  const html = await fetchHtml("/ui");
  assert.match(html, /Resux UI showcase/);
  assert.match(html, /resuxjs\/ui/);
  assert.match(html, /ui-island-shell/);
  assert.match(html, /UiShowcase/);
});

test("browser capability integration keeps explanatory SSR content", async () => {
  const html = await fetchHtml("/integrations/browser-capabilities");
  assert.match(html, /Camera, permissions, and file picker/);
  assert.match(html, /browser-capabilities-shell/);
  assert.match(html, /BrowserCapabilities/);
  assert.match(html, /explicit click/);
});
