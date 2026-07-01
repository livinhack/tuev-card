#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const adapterPath = "src/plate/lab-renderer-adapter.js";
const activeRendererPath = "src/plate/renderer.js";
const requiredExports = [
  "normalizeLabRendererPlate",
  "getLabRendererLicensePlateMetrics",
  "renderLicensePlateWithLabRenderer",
  "normalizePlate",
  "getLicensePlateMetrics",
  "renderLicensePlate",
  "checkPlateFontAvailable",
  "ensurePlateFont",
  "getPlateFontStatus",
  "isPlateFontLoaded"
];
const forbiddenAdapterImports = [
  "debug-dimensions",
  "plate-lab-debug-renderers",
  "regression-cases",
  "app.js",
  "viewer-calibration",
  "font-calibration",
  "useLegacy",
  "legacyRenderer",
  "rendererToggle",
  "fallbackRenderer"
];

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) fail(message);
}

if (!existsSync(resolve(root, adapterPath))) {
  fail(`Missing Card Lab renderer adapter: ${adapterPath}`);
} else {
  const adapter = read(adapterPath);
  assert(adapter.includes("./lab-renderer/plate-public-api.js"), "Adapter smoke check must enter staged renderer through lab-renderer/plate-public-api.js.");
  assert(adapter.includes("./font.js"), "Adapter smoke check must keep Card font integration at the adapter boundary.");
  for (const forbidden of forbiddenAdapterImports) {
    assert(!adapter.includes(forbidden), `Adapter smoke check must not import Lab/debug/toggle/legacy code: ${forbidden}`);
  }
}

if (!existsSync(resolve(root, activeRendererPath))) {
  fail(`Missing active Card renderer boundary: ${activeRendererPath}`);
} else {
  const activeRenderer = read(activeRendererPath);
  assert(activeRenderer.includes("./lab-renderer-adapter.js"), "Active Card renderer must delegate directly to the Lab renderer adapter.");
  assert(!activeRenderer.includes("mm-model.js"), "Active Card renderer must not keep the old mm-model renderer path.");
  assert(!activeRenderer.includes("useLegacy") && !activeRenderer.includes("legacyRenderer") && !activeRenderer.includes("rendererToggle"), "Active Card renderer must not contain a legacy/toggle path.");
}

if (process.exitCode) process.exit(process.exitCode);

const adapterModule = await import(`../${adapterPath}`);

for (const exportName of requiredExports) {
  assert(typeof adapterModule[exportName] === "function", `Adapter missing required function export: ${exportName}`);
}

assert(adapterModule.normalizeLabRendererPlate(" b-vm-146 ") === "B VM 146", "Adapter normalization smoke case failed.");
assert(adapterModule.normalizePlate("da—ci   50") === "DA CI 50", "Adapter renderer-compatible normalization smoke case failed.");
assert(adapterModule.normalizeLabRendererPlate("") === "", "Adapter empty normalization smoke case failed.");

const emptyMetrics = adapterModule.getLabRendererLicensePlateMetrics("   ");
assert(emptyMetrics.width === 0 && emptyMetrics.height === 0 && emptyMetrics.normalizedPlate === "", "Adapter empty metrics smoke case failed.");

const metrics = adapterModule.getLicensePlateMetrics("B VM 146");
assert(metrics.normalizedPlate === "B VM 146", "Adapter metrics normalizedPlate smoke case failed.");
assert(Number.isFinite(metrics.width) && metrics.width > 0, "Adapter metrics width must be positive.");
assert(Number.isFinite(metrics.height) && metrics.height > 0, "Adapter metrics height must be positive.");
assert(metrics.model && metrics.model.metrics, "Adapter metrics must expose the staged Lab model for future comparison checks.");

const svg = adapterModule.renderLicensePlate("B VM 146");
assert(typeof svg === "string" && svg.startsWith("<svg"), "Adapter SVG smoke case must return an SVG string.");
assert(svg.includes('data-card-renderer="physical-lab"'), "Adapter SVG must be marked as active physical Lab Card renderer output.");
assert(svg.includes('class="tuev-plate tuev-plate-physical physical-plate-svg"'), "Adapter SVG must keep Card-facing SVG class marker.");
assert(svg.includes('data-hu-badge-renderer="full"'), "Card renderer SVG must use the full HU badge renderer by default.");
assert(!svg.includes('fill="#1ea5ff"'), "Card renderer SVG must not emit the old blue HU placeholder by default.");
assert(!svg.includes("debug-dimensions"), "Adapter SVG smoke output must not include debug module markers.");

if (!process.exitCode) {
  console.log("Card renderer adapter smoke OK: active renderer delegates to adapter, exports, normalization, metrics and SVG smoke output passed.");
}
