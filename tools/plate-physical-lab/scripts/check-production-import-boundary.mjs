#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { labOnlyModules, productionEntries } from "./production-import-boundary.config.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const labOnlyModuleSet = new Set(labOnlyModules);

const importPattern = /(?:import|export)\s+(?:[^"'`]*?\s+from\s*)?["']([^"']+)["']/g;
const sideEffectImportPattern = /import\s*["']([^"']+)["']/g;

function normalizePath(path) {
  return relative(root, path).replace(/\\/g, "/");
}

function resolveImport(fromFile, specifier) {
  if (!specifier.startsWith(".")) return null;

  const base = resolve(dirname(fromFile), specifier);
  const candidates = [];
  if (extname(base)) {
    candidates.push(base);
  } else {
    candidates.push(`${base}.js`, `${base}.mjs`, join(base, "index.js"));
  }

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function getStaticImports(file) {
  const source = readFileSync(file, "utf8");
  const imports = [];
  for (const pattern of [importPattern, sideEffectImportPattern]) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(source))) {
      const resolved = resolveImport(file, match[1]);
      if (resolved) imports.push(resolved);
    }
  }
  return [...new Set(imports)];
}

function collectClosure(entry) {
  const entryPath = resolve(root, entry);
  const visited = new Set();
  const stack = [entryPath];
  const edges = [];

  while (stack.length) {
    const file = stack.pop();
    const normalized = normalizePath(file);
    if (visited.has(normalized)) continue;
    visited.add(normalized);

    for (const imported of getStaticImports(file)) {
      const importedName = normalizePath(imported);
      edges.push([normalized, importedName]);
      if (!visited.has(importedName)) stack.push(imported);
    }
  }

  return { visited, edges };
}

let hasError = false;
const allProductionFiles = new Set();

for (const entry of productionEntries) {
  const { visited, edges } = collectClosure(entry);
  for (const file of visited) allProductionFiles.add(file);

  const forbidden = [...visited].filter((file) => labOnlyModuleSet.has(file));
  if (forbidden.length) {
    hasError = true;
    console.error(`Production import boundary failed for ${entry}:`);
    for (const file of forbidden) {
      const parents = edges.filter(([, imported]) => imported === file).map(([parent]) => parent);
      console.error(`  forbidden: ${file}${parents.length ? ` imported by ${parents.join(", ")}` : ""}`);
    }
  }
}

if (hasError) {
  process.exit(1);
}

console.log(`Production import boundary OK: ${productionEntries.length} entries, ${allProductionFiles.size} production files, 0 lab/debug-only imports.`);
