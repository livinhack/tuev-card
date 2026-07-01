// Kennzeichen Physical Lab b234 / public physical mm model API
//
// Stable compatibility entry for the standalone Lab. The actual public API is
// centralised in plate-public-api.js so app.js/scripts do not import directly
// from the large renderer implementation.

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
  resolvePlateRules,
  parsePlate,
  resolvePlateFontMode,
  buildPlateModelMm,
  renderPlateSvgMm,
  renderPlateSvg,
  getCanvasMm,
  getCharacterBand
} from "./plate-public-api.js";
