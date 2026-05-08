import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const env = { ...process.env };
const vercelSignals = ["VERCEL", "VERCEL_ENV", "VERCEL_URL", "VERCEL_PROJECT_ID"];
const isVercelBuild = vercelSignals.some((key) => Boolean(env[key]));

if (isVercelBuild && !env.NITRO_PRESET) {
  env.NITRO_PRESET = "vercel";
}

console.log(
  `[build] isVercelBuild=${isVercelBuild} NITRO_PRESET=${env.NITRO_PRESET ?? "<unset>"} node=${process.version}`
);

const require = createRequire(import.meta.url);
const resuxPackagePath = require.resolve("resuxjs/package.json");
const resuxCliPath = path.join(path.dirname(resuxPackagePath), "dist", "cli.js");

const child = spawn(process.execPath, [resuxCliPath, "build", "."], {
  stdio: "inherit",
  env
});

child.on("error", (error) => {
  console.error("[build] failed to launch resux:", error);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (typeof code === "number") {
    process.exit(code);
  }

  console.error(`[build] exited by signal: ${signal ?? "unknown"}`);
  process.exit(1);
});
