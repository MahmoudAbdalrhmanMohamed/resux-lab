import { access, copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "public", "media-test");
const imagesDir = path.join(outputDir, "images");
const videosDir = path.join(outputDir, "videos");

await mkdir(imagesDir, { recursive: true });
await mkdir(videosDir, { recursive: true });

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function makeSceneSvg({
  width,
  height,
  title,
  subtitle,
  colorA,
  colorB,
  stripeColor,
  checkerColor,
  checkerSize,
  glowColor,
}) {
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);
  const stripePath = `M 0 ${height * 0.7} C ${width * 0.2} ${height * 0.55}, ${width * 0.4} ${height * 0.85}, ${width * 0.62} ${height * 0.7} C ${width * 0.8} ${height * 0.58}, ${width * 0.94} ${height * 0.9}, ${width} ${height * 0.76} V ${height} H 0 Z`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colorA}"/>
      <stop offset="100%" stop-color="${colorB}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.18" cy="0.16" r="0.8">
      <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="${glowColor}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="checker" width="${checkerSize}" height="${checkerSize}" patternUnits="userSpaceOnUse">
      <rect width="${checkerSize}" height="${checkerSize}" fill="transparent"/>
      <rect width="${checkerSize / 2}" height="${checkerSize / 2}" fill="${checkerColor}"/>
      <rect x="${checkerSize / 2}" y="${checkerSize / 2}" width="${checkerSize / 2}" height="${checkerSize / 2}" fill="${checkerColor}"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#checker)" opacity="0.22"/>
  <circle cx="${width * 0.14}" cy="${height * 0.2}" r="${Math.max(width, height) * 0.22}" fill="url(#glow)"/>
  <path d="${stripePath}" fill="${stripeColor}" opacity="0.92"/>
  <rect x="${width * 0.06}" y="${height * 0.08}" width="${width * 0.88}" height="${height * 0.84}" rx="${Math.max(12, width * 0.03)}" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="${Math.max(2, width * 0.0022)}"/>
  <text x="${width * 0.08}" y="${height * 0.2}" fill="#f8fafc" font-family="Segoe UI, Arial, sans-serif" font-size="${Math.max(24, width * 0.045)}" font-weight="800">${safeTitle}</text>
  <text x="${width * 0.08}" y="${height * 0.3}" fill="#e2e8f0" font-family="Segoe UI, Arial, sans-serif" font-size="${Math.max(16, width * 0.024)}">${safeSubtitle}</text>
  <text x="${width * 0.08}" y="${height * 0.9}" fill="#cbd5e1" font-family="Consolas, monospace" font-size="${Math.max(13, width * 0.014)}">Resux media quality test asset</text>
</svg>
`.trim();
}

async function saveRaster(svg, targetPath, options) {
  let pipeline = sharp(Buffer.from(svg));
  if (options.type === "jpg") {
    pipeline = pipeline.jpeg({
      quality: options.quality ?? 96,
      chromaSubsampling: "4:4:4",
      mozjpeg: false,
    });
  } else if (options.type === "png") {
    pipeline = pipeline.png({
      compressionLevel: options.compressionLevel ?? 6,
      adaptiveFiltering: true,
    });
  }
  await pipeline.toFile(targetPath);
}

const imageSpecs = [
  {
    file: "hero-large.jpg",
    width: 2200,
    height: 1467,
    type: "jpg",
    quality: 97,
    title: "Hero Large JPG",
    subtitle: "High detail gradients and patterned texture",
    colorA: "#042f2e",
    colorB: "#0f172a",
    stripeColor: "#0ea5e9",
    checkerColor: "rgba(255,255,255,0.15)",
    checkerSize: 44,
    glowColor: "#22d3ee",
  },
  {
    file: "hero-large.png",
    width: 2200,
    height: 1467,
    type: "png",
    title: "Hero Large PNG",
    subtitle: "Same scene encoded lossless for comparison",
    colorA: "#1f2937",
    colorB: "#312e81",
    stripeColor: "#f59e0b",
    checkerColor: "rgba(255,255,255,0.14)",
    checkerSize: 42,
    glowColor: "#fbbf24",
  },
  {
    file: "hero-wide.jpg",
    width: 2400,
    height: 1080,
    type: "jpg",
    quality: 96,
    title: "Wide Frame",
    subtitle: "2.22:1 panoramic test image",
    colorA: "#0f172a",
    colorB: "#14532d",
    stripeColor: "#22c55e",
    checkerColor: "rgba(255,255,255,0.12)",
    checkerSize: 38,
    glowColor: "#4ade80",
  },
  {
    file: "hero-square.jpg",
    width: 1400,
    height: 1400,
    type: "jpg",
    quality: 97,
    title: "Square Frame",
    subtitle: "1:1 crop stress test for responsive cards",
    colorA: "#1e293b",
    colorB: "#7c2d12",
    stripeColor: "#fb7185",
    checkerColor: "rgba(255,255,255,0.13)",
    checkerSize: 36,
    glowColor: "#fda4af",
  },
  {
    file: "small-thumb.jpg",
    width: 360,
    height: 240,
    type: "jpg",
    quality: 95,
    title: "Thumb",
    subtitle: "Small baseline image",
    colorA: "#0f172a",
    colorB: "#334155",
    stripeColor: "#38bdf8",
    checkerColor: "rgba(255,255,255,0.16)",
    checkerSize: 16,
    glowColor: "#67e8f9",
  },
  {
    file: "sample-poster.jpg",
    width: 1280,
    height: 720,
    type: "jpg",
    quality: 96,
    title: "Resux Video Poster",
    subtitle: "Poster frame used by ResuxVideo examples",
    colorA: "#082f49",
    colorB: "#1e1b4b",
    stripeColor: "#a78bfa",
    checkerColor: "rgba(255,255,255,0.13)",
    checkerSize: 28,
    glowColor: "#c4b5fd",
  },
  {
    file: "custom-placeholder.jpg",
    width: 1280,
    height: 720,
    type: "jpg",
    quality: 94,
    title: "Custom Placeholder",
    subtitle: "Used to validate placeholder image override",
    colorA: "#111827",
    colorB: "#134e4a",
    stripeColor: "#2dd4bf",
    checkerColor: "rgba(255,255,255,0.11)",
    checkerSize: 24,
    glowColor: "#5eead4",
  },
  {
    file: "resux-placeholder.jpg",
    width: 1280,
    height: 720,
    type: "jpg",
    quality: 94,
    title: "Resux Placeholder",
    subtitle: "Fallback visual for media loading states",
    colorA: "#0f172a",
    colorB: "#1d4ed8",
    stripeColor: "#60a5fa",
    checkerColor: "rgba(255,255,255,0.12)",
    checkerSize: 24,
    glowColor: "#93c5fd",
  },
];

for (const spec of imageSpecs) {
  const svg = makeSceneSvg(spec);
  await saveRaster(svg, path.join(imagesDir, spec.file), spec);
}

const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="980" height="340" viewBox="0 0 980 340">
  <defs>
    <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#14b8a6"/>
    </linearGradient>
  </defs>
  <rect x="24" y="24" width="932" height="292" rx="36" fill="rgba(15,23,42,0.7)" stroke="rgba(148,163,184,0.55)" stroke-width="6"/>
  <g transform="translate(84 72)">
    <path d="M0 72 C0 34 34 0 72 0 C110 0 144 34 144 72 C144 110 110 144 72 144 C34 144 0 110 0 72 Z" fill="url(#logoGrad)"/>
    <path d="M46 48 L96 72 L46 96 Z" fill="#0f172a"/>
  </g>
  <text x="282" y="154" fill="#f8fafc" font-family="Segoe UI, Arial, sans-serif" font-size="86" font-weight="800">Resux</text>
  <text x="282" y="226" fill="#cbd5e1" font-family="Segoe UI, Arial, sans-serif" font-size="36">Transparent PNG fallback test</text>
</svg>
`.trim();

await sharp(Buffer.from(logoSvg))
  .png({ compressionLevel: 6, adaptiveFiltering: true })
  .toFile(path.join(imagesDir, "transparent-logo.png"));

const defaultPlaceholderSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#bg)"/>
  <g transform="translate(130 84)" fill="none" stroke="#22d3ee" stroke-width="8" stroke-linecap="round">
    <path d="M0 0h140v120H0z"/>
    <path d="M170 0h140v120H170z"/>
    <path d="M68 38l70 22-70 22"/>
  </g>
  <text x="320" y="286" fill="#e2e8f0" font-family="Segoe UI, Arial, sans-serif" font-size="36" text-anchor="middle">Resux Placeholder</text>
</svg>
`.trim();

async function firstExisting(candidates) {
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {}
  }
  return null;
}

const providedLogo = await firstExisting([
  path.resolve(rootDir, "..", "reusx-docs", "docs", "public", "logo-mark.svg"),
  path.resolve(rootDir, "..", "resux-docs", "docs", "public", "logo-mark.svg"),
  path.resolve(rootDir, "logo-mark.svg"),
]);

if (providedLogo) {
  await copyFile(providedLogo, path.join(imagesDir, "resux-placeholder.svg"));
  await copyFile(providedLogo, path.join(rootDir, "public", "resux-placeholder.svg"));
} else {
  await writeFile(path.join(imagesDir, "resux-placeholder.svg"), `${defaultPlaceholderSvg}\n`, "utf8");
  await writeFile(path.join(rootDir, "public", "resux-placeholder.svg"), `${defaultPlaceholderSvg}\n`, "utf8");
}

await sharp(path.join(imagesDir, "sample-poster.jpg"))
  .jpeg({ quality: 95, chromaSubsampling: "4:4:4", mozjpeg: false })
  .toFile(path.join(videosDir, "sample-poster.jpg"));

await sharp(path.join(imagesDir, "custom-placeholder.jpg"))
  .jpeg({ quality: 93, chromaSubsampling: "4:4:4", mozjpeg: false })
  .toFile(path.join(videosDir, "placeholder.jpg"));

try {
  await copyFile(
    path.join(videosDir, "sample-video.mp4"),
    path.join(videosDir, "sample-video-alt.mp4"),
  );
  await copyFile(
    path.join(videosDir, "sample-video.mp4"),
    path.join(videosDir, "sample-video-lazy.mp4"),
  );
} catch {
  // sample-video.mp4 is committed manually; keep the script resilient when it is missing.
}

await writeFile(
  path.join(videosDir, ".keep"),
  "This directory stores local test videos for ResuxVideo.\n",
  "utf8",
);

console.log(`Created media-test image assets in ${imagesDir}`);
