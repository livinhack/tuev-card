#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => readFileSync(resolve(root, relativePath), "utf8");

function fail(message) {
  console.error(`b351 final release audit check failed: ${message}`);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const pkg = read("package.json");
const readme = read("README.md");
const handover = read("HANDOVER.md");
const releaseDocPath = resolve(root, "docs/B347_CARD_FINAL_RELEASE_AUDIT.md");
const card = read("src/tuev-card-entry.js");
const editor = read("src/editor/editor.js");
const renderer = read("src/plate/renderer.js");
const font = read("src/plate/font.js");
const dist = read("dist/tuev-card.js");

assert(pkg.includes('"version": "0.1.1-b351"'), "package version must be b351");
assert(pkg.includes('"check:card-final-release-audit"'), "package check script must include final release audit");
assert(pkg.includes('npm run check:card-final-release-audit'), "npm run check must execute final release audit");
assert(existsSync(releaseDocPath), "docs/B347_CARD_FINAL_RELEASE_AUDIT.md must exist");

assert(readme.includes("b351") && /Final Release Audit/i.test(readme), "README must identify b351 as Final Release Audit");
assert(handover.includes("b351") && /Final Release Audit/i.test(handover), "HANDOVER must identify b351 as Final Release Audit");
assert(readme.includes("ChatGPT-ZIPs enthalten keine TTF-Binaries"), "README must keep the ChatGPT font-binary note");
assert(handover.includes("Reminder-ZIP") && handover.includes("End-to-End"), "HANDOVER must keep Reminder integration as a later End-to-End step");
assert(/keine Kennzeichen-Geometrie/i.test(readme) && /keine Reminder-Integration/i.test(readme), "README must explicitly state the b351 non-goals");

assert(card.includes('from "./plate/renderer.js?v=b351"'), "Card runtime must use b351 public renderer cache marker");
assert(editor.includes('from "../plate/renderer.js?v=b351"'), "Editor must use b351 public renderer cache marker");
assert(renderer.includes('from "./lab-renderer-adapter.js?v=b351"'), "Public renderer must use b351 adapter cache marker");
assert(card.includes('from "./utils/html-escape.js?v=b351"'), "Card entry must keep shared HTML escaping with b351 cache marker");
assert(editor.includes('from "../utils/html-escape.js?v=b351"'), "Editor must keep shared HTML escaping with b351 cache marker");

assert(!card.includes("_plateFontRefreshTimer"), "dead font refresh timer must stay removed");
assert(!card.includes("setInterval"), "Card entry must not reintroduce font polling intervals");
assert(font.includes("/hacsfiles/tuev-card/fonts/GL-Nummernschild-Mtl.ttf"), "Font helper must still point to HACS font asset path");
assert(font.includes("/hacsfiles/tuev-card/fonts/GL-Nummernschild-Eng.ttf"), "Font helper must still point to HACS font asset path");

assert(dist.includes("b351"), "dist bundle must be rebuilt with b351 markers");

if (!process.exitCode) {
  console.log("b351 final release audit OK: docs, cache markers, font notes, security cleanup, and later Reminder boundary are release-ready.");
}

if (process.exitCode) process.exit(process.exitCode);
