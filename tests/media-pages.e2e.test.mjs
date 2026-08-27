import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import test from "node:test";

const cwd = process.cwd();
const port = 3410;
const host = "127.0.0.1";
const baseUrl = `http://${host}:${port}`;
const serverEntry = path.join(cwd, ".output", "server", "index.mjs");
let serverProcess = null;
const VALID_PRELOAD_AS = new Set([
  "audio",
  "document",
  "embed",
  "fetch",
  "font",
  "image",
  "object",
  "script",
  "style",
  "track",
  "video",
  "worker",
]);

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

function getPreloadLinkAudit(html) {
  const preloadTags = html.match(/<link\b[^>]*\brel="preload"[^>]*>/gi) || [];
  return preloadTags.map((tag) => {
    const asMatch = tag.match(/\bas="([^"]*)"/i);
    const asValue = asMatch?.[1] ?? "";
    return {
      tag,
      asValue,
      hasAs: Boolean(asMatch),
    };
  });
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

test("direct static MP4 fixture is served as video without a transform function", async () => {
  const response = await fetch(`${baseUrl}/media-test/videos/sample-video.mp4`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^video\/mp4(?:;|$)/i);

  const body = await response.arrayBuffer();
  assert.ok(body.byteLength > 100_000, "Expected the real MP4 fixture, not an HTML/error response");
});

function getMediaCaseMarkup(html, id) {
  const marker = `data-media-case="${id}"`;
  const markerIndex = html.indexOf(marker);
  assert.notEqual(markerIndex, -1, `Missing media case ${id}`);
  const articleStart = html.lastIndexOf("<article", markerIndex);
  const articleEnd = html.indexOf("</article>", markerIndex);
  assert.notEqual(articleStart, -1, `Missing article start for ${id}`);
  assert.notEqual(articleEnd, -1, `Missing article end for ${id}`);
  return html.slice(articleStart, articleEnd + "</article>".length);
}

test("media matrix keeps labeled eager image and video cases eager", async () => {
  const html = await fetchHtml("/media");

  const eagerImage = getMediaCaseMarkup(html, "img-eager-no-placeholder");
  assert.match(eagerImage, /<img\b[^>]*\bloading="eager"/i);
  assert.doesNotMatch(eagerImage, /data-rx-lazy-image="true"/i);

  const eagerVideo = getMediaCaseMarkup(html, "video-eager-controls");
  assert.match(eagerVideo, /<video\b/i);
  assert.match(eagerVideo, /\bpreload="metadata"/i);
  assert.doesNotMatch(eagerVideo, /data-rx-lazy-video="true"/i);
});

test("video page renders one hero video with 3 click zones and control markers", async () => {
  const html = await fetchHtml("/media-test/video");
  const videoElements = html.match(/<video[^>]*data-resux-media="video"/g) || [];
  assert.equal(videoElements.length, 1, "Expected exactly one hero video on /media-test/video");
  assert.match(html, /data-resux-video-zone="left"/);
  assert.match(html, /data-resux-video-zone="center"/);
  assert.match(html, /data-resux-video-zone="right"/);
  assert.match(html, /data-rx-video-click-to-play="true"/);
  assert.match(html, /data-rx-video-double-click-fullscreen="true"/);
  assert.match(html, /data-rx-video-skip-controls="true"/);
  assert.match(html, /data-rx-lazy-video="true"/);
  assert.match(html, /data-rx-placeholder-active="true"/);
  assert.match(html, /data-rx-video-custom-controls="true"/);
  assert.match(html, /data-rx-video-controls-load="lazy"/);
  assert.match(html, /data-rx-video-icons-load="lazy"/);
  assert.match(html, /data-rx-video-native-controls="false"/);
});

test("hero video route renders one priority video with valid video preload", async () => {
  const html = await fetchHtml("/media-test/hero-video");
  const videoElements = html.match(/<video[^>]*data-resux-media="video"/g) || [];
  assert.equal(videoElements.length, 1, "Expected exactly one hero video on /media-test/hero-video");
  assert.match(html, /data-rx-video-hero="true"/);
  assert.match(html, /fetchpriority="high"/);
  assert.match(html, /rel="preload"/);
  assert.match(html, /as="video"/);
});

test("images page renders lazy and eager placeholder states", async () => {
  const html = await fetchHtml("/media-test/images");
  assert.match(html, /data-resux-img="loading"/);
  assert.match(html, /data-resux-img="idle"/);
  assert.match(html, /data-rx-placeholder-active="true"/);
  assert.match(html, /data-rx-lazy-image="true"/);
});

test("lcp page uses one priority hero image preload", async () => {
  const html = await fetchHtml("/media-test/lcp");
  const imageMarkers = html.match(/data-resux-media="img"/g) || [];
  assert.equal(imageMarkers.length, 1, "Expected exactly one image on /media-test/lcp");
  assert.match(html, /fetchpriority="high"/);
  assert.match(html, /loading="eager"/);
  assert.match(html, /data-resux-img="loading"/);
  assert.match(html, /rel="preload"/);
  assert.match(html, /as="image"/);
  assert.match(html, /imagesrcset="/);
  assert.match(html, /imagesizes="/);
});

test("generated preload links use valid lowercase as values", async () => {
  const routes = [
    "/media-test/video",
    "/media-test/hero-video",
    "/media-test/images",
    "/media-test/lcp",
    "/package-tests/swiper",
    "/package-tests/chart",
    "/package-tests/missing-package",
  ];

  for (const routePath of routes) {
    const html = await fetchHtml(routePath);
    const audit = getPreloadLinkAudit(html);
    for (const item of audit) {
      assert.equal(
        item.hasAs,
        true,
        `Missing as attribute on preload tag for ${routePath}: ${item.tag}`,
      );
      assert.equal(
        item.asValue,
        item.asValue.toLowerCase(),
        `Preload as is not lowercase on ${routePath}: ${item.tag}`,
      );
      assert.equal(
        VALID_PRELOAD_AS.has(item.asValue),
        true,
        `Invalid preload as="${item.asValue}" on ${routePath}: ${item.tag}`,
      );
    }
  }
});
