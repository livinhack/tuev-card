#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const isFullCardRoot = existsSync(resolve(root, "src/tuev-card-entry.js"));
const publicApiPath = isFullCardRoot
  ? "src/plate/lab-renderer/plate-public-api.js"
  : "src/plate/plate-public-api.js";
const adapterPath = "src/plate/lab-renderer-adapter.js";
const rendererPath = "src/plate/renderer.js";
const labRoot = dirname(publicApiPath).replaceAll("\\", "/");

const expectedPublicApiTargets = [
  `${labRoot}/plate-rules.js`,
  `${labRoot}/text-utils.js`,
  `${labRoot}/plate-render-shell.js`,
  `${labRoot}/plate-svg-renderer.js`
];

const expectedExports = [
  "PLATE_TEXT_COLORS_MM",
  "WIDTH_BANDS",
  "TWO_LINE_WIDTH_BANDS",
  "TWO_LINE_WIDTH_RULES",
  "SPACING_RULES_MM",
  "FONT_CALIBRATION_PROFILES_MM",
  "DXF_REFERENCE_MM",
  "ONE_LINE_RULES_MM",
  "TWO_LINE_RULES_MM",
  "MOTORCYCLE_RULES_MM",
  "REDUCED_TWO_LINE_RULES_MM",
  "resolvePlateRules",
  "parsePlate",
  "getCharacterBand",
  "getCanvasMm",
  "resolvePlateFontMode",
  "buildPlateModelMm",
  "renderPlateSvgMm",
  "renderPlateSvg"
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

function resolveImport(fromFile, specifier) {
  const clean = String(specifier || "").split("?")[0];
  if (!clean.startsWith(".")) return null;
  let target = normalize(join(dirname(fromFile), clean)).replaceAll("\\", "/");
  if (!extname(target)) target += ".js";
  return target;
}

function importsFor(file) {
  const text = read(file);
  const result = [];
  const importRe = /(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/g;
  let match;
  while ((match = importRe.exec(text))) {
    const target = resolveImport(file, match[1]);
    if (target) result.push(target);
  }
  return [...new Set(result)].sort();
}

assert(existsSync(resolve(root, publicApiPath)), `Missing Lab public API boundary: ${publicApiPath}`);

if (existsSync(resolve(root, publicApiPath))) {
  const publicApi = read(publicApiPath);
  const publicApiImports = importsFor(publicApiPath);
  const unexpectedPublicApiImports = publicApiImports.filter((target) => !expectedPublicApiTargets.includes(target));
  const missingPublicApiImports = expectedPublicApiTargets.filter((target) => !publicApiImports.includes(target));

  assert(unexpectedPublicApiImports.length === 0, `Lab public API must only delegate to established renderer/rules helpers, got: ${unexpectedPublicApiImports.join(", ")}`);
  assert(missingPublicApiImports.length === 0, `Lab public API is missing established public delegation target(s): ${missingPublicApiImports.join(", ")}`);

  for (const exportName of expectedExports) {
    assert(publicApi.includes(exportName), `Lab public API must keep stable export: ${exportName}`);
  }

  for (const forbidden of [
    "../",
    "src/editor/",
    "tuev-card-entry",
    "lab-renderer-adapter",
    "font.js",
    "#1ea5ff",
    "legacyRenderer",
    "useLegacy",
    "fallbackRenderer"
  ]) {
    assert(!publicApi.includes(forbidden), `Lab public API must stay Card-free and legacy-free; found forbidden fragment: ${forbidden}`);
  }

  assert(!publicApi.includes("function "), "Lab public API must stay a declarative export boundary, not grow executable renderer logic.");
  assert(!publicApi.includes("const "), "Lab public API must stay a declarative export boundary, not grow local state/defaults.");
}

if (isFullCardRoot) {
  assert(existsSync(resolve(root, adapterPath)), `Missing Card adapter: ${adapterPath}`);
  assert(existsSync(resolve(root, rendererPath)), `Missing Card renderer entry: ${rendererPath}`);

  const adapterImports = importsFor(adapterPath);
  assert(adapterImports.includes(publicApiPath), "Card adapter must enter Lab renderer internals only through plate-public-api.js.");

  const badConsumers = [];
  for (const file of listJsFiles("src")) {
    if (file === publicApiPath || file === adapterPath || file.startsWith(`${labRoot}/`)) continue;
    for (const target of importsFor(file)) {
      if (target.startsWith(`${labRoot}/`)) badConsumers.push(`${file} -> ${target}`);
    }
  }
  assert(badConsumers.length === 0, `Card-facing source must not bypass the Lab public API: ${badConsumers.join("; ")}`);
} else {
  assert(!existsSync(resolve(root, adapterPath)), "Standalone Lab must not gain the Card-only adapter boundary.");
  const publicApiImports = importsFor(publicApiPath);
  for (const target of publicApiImports) {
    assert(target.startsWith("src/plate/"), `Standalone Lab public API must only expose local plate modules, got: ${target}`);
  }
}

if (!process.exitCode) {
  const mode = isFullCardRoot ? "Full/Card" : "Standalone Lab";
  console.log(`${mode} Lab public API boundary audit OK: public API remains the single stable Lab entry and contains no Card/legacy logic.`);
}

if (process.exitCode) process.exit(process.exitCode);
