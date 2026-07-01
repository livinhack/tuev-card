// Kennzeichen Physical Lab b306 / Euro country mark component
// Euro-field variants provide the country mark centre and visible height. The
// renderer keeps a text-based D for now, but all size decisions are centralised
// here so reduced two-line can use its own 15-mm D independently of the other
// Euro fields.

import { numberOrFallback as n, formatSvgNumber as format } from "./plate-number-utils.js";
import { escapeSvgTextOrEmpty as escapeText } from "./svg-escape-utils.js";

export function resolveEuroCountryMarkGeometry(euro = {}) {
  const mark = euro.countryMark || {};
  const text = mark.text ?? euro.country ?? "D";
  const centerX = n(mark.centerX ?? euro.countryCenterX, 0);
  const centerY = n(mark.centerY ?? euro.countryCenterY ?? euro.countryBaselineY, 0);
  const height = n(mark.height ?? euro.countryHeight ?? euro.countryBoxHeight, 20);
  const fontSize = n(mark.fontSize ?? euro.countryFontSize, height * 4 / 3);
  const fontWeight = mark.fontWeight ?? euro.countryFontWeight ?? 400;
  const dominantBaseline = mark.dominantBaseline ?? euro.countryDominantBaseline ?? "central";
  return Object.freeze({ text, centerX, centerY, height, fontSize, fontWeight, dominantBaseline });
}

export function renderEuroCountryMark(euro = {}) {
  const geometry = resolveEuroCountryMarkGeometry(euro);
  return `<text class="eu-country-mark" data-eu-country-height="${format(geometry.height)}" x="${format(geometry.centerX)}" y="${format(geometry.centerY)}" text-anchor="middle" dominant-baseline="${geometry.dominantBaseline}" font-family="DIN1451Alt, AlteDIN1451Mittelschrift, AlteDIN1451Middle script, Arial, sans-serif" font-size="${format(geometry.fontSize)}" font-weight="${geometry.fontWeight}" fill="#fff">${escapeText(geometry.text)}</text>`;
}
