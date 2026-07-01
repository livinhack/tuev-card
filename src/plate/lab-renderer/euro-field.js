// Kennzeichen Physical Lab b289 / Euro field component entry point
// Keep Euro-field dimensions/raster in the plate rules. The reusable
// subcomponents live here so the main renderer no longer contains legacy EU
// star/D placement code.

import { numberOrFallback as n } from "./plate-number-utils.js";
import { renderEuStarWreath, resolveEuStarWreathGeometry } from "./eu-star-wreath.js";
import { renderEuroCountryMark, resolveEuroCountryMarkGeometry } from "./eu-country-mark.js";

export { renderEuStarWreath, resolveEuStarWreathGeometry } from "./eu-star-wreath.js";
export { renderEuroCountryMark, resolveEuroCountryMarkGeometry } from "./eu-country-mark.js";


export function resolveEuroStarWreathInput(euro = {}) {
  const wreath = euro.starWreath || {};
  const diameterThroughCenters = wreath.a
    ?? wreath.diameterThroughCenters
    ?? euro.starsDiameter
    ?? (Number.isFinite(Number(euro.starsRadius)) ? Number(euro.starsRadius) * 2 : undefined);
  return {
    centerX: wreath.centerX ?? euro.starsCenterX,
    centerY: wreath.centerY ?? euro.starsCenterY,
    diameterThroughCenters,
    starSize: wreath.starSize ?? (Number.isFinite(Number(diameterThroughCenters)) ? Number(diameterThroughCenters) / 6 : undefined)
  };
}

export function resolveEuroFieldComponentGeometry(euro = {}) {
  const starWreath = resolveEuStarWreathGeometry(resolveEuroStarWreathInput(euro));
  const countryMark = resolveEuroCountryMarkGeometry(euro);
  return Object.freeze({ starWreath, countryMark });
}

export function renderEuroFieldComponents(euro = {}) {
  return `${renderEuStarWreath(resolveEuroStarWreathInput(euro))}\n  ${renderEuroCountryMark(euro)}`;
}

export function getEuroFieldSummary(euro = {}) {
  const geometry = resolveEuroFieldComponentGeometry(euro);
  return Object.freeze({
    width: n(euro.width, null),
    height: n(euro.height, null),
    starDiameterThroughCenters: geometry.starWreath.diameterThroughCenters,
    starSize: geometry.starWreath.starSize,
    countryHeight: geometry.countryMark.height,
    countryFontSize: geometry.countryMark.fontSize
  });
}
