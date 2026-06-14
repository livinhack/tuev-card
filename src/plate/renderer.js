import { tuevColorForYear } from "../badge/profile.js?v=b88";
import {
    checkPlateFontAvailable,
    ensurePlateFont,
    getPlateFontStatus,
    getPlateFontVariantForText,
    injectPlateFont,
    isPlateFontLoaded
} from "./font.js?v=b88";
import { getPhysicalPlateLayout, STANDARD_ONE_LINE_PLATE } from "./physical-layout.js?v=b88";

export {
    checkPlateFontAvailable,
    ensurePlateFont,
    getPlateFontStatus,
    isPlateFontLoaded
};

// Renderer v2: first build a norm-oriented one-line plate in mm-like units,
// then let the card-wide shared scale fit the widest plate into the column.
// There is intentionally no system-font fallback for graphical plates.
const EURO_PLATE_GEOMETRY = {
    height: 38,
    minWidth: 118,
    radius: 3,
    euWidth: 19,
    euContentX: 10,
    textGapLeft: 7,
    fontSize: 30,
    textY: 0.515,
    textScaleY: 1.18,
    letterSpacing: 1.1,
    starY: 0.30,
    starRadius: 5.2,
    starDotRadius: 0.75,
    countryY: 0.72,
    countryFontSize: 8.2,
    fallbackWidthMode: "europlate"
};

const PREVIEW_TUNING = {
    heightOffset: 1,
    textYOffset: 0.01,
    starYOffset: 0.005,
    countryYOffset: -0.005
};

const CHAR_WIDTH = {
    europlate: {
        space: 0.29,
        digit: 0.48,
        wide: 0.61,
        narrow: 0.36,
        default: 0.51
    },
    "gl-mtl": {
        space: 0.30,
        digit: 0.50,
        wide: 0.66,
        narrow: 0.34,
        default: 0.53
    },
    "gl-eng": {
        space: 0.26,
        digit: 0.42,
        wide: 0.52,
        narrow: 0.28,
        default: 0.44
    }
};

let plateFontRequested = false;
let measureCanvas = null;

export function normalizePlate(plate) {
    return String(plate || "")
        .trim()
        .replace(/[-–—]+/g, " ")
        .replace(/\s+/g, " ")
        .toUpperCase();
}

export function renderLicensePlate(plate, options = {}) {
    if (!plateFontRequested) {
        plateFontRequested = true;
        injectPlateFont();
    }

    const metrics = getLicensePlateMetrics(plate, options);

    if (!metrics.normalizedPlate) {
        return "";
    }

    const requestedScale = Number(options.scale || 0);
    const maxWidth = Number(options.maxWidth || 0);
    const fallbackScale = Number.isFinite(maxWidth) && maxWidth > 0
        ? maxWidth / metrics.width
        : 1;

    const scale = Number.isFinite(requestedScale) && requestedScale > 0
        ? Math.min(1, requestedScale)
        : Math.min(1, fallbackScale);
    const displayWidth = Math.max(1, Math.round(metrics.width * scale));
    const displayHeight = Math.max(1, Math.round(metrics.height * scale));

    if (metrics.fontVariant.source !== "gl") {
        return renderLegacyPlateSvg({
            ...metrics,
            displayWidth,
            displayHeight
        });
    }

    return renderPhysicalPlateSvg({
        ...metrics,
        displayWidth,
        displayHeight,
        huYear: Number(options.huYear || options.year || 0),
        huRotation: Number(options.huRotation || options.rotation || 0)
    });
}

export function getLicensePlateMetrics(plate, options = {}) {
    const normalizedPlate = normalizePlate(plate);

    if (!normalizedPlate) {
        return {
            width: 0,
            height: 0,
            normalizedPlate: ""
        };
    }

    const fontVariant = getPlateFontVariantForText(normalizedPlate);

    if (fontVariant.source !== "gl") {
        return getLegacyLicensePlateMetrics(normalizedPlate, fontVariant, options);
    }

    const metrics = getPhysicalLicensePlateMetrics(normalizedPlate, fontVariant);
    const shouldTryEng =
        fontVariant.role !== "eng" &&
        metrics.physicalLayout?.contentWidth > STANDARD_ONE_LINE_PLATE.maxWidth;

    if (!shouldTryEng) {
        return metrics;
    }

    const engVariant = getPlateFontStatus().fonts.find((candidate) => candidate.source === "gl" && candidate.role === "eng");

    return engVariant
        ? getPhysicalLicensePlateMetrics(normalizedPlate, engVariant)
        : metrics;
}

function getPhysicalLicensePlateMetrics(normalizedPlate, fontVariant) {
    const split = String(normalizedPlate || "").trim().split(/\s+/).filter(Boolean);
    const district = split.length >= 2 ? split[0] : "";
    const identifier = split.length >= 2 ? split.slice(1).join(" ") : normalizedPlate;
    const textFontSize = fontVariant.role === "eng"
        ? STANDARD_ONE_LINE_PLATE.engFontSize
        : STANDARD_ONE_LINE_PLATE.mtlFontSize;
    const letterSpacing = fontVariant.role === "eng"
        ? STANDARD_ONE_LINE_PLATE.engLetterSpacing
        : STANDARD_ONE_LINE_PLATE.mtlLetterSpacing;
    const fallbackWidthMode = fontVariant.role === "eng" ? "gl-eng" : "gl-mtl";
    const textWidthOptions = { textFontSize, letterSpacing, fallbackWidthMode };
    const districtWidth = district ? measurePlateTextWidth(district, textWidthOptions, fontVariant) : 0;
    const identifierWidth = measurePlateTextWidth(identifier, textWidthOptions, fontVariant);
    const fullTextWidth = measurePlateTextWidth(normalizedPlate, textWidthOptions, fontVariant);
    const physicalLayout = getPhysicalPlateLayout({
        normalizedPlate,
        districtWidth,
        identifierWidth,
        fullTextWidth,
        fontVariant
    });

    return {
        width: physicalLayout.width,
        height: physicalLayout.height,
        normalizedPlate,
        physicalLayout,
        fontVariant,
        district,
        identifier,
        districtWidth,
        identifierWidth,
        textWidth: fullTextWidth
    };
}

function getLegacyLicensePlateMetrics(normalizedPlate, fontVariant, options = {}) {
    const layout = getLegacyPlateGeometry(options.preview === true);
    const plainChars = normalizedPlate.replace(/\s/g, "");
    const charCount = plainChars.length;
    const textPadLeft = charCount >= 8 ? 7 : charCount <= 4 ? 2 : charCount <= 6 ? 3 : 5;
    const textPadRight = charCount >= 8 ? 9 : charCount <= 4 ? 8 : charCount <= 6 ? 9 : 10;
    const textWidth = measurePlateTextWidth(normalizedPlate, {
        textFontSize: layout.fontSize,
        letterSpacing: layout.letterSpacing,
        fallbackWidthMode: layout.fallbackWidthMode
    }, fontVariant);

    const contentWidth =
        layout.euWidth +
        layout.textGapLeft +
        textPadLeft +
        textWidth +
        textPadRight;
    const width = Math.max(layout.minWidth, contentWidth);

    return {
        width,
        height: layout.height,
        normalizedPlate,
        layout,
        fontVariant,
        charCount,
        textPadLeft,
        textPadRight,
        textWidth
    };
}

function getLegacyPlateGeometry(preview) {
    if (!preview) {
        return EURO_PLATE_GEOMETRY;
    }

    return {
        ...EURO_PLATE_GEOMETRY,
        height: EURO_PLATE_GEOMETRY.height + PREVIEW_TUNING.heightOffset,
        textY: EURO_PLATE_GEOMETRY.textY + PREVIEW_TUNING.textYOffset,
        starY: EURO_PLATE_GEOMETRY.starY + PREVIEW_TUNING.starYOffset,
        countryY: EURO_PLATE_GEOMETRY.countryY + PREVIEW_TUNING.countryYOffset
    };
}

function measurePlateTextWidth(text, layout, fontVariant) {
    const measured = measureTextWithCanvas(text, layout, fontVariant);

    if (measured > 0) {
        return measured + Math.max(0, text.length - 1) * layout.letterSpacing;
    }

    return estimatePlateTextWidth(text, layout.textFontSize || layout.fontSize, layout.fallbackWidthMode, layout.letterSpacing);
}

function measureTextWithCanvas(text, layout, fontVariant) {
    if (typeof document === "undefined" || typeof document.createElement !== "function") {
        return 0;
    }

    if (!measureCanvas) {
        measureCanvas = document.createElement("canvas");
    }

    const context = measureCanvas.getContext?.("2d");

    if (!context || typeof context.measureText !== "function") {
        return 0;
    }

    context.font = `${fontVariant.weight} ${layout.textFontSize || layout.fontSize}px "${fontVariant.family}"`;

    return context.measureText(text).width || 0;
}

function estimatePlateTextWidth(text, fontSize, widthMode, letterSpacing) {
    const widths = CHAR_WIDTH[widthMode] || CHAR_WIDTH.europlate;
    let width = 0;

    for (const char of text) {
        if (char === " ") {
            width += fontSize * widths.space;
        } else if (char >= "0" && char <= "9") {
            width += fontSize * widths.digit;
        } else if ("MW".includes(char)) {
            width += fontSize * widths.wide;
        } else if ("IJ".includes(char)) {
            width += fontSize * widths.narrow;
        } else {
            width += fontSize * widths.default;
        }
    }

    return width + Math.max(0, text.length - 1) * letterSpacing;
}

function renderPhysicalPlateSvg({
    normalizedPlate,
    width,
    height,
    displayWidth,
    displayHeight,
    physicalLayout,
    fontVariant,
    district,
    identifier,
    huYear,
    huRotation
}) {
    const clipId = `plateClip-${hashString(`${normalizedPlate}-${fontVariant.key}-${Math.round(width)}-${Math.round(height)}`)}`;
    const letterSpacing = `${physicalLayout.letterSpacing}px`;
    const plateTextStyle = `
        font-family: "${fontVariant.family}";
        font-size: ${physicalLayout.textFontSize}px;
        font-weight: ${fontVariant.weight};
        letter-spacing: ${letterSpacing};
    `;

    return `
        <svg
            viewBox="0 0 ${width} ${height}"
            width="${displayWidth}"
            height="${displayHeight}"
            role="img"
            aria-label="${escapeHtml(normalizedPlate)}"
            style="
                display: block;
                width: ${displayWidth}px;
                height: ${displayHeight}px;
                max-width: none;
                flex: 0 0 auto;
            "
        >
            <defs>
                <clipPath id="${clipId}">
                    <rect
                        x="${physicalLayout.faceInset}"
                        y="${physicalLayout.faceInset}"
                        width="${width - (physicalLayout.faceInset * 2)}"
                        height="${height - (physicalLayout.faceInset * 2)}"
                        rx="${physicalLayout.cornerRadius}"
                        ry="${physicalLayout.cornerRadius}"
                    />
                </clipPath>

                <style>
                    .tuev-plate-text {
                        ${plateTextStyle}
                    }
                </style>
            </defs>

            <g clip-path="url(#${clipId})">
                <rect
                    x="${physicalLayout.faceInset}"
                    y="${physicalLayout.faceInset}"
                    width="${width - (physicalLayout.faceInset * 2)}"
                    height="${height - (physicalLayout.faceInset * 2)}"
                    fill="#f7f7f2"
                />

                <rect
                    x="${physicalLayout.faceInset}"
                    y="${physicalLayout.faceInset}"
                    width="${physicalLayout.euWidth - physicalLayout.faceInset}"
                    height="${height - (physicalLayout.faceInset * 2)}"
                    fill="#003399"
                />

                <rect
                    x="${physicalLayout.euWidth}"
                    y="${physicalLayout.faceInset}"
                    width="${physicalLayout.euroDividerWidth}"
                    height="${height - (physicalLayout.faceInset * 2)}"
                    fill="#111"
                    opacity="0.12"
                />

                ${renderEuStars(
                    physicalLayout.euWidth / 2,
                    physicalLayout.starCenterY,
                    physicalLayout.starRingRadius,
                    physicalLayout.starDotRadius
                )}

                <text
                    x="${physicalLayout.euWidth / 2}"
                    y="${physicalLayout.countryCenterY}"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-family="Arial, sans-serif"
                    font-size="${physicalLayout.countryFontSize}"
                    font-weight="700"
                    fill="#fff"
                >D</text>

                ${physicalLayout.hasSealColumn ? renderStandardTextAndSeals({
                    physicalLayout,
                    district,
                    identifier,
                    huYear,
                    huRotation
                }) : renderUnsplitPlateText({
                    physicalLayout,
                    normalizedPlate
                })}
            </g>

            <rect
                x="${physicalLayout.faceInset / 2}"
                y="${physicalLayout.faceInset / 2}"
                width="${width - physicalLayout.faceInset}"
                height="${height - physicalLayout.faceInset}"
                rx="${physicalLayout.cornerRadius + 1}"
                ry="${physicalLayout.cornerRadius + 1}"
                fill="none"
                stroke="#111"
                stroke-width="${physicalLayout.borderWidth}"
            />
        </svg>
    `;
}

function renderStandardTextAndSeals({ physicalLayout, district, identifier, huYear, huRotation }) {
    return `
        <text
            class="tuev-plate-text"
            x="${physicalLayout.districtX}"
            y="${physicalLayout.textCenterY}"
            text-anchor="start"
            dominant-baseline="middle"
            fill="#111"
        >${escapeHtml(district)}</text>

        ${renderSealColumn({
            cx: physicalLayout.sealColumnCenterX,
            huY: physicalLayout.huSealCenterY,
            authorityY: physicalLayout.authoritySealCenterY,
            size: physicalLayout.sealSize,
            huYear,
            huRotation
        })}

        <text
            class="tuev-plate-text"
            x="${physicalLayout.identifierX}"
            y="${physicalLayout.textCenterY}"
            text-anchor="start"
            dominant-baseline="middle"
            fill="#111"
        >${escapeHtml(identifier)}</text>
    `;
}

function renderUnsplitPlateText({ physicalLayout, normalizedPlate }) {
    return `
        <text
            class="tuev-plate-text"
            x="${physicalLayout.fullTextX}"
            y="${physicalLayout.textCenterY}"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#111"
        >${escapeHtml(normalizedPlate)}</text>
    `;
}

function renderSealColumn({ cx, huY, authorityY, size, huYear, huRotation }) {
    return `
        ${renderMiniHuSeal({ cx, cy: huY, size, year: huYear, rotation: huRotation })}
        ${renderAuthoritySeal({ cx, cy: authorityY, size })}
    `;
}

function renderAuthoritySeal({ cx, cy, size }) {
    const radius = size / 2;
    return `
        <circle
            cx="${cx}"
            cy="${cy}"
            r="${radius}"
            fill="#d4d4cf"
            stroke="#8f8f89"
            stroke-width="1.2"
        />
        <circle
            cx="${cx}"
            cy="${cy}"
            r="${radius * 0.63}"
            fill="none"
            stroke="#f5f5f1"
            stroke-width="1.1"
            opacity="0.75"
        />
        <circle
            cx="${cx}"
            cy="${cy}"
            r="${radius * 0.26}"
            fill="#b9b9b2"
            opacity="0.88"
        />
    `;
}

function renderMiniHuSeal({ cx, cy, size, year, rotation }) {
    const radius = size / 2;
    const color = Number.isFinite(year) && year > 0 ? tuevColorForYear(year) : "#d4d4cf";
    const shortYear = Number.isFinite(year) && year > 0 ? String(year).slice(-2) : "";
    const marker = Number.isFinite(rotation) ? rotation : 0;

    return `
        <g transform="rotate(${marker} ${cx} ${cy})">
            <circle
                cx="${cx}"
                cy="${cy}"
                r="${radius}"
                fill="${color}"
                stroke="#111"
                stroke-width="1.1"
            />
            ${renderMiniHuTicks(cx, cy, radius)}
            <circle
                cx="${cx}"
                cy="${cy}"
                r="${radius * 0.34}"
                fill="#111"
            />
            <circle
                cx="${cx}"
                cy="${cy}"
                r="${radius * 0.27}"
                fill="${color}"
            />
            <text
                x="${cx}"
                y="${cy + (radius * 0.03)}"
                text-anchor="middle"
                dominant-baseline="middle"
                font-family="Arial, sans-serif"
                font-size="${radius * 0.43}"
                font-weight="700"
                fill="#111"
                transform="rotate(${-marker} ${cx} ${cy})"
            >${escapeHtml(shortYear)}</text>
        </g>
    `;
}

function renderMiniHuTicks(cx, cy, radius) {
    return Array.from({ length: 12 }, (_, index) => {
        const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
        const outer = radius * 0.84;
        const inner = radius * 0.66;
        const x1 = cx + Math.cos(angle) * inner;
        const y1 = cy + Math.sin(angle) * inner;
        const x2 = cx + Math.cos(angle) * outer;
        const y2 = cy + Math.sin(angle) * outer;

        return `
            <line
                x1="${x1.toFixed(2)}"
                y1="${y1.toFixed(2)}"
                x2="${x2.toFixed(2)}"
                y2="${y2.toFixed(2)}"
                stroke="#111"
                stroke-width="0.8"
                stroke-linecap="butt"
                opacity="0.78"
            />
        `;
    }).join("");
}

function renderLegacyPlateSvg({
    normalizedPlate,
    width,
    height,
    displayWidth,
    displayHeight,
    layout,
    fontVariant,
    textPadLeft,
    textPadRight
}) {
    const textAreaStartX = layout.euWidth + layout.textGapLeft + textPadLeft;
    const textAreaWidth = width - textAreaStartX - textPadRight;
    const textX = textAreaStartX + textAreaWidth / 2;
    const textY = height * layout.textY;
    const textScaleY = layout.textScaleY || 1;
    const textTransform = textScaleY === 1
        ? ""
        : `translate(0 ${textY}) scale(1 ${textScaleY}) translate(0 ${-textY})`;
    const letterSpacing = `${layout.letterSpacing}px`;
    const clipId = `plateClip-${hashString(`${normalizedPlate}-${fontVariant.key}-${Math.round(width * 10)}-${Math.round(height * 10)}`)}`;

    return `
        <svg
            viewBox="0 0 ${width} ${height}"
            width="${displayWidth}"
            height="${displayHeight}"
            role="img"
            aria-label="${escapeHtml(normalizedPlate)}"
            style="
                display: block;
                width: ${displayWidth}px;
                height: ${displayHeight}px;
                max-width: none;
                flex: 0 0 auto;
            "
        >
            <defs>
                <clipPath id="${clipId}">
                    <rect
                        x="1"
                        y="1"
                        width="${width - 2}"
                        height="${height - 2}"
                        rx="${layout.radius}"
                        ry="${layout.radius}"
                    />
                </clipPath>

                <style>
                    .tuev-plate-text {
                        font-family: "${fontVariant.family}";
                        font-size: ${layout.fontSize}px;
                        font-weight: ${fontVariant.weight};
                        letter-spacing: ${letterSpacing};
                    }
                </style>
            </defs>

            <g clip-path="url(#${clipId})">
                <rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="#f7f7f2" />
                <rect x="1" y="1" width="${layout.euWidth}" height="${height - 2}" fill="#003399" />
                <rect x="${layout.euWidth}" y="1" width="1" height="${height - 2}" fill="#111" opacity="0.10" />

                ${renderEuStars(layout.euContentX, height * layout.starY, layout.starRadius, layout.starDotRadius)}

                <text
                    x="${layout.euContentX}"
                    y="${height * layout.countryY}"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-family="Arial, sans-serif"
                    font-size="${layout.countryFontSize}"
                    font-weight="700"
                    fill="#fff"
                >D</text>

                <text
                    class="tuev-plate-text"
                    x="${textX}"
                    y="${textY}"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    transform="${textTransform}"
                    fill="#111"
                >${escapeHtml(normalizedPlate)}</text>
            </g>

            <rect
                x="1"
                y="1"
                width="${width - 2}"
                height="${height - 2}"
                rx="${layout.radius}"
                ry="${layout.radius}"
                fill="none"
                stroke="#111"
                stroke-width="2"
            />
        </svg>
    `;
}

function renderEuStars(cx, cy, radius, starRadius) {
    return Array.from({ length: 12 }, (_, index) => {
        const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;

        return `
            <circle
                cx="${x.toFixed(2)}"
                cy="${y.toFixed(2)}"
                r="${starRadius}"
                fill="#ffcc00"
            />
        `;
    }).join("");
}

function hashString(value) {
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
        hash = ((hash << 5) - hash) + value.charCodeAt(index);
        hash |= 0;
    }

    return Math.abs(hash);
}

function escapeHtml(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}
