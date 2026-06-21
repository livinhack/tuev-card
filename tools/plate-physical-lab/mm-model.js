// Kennzeichen Physical Lab b116 / shared plate physical mm model
// CAD-like model layer: every coordinate, size and distance in this file is millimetres.
// No CSS pixels, devicePixelRatio, browser zoom or monitor calibration are used here.
// Shared CAD-like one-line plate model used by the Physical Lab and the production Card renderer. Final H/E suffix plates may shrink the one-line seal column to 58.0 mm; normal plates keep 63.5-67.5 mm.

export const WIDTH_BANDS = Object.freeze({
  middle: [340, 380, 420, 460, 480, 520],
  narrow: [320, 340, 380, 420, 460, 480, 520]
});

export const SPACING_RULES_MM = Object.freeze({
  outsideMargin: { min: 8 },
  charGap: { min: 8, preferred: 9, max: 10 },
  groupGap: { min: 20, preferred: 24, max: 30 },
  sealColumn: { min: 63.5, preferred: 63.5, max: 67.5 },
  sealColumnHistoricalOrElectric: { min: 58, preferred: 63.5, max: 67.5 },
  autoWidth: {
    compact: "smallest width that satisfies all minimum spacings and equal outside margins",
    balanced: "smallest width that satisfies preferred spacings and equal outside margins"
  }
});

export const FONT_CALIBRATION_PROFILES_MM = Object.freeze({
  middleManualB108: {
    label: "GL middle script · manually calibrated b116",
    targetGlyphHeight: 75,
    fontSize: 125,
    baselineY: 92.5,
    note: "Current manual calibration for GL middle script in the 75 mm character band; free width is distributed into variable gaps up to their maximum values before equal outside margins remain."
  },
  narrowPending: {
    label: "GL narrow script · pending separate calibration",
    targetGlyphHeight: 75,
    fontSize: 125,
    baselineY: 92.5,
    note: "Temporary start value; narrow script will be checked separately."
  }
});

export const DXF_REFERENCE_MM = Object.freeze({
  source: "Euro-Einzeilig.dxf / Skizze2.dxf",
  coordinateMode: "normalised top-left plate coordinates",
  body: {
    outerHeight: 110,
    innerInset: 4.5,
    innerHeight: 101,
    outerCornerRadius: 9.25,
    innerCornerRadius: 4.75
  },
  euro: {
    x: 4.5,
    y: 4.5,
    width: 45,
    height: 101,
    starsCenterX: 27,
    starsCenterY: 36.5,
    starsRadius: 15,
    countryCenterX: 27,
    countryBaselineY: 89.5
  },
  seals: {
    columnInnerWidth: 63.5,
    columnOuterWidth: 67.5,
    huDiameter: 35,
    huCenterY: 29.5,
    authorityDiameter: 45,
    authorityCenterY: 75.5,
    visibleCircleGap: 6
  }
});

export const ONE_LINE_RULES_MM = Object.freeze({
  name: "One-line standard plate",
  reference: DXF_REFERENCE_MM.source,
  outerHeight: DXF_REFERENCE_MM.body.outerHeight,
  maxWidth: 520,
  innerInset: DXF_REFERENCE_MM.body.innerInset,
  innerHeight: DXF_REFERENCE_MM.body.innerHeight,
  outerCornerRadius: DXF_REFERENCE_MM.body.outerCornerRadius,
  innerCornerRadius: DXF_REFERENCE_MM.body.innerCornerRadius,
  euro: {
    ...DXF_REFERENCE_MM.euro,
    country: "D"
  },
  content: {
    topClearance: 13,
    characterHeight: 75,
    bottomClearance: 13,
    sideClearance: SPACING_RULES_MM.outsideMargin.min,
    charGap: SPACING_RULES_MM.charGap,
    groupGap: SPACING_RULES_MM.groupGap,
    seal: {
      columnMinWidth: SPACING_RULES_MM.sealColumn.min,
      columnWidth: DXF_REFERENCE_MM.seals.columnInnerWidth,
      columnMaxWidth: DXF_REFERENCE_MM.seals.columnOuterWidth,
      huDiameter: DXF_REFERENCE_MM.seals.huDiameter,
      huCenterY: DXF_REFERENCE_MM.seals.huCenterY,
      authorityDiameter: DXF_REFERENCE_MM.seals.authorityDiameter,
      authorityCenterY: DXF_REFERENCE_MM.seals.authorityCenterY,
      visibleCircleGap: DXF_REFERENCE_MM.seals.visibleCircleGap
    }
  },
  cells: {
    middle: {
      label: "Middle script",
      fontFamily: "GL-Nummernschild-Mtl",
      letterWidth: 47.5,
      digitWidth: 44.5,
      gap: SPACING_RULES_MM.charGap.preferred,
      characterHeight: 75,
      // Font output calibration is still in mm. It is not viewer scaling.
      // SVG font-size does not equal visible cap height, therefore this can be tuned separately.
      fontSize: FONT_CALIBRATION_PROFILES_MM.middleManualB108.fontSize,
      baselineY: FONT_CALIBRATION_PROFILES_MM.middleManualB108.baselineY,
      specialWidths: {
        I: 35.5
      }
    },
    narrow: {
      label: "Narrow script",
      fontFamily: "GL-Nummernschild-Eng",
      letterWidth: 40.5,
      digitWidth: 38.5,
      gap: SPACING_RULES_MM.charGap.preferred,
      characterHeight: 75,
      fontSize: FONT_CALIBRATION_PROFILES_MM.narrowPending.fontSize,
      baselineY: FONT_CALIBRATION_PROFILES_MM.narrowPending.baselineY,
      specialWidths: {
        I: 35.5
      }
    }
  },
  dimensions: {
    enabledMarginRight: 40,
    enabledMarginBottom: 32,
    baselineOffset: 18
  }
});

export function parsePlate(input) {
  const normalized = String(input || "")
    .toUpperCase()
    .replace(/[^A-Z0-9ÄÖÜ\s-]/g, " ")
    .replace(/[\s-]+/g, " ")
    .trim();
  const parts = normalized ? normalized.split(" ") : [];

  if (parts.length >= 2) {
    return {
      normalized,
      district: parts[0],
      recognition: parts.slice(1).join(""),
      parts
    };
  }

  return {
    normalized,
    district: "",
    recognition: parts[0] || "",
    parts
  };
}

export function resolvePlateFontMode(input, options = {}) {
  const rules = ONE_LINE_RULES_MM;
  const requestedFontMode = options.fontMode === "auto" ? "auto" : options.fontMode === "narrow" ? "narrow" : "middle";
  const specialIWidth = positiveNumber(options.specialIWidth, rules.cells.middle.specialWidths?.I || rules.cells.middle.letterWidth);
  const middleFont = withSpecialIWidth(rules.cells.middle, specialIWidth);
  const narrowFont = withSpecialIWidth(rules.cells.narrow, specialIWidth);
  const middleLayout = findPlateLayoutForFont(input, rules, middleFont, "middle", options.widthMode);
  const narrowLayout = findPlateLayoutForFont(input, rules, narrowFont, "narrow", options.widthMode);
  const widthCapMm = resolveWidthCapMm(options.widthMode, rules.maxWidth);

  if (requestedFontMode !== "auto") {
    const chosenLayout = requestedFontMode === "narrow" ? narrowLayout : middleLayout;
    return {
      requestedFontMode,
      fontMode: requestedFontMode,
      reason: requestedFontMode === "narrow" ? "Narrow script manuell gewählt." : "Middle script manuell gewählt.",
      policy: "manual",
      widthCapMm,
      middleRawContentWidth: middleLayout.preferredContentWidth,
      narrowRawContentWidth: narrowLayout.preferredContentWidth,
      middleNeededWidth: middleLayout.preferredNeededWidth,
      narrowNeededWidth: narrowLayout.preferredNeededWidth,
      middleFitsWidthCap: middleLayout.fits,
      narrowFitsWidthCap: narrowLayout.fits,
      middleLayout,
      narrowLayout,
      chosenLayout
    };
  }

  if (middleLayout.fits) {
    return {
      requestedFontMode,
      fontMode: "middle",
      reason: "Auto: Middle script passt mit den zulässigen Abständen und gleichen Außenrändern; Narrow script wird nicht verwendet.",
      policy: "middle-first; narrow only if middle cannot satisfy the layout solver",
      widthCapMm,
      middleRawContentWidth: middleLayout.preferredContentWidth,
      narrowRawContentWidth: narrowLayout.preferredContentWidth,
      middleNeededWidth: middleLayout.preferredNeededWidth,
      narrowNeededWidth: narrowLayout.preferredNeededWidth,
      middleFitsWidthCap: true,
      narrowFitsWidthCap: narrowLayout.fits,
      middleLayout,
      narrowLayout,
      chosenLayout: middleLayout
    };
  }

  return {
    requestedFontMode,
    fontMode: "narrow",
    reason: narrowLayout.fits
      ? "Auto: Middle script passt nicht mit den zulässigen Abständen; Narrow script wird als Ausweichschrift gewählt."
      : "Auto: Middle script passt nicht mit den zulässigen Abständen; Narrow script wird gewählt, passt aber ebenfalls nicht vollständig in die aktuelle Breitenbegrenzung.",
    policy: "middle-first; narrow only if middle cannot satisfy the layout solver",
    widthCapMm,
    middleRawContentWidth: middleLayout.preferredContentWidth,
    narrowRawContentWidth: narrowLayout.preferredContentWidth,
    middleNeededWidth: middleLayout.preferredNeededWidth,
    narrowNeededWidth: narrowLayout.preferredNeededWidth,
    middleFitsWidthCap: false,
    narrowFitsWidthCap: narrowLayout.fits,
    middleLayout,
    narrowLayout,
    chosenLayout: narrowLayout
  };
}

export function buildPlateModelMm(input, options = {}) {
  const rules = ONE_LINE_RULES_MM;
  const fontResolution = resolvePlateFontMode(input, {
    fontMode: options.fontMode,
    widthMode: options.widthMode,
    specialIWidth: options.specialIWidth
  });
  const fontMode = fontResolution.fontMode;
  const baseFont = rules.cells[fontMode];
  const specialIWidth = positiveNumber(options.specialIWidth, baseFont.specialWidths?.I || baseFont.letterWidth);
  const font = {
    ...baseFont,
    specialWidths: {
      ...(baseFont.specialWidths || {}),
      I: specialIWidth
    },
    fontSize: positiveNumber(options.fontSize, baseFont.fontSize),
    baselineY: positiveNumber(options.baselineY, baseFont.baselineY),
    fit: options.fontFit || null
  };
  const parsed = parsePlate(input);
  const layout = findPlateLayoutForFont(input, rules, font, fontMode, options.widthMode);
  const positioned = layout.positionedContent;
  const width = layout.width;
  const rawContentWidth = layout.contentWidth;
  const sealGeometry = getSealGeometryForContent(rules, positioned);
  const metrics = {
    input,
    normalized: parsed.normalized,
    district: parsed.district,
    recognition: parsed.recognition,
    requestedFontMode: fontResolution.requestedFontMode,
    fontMode,
    fontLabel: font.label,
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
    groupGapRange: `${SPACING_RULES_MM.groupGap.min}-${SPACING_RULES_MM.groupGap.max}`,
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
    outsideMarginMin: SPACING_RULES_MM.outsideMargin.min,
    width,
    height: rules.outerHeight,
    rawContentWidth,
    dxfReference: rules.reference,
    outerCornerRadius: rules.outerCornerRadius,
    innerCornerRadius: rules.innerCornerRadius,
    innerInset: rules.innerInset,
    innerHeight: rules.innerHeight,
    euroX: rules.euro.x,
    euroWidth: rules.euro.width,
    euroHeight: rules.euro.height,
    characterBandY: getCharacterBand(rules).y,
    characterBandHeight: getCharacterBand(rules).height,
    characterFontSize: font.fontSize,
    characterBaselineY: font.baselineY,
    fontFitMode: options.fontFit?.mode || "manual",
    fontFitVisibleHeight: options.fontFit?.measured?.visibleHeight ?? null,
    fontFitTopY: options.fontFit?.measured?.topY ?? null,
    fontFitBottomY: options.fontFit?.measured?.bottomY ?? null,
    sealColumnWidth: layout.actualSealColumnWidth,
    sealColumnRange: layout.actualSealColumnRangeLabel,
    sealColumnRule: layout.sealColumnRule,
    sealColumnMaxWidth: rules.content.seal.columnMaxWidth,
    huDiameter: rules.content.seal.huDiameter,
    huCenterY: rules.content.seal.huCenterY,
    authorityDiameter: rules.content.seal.authorityDiameter,
    authorityCenterY: rules.content.seal.authorityCenterY,
    sealVisibleCircleGap: rules.content.seal.visibleCircleGap,
    sealAdjacentGapPolicy: "none - solved seal column is the complete measured area between adjacent character cells",
    sealCenterX: sealGeometry?.cx ?? null,
    remainingLeft: layout.sideMarginLeft,
    remainingRight: layout.sideMarginRight,
    modelUnit: "mm",
    modelNote: "Pure mm model. The viewer may scale the complete SVG, but the model never sees pixels."
  };

  return { parsed, rules, font, content: positioned, metrics };
}

export function renderPlateSvgMm(input, options = {}) {
  const model = buildPlateModelMm(input, options);
  const { rules, metrics } = model;
  const stage = options.stage || "complete";
  const showDimensions = options.showDimensions !== false;
  const showDxfReferenceGuides = options.showDxfReferenceGuides !== false;
  const showGrid = options.showGrid !== false;
  const showSeals = options.showSeals !== false;
  const showText = options.showText !== false;
  const layers = [];

  layers.push(renderBody(model));

  if (showDxfReferenceGuides && ["dxf", "grid", "seals", "text", "horizontal", "complete"].includes(stage)) {
    layers.push(renderDxfReferenceGuides(model));
  }
  if (showGrid && ["grid", "seals", "text", "horizontal", "complete"].includes(stage)) {
    layers.push(renderGrid(model));
  }
  if (showSeals && ["seals", "text", "horizontal", "complete"].includes(stage)) {
    layers.push(renderSeals(model, options));
  }
  if (showText && ["text", "horizontal", "complete"].includes(stage)) {
    layers.push(renderText(model));
  }
  if (stage === "horizontal") {
    layers.push(renderHorizontalDiagnostics(model));
  }
  if (showDimensions) {
    layers.push(renderDimensions(model));
  }

  const canvas = getCanvasMm(model, showDimensions);
  const extraDefs = String(options.extraDefs || "").trim();
  const svg = `
<svg class="physical-plate-svg" data-model-unit="mm" data-plate-width-mm="${metrics.width}" data-plate-height-mm="${rules.outerHeight}" viewBox="${canvas.x} ${canvas.y} ${canvas.width} ${canvas.height}" role="img" aria-label="Kennzeichen ${escapeAttr(metrics.normalized)}" preserveAspectRatio="xMidYMid meet">
  <defs>
    ${extraDefs}
    <filter id="plateShadow" x="-5%" y="-20%" width="110%" height="140%">
      <feDropShadow dx="0" dy="0.8" stdDeviation="0.8" flood-color="black" flood-opacity="0.28"/>
    </filter>
  </defs>
  ${layers.join("\n  ")}
</svg>`.trim();

  return { svg, model, canvas };
}

export function getCanvasMm(model, showDimensions = true) {
  const { rules, metrics } = model;
  if (!showDimensions) {
    return { x: 0, y: 0, width: metrics.width, height: rules.outerHeight };
  }
  return {
    x: 0,
    y: 0,
    width: metrics.width + rules.dimensions.enabledMarginRight,
    height: rules.outerHeight + rules.dimensions.enabledMarginBottom
  };
}

function resolveWidthCapMm(widthMode, fallback) {
  const number = Number(widthMode);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function resolveWidthStrategy(widthMode) {
  if (widthMode === "balanced") return "balanced";
  if (widthMode === "auto" || !widthMode) return "compact";
  return "fixed";
}

function withSpecialIWidth(font, specialIWidth) {
  return {
    ...font,
    specialWidths: {
      ...(font.specialWidths || {}),
      I: specialIWidth
    }
  };
}

function findPlateLayoutForFont(input, rules, font, fontMode, widthMode) {
  const parsed = parsePlate(input);
  const sequence = buildUnpositionedContent(parsed, rules, font);
  const strategy = resolveWidthStrategy(widthMode);
  const bands = WIDTH_BANDS[fontMode] || WIDTH_BANDS.middle;
  const fixedWidth = Number(widthMode);
  const candidateWidths = strategy === "fixed" && Number.isFinite(fixedWidth) && fixedWidth > 0 ? [fixedWidth] : bands;
  const fallbackFits = [];
  let compactEdgeFit = null;

  for (const width of candidateWidths) {
    const solved = solveContentLayout({ sequence, rules, width, strategy });
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
  return solveContentLayout({ sequence, rules, width: maxWidth, strategy, allowOverflow: true });
}

function isExactMinimumBoundaryFit(layout) {
  if (!layout?.fits) return false;
  const EPSILON = 0.01;
  const atMinimumMargins = layout.sideMarginLeft <= SPACING_RULES_MM.outsideMargin.min + EPSILON && layout.sideMarginRight <= SPACING_RULES_MM.outsideMargin.min + EPSILON;
  const sealMin = layout.actualSealColumnMinWidth ?? SPACING_RULES_MM.sealColumn.min;
  const squeezedVariables = layout.actualCharGap <= SPACING_RULES_MM.charGap.min + EPSILON
    || layout.actualGroupGap <= SPACING_RULES_MM.groupGap.min + EPSILON
    || layout.actualSealColumnWidth <= sealMin + EPSILON;
  return atMinimumMargins && squeezedVariables;
}

function buildUnpositionedContent(parsed, rules, font) {
  const districtCells = makeCells(parsed.district, font, "district");
  const recognitionGroups = splitRecognition(parsed.recognition);
  const recognitionCells = recognitionGroups.map((group, index) => ({
    type: "group",
    key: `recognition-${index}`,
    cells: makeCells(group.value, font, group.type)
  }));
  return buildContentSequence({ districtCells, recognitionCells, parsed });
}

function solveContentLayout({ sequence, rules, width, strategy, allowOverflow = false }) {
  const contentLimits = getContentLimits(rules, width);
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
    contentWidth = solvedSequence.reduce((sum, item) => sum + item.width, 0);
    reason = contentWidth > preferredContentWidth + 0.01
      ? `${modeLabel}: preferred spacing fits; free width was first distributed into variable gaps up to allowed maxima, remainder stays as equal outside margins.`
      : `${modeLabel}: preferred spacing used; outside margins distributed equally.`;
  } else if (!preferredFits && minFits) {
    solvedSequence = shrinkVariablesToFit(sequence, available - sideMin * 2);
    contentWidth = solvedSequence.reduce((sum, item) => sum + item.width, 0);
    reason = `${modeLabel}: preferred spacing does not fit; variable gaps reduced to allowed minima, outside margins remain equal.`;
  } else if (!minFits) {
    solvedSequence = sequence.map((item) => ({ ...item, width: getItemMinWidth(item) }));
    contentWidth = solvedSequence.reduce((sum, item) => sum + item.width, 0);
    reason = `${modeLabel}: minimum spacing does not fit this width.`;
  }

  const sideMargin = (available - contentWidth) / 2;
  const xStart = contentLimits.left + sideMargin;
  const positionedContent = positionContent(solvedSequence, xStart);
  const actualCharGaps = solvedSequence.filter((item) => item.type === "char-gap").map((item) => item.width);
  const actualGroupGaps = solvedSequence.filter((item) => item.type === "group-gap").map((item) => item.width);
  const actualSeal = solvedSequence.find((item) => item.type === "seals");

  return {
    fits: minFits,
    renderable: minFits || allowOverflow,
    minFits,
    preferredFits,
    maxFits,
    width,
    strategy,
    modeLabel,
    policy: "physical solver: variable gaps in min/preferred/max ranges; outside margins are equal and at least 8 mm when the layout fits",
    reason,
    availableWidth: available,
    minContentWidth,
    preferredContentWidth,
    maxContentWidth,
    minNeededWidth,
    preferredNeededWidth,
    maxNeededWidth,
    contentWidth,
    sideMarginLeft: sideMargin,
    sideMarginRight: sideMargin,
    positionedContent,
    actualCharGap: average(actualCharGaps) ?? SPACING_RULES_MM.charGap.preferred,
    actualGroupGap: average(actualGroupGaps) ?? null,
    actualSealColumnWidth: actualSeal?.width ?? rules.content.seal.columnWidth,
    actualSealColumnMinWidth: actualSeal?.minWidth ?? SPACING_RULES_MM.sealColumn.min,
    actualSealColumnRangeLabel: actualSeal ? `${formatNumber(actualSeal.minWidth)}-${formatNumber(actualSeal.maxWidth)}` : `${SPACING_RULES_MM.sealColumn.min}-${SPACING_RULES_MM.sealColumn.max}`,
    sealColumnRule: actualSeal?.ruleLabel || "Normal: seal column 63.5-67.5 mm"
  };
}

function shrinkVariablesToFit(sequence, targetContentWidth) {
  const preferredTotal = sumSequenceWidth(sequence, "preferred");
  const deficit = Math.max(0, preferredTotal - targetContentWidth);
  const variableItems = sequence.filter((item) => isVariableItem(item));
  const totalShrinkCapacity = variableItems.reduce((sum, item) => sum + Math.max(0, getItemPreferredWidth(item) - getItemMinWidth(item)), 0);
  if (!deficit || !totalShrinkCapacity) return sequence.map((item) => ({ ...item, width: getItemPreferredWidth(item) }));
  const ratio = Math.min(1, deficit / totalShrinkCapacity);
  return sequence.map((item) => {
    const preferred = getItemPreferredWidth(item);
    if (!isVariableItem(item)) return { ...item, width: preferred };
    const min = getItemMinWidth(item);
    return { ...item, width: preferred - (preferred - min) * ratio };
  });
}

function growVariablesToFit(sequence, targetContentWidth) {
  const preferredTotal = sumSequenceWidth(sequence, "preferred");
  const surplus = Math.max(0, targetContentWidth - preferredTotal);
  const variableItems = sequence.filter((item) => isVariableItem(item));
  const totalGrowCapacity = variableItems.reduce((sum, item) => sum + Math.max(0, getItemMaxWidth(item) - getItemPreferredWidth(item)), 0);
  if (!surplus || !totalGrowCapacity) return sequence.map((item) => ({ ...item, width: getItemPreferredWidth(item) }));
  const ratio = Math.min(1, surplus / totalGrowCapacity);
  return sequence.map((item) => {
    const preferred = getItemPreferredWidth(item);
    if (!isVariableItem(item)) return { ...item, width: preferred };
    const max = getItemMaxWidth(item);
    return { ...item, width: preferred + (max - preferred) * ratio };
  });
}

function sumSequenceWidth(sequence, mode) {
  return sequence.reduce((sum, item) => {
    if (mode === "min") return sum + getItemMinWidth(item);
    if (mode === "max") return sum + getItemMaxWidth(item);
    return sum + getItemPreferredWidth(item);
  }, 0);
}

function variableItem(type, key, range) {
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

function isVariableItem(item) {
  return item.variable === true;
}

function getItemMinWidth(item) {
  return isVariableItem(item) ? item.minWidth : item.width;
}

function getItemPreferredWidth(item) {
  return isVariableItem(item) ? item.preferredWidth : item.width;
}

function getItemMaxWidth(item) {
  return isVariableItem(item) ? item.maxWidth : item.width;
}

function average(values) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function neededWidthForContent(rules, contentWidth) {
  const geometry = getFixedHorizontalGeometry(rules);
  return geometry.contentLeft + contentWidth + SPACING_RULES_MM.outsideMargin.min * 2 + rules.innerInset;
}

function makeCells(text, font, role) {
  return [...String(text || "")].map((char, index) => ({
    type: "char",
    role,
    key: `${role}-${index}-${char}`,
    char,
    width: getCellWidth(char, font),
    font
  }));
}

function hasHistoricalOrElectricSuffix(parsed) {
  const recognition = String(parsed?.recognition || "").toUpperCase();
  return /\d[HE]$/.test(recognition);
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

function splitRecognition(value) {
  const normalized = String(value || "");
  const matches = normalized.match(/[A-ZÄÖÜ]+|\d+/g) || [];
  return matches.map((part) => ({
    value: part,
    type: /^\d+$/.test(part) ? "digits" : "letters"
  }));
}

function buildContentSequence({ districtCells, recognitionCells, parsed }) {
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
  return sequence;
}

function appendCells(sequence, cells) {
  cells.forEach((cell, index) => {
    if (index > 0) sequence.push(variableItem("char-gap", `${cell.role}-gap-${index}`, SPACING_RULES_MM.charGap));
    sequence.push(cell);
  });
}

function positionContent(sequence, startX) {
  let cursor = startX;
  return sequence.map((item) => {
    const positioned = { ...item, x: cursor };
    cursor += item.width;
    return positioned;
  });
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
  return { left, right, width: right - left };
}

export function getCharacterBand(rules) {
  return {
    y: rules.innerInset + rules.content.topClearance,
    height: rules.content.characterHeight
  };
}

function getSealGeometryForContent(rules, content) {
  const seal = content.find((item) => item.type === "seals");
  return seal ? getSealGeometry(rules, seal) : null;
}

function getSealGeometry(rules, sealItem) {
  const charBand = getCharacterBand(rules);
  const sealRules = rules.content.seal;
  const innerWidth = Number(sealItem.width) || sealRules.columnWidth;
  const outerWidth = Math.max(innerWidth, Math.min(sealRules.columnMaxWidth, innerWidth + (sealRules.columnMaxWidth - sealRules.columnMinWidth)));
  const outerX = sealItem.x - (outerWidth - innerWidth) / 2;
  const cx = sealItem.x + innerWidth / 2;
  const huRadius = sealRules.huDiameter / 2;
  const authorityRadius = sealRules.authorityDiameter / 2;
  return {
    cx,
    innerColumnLeft: sealItem.x,
    innerColumnRight: sealItem.x + innerWidth,
    innerColumnWidth: innerWidth,
    outerColumnLeft: outerX,
    outerColumnRight: outerX + outerWidth,
    outerColumnWidth: outerWidth,
    hu: {
      cy: sealRules.huCenterY,
      diameter: sealRules.huDiameter,
      radius: huRadius
    },
    authority: {
      cy: sealRules.authorityCenterY,
      diameter: sealRules.authorityDiameter,
      radius: authorityRadius
    },
    visibleCircleGap: sealRules.visibleCircleGap,
    charBand
  };
}

function renderBody({ rules, metrics }) {
  const w = metrics.width;
  const h = rules.outerHeight;
  const inset = rules.innerInset;
  const euro = rules.euro;
  return `
<g class="layer layer-body" filter="url(#plateShadow)">
  <rect x="0" y="0" width="${w}" height="${h}" rx="${rules.outerCornerRadius}" fill="#111"/>
  <rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${rules.innerHeight}" rx="${rules.innerCornerRadius}" fill="#f4f3ee"/>
  <rect x="${euro.x}" y="${euro.y}" width="${euro.width}" height="${euro.height}" fill="#0046ad"/>
  ${renderEuStars(euro.starsCenterX, euro.starsCenterY, euro.starsRadius)}
  <text x="${euro.countryCenterX}" y="${euro.countryBaselineY}" text-anchor="middle" font-family="DIN1451Alt, AlteDIN1451Middle script, Arial, sans-serif" font-size="30" font-weight="500" fill="#fff">${escapeText(euro.country)}</text>
</g>`.trim();
}

function renderDxfReferenceGuides({ rules, metrics }) {
  const w = metrics.width;
  const inset = rules.innerInset;
  const euro = rules.euro;
  const charBand = getCharacterBand(rules);
  return `
<g class="layer layer-dxf-guides" fill="none" stroke-linecap="square">
  <rect x="0" y="0" width="${w}" height="${rules.outerHeight}" rx="${rules.outerCornerRadius}" stroke="rgba(255,255,255,.28)" stroke-width="0.45"/>
  <rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${rules.innerHeight}" rx="${rules.innerCornerRadius}" stroke="rgba(255,255,255,.42)" stroke-width="0.45"/>
  <rect x="${euro.x}" y="${euro.y}" width="${euro.width}" height="${euro.height}" stroke="rgba(70,170,255,.8)" stroke-width="0.55"/>
  <line x1="0" y1="${charBand.y}" x2="${w}" y2="${charBand.y}" stroke="rgba(255,255,255,.22)" stroke-width="0.35"/>
  <line x1="0" y1="${charBand.y + charBand.height}" x2="${w}" y2="${charBand.y + charBand.height}" stroke="rgba(255,255,255,.22)" stroke-width="0.35"/>
</g>`.trim();
}

function renderGrid({ content, rules, metrics }) {
  const charBand = getCharacterBand(rules);
  const parts = content.map((item) => {
    if (item.type === "char") {
      return `<rect x="${item.x}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="rgba(30,165,255,.08)" stroke="rgba(30,165,255,.55)" stroke-width="0.6"/>`;
    }
    if (item.type === "seals") {
      const sealGeometry = getSealGeometry(rules, item);
      return `
        <rect x="${sealGeometry.outerColumnLeft}" y="${charBand.y}" width="${sealGeometry.outerColumnWidth}" height="${charBand.height}" fill="rgba(255,211,107,.05)" stroke="rgba(255,211,107,.5)" stroke-width="0.6" stroke-dasharray="2 1.5"/>
        <rect x="${sealGeometry.innerColumnLeft}" y="${charBand.y}" width="${sealGeometry.innerColumnWidth}" height="${charBand.height}" fill="rgba(255,211,107,.09)" stroke="rgba(255,211,107,.75)" stroke-width="0.8"/>
        <line x1="${sealGeometry.cx}" y1="${charBand.y - 8}" x2="${sealGeometry.cx}" y2="${charBand.y + charBand.height + 8}" stroke="rgba(255,211,107,.45)" stroke-width="0.5"/>
        <circle cx="${sealGeometry.cx}" cy="${sealGeometry.hu.cy}" r="${sealGeometry.hu.radius}" fill="none" stroke="rgba(255,211,107,.8)" stroke-width="0.65" stroke-dasharray="2 1.5"/>
        <circle cx="${sealGeometry.cx}" cy="${sealGeometry.authority.cy}" r="${sealGeometry.authority.radius}" fill="none" stroke="rgba(255,211,107,.8)" stroke-width="0.65" stroke-dasharray="2 1.5"/>`;
    }
    return `<rect x="${item.x}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="rgba(255,99,99,.07)" stroke="rgba(255,99,99,.4)" stroke-width="0.4"/>`;
  });
  const centerLine = `<line x1="0" y1="${rules.outerHeight / 2}" x2="${metrics.width}" y2="${rules.outerHeight / 2}" stroke="rgba(255,255,255,.35)" stroke-width="0.5" stroke-dasharray="4 3"/>`;
  return `<g class="layer layer-grid">${centerLine}${parts.join("")}</g>`;
}

function renderSeals({ content, rules }) {
  const seal = content.find((item) => item.type === "seals");
  if (!seal) return "";
  const geometry = getSealGeometry(rules, seal);
  return `
<g class="layer layer-seals">
  <g class="seal-slot seal-slot-hu">
    <circle cx="${geometry.cx}" cy="${geometry.hu.cy}" r="${geometry.hu.radius}" fill="#1ea5ff" stroke="#111" stroke-width="1.25"/>
    <circle cx="${geometry.cx}" cy="${geometry.hu.cy}" r="${geometry.hu.radius * 0.68}" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="0.8" stroke-dasharray="1.4 1.8"/>
    <text x="${geometry.cx}" y="${geometry.hu.cy + 3.3}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="700" fill="#111">HU</text>
  </g>
  <g class="seal-slot seal-slot-authority">
    <circle cx="${geometry.cx}" cy="${geometry.authority.cy}" r="${geometry.authority.radius}" fill="#d7d7d2" stroke="#999" stroke-width="1"/>
    <circle cx="${geometry.cx}" cy="${geometry.authority.cy}" r="${geometry.authority.radius * 0.55}" fill="none" stroke="rgba(120,120,115,.65)" stroke-width="1"/>
  </g>
</g>`.trim();
}

function renderText({ content, font }) {
  const glyphGuide = font.fit?.measured ? `
    <rect x="0" y="${font.fit.measured.topY}" width="100%" height="${font.fit.measured.visibleHeight}" fill="rgba(92, 214, 255, .035)" stroke="rgba(92, 214, 255, .35)" stroke-width="0.35" stroke-dasharray="2 1.5"/>` : "";
  const chars = content.filter((item) => item.type === "char").map((cell) => `
    <text x="${cell.x + cell.width / 2}" y="${font.baselineY}" text-anchor="middle" font-family="'${font.fontFamily}', Arial Narrow, sans-serif" font-size="${font.fontSize}" font-weight="400" fill="#080808">${escapeText(cell.char)}</text>`).join("");
  return `<g class="layer layer-text">${glyphGuide}${chars}</g>`;
}


function renderHorizontalDiagnostics({ content, rules }) {
  const charBand = getCharacterBand(rules);
  const yTop = Math.max(0, charBand.y - 6);
  const yBottom = Math.min(rules.outerHeight, charBand.y + charBand.height + 6);
  const labelY = Math.max(6, charBand.y - 2.5);
  const parts = [];

  for (const item of content) {
    const x1 = item.x;
    const x2 = item.x + item.width;
    const cx = x1 + item.width / 2;

    if (item.type === "char") {
      parts.push(`<line x1="${x1}" y1="${yTop}" x2="${x1}" y2="${yBottom}" stroke="rgba(30,165,255,.9)" stroke-width="0.45"/>`);
      parts.push(`<line x1="${x2}" y1="${yTop}" x2="${x2}" y2="${yBottom}" stroke="rgba(30,165,255,.9)" stroke-width="0.45"/>`);
      parts.push(`<line x1="${cx}" y1="${yTop - 2}" x2="${cx}" y2="${yBottom + 2}" stroke="rgba(255,255,255,.7)" stroke-width="0.35" stroke-dasharray="1.5 1"/>`);
      parts.push(`<text x="${cx}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="4.3" fill="#1ea5ff">${escapeText(item.char)} · ${formatMm(item.width)}</text>`);
      continue;
    }

    if (item.type === "seals") {
      const geometry = getSealGeometry(rules, item);
      parts.push(`<line x1="${geometry.innerColumnLeft}" y1="${yTop}" x2="${geometry.innerColumnLeft}" y2="${yBottom}" stroke="rgba(255,211,107,.95)" stroke-width="0.55"/>`);
      parts.push(`<line x1="${geometry.innerColumnRight}" y1="${yTop}" x2="${geometry.innerColumnRight}" y2="${yBottom}" stroke="rgba(255,211,107,.95)" stroke-width="0.55"/>`);
      parts.push(`<line x1="${geometry.cx}" y1="${yTop - 3}" x2="${geometry.cx}" y2="${yBottom + 3}" stroke="rgba(255,211,107,.8)" stroke-width="0.4" stroke-dasharray="1.5 1"/>`);
      parts.push(`<text x="${geometry.cx}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="4.3" fill="#ffd36b">Seal · ${formatMm(geometry.innerColumnWidth)}</text>`);
      continue;
    }

    parts.push(`<rect x="${x1}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="rgba(255,99,99,.03)" stroke="rgba(255,99,99,.55)" stroke-width="0.35" stroke-dasharray="1.5 1"/>`);
    parts.push(`<text x="${cx}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="3.6" fill="#ff7777">${formatMm(item.width)}</text>`);
  }

  return `<g class="layer layer-horizontal-diagnostics">${parts.join("")}</g>`;
}

function renderDimensions(model) {
  const { metrics, rules, content } = model;
  const h = rules.outerHeight;
  const w = metrics.width;
  const y = h + rules.dimensions.baselineOffset;
  const localDimensions = renderSolvedSpacingDimensions(model);
  return `
<g class="layer layer-dimensions" font-family="Arial, sans-serif" font-size="5" fill="#333" stroke="#333" stroke-width="0.45">
  <line x1="0" y1="${y}" x2="${w}" y2="${y}"/>
  <line x1="0" y1="${y - 3}" x2="0" y2="${y + 3}"/>
  <line x1="${w}" y1="${y - 3}" x2="${w}" y2="${y + 3}"/>
  <text x="${w / 2}" y="${y + 8}" text-anchor="middle">${w} mm</text>
  <line x1="${w + 14}" y1="0" x2="${w + 14}" y2="${h}"/>
  <line x1="${w + 11}" y1="0" x2="${w + 17}" y2="0"/>
  <line x1="${w + 11}" y1="${h}" x2="${w + 17}" y2="${h}"/>
  <text x="${w + 23}" y="${h / 2}" dominant-baseline="middle">${h} mm</text>
  ${localDimensions}
</g>`.trim();
}

function renderSolvedSpacingDimensions({ content, rules, metrics }) {
  const charBand = getCharacterBand(rules);
  const contentLimits = getContentLimits(rules, metrics.width);
  const first = content[0];
  const last = content[content.length - 1];
  const lines = [];
  const add = (x1, x2, y, label, color, options = {}) => {
    if (!Number.isFinite(x1) || !Number.isFinite(x2) || Math.abs(x2 - x1) < 0.25) return;
    const left = Math.min(x1, x2);
    const right = Math.max(x1, x2);
    const tick = options.tick ?? 2.4;
    const labelOffset = options.labelOffset ?? -1.2;
    const textY = y + labelOffset;
    const opacity = options.opacity ?? 0.95;
    lines.push(`
      <g class="dimension dimension-${escapeAttr(options.kind || "spacing")}" opacity="${opacity}">
        <line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="${color}" stroke-width="0.55"/>
        <line x1="${left}" y1="${y - tick}" x2="${left}" y2="${y + tick}" stroke="${color}" stroke-width="0.55"/>
        <line x1="${right}" y1="${y - tick}" x2="${right}" y2="${y + tick}" stroke="${color}" stroke-width="0.55"/>
        <text x="${(left + right) / 2}" y="${textY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${options.fontSize || 3.9}" fill="${color}" stroke="none">${escapeText(label)}</text>
      </g>`);
  };

  if (first && last) {
    const leftMargin = first.x - contentLimits.left;
    const rightMargin = contentLimits.right - (last.x + last.width);
    add(contentLimits.left, first.x, charBand.y + charBand.height + 9, `Margin ${formatMm(leftMargin)}`, "#6de28d", { kind: "outside-margin", labelOffset: 5.4, fontSize: 3.7 });
    add(last.x + last.width, contentLimits.right, charBand.y + charBand.height + 9, `Margin ${formatMm(rightMargin)}`, "#6de28d", { kind: "outside-margin", labelOffset: 5.4, fontSize: 3.7 });
  }

  let charGapIndex = 0;
  let groupGapIndex = 0;
  for (const item of content) {
    const x1 = item.x;
    const x2 = item.x + item.width;
    if (item.type === "seals") {
      add(x1, x2, charBand.y - 7.5, `Seal ${formatMm(item.width)}`, "#ffd36b", { kind: "seal-column", labelOffset: -1.8, fontSize: 4.0 });
      continue;
    }
    if (item.type === "group-gap") {
      groupGapIndex += 1;
      add(x1, x2, charBand.y - 13.5, `Group ${formatMm(item.width)}`, "#ff7777", { kind: "group-gap", labelOffset: -1.8, fontSize: 3.8 });
      continue;
    }
    if (item.type === "char-gap") {
      charGapIndex += 1;
      add(x1, x2, charBand.y + charBand.height + 4.2, formatMm(item.width), "#7fd3ff", { kind: "char-gap", labelOffset: 5.1, fontSize: 3.3, opacity: 0.75, tick: 1.8 });
    }
  }

  return `<g class="layer layer-solved-dimensions">${lines.join("")}
  </g>`;
}

function renderEuStars(cx, cy, r) {
  const stars = [];
  for (let i = 0; i < 12; i += 1) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / 12;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    stars.push(`<text x="${x.toFixed(2)}" y="${(y + 1.6).toFixed(2)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="#ffd200">●</text>`);
  }
  return `<g class="eu-stars">${stars.join("")}</g>`;
}

function formatNumber(value) {
  return Number(value).toLocaleString("de-DE", { maximumFractionDigits: 1 });
}

function formatMm(value) {
  return `${formatNumber(value)} mm`;
}

function getCellWidth(char, font) {
  const normalized = String(char || "").toUpperCase();
  const specialWidth = font.specialWidths?.[normalized];
  if (Number.isFinite(Number(specialWidth)) && Number(specialWidth) > 0) return Number(specialWidth);
  return isDigit(normalized) ? font.digitWidth : font.letterWidth;
}

function isDigit(char) {
  return /\d/.test(char);
}

function positiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function escapeText(value) {
  return String(value).replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]));
}

function escapeAttr(value) {
  return escapeText(value).replace(/"/g, "&quot;");
}
