import assert from "node:assert/strict";
import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { cp, lstat, mkdtemp, readFile, readdir, readlink, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";

const originalCwd = process.cwd();
const builtVercelOutput = path.join(originalCwd, ".vercel", "output");

function isInside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (
    relative !== ".."
    && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative)
  );
}

async function findFunctionRoot(functionsDir) {
  const entries = await readdir(functionsDir, { withFileTypes: true });
  const functionNames = entries
    .filter((entry) => entry.isDirectory() && entry.name.endsWith(".func"))
    .map((entry) => entry.name);

  assert.ok(functionNames.length > 0, "Expected Vercel Build Output API function directories");
  const preferred = functionNames.find((name) => name === "__fallback.func")
    ?? functionNames.find((name) => name === "[...].func")
    ?? functionNames[0];
  return path.join(functionsDir, preferred);
}

async function assertNoEscapingSymlinks(root) {
  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);
      const entryStats = await lstat(entryPath);

      if (entryStats.isSymbolicLink()) {
        const target = await readlink(entryPath);
        const resolvedTarget = path.resolve(path.dirname(entryPath), target);
        assert.equal(
          isInside(root, resolvedTarget),
          true,
          `Packaged Vercel function contains a symlink that escapes the function bundle: ${entryPath} -> ${target}`,
        );
        continue;
      }

      if (entryStats.isDirectory()) {
        await walk(entryPath);
      }
    }
  }

  await walk(root);
}

function assertNoAncestorNodeModules(functionRoot) {
  let current = path.dirname(functionRoot);
  while (true) {
    assert.equal(
      existsSync(path.join(current, "node_modules")),
      false,
      `Isolated Vercel function can still resolve dependencies from ancestor node_modules at ${current}`,
    );
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

async function serveStaticFixture(staticDir, res, pathname) {
  let filePath;
  let contentType;

  switch (pathname) {
    case "/media-test/images/hero-square.jpg":
      filePath = path.join(staticDir, "media-test", "images", "hero-square.jpg");
      contentType = "image/jpeg";
      break;
    case "/media-test/videos/sample-video.mp4":
      filePath = path.join(staticDir, "media-test", "videos", "sample-video.mp4");
      contentType = "video/mp4";
      break;
    default:
      return false;
  }

  const body = await readFile(filePath);
  res.writeHead(200, {
    "content-type": contentType,
    "content-length": String(body.byteLength),
  });
  res.end(body);
  return true;
}

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.ok(address && typeof address === "object");
  return `http://127.0.0.1:${address.port}`;
}

async function close(server) {
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
}

test("Vercel function serves cached generated media through the stateless path", async () => {
  assert.equal(existsSync(path.join(builtVercelOutput, "config.json")), true, "Missing .vercel/output/config.json");
  assert.equal(existsSync(path.join(builtVercelOutput, "static")), true, "Missing .vercel/output/static");

  const isolatedParent = await mkdtemp(path.join(os.tmpdir(), "resux-vercel-output-"));
  const vercelOutput = path.join(isolatedParent, "output");
  await cp(builtVercelOutput, vercelOutput, {
    recursive: true,
    force: true,
    verbatimSymlinks: true,
  });

  assert.equal(
    isInside(originalCwd, vercelOutput),
    false,
    "Vercel runtime fixture must live outside the repository checkout",
  );

  const functionsDir = path.join(vercelOutput, "functions");
  const staticDir = path.join(vercelOutput, "static");
  const functionRoot = await findFunctionRoot(functionsDir);
  const functionEntry = path.join(functionRoot, "index.mjs");

  assert.equal(existsSync(functionEntry), true, `Missing Vercel function entry ${functionEntry}`);
  assert.equal(
    existsSync(path.join(functionRoot, ".resux", "server", "manifest.mjs")),
    true,
    "Vercel function is missing the copied Resux server manifest",
  );
  assert.equal(
    existsSync(path.join(functionRoot, "node_modules", "resuxjs")),
    true,
    "Vercel function is missing the packaged Resux framework runtime",
  );

  await assertNoEscapingSymlinks(functionRoot);
  assertNoAncestorNodeModules(functionRoot);

  const sourceImage = path.join(staticDir, "media-test", "images", "hero-square.jpg");
  const sourceVideo = path.join(staticDir, "media-test", "videos", "sample-video.mp4");
  assert.equal(existsSync(sourceImage), true, "Vercel static output is missing the image fixture");
  assert.equal(existsSync(sourceVideo), true, "Vercel static output is missing the MP4 fixture");

  const previousVercel = process.env.VERCEL;
  const previousVercelEnv = process.env.VERCEL_ENV;
  process.env.VERCEL = "1";
  process.env.VERCEL_ENV = "preview";
  process.chdir(functionRoot);

  let server;
  try {
    const runtime = await import(`${pathToFileURL(functionEntry).href}?test=${Date.now()}`);
    const handler = runtime.default;
    assert.equal(typeof handler, "function", "Expected the Vercel function entry to export a default Node handler");

    server = createServer(async (req, res) => {
      try {
        const requestUrl = new URL(req.url ?? "/", "http://127.0.0.1");
        const served = await serveStaticFixture(staticDir, res, requestUrl.pathname);
        if (served) return;
        await handler(req, res);
      } catch (error) {
        if (!res.headersSent) {
          res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
        }
        if (!res.writableEnded) {
          res.end(error instanceof Error ? (error.stack ?? error.message) : String(error));
        }
      }
    });

    const baseUrl = await listen(server);

    const staticVideoResponse = await fetch(`${baseUrl}/media-test/videos/sample-video.mp4`);
    assert.equal(staticVideoResponse.status, 200);
    assert.match(staticVideoResponse.headers.get("content-type") ?? "", /^video\/mp4(?:;|$)/i);
    const staticVideoBody = await staticVideoResponse.arrayBuffer();
    assert.ok(staticVideoBody.byteLength > 100_000, "Expected the real MP4 fixture from Vercel static output");

    const generatedPath = "/_resux/generated/images/serverless-regression.webp";
    const generatedQuery = new URLSearchParams({
      src: "/media-test/images/hero-square.jpg",
      w: "320",
      f: "webp",
      q: "80",
      cache: "1d",
    });
    const response = await fetch(`${baseUrl}${generatedPath}?${generatedQuery}`);
    const body = await response.arrayBuffer();

    assert.equal(response.status, 200, `Expected serverless generated image request to succeed, got ${response.status}`);
    assert.match(response.headers.get("content-type") ?? "", /^image\/webp(?:;|$)/i);
    assert.equal(response.headers.get("x-resux-cache"), "stateless");
    assert.equal(response.headers.get("cache-control"), "public, max-age=86400, s-maxage=86400");
    assert.equal(response.headers.get("cdn-cache-control"), "public, max-age=86400");
    assert.equal(response.headers.get("vercel-cdn-cache-control"), "public, max-age=86400");
    assert.ok(body.byteLength > 1_000, "Expected transformed image bytes from the isolated Vercel function bundle");

    assert.equal(
      existsSync(path.join(functionRoot, "public", "_resux", "generated", "images")),
      false,
      "Stateless Vercel media handling must not create a generated-media cache inside the function bundle",
    );
  } finally {
    if (server) await close(server);
    process.chdir(originalCwd);
    if (previousVercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = previousVercel;
    if (previousVercelEnv === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previousVercelEnv;
    await rm(isolatedParent, { recursive: true, force: true });
  }
});
