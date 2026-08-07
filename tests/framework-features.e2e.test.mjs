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

test("i18n feature page renders localization string interpolations", async () => {
  const html = await fetchHtml("/features/i18n");
  assert.match(html, /i18n Localization Test/);
  assert.match(html, /Welcome to Resux/);
  assert.match(html, /Hello Developer/);
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
