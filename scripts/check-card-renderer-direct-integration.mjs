#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const adapterPath = "src/plate/lab-renderer-adapter.js";
const activeRendererPath = "src/plate/renderer.js";
const cardEntryPath = "src/tuev-card-entry.js";
const requiredExports = [
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

assert(existsSync(resolve(root, adapterPath)), `Missing direct integration adapter: ${adapterPath}`);
assert(existsSync(resolve(root, activeRendererPath)), `Missing active renderer boundary: ${activeRendererPath}`);

const adapter = read(adapterPath);
const activeRenderer = read(activeRendererPath);
const cardEntry = read(cardEntryPath);

assert(activeRenderer.includes("./lab-renderer-adapter.js"), "renderer.js must directly delegate to lab-renderer-adapter.js.");
assert(!activeRenderer.includes("./mm-model.js") && !activeRenderer.includes("renderPlateSvgMm"), "renderer.js must not keep the old direct mm-model renderer implementation.");
assert(!cardEntry.includes('this.config?.plate_style === "plate"'), "Card graphical plate availability must not depend on a plate_style text/plate switch.");

for (const forbidden of forbiddenPatterns) {
  assert(!activeRenderer.includes(forbidden), `renderer.js must not contain forbidden debug/toggle/legacy pattern: ${forbidden}`);
  assert(!adapter.includes(forbidden), `Adapter must not contain forbidden debug/toggle/legacy pattern: ${forbidden}`);
}

for (const exportName of requiredExports) {
  assert(new RegExp(`export\\s+function\\s+${exportName}\\b|export\\s*\\{[\\s\\S]*${exportName}`).test(activeRenderer), `renderer.js must expose Card-compatible export: ${exportName}`);
}

if (process.exitCode) process.exit(process.exitCode);

const rendererModule = await import(`../${activeRendererPath}`);

for (const exportName of requiredExports) {
  assert(typeof rendererModule[exportName] === "function", `renderer.js missing Card-compatible function export: ${exportName}`);
}

assert(rendererModule.normalizePlate(" b-vm-146 ") === "B VM 146", "Direct renderer normalizePlate smoke case failed.");
const metrics = rendererModule.getLicensePlateMetrics("B VM 146");
assert(metrics.normalizedPlate === "B VM 146", "Direct renderer getLicensePlateMetrics normalizedPlate smoke case failed.");
assert(Number.isFinite(metrics.width) && metrics.width > 0, "Direct renderer metrics width must be positive.");
assert(Number.isFinite(metrics.height) && metrics.height > 0, "Direct renderer metrics height must be positive.");

const svg = rendererModule.renderLicensePlate("B VM 146");
assert(typeof svg === "string" && svg.startsWith("<svg"), "Direct renderer renderLicensePlate must return SVG.");
assert(svg.includes('data-card-renderer="physical-lab"'), "Direct renderer SVG must be marked as active physical Lab renderer output.");
assert(svg.includes('class="tuev-plate tuev-plate-physical physical-plate-svg"'), "Direct renderer SVG must keep Card-facing SVG class marker.");
assert(!svg.includes("debug-dimensions"), "Direct renderer SVG output must not include debug module markers.");

if (!process.exitCode) {
  console.log("Card renderer direct integration OK: active renderer delegates to Lab adapter, no toggle/legacy path, Card no longer gates rendering on plate_style.");
}
