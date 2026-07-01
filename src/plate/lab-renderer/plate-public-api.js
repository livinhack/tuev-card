// Kennzeichen Physical Lab b234 / stable public Lab API
//
// This module is the single public entry boundary for the standalone Physical Lab.
// It keeps external imports away from the large SVG renderer and exposes only the
// stable model/render/rule helpers required by app.js, scripts and later Card syncs.

export {
  PLATE_TEXT_COLORS_MM,
  WIDTH_BANDS,
  TWO_LINE_WIDTH_BANDS,
  TWO_LINE_WIDTH_RULES,
  SPACING_RULES_MM,
  FONT_CALIBRATION_PROFILES_MM,
  DXF_REFERENCE_MM,
  ONE_LINE_RULES_MM,
  TWO_LINE_RULES_MM,
  MOTORCYCLE_RULES_MM,
  REDUCED_TWO_LINE_RULES_MM,
  resolvePlateRules
} from "./plate-rules.js";

export {
  parsePlate,
  getCharacterBand
} from "./text-utils.js";

export {
  getCanvasMm
} from "./plate-render-shell.js";

export {
  resolvePlateFontMode,
  buildPlateModelMm,
  renderPlateSvgMm,
  renderPlateSvgMm as renderPlateSvg
} from "./plate-svg-renderer.js";
