import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, ".resux", "halal-report.json");
const functionsDir = path.join(root, ".vercel", "output", "functions");

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
  console.log("[resux-lab] No Vercel function output detected; signed production report copy skipped.");
  process.exit(0);
}

if (!(await exists(source))) {
  throw new Error(
    "Resux production report is missing at .resux/halal-report.json. Ensure RESUX_HALAL_REPORT_SIGNING_SECRET is configured during the build.",
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
}

console.log(
  `[resux-lab] Copied the signed production report into ${functionEntries.length} Vercel function runtime(s). Framework/server dependency packaging is owned by Resux.`,
);
