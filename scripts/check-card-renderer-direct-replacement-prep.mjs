#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const adapterPath = "src/plate/lab-renderer-adapter.js";
const activeRendererPath = "src/plate/renderer.js";
const requiredDirectReplacementExports = [
  "normalizePlate",
  "getLicensePlateMetrics",
  "renderLicensePlate",
  "checkPlateFontAvailable",
  "ensurePlateFont",
  "getPlateFontStatus",
  "isPlateFontLoaded"
];
const forbiddenPatterns = [
  "debug-dimensions",
  "plate-lab-debug-renderers",
  "regression-cases",
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

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

assert(existsSync(resolve(root, adapterPath)), `Missing direct replacement prep adapter: ${adapterPath}`);

if (existsSync(resolve(root, adapterPath))) {
  const adapter = read(adapterPath);
  assert(adapter.includes("./lab-renderer/plate-public-api.js"), "Direct replacement prep adapter must enter staged renderer through lab-renderer/plate-public-api.js.");
  assert(adapter.includes("./font.js"), "Direct replacement prep adapter must keep Card font integration at the adapter boundary.");
  for (const exportName of requiredDirectReplacementExports) {
    assert(new RegExp(`export\\s+function\\s+${exportName}\\b|export\\s*\\{[\\s\\S]*${exportName}`).test(adapter), `Adapter must expose future renderer.js-compatible export: ${exportName}`);
  }
  for (const forbidden of forbiddenPatterns) {
    assert(!adapter.includes(forbidden), `Direct replacement prep adapter must not contain forbidden debug/toggle/legacy pattern: ${forbidden}`);
  }
}

if (existsSync(resolve(root, activeRendererPath))) {
  const activeRenderer = read(activeRendererPath);
  assert(!activeRenderer.includes("lab-renderer-adapter"), "Active renderer.js must not import the prepared adapter before the direct replacement step.");
  assert(!activeRenderer.includes("useLegacy") && !activeRenderer.includes("legacyRenderer"), "Active renderer.js must not gain a legacy/toggle path.");
}

if (process.exitCode) process.exit(process.exitCode);

const adapterModule = await import(`../${adapterPath}`);

for (const exportName of requiredDirectReplacementExports) {
  assert(typeof adapterModule[exportName] === "function", `Adapter missing future renderer.js-compatible function export: ${exportName}`);
}

assert(adapterModule.normalizePlate(" b-vm-146 ") === "B VM 146", "Direct replacement normalizePlate alias smoke case failed.");
assert(adapterModule.normalizePlate("da—ci   50") === "DA CI 50", "Direct replacement dash/space normalizePlate alias smoke case failed.");

const metrics = adapterModule.getLicensePlateMetrics("B VM 146");
assert(metrics.normalizedPlate === "B VM 146", "Direct replacement getLicensePlateMetrics alias normalizedPlate smoke case failed.");
assert(Number.isFinite(metrics.width) && metrics.width > 0, "Direct replacement getLicensePlateMetrics alias must return positive width.");
assert(Number.isFinite(metrics.height) && metrics.height > 0, "Direct replacement getLicensePlateMetrics alias must return positive height.");

const svg = adapterModule.renderLicensePlate("B VM 146");
assert(typeof svg === "string" && svg.startsWith("<svg"), "Direct replacement renderLicensePlate alias must return SVG.");
assert(svg.includes('class="tuev-plate tuev-plate-physical physical-plate-svg"'), "Direct replacement SVG must keep Card-facing SVG class marker.");
assert(!svg.includes("debug-dimensions"), "Direct replacement SVG smoke output must not include debug module markers.");

if (!process.exitCode) {
  console.log("Card renderer direct replacement prep OK: adapter exposes renderer.js-compatible API, no toggle/legacy path, active renderer unchanged.");
}
