// Kennzeichen Physical Lab b297 / season field component
//
// Rendering-only component for the physical seasonal validity field. The row
// solver still owns x/y placement and gap calculation; this module only turns a
// solved `season-field` item into SVG using the same mm data as the large
// renderer.

import { clampNumber, numberOrFallback, positiveNumber } from "./plate-number-utils.js";
import { escapeSvgTextOrEmpty as escapeText } from "./svg-escape-utils.js";
import { getBandForItem, getCharacterBand } from "./text-utils.js";

export function normalizeSeasonMonth(value, fallback) {
  const digits = String(value ?? "").replace(/\D/g, "").slice(0, 2);
  const number = Number(digits);
  if (!Number.isFinite(number) || number < 1 || number > 12) return fallback;
  return String(number).padStart(2, "0");
}

export function getSeasonFieldLayout(rules, item) {
  if (!item) return null;
  const band = getBandForItem(rules, item);
  const seasonRules = rules.content.season;
  const rowHeight = seasonRules.monthBoxHeight;
  const separatorHeight = seasonRules.separatorHeight;
  const upperFieldY = band.y;
  const lowerFieldY = band.y + band.height - rowHeight;
  const separatorY = band.y + band.height / 2 - separatorHeight / 2;
  // Reduced season fields are appended to the bottom-row chain. The old shared
  // season baseline was an absolute two-line top-row value and moved the 04/10
  // digits into the upper seal/HU area. For Reduced, derive the baselines from
  // the actual field row; other formats keep their reference baseline behavior.
  const referenceBandY = Number.isFinite(Number(seasonRules.fieldY))
    ? Number(seasonRules.fieldY)
    : rules.formatKey === "oneLine"
      ? getCharacterBand(rules).y
      : rules.content?.topRow?.y ?? band.y;
  const referenceOffset = Number(seasonRules.upperBaselineY) - referenceBandY;
  const baselineOffset = rules.formatKey === "reducedTwoLine"
    ? rowHeight
    : Number.isFinite(referenceOffset)
      ? referenceOffset
      : rowHeight;
  return {
    band,
    rowHeight,
    separatorHeight,
    upperFieldY,
    lowerFieldY,
    separatorY,
    upperBaselineY: upperFieldY + baselineOffset,
    lowerBaselineY: lowerFieldY + baselineOffset
  };
}

export function renderSeasonField({ content, rules, metrics }) {
  const item = content.find((candidate) => candidate.type === "season-field");
  if (!item) return "";
  const seasonRules = rules.content.season;
  const layout = getSeasonFieldLayout(rules, item);
  const separatorHeight = layout.separatorHeight;
  const separatorY = layout.separatorY;
  const xCenter = item.x + item.width / 2;
  const widthScale = clampNumber(Number(seasonRules.widthScale) || 1, 0.6, 1.2);
  const digitGap = clampNumber(numberOrFallback(seasonRules.digitGap, 0), -5, 10);
  const baseDigitWidth = positiveNumber(seasonRules.digitSlotWidth, 12.5);
  const baseFontSize = positiveNumber(seasonRules.digitSlotFontSize, 28);
  const activeFontSize = positiveNumber(seasonRules.fontSize, baseFontSize);
  const fontSizeScale = activeFontSize / baseFontSize;
  const digitWidth = baseDigitWidth * widthScale * fontSizeScale;
  const totalMonthWidth = digitWidth * 2 + digitGap;
  const monthLeft = xCenter - totalMonthWidth / 2;
  const firstDigitX = monthLeft;
  const secondDigitX = monthLeft + digitWidth + digitGap;
  const lineX1 = item.x + seasonRules.separatorInset;
  const lineWidth = item.width - seasonRules.separatorInset * 2;
  const upperBaselineY = layout.upperBaselineY;
  const lowerBaselineY = layout.lowerBaselineY;
  const from = normalizeSeasonMonth(item.season?.from || "04", "04");
  const to = normalizeSeasonMonth(item.season?.to || "10", "10");
  const textColor = metrics?.textColor || "#080808";
  const textStyle = `font-family="${seasonRules.fontFamily}" font-size="${seasonRules.fontSize}" font-weight="${seasonRules.fontWeight}" fill="${textColor}"`;

  const renderMonth = (value, key, baselineY) => {
    const digitLength = Number(digitWidth).toFixed(4).replace(/\.?0+$/, "");
    return `
  <g data-season-row="${key}" data-season-width-scale="${widthScale}" data-season-digit-gap="${digitGap}" data-season-digit-width="${digitWidth}" data-season-total-width="${totalMonthWidth}" data-season-layout="deterministic-font-size-scaled" data-season-font-size-scale="${fontSizeScale}">
    <text class="season-digit season-digit-first" data-season-row-key="${key}" data-season-digit="first" data-season-digit-text="first" x="${firstDigitX}" y="${baselineY}" text-anchor="start" textLength="${digitLength}" lengthAdjust="spacingAndGlyphs" ${textStyle}>${escapeText(value[0])}</text>
    <text class="season-digit season-digit-second" data-season-row-key="${key}" data-season-digit="second" data-season-digit-text="second" x="${secondDigitX}" y="${baselineY}" text-anchor="start" textLength="${digitLength}" lengthAdjust="spacingAndGlyphs" ${textStyle}>${escapeText(value[1])}</text>
  </g>`;
  };

  return `
<g class="layer layer-season-field">
  <rect x="${lineX1}" y="${separatorY}" width="${lineWidth}" height="${separatorHeight}" fill="${textColor}" data-season-separator="true"/>
${renderMonth(from, "from", upperBaselineY)}
${renderMonth(to, "to", lowerBaselineY)}
</g>`.trim();
}
