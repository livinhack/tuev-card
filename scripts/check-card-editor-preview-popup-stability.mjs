#!/usr/bin/env node
import { readFileSync } from "node:fs";

function fail(message) {
  console.error(`b352 preview/popup stability check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const entry = readFileSync("src/tuev-card-entry.js", "utf8");
const editor = readFileSync("src/editor/editor.js", "utf8");
const renderParts = readFileSync("src/card/render-parts.js", "utf8");
const pkg = readFileSync("package.json", "utf8");

assert(pkg.includes('"version": "0.1.1-b352"'), "package version must be b352");
assert(pkg.includes('check:card-editor-preview-popup-stability'), "package must expose the b352 preview/popup stability check");
assert(pkg.includes('npm run check:card-editor-preview-popup-stability'), "main check script must execute the b352 stability check");

assert(entry.includes('option changes only the vehicle content; it must not change the'), "Card must document the b352 text/graphic preview column stability rule");
const layoutContextBlock = entry.slice(
    entry.indexOf('getLayoutContext(isMulti)'),
    entry.indexOf('    getPreviewSimulation(requestedColumns, measuredWidth)')
);
assert(!layoutContextBlock.includes('this.config?.plate_style !== "plate"'), "Text plate mode must no longer bypass the editor preview column simulation");
assert(entry.includes('getPreviewSimulation(requestedColumns, measuredWidth)'), "Preview simulation must be shared by graphical and text plate modes");

assert(layoutContextBlock.includes('const rawVisibleWidth = this.getPreviewVisibleWidth();'), "Layout context must keep raw preview visible width separate from measured width");
assert(layoutContextBlock.includes('if (rawVisibleWidth === 0)'), "First editor-preview render with no visible width must use a safe fallback instead of measured ancestor width");
assert(!layoutContextBlock.includes('this.getPreviewVisibleWidth() || measuredWidth'), "Preview visible width must not fall back to measuredWidth because ancestors can be wider than the preview pane");
assert(layoutContextBlock.includes('const shouldScalePreview = simulatedWidth > visiblePreviewWidth + 4'), "Editor preview must force scaling whenever the simulated width is larger than the visible preview pane");
assert(layoutContextBlock.includes('if (shouldScalePreview) {'), "Force-scale contract must run before any non-scaled preview return");
assert(!layoutContextBlock.includes('measuredWidth >= simulatedWidth - 4'), "Scale bypass must not use measuredWidth from parent/ancestor elements");
assert(!layoutContextBlock.includes('scale >= 0.995 && visiblePreviewWidth >= simulatedWidth - 4'), "Near-1 scale bypass must not override the force-scale contract");
assert(entry.includes('isDashboardEditLayoutContext()'), "Card must include the dashboard edit width context guard");
assert(entry.includes('dashboard editing, section cards can temporarily report the narrower'), "Dashboard edit width rationale must be documented");

assert(!editor.includes('document.addEventListener("pointerdown", this._boundHandleDocumentPointerDown, true);'), "Editor must not use pointerdown capture for floating-panel outside close after b352 rollback");
assert(!editor.includes('document.addEventListener("keydown", this._boundHandleDocumentKeyDown, true);'), "Editor must not add the b345/b347 keydown listener in the popup rollback step");
assert(editor.includes('document.addEventListener("click", this._boundHandleDocumentClick, true);'), "Editor must keep the original click-capture outside-close listener");
assert(editor.includes('window.setTimeout(() => {\n            this.closeFloatingPanels();\n        }, 0);'), "Outside-click close must use the original deferred close path to avoid first-open event-order regressions");

assert(renderParts.includes('line-height: ${compact ? "18px" : "20px"};'), "Text plate line-height stabilizer must remain");
assert(renderParts.includes('min-height: ${compact ? "18px" : "20px"};'), "Text plate min-height stabilizer must remain");

console.log("b352 preview/popup stability OK: text/graphic preview columns share one simulation path, dashboard-edit width fallback is guarded, and floating panels use the b344 deferred click-close path while text preview stability remains.");
