// Kennzeichen Physical Lab b102
// Viewer layer only: converts a finished mm SVG to CSS pixels for display.
// The physical plate model must never import this file.

export const MONITOR_PROFILES = Object.freeze({
  "acer-vg272u-v": {
    label: "Acer VG272U V",
    devicePxPerMm: 4.2918,
    ppi: 109.0,
    pixelPitchMm: 0.233
  }
});

export function getCalibrationState({ devicePxPerMm, correction = 1 }) {
  const dpr = window.devicePixelRatio || 1;
  return {
    devicePxPerMm,
    dpr,
    correction,
    cssPxPerMmAtOneToOne: devicePxPerMm / dpr * correction
  };
}

export function resolveViewerSize({ canvasMm, mode, calibration, viewport }) {
  const physicalWidth = canvasMm.width * calibration.cssPxPerMmAtOneToOne;
  const physicalHeight = canvasMm.height * calibration.cssPxPerMmAtOneToOne;

  if (mode === "fit") {
    const availableWidth = Math.max(120, (viewport?.width || physicalWidth) - 8);
    const availableHeight = Math.max(120, (viewport?.height || physicalHeight) - 8);
    const fitScale = Math.min(availableWidth / physicalWidth, availableHeight / physicalHeight, 1);
    return {
      cssWidth: physicalWidth * fitScale,
      cssHeight: physicalHeight * fitScale,
      viewerScale: fitScale,
      modeLabel: "Fit to screen"
    };
  }

  const multiplier = mode === "debug-3" ? 3 : mode === "debug-2" ? 2 : 1;
  return {
    cssWidth: physicalWidth * multiplier,
    cssHeight: physicalHeight * multiplier,
    viewerScale: multiplier,
    modeLabel: multiplier === 1 ? "1:1 physisch" : `${multiplier}× Debug`
  };
}

export function correctionFromMeasured100Mm(currentCorrection, measuredMm) {
  if (!Number.isFinite(measuredMm) || measuredMm <= 0) return currentCorrection;
  return currentCorrection * (100 / measuredMm);
}
