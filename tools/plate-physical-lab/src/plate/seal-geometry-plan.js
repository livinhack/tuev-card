// Kennzeichen Physical Lab b303 / seal geometry plan helpers
// Resolves physical seal slot geometry and Wechselkennzeichen-effective
// W/authority placement. Marker drawing stays in seal-slot-marker.js.

import { getChangePlateSealSlotPlan } from "./change-plate-slot-plan.js";
import { numberOrFallback, positiveNumber } from "./plate-number-utils.js";

function numberOrNull(value) {
  return numberOrFallback(value, null);
}

function getFallbackCharacterBand(rules, rowKey = "top") {
  if (rules?.layoutType === "two-line") {
    const row = rowKey === "bottom" ? rules.content?.bottomRow : rules.content?.topRow;
    return {
      y: numberOrNull(row?.y) ?? 0,
      height: numberOrNull(row?.characterHeight) ?? 45,
      baselineY: numberOrNull(row?.baselineY)
    };
  }
  return {
    y: (numberOrNull(rules?.innerInset) ?? 0) + (numberOrNull(rules?.content?.topClearance) ?? 0),
    height: numberOrNull(rules?.content?.characterHeight) ?? 75,
    baselineY: numberOrNull(rules?.cells?.middle?.baselineY)
  };
}

function getBandForSealItem(rules, sealItem) {
  if (Number.isFinite(Number(sealItem?.bandY)) && Number.isFinite(Number(sealItem?.bandHeight))) {
    return {
      y: Number(sealItem.bandY),
      height: Number(sealItem.bandHeight),
      baselineY: numberOrNull(sealItem.baselineY)
    };
  }
  return getFallbackCharacterBand(rules, sealItem?.rowKey);
}
function createSealColumnBounds(innerX, innerWidth, outerX = innerX, outerWidth = innerWidth) {
  return {
    innerColumnLeft: innerX,
    innerColumnRight: innerX + innerWidth,
    innerColumnWidth: innerWidth,
    outerColumnLeft: outerX,
    outerColumnRight: outerX + outerWidth,
    outerColumnWidth: outerWidth
  };
}

function createSealCircleGeometry(cx, cy, diameter, radius) {
  return { cx, cy, diameter, radius };
}

export function getSealGeometry(rules, sealItem) {
  const charBand = getBandForSealItem(rules, sealItem);
  const sealRules = rules.content.seal;
  const arrangement = sealItem?.arrangement || sealRules.arrangement;
  const huRadius = sealRules.huDiameter / 2;
  const authorityRadius = sealRules.authorityDiameter / 2;

  if (arrangement === "reduced-standard-upper-row") {
    const sealKind = sealItem?.sealKind || "pair";
    const cy = sealRules.huCenterY;
    if (sealKind === "authority") {
      const innerWidth = sealRules.authorityDiameter;
      const authorityCx = sealItem.x + authorityRadius;
      return {
        cx: authorityCx,
        ...createSealColumnBounds(sealItem.x, innerWidth),
        arrangement,
        sealKind,
        hu: createSealCircleGeometry(authorityCx, cy, sealRules.huDiameter, huRadius),
        authority: createSealCircleGeometry(authorityCx, cy, sealRules.authorityDiameter, authorityRadius),
        visibleCircleGap: null,
        authorityOfficialDiameter: innerWidth,
        visualBorrowLeft: 0,
        huVisualShiftLeft: 0,
        charBand
      };
    }
    if (sealKind === "hu") {
      const innerWidth = sealRules.huDiameter;
      const huCx = sealItem.x + huRadius;
      return {
        cx: huCx,
        ...createSealColumnBounds(sealItem.x, innerWidth),
        arrangement,
        sealKind,
        hu: createSealCircleGeometry(huCx, cy, sealRules.huDiameter, huRadius),
        authority: createSealCircleGeometry(huCx, cy, sealRules.authorityDiameter, authorityRadius),
        visibleCircleGap: null,
        authorityOfficialDiameter: 0,
        visualBorrowLeft: 0,
        huVisualShiftLeft: 0,
        charBand
      };
    }
    const officialAuthorityWidth = sealRules.authorityDiameter;
    const officialHuWidth = sealRules.huDiameter;
    const authorityCx = sealItem.x + authorityRadius;
    const huCx = sealItem.x + officialAuthorityWidth + huRadius;
    const innerWidth = officialAuthorityWidth + officialHuWidth;
    return {
      cx: (authorityCx + huCx) / 2,
      ...createSealColumnBounds(sealItem.x, innerWidth),
      arrangement,
      sealKind,
      hu: createSealCircleGeometry(huCx, cy, sealRules.huDiameter, huRadius),
      authority: createSealCircleGeometry(authorityCx, cy, sealRules.authorityDiameter, authorityRadius),
      visibleCircleGap: 0,
      authorityOfficialDiameter: officialAuthorityWidth,
      visualBorrowLeft: 0,
      huVisualShiftLeft: 0,
      charBand
    };
  }

  if (arrangement === "reduced-standard-vertical") {
    const cx = sealItem.x + (Number(sealItem.width) || sealRules.columnWidth) / 2;
    const innerWidth = Number(sealItem.width) || sealRules.columnWidth;
    return {
      cx,
      ...createSealColumnBounds(sealItem.x, innerWidth),
      arrangement,
      hu: createSealCircleGeometry(cx, sealRules.huCenterY, sealRules.huDiameter, huRadius),
      authority: createSealCircleGeometry(cx, sealRules.authorityCenterY, sealRules.authorityDiameter, authorityRadius),
      visibleCircleGap: sealItem?.visibleCircleGap ?? sealRules.visibleCircleGap,
      charBand
    };
  }

  if (sealRules.arrangement === "motorcycle-horizontal") {
    const pairGap = positiveNumber(sealItem?.visibleCircleGap, positiveNumber(sealRules.visibleCircleGap, 6));
    const huCx = sealItem.x + huRadius;
    const authorityCx = sealItem.x + sealRules.huDiameter + pairGap + authorityRadius;
    const cy = sealRules.centerY;
    return {
      cx: (huCx + authorityCx) / 2,
      ...createSealColumnBounds(sealItem.x, sealItem.width),
      arrangement: sealRules.arrangement,
      hu: createSealCircleGeometry(huCx, cy, sealRules.huDiameter, huRadius),
      authority: createSealCircleGeometry(authorityCx, cy, sealRules.authorityDiameter, authorityRadius),
      visibleCircleGap: pairGap,
      charBand
    };
  }

  const innerWidth = Number(sealItem.width) || sealRules.columnWidth;
  const outerWidth = Math.max(innerWidth, Math.min(sealRules.columnMaxWidth, innerWidth + (sealRules.columnMaxWidth - sealRules.columnMinWidth)));
  const outerX = sealItem.x - (outerWidth - innerWidth) / 2;
  const cx = sealItem.x + innerWidth / 2;
  return {
    cx,
    ...createSealColumnBounds(sealItem.x, innerWidth, outerX, outerWidth),
    hu: createSealCircleGeometry(cx, sealRules.huCenterY, sealRules.huDiameter, huRadius),
    authority: createSealCircleGeometry(cx, sealRules.authorityCenterY, sealRules.authorityDiameter, authorityRadius),
    visibleCircleGap: sealRules.visibleCircleGap,
    charBand
  };
}

export function getEffectiveSealGeometry(rules, seal) {
  const geometry = getSealGeometry(rules, seal);
  const swapped = getChangePlateSealSlotPlan(rules, seal, geometry);
  if (!swapped) return geometry;
  return {
    ...geometry,
    cx: ((swapped.w?.cx ?? geometry.hu.cx ?? geometry.cx) + (swapped.authority?.cx ?? geometry.authority.cx ?? geometry.cx)) / 2,
    hu: swapped.w || geometry.hu,
    authority: swapped.authority || geometry.authority,
    changePlateEffectiveSealGeometry: true
  };
}
