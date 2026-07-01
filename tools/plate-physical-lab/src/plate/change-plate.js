// Kennzeichen Physical Lab b289 / Wechselkennzeichen model attachment helpers
// Keeps the confirmed b237 one-line renderer untouched. The Wechselkennzeichen
// branch starts with that solved one-line model and attaches only the extra
// physical Wechselteil model plus the W replacement marker.

import { parsePlate, splitRecognition } from "./text-utils.js";
import { createChangePlateSupplementItems } from "./change-plate-supplement-renderer.js";
import { numberOrFallback as finiteNumber, positiveNumber } from "./plate-number-utils.js";

const DEFAULT_CHANGE_PLATE = Object.freeze({
  enabled: false,
  supplementWidth: 60,
  supplementGap: 8,
  wHeight: 20,
  wWidth: 25,
  // HU Plakette has the same physical size as on the main plate.
  // The concrete diameter/center is resolved from the active plate rules, not
  // scaled down for the Wechselteil.
  supplementSealDiameter: null,
  supplementSealCenterY: 26.5,
  // Target visible glyph height 32-37 mm. GL Nummernschild uses the same
  // calibration ratio as the normal one-line renderer: 125 SVG font-size
  // produces about 75 mm visible height, so 34 mm visible target needs
  // about 56.7 SVG font-size.
  supplementVehicleFontSize: 56.7,
  supplementVehicleTopY: 55,
  supplementVehicleTargetHeight: 34,
  supplementVehicleBaselineY: 88,
  supplementDigitTargetWidth: 18.5,
  supplementHeTargetWidth: 14,
  supplementVehicleCharGap: 1.5,
  supplementLabelFontSize: 6,
  supplementLabelBaselineY: 100,
  highSupplementHeight: 200,
  highSupplementSealCenterY: 30,
  highSupplementVehicleTopY: 145,
  highSupplementVehicleBaselineY: 178,
  highSupplementLabelBaselineY: 190,
  commonText: "",
  vehicleText: ""
});

export function resolveChangePlateOptions(changePlate = {}) {
  const enabled = changePlate?.enabled === true;
  return {
    ...DEFAULT_CHANGE_PLATE,
    ...(changePlate || {}),
    enabled,
    supplementWidth: positiveNumber(changePlate?.supplementWidth, DEFAULT_CHANGE_PLATE.supplementWidth),
    supplementGap: positiveNumber(changePlate?.supplementGap, DEFAULT_CHANGE_PLATE.supplementGap),
    wHeight: positiveNumber(changePlate?.wHeight, DEFAULT_CHANGE_PLATE.wHeight),
    wWidth: positiveNumber(changePlate?.wWidth, DEFAULT_CHANGE_PLATE.wWidth),
    supplementVehicleFontSize: positiveNumber(changePlate?.supplementVehicleFontSize, DEFAULT_CHANGE_PLATE.supplementVehicleFontSize),
    supplementVehicleTopY: positiveNumber(changePlate?.supplementVehicleTopY, DEFAULT_CHANGE_PLATE.supplementVehicleTopY),
    supplementVehicleTargetHeight: positiveNumber(changePlate?.supplementVehicleTargetHeight, DEFAULT_CHANGE_PLATE.supplementVehicleTargetHeight),
    supplementVehicleBaselineY: positiveNumber(changePlate?.supplementVehicleBaselineY, DEFAULT_CHANGE_PLATE.supplementVehicleBaselineY),
    supplementDigitTargetWidth: positiveNumber(changePlate?.supplementDigitTargetWidth, DEFAULT_CHANGE_PLATE.supplementDigitTargetWidth),
    supplementHeTargetWidth: positiveNumber(changePlate?.supplementHeTargetWidth, DEFAULT_CHANGE_PLATE.supplementHeTargetWidth),
    supplementVehicleCharGap: positiveNumber(changePlate?.supplementVehicleCharGap, DEFAULT_CHANGE_PLATE.supplementVehicleCharGap),
    supplementLabelFontSize: positiveNumber(changePlate?.supplementLabelFontSize, DEFAULT_CHANGE_PLATE.supplementLabelFontSize),
    supplementLabelBaselineY: positiveNumber(changePlate?.supplementLabelBaselineY, DEFAULT_CHANGE_PLATE.supplementLabelBaselineY),
    highSupplementHeight: positiveNumber(changePlate?.highSupplementHeight, DEFAULT_CHANGE_PLATE.highSupplementHeight),
    highSupplementSealCenterY: positiveNumber(changePlate?.highSupplementSealCenterY, DEFAULT_CHANGE_PLATE.highSupplementSealCenterY),
    highSupplementVehicleTopY: positiveNumber(changePlate?.highSupplementVehicleTopY, DEFAULT_CHANGE_PLATE.highSupplementVehicleTopY),
    highSupplementVehicleBaselineY: positiveNumber(changePlate?.highSupplementVehicleBaselineY, DEFAULT_CHANGE_PLATE.highSupplementVehicleBaselineY),
    highSupplementLabelBaselineY: positiveNumber(changePlate?.highSupplementLabelBaselineY, DEFAULT_CHANGE_PLATE.highSupplementLabelBaselineY),
    commonText: normalizeText(changePlate?.commonText || DEFAULT_CHANGE_PLATE.commonText),
    vehicleText: normalizeVehicleText(changePlate?.vehicleText || DEFAULT_CHANGE_PLATE.vehicleText)
  };
}

export function attachChangePlateOneLineModel(model, { input, changePlate = resolveChangePlateOptions(), rules }) {
  const split = splitChangePlateInput(input, changePlate);
  const supplementX = model.metrics.width + changePlate.supplementGap;
  const supplementWidth = changePlate.supplementWidth;
  const totalWidth = model.metrics.width + changePlate.supplementGap + supplementWidth;
  const changeContent = model.content.map((item) => item.type === "seals" ? { ...item, changePlateW: true, wHeight: changePlate.wHeight, wWidth: changePlate.wWidth } : item);
  const supplement = createChangePlateSupplementItems({
    x: supplementX,
    width: supplementWidth,
    height: rules.outerHeight,
    split,
    changePlate,
    rules
  });

  return {
    ...model,
    content: [...changeContent, ...supplement],
    metrics: {
      ...model.metrics,
      width: totalWidth,
      changePlateEnabled: true,
      changePlateCommonText: split.commonLabel,
      changePlateVehicleText: split.vehicleText,
      changePlateMainPlateWidth: model.metrics.width,
      changePlateSupplementX: supplementX,
      changePlateSupplementWidth: supplementWidth,
      changePlateSupplementGap: changePlate.supplementGap,
      changePlateWHeight: changePlate.wHeight,
      changePlateWWidth: changePlate.wWidth,
      plateFormatLabel: `${model.metrics.plateFormatLabel} · Wechselkennzeichen-Labmodell`,
      layoutMode: `${model.metrics.layoutMode} · Wechselkennzeichen branch`,
      layoutPolicy: `${model.metrics.layoutPolicy}; Wechselkennzeichen branch keeps the b237 one-line solver and attaches the vehicle-specific Wechselteil separately`,
      modelNote: `${model.metrics.modelNote} Wechselkennzeichen: b237 one-line model is used as base; W replaces the HU marker in the main seal column; vehicle-specific part is rendered from the separate Lab input in a separate frame.`
    }
  };
}


export function attachChangePlateHighFormatModel(model, { input, changePlate = resolveChangePlateOptions(), rules }) {
  const split = splitChangePlateInput(input, changePlate);
  const supplementX = model.metrics.width + changePlate.supplementGap;
  const supplementWidth = changePlate.supplementWidth;
  const supplementHeight = positiveNumber(changePlate.highSupplementHeight, rules.outerHeight);
  const totalWidth = model.metrics.width + changePlate.supplementGap + supplementWidth;
  const totalHeight = Math.max(model.metrics.height, supplementHeight);
  const isMotorcycle = rules.formatKey === "motorcycle";
  const changeContent = model.content.map((item) => item.type === "seals" ? { ...item, changePlateW: true, changePlateSwapWAndAuthority: isMotorcycle, wHeight: changePlate.wHeight, wWidth: changePlate.wWidth } : item);
  const supplement = createChangePlateSupplementItems({
    x: supplementX,
    width: supplementWidth,
    height: supplementHeight,
    split,
    changePlate: {
      ...changePlate,
      supplementSealCenterY: changePlate.highSupplementSealCenterY,
      supplementVehicleTopY: changePlate.highSupplementVehicleTopY,
      supplementVehicleBaselineY: changePlate.highSupplementVehicleBaselineY,
      supplementLabelBaselineY: changePlate.highSupplementLabelBaselineY
    },
    rules
  });

  return {
    ...model,
    content: [...changeContent, ...supplement],
    metrics: {
      ...model.metrics,
      width: totalWidth,
      height: totalHeight,
      changePlateEnabled: true,
      changePlateVariant: "high-format",
      changePlateCommonText: split.commonLabel,
      changePlateVehicleText: split.vehicleText,
      changePlateMainPlateWidth: model.metrics.width,
      changePlateSupplementX: supplementX,
      changePlateSupplementWidth: supplementWidth,
      changePlateSupplementHeight: supplementHeight,
      changePlateSupplementGap: changePlate.supplementGap,
      changePlateWHeight: changePlate.wHeight,
      changePlateWWidth: changePlate.wWidth,
      plateFormatLabel: `${model.metrics.plateFormatLabel} · Wechselkennzeichen-Labmodell`,
      layoutMode: `${model.metrics.layoutMode} · Wechselkennzeichen high-format branch`,
      layoutPolicy: `${model.metrics.layoutPolicy}; Wechselkennzeichen high-format branch keeps the confirmed two-line/motorcycle solver and attaches the 60 x 200 mm vehicle-specific Wechselteil separately`,
      modelNote: `${model.metrics.modelNote} Wechselkennzeichen: confirmed two-line/motorcycle model is used as base; W replaces the HU marker in the main seal position; vehicle-specific part is rendered from the separate Lab input in a separate 60 x 200 mm frame.`
    }
  };
}

export function splitChangePlateInput(input, changePlate = {}) {
  const explicitCommon = normalizeText(changePlate.commonText);
  const explicitVehicle = normalizeVehicleText(changePlate.vehicleText);
  if (explicitCommon || explicitVehicle) {
    const commonInput = explicitCommon || input;
    const parsed = parsePlate(commonInput);
    const vehicleText = explicitVehicle || "1";
    return {
      parsed,
      commonRecognition: parsed.recognition || "",
      vehicleText,
      commonLabel: parsed.normalized || normalizeText(commonInput) || "—"
    };
  }

  // Backward-compatible fallback for existing smoke tests and direct API calls:
  // if no split Lab fields are supplied, derive the vehicle-specific part from
  // the tail of the one-line input. The Lab UI no longer relies on this path.
  const parsed = parsePlate(input);
  const recognition = parsed.recognition || "";
  const match = recognition.match(/^(.*?)([0-9](?:[HE])?)$/);
  const commonRecognition = match ? match[1] : recognition.slice(0, -1);
  const vehicleText = match ? match[2] : recognition.slice(-1) || "1";
  const commonLabel = [parsed.district, formatRecognitionForLabel(commonRecognition)].filter(Boolean).join(" ").trim();
  return {
    parsed,
    commonRecognition,
    vehicleText,
    commonLabel: commonLabel || parsed.normalized || "—"
  };
}

function formatRecognitionForLabel(recognition) {
  return splitRecognition(recognition).map((part) => part.value).join(" ");
}


function normalizeText(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toUpperCase();
}

function normalizeVehicleText(value) {
  return String(value || "").trim().replace(/\s+/g, "").toUpperCase();
}
