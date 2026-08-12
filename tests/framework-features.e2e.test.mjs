import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import test from "node:test";

const cwd = process.cwd();
const port = 3420;
const host = "127.0.0.1";
const baseUrl = `http://${host}:${port}`;
const serverEntry = path.join(cwd, ".output", "server", "index.mjs");
let serverProcess;

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
  throw new Error("Timed out waiting for Resux Lab preview server.");
}

async function fetchHtml(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`);
  assert.equal(response.status, 200, `${pathname} returned ${response.status}`);
  return response.text();
}

function assertHtml(html, pattern, message) {
  assert.ok(pattern.test(html), message);
}

test.before(async () => {
  assert.equal(existsSync(serverEntry), true, "Run `npm run build` before E2E tests.");
  serverProcess = spawn(process.execPath, [serverEntry], {
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

test("media page renders successfully through a direct SSR request", async () => {
  const html = await fetchHtml("/media");
  assert.match(html, /Media|Image|Video/i);
});

test("valid /media route payload endpoint renders successfully", async () => {
  const response = await fetch(`${baseUrl}/__resux/route?path=${encodeURIComponent("/media")}`);
  assert.equal(response.status, 200);
  const contentType = response.headers.get("content-type") ?? "";
  assert.match(contentType, /application\/json/i);
  const payload = await response.json();
  assert.equal(payload?.payload?.route?.path, "/media");
  assert.match(String(payload?.html ?? ""), /Media|Image|Video/i);
});

test("device feature page renders device detection flags", async () => {
  const html = await fetchHtml("/features/device");
  assert.match(html, /Device|Mobile|Desktop/i);
});

test("errors feature page renders error management components", async () => {
  const html = await fetchHtml("/features/errors");
  assert.match(html, /Error|errors/i);
});

test("all-matrix feature page renders exported API count badge", async () => {
  const html = await fetchHtml("/features/all-matrix");
  assert.match(html, /All Matrix|API|export/i);
});

test("halal-test page renders Halal-AI LLM interactive test bench", async () => {
  const html = await fetchHtml("/halal-test");
  assert.match(html, /Halal|LLM|AI/i);
});
