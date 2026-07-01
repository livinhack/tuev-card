// Kennzeichen Physical Lab b309 / renderer implementation/orchestrator
// CAD-like model layer: every coordinate, size and distance in this file is millimetres.
// No CSS pixels, devicePixelRatio, browser zoom or monitor calibration are used here.
// Shared CAD-like plate model used by the Physical Lab. b236 keeps the
// confirmed geometry unchanged and uses a common row layout adapter for positioning.
// Reduced middle script only: 49-mm height, 31-mm letters, 29-mm digits.


import {
  getCharacterBand,
  hasHistoricalOrElectricSuffix,
  makeCells,
  parsePlate,
  splitRecognition,
  withSpecialIWidth
} from "./text-utils.js";
export { getCharacterBand, parsePlate } from "./text-utils.js";
import { resolveEuroFieldComponentGeometry } from "./euro-field.js";
import { getSealGeometry } from "./seal-geometry-plan.js";
import { getSeasonFieldLayout, normalizeSeasonMonth } from "./season-field.js";
import { resolveSeasonForVisualStyle, resolveVisualStyle } from "./plate-visual-style.js";
import { resolveRulesForSeason, resolveSeasonOptions } from "./plate-season-options.js";
import { createFontResolutionResult, createOneLineRenderFont, createTwoLineRenderFont, resolveChangePlateBaseInput, resolveSpecialIWidth } from "./plate-render-context.js";
import { getTwoLineWidthBandsForFont, resolveTwoLineWidthCapMm, resolveTwoLineWidthRule, resolveWidthCapMm, resolveWidthStrategy } from "./plate-width-strategy.js";
import { clampNumber, formatNumber, numberOrFallback, positiveNumber } from "./plate-number-utils.js";
import { average, applySharedTypeWidth, countItemsOfType, getFirstItemOfType, getItemMaxWidth, getItemMinWidth, getItemPreferredWidth, getFixedTypeOrItemFiniteMaxWidth, getFixedTypeOrItemMaxWidth, getFixedTypeOrItemMinWidth, getFixedTypeOrItemPreferredWidth, createItemWidthMap, getItemsOfType, getItemWidthsByType, getVariableRangeLabel, growVariablesToFit, minVariableWidth, shrinkVariablesToFit, sumItemWidths, sumItemWidthsExcept, sumItemWidthsWhere, sumResolvedItemWidths, sumSequenceWidth, sumValues } from "./plate-sequence-width-utils.js";
import { createSpacingSurfaces, spacingSurfaceResult, waterFillSpacingSurfaces } from "./plate-spacing-surface-utils.js";
import { createHorizontalBounds, createLayoutResultBase } from "./plate-layout-result-utils.js";
import { attachChangePlateHighFormatModel, attachChangePlateOneLineModel, resolveChangePlateOptions, splitChangePlateInput } from "./change-plate.js";
import { createReducedRowChainSolver } from "./reduced-row-chain-solver.js";
import { getCanvasMm, renderPlateSvgDocument } from "./plate-render-shell.js";
export { getCanvasMm } from "./plate-render-shell.js";
import { createPlateModel } from "./plate-layout-model.js";
import { positionRowItems, attachRowMetadata } from "./row-layout-adapter.js";
import { getModelPlateFormat, isMotorcycleFormat, isReducedTwoLineFormat, isTwoLineLayout } from "./plate-format-strategy.js";
import {
  appendCells,
  buildReducedRecognitionSequence,
  buildReducedTopSequence,
  buildTwoLineBottomSequence,
  buildTwoLineTopSequence,
  canReducedStandardUseUpperSealFallback,
  getReducedUpperSealPairGapRange,
  getReducedVisibleSlotCount,
  isReducedEightSlotUpperSealCase,
  isReducedNineSlotSeasonTightCase,
  isReducedNoITightUpperSealCase,
  isReducedUpperSealMandatory,
  variableItem,
  withReducedSeal
} from "./row-sequence-builder.js";

import {
  PLATE_TEXT_COLORS_MM,
  WIDTH_BANDS,
  TWO_LINE_WIDTH_BANDS,
  TWO_LINE_WIDTH_RULES,
  SPACING_RULES_MM,
  FONT_CALIBRATION_PROFILES_MM,
  DXF_REFERENCE_MM,
  ONE_LINE_RULES_MM,
  TWO_LINE_RULES_MM,
  MOTORCYCLE_RULES_MM,
  REDUCED_TWO_LINE_RULES_MM,
  resolvePlateRules
} from "./plate-variant-rules.js";
export {
  PLATE_TEXT_COLORS_MM,
  WIDTH_BANDS,
  TWO_LINE_WIDTH_BANDS,
  TWO_LINE_WIDTH_RULES,
  SPACING_RULES_MM,
  FONT_CALIBRATION_PROFILES_MM,
  DXF_REFERENCE_MM,
  ONE_LINE_RULES_MM,
  TWO_LINE_RULES_MM,
  MOTORCYCLE_RULES_MM,
  REDUCED_TWO_LINE_RULES_MM,
  resolvePlateRules
} from "./plate-variant-rules.js";


const {
  solveReducedRowChain,
  solveReducedRowChainPreferredInternalSpacing,
  solveReducedVerticalSharedSealRows,
  solveReducedTextChain,
  getReducedCriticalRowMinWidth
} = createReducedRowChainSolver({
  spacingRules: SPACING_RULES_MM,
  getOutsideMarginMinLeft,
  getOutsideMarginMinRight,
  average,
  positionSequence: positionReducedSequence
});

export function resolvePlateFontMode(input, options = {}) {
  const rules = resolvePlateRules(options.plateFormat);
  if (isTwoLineLayout(rules)) {
    return resolveTwoLinePlateFontMode(input, options, rules);
  }
  const requestedFontMode = options.fontMode === "auto" ? "auto" : options.fontMode === "narrow" ? "narrow" : "middle";
  const specialIWidth = resolveSpecialIWidth(rules.cells.middle, options);
  const middleFont = withSpecialIWidth(rules.cells.middle, specialIWidth);
  const narrowFont = withSpecialIWidth(rules.cells.narrow, specialIWidth);
  const season = resolveSeasonOptions(options.season, rules);
  const middleLayout = findPlateLayoutForFont(input, rules, middleFont, "middle", options.widthMode, season);
  const narrowLayout = findPlateLayoutForFont(input, rules, narrowFont, "narrow", options.widthMode, season);
  const widthCapMm = resolveWidthCapMm(options.widthMode, rules.maxWidth);

  if (requestedFontMode !== "auto") {
    const chosenLayout = requestedFontMode === "narrow" ? narrowLayout : middleLayout;
    return createFontResolutionResult({
      requestedFontMode,
      fontMode: requestedFontMode,
      reason: requestedFontMode === "narrow" ? "Narrow script manuell gewählt." : "Middle script manuell gewählt.",
      policy: "manual",
      widthCapMm,
      middleLayout,
      narrowLayout,
      chosenLayout,
      middleFitsWidthCap: middleLayout.fits,
      narrowFitsWidthCap: narrowLayout.fits
    });
  }

  if (middleLayout.fits) {
    return createFontResolutionResult({
      requestedFontMode,
      fontMode: "middle",
      reason: "Auto: Middle script passt mit den zulässigen Abständen und gleichen Außenrändern; Narrow script wird nicht verwendet.",
      policy: "middle-first; narrow only if middle cannot satisfy the layout solver",
      widthCapMm,
      middleLayout,
      narrowLayout,
      chosenLayout: middleLayout,
      middleFitsWidthCap: true,
      narrowFitsWidthCap: narrowLayout.fits
    });
  }

  return createFontResolutionResult({
    requestedFontMode,
    fontMode: "narrow",
    reason: narrowLayout.fits
      ? "Auto: Middle script passt nicht mit den zulässigen Abständen; Narrow script wird als Ausweichschrift gewählt."
      : "Auto: Middle script passt nicht mit den zulässigen Abständen; Narrow script wird gewählt, passt aber ebenfalls nicht vollständig in die aktuelle Breitenbegrenzung.",
    policy: "middle-first; narrow only if middle cannot satisfy the layout solver",
    widthCapMm,
    middleLayout,
    narrowLayout,
    chosenLayout: narrowLayout,
    middleFitsWidthCap: false,
    narrowFitsWidthCap: narrowLayout.fits
  });
}

export function buildPlateModelMm(input, options = {}) {
  const rules = resolvePlateRules(options.plateFormat);
  const changePlate = resolveChangePlateOptions(options.changePlate);
  if (isTwoLineLayout(rules)) {
    if (changePlate.enabled && rules.formatKey !== "reducedTwoLine") {
      return buildChangePlateHighFormatModelMm(input, options, rules);
    }
    return buildTwoLinePlateModelMm(input, options, rules);
  }
  if (changePlate.enabled) {
    return buildChangePlateOneLineModelMm(input, options, rules);
  }
  return buildStandardOneLinePlateModelMm(input, options, rules);
}

function buildStandardOneLinePlateModelMm(input, options = {}, rules = ONE_LINE_RULES_MM) {
  const visualStyle = resolveVisualStyle(options.visualStyle);
  const season = resolveSeasonOptions(resolveSeasonForVisualStyle(options.season, visualStyle), rules);
  const effectiveRules = resolveRulesForSeason(rules, season);
  const fontResolution = resolvePlateFontMode(input, {
    fontMode: options.fontMode,
    widthMode: options.widthMode,
    specialIWidth: options.specialIWidth,
    season
  });
  const fontMode = fontResolution.fontMode;
  const baseFont = effectiveRules.cells[fontMode];
  const font = createOneLineRenderFont(baseFont, options);
  const parsed = parsePlate(input);
  const layout = findPlateLayoutForFont(input, effectiveRules, font, fontMode, options.widthMode, season);
  const positioned = layout.positionedContent;
  const width = layout.width;
  const rawContentWidth = layout.contentWidth;
  const sealGeometry = getSealGeometryForContent(effectiveRules, positioned);
  const euroComponents = resolveEuroFieldComponentGeometry(effectiveRules.euro);
  const euroStarGeometry = euroComponents.starWreath;
  const euroCountryGeometry = euroComponents.countryMark;
  const metrics = {
    input,
    normalized: parsed.normalized,
    district: parsed.district,
    recognition: parsed.recognition,
    plateColorMode: visualStyle.key,
    plateColorLabel: visualStyle.label,
    textColor: visualStyle.color,
    frameColor: visualStyle.frameColor || (visualStyle.key === "green" ? visualStyle.color : "#111"),
    textColorNote: visualStyle.note,
    requestedFontMode: fontResolution.requestedFontMode,
    fontMode,
    fontLabel: font.label,
    fontFamily: font.fontFamily,
    plateFormat: "oneLine",
    plateFormatLabel: effectiveRules.name,
    autoFontModeReason: fontResolution.reason,
    autoFontModePolicy: fontResolution.policy,
    autoWidthCapMm: fontResolution.widthCapMm,
    middleNeededWidth: fontResolution.middleNeededWidth,
    narrowNeededWidth: fontResolution.narrowNeededWidth,
    middleFitsWidthCap: fontResolution.middleFitsWidthCap,
    narrowFitsWidthCap: fontResolution.narrowFitsWidthCap,
    cellLetterWidth: font.letterWidth,
    cellDigitWidth: font.digitWidth,
    specialIWidth: font.specialWidths?.I ?? null,
    specialIWidthPolicy: "gemeinsame GL-I-Breite für Mittel- und Narrow script; kalibriert, nicht amtlich einzeln belegt",
    cellGap: layout.actualCharGap,
    cellGapRange: `${SPACING_RULES_MM.charGap.min}-${SPACING_RULES_MM.charGap.max}`,
    groupGap: layout.actualGroupGap,
    groupGapRange: layout.groupGapRangeLabel || `${SPACING_RULES_MM.groupGap.min}-${SPACING_RULES_MM.groupGap.max}`,
    groupGapRule: layout.groupGapRule || null,
    layoutMode: layout.modeLabel,
    layoutPolicy: layout.policy,
    widthSelectionReason: layout.reason,
    minContentWidth: layout.minContentWidth,
    preferredContentWidth: layout.preferredContentWidth,
    maxContentWidth: layout.maxContentWidth,
    minNeededWidth: layout.minNeededWidth,
    preferredNeededWidth: layout.preferredNeededWidth,
    maxNeededWidth: layout.maxNeededWidth,
    preferredFits: layout.preferredFits,
    maxFits: layout.maxFits,
    outsideMarginMin: getOutsideMarginMin(rules),
    width,
    height: effectiveRules.outerHeight,
    rawContentWidth,
    dxfReference: effectiveRules.reference,
    outerCornerRadius: effectiveRules.outerCornerRadius,
    innerCornerRadius: effectiveRules.innerCornerRadius,
    innerInset: effectiveRules.innerInset,
    innerHeight: effectiveRules.innerHeight,
    euroX: effectiveRules.euro.x,
    euroY: effectiveRules.euro.y,
    euroWidth: effectiveRules.euro.width,
    euroHeight: effectiveRules.euro.height,
    euroInnerTopClearance: effectiveRules.euro.innerTopClearance ?? null,
    euroStarsBoxHeight: effectiveRules.euro.starsBoxHeight ?? null,
    euroStarsToCountryGap: effectiveRules.euro.starsToCountryGap ?? null,
    euroCountryBoxHeight: effectiveRules.euro.countryBoxHeight ?? null,
    euroInnerBottomClearance: effectiveRules.euro.innerBottomClearance ?? null,
    euroStarsCenterY: effectiveRules.euro.starsCenterY ?? null,
    euroStarDiameterThroughCenters: euroStarGeometry.diameterThroughCenters,
    euroStarSize: euroStarGeometry.starSize,
    euroCountryBaselineY: effectiveRules.euro.countryBaselineY ?? null,
    euroCountryCenterY: effectiveRules.euro.countryCenterY ?? null,
    euroCountryHeight: euroCountryGeometry.height,
    euroCountryFontSize: euroCountryGeometry.fontSize,
    characterBandY: getCharacterBand(effectiveRules).y,
    characterBandHeight: getCharacterBand(effectiveRules).height,
    characterFontSize: font.fontSize,
    characterBaselineY: font.baselineY,
    fontFitMode: options.fontFit?.mode || "manual",
    fontFitVisibleHeight: options.fontFit?.measured?.visibleHeight ?? null,
    fontFitTopY: options.fontFit?.measured?.topY ?? null,
    fontFitBottomY: options.fontFit?.measured?.bottomY ?? null,
    seasonEnabled: season.enabled,
    seasonStartMonth: season.from,
    seasonEndMonth: season.to,
    seasonGap: layout.actualSeasonGap ?? null,
    seasonGapRange: season.enabled ? `>=${formatNumber(SPACING_RULES_MM.oneLineSeasonGap.min)}` : null,
    seasonFieldWidth: season.enabled ? effectiveRules.content.season.fieldWidth : null,
    seasonFieldX: season.enabled ? getFirstItemOfType(positioned, "season-field")?.x ?? null : null,
    seasonFieldY: season.enabled ? getCharacterBand(effectiveRules).y : null,
    seasonFieldHeight: season.enabled ? getCharacterBand(effectiveRules).height : null,
    seasonUpperFieldY: season.enabled ? getCharacterBand(effectiveRules).y : null,
    seasonLowerFieldY: season.enabled ? getCharacterBand(effectiveRules).y + getCharacterBand(effectiveRules).height - effectiveRules.content.season.monthBoxHeight : null,
    seasonMonthBoxHeight: season.enabled ? effectiveRules.content.season.monthBoxHeight : null,
    seasonTargetDigitHeight: season.enabled ? effectiveRules.content.season.targetDigitHeight : null,
    seasonFontFamily: season.enabled ? effectiveRules.content.season.fontFamily : null,
    seasonFontSize: season.enabled ? effectiveRules.content.season.fontSize : null,
    seasonUpperBaselineY: season.enabled ? effectiveRules.content.season.upperBaselineY : null,
    seasonWidthScale: season.enabled ? effectiveRules.content.season.widthScale : null,
    seasonDigitGap: season.enabled ? effectiveRules.content.season.digitGap : null,
    seasonLowerBaselineY: season.enabled ? effectiveRules.content.season.upperBaselineY + (getCharacterBand(effectiveRules).height - effectiveRules.content.season.monthBoxHeight) : null,
    seasonContentHeight: season.enabled ? effectiveRules.content.season.contentHeight : null,
    seasonSeparatorHeight: season.enabled ? effectiveRules.content.season.separatorHeight : null,
    seasonRule: season.enabled ? effectiveRules.content.season.ruleLabel : "No seasonal field",
    sealColumnWidth: layout.actualSealColumnWidth,
    sealColumnRange: layout.actualSealColumnRangeLabel,
    sealColumnRule: layout.sealColumnRule,
    sealColumnMaxWidth: effectiveRules.content.seal.columnMaxWidth,
    huDiameter: effectiveRules.content.seal.huDiameter,
    huCenterY: effectiveRules.content.seal.huCenterY,
    authorityDiameter: effectiveRules.content.seal.authorityDiameter,
    authorityCenterY: effectiveRules.content.seal.authorityCenterY,
    sealVisibleCircleGap: sealGeometry?.visibleCircleGap ?? effectiveRules.content.seal.visibleCircleGap,
    sealAdjacentGapPolicy: "none - solved seal column is the complete measured area between adjacent character cells",
    sealCenterX: sealGeometry?.cx ?? null,
    remainingLeft: layout.sideMarginLeft,
    remainingRight: layout.sideMarginRight,
    modelUnit: "mm",
    modelNote: "Pure mm model. The viewer may scale the complete SVG, but the model never sees pixels."
  };

  return createPlateModel({ parsed, rules: effectiveRules, font, content: positioned, metrics, layout, season });
}


function buildChangePlateOneLineModelMm(input, options = {}, rules = ONE_LINE_RULES_MM) {
  const changePlate = resolveChangePlateOptions(options.changePlate);
  const split = splitChangePlateInput(input, changePlate);
  const baseInput = resolveChangePlateBaseInput(input, changePlate, split);
  const baseModel = buildStandardOneLinePlateModelMm(baseInput, {
    ...options,
    season: { ...(options.season || {}), enabled: false }
  }, rules);
  return attachChangePlateOneLineModel(baseModel, {
    input,
    changePlate,
    rules
  });
}



function buildChangePlateHighFormatModelMm(input, options = {}, rules = TWO_LINE_RULES_MM) {
  const changePlate = resolveChangePlateOptions(options.changePlate);
  const split = splitChangePlateInput(input, changePlate);
  const baseInput = resolveChangePlateBaseInput(input, changePlate, split);
  const baseModel = buildTwoLinePlateModelMm(baseInput, {
    ...options,
    season: { ...(options.season || {}), enabled: false }
  }, rules);
  return attachChangePlateHighFormatModel(baseModel, {
    input,
    changePlate,
    rules
  });
}

function resolveTwoLinePlateFontMode(input, options = {}, rules = TWO_LINE_RULES_MM) {
  const isMotorcycle = rules.formatKey === "motorcycle";
  const isReducedTwoLine = rules.formatKey === "reducedTwoLine";
  const requestedFontMode = isMotorcycle || isReducedTwoLine ? "middle" : options.fontMode === "auto" ? "auto" : options.fontMode === "narrow" ? "narrow" : "middle";
  const specialIWidth = resolveSpecialIWidth(rules.cells.middle, options);
  const middleFont = withSpecialIWidth(rules.cells.middle, specialIWidth);
  const season = resolveSeasonOptions(options.season, rules);
  const widthRule = resolveTwoLineWidthRule(options.twoLineWidthRule || rules.widthRuleDefault);
  const middleLayout = findTwoLinePlateLayoutForFont(input, rules, middleFont, "middle", options.widthMode, season, widthRule);
  const widthCapMm = resolveTwoLineWidthCapMm(options.widthMode, widthRule);

  if (isMotorcycle || isReducedTwoLine) {
    return createFontResolutionResult({
      requestedFontMode,
      fontMode: "middle",
      reason: isMotorcycle ? "Kraftradkennzeichen: verkleinerte Mittelschrift 49 mm; keine Engschrift-Automatik." : "Verkleinertes zweizeiliges Kennzeichen b209: Standard-Template mit vollständiger Text-/Siegelketten-Auto-Breite und fest verkleinerter Mittelschrift 49 mm; H/E und Saison erzwingen die obere Nebeneinander-Siegelreihe; Engschrift bleibt deaktiviert.",
      policy: isMotorcycle ? "motorcycle: reduced middle script only; no narrow fallback" : "reduced two-line b209: standard case only; fixed reduced middle script only; no reduced narrow layout is calculated",
      widthCapMm,
      middleLayout,
      narrowLayout: middleLayout,
      chosenLayout: middleLayout,
      middleFitsWidthCap: middleLayout.fits,
      narrowFitsWidthCap: middleLayout.fits
    });
  }

  const narrowFont = withSpecialIWidth(rules.cells.narrow, specialIWidth);
  const narrowLayout = findTwoLinePlateLayoutForFont(input, rules, narrowFont, "narrow", options.widthMode, season, widthRule);

  if (requestedFontMode !== "auto") {
    const chosenLayout = requestedFontMode === "narrow" ? narrowLayout : middleLayout;
    return createFontResolutionResult({
      requestedFontMode,
      fontMode: requestedFontMode,
      reason: requestedFontMode === "narrow" ? "Narrow script manuell gewählt." : "Middle script manuell gewählt.",
      policy: "manual",
      widthCapMm,
      middleLayout,
      narrowLayout,
      chosenLayout,
      middleFitsWidthCap: middleLayout.fits,
      narrowFitsWidthCap: narrowLayout.fits
    });
  }

  if (middleLayout.fits) {
    return createFontResolutionResult({
      requestedFontMode,
      fontMode: "middle",
      reason: "Auto: Zweizeilig Middle script passt in obere und untere Zeile; Narrow script wird nicht verwendet.",
      policy: "two-line middle-first; narrow only if one of the rows cannot satisfy the layout solver",
      widthCapMm,
      middleLayout,
      narrowLayout,
      chosenLayout: middleLayout,
      middleFitsWidthCap: true,
      narrowFitsWidthCap: narrowLayout.fits
    });
  }

  return createFontResolutionResult({
    requestedFontMode,
    fontMode: "narrow",
    reason: narrowLayout.fits
      ? "Auto: Zweizeilig Middle script passt nicht in beide Zeilen; Narrow script wird als Ausweichschrift gewählt."
      : "Auto: Zweizeilig Middle script passt nicht; Narrow script wird gewählt, passt aber ebenfalls nicht vollständig in die aktuelle Breitenbegrenzung.",
    policy: "two-line middle-first; narrow only if one of the rows cannot satisfy the layout solver",
    widthCapMm,
    middleLayout,
    narrowLayout,
    chosenLayout: narrowLayout,
    middleFitsWidthCap: false,
    narrowFitsWidthCap: narrowLayout.fits
  });
}

function buildTwoLinePlateModelMm(input, options = {}, rules = TWO_LINE_RULES_MM) {
  const fontResolution = resolvePlateFontMode(input, {
    plateFormat: getModelPlateFormat(rules),
    fontMode: options.fontMode,
    widthMode: options.widthMode,
    specialIWidth: options.specialIWidth,
    season: options.season,
    twoLineWidthRule: options.twoLineWidthRule
  });
  const fontMode = fontResolution.fontMode;
  const baseFont = rules.cells[fontMode];
  const isMotorcycle = rules.formatKey === "motorcycle";
  const isReducedTwoLine = rules.formatKey === "reducedTwoLine";
  const font = createTwoLineRenderFont(baseFont, {
    ...options,
    fixedReducedFont: isMotorcycle || isReducedTwoLine
  });
  const parsed = parsePlate(input);
  const visualStyle = resolveVisualStyle(options.visualStyle);
  const season = resolveSeasonOptions(resolveSeasonForVisualStyle(options.season, visualStyle), rules);
  rules = resolveRulesForSeason(rules, season);
  const widthRule = resolveTwoLineWidthRule(options.twoLineWidthRule || rules.widthRuleDefault);
  const layout = findTwoLinePlateLayoutForFont(input, rules, font, fontMode, options.widthMode, season, widthRule);
  const positioned = layout.positionedContent;
  const seasonFieldItem = layout.seasonField || getFirstItemOfType(positioned, "season-field") || null;
  const seasonLayout = season.enabled ? getSeasonFieldLayout(rules, seasonFieldItem) : null;
  const sealGeometry = getSealGeometryForContent(rules, positioned);
  const euroComponents = resolveEuroFieldComponentGeometry(rules.euro);
  const euroStarGeometry = euroComponents.starWreath;
  const euroCountryGeometry = euroComponents.countryMark;
  const topBand = getTwoLineCharacterBand(rules, "top", font.baselineY);
  const bottomBand = getTwoLineCharacterBand(rules, "bottom", font.baselineY);
  const metrics = {
    input,
    normalized: parsed.normalized,
    district: parsed.district,
    recognition: parsed.recognition,
    seasonEnabled: season.enabled,
    seasonStartMonth: season.from,
    seasonEndMonth: season.to,
    plateColorMode: visualStyle.key,
    plateColorLabel: visualStyle.label,
    textColor: visualStyle.color,
    frameColor: visualStyle.frameColor || (visualStyle.key === "green" ? visualStyle.color : "#111"),
    textColorNote: visualStyle.note,
    requestedFontMode: fontResolution.requestedFontMode,
    fontMode,
    fontLabel: font.label,
    fontFamily: font.fontFamily,
    plateFormat: getModelPlateFormat(rules),
    plateFormatLabel: rules.name,
    twoLineWidthRuleKey: widthRule.key,
    twoLineWidthRuleLabel: widthRule.label,
    twoLineWidthRuleText: widthRule.ruleLabel,
    twoLineWidthMaxMm: widthRule.maxWidth,
    twoLineWidthBands: getTwoLineWidthBandsForFont(fontMode, widthRule).join(", "),
    autoFontModeReason: fontResolution.reason,
    autoFontModePolicy: fontResolution.policy,
    autoWidthCapMm: fontResolution.widthCapMm,
    middleNeededWidth: fontResolution.middleNeededWidth,
    narrowNeededWidth: fontResolution.narrowNeededWidth,
    middleFitsWidthCap: fontResolution.middleFitsWidthCap,
    narrowFitsWidthCap: fontResolution.narrowFitsWidthCap,
    cellLetterWidth: font.letterWidth,
    cellDigitWidth: font.digitWidth,
    specialIWidth: font.specialWidths?.I ?? null,
    specialIWidthPolicy: "gemeinsame GL-I-Breite für Mittel- und Narrow script; kalibriert, nicht amtlich einzeln belegt",
    cellGap: layout.actualCharGap,
    cellGapRange: `${SPACING_RULES_MM.charGap.min}-${SPACING_RULES_MM.charGap.max}`,
    groupGap: layout.actualGroupGap,
    groupGapRange: layout.groupGapRangeLabel || `${SPACING_RULES_MM.groupGap.min}-${SPACING_RULES_MM.groupGap.max}`,
    groupGapRule: layout.groupGapRule || null,
    layoutMode: layout.modeLabel,
    layoutPolicy: layout.policy,
    widthSelectionReason: layout.reason,
    minContentWidth: layout.minContentWidth,
    preferredContentWidth: layout.preferredContentWidth,
    maxContentWidth: layout.maxContentWidth,
    minNeededWidth: layout.minNeededWidth,
    preferredNeededWidth: layout.preferredNeededWidth,
    maxNeededWidth: layout.maxNeededWidth,
    preferredFits: layout.preferredFits,
    maxFits: layout.maxFits,
    outsideMarginMin: getOutsideMarginMin(rules),
    outsideMarginMinLeft: Math.min(layout.top.sideMarginLeft ?? getOutsideMarginMin(rules), layout.bottom.sideMarginLeft ?? getOutsideMarginMin(rules), getOutsideMarginMin(rules)),
    outsideMarginMinRight: isReducedNineSlotSeasonTightCase(parsed, season) ? 6 : getOutsideMarginMin(rules),
    reducedNineSlotSeasonTightCase: isReducedTwoLineFormat(rules) ? isReducedNineSlotSeasonTightCase(parsed, season) : false,
    reducedNoITightUpperSealCase: isReducedTwoLineFormat(rules) ? isReducedNoITightUpperSealCase(parsed, season) : false,
    reducedEightSlotUpperSealCase: isReducedTwoLineFormat(rules) ? isReducedEightSlotUpperSealCase(parsed, season) : false,
    reducedVisibleSlotCount: isReducedTwoLineFormat(rules) ? getReducedVisibleSlotCount(parsed, season) : null,
    width: layout.width,
    height: rules.outerHeight,
    rawContentWidth: layout.contentWidth,
    topRowContentWidth: layout.top.contentWidth,
    bottomRowContentWidth: layout.bottom.contentWidth,
    topRowMargins: { left: layout.top.sideMarginLeft, right: layout.top.sideMarginRight },
    bottomRowMargins: { left: layout.bottom.sideMarginLeft, right: layout.bottom.sideMarginRight },
    rowDiagnostics: layout.rowDiagnostics,
    dxfReference: rules.reference,
    outerCornerRadius: rules.outerCornerRadius,
    innerCornerRadius: rules.innerCornerRadius,
    innerInset: rules.innerInset,
    innerHeight: rules.innerHeight,
    euroX: rules.euro.x,
    euroY: rules.euro.y,
    euroWidth: rules.euro.width,
    euroHeight: rules.euro.height,
    euroInnerTopClearance: rules.euro.innerTopClearance ?? null,
    euroStarsBoxHeight: rules.euro.starsBoxHeight ?? null,
    euroStarsToCountryGap: rules.euro.starsToCountryGap ?? null,
    euroCountryBoxHeight: rules.euro.countryBoxHeight ?? null,
    euroInnerBottomClearance: rules.euro.innerBottomClearance ?? null,
    euroStarsCenterY: rules.euro.starsCenterY ?? null,
    euroStarDiameterThroughCenters: euroStarGeometry.diameterThroughCenters,
    euroStarSize: euroStarGeometry.starSize,
    euroCountryBaselineY: rules.euro.countryBaselineY ?? null,
    euroCountryCenterY: rules.euro.countryCenterY ?? null,
    euroCountryHeight: euroCountryGeometry.height,
    euroCountryFontSize: euroCountryGeometry.fontSize,
    characterBandY: topBand.y,
    characterBandHeight: topBand.height,
    topCharacterBandY: topBand.y,
    topCharacterBaselineY: topBand.baselineY,
    bottomCharacterBandY: bottomBand.y,
    bottomCharacterBaselineY: bottomBand.baselineY,
    twoLineTopInnerMargin: topBand.y - rules.innerInset,
    twoLineInterRowGap: bottomBand.y - (topBand.y + topBand.height),
    twoLineBottomInnerMargin: rules.innerHeight - ((bottomBand.y + bottomBand.height) - rules.innerInset),
    characterFontSize: font.fontSize,
    characterBaselineY: font.baselineY,
    fontFitMode: options.fontFit?.mode || "manual",
    fontFitVisibleHeight: options.fontFit?.measured?.visibleHeight ?? null,
    fontFitTopY: options.fontFit?.measured?.topY ?? null,
    fontFitBottomY: options.fontFit?.measured?.bottomY ?? null,
    sealColumnWidth: layout.top.actualSealColumnWidth,
    sealColumnRange: `${formatNumber(rules.content.seal.columnMinWidth)}-${formatNumber(rules.content.seal.columnMaxWidth)}`,
    sealColumnRule: rules.content.seal.ruleLabel,
    sealColumnMaxWidth: rules.content.seal.columnMaxWidth,
    huDiameter: rules.content.seal.huDiameter,
    huCenterY: rules.content.seal.huCenterY,
    authorityDiameter: rules.content.seal.authorityDiameter,
    authorityCenterY: rules.content.seal.authorityCenterY,
    sealVisibleCircleGap: sealGeometry?.visibleCircleGap ?? rules.content.seal.visibleCircleGap,
    sealArrangement: sealGeometry?.arrangement ?? rules.content.seal.arrangement,
    reducedUpperSealRow: Boolean(layout.reducedUpperSealRow),
    reducedUpperSealRequired: rules.formatKey === "reducedTwoLine" ? isReducedUpperSealMandatory(parsed, season) : false,
    reducedLowerVisibleCharCount: layout.reducedLowerVisibleCharCount ?? null,
    sealAdjacentGapPolicy: rules.formatKey === "motorcycle" ? "motorcycle: no top-row season gap; * = at least 8 mm, ** = 8-10 mm; explicit 14-18 mm bottom ranges are handled separately" : "top row: balanced *, **, 8-25 mm seal gap and season star gap where present; bottom row uses recognition group gaps",
    topSealGap: layout.actualTopSealGap,
    upperSealPairGap: layout.actualUpperSealPairGap ?? null,
    upperSealPairGapRange: layout.actualUpperSealPairGap != null ? `${formatNumber(SPACING_RULES_MM.reducedUpperSealPairGap.min)}-${formatNumber(SPACING_RULES_MM.reducedUpperSealPairGap.max)}` : null,
    seasonGap: layout.actualSeasonGap,
    seasonGapRange: season.enabled && !isMotorcycleFormat(rules) ? `>=${formatNumber(SPACING_RULES_MM.twoLineSeasonGap.min)}` : null,
    seasonFieldWidth: season.enabled ? rules.content.season.fieldWidth : null,
    seasonFieldX: seasonFieldItem?.x ?? null,
    seasonFieldY: seasonLayout?.upperFieldY ?? null,
    seasonFieldHeight: seasonLayout?.band?.height ?? null,
    seasonUpperFieldY: seasonLayout?.upperFieldY ?? null,
    seasonLowerFieldY: seasonLayout?.lowerFieldY ?? null,
    seasonMonthBoxHeight: season.enabled ? rules.content.season.monthBoxHeight : null,
    seasonTargetDigitHeight: season.enabled ? rules.content.season.targetDigitHeight : null,
    seasonFontFamily: season.enabled ? rules.content.season.fontFamily : null,
    seasonFontSize: season.enabled ? rules.content.season.fontSize : null,
    seasonUpperBaselineY: seasonLayout?.upperBaselineY ?? null,
    seasonWidthScale: season.enabled ? rules.content.season.widthScale : null,
    seasonDigitGap: season.enabled ? rules.content.season.digitGap : null,
    seasonLowerBaselineY: seasonLayout?.lowerBaselineY ?? null,
    seasonContentHeight: season.enabled ? rules.content.season.contentHeight : null,
    seasonSeparatorHeight: season.enabled ? rules.content.season.separatorHeight : null,
    seasonRule: season.enabled ? rules.content.season.ruleLabel : "No seasonal field",
    topSealGapRange: isReducedTwoLineFormat(rules) ? `${formatNumber(SPACING_RULES_MM.reducedTopSealGap.min)}-${formatNumber(SPACING_RULES_MM.reducedTopSealGap.max)}` : `${formatNumber(SPACING_RULES_MM.twoLineTopSealGap.min)}-${formatNumber(SPACING_RULES_MM.twoLineTopSealGap.max)}`,
    sealCenterX: sealGeometry?.cx ?? null,
    remainingLeft: layout.bottom.sideMarginLeft,
    remainingRight: layout.bottom.sideMarginRight,
    modelUnit: "mm",
    modelNote: "Pure mm model. The viewer may scale the complete SVG, but the model never sees pixels."
  };

  return createPlateModel({ parsed, rules, font, content: positioned, metrics, layout, season });
}

function getTwoLineCharacterBand(rules, rowKey = "top", topBaselineY = null) {
  const topRow = rules.content.topRow;
  const row = rowKey === "bottom" ? rules.content.bottomRow : topRow;
  const baselineOffset = positiveNumber(topBaselineY, topRow.baselineY) - topRow.y;
  return {
    y: row.y,
    height: row.characterHeight,
    baselineY: row.y + baselineOffset
  };
}

function findTwoLinePlateLayoutForFont(input, rules, font, fontMode, widthMode, season = resolveSeasonOptions(), widthRule = resolveTwoLineWidthRule()) {
  const parsed = parsePlate(input);
  const topSequence = buildTwoLineTopSequence(parsed, rules, font, season);
  const bottomSequence = buildTwoLineBottomSequence(parsed, rules, font);
  const strategy = resolveWidthStrategy(widthMode);
  const bands = getTwoLineWidthBandsForFont(fontMode, widthRule);
  const fixedWidth = Number(widthMode);
  const fixedCandidate = Number.isFinite(fixedWidth) && fixedWidth > 0 ? Math.min(fixedWidth, widthRule.maxWidth) : null;
  const candidateWidths = strategy === "fixed" && fixedCandidate
    ? [fixedCandidate]
    : isMotorcycleFormat(rules) && season?.enabled
      ? [widthRule.maxWidth]
      : isReducedTwoLineFormat(rules)
        ? getReducedTwoLineAutoWidthCandidates(widthRule)
        : bands;

  if (isReducedTwoLineFormat(rules) && strategy !== "fixed") {
    const selectedWidth = selectReducedTwoLineAutoWidth({ rules, parsed, font, widthRule, season });
    return solveTwoLineContentLayout({ topSequence, bottomSequence, rules, width: selectedWidth, strategy, font, parsed, season, widthRule });
  }

  const fallbackFits = [];
  let compactEdgeFit = null;

  for (const width of candidateWidths) {
    const solved = solveTwoLineContentLayout({ topSequence, bottomSequence, rules, width, strategy, font, parsed, season, widthRule });
    if (!solved.fits) continue;
    if (strategy === "balanced") {
      if (solved.preferredFits) return solved;
      fallbackFits.push(solved);
      continue;
    }
    if (strategy === "compact" && (isExactMinimumBoundaryFit(solved.top) || isExactMinimumBoundaryFit(solved.bottom))) {
      compactEdgeFit = compactEdgeFit || solved;
      continue;
    }
    return solved;
  }

  if (strategy === "compact" && compactEdgeFit) {
    return {
      ...compactEdgeFit,
      reason: `${compactEdgeFit.reason} No larger two-line standard width is available; exact minimum boundary solution remains marked.`
    };
  }

  if (strategy === "balanced" && fallbackFits.length) {
    return {
      ...fallbackFits[0],
      reason: `${fallbackFits[0].reason} Preferred spacing did not fit in any two-line width band; compact solution selected as fallback.`
    };
  }

  const maxWidth = candidateWidths[candidateWidths.length - 1] || rules.maxWidth;
  return solveTwoLineContentLayout({ topSequence, bottomSequence, rules, width: maxWidth, strategy, allowOverflow: true, font, parsed, season, widthRule });
}


function getReducedTwoLineAutoWidthCandidates(widthRule = resolveTwoLineWidthRule()) {
  const middleBands = widthRule.widthBands?.middle || [200, 220, 240, 255];
  return middleBands.filter((candidate) => candidate <= widthRule.maxWidth);
}

function getReducedTextChainStats(sequence) {
  const fixedWidth = sumItemWidthsWhere(sequence, (item) => item.type === "char");
  const charGapCount = countItemsOfType(sequence, "char-gap");
  const groupGapCount = countItemsOfType(sequence, "group-gap");
  const minGapWidth = charGapCount * SPACING_RULES_MM.charGap.min + groupGapCount * SPACING_RULES_MM.reducedRecognitionGroupGap.min;
  return {
    fixedWidth,
    charGapCount,
    groupGapCount,
    minGapWidth,
    minTextWidth: fixedWidth + minGapWidth
  };
}

function getReducedCriticalTextMinWidth(sequence, rules) {
  const sideMin = getOutsideMarginMin(rules);
  const stats = getReducedTextChainStats(sequence);
  return stats.minTextWidth + sideMin * 2;
}

function applyReducedTightRightMargin(contentLimits, parsed, season) {
  if (!isReducedNineSlotSeasonTightCase(parsed, season)) return contentLimits;
  return {
    ...contentLimits,
    outsideMarginMinLeft: getOutsideMarginMinLeft(REDUCED_TWO_LINE_RULES_MM, contentLimits),
    outsideMarginMinRight: 6,
    reducedTightNineSlotRightMargin: true
  };
}

function solveReducedTemplateCandidate({ rules, parsed, font, width, widthRule = resolveTwoLineWidthRule(), allowUpperSealRow = false, allowOverflow = false, season = resolveSeasonOptions({ enabled: false }, rules) }) {
  const topLimits = applyReducedTightRightMargin(getTwoLineTopContentLimits(rules, width, { enabled: false }), parsed, season);
  const bottomLimits = applyReducedTightRightMargin(getTwoLineBottomContentLimits(rules, width), parsed, season);
  const topTextSequence = buildReducedTopSequence(parsed, font);
  const bottomTextSequence = buildReducedRecognitionSequence(parsed, font, season, rules, bottomLimits);
  const lowerVisibleCharCount = countItemsOfType(bottomTextSequence, "char");
  const normalTopSequence = withReducedSeal(topTextSequence, rules, "top", topLimits, null, null, { parsed, season });
  const normalBottomSequence = withReducedSeal(bottomTextSequence, rules, "bottom", bottomLimits, null, null, { parsed, season });
  const forceUpperSealRow = isReducedUpperSealMandatory(parsed, season);
  const mayUseUpperSealRow = forceUpperSealRow || (allowUpperSealRow && canReducedStandardUseUpperSealFallback(lowerVisibleCharCount));
  const normalShared = forceUpperSealRow
    ? { fits: false, top: null, bottom: null, fixedSealX: null }
    : solveReducedVerticalSharedSealRows({ rules, topSequence: normalTopSequence, bottomSequence: normalBottomSequence, topLimits, bottomLimits });
  const normalFits = !forceUpperSealRow && normalShared.fits;

  if (normalFits || !mayUseUpperSealRow) {
    return {
      fits: normalFits,
      template: "reduced-standard-vertical",
      width,
      topLimits,
      bottomLimits,
      topSequence: normalTopSequence,
      bottomSequence: normalBottomSequence,
      topSolution: normalShared.top,
      bottomSolution: normalShared.bottom,
      lowerVisibleCharCount,
      reducedUpperSealRow: false,
      topSealWidth: rules.content.seal.columnWidth,
      fixedVerticalSealX: normalShared.fixedSealX,
      verticalSealSharedX: true,
      verticalSealDiagnostics: normalShared,
      renderable: normalFits || allowOverflow
    };
  }

  const upperSealVisualCircleGap = getReducedUpperSealPairGapRange(parsed, season).preferred;
  const upperTopSequence = withReducedSeal(topTextSequence, rules, "top", topLimits, "reduced-standard-upper-row", upperSealVisualCircleGap, { parsed, season });
  const upperBottomSequence = bottomTextSequence;
  const upperTop = solveReducedRowChain(upperTopSequence, topLimits, rules);
  const upperBottom = solveReducedRowChain(upperBottomSequence, bottomLimits, rules);
  const upperFits = upperTop.fits && upperBottom.fits;

  return {
    fits: upperFits,
    template: "reduced-standard-upper-row",
    width,
    topLimits,
    bottomLimits,
    topSequence: upperTopSequence,
    bottomSequence: upperBottomSequence,
    topSolution: upperTop,
    bottomSolution: upperBottom,
    lowerVisibleCharCount,
    reducedUpperSealRow: true,
    topSealWidth: rules.content.seal.authorityDiameter + rules.content.seal.huDiameter,
    normalRejected: true,
    normalTop: normalShared.top,
    normalBottom: normalShared.bottom,
    normalVerticalSealDiagnostics: normalShared,
    renderable: upperFits || allowOverflow
  };
}

function selectReducedTwoLineAutoWidth({ rules, parsed, font, widthRule = resolveTwoLineWidthRule(), season = resolveSeasonOptions({ enabled: false }, rules) }) {
  const candidates = getReducedTwoLineAutoWidthCandidates(widthRule);
  const maxCandidate = candidates[candidates.length - 1] || widthRule.maxWidth;
  for (const candidate of candidates) {
    // b209: 180 mm is a real reduced auto-width candidate. H/E or season
    // variants require the upper side-by-side seal row on every candidate,
    // including 180 mm. Standard plates without H/E/season may use the upper
    // side-by-side seal fallback from 200 mm upward only when the lower row has
    // at least five visible characters; four-character lower rows such as
    // W QU11 must remain in the vertical-seal template and step up in width.
    const forceUpperSealRow = isReducedUpperSealMandatory(parsed, season);
    const allowUpperSealOnCandidate = forceUpperSealRow || candidate >= 200;
    const result = solveReducedTemplateCandidate({ rules, parsed, font, width: candidate, widthRule, allowUpperSealRow: allowUpperSealOnCandidate, season });
    if (result.fits) return candidate;
  }
  return maxCandidate;
}

function solveReducedTwoLineStandardLayout({ rules, width, strategy, allowOverflow = false, font = null, parsed = null, widthRule = resolveTwoLineWidthRule(), season = resolveSeasonOptions({ enabled: false }, rules) }) {
  const sideMin = getOutsideMarginMin(rules);
  const autoMode = strategy !== "fixed";
  const maxAutoWidth = widthRule.maxWidth;
  const allowUpperSealRow = true;
  const candidate = solveReducedTemplateCandidate({ rules, parsed, font, width, widthRule, allowUpperSealRow, allowOverflow, season });
  const chosen = candidate;
  let topItems = positionReducedSequence(
    chosen.topSequence,
    chosen.topLimits.left + chosen.topSolution.sideMarginLeft,
    "top",
    rules,
    chosen.topLimits,
    font,
    { charGap: chosen.topSolution.charGap, groupGap: chosen.topSolution.groupGap, sealGap: chosen.topSolution.sealGap, seasonGap: chosen.topSolution.seasonGap, itemWidths: chosen.topSolution.itemWidths }
  );
  const bottomItems = positionReducedSequence(
    chosen.bottomSequence,
    chosen.bottomLimits.left + chosen.bottomSolution.sideMarginLeft,
    "bottom",
    rules,
    chosen.bottomLimits,
    font,
    { charGap: chosen.bottomSolution.charGap, groupGap: chosen.bottomSolution.groupGap, sealGap: chosen.bottomSolution.sealGap, seasonGap: chosen.bottomSolution.seasonGap, itemWidths: chosen.bottomSolution.itemWidths }
  );
  let topSolutionForMetrics = chosen.topSolution;
  const centeredTop = centerReducedShortTopDistrictInCorridor(topItems, rules, chosen.topLimits, font);
  topItems = centeredTop.items;
  if (centeredTop.solutionPatch) topSolutionForMetrics = { ...chosen.topSolution, ...centeredTop.solutionPatch };
  const topTextToSealGap = topItems.find((item) => item.key === "reduced-top-text-to-authority-gap" || item.key === "reduced-top-seal-gap-upper-row" || item.key === "reduced-top-seal-gap");
  const upperSealPairGap = topItems.find((item) => item.key === "reduced-top-authority-to-hu-gap");
  const bottomSeasonGap = getFirstItemOfType(bottomItems, "season-gap");
  const reducedSeasonField = getFirstItemOfType(bottomItems, "season-field");
  const topFits = topSolutionForMetrics.fits;
  const bottomFits = chosen.bottomSolution.fits;
  const fits = chosen.fits;
  const modeLabel = strategy === "balanced" ? "Reduced two-line standard row-chain balanced" : strategy === "compact" ? "Reduced two-line standard row-chain compact" : "Reduced two-line standard fixed width";
  const reducedTextMinWidth = getReducedCriticalTextMinWidth(buildReducedRecognitionSequence(parsed, font, season, rules, chosen.bottomLimits), rules);
  const reducedCriticalMinWidth = Math.max(
    getReducedCriticalRowMinWidth(chosen.topSequence, rules, chosen.topLimits),
    getReducedCriticalRowMinWidth(chosen.bottomSequence, rules, chosen.bottomLimits)
  );
  const reason = `${modeLabel}: b209 selects the smallest reduced width candidate whose complete physical row chains fit. Normal mode checks upper text + HU field and lower recognition + authority seal field with one shared vertical seal X-axis; when that cannot fit, the upper two-seal fallback is tested on the same width candidate instead of being held back to the maximum width. ** gaps stay ${SPACING_RULES_MM.charGap.min}-${SPACING_RULES_MM.charGap.max} mm, lower *** stays ${SPACING_RULES_MM.reducedRecognitionGroupGap.min}-${SPACING_RULES_MM.reducedRecognitionGroupGap.max} mm, text→seal and seal→seal gaps stay inside their legal dynamic corridors. Upper side-by-side seals are separate row-chain fields, so the corridor between top text and right margin is shared dynamically; Reduced Engschrift is not calculated.`;
  const contentWidth = Math.max(topSolutionForMetrics.contentWidth, chosen.bottomSolution.contentWidth);

  return {
    fits,
    renderable: fits || allowOverflow,
    minFits: fits,
    preferredFits: fits,
    maxFits: fits,
    width,
    strategy,
    widthRuleKey: widthRule.key,
    widthRuleLabel: widthRule.label,
    widthRuleMaxMm: widthRule.maxWidth,
    widthRuleText: widthRule.ruleLabel,
    modeLabel,
    policy: "reduced two-line b209 standard template: complete row-chain width selection, fixed reduced middle script only, 180/200/220/240/255 × 130 mm candidates, H/E/season use mandatory upper side-by-side seals; 9-slot season cases may use the b209 tight >=6 mm right edge",
    reason,
    availableWidth: Math.min(chosen.topLimits.width, chosen.bottomLimits.width),
    minContentWidth: Math.max(topSolutionForMetrics.minContentWidth, chosen.bottomSolution.minContentWidth),
    preferredContentWidth: contentWidth,
    maxContentWidth: contentWidth,
    minNeededWidth: reducedCriticalMinWidth,
    preferredNeededWidth: width,
    maxNeededWidth: width,
    contentWidth,
    positionedContent: [...topItems, ...bottomItems],
    actualCharGap: chosen.bottomSolution.charGap,
    actualGroupGap: chosen.bottomSolution.groupGap,
    groupGapRangeLabel: getVariableRangeLabel(SPACING_RULES_MM.reducedRecognitionGroupGap, SPACING_RULES_MM.reducedRecognitionGroupGap),
    groupGapRule: getFirstItemOfType(bottomItems, "group-gap")?.ruleLabel || SPACING_RULES_MM.reducedRecognitionGroupGap.ruleLabel,
    reducedCriticalMinWidth,
    reducedTextMinWidth,
    top: {
      fits: topFits,
      renderable: topFits || allowOverflow,
      minFits: topFits,
      preferredFits: topFits,
      maxFits: topFits,
      width,
      strategy,
      modeLabel,
      policy: "Reduced top row chain: in vertical mode the HU field shares the bottom authority seal X-axis; in upper-seal mode text plus side-by-side seal fields are solved as one physical row, so glyphs cannot overlap seals",
      reason,
      availableWidth: chosen.topLimits.width,
      contentLimits: chosen.topLimits,
      minContentWidth: topSolutionForMetrics.minContentWidth,
      preferredContentWidth: topSolutionForMetrics.contentWidth,
      maxContentWidth: topSolutionForMetrics.contentWidth,
      minNeededWidth: chosen.topSolution.minNeededWidth,
      preferredNeededWidth: width,
      maxNeededWidth: width,
      contentWidth: topSolutionForMetrics.contentWidth,
      sideMarginLeft: topSolutionForMetrics.sideMarginLeft,
      sideMarginRight: topSolutionForMetrics.sideMarginRight,
      positionedContent: topItems,
      actualCharGap: topSolutionForMetrics.charGap,
      actualGroupGap: null,
      actualSealColumnWidth: chosen.topSealWidth,
      actualSealColumnMinWidth: chosen.topSealWidth,
      actualSealColumnRangeLabel: `${formatNumber(chosen.topSealWidth)}-${formatNumber(chosen.topSealWidth)}`,
      sealColumnRule: rules.content.seal.ruleLabel,
      actualTopSealGap: topTextToSealGap?.width ?? topSolutionForMetrics.sealGap,
      actualUpperSealPairGap: upperSealPairGap?.width ?? null,
      actualSeasonGap: null
    },
    bottom: {
      fits: bottomFits,
      renderable: bottomFits || allowOverflow,
      minFits: bottomFits,
      preferredFits: bottomFits,
      maxFits: bottomFits,
      width,
      strategy,
      modeLabel,
      policy: chosen.reducedUpperSealRow ? "Reduced bottom row text-only chain because the authority seal moved to the upper row" : "Reduced bottom row chain: recognition text plus authority seal field is solved as one physical row",
      reason,
      availableWidth: chosen.bottomLimits.width,
      contentLimits: chosen.bottomLimits,
      minContentWidth: chosen.bottomSolution.minContentWidth,
      preferredContentWidth: chosen.bottomSolution.contentWidth,
      maxContentWidth: chosen.bottomSolution.contentWidth,
      minNeededWidth: chosen.bottomSolution.minNeededWidth,
      preferredNeededWidth: width,
      maxNeededWidth: width,
      contentWidth: chosen.bottomSolution.contentWidth,
      sideMarginLeft: chosen.bottomSolution.sideMarginLeft,
      sideMarginRight: chosen.bottomSolution.sideMarginRight,
      positionedContent: bottomItems,
      actualCharGap: chosen.bottomSolution.charGap,
      actualGroupGap: chosen.bottomSolution.groupGap,
      actualGroupGapMinWidth: SPACING_RULES_MM.reducedRecognitionGroupGap.min,
      groupGapRangeLabel: getVariableRangeLabel(SPACING_RULES_MM.reducedRecognitionGroupGap, SPACING_RULES_MM.reducedRecognitionGroupGap),
      groupGapRule: getFirstItemOfType(bottomItems, "group-gap")?.ruleLabel || SPACING_RULES_MM.reducedRecognitionGroupGap.ruleLabel,
      actualSeasonGap: bottomSeasonGap?.width ?? null
    },
    actualSealColumnWidth: chosen.topSealWidth,
    reducedUpperSealRow: Boolean(chosen.reducedUpperSealRow),
    reducedLowerVisibleCharCount: chosen.lowerVisibleCharCount,
    actualTopSealGap: topTextToSealGap?.width ?? topSolutionForMetrics.sealGap,
    actualUpperSealPairGap: upperSealPairGap?.width ?? null,
    actualSeasonGap: bottomSeasonGap?.width ?? null,
    seasonField: reducedSeasonField || null,
    topSealGapRange: `${formatNumber(SPACING_RULES_MM.reducedTopSealGap.min)}-${formatNumber(SPACING_RULES_MM.reducedTopSealGap.max)}`,
    rowDiagnostics: [
      { key: "top", label: rules.content.topRow.label, left: chosen.topLimits.left, right: chosen.topLimits.right, marginLeft: topSolutionForMetrics.sideMarginLeft, marginRight: topSolutionForMetrics.sideMarginRight, contentWidth: topSolutionForMetrics.contentWidth, criticalMinWidth: getReducedCriticalRowMinWidth(chosen.topSequence, rules, chosen.topLimits), template: chosen.template },
      { key: "bottom", label: rules.content.bottomRow.label, left: chosen.bottomLimits.left, right: chosen.bottomLimits.right, marginLeft: chosen.bottomSolution.sideMarginLeft, marginRight: chosen.bottomSolution.sideMarginRight, contentWidth: chosen.bottomSolution.contentWidth, criticalMinWidth: getReducedCriticalRowMinWidth(chosen.bottomSequence, rules, chosen.bottomLimits), textOnlyCriticalMinWidth: reducedTextMinWidth, template: chosen.template }
    ]
  };
}


function centerReducedShortTopDistrictInCorridor(items, rules, limits, font) {
  const firstSealIndex = items.findIndex((item) => item.type === "seals" && item.rowKey === "top");
  if (firstSealIndex < 0) return { items, solutionPatch: null };
  const sealGapIndex = items.findIndex((item, index) => index < firstSealIndex && item.type === "seal-gap");
  if (sealGapIndex < 0) return { items, solutionPatch: null };
  const prefix = items.slice(0, sealGapIndex);
  const charCount = countItemsOfType(prefix, "char");
  if (charCount <= 0 || charCount >= 3) return { items, solutionPatch: null };

  const textStart = Number(prefix.find((item) => item.type === "char")?.x);
  const textEnd = prefix.reduce((right, item) => Math.max(right, Number(item.x) + (Number(item.width) || 0)), Number.NEGATIVE_INFINITY);
  const textWidth = textEnd - textStart;
  const firstSeal = items[firstSealIndex];
  const firstSealX = Number(firstSeal.x);
  const lastTopSeal = [...items].reverse().find((item) => item.type === "seals" && item.rowKey === "top");
  const lastSealRight = Number(lastTopSeal?.x) + (Number(lastTopSeal?.width) || 0);
  if (!Number.isFinite(textStart) || !Number.isFinite(textEnd) || !Number.isFinite(textWidth) || !Number.isFinite(firstSealX) || textWidth <= 0) {
    return { items, solutionPatch: null };
  }

  const sideMin = getOutsideMarginMin(rules);
  const zoneLeft = limits.left + sideMin;
  const minTextToSealGap = SPACING_RULES_MM.reducedTopSealGap.min;
  const zoneRight = firstSealX - minTextToSealGap;
  const desiredStart = zoneLeft + (zoneRight - zoneLeft - textWidth) / 2;
  const minStart = zoneLeft;
  const maxStart = zoneRight - textWidth;
  const centeredStart = Math.max(minStart, Math.min(desiredStart, maxStart));
  if (!Number.isFinite(centeredStart) || centeredStart + textWidth > zoneRight + 0.001) {
    return { items, solutionPatch: null };
  }

  const shift = centeredStart - textStart;
  if (Math.abs(shift) < 0.001) return { items, solutionPatch: null };

  let textRunRight = null;
  const centeredItems = items.map((item, index) => {
    if (index < sealGapIndex) {
      const moved = { ...item, x: Number(item.x) + shift };
      textRunRight = Math.max(textRunRight ?? Number.NEGATIVE_INFINITY, Number(moved.x) + (Number(moved.width) || 0));
      return moved;
    }
    if (index === sealGapIndex && item.type === "seal-gap") {
      const x = textRunRight ?? centeredStart + textWidth;
      const width = Math.max(0, firstSealX - x);
      return {
        ...item,
        x,
        width,
        ruleLabel: `${item.ruleLabel || "Reduced top text-to-seal corridor"}; b209 centers one-/two-letter upper district text inside the usable corridor between Euro field and the first seal field. The remaining slack becomes the text→seal corridor; fit calculations still use the complete physical row chain.`
      };
    }
    return item;
  });

  const sideMarginLeft = centeredStart - limits.left;
  const sideMarginRight = Number.isFinite(lastSealRight) ? limits.right - lastSealRight : null;
  const contentWidth = Number.isFinite(lastSealRight) ? lastSealRight - centeredStart : null;
  const topSealGap = centeredItems[sealGapIndex]?.width ?? null;
  return {
    items: centeredItems,
    solutionPatch: {
      sideMarginLeft,
      sideMarginRight,
      contentWidth: contentWidth ?? undefined,
      sealGap: topSealGap,
      shortDistrictCentered: true
    }
  };
}

function positionReducedCells(cells, startX, rowKey, rules, limits, font, charGap) {
  const sequence = [];
  cells.forEach((cell, index) => {
    if (index > 0) sequence.push({ type: "char-gap", key: `reduced-${rowKey}-char-gap-${index}`, width: charGap });
    sequence.push(cell);
  });
  return positionReducedSequence(sequence, startX, rowKey, rules, limits, font, { charGap, groupGap: SPACING_RULES_MM.reducedRecognitionGroupGap.preferred });
}

function positionReducedSequence(sequence, startX, rowKey, rules, limits, font, widths) {
  const band = getTwoLineCharacterBand(rules, rowKey, font?.baselineY);
  return positionRowItems(sequence, { startX, widths, rowKey, band, contentLimits: limits });
}

function solveTwoLineContentLayout({ topSequence, bottomSequence, rules, width, strategy, allowOverflow = false, font = null, parsed = null, season = resolveSeasonOptions(), widthRule = resolveTwoLineWidthRule() }) {
  if (rules.formatKey === "reducedTwoLine") {
    return solveReducedTwoLineStandardLayout({ rules, width, strategy, allowOverflow, font, parsed, widthRule, season });
  }
  const motorcycleSeasonField = rules.formatKey === "motorcycle" && season?.enabled ? makeMotorcycleSeasonItem(rules, width, season) : null;
  const topLimits = getTwoLineTopContentLimits(rules, width, season);
  const bottomLimits = getTwoLineBottomContentLimits(rules, width);
  const top = solveTwoLineTopContentLayout({ sequence: topSequence, rules, width, strategy, allowOverflow, contentLimits: topLimits });
  const bottom = solveTwoLineBottomContentLayout({ sequence: bottomSequence, rules, width, strategy, allowOverflow, contentLimits: bottomLimits, parsed, season });
  const topPositioned = applyTwoLineRowMetadata(top.positionedContent, "top", rules, topLimits, font);
  const bottomPositioned = applyTwoLineRowMetadata(bottom.positionedContent, "bottom", rules, bottomLimits, font);
  const seasonField = motorcycleSeasonField || getFirstItemOfType(topPositioned, "season-field");
  const motorcycleSeals = rules.formatKey === "motorcycle" ? [makeMotorcycleSealItem(rules, width, seasonField, parsed)] : [];
  const actualCharGaps = getItemWidthsByType([...topPositioned, ...bottomPositioned], "char-gap");
  const actualGroupGaps = getItemWidthsByType(bottomPositioned, "group-gap");
  const topSeal = getFirstItemOfType([...topPositioned, ...motorcycleSeals], "seals");
  const topSealGap = getFirstItemOfType(topPositioned, "seal-gap");
  const seasonGap = getFirstItemOfType(topPositioned, "season-gap");
  const modeLabel = strategy === "balanced" ? "Two-line auto balanced" : strategy === "compact" ? "Two-line auto compact" : "Two-line fixed width";
  const preferredFits = top.preferredFits && bottom.preferredFits;
  const maxFits = top.maxFits && bottom.maxFits;
  const fits = top.fits && bottom.fits;
  const minNeededWidth = Math.max(neededWidthForContentWithLimits(topLimits, top.minContentWidth, rules), neededWidthForContentWithLimits(bottomLimits, bottom.minContentWidth, rules));
  const preferredNeededWidth = Math.max(neededWidthForContentWithLimits(topLimits, top.preferredContentWidth, rules), neededWidthForContentWithLimits(bottomLimits, bottom.preferredContentWidth, rules));
  const maxNeededWidth = Math.max(neededWidthForContentWithLimits(topLimits, top.maxContentWidth, rules), neededWidthForContentWithLimits(bottomLimits, bottom.maxContentWidth, rules));
  const bottomPolicy = hasHistoricalOrElectricSuffix(parsed)
    ? (season?.enabled ? "bottom row uses balanced seasonal H/E spacing surfaces (*, ** and ***)." : "bottom row uses balanced H/E spacing surfaces (*, ** and ***) without a season field.")
    : "bottom row keeps its Anlage-4 group and character gaps with equal outside margins.";
  const widthPolicy = widthRule.key === "standard" ? "standard two-line width bands up to 340 mm" : widthRule.key === "motorcycle" ? "motorcycle plate width range 180-220 mm; seasonal Kraftrad uses the 220-mm reference canvas; fixed motorcycle text raster; no 260/280/320/340-mm fallback" : widthRule.key === "reducedTwoLine" ? "reduced two-line b209: complete row-chain 180/200/220/240/255 mm width candidates up to 255 × 130 mm; reduced middle script only; H/E/season use mandatory upper side-by-side seals; 9-slot season cases may use the b209 tight >=6 mm right edge" : "two-/three-wheel two-line width limit: no 320/340-mm fallback";
  const reason = `${modeLabel}: ${widthPolicy}; top row uses balanced spacing surfaces (* and **; motorcycle season does not clip the first row; non-motorcycle also uses 8-25 mm and season star gap where present); ${bottomPolicy}`;

  return {
    fits,
    renderable: fits || allowOverflow,
    minFits: top.minFits && bottom.minFits,
    preferredFits,
    maxFits,
    width,
    strategy,
    widthRuleKey: widthRule.key,
    widthRuleLabel: widthRule.label,
    widthRuleMaxMm: widthRule.maxWidth,
    widthRuleText: widthRule.ruleLabel,
    modeLabel,
    policy: rules.formatKey === "motorcycle" ? "motorcycle physical solver: top row district after Euro across the first-row inner edge, separate middle-zone seasonal column when enabled, horizontal seal band, bottom row recognition with Kraftrad-specific 49 mm reduced middle-script raster" : rules.formatKey === "reducedTwoLine" ? "reduced two-line b209 physical template: standard case only, fixed reduced middle script, complete row-chain width candidates up to 255 × 130 mm" : "two-line physical solver: top row is district plus seal field after Euro; bottom row is recognition across the full plate width; variable gaps stay in Anlage-4 ranges",
    reason,
    availableWidth: Math.min(top.availableWidth, bottom.availableWidth),
    minContentWidth: Math.max(top.minContentWidth, bottom.minContentWidth),
    preferredContentWidth: Math.max(top.preferredContentWidth, bottom.preferredContentWidth),
    maxContentWidth: Math.max(top.maxContentWidth, bottom.maxContentWidth),
    minNeededWidth,
    preferredNeededWidth,
    maxNeededWidth,
    contentWidth: Math.max(top.contentWidth, bottom.contentWidth),
    positionedContent: [...topPositioned, ...motorcycleSeals, ...(motorcycleSeasonField ? [motorcycleSeasonField] : []), ...bottomPositioned],
    actualCharGap: average(actualCharGaps) ?? SPACING_RULES_MM.charGap.preferred,
    actualGroupGap: average(actualGroupGaps) ?? null,
    groupGapRangeLabel: getVariableRangeLabel(getFirstItemOfType(bottomPositioned, "group-gap"), SPACING_RULES_MM.groupGap),
    groupGapRule: getFirstItemOfType(bottomPositioned, "group-gap")?.ruleLabel || null,
    top,
    bottom,
    actualSealColumnWidth: topSeal?.width ?? rules.content.seal.columnWidth,
    actualTopSealGap: topSealGap?.width ?? null,
    actualSeasonGap: seasonGap?.width ?? null,
    seasonField: seasonField || null,
    topSealGapRange: isReducedTwoLineFormat(rules) ? `${formatNumber(SPACING_RULES_MM.reducedTopSealGap.min)}-${formatNumber(SPACING_RULES_MM.reducedTopSealGap.max)}` : `${formatNumber(SPACING_RULES_MM.twoLineTopSealGap.min)}-${formatNumber(SPACING_RULES_MM.twoLineTopSealGap.max)}`,
    rowDiagnostics: [
      { key: "top", label: rules.content.topRow.label, left: topLimits.left, right: topLimits.right, marginLeft: top.sideMarginLeft, marginRight: top.sideMarginRight, contentWidth: top.contentWidth },
      { key: "bottom", label: rules.content.bottomRow.label, left: bottomLimits.left, right: bottomLimits.right, marginLeft: bottom.sideMarginLeft, marginRight: bottom.sideMarginRight, contentWidth: bottom.contentWidth }
    ]
  };
}

function makeMotorcycleSeasonItem(rules, width, season) {
  const fieldWidth = rules.content.season.fieldWidth;
  const rightStarGap = SPACING_RULES_MM.outsideMargin.min;
  const x = width - rules.innerInset - rightStarGap - fieldWidth;
  return {
    type: "season-field",
    key: "motorcycle-season-validity-field",
    rowKey: "middle",
    x,
    width: fieldWidth,
    season,
    bandY: positiveNumber(rules.content.season.fieldY, 73.375),
    bandHeight: positiveNumber(rules.content.season.contentHeight, 53.25),
    baselineY: null,
    contentLimits: createHorizontalBounds(x, x + fieldWidth),
    ruleLabel: rules.content.season.ruleLabel
  };
}

function makeMotorcycleSealItem(rules, width, seasonField = null, parsed = null) {
  const seal = rules.content.seal;
  const hasSeasonField = seasonField?.x != null;
  const pairGap = hasSeasonField
    ? positiveNumber(seal.visibleCircleGap, 10)
    : positiveNumber(seal.nonSeasonVisibleCircleGap, 20);
  const pairWidth = seal.huDiameter + pairGap + seal.authorityDiameter;
  const contentLeft = rules.euro.x + rules.euro.width;
  const seasonReservedGap = positiveNumber(seal.seasonReservedGap, SPACING_RULES_MM.outsideMargin.min);
  const rawContentRight = hasSeasonField ? seasonField.x - seasonReservedGap : width - rules.innerInset;
  const contentRight = Math.max(contentLeft + pairWidth, rawContentRight);
  const contentCenter = contentLeft + (contentRight - contentLeft) / 2;
  const seasonalSealOffset = hasSeasonField ? numberOrFallback(seal.seasonSealXOffset, 0) : 0;
  const heSealOffset = !hasSeasonField && hasHistoricalOrElectricSuffix(parsed) ? numberOrFallback(seal.historicalOrElectricSealXOffset, 0) : 0;
  const left = contentCenter - pairWidth / 2 + seasonalSealOffset + heSealOffset;
  return {
    type: "seals",
    key: "motorcycle-horizontal-seals",
    rowKey: "middle",
    x: left,
    width: pairWidth,
    arrangement: seal.arrangement,
    visibleCircleGap: pairGap,
    bandY: 77.5,
    bandHeight: 45,
    baselineY: null,
    contentLimits: createHorizontalBounds(contentLeft, contentRight)
  };
}

function applyTwoLineRowMetadata(items, rowKey, rules, contentLimits, font = null) {
  const band = getTwoLineCharacterBand(rules, rowKey, font?.baselineY);
  return attachRowMetadata(items, { rowKey, band, contentLimits });
}

function getTwoLineTopContentLimits(rules, width, season = resolveSeasonOptions()) {
  const left = rules.euro.x + rules.euro.width;
  const right = width - rules.innerInset;
  // Motorcycle seasonal validity is a middle-zone column. It must not shorten,
  // measure, or visually own the first row. The first row keeps the normal
  // motorcycle top-row right margin to the inner plate edge.
  return createHorizontalBounds(left, right);
}

function getTwoLineBottomContentLimits(rules, width) {
  const left = rules.innerInset;
  const right = width - rules.innerInset;
  return createHorizontalBounds(left, right);
}


function getOutsideMarginMin(rules) {
  return positiveNumber(rules?.content?.sideClearance, SPACING_RULES_MM.outsideMargin.min);
}

function getOutsideMarginMinLeft(rules, contentLimits = null) {
  return positiveNumber(contentLimits?.outsideMarginMinLeft, getOutsideMarginMin(rules));
}

function getOutsideMarginMinRight(rules, contentLimits = null) {
  return positiveNumber(contentLimits?.outsideMarginMinRight, getOutsideMarginMin(rules));
}

function solveTwoLineTopContentLayout({ sequence, rules, width, strategy, allowOverflow = false, contentLimits }) {
  const available = contentLimits.width;
  const sideMin = getOutsideMarginMin(rules);
  const modeLabel = strategy === "balanced" ? "Two-line top auto balanced" : strategy === "compact" ? "Two-line top auto compact" : "Two-line top fixed width";
  const fixedWidth = sumItemWidthsExcept(sequence, (item) => isTopRowSpacingItem(item) || item.type === "seals");
  const sealItems = getItemsOfType(sequence, "seals");
  const spacingItems = sequence.filter((item) => isTopRowSpacingItem(item));
  const minSealWidth = sumItemWidths(sealItems, getItemMinWidth);
  const preferredSealWidth = sumItemWidths(sealItems, getItemPreferredWidth);
  const minSpacingWidth = sumItemWidths(spacingItems, getTopRowSpacingMinWidth) + sideMin * 2;
  const preferredSpacingWidth = sumItemWidths(spacingItems, getTopRowSpacingPreferredWidth) + sideMin * 2;
  const cappedMaxSpacingWidth = sumItemWidths(spacingItems, getTopRowSpacingFiniteMaxWidth) + sideMin * 2;
  const minContentWidth = fixedWidth + minSealWidth + sumItemWidths(spacingItems, getTopRowSpacingMinWidth);
  const preferredContentWidth = fixedWidth + preferredSealWidth + sumItemWidths(spacingItems, getTopRowSpacingPreferredWidth);
  const maxContentWidth = fixedWidth + preferredSealWidth + sumItemWidths(spacingItems, getTopRowSpacingFiniteMaxWidth);
  const minFits = fixedWidth + minSealWidth + minSpacingWidth <= available + 0.0001;
  const preferredFits = fixedWidth + preferredSealWidth + preferredSpacingWidth <= available + 0.0001;
  const maxFits = fixedWidth + preferredSealWidth + cappedMaxSpacingWidth <= available + 0.0001;

  let sealWidth = preferredSealWidth;
  if (fixedWidth + preferredSealWidth + minSpacingWidth > available && fixedWidth + minSealWidth + minSpacingWidth <= available) {
    sealWidth = Math.max(minSealWidth, available - fixedWidth - minSpacingWidth);
  }

  let sideMarginLeft = sideMin;
  let sideMarginRight = sideMin;
  let spacingWidths = createItemWidthMap(spacingItems, getTopRowSpacingPreferredWidth);
  let reason = `${modeLabel}: top row spacing uses preferred values.`;

  if (minFits) {
    const spaceTarget = available - fixedWidth - sealWidth;
    const starBalanced = balanceTopRowSpacingSurfaces(spacingItems, spaceTarget, sideMin, strategy);
    sideMarginLeft = starBalanced.leftMargin;
    sideMarginRight = starBalanced.rightMargin;
    spacingWidths = starBalanced.widths;
    reason = starBalanced.reason;
  } else {
    spacingWidths = createItemWidthMap(spacingItems, getTopRowSpacingMinWidth);
    sealWidth = minSealWidth;
    reason = `${modeLabel}: minimum top-row spacing does not fit this width.`;
  }

  const solvedSequence = sequence.map((item) => {
    const sealItem = applySharedTypeWidth(item, "seals", sealWidth, sealItems.length);
    if (sealItem !== item) return sealItem;
    if (isTopRowSpacingItem(item)) return { ...item, width: spacingWidths.get(item.key) ?? getTopRowSpacingMinWidth(item) };
    return { ...item, width: item.width };
  });
  const contentWidth = sumResolvedItemWidths(solvedSequence);
  const xStart = contentLimits.left + sideMarginLeft;
  const positionedContent = positionContent(solvedSequence, xStart);
  const actualCharGaps = getItemWidthsByType(solvedSequence, "char-gap");
  const actualSeal = getFirstItemOfType(solvedSequence, "seals");
  const actualSealGap = getFirstItemOfType(solvedSequence, "seal-gap");
  const actualSeasonGap = getFirstItemOfType(solvedSequence, "season-gap");

  return {
    ...createLayoutResultBase({
      minFits,
      allowOverflow,
      preferredFits,
      maxFits,
      width,
      strategy,
      modeLabel,
      policy: "two-line top-row solver: star gaps, double-star gaps and the 8-25 mm seal gap are balanced within their Anlage-4 ranges; season star gap participates when a season field is present",
      reason,
      available,
      contentLimits,
      minContentWidth,
      preferredContentWidth,
      maxContentWidth,
      minNeededWidth: neededWidthForContentWithLimits(contentLimits, minContentWidth, rules),
      preferredNeededWidth: neededWidthForContentWithLimits(contentLimits, preferredContentWidth, rules),
      maxNeededWidth: neededWidthForContentWithLimits(contentLimits, maxContentWidth, rules),
      contentWidth,
      sideMarginLeft,
      sideMarginRight,
      positionedContent
    }),
    actualCharGap: average(actualCharGaps) ?? SPACING_RULES_MM.charGap.preferred,
    actualGroupGap: null,
    actualGroupGapMinWidth: null,
    groupGapRangeLabel: null,
    groupGapRule: null,
    actualSealColumnWidth: actualSeal?.width ?? rules.content.seal.columnWidth,
    actualSealColumnMinWidth: actualSeal?.minWidth ?? rules.content.seal.columnMinWidth,
    actualSealColumnRangeLabel: actualSeal ? `${formatNumber(actualSeal.minWidth)}-${formatNumber(actualSeal.maxWidth)}` : `${rules.content.seal.columnMinWidth}-${rules.content.seal.columnMaxWidth}`,
    sealColumnRule: actualSeal?.ruleLabel || rules.content.seal.ruleLabel,
    actualTopSealGap: actualSealGap?.width ?? null,
    actualSeasonGap: actualSeasonGap?.width ?? null
  };
}


function isTopRowSpacingItem(item) {
  return item.type === "char-gap" || item.type === "seal-gap" || item.type === "season-gap";
}

function getTopRowSpacingMinWidth(item) {
  return getFixedTypeOrItemMinWidth(item, "season-gap", SPACING_RULES_MM.outsideMargin.min);
}

function getTopRowSpacingPreferredWidth(item) {
  return getFixedTypeOrItemPreferredWidth(item, "season-gap", SPACING_RULES_MM.outsideMargin.min);
}

function getTopRowSpacingFiniteMaxWidth(item) {
  return getFixedTypeOrItemFiniteMaxWidth(item, "season-gap", SPACING_RULES_MM.outsideMargin.min);
}

function getTopRowSpacingMaxWidth(item) {
  return getFixedTypeOrItemMaxWidth(item, "season-gap", Number.POSITIVE_INFINITY);
}

function balanceTopRowSpacingSurfaces(spacingItems, targetWidth, sideMin, strategy) {
  const surfaces = createSpacingSurfaces(spacingItems, sideMin, {
    getMinWidth: getTopRowSpacingMinWidth,
    getMaxWidth: getTopRowSpacingMaxWidth
  });
  const { surplus } = waterFillSpacingSurfaces(surfaces, targetWidth);

  if (!surplus) {
    return spacingSurfaceResult(surfaces, sideMin, `${strategy === "balanced" ? "Two-line top auto balanced" : "Two-line top fixed width"}: minimum star/seal/character spacing used.`);
  }

  const reason = `${strategy === "balanced" ? "Two-line top auto balanced" : "Two-line top fixed width"}: top-row free space was water-filled across Anlage-4 spacing surfaces: * gaps, ** gaps and 8-25 mm seal gap; capped gaps stop at their maxima and remaining width stays in uncapped * gaps.`;
  return spacingSurfaceResult(surfaces, sideMin, reason);
}

function neededWidthForContentWithLimits(limits, contentWidth, rules) {
  return limits.left + contentWidth + getOutsideMarginMin(rules) * 2 + (rules.outerHeight ? rules.innerInset : 0);
}

export function renderPlateSvgMm(input, options = {}) {
  const model = buildPlateModelMm(input, options);
  return renderPlateSvgDocument(model, options);
}

function findPlateLayoutForFont(input, rules, font, fontMode, widthMode, season = resolveSeasonOptions(null, rules)) {
  const parsed = parsePlate(input);
  const sequence = buildUnpositionedContent(parsed, rules, font, season);
  const strategy = resolveWidthStrategy(widthMode);
  const bands = WIDTH_BANDS[fontMode] || WIDTH_BANDS.middle;
  const fixedWidth = Number(widthMode);
  const candidateWidths = strategy === "fixed" && Number.isFinite(fixedWidth) && fixedWidth > 0 ? [fixedWidth] : bands;
  const fallbackFits = [];
  let compactEdgeFit = null;

  for (const width of candidateWidths) {
    const solved = solveOneLineContentLayout({ sequence, rules, width, strategy, season });
    if (!solved.fits) continue;
    if (strategy === "balanced") {
      if (solved.preferredFits) return solved;
      fallbackFits.push(solved);
      continue;
    }
    if (strategy === "compact" && isExactMinimumBoundaryFit(solved)) {
      compactEdgeFit = compactEdgeFit || solved;
      continue;
    }
    return solved;
  }

  if (strategy === "compact" && compactEdgeFit) {
    return {
      ...compactEdgeFit,
      reason: `${compactEdgeFit.reason} No larger standard width is available; exact minimum boundary solution remains marked.`
    };
  }

  if (strategy === "balanced" && fallbackFits.length) {
    return {
      ...fallbackFits[0],
      reason: `${fallbackFits[0].reason} Preferred spacing did not fit in any width band; compact solution selected as fallback.`
    };
  }

  const maxWidth = candidateWidths[candidateWidths.length - 1] || rules.maxWidth;
  return solveOneLineContentLayout({ sequence, rules, width: maxWidth, strategy, allowOverflow: true, season });
}

function isExactMinimumBoundaryFit(layout) {
  if (!layout?.fits) return false;
  const EPSILON = 0.01;
  const atMinimumMargins = layout.sideMarginLeft <= SPACING_RULES_MM.outsideMargin.min + EPSILON && layout.sideMarginRight <= SPACING_RULES_MM.outsideMargin.min + EPSILON;
  const sealMin = layout.actualSealColumnMinWidth ?? SPACING_RULES_MM.sealColumn.min;
  const squeezedVariables = layout.actualCharGap <= SPACING_RULES_MM.charGap.min + EPSILON
    || layout.actualGroupGap <= (layout.actualGroupGapMinWidth ?? SPACING_RULES_MM.groupGap.min) + EPSILON
    || layout.actualSealColumnWidth <= sealMin + EPSILON;
  return atMinimumMargins && squeezedVariables;
}

function buildUnpositionedContent(parsed, rules, font, season = resolveSeasonOptions(null, rules)) {
  const districtCells = makeCells(parsed.district, font, "district");
  const recognitionGroups = splitRecognition(parsed.recognition);
  const recognitionCells = recognitionGroups.map((group, index) => ({
    type: "group",
    key: `recognition-${index}`,
    cells: makeCells(group.value, font, group.type)
  }));
  return buildContentSequence({ districtCells, recognitionCells, parsed, season, rules });
}


function solveTwoLineBottomContentLayout({ sequence, rules, width, strategy, allowOverflow = false, contentLimits, parsed = null, season = resolveSeasonOptions() }) {
  if (rules.formatKey === "motorcycle" || rules.formatKey === "reducedTwoLine") {
    return solveMotorcycleBottomContentLayout({ sequence, rules, width, strategy, allowOverflow, contentLimits, parsed, season });
  }
  if (hasHistoricalOrElectricSuffix(parsed)) {
    return solveTwoLineHistoricalOrElectricBottomLayout({ sequence, rules, width, strategy, allowOverflow, contentLimits, season });
  }
  return solveContentLayout({ sequence, rules, width, strategy, allowOverflow, contentLimits });
}

function solveMotorcycleBottomContentLayout({ sequence, rules, width, strategy, allowOverflow = false, contentLimits, parsed = null, season = resolveSeasonOptions() }) {
  const available = contentLimits.width;
  const sideMin = getOutsideMarginMin(rules);
  const spacingItems = sequence.filter((item) => isBottomRowSpacingItem(item));
  const fixedWidth = sumItemWidthsExcept(sequence, isBottomRowSpacingItem);
  const preferredSpacingWidthOnly = sumItemWidths(spacingItems, getItemPreferredWidth);
  const minSpacingWidthOnly = sumItemWidths(spacingItems, getItemMinWidth);
  const preferredFits = fixedWidth + preferredSpacingWidthOnly + sideMin * 2 <= available + 0.0001;
  const minFits = fixedWidth + minSpacingWidthOnly + sideMin * 2 <= available + 0.0001;
  const modeLabel = strategy === "balanced" ? (season?.enabled ? "Motorcycle seasonal bottom template balanced" : "Motorcycle bottom template balanced") : strategy === "compact" ? (season?.enabled ? "Motorcycle seasonal bottom template compact" : "Motorcycle bottom template compact") : (season?.enabled ? "Motorcycle seasonal bottom fixed width" : "Motorcycle bottom fixed width");
  const spacingWidths = new Map(spacingItems.map((item) => [item.key, preferredFits ? getItemPreferredWidth(item) : getItemMinWidth(item)]));
  const spacingTotal = sumValues([...spacingWidths.values()]);
  const freeForMargins = available - fixedWidth - spacingTotal;
  const sideMarginLeft = Math.max(sideMin, freeForMargins / 2);
  const sideMarginRight = Math.max(sideMin, freeForMargins - sideMarginLeft);
  const solvedSequence = sequence.map((item) => {
    if (isBottomRowSpacingItem(item)) return { ...item, width: spacingWidths.get(item.key) ?? getItemMinWidth(item) };
    return { ...item, width: item.width };
  });
  const contentWidth = sumResolvedItemWidths(solvedSequence);
  const xStart = contentLimits.left + sideMarginLeft;
  const positionedContent = positionContent(solvedSequence, xStart);
  const actualCharGaps = getItemWidthsByType(solvedSequence, "char-gap");
  const actualGroupGaps = getItemWidthsByType(solvedSequence, "group-gap");
  const minContentWidth = fixedWidth + minSpacingWidthOnly;
  const preferredContentWidth = fixedWidth + preferredSpacingWidthOnly;
  const maxContentWidth = fixedWidth + sumItemWidths(spacingItems, getItemMaxWidth);
  return {
    ...createLayoutResultBase({
      minFits,
      allowOverflow,
      preferredFits,
      maxFits: fixedWidth + sumItemWidths(spacingItems, getItemMaxWidth) + sideMin * 2 <= available + 0.0001,
      width,
      strategy,
      modeLabel,
      policy: "motorcycle bottom-row template solver: character ** gaps use their preferred 8-10 mm value, Kraftrad group ranges keep their template-preferred value, remaining width goes to equal outside * margins instead of waterfilling gaps to their maxima",
      reason: `${modeLabel}: Kraftrad bottom template values used; remaining free width stays in equal outside margins.`,
      available,
      contentLimits,
      minContentWidth,
      preferredContentWidth,
      maxContentWidth,
      minNeededWidth: neededWidthForContentWithLimits(contentLimits, minContentWidth, rules),
      preferredNeededWidth: neededWidthForContentWithLimits(contentLimits, preferredContentWidth, rules),
      maxNeededWidth: neededWidthForContentWithLimits(contentLimits, maxContentWidth, rules),
      contentWidth,
      sideMarginLeft,
      sideMarginRight,
      positionedContent
    }),
    actualCharGap: average(actualCharGaps) ?? SPACING_RULES_MM.charGap.preferred,
    actualGroupGap: average(actualGroupGaps) ?? null,
    actualGroupGapMinWidth: minVariableWidth(getItemsOfType(solvedSequence, "group-gap")),
    groupGapRangeLabel: getVariableRangeLabel(getFirstItemOfType(solvedSequence, "group-gap"), hasHistoricalOrElectricSuffix(parsed) ? SPACING_RULES_MM.motorcycleRecognitionGroupGapHistoricalOrElectric : SPACING_RULES_MM.motorcycleRecognitionGroupGap),
    groupGapRule: getFirstItemOfType(solvedSequence, "group-gap")?.ruleLabel || null,
    actualSealColumnWidth: rules.content.seal.columnWidth,
    actualSealColumnMinWidth: rules.content.seal.columnMinWidth,
    actualSealColumnRangeLabel: `${rules.content.seal.columnMinWidth}-${rules.content.seal.columnMaxWidth}`,
    sealColumnRule: rules.content.seal.ruleLabel
  };
}

function solveTwoLineHistoricalOrElectricBottomLayout({ sequence, rules, width, strategy, allowOverflow = false, contentLimits, season = resolveSeasonOptions() }) {
  const available = contentLimits.width;
  const sideMin = getOutsideMarginMin(rules);
  const fixedWidth = sumItemWidthsExcept(sequence, isBottomRowSpacingItem);
  const spacingItems = sequence.filter((item) => isBottomRowSpacingItem(item));
  const minSpacingWidth = sumItemWidths(spacingItems, getItemMinWidth) + sideMin * 2;
  const preferredSpacingWidth = sumItemWidths(spacingItems, getItemPreferredWidth) + sideMin * 2;
  const cappedMaxSpacingWidth = sumItemWidths(spacingItems, getItemMaxWidth) + sideMin * 2;
  const minContentWidth = fixedWidth + sumItemWidths(spacingItems, getItemMinWidth);
  const preferredContentWidth = fixedWidth + sumItemWidths(spacingItems, getItemPreferredWidth);
  const maxContentWidth = fixedWidth + sumItemWidths(spacingItems, getItemMaxWidth);
  const minFits = fixedWidth + minSpacingWidth <= available + 0.0001;
  const preferredFits = fixedWidth + preferredSpacingWidth <= available + 0.0001;
  const maxFits = fixedWidth + cappedMaxSpacingWidth <= available + 0.0001;
  const modeLabel = strategy === "balanced" ? (season?.enabled ? "Two-line seasonal H/E bottom auto balanced" : "Two-line H/E bottom auto balanced") : strategy === "compact" ? (season?.enabled ? "Two-line seasonal H/E bottom auto compact" : "Two-line H/E bottom auto compact") : (season?.enabled ? "Two-line seasonal H/E bottom fixed width" : "Two-line H/E bottom fixed width");

  let sideMarginLeft = sideMin;
  let sideMarginRight = sideMin;
  let spacingWidths = createItemWidthMap(spacingItems, getItemMinWidth);
  let reason = `${modeLabel}: minimum H/E bottom-row spacing used.`;

  if (minFits) {
    const surfaceTarget = available - fixedWidth;
    const balanced = balanceBottomRowSpacingSurfaces(spacingItems, surfaceTarget, sideMin, strategy);
    sideMarginLeft = balanced.leftMargin;
    sideMarginRight = balanced.rightMargin;
    spacingWidths = balanced.widths;
    reason = balanced.reason;
  } else {
    reason = `${modeLabel}: minimum H/E bottom-row spacing does not fit this width.`;
  }

  const solvedSequence = sequence.map((item) => {
    if (isBottomRowSpacingItem(item)) return { ...item, width: spacingWidths.get(item.key) ?? getItemMinWidth(item) };
    return { ...item, width: item.width };
  });
  const contentWidth = sumResolvedItemWidths(solvedSequence);
  const xStart = contentLimits.left + sideMarginLeft;
  const positionedContent = positionContent(solvedSequence, xStart);
  const actualCharGaps = getItemWidthsByType(solvedSequence, "char-gap");
  const actualGroupGaps = getItemWidthsByType(solvedSequence, "group-gap");

  return {
    ...createLayoutResultBase({
      minFits,
      allowOverflow,
      preferredFits,
      maxFits,
      width,
      strategy,
      modeLabel,
      policy: "two-line H/E bottom-row solver: outside * gaps, character ** gaps and H/E group *** gaps are water-filled within their Anlage-4 ranges; applies with and without a season field",
      reason,
      available,
      contentLimits,
      minContentWidth,
      preferredContentWidth,
      maxContentWidth,
      minNeededWidth: neededWidthForContentWithLimits(contentLimits, minContentWidth, rules),
      preferredNeededWidth: neededWidthForContentWithLimits(contentLimits, preferredContentWidth, rules),
      maxNeededWidth: neededWidthForContentWithLimits(contentLimits, maxContentWidth, rules),
      contentWidth,
      sideMarginLeft,
      sideMarginRight,
      positionedContent
    }),
    actualCharGap: average(actualCharGaps) ?? SPACING_RULES_MM.charGap.preferred,
    actualGroupGap: average(actualGroupGaps) ?? null,
    actualGroupGapMinWidth: minVariableWidth(getItemsOfType(solvedSequence, "group-gap")),
    groupGapRangeLabel: getVariableRangeLabel(getFirstItemOfType(solvedSequence, "group-gap"), SPACING_RULES_MM.twoLineBottomGroupGapHistoricalOrElectric),
    groupGapRule: getFirstItemOfType(solvedSequence, "group-gap")?.ruleLabel || "Two-line H/E bottom row: group gaps 20-30 mm",
    actualSealColumnWidth: rules.content.seal.columnWidth,
    actualSealColumnMinWidth: rules.content.seal.columnMinWidth,
    actualSealColumnRangeLabel: `${rules.content.seal.columnMinWidth}-${rules.content.seal.columnMaxWidth}`,
    sealColumnRule: rules.content.seal.ruleLabel
  };
}

function isBottomRowSpacingItem(item) {
  return item.type === "char-gap" || item.type === "group-gap";
}

function balanceBottomRowSpacingSurfaces(spacingItems, targetWidth, sideMin, strategy) {
  const surfaces = createSpacingSurfaces(spacingItems, sideMin, {
    getMinWidth: getItemMinWidth,
    getMaxWidth: getItemMaxWidth
  });
  waterFillSpacingSurfaces(surfaces, targetWidth);

  return spacingSurfaceResult(
    surfaces,
    sideMin,
    `${strategy === "balanced" ? "Two-line H/E bottom auto balanced" : "Two-line H/E bottom fixed width"}: bottom-row free space was water-filled across Anlage-4 spacing surfaces: outside * gaps, character ** gaps and H/E group *** gaps; capped gaps stop at their maxima and remaining width stays in uncapped outside * gaps.`
  );
}


function solveOneLineContentLayout({ sequence, rules, width, strategy, season = resolveSeasonOptions(null, rules), allowOverflow = false }) {
  if (season?.enabled) {
    return solveOneLineSeasonContentLayout({ sequence, rules, width, strategy, allowOverflow });
  }
  return solveContentLayout({ sequence, rules, width, strategy, allowOverflow });
}

function solveOneLineSeasonContentLayout({ sequence, rules, width, strategy, allowOverflow = false }) {
  const contentLimits = getContentLimits(rules, width);
  const available = contentLimits.width;
  const sideMin = SPACING_RULES_MM.outsideMargin.min;
  const fixedWidth = sumItemWidthsExcept(sequence, (item) => isOneLineSeasonSpacingItem(item) || item.type === "seals");
  const sealItems = getItemsOfType(sequence, "seals");
  const spacingItems = sequence.filter((item) => isOneLineSeasonSpacingItem(item));
  const minSealWidth = sumItemWidths(sealItems, getItemMinWidth);
  const preferredSealWidth = sumItemWidths(sealItems, getItemPreferredWidth);
  const minSpacingWidth = sumItemWidths(spacingItems, getOneLineSeasonSpacingMinWidth) + sideMin * 2;
  const preferredSpacingWidth = sumItemWidths(spacingItems, getOneLineSeasonSpacingPreferredWidth) + sideMin * 2;
  const cappedMaxSpacingWidth = sumItemWidths(spacingItems, getOneLineSeasonSpacingFiniteMaxWidth) + sideMin * 2;
  const minContentWidth = fixedWidth + minSealWidth + sumItemWidths(spacingItems, getOneLineSeasonSpacingMinWidth);
  const preferredContentWidth = fixedWidth + preferredSealWidth + sumItemWidths(spacingItems, getOneLineSeasonSpacingPreferredWidth);
  const maxContentWidth = fixedWidth + preferredSealWidth + sumItemWidths(spacingItems, getOneLineSeasonSpacingFiniteMaxWidth);
  const minFits = fixedWidth + minSealWidth + minSpacingWidth <= available + 0.0001;
  const preferredFits = fixedWidth + preferredSealWidth + preferredSpacingWidth <= available + 0.0001;
  const maxFits = fixedWidth + preferredSealWidth + cappedMaxSpacingWidth <= available + 0.0001;
  const modeLabel = strategy === "balanced" ? "One-line seasonal auto balanced" : strategy === "compact" ? "One-line seasonal auto compact" : "One-line seasonal fixed width";

  let sealWidth = preferredSealWidth;
  if (fixedWidth + preferredSealWidth + minSpacingWidth > available && fixedWidth + minSealWidth + minSpacingWidth <= available) {
    sealWidth = Math.max(minSealWidth, available - fixedWidth - minSpacingWidth);
  }

  let sideMarginLeft = sideMin;
  let sideMarginRight = sideMin;
  let spacingWidths = createItemWidthMap(spacingItems, getOneLineSeasonSpacingPreferredWidth);
  let reason = `${modeLabel}: one-line seasonal spacing uses preferred values.`;

  if (minFits) {
    const spaceTarget = available - fixedWidth - sealWidth;
    const balanced = balanceOneLineSeasonSpacingSurfaces(spacingItems, spaceTarget, sideMin, strategy);
    sideMarginLeft = balanced.leftMargin;
    sideMarginRight = balanced.rightMargin;
    spacingWidths = balanced.widths;
    reason = balanced.reason;
  } else {
    spacingWidths = createItemWidthMap(spacingItems, getOneLineSeasonSpacingMinWidth);
    sealWidth = minSealWidth;
    reason = `${modeLabel}: minimum one-line seasonal spacing does not fit this width.`;
  }

  const solvedSequence = sequence.map((item) => {
    const sealItem = applySharedTypeWidth(item, "seals", sealWidth, sealItems.length);
    if (sealItem !== item) return sealItem;
    if (isOneLineSeasonSpacingItem(item)) return { ...item, width: spacingWidths.get(item.key) ?? getOneLineSeasonSpacingMinWidth(item) };
    return { ...item, width: item.width };
  });
  const contentWidth = sumResolvedItemWidths(solvedSequence);
  const xStart = contentLimits.left + sideMarginLeft;
  const positionedContent = positionContent(solvedSequence, xStart);
  const actualCharGaps = getItemWidthsByType(solvedSequence, "char-gap");
  const actualGroupGaps = getItemWidthsByType(solvedSequence, "group-gap");
  const actualSeal = getFirstItemOfType(solvedSequence, "seals");
  const actualSeasonGap = getFirstItemOfType(solvedSequence, "season-gap");

  return {
    ...createLayoutResultBase({
      minFits,
      allowOverflow,
      preferredFits,
      maxFits,
      width,
      strategy,
      modeLabel,
      policy: "one-line seasonal solver: outside * gaps, character gaps, recognition group gaps, seal column and the season star gap are balanced within their Anlage-4 ranges; the 30 x 75 mm season field remains fixed",
      reason,
      available,
      contentLimits,
      minContentWidth,
      preferredContentWidth,
      maxContentWidth,
      minNeededWidth: neededWidthForContent(rules, minContentWidth),
      preferredNeededWidth: neededWidthForContent(rules, preferredContentWidth),
      maxNeededWidth: neededWidthForContent(rules, maxContentWidth),
      contentWidth,
      sideMarginLeft,
      sideMarginRight,
      positionedContent
    }),
    actualCharGap: average(actualCharGaps) ?? SPACING_RULES_MM.charGap.preferred,
    actualGroupGap: average(actualGroupGaps) ?? null,
    actualGroupGapMinWidth: minVariableWidth(getItemsOfType(solvedSequence, "group-gap")),
    groupGapRangeLabel: getVariableRangeLabel(getFirstItemOfType(solvedSequence, "group-gap"), SPACING_RULES_MM.groupGap),
    groupGapRule: getFirstItemOfType(solvedSequence, "group-gap")?.ruleLabel || null,
    actualSealColumnWidth: actualSeal?.width ?? rules.content.seal.columnWidth,
    actualSealColumnMinWidth: actualSeal?.minWidth ?? SPACING_RULES_MM.sealColumn.min,
    actualSealColumnRangeLabel: actualSeal ? `${formatNumber(actualSeal.minWidth)}-${formatNumber(actualSeal.maxWidth)}` : `${SPACING_RULES_MM.sealColumn.min}-${SPACING_RULES_MM.sealColumn.max}`,
    sealColumnRule: actualSeal?.ruleLabel || "Normal: seal column 63.5-67.5 mm",
    actualSeasonGap: actualSeasonGap?.width ?? null
  };
}

function isOneLineSeasonSpacingItem(item) {
  return item.type === "char-gap" || item.type === "group-gap" || item.type === "season-gap";
}

function getOneLineSeasonSpacingMinWidth(item) {
  return getFixedTypeOrItemMinWidth(item, "season-gap", SPACING_RULES_MM.outsideMargin.min);
}

function getOneLineSeasonSpacingPreferredWidth(item) {
  return getFixedTypeOrItemPreferredWidth(item, "season-gap", SPACING_RULES_MM.outsideMargin.min);
}

function getOneLineSeasonSpacingFiniteMaxWidth(item) {
  return getFixedTypeOrItemFiniteMaxWidth(item, "season-gap", SPACING_RULES_MM.outsideMargin.min);
}

function getOneLineSeasonSpacingMaxWidth(item) {
  return getFixedTypeOrItemMaxWidth(item, "season-gap", Number.POSITIVE_INFINITY);
}

function balanceOneLineSeasonSpacingSurfaces(spacingItems, targetWidth, sideMin, strategy) {
  const surfaces = createSpacingSurfaces(spacingItems, sideMin, {
    getMinWidth: getOneLineSeasonSpacingMinWidth,
    getMaxWidth: getOneLineSeasonSpacingMaxWidth
  });
  waterFillSpacingSurfaces(surfaces, targetWidth);

  return spacingSurfaceResult(
    surfaces,
    sideMin,
    `${strategy === "balanced" ? "One-line seasonal auto balanced" : "One-line seasonal fixed width"}: free space was water-filled across Anlage-4 spacing surfaces: outside * gaps, character gaps, group gaps and the season star gap; capped gaps stop at their maxima and remaining width stays in uncapped * gaps.`
  );
}

function solveContentLayout({ sequence, rules, width, strategy, allowOverflow = false, contentLimits: providedContentLimits = null }) {
  const contentLimits = providedContentLimits || getContentLimits(rules, width);
  const available = contentLimits.width;
  const sideMin = SPACING_RULES_MM.outsideMargin.min;
  const minContentWidth = sumSequenceWidth(sequence, "min");
  const preferredContentWidth = sumSequenceWidth(sequence, "preferred");
  const maxContentWidth = sumSequenceWidth(sequence, "max");
  const minNeededWidth = neededWidthForContent(rules, minContentWidth);
  const preferredNeededWidth = neededWidthForContent(rules, preferredContentWidth);
  const maxNeededWidth = neededWidthForContent(rules, maxContentWidth);
  const minFits = minContentWidth + sideMin * 2 <= available;
  const preferredFits = preferredContentWidth + sideMin * 2 <= available;
  const maxFits = maxContentWidth + sideMin * 2 <= available;
  const modeLabel = strategy === "balanced" ? "Auto balanced" : strategy === "compact" ? "Auto compact" : "Fixed width";

  let solvedSequence = sequence.map((item) => ({ ...item, width: getItemPreferredWidth(item) }));
  let contentWidth = preferredContentWidth;
  let reason = `${modeLabel}: preferred spacing used; outside margins distributed equally.`;

  if (preferredFits) {
    const targetContentWidth = Math.min(maxContentWidth, available - sideMin * 2);
    solvedSequence = growVariablesToFit(sequence, targetContentWidth);
    contentWidth = sumResolvedItemWidths(solvedSequence);
    reason = contentWidth > preferredContentWidth + 0.01
      ? `${modeLabel}: preferred spacing fits; free width was first distributed into variable gaps up to allowed maxima, remainder stays as equal outside margins.`
      : `${modeLabel}: preferred spacing used; outside margins distributed equally.`;
  } else if (!preferredFits && minFits) {
    solvedSequence = shrinkVariablesToFit(sequence, available - sideMin * 2);
    contentWidth = sumResolvedItemWidths(solvedSequence);
    reason = `${modeLabel}: preferred spacing does not fit; variable gaps reduced to allowed minima, outside margins remain equal.`;
  } else if (!minFits) {
    solvedSequence = sequence.map((item) => ({ ...item, width: getItemMinWidth(item) }));
    contentWidth = sumResolvedItemWidths(solvedSequence);
    reason = `${modeLabel}: minimum spacing does not fit this width.`;
  }

  const sideMargin = (available - contentWidth) / 2;
  const xStart = contentLimits.left + sideMargin;
  const positionedContent = positionContent(solvedSequence, xStart);
  const actualCharGaps = getItemWidthsByType(solvedSequence, "char-gap");
  const actualGroupGaps = getItemWidthsByType(solvedSequence, "group-gap");
  const actualSeal = getFirstItemOfType(solvedSequence, "seals");

  return {
    ...createLayoutResultBase({
      minFits,
      allowOverflow,
      preferredFits,
      maxFits,
      width,
      strategy,
      modeLabel,
      policy: "physical solver: variable gaps in min/preferred/max ranges; outside margins are equal and at least 8 mm when the layout fits",
      reason,
      available,
      contentLimits,
      minContentWidth,
      preferredContentWidth,
      maxContentWidth,
      minNeededWidth,
      preferredNeededWidth,
      maxNeededWidth,
      contentWidth,
      sideMarginLeft: sideMargin,
      sideMarginRight: sideMargin,
      positionedContent
    }),
    actualCharGap: average(actualCharGaps) ?? SPACING_RULES_MM.charGap.preferred,
    actualGroupGap: average(actualGroupGaps) ?? null,
    actualGroupGapMinWidth: minVariableWidth(getItemsOfType(solvedSequence, "group-gap")),
    groupGapRangeLabel: getVariableRangeLabel(getFirstItemOfType(solvedSequence, "group-gap"), SPACING_RULES_MM.groupGap),
    groupGapRule: getFirstItemOfType(solvedSequence, "group-gap")?.ruleLabel || null,
    actualSealColumnWidth: actualSeal?.width ?? rules.content.seal.columnWidth,
    actualSealColumnMinWidth: actualSeal?.minWidth ?? SPACING_RULES_MM.sealColumn.min,
    actualSealColumnRangeLabel: actualSeal ? `${formatNumber(actualSeal.minWidth)}-${formatNumber(actualSeal.maxWidth)}` : `${SPACING_RULES_MM.sealColumn.min}-${SPACING_RULES_MM.sealColumn.max}`,
    sealColumnRule: actualSeal?.ruleLabel || "Normal: seal column 63.5-67.5 mm"
  };
}

function neededWidthForContent(rules, contentWidth) {
  const geometry = getFixedHorizontalGeometry(rules);
  return geometry.contentLeft + contentWidth + SPACING_RULES_MM.outsideMargin.min * 2 + rules.innerInset;
}

function getSealColumnRange(parsed) {
  if (hasHistoricalOrElectricSuffix(parsed)) {
    return {
      ...SPACING_RULES_MM.sealColumnHistoricalOrElectric,
      ruleLabel: "H/E suffix: seal column 58.0-67.5 mm according to Anlage 4 exception"
    };
  }
  return {
    ...SPACING_RULES_MM.sealColumn,
    ruleLabel: "Normal: seal column 63.5-67.5 mm"
  };
}

function buildContentSequence({ districtCells, recognitionCells, parsed, season = resolveSeasonOptions(), rules = ONE_LINE_RULES_MM }) {
  const sequence = [];
  appendCells(sequence, districtCells);

  // Anlage-4/DXF interpretation for the seal area:
  // The seal column itself is a variable measured range. Do not add separate left/right gap items around it.
  // Normal one-line plates use 63.5-67.5 mm. If the recognition part ends with an Oldtimer H
  // or Elektro E suffix after a digit, Anlage 4 allows the seal area to shrink to 58.0 mm.
  sequence.push(variableItem("seals", "seal-zone", getSealColumnRange(parsed)));

  recognitionCells.forEach((group, groupIndex) => {
    if (groupIndex > 0) {
      sequence.push(variableItem("group-gap", `recognition-group-gap-${groupIndex}`, SPACING_RULES_MM.groupGap));
    }
    appendCells(sequence, group.cells);
  });
  if (season?.enabled) {
    sequence.push(variableItem("season-gap", "one-line-season-gap", SPACING_RULES_MM.oneLineSeasonGap));
    sequence.push({
      type: "season-field",
      key: "one-line-season-validity-field",
      width: rules.content.season.fieldWidth,
      season
    });
  }
  return sequence;
}

function positionContent(sequence, startX) {
  return positionRowItems(sequence, { startX });
}

function getFixedHorizontalGeometry(rules) {
  const contentLeft = rules.euro.x + rules.euro.width;
  return {
    innerLeft: rules.innerInset,
    innerRightInset: rules.innerInset,
    contentLeft,
    euroRight: contentLeft
  };
}

function getContentLimits(rules, width) {
  const geometry = getFixedHorizontalGeometry(rules);
  const left = geometry.contentLeft;
  const right = width - geometry.innerRightInset;
  return createHorizontalBounds(left, right);
}

function getSealGeometryForContent(rules, content) {
  const seal = getFirstItemOfType(content, "seals");
  return seal ? getSealGeometry(rules, seal) : null;
}


