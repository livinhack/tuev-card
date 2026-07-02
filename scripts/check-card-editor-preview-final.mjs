#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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

const editorPath = "src/editor/editor.js";
const cardPath = "src/tuev-card-entry.js";
const adapterPath = "src/plate/lab-renderer-adapter.js";
const rendererPath = "src/plate/renderer.js";

for (const file of [editorPath, cardPath, adapterPath, rendererPath]) {
  assert(existsSync(resolve(root, file)), `Missing required renderer/editor file: ${file}`);
}

const editor = read(editorPath);
const card = read(cardPath);
const adapter = read(adapterPath);
const renderer = read(rendererPath);

assert(editor.includes('from "../plate/renderer.js?v=b351"'), "Editor must consume the b351 public renderer cache boundary.");
assert(card.includes('from "./plate/renderer.js?v=b351"'), "Card entry must consume the b351 public renderer cache boundary.");
assert(renderer.includes('from "./lab-renderer-adapter.js?v=b351"'), "Public renderer entry must delegate to the b351 adapter cache boundary.");


for (const forbidden of [
  'this._config.plate_style = "text"',
  "removeLegacyCardConfigOptions(this._config);",
  "fireConfigChanged();"
]) {
  const bodyStart = editor.indexOf("    checkPlateFontAvailability(force = false)");
  const bodyEnd = editor.indexOf("    getUngroupedEntityIdsFromConfig()", bodyStart);
  const methodBody = editor.slice(bodyStart, bodyEnd);
  assert(!methodBody.includes(forbidden), `Editor font check must not mutate user config or fire config changes; found ${forbidden}`);
}

assert(count(editor, "renderUnlessEditingGroupTitle();") <= 4, "Editor font check should not trigger excessive immediate renders.");
assert(editor.includes("checkPlateFontAvailability(force = false)"), "Editor keeps a compatibility no-op font availability method.");
assert(!editor.includes("checkPlateFontAvailable"), "Editor must not run asynchronous font probes that can jitter the preview.");
assert(!editor.includes("ensurePlateFont"), "Editor must not trigger font-load renders from preview options.");
assert(editor.includes("const canRenderPlate = true;"), "Editor preview availability must be stable because fonts are bundled.");

assert(card.includes("checkPlateFontAvailability(force = false)"), "Card runtime must keep the compatibility font-check method. ");
assert(card.includes("this._plateFontAvailable = true;") && card.includes("this._plateFontLoaded = true;"), "Card runtime font check must be a stable no-op because fonts are bundled.");
assert(card.includes("isGraphicalPlateAvailable()"), "Card runtime must keep one graphical-plate availability gate.");
assert(card.includes("return true;"), "Card graphical-plate availability must not depend on asynchronous font probes.");

assert(adapter.includes("const CARD_LAB_RENDERER_DEFAULTS = Object.freeze"), "Adapter defaults must remain centralized.");
assert(adapter.includes('huBadgeRenderer: "full"'), "Card adapter must keep Full-HU badge as the production default.");
assert(adapter.includes("huYear: options.huYear"), "Adapter must keep huYear as entity/reminder pass-through.");
assert(adapter.includes("huMonth: options.huMonth"), "Adapter must keep huMonth as entity/reminder pass-through.");
assert(adapter.includes("huRotation: options.huRotation"), "Adapter must keep huRotation as entity/reminder pass-through.");
assert(adapter.includes("changePlate: options.changePlate"), "Adapter must keep changePlate as vehicle data pass-through.");
assert(count(adapter, "return normalizeLabRendererPlate(plate);") === 1, "normalizePlate must delegate exactly once without duplicate unreachable returns.");

for (const forbidden of ["legacyRenderer", "useLegacy", "rendererToggle", "fallbackRenderer"]) {
  assert(!adapter.includes(forbidden), `Adapter must remain legacy-toggle free; found ${forbidden}`);
  assert(!editor.includes(forbidden), `Editor must remain legacy-toggle free; found ${forbidden}`);
}

if (!process.exitCode) {
  console.log("Card editor/preview final audit OK: editor preview no longer jitters from font probes, and Card options remain explicit.");
}

if (process.exitCode) process.exit(process.exitCode);
