// Kennzeichen Physical Lab b285 / pure text and glyph helpers
//
// This module intentionally contains only plate-text parsing, GL cell metrics
// and row/text helper decisions. It must not import the renderer, so the
// public API can depend on real utilities instead of re-export facades.

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

export function withSpecialIWidth(font, specialIWidth) {
  return {
    ...font,
    specialWidths: {
      ...(font.specialWidths || {}),
      I: specialIWidth
    }
  };
}

export function makeCells(text, font, role) {
  return [...String(text || "")].map((char, index) => ({
    type: "char",
    role,
    key: `${role}-${index}-${char}`,
    char,
    width: getCellWidth(char, font),
    font
  }));
}

export function getCellWidth(char, font) {
  const normalized = String(char || "").toUpperCase();
  const specialWidth = font.specialWidths?.[normalized];
  if (Number.isFinite(Number(specialWidth)) && Number(specialWidth) > 0) return Number(specialWidth);
  return isDigit(normalized) ? font.digitWidth : font.letterWidth;
}

export function splitRecognition(value) {
  const normalized = String(value || "");
  const matches = normalized.match(/[A-ZÄÖÜ]+|\d+/g) || [];
  return matches.map((part) => ({
    value: part,
    type: /^\d+$/.test(part) ? "digits" : "letters"
  }));
}

export function hasHistoricalOrElectricSuffix(parsed) {
  const recognition = String(parsed?.recognition || "").toUpperCase();
  // Usual valid form: final H/E suffix after a digit, e.g. Q1H or Q1E.
  // The Lab also accepts manually spaced input like "Q 1 H/E" so Reduced
  // cannot accidentally fall back to the vertical-seal standard template.
  if (/\d[HE]$/.test(recognition)) return true;
  if (/\d[HE]+$/.test(recognition)) return true;
  const parts = Array.isArray(parsed?.parts) ? parsed.parts.map((part) => String(part || "").toUpperCase()) : [];
  const last = parts[parts.length - 1] || "";
  const beforeLast = parts[parts.length - 2] || "";
  const beforeTwo = parts[parts.length - 3] || "";
  if (/^[HE]$/.test(last) && /\d$/.test(beforeLast)) return true;
  if (/^[HE]$/.test(last) && /^[HE]$/.test(beforeLast) && /\d$/.test(beforeTwo)) return true;
  return false;
}

export function getCharacterBand(rules, rowKey = "top") {
  if (rules.layoutType === "two-line") {
    const row = rowKey === "bottom" ? rules.content.bottomRow : rules.content.topRow;
    return {
      y: row.y,
      height: row.characterHeight,
      baselineY: row.baselineY
    };
  }
  return {
    y: rules.innerInset + rules.content.topClearance,
    height: rules.content.characterHeight,
    baselineY: rules.cells?.middle?.baselineY || 92.5
  };
}

export function getBandForItem(rules, item) {
  if (Number.isFinite(Number(item?.bandY)) && Number.isFinite(Number(item?.bandHeight))) {
    return { y: Number(item.bandY), height: Number(item.bandHeight), baselineY: Number(item.baselineY) || null };
  }
  return getCharacterBand(rules, item?.rowKey);
}

export function isDigit(char) {
  return /\d/.test(char);
}
