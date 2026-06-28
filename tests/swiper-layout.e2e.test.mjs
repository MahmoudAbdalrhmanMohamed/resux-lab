import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import test from "node:test";
import { chromium } from "playwright";

const cwd = process.cwd();
const port = 3412;
const host = "127.0.0.1";
const baseUrl = `http://${host}:${port}`;
const serverEntry = path.join(cwd, ".output", "server", "index.mjs");
let serverProcess = null;

async function waitForServerReady() {
  for (let attempt = 0; attempt < 80; attempt++) {
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

test("swiper progressive enhancement stays layout-stable and becomes active", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    await page.goto(`${baseUrl}/package-tests/swiper`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('[data-rx-package-demo="swiper"]');

    const before = await page.evaluate(() => {
      const shell = document.querySelector(".rx-swiper-shell");
      const anchor = document.querySelector("[data-rx-swiper-anchor]");
      const shellRect = shell?.getBoundingClientRect();
      const anchorRect = anchor?.getBoundingClientRect();
      return {
        shellHeight: shellRect?.height ?? 0,
        anchorTop: anchorRect?.top ?? 0,
        pageClientWidth: document.documentElement.clientWidth,
        pageScrollWidth: document.documentElement.scrollWidth,
      };
    });

    await page.waitForFunction(() => {
      const packageStatus = document.querySelector("[data-rx-package-status]")?.textContent?.trim() ?? "";
      const active = document.querySelector('[data-rx-swiper-status="active"]')?.textContent?.trim() ?? "";
      return active === "true" || packageStatus.startsWith("error");
    }, null, { timeout: 25000 });

    const after = await page.evaluate(() => {
      const shell = document.querySelector(".rx-swiper-shell");
      const anchor = document.querySelector("[data-rx-swiper-anchor]");
      const shellRect = shell?.getBoundingClientRect();
      const anchorRect = anchor?.getBoundingClientRect();
      const activeIndex = Array.from(document.querySelectorAll(".swiper .swiper-slide"))
        .findIndex((item) => item.classList.contains("swiper-slide-active"));
      return {
        status: document.querySelector("[data-rx-package-status]")?.textContent?.trim() ?? "",
        active: document.querySelector('[data-rx-swiper-status="active"]')?.textContent?.trim() ?? "",
        js: document.querySelector('[data-rx-swiper-status="swiper-js"]')?.textContent?.trim() ?? "",
        css: document.querySelector('[data-rx-swiper-status="swiper-css"]')?.textContent?.trim() ?? "",
        cleanup: document.querySelector('[data-rx-swiper-status="cleanup"]')?.textContent?.trim() ?? "",
        shellHeight: shellRect?.height ?? 0,
        anchorTop: anchorRect?.top ?? 0,
        pageClientWidth: document.documentElement.clientWidth,
        pageScrollWidth: document.documentElement.scrollWidth,
        activeIndex,
      };
    });

    assert.equal(after.status.startsWith("error"), false, `Swiper enhancement failed: ${after.status}`);
    assert.equal(after.active, "true");
    assert.equal(after.js, "true");
    assert.equal(after.css, "true");
    assert.equal(after.cleanup, "true");
    const textButtonNavigation = await page.evaluate(() => {
      const prev = document.querySelector(".swiper-button-prev");
      const next = document.querySelector(".swiper-button-next");
      return {
        prevText: prev?.textContent?.trim() ?? "",
        nextText: next?.textContent?.trim() ?? "",
        prevIcons: prev?.querySelectorAll(".swiper-navigation-icon").length ?? 0,
        nextIcons: next?.querySelectorAll(".swiper-navigation-icon").length ?? 0,
      };
    });
    assert.equal(textButtonNavigation.prevText, "Prev");
    assert.equal(textButtonNavigation.nextText, "Next");
    assert.equal(textButtonNavigation.prevIcons, 0, "Prev text button should not keep injected Swiper icon.");
    assert.equal(textButtonNavigation.nextIcons, 0, "Next text button should not keep injected Swiper icon.");

    const shellDelta = Math.abs(after.shellHeight - before.shellHeight);
    const anchorDelta = Math.abs(after.anchorTop - before.anchorTop);
    assert.ok(shellDelta <= 12, `Carousel shell height shifted too much: ${shellDelta}px`);
    assert.ok(anchorDelta <= 12, `Content below carousel shifted too much: ${anchorDelta}px`);
    assert.ok(
      after.pageScrollWidth <= after.pageClientWidth + 2,
      `Desktop page overflowed horizontally (${after.pageScrollWidth} > ${after.pageClientWidth})`,
    );

    const indexBeforeNext = after.activeIndex;
    await page.click(".swiper-button-next");
    await page.waitForTimeout(350);
    const indexAfterNext = await page.evaluate(() => Array.from(document.querySelectorAll(".swiper .swiper-slide"))
      .findIndex((item) => item.classList.contains("swiper-slide-active")));
    assert.notEqual(indexAfterNext, indexBeforeNext, "Next button did not move the active slide.");
    const iconsAfterNavigate = await page.evaluate(() => ({
      prevIcons: document.querySelector(".swiper-button-prev")?.querySelectorAll(".swiper-navigation-icon").length ?? 0,
      nextIcons: document.querySelector(".swiper-button-next")?.querySelectorAll(".swiper-navigation-icon").length ?? 0,
    }));
    assert.equal(iconsAfterNavigate.prevIcons, 0, "Prev button should not get icon reinjected after navigation.");
    assert.equal(iconsAfterNavigate.nextIcons, 0, "Next button should not get icon reinjected after navigation.");

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobile.goto(`${baseUrl}/package-tests/swiper`, { waitUntil: "domcontentloaded" });
    await mobile.waitForFunction(
      () => document.querySelector('[data-rx-swiper-status="active"]')?.textContent?.trim() === "true",
      null,
      { timeout: 25000 },
    );
    const mobileOverflow = await mobile.evaluate(() => ({
      pageClientWidth: document.documentElement.clientWidth,
      pageScrollWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(
      mobileOverflow.pageScrollWidth <= mobileOverflow.pageClientWidth + 2,
      `Mobile page overflowed horizontally (${mobileOverflow.pageScrollWidth} > ${mobileOverflow.pageClientWidth})`,
    );
    await mobile.close();

    assert.deepEqual(consoleErrors, []);
  } finally {
    await browser.close();
  }
});
