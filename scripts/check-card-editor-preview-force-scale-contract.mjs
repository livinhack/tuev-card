import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => {
  console.error(`Card editor preview force-scale contract check failed: ${message}`);
  process.exitCode = 1;
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const card = read('src/tuev-card-entry.js');
const pkg = JSON.parse(read('package.json'));

assert(pkg.version.includes('b355'), 'package version must identify b355.');
assert(card.includes('const rawVisibleWidth = this.getPreviewVisibleWidth();'), 'layout context must read raw visible preview width separately.');
assert(!card.includes('this.getPreviewVisibleWidth() || measuredWidth'), 'visible preview width must never fall back to measured ancestor width.');
assert(card.includes('const shouldScalePreview = simulatedWidth > visiblePreviewWidth + 4;'), 'preview must detect simulated width overflow against the visible pane.');
assert(card.includes('if (shouldScalePreview) {'), 'simulated preview overflow must enter the scaled path before any bypass.');
assert(card.includes('previewScaled: true') && card.includes('visiblePreviewWidth,'), 'scaled layout context must expose visiblePreviewWidth to the wrapper.');
assert(card.includes('width: ${layoutContext.outerVisiblePreviewWidth ? `${layoutContext.outerVisiblePreviewWidth}px`'), 'scaled preview outer wrapper must use the capped outer visible preview width, not the possibly oversized host width.');
assert(card.includes('max-width: 100%;'), 'scaled preview outer wrapper must remain bounded by the HA preview pane.');
assert(!card.includes('scale >= 0.995 && measuredWidth >= simulatedWidth - 4'), 'measuredWidth-based preview bypass must stay removed.');
assert(!card.includes('scale >= 0.995 && visiblePreviewWidth >= simulatedWidth - 4'), 'near-1 scale bypass must not precede the force-scale contract.');

if (!process.exitCode) {
  console.log('Card editor preview force-scale contract OK: simulated preview width larger than the visible pane forces scaled rendering and the wrapper is bounded to the visible width.');
}
