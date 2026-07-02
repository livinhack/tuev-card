#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => readFileSync(resolve(root, relativePath), "utf8");

function fail(message) {
  console.error(`b351 security/timer cleanup check failed: ${message}`);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const entry = read("src/tuev-card-entry.js");
const cardParts = read("src/card/render-parts.js");
const editor = read("src/editor/editor.js");
const adapter = read("src/plate/lab-renderer-adapter.js");
const timing = read("src/card/ui-state.js");
const pkg = read("package.json");

assert(existsSync(resolve(root, "src/utils/html-escape.js")), "shared src/utils/html-escape.js must exist");
assert(entry.includes('import { escapeHtml } from "./utils/html-escape.js?v=b351"'), "Card entry must import shared HTML escape helper");
assert(cardParts.includes('import { escapeHtml } from "../utils/html-escape.js?v=b351"'), "Card render-parts must import shared HTML escape helper");
assert(editor.includes('import { escapeHtml } from "../utils/html-escape.js?v=b351"'), "Editor must import shared HTML escape helper instead of owning another HTML escape formula");
assert(entry.includes("${escapeHtml(section.title)}"), "Group title must be escaped in Card section heading");
assert(cardParts.includes("${escapeHtml(vehicleName)}"), "Vehicle name must be escaped in Card header");
assert(cardParts.includes("${escapeHtml(plate)}"), "Text plate must be escaped in Card header");
assert(cardParts.includes("${escapeHtml(entityId)}"), "Missing entity id must be escaped in Card missing-entity output");
assert(!editor.includes('replaceAll("&", "&amp;")'), "Editor must not keep a duplicate local HTML escape formula");

assert(!entry.includes("_plateFontRefreshTimer"), "Dead plate font refresh interval must be removed");
assert(!entry.includes("setInterval"), "Card entry must not keep the removed font polling interval");
assert(!entry.includes("checkPlateFontAvailability(true);"), "Card entry must not call the compatibility font no-op during config setup");
assert(!entry.includes("checkPlateFontAvailability(false);"), "Card entry must not call the compatibility font no-op on every hass update");

assert(timing.includes("stampHideMs: 1980"), "Confirm stamp-hide timing must be named in CONFIRM_TIMING");
assert(timing.includes("serviceCallMs: 2160"), "Confirm service-call timing must be named in CONFIRM_TIMING");
assert(entry.includes("CONFIRM_TIMING.stampHideMs"), "Confirm stamp-hide timeout must use named CONFIRM_TIMING.stampHideMs");
assert(entry.includes("CONFIRM_TIMING.serviceCallMs"), "Confirm service-call timeout must use named CONFIRM_TIMING.serviceCallMs");
assert(!entry.includes("}, 1980);"), "Raw 1980 timeout must not remain in Card entry");
assert(!entry.includes("}, 2160);"), "Raw 2160 timeout must not remain in Card entry");
assert(entry.includes("setManagedTimeout(callback, delay)"), "Card entry must manage timeout IDs through setManagedTimeout");
assert(entry.includes("clearManagedTimeouts()"), "Card entry must provide timeout cleanup");
assert(entry.includes("this.clearManagedTimeouts();"), "disconnectedCallback must clear managed timeouts");

assert(adapter.includes('import { escapeSvgAttr as escapeAttr } from "./lab-renderer/svg-escape-utils.js"'), "Adapter must reuse the shared SVG attribute escape helper");
assert(!adapter.includes("function escapeAttr(value)"), "Adapter must not keep its local escapeAttr copy");

assert(pkg.includes('"version": "0.1.1-b351"'), "package version must be b351");

if (!process.exitCode) {
  console.log("b351 security/timer cleanup OK: dead font timer removed, HTML escaping shared, confirm timers named/managed, adapter SVG escaping reused.");
}

if (process.exitCode) process.exit(process.exitCode);
