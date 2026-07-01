import fs from 'node:fs';

function fail(message) {
  console.error(`[check:card-editor-text-preview-stability] ${message}`);
  process.exit(1);
}

const entry = fs.readFileSync('src/tuev-card-entry.js', 'utf8');
const renderParts = fs.readFileSync('src/card/render-parts.js', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

if (!entry.includes('The editor preview must keep the same column decision for graphical')) {
  fail('shared text/graphic preview column guard rationale is missing');
}

const layoutContextBlock = entry.slice(
  entry.indexOf('getLayoutContext(isMulti)'),
  entry.indexOf('getPreviewSimulation(requestedColumns, measuredWidth)')
);

if (layoutContextBlock.includes('this.config?.plate_style !== "plate"')) {
  fail('text mode must not bypass the shared editor preview column simulation');
}

if (!entry.includes('getPreviewSimulation(requestedColumns, measuredWidth)')) {
  fail('shared preview simulation call is missing');
}

if (!renderParts.includes('line-height: ${compact ? "18px" : "20px"};')) {
  fail('text plate line-height stabilizer is missing');
}

if (!renderParts.includes('min-height: ${compact ? "18px" : "20px"};')) {
  fail('text plate min-height stabilizer is missing');
}

if (!pkg.version.endsWith('-b347')) {
  fail('package version is not b347');
}

console.log('[check:card-editor-text-preview-stability] OK');
