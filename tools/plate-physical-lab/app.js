import { ONE_LINE_RULES_MM, buildPlateModelMm, getCharacterBand, renderPlateSvgMm } from "./mm-model.js";
import { resolveFontFitMm } from "./font-calibration.js";
import { MONITOR_PROFILES, correctionFromMeasured100Mm, getCalibrationState, resolveViewerSize } from "./viewer-calibration.js";

const $ = (selector) => document.querySelector(selector);

const examples = [
  "HH HU 199",
  "DA CI 500",
  "WIL CL 212",
  "BKS R 95",
  "K S 70",
  "TR M 6",
  "HH EV 204E",
  "BIT GT500",
  "5"
];

const controls = {
  monitorProfile: $("#monitorProfile"),
  devicePxPerMm: $("#devicePxPerMm"),
  displayMode: $("#displayMode"),
  calibrationFactor: $("#calibrationFactor"),
  measured100: $("#measured100"),
  stage: $("#stage"),
  plateInput: $("#plateInput"),
  widthMode: $("#widthMode"),
  fontMode: $("#fontMode"),
  autoFitFont: $("#autoFitFont"),
  targetGlyphHeight: $("#targetGlyphHeight"),
  fontSize: $("#fontSize"),
  baselineY: $("#baselineY"),
  showDimensions: $("#showDimensions")
};

let renderTicket = 0;

async function render() {
  const ticket = ++renderTicket;
  const calibration = getCalibration();
  const fontMode = controls.fontMode.value;
  const rules = ONE_LINE_RULES_MM;
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

  controls.fontSize.value = formatPlain(fontFit.fontSize, 2);
  controls.baselineY.value = formatPlain(fontFit.baselineY, 2);

  const result = renderPlateSvgMm(controls.plateInput.value, {
    stage: controls.stage.value,
    widthMode: controls.widthMode.value,
    fontMode,
    fontSize: fontFit.fontSize,
    baselineY: fontFit.baselineY,
    fontFit,
    showDimensions: controls.showDimensions.checked
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

  $("#ruler100").style.width = `${100 * calibration.cssPxPerMmAtOneToOne}px`;
  $("#calibrationReadout").innerHTML = renderCalibrationReadout(calibration, viewer);
  $("#sizePill").textContent = `${model.metrics.width} × ${model.metrics.height} mm`;
  renderMetrics(model.metrics, calibration, viewer, canvas);
  renderFontFit(fontFit);
  renderNotes(model, viewer, fontFit);
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
    ["Normalisiert", metrics.normalized || "—"],
    ["Ortskennung", metrics.district || "—"],
    ["Erkennungsnummer", metrics.recognition || "—"],
    ["Schrift", metrics.fontLabel],
    ["Außenmaß Kennzeichen", `${metrics.width} × ${metrics.height} mm`],
    ["SVG-Canvas", `${format(canvas.width, 1)} × ${format(canvas.height, 1)} mm`],
    ["Rohbreite Inhalt", `${format(metrics.rawContentWidth, 1)} mm`],
    ["DXF-Referenz", metrics.dxfReference],
    ["Außen-/Innenhöhe", `${format(metrics.height, 1)} mm außen · ${format(metrics.innerHeight, 1)} mm innen`],
    ["Rand/Ecken", `${format(metrics.innerInset, 1)} mm Rand · außen R${format(metrics.outerCornerRadius, 2)} · innen R${format(metrics.innerCornerRadius, 2)}`],
    ["Eurofeld", `x ${format(metrics.euroX, 1)} · ${format(metrics.euroWidth, 1)} × ${format(metrics.euroHeight, 1)} mm`],
    ["Zeichenband", `y ${format(metrics.characterBandY, 1)} mm · Höhe ${format(metrics.characterBandHeight, 1)} mm`],
    ["Zellbreiten", `Buchstaben ${format(metrics.cellLetterWidth, 1)} mm · Ziffern ${format(metrics.cellDigitWidth, 1)} mm · Zeichenabstand ${format(metrics.cellGap, 1)} mm · Gruppengap ${format(metrics.groupGap, 1)} mm`],
    ["Font-Kalibrierprofil", `${metrics.fontLabel} · Font-Kalibriergröße ${format(metrics.characterFontSize, 2)} · Baseline y ${format(metrics.characterBaselineY, 2)} mm`],
    ["Glyphen-Fit", metrics.fontFitMode === "auto" ? `Auto · sichtbar ${format(metrics.fontFitVisibleHeight, 2)} mm · oben ${format(metrics.fontFitTopY, 2)} / unten ${format(metrics.fontFitBottomY, 2)} mm` : metrics.fontFitMode || "manuell"],
    ["Siegelspalte", `${format(metrics.sealColumnWidth, 1)} mm, äußerer Referenzraum ${format(metrics.sealColumnMaxWidth, 1)} mm`],
    ["HU-Plakette", `${format(metrics.huDiameter, 1)} mm · Mitte y ${format(metrics.huCenterY, 1)} mm`],
    ["Behördensiegel", `${format(metrics.authorityDiameter, 1)} mm · Mitte y ${format(metrics.authorityCenterY, 1)} mm`],
    ["Abstand HU/Behörde", `${format(metrics.sealVisibleCircleGap, 1)} mm zwischen sichtbaren Kreisen`],
    ["Siegel-Anschluss", metrics.sealAdjacentGapPolicy || "nicht gesetzt"],
    ["Freiraum links nach Eurofeld", `${format(metrics.remainingLeft, 1)} mm`],
    ["Freiraum rechts", `${format(metrics.remainingRight, 1)} mm`],
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
  if (model.metrics.width === ONE_LINE_RULES_MM.maxWidth) {
    notes.push("Maximalbreite 520 mm erreicht.");
  }
  if (!model.metrics.district) {
    notes.push("Keine Ortskennung erkannt; Siegelzone wird trotzdem als feste physische Zone gerendert.");
  }
  notes.push("CAD-Regel: Das Modell bleibt mm-basiert. Pixel/DPR existieren nur in der Anzeige-Schicht.");
  if (viewer.modeLabel !== "1:1 physisch") {
    notes.push("Aktueller Viewer-Modus ist nicht 1:1; zum Messen auf dem Monitor bitte 1:1 physisch wählen.");
  }
  notes.push("b102: Die Siegelspalte steht direkt zwischen den angrenzenden Zeichenzellen; es gibt keine zusätzlichen Gap-Elemente vor/nach der Siegelzone.");
  notes.push("b102: Das Länderkennzeichen D verwendet DIN1451Alt/din1451alt.ttf, wenn die Fontdatei lokal im Lab- oder Repo-Fonts-Ordner liegt.");
  notes.push("b102: GL-Mittelschrift ist als manueller Kalibrierstand 125 / 92,5 mm festgehalten; die automatische Messung bleibt zuschaltbar.");
  if (controls.stage?.value === "horizontal") notes.push("Horizontalprüfung aktiv: Zellgrenzen, Zellmitten, Zellbreiten und Gap-Breiten werden sichtbar gemacht, ohne das Modell zu verändern.");
  notes.push("Die automatische Kalibrierung erzeugt nur mm-basierte Modellparameter Font-Kalibriergröße und Baseline; das komplette SVG wird weiterhin erst danach skaliert.");
  if (fontFit?.mode === "fallback") notes.push("Fontmessung war nicht verfügbar; Fallbackwerte aktiv.");
  $("#notes").innerHTML = notes.map((note) => `<div>${escapeHtml(note)}</div>`).join("");
}

function initExamples() {
  const holder = $("#examples");
  holder.innerHTML = examples.map((example) => `<button type="button" data-example="${escapeHtml(example)}">${escapeHtml(example)}</button>`).join("");
  holder.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-example]");
    if (!button) return;
    controls.plateInput.value = button.dataset.example;
    render();
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

document.querySelectorAll("input, select").forEach((element) => {
  element.addEventListener("input", render);
  element.addEventListener("change", render);
});
$("#applyMeasured").addEventListener("click", applyMeasuredCalibration);
window.addEventListener("resize", render);

initExamples();
render();

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
