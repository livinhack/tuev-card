#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const adapterPath = "src/plate/lab-renderer-adapter.js";
const activeRendererPath = "src/plate/renderer.js";
const activeSupportFiles = ["src/plate/mm-model.js"];
const forbiddenAdapterImports = [
  "debug-dimensions",
  "plate-lab-debug-renderers",
  "regression-cases",
  "app.js",
  "viewer-calibration",
  "font-calibration"
];

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

if (!existsSync(resolve(root, adapterPath))) {
  fail(`Missing Card Lab renderer adapter: ${adapterPath}`);
} else {
  const adapter = read(adapterPath);
  if (!adapter.includes("./lab-renderer/plate-public-api.js")) {
    fail("Adapter must enter staged renderer through lab-renderer/plate-public-api.js.");
  }
  if (!adapter.includes("./font.js")) {
    fail("Adapter must keep Card font integration at the adapter boundary.");
  }
  for (const forbidden of forbiddenAdapterImports) {
    if (adapter.includes(forbidden)) {
      fail(`Adapter must not import Lab/debug-only code: ${forbidden}`);
    }
  }
}

for (const activeFile of activeSupportFiles) {
  const activePath = resolve(root, activeFile);
  if (!existsSync(activePath)) continue;
  const content = read(activeFile);
  if (content.includes("lab-renderer-adapter")) {
    fail(`Support file must not import adapter directly: ${activeFile}`);
  }
}

if (existsSync(resolve(root, activeRendererPath))) {
  const activeRenderer = read(activeRendererPath);
  if (!activeRenderer.includes("lab-renderer-adapter")) {
    fail("Active renderer.js must delegate through the adapter after direct integration.");
  }
}

if (!process.exitCode) {
  console.log("Card renderer adapter scaffold OK: adapter present, active renderer delegates through adapter, no Lab/debug-only imports.");
}
