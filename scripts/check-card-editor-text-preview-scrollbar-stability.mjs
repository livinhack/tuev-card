import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => {
  console.error(`Card editor text preview scrollbar stability check failed: ${message}`);
  process.exitCode = 1;
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const card = read('src/tuev-card-entry.js');
const parts = read('src/card/render-parts.js');
const pkg = JSON.parse(read('package.json'));

assert(pkg.version.includes('b347'), 'package version must identify b347.');
assert(card.includes('scrollbar-gutter: stable both-edges'), 'scaled editor preview wrapper must reserve a stable scrollbar gutter.');
assert(card.includes('Math.abs(previousWidth - visibleWidth) < 24'), 'preview visible width must ignore scrollbar-gutter sized oscillations.');
assert(card.includes('this._previewVisibleWidth = visibleWidth'), 'preview visible width must be cached after stable changes.');
assert(card.includes('const textPlatePreview = this.isEditorPreviewContext() && this.config?.plate_style !== "plate"'), 'card must explicitly detect text-plate editor preview mode.');
assert(card.includes('const tolerance = textPlatePreview ? 8 : 2'), 'text-plate preview height updates must use a wider tolerance than normal graphical preview scaling.');
assert(card.includes('const delays = textPlatePreview ? [120, 360] : [80, 180, 360, 750, 1500, 3000]'), 'text-plate preview must avoid the long repeated width refresh train.');
assert(parts.includes('height: ${compact ? "18px" : "20px"};'), 'text plate fallback must have a fixed line box height.');
assert(parts.includes('width: 100%;') && parts.includes('max-width: 100%;') && parts.includes('flex: 0 0 auto;'), 'text plate fallback must not expand the vehicle tile or grid.');

if (!process.exitCode) {
  console.log('Card editor text preview scrollbar stability OK: text plate preview has stable width/height hysteresis and fixed text plate box.');
}
