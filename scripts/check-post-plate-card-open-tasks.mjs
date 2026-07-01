#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => readFileSync(resolve(root, relativePath), "utf8");
function assert(condition, message) {
  if (!condition) {
    console.error(`Post-plate Card open-tasks audit failed: ${message}`);
    process.exitCode = 1;
  }
}

for (const file of [
  "README.md",
  "HANDOVER.md",
  "docs/B336_FINAL_PLATE_SMOKE_RELEASE_CHECKPOINT.md",
  "docs/B337_POST_PLATE_CARD_OPEN_TASKS_AUDIT.md",
  "src/tuev-card-entry.js",
  "src/editor/editor.js",
  "src/plate/renderer.js",
  "src/plate/lab-renderer-adapter.js"
]) assert(existsSync(resolve(root, file)), `Required b337 audit file missing: ${file}`);

const readme = read("README.md");
const handover = read("HANDOVER.md");
const doc = read("docs/B337_POST_PLATE_CARD_OPEN_TASKS_AUDIT.md");
const b336Doc = read("docs/B336_FINAL_PLATE_SMOKE_RELEASE_CHECKPOINT.md");
const card = read("src/tuev-card-entry.js");
const editor = read("src/editor/editor.js");
const renderer = read("src/plate/renderer.js");
const adapter = read("src/plate/lab-renderer-adapter.js");

assert(readme.includes("b339"), "README must identify the current b339 stand.");
assert(handover.includes("b339"), "HANDOVER must identify the current b339 stand.");
assert(doc.includes("prepared/frozen") || doc.includes("prepared/frozen"), "b337 doc must explicitly mark the plate renderer as prepared/frozen.");
assert(/Reminder integration/i.test(doc), "b337 doc must keep later Reminder integration explicit.");
assert(/HACS\/font\/release/i.test(doc) || /font/i.test(doc), "b337 doc must keep font/HACS release readiness explicit.");
assert(/b336/.test(b336Doc), "b336 final plate smoke checkpoint doc must remain available as history.");

assert(card.includes('./plate/renderer.js?v=b339'), "Card runtime must use the b339 public renderer cache marker.");
assert(editor.includes('../plate/renderer.js?v=b339'), "Editor must use the b339 public renderer cache marker.");
assert(renderer.includes('./lab-renderer-adapter.js?v=b339'), "Public renderer entry must delegate to the b339 adapter cache marker.");
assert(adapter.includes('huBadgeRenderer: "full"'), "Card adapter must keep Full-HU badge enabled after the post-plate audit.");
assert(adapter.includes("changePlate: options.changePlate"), "Card adapter must keep Wechselkennzeichen vehicle data pass-through after the post-plate audit.");

for (const source of [readme, handover, doc]) {
  assert(/No plate geometry changed|keine Kennzeichen-Geometrie|Do not continue broad number-plate renderer cleanup/i.test(source), "b337 docs must state that broad plate geometry/cleanup work is not part of this step.");
  assert(/Reminder/i.test(source), "b337 docs must mention the later Reminder phase.");
}

if (!process.exitCode) {
  console.log("Post-plate Card open-tasks audit OK: b339 markers, frozen/prepared plate status, remaining Card buckets, font note, and later Reminder integration are documented.");
}
if (process.exitCode) process.exit(process.exitCode);
