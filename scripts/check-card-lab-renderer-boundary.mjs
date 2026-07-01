#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const isFullCardRoot = existsSync(resolve(root, "src/tuev-card-entry.js"));

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

function importsFor(file) {
  const text = read(file);
  const result = [];
  const importRe = /(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/g;
  let match;
  while ((match = importRe.exec(text))) {
    const target = resolveImport(file, match[1]);
    if (target) result.push(target);
  }
  return result.sort();
}

const files = listJsFiles("src");

if (isFullCardRoot) {
  const rendererPath = "src/plate/renderer.js";
  const adapterPath = "src/plate/lab-renderer-adapter.js";
  const publicApiPath = "src/plate/lab-renderer/plate-public-api.js";

  for (const path of [rendererPath, adapterPath, publicApiPath]) {
    assert(existsSync(resolve(root, path)), `Missing expected renderer boundary file: ${path}`);
  }

  const rendererImports = importsFor(rendererPath);
  assert(rendererImports.length === 1 && rendererImports[0] === adapterPath, `renderer.js must be a thin boundary that only re-exports the Card/Lab adapter, got: ${rendererImports.join(", ")}`);

  const adapterImports = importsFor(adapterPath);
  const allowedAdapterImports = new Set([publicApiPath, "src/plate/font.js", "src/plate/lab-renderer/svg-escape-utils.js"]);
  const unexpectedAdapterImports = adapterImports.filter((target) => !allowedAdapterImports.has(target));
  assert(unexpectedAdapterImports.length === 0, `lab-renderer-adapter.js must only import the Lab public API, Card font helper and shared SVG escape helper, got unexpected imports: ${unexpectedAdapterImports.join(", ")}`);

  const adapter = read(adapterPath);
  for (const forbidden of [
    "./lab-renderer/plate-svg-renderer.js",
    "./lab-renderer/plate-rules.js",
    "./lab-renderer/plate-layout-model.js",
    "./lab-renderer/mm-model.js",
    "./lab-renderer/spacing-solver.js",
    "./lab-renderer/change-plate-supplement-renderer.js"
  ]) {
    assert(!adapter.includes(forbidden), `Adapter must not bypass plate-public-api.js via ${forbidden}`);
  }
  assert(adapter.includes('stage: "complete"'), "Adapter must keep complete-stage Lab renderer activation explicit.");
  assert(adapter.includes('huBadgeRenderer: "full"'), "Adapter must keep the Card Full-HU-badge activation explicit.");
  assert(adapter.includes("changePlate: options.changePlate"), "Adapter must keep change-plate data pass-through explicit.");

  const publicApiImports = importsFor(publicApiPath);
  const forbiddenPublicApiTargets = publicApiImports.filter((target) => target === rendererPath || target === adapterPath || target === "src/plate/font.js" || target.startsWith("src/editor/") || target.startsWith("src/tuev-card-entry"));
  assert(forbiddenPublicApiTargets.length === 0, `Lab public API must not import Card/Editor boundaries: ${forbiddenPublicApiTargets.join(", ")}`);

  const badDirectConsumers = [];
  for (const file of files) {
    if (file === rendererPath || file === adapterPath || file.startsWith("src/plate/lab-renderer/")) continue;
    for (const target of importsFor(file)) {
      if (target.startsWith("src/plate/lab-renderer/")) badDirectConsumers.push(`${file} -> ${target}`);
      if (target === adapterPath) badDirectConsumers.push(`${file} -> ${target}`);
    }
  }
  assert(badDirectConsumers.length === 0, `Card/Editor code must consume only src/plate/renderer.js, not Lab internals or adapter: ${badDirectConsumers.join("; ")}`);
} else {
  const publicApiPath = "src/plate/plate-public-api.js";
  assert(existsSync(resolve(root, publicApiPath)), `Missing standalone Lab public API: ${publicApiPath}`);
  assert(!existsSync(resolve(root, "src/plate/lab-renderer-adapter.js")), "Standalone Lab must not gain the Card-only lab-renderer-adapter.js boundary.");

  const publicApi = read(publicApiPath);
  assert(publicApi.includes("./plate-svg-renderer.js"), "Standalone Lab public API must keep the SVG renderer orchestrator as its render boundary.");
  assert(publicApi.includes("./plate-rules.js"), "Standalone Lab public API must keep central rules export.");
}

if (!process.exitCode) {
  const mode = isFullCardRoot ? "Full/Card" : "Standalone Lab";
  console.log(`${mode} Card/Lab renderer boundary audit OK.`);
}

if (process.exitCode) process.exit(process.exitCode);
