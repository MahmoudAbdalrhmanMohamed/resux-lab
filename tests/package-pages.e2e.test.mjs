import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import test from "node:test";

const cwd = process.cwd();
const port = 3411;
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
  if (!serverProcess || serverProcess.killed) {
    return;
  }
  serverProcess.kill("SIGTERM");
  await wait(200);
});

test("package tests index exposes all required demo routes", async () => {
  const html = await fetchHtml("/package-tests");
  assert.match(html, /\/package-tests\/swiper/);
  assert.match(html, /\/package-tests\/chart/);
  assert.match(html, /\/package-tests\/echarts/);
  assert.match(html, /\/package-tests\/animation-gsap/);
  assert.match(html, /\/package-tests\/animation-anime/);
  assert.match(html, /\/package-tests\/video-player/);
  assert.match(html, /\/package-tests\/markdown/);
  assert.match(html, /\/package-tests\/code-highlight/);
  assert.match(html, /\/package-tests\/utility-date-fns/);
  assert.match(html, /\/package-tests\/utility-lodash/);
  assert.match(html, /\/package-tests\/css-package/);
  assert.match(html, /\/package-tests\/client-only-map/);
  assert.match(html, /\/package-tests\/missing-package/);
});

test("swiper page keeps SSR cards and enhancement marker", async () => {
  const html = await fetchHtml("/package-tests/swiper");
  const cards = html.match(/class="swiper-slide rx-swiper-fallback-slide"/g) || [];
  assert.ok(cards.length >= 4, "Expected at least 4 SSR swiper cards");
  assert.match(html, /data-resux-enhancement="swiper-carousel"/);
  assert.match(html, /data-resux-trigger="visible"/);
  assert.match(html, /use-client-enhancement="swiper-carousel"/);
  assert.match(html, /data-rx-package-status/);
  assert.match(html, /<h1[^>]*>Swiper Progressive Enhancement<\/h1>/);
});

test("chart page keeps SSR table fallback and enhancement marker", async () => {
  const html = await fetchHtml("/package-tests/chart");
  assert.match(html, /<table/);
  assert.match(html, /<th[^>]*>Metric<\/th>/);
  assert.match(html, /use-client-enhancement="chart-demo"/);
  assert.match(html, /data-rx-chart-canvas/);
  assert.match(html, /Enhancement status/);
});

test("echarts page keeps SSR rows and enhancement marker", async () => {
  const html = await fetchHtml("/package-tests/echarts");
  assert.match(html, /use-client-enhancement="echarts-demo"/);
  assert.match(html, /data-rx-echarts-row/);
  assert.match(html, /data-rx-echarts-root/);
});

test("code highlight page keeps SSR code content and enhancement marker", async () => {
  const html = await fetchHtml("/package-tests/code-highlight");
  assert.match(html, /use-client-enhancement="code-highlight-demo"/);
  assert.match(html, /data-rx-code-block/);
  assert.match(html, /highlight\.js/);
});

test("utility pages render SSR-only package output", async () => {
  const dateHtml = await fetchHtml("/package-tests/utility-date-fns");
  assert.match(dateHtml, /date-fns Utility Demo/);
  assert.match(dateHtml, /Readable date:/);

  const lodashHtml = await fetchHtml("/package-tests/utility-lodash");
  assert.match(lodashHtml, /lodash-es Utility Demo/);
  assert.match(lodashHtml, /Aly|Mona|Lina/);
});

test("missing package page renders SSR message before enhancement", async () => {
  const html = await fetchHtml("/package-tests/missing-package");
  assert.match(html, /Missing Package Demo/);
  assert.match(html, /use-client-enhancement="missing-package-demo"/);
  assert.match(html, /friendly error message/i);
});
