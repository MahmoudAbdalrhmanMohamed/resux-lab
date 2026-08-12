import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import test from "node:test";

const cwd = process.cwd();
const port = 3415;
const host = "127.0.0.1";
const baseUrl = `http://${host}:${port}`;
const serverEntry = path.join(cwd, ".output", "server", "index.mjs");
let serverProcess = null;

async function waitForServerReady() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`${baseUrl}/__resux/health`);
      if (response.ok) {
        return;
      }
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
    "Missing .output/server/index.mjs. Run `npm run build` before `npm run test:e2e`."
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
  if (!serverProcess || serverProcess.killed) {
    return;
  }
  serverProcess.kill("SIGTERM");
  await wait(200);
});

test("reactivity feature page renders reactive state checks and counters", async () => {
  const html = await fetchHtml("/features/reactivity");
  assert.match(html, /Reactivity &amp; State Test|Reactivity & State Test/);
  assert.match(html, /isRef\(count\):/);
  assert.match(html, /isReactive\(state\):/);
  assert.match(html, /useState/);
});

test("default-locale i18n route renders through real Resux i18n", async () => {
  const html = await fetchHtml("/features/i18n");
  assert.match(html, /i18n Localization Test/);
  assert.match(html, /Welcome to Resux/);
  assert.match(html, /Hello Developer/);
  assert.match(html, /<html[^>]*lang="en"[^>]*dir="ltr"|<html[^>]*dir="ltr"[^>]*lang="en"/);
  assert.match(html, /rel="canonical"[^>]*href="[^"]*\/features\/i18n"/);
  assert.match(html, /hreflang="ar"[^>]*href="[^"]*\/ar\/features\/i18n"/);
});

test("Arabic i18n route is a direct SSR route with RTL and localized SEO", async () => {
  const html = await fetchHtml("/ar/features/i18n");
  assert.match(html, /اختبار الترجمة في Resux/);
  assert.match(html, /مرحبًا بك في Resux/);
  assert.match(html, /<html[^>]*lang="ar"[^>]*dir="rtl"|<html[^>]*dir="rtl"[^>]*lang="ar"/);
  assert.match(html, /rel="canonical"[^>]*href="[^"]*\/ar\/features\/i18n"/);
  assert.match(html, /hreflang="en"[^>]*href="[^"]*\/features\/i18n"/);
  assert.match(html, /hreflang="x-default"[^>]*href="[^"]*\/features\/i18n"/);
});

test("prefix_except_default does not expose a duplicate /en page route", async () => {
  const response = await fetch(`${baseUrl}/en/features/i18n`, { redirect: "manual" });
  assert.equal(response.status, 404);
});

test("valid /media route payload endpoint renders successfully", async () => {
  const response = await fetch(`${baseUrl}/__resux/route?path=${encodeURIComponent("/media")}`, {
    headers: { accept: "application/json" },
  });
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(typeof payload.html, "string");
  assert.match(payload.html, /Media|Image|Video/i);
  assert.equal(typeof payload.payload, "object");
});

test("device feature page renders device detection flags", async () => {
  const html = await fetchHtml("/features/device");
  assert.match(html, /Device Detection Test/);
  assert.match(html, /Current Device Flags/);
  assert.match(html, /User-Agent Parser Test/);
});

test("errors feature page renders error management components", async () => {
  const html = await fetchHtml("/features/errors");
  assert.match(html, /Error Handling &amp; Recovery Test|Error Handling & Recovery Test/);
  assert.match(html, /Create Error/);
});

test("all-matrix feature page renders exported API count badge", async () => {
  const html = await fetchHtml("/features/all-matrix");
  assert.match(html, /Resux All-Features Matrix/);
  assert.match(html, /Exported APIs Tested/);
});

test("halal-test page renders Halal-AI LLM interactive test bench", async () => {
  const html = await fetchHtml("/halal-test");
  assert.match(html, /Halal Core &amp; Halal-AI LLM Test Bench|Halal Core & Halal-AI LLM Test Bench/);
  assert.match(html, /Halal-AI Interactive LLM/);
  assert.match(html, /Learned Conversational History/);
});
