// Kennzeichen Physical Lab b227 / shared regression cases and Node/browser regression helpers
// This module has no DOM dependency. It is imported by app.js and by scripts/run-regression.mjs.

import { buildPlateModelMm, renderPlateSvgMm, resolvePlateRules } from "./mm-model.js";
import { labDebugRenderers } from "./plate-lab-debug-renderers.js";

export const MAIN_FONT_MANUAL_DEFAULTS = Object.freeze({
  targetGlyphHeight: 75,
  fontSize: 125,
  baselineY: 92.5,
  specialIWidth: 35.5
});
export const MOTORCYCLE_FONT_MANUAL_DEFAULTS = Object.freeze({
  targetGlyphHeight: 49,
  fontSize: 72,
  baselineY: 59.5,
  specialIWidth: 23.2
});
export const REDUCED_FONT_MANUAL_DEFAULTS = Object.freeze({
  targetGlyphHeight: 49,
  fontSize: 81.67,
  baselineY: 59,
  specialIWidth: 23.2
});
export const SEASON_TYPOGRAPHY_DEFAULTS = Object.freeze({
  targetGlyphHeight: 20,
  fontSize: 28,
  baselineY: 37.5,
  widthScale: 1,
  digitGap: 1.5
});
export const SEASON_DIGIT_GAP_DEFAULT_MM = SEASON_TYPOGRAPHY_DEFAULTS.digitGap;

function getMainFontDefaults(plateFormat) {
  if (plateFormat === "motorcycle") return MOTORCYCLE_FONT_MANUAL_DEFAULTS;
  if (plateFormat === "reducedTwoLine") return REDUCED_FONT_MANUAL_DEFAULTS;
  return MAIN_FONT_MANUAL_DEFAULTS;
}

function isTwoLineLikeFormat(plateFormat) {
  return plateFormat === "twoLine" || plateFormat === "motorcycle" || plateFormat === "reducedTwoLine";
}

function format(value, decimals = 2) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString("de-DE", { maximumFractionDigits: decimals }) : "–";
}

function hasReducedTextSealOverlap(content) {
  const rows = ["top", "bottom"];
  for (const rowKey of rows) {
    const chars = content.filter((item) => item.rowKey === rowKey && item.type === "char");
    const seals = content.filter((item) => item.rowKey === rowKey && item.type === "seals");
    for (const char of chars) {
      const charLeft = Number(char.x);
      const charRight = charLeft + Number(char.width);
      for (const seal of seals) {
        const sealLeft = Number(seal.x);
        const sealRight = sealLeft + Number(seal.width);
        if (charRight > sealLeft + 0.001 && charLeft < sealRight - 0.001) return true;
      }
    }
  }
  return false;
}


function getReducedVerticalSealXMismatch(content, tolerance = 0.15) {
  const topSeal = content.find((item) => item.type === "seals" && item.rowKey === "top" && item.arrangement === "reduced-standard-vertical");
  const bottomSeal = content.find((item) => item.type === "seals" && item.rowKey === "bottom" && item.arrangement === "reduced-standard-vertical");
  if (!topSeal || !bottomSeal) return false;
  return Math.abs(Number(topSeal.x) - Number(bottomSeal.x)) > tolerance;
}

export const REGRESSION_CASES = Object.freeze([
  { id: "one-standard", label: "Einzeilig Standard", plateFormat: "oneLine", input: "DA CI 500", season: false, green: false, expectEuroStarDiameter: 30, expectEuroStarSize: 5, expectEuroCountryHeight: 20 },
  { id: "one-he", label: "Einzeilig H/E", plateFormat: "oneLine", input: "HH EV 204E", season: false, green: false, expectHistoricalOrElectric: true },
  { id: "one-season", label: "Einzeilig Saison", plateFormat: "oneLine", input: "DA CI 500", season: true, green: false },
  { id: "one-green", label: "Einzeilig Grün", plateFormat: "oneLine", input: "DA CI 500", season: false, green: true },
  { id: "two-standard", label: "Zweizeilig Standard", plateFormat: "twoLine", input: "DD GD 645", season: false, green: false, expectEuroStarDiameter: 30, expectEuroStarSize: 5, expectEuroCountryHeight: 20 },
  { id: "two-season", label: "Zweizeilig Saison", plateFormat: "twoLine", input: "DD GD 645", season: true, green: false },
  { id: "two-he", label: "Zweizeilig H/E", plateFormat: "twoLine", input: "CW EE 54E", season: false, green: false, expectHistoricalOrElectric: true },
  { id: "two-season-he", label: "Zweizeilig Saison H/E", plateFormat: "twoLine", input: "CW EE 54E", season: true, green: false, expectHistoricalOrElectric: true },
  { id: "two-green", label: "Zweizeilig Grün", plateFormat: "twoLine", input: "DD GD 645", season: false, green: true },
  { id: "two-280-standard", label: "Zweizeilig 280 Standard", plateFormat: "twoLine", twoLineWidthRule: "twoAndThreeWheel", input: "K S 70", season: false, green: false, expectMaxWidth: 280 },
  { id: "two-280-he", label: "Zweizeilig 280 H/E", plateFormat: "twoLine", twoLineWidthRule: "twoAndThreeWheel", input: "K S 70E", season: false, green: false, expectHistoricalOrElectric: true, expectMaxWidth: 280 },
  { id: "two-280-season", label: "Zweizeilig 280 Saison", plateFormat: "twoLine", twoLineWidthRule: "twoAndThreeWheel", input: "K S 70", season: true, green: false, expectMaxWidth: 280 },
  { id: "two-280-season-he", label: "Zweizeilig 280 Saison H/E", plateFormat: "twoLine", twoLineWidthRule: "twoAndThreeWheel", input: "K S 70E", season: true, green: false, expectHistoricalOrElectric: true, expectMaxWidth: 280 },
  { id: "two-280-green", label: "Zweizeilig 280 Grün", plateFormat: "twoLine", twoLineWidthRule: "twoAndThreeWheel", input: "K S 70", season: false, green: true, expectMaxWidth: 280 },
  { id: "motorcycle-standard", label: "Kraftrad Standard", plateFormat: "motorcycle", input: "EBE VM71", season: false, green: false, expectEuroStarDiameter: 30, expectEuroStarSize: 5, expectEuroCountryHeight: 20, expectMaxWidth: 220, expectMinWidth: 180, expectWidthRule: "motorcycle", expectCharacterHeight: 49, expectFontMode: "middle", expectMotorcycleSeals: true },
  { id: "motorcycle-he", label: "Kraftrad H/E", plateFormat: "motorcycle", input: "ERB PS78H", season: false, green: false, expectHistoricalOrElectric: true, expectMaxWidth: 220, expectMinWidth: 180, expectWidthRule: "motorcycle", expectCharacterHeight: 49, expectFontMode: "middle", expectMotorcycleSeals: true },
  { id: "motorcycle-season", label: "Kraftrad Saison", plateFormat: "motorcycle", input: "ERB PS78", season: true, green: false, expectMaxWidth: 220, expectMinWidth: 180, expectWidthRule: "motorcycle", expectCharacterHeight: 49, expectFontMode: "middle", expectMotorcycleSeals: true },
  { id: "motorcycle-season-he", label: "Kraftrad Saison H/E", plateFormat: "motorcycle", input: "ERB PS7E", season: true, green: false, expectHistoricalOrElectric: true, expectMaxWidth: 220, expectMinWidth: 180, expectWidthRule: "motorcycle", expectCharacterHeight: 49, expectFontMode: "middle", expectMotorcycleSeals: true },
  { id: "motorcycle-green", label: "Kraftrad Grün", plateFormat: "motorcycle", input: "K S 70", season: false, green: true, expectMaxWidth: 220, expectMinWidth: 180, expectWidthRule: "motorcycle", expectCharacterHeight: 49, expectFontMode: "middle", expectMotorcycleSeals: true },
  { id: "reduced-standard", label: "Verkleinert zweizeilig Standard – vollständige Text-/Siegelkette wählt 240 mm", plateFormat: "reducedTwoLine", input: "HVL D191", season: false, green: false, expectWidth: 240, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedBottomSymmetric: true, expectReducedEuroFieldComponents: true, expectEuroStarDiameter: 22.5, expectEuroStarSize: 3.75, expectEuroCountryHeight: 15 },
  { id: "reduced-standard-short-top", label: "Verkleinert zweizeilig Standard – vierstellige Unterzeile bleibt vertikal und wählt 240 mm", plateFormat: "reducedTwoLine", input: "WI D191", season: false, green: false, expectWidth: 240, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedBottomSymmetric: true, expectReducedVerticalOnly: true },
  { id: "reduced-standard-one-letter-top", label: "Verkleinert zweizeilig Standard – einstellige Oberzeile bleibt bei vierstelliger Unterzeile vertikal", plateFormat: "reducedTwoLine", input: "W D191", season: false, green: false, expectWidth: 240, expectReducedTopDistrictAnchored: true, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedBottomSymmetric: true, expectReducedVerticalOnly: true },
  { id: "reduced-standard-ultra-short-180", label: "Verkleinert zweizeilig Standard – ultrakurzer Vertikalsiegel-Fall wählt 180 mm", plateFormat: "reducedTwoLine", input: "W Q1", season: false, green: false, expectWidth: 180, expectReducedTopDistrictAnchored: true, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedBottomSymmetric: true },
  { id: "reduced-he-upper-seal-auto", label: "Verkleinert zweizeilig H/E – Nebeneinander-Siegelpflicht wählt 180 mm", plateFormat: "reducedTwoLine", input: "W Q1E", season: false, green: false, expectHistoricalOrElectric: true, expectWidth: 180, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedTopDistrictAnchored: true, expectReducedUpperSealRow: true },
  { id: "reduced-he-h-upper-seal-auto", label: "Verkleinert zweizeilig H – Nebeneinander-Siegelpflicht wählt 180 mm", plateFormat: "reducedTwoLine", input: "W Q1H", season: false, green: false, expectHistoricalOrElectric: true, expectWidth: 180, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedTopDistrictAnchored: true, expectReducedUpperSealRow: true },
  { id: "reduced-he-literal-input-upper-seal", label: "Verkleinert zweizeilig H/E-Lab-Eingabe darf nicht vertikal fallen", plateFormat: "reducedTwoLine", input: "W Q 1 H/E", season: false, green: false, expectHistoricalOrElectric: true, expectWidth: 200, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedTopDistrictAnchored: true, expectReducedUpperSealRow: true },
  { id: "reduced-season-upper-seal-auto", label: "Verkleinert zweizeilig Saison – Nebeneinander-Siegelpflicht wählt 180 mm", plateFormat: "reducedTwoLine", input: "W Q1", season: true, green: false, expectWidth: 180, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedTopDistrictAnchored: true, expectReducedUpperSealRow: true, expectReducedSeasonGap: true, expectReducedSeasonRender: true },
  { id: "reduced-season-he-upper-seal-auto", label: "Verkleinert zweizeilig Saison H/E – Nebeneinander-Siegelpflicht wählt 200 mm", plateFormat: "reducedTwoLine", input: "W Q1E", season: true, green: false, expectHistoricalOrElectric: true, expectWidth: 200, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedTopDistrictAnchored: true, expectReducedUpperSealRow: true, expectReducedSeasonGap: true, expectReducedSeasonRender: true },
  { id: "reduced-standard-one-letter-short-lower-auto", label: "Verkleinert zweizeilig Standard – kurze Unterzeile springt auf 200 mm", plateFormat: "reducedTwoLine", input: "W QU1", season: false, green: false, expectWidth: 200, expectReducedTopDistrictAnchored: true, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedBottomSymmetric: true },
  { id: "reduced-standard-three-letter-short-lower-auto", label: "Verkleinert zweizeilig Standard – obere Text-/Siegelkette wählt 220 mm", plateFormat: "reducedTwoLine", input: "WIL QU1", season: false, green: false, expectWidth: 220, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true },
  { id: "reduced-standard-four-lower-stays-vertical", label: "Verkleinert zweizeilig Standard – vierstellige Unterzeile W QU11 bleibt vertikal", plateFormat: "reducedTwoLine", input: "W QU11", season: false, green: false, expectWidth: 240, expectReducedTopDistrictAnchored: true, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedBottomSymmetric: true, expectReducedVerticalOnly: true },
  { id: "reduced-standard-long-lower-upper-seals", label: "Verkleinert zweizeilig Standard – fünfstellige Unterzeile nutzt obere Siegelreihe bei 255 mm", plateFormat: "reducedTwoLine", input: "SHG KJ456", season: false, green: false, expectWidth: 255, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedUpperSealRow: true, expectReducedBottomSymmetric: true },
  { id: "reduced-standard-short-top-upper-seals", label: "Verkleinert zweizeilig Standard – fünfstellige kurze Oberzeile nutzt obere Siegelreihe bei 220 mm", plateFormat: "reducedTwoLine", input: "W QU111", season: false, green: false, expectWidth: 220, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedTopDistrictAnchored: true, expectReducedUpperSealRow: true, expectReducedBottomSymmetric: true },
  { id: "reduced-standard-two-letter-five-lower-auto", label: "Verkleinert zweizeilig Standard – zweistellige Oberzeile und fünfstellige Unterzeile wählt 220 mm", plateFormat: "reducedTwoLine", input: "WI QU111", season: false, green: false, expectWidth: 220, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedUpperSealRow: true, expectReducedBottomSymmetric: true },
  { id: "reduced-standard-vertical-render-split", label: "Verkleinert zweizeilig Standard – vertikale HU-/Behördensiegel werden getrennt gerendert", plateFormat: "reducedTwoLine", input: "WI QU11", widthMode: 240, season: false, green: false, expectWidth: 240, expectReducedTopDistrictAnchored: true, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedBottomSymmetric: true, expectReducedSplitSeals: true },
  { id: "reduced-standard-six-lower-auto", label: "Verkleinert zweizeilig Standard – sechsstellige Unterzeile wählt 255 mm", plateFormat: "reducedTwoLine", input: "AB AB1234", season: false, green: false, expectWidth: 255, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedUpperSealRow: true, expectReducedBottomSymmetric: true },

  { id: "reduced-he-no-i-eight-slot-tight", label: "Verkleinert zweizeilig H/E – 8-Slot ohne I hält rechts 8 mm und nutzt 3/4/8 oben", plateFormat: "reducedTwoLine", input: "HVL D191E", season: false, green: false, expectHistoricalOrElectric: true, expectWidth: 255, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedUpperSealRow: true, expectReducedNoIUpperTight: true },
  { id: "reduced-season-no-i-eight-slot-tight", label: "Verkleinert zweizeilig Saison H/E – 8-Slot ohne I hält rechts 8 mm und nutzt 3/4/8 oben", plateFormat: "reducedTwoLine", input: "HVL D19E", season: true, green: false, expectHistoricalOrElectric: true, expectWidth: 255, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedUpperSealRow: true, expectReducedSeasonGap: true, expectReducedSeasonRender: true, expectReducedNoIUpperTight: true },
  { id: "reduced-season-with-i-relaxed-countercheck", label: "Verkleinert zweizeilig Saison H/E – I im Bezirk bleibt Gegenprobe", plateFormat: "reducedTwoLine", input: "WIL D19E", season: true, green: false, expectHistoricalOrElectric: true, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedUpperSealRow: true, expectReducedSeasonGap: true, expectReducedSeasonRender: true, expectReducedNotNoIUpperTight: true },
  { id: "reduced-season-lower-i-eight-slot-tight", label: "Verkleinert zweizeilig Saison H/E – 8 Slots zählen E und Saison trotz I unten und nutzen 3/4/8 oben", plateFormat: "reducedTwoLine", input: "HVL DI9E", season: true, green: false, expectHistoricalOrElectric: true, expectWidth: 255, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedUpperSealRow: true, expectReducedSeasonGap: true, expectReducedSeasonRender: true, expectReducedEightSlotUpperTight: true },
  { id: "reduced-season-he-tight-nine-slot", label: "Verkleinert zweizeilig Saison H/E – 9-Slot-Grenzfall nutzt ≥6 mm rechts und 8/8/8/5/4/6 oben", plateFormat: "reducedTwoLine", input: "HVL D191E", season: true, green: false, expectHistoricalOrElectric: true, expectWidth: 255, expectMaxWidth: 255, expectWidthRule: "reducedTwoLine", expectCharacterHeight: 49, expectFontMode: "middle", expectReducedTwoLine: true, expectReducedUpperSealRow: true, expectReducedSeasonGap: true, expectReducedSeasonRender: true, expectReducedNineSlotSeasonTight: true }
]);


export function evaluateRegressionCase(test) {
  try {
    const model = buildRegressionModel(test);
    const metrics = model.metrics;
    const issues = [];
    const marginTolerance = 0.15;

    if (metrics.plateFormat !== test.plateFormat) issues.push("Format falsch");
    if (test.green && metrics.plateColorMode !== "green") issues.push("grün nicht aktiv");
    if (!test.green && metrics.plateColorMode !== "black") issues.push("Standardfarbe nicht aktiv");
    if (test.green && metrics.frameColor !== metrics.textColor) issues.push("grüner Rahmen folgt nicht der Textfarbe");
    if (test.green && !renderRegressionSvg(test).includes(`data-plate-frame="true" x="0" y="0" width="${metrics.width}" height="${metrics.height}"`) && !renderRegressionSvg(test).includes('data-plate-frame="true"')) issues.push("grüner Rahmen wird nicht über Plate-Body gerendert");
    if (test.green && !renderRegressionSvg(test).includes(`fill="${metrics.frameColor}"`)) issues.push("grüner Rahmen-Fill fehlt im SVG");
    if (test.green && metrics.seasonEnabled) issues.push("Saison trotz Grün aktiv");
    if (!test.green && Boolean(metrics.seasonEnabled) !== Boolean(test.season)) issues.push("Saisonstatus falsch");

    if (test.expectEuroStarDiameter != null && Math.abs((metrics.euroStarDiameterThroughCenters ?? 0) - test.expectEuroStarDiameter) > marginTolerance) issues.push(`Euro-Sternenkranz-a nicht ${format(test.expectEuroStarDiameter, 1)} mm`);
    if (test.expectEuroStarSize != null && Math.abs((metrics.euroStarSize ?? 0) - test.expectEuroStarSize) > marginTolerance) issues.push(`Euro-Sterngröße nicht ${format(test.expectEuroStarSize, 1)} mm`);
    if (test.expectEuroCountryHeight != null && Math.abs((metrics.euroCountryHeight ?? 0) - test.expectEuroCountryHeight) > marginTolerance) issues.push(`Euro-D-Höhe nicht ${format(test.expectEuroCountryHeight, 1)} mm`);

    if (isTwoLineLikeFormat(test.plateFormat)) {
      if ((test.twoLineWidthRule || test.expectWidthRule) && metrics.twoLineWidthRuleKey !== (test.twoLineWidthRule || test.expectWidthRule)) issues.push("Breitenregel falsch");
      if (test.expectWidth && Math.abs(metrics.width - test.expectWidth) > marginTolerance) issues.push(`Breite nicht ${test.expectWidth} mm`);
      if (test.expectMaxWidth && metrics.width > test.expectMaxWidth + marginTolerance) issues.push(`Breite > ${test.expectMaxWidth} mm`);
      if (test.expectMinWidth && metrics.width < test.expectMinWidth - marginTolerance) issues.push(`Breite < ${test.expectMinWidth} mm`);
      if (test.expectMaxWidth === 280 && /320|340/.test(String(metrics.twoLineWidthBands || ""))) issues.push("280-Regel enthält 320/340 mm");
      if (test.expectWidthRule === "motorcycle" && /260|280|320|340/.test(String(metrics.twoLineWidthBands || ""))) issues.push("Kraftrad-Regel enthält fremde Breitenbänder");
      if (test.expectWidthRule === "reducedTwoLine" && /260|280|320|340/.test(String(metrics.twoLineWidthBands || ""))) issues.push("Reduced-Regel enthält fremde Breitenbänder >255 mm");
      if (test.expectReducedTwoLine && Math.abs(metrics.height - 130) > marginTolerance) issues.push("Höhe nicht 130 mm");
      const outsideMinLeft = metrics.outsideMarginMinLeft ?? metrics.outsideMarginMin;
      const outsideMinRight = metrics.outsideMarginMinRight ?? metrics.outsideMarginMin;
      if (metrics.topRowMargins?.left < outsideMinLeft - marginTolerance) issues.push(`oberer linker Rand < ${format(outsideMinLeft, 1)} mm`);
      if (metrics.topRowMargins?.right < outsideMinRight - marginTolerance) issues.push(`oberer rechter Rand < ${format(outsideMinRight, 1)} mm`);
      if (metrics.bottomRowMargins?.left < outsideMinLeft - marginTolerance) issues.push(`unterer linker Rand < ${format(outsideMinLeft, 1)} mm`);
      if (metrics.bottomRowMargins?.right < outsideMinRight - marginTolerance) issues.push(`unterer rechter Rand < ${format(outsideMinRight, 1)} mm`);
      if (test.plateFormat !== "reducedTwoLine" && Math.abs((metrics.topRowMargins?.left || 0) - (metrics.topRowMargins?.right || 0)) > marginTolerance) issues.push("obere Außenränder ungleich");
      if (test.plateFormat !== "reducedTwoLine" && Math.abs((metrics.bottomRowMargins?.left || 0) - (metrics.bottomRowMargins?.right || 0)) > marginTolerance) issues.push("untere Außenränder ungleich");
      if (metrics.cellGap < 8 - marginTolerance || metrics.cellGap > 10 + marginTolerance) issues.push("Zeichenabstand außerhalb 8–10 mm");
      if (test.plateFormat === "motorcycle") {
        if (test.expectHistoricalOrElectric && !String(metrics.groupGapRule || "").includes("H/E")) issues.push("Kraftrad-H/E-Unterzeilenregel fehlt");
        if (test.expectHistoricalOrElectric && (metrics.groupGap < 14 - marginTolerance || metrics.groupGap > 18 + marginTolerance)) issues.push("Kraftrad-H/E-Gruppengap nicht 14–18 mm");
        if (!test.expectHistoricalOrElectric && (metrics.groupGap < 15 - marginTolerance || metrics.groupGap > 18 + marginTolerance)) issues.push("Kraftrad-Gruppengap nicht 15–18 mm");
        if (test.season && (metrics.seasonFieldY == null || Math.abs(metrics.seasonFieldY - 73.375) > 0.15 || Math.abs(metrics.seasonFieldHeight - 53.25) > 0.15 || Math.abs(metrics.seasonLowerFieldY - 106.625) > 0.15)) issues.push("Kraftrad-Saisonfeld nicht exakt höhenzentriert");
      } else if (test.plateFormat === "reducedTwoLine") {
        if (/260|280|320|340/.test(String(metrics.twoLineWidthBands || ""))) issues.push("Reduced-Regel enthält falsche Breitenbänder");
        if (metrics.fontMode !== "middle") issues.push("Reduced nutzt nicht fest die verkleinerte Mittelschrift");
        if (test.expectReducedEuroFieldComponents) {
          if (Math.abs((metrics.euroStarDiameterThroughCenters ?? 0) - 22.5) > marginTolerance) issues.push("Reduced-Euro-Sternenkranz-a nicht 22,5 mm");
          if (Math.abs((metrics.euroStarSize ?? 0) - 3.75) > marginTolerance) issues.push("Reduced-Euro-Sterngröße nicht a/6 = 3,75 mm");
          if (Math.abs((metrics.euroCountryHeight ?? 0) - 15) > marginTolerance) issues.push("Reduced-Euro-D-Höhe nicht 15 mm");
          if (Math.abs((metrics.euroCountryCenterY ?? 0) - 47) > marginTolerance) issues.push("Reduced-Euro-D nicht im 15-mm-Band zentriert");
        }
        if (metrics.groupGap != null && (metrics.groupGap < 15 - marginTolerance || metrics.groupGap > 18 + marginTolerance)) issues.push("verkleinerter Standard-Gruppengap nicht 15–18 mm");
        if (metrics.cellGap != null && (metrics.cellGap < 8 - marginTolerance || metrics.cellGap > 10 + marginTolerance)) issues.push("verkleinerter Standard-Zeichenabstand nicht 8–10 mm");
        if (hasReducedTextSealOverlap(model.content)) issues.push("Reduced-Text überlappt Siegel-/HU-Feld");
        if (!metrics.reducedUpperSealRow && getReducedVerticalSealXMismatch(model.content, marginTolerance)) issues.push("Reduced-Vertikalsiegel liegen nicht auf derselben X-Achse");
        if (test.expectReducedTopDistrictAnchored) {
          const topChars = model.content.filter((item) => item.rowKey === "top" && item.type === "char");
          const firstTopSeal = model.content.find((item) => item.rowKey === "top" && item.type === "seals");
          if (!topChars.length) issues.push("Reduced-Oberzeile enthält kein Bezirkszeichen");
          if (topChars.length && firstTopSeal) {
            const textLeft = Math.min(...topChars.map((item) => Number(item.x)));
            const textRight = Math.max(...topChars.map((item) => Number(item.x) + Number(item.width)));
            const zoneLeft = Number(topChars[0].contentLimits?.left ?? 0) + Number(metrics.outsideMarginMin ?? 8);
            const zoneRight = Number(firstTopSeal.x) - 5;
            const textCenter = (textLeft + textRight) / 2;
            const zoneCenter = (zoneLeft + zoneRight) / 2;
            if (Math.abs(textCenter - zoneCenter) > 0.75) issues.push("kurze Reduced-Oberzeile ist nicht im Eurofeld→Siegel-Korridor zentriert");
          }
        }
        if (metrics.reducedUpperSealRow && !test.expectReducedTopDistrictAnchored && !test.expectReducedNineSlotSeasonTight) {
          const topCharCount = model.content.filter((item) => item.rowKey === "top" && item.type === "char").length;
          if (topCharCount >= 3 && Math.abs((metrics.topRowMargins?.left || 0) - (metrics.topRowMargins?.right || 0)) > marginTolerance) issues.push("Reduced-Oberzeile nicht symmetrisch verteilt");
        }
        if (test.expectReducedBottomSymmetric && Math.abs((metrics.bottomRowMargins?.left || 0) - (metrics.bottomRowMargins?.right || 0)) > marginTolerance) issues.push("Reduced-Unterzeile nicht symmetrisch verteilt");
        if (test.expectReducedVerticalOnly && metrics.reducedUpperSealRow) issues.push("Reduced erwartet vertikale Siegel, nutzt aber obere Nebeneinander-Siegelreihe");
        if (test.expectReducedSeasonGap && (metrics.seasonGap == null || metrics.seasonGap < 8 - marginTolerance)) issues.push("Reduced-Saisongap fehlt oder ist < 8 mm");
        if (test.expectReducedNineSlotSeasonTight) {
          if (!metrics.reducedNineSlotSeasonTightCase) issues.push("9-Slot-Saison-Tight-Case nicht erkannt");
          if ((metrics.outsideMarginMinRight ?? metrics.outsideMarginMin) > 6 + marginTolerance) issues.push("rechter Tight-Mindestabstand nicht auf ≥6 mm gesetzt");
          if (Math.abs((metrics.upperSealPairGap ?? 0) - 4) > marginTolerance) issues.push("Siegel→HU-Gap im 9-Slot-Tight-Case nicht 4 mm");
          if (Math.abs((metrics.topSealGap ?? 0) - 5) > marginTolerance) issues.push("Text→Landessiegel-Gap im 9-Slot-Tight-Case nicht 5 mm");
        }
        if (test.expectReducedNoIUpperTight || test.expectReducedEightSlotUpperTight) {
          if (!metrics.reducedEightSlotUpperSealCase && !metrics.reducedNoITightUpperSealCase) issues.push("8-Slot-Upper-Tight-Case nicht erkannt");
          if ((metrics.topRowMargins?.right ?? 0) < 8 - marginTolerance) issues.push("8-Slot rechter Top-Rand < 8 mm");
          if (Math.abs((metrics.upperSealPairGap ?? 0) - 4) > marginTolerance) issues.push("8-Slot Siegel→HU-Gap nicht 4 mm");
          if (Math.abs((metrics.topSealGap ?? 0) - 3) > marginTolerance) issues.push("8-Slot Text→Landessiegel-Gap nicht 3 mm");
        }
        if (test.expectReducedNotNoIUpperTight && (metrics.reducedNoITightUpperSealCase || metrics.reducedEightSlotUpperSealCase)) issues.push("I-Gegenprobe wurde fälschlich als 8-Slot-Tight-Case erkannt");
        if (test.expectReducedSeasonRender) {
          const svg = renderRegressionSvg(test);
          const seasonField = model.content.find((item) => item.type === "season-field");
          if (!seasonField) issues.push("Reduced-Saisonfeld fehlt in der Row-Chain");
          if (!svg.includes('class="layer layer-season-field"')) issues.push("Reduced-Saisonfeld wird im SVG nicht gerendert");
          if (seasonField) {
            const upperMin = Number(metrics.seasonUpperFieldY);
            const upperMax = upperMin + Number(metrics.seasonMonthBoxHeight);
            const lowerMin = Number(metrics.seasonLowerFieldY);
            const lowerMax = lowerMin + Number(metrics.seasonMonthBoxHeight);
            if (metrics.seasonUpperBaselineY < upperMin - marginTolerance || metrics.seasonUpperBaselineY > upperMax + 0.6) issues.push("Reduced-Saison-Obermonat liegt nicht im oberen Saisonfeld");
            if (metrics.seasonLowerBaselineY < lowerMin - marginTolerance || metrics.seasonLowerBaselineY > lowerMax + 0.6) issues.push("Reduced-Saison-Untermonat liegt nicht im unteren Saisonfeld");
          }
        }
        if (test.expectReducedUpperSealRow) {
          if (!metrics.reducedUpperSealRow) issues.push("Reduced nutzt nicht die erwartete obere Nebeneinander-Siegelreihe");
          if (metrics.sealColumnWidth < 79.8 - marginTolerance || metrics.sealColumnWidth > 80.2 + marginTolerance) issues.push("obere Reduced-Siegelreihe hat nicht 45 + 35 mm Grundbreite");
          if (metrics.upperSealPairGap == null) issues.push("dynamischer Siegel↔HU-Abstand fehlt");
          if (metrics.upperSealPairGap != null && !test.expectReducedNineSlotSeasonTight && !test.expectReducedNoIUpperTight && !test.expectReducedEightSlotUpperTight && (metrics.upperSealPairGap < 5 - marginTolerance || metrics.upperSealPairGap > 20 + marginTolerance)) issues.push("Siegel↔HU-Abstand nicht im 5–20-mm-Korridor");
        }
        if (test.expectReducedSplitSeals) {
          const svg = renderRegressionSvg(test);
          if (!svg.includes('data-seal-row="top"') || !svg.includes('data-seal-row="bottom"')) issues.push("Reduced-Vertikalsiegel werden nicht getrennt aus Top-/Bottom-Row gerendert");
        }
      } else {
        if (test.expectHistoricalOrElectric && !String(metrics.groupGapRule || "").includes("H/E")) issues.push("H/E-Unterzeilenregel fehlt");
        if (test.expectHistoricalOrElectric && (metrics.groupGap < 20 - marginTolerance || metrics.groupGap > 30 + marginTolerance)) issues.push("H/E-Gruppengap nicht 20–30 mm");
        if (!test.expectHistoricalOrElectric && (metrics.groupGap < 24 - marginTolerance || metrics.groupGap > 30 + marginTolerance)) issues.push("normaler Gruppengap nicht 24–30 mm");
      }
    } else {
      if (metrics.remainingLeft < metrics.outsideMarginMin - marginTolerance) issues.push("linker Rand < 8 mm");
      if (metrics.remainingRight < metrics.outsideMarginMin - marginTolerance) issues.push("rechter Rand < 8 mm");
      if (Math.abs(metrics.remainingLeft - metrics.remainingRight) > marginTolerance) issues.push("Außenränder ungleich");
      if (metrics.cellGap < 8 - marginTolerance || metrics.cellGap > 10 + marginTolerance) issues.push("Zeichenabstand außerhalb 8–10 mm");
      if (metrics.groupGap < 20 - marginTolerance || metrics.groupGap > 30 + marginTolerance) issues.push("Gruppengap nicht 20–30 mm");
      if (test.expectHistoricalOrElectric && !String(metrics.sealColumnRule || "").includes("H/E")) issues.push("H/E-Siegelspaltenregel fehlt");
    }

    const detail = isTwoLineLikeFormat(test.plateFormat)
      ? `Breite ${format(metrics.width, 1)} · ${metrics.fontLabel} · ${metrics.twoLineWidthRuleKey === "motorcycle" ? "Kraftrad-Regel · " : metrics.twoLineWidthRuleKey === "reducedTwoLine" ? "verkleinert-Regel · " : metrics.twoLineWidthRuleKey === "twoAndThreeWheel" ? "280-Regel · " : ""}oben ${format(metrics.topRowMargins?.left, 1)}/${format(metrics.topRowMargins?.right, 1)} · unten ${format(metrics.bottomRowMargins?.left, 1)}/${format(metrics.bottomRowMargins?.right, 1)} · Gap ${format(metrics.groupGap, 1)} · ${metrics.groupGapRule || "Standard"}`
      : `Breite ${format(metrics.width, 1)} · ${metrics.fontLabel} · Rand ${format(metrics.remainingLeft, 1)}/${format(metrics.remainingRight, 1)} · Siegel ${format(metrics.sealColumnWidth, 1)} · Gap ${format(metrics.groupGap, 1)}`;

    return {
      ok: issues.length === 0,
      detail: issues.length ? `${detail} · ${issues.join("; ")}` : detail
    };
  } catch (error) {
    return { ok: false, detail: `Fehler: ${error?.message || error}` };
  }
}

function getRegressionOptions(test, fontDefaults) {
  return {
    stage: "complete",
    plateFormat: test.plateFormat,
    widthMode: test.widthMode ?? "balanced",
    twoLineWidthRule: test.twoLineWidthRule || test.expectWidthRule || "standard",
    fontMode: "auto",
    visualStyle: { plateColorMode: test.green ? "green" : "black" },
    fontSize: fontDefaults.fontSize,
    baselineY: fontDefaults.baselineY,
    specialIWidth: fontDefaults.specialIWidth,
    season: {
      enabled: Boolean(test.season),
      from: "04",
      to: "10",
      targetDigitHeight: SEASON_TYPOGRAPHY_DEFAULTS.targetGlyphHeight,
      fontSize: SEASON_TYPOGRAPHY_DEFAULTS.fontSize,
      baselineY: SEASON_TYPOGRAPHY_DEFAULTS.baselineY,
      widthScale: SEASON_TYPOGRAPHY_DEFAULTS.widthScale,
      digitGap: SEASON_TYPOGRAPHY_DEFAULTS.digitGap
    },
    showDimensions: true,
    debugRenderers: labDebugRenderers
  };
}

function renderRegressionSvg(test) {
  const fontDefaults = getMainFontDefaults(test.plateFormat);
  return renderPlateSvgMm(test.input, getRegressionOptions(test, fontDefaults)).svg;
}

export function buildRegressionModel(test) {
  const rules = resolvePlateRules(test.plateFormat);
  const fontDefaults = getMainFontDefaults(test.plateFormat);
  const model = buildPlateModelMm(test.input, getRegressionOptions(test, fontDefaults));

  // Touch rules to keep this function explicitly tied to the active format defaults.
  if (!rules?.layoutType) throw new Error("unbekanntes Format");
  return model;
}

