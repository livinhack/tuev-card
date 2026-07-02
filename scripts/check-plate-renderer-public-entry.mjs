#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rendererPath = "src/plate/renderer.js";
const adapterPath = "src/plate/lab-renderer-adapter.js";
const expectedExports = [
  "checkPlateFontAvailable",
  "ensurePlateFont",
  "getPlateFontStatus",
  "isPlateFontLoaded",
  "normalizePlate",
  "getLicensePlateMetrics",
  "renderLicensePlate"
];

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

function listJsFiles(relativeDir) {
  const base = resolve(root, relativeDir);
  const result = [];
  function walk(absDir) {
    for (const entry of readdirSync(absDir, { withFileTypes: true })) {
      const abs = join(absDir, entry.name);
      if (entry.isDirectory()) walk(abs);
      else if (entry.isFile() && extname(entry.name) === ".js") {
        result.push(normalize(abs.slice(root.length + 1)).replaceAll("\\", "/"));
      }
    }
  }
  if (existsSync(base)) walk(base);
  return result.sort();
}

function importTargets(file) {
  const text = read(file);
  const targets = [];
  const importRe = /(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/g;
  let match;
  while ((match = importRe.exec(text))) {
    const clean = match[1].split("?")[0];
    if (!clean.startsWith(".")) continue;
    let target = normalize(join(dirname(file), clean)).replaceAll("\\", "/");
    if (!extname(target)) target += ".js";
    targets.push(target);
  }
  return targets.sort();
}

assert(existsSync(resolve(root, rendererPath)), `Missing public renderer entry: ${rendererPath}`);
assert(existsSync(resolve(root, adapterPath)), `Missing Card/Lab adapter: ${adapterPath}`);

const renderer = read(rendererPath);
const nonCommentLines = renderer
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("//"));

assert(nonCommentLines.length >= 2, "renderer.js must contain only comments plus its public export block.");
assert(nonCommentLines[0] === "export {", "renderer.js must start its executable content with a single public export block.");
assert(nonCommentLines.at(-1) === '} from "./lab-renderer-adapter.js?v=b355";', "renderer.js must delegate only to the b355 Card/Lab adapter cache boundary.");
assert(importTargets(rendererPath).length === 1 && importTargets(rendererPath)[0] === adapterPath, "renderer.js must import/re-export only lab-renderer-adapter.js.");

for (const name of expectedExports) {
  assert(renderer.includes(name), `renderer.js must keep public export ${name}.`);
}

const exportBlock = renderer.slice(renderer.indexOf("export {"), renderer.indexOf("} from"));
const exportedNames = exportBlock
  .replace("export {", "")
  .split(",")
  .map((part) => part.trim())
  .filter(Boolean);
assert(exportedNames.length === expectedExports.length, `renderer.js must expose exactly the established Card public API (${expectedExports.join(", ")}).`);
for (const name of exportedNames) {
  assert(expectedExports.includes(name), `Unexpected renderer.js public export: ${name}`);
}

for (const forbidden of [
  "buildPlateModelMm",
  "renderPlateSvgMm",
  "ONE_LINE_RULES_MM",
  "createLabRendererOptions",
  "renderLicensePlateWithLabRenderer",
  "./lab-renderer/",
  "./mm-model.js",
  "#1ea5ff",
  "placeholder",
  "legacyRenderer",
  "useLegacy"
]) {
  assert(!renderer.includes(forbidden), `renderer.js must stay geometry-free and legacy-free; found forbidden fragment: ${forbidden}`);
}

const cardEntry = read("src/tuev-card-entry.js");
const editor = read("src/editor/editor.js");
assert(cardEntry.includes('from "./plate/renderer.js?v=b355"'), "Card entry must consume the b355 public renderer cache boundary.");
assert(editor.includes('from "../plate/renderer.js?v=b355"'), "Editor must consume the b355 public renderer cache boundary.");

const files = listJsFiles("src");
const badConsumers = [];
for (const file of files) {
  if (file === rendererPath || file === adapterPath || file.startsWith("src/plate/lab-renderer/")) continue;
  for (const target of importTargets(file)) {
    if (target === adapterPath || target.startsWith("src/plate/lab-renderer/")) {
      badConsumers.push(`${file} -> ${target}`);
    }
  }
}
assert(badConsumers.length === 0, `Card-facing source must use renderer.js, not adapter/Lab internals: ${badConsumers.join("; ")}`);

if (!process.exitCode) {
  console.log("Plate renderer public entry cleanup OK: renderer.js is a thin b355 public boundary with the established Card API only.");
}

if (process.exitCode) process.exit(process.exitCode);
