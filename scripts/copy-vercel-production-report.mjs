import { cp, copyFile, mkdir, readdir, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, ".resux", "halal-report.json");
const functionsDir = path.join(root, ".vercel", "output", "functions");
const require = createRequire(path.join(root, "package.json"));
const resuxPackageJson = require.resolve("resuxjs/package.json");
const resuxPackageRoot = path.dirname(resuxPackageJson);
const resuxDistRoot = path.join(resuxPackageRoot, "dist");

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(functionsDir))) {
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    throw new Error("Vercel build output is missing .vercel/output/functions.");
  }
  console.log("[resux-lab] No Vercel function output detected; serverless runtime hotfix skipped.");
  process.exit(0);
}

if (!(await exists(source))) {
  throw new Error(
    "Resux production report is missing at .resux/halal-report.json. Ensure RESUX_HALAL_REPORT_SIGNING_SECRET is configured during the build.",
  );
}

if (!(await exists(resuxDistRoot))) {
  throw new Error(
    `Installed resuxjs runtime is missing its dist directory at ${resuxDistRoot}.`,
  );
}

const entries = await readdir(functionsDir, { withFileTypes: true });
const functionEntries = entries.filter(
  (entry) => entry.name.endsWith(".func") && (entry.isDirectory() || entry.isSymbolicLink()),
);

if (!functionEntries.length) {
  throw new Error("Vercel build output contains no .func runtime directories.");
}

for (const entry of functionEntries) {
  const functionRoot = path.join(functionsDir, entry.name);
  const reportTargetDir = path.join(functionRoot, ".resux");
  await mkdir(reportTargetDir, { recursive: true });
  await copyFile(source, path.join(reportTargetDir, "halal-report.json"));

  const resuxTargetRoot = path.join(functionRoot, "node_modules", "resuxjs");
  await mkdir(resuxTargetRoot, { recursive: true });
  await copyFile(resuxPackageJson, path.join(resuxTargetRoot, "package.json"));
  await cp(resuxDistRoot, path.join(resuxTargetRoot, "dist"), {
    recursive: true,
    force: true,
    dereference: true,
  });

  const requiredRuntimeFiles = [
    path.join(resuxTargetRoot, "dist", "index.js"),
    path.join(resuxTargetRoot, "dist", "node.js"),
  ];
  for (const runtimeFile of requiredRuntimeFiles) {
    if (!(await exists(runtimeFile))) {
      throw new Error(`Vercel runtime hotfix failed to package ${runtimeFile}.`);
    }
  }
}

console.log(
  `[resux-lab] Copied the signed production report and Resux runtime into ${functionEntries.length} Vercel function runtime(s).`,
);
