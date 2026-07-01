// Kennzeichen Physical Lab b312 / SVG render shell component
// Owns final SVG layer composition, canvas expansion and purely visual text/reference layers.
// It must not calculate physical layout positions; it only renders the solved model.

import { getCharacterBand } from "./text-utils.js";
import { renderPlateBody } from "./plate-body.js";
import { renderSeals } from "./seal-components.js";
import { renderSeasonField } from "./season-field.js";
import { renderChangePlateSupplement } from "./change-plate-supplement-renderer.js";
import { escapeSvgAttr as escapeAttr, escapeSvgText as escapeText } from "./svg-escape-utils.js";
import { getItemsOfType } from "./plate-sequence-width-utils.js";

const DEFAULT_TEXT_COLOR = "#080808";

export function renderPlateSvgDocument(model, options = {}) {
  const { rules, metrics } = model;
  const stage = options.stage || "complete";
  const showDimensions = options.showDimensions !== false;
  const showDxfReferenceGuides = options.showDxfReferenceGuides !== false;
  const showGrid = options.showGrid !== false;
  const showSeals = options.showSeals !== false;
  const showText = options.showText !== false;
  const layers = [];
  const debugRenderers = options.debugRenderers || {};

  layers.push(renderPlateBody(model));

  if (showDxfReferenceGuides && ["dxf", "grid", "seals", "text", "horizontal", "complete"].includes(stage)) {
    layers.push(renderDxfReferenceGuides(model));
  }
  if (showGrid && ["grid", "seals", "text", "horizontal", "complete"].includes(stage)) {
    layers.push(renderOptionalLayer(debugRenderers.renderGrid, model));
  }
  if (showSeals && ["seals", "text", "horizontal", "complete"].includes(stage)) {
    layers.push(renderSeals(model, options));
    const changePlateSupplement = renderChangePlateSupplement(model);
    if (changePlateSupplement) layers.push(changePlateSupplement);
  }
  if (["seals", "text", "horizontal", "complete"].includes(stage)) {
    // Season is a text/validity component, not a seal. Keep it visible even if
    // the seal layer is toggled off, and render it before the main glyphs so
    // its field stays in the physical row chain without covering characters.
    layers.push(renderSeasonField(model));
  }
  if (showText && ["text", "horizontal", "complete"].includes(stage)) {
    layers.push(renderTextLayer(model));
  }
  if (stage === "horizontal") {
    layers.push(renderOptionalLayer(debugRenderers.renderHorizontalDiagnostics, model));
  }
  if (showDimensions) {
    layers.push(renderOptionalLayer(debugRenderers.renderDimensions, model));
  }

  const canvas = getCanvasMm(model, showDimensions);
  const extraDefs = String(options.extraDefs || "").trim();
  const svg = `
<svg class="physical-plate-svg" data-model-unit="mm" data-plate-width-mm="${metrics.width}" data-plate-height-mm="${rules.outerHeight}" viewBox="${canvas.x} ${canvas.y} ${canvas.width} ${canvas.height}" role="img" aria-label="Kennzeichen ${escapeAttr(metrics.normalized)}" preserveAspectRatio="xMidYMid meet">
  <defs>
    ${extraDefs}
    <filter id="plateShadow" x="-5%" y="-20%" width="110%" height="140%">
      <feDropShadow dx="0" dy="0.8" stdDeviation="0.8" flood-color="black" flood-opacity="0.28"/>
    </filter>
  </defs>
  ${layers.join("\n  ")}
</svg>`.trim();

  return { svg, model, canvas };
}

function renderOptionalLayer(renderer, model) {
  return typeof renderer === "function" ? renderer(model) : "";
}

export function getCanvasMm(model, showDimensions = true) {
  const { rules, metrics } = model;
  if (!showDimensions) {
    return { x: 0, y: 0, width: metrics.width, height: rules.outerHeight };
  }
  return {
    x: 0,
    y: 0,
    width: metrics.width + rules.dimensions.enabledMarginRight,
    height: rules.outerHeight + rules.dimensions.enabledMarginBottom
  };
}

function renderDxfReferenceGuides({ rules, metrics }) {
  const w = metrics.width;
  const inset = rules.innerInset;
  const euro = rules.euro;
  const charBand = getCharacterBand(rules);
  return `
<g class="layer layer-dxf-guides" fill="none" stroke-linecap="square">
  <rect x="0" y="0" width="${w}" height="${rules.outerHeight}" rx="${rules.outerCornerRadius}" stroke="rgba(255,255,255,.28)" stroke-width="0.45"/>
  <rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${rules.innerHeight}" rx="${rules.innerCornerRadius}" stroke="rgba(255,255,255,.42)" stroke-width="0.45"/>
  <rect x="${euro.x}" y="${euro.y}" width="${euro.width}" height="${euro.height}" stroke="rgba(70,170,255,.8)" stroke-width="0.55"/>
  <line x1="0" y1="${charBand.y}" x2="${w}" y2="${charBand.y}" stroke="rgba(255,255,255,.22)" stroke-width="0.35"/>
  <line x1="0" y1="${charBand.y + charBand.height}" x2="${w}" y2="${charBand.y + charBand.height}" stroke="rgba(255,255,255,.22)" stroke-width="0.35"/>
</g>`.trim();
}

function renderTextLayer({ content, font, metrics }) {
  const glyphGuide = font.fit?.measured ? `
    <rect x="0" y="${font.fit.measured.topY}" width="100%" height="${font.fit.measured.visibleHeight}" fill="rgba(92, 214, 255, .035)" stroke="rgba(92, 214, 255, .35)" stroke-width="0.35" stroke-dasharray="2 1.5"/>` : "";
  const textColor = metrics?.textColor || DEFAULT_TEXT_COLOR;
  const chars = getItemsOfType(content, "char").map((cell) => `
    <text x="${cell.x + cell.width / 2}" y="${cell.baselineY || font.baselineY}" text-anchor="middle" font-family="'${font.fontFamily}', Arial Narrow, sans-serif" font-size="${cell.fontSize || font.fontSize}" font-weight="400" fill="${textColor}">${escapeText(cell.char)}</text>`).join("");
  return `<g class="layer layer-text">${glyphGuide}${chars}</g>`;
}

