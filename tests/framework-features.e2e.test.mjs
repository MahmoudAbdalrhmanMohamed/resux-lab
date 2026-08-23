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
const requestTimeoutMs = 10_000;
let serverProcess;

async function waitForServerReady() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`${baseUrl}/__resux/health`, {
        signal: AbortSignal.timeout(1_000),
      });
      if (response.ok) {
        return;
      }
    } catch {}
    await wait(250);
  }
  throw new Error("Timed out waiting for Resux Lab preview server.");
}

async function fetchHtml(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    signal: AbortSignal.timeout(requestTimeoutMs),
  });
  assert.equal(response.status, 200, `${pathname} returned ${response.status}`);
  return response.text();
}

function assertHtml(html, pattern, message) {
  assert.ok(pattern.test(html), message);
}

function attributeValue(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, "i"));
  return match?.[1] ?? null;
}

function findLinkHref(html, { rel, hreflang }) {
  const links = html.match(/<link\b[^>]*>/gi) ?? [];
  const link = links.find((tag) => {
    if (attributeValue(tag, "rel")?.toLowerCase() !== rel.toLowerCase()) return false;
    if (hreflang && attributeValue(tag, "hreflang")?.toLowerCase() !== hreflang.toLowerCase()) return false;
    return true;
  });
  assert.ok(link, `Missing <link rel="${rel}"${hreflang ? ` hreflang="${hreflang}"` : ""}>`);
  const href = attributeValue(link, "href");
  assert.ok(href, `Missing href on ${link}`);
  return href;
}

function assertSeoPath(html, attributes, expectedPath) {
  const href = findLinkHref(html, attributes);
  const pathname = new URL(href, baseUrl).pathname;
  assert.equal(pathname, expectedPath, `${attributes.hreflang ?? attributes.rel} SEO path should be ${expectedPath}`);
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
  assertSeoPath(html, { rel: "canonical" }, "/features/i18n");
  assertSeoPath(html, { rel: "alternate", hreflang: "ar" }, "/ar/features/i18n");
});

test("Arabic i18n route is a direct SSR route with RTL and localized SEO", async () => {
  const html = await fetchHtml("/ar/features/i18n");
  assertHtml(html, /اختبار الترجمة في Resux/, "Missing Arabic i18n title");
  assertHtml(html, /مرحبًا بك في Resux/, "Missing Arabic welcome translation");
  assertHtml(html, /<html[^>]*lang="ar"[^>]*dir="rtl"|<html[^>]*dir="rtl"[^>]*lang="ar"/, "Arabic SSR html lang/dir are incorrect");
  assertSeoPath(html, { rel: "canonical" }, "/ar/features/i18n");
  assertSeoPath(html, { rel: "alternate", hreflang: "en" }, "/features/i18n");
  assertSeoPath(html, { rel: "alternate", hreflang: "x-default" }, "/features/i18n");
});

test("prefix_except_default does not expose a duplicate /en page route", async () => {
  const response = await fetch(`${baseUrl}/en/features/i18n`, {
    redirect: "manual",
    signal: AbortSignal.timeout(requestTimeoutMs),
  });
  assert.equal(response.status, 404);
});

test("media page renders successfully through a direct SSR request", async () => {
  const html = await fetchHtml("/media");
  assert.match(html, /Resux Media QA/);
  assert.match(html, /ResuxImg, ResuxPicture, ResuxVideo/);
});

test("valid /media route payload endpoint renders successfully", async () => {
  const response = await fetch(`${baseUrl}/__resux/route?path=${encodeURIComponent("/media")}`, {
    signal: AbortSignal.timeout(requestTimeoutMs),
  });
  assert.equal(response.status, 200);
  const contentType = response.headers.get("content-type") ?? "";
  assert.match(contentType, /application\/json/i);
  const payload = await response.json();
  assert.equal(payload?.payload?.route?.path, "/media");
  const payloadHtml = String(payload?.html ?? "");
  assert.match(payloadHtml, /Resux Media QA/);
  assert.match(payloadHtml, /ResuxImg, ResuxPicture, ResuxVideo/);
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
  assert.match(html, /Active Error:/);
});

test("all-matrix feature page renders exported API count badge", async () => {
  const html = await fetchHtml("/features/all-matrix");
  assert.match(html, /Resux All-Features Matrix/);
  assert.match(html, /Exported APIs Tested/);
  assert.match(html, /api-count-badge/);
});

test("halal-test page renders Halal-AI LLM interactive test bench", async () => {
  const html = await fetchHtml("/halal-test");
  assert.match(html, /Halal Core &amp; Halal-AI LLM Test Bench|Halal Core & Halal-AI LLM Test Bench/);
  assert.match(html, /Halal-AI Interactive LLM/);
  assert.match(html, /Learned Conversational History/);
});
