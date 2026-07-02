#!/usr/bin/env node
import { readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    console.error(`b350 sort rollback check failed: ${message}`);
    process.exit(1);
  }
}

const editor = read("src/editor/editor.js");
const card = read("src/tuev-card-entry.js");
const renderer = read("src/plate/renderer.js");
const groups = read("src/card/groups.js");
const plateBody = read("src/plate/lab-renderer/plate-body.js");

assert(editor.includes('from "../plate/renderer.js?v=b350"'), "editor cache marker must be b350");
assert(card.includes('from "./plate/renderer.js?v=b350"'), "card cache marker must be b350");
assert(renderer.includes('from "./lab-renderer-adapter.js?v=b350"'), "public renderer cache marker must be b350");
assert(groups.includes('./entities.js?v=b350'), "groups helper cache marker must be b350");

assert(!editor.includes('getSortedUngroupedDraftEntityIds'), "b338/b350 visible ungrouped draft re-sort helper must be removed");
assert(editor.includes('const selectedEntityIds = this._draftEntityIds.filter(Boolean);'), "render must use b337 draft entity order");
assert(editor.includes('if (this._config.sort === nextSort) {') && editor.includes('this.fireConfigChanged();'), "ungrouped sort must use b337 config-only flow");
assert(!editor.includes('this._draftEntityIds = this.getSortedUngroupedDraftEntityIds'), "ungrouped sort must not rewrite draft entity order");
assert(editor.includes('if (currentSort === "manual" && nextSort !== "manual")'), "group sort must use the b337 manual-to-auto confirmation flow");
assert(editor.includes('this._pendingGroupSort = { groupId, sort: nextSort };'), "group sort confirmation must preserve pending sort state");

assert(editor.includes('const canRenderPlate = true;'), "integrated GL fonts must keep graphical option available");
assert(!editor.includes('checkPlateFontAvailable') && !editor.includes('ensurePlateFont'), "editor must not reintroduce async font probes");
assert(editor.includes('color: group.color || getGroupAccentColor(group, groupIndex)'), "group color materialization fix must stay active");
assert(plateBody.includes('data-plate-frame="true"'), "Euro-field frame overlay fix must stay active");

console.log('✓ b350 sort rollback to b337 with b350 font/frame fixes preserved');
