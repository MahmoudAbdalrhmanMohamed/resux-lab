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
let serverOutput = "";

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
  throw new Error(`Timed out waiting for preview server to become ready.\n${serverOutput.slice(-8000)}`);
}

async function fetchHtml(routePath) {
  const response = await fetch(`${baseUrl}${routePath}`);
  const html = await response.text();
  assert.equal(response.status, 200, `Expected 200 for ${routePath}.\nBody: ${html.slice(0, 2000)}\nServer: ${serverOutput.slice(-8000)}`);
  return html;
}

function assertHtml(html, matcher, message) {
  assert.ok(matcher.test(html), message);
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
  serverProcess.stdout?.on("data", (chunk) => {
    serverOutput += String(chunk);
  });
  serverProcess.stderr?.on("data", (chunk) => {
    serverOutput += String(chunk);
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
  assertHtml(html, /i18n Localization Test/, "Missing English i18n title");
  assertHtml(html, /Welcome to Resux/, "Missing English welcome translation");
  assertHtml(html, /Hello Developer/, "Missing interpolated English greeting");
  assertHtml(html, /<html[^>]*lang="en"[^>]*dir="ltr"|<html[^>]*dir="ltr"[^>]*lang="en"/, "English SSR html lang/dir are incorrect");
  assertHtml(html, /rel="canonical"[^>]*href="[^"]*\/features\/i18n"/, "Missing English canonical i18n URL");
  assertHtml(html, /hreflang="ar"[^>]*href="[^"]*\/ar\/features\/i18n"/, "Missing Arabic alternate i18n URL");
});

test("Arabic i18n route is a direct SSR route with RTL and localized SEO", async () => {
  const html = await fetchHtml("/ar/features/i18n");
  assertHtml(html, /اختبار الترجمة في Resux/, "Missing Arabic i18n title");
  assertHtml(html, /مرحبًا بك في Resux/, "Missing Arabic welcome translation");
  assertHtml(html, /<html[^>]*lang="ar"[^>]*dir="rtl"|<html[^>]*dir="rtl"[^>]*lang="ar"/, "Arabic SSR html lang/dir are incorrect");
  assertHtml(html, /rel="canonical"[^>]*href="[^"]*\/ar\/features\/i18n"/, "Missing Arabic canonical i18n URL");
  assertHtml(html, /hreflang="en"[^>]*href="[^"]*\/features\/i18n"/, "Missing English alternate i18n URL");
  assertHtml(html, /hreflang="x-default"[^>]*href="[^"]*\/features\/i18n"/, "Missing x-default i18n URL");
});

test("prefix_except_default does not expose a duplicate /en page route", async () => {
  const response = await fetch(`${baseUrl}/en/features/i18n`, { redirect: "manual" });
  assert.equal(response.status, 404);
});

test("valid /media route payload endpoint renders successfully", async () => {
  const response = await fetch(`${baseUrl}/__resux/route?path=${encodeURIComponent("/media")}`, {
    headers: { accept: "application/json" },
  });
  const body = await response.text();
  assert.equal(response.status, 200, `Expected /media route payload to return 200.\nBody: ${body.slice(0, 3000)}\nServer: ${serverOutput.slice(-12000)}`);
  const payload = JSON.parse(body);
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
