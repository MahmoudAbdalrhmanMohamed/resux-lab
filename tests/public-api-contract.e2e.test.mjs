import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);

const publicEntrypoints = [
  "resuxjs",
  "resuxjs/node",
  "resuxjs/globals",
  "resuxjs/runtime",
  "resuxjs/runtime/core",
  "resuxjs/runtime/router",
  "resuxjs/runtime/reactivity",
  "resuxjs/runtime/resume",
  "resuxjs/runtime/streaming",
  "resuxjs/reactivity",
  "resuxjs/compiler",
  "resuxjs/build",
  "resuxjs/create",
  "resuxjs/i18n",
  "resuxjs/ui",
  "resuxjs/icons",
  "resuxjs/fonts",
  "resuxjs/kit",
  "resuxjs/core",
  "resuxjs/halal",
];

test("lab is locked to the current Resux public beta", () => {
  const manifest = require("resuxjs/package.json");
  assert.equal(manifest.version, "0.4.0-beta.2");
});

for (const specifier of publicEntrypoints) {
  test(`public entrypoint ${specifier} imports successfully`, async () => {
    const imported = await import(specifier);
    assert.ok(imported && typeof imported === "object", `${specifier} should expose an ES module namespace`);
  });
}
