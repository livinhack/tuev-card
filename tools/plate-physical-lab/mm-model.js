// Kennzeichen Physical Lab b96
// CAD-like model layer: every coordinate, size and distance in this file is millimetres.
// No CSS pixels, devicePixelRatio, browser zoom or monitor calibration are used here.

export const WIDTH_BANDS = Object.freeze({
  middle: [340, 380, 420, 460, 480, 520],
  narrow: [320, 340, 380, 420, 460, 480, 520]
});

export const ONE_LINE_RULES_MM = Object.freeze({
  name: "Einzeiliges Standardkennzeichen",
  outerHeight: 110,
  maxWidth: 520,
  blackStroke: 3,
  cornerRadius: 7,
  euro: {
    width: 45,
    y: 4.5,
    height: 98,
    country: "D"
  },
  content: {
    topClearance: 13,
    characterHeight: 75,
    bottomClearance: 13,
    sideClearance: 8,
    groupGap: 24,
    sealColumnWidth: 63.5,
    sealDiameter: 35,
    authorityDiameter: 35,
    huCenterY: 37,
    authorityCenterY: 73
  },
  cells: {
    middle: { label: "Mittelschrift", fontFamily: "GL-Nummernschild-Mtl", letterWidth: 47.5, digitWidth: 44.5, gap: 8, fontSize: 75 },
    narrow: { label: "Engschrift", fontFamily: "GL-Nummernschild-Eng", letterWidth: 40.5, digitWidth: 38.5, gap: 8, fontSize: 75 }
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
  const font = rules.cells[fontMode];
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
  const zoneStart = rules.euro.width;
  const zoneWidth = width - rules.euro.width;
  const centeredStart = zoneStart + (zoneWidth - rawContentWidth) / 2;
  const xStart = Math.max(zoneStart + rules.content.sideClearance, centeredStart);
  const positioned = positionContent(content, xStart);
  const rightEdge = xStart + rawContentWidth;
  const metrics = {
    input,
    normalized: parsed.normalized,
    district: parsed.district,
    recognition: parsed.recognition,
    fontMode,
    fontLabel: font.label,
    width,
    height: rules.outerHeight,
    rawContentWidth,
    remainingLeft: xStart - rules.euro.width,
    remainingRight: width - rightEdge,
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

  if (["grid", "seals", "text", "complete"].includes(stage)) {
    layers.push(renderGrid(model));
  }
  if (["seals", "text", "complete"].includes(stage)) {
    layers.push(renderSeals(model));
  }
  if (["text", "complete"].includes(stage)) {
    layers.push(renderText(model));
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
  if (districtCells.length) {
    sequence.push({ type: "char-gap", key: "district-seal-gap", width: font.gap });
  }
  sequence.push({ type: "seals", key: "seal-zone", width: rules.content.sealColumnWidth });
  if (recognitionCells.length) {
    sequence.push({ type: "group-gap", key: "seal-recognition-gap", width: rules.content.groupGap });
  }
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
  const needed = rules.euro.width + rawContentWidth + rules.content.sideClearance * 2;
  return WIDTH_BANDS[fontMode].find((width) => width >= needed) || rules.maxWidth;
}

function renderBody({ rules, metrics }) {
  const w = metrics.width;
  const h = rules.outerHeight;
  const euro = rules.euro;
  return `
<g class="layer layer-body" filter="url(#plateShadow)">
  <rect x="0" y="0" width="${w}" height="${h}" rx="${rules.cornerRadius}" fill="#f4f3ee" stroke="#111" stroke-width="${rules.blackStroke}"/>
  <rect x="${rules.blackStroke / 2}" y="${euro.y}" width="${euro.width - rules.blackStroke / 2}" height="${euro.height}" fill="#0046ad"/>
  ${renderEuStars(23, 29, 10)}
  <text x="22.5" y="91" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="#fff">D</text>
</g>`.trim();
}

function renderGrid({ content, rules, metrics }) {
  const charTop = (rules.outerHeight - rules.content.characterHeight) / 2;
  const seal = content.find((item) => item.type === "seals");
  const parts = content.map((item) => {
    if (item.type === "char") {
      return `<rect x="${item.x}" y="${charTop}" width="${item.width}" height="${rules.content.characterHeight}" fill="rgba(30,165,255,.08)" stroke="rgba(30,165,255,.55)" stroke-width="0.6"/>`;
    }
    if (item.type === "seals") {
      return `<rect x="${item.x}" y="${charTop}" width="${item.width}" height="${rules.content.characterHeight}" fill="rgba(255,211,107,.08)" stroke="rgba(255,211,107,.7)" stroke-width="0.8"/>`;
    }
    return `<rect x="${item.x}" y="${charTop}" width="${item.width}" height="${rules.content.characterHeight}" fill="rgba(255,99,99,.07)" stroke="rgba(255,99,99,.4)" stroke-width="0.4"/>`;
  });
  const centerLine = `<line x1="0" y1="${rules.outerHeight / 2}" x2="${metrics.width}" y2="${rules.outerHeight / 2}" stroke="rgba(255,255,255,.35)" stroke-width="0.5" stroke-dasharray="4 3"/>`;
  return `<g class="layer layer-grid">${centerLine}${parts.join("")}${seal ? `<line x1="${seal.x + seal.width / 2}" y1="0" x2="${seal.x + seal.width / 2}" y2="${rules.outerHeight}" stroke="rgba(255,211,107,.45)" stroke-width="0.5"/>` : ""}</g>`;
}

function renderSeals({ content, rules }) {
  const seal = content.find((item) => item.type === "seals");
  if (!seal) return "";
  const cx = seal.x + seal.width / 2;
  const topCy = rules.content.huCenterY;
  const bottomCy = rules.content.authorityCenterY;
  const r = rules.content.sealDiameter / 2;
  return `
<g class="layer layer-seals">
  <circle cx="${cx}" cy="${topCy}" r="${r}" fill="#1ea5ff" stroke="#111" stroke-width="1.3"/>
  <circle cx="${cx}" cy="${topCy}" r="${r * 0.68}" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="0.8" stroke-dasharray="1.4 1.8"/>
  <text x="${cx}" y="${topCy + 3.3}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="700" fill="#111">HU</text>
  <circle cx="${cx}" cy="${bottomCy}" r="${r}" fill="#d7d7d2" stroke="#999" stroke-width="1"/>
  <circle cx="${cx}" cy="${bottomCy}" r="${r * 0.55}" fill="none" stroke="rgba(120,120,115,.65)" stroke-width="1"/>
</g>`.trim();
}

function renderText({ content, font, rules }) {
  const y = rules.outerHeight / 2 + 8;
  const chars = content.filter((item) => item.type === "char").map((cell) => `
    <text x="${cell.x + cell.width / 2}" y="${y}" text-anchor="middle" font-family="${font.fontFamily}, Arial Narrow, sans-serif" font-size="${font.fontSize}" font-weight="400" fill="#080808">${escapeText(cell.char)}</text>`).join("");
  return `<g class="layer layer-text">${chars}</g>`;
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
    stars.push(`<text x="${x.toFixed(2)}" y="${(y + 1.6).toFixed(2)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="4.2" fill="#ffd200">●</text>`);
  }
  return `<g class="eu-stars">${stars.join("")}</g>`;
}

function isDigit(char) {
  return /\d/.test(char);
}

function escapeText(value) {
  return String(value).replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]));
}

function escapeAttr(value) {
  return escapeText(value).replace(/"/g, "&quot;");
}
