import { ONE_LINE_RULES_MM, PLATE_TEXT_COLORS_MM, getCharacterBand, renderPlateSvgMm, resolvePlateFontMode, resolvePlateRules } from "./src/plate/mm-model.js";
import { labDebugRenderers } from "./src/plate/plate-lab-debug-renderers.js";
import { MAIN_FONT_MANUAL_DEFAULTS, MOTORCYCLE_FONT_MANUAL_DEFAULTS, REDUCED_FONT_MANUAL_DEFAULTS, REGRESSION_CASES, SEASON_DIGIT_GAP_DEFAULT_MM, SEASON_TYPOGRAPHY_DEFAULTS, evaluateRegressionCase } from "./src/plate/regression-cases.js";
import { resolveFontFitMm } from "./font-calibration.js";
import { MONITOR_PROFILES, correctionFromMeasured100Mm, getCalibrationState, resolveViewerSize } from "./viewer-calibration.js";

const $ = (selector) => document.querySelector(selector);

const PLATE_STRING_PRESETS = Object.freeze([
  "DD GD 645",
  "DA CI 500",
  "B AB 123",
  "K S 70",
  "EBE VM71",
  "HVL D191",
  "ERB PS78H",
  "ERB PS78",
  "ERB PS7E",
  "TR M 6",
  "HH EV 204E",
  "WIL DE 13H",
  "B EQ 203E",
  "CW EE 54E",
  "BIT GT500",
  "BIT GT500H",
  "W Q1",
  "W QU1",
  "W QU11",
  "W QU111",
  "WI QU111",
  "WIL QU1",
  "WIL QU111",
  "HVL D19E",
  "HVL DI9E",
  "WIL D191E",
  "OHZ EF 10",
  "DD GD 64",
  "DD GD 6",
  "EBE VM 7",
  "5",
  "1",
  "1H",
  "1E",
  "6H"
]);

const WIDTH_MODE_OPTIONS = Object.freeze({
  oneLine: [
    { value: "340", label: "340 mm" },
    { value: "380", label: "380 mm" },
    { value: "420", label: "420 mm" },
    { value: "460", label: "460 mm" },
    { value: "480", label: "480 mm" },
    { value: "520", label: "520 mm" }
  ],
  twoLine: [
    { value: "340", label: "340 mm" },
    { value: "320", label: "320 mm" },
    { value: "280", label: "280 mm" },
    { value: "260", label: "260 mm" }
  ],
  twoLine280: [
    { value: "280", label: "280 mm" },
    { value: "260", label: "260 mm" }
  ],
  motorcycle: [
    { value: "220", label: "220 mm" },
    { value: "200", label: "200 mm" },
    { value: "180", label: "180 mm" }
  ],
  reducedTwoLine: [
    { value: "255", label: "255 mm" },
    { value: "240", label: "240 mm" },
    { value: "220", label: "220 mm" },
    { value: "200", label: "200 mm" },
    { value: "180", label: "180 mm" }
  ]
});

const controls = {
  monitorProfile: $("#monitorProfile"),
  devicePxPerMm: $("#devicePxPerMm"),
  displayMode: $("#displayMode"),
  calibrationFactor: $("#calibrationFactor"),
  measured100: $("#measured100"),
  stage: $("#stage"),
  plateFormat: $("#plateFormat"),
  twoLineWidthRule: $("#twoLineWidthRule"),
  plateInput: $("#plateInput"),
  widthMode: $("#widthMode"),
  fontMode: $("#fontMode"),
  autoFitFont: $("#autoFitFont"),
  targetGlyphHeight: $("#targetGlyphHeight"),
  fontSize: $("#fontSize"),
  baselineY: $("#baselineY"),
  specialIWidth: $("#specialIWidth"),
  greenPlate: $("#greenPlate"),
  changePlateEnabled: $("#changePlateEnabled"),
  changePlateCommonInput: $("#changePlateCommonInput"),
  changePlateVehicleInput: $("#changePlateVehicleInput"),
  seasonEnabled: $("#seasonEnabled"),
  seasonFrom: $("#seasonFrom"),
  seasonTo: $("#seasonTo"),
  seasonTargetGlyphHeight: $("#seasonTargetGlyphHeight"),
  seasonFontSize: $("#seasonFontSize"),
  seasonBaselineY: $("#seasonBaselineY"),
  seasonWidthScale: $("#seasonWidthScale"),
  seasonDigitGap: $("#seasonDigitGap"),
  seasonFitReadout: $("#seasonFitReadout"),
  fontStatus: $("#fontStatus"),
  showDimensions: $("#showDimensions"),
  huBadgeYear: $("#huBadgeYear"),
  huBadgeRotation: $("#huBadgeRotation"),
  huBadgeFullRenderer: $("#huBadgeFullRenderer"),
  plateStringPresets: $("#plateStringPresets"),
  regressionMatrix: $("#regressionMatrix"),
  runRegression: $("#runRegression")
};

let renderTicket = 0;

async function render() {
  repairSeasonTypographyValues();
  const ticket = ++renderTicket;
  const calibration = getCalibration();
  const requestedFontMode = controls.fontMode.value;
  const plateFormat = controls.plateFormat.value;
  syncTwoLineWidthRuleControl(plateFormat);
  const twoLineWidthRule = getTwoLineWidthRuleOption(plateFormat);
  const visualStyle = getVisualStyleOptions();
  syncWidthModeOptions(plateFormat, twoLineWidthRule);
  const rules = resolvePlateRules(plateFormat);
  const fontResolution = resolvePlateFontMode(controls.plateInput.value, {
    plateFormat,
    fontMode: requestedFontMode,
    widthMode: controls.widthMode.value,
    twoLineWidthRule,
    specialIWidth: getSpecialIWidth(rules.cells.middle),
    season: getSeasonOptions(plateFormat)
  });
  const fontMode = fontResolution.fontMode;
  const baseFont = rules.cells[fontMode] || rules.cells.middle;
  const charBand = getCharacterBand(rules);
  const fontFit = await resolveFontFitMm({
    enabled: controls.autoFitFont.checked,
    fontFamily: baseFont.fontFamily,
    fallbackFontSize: numberValue(controls.fontSize, baseFont.fontSize),
    fallbackBaselineY: numberValue(controls.baselineY, baseFont.baselineY),
    bandY: charBand.y,
    bandHeight: charBand.height,
    targetVisibleHeight: numberValue(controls.targetGlyphHeight, charBand.height)
  });

  if (ticket !== renderTicket) return;

  if (controls.autoFitFont.checked) {
    controls.fontSize.value = formatPlain(fontFit.fontSize, 2);
    controls.baselineY.value = formatPlain(fontFit.baselineY, 2);
  }

  const result = renderPlateSvgMm(controls.plateInput.value, {
    stage: controls.stage.value,
    plateFormat,
    widthMode: controls.widthMode.value,
    twoLineWidthRule,
    fontMode: requestedFontMode,
    visualStyle,
    fontSize: fontFit.fontSize,
    baselineY: fontFit.baselineY,
    specialIWidth: getSpecialIWidth(baseFont),
    season: getSeasonOptions(plateFormat),
    changePlate: getChangePlateOptions(plateFormat),
    fontFit,
    showDimensions: controls.showDimensions.checked,
    debugRenderers: labDebugRenderers,
    huBadgeRenderer: controls.huBadgeFullRenderer.checked ? "full" : "placeholder",
    huYear: numberValue(controls.huBadgeYear, new Date().getFullYear()),
    huRotation: numberValue(controls.huBadgeRotation, 0)
  });
  const { model, canvas } = result;
  const viewport = getPreviewViewport();
  const viewer = resolveViewerSize({
    canvasMm: canvas,
    mode: controls.displayMode.value,
    calibration,
    viewport
  });

  $("#output").innerHTML = result.svg;
  const svg = $("#output svg");
  svg.style.width = `${viewer.cssWidth}px`;
  svg.style.height = `${viewer.cssHeight}px`;
  svg.style.maxWidth = "none";
  await waitForFonts();
  renderFontStatus();
  requestAnimationFrame(() => {
    renderSeasonGlyphReadout();
  });

  $("#ruler100").style.width = `${100 * calibration.cssPxPerMmAtOneToOne}px`;
  $("#calibrationReadout").innerHTML = renderCalibrationReadout(calibration, viewer);
  $("#sizePill").textContent = `${model.metrics.width} × ${model.metrics.height} mm`;
  renderMetrics(model.metrics, calibration, viewer, canvas);
  renderFontFit(fontFit);
  renderNotes(model, viewer, fontFit);
  renderRegressionMatrix();
}

function getCalibration() {
  return getCalibrationState({
    devicePxPerMm: numberValue(controls.devicePxPerMm, MONITOR_PROFILES["acer-vg272u-v"].devicePxPerMm),
    correction: numberValue(controls.calibrationFactor, 1)
  });
}

function getPreviewViewport() {
  const box = $("#previewScroll").getBoundingClientRect();
  return { width: box.width - 48, height: box.height - 48 };
}

function syncWidthModeOptions(plateFormat, twoLineWidthRule = "standard") {
  const select = controls.widthMode;
  const fixedOptionsKey = plateFormat === "motorcycle" ? "motorcycle" : plateFormat === "reducedTwoLine" ? "reducedTwoLine" : plateFormat === "twoLine" && twoLineWidthRule === "twoAndThreeWheel" ? "twoLine280" : plateFormat;
  const fixedOptions = WIDTH_MODE_OPTIONS[fixedOptionsKey] || WIDTH_MODE_OPTIONS.oneLine;
  const desired = [
    { value: "auto", label: "Auto kompakt: Mindestmaße ohne Grenzquetschung" },
    { value: "balanced", label: "Auto ausgewogen: bevorzugte Abstände" },
    ...fixedOptions
  ];
  const signature = `${plateFormat}:${twoLineWidthRule}:${desired.map((item) => item.value).join("|")}`;
  if (select.dataset.signature === signature) return;

  const current = select.value;
  select.innerHTML = desired.map((item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`).join("");
  select.dataset.signature = signature;
  select.value = desired.some((item) => item.value === current) ? current : "balanced";
}


function renderCalibrationReadout(calibration, viewer) {
  return `
    <div><strong>DPR:</strong> ${format(calibration.dpr, 3)}</div>
    <div><strong>Geräte-px/mm:</strong> ${format(calibration.devicePxPerMm, 4)}</div>
    <div><strong>CSS-px/mm 1:1:</strong> ${format(calibration.cssPxPerMmAtOneToOne, 4)}</div>
    <div><strong>Anzeige:</strong> ${escapeHtml(viewer.modeLabel)} · Faktor ${format(viewer.viewerScale, 3)}</div>
  `;
}

function renderMetrics(metrics, calibration, viewer, canvas) {
  const rows = [
    ["Modell-Einheit", metrics.modelUnit],
    ["Kennzeichenformat", metrics.plateFormatLabel || "—"],
    ["Wechselkennzeichen", metrics.changePlateEnabled ? `aktiv · Hauptteil ${format(metrics.changePlateMainPlateWidth, 1)} mm · Wechselteil ${format(metrics.changePlateSupplementWidth, 1)} mm · Gap ${format(metrics.changePlateSupplementGap, 1)} mm · Fahrzeugteil ${metrics.changePlateVehicleText || "—"}` : "—"],
    ["Breitenregel", isTwoLineLikeFormat(metrics.plateFormat) ? `${metrics.twoLineWidthRuleLabel || "Standard"} · Max ${format(metrics.twoLineWidthMaxMm, 1)} mm · Bänder ${metrics.twoLineWidthBands || "—"}` : "—"],
    ["Normalisiert", metrics.normalized || "—"],
    ["Ortskennung", metrics.district || "—"],
    ["Erkennungsnummer", metrics.recognition || "—"],
    ["Farbmodus", `${metrics.plateColorLabel || "Standard black"} · ${metrics.textColor || PLATE_TEXT_COLORS_MM.black.color}`],
    ["Saison", metrics.seasonEnabled ? `${metrics.seasonStartMonth}/${metrics.seasonEndMonth} · zwei Felder ${format(metrics.seasonFieldWidth, 1)} × ${format(metrics.seasonMonthBoxHeight, 1)} mm · Gap ${format(metrics.seasonGap, 1)} mm (${metrics.seasonGapRange}) · sichtbare BBox-Zielhöhe ${format(metrics.seasonTargetDigitHeight, 1)} mm · Font ${format(metrics.seasonFontSize, 1)} · Breite ×${format(metrics.seasonWidthScale, 2)} · Zifferngap ${format(metrics.seasonDigitGap, 2)} mm · Baselines ${format(metrics.seasonUpperBaselineY, 1)} / ${format(metrics.seasonLowerBaselineY, 1)} mm · Strich ${format(metrics.seasonFieldWidth, 1)} × ${format(metrics.seasonSeparatorHeight, 2)} mm` : "—"],
    ["Schrift", `${metrics.fontLabel} · ${metrics.fontFamily}`],
    ["Schriftwahl", `${metrics.requestedFontMode === "auto" ? "Auto" : "Manuell"} → ${metrics.fontLabel}`],
    ["Auto-Engschrift-Regel", metrics.autoFontModeReason || "—"],
    ["Breitenprüfung", `Grenze ${format(metrics.autoWidthCapMm, 1)} mm · Mittel bevorzugt ${format(metrics.middleNeededWidth, 1)} mm (${metrics.middleFitsWidthCap ? "passt" : "passt nicht"}) · Eng bevorzugt ${format(metrics.narrowNeededWidth, 1)} mm (${metrics.narrowFitsWidthCap ? "passt" : "passt nicht"})`],
    ["Layout-Solver", `${metrics.layoutMode} · ${metrics.widthSelectionReason}`],
    ["Breitenbedarf", `min ${format(metrics.minNeededWidth, 1)} mm · bevorzugt ${format(metrics.preferredNeededWidth, 1)} mm · max ${format(metrics.maxNeededWidth, 1)} mm`],
    ["Außenmaß Kennzeichen", `${metrics.width} × ${metrics.height} mm`],
    ["SVG-Canvas", `${format(canvas.width, 1)} × ${format(canvas.height, 1)} mm`],
    ["Rohbreite Inhalt", `${format(metrics.rawContentWidth, 1)} mm`],
    ["DXF-Referenz", metrics.dxfReference],
    ["Außen-/Innenhöhe", `${format(metrics.height, 1)} mm außen · ${format(metrics.innerHeight, 1)} mm innen`],
    ["Rand/Ecken", `${format(metrics.innerInset, 1)} mm Rand · außen R${format(metrics.outerCornerRadius, 2)} · innen R${format(metrics.innerCornerRadius, 2)}`],
    ["Eurofeld", `x ${format(metrics.euroX, 1)} · y ${format(metrics.euroY, 1)} · ${format(metrics.euroWidth, 1)} × ${format(metrics.euroHeight, 1)} mm`],
    ["Eurofeld-Innenmaße", metrics.plateFormat === "twoLine" ? `${format(metrics.euroInnerTopClearance, 1)} / ${format(metrics.euroStarsBoxHeight, 1)} / ${format(metrics.euroStarsToCountryGap, 1)} / ${format(metrics.euroCountryBoxHeight, 1)} / ${format(metrics.euroInnerBottomClearance, 1)} mm · Sterne Mitte y ${format(metrics.euroStarsCenterY, 1)} · D-Baseline y ${format(metrics.euroCountryBaselineY, 1)}` : "—"],
    ["Zeichenband", metrics.plateFormat === "twoLine" ? `oben y ${format(metrics.topCharacterBandY, 1)} / Baseline ${format(metrics.topCharacterBaselineY, 1)} mm · unten y ${format(metrics.bottomCharacterBandY, 1)} / Baseline ${format(metrics.bottomCharacterBaselineY, 1)} mm · Höhe ${format(metrics.characterBandHeight, 1)} mm` : `y ${format(metrics.characterBandY, 1)} mm · Höhe ${format(metrics.characterBandHeight, 1)} mm`],
    ["Zweizeilige Höhenaufteilung", metrics.plateFormat === "twoLine" ? `innen ${format(metrics.twoLineTopInnerMargin, 1)} / ${format(metrics.characterBandHeight, 1)} / ${format(metrics.twoLineInterRowGap, 1)} / ${format(metrics.characterBandHeight, 1)} / ${format(metrics.twoLineBottomInnerMargin, 1)} mm` : "—"],
    ["Zellbreiten", `Buchstaben ${format(metrics.cellLetterWidth, 1)} mm · Ziffern ${format(metrics.cellDigitWidth, 1)} mm · I-Sonderbreite ${format(metrics.specialIWidth, 1)} mm (${metrics.specialIWidthPolicy})`],
    ["Variable Abstände", metrics.plateFormat === "twoLine" ? `Zeichen ${format(metrics.cellGap, 1)} mm (${metrics.cellGapRange}) · Siegelabstand ${format(metrics.topSealGap, 1)} mm (${metrics.topSealGapRange})${metrics.seasonEnabled ? ` · Saisongap ${format(metrics.seasonGap, 1)} mm (${metrics.seasonGapRange})` : ""} · Gruppengap ${metrics.groupGap ? format(metrics.groupGap, 1) : "—"} mm (${metrics.groupGapRange}) · Siegelspalte ${format(metrics.sealColumnWidth, 1)} mm (${metrics.sealColumnRange})` : `Zeichen ${format(metrics.cellGap, 1)} mm (${metrics.cellGapRange}) · Gruppengap ${metrics.groupGap ? format(metrics.groupGap, 1) : "—"} mm (${metrics.groupGapRange})${metrics.seasonEnabled ? ` · Saisongap ${format(metrics.seasonGap, 1)} mm (${metrics.seasonGapRange})` : ""} · Siegelspalte ${format(metrics.sealColumnWidth, 1)} mm (${metrics.sealColumnRange})`],
    ["Gruppengap-Regel", metrics.groupGapRule || (metrics.plateFormat === "twoLine" ? "Two-line bottom row normal: group gaps 24-30 mm" : "—")],
    ["Siegelspalten-Regel", metrics.sealColumnRule || "—"],
    ["Außenränder", metrics.plateFormat === "twoLine" ? `oben links ${format(metrics.topRowMargins?.left, 1)} / rechts ${format(metrics.topRowMargins?.right, 1)} mm · unten links ${format(metrics.bottomRowMargins?.left, 1)} / rechts ${format(metrics.bottomRowMargins?.right, 1)} mm · Mindestmaß ${format(metrics.outsideMarginMin, 1)} mm` : `links ${format(metrics.remainingLeft, 1)} mm · rechts ${format(metrics.remainingRight, 1)} mm · Mindestmaß ${format(metrics.outsideMarginMin, 1)} mm`],
    ["Zeilenbreiten", metrics.plateFormat === "twoLine" ? `oben ${format(metrics.topRowContentWidth, 1)} mm · unten ${format(metrics.bottomRowContentWidth, 1)} mm` : "—"],
    ["Font-Kalibrierprofil", `${metrics.fontLabel} · Font-Kalibriergröße ${format(metrics.characterFontSize, 2)} · Baseline y ${format(metrics.characterBaselineY, 2)} mm`],
    ["Glyphen-Fit", metrics.fontFitMode === "auto" ? `Auto · sichtbar ${format(metrics.fontFitVisibleHeight, 2)} mm · oben ${format(metrics.fontFitTopY, 2)} / unten ${format(metrics.fontFitBottomY, 2)} mm` : metrics.fontFitMode || "manuell"],
    ["Siegelspalte Referenz", `${format(metrics.sealColumnWidth, 1)} mm aktuell · äußerer Referenzraum ${format(metrics.sealColumnMaxWidth, 1)} mm`],
    ["HU-Plakette", `${format(metrics.huDiameter, 1)} mm · Mitte y ${format(metrics.huCenterY, 1)} mm`],
    ["Behördensiegel", `${format(metrics.authorityDiameter, 1)} mm · Mitte y ${format(metrics.authorityCenterY, 1)} mm`],
    ["Abstand HU/Behörde", `${format(metrics.sealVisibleCircleGap, 1)} mm zwischen sichtbaren Kreisen`],
    ["Siegel-Anschluss", metrics.sealAdjacentGapPolicy || "nicht gesetzt"],
    
    ["Monitor", `${format(calibration.devicePxPerMm, 4)} Geräte-px/mm`],
    ["CSS-Maßstab 1:1", `${format(calibration.cssPxPerMmAtOneToOne, 4)} CSS-px/mm`],
    ["Viewer-Skalierung", `${format(viewer.viewerScale, 3)}×, nur Gesamt-SVG`]
  ];
  $("#metrics").innerHTML = rows.map(([key, value]) => `<tr><th>${escapeHtml(key)}</th><td>${escapeHtml(value)}</td></tr>`).join("");
}

function renderFontFit(fontFit) {
  const target = $("#fontFitReadout");
  if (!target) return;

  const measured = fontFit.measured;
  const rows = [
    ["Modus", fontFit.mode],
    ["Font-Kalibriergröße", `${format(fontFit.fontSize, 2)}`],
    ["Baseline", `${format(fontFit.baselineY, 2)} mm`],
    ["Probe", fontFit.sample || "—"]
  ];

  if (measured) {
    rows.push(["gemessene Probe bei 100 mm", `y ${format(measured.y, 2)} · Höhe ${format(measured.height, 2)} mm`]);
    rows.push(["sichtbarer Zielbereich", `${format(measured.topY, 2)} bis ${format(measured.bottomY, 2)} mm`]);
  }

  target.innerHTML = rows.map(([key, value]) => `<div><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</div>`).join("");
}

function renderNotes(model, viewer, fontFit) {
  const notes = [];
  if (model.metrics.width === model.rules.maxWidth) {
    notes.push(`Maximalbreite ${model.rules.maxWidth} mm erreicht.`);
  }
  if (!model.metrics.district) {
    notes.push("Keine Ortskennung erkannt; Siegelzone wird trotzdem als feste physische Zone gerendert.");
  }
  notes.push("CAD-Regel: Das Modell bleibt mm-basiert. Pixel/DPR existieren nur in der Anzeige-Schicht.");
  notes.push(`b158: Schriftwahl: ${model.metrics.requestedFontMode === "auto" ? "Auto" : "Manuell"} → ${model.metrics.fontLabel}. ${model.metrics.autoFontModeReason}`);
  if (model.metrics.requestedFontMode === "auto") notes.push("b158: Layout-Solver-Regel: Mittelschrift bleibt Standard; Engschrift wird nur gewählt, wenn Mittelschrift mit zulässigen variablen Abständen und gleichen Außenrändern nicht passt.");
  if (viewer.modeLabel !== "1:1 physisch") {
    notes.push("Aktueller Viewer-Modus ist nicht 1:1; zum Messen auf dem Monitor bitte 1:1 physisch wählen.");
  }
  notes.push("b157: Die zweizeilige Siegelgeometrie ist wieder auf b128-Stand; b129-Siegelkreis-Änderungen wurden verworfen. Zweizeilig nutzt ein eigenes oberes Zeilenmodell: Bezirk, dann Siegelabstand 8-25 mm, dann 45-mm-Siegelfeld; bei Saison wird der Saisonabstand als *-Fläche mit mindestens 8 mm gemeinsam mit den übrigen Top-Zeilen-Abstandsflächen ausgewogen verteilt. Unten gelten Gruppengaps normal 24-30 mm, bei finalem H/E-Suffix in der gesamten unteren Zeile 20-30 mm. Einzeilig kann jetzt dasselbe Saisonfeld als 30 × 75-mm-Block nach der Erkennungsnummer rendern; der Block ist von *-Abstandsflächen umgeben.");
  notes.push("b158: Lab-only Refactor: Die b157-Geometrie bleibt unverändert; das physische Modell liegt jetzt hinter src/plate/mm-model.js, während app.js nur UI, Controls und Testmatrix steuert.");
  if (model.metrics.plateColorMode === "green") notes.push("b158: Grünes Kennzeichen aktiv: Standardgeometrie ein- oder zweizeilig, grüne Hauptschrift; Saison wird im Lab für diese Variante deaktiviert. H/E- und Saison-Kombinationen sind hier bewusst nicht Ziel dieses Schnellchecks.");
  notes.push("b158: Das Länderkennzeichen D sitzt in einem eigenen 20-mm-Eurofeld: einzeilig 17/30/17/20/17 in 101 mm, zweizeilig 10/30/17/20/11 in 88 mm. D und die Saison-Monatsfelder verwenden DIN1451Alt/din1451alt.ttf, wenn die Fontdatei lokal im Lab- oder Repo-Fonts-Ordner liegt.");
  notes.push("b158: Saison besteht im Lab aus zwei eigenen 30 × 20-mm-Feldern plus 30 × 3,25-mm-Trennstrich innerhalb eines 30 × 75-mm-Saisonblocks. Ziel-Glyphenhöhe, SVG-Fontgröße, obere Baseline und Zifferngap sind separat einstellbar; die Saisonmonate werden deterministisch im SVG aus Ziffer 1 + Gap + Ziffer 2 aufgebaut und als Konstruktionsbreite im jeweiligen 30-mm-Feld zentriert; die Zifferbreite skaliert proportional zur aktiven Saison-Fontgröße.");
  notes.push("b158: Der alte Saison-Zentrierbutton und die automatische Nachrender-BBox-Korrektur sind entfernt. Die Saison-Messung schreibt keine Werte zurück und verschiebt nichts; sie zeigt nur Diagnosewerte an.");
  notes.push("b158: GL-Mittelschrift ist als manueller Kalibrierstand 75 / 125 / 92,5 mm festgehalten; zweizeilig steuert die manuelle Baseline die obere Zeile und die untere Zeile folgt mit gleichem Band-Offset.");
  notes.push(`b158: I nutzt eine gemeinsame mm-Zellbreite für Mittel- und Engschrift: ${format(numberValue(controls.specialIWidth, resolvePlateRules(controls.plateFormat.value).cells.middle.specialWidths.I), 1)} mm. Status: kalibrierter GL-Fontwert, nicht amtlich einzeln belegtes Maß; Mittel/Eng unterscheiden sich weiterhin bei den übrigen Zeichen.`);
  if (model.metrics.plateFormat === "motorcycle") notes.push("b169/b170: Kraftradkennzeichen aktiv: eigenes Kraftrad-Raster mit 49-mm-Zeichenfeldern, verkleinerter Mittelschrift ohne Engschrift-Automatik, horizontalem Plakettenband und separater Saisonspalte. Bei Saison ist der 3,25-mm-Trennstrich exakt bei y=100 mm zentriert; es gibt keinen Season-Gap in der oberen Zeile. Die Siegel-X-Position ist fallbezogen: Normal, H/E, Saison und Saison-H/E verwenden getrennte Templatewerte.");
  if (model.metrics.changePlateEnabled) notes.push("b252: Wechselkennzeichen-Labmodell aktiv; getrennte Lab-Eingaben verhindern Duplikate am Kennzeichenende. Einzeilig nutzt den bestätigten 60 x 110 mm Wechselteil aus b243/b244. Zweizeilig und Kraftrad nutzen einen separaten 60 x 200 mm Wechselteil-Zweig. Beim Kraftrad-Wechselkennzeichen werden W/Behördensiegel inklusive physischer Siegelgröße korrekt gespiegelt: Behördensiegel 45 mm links, W im 35-mm-HU-Slot rechts. b252 gleicht zusätzlich den grafischen Debug-Layer an diese effektive Siegelgeometrie an. Bestehende Renderer bleiben Originalpfade und werden nur als Basis verwendet. Reduced-Wechselkennzeichen bleibt bewusst deaktiviert.");
  if (model.metrics.plateFormat === "reducedTwoLine") notes.push("b209: verkleinertes zweizeiliges Kennzeichen aktiv: vollständige Text-/Siegel-Zeilenketten, Auto-Breitenkandidaten 180/200/220/240/255 mm, feste verkleinerte Mittelschrift, ** 8–10 mm, *** 15–18 mm. Vertikale Siegel bleiben für Standardfälle mit bis zu vier sichtbaren unteren Zeichen Pflicht; H/E oder Saison erzwingen die obere Nebeneinander-Siegelreihe und werden ab 180 mm gegen echte Maßketten geprüft. Saisonfelder rendern feldlokal in der unteren Zeile. Ein- und zweistellige obere Bezirkskürzel werden jetzt im nutzbaren Eurofeld→Siegel-Korridor zentriert; b204/b205 Prüfkette-Presets bleiben erhalten; b209 ergänzt 8-Slot/I-Gegenproben, den 8-Slot-Tight-Fall mit 3-mm-Text→Siegel, 4-mm-Siegel→HU und 8-mm-Rechtsrand sowie den bestehenden 9-Slot-Saison/H-E-Grenzfall mit ≥6-mm-Rechtsrand.");
  if (controls.stage?.value === "horizontal") notes.push("Horizontalprüfung aktiv: Zellgrenzen, Zellmitten, Zellbreiten und Gap-Breiten werden sichtbar gemacht, ohne das Modell zu verändern.");
  notes.push("Die automatische Kalibrierung erzeugt nur mm-basierte Modellparameter Font-Kalibriergröße und Baseline; das komplette SVG wird weiterhin erst danach skaliert.");
  if (fontFit?.mode === "fallback") notes.push("Fontmessung war nicht verfügbar; Fallbackwerte aktiv.");
  $("#notes").innerHTML = notes.map((note) => `<div>${escapeHtml(note)}</div>`).join("");
}

function renderRegressionMatrix() {
  const target = controls.regressionMatrix;
  if (!target) return;

  const rows = REGRESSION_CASES.map((test) => {
    const result = evaluateRegressionCase(test);
    const statusClass = result.ok ? "ok" : "warn";
    const statusText = result.ok ? "OK" : "Prüfen";
    const formatLabel = test.plateFormat === "motorcycle" ? "Kraftrad" : test.plateFormat === "reducedTwoLine" ? "verkleinert zweizeilig" : test.plateFormat === "twoLine" ? "zweizeilig" : "einzeilig";
    return `
      <tr>
        <td><strong>${escapeHtml(test.label)}</strong></td>
        <td>${escapeHtml(formatLabel)}${test.green ? " · grün" : ""}${test.season ? " · Saison" : ""}</td>
        <td><code>${escapeHtml(test.input)}</code></td>
        <td><span class="regression-status ${statusClass}">${statusText}</span></td>
        <td class="regression-detail">${escapeHtml(result.detail)}</td>
        <td><button type="button" data-regression-case="${escapeHtml(test.id)}">laden</button></td>
      </tr>
    `;
  }).join("");

  target.innerHTML = rows;
}

function applyRegressionCase(id) {
  const test = REGRESSION_CASES.find((item) => item.id === id);
  if (!test) return;
  controls.plateFormat.value = test.plateFormat;
  if (controls.twoLineWidthRule) controls.twoLineWidthRule.value = test.twoLineWidthRule || test.expectWidthRule || "standard";
  syncWidthModeOptions(test.plateFormat, test.twoLineWidthRule || test.expectWidthRule || "standard");
  controls.plateInput.value = test.input;
  controls.greenPlate.checked = Boolean(test.green);
  controls.seasonEnabled.checked = Boolean(test.season);
  controls.seasonFrom.value = "4";
  controls.seasonTo.value = "10";
  controls.widthMode.value = "balanced";
  controls.fontMode.value = "auto";
  applySeasonTypographyDefaults();
  const fontDefaults = getMainFontDefaults(test.plateFormat);
  controls.targetGlyphHeight.value = String(fontDefaults.targetGlyphHeight);
  controls.fontSize.value = String(fontDefaults.fontSize);
  controls.baselineY.value = String(fontDefaults.baselineY);
  controls.specialIWidth.value = String(fontDefaults.specialIWidth);
  render();
}

function getMainFontDefaults(plateFormat) {
  if (plateFormat === "motorcycle") return MOTORCYCLE_FONT_MANUAL_DEFAULTS;
  if (plateFormat === "reducedTwoLine") return REDUCED_FONT_MANUAL_DEFAULTS;
  return MAIN_FONT_MANUAL_DEFAULTS;
}

function applyMainFontDefaultsForCurrentFormat() {
  const defaults = getMainFontDefaults(controls.plateFormat?.value);
  if (controls.targetGlyphHeight) controls.targetGlyphHeight.value = String(defaults.targetGlyphHeight);
  if (controls.fontSize) controls.fontSize.value = String(defaults.fontSize);
  if (controls.baselineY) controls.baselineY.value = String(defaults.baselineY);
  if (controls.specialIWidth) controls.specialIWidth.value = String(defaults.specialIWidth);
}

function initManualFontDefaults() {
  // Keep the manual GL calibration stable while season controls are adjusted.
  // The controls are only overwritten by the auto-fit path when the checkbox is active.
  const defaults = MAIN_FONT_MANUAL_DEFAULTS;
  if (!Number.isFinite(Number(controls.targetGlyphHeight?.value))) controls.targetGlyphHeight.value = String(defaults.targetGlyphHeight);
  if (!Number.isFinite(Number(controls.fontSize?.value))) controls.fontSize.value = String(defaults.fontSize);
  if (!Number.isFinite(Number(controls.baselineY?.value))) controls.baselineY.value = String(defaults.baselineY);
  if (!Number.isFinite(Number(controls.specialIWidth?.value))) controls.specialIWidth.value = String(defaults.specialIWidth);
}

function initBrowserValueRestoreGuard() {
  // Browsers can restore number-input values by control position after the Lab UI
  // changes between ZIP versions. That made the season values appear shifted, e.g.
  // 20 / 28 / 37.5 becoming 28 / 37.5 / 17.5. We disable autocomplete
  // metadata and repair only known corrupted/out-of-range states.
  
if (controls.regressionMatrix) {
  controls.regressionMatrix.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-regression-case]");
    if (!button) return;
    applyRegressionCase(button.dataset.regressionCase);
  });
}
if (controls.runRegression) controls.runRegression.addEventListener("click", renderRegressionMatrix);

if (controls.plateFormat) {
  controls.plateFormat.addEventListener("change", applyMainFontDefaultsForCurrentFormat);
}

document.querySelectorAll("input, select").forEach((element) => {
    element.setAttribute("autocomplete", "off");
  });
  repairSeasonTypographyValues();
}

function repairSeasonTypographyValues() {
  const values = {
    targetGlyphHeight: Number(controls.seasonTargetGlyphHeight?.value),
    fontSize: Number(controls.seasonFontSize?.value),
    baselineY: Number(controls.seasonBaselineY?.value),
    widthScale: Number(controls.seasonWidthScale?.value),
    digitGap: Number(controls.seasonDigitGap?.value)
  };

  if (!shouldResetSeasonTypography(values)) return false;
  applySeasonTypographyDefaults();
  return true;
}

function shouldResetSeasonTypography(values) {
  const invalid =
    !between(values.targetGlyphHeight, 8, 30) ||
    !between(values.fontSize, 8, 60) ||
    !between(values.baselineY, 17.5, 92.5) ||
    !between(values.widthScale, 0.6, 1.2) ||
    !between(values.digitGap, -5, 10);

  const knownShiftedSeasonRow =
    approx(values.targetGlyphHeight, 28) &&
    approx(values.fontSize, 37.5) &&
    approx(values.baselineY, 17.5);

  const knownOldMeasurementDamage =
    values.fontSize < 8 ||
    values.baselineY < 0 ||
    Math.abs(values.baselineY) > 120;

  return invalid || knownShiftedSeasonRow || knownOldMeasurementDamage;
}

function applySeasonTypographyDefaults() {
  const defaults = SEASON_TYPOGRAPHY_DEFAULTS;
  if (controls.seasonTargetGlyphHeight) controls.seasonTargetGlyphHeight.value = String(defaults.targetGlyphHeight);
  if (controls.seasonFontSize) controls.seasonFontSize.value = String(defaults.fontSize);
  if (controls.seasonBaselineY) controls.seasonBaselineY.value = String(defaults.baselineY);
  if (controls.seasonWidthScale) controls.seasonWidthScale.value = String(defaults.widthScale);
  if (controls.seasonDigitGap) controls.seasonDigitGap.value = String(defaults.digitGap);
}

function between(value, min, max) {
  return Number.isFinite(value) && value >= min && value <= max;
}

function approx(value, expected, tolerance = 0.001) {
  return Number.isFinite(value) && Math.abs(value - expected) <= tolerance;
}

function applyPlateStringPreset(value) {
  const normalized = String(value || "").trim();
  if (!normalized) return;
  controls.plateInput.value = normalized;
  if (controls.changePlateCommonInput) controls.changePlateCommonInput.value = normalized;
  render();
}

function initPlateStringPresets() {
  const holder = controls.plateStringPresets;
  if (!holder) return;
  const buttons = PLATE_STRING_PRESETS.map((preset) => `
    <button type="button" data-plate-string-preset="${escapeHtml(preset)}">${escapeHtml(preset)}</button>
  `).join("");

  holder.innerHTML = buttons;
  holder.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-plate-string-preset]");
    if (!button) return;
    applyPlateStringPreset(button.dataset.plateStringPreset);
  });
}

function applyMeasuredCalibration() {
  const measured = numberValue(controls.measured100, 0);
  if (!measured) return;
  const current = numberValue(controls.calibrationFactor, 1);
  controls.calibrationFactor.value = String(Number(correctionFromMeasured100Mm(current, measured).toFixed(4)));
  render();
}

controls.monitorProfile.addEventListener("change", () => {
  if (controls.monitorProfile.value === "acer-vg272u-v") {
    controls.devicePxPerMm.value = String(MONITOR_PROFILES["acer-vg272u-v"].devicePxPerMm);
  }
  render();
});


if (controls.regressionMatrix) {
  controls.regressionMatrix.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-regression-case]");
    if (!button) return;
    applyRegressionCase(button.dataset.regressionCase);
  });
}
if (controls.runRegression) controls.runRegression.addEventListener("click", renderRegressionMatrix);

if (controls.plateFormat) {
  controls.plateFormat.addEventListener("change", applyMainFontDefaultsForCurrentFormat);
}

document.querySelectorAll("input, select").forEach((element) => {
  element.addEventListener("input", render);
  element.addEventListener("change", render);
});
$("#applyMeasured").addEventListener("click", applyMeasuredCalibration);
window.addEventListener("resize", render);

initManualFontDefaults();
initBrowserValueRestoreGuard();
initPlateStringPresets();
window.addEventListener("pageshow", () => {
  if (repairSeasonTypographyValues()) render();
});
render();



function syncTwoLineWidthRuleControl(plateFormat) {
  if (!controls.twoLineWidthRule) return;
  if (plateFormat === "motorcycle") {
    controls.twoLineWidthRule.value = "motorcycle";
    return;
  }
  if (plateFormat === "reducedTwoLine") {
    controls.twoLineWidthRule.value = "reducedTwoLine";
    return;
  }
  if (plateFormat === "twoLine" && (controls.twoLineWidthRule.value === "motorcycle" || controls.twoLineWidthRule.value === "reducedTwoLine")) {
    controls.twoLineWidthRule.value = "standard";
  }
}

function getTwoLineWidthRuleOption(plateFormat) {
  if (plateFormat === "motorcycle") return "motorcycle";
  if (plateFormat === "reducedTwoLine") return "reducedTwoLine";
  return plateFormat === "twoLine" ? (controls.twoLineWidthRule?.value || "standard") : "standard";
}

function isTwoLineLikeFormat(plateFormat) {
  return plateFormat === "twoLine" || plateFormat === "motorcycle" || plateFormat === "reducedTwoLine";
}

function getVisualStyleOptions() {
  return {
    plateColorMode: controls.greenPlate?.checked ? "green" : "black"
  };
}

function getChangePlateOptions(plateFormat) {
  const enabled = (plateFormat === "oneLine" || plateFormat === "twoLine" || plateFormat === "motorcycle") && controls.changePlateEnabled?.checked === true;
  return {
    enabled,
    commonText: enabled ? (controls.changePlateCommonInput?.value || "") : "",
    vehicleText: enabled ? (controls.changePlateVehicleInput?.value || "") : ""
  };
}

function getSeasonOptions(plateFormat) {
  const enabled = !controls.greenPlate?.checked && (plateFormat === "twoLine" || plateFormat === "motorcycle" || plateFormat === "oneLine" || plateFormat === "reducedTwoLine") && controls.seasonEnabled?.checked === true;
  return {
    enabled,
    from: controls.seasonFrom?.value || "04",
    to: controls.seasonTo?.value || "10",
    targetDigitHeight: numberValue(controls.seasonTargetGlyphHeight, 20),
    fontSize: numberValue(controls.seasonFontSize, 28),
    baselineY: numberValue(controls.seasonBaselineY, 37.5),
    widthScale: numberValue(controls.seasonWidthScale, 1),
    digitGap: signedNumberValue(controls.seasonDigitGap, SEASON_DIGIT_GAP_DEFAULT_MM)
  };
}


async function waitForFonts() {
  if (!document.fonts?.ready) return;
  try {
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 1200))
    ]);
  } catch (_error) {
    // Font readiness is a lab diagnostic only. Rendering must remain usable with fallbacks.
  }
}

function renderFontStatus() {
  const target = controls.fontStatus;
  if (!target) return;
  const fonts = document.fonts;
  if (!fonts?.check) {
    target.textContent = "Fontstatus: Browser unterstützt document.fonts.check nicht.";
    return;
  }
  const dinLoaded = fonts.check('20px "DIN1451Alt"') || fonts.check('20px "AlteDIN1451Mittelschrift"');
  const middleLoaded = fonts.check('75px "GL-Nummernschild-Mtl"');
  const narrowLoaded = fonts.check('75px "GL-Nummernschild-Eng"');
  target.textContent = `Fontstatus: DIN Saison/D ${dinLoaded ? "geladen" : "nicht geladen / Fallback-Risiko"} · GL Mittel ${middleLoaded ? "geladen" : "nicht geladen"} · GL Eng ${narrowLoaded ? "geladen" : "nicht geladen"}. Die 30 × 20-mm-Saisonfelder sind Konstruktionsfelder. Der Saison-Zifferngap wirkt in mm zwischen den Monatsziffern; die Saisonposition wird ausschließlich deterministisch im SVG aus Ziffernbreite + Gap + Ziffernbreite berechnet.`;
}



function measureSeasonGlyphRows() {
  const svg = $("#output svg");
  if (!svg) return null;
  const entries = ["from", "to"].map((key) => {
    const row = svg.querySelector(`[data-season-row="${key}"]`);
    const field = svg.querySelector(`[data-season-box="${key}"]`);
    if (!row || !field) return null;
    const glyphBox = combinedSeasonDigitBBox(row, svg);
    const fieldBox = readSvgRect(field);
    if (!glyphBox || !fieldBox || !Number.isFinite(glyphBox.width) || glyphBox.width <= 0) return null;
    const glyphCenterX = glyphBox.x + glyphBox.width / 2;
    const glyphCenterY = glyphBox.y + glyphBox.height / 2;
    const fieldCenterX = fieldBox.x + fieldBox.width / 2;
    const fieldCenterY = fieldBox.y + fieldBox.height / 2;
    return {
      key,
      glyphBox,
      fieldBox,
      deltaX: fieldCenterX - glyphCenterX,
      deltaY: fieldCenterY - glyphCenterY,
      layoutWidth: Number(row.getAttribute("data-season-total-width"))
    };
  }).filter(Boolean);
  return entries.length ? entries : null;
}

function combinedSeasonDigitBBox(row, svg) {
  const boxes = [...row.querySelectorAll("text")]
    .map((text) => transformedBBoxInSvgUnits(text, svg))
    .filter((box) => box && Number.isFinite(box.width) && box.width > 0 && Number.isFinite(box.height) && box.height > 0);
  if (!boxes.length) return null;
  const minX = Math.min(...boxes.map((box) => box.x));
  const minY = Math.min(...boxes.map((box) => box.y));
  const maxX = Math.max(...boxes.map((box) => box.x + box.width));
  const maxY = Math.max(...boxes.map((box) => box.y + box.height));
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function transformedBBoxInSvgUnits(element, svg) {
  // Diagnostic only. b157 does not use measured season glyph boxes to move
  // anything after rendering; the physical SVG layout is deterministic.
  return tightBBoxInSvgUnits(element, svg) || screenBBoxInSvgUnits(element, svg) || fallbackBBox(element);
}

function tightBBoxInSvgUnits(element, svg) {
  if (typeof element.getBBox !== "function") return null;
  try {
    const box = element.getBBox();
    const matrix = element.getCTM();
    if (!matrix || box.width <= 0 || box.height <= 0) return null;
    return transformBoxWithMatrix(svg, box, matrix);
  } catch (_error) {
    return null;
  }
}

function screenBBoxInSvgUnits(element, svg) {
  try {
    const rect = element.getBoundingClientRect();
    const matrix = svg.getScreenCTM()?.inverse();
    if (!matrix || rect.width <= 0 || rect.height <= 0) return null;
    const box = { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
    return transformBoxWithMatrix(svg, box, matrix);
  } catch (_error) {
    return null;
  }
}

function transformBoxWithMatrix(svg, box, matrix) {
  const points = [
    [box.x, box.y],
    [box.x + box.width, box.y],
    [box.x + box.width, box.y + box.height],
    [box.x, box.y + box.height]
  ].map(([x, y]) => {
    const point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    return point.matrixTransform(matrix);
  });
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function fallbackBBox(element) {
  if (typeof element.getBBox !== "function") return null;
  try {
    return element.getBBox();
  } catch (_error) {
    return null;
  }
}

function renderSeasonGlyphReadout() {
  const target = controls.seasonFitReadout;
  if (!target) return;
  const entries = measureSeasonGlyphRows();
  if (!entries) {
    target.textContent = "Saison-Messung: nicht aktiv oder nicht messbar.";
    return;
  }
  const maxHeight = Math.max(...entries.map((entry) => entry.glyphBox.height));
  const avgDy = average(entries.map((entry) => entry.deltaY));
  const parts = entries.map((entry) => {
    const label = entry.key === "from" ? "von" : "bis";
    const widthText = Number.isFinite(entry.layoutWidth) ? ` · konstruktive Layoutbreite ${format(entry.layoutWidth, 2)} mm` : "";
    return `${label}: Monatsstring ${format(entry.glyphBox.width, 2)} × ${format(entry.glyphBox.height, 2)} mm${widthText} · Rest-Δx ${format(entry.deltaX, 2)} · Δy ${format(entry.deltaY, 2)}`;
  });
  target.textContent = `Saison-Messung nur Diagnose, ohne Nachjustierung: ${parts.join(" | ")} | max. Höhe ${format(maxHeight, 2)} mm · mittlere Δy ${format(avgDy, 2)} mm`;
}

function average(values) {
  const valid = values.filter((value) => Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
}

function getSpecialIWidth(baseFont) {
  return numberValue(controls.specialIWidth, baseFont.specialWidths?.I || baseFont.letterWidth);
}

function signedNumberValue(input, fallback) {
  const value = Number(input?.value);
  return Number.isFinite(value) ? value : fallback;
}

function numberValue(input, fallback) {
  const value = Number(input.value);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function format(value, decimals = 2) {
  return Number(value || 0).toLocaleString("de-DE", { maximumFractionDigits: decimals });
}

function formatPlain(value, decimals = 2) {
  return Number(value || 0).toFixed(decimals).replace(/\.?0+$/, "");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
