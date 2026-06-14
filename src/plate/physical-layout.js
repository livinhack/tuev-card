// Norm-oriented one-line German plate model.
// Coordinates use millimetre-like units first; the card scales the resulting
// SVG afterwards. Official-looking authority seal artwork is intentionally not
// reproduced. The renderer only reserves the seal positions and uses neutral
// placeholders.

export const STANDARD_ONE_LINE_PLATE = Object.freeze({
    height: 110,
    maxWidth: 520,
    minWidth: 255,
    cornerRadius: 6,
    borderWidth: 3,
    faceInset: 3,
    euWidth: 45,
    euroDividerWidth: 1,
    leftTextGap: 13,
    rightPadding: 14,
    groupGap: 9,
    sealColumnWidth: 42,
    sealSize: 22,
    huSealCenterY: 35,
    authoritySealCenterY: 74,
    textCenterY: 59,
    mtlFontSize: 76,
    engFontSize: 77,
    mtlLetterSpacing: 1.35,
    engLetterSpacing: 0.95,
    countryFontSize: 24,
    starRingRadius: 13.2,
    starDotRadius: 1.8,
    starCenterY: 31,
    countryCenterY: 79
});

export function splitStandardPlate(normalizedPlate) {
    const groups = String(normalizedPlate || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (groups.length < 2) {
        return {
            district: "",
            identifier: groups.join(" "),
            hasSealColumn: false,
            groups
        };
    }

    return {
        district: groups[0],
        identifier: groups.slice(1).join(" "),
        hasSealColumn: true,
        groups
    };
}

export function getPhysicalPlateLayout({
    normalizedPlate,
    districtWidth,
    identifierWidth,
    fullTextWidth,
    fontVariant
}) {
    const base = STANDARD_ONE_LINE_PLATE;
    const split = splitStandardPlate(normalizedPlate);
    const textFontSize = fontVariant.role === "eng" ? base.engFontSize : base.mtlFontSize;
    const letterSpacing = fontVariant.role === "eng" ? base.engLetterSpacing : base.mtlLetterSpacing;

    if (!split.hasSealColumn) {
        const width = clampPlateWidth(
            base.euWidth + base.leftTextGap + fullTextWidth + base.rightPadding,
            base
        );

        return {
            ...base,
            width,
            contentWidth: base.euWidth + base.leftTextGap + fullTextWidth + base.rightPadding,
            isClampedToMaxWidth: width >= base.maxWidth,
            textFontSize,
            letterSpacing,
            split,
            hasSealColumn: false,
            fullTextX: base.euWidth + base.leftTextGap + ((width - base.euWidth - base.leftTextGap - base.rightPadding) / 2)
        };
    }

    const districtX = base.euWidth + base.leftTextGap;
    const sealColumnX = districtX + districtWidth + base.groupGap;
    const identifierX = sealColumnX + base.sealColumnWidth + base.groupGap;
    const contentWidth = identifierX + identifierWidth + base.rightPadding;
    const width = clampPlateWidth(contentWidth, base);

    return {
        ...base,
        width,
        contentWidth,
        isClampedToMaxWidth: width >= base.maxWidth,
        textFontSize,
        letterSpacing,
        split,
        hasSealColumn: true,
        districtX,
        identifierX,
        sealColumnCenterX: sealColumnX + (base.sealColumnWidth / 2),
        districtTextWidth: districtWidth,
        identifierTextWidth: identifierWidth
    };
}

function clampPlateWidth(value, base) {
    return Math.min(base.maxWidth, Math.max(base.minWidth, Math.ceil(value)));
}
