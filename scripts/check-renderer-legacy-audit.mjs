#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const isFullCardRoot = existsSync(resolve(root, "src/tuev-card-entry.js"));
const sourceRoot = isFullCardRoot ? "src" : "src";
const activeRendererPath = isFullCardRoot ? "src/plate/renderer.js" : "src/plate/plate-public-api.js";
const adapterPath = "src/plate/lab-renderer-adapter.js";

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
      if (entry.isDirectory()) {
        walk(abs);
      } else if (entry.isFile() && extname(entry.name) === ".js") {
        result.push(normalize(abs.slice(root.length + 1)).replaceAll("\\\\", "/"));
      }
    }
  }
  if (existsSync(base)) walk(base);
  return result.sort();
}

function resolveImport(fromFile, specifier) {
  const clean = String(specifier || "").split("?")[0];
  if (!clean.startsWith(".")) return null;
  let target = normalize(join(dirname(fromFile), clean)).replaceAll("\\\\", "/");
  if (!extname(target)) target += ".js";
  return target;
}

function collectImports(files) {
  const imports = new Map(files.map((file) => [file, new Set()]));
  const incoming = new Map(files.map((file) => [file, new Set()]));
  const importRe = /(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/g;

  for (const file of files) {
    const text = read(file);
    let match;
    while ((match = importRe.exec(text))) {
      const target = resolveImport(file, match[1]);
      if (!target) continue;
      imports.get(file).add(target);
      if (incoming.has(target)) incoming.get(target).add(file);
    }
  }

  return { imports, incoming };
}

const files = listJsFiles(sourceRoot);
const { imports, incoming } = collectImports(files);

assert(existsSync(resolve(root, activeRendererPath)), `Missing active renderer boundary: ${activeRendererPath}`);

if (isFullCardRoot) {
  assert(existsSync(resolve(root, adapterPath)), `Missing Card Lab adapter: ${adapterPath}`);
  const activeRenderer = read(activeRendererPath);
  const adapter = read(adapterPath);

  assert(activeRenderer.includes("./lab-renderer-adapter.js"), "Card renderer.js must only delegate to the Lab adapter boundary.");
  assert(!activeRenderer.includes("./mm-model.js"), "Card renderer.js must not import the old src/plate/mm-model.js path.");
  assert(adapter.includes("./lab-renderer/plate-public-api.js"), "Card Lab adapter must use the staged Lab public API.");

  const cardImports = [...(imports.get("src/tuev-card-entry.js") || [])];
  const editorImports = [...(imports.get("src/editor/editor.js") || [])];
  assert(cardImports.includes("src/plate/renderer.js"), "Card entry must consume only the public src/plate/renderer.js boundary.");
  assert(editorImports.includes("src/plate/renderer.js"), "Editor must consume only the public src/plate/renderer.js boundary.");

  assert(!existsSync(resolve(root, "src/plate/mm-model.js")), "Old unimported src/plate/mm-model.js must stay removed after b330.");
  const oldMmIncoming = incoming.get("src/plate/mm-model.js") || new Set();
  assert(oldMmIncoming.size === 0, "Removed old src/plate/mm-model.js must not be imported anywhere.");

  const forbiddenCardTargets = [
    "src/plate/lab-renderer/mm-model.js",
    "src/plate/lab-renderer/spacing-solver.js",
    "src/plate/lab-renderer/plate-lab-debug-renderers.js",
    "src/plate/lab-renderer/regression-cases.js"
  ];
  for (const target of forbiddenCardTargets) {
    const sources = incoming.get(target) || new Set();
    const badSources = [...sources].filter((source) => source.startsWith("src/tuev-card-entry") || source.startsWith("src/editor/") || source === "src/plate/renderer.js" || source === "src/plate/lab-renderer-adapter.js");
    assert(badSources.length === 0, `Card-facing boundary must not import Lab-only/compat target ${target}: ${badSources.join(", ")}`);
  }
} else {
  const publicApi = read(activeRendererPath);
  assert(publicApi.includes("./plate-svg-renderer.js"), "Standalone Lab public API must still use the active SVG renderer orchestrator.");
  assert(publicApi.includes("./plate-rules.js"), "Standalone Lab public API must still expose central plate rules.");

  const compatibilityBoundaries = ["src/plate/mm-model.js", "src/plate/spacing-solver.js"];
  for (const boundary of compatibilityBoundaries) {
    assert(existsSync(resolve(root, boundary)), `Compatibility boundary missing: ${boundary}`);
  }
}

const bluePlaceholderFiles = files.filter((file) => read(file).includes("#1ea5ff"));
const allowedBlueFragments = isFullCardRoot
  ? [
      "src/plate/lab-renderer/change-plate-supplement-renderer.js",
      "src/plate/lab-renderer/seal-slot-marker.js"
    ]
  : [
      "src/plate/change-plate-supplement-renderer.js",
      "src/plate/seal-slot-marker.js",
      "src/plate/debug-dimensions.js"
    ];
for (const file of bluePlaceholderFiles) {
  assert(allowedBlueFragments.includes(file), `Unexpected hardcoded old HU/debug blue in active source file: ${file}`);
}

if (!process.exitCode) {
  const mode = isFullCardRoot ? "Full/Card" : "Standalone Lab";
  const quarantine = isFullCardRoot
    ? "old src/plate/mm-model.js is removed and the active renderer remains Lab-based"
    : "compatibility boundaries remain present but outside the active render path";
  console.log(`${mode} renderer legacy audit OK: active boundary is Lab-based; ${quarantine}.`);
}

if (process.exitCode) process.exit(process.exitCode);
