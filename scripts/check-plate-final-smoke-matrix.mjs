#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderPlateSvgMm } from "../src/plate/lab-renderer/mm-model.js";
import { renderBadge } from "../src/plate/lab-renderer/badge/renderer.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
function read(relativePath) { return readFileSync(resolve(root, relativePath), "utf8"); }
function assert(condition, message) {
  if (!condition) {
    console.error(`Final card plate smoke matrix failed: ${message}`);
    process.exitCode = 1;
  }
}

function render(label, input, options = {}) {
  const result = renderPlateSvgMm(input, {
    fontMode: "auto",
    widthMode: "balanced",
    specialIWidth: 35.5,
    stage: "complete",
    showDimensions: false,
    showDxfReferenceGuides: false,
    showGrid: false,
    showSeals: true,
    showText: true,
    huBadgeRenderer: "full",
    huYear: 2027,
    huMonth: 5,
    huRotation: 0,
    ...options
  });
  const svg = result?.svg || "";
  assert(svg.startsWith("<svg"), `${label} must return an SVG document.`);
  assert(svg.includes('class="physical-plate-svg"'), `${label} must contain the physical plate SVG root class.`);
  assert(!svg.includes("#1ea5ff"), `${label} must not use the old blue HU placeholder in full-badge mode.`);
  return svg;
}

for (const file of [
  "src/tuev-card-entry.js",
  "src/editor/editor.js",
  "src/plate/renderer.js",
  "src/plate/lab-renderer-adapter.js",
  "src/plate/lab-renderer/plate-public-api.js",
  "README.md",
  "HANDOVER.md",
  "NOTICE.md"
]) assert(existsSync(resolve(root, file)), `Required release/checkpoint file missing: ${file}`);

const card = read("src/tuev-card-entry.js");
const editor = read("src/editor/editor.js");
const publicRenderer = read("src/plate/renderer.js");
const adapter = read("src/plate/lab-renderer-adapter.js");

assert(card.includes('./plate/renderer.js?v=b344'), "Card runtime must use the b344 public renderer cache marker.");
assert(editor.includes('../plate/renderer.js?v=b344'), "Editor must use the b344 public renderer cache marker.");
assert(publicRenderer.includes('./lab-renderer-adapter.js?v=b344'), "Public renderer entry must delegate to the b344 adapter cache marker.");
assert(adapter.includes('huBadgeRenderer: "full"'), "Card adapter must keep Full-HU badge enabled for production rendering.");
assert(adapter.includes("huYear: options.huYear"), "Card adapter must pass reminder HU year through.");
assert(adapter.includes("huMonth: options.huMonth"), "Card adapter must pass reminder HU month through.");
assert(adapter.includes("huRotation: options.huRotation"), "Card adapter must pass reminder HU rotation through.");
assert(adapter.includes("changePlate: options.changePlate"), "Card adapter must pass change-plate vehicle data through.");

const cases = [
  ["standard", "DA CI 500", {}],
  ["short one-line", "K A 1", {}],
  ["long/auto narrow candidate", "HH AB 1234", {}],
  ["season one-line", "DA CI 500", { season: { enabled: true, from: 4, to: 10 } }],
  ["electric suffix", "HH EV 204E", {}],
  ["historic suffix", "HH AB 123H", {}],
  ["green plate", "DA CI 500", { green: true }],
  ["two-line", "DD GD 645", { plateFormat: "twoLine" }],
  ["motorcycle", "EBE VM71", { plateFormat: "motorcycle" }],
  ["reduced two-line", "HVL D191", { plateFormat: "reducedTwoLine" }],
  ["change plate", "GL AB123", { changePlate: { enabled: true, commonText: "GL AB", vehicleText: "1" } }]
];

const rendered = new Map();
for (const [label, input, options] of cases) rendered.set(label, render(label, input, options));

const seasonSvg = rendered.get("season one-line") || "";
assert(seasonSvg.includes('class="layer layer-season-field"') || seasonSvg.includes("season-field"), "season one-line must render a season field layer.");

const changeSvg = rendered.get("change plate") || "";
assert(changeSvg.includes("change-plate") || changeSvg.includes("change-plate-supplement"), "change plate must render the vehicle-specific supplement layer.");
assert((changeSvg.match(/data-hu-badge-renderer="full"/g) || []).length >= 1, "change plate must keep the full HU badge marker.");

assert(renderBadge(2026, 0, false, 300) !== renderBadge(2027, 0, false, 300), "different HU years must keep different rendered badge output/colors.");

const readme = read("README.md");
const handover = read("HANDOVER.md");
assert(readme.includes("b344"), "README must identify the b344 checkpoint.");
assert(handover.includes("b344"), "HANDOVER must identify the b344 checkpoint.");
assert(/Font/i.test(readme) && /TTF/i.test(readme), "README must keep the HACS/font binary note visible.");
assert(!existsSync(resolve(root, "src/plate/mm-model.js")), "Removed legacy Full/Card src/plate/mm-model.js must stay absent.");

if (!process.exitCode) console.log(`Final card plate smoke matrix OK: ${cases.length} core Card/Lab plate variants render, b344 cache markers are current, and release docs keep the font note.`);
if (process.exitCode) process.exit(process.exitCode);
