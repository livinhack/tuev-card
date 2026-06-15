// Kennzeichen Physical Lab b102
// CAD-like model layer: every coordinate, size and distance in this file is millimetres.
// No CSS pixels, devicePixelRatio, browser zoom or monitor calibration are used here.
// b102 keeps the supplied DXF sketches, separate seal geometry and no extra seal gaps; GL-Mittelschrift uses the current manual 125 / 92.5 mm calibration profile, and a horizontal cell-check layer is available.

export const WIDTH_BANDS = Object.freeze({
  middle: [340, 380, 420, 460, 480, 520],
  narrow: [320, 340, 380, 420, 460, 480, 520]
});

export const FONT_CALIBRATION_PROFILES_MM = Object.freeze({
  middleManualB102: {
    label: "GL-Mittelschrift · manuell kalibriert b102",
    targetGlyphHeight: 75,
    fontSize: 125,
    baselineY: 92.5,
    note: "Aktueller manueller Kalibrierstand für die GL-Mittelschrift im 75-mm-Zeichenband."
  },
  narrowPending: {
    label: "GL-Engschrift · noch separat zu kalibrieren",
    targetGlyphHeight: 75,
    fontSize: 125,
    baselineY: 92.5,
    note: "Vorläufiger Startwert; Engschrift wird später separat geprüft."
  }
});

export const DXF_REFERENCE_MM = Object.freeze({
  source: "Euro-Einzeilig.dxf / Skizze2.dxf",
  coordinateMode: "normalised top-left plate coordinates",
  body: {
    outerHeight: 110,
    innerInset: 4.5,
    innerHeight: 101,
    outerCornerRadius: 9.25,
    innerCornerRadius: 4.75
  },
  euro: {
    x: 4.5,
    y: 4.5,
    width: 45,
    height: 101,
    starsCenterX: 27,
    starsCenterY: 36.5,
    starsRadius: 15,
    countryCenterX: 27,
    countryBaselineY: 89.5
  },
  seals: {
    columnInnerWidth: 63.5,
    columnOuterWidth: 67.5,
    huDiameter: 35,
    huCenterY: 29.5,
    authorityDiameter: 45,
    authorityCenterY: 75.5,
    visibleCircleGap: 6
  }
});

export const ONE_LINE_RULES_MM = Object.freeze({
  name: "Einzeiliges Standardkennzeichen",
  reference: DXF_REFERENCE_MM.source,
  outerHeight: DXF_REFERENCE_MM.body.outerHeight,
  maxWidth: 520,
  innerInset: DXF_REFERENCE_MM.body.innerInset,
  innerHeight: DXF_REFERENCE_MM.body.innerHeight,
  outerCornerRadius: DXF_REFERENCE_MM.body.outerCornerRadius,
  innerCornerRadius: DXF_REFERENCE_MM.body.innerCornerRadius,
  euro: {
    ...DXF_REFERENCE_MM.euro,
    country: "D"
  },
  content: {
    topClearance: 13,
    characterHeight: 75,
    bottomClearance: 13,
    sideClearance: 8,
    groupGap: 24,
    seal: {
      columnWidth: DXF_REFERENCE_MM.seals.columnInnerWidth,
      columnMaxWidth: DXF_REFERENCE_MM.seals.columnOuterWidth,
      huDiameter: DXF_REFERENCE_MM.seals.huDiameter,
      huCenterY: DXF_REFERENCE_MM.seals.huCenterY,
      authorityDiameter: DXF_REFERENCE_MM.seals.authorityDiameter,
      authorityCenterY: DXF_REFERENCE_MM.seals.authorityCenterY,
      visibleCircleGap: DXF_REFERENCE_MM.seals.visibleCircleGap
    }
  },
  cells: {
    middle: {
      label: "Mittelschrift",
      fontFamily: "GL-Nummernschild-Mtl",
      letterWidth: 47.5,
      digitWidth: 44.5,
      gap: 8,
      characterHeight: 75,
      // Font output calibration is still in mm. It is not viewer scaling.
      // SVG font-size does not equal visible cap height, therefore this can be tuned separately.
      fontSize: FONT_CALIBRATION_PROFILES_MM.middleManualB102.fontSize,
      baselineY: FONT_CALIBRATION_PROFILES_MM.middleManualB102.baselineY
    },
    narrow: {
      label: "Engschrift",
      fontFamily: "GL-Nummernschild-Eng",
      letterWidth: 40.5,
      digitWidth: 38.5,
      gap: 8,
      characterHeight: 75,
      fontSize: FONT_CALIBRATION_PROFILES_MM.narrowPending.fontSize,
      baselineY: FONT_CALIBRATION_PROFILES_MM.narrowPending.baselineY
    }
  },
  dimensions: {
    enabledMarginRight: 40,
    enabledMarginBottom: 32,
    baselineOffset: 18
  }
});

export function parsePlate(input) {
  const normalized = String(input || "")
    .toUpperCase()
    .replace(/[^A-Z0-9ÄÖÜ\s-]/g, " ")
    .replace(/[\s-]+/g, " ")
    .trim();
  const parts = normalized ? normalized.split(" ") : [];

  if (parts.length >= 2) {
    return {
      normalized,
      district: parts[0],
      recognition: parts.slice(1).join(""),
      parts
    };
  }

  return {
    normalized,
    district: "",
    recognition: parts[0] || "",
    parts
  };
}

export function buildPlateModelMm(input, options = {}) {
  const fontMode = options.fontMode === "narrow" ? "narrow" : "middle";
  const rules = ONE_LINE_RULES_MM;
  const baseFont = rules.cells[fontMode];
  const font = {
    ...baseFont,
    fontSize: positiveNumber(options.fontSize, baseFont.fontSize),
    baselineY: positiveNumber(options.baselineY, baseFont.baselineY),
    fit: options.fontFit || null
  };
  const parsed = parsePlate(input);
  const districtCells = makeCells(parsed.district, font, "district");
  const recognitionGroups = splitRecognition(parsed.recognition);
  const recognitionCells = recognitionGroups.map((group, index) => ({
    type: "group",
    key: `recognition-${index}`,
    cells: makeCells(group.value, font, group.type)
  }));
  const content = buildContentSequence({ districtCells, recognitionCells, rules, font });
  const rawContentWidth = content.reduce((sum, item) => sum + item.width, 0);
  const width = resolveWidthMm({ rawContentWidth, fontMode, requestedWidth: options.widthMode, rules });
  const contentLimits = getContentLimits(rules, width);
  const centeredStart = contentLimits.left + (contentLimits.width - rawContentWidth) / 2;
  const xStart = Math.max(contentLimits.left + rules.content.sideClearance, centeredStart);
  const positioned = positionContent(content, xStart);
  const rightEdge = xStart + rawContentWidth;
  const sealGeometry = getSealGeometryForContent(rules, positioned);
  const metrics = {
    input,
    normalized: parsed.normalized,
    district: parsed.district,
    recognition: parsed.recognition,
    fontMode,
    fontLabel: font.label,
    cellLetterWidth: font.letterWidth,
    cellDigitWidth: font.digitWidth,
    cellGap: font.gap,
    groupGap: rules.content.groupGap,
    width,
    height: rules.outerHeight,
    rawContentWidth,
    dxfReference: rules.reference,
    outerCornerRadius: rules.outerCornerRadius,
    innerCornerRadius: rules.innerCornerRadius,
    innerInset: rules.innerInset,
    innerHeight: rules.innerHeight,
    euroX: rules.euro.x,
    euroWidth: rules.euro.width,
    euroHeight: rules.euro.height,
    characterBandY: getCharacterBand(rules).y,
    characterBandHeight: getCharacterBand(rules).height,
    characterFontSize: font.fontSize,
    characterBaselineY: font.baselineY,
    fontFitMode: options.fontFit?.mode || "manual",
    fontFitVisibleHeight: options.fontFit?.measured?.visibleHeight ?? null,
    fontFitTopY: options.fontFit?.measured?.topY ?? null,
    fontFitBottomY: options.fontFit?.measured?.bottomY ?? null,
    sealColumnWidth: rules.content.seal.columnWidth,
    sealColumnMaxWidth: rules.content.seal.columnMaxWidth,
    huDiameter: rules.content.seal.huDiameter,
    huCenterY: rules.content.seal.huCenterY,
    authorityDiameter: rules.content.seal.authorityDiameter,
    authorityCenterY: rules.content.seal.authorityCenterY,
    sealVisibleCircleGap: rules.content.seal.visibleCircleGap,
    sealAdjacentGapPolicy: "none - 63.5 mm seal column includes its adjacent spacing",
    sealCenterX: sealGeometry?.cx ?? null,
    remainingLeft: xStart - contentLimits.left,
    remainingRight: contentLimits.right - rightEdge,
    modelUnit: "mm",
    modelNote: "Pure mm model. The viewer may scale the complete SVG, but the model never sees pixels."
  };

  return { parsed, rules, font, content: positioned, metrics };
}

export function renderPlateSvgMm(input, options = {}) {
  const model = buildPlateModelMm(input, options);
  const { rules, metrics } = model;
  const stage = options.stage || "complete";
  const showDimensions = options.showDimensions !== false;
  const layers = [];

  layers.push(renderBody(model));

  if (["dxf", "grid", "seals", "text", "horizontal", "complete"].includes(stage)) {
    layers.push(renderDxfReferenceGuides(model));
  }
  if (["grid", "seals", "text", "horizontal", "complete"].includes(stage)) {
    layers.push(renderGrid(model));
  }
  if (["seals", "text", "horizontal", "complete"].includes(stage)) {
    layers.push(renderSeals(model));
  }
  if (["text", "horizontal", "complete"].includes(stage)) {
    layers.push(renderText(model));
  }
  if (stage === "horizontal") {
    layers.push(renderHorizontalDiagnostics(model));
  }
  if (showDimensions) {
    layers.push(renderDimensions(model));
  }

  const canvas = getCanvasMm(model, showDimensions);
  const svg = `
<svg class="physical-plate-svg" data-model-unit="mm" data-plate-width-mm="${metrics.width}" data-plate-height-mm="${rules.outerHeight}" viewBox="${canvas.x} ${canvas.y} ${canvas.width} ${canvas.height}" role="img" aria-label="Kennzeichen ${escapeAttr(metrics.normalized)}">
  <defs>
    <filter id="plateShadow" x="-5%" y="-20%" width="110%" height="140%">
      <feDropShadow dx="0" dy="0.8" stdDeviation="0.8" flood-color="black" flood-opacity="0.28"/>
    </filter>
  </defs>
  ${layers.join("\n  ")}
</svg>`.trim();

  return { svg, model, canvas };
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

function makeCells(text, font, role) {
  return [...String(text || "")].map((char, index) => ({
    type: "char",
    role,
    key: `${role}-${index}-${char}`,
    char,
    width: isDigit(char) ? font.digitWidth : font.letterWidth,
    font
  }));
}

function splitRecognition(value) {
  const normalized = String(value || "");
  const matches = normalized.match(/[A-ZÄÖÜ]+|\d+/g) || [];
  return matches.map((part) => ({
    value: part,
    type: /^\d+$/.test(part) ? "digits" : "letters"
  }));
}

function buildContentSequence({ districtCells, recognitionCells, rules, font }) {
  const sequence = [];
  appendCells(sequence, districtCells, font.gap);

  // Anlage-4/DXF interpretation for the seal area:
  // The 63.5 mm seal column is the complete measured area between adjacent character cells.
  // Do not add separate left/right gap items around it, otherwise the seals appear too isolated.
  sequence.push({ type: "seals", key: "seal-zone", width: rules.content.seal.columnWidth });

  recognitionCells.forEach((group, groupIndex) => {
    if (groupIndex > 0) {
      sequence.push({ type: "group-gap", key: `recognition-group-gap-${groupIndex}`, width: rules.content.groupGap });
    }
    appendCells(sequence, group.cells, font.gap);
  });
  return sequence;
}

function appendCells(sequence, cells, gap) {
  cells.forEach((cell, index) => {
    if (index > 0) sequence.push({ type: "char-gap", key: `${cell.role}-gap-${index}`, width: gap });
    sequence.push(cell);
  });
}

function positionContent(sequence, startX) {
  let cursor = startX;
  return sequence.map((item) => {
    const positioned = { ...item, x: cursor };
    cursor += item.width;
    return positioned;
  });
}

function resolveWidthMm({ rawContentWidth, fontMode, requestedWidth, rules }) {
  if (requestedWidth && requestedWidth !== "auto") return Number(requestedWidth);
  const geometry = getFixedHorizontalGeometry(rules);
  const needed = geometry.contentLeft + rawContentWidth + rules.content.sideClearance + rules.innerInset;
  return WIDTH_BANDS[fontMode].find((width) => width >= needed) || rules.maxWidth;
}

function getFixedHorizontalGeometry(rules) {
  const contentLeft = rules.euro.x + rules.euro.width;
  return {
    innerLeft: rules.innerInset,
    innerRightInset: rules.innerInset,
    contentLeft,
    euroRight: contentLeft
  };
}

function getContentLimits(rules, width) {
  const geometry = getFixedHorizontalGeometry(rules);
  const left = geometry.contentLeft;
  const right = width - geometry.innerRightInset;
  return { left, right, width: right - left };
}

export function getCharacterBand(rules) {
  return {
    y: rules.innerInset + rules.content.topClearance,
    height: rules.content.characterHeight
  };
}

function getSealGeometryForContent(rules, content) {
  const seal = content.find((item) => item.type === "seals");
  return seal ? getSealGeometry(rules, seal) : null;
}

function getSealGeometry(rules, sealItem) {
  const charBand = getCharacterBand(rules);
  const sealRules = rules.content.seal;
  const innerWidth = sealRules.columnWidth;
  const outerWidth = sealRules.columnMaxWidth;
  const outerX = sealItem.x - (outerWidth - innerWidth) / 2;
  const cx = sealItem.x + innerWidth / 2;
  const huRadius = sealRules.huDiameter / 2;
  const authorityRadius = sealRules.authorityDiameter / 2;
  return {
    cx,
    innerColumnLeft: sealItem.x,
    innerColumnRight: sealItem.x + innerWidth,
    innerColumnWidth: innerWidth,
    outerColumnLeft: outerX,
    outerColumnRight: outerX + outerWidth,
    outerColumnWidth: outerWidth,
    hu: {
      cy: sealRules.huCenterY,
      diameter: sealRules.huDiameter,
      radius: huRadius
    },
    authority: {
      cy: sealRules.authorityCenterY,
      diameter: sealRules.authorityDiameter,
      radius: authorityRadius
    },
    visibleCircleGap: sealRules.visibleCircleGap,
    charBand
  };
}

function renderBody({ rules, metrics }) {
  const w = metrics.width;
  const h = rules.outerHeight;
  const inset = rules.innerInset;
  const euro = rules.euro;
  return `
<g class="layer layer-body" filter="url(#plateShadow)">
  <rect x="0" y="0" width="${w}" height="${h}" rx="${rules.outerCornerRadius}" fill="#111"/>
  <rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${rules.innerHeight}" rx="${rules.innerCornerRadius}" fill="#f4f3ee"/>
  <rect x="${euro.x}" y="${euro.y}" width="${euro.width}" height="${euro.height}" fill="#0046ad"/>
  ${renderEuStars(euro.starsCenterX, euro.starsCenterY, euro.starsRadius)}
  <text x="${euro.countryCenterX}" y="${euro.countryBaselineY}" text-anchor="middle" font-family="DIN1451Alt, AlteDIN1451Mittelschrift, Arial, sans-serif" font-size="30" font-weight="500" fill="#fff">${escapeText(euro.country)}</text>
</g>`.trim();
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

function renderGrid({ content, rules, metrics }) {
  const charBand = getCharacterBand(rules);
  const parts = content.map((item) => {
    if (item.type === "char") {
      return `<rect x="${item.x}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="rgba(30,165,255,.08)" stroke="rgba(30,165,255,.55)" stroke-width="0.6"/>`;
    }
    if (item.type === "seals") {
      const sealGeometry = getSealGeometry(rules, item);
      return `
        <rect x="${sealGeometry.outerColumnLeft}" y="${charBand.y}" width="${sealGeometry.outerColumnWidth}" height="${charBand.height}" fill="rgba(255,211,107,.05)" stroke="rgba(255,211,107,.5)" stroke-width="0.6" stroke-dasharray="2 1.5"/>
        <rect x="${sealGeometry.innerColumnLeft}" y="${charBand.y}" width="${sealGeometry.innerColumnWidth}" height="${charBand.height}" fill="rgba(255,211,107,.09)" stroke="rgba(255,211,107,.75)" stroke-width="0.8"/>
        <line x1="${sealGeometry.cx}" y1="${charBand.y - 8}" x2="${sealGeometry.cx}" y2="${charBand.y + charBand.height + 8}" stroke="rgba(255,211,107,.45)" stroke-width="0.5"/>
        <circle cx="${sealGeometry.cx}" cy="${sealGeometry.hu.cy}" r="${sealGeometry.hu.radius}" fill="none" stroke="rgba(255,211,107,.8)" stroke-width="0.65" stroke-dasharray="2 1.5"/>
        <circle cx="${sealGeometry.cx}" cy="${sealGeometry.authority.cy}" r="${sealGeometry.authority.radius}" fill="none" stroke="rgba(255,211,107,.8)" stroke-width="0.65" stroke-dasharray="2 1.5"/>`;
    }
    return `<rect x="${item.x}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="rgba(255,99,99,.07)" stroke="rgba(255,99,99,.4)" stroke-width="0.4"/>`;
  });
  const centerLine = `<line x1="0" y1="${rules.outerHeight / 2}" x2="${metrics.width}" y2="${rules.outerHeight / 2}" stroke="rgba(255,255,255,.35)" stroke-width="0.5" stroke-dasharray="4 3"/>`;
  return `<g class="layer layer-grid">${centerLine}${parts.join("")}</g>`;
}

function renderSeals({ content, rules }) {
  const seal = content.find((item) => item.type === "seals");
  if (!seal) return "";
  const geometry = getSealGeometry(rules, seal);
  return `
<g class="layer layer-seals">
  <g class="seal-slot seal-slot-hu">
    <circle cx="${geometry.cx}" cy="${geometry.hu.cy}" r="${geometry.hu.radius}" fill="#1ea5ff" stroke="#111" stroke-width="1.25"/>
    <circle cx="${geometry.cx}" cy="${geometry.hu.cy}" r="${geometry.hu.radius * 0.68}" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="0.8" stroke-dasharray="1.4 1.8"/>
    <text x="${geometry.cx}" y="${geometry.hu.cy + 3.3}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="700" fill="#111">HU</text>
  </g>
  <g class="seal-slot seal-slot-authority">
    <circle cx="${geometry.cx}" cy="${geometry.authority.cy}" r="${geometry.authority.radius}" fill="#d7d7d2" stroke="#999" stroke-width="1"/>
    <circle cx="${geometry.cx}" cy="${geometry.authority.cy}" r="${geometry.authority.radius * 0.55}" fill="none" stroke="rgba(120,120,115,.65)" stroke-width="1"/>
  </g>
</g>`.trim();
}

function renderText({ content, font }) {
  const glyphGuide = font.fit?.measured ? `
    <rect x="0" y="${font.fit.measured.topY}" width="100%" height="${font.fit.measured.visibleHeight}" fill="rgba(92, 214, 255, .035)" stroke="rgba(92, 214, 255, .35)" stroke-width="0.35" stroke-dasharray="2 1.5"/>` : "";
  const chars = content.filter((item) => item.type === "char").map((cell) => `
    <text x="${cell.x + cell.width / 2}" y="${font.baselineY}" text-anchor="middle" font-family="${font.fontFamily}, Arial Narrow, sans-serif" font-size="${font.fontSize}" font-weight="400" fill="#080808">${escapeText(cell.char)}</text>`).join("");
  return `<g class="layer layer-text">${glyphGuide}${chars}</g>`;
}


function renderHorizontalDiagnostics({ content, rules }) {
  const charBand = getCharacterBand(rules);
  const yTop = Math.max(0, charBand.y - 6);
  const yBottom = Math.min(rules.outerHeight, charBand.y + charBand.height + 6);
  const labelY = Math.max(6, charBand.y - 2.5);
  const parts = [];

  for (const item of content) {
    const x1 = item.x;
    const x2 = item.x + item.width;
    const cx = x1 + item.width / 2;

    if (item.type === "char") {
      parts.push(`<line x1="${x1}" y1="${yTop}" x2="${x1}" y2="${yBottom}" stroke="rgba(30,165,255,.9)" stroke-width="0.45"/>`);
      parts.push(`<line x1="${x2}" y1="${yTop}" x2="${x2}" y2="${yBottom}" stroke="rgba(30,165,255,.9)" stroke-width="0.45"/>`);
      parts.push(`<line x1="${cx}" y1="${yTop - 2}" x2="${cx}" y2="${yBottom + 2}" stroke="rgba(255,255,255,.7)" stroke-width="0.35" stroke-dasharray="1.5 1"/>`);
      parts.push(`<text x="${cx}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="4.3" fill="#1ea5ff">${escapeText(item.char)} · ${formatMm(item.width)}</text>`);
      continue;
    }

    if (item.type === "seals") {
      const geometry = getSealGeometry(rules, item);
      parts.push(`<line x1="${geometry.innerColumnLeft}" y1="${yTop}" x2="${geometry.innerColumnLeft}" y2="${yBottom}" stroke="rgba(255,211,107,.95)" stroke-width="0.55"/>`);
      parts.push(`<line x1="${geometry.innerColumnRight}" y1="${yTop}" x2="${geometry.innerColumnRight}" y2="${yBottom}" stroke="rgba(255,211,107,.95)" stroke-width="0.55"/>`);
      parts.push(`<line x1="${geometry.cx}" y1="${yTop - 3}" x2="${geometry.cx}" y2="${yBottom + 3}" stroke="rgba(255,211,107,.8)" stroke-width="0.4" stroke-dasharray="1.5 1"/>`);
      parts.push(`<text x="${geometry.cx}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="4.3" fill="#ffd36b">Siegel · ${formatMm(geometry.innerColumnWidth)}</text>`);
      continue;
    }

    parts.push(`<rect x="${x1}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="rgba(255,99,99,.03)" stroke="rgba(255,99,99,.55)" stroke-width="0.35" stroke-dasharray="1.5 1"/>`);
    parts.push(`<text x="${cx}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="3.6" fill="#ff7777">${formatMm(item.width)}</text>`);
  }

  return `<g class="layer layer-horizontal-diagnostics">${parts.join("")}</g>`;
}

function renderDimensions({ metrics, rules }) {
  const h = rules.outerHeight;
  const w = metrics.width;
  const y = h + rules.dimensions.baselineOffset;
  return `
<g class="layer layer-dimensions" font-family="Arial, sans-serif" font-size="5" fill="#333" stroke="#333" stroke-width="0.45">
  <line x1="0" y1="${y}" x2="${w}" y2="${y}"/>
  <line x1="0" y1="${y - 3}" x2="0" y2="${y + 3}"/>
  <line x1="${w}" y1="${y - 3}" x2="${w}" y2="${y + 3}"/>
  <text x="${w / 2}" y="${y + 8}" text-anchor="middle">${w} mm</text>
  <line x1="${w + 14}" y1="0" x2="${w + 14}" y2="${h}"/>
  <line x1="${w + 11}" y1="0" x2="${w + 17}" y2="0"/>
  <line x1="${w + 11}" y1="${h}" x2="${w + 17}" y2="${h}"/>
  <text x="${w + 23}" y="${h / 2}" dominant-baseline="middle">${h} mm</text>
</g>`.trim();
}

function renderEuStars(cx, cy, r) {
  const stars = [];
  for (let i = 0; i < 12; i += 1) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / 12;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    stars.push(`<text x="${x.toFixed(2)}" y="${(y + 1.6).toFixed(2)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="#ffd200">●</text>`);
  }
  return `<g class="eu-stars">${stars.join("")}</g>`;
}

function formatMm(value) {
  return `${Number(value).toLocaleString("de-DE", { maximumFractionDigits: 1 })} mm`;
}

function isDigit(char) {
  return /\d/.test(char);
}

function positiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function escapeText(value) {
  return String(value).replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]));
}

function escapeAttr(value) {
  return escapeText(value).replace(/"/g, "&quot;");
}
