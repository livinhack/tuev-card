import { FZV_RULES, analysePlate, formatAnalysis, renderPlateSvg } from "./plate-renderer-core.js";

const $ = (selector) => document.querySelector(selector);
const form = $("#controls");
const output = $("#output");
const metrics = $("#metrics");
const variants = $("#variants");
const status = $("#status");

const examples = [
  "WIL CL 212",
  "BKS R 95",
  "WIL LM 216",
  "TR A 77",
  "S AB 1234",
  "DA CI 500",
  "HH EV 204E",
  "K A 1"
];

function render() {
  const data = new FormData(form);
  const options = {
    kind: data.get("kind"),
    layout: data.get("layout"),
    seasonStart: data.get("seasonStart"),
    seasonEnd: data.get("seasonEnd"),
    expiry: data.get("expiry"),
    huYear: data.get("huYear"),
    huMonth: data.get("huMonth"),
    debug: data.get("debug") === "on",
    scale: Number(data.get("scale") || 1),
    responsive: false
  };
  const plate = data.get("plate");
  const result = renderPlateSvg(plate, options);
  output.innerHTML = result.svg;
  renderMetrics(result.analysis);
  renderVariants(result.analysis);
  renderStatus(result.analysis);
}

function renderMetrics(analysis) {
  const formatted = formatAnalysis(analysis);
  const rows = [
    ["Status", formatted.valid ? "gültig" : "ungültig"],
    ["Normalisiert", formatted.normalized || "—"],
    ["Zeichen gesamt", formatted.charsTotal],
    ["Erkennungsnummer", formatted.charsRecognition],
    ["Bauart", formatted.layout],
    ["Größe", formatted.size],
    ["Schrift", formatted.font],
    ["Überlauf", formatted.overflow ? "ja" : "nein"]
  ];
  metrics.innerHTML = rows.map(([key, value]) => `<tr><th>${escapeHtml(key)}</th><td>${escapeHtml(value)}</td></tr>`).join("");
}

function renderVariants(analysis) {
  variants.innerHTML = analysis.alternatives.map((item) => `
    <tr class="${item === analysis.chosen ? "chosen" : ""}">
      <td>${escapeHtml(item.font.label)}</td>
      <td>${formatNumber(item.width)} × ${formatNumber(item.height)} mm</td>
      <td>${item.width <= analysis.layout.maxWidth ? "passt" : "zu breit"}</td>
      <td>${formatNumber(item.debug.rawWidth || item.width)} mm</td>
    </tr>`).join("");
}

function renderStatus(analysis) {
  const messages = [
    ...analysis.errors.map((text) => ({ type: "error", text })),
    ...analysis.warnings.map((text) => ({ type: "warning", text }))
  ];
  status.innerHTML = messages.length
    ? messages.map((entry) => `<div class="message ${entry.type}">${escapeHtml(entry.text)}</div>`).join("")
    : `<div class="message ok">Regeln für diese Auswahl erfüllt.</div>`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("de-DE", { maximumFractionDigits: 1 });
}

function initExamples() {
  const holder = $("#examples");
  holder.innerHTML = examples.map((example) => `<button type="button" data-plate="${escapeHtml(example)}">${escapeHtml(example)}</button>`).join("");
  holder.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-plate]");
    if (!button) return;
    $("#plate").value = button.dataset.plate;
    render();
  });
}

function initRules() {
  const list = $("#rules");
  list.innerHTML = `
    <li>Einzeilig: Größtmaß 520 × 110 mm</li>
    <li>Zweizeilig: Größtmaß 340 × 200 mm, bei zwei-/dreirädrigen Kraftfahrzeugen 280 × 200 mm</li>
    <li>Kraftrad: 180–220 × 200 mm</li>
    <li>Verkleinert zweizeilig: Größtmaß 255 × 130 mm</li>
    <li>Eurofeld: einzeilig 45 × 88 mm, zweizeilig/Kraftrad 40 × 88 mm, verkleinert 35 × 56 mm</li>
    <li>Schriftprofile: Mittelschrift 75 mm, Engschrift 75 mm, verkleinerte Mittelschrift 49 mm</li>
    <li>Behördensiegel: neutraler Platzhalter, keine echte Behörden-/Landessiegelgrafik</li>
  `;
  $("#source").href = FZV_RULES.source.url;
}

form.addEventListener("input", render);
form.addEventListener("change", render);
initExamples();
initRules();
render();
