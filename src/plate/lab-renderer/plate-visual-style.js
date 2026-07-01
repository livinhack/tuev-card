// Kennzeichen Physical Lab b263 / visual style and color-mode helpers

import { PLATE_TEXT_COLORS_MM } from "./plate-variant-rules.js";

export function resolveSeasonForVisualStyle(season, visualStyle) {
  if (visualStyle?.key !== "green") return season;
  return {
    ...(season || {}),
    enabled: false
  };
}

export function resolveVisualStyle(visualStyle = {}) {
  const key = visualStyle?.plateColorMode === "green" || visualStyle?.textColorMode === "green" ? "green" : "black";
  return PLATE_TEXT_COLORS_MM[key] || PLATE_TEXT_COLORS_MM.black;
}
