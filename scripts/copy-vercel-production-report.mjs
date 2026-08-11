import { cp, copyFile, mkdir, readFile, readdir, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, ".resux", "halal-report.json");
const serverDir = path.join(root, ".resux", "server");
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

function packageNameFromSpecifier(specifier) {
  if (
    !specifier ||
    specifier.startsWith(".") ||
    specifier.startsWith("/") ||
    specifier.startsWith("#") ||
    specifier.startsWith("node:") ||
    specifier.startsWith("data:") ||
    specifier.startsWith("file:")
  ) {
    return null;
  }

  if (specifier.startsWith("@")) {
    const [scope, name] = specifier.split("/");
    return scope && name ? `${scope}/${name}` : null;
  }

  return specifier.split("/")[0] || null;
}

async function walkFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

async function findServerRuntimePackages() {
  if (!(await exists(serverDir))) {
    throw new Error("Resux server output is missing at .resux/server.");
  }

  const packages = new Set();
  const files = (await walkFiles(serverDir)).filter((file) => /\.(?:mjs|js|cjs)$/.test(file));
  const staticImportPattern = /(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;
  const dynamicImportPattern = /import\(\s*["']([^"']+)["']\s*\)/g;

  for (const file of files) {
    const code = await readFile(file, "utf8");
    for (const pattern of [staticImportPattern, dynamicImportPattern]) {
      pattern.lastIndex = 0;
      for (let match = pattern.exec(code); match; match = pattern.exec(code)) {
        const packageName = packageNameFromSpecifier(match[1]);
        if (packageName && packageName !== "resuxjs") {
          packages.add(packageName);
        }
      }
    }
  }

  return packages;
}

async function findPackageJsonFromEntry(packageName, entryPath) {
  let current = path.dirname(entryPath);
  const filesystemRoot = path.parse(current).root;

  while (current !== filesystemRoot) {
    const candidate = path.join(current, "package.json");
    if (await exists(candidate)) {
      try {
        const manifest = JSON.parse(await readFile(candidate, "utf8"));
        if (manifest?.name === packageName) {
          return candidate;
        }
      } catch {
        // Ignore malformed unrelated package manifests while walking upward.
      }
    }
    current = path.dirname(current);
  }

  return null;
}

async function resolvePackage(packageName, optional = false) {
  let packageJsonPath;

  try {
    packageJsonPath = require.resolve(`${packageName}/package.json`);
  } catch {
    try {
      const entryPath = require.resolve(packageName);
      packageJsonPath = await findPackageJsonFromEntry(packageName, entryPath);
    } catch (error) {
      if (optional) {
        return null;
      }
      throw new Error(
        `Vercel runtime packaging could not resolve required package "${packageName}" from the app.`,
        { cause: error },
      );
    }
  }

  if (!packageJsonPath) {
    if (optional) {
      return null;
    }
    throw new Error(`Vercel runtime packaging could not locate package.json for "${packageName}".`);
  }

  const manifest = JSON.parse(await readFile(packageJsonPath, "utf8"));
  return {
    name: packageName,
    packageJsonPath,
    packageRoot: path.dirname(packageJsonPath),
    manifest,
  };
}

async function collectRuntimePackageClosure(seedPackages) {
  const packages = new Map();
  const queue = [...seedPackages].map((name) => ({ name, optional: false }));

  while (queue.length) {
    const item = queue.shift();
    if (!item || packages.has(item.name) || item.name === "resuxjs") {
      continue;
    }

    const resolved = await resolvePackage(item.name, item.optional);
    if (!resolved) {
      continue;
    }
    packages.set(item.name, resolved);

    for (const dependencyName of Object.keys(resolved.manifest.dependencies || {})) {
      if (!packages.has(dependencyName)) {
        queue.push({ name: dependencyName, optional: false });
      }
    }
    for (const dependencyName of Object.keys(resolved.manifest.optionalDependencies || {})) {
      if (!packages.has(dependencyName)) {
        queue.push({ name: dependencyName, optional: true });
      }
    }
    for (const dependencyName of Object.keys(resolved.manifest.peerDependencies || {})) {
      if (!packages.has(dependencyName)) {
        queue.push({ name: dependencyName, optional: true });
      }
    }
  }

  return packages;
}

async function copyRuntimePackage(functionRoot, packageInfo) {
  const targetRoot = path.join(functionRoot, "node_modules", ...packageInfo.name.split("/"));
  await mkdir(path.dirname(targetRoot), { recursive: true });
  await cp(packageInfo.packageRoot, targetRoot, {
    recursive: true,
    force: true,
    dereference: true,
  });
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

const serverRuntimePackages = await findServerRuntimePackages();
const runtimePackageClosure = await collectRuntimePackageClosure(serverRuntimePackages);

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

  for (const packageInfo of runtimePackageClosure.values()) {
    await copyRuntimePackage(functionRoot, packageInfo);
  }

  const requiredRuntimeFiles = [
    path.join(resuxTargetRoot, "dist", "index.js"),
    path.join(resuxTargetRoot, "dist", "node.js"),
  ];
  for (const runtimeFile of requiredRuntimeFiles) {
    if (!(await exists(runtimeFile))) {
      throw new Error(`Vercel runtime hotfix failed to package ${runtimeFile}.`);
    }
  }

  for (const packageName of serverRuntimePackages) {
    const packageTarget = path.join(functionRoot, "node_modules", ...packageName.split("/"));
    if (!(await exists(packageTarget))) {
      throw new Error(`Vercel runtime hotfix failed to package required server dependency "${packageName}".`);
    }
  }
}

const packagedNames = [...runtimePackageClosure.keys()].sort();
console.log(
  `[resux-lab] Copied the signed production report, Resux runtime, and ${packagedNames.length} server dependency package(s) into ${functionEntries.length} Vercel function runtime(s): ${packagedNames.join(", ") || "none"}.`,
);
