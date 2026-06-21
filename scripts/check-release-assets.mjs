import { existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceFontsDir = resolve(root, "fonts");
const distFontsDir = resolve(root, "dist/fonts");
const distBundle = resolve(root, "dist/tuev-card.js");
const binaryFontExtensions = new Set([".ttf", ".otf", ".woff", ".woff2"]);
const requiredCardFonts = [
  "GL-Nummernschild-Mtl.ttf",
  "GL-Nummernschild-Eng.ttf"
];

function toDisplayPath(path) {
  return relative(root, path).replace(/\\/g, "/");
}

function extensionOf(name) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot).toLowerCase() : "";
}

function collectFontBinaries(directory, prefix = "") {
  if (!existsSync(directory)) return [];

  const files = [];
  for (const entryName of readdirSync(directory)) {
    const path = join(directory, entryName);
    const stat = statSync(path);
    const relativeName = prefix ? `${prefix}/${entryName}` : entryName;

    if (stat.isDirectory()) {
      files.push(...collectFontBinaries(path, relativeName));
      continue;
    }

    if (binaryFontExtensions.has(extensionOf(entryName))) {
      files.push({ relativeName, path, size: stat.size });
    }
  }
  return files;
}

let hasError = false;
const sourceFonts = collectFontBinaries(sourceFontsDir);

if (!existsSync(distBundle)) {
  console.error("Release asset check failed: dist/tuev-card.js is missing. Run npm run build before npm run check.");
  hasError = true;
}

if (sourceFonts.length === 0) {
  console.warn("Release asset check: no local font binaries found in fonts/.");
  console.warn("This is expected for ChatGPT handover ZIPs, but a GitHub/HACS release needs the local font files before running npm run build.");
} else {
  console.log(`Release asset check: found ${sourceFonts.length} local font binary file(s) in fonts/.`);

  for (const font of sourceFonts) {
    const targetPath = resolve(distFontsDir, font.relativeName);

    if (!existsSync(targetPath)) {
      console.error(`Release asset check failed: ${toDisplayPath(targetPath)} is missing although ${toDisplayPath(font.path)} exists.`);
      console.error("Run npm run build with the local fonts present, then commit the mirrored dist/fonts files for HACS.");
      hasError = true;
      continue;
    }

    const targetSize = statSync(targetPath).size;
    if (targetSize !== font.size) {
      console.error(`Release asset check failed: ${toDisplayPath(targetPath)} size differs from ${toDisplayPath(font.path)}.`);
      console.error(`Source: ${font.size} bytes, dist: ${targetSize} bytes.`);
      hasError = true;
    }
  }
}

for (const fontName of requiredCardFonts) {
  const sourcePath = resolve(sourceFontsDir, fontName);
  const targetPath = resolve(distFontsDir, fontName);

  if (!existsSync(sourcePath)) {
    console.warn(`Release asset check: required Card font is not present locally: ${toDisplayPath(sourcePath)}`);
    console.warn("The graphical plate renderer will fall back in Home Assistant unless this font is present in the GitHub/HACS release.");
    continue;
  }

  if (!existsSync(targetPath)) {
    console.error(`Release asset check failed: required Card font was not mirrored to ${toDisplayPath(targetPath)}.`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

console.log("Release asset check passed.");
