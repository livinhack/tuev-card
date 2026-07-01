#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
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

function count(text, fragment) {
  return text.split(fragment).length - 1;
}

assert(existsSync(resolve(root, adapterPath)), `Missing Card Lab adapter: ${adapterPath}`);

if (existsSync(resolve(root, adapterPath))) {
  const adapter = read(adapterPath);

  assert(adapter.includes("const CARD_LAB_RENDERER_DEFAULTS = Object.freeze"), "Adapter defaults must be centralized in CARD_LAB_RENDERER_DEFAULTS.");
  assert(adapter.includes("...CARD_LAB_RENDERER_DEFAULTS"), "createLabRendererOptions must spread the centralized defaults.");

  for (const requiredDefault of [
    'fontMode: "auto"',
    'widthMode: "balanced"',
    'specialIWidth: 35.5',
    'stage: "complete"',
    'showDimensions: false',
    'showSeals: true',
    'showText: true',
    'huBadgeRenderer: "full"'
  ]) {
    assert(adapter.includes(requiredDefault), `Missing required Card adapter default: ${requiredDefault}`);
    assert(count(adapter, requiredDefault) === 1, `Required Card adapter default must be declared exactly once: ${requiredDefault}`);
  }

  assert(adapter.includes("const debugEnabled = options.debug === true"), "Adapter must normalize debug once before mapping Lab debug flags.");
  assert(count(adapter, "options.debug === true") === 1, "Adapter must not duplicate the debug option expression.");
  assert(adapter.includes("showDxfReferenceGuides: debugEnabled"), "Adapter must map debug to Dxf reference guides through debugEnabled.");
  assert(adapter.includes("showGrid: debugEnabled"), "Adapter must map debug to grid through debugEnabled.");

  for (const passThrough of [
    "huYear: options.huYear",
    "huMonth: options.huMonth",
    "huRotation: options.huRotation",
    "changePlate: options.changePlate"
  ]) {
    assert(adapter.includes(passThrough), `Adapter must keep explicit Card data pass-through: ${passThrough}`);
  }

  for (const forbidden of [
    "placeholder",
    "#1ea5ff",
    "useLegacy",
    "legacyRenderer",
    "rendererToggle",
    "fallbackRenderer"
  ]) {
    assert(!adapter.includes(forbidden), `Adapter must not contain legacy/placeholder toggle fragment: ${forbidden}`);
  }
}

if (process.exitCode) process.exit(process.exitCode);

const adapterModule = await import(`../${adapterPath}`);

const defaultSvg = adapterModule.renderLicensePlate("B VM 146");
assert(defaultSvg.includes('data-hu-badge-renderer="full"'), "Default Card adapter render must keep Full-HU badge active.");
assert(!defaultSvg.includes('fill="#1ea5ff"'), "Default Card adapter render must not emit the old blue HU placeholder.");


const changePlateSvg = adapterModule.renderLicensePlate("W B VM 146", {
  changePlate: { enabled: true, commonText: "B VM", vehicleText: "146" },
  huYear: 2027,
  huMonth: 7,
  huRotation: 90
});
assert(changePlateSvg.includes('data-change-plate="true"'), "Adapter must keep change-plate data pass-through active.");
assert(changePlateSvg.includes('data-hu-badge-renderer="full"'), "Adapter must keep Full-HU badge active for change plates.");
assert(!changePlateSvg.includes('fill="#1ea5ff"'), "Change-plate adapter render must not emit the old blue HU placeholder.");

if (!process.exitCode) {
  console.log("Card/Lab adapter options audit OK: defaults are centralized, Card data pass-through is explicit, and Full-HU output remains active.");
}
