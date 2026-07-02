import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => {
  console.error(`Card editor preview inner-width scale check failed: ${message}`);
  process.exitCode = 1;
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const card = read('src/tuev-card-entry.js');
const pkg = JSON.parse(read('package.json'));

assert(pkg.version.includes('b353'), 'package version must identify b353.');
assert(card.includes('getPreviewScaleSafetyPx()'), 'b353 must name the preview scale safety inset.');
assert(card.includes('const scrollbarReserve = 18;') && card.includes('const edgeReserve = 8;'), 'preview safety inset must reserve scrollbar and edge space.');
assert(card.includes('const outerVisiblePreviewWidth = measuredWidth > 0'), 'outer visible width must be capped by measured card width when available.');
assert(card.includes('Math.min(rawVisibleWidth, measuredWidth)'), 'outer visible width must avoid using a wider raw preview pane when the card element is smaller.');
assert(card.includes('const visiblePreviewWidth = Math.max(120, outerVisiblePreviewWidth - previewScaleSafetyPx);'), 'scale target must use inner usable preview width after safety inset.');
assert(card.includes('visiblePreviewWidth / simulatedWidth'), 'scale must be computed from inner usable width.');
assert(card.includes('width: ${layoutContext.outerVisiblePreviewWidth ? `${layoutContext.outerVisiblePreviewWidth}px`'), 'outer wrapper should still occupy the visible pane while inner content scales to the usable width.');
assert(card.includes('["safety", layoutContext.previewScaleSafetyPx]'), 'diagnostic overlay must expose the b353 safety inset while this preview issue is under test.');
assert(!card.includes('this.getPreviewVisibleWidth() || measuredWidth'), 'visible preview width must not fall back to measured ancestor width.');

if (!process.exitCode) {
  console.log('Card editor preview inner-width scale OK: b353 scales simulated preview content to the inner usable pane width while preserving the outer wrapper edge.');
}
