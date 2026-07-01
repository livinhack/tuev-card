import fs from 'node:fs';

function fail(message) {
  console.error(`[check:card-editor-text-preview-stability] ${message}`);
  process.exit(1);
}

const entry = fs.readFileSync('src/tuev-card-entry.js', 'utf8');
const renderParts = fs.readFileSync('src/card/render-parts.js', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

if (!entry.includes('this.config?.plate_style !== "plate"')) {
  fail('editor preview text-mode guard is missing');
}

if (!entry.includes('Text plates have no fixed SVG box')) {
  fail('text-mode preview guard rationale comment is missing');
}

if (!entry.includes('previewScaled: false')) {
  fail('preview scaling opt-out is missing');
}

if (!renderParts.includes('line-height: ${compact ? "18px" : "20px"};')) {
  fail('text plate line-height stabilizer is missing');
}

if (!renderParts.includes('min-height: ${compact ? "18px" : "20px"};')) {
  fail('text plate min-height stabilizer is missing');
}

if (!pkg.version.endsWith('-b343')) {
  fail('package version is not b343');
}

console.log('[check:card-editor-text-preview-stability] OK');
