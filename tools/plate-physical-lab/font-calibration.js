// Kennzeichen Physical Lab b117
// Browser-side font measurement for mm-based model parameters.
// This file measures rendered font glyphs and returns mm values (font-size/baseline)
// for the model. It does not scale the SVG viewer and it does not apply per-element
// post-scaling after the plate has been rendered.

const DEFAULT_SAMPLE = "ABCDEFGHIKLMNOPRSTUVWXYZ0123456789";
const BASE_FONT_SIZE_MM = 100;
const CACHE = new Map();

export const FONT_FIT_MODES = Object.freeze({
  auto: "Automatisch messen",
  manual: "Manuell"
});

export async function resolveFontFitMm({
  enabled,
  fontFamily,
  fallbackFontSize,
  fallbackBaselineY,
  bandY,
  bandHeight,
  targetVisibleHeight,
  sample = DEFAULT_SAMPLE
}) {
  if (!enabled) {
    return {
      mode: "manual",
      fontSize: fallbackFontSize,
      baselineY: fallbackBaselineY,
      sample,
      measured: null,
      note: "Manuelle Werte aktiv."
    };
  }

  const measured = await measureFontMm(fontFamily, sample);
  if (!measured || !measured.height) {
    return {
      mode: "fallback",
      fontSize: fallbackFontSize,
      baselineY: fallbackBaselineY,
      sample,
      measured: null,
      note: "Schriftmessung nicht verfügbar; Fallbackwerte aktiv."
    };
  }

  const targetHeight = clamp(Number(targetVisibleHeight) || bandHeight, 1, bandHeight);
  const scale = targetHeight / measured.height;
  const fontSize = BASE_FONT_SIZE_MM * scale;
  const baselineY = bandY + (bandHeight - targetHeight) / 2 - measured.y * scale;

  return {
    mode: "auto",
    fontSize,
    baselineY,
    sample,
    measured: {
      ...measured,
      targetHeight,
      scale,
      visibleHeight: measured.height * scale,
      topY: baselineY + measured.y * scale,
      bottomY: baselineY + (measured.y + measured.height) * scale
    },
    note: "Schrift automatisch auf sichtbare Glyphenhöhe im 75-mm-Zeichenband kalibriert."
  };
}

async function measureFontMm(fontFamily, sample) {
  const key = `${fontFamily}::${sample}`;
  if (CACHE.has(key)) return CACHE.get(key);

  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch (_error) {
      // Continue with browser fallback measurement.
    }
  }

  const measurement = measureSvgText(fontFamily, sample);
  CACHE.set(key, measurement);
  return measurement;
}

function measureSvgText(fontFamily, sample) {
  const namespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(namespace, "svg");
  const text = document.createElementNS(namespace, "text");

  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("viewBox", "0 0 1000 200");
  svg.style.position = "absolute";
  svg.style.left = "-10000px";
  svg.style.top = "-10000px";
  svg.style.overflow = "visible";
  svg.style.visibility = "hidden";

  text.setAttribute("x", "0");
  text.setAttribute("y", "0");
  text.setAttribute("font-family", `${fontFamily}, Arial Narrow, sans-serif`);
  text.setAttribute("font-size", String(BASE_FONT_SIZE_MM));
  text.setAttribute("font-weight", "400");
  text.textContent = sample;
  svg.append(text);
  document.body.append(svg);

  let box = null;
  try {
    box = text.getBBox();
  } catch (_error) {
    box = null;
  }
  svg.remove();

  if (!box || !Number.isFinite(box.height) || box.height <= 0) return null;

  return {
    baseFontSize: BASE_FONT_SIZE_MM,
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    bottom: box.y + box.height
  };
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}
