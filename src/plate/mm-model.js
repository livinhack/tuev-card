// Kennzeichen Physical Lab b157 / shared plate physical mm model
// CAD-like model layer: every coordinate, size and distance in this file is millimetres.
// No CSS pixels, devicePixelRatio, browser zoom or monitor calibration are used here.
// Shared CAD-like plate model used by the Physical Lab and the production Card renderer. b157 keeps the b156 geometry and adds a Physical-Lab regression/preset matrix for the known one-line/two-line standard, H/E, season and green variants: final H/E suffix plates use the 20-30 mm bottom-row group-gap rule and the balanced bottom-row surface solver both with and without a season field.


export const PLATE_TEXT_COLORS_MM = Object.freeze({
  black: {
    key: "black",
    label: "Standard black",
    color: "#080808",
    note: "Standard German plate text colour used for normal white plates."
  },
  green: {
    key: "green",
    label: "Green plate · RAL 6001 approximation",
    color: "#287233",
    note: "Project approximation for German green plates: green text on otherwise normal white plate geometry. Intended for standard plates, not combined with H/E or season."
  }
});

export const WIDTH_BANDS = Object.freeze({
  middle: [340, 380, 420, 460, 480, 520],
  narrow: [320, 340, 380, 420, 460, 480, 520]
});

export const TWO_LINE_WIDTH_BANDS = Object.freeze({
  middle: [260, 280, 320, 340],
  narrow: [260, 280, 320, 340]
});

export const SPACING_RULES_MM = Object.freeze({
  outsideMargin: { min: 8 },
  charGap: { min: 8, preferred: 9, max: 10 },
  groupGap: { min: 20, preferred: 24, max: 30 },
  twoLineBottomGroupGap: { min: 24, preferred: 24, max: 30, ruleLabel: "Two-line bottom row group gap: 24-30 mm" },
  twoLineBottomGroupGapHistoricalOrElectric: { min: 20, preferred: 24, max: 30, ruleLabel: "Two-line H/E suffix row group gap: 20-30 mm for the complete bottom row" },
  twoLineTopSealGap: { min: 8, preferred: 25, max: 25, ruleLabel: "Two-line top row district-to-seal gap: 8-25 mm" },
  twoLineSeasonGap: { min: 8, preferred: 8, max: 8, ruleLabel: "Two-line season star gap: at least 8 mm; balanced with the other top-row spacing surfaces" },
  oneLineSeasonGap: { min: 8, preferred: 8, max: 8, ruleLabel: "One-line season star gap: at least 8 mm; balanced with the one-line seasonal spacing surfaces" },
  sealColumn: { min: 63.5, preferred: 63.5, max: 67.5 },
  sealColumnHistoricalOrElectric: { min: 58, preferred: 63.5, max: 67.5 },
  autoWidth: {
    compact: "smallest width that satisfies all minimum spacings and equal outside margins",
    balanced: "smallest width that satisfies preferred spacings and equal outside margins"
  }
});

export const FONT_CALIBRATION_PROFILES_MM = Object.freeze({
  middleManualB108: {
    label: "GL middle script · manually calibrated b128/b130/b134/b135/b136/b137/b138/b140/b141/b142/b143/b144/b145/b146/b147/b151/b152/b155/b156/b157/b157",
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
    innerTopClearance: 17,
    starsBoxHeight: 30,
    starsToCountryGap: 17,
    countryBoxHeight: 20,
    innerBottomClearance: 17,
    starsCenterX: 27,
    starsCenterY: 36.5,
    starsRadius: 15,
    countryCenterX: 27,
    countryCenterY: 78.5,
    countryBaselineY: 88.5,
    countryFontSize: 27,
    countryFontWeight: 400,
    countryDominantBaseline: "central"
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
  layoutType: "one-line",
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
    },
    season: {
      enabledDefault: false,
      fieldWidth: 30,
      monthBoxHeight: 20,
      targetDigitHeight: 20,
      contentHeight: 75,
      separatorHeight: 3.25,
      separatorInset: 0,
      fontFamily: "DIN1451Alt, AlteDIN1451Mittelschrift, AlteDIN1451Middle script, Arial, sans-serif",
      fontSize: 28,
      fontWeight: 400,
      widthScale: 1,
      digitGap: 1.5,
      digitSlotWidth: 12.5,
      digitSlotFontSize: 28,
      upperBaselineY: 37.5,
      ruleLabel: "One-line seasonal validity field: 30 x 75 mm field; two explicit 30 x 20 mm DIN month fields aligned to the 75 mm character band; 30 x 3.25 mm separator bar is vertically centered; each month is constructed as font-size-scaled digit width + configured gap + font-size-scaled digit width and that constructed width is centered in the 30 mm field; season field is surrounded by Anlage-4 star spacing surfaces"
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


export const TWO_LINE_RULES_MM = Object.freeze({
  name: "Two-line standard plate",
  layoutType: "two-line",
  reference: "Anlage 4 FZV Abschnitt 2 Nummer 2 / Euro two-line reference",
  outerHeight: 200,
  maxWidth: 340,
  twoAndThreeWheelMaxWidth: 280,
  innerInset: 4.5,
  innerHeight: 191,
  outerCornerRadius: 9.25,
  innerCornerRadius: 4.75,
  euro: {
    x: 4.5,
    y: 4.5,
    width: 40,
    height: 88,
    innerTopClearance: 10,
    starsBoxHeight: 30,
    starsToCountryGap: 17,
    countryBoxHeight: 20,
    innerBottomClearance: 11,
    starsCenterX: 24.5,
    starsCenterY: 29.5,
    starsRadius: 13.5,
    countryCenterX: 24.5,
    countryCenterY: 71.5,
    countryBaselineY: 81.5,
    countryFontSize: 27,
    countryFontWeight: 400,
    countryDominantBaseline: "central",
    country: "D"
  },
  content: {
    sideClearance: SPACING_RULES_MM.outsideMargin.min,
    topRow: {
      label: "Top row: district and seal fields",
      y: 17.5,
      characterHeight: 75,
      baselineY: 92.5
    },
    bottomRow: {
      label: "Bottom row: recognition number",
      y: 107.5,
      characterHeight: 75,
      baselineY: 182.5
    },
    charGap: SPACING_RULES_MM.charGap,
    groupGap: SPACING_RULES_MM.groupGap,
    seal: {
      columnMinWidth: 35,
      columnWidth: 45,
      columnMaxWidth: 45,
      huDiameter: DXF_REFERENCE_MM.seals.huDiameter,
      huCenterY: DXF_REFERENCE_MM.seals.huCenterY,
      authorityDiameter: DXF_REFERENCE_MM.seals.authorityDiameter,
      authorityCenterY: DXF_REFERENCE_MM.seals.authorityCenterY,
      visibleCircleGap: DXF_REFERENCE_MM.seals.visibleCircleGap,
      ruleLabel: "Two-line seal field: 45 mm column; vertical centers aligned to the one-line top reference"
    },
    season: {
      enabledDefault: false,
      fieldWidth: 30,
      monthBoxHeight: 20,
      targetDigitHeight: 20,
      contentHeight: 75,
      separatorHeight: 3.25,
      separatorInset: 0,
      fontFamily: "DIN1451Alt, AlteDIN1451Mittelschrift, AlteDIN1451Middle script, Arial, sans-serif",
      fontSize: 28,
      fontWeight: 400,
      widthScale: 1,
      digitGap: 1.5,
      digitSlotWidth: 12.5,
      digitSlotFontSize: 28,
      upperBaselineY: 37.5,
      ruleLabel: "Two-line seasonal validity field: two explicit 30 x 20 mm DIN month fields; upper field top aligns with the top-row character field, lower field bottom aligns with the top-row character field bottom; 30 x 3.25 mm separator bar is vertically centered; visible DIN glyph BBox is calibrated separately from field size; season typography has independent width factor and 1.5 mm default digit gap controls; each month is constructed as font-size-scaled digit width + configured gap + font-size-scaled digit width and that constructed width is centered in the 30-mm field without any post-render auto-centering; season star gap is balanced by the top-row solver"
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
    enabledMarginRight: 42,
    enabledMarginBottom: 34,
    baselineOffset: 20
  }
});

export function resolvePlateRules(plateFormat = "oneLine") {
  return plateFormat === "twoLine" || plateFormat === "two-line" ? TWO_LINE_RULES_MM : ONE_LINE_RULES_MM;
}

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
  const rules = resolvePlateRules(options.plateFormat);
  if (rules.layoutType === "two-line") {
    return resolveTwoLinePlateFontMode(input, options, rules);
  }
  const requestedFontMode = options.fontMode === "auto" ? "auto" : options.fontMode === "narrow" ? "narrow" : "middle";
  const specialIWidth = positiveNumber(options.specialIWidth, rules.cells.middle.specialWidths?.I || rules.cells.middle.letterWidth);
  const middleFont = withSpecialIWidth(rules.cells.middle, specialIWidth);
  const narrowFont = withSpecialIWidth(rules.cells.narrow, specialIWidth);
  const season = resolveSeasonOptions(options.season, rules);
  const middleLayout = findPlateLayoutForFont(input, rules, middleFont, "middle", options.widthMode, season);
  const narrowLayout = findPlateLayoutForFont(input, rules, narrowFont, "narrow", options.widthMode, season);
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
  const rules = resolvePlateRules(options.plateFormat);
  if (rules.layoutType === "two-line") {
    return buildTwoLinePlateModelMm(input, options, rules);
  }
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
  const layout = findPlateLayoutForFont(input, effectiveRules, font, fontMode, options.widthMode, season);
  const positioned = layout.positionedContent;
  const width = layout.width;
  const rawContentWidth = layout.contentWidth;
  const sealGeometry = getSealGeometryForContent(effectiveRules, positioned);
  const metrics = {
    input,
    normalized: parsed.normalized,
    district: parsed.district,
    recognition: parsed.recognition,
    plateColorMode: visualStyle.key,
    plateColorLabel: visualStyle.label,
    textColor: visualStyle.color,
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
    outsideMarginMin: SPACING_RULES_MM.outsideMargin.min,
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
    euroCountryBaselineY: effectiveRules.euro.countryBaselineY ?? null,
    euroCountryCenterY: effectiveRules.euro.countryCenterY ?? null,
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
    seasonFieldX: season.enabled ? positioned.find((item) => item.type === "season-field")?.x ?? null : null,
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
    sealVisibleCircleGap: effectiveRules.content.seal.visibleCircleGap,
    sealAdjacentGapPolicy: "none - solved seal column is the complete measured area between adjacent character cells",
    sealCenterX: sealGeometry?.cx ?? null,
    remainingLeft: layout.sideMarginLeft,
    remainingRight: layout.sideMarginRight,
    modelUnit: "mm",
    modelNote: "Pure mm model. The viewer may scale the complete SVG, but the model never sees pixels."
  };

  return { parsed, rules: effectiveRules, font, content: positioned, metrics };
}


function resolveTwoLinePlateFontMode(input, options = {}, rules = TWO_LINE_RULES_MM) {
  const requestedFontMode = options.fontMode === "auto" ? "auto" : options.fontMode === "narrow" ? "narrow" : "middle";
  const specialIWidth = positiveNumber(options.specialIWidth, rules.cells.middle.specialWidths?.I || rules.cells.middle.letterWidth);
  const middleFont = withSpecialIWidth(rules.cells.middle, specialIWidth);
  const narrowFont = withSpecialIWidth(rules.cells.narrow, specialIWidth);
  const season = resolveSeasonOptions(options.season);
  const middleLayout = findTwoLinePlateLayoutForFont(input, rules, middleFont, "middle", options.widthMode, season);
  const narrowLayout = findTwoLinePlateLayoutForFont(input, rules, narrowFont, "narrow", options.widthMode, season);
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
      reason: "Auto: Zweizeilig Middle script passt in obere und untere Zeile; Narrow script wird nicht verwendet.",
      policy: "two-line middle-first; narrow only if one of the rows cannot satisfy the layout solver",
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
      ? "Auto: Zweizeilig Middle script passt nicht in beide Zeilen; Narrow script wird als Ausweichschrift gewählt."
      : "Auto: Zweizeilig Middle script passt nicht; Narrow script wird gewählt, passt aber ebenfalls nicht vollständig in die aktuelle Breitenbegrenzung.",
    policy: "two-line middle-first; narrow only if one of the rows cannot satisfy the layout solver",
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

function buildTwoLinePlateModelMm(input, options = {}, rules = TWO_LINE_RULES_MM) {
  const fontResolution = resolvePlateFontMode(input, {
    plateFormat: "twoLine",
    fontMode: options.fontMode,
    widthMode: options.widthMode,
    specialIWidth: options.specialIWidth,
    season: options.season
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
  const visualStyle = resolveVisualStyle(options.visualStyle);
  const season = resolveSeasonOptions(resolveSeasonForVisualStyle(options.season, visualStyle));
  rules = resolveRulesForSeason(rules, season);
  const layout = findTwoLinePlateLayoutForFont(input, rules, font, fontMode, options.widthMode, season);
  const positioned = layout.positionedContent;
  const sealGeometry = getSealGeometryForContent(rules, positioned);
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
    textColorNote: visualStyle.note,
    requestedFontMode: fontResolution.requestedFontMode,
    fontMode,
    fontLabel: font.label,
    fontFamily: font.fontFamily,
    plateFormat: "twoLine",
    plateFormatLabel: rules.name,
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
    outsideMarginMin: SPACING_RULES_MM.outsideMargin.min,
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
    euroCountryBaselineY: rules.euro.countryBaselineY ?? null,
    euroCountryCenterY: rules.euro.countryCenterY ?? null,
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
    sealVisibleCircleGap: rules.content.seal.visibleCircleGap,
    sealAdjacentGapPolicy: "top row: balanced *, **, 8-25 mm seal gap and season star gap where present; bottom row uses recognition group gaps",
    topSealGap: layout.actualTopSealGap,
    seasonGap: layout.actualSeasonGap,
    seasonGapRange: season.enabled ? `>=${formatNumber(SPACING_RULES_MM.twoLineSeasonGap.min)}` : null,
    seasonFieldWidth: season.enabled ? rules.content.season.fieldWidth : null,
    seasonFieldX: layout.seasonField?.x ?? null,
    seasonFieldY: season.enabled ? topBand.y : null,
    seasonFieldHeight: season.enabled ? topBand.height : null,
    seasonUpperFieldY: season.enabled ? topBand.y : null,
    seasonLowerFieldY: season.enabled ? topBand.y + topBand.height - rules.content.season.monthBoxHeight : null,
    seasonMonthBoxHeight: season.enabled ? rules.content.season.monthBoxHeight : null,
    seasonTargetDigitHeight: season.enabled ? rules.content.season.targetDigitHeight : null,
    seasonFontFamily: season.enabled ? rules.content.season.fontFamily : null,
    seasonFontSize: season.enabled ? rules.content.season.fontSize : null,
    seasonUpperBaselineY: season.enabled ? rules.content.season.upperBaselineY : null,
    seasonWidthScale: season.enabled ? rules.content.season.widthScale : null,
    seasonDigitGap: season.enabled ? rules.content.season.digitGap : null,
    seasonLowerBaselineY: season.enabled ? rules.content.season.upperBaselineY + (topBand.height - rules.content.season.monthBoxHeight) : null,
    seasonContentHeight: season.enabled ? rules.content.season.contentHeight : null,
    seasonSeparatorHeight: season.enabled ? rules.content.season.separatorHeight : null,
    seasonRule: season.enabled ? rules.content.season.ruleLabel : "No seasonal field",
    topSealGapRange: `${formatNumber(SPACING_RULES_MM.twoLineTopSealGap.min)}-${formatNumber(SPACING_RULES_MM.twoLineTopSealGap.max)}`,
    sealCenterX: sealGeometry?.cx ?? null,
    remainingLeft: layout.bottom.sideMarginLeft,
    remainingRight: layout.bottom.sideMarginRight,
    modelUnit: "mm",
    modelNote: "Pure mm model. The viewer may scale the complete SVG, but the model never sees pixels."
  };

  return { parsed, rules, font, content: positioned, metrics };
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

function findTwoLinePlateLayoutForFont(input, rules, font, fontMode, widthMode, season = resolveSeasonOptions()) {
  const parsed = parsePlate(input);
  const topSequence = buildTwoLineTopSequence(parsed, rules, font, season);
  const bottomSequence = buildTwoLineBottomSequence(parsed, rules, font);
  const strategy = resolveWidthStrategy(widthMode);
  const bands = TWO_LINE_WIDTH_BANDS[fontMode] || TWO_LINE_WIDTH_BANDS.middle;
  const fixedWidth = Number(widthMode);
  const candidateWidths = strategy === "fixed" && Number.isFinite(fixedWidth) && fixedWidth > 0 ? [fixedWidth] : bands;
  const fallbackFits = [];
  let compactEdgeFit = null;

  for (const width of candidateWidths) {
    const solved = solveTwoLineContentLayout({ topSequence, bottomSequence, rules, width, strategy, font, parsed, season });
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
  return solveTwoLineContentLayout({ topSequence, bottomSequence, rules, width: maxWidth, strategy, allowOverflow: true, font, parsed, season });
}

function solveTwoLineContentLayout({ topSequence, bottomSequence, rules, width, strategy, allowOverflow = false, font = null, parsed = null, season = resolveSeasonOptions() }) {
  const topLimits = getTwoLineTopContentLimits(rules, width);
  const bottomLimits = getTwoLineBottomContentLimits(rules, width);
  const top = solveTwoLineTopContentLayout({ sequence: topSequence, rules, width, strategy, allowOverflow, contentLimits: topLimits });
  const bottom = solveTwoLineBottomContentLayout({ sequence: bottomSequence, rules, width, strategy, allowOverflow, contentLimits: bottomLimits, parsed, season });
  const topPositioned = applyTwoLineRowMetadata(top.positionedContent, "top", rules, topLimits, font);
  const bottomPositioned = applyTwoLineRowMetadata(bottom.positionedContent, "bottom", rules, bottomLimits, font);
  const actualCharGaps = [...topPositioned, ...bottomPositioned].filter((item) => item.type === "char-gap").map((item) => item.width);
  const actualGroupGaps = bottomPositioned.filter((item) => item.type === "group-gap").map((item) => item.width);
  const topSeal = topPositioned.find((item) => item.type === "seals");
  const topSealGap = topPositioned.find((item) => item.type === "seal-gap");
  const seasonGap = topPositioned.find((item) => item.type === "season-gap");
  const seasonField = topPositioned.find((item) => item.type === "season-field");
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
  const reason = `${modeLabel}: top row uses balanced spacing surfaces (*, **, 8-25 mm and season star gap where present); ${bottomPolicy}`;

  return {
    fits,
    renderable: fits || allowOverflow,
    minFits: top.minFits && bottom.minFits,
    preferredFits,
    maxFits,
    width,
    strategy,
    modeLabel,
    policy: "two-line physical solver: top row is district plus seal field after Euro; bottom row is recognition across the full plate width; variable gaps stay in Anlage-4 ranges",
    reason,
    availableWidth: Math.min(top.availableWidth, bottom.availableWidth),
    minContentWidth: Math.max(top.minContentWidth, bottom.minContentWidth),
    preferredContentWidth: Math.max(top.preferredContentWidth, bottom.preferredContentWidth),
    maxContentWidth: Math.max(top.maxContentWidth, bottom.maxContentWidth),
    minNeededWidth,
    preferredNeededWidth,
    maxNeededWidth,
    contentWidth: Math.max(top.contentWidth, bottom.contentWidth),
    positionedContent: [...topPositioned, ...bottomPositioned],
    actualCharGap: average(actualCharGaps) ?? SPACING_RULES_MM.charGap.preferred,
    actualGroupGap: average(actualGroupGaps) ?? null,
    groupGapRangeLabel: getVariableRangeLabel(bottomPositioned.find((item) => item.type === "group-gap"), SPACING_RULES_MM.groupGap),
    groupGapRule: bottomPositioned.find((item) => item.type === "group-gap")?.ruleLabel || null,
    top,
    bottom,
    actualSealColumnWidth: topSeal?.width ?? rules.content.seal.columnWidth,
    actualTopSealGap: topSealGap?.width ?? null,
    actualSeasonGap: seasonGap?.width ?? null,
    seasonField: seasonField || null,
    topSealGapRange: `${formatNumber(SPACING_RULES_MM.twoLineTopSealGap.min)}-${formatNumber(SPACING_RULES_MM.twoLineTopSealGap.max)}`,
    rowDiagnostics: [
      { key: "top", label: rules.content.topRow.label, left: topLimits.left, right: topLimits.right, marginLeft: top.sideMarginLeft, marginRight: top.sideMarginRight, contentWidth: top.contentWidth },
      { key: "bottom", label: rules.content.bottomRow.label, left: bottomLimits.left, right: bottomLimits.right, marginLeft: bottom.sideMarginLeft, marginRight: bottom.sideMarginRight, contentWidth: bottom.contentWidth }
    ]
  };
}

function buildTwoLineTopSequence(parsed, rules, font, season = resolveSeasonOptions()) {
  const sequence = [];
  const districtCells = makeCells(parsed.district, font, "district");
  appendCells(sequence, districtCells);
  if (districtCells.length) {
    sequence.push(variableItem("seal-gap", "top-seal-gap", SPACING_RULES_MM.twoLineTopSealGap));
  }
  sequence.push(variableItem("seals", "top-seal-zone", {
    min: rules.content.seal.columnMinWidth,
    preferred: rules.content.seal.columnWidth,
    max: rules.content.seal.columnMaxWidth,
    ruleLabel: rules.content.seal.ruleLabel
  }));
  if (season.enabled) {
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

function buildTwoLineBottomSequence(parsed, rules, font) {
  const sequence = [];
  const recognitionGroups = splitRecognition(parsed.recognition);
  recognitionGroups.forEach((group, groupIndex) => {
    if (groupIndex > 0) {
      sequence.push(variableItem("group-gap", `bottom-recognition-group-gap-${groupIndex}`, getTwoLineBottomGroupGapRange(parsed)));
    }
    appendCells(sequence, makeCells(group.value, font, group.type));
  });
  return sequence;
}

function applyTwoLineRowMetadata(items, rowKey, rules, contentLimits, font = null) {
  const band = getTwoLineCharacterBand(rules, rowKey, font?.baselineY);
  return items.map((item) => ({
    ...item,
    rowKey,
    bandY: band.y,
    bandHeight: band.height,
    baselineY: item.type === "char" ? band.baselineY : null,
    contentLimits
  }));
}

function getTwoLineTopContentLimits(rules, width) {
  const left = rules.euro.x + rules.euro.width;
  const right = width - rules.innerInset;
  return { left, right, width: right - left };
}

function getTwoLineBottomContentLimits(rules, width) {
  const left = rules.innerInset;
  const right = width - rules.innerInset;
  return { left, right, width: right - left };
}


function solveTwoLineTopContentLayout({ sequence, rules, width, strategy, allowOverflow = false, contentLimits }) {
  const available = contentLimits.width;
  const sideMin = SPACING_RULES_MM.outsideMargin.min;
  const modeLabel = strategy === "balanced" ? "Two-line top auto balanced" : strategy === "compact" ? "Two-line top auto compact" : "Two-line top fixed width";
  const fixedWidth = sequence.reduce((sum, item) => sum + (isTopRowSpacingItem(item) || item.type === "seals" ? 0 : item.width), 0);
  const sealItems = sequence.filter((item) => item.type === "seals");
  const spacingItems = sequence.filter((item) => isTopRowSpacingItem(item));
  const minSealWidth = sealItems.reduce((sum, item) => sum + getItemMinWidth(item), 0);
  const preferredSealWidth = sealItems.reduce((sum, item) => sum + getItemPreferredWidth(item), 0);
  const minSpacingWidth = spacingItems.reduce((sum, item) => sum + getTopRowSpacingMinWidth(item), 0) + sideMin * 2;
  const preferredSpacingWidth = spacingItems.reduce((sum, item) => sum + getTopRowSpacingPreferredWidth(item), 0) + sideMin * 2;
  const cappedMaxSpacingWidth = spacingItems.reduce((sum, item) => sum + getTopRowSpacingFiniteMaxWidth(item), 0) + sideMin * 2;
  const minContentWidth = fixedWidth + minSealWidth + spacingItems.reduce((sum, item) => sum + getTopRowSpacingMinWidth(item), 0);
  const preferredContentWidth = fixedWidth + preferredSealWidth + spacingItems.reduce((sum, item) => sum + getTopRowSpacingPreferredWidth(item), 0);
  const maxContentWidth = fixedWidth + preferredSealWidth + spacingItems.reduce((sum, item) => sum + getTopRowSpacingFiniteMaxWidth(item), 0);
  const minFits = fixedWidth + minSealWidth + minSpacingWidth <= available + 0.0001;
  const preferredFits = fixedWidth + preferredSealWidth + preferredSpacingWidth <= available + 0.0001;
  const maxFits = fixedWidth + preferredSealWidth + cappedMaxSpacingWidth <= available + 0.0001;

  let sealWidth = preferredSealWidth;
  if (fixedWidth + preferredSealWidth + minSpacingWidth > available && fixedWidth + minSealWidth + minSpacingWidth <= available) {
    sealWidth = Math.max(minSealWidth, available - fixedWidth - minSpacingWidth);
  }

  let sideMarginLeft = sideMin;
  let sideMarginRight = sideMin;
  let spacingWidths = new Map(spacingItems.map((item) => [item.key, getTopRowSpacingPreferredWidth(item)]));
  let reason = `${modeLabel}: top row spacing uses preferred values.`;

  if (minFits) {
    const spaceTarget = available - fixedWidth - sealWidth;
    const starBalanced = balanceTopRowSpacingSurfaces(spacingItems, spaceTarget, sideMin, strategy);
    sideMarginLeft = starBalanced.leftMargin;
    sideMarginRight = starBalanced.rightMargin;
    spacingWidths = starBalanced.widths;
    reason = starBalanced.reason;
  } else {
    spacingWidths = new Map(spacingItems.map((item) => [item.key, getTopRowSpacingMinWidth(item)]));
    sealWidth = minSealWidth;
    reason = `${modeLabel}: minimum top-row spacing does not fit this width.`;
  }

  const solvedSequence = sequence.map((item) => {
    if (item.type === "seals") return { ...item, width: sealWidth / Math.max(1, sealItems.length) };
    if (isTopRowSpacingItem(item)) return { ...item, width: spacingWidths.get(item.key) ?? getTopRowSpacingMinWidth(item) };
    return { ...item, width: item.width };
  });
  const contentWidth = solvedSequence.reduce((sum, item) => sum + item.width, 0);
  const xStart = contentLimits.left + sideMarginLeft;
  const positionedContent = positionContent(solvedSequence, xStart);
  const actualCharGaps = solvedSequence.filter((item) => item.type === "char-gap").map((item) => item.width);
  const actualSeal = solvedSequence.find((item) => item.type === "seals");
  const actualSealGap = solvedSequence.find((item) => item.type === "seal-gap");
  const actualSeasonGap = solvedSequence.find((item) => item.type === "season-gap");

  return {
    fits: minFits,
    renderable: minFits || allowOverflow,
    minFits,
    preferredFits,
    maxFits,
    width,
    strategy,
    modeLabel,
    policy: "two-line top-row solver: star gaps, double-star gaps and the 8-25 mm seal gap are balanced within their Anlage-4 ranges; season star gap participates when a season field is present",
    reason,
    availableWidth: available,
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
    positionedContent,
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
  if (item.type === "season-gap") return SPACING_RULES_MM.outsideMargin.min;
  return getItemMinWidth(item);
}

function getTopRowSpacingPreferredWidth(item) {
  if (item.type === "season-gap") return SPACING_RULES_MM.outsideMargin.min;
  return getItemPreferredWidth(item);
}

function getTopRowSpacingFiniteMaxWidth(item) {
  if (item.type === "season-gap") return SPACING_RULES_MM.outsideMargin.min;
  return getItemMaxWidth(item);
}

function getTopRowSpacingMaxWidth(item) {
  if (item.type === "season-gap") return Number.POSITIVE_INFINITY;
  return getItemMaxWidth(item);
}

function balanceTopRowSpacingSurfaces(spacingItems, targetWidth, sideMin, strategy) {
  const surfaces = [
    { key: "__left_margin", min: sideMin, max: Number.POSITIVE_INFINITY, width: sideMin },
    ...spacingItems.map((item) => ({
      key: item.key,
      min: getTopRowSpacingMinWidth(item),
      max: getTopRowSpacingMaxWidth(item),
      width: getTopRowSpacingMinWidth(item),
      type: item.type
    })),
    { key: "__right_margin", min: sideMin, max: Number.POSITIVE_INFINITY, width: sideMin }
  ];
  const minTotal = surfaces.reduce((sum, item) => sum + item.min, 0);
  const surplus = Math.max(0, targetWidth - minTotal);

  if (!surplus) {
    return topRowSurfaceResult(surfaces, `${strategy === "balanced" ? "Two-line top auto balanced" : "Two-line top fixed width"}: minimum star/seal/character spacing used.`);
  }

  let remaining = surplus;
  while (remaining > 0.0001) {
    const active = surfaces.filter((item) => item.width < item.max - 0.0001);
    if (!active.length) break;
    const equalStep = remaining / active.length;
    let consumed = 0;
    for (const item of active) {
      const cap = item.max - item.width;
      const applied = Math.min(equalStep, cap);
      item.width += applied;
      consumed += applied;
    }
    if (consumed <= 0.0001) break;
    remaining -= consumed;
  }

  const reason = `${strategy === "balanced" ? "Two-line top auto balanced" : "Two-line top fixed width"}: top-row free space was water-filled across Anlage-4 spacing surfaces: * gaps, ** gaps and 8-25 mm seal gap; capped gaps stop at their maxima and remaining width stays in uncapped * gaps.`;
  return topRowSurfaceResult(surfaces, reason);
}

function topRowSurfaceResult(surfaces, reason) {
  const widths = new Map();
  for (const surface of surfaces) {
    if (surface.key !== "__left_margin" && surface.key !== "__right_margin") widths.set(surface.key, surface.width);
  }
  return {
    leftMargin: surfaces.find((item) => item.key === "__left_margin")?.width ?? SPACING_RULES_MM.outsideMargin.min,
    rightMargin: surfaces.find((item) => item.key === "__right_margin")?.width ?? SPACING_RULES_MM.outsideMargin.min,
    widths,
    reason
  };
}

function neededWidthForContentWithLimits(limits, contentWidth, rules) {
  return limits.left + contentWidth + SPACING_RULES_MM.outsideMargin.min * 2 + (rules.outerHeight ? rules.innerInset : 0);
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
    layers.push(renderSeasonField(model));
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
  if (hasHistoricalOrElectricSuffix(parsed)) {
    return solveTwoLineHistoricalOrElectricBottomLayout({ sequence, rules, width, strategy, allowOverflow, contentLimits, season });
  }
  return solveContentLayout({ sequence, rules, width, strategy, allowOverflow, contentLimits });
}

function solveTwoLineHistoricalOrElectricBottomLayout({ sequence, rules, width, strategy, allowOverflow = false, contentLimits, season = resolveSeasonOptions() }) {
  const available = contentLimits.width;
  const sideMin = SPACING_RULES_MM.outsideMargin.min;
  const fixedWidth = sequence.reduce((sum, item) => sum + (isBottomRowSpacingItem(item) ? 0 : item.width), 0);
  const spacingItems = sequence.filter((item) => isBottomRowSpacingItem(item));
  const minSpacingWidth = spacingItems.reduce((sum, item) => sum + getItemMinWidth(item), 0) + sideMin * 2;
  const preferredSpacingWidth = spacingItems.reduce((sum, item) => sum + getItemPreferredWidth(item), 0) + sideMin * 2;
  const cappedMaxSpacingWidth = spacingItems.reduce((sum, item) => sum + getItemMaxWidth(item), 0) + sideMin * 2;
  const minContentWidth = fixedWidth + spacingItems.reduce((sum, item) => sum + getItemMinWidth(item), 0);
  const preferredContentWidth = fixedWidth + spacingItems.reduce((sum, item) => sum + getItemPreferredWidth(item), 0);
  const maxContentWidth = fixedWidth + spacingItems.reduce((sum, item) => sum + getItemMaxWidth(item), 0);
  const minFits = fixedWidth + minSpacingWidth <= available + 0.0001;
  const preferredFits = fixedWidth + preferredSpacingWidth <= available + 0.0001;
  const maxFits = fixedWidth + cappedMaxSpacingWidth <= available + 0.0001;
  const modeLabel = strategy === "balanced" ? (season?.enabled ? "Two-line seasonal H/E bottom auto balanced" : "Two-line H/E bottom auto balanced") : strategy === "compact" ? (season?.enabled ? "Two-line seasonal H/E bottom auto compact" : "Two-line H/E bottom auto compact") : (season?.enabled ? "Two-line seasonal H/E bottom fixed width" : "Two-line H/E bottom fixed width");

  let sideMarginLeft = sideMin;
  let sideMarginRight = sideMin;
  let spacingWidths = new Map(spacingItems.map((item) => [item.key, getItemMinWidth(item)]));
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
  const contentWidth = solvedSequence.reduce((sum, item) => sum + item.width, 0);
  const xStart = contentLimits.left + sideMarginLeft;
  const positionedContent = positionContent(solvedSequence, xStart);
  const actualCharGaps = solvedSequence.filter((item) => item.type === "char-gap").map((item) => item.width);
  const actualGroupGaps = solvedSequence.filter((item) => item.type === "group-gap").map((item) => item.width);

  return {
    fits: minFits,
    renderable: minFits || allowOverflow,
    minFits,
    preferredFits,
    maxFits,
    width,
    strategy,
    modeLabel,
    policy: "two-line H/E bottom-row solver: outside * gaps, character ** gaps and H/E group *** gaps are water-filled within their Anlage-4 ranges; applies with and without a season field",
    reason,
    availableWidth: available,
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
    positionedContent,
    actualCharGap: average(actualCharGaps) ?? SPACING_RULES_MM.charGap.preferred,
    actualGroupGap: average(actualGroupGaps) ?? null,
    actualGroupGapMinWidth: minVariableWidth(solvedSequence.filter((item) => item.type === "group-gap")),
    groupGapRangeLabel: getVariableRangeLabel(solvedSequence.find((item) => item.type === "group-gap"), SPACING_RULES_MM.twoLineBottomGroupGapHistoricalOrElectric),
    groupGapRule: solvedSequence.find((item) => item.type === "group-gap")?.ruleLabel || "Two-line H/E bottom row: group gaps 20-30 mm",
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
  const surfaces = [
    { key: "__left_margin", min: sideMin, max: Number.POSITIVE_INFINITY, width: sideMin },
    ...spacingItems.map((item) => ({
      key: item.key,
      min: getItemMinWidth(item),
      max: getItemMaxWidth(item),
      width: getItemMinWidth(item),
      type: item.type
    })),
    { key: "__right_margin", min: sideMin, max: Number.POSITIVE_INFINITY, width: sideMin }
  ];
  const minTotal = surfaces.reduce((sum, item) => sum + item.min, 0);
  const surplus = Math.max(0, targetWidth - minTotal);

  let remaining = surplus;
  while (remaining > 0.0001) {
    const active = surfaces.filter((item) => item.width < item.max - 0.0001);
    if (!active.length) break;
    const equalStep = remaining / active.length;
    let consumed = 0;
    for (const item of active) {
      const cap = item.max - item.width;
      const applied = Math.min(equalStep, cap);
      item.width += applied;
      consumed += applied;
    }
    if (consumed <= 0.0001) break;
    remaining -= consumed;
  }

  const widths = new Map();
  for (const surface of surfaces) {
    if (surface.key !== "__left_margin" && surface.key !== "__right_margin") widths.set(surface.key, surface.width);
  }

  return {
    leftMargin: surfaces.find((item) => item.key === "__left_margin")?.width ?? sideMin,
    rightMargin: surfaces.find((item) => item.key === "__right_margin")?.width ?? sideMin,
    widths,
    reason: `${strategy === "balanced" ? "Two-line H/E bottom auto balanced" : "Two-line H/E bottom fixed width"}: bottom-row free space was water-filled across Anlage-4 spacing surfaces: outside * gaps, character ** gaps and H/E group *** gaps; capped gaps stop at their maxima and remaining width stays in uncapped outside * gaps.`
  };
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
  const fixedWidth = sequence.reduce((sum, item) => sum + (isOneLineSeasonSpacingItem(item) || item.type === "seals" ? 0 : item.width), 0);
  const sealItems = sequence.filter((item) => item.type === "seals");
  const spacingItems = sequence.filter((item) => isOneLineSeasonSpacingItem(item));
  const minSealWidth = sealItems.reduce((sum, item) => sum + getItemMinWidth(item), 0);
  const preferredSealWidth = sealItems.reduce((sum, item) => sum + getItemPreferredWidth(item), 0);
  const minSpacingWidth = spacingItems.reduce((sum, item) => sum + getOneLineSeasonSpacingMinWidth(item), 0) + sideMin * 2;
  const preferredSpacingWidth = spacingItems.reduce((sum, item) => sum + getOneLineSeasonSpacingPreferredWidth(item), 0) + sideMin * 2;
  const cappedMaxSpacingWidth = spacingItems.reduce((sum, item) => sum + getOneLineSeasonSpacingFiniteMaxWidth(item), 0) + sideMin * 2;
  const minContentWidth = fixedWidth + minSealWidth + spacingItems.reduce((sum, item) => sum + getOneLineSeasonSpacingMinWidth(item), 0);
  const preferredContentWidth = fixedWidth + preferredSealWidth + spacingItems.reduce((sum, item) => sum + getOneLineSeasonSpacingPreferredWidth(item), 0);
  const maxContentWidth = fixedWidth + preferredSealWidth + spacingItems.reduce((sum, item) => sum + getOneLineSeasonSpacingFiniteMaxWidth(item), 0);
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
  let spacingWidths = new Map(spacingItems.map((item) => [item.key, getOneLineSeasonSpacingPreferredWidth(item)]));
  let reason = `${modeLabel}: one-line seasonal spacing uses preferred values.`;

  if (minFits) {
    const spaceTarget = available - fixedWidth - sealWidth;
    const balanced = balanceOneLineSeasonSpacingSurfaces(spacingItems, spaceTarget, sideMin, strategy);
    sideMarginLeft = balanced.leftMargin;
    sideMarginRight = balanced.rightMargin;
    spacingWidths = balanced.widths;
    reason = balanced.reason;
  } else {
    spacingWidths = new Map(spacingItems.map((item) => [item.key, getOneLineSeasonSpacingMinWidth(item)]));
    sealWidth = minSealWidth;
    reason = `${modeLabel}: minimum one-line seasonal spacing does not fit this width.`;
  }

  const solvedSequence = sequence.map((item) => {
    if (item.type === "seals") return { ...item, width: sealWidth / Math.max(1, sealItems.length) };
    if (isOneLineSeasonSpacingItem(item)) return { ...item, width: spacingWidths.get(item.key) ?? getOneLineSeasonSpacingMinWidth(item) };
    return { ...item, width: item.width };
  });
  const contentWidth = solvedSequence.reduce((sum, item) => sum + item.width, 0);
  const xStart = contentLimits.left + sideMarginLeft;
  const positionedContent = positionContent(solvedSequence, xStart);
  const actualCharGaps = solvedSequence.filter((item) => item.type === "char-gap").map((item) => item.width);
  const actualGroupGaps = solvedSequence.filter((item) => item.type === "group-gap").map((item) => item.width);
  const actualSeal = solvedSequence.find((item) => item.type === "seals");
  const actualSeasonGap = solvedSequence.find((item) => item.type === "season-gap");

  return {
    fits: minFits,
    renderable: minFits || allowOverflow,
    minFits,
    preferredFits,
    maxFits,
    width,
    strategy,
    modeLabel,
    policy: "one-line seasonal solver: outside * gaps, character gaps, recognition group gaps, seal column and the season star gap are balanced within their Anlage-4 ranges; the 30 x 75 mm season field remains fixed",
    reason,
    availableWidth: available,
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
    positionedContent,
    actualCharGap: average(actualCharGaps) ?? SPACING_RULES_MM.charGap.preferred,
    actualGroupGap: average(actualGroupGaps) ?? null,
    actualGroupGapMinWidth: minVariableWidth(solvedSequence.filter((item) => item.type === "group-gap")),
    groupGapRangeLabel: getVariableRangeLabel(solvedSequence.find((item) => item.type === "group-gap"), SPACING_RULES_MM.groupGap),
    groupGapRule: solvedSequence.find((item) => item.type === "group-gap")?.ruleLabel || null,
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
  if (item.type === "season-gap") return SPACING_RULES_MM.outsideMargin.min;
  return getItemMinWidth(item);
}

function getOneLineSeasonSpacingPreferredWidth(item) {
  if (item.type === "season-gap") return SPACING_RULES_MM.outsideMargin.min;
  return getItemPreferredWidth(item);
}

function getOneLineSeasonSpacingFiniteMaxWidth(item) {
  if (item.type === "season-gap") return SPACING_RULES_MM.outsideMargin.min;
  return getItemMaxWidth(item);
}

function getOneLineSeasonSpacingMaxWidth(item) {
  if (item.type === "season-gap") return Number.POSITIVE_INFINITY;
  return getItemMaxWidth(item);
}

function balanceOneLineSeasonSpacingSurfaces(spacingItems, targetWidth, sideMin, strategy) {
  const surfaces = [
    { key: "__left_margin", min: sideMin, max: Number.POSITIVE_INFINITY, width: sideMin },
    ...spacingItems.map((item) => ({
      key: item.key,
      min: getOneLineSeasonSpacingMinWidth(item),
      max: getOneLineSeasonSpacingMaxWidth(item),
      width: getOneLineSeasonSpacingMinWidth(item),
      type: item.type
    })),
    { key: "__right_margin", min: sideMin, max: Number.POSITIVE_INFINITY, width: sideMin }
  ];
  const minTotal = surfaces.reduce((sum, item) => sum + item.min, 0);
  let remaining = Math.max(0, targetWidth - minTotal);

  while (remaining > 0.0001) {
    const active = surfaces.filter((item) => item.width < item.max - 0.0001);
    if (!active.length) break;
    const equalStep = remaining / active.length;
    let consumed = 0;
    for (const item of active) {
      const cap = item.max - item.width;
      const applied = Math.min(equalStep, cap);
      item.width += applied;
      consumed += applied;
    }
    if (consumed <= 0.0001) break;
    remaining -= consumed;
  }

  const widths = new Map();
  for (const surface of surfaces) {
    if (surface.key !== "__left_margin" && surface.key !== "__right_margin") widths.set(surface.key, surface.width);
  }

  return {
    leftMargin: surfaces.find((item) => item.key === "__left_margin")?.width ?? sideMin,
    rightMargin: surfaces.find((item) => item.key === "__right_margin")?.width ?? sideMin,
    widths,
    reason: `${strategy === "balanced" ? "One-line seasonal auto balanced" : "One-line seasonal fixed width"}: free space was water-filled across Anlage-4 spacing surfaces: outside * gaps, character gaps, group gaps and the season star gap; capped gaps stop at their maxima and remaining width stays in uncapped * gaps.`
  };
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
    positionedContent,
    actualCharGap: average(actualCharGaps) ?? SPACING_RULES_MM.charGap.preferred,
    actualGroupGap: average(actualGroupGaps) ?? null,
    actualGroupGapMinWidth: minVariableWidth(solvedSequence.filter((item) => item.type === "group-gap")),
    groupGapRangeLabel: getVariableRangeLabel(solvedSequence.find((item) => item.type === "group-gap"), SPACING_RULES_MM.groupGap),
    groupGapRule: solvedSequence.find((item) => item.type === "group-gap")?.ruleLabel || null,
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

function getTwoLineBottomGroupGapRange(parsed) {
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




function resolveSeasonForVisualStyle(season, visualStyle) {
  if (visualStyle?.key !== "green") return season;
  return {
    ...(season || {}),
    enabled: false
  };
}

function resolveVisualStyle(visualStyle = {}) {
  const key = visualStyle?.plateColorMode === "green" || visualStyle?.textColorMode === "green" ? "green" : "black";
  return PLATE_TEXT_COLORS_MM[key] || PLATE_TEXT_COLORS_MM.black;
}

function resolveRulesForSeason(rules, season) {
  if (!season?.enabled) return rules;
  return {
    ...rules,
    content: {
      ...rules.content,
      season: {
        ...rules.content.season,
        targetDigitHeight: season.targetDigitHeight,
        fontSize: season.fontSize,
        widthScale: season.widthScale,
        digitGap: season.digitGap,
        upperBaselineY: season.upperBaselineY,
      }
    }
  };
}

function resolveSeasonOptions(season = {}, rules = TWO_LINE_RULES_MM) {
  const defaults = rules?.content?.season || TWO_LINE_RULES_MM.content.season;
  const enabled = season?.enabled === true;
  return {
    enabled,
    from: normalizeSeasonMonth(season?.from, "04"),
    to: normalizeSeasonMonth(season?.to, "10"),
    targetDigitHeight: positiveNumber(season?.targetDigitHeight, defaults.targetDigitHeight),
    fontSize: positiveNumber(season?.fontSize, defaults.fontSize),
    widthScale: clampNumber(positiveNumber(season?.widthScale, defaults.widthScale), 0.6, 1.2),
    digitGap: clampNumber(numberOrFallback(season?.digitGap, defaults.digitGap), -5, 10),
    upperBaselineY: positiveNumber(season?.baselineY, defaults.upperBaselineY)
  };
}

function normalizeSeasonMonth(value, fallback) {
  const digits = String(value ?? "").replace(/\D/g, "").slice(0, 2);
  const number = Number(digits);
  if (!Number.isFinite(number) || number < 1 || number > 12) return fallback;
  return String(number).padStart(2, "0");
}

function getVariableRangeLabel(item, fallbackRange) {
  const range = item || fallbackRange;
  if (!range) return null;
  return `${formatNumber(range.minWidth ?? range.min)}-${formatNumber(range.maxWidth ?? range.max)}`;
}

function minVariableWidth(items) {
  const values = items.map((item) => item.minWidth).filter((value) => Number.isFinite(value));
  return values.length ? Math.min(...values) : null;
}

function splitRecognition(value) {
  const normalized = String(value || "");
  const matches = normalized.match(/[A-ZÄÖÜ]+|\d+/g) || [];
  return matches.map((part) => ({
    value: part,
    type: /^\d+$/.test(part) ? "digits" : "letters"
  }));
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

export function getCharacterBand(rules, rowKey = "top") {
  if (rules.layoutType === "two-line") {
    const row = rowKey === "bottom" ? rules.content.bottomRow : rules.content.topRow;
    return {
      y: row.y,
      height: row.characterHeight,
      baselineY: row.baselineY
    };
  }
  return {
    y: rules.innerInset + rules.content.topClearance,
    height: rules.content.characterHeight,
    baselineY: rules.cells?.middle?.baselineY || FONT_CALIBRATION_PROFILES_MM.middleManualB108.baselineY
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
  <text x="${euro.countryCenterX}" y="${euro.countryCenterY ?? euro.countryBaselineY}" text-anchor="middle" dominant-baseline="${euro.countryDominantBaseline || "auto"}" font-family="DIN1451Alt, AlteDIN1451Mittelschrift, AlteDIN1451Middle script, Arial, sans-serif" font-size="${euro.countryFontSize || 30}" font-weight="${euro.countryFontWeight || 400}" fill="#fff">${escapeText(euro.country)}</text>
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

function getBandForItem(rules, item) {
  if (Number.isFinite(Number(item?.bandY)) && Number.isFinite(Number(item?.bandHeight))) {
    return { y: Number(item.bandY), height: Number(item.bandHeight), baselineY: Number(item.baselineY) || null };
  }
  return getCharacterBand(rules, item?.rowKey);
}

function renderGrid({ content, rules, metrics }) {
  const parts = content.map((item) => {
    const charBand = getBandForItem(rules, item);
    if (item.type === "char") {
      return `<rect x="${item.x}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="rgba(30,165,255,.08)" stroke="rgba(30,165,255,.55)" stroke-width="0.6"/>`;
    }
    if (item.type === "season-field") {
      const rowHeight = rules.content.season.monthBoxHeight;
      const lowerY = charBand.y + charBand.height - rowHeight;
      return `<rect x="${item.x}" y="${charBand.y}" width="${item.width}" height="${rowHeight}" fill="rgba(30,165,255,.08)" stroke="rgba(30,165,255,.55)" stroke-width="0.6" data-season-box="from"/><rect x="${item.x}" y="${lowerY}" width="${item.width}" height="${rowHeight}" fill="rgba(30,165,255,.08)" stroke="rgba(30,165,255,.55)" stroke-width="0.6" data-season-box="to"/>`;
    }
    if (item.type === "season-gap") {
      return `<rect x="${item.x}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="rgba(255,179,107,.04)" stroke="rgba(255,179,107,.6)" stroke-width="0.35" stroke-dasharray="1.5 1"/>`;
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


function renderSeasonField({ content, rules, metrics }) {
  const item = content.find((candidate) => candidate.type === "season-field");
  if (!item) return "";
  const band = getBandForItem(rules, item);
  const seasonRules = rules.content.season;
  const rowHeight = seasonRules.monthBoxHeight;
  const separatorHeight = seasonRules.separatorHeight;
  const upperFieldY = band.y;
  const lowerFieldY = band.y + band.height - rowHeight;
  const separatorY = band.y + band.height / 2 - separatorHeight / 2;
  const xCenter = item.x + item.width / 2;
  const widthScale = clampNumber(Number(seasonRules.widthScale) || 1, 0.6, 1.2);
  const digitGap = clampNumber(Number(seasonRules.digitGap) || 0, -5, 10);
  const baseDigitWidth = positiveNumber(seasonRules.digitSlotWidth, 12.5);
  const baseFontSize = positiveNumber(seasonRules.digitSlotFontSize, 28);
  const activeFontSize = positiveNumber(seasonRules.fontSize, baseFontSize);
  const fontSizeScale = activeFontSize / baseFontSize;
  const digitWidth = baseDigitWidth * widthScale * fontSizeScale;
  const totalMonthWidth = digitWidth * 2 + digitGap;
  const monthLeft = xCenter - totalMonthWidth / 2;
  const firstDigitX = monthLeft;
  const secondDigitX = monthLeft + digitWidth + digitGap;
  const lineX1 = item.x + seasonRules.separatorInset;
  const lineWidth = item.width - seasonRules.separatorInset * 2;
  const upperBaselineY = seasonRules.upperBaselineY;
  const lowerBaselineY = seasonRules.upperBaselineY + (lowerFieldY - upperFieldY);
  const from = normalizeSeasonMonth(item.season?.from || "04", "04");
  const to = normalizeSeasonMonth(item.season?.to || "10", "10");
  const textColor = metrics?.textColor || PLATE_TEXT_COLORS_MM.black.color;
  const textStyle = `font-family="${seasonRules.fontFamily}" font-size="${seasonRules.fontSize}" font-weight="${seasonRules.fontWeight}" fill="${textColor}"`;

  const renderMonth = (value, key, baselineY) => {
    const digitLength = Number(digitWidth).toFixed(4).replace(/\.?0+$/, "");
    return `
  <g data-season-row="${key}" data-season-width-scale="${widthScale}" data-season-digit-gap="${digitGap}" data-season-digit-width="${digitWidth}" data-season-total-width="${totalMonthWidth}" data-season-layout="deterministic-font-size-scaled" data-season-font-size-scale="${fontSizeScale}">
    <text class="season-digit season-digit-first" data-season-row-key="${key}" data-season-digit="first" data-season-digit-text="first" x="${firstDigitX}" y="${baselineY}" text-anchor="start" textLength="${digitLength}" lengthAdjust="spacingAndGlyphs" ${textStyle}>${escapeText(value[0])}</text>
    <text class="season-digit season-digit-second" data-season-row-key="${key}" data-season-digit="second" data-season-digit-text="second" x="${secondDigitX}" y="${baselineY}" text-anchor="start" textLength="${digitLength}" lengthAdjust="spacingAndGlyphs" ${textStyle}>${escapeText(value[1])}</text>
  </g>`;
  };

  return `
<g class="layer layer-season-field">
  <rect x="${lineX1}" y="${separatorY}" width="${lineWidth}" height="${separatorHeight}" fill="${textColor}" data-season-separator="true"/>
${renderMonth(from, "from", upperBaselineY)}
${renderMonth(to, "to", lowerBaselineY)}
</g>`.trim();
}

function renderText({ content, font, metrics }) {
  const glyphGuide = font.fit?.measured ? `
    <rect x="0" y="${font.fit.measured.topY}" width="100%" height="${font.fit.measured.visibleHeight}" fill="rgba(92, 214, 255, .035)" stroke="rgba(92, 214, 255, .35)" stroke-width="0.35" stroke-dasharray="2 1.5"/>` : "";
  const textColor = metrics?.textColor || PLATE_TEXT_COLORS_MM.black.color;
  const chars = content.filter((item) => item.type === "char").map((cell) => `
    <text x="${cell.x + cell.width / 2}" y="${cell.baselineY || font.baselineY}" text-anchor="middle" font-family="'${font.fontFamily}', Arial Narrow, sans-serif" font-size="${cell.fontSize || font.fontSize}" font-weight="400" fill="${textColor}">${escapeText(cell.char)}</text>`).join("");
  return `<g class="layer layer-text">${glyphGuide}${chars}</g>`;
}

function renderHorizontalDiagnostics({ content, rules }) {
  const parts = [];

  for (const item of content) {
    const charBand = getBandForItem(rules, item);
    const yTop = Math.max(0, charBand.y - 6);
    const yBottom = Math.min(rules.outerHeight, charBand.y + charBand.height + 6);
    const labelY = Math.max(6, charBand.y - 2.5);
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

    if (item.type === "seal-gap") {
      parts.push(`<rect x="${x1}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="rgba(255,179,107,.05)" stroke="rgba(255,179,107,.75)" stroke-width="0.4" stroke-dasharray="1.5 1"/>`);
      parts.push(`<text x="${cx}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="3.5" fill="#ffb36b">Seal gap · ${formatMm(item.width)}</text>`);
      continue;
    }

    if (item.type === "season-gap") {
      parts.push(`<rect x="${x1}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="rgba(255,179,107,.04)" stroke="rgba(255,179,107,.75)" stroke-width="0.35" stroke-dasharray="1.5 1"/>`);
      parts.push(`<text x="${cx}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="3.4" fill="#ffb36b">Season gap · ${formatMm(item.width)}</text>`);
      continue;
    }

    if (item.type === "season-field") {
      const rowHeight = rules.content.season.monthBoxHeight;
      const lowerY = charBand.y + charBand.height - rowHeight;
      parts.push(`<rect x="${x1}" y="${charBand.y}" width="${item.width}" height="${rowHeight}" fill="rgba(30,165,255,.07)" stroke="rgba(30,165,255,.85)" stroke-width="0.4"/>`);
      parts.push(`<rect x="${x1}" y="${lowerY}" width="${item.width}" height="${rowHeight}" fill="rgba(30,165,255,.07)" stroke="rgba(30,165,255,.85)" stroke-width="0.4"/>`);
      parts.push(`<text x="${cx}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="3.5" fill="#1ea5ff">Season fields · ${formatMm(item.width)} × ${formatMm(rowHeight)}</text>`);
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
  ${renderEuroInternalDimensions(model)}
</g>`.trim();
}

function renderSolvedSpacingDimensions({ content, rules, metrics }) {
  if (rules.layoutType === "two-line") {
    return renderSolvedSpacingDimensionsByRows({ content, rules, metrics });
  }

  const charBand = getCharacterBand(rules);
  const contentLimits = getContentLimits(rules, metrics.width);
  const first = content[0];
  const last = content[content.length - 1];
  const lines = [];
  const add = createDimensionLineAdder(lines);

  if (first && last) {
    const leftMargin = first.x - contentLimits.left;
    const rightMargin = contentLimits.right - (last.x + last.width);
    add(contentLimits.left, first.x, charBand.y + charBand.height + 9, `Margin ${formatMm(leftMargin)}`, "#6de28d", { kind: "outside-margin", labelOffset: 5.4, fontSize: 3.7 });
    add(last.x + last.width, contentLimits.right, charBand.y + charBand.height + 9, `Margin ${formatMm(rightMargin)}`, "#6de28d", { kind: "outside-margin", labelOffset: 5.4, fontSize: 3.7 });
  }

  for (const item of content) {
    const x1 = item.x;
    const x2 = item.x + item.width;
    if (item.type === "seals") {
      add(x1, x2, charBand.y - 7.5, `Seal ${formatMm(item.width)}`, "#ffd36b", { kind: "seal-column", labelOffset: -1.8, fontSize: 4.0 });
      continue;
    }
    if (item.type === "group-gap") {
      add(x1, x2, charBand.y - 13.5, `Group ${formatMm(item.width)}`, "#ff7777", { kind: "group-gap", labelOffset: -1.8, fontSize: 3.8 });
      continue;
    }
    if (item.type === "season-gap") {
      add(x1, x2, charBand.y - 13.5, `Season gap ${formatMm(item.width)}`, "#ffb36b", { kind: "season-gap", labelOffset: -1.8, fontSize: 3.5 });
      continue;
    }
    if (item.type === "season-field") {
      add(x1, x2, charBand.y - 7.5, `Season ${formatMm(item.width)}`, "#ffffff", { kind: "season-field", labelOffset: -1.8, fontSize: 3.7 });
      continue;
    }
    if (item.type === "char-gap") {
      add(x1, x2, charBand.y + charBand.height + 4.2, formatMm(item.width), "#7fd3ff", { kind: "char-gap", labelOffset: 5.1, fontSize: 3.3, opacity: 0.75, tick: 1.8 });
    }
  }

  return `<g class="layer layer-solved-dimensions">${lines.join("")}
  </g>`;
}

function renderEuroInternalDimensions(model) {
  const { rules } = model;
  const euro = rules.euro;
  if (!Number.isFinite(Number(euro.innerTopClearance))) return "";

  const x = euro.x + euro.width + 5;
  const tickLeft = x - 2.5;
  const tickRight = x + 2.5;
  const starsTop = euro.y + euro.innerTopClearance;
  const starsBottom = starsTop + euro.starsBoxHeight;
  const countryTop = starsBottom + euro.starsToCountryGap;
  const countryBottom = countryTop + euro.countryBoxHeight;
  const segments = [
    [euro.y, starsTop, formatNumber(euro.innerTopClearance)],
    [starsTop, starsBottom, formatNumber(euro.starsBoxHeight)],
    [starsBottom, countryTop, formatNumber(euro.starsToCountryGap)],
    [countryTop, countryBottom, formatNumber(euro.countryBoxHeight)],
    [countryBottom, euro.y + euro.height, formatNumber(euro.innerBottomClearance)]
  ];
  const boundaries = [
    euro.y,
    starsTop,
    starsBottom,
    countryTop,
    countryBottom,
    euro.y + euro.height
  ];
  const segmentLines = segments.map(([y1, y2, label]) => `
    <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#7fd3ff" stroke-width="0.35"/>
    <line x1="${tickLeft}" y1="${y1}" x2="${tickRight}" y2="${y1}" stroke="#7fd3ff" stroke-width="0.35"/>
    <line x1="${tickLeft}" y1="${y2}" x2="${tickRight}" y2="${y2}" stroke="#7fd3ff" stroke-width="0.35"/>
    <text x="${x + 4}" y="${(y1 + y2) / 2 + 1.7}" font-family="Arial, sans-serif" font-size="3.6" fill="#7fd3ff" stroke="none">${label}</text>`).join("");
  const boundaryGuides = boundaries.map((y) => `<line x1="${euro.x}" y1="${y}" x2="${euro.x + euro.width}" y2="${y}" stroke="#7fd3ff" stroke-width="0.25" stroke-dasharray="1.2 1.2" opacity="0.45"/>`).join("");
  const countryBox = `<rect x="${euro.x}" y="${countryTop}" width="${euro.width}" height="${euro.countryBoxHeight}" fill="none" stroke="#7fd3ff" stroke-width="0.35" opacity="0.7"/>`;
  return `<g class="dimension dimension-euro-internal" opacity="0.9">${boundaryGuides}${countryBox}${segmentLines}
  </g>`;
}

function renderSolvedSpacingDimensionsByRows({ content, rules }) {
  const lines = [];
  const add = createDimensionLineAdder(lines);
  const rows = ["top", "bottom"];

  for (const rowKey of rows) {
    const rowItems = content.filter((item) => item.rowKey === rowKey);
    if (!rowItems.length) continue;
    const charBand = getCharacterBand(rules, rowKey);
    const limits = rowItems[0].contentLimits || (rowKey === "top" ? getTwoLineTopContentLimits(rules, rowItems[0].x) : getTwoLineBottomContentLimits(rules, rowItems[0].x));
    const first = rowItems[0];
    const last = rowItems[rowItems.length - 1];
    const marginY = rowKey === "top" ? charBand.y - 8.5 : charBand.y + charBand.height + 8.5;
    const marginLabelOffset = rowKey === "top" ? -1.8 : 5.4;
    const leftMargin = first.x - limits.left;
    const rightMargin = limits.right - (last.x + last.width);
    add(limits.left, first.x, marginY, `${rowKey === "top" ? "Top" : "Bottom"} margin ${formatMm(leftMargin)}`, "#6de28d", { kind: `outside-margin-${rowKey}`, labelOffset: marginLabelOffset, fontSize: 3.5 });
    add(last.x + last.width, limits.right, marginY, `${rowKey === "top" ? "Top" : "Bottom"} margin ${formatMm(rightMargin)}`, "#6de28d", { kind: `outside-margin-${rowKey}`, labelOffset: marginLabelOffset, fontSize: 3.5 });

    for (const item of rowItems) {
      const x1 = item.x;
      const x2 = item.x + item.width;
      if (item.type === "seals") {
        add(x1, x2, charBand.y - 14, `Seal ${formatMm(item.width)}`, "#ffd36b", { kind: "seal-column", labelOffset: -1.8, fontSize: 3.8 });
        continue;
      }
      if (item.type === "group-gap") {
        add(x1, x2, charBand.y - 10, `Group ${formatMm(item.width)}`, "#ff7777", { kind: "group-gap", labelOffset: -1.8, fontSize: 3.6 });
        continue;
      }
      if (item.type === "seal-gap") {
        add(x1, x2, charBand.y - 10, `Seal gap ${formatMm(item.width)}`, "#ffb36b", { kind: "seal-gap", labelOffset: -1.8, fontSize: 3.4 });
        continue;
      }
      if (item.type === "season-gap") {
        add(x1, x2, charBand.y - 7, `Season gap ${formatMm(item.width)}`, "#ffb36b", { kind: "season-gap", labelOffset: -1.8, fontSize: 3.2 });
        continue;
      }
      if (item.type === "season-field") {
        add(x1, x2, charBand.y - 14, `Season ${formatMm(item.width)}`, "#ffffff", { kind: "season-field", labelOffset: -1.8, fontSize: 3.4 });
        continue;
      }
      if (item.type === "char-gap") {
        const y = rowKey === "top" ? charBand.y + charBand.height + 3.8 : charBand.y + charBand.height + 4.2;
        add(x1, x2, y, formatMm(item.width), "#7fd3ff", { kind: "char-gap", labelOffset: 5.1, fontSize: 3.1, opacity: 0.75, tick: 1.8 });
      }
    }
  }

  return `<g class="layer layer-solved-dimensions">${lines.join("")}
  </g>`;
}

function createDimensionLineAdder(lines) {
  return (x1, x2, y, label, color, options = {}) => {
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

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function numberOrFallback(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function escapeText(value) {
  return String(value).replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]));
}

function escapeAttr(value) {
  return escapeText(value).replace(/"/g, "&quot;");
}
