import { ONE_LINE_RULES_MM, buildPlateModelMm, renderPlateSvgMm } from "./mm-model.js";
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
  showDimensions: $("#showDimensions")
};

function render() {
  const calibration = getCalibration();
  const result = renderPlateSvgMm(controls.plateInput.value, {
    stage: controls.stage.value,
    widthMode: controls.widthMode.value,
    fontMode: controls.fontMode.value,
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
  renderNotes(model, viewer);
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
    ["Freiraum links nach Eurofeld", `${format(metrics.remainingLeft, 1)} mm`],
    ["Freiraum rechts", `${format(metrics.remainingRight, 1)} mm`],
    ["Monitor", `${format(calibration.devicePxPerMm, 4)} Geräte-px/mm`],
    ["CSS-Maßstab 1:1", `${format(calibration.cssPxPerMmAtOneToOne, 4)} CSS-px/mm`],
    ["Viewer-Skalierung", `${format(viewer.viewerScale, 3)}×, nur Gesamt-SVG`]
  ];
  $("#metrics").innerHTML = rows.map(([key, value]) => `<tr><th>${escapeHtml(key)}</th><td>${escapeHtml(value)}</td></tr>`).join("");
}

function renderNotes(model, viewer) {
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
  notes.push("Morgen zuerst nur Schritt 1 prüfen: Außenmaß, schwarzer Rand, Eurofeld und 100-mm-Kalibrierlinie.");
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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
