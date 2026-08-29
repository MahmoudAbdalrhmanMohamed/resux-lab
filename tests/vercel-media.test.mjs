import assert from "node:assert/strict";
import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";

const originalCwd = process.cwd();
const vercelOutput = path.join(originalCwd, ".vercel", "output");
const functionsDir = path.join(vercelOutput, "functions");
const staticDir = path.join(vercelOutput, "static");

async function findFunctionRoot() {
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

function contentTypeForStaticFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".avif") return "image/avif";
  if (extension === ".mp4") return "video/mp4";
  if (extension === ".webm") return "video/webm";
  return "application/octet-stream";
}

async function serveStaticAsset(req, res, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    res.writeHead(400);
    res.end("Bad request");
    return true;
  }

  const filePath = path.resolve(staticDir, `.${decoded}`);
  if (!filePath.startsWith(staticDir + path.sep)) {
    res.writeHead(403);
    res.end("Forbidden");
    return true;
  }

  const fileStats = await stat(filePath).catch(() => null);
  if (!fileStats?.isFile()) {
    return false;
  }

  const body = await readFile(filePath);
  res.writeHead(200, {
    "content-type": contentTypeForStaticFile(filePath),
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
  assert.equal(existsSync(path.join(vercelOutput, "config.json")), true, "Missing .vercel/output/config.json");
  assert.equal(existsSync(staticDir), true, "Missing .vercel/output/static");

  const functionRoot = await findFunctionRoot();
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

  const sourceImage = path.join(staticDir, "media-test", "images", "hero-square.jpg");
  const sourceVideo = path.join(staticDir, "media-test", "videos", "sample-video.mp4");
  assert.equal(existsSync(sourceImage), true, "Vercel static output is missing the image fixture");
  assert.equal(existsSync(sourceVideo), true, "Vercel static output is missing the MP4 fixture");

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
        if (requestUrl.pathname.startsWith("/media-test/")) {
          const served = await serveStaticAsset(req, res, requestUrl.pathname);
          if (served) return;
        }
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
    assert.ok(body.byteLength > 1_000, "Expected transformed image bytes from the packaged Vercel function");

    assert.equal(
      existsSync(path.join(functionRoot, "public", "_resux", "generated", "images")),
      false,
      "Stateless Vercel media handling must not create a generated-media cache inside the function bundle",
    );
  } finally {
    if (server) await close(server);
    process.chdir(originalCwd);
  }
});
