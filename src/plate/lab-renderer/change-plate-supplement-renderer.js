// Kennzeichen Physical Lab b305 / Wechselkennzeichen supplement renderer
// Owns the separate vehicle-specific Wechselteil only. Main plate seal/W
// decisions stay in the already solved base model; this module renders and
// builds only the attached supplementary plate frame, HU marker, vehicle mark
// and small common-label line.

import { positiveNumber } from "./plate-number-utils.js";
import { getFirstItemOfType, getItemsOfType, sumValues } from "./plate-sequence-width-utils.js";
import { escapeSvgTextOrEmpty as escapeText } from "./svg-escape-utils.js";


const DEFAULT_CHANGE_PLATE = Object.freeze({
  supplementSealCenterY: 26.5,
  supplementVehicleTopY: 55,
  supplementVehicleTargetHeight: 34,
  supplementVehicleBaselineY: 88,
  supplementDigitTargetWidth: 18.5,
  supplementHeTargetWidth: 14,
  supplementVehicleCharGap: 1.5,
  supplementLabelFontSize: 6,
  supplementLabelBaselineY: 100
});

export function renderChangePlateSupplement({ content, metrics, rules }) {
  if (!metrics?.changePlateEnabled) return "";
  const items = content.filter((item) => String(item.type || "").startsWith("change-plate-"));
  if (!items.length) return "";
  const frame = getFirstItemOfType(items, "change-plate-frame");
  const seal = getFirstItemOfType(items, "change-plate-hu");
  const vehicleChars = getItemsOfType(items, "change-plate-vehicle-char");
  const label = getFirstItemOfType(items, "change-plate-common-label");
  return `
<g class="layer layer-change-plate" data-change-plate="true">
  ${frame ? `<rect x="${frame.x}" y="${frame.y}" width="${frame.width}" height="${frame.height}" rx="${rules.outerCornerRadius}" fill="#111"/>
  <rect x="${frame.x + rules.innerInset}" y="${frame.y + rules.innerInset}" width="${frame.width - rules.innerInset * 2}" height="${frame.height - rules.innerInset * 2}" rx="${rules.innerCornerRadius}" fill="#f4f3ee"/>` : ""}
  ${seal ? `<g class="change-plate-supplement-hu"><circle cx="${seal.cx}" cy="${seal.cy}" r="${seal.diameter / 2}" fill="#1ea5ff" stroke="#111" stroke-width="1.1"/><circle cx="${seal.cx}" cy="${seal.cy}" r="${seal.diameter * 0.34}" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="0.7" stroke-dasharray="1.2 1.6"/><text x="${seal.cx}" y="${seal.cy + 2.8}" text-anchor="middle" font-family="Arial, sans-serif" font-size="6.8" font-weight="700" fill="#111">HU</text></g>` : ""}
  ${vehicleChars.map((char) => `<text x="${char.x}" y="${char.baselineY}" text-anchor="middle" font-family="'${char.fontFamily}', Arial Narrow, sans-serif" font-size="${char.fontSize}" textLength="${char.targetWidth}" lengthAdjust="spacingAndGlyphs" font-weight="400" fill="${metrics.textColor || '#080808'}">${escapeText(char.text)}</text>`).join("\n  ")}
  ${label ? `<text x="${label.x}" y="${label.baselineY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${label.fontSize}" font-weight="400" fill="#111">${escapeText(label.text)}</text>` : ""}
</g>`.trim();
}

export function createChangePlateSupplementItems({ x, width, height, split, changePlate, rules }) {
  const centerX = x + width / 2;
  const huDiameter = positiveNumber(changePlate.supplementSealDiameter, rules.content.seal.huDiameter);
  const huCenterY = positiveNumber(changePlate.supplementSealCenterY, DEFAULT_CHANGE_PLATE.supplementSealCenterY);
  const vehicleChars = createVehicleSpecificCharItems({
    text: split.vehicleText,
    centerX,
    baselineY: changePlate.supplementVehicleBaselineY,
    fontSize: changePlate.supplementVehicleFontSize,
    topY: changePlate.supplementVehicleTopY,
    targetHeight: changePlate.supplementVehicleTargetHeight,
    digitTargetWidth: changePlate.supplementDigitTargetWidth,
    heTargetWidth: changePlate.supplementHeTargetWidth,
    gap: changePlate.supplementVehicleCharGap
  });
  return [
    { type: "change-plate-frame", key: "change-plate-frame", x, y: 0, width, height },
    { type: "change-plate-hu", key: "change-plate-hu", cx: centerX, cy: huCenterY, diameter: huDiameter },
    ...vehicleChars,
    { type: "change-plate-common-label", key: "change-plate-common-label", text: split.commonLabel, x: centerX, baselineY: changePlate.supplementLabelBaselineY, fontSize: changePlate.supplementLabelFontSize }
  ];
}

function createVehicleSpecificCharItems({ text, centerX, baselineY, fontSize, topY, targetHeight, digitTargetWidth, heTargetWidth, gap }) {
  const chars = [...String(text || "1").toUpperCase()];
  const widths = chars.map((char) => /[HE]/.test(char) ? heTargetWidth : digitTargetWidth);
  const totalWidth = sumValues(widths) + Math.max(0, chars.length - 1) * gap;
  let cursor = centerX - totalWidth / 2;
  return chars.map((char, index) => {
    const targetWidth = widths[index];
    const item = {
      type: "change-plate-vehicle-char",
      key: `change-plate-vehicle-char-${index}-${char}`,
      text: char,
      x: cursor + targetWidth / 2,
      baselineY,
      fontFamily: "GL-Nummernschild-Mtl",
      fontSize,
      topY,
      targetHeight,
      targetWidth
    };
    cursor += targetWidth + gap;
    return item;
  });
}

