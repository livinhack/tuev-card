// Kennzeichen Physical Lab b227 / central plate variant and rule objects
//
// Pure data/rule module: no renderer imports, no SVG generation, no layout side effects.
// The goal is to keep variant dimensions, width bands and common spacing
// definitions in one place so the physical renderer does not duplicate them.

export const PLATE_TEXT_COLORS_MM = Object.freeze({
  black: {
    key: "black",
    label: "Standard black",
    color: "#080808",
    frameColor: "#111",
    note: "Standard German plate text and frame colour used for normal white plates."
  },
  green: {
    key: "green",
    label: "Green plate · RAL 6001 approximation",
    color: "#287233",
    frameColor: "#287233",
    note: "Project approximation for German green plates: green text and frame/border on otherwise normal white reflective plate geometry. H/E combinations remain controlled by Reminder data; seasonal fields can be rendered when supplied."
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

export const TWO_LINE_WIDTH_RULES = Object.freeze({
  standard: {
    key: "standard",
    label: "Two-line standard · max 340 mm",
    maxWidth: 340,
    widthBands: TWO_LINE_WIDTH_BANDS,
    ruleLabel: "Two-line standard width bands up to 340 mm"
  },
  twoAndThreeWheel: {
    key: "twoAndThreeWheel",
    label: "Two-line two-/three-wheel · max 280 mm",
    maxWidth: 280,
    widthBands: Object.freeze({
      middle: [260, 280],
      narrow: [260, 280]
    }),
    ruleLabel: "Two-line width limit for two- and three-wheeled motor vehicles: max 280 mm"
  },
  motorcycle: {
    key: "motorcycle",
    label: "Motorcycle plate · 180-220 × 200 mm",
    maxWidth: 220,
    widthBands: Object.freeze({
      middle: [180, 200, 220],
      narrow: [180, 200, 220]
    }),
    ruleLabel: "Motorcycle plate width range: 180-220 mm; height 200 mm; motorcycle raster is not the generic two-line raster"
  },
  reducedTwoLine: {
    key: "reducedTwoLine",
    label: "Reduced two-line standard · max 255 × 130 mm",
    maxWidth: 255,
    widthBands: Object.freeze({
      middle: [180, 200, 220, 240, 255]
    }),
    ruleLabel: "Verkleinertes zweizeiliges Kennzeichen: b225 auto width keeps b209 logic and uses complete reduced-middle-script row chains including seal fields against 180/200/220/240/255 mm candidates up to the 255 × 130 mm maximum; Euro-field, seal and season-field subcomponents are centralised; the 180-mm candidate is checked by the real row chains; Standard upper-seal fallback starts at 200 mm, H/E/season use upper side-by-side seals from 180 mm; no reduced narrow-script fallback exists; H/E and season require the upper side-by-side seal template; b225 keeps b209 E/H suffix counting and season field in Reduced H/E/Saison slot guards; 8-slot upper rows use 3/4/8, while 9-slot season cases keep the tight >=6 mm right-margin fallback"
  }
});

export const SPACING_RULES_MM = Object.freeze({
  outsideMargin: { min: 8 },
  charGap: { min: 8, preferred: 9, max: 10 },
  groupGap: { min: 20, preferred: 24, max: 30 },
  twoLineBottomGroupGap: { min: 24, preferred: 24, max: 30, ruleLabel: "Two-line bottom row group gap: 24-30 mm" },
  twoLineBottomGroupGapHistoricalOrElectric: { min: 20, preferred: 24, max: 30, ruleLabel: "Two-line H/E suffix row group gap: 20-30 mm for the complete bottom row" },
  motorcycleRecognitionGroupGap: { min: 15, preferred: 15, max: 18, ruleLabel: "Kraftradkennzeichen bottom recognition group gap: 15-18 mm range; b169 keeps the template-preferred 15 mm instead of waterfilling to the maximum" },
  motorcycleRecognitionGroupGapHistoricalOrElectric: { min: 14, preferred: 14, max: 18, ruleLabel: "Kraftradkennzeichen H/E bottom recognition group gap: 14-18 mm range; b169 keeps the template-preferred 14 mm instead of waterfilling to the maximum" },
  reducedRecognitionGroupGap: { min: 15, preferred: 15, max: 18, ruleLabel: "Verkleinertes zweizeiliges Standardkennzeichen: recognition group gap *** is a legal 15-18 mm range; b209 fits with the 15-mm minimum and expands only within the legal range before equal outside margins grow" },
  reducedUpperSealPairGap: { min: 5, preferred: 15, max: 20, ruleLabel: "Verkleinertes zweizeiliges Standardkennzeichen: gap between side-by-side authority and HU seal fields in the upper row; b209 solves it as a real dynamic row-chain gap so the free corridor is shared between text→seal, seal→seal and the equal outside margins" },
  reducedTopSealGap: { min: 5, preferred: 15, max: 20, ruleLabel: "Verkleinertes zweizeiliges Standardkennzeichen: gap from last top-row district letter to HU field uses the *** 5-20 mm corridor" },
  reducedBottomSealGap: { min: 5, preferred: 15, max: 20, ruleLabel: "Verkleinertes zweizeiliges Standardkennzeichen: gap from last lower-row digit to authority seal uses the *** 5-20 mm corridor" },
  reducedSeasonGap: { min: 8, preferred: 8, max: Number.POSITIVE_INFINITY, ruleLabel: "Verkleinertes zweizeiliges H/E/Saison-Template: Abstand von letzter Ziffer bzw. H/E-Suffix zum Saisonfeld ist eine *-Fläche mit mindestens 8 mm" },
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
    starWreath: { centerX: 27, centerY: 36.5, a: 30, ruleLabel: "EU star wreath component: a = 30 mm; star size = a / 6" },
    countryCenterX: 27,
    countryCenterY: 78.5,
    countryBaselineY: 88.5,
    countryHeight: 20,
    countryFontSize: 27,
    countryFontWeight: 400,
    countryDominantBaseline: "central",
    countryMark: { text: "D", centerX: 27, centerY: 78.5, height: 20, ruleLabel: "Euro country mark component: 20 mm D" }
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
  formatKey: "twoLine",
  layoutType: "two-line",
  widthRuleDefault: "standard",
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
    starsRadius: 15,
    starWreath: { centerX: 24.5, centerY: 29.5, a: 30, ruleLabel: "EU star wreath component: a = 30 mm; star size = a / 6" },
    countryCenterX: 24.5,
    countryCenterY: 71.5,
    countryBaselineY: 81.5,
    countryHeight: 20,
    countryFontSize: 27,
    countryFontWeight: 400,
    countryDominantBaseline: "central",
    country: "D",
    countryMark: { text: "D", centerX: 24.5, centerY: 71.5, height: 20, ruleLabel: "Euro country mark component: 20 mm D" }
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

export const MOTORCYCLE_RULES_MM = Object.freeze({
  ...TWO_LINE_RULES_MM,
  name: "Motorcycle plate",
  formatKey: "motorcycle",
  widthRuleDefault: "motorcycle",
  reference: "Anlage 4 FZV Abschnitt 2 Nummer 2c / Kraftradkennzeichen, Abschnitt 2.2.3 reduced middle script",
  outerHeight: 200,
  maxWidth: 220,
  motorcycleMinWidth: 180,
  euro: {
    ...TWO_LINE_RULES_MM.euro,
    ruleLabel: "Euro field for two-line and motorcycle plates: identical geometry according to Anlage 4 section 4/2a context"
  },
  content: {
    ...TWO_LINE_RULES_MM.content,
    topRow: {
      label: "Motorcycle top row: district in reduced middle script",
      y: 10.5,
      characterHeight: 49,
      baselineY: 59.5,
      ruleLabel: "Kraftradkennzeichen top character field: 49 mm height, reduced middle script, 6 mm inner top clearance"
    },
    bottomRow: {
      label: "Motorcycle bottom row: recognition number in reduced middle script",
      y: 140.5,
      characterHeight: 49,
      baselineY: 189.5,
      ruleLabel: "Kraftradkennzeichen bottom character field: 49 mm height, reduced middle script, 6 mm inner bottom clearance"
    },
    seal: {
      columnMinWidth: 0,
      columnWidth: 0,
      columnMaxWidth: 0,
      arrangement: "motorcycle-horizontal",
      centerY: 100,
      huDiameter: 35,
      authorityDiameter: 45,
      visibleCircleGap: 10,
      nonSeasonVisibleCircleGap: 20,
      seasonReservedGap: 8,
      seasonSealXOffset: 8,
      historicalOrElectricSealXOffset: -5,
      ruleLabel: "Kraftradkennzeichen: HU (35 mm) and authority seal (45 mm) are placed horizontally in the middle zone. b169 uses case-specific x templates: seasonal Kraftrad keeps the compact 10-mm b167 reference before the validity column, while non-seasonal Kraftrad uses a wider 20-mm seal pair; H/E without season is shifted 5 mm left to match the Anlage-4 reference. Seals are never placed below the Euro field"
    },
    season: {
      ...TWO_LINE_RULES_MM.content.season,
      fieldY: 73.375,
      contentHeight: 53.25,
      upperBaselineY: 93.375,
      ruleLabel: "Kraftrad seasonal field: separate right-hand 30 mm validity column in the middle zone; separator h=3.25 mm is centered at plate y=100 mm, fields are 20 mm high with 5 mm from separator edge; month digit baselines sit at the lower edge of each 20 mm month field; not aligned to the top text row"
    }
  },
  cells: {
    middle: {
      label: "Reduced middle script 49 mm",
      fontFamily: "GL-Nummernschild-Mtl",
      letterWidth: 31,
      digitWidth: 29,
      gap: SPACING_RULES_MM.charGap.preferred,
      characterHeight: 49,
      fontSize: 81.67,
      baselineY: 59.5,
      specialWidths: {
        I: 23.2
      },
      ruleLabel: "Kraftradkennzeichen uses reduced middle script: 49 mm glyph field; example widths A=31 mm, 8=29 mm"
    },
    narrow: {
      label: "Reduced middle script 49 mm (Engschrift disabled for Kraftrad)",
      fontFamily: "GL-Nummernschild-Mtl",
      letterWidth: 31,
      digitWidth: 29,
      gap: SPACING_RULES_MM.charGap.preferred,
      characterHeight: 49,
      fontSize: 81.67,
      baselineY: 59.5,
      specialWidths: {
        I: 23.2
      },
      ruleLabel: "No separate narrow-script fallback is used for Kraftradkennzeichen in this Lab model"
    }
  },
  dimensions: {
    ...TWO_LINE_RULES_MM.dimensions,
    enabledMarginRight: 42,
    enabledMarginBottom: 34
  }
});


export const REDUCED_TWO_LINE_RULES_MM = Object.freeze({
  ...TWO_LINE_RULES_MM,
  name: "Reduced two-line standard plate",
  formatKey: "reducedTwoLine",
  widthRuleDefault: "reducedTwoLine",
  reference: "Anlage 4 FZV Abschnitt 2 Nummer 3 / verkleinertes zweizeiliges Kennzeichen – b174 standard-only template correction",
  outerHeight: 130,
  maxWidth: 255,
  innerInset: 4,
  innerHeight: 122,
  outerCornerRadius: 7.5,
  innerCornerRadius: 3.75,
  euro: {
    x: 4,
    y: 4,
    width: 35,
    height: 56,
    innerTopClearance: 5,
    starsBoxHeight: 22.5,
    starsToCountryGap: 8,
    countryBoxHeight: 15,
    innerBottomClearance: 5.5,
    starsCenterX: 21.5,
    starsCenterY: 20.25,
    starsRadius: 11.25,
    starWreath: { centerX: 21.5, centerY: 20.25, a: 22.5, ruleLabel: "Reduced two-line EU star wreath component: a = 22.5 mm through star centres; star size = a / 6" },
    countryCenterX: 21.5,
    countryCenterY: 47.0,
    countryBaselineY: 51.0,
    countryHeight: 15,
    countryFontSize: 20,
    countryFontWeight: 400,
    countryDominantBaseline: "central",
    country: "D",
    countryMark: { text: "D", centerX: 21.5, centerY: 47.0, height: 15, ruleLabel: "Reduced two-line Euro country mark component: 15 mm D centred in the 15-mm D band" },
    ruleLabel: "Reduced two-line Euro field: 35 × 56 mm with 5 / 22.5 / 8 / 15 / 5.5 vertical raster; b225 keeps the central Euro-field component with star wreath a=22.5 and a 15-mm country D centred in its band"
  },
  content: {
    ...TWO_LINE_RULES_MM.content,
    sideClearance: 8,
    topRow: {
      label: "Reduced two-line top row · standard only",
      y: 10,
      characterHeight: 49,
      baselineY: 59,
      ruleLabel: "Verkleinertes zweizeiliges Kennzeichen top row: 6 mm inner top clearance plus 49-mm field"
    },
    bottomRow: {
      label: "Reduced two-line bottom row · standard only",
      y: 71,
      characterHeight: 49,
      baselineY: 120,
      ruleLabel: "Verkleinertes zweizeiliges Kennzeichen bottom row: 12 mm inter-row gap, 49-mm field, 6 mm inner bottom clearance"
    },
    seal: {
      columnMinWidth: 45,
      columnWidth: 45,
      columnMaxWidth: 45,
      arrangement: "reduced-standard-vertical",
      huDiameter: 35,
      huCenterY: 34.5,
      authorityDiameter: 45,
      authorityCenterY: 95.5,
      visibleCircleGap: 0,
      ruleLabel: "Reduced two-line standard b209: standard remains Lab-only; seal fields are real row-chain elements and participate in fit/collision checks. H/E and season are b209 upper-side-by-side-seal variants."
    },
    season: {
      ...TWO_LINE_RULES_MM.content.season,
      enabledDefault: false,
      ruleLabel: "Reduced two-line season b209: upper side-by-side seals are mandatory; the lower row may append a 30 mm season field after the recognition/H/E text with a * gap of at least 8 mm before the season field"
    }
  },
  cells: {
    middle: {
      label: "Reduced middle script 49 mm",
      fontFamily: "GL-Nummernschild-Mtl",
      letterWidth: 31,
      digitWidth: 29,
      gap: SPACING_RULES_MM.charGap.preferred,
      characterHeight: 49,
      fontSize: 81.67,
      baselineY: 59,
      specialWidths: { I: 23.2 },
      ruleLabel: "Reduced two-line b209 standard template uses fixed reduced middle-script cells: letters 31 mm, digits 29 mm"
    },
    narrow: {
      label: "Reduced middle script 49 mm (narrow disabled for b198)",
      fontFamily: "GL-Nummernschild-Mtl",
      letterWidth: 31,
      digitWidth: 29,
      gap: SPACING_RULES_MM.charGap.preferred,
      characterHeight: 49,
      fontSize: 81.67,
      baselineY: 59,
      specialWidths: { I: 23.2 },
      ruleLabel: "No Engschrift fallback is used or calculated in the b209 reduced standard template"
    }
  },
  dimensions: {
    ...TWO_LINE_RULES_MM.dimensions,
    enabledMarginRight: 38,
    enabledMarginBottom: 30
  }
});

export function resolvePlateRules(plateFormat = "oneLine") {
  if (plateFormat === "motorcycle" || plateFormat === "motorcyclePlate" || plateFormat === "kraftrad") return MOTORCYCLE_RULES_MM;
  if (plateFormat === "reducedTwoLine" || plateFormat === "reduced-two-line" || plateFormat === "verkleinertTwoLine") return REDUCED_TWO_LINE_RULES_MM;
  return plateFormat === "twoLine" || plateFormat === "two-line" ? TWO_LINE_RULES_MM : ONE_LINE_RULES_MM;
}
