// Kennzeichen Physical Lab b225 / plate dimensions and variant rules
//
// Public rule boundary. b225 keeps this a real boundary over the central
// plate-variant-rules module instead of re-exporting through the renderer.

export {
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
  PLATE_TEXT_COLORS_MM,
  resolvePlateRules
} from "./plate-variant-rules.js";
