import { readFileSync } from 'node:fs';

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error(`✗ ${message}`);
    process.exit(1);
  }
}

const editor = read('src/editor/editor.js');
const entry = read('src/tuev-card-entry.js');
const floatingPanels = read('src/editor/floating-panels.js');
const plateBody = read('src/plate/lab-renderer/plate-body.js');

assert(!editor.includes('checkPlateFontAvailable'), 'editor must not import/probe plate font availability for the checkbox');
assert(!editor.includes('ensurePlateFont'), 'editor must not trigger font-load renders from the checkbox path');
assert(editor.includes('from "../plate/renderer.js?v=b342"'), 'editor must keep the public renderer boundary import without font probes');
assert(editor.includes('const canRenderPlate = true;'), 'editor must always expose the graphical plate checkbox');
assert(floatingPanels.includes('${canRenderPlate ? `'), 'display panel keeps the existing render gate contract');
assert(editor.includes('this._pendingGroupSort = null;\n        this._sortConfirmAnchor = null;\n        this.applyGroupSort(groupId, nextSort);'), 'group sort must apply directly instead of waiting behind a confirmation popover');
assert(entry.includes('isGraphicalPlateAvailable() {') && entry.includes('return true;'), 'card graphical plate availability must not depend on async font probes');
assert(entry.includes('isGraphicalPlateAvailable: graphicalPlateEnabled,'), 'shared plate layout must obey only plate_style for graphical/text switching');
assert(plateBody.includes('data-plate-frame-base="true"'), 'plate body must retain a base frame under the reflective field');
assert(plateBody.includes('data-plate-frame="true"') && plateBody.includes('fill="none"') && plateBody.includes('stroke-width="${inset}"'), 'plate body must draw the black frame overlay above the Euro field');

console.log('✓ b342 card/editor sort-font-frame fix checks passed');
