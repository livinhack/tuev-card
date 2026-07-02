#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
function assert(condition, message) {
  if (!condition) {
    console.error(`Card/editor options fix check failed: ${message}`);
    process.exitCode = 1;
  }
}

const card = read("src/tuev-card-entry.js");
const editor = read("src/editor/editor.js");
const groups = read("src/card/groups.js");
const renderer = read("src/plate/renderer.js");
const readme = read("README.md");
const handover = read("HANDOVER.md");

assert(card.includes('from "./plate/renderer.js?v=b353"'), "Card must use the b353 renderer cache marker.");
assert(editor.includes('from "../plate/renderer.js?v=b353"'), "Editor must use the b353 renderer cache marker.");
assert(renderer.includes('from "./lab-renderer-adapter.js?v=b353"'), "Public renderer must use the b353 adapter cache marker.");

assert(card.includes('const graphicalPlateEnabled = this.config?.plate_style === "plate";'), "Card must gate graphical plate layout by plate_style.");
assert(card.includes('isGraphicalPlateAvailable: graphicalPlateEnabled,'), "Card must obey the user plate_style option without asynchronous font availability gating.");

assert(!editor.includes('getSortedUngroupedDraftEntityIds'), "Editor must keep b337 ungrouped sort behavior and not sort visible draft chip order.");
assert(editor.includes('this.fireConfigChanged();') && editor.includes('sort: nextSort'), "Ungrouped sort chips must use the b337 config-only flow.");
assert(editor.includes('this.releaseUngroupedEntities();'), "Release ungrouped button must call its handler.");
assert(editor.includes('color: group.color || getGroupAccentColor(group, groupIndex)'), "Group moves must materialize fallback colors before reordering.");
assert(editor.includes('getGroupAccentColor') && editor.includes('../card/groups.js?v=b353'), "Editor must import the group color helper through the b353 groups boundary.");
assert(groups.includes('./entities.js?v=b353'), "Groups helper must use the b353 entities cache marker.");

assert(readme.includes("b353") && /Kennzeichen grafisch darstellen/i.test(readme), "README must document the b353 editor option fix.");
assert(handover.includes("b353") && /Sortier/i.test(handover) && /Farben/i.test(handover), "HANDOVER must document b353 sort and color fixes.");

if (!process.exitCode) {
  console.log("Card/editor options fix OK: plate_style gates rendering, sort controls use b337 config flow, and group colors travel with moved groups.");
}
if (process.exitCode) process.exit(process.exitCode);
