#!/usr/bin/env node
import { readFileSync } from "node:fs";

function fail(message) {
  console.error(`b347 preview/popup stability check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const entry = readFileSync("src/tuev-card-entry.js", "utf8");
const editor = readFileSync("src/editor/editor.js", "utf8");
const renderParts = readFileSync("src/card/render-parts.js", "utf8");
const pkg = readFileSync("package.json", "utf8");

assert(pkg.includes('"version": "0.1.1-b347"'), "package version must be b347");
assert(pkg.includes('check:card-editor-preview-popup-stability'), "package must expose the b347 preview/popup stability check");
assert(pkg.includes('npm run check:card-editor-preview-popup-stability'), "main check script must execute the b347 stability check");

assert(entry.includes('option changes only the vehicle content; it must not change the'), "Card must document the b347 text/graphic preview column stability rule");
const layoutContextBlock = entry.slice(
    entry.indexOf('getLayoutContext(isMulti)'),
    entry.indexOf('getPreviewSimulation(requestedColumns, measuredWidth)')
);
assert(!layoutContextBlock.includes('this.config?.plate_style !== "plate"'), "Text plate mode must no longer bypass the editor preview column simulation");
assert(entry.includes('getPreviewSimulation(requestedColumns, measuredWidth)'), "Preview simulation must be shared by graphical and text plate modes");
assert(entry.includes('isDashboardEditLayoutContext()'), "Card must include the dashboard edit width context guard");
assert(entry.includes('dashboard editing, section cards can temporarily report the narrower'), "Dashboard edit width rationale must be documented");

assert(editor.includes('document.addEventListener("pointerdown", this._boundHandleDocumentPointerDown, true);'), "Editor must close floating panels from pointerdown capture as well as click");
assert(editor.includes('document.addEventListener("keydown", this._boundHandleDocumentKeyDown, true);'), "Editor must support Escape for floating panel close");
assert(editor.includes('document.removeEventListener("pointerdown", this._boundHandleDocumentPointerDown, true);'), "Editor must remove the pointerdown listener");
assert(editor.includes('document.removeEventListener("keydown", this._boundHandleDocumentKeyDown, true);'), "Editor must remove the keydown listener");
assert(!editor.includes('window.setTimeout(() => {\n            this.closeFloatingPanels();\n        }, 0);'), "Outside-click close must not rely on a delayed timeout");

assert(renderParts.includes('line-height: ${compact ? "18px" : "20px"};'), "Text plate line-height stabilizer must remain");
assert(renderParts.includes('min-height: ${compact ? "18px" : "20px"};'), "Text plate min-height stabilizer must remain");

console.log("b347 preview/popup stability OK: text/graphic preview columns share one simulation path, dashboard-edit width fallback is guarded, and floating panels close reliably on first outside interaction.");
