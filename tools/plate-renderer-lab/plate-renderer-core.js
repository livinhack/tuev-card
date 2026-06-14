// TÜV Card plate renderer lab core
// Standalone, browser-only module for VS Code Live Server.
// Coordinates are millimetres. Rendering is intentionally generic: it reserves
// official seal positions but never reproduces real authority seal artwork.

export const FZV_RULES = Object.freeze({
  source: {
    title: "FZV Anlage 4 - Ausgestaltung der Kennzeichen",
    url: "https://www.gesetze-im-internet.de/fzv_2023/anlage_4.html"
  },
  sizes: {
    oneLine: { key: "oneLine", label: "Einzeilig", maxWidth: 520, height: 110, euro: { width: 45, height: 88, y: 11, starDiameter: 30, countryHeight: 20, countryGap: 17 }, borderWidth: 3, cornerRadius: 7, font: "normal" },
    twoLine: { key: "twoLine", label: "Zweizeilig", maxWidth: 340, maxWidthTricycle: 280, height: 200, euro: { width: 40, height: 88, y: 8, starDiameter: 30, countryHeight: 20, countryGap: 17 }, borderWidth: 3, cornerRadius: 8, font: "normal" },
    motorcycle: { key: "motorcycle", label: "Kraftrad", minWidth: 180, maxWidth: 220, height: 200, euro: { width: 40, height: 88, y: 8, starDiameter: 30, countryHeight: 20, countryGap: 17 }, borderWidth: 3, cornerRadius: 8, font: "small" },
    smallTwoLine: { key: "smallTwoLine", label: "Verkleinert zweizeilig", maxWidth: 255, height: 130, euro: { width: 35, height: 56, y: 7, starDiameter: 22.5, countryHeight: 15, countryGap: 8 }, borderWidth: 2, cornerRadius: 6, font: "small" }
  },
  fonts: {
    normalMtl: { key: "normalMtl", label: "Mittelschrift 75", family: "GL-Nummernschild-Mtl", size: 75, letterWidth: 47.5, digitWidth: 44.5, gap: 9 },
    normalEng: { key: "normalEng", label: "Engschrift 75", family: "GL-Nummernschild-Eng", size: 75, letterWidth: 40.5, digitWidth: 38.5, gap: 8 },
    smallMtl: { key: "smallMtl", label: "Verkleinerte Mittelschrift 49", family: "GL-Nummernschild-Mtl", size: 49, letterWidth: 31, digitWidth: 29, gap: 7 },
    smallEng: { key: "smallEng", label: "Verkleinerte Engschrift 49 (Hilfsprofil)", family: "GL-Nummernschild-Eng", size: 49, letterWidth: 26.5, digitWidth: 25, gap: 6 }
  },
  clearances: {
    minBorderText: 8,
    minEuroText: 8,
    characterGapMin: 8,
    characterGapMax: 10,
    compactSmallGapMin: 5,
    compactSmallGapMax: 20,
    seasonFieldGap: 8,
    exportDateFieldGap: 8
  },
  seal: {
    authorityDiameter: 35,
    huDiameter: 35,
    motorcycleAuthorityDiameter: 45,
    motorcycleHuDiameter: 35,
    shortTermAuthorityDiameter: 35,
    exportAuthorityDiameter: 35
  },
  suffixLimits: {
    generalTotal: 8,
    oldtimerOneLine: 7,
    oldtimerTwoLineRecognition: 5,
    oldtimerMotorcycleRecognition: 4,
    seasonOneLine: 7,
    seasonRecognition: 5,
    electricSeasonOneLine: 6,
    electricTwoLineRecognition: 5,
    electricMotorcycleRecognition: 4,
    exchangeTotalWithoutW: 8
  }
});

const COLORS = Object.freeze({
  face: "#f6f6f0",
  faceShadow: "#e9e7de",
  black: "#111111",
  blue: "#003399",
  red: "#b00000",
  green: "#10763b",
  yellow: "#f8d545",
  exportRed: "#d52b1e",
  debug: "#ff0077"
});

const MONTH_COLORS = ["#c07a45", "#1ea5ff", "#f0c739", "#bfbfbf", "#d9a2ad", "#6fbe77"];

export function normalizePlate(input) {
  return String(input || "")
    .trim()
    .replace(/[‐‑‒–—-]+/g, " ")
    .replace(/\s+/g, " ")
    .toUpperCase();
}

export function parsePlate(input, kind = "general") {
  const normalized = normalizePlate(input);
  const tokens = normalized ? normalized.split(" ").filter(Boolean) : [];
  let district = tokens[0] || "";
  let recognition = tokens.slice(1).join("");
  let suffix = "";

  if (["oldtimer", "electric"].includes(kind)) {
    suffix = kind === "oldtimer" ? "H" : "E";
    recognition = recognition.replace(/[HE]$/u, "") + suffix;
  }

  if (["electricSeason"].includes(kind)) {
    suffix = "E";
    recognition = recognition.replace(/E$/u, "") + suffix;
  }

  if (!district && tokens.length === 1) {
    district = "";
    recognition = tokens[0];
  }

  return {
    raw: input,
    normalized,
    tokens,
    district,
    recognition,
    suffix,
    visible: [district, recognition].filter(Boolean).join(" "),
    totalCount: (district + recognition).replace(/\s/g, "").length,
    recognitionCount: recognition.replace(/\s/g, "").length
  };
}

export function analysePlate(input, options = {}) {
  const kind = options.kind || "general";
  const layoutKey = options.layout || "oneLine";
  const layout = FZV_RULES.sizes[layoutKey] || FZV_RULES.sizes.oneLine;
  const parsed = parsePlate(input, kind);
  const warnings = [];
  const errors = [];

  if (!parsed.normalized) {
    errors.push("Kein Kennzeichen eingegeben.");
  }

  const mode = resolveMode(kind, layoutKey);
  validateCounts({ parsed, kind, layoutKey, errors, warnings });

  if (kind === "season" || kind === "electricSeason") {
    const start = Number(options.seasonStart || 0);
    const end = Number(options.seasonEnd || 0);
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || start > 12 || end < 1 || end > 12) {
      errors.push("Saisonmonat muss zwischen 1 und 12 liegen.");
    }
  }

  if (kind === "shortTerm" || kind === "export") {
    const expiry = normalizeExpiry(options.expiry);
    if (!expiry) {
      warnings.push("Ablaufdatum fehlt; Demo nutzt Platzhalter.");
    }
  }

  const alternatives = buildAlternatives(parsed, kind, layout, options);
  const chosen = chooseAlternative(alternatives, layout.maxWidth);
  if (!chosen) {
    errors.push(`Passt nicht in ${layout.label} mit Größtmaß ${layout.maxWidth} mm.`);
  } else if (chosen.width > layout.maxWidth + 0.01) {
    errors.push(`Berechnete Breite ${formatNumber(chosen.width)} mm überschreitet ${layout.maxWidth} mm.`);
  }

  return {
    input,
    parsed,
    kind,
    layoutKey,
    layout,
    mode,
    chosen,
    alternatives,
    warnings,
    errors,
    valid: errors.length === 0
  };
}

export function renderPlateSvg(input, options = {}) {
  const analysis = analysePlate(input, options);
  const chosen = analysis.chosen || analysis.alternatives[0];
  if (!chosen) {
    return renderErrorSvg(analysis);
  }

  const scale = Number(options.scale || 1);
  const width = chosen.width;
  const height = analysis.layout.height;
  const displayWidth = Math.round(width * scale);
  const displayHeight = Math.round(height * scale);
  const colorProfile = getColorProfile(analysis.kind);
  const svg = buildSvg({ analysis, chosen, width, height, displayWidth, displayHeight, colorProfile, options });

  return { svg, analysis };
}

function resolveMode(kind, layoutKey) {
  const dateField = ["season", "electricSeason"].includes(kind)
    ? "season"
    : kind === "shortTerm"
      ? "short-term-expiry"
      : kind === "export"
        ? "export-expiry"
        : null;
  return { kind, layoutKey, dateField, isRear: true };
}

function validateCounts({ parsed, kind, layoutKey, errors, warnings }) {
  const countWithoutSuffix = parsed.totalCount - (parsed.suffix ? 1 : 0);
  const recognitionWithoutSuffix = parsed.recognitionCount - (parsed.suffix ? 1 : 0);

  if (kind === "general" && parsed.totalCount > FZV_RULES.suffixLimits.generalTotal) {
    errors.push("Mehr als acht Stellen sind für allgemeine Kennzeichen unzulässig.");
  }

  if (kind === "oldtimer") {
    if (layoutKey === "oneLine" && countWithoutSuffix > FZV_RULES.suffixLimits.oldtimerOneLine) errors.push("Oldtimer einzeilig: höchstens sieben Stellen ohne H.");
    if (["twoLine", "smallTwoLine"].includes(layoutKey) && recognitionWithoutSuffix > FZV_RULES.suffixLimits.oldtimerTwoLineRecognition) errors.push("Oldtimer zweizeilig/verkleinert: höchstens fünf Stellen in der Erkennungsnummer ohne H.");
    if (layoutKey === "motorcycle" && recognitionWithoutSuffix > FZV_RULES.suffixLimits.oldtimerMotorcycleRecognition) errors.push("Oldtimer Kraftrad: höchstens vier Stellen in der Erkennungsnummer ohne H.");
  }

  if (kind === "season") {
    if (layoutKey === "oneLine" && parsed.totalCount > FZV_RULES.suffixLimits.seasonOneLine) errors.push("Saison einzeilig: höchstens sieben Stellen.");
    if (layoutKey !== "oneLine" && parsed.recognitionCount > FZV_RULES.suffixLimits.seasonRecognition) errors.push("Saison zweizeilig/Kraftrad/verkleinert: höchstens fünf Stellen in der Erkennungsnummer.");
  }

  if (kind === "electricSeason") {
    if (layoutKey === "oneLine" && countWithoutSuffix > FZV_RULES.suffixLimits.electricSeasonOneLine) errors.push("E-Saison einzeilig: höchstens sechs Stellen ohne E.");
    if (["twoLine", "smallTwoLine"].includes(layoutKey) && recognitionWithoutSuffix > FZV_RULES.suffixLimits.electricTwoLineRecognition) errors.push("E-Saison zweizeilig/verkleinert: höchstens fünf Stellen in der Erkennungsnummer ohne E.");
    if (layoutKey === "motorcycle" && recognitionWithoutSuffix > FZV_RULES.suffixLimits.electricMotorcycleRecognition) errors.push("E-Saison Kraftrad: höchstens vier Stellen in der Erkennungsnummer ohne E.");
  }

  if (kind === "exchange" && parsed.totalCount > FZV_RULES.suffixLimits.exchangeTotalWithoutW) {
    errors.push("Wechselkennzeichen: höchstens acht Stellen ohne W.");
  }

  if (!parsed.district && parsed.recognition) {
    warnings.push("Keine getrennte Ortskennung erkannt; Plakettenpositionen können nicht normnah zwischen Ortskennung und Erkennungsnummer gesetzt werden.");
  }
}

function buildAlternatives(parsed, kind, layout, options) {
  const fontSet = layout.font === "small"
    ? [FZV_RULES.fonts.smallMtl, FZV_RULES.fonts.smallEng]
    : [FZV_RULES.fonts.normalMtl, FZV_RULES.fonts.normalEng];

  return fontSet.map((font) => buildPhysicalLayout({ parsed, kind, layout, font, options }));
}

function chooseAlternative(alternatives, maxWidth) {
  return alternatives.find((candidate) => candidate.width <= maxWidth + 0.01) || alternatives[alternatives.length - 1] || null;
}

function buildPhysicalLayout({ parsed, kind, layout, font, options }) {
  const sideMin = FZV_RULES.clearances.minBorderText;
  const euroGap = kind === "export" ? 0 : FZV_RULES.clearances.minEuroText;
  const hasEuro = kind !== "export";
  const hasSeals = !["red", "export"].includes(kind);
  const hasHu = hasSeals && !["red", "shortTerm"].includes(kind);
  const hasAuthority = hasSeals || ["shortTerm", "export"].includes(kind);
  const hasSeason = ["season", "electricSeason"].includes(kind);
  const hasShortTerm = kind === "shortTerm";
  const hasExport = kind === "export";
  const hasDateField = hasSeason || hasShortTerm || hasExport;
  const dateFieldWidth = getDateFieldWidth(kind, layout);
  const sealColumnWidth = hasAuthority || hasHu ? getSealColumnWidth(kind, layout) : 0;
  const districtRun = makeRun(parsed.district, font);
  const recognitionRun = makeRun(parsed.recognition, font);

  if (layout.key === "oneLine") {
    const fieldGap = hasDateField ? FZV_RULES.clearances.seasonFieldGap : 0;
    const contentStart = (hasEuro ? layout.euro.width + euroGap : sideMin);
    const sealGap = sealColumnWidth ? font.gap : 0;
    const partsWidth =
      districtRun.width +
      (parsed.district && parsed.recognition ? font.gap : 0) +
      sealColumnWidth +
      (sealColumnWidth ? font.gap : 0) +
      recognitionRun.width;
    const rawWidth = contentStart + partsWidth + sideMin + (hasDateField ? fieldGap + dateFieldWidth : 0);
    const width = Math.min(layout.maxWidth, Math.max(rawWidth, hasEuro ? layout.euro.width + 110 : 120));
    const extra = Math.max(0, width - rawWidth);
    const balancedExtra = extra / 2;
    const textX = contentStart + balancedExtra;
    const sealX = textX + districtRun.width + (parsed.district && parsed.recognition ? font.gap : 0) + sealColumnWidth / 2;
    const recognitionX = textX + districtRun.width + (parsed.district && parsed.recognition ? font.gap : 0) + sealColumnWidth + sealGap;
    return {
      layoutKey: layout.key,
      kind,
      font,
      width,
      height: layout.height,
      hasEuro,
      hasHu,
      hasAuthority,
      hasSeason,
      hasShortTerm,
      hasExport,
      dateFieldWidth,
      overflow: rawWidth > layout.maxWidth,
      runs: [
        { ...districtRun, x: textX, y: layout.height / 2 + 2 },
        { ...recognitionRun, x: recognitionX, y: layout.height / 2 + 2 }
      ].filter((run) => run.text),
      seals: makeSeals({ kind, layout, x: sealX, hasHu, hasAuthority }),
      dateField: hasDateField ? makeDateField({ kind, layout, x: width - sideMin - dateFieldWidth + balancedExtra * 0, options }) : null,
      debug: { rawWidth, extra, contentStart, sideMin, partsWidth }
    };
  }

  if (layout.key === "motorcycle") {
    const width = Math.min(layout.maxWidth, Math.max(layout.minWidth || 180, layout.euro.width + euroGap + Math.max(districtRun.width, recognitionRun.width) + sideMin));
    const districtX = layout.euro.width + euroGap;
    const row2X = sideMin + (width - sideMin * 2 - recognitionRun.width) / 2;
    return {
      layoutKey: layout.key,
      kind,
      font,
      width,
      height: layout.height,
      hasEuro,
      hasHu,
      hasAuthority,
      hasSeason,
      hasShortTerm,
      hasExport,
      dateFieldWidth,
      overflow: false,
      runs: [
        { ...districtRun, x: districtX, y: 53 },
        { ...recognitionRun, x: row2X, y: 142 }
      ].filter((run) => run.text),
      seals: makeSeals({ kind, layout, x: width / 2, hasHu, hasAuthority }),
      dateField: hasDateField ? makeDateField({ kind, layout, x: width - sideMin - dateFieldWidth, options }) : null,
      debug: { rawWidth: width }
    };
  }

  // two-line and compact two-line
  const rowFontY = layout.key === "smallTwoLine" ? { top: 39, bottom: 96 } : { top: 62, bottom: 154 };
  const topStart = hasEuro ? layout.euro.width + euroGap : sideMin;
  const maxTextWidth = Math.max(districtRun.width, recognitionRun.width + (hasDateField ? dateFieldWidth + FZV_RULES.clearances.seasonFieldGap : 0));
  const rawWidth = topStart + maxTextWidth + sideMin;
  const width = Math.min(layout.maxWidth, Math.max(rawWidth, layout.key === "smallTwoLine" ? 160 : 220));
  const row2X = sideMin + (width - sideMin * 2 - recognitionRun.width - (hasDateField ? dateFieldWidth + FZV_RULES.clearances.seasonFieldGap : 0)) / 2;

  return {
    layoutKey: layout.key,
    kind,
    font,
    width,
    height: layout.height,
    hasEuro,
    hasHu,
    hasAuthority,
    hasSeason,
    hasShortTerm,
    hasExport,
    dateFieldWidth,
    overflow: rawWidth > layout.maxWidth,
    runs: [
      { ...districtRun, x: topStart, y: rowFontY.top },
      { ...recognitionRun, x: row2X, y: rowFontY.bottom }
    ].filter((run) => run.text),
    seals: makeSeals({ kind, layout, x: layout.key === "smallTwoLine" ? width - 54 : 55, hasHu, hasAuthority }),
    dateField: hasDateField ? makeDateField({ kind, layout, x: width - sideMin - dateFieldWidth, options }) : null,
    debug: { rawWidth, maxTextWidth, topStart }
  };
}

function getDateFieldWidth(kind, layout) {
  if (["season", "electricSeason"].includes(kind)) return layout.key === "smallTwoLine" ? 26 : 32;
  if (kind === "shortTerm") return layout.key === "oneLine" ? 45 : 42;
  if (kind === "export") return layout.key === "oneLine" ? 45 : 42;
  return 0;
}

function getSealColumnWidth(kind, layout) {
  if (layout.key === "motorcycle") return 80;
  if (layout.key === "smallTwoLine") return 36;
  return 38;
}

function makeSeals({ kind, layout, x, hasHu, hasAuthority }) {
  if (!hasHu && !hasAuthority) return [];
  if (layout.key === "motorcycle") {
    return [
      hasHu ? { type: "hu", x: x - 24, y: 90, diameter: FZV_RULES.seal.motorcycleHuDiameter } : null,
      hasAuthority ? { type: kind === "shortTerm" ? "authorityBlue" : "authority", x: x + 26, y: 90, diameter: FZV_RULES.seal.motorcycleAuthorityDiameter } : null
    ].filter(Boolean);
  }
  if (layout.key === "twoLine") {
    return [
      hasHu ? { type: "hu", x, y: 94, diameter: FZV_RULES.seal.huDiameter } : null,
      hasAuthority ? { type: kind === "shortTerm" ? "authorityBlue" : "authority", x, y: 139, diameter: FZV_RULES.seal.authorityDiameter } : null
    ].filter(Boolean);
  }
  if (layout.key === "smallTwoLine") {
    return [
      hasHu ? { type: "hu", x, y: 42, diameter: 25 } : null,
      hasAuthority ? { type: kind === "shortTerm" ? "authorityBlue" : "authority", x, y: 82, diameter: 25 } : null
    ].filter(Boolean);
  }
  return [
    hasHu ? { type: "hu", x, y: 35, diameter: FZV_RULES.seal.huDiameter } : null,
    hasAuthority ? { type: kind === "shortTerm" ? "authorityBlue" : "authority", x, y: 75, diameter: FZV_RULES.seal.authorityDiameter } : null
  ].filter(Boolean);
}

function makeDateField({ kind, layout, x, options }) {
  if (kind === "season" || kind === "electricSeason") {
    return { type: "season", x, y: layout.borderWidth, width: getDateFieldWidth(kind, layout), height: layout.height - layout.borderWidth * 2, start: Number(options.seasonStart || 4), end: Number(options.seasonEnd || 10) };
  }
  const expiry = normalizeExpiry(options.expiry) || { day: "01", month: "01", year: "30" };
  return { type: kind === "export" ? "export" : "shortTerm", x, y: layout.borderWidth, width: getDateFieldWidth(kind, layout), height: layout.height - layout.borderWidth * 2, ...expiry };
}

function normalizeExpiry(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2}|\d{4})$/u);
  if (!match) return null;
  return { day: match[1].padStart(2, "0"), month: match[2].padStart(2, "0"), year: match[3].slice(-2) };
}

function makeRun(text, font) {
  const chars = Array.from(String(text || "").replace(/\s/g, ""));
  const boxes = chars.map((char) => ({ char, width: getCharAdvance(char, font) }));
  const width = boxes.reduce((sum, box) => sum + box.width, 0) + Math.max(0, boxes.length - 1) * font.gap;
  return { text: chars.join(""), boxes, width, font };
}

function getCharAdvance(char, font) {
  return /\d/u.test(char) ? font.digitWidth : font.letterWidth;
}

function getColorProfile(kind) {
  if (kind === "red") return { stroke: COLORS.red, text: COLORS.red, face: COLORS.face };
  if (kind === "green") return { stroke: COLORS.green, text: COLORS.green, face: COLORS.face };
  return { stroke: COLORS.black, text: COLORS.black, face: COLORS.face };
}

function buildSvg({ analysis, chosen, width, height, displayWidth, displayHeight, colorProfile, options }) {
  const clipId = `fictive-plate-${hash(`${analysis.parsed.visible}-${analysis.kind}-${analysis.layoutKey}-${width}`)}`;
  const showDebug = options.debug === true;
  const scaleStyle = options.responsive === false
    ? `width:${displayWidth}px;height:${displayHeight}px;`
    : `width:100%;height:auto;max-width:${displayWidth}px;`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${displayWidth}" height="${displayHeight}" role="img" aria-label="${escapeHtml(analysis.parsed.visible)}" style="display:block;${scaleStyle}">
    <defs>
      <clipPath id="${clipId}"><rect x="${analysis.layout.borderWidth / 2}" y="${analysis.layout.borderWidth / 2}" width="${width - analysis.layout.borderWidth}" height="${height - analysis.layout.borderWidth}" rx="${analysis.layout.cornerRadius}" ry="${analysis.layout.cornerRadius}"/></clipPath>
      <linearGradient id="plate-face-${clipId}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${colorProfile.face}"/></linearGradient>
      <style>
        .plate-fe { dominant-baseline: middle; text-anchor: middle; font-weight: 400; }
        .plate-fe-mtl { font-family: "GL-Nummernschild-Mtl", "Arial Narrow", sans-serif; }
        .plate-fe-eng { font-family: "GL-Nummernschild-Eng", "Arial Narrow", sans-serif; }
      </style>
    </defs>
    <g clip-path="url(#${clipId})">
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#plate-face-${clipId})"/>
      ${chosen.hasEuro ? renderEuroField(analysis.layout) : ""}
      ${chosen.runs.map((run) => renderRun(run, colorProfile.text)).join("")}
      ${chosen.seals.map((seal) => renderSeal(seal, options)).join("")}
      ${chosen.dateField ? renderDateField(chosen.dateField) : ""}
      ${analysis.kind === "exchange" ? renderExchangeMark(chosen) : ""}
      ${showDebug ? renderDebug({ analysis, chosen, width, height }) : ""}
    </g>
    <rect x="${analysis.layout.borderWidth / 2}" y="${analysis.layout.borderWidth / 2}" width="${width - analysis.layout.borderWidth}" height="${height - analysis.layout.borderWidth}" rx="${analysis.layout.cornerRadius}" ry="${analysis.layout.cornerRadius}" fill="none" stroke="${colorProfile.stroke}" stroke-width="${analysis.layout.borderWidth}"/>
  </svg>`;
}

function renderRun(run, color) {
  let x = run.x;
  const klass = run.font.family.includes("Eng") ? "plate-fe-eng" : "plate-fe-mtl";
  return `<g>${run.boxes.map((box) => {
    const cx = x + box.width / 2;
    x += box.width + run.font.gap;
    return `<text class="plate-fe ${klass}" x="${cx}" y="${run.y}" font-size="${run.font.size}" fill="${color}" textLength="${box.width}" lengthAdjust="spacingAndGlyphs">${escapeHtml(box.char)}</text>`;
  }).join("")}</g>`;
}

function renderEuroField(layout) {
  const euro = layout.euro;
  const x = 0;
  const y = euro.y;
  const starR = euro.starDiameter / 2;
  const cx = euro.width / 2;
  const cy = y + starR + 5;
  const countryY = y + euro.height - euro.countryHeight / 2 - 6;
  return `<g>
    <rect x="${x}" y="${y}" width="${euro.width}" height="${euro.height}" fill="${COLORS.blue}"/>
    ${Array.from({ length: 12 }, (_, index) => {
      const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
      const sx = cx + Math.cos(angle) * starR * 0.72;
      const sy = cy + Math.sin(angle) * starR * 0.72;
      return renderStar(sx, sy, euro.starDiameter / 20);
    }).join("")}
    <text x="${cx}" y="${countryY}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="${euro.countryHeight}" font-weight="700" fill="#fff">D</text>
  </g>`;
}

function renderStar(cx, cy, r) {
  const points = [];
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? r : r * 0.4;
    const angle = -Math.PI / 2 + i * Math.PI / 5;
    points.push(`${(cx + Math.cos(angle) * radius).toFixed(2)},${(cy + Math.sin(angle) * radius).toFixed(2)}`);
  }
  return `<polygon points="${points.join(" ")}" fill="#ffcc00"/>`;
}

function renderSeal(seal, options) {
  if (seal.type === "hu") return renderHuSeal(seal, options);
  const fill = seal.type === "authorityBlue" ? "#c6d8f5" : "#d8d8d2";
  const stroke = seal.type === "authorityBlue" ? "#3f638f" : "#a4a49f";
  const r = seal.diameter / 2;
  return `<g opacity="0.96">
    <circle cx="${seal.x}" cy="${seal.y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>
    <circle cx="${seal.x}" cy="${seal.y}" r="${r * 0.65}" fill="none" stroke="#f8f8f5" stroke-width="1" opacity="0.8"/>
    <circle cx="${seal.x}" cy="${seal.y}" r="${r * 0.22}" fill="${stroke}" opacity="0.55"/>
  </g>`;
}

function renderHuSeal(seal, options) {
  const year = Number(options.huYear || 2026);
  const month = Number(options.huMonth || 1);
  const color = MONTH_COLORS[Math.abs(year - 2025) % MONTH_COLORS.length];
  const r = seal.diameter / 2;
  const shortYear = String(year).slice(-2);
  const rot = ((month - 12) * 30) || 0;
  return `<g transform="rotate(${rot} ${seal.x} ${seal.y})">
    <circle cx="${seal.x}" cy="${seal.y}" r="${r}" fill="${color}" stroke="#111" stroke-width="1"/>
    ${Array.from({ length: 12 }, (_, index) => {
      const angle = index / 12 * Math.PI * 2 - Math.PI / 2;
      const x1 = seal.x + Math.cos(angle) * r * 0.62;
      const y1 = seal.y + Math.sin(angle) * r * 0.62;
      const x2 = seal.x + Math.cos(angle) * r * 0.84;
      const y2 = seal.y + Math.sin(angle) * r * 0.84;
      return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#111" stroke-width="0.7"/>`;
    }).join("")}
    <circle cx="${seal.x}" cy="${seal.y}" r="${r * 0.32}" fill="#111"/>
    <circle cx="${seal.x}" cy="${seal.y}" r="${r * 0.24}" fill="${color}"/>
    <text x="${seal.x}" y="${seal.y}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="${r * 0.55}" font-weight="700" fill="#111" transform="rotate(${-rot} ${seal.x} ${seal.y})">${escapeHtml(shortYear)}</text>
  </g>`;
}

function renderDateField(field) {
  if (field.type === "season") {
    return `<g>
      <rect x="${field.x}" y="${field.y}" width="${field.width}" height="${field.height}" fill="#f6f6f0" stroke="#111" stroke-width="1"/>
      <text x="${field.x + field.width / 2}" y="${field.y + field.height * 0.35}" text-anchor="middle" dominant-baseline="middle" font-family="Arial Narrow, sans-serif" font-size="${field.width * 0.48}" font-weight="700" fill="#111">${field.start}</text>
      <line x1="${field.x + field.width * 0.2}" y1="${field.y + field.height * 0.5}" x2="${field.x + field.width * 0.8}" y2="${field.y + field.height * 0.5}" stroke="#111" stroke-width="1.6"/>
      <text x="${field.x + field.width / 2}" y="${field.y + field.height * 0.68}" text-anchor="middle" dominant-baseline="middle" font-family="Arial Narrow, sans-serif" font-size="${field.width * 0.48}" font-weight="700" fill="#111">${field.end}</text>
    </g>`;
  }
  const fill = field.type === "export" ? COLORS.exportRed : COLORS.yellow;
  return `<g>
    <rect x="${field.x}" y="${field.y}" width="${field.width}" height="${field.height}" fill="${fill}" stroke="#111" stroke-width="1"/>
    ${[field.day, field.month, field.year].map((part, index) => `<text x="${field.x + field.width / 2}" y="${field.y + field.height * (0.28 + index * 0.22)}" text-anchor="middle" dominant-baseline="middle" font-family="Arial Narrow, sans-serif" font-size="${field.width * 0.36}" font-weight="700" fill="#111">${escapeHtml(part)}</text>`).join("")}
  </g>`;
}

function renderExchangeMark(chosen) {
  const firstSeal = chosen.seals.find((seal) => seal.type !== "hu") || chosen.seals[0];
  if (!firstSeal) return "";
  return `<text x="${firstSeal.x}" y="${firstSeal.y - firstSeal.diameter / 2 - 8}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#111" textLength="25" lengthAdjust="spacingAndGlyphs">W</text>`;
}

function renderDebug({ analysis, chosen, width, height }) {
  const markers = [
    `<rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="${COLORS.debug}" stroke-width="0.5" stroke-dasharray="3 3"/>`,
    chosen.dateField ? `<rect x="${chosen.dateField.x}" y="${chosen.dateField.y}" width="${chosen.dateField.width}" height="${chosen.dateField.height}" fill="none" stroke="#00aaff" stroke-width="0.8" stroke-dasharray="2 2"/>` : "",
    ...chosen.runs.map((run) => `<rect x="${run.x}" y="${run.y - run.font.size / 2}" width="${run.width}" height="${run.font.size}" fill="none" stroke="#44cc44" stroke-width="0.6" stroke-dasharray="2 2"/>`)
  ];
  return `<g>${markers.join("")}<text x="6" y="${height - 6}" font-family="monospace" font-size="6" fill="${COLORS.debug}">${escapeHtml(`${analysis.layout.label}, ${chosen.font.label}, ${formatNumber(chosen.width)}×${height} mm`)}</text></g>`;
}

function renderErrorSvg(analysis) {
  const text = analysis.errors.join(" | ") || "Ungültig";
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 90" width="420" height="90"><rect width="420" height="90" rx="8" fill="#fff0f0" stroke="#b00000"/><text x="16" y="45" font-family="Arial, sans-serif" font-size="14" fill="#b00000">${escapeHtml(text)}</text></svg>`, analysis };
}

export function formatAnalysis(analysis) {
  const chosen = analysis.chosen;
  return {
    valid: analysis.valid,
    errors: analysis.errors,
    warnings: analysis.warnings,
    normalized: analysis.parsed.visible,
    charsTotal: analysis.parsed.totalCount,
    charsRecognition: analysis.parsed.recognitionCount,
    layout: analysis.layout.label,
    size: chosen ? `${formatNumber(chosen.width)} × ${formatNumber(chosen.height)} mm` : "—",
    font: chosen?.font?.label || "—",
    overflow: chosen?.overflow || false,
    notes: chosen ? chosen.debug : {}
  };
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("de-DE", { maximumFractionDigits: 1 });
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function hash(value) {
  let h = 0;
  const text = String(value || "");
  for (let i = 0; i < text.length; i += 1) h = Math.imul(31, h) + text.charCodeAt(i) | 0;
  return Math.abs(h).toString(36);
}
