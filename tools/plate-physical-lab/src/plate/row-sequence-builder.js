// Kennzeichen Physical Lab b226 row/sequence builders.
// This module centralises reusable row-chain sequence construction. It must not
// solve geometry; solvers/renderers consume the sequences built here.

import {
  hasHistoricalOrElectricSuffix,
  makeCells,
  splitRecognition
} from "./text-utils.js";
import {
  REDUCED_TWO_LINE_RULES_MM,
  SPACING_RULES_MM,
  TWO_LINE_RULES_MM
} from "./plate-variant-rules.js";

export function variableItem(type, key, range) {
  return {
    type,
    key,
    variable: true,
    minWidth: range.min,
    preferredWidth: range.preferred,
    maxWidth: range.max,
    width: range.preferred,
    ruleLabel: range.ruleLabel || null
  };
}

export function appendCells(sequence, cells) {
  cells.forEach((cell, index) => {
    if (index > 0) sequence.push(variableItem("char-gap", `${cell.role}-gap-${index}`, SPACING_RULES_MM.charGap));
    sequence.push(cell);
  });
}

export function makeReducedCellSequence(cells, rowKey, charGapRule = SPACING_RULES_MM.charGap) {
  const sequence = [];
  cells.forEach((cell, index) => {
    if (index > 0) {
      sequence.push({
        type: "char-gap",
        key: `reduced-${rowKey}-char-gap-${index}`,
        variable: true,
        minWidth: charGapRule.min,
        preferredWidth: charGapRule.preferred,
        maxWidth: charGapRule.max,
        ruleLabel: "Reduced character gap **: 8-10 mm"
      });
    }
    sequence.push(cell);
  });
  return sequence;
}

export function buildReducedTopSequence(parsed, font) {
  return makeReducedCellSequence(makeCells(parsed?.district || "", font, "district"), "top");
}

export function buildReducedRecognitionSequence(parsed, font, season = { enabled: false }, rules = REDUCED_TWO_LINE_RULES_MM, limits = null) {
  const bottomGroups = splitRecognition(parsed?.recognition || "");
  const sequence = [];
  bottomGroups.forEach((group, index) => {
    if (index > 0) sequence.push(variableItem("group-gap", `reduced-bottom-recognition-group-gap-${index}`, getReducedRecognitionGroupGapRange(parsed)));
    appendCells(sequence, makeCells(group.value, font, group.type));
  });
  if (season?.enabled) {
    sequence.push(makeReducedSeasonGapItem("reduced-bottom-season-gap", "bottom", limits));
    sequence.push(makeReducedSeasonFieldItem(rules, season, "bottom", limits));
  }
  return sequence;
}

export function withReducedSeal(sequence, rules, rowKey, limits, arrangement = null, visibleCircleGap = null, context = {}) {
  if (arrangement === "reduced-standard-upper-row") {
    return [
      ...sequence,
      makeReducedSealGapItem(
        "reduced-top-text-to-authority-gap",
        rowKey,
        limits,
        getReducedTopSealGapRange(context.parsed, context.season)
      ),
      makeReducedSealItem(rules, 0, rules.content.seal.authorityDiameter, rowKey, limits, arrangement, visibleCircleGap, "authority"),
      makeReducedSealGapItem(
        "reduced-top-authority-to-hu-gap",
        rowKey,
        limits,
        getReducedUpperSealPairGapRange(context.parsed, context.season)
      ),
      makeReducedSealItem(rules, 0, rules.content.seal.huDiameter, rowKey, limits, arrangement, visibleCircleGap, "hu")
    ];
  }
  return [
    ...sequence,
    makeReducedSealGapItem(
      `reduced-${rowKey}-seal-gap`,
      rowKey,
      limits,
      rowKey === "bottom" ? SPACING_RULES_MM.reducedBottomSealGap : SPACING_RULES_MM.reducedTopSealGap
    ),
    makeReducedSealItem(rules, 0, rules.content.seal.columnWidth, rowKey, limits, arrangement, visibleCircleGap)
  ];
}

export function buildTwoLineTopSequence(parsed, rules, font, season = { enabled: false }) {
  const sequence = [];
  const districtCells = makeCells(parsed.district, font, "district");
  appendCells(sequence, districtCells);
  if (rules.formatKey !== "motorcycle") {
    if (districtCells.length) {
      sequence.push(variableItem("seal-gap", "top-seal-gap", rules.formatKey === "reducedTwoLine" ? SPACING_RULES_MM.reducedTopSealGap : SPACING_RULES_MM.twoLineTopSealGap));
    }
    sequence.push(variableItem("seals", "top-seal-zone", {
      min: rules.content.seal.columnMinWidth,
      preferred: rules.content.seal.columnWidth,
      max: rules.content.seal.columnMaxWidth,
      ruleLabel: rules.content.seal.ruleLabel
    }));
  }
  if (season.enabled && rules.formatKey !== "motorcycle" && rules.formatKey !== "reducedTwoLine") {
    sequence.push(variableItem("season-gap", "top-season-gap", SPACING_RULES_MM.twoLineSeasonGap));
    sequence.push({
      type: "season-field",
      key: "season-validity-field",
      width: rules.content.season.fieldWidth,
      season
    });
  }
  return sequence;
}

export function buildTwoLineBottomSequence(parsed, rules, font) {
  const sequence = [];
  const recognitionGroups = splitRecognition(parsed.recognition);
  recognitionGroups.forEach((group, groupIndex) => {
    if (groupIndex > 0) {
      sequence.push(variableItem("group-gap", `bottom-recognition-group-gap-${groupIndex}`, getTwoLineBottomGroupGapRange(parsed, rules)));
    }
    appendCells(sequence, makeCells(group.value, font, group.type));
  });
  return sequence;
}

export function isReducedUpperSealMandatory(parsed, season = { enabled: false }) {
  return Boolean(season?.enabled) || hasHistoricalOrElectricSuffix(parsed);
}

export function canReducedStandardUseUpperSealFallback(lowerVisibleCharCount) {
  return Number(lowerVisibleCharCount) >= 5;
}

export function getReducedVisibleSlotCount(parsed, season = null) {
  const districtCount = String(parsed?.district || "").replace(/\s+/g, "").length;
  const recognitionCount = String(parsed?.recognition || "").replace(/\s+/g, "").length;
  const seasonBlockCount = season?.enabled ? 1 : 0;
  return districtCount + recognitionCount + seasonBlockCount;
}

export function isReducedNineSlotSeasonTightCase(parsed, season = null) {
  return Boolean(season?.enabled) && getReducedVisibleSlotCount(parsed, season) >= 9;
}

export function hasReducedLetterI(parsed) {
  return /I/.test(`${parsed?.district || ""}${parsed?.recognition || ""}`.toUpperCase());
}

export function hasReducedFullWidthThreeLetterDistrict(parsed) {
  const district = String(parsed?.district || "").replace(/\s+/g, "").toUpperCase();
  return district.length >= 3 && !district.includes("I");
}

export function isReducedEightSlotUpperSealCase(parsed, season = null) {
  return isReducedUpperSealMandatory(parsed, season)
    && hasReducedFullWidthThreeLetterDistrict(parsed)
    && getReducedVisibleSlotCount(parsed, season) >= 8;
}

export function isReducedNoITightUpperSealCase(parsed, season = null) {
  return isReducedEightSlotUpperSealCase(parsed, season);
}

export function getReducedTopSealGapRange(parsed, season) {
  if (isReducedNineSlotSeasonTightCase(parsed, season)) {
    return {
      ...SPACING_RULES_MM.reducedTopSealGap,
      preferred: 5,
      ruleLabel: "Reduced two-line b209 9-slot season tight top row: text→authority may use the 5-mm minimum in the legal *** corridor"
    };
  }
  if (isReducedEightSlotUpperSealCase(parsed, season)) {
    return {
      ...SPACING_RULES_MM.reducedTopSealGap,
      min: 3,
      preferred: 3,
      ruleLabel: "Reduced two-line b209 8-slot H/E/Saison top row: E/H suffix and season count as visible slots; text→authority may fall to 3 mm so the HU field can keep the required 8-mm right edge"
    };
  }
  return SPACING_RULES_MM.reducedTopSealGap;
}

export function getReducedUpperSealPairGapRange(parsed, season) {
  if (isReducedNineSlotSeasonTightCase(parsed, season)) {
    return {
      min: 4,
      preferred: 4,
      max: 20,
      ruleLabel: "Reduced two-line b209 9-slot season tight top row: authority→HU may fall to 4 mm so the template chain becomes 8/8/8/5/4/6; I-width cases relax automatically"
    };
  }
  if (isReducedEightSlotUpperSealCase(parsed, season)) {
    return {
      min: 4,
      preferred: 4,
      max: 20,
      ruleLabel: "Reduced two-line b209 8-slot H/E/Saison top row: authority→HU may use 4 mm while the right side remains at least 8 mm; I in the lower row is still counted as a visible slot"
    };
  }
  return SPACING_RULES_MM.reducedUpperSealPairGap;
}

export function getReducedRecognitionGroupGapRange(parsed) {
  if (hasHistoricalOrElectricSuffix(parsed)) {
    return {
      ...SPACING_RULES_MM.reducedRecognitionGroupGap,
      ruleLabel: "Reduced two-line b209 H/E bottom row: group gap from digit to H/E suffix remains 15-18 mm; no reduced narrow script is calculated"
    };
  }
  return SPACING_RULES_MM.reducedRecognitionGroupGap;
}

export function getTwoLineBottomGroupGapRange(parsed, rules = TWO_LINE_RULES_MM) {
  if (rules.formatKey === "motorcycle") {
    if (hasHistoricalOrElectricSuffix(parsed)) {
      return {
        ...SPACING_RULES_MM.motorcycleRecognitionGroupGapHistoricalOrElectric,
        ruleLabel: "Kraftradkennzeichen bottom row with final H/E suffix: recognition group gap 14-18 mm"
      };
    }
    return {
      ...SPACING_RULES_MM.motorcycleRecognitionGroupGap,
      ruleLabel: "Kraftradkennzeichen bottom row normal: recognition group gap 15-18 mm"
    };
  }
  if (rules.formatKey === "reducedTwoLine") {
    return {
      ...SPACING_RULES_MM.reducedRecognitionGroupGap,
      ruleLabel: "Reduced two-line b209 standard bottom row: recognition group gap 15-18 mm, expanded inside range before equal outside margins grow"
    };
  }
  if (hasHistoricalOrElectricSuffix(parsed)) {
    return {
      ...SPACING_RULES_MM.twoLineBottomGroupGapHistoricalOrElectric,
      ruleLabel: "Two-line bottom row with final H/E suffix: group gaps 20-30 mm across the complete row"
    };
  }
  return {
    ...SPACING_RULES_MM.twoLineBottomGroupGap,
    ruleLabel: "Two-line bottom row normal: group gaps 24-30 mm"
  };
}

function makeReducedSeasonGapItem(key, rowKey, limits) {
  return {
    type: "season-gap",
    key,
    variable: true,
    minWidth: SPACING_RULES_MM.reducedSeasonGap.min,
    preferredWidth: SPACING_RULES_MM.reducedSeasonGap.preferred,
    maxWidth: SPACING_RULES_MM.reducedSeasonGap.max,
    width: SPACING_RULES_MM.reducedSeasonGap.min,
    x: 0,
    rowKey,
    bandY: null,
    bandHeight: null,
    baselineY: null,
    contentLimits: limits,
    ruleLabel: SPACING_RULES_MM.reducedSeasonGap.ruleLabel
  };
}

function makeReducedSeasonFieldItem(rules, season, rowKey, limits) {
  return {
    type: "season-field",
    key: "reduced-season-validity-field",
    rowKey,
    x: 0,
    width: rules.content.season.fieldWidth,
    season,
    bandY: rules.content.bottomRow.y,
    bandHeight: rules.content.bottomRow.characterHeight,
    baselineY: null,
    contentLimits: limits,
    ruleLabel: rules.content.season.ruleLabel
  };
}

function makeReducedSealGapItem(key, rowKey, limits, rule = SPACING_RULES_MM.reducedTopSealGap) {
  return {
    type: "seal-gap",
    key,
    variable: true,
    minWidth: rule.min,
    preferredWidth: rule.preferred,
    maxWidth: rule.max,
    width: rule.min,
    x: 0,
    rowKey,
    bandY: null,
    bandHeight: null,
    baselineY: null,
    contentLimits: limits,
    ruleLabel: `${rule.ruleLabel}; b209 keeps this as a real row-chain gap so text and seals cannot overlap.`
  };
}

function makeReducedSealItem(rules, x, width, rowKey, limits, arrangement = null, visibleCircleGap = null, sealKind = null) {
  const row = rowKey === "bottom" ? rules.content.bottomRow : rules.content.topRow;
  const activeArrangement = arrangement || rules.content.seal.arrangement;
  const keySuffix = sealKind ? `-${sealKind}` : "";
  return {
    type: "seals",
    key: activeArrangement === "reduced-standard-upper-row" ? `reduced-${rowKey}-upper-seal-row${keySuffix}` : `reduced-${rowKey}-seal-zone`,
    rowKey,
    x,
    width,
    arrangement: activeArrangement,
    sealKind,
    visibleCircleGap: visibleCircleGap ?? rules.content.seal.visibleCircleGap,
    bandY: row.y,
    bandHeight: row.characterHeight,
    baselineY: null,
    contentLimits: limits,
    ruleLabel: activeArrangement === "reduced-standard-upper-row"
      ? "Reduced two-line b209 upper-side-by-side seal row: authority seal 45 mm and HU seal 35 mm are separate row-chain fields; the seal-to-seal gap is solved dynamically with the text-to-seal gap and equal outside margins. H/E and season use upper side-by-side seals are mandatory; b209 counts E/H and season in 8-slot edge guards."
      : rules.content.seal.ruleLabel
  };
}
