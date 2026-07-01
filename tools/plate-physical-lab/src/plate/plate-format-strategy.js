// Kennzeichen Physical Lab b228 / plate format strategy helpers
// Pure helper module for common renderer branch flags. It does not define
// dimensions and must not calculate physical positions.

export function createPlateFormatStrategy(rules = {}) {
  const formatKey = rules.formatKey || (rules.layoutType === "two-line" ? "twoLine" : "oneLine");
  const layoutType = rules.layoutType || "one-line";
  const isTwoLineLike = layoutType === "two-line";
  const isOneLine = !isTwoLineLike;
  const isReducedTwoLine = formatKey === "reducedTwoLine";
  const isMotorcycle = formatKey === "motorcycle";
  const isTwoLineStandard = isTwoLineLike && !isReducedTwoLine && !isMotorcycle;

  return Object.freeze({
    formatKey,
    layoutType,
    isOneLine,
    isTwoLineLike,
    isTwoLineStandard,
    isReducedTwoLine,
    isMotorcycle,
    modelPlateFormat: isOneLine ? "oneLine" : formatKey
  });
}

export function isTwoLineLayout(rules = {}) {
  return createPlateFormatStrategy(rules).isTwoLineLike;
}

export function isReducedTwoLineFormat(rules = {}) {
  return createPlateFormatStrategy(rules).isReducedTwoLine;
}

export function isMotorcycleFormat(rules = {}) {
  return createPlateFormatStrategy(rules).isMotorcycle;
}

export function getModelPlateFormat(rules = {}) {
  return createPlateFormatStrategy(rules).modelPlateFormat;
}
