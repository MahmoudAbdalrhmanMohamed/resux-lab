import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = new URL("..", import.meta.url).pathname;
const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

function collectFiles(dir, extensions, found = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      collectFiles(path, extensions, found);
    } else if (extensions.some((extension) => name.endsWith(extension))) {
      found.push(path);
    }
  }
  return found;
}

test("every `npm run <script>` mentioned in pages and the README exists in package.json", () => {
  const files = [join(root, "README.md"), ...collectFiles(join(root, "pages"), [".vue"])];
  const missing = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/npm run ([a-z][\w:-]*)/g)) {
      if (!manifest.scripts?.[match[1]]) {
        missing.push(`${file.slice(root.length)}: npm run ${match[1]}`);
      }
    }
  }
  assert.deepEqual(missing, []);
});

test("the perf script runs the perf smoke script that exists in scripts/", () => {
  assert.equal(manifest.scripts?.perf, "node scripts/perf-smoke.mjs");
});
