import { tuevColorForYear } from "../badge/profile.js?v=b91";
import {
    checkPlateFontAvailable,
    ensurePlateFont,
    getDefaultPlateFontVariant,
    getPlateFontStatus,
    injectPlateFont,
    isPlateFontLoaded
} from "./font.js?v=b91";

export {
    checkPlateFontAvailable,
    ensurePlateFont,
    getPlateFontStatus,
    isPlateFontLoaded
};

// Law-based one-line plate renderer.
// All coordinates are millimetres. The 110 mm height is the complete outside
// dimension including the black border. The usable white area is modelled as
// 101 mm high (110 mm minus a 4.5 mm inner border band on each side).
const FZV_ONE_LINE = Object.freeze({
    key: "oneLine",
    maxWidth: 520,
    height: 110,
    widthBands: Object.freeze([340, 380, 420, 460, 480, 520]),
    borderBand: 4.5,
    borderStroke: 3.2,
    cornerRadius: 7,
    euro: Object.freeze({
        width: 45,
        starRingDiameter: 29,
        countryFontSize: 18
    }),
    minimumSideGap: 8,
    sealColumnWidth: 27,
    sealGapLeft: 8,
    sealGapRight: 9,
    sealDiameter: 20.5,
    huCenterRatio: 0.36,
    authorityCenterRatio: 0.68
});

const FONT_PROFILES = Object.freeze({
    mtl: Object.freeze({
        role: "mtl",
        label: "Mittelschrift 75 mm",
        fontSize: 75,
        charGap: 3.8,
        yOffset: 1.8,
        fallback: Object.freeze({
            digit: 43,
            wide: 55,
            narrow: 25,
            default: 47,
            space: 0
        })
    }),
    eng: Object.freeze({
        role: "eng",
        label: "Engschrift 75 mm",
        fontSize: 75,
        charGap: 3.1,
        yOffset: 1.8,
        fallback: Object.freeze({
            digit: 36,
            wide: 45,
            narrow: 20,
            default: 39,
            space: 0
        })
    })
});

const PLATE_FACE_COLOR = "#f7f7f1";
const PLATE_EDGE_COLOR = "#0d0d0d";
const EU_BLUE = "#003399";
const EU_YELLOW = "#ffcc00";
const AUTHORITY_SEAL_FILL = "#d8d8d2";
const AUTHORITY_SEAL_STROKE = "#a7a7a2";
const AUTHORITY_SEAL_HIGHLIGHT = "#f4f4ed";

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
    const scaleBasisWidth = metrics.scaleBasisWidth || metrics.width || FZV_ONE_LINE.maxWidth;
    const fallbackScale = Number.isFinite(maxWidth) && maxWidth > 0
        ? maxWidth / scaleBasisWidth
        : 1;
    const scale = Number.isFinite(requestedScale) && requestedScale > 0
        ? Math.min(1, requestedScale)
        : Math.min(1, fallbackScale);

    return renderLawPlateSvg({
        analysis: metrics,
        displayWidth: Math.max(1, Math.round(metrics.width * scale)),
        displayHeight: Math.max(1, Math.round(metrics.height * scale)),
        options
    });
}

export function getLicensePlateMetrics(plate, options = {}) {
    const parsed = parsePlate(plate);

    if (!parsed.normalizedPlate) {
        return {
            width: 0,
            height: 0,
            scaleBasisWidth: FZV_ONE_LINE.maxWidth,
            normalizedPlate: ""
        };
    }

    const availableFonts = getLawFontVariants();
    const alternatives = [];

    for (const fontVariant of availableFonts.filter((font) => font.lawProfile?.role !== "eng")) {
        alternatives.push(...buildOneLineLayoutsForBands(parsed, fontVariant, options));
    }

    for (const fontVariant of availableFonts.filter((font) => font.lawProfile?.role === "eng")) {
        alternatives.push(...buildOneLineLayoutsForBands(parsed, fontVariant, options));
    }

    if (!alternatives.length) {
        alternatives.push(...buildOneLineLayoutsForBands(parsed, getDefaultLawFontVariant(), options));
    }

    const fitting = alternatives.find((alternative) => !alternative.overflow);
    const chosen = fitting || alternatives[alternatives.length - 1];

    return {
        ...chosen,
        normalizedPlate: parsed.normalizedPlate,
        parsed,
        alternatives
    };
}

function parsePlate(plate) {
    const normalizedPlate = normalizePlate(plate);
    const tokens = normalizedPlate.split(" ").filter(Boolean);
    const first = tokens[0] || "";
    const restTokens = tokens.slice(1);

    let prefix = first;
    let recognition = restTokens.join("");

    if (!recognition && first) {
        const match = first.match(/^([A-ZÄÖÜ]{1,3})([A-ZÄÖÜ0-9].*)$/u);
        if (match) {
            prefix = match[1];
            recognition = match[2].replace(/\s/g, "");
        }
    }

    if (!recognition && tokens.length === 1) {
        recognition = first;
        prefix = "";
    }

    return {
        normalizedPlate,
        prefix,
        recognition,
        clean: normalizedPlate.replace(/\s/g, ""),
        tokenCount: tokens.length
    };
}

function getLawFontVariants() {
    const status = getPlateFontStatus();
    const fonts = Array.isArray(status?.fonts) ? status.fonts : [];
    const mtl = fonts.find((font) => font.source === "gl" && font.role === "mtl");
    const eng = fonts.find((font) => font.source === "gl" && font.role === "eng");
    const legacy = fonts.find((font) => font.source === "europlate");
    const variants = [];

    if (mtl) {
        variants.push({ ...mtl, lawProfile: FONT_PROFILES.mtl });
    }

    if (eng) {
        variants.push({ ...eng, lawProfile: FONT_PROFILES.eng });
    }

    if (!variants.length && legacy) {
        variants.push({ ...legacy, lawProfile: FONT_PROFILES.mtl });
    }

    if (!variants.length) {
        variants.push(getDefaultLawFontVariant());
    }

    return variants;
}

function getDefaultLawFontVariant() {
    const fallback = getDefaultPlateFontVariant();
    return {
        ...fallback,
        lawProfile: fallback.role === "eng" ? FONT_PROFILES.eng : FONT_PROFILES.mtl
    };
}

function buildOneLineLayoutsForBands(parsed, fontVariant, options = {}) {
    const layout = FZV_ONE_LINE;
    const font = fontVariant.lawProfile || FONT_PROFILES.mtl;
    const prefixBoxes = measureTextBoxes(parsed.prefix, fontVariant, font);
    const recognitionBoxes = measureTextBoxes(parsed.recognition, fontVariant, font);
    const prefixWidth = measureBoxesWidth(prefixBoxes, font);
    const recognitionWidth = measureBoxesWidth(recognitionBoxes, font);
    const hasSealColumn = Boolean(parsed.prefix && parsed.recognition);
    const sealWidth = hasSealColumn ? layout.sealColumnWidth : 0;
    const sealLeftGap = hasSealColumn ? layout.sealGapLeft : 0;
    const sealRightGap = hasSealColumn ? layout.sealGapRight : 0;
    const textAndSealWidth = prefixWidth + sealLeftGap + sealWidth + sealRightGap + recognitionWidth;
    const rawMinimumWidth = getOpenLeftBoundary(layout) + textAndSealWidth + layout.minimumSideGap * 2 + layout.borderBand;
    const preferredMinimumBand = parsed.clean.length >= 8 ? layout.maxWidth : layout.widthBands[0];
    const candidateBands = layout.widthBands.filter((band) => band >= preferredMinimumBand);
    const bands = candidateBands.length ? candidateBands : [layout.maxWidth];

    return bands.map((band) => buildOneLineLayoutForBand({
        parsed,
        fontVariant,
        font,
        prefixBoxes,
        recognitionBoxes,
        prefixWidth,
        recognitionWidth,
        hasSealColumn,
        sealWidth,
        sealLeftGap,
        sealRightGap,
        textAndSealWidth,
        rawMinimumWidth,
        width: band,
        options
    }));
}

function buildOneLineLayoutForBand({
    parsed,
    fontVariant,
    font,
    prefixBoxes,
    recognitionBoxes,
    prefixWidth,
    recognitionWidth,
    hasSealColumn,
    sealWidth,
    sealLeftGap,
    sealRightGap,
    textAndSealWidth,
    rawMinimumWidth,
    width,
    options
}) {
    const layout = FZV_ONE_LINE;
    const inner = getInnerRect(width, layout);
    const openLeftBoundary = getOpenLeftBoundary(layout);
    const openRightBoundary = width - layout.borderBand;
    const availableTextArea = openRightBoundary - openLeftBoundary;
    const sideGap = (availableTextArea - textAndSealWidth) / 2;
    const overflow = sideGap < layout.minimumSideGap || width < rawMinimumWidth;
    const startX = openLeftBoundary + Math.max(layout.minimumSideGap, sideGap);
    const prefixX = startX;
    const sealX = prefixX + prefixWidth + sealLeftGap + sealWidth / 2;
    const recognitionX = hasSealColumn
        ? sealX + sealWidth / 2 + sealRightGap
        : prefixX + prefixWidth + sealLeftGap;

    return {
        width,
        height: layout.height,
        // A full-width standard plate remains the display reference. This keeps
        // very short plates from being enlarged vertically just because they are
        // physically narrow, while still preserving their shorter rendered width.
        scaleBasisWidth: layout.maxWidth,
        rawMinimumWidth,
        overflow,
        layout,
        inner,
        fontVariant,
        font,
        prefixBoxes,
        recognitionBoxes,
        prefixWidth,
        recognitionWidth,
        textAndSealWidth,
        openLeftBoundary,
        openRightBoundary,
        sideGap,
        prefixX,
        sealX,
        recognitionX,
        hasSealColumn,
        debug: options.debug === true,
        parsed
    };
}

function getInnerRect(width, layout = FZV_ONE_LINE) {
    const band = layout.borderBand;
    return {
        x: band,
        y: band,
        width: width - band * 2,
        height: layout.height - band * 2,
        centerY: layout.height / 2
    };
}

function getOpenLeftBoundary(layout = FZV_ONE_LINE) {
    return layout.borderBand + layout.euro.width;
}

function measureTextBoxes(text, fontVariant, font) {
    return Array.from(String(text || "")).map((char) => ({
        char,
        width: measureCharacterWidth(char, fontVariant, font)
    }));
}

function measureBoxesWidth(boxes, font) {
    if (!boxes.length) {
        return 0;
    }

    return boxes.reduce((sum, box) => sum + box.width, 0) + Math.max(0, boxes.length - 1) * font.charGap;
}

function measureCharacterWidth(char, fontVariant, font) {
    const measured = measureCharacterWithCanvas(char, fontVariant, font);

    if (measured > 0) {
        return measured;
    }

    if (/[0-9]/.test(char)) {
        return font.fallback.digit;
    }

    if ("MWÄÖÜ".includes(char)) {
        return font.fallback.wide;
    }

    if ("IJ1".includes(char)) {
        return font.fallback.narrow;
    }

    return font.fallback.default;
}

function measureCharacterWithCanvas(char, fontVariant, font) {
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

    context.font = `${fontVariant.weight || 400} ${font.fontSize}px "${fontVariant.family}"`;

    return context.measureText(char).width || 0;
}

function renderLawPlateSvg({ analysis, displayWidth, displayHeight, options }) {
    const { width, height, layout, inner, fontVariant, font, parsed } = analysis;
    const clipId = `plateLawClip-${hashString(`${parsed.normalizedPlate}-${fontVariant.key}-${width}`)}`;
    const debug = options.debug === true || analysis.debug === true;
    const textY = inner.centerY + font.yOffset;

    return `
        <svg
            viewBox="0 0 ${width} ${height}"
            width="${displayWidth}"
            height="${displayHeight}"
            role="img"
            aria-label="${escapeHtml(parsed.normalizedPlate)}"
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
                        x="0"
                        y="0"
                        width="${width}"
                        height="${height}"
                        rx="${layout.cornerRadius}"
                        ry="${layout.cornerRadius}"
                    />
                </clipPath>
                <style>
                    .tuev-law-plate-text-${clipId} {
                        font-family: "${fontVariant.family}";
                        font-size: ${font.fontSize}px;
                        font-weight: ${fontVariant.weight || 400};
                        dominant-baseline: central;
                        text-anchor: middle;
                    }
                </style>
            </defs>

            <g clip-path="url(#${clipId})">
                <rect x="0" y="0" width="${width}" height="${height}" fill="${PLATE_EDGE_COLOR}"/>
                <rect
                    x="${inner.x}"
                    y="${inner.y}"
                    width="${inner.width}"
                    height="${inner.height}"
                    fill="${PLATE_FACE_COLOR}"
                />
                ${renderEuroField(layout, inner)}
                ${analysis.hasSealColumn ? renderSealColumn(analysis, options) : ""}
                ${renderCharacterRun({
                    boxes: analysis.prefixBoxes,
                    x: analysis.prefixX,
                    y: textY,
                    font,
                    className: `tuev-law-plate-text-${clipId}`
                })}
                ${renderCharacterRun({
                    boxes: analysis.recognitionBoxes,
                    x: analysis.recognitionX,
                    y: textY,
                    font,
                    className: `tuev-law-plate-text-${clipId}`
                })}
                ${debug ? renderDebugLayer(analysis) : ""}
            </g>

            <rect
                x="${layout.borderStroke / 2}"
                y="${layout.borderStroke / 2}"
                width="${width - layout.borderStroke}"
                height="${height - layout.borderStroke}"
                rx="${layout.cornerRadius}"
                ry="${layout.cornerRadius}"
                fill="none"
                stroke="${PLATE_EDGE_COLOR}"
                stroke-width="${layout.borderStroke}"
            />
        </svg>
    `;
}

function renderCharacterRun({ boxes, x, y, font, className }) {
    let cursor = x;

    return boxes.map((box) => {
        const center = cursor + box.width / 2;
        cursor += box.width + font.charGap;

        return `
            <text
                class="${className}"
                x="${center.toFixed(2)}"
                y="${y.toFixed(2)}"
                textLength="${box.width.toFixed(2)}"
                lengthAdjust="spacingAndGlyphs"
                fill="${PLATE_EDGE_COLOR}"
            >${escapeHtml(box.char)}</text>
        `;
    }).join("");
}

function renderEuroField(layout, inner) {
    const euro = layout.euro;
    const x = inner.x;
    const y = inner.y;
    const centerX = x + euro.width / 2;
    const starCenterY = y + inner.height * 0.29;
    const ringRadius = euro.starRingDiameter / 2 * 0.74;
    const countryY = y + inner.height - 15;

    return `
        <g>
            <rect x="${x}" y="${y}" width="${euro.width}" height="${inner.height}" fill="${EU_BLUE}"/>
            ${Array.from({ length: 12 }, (_, index) => {
                const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
                const starX = centerX + Math.cos(angle) * ringRadius;
                const starY = starCenterY + Math.sin(angle) * ringRadius;
                return renderStar(starX, starY, 1.9);
            }).join("")}
            <text
                x="${centerX}"
                y="${countryY}"
                text-anchor="middle"
                dominant-baseline="middle"
                font-family="Arial, sans-serif"
                font-size="${euro.countryFontSize}"
                font-weight="700"
                fill="#fff"
            >D</text>
        </g>
    `;
}

function renderSealColumn(analysis, options) {
    const { layout, inner, sealX } = analysis;
    const huY = inner.y + inner.height * layout.huCenterRatio;
    const authorityY = inner.y + inner.height * layout.authorityCenterRatio;

    return `
        <g>
            ${renderHuSeal({
                x: sealX,
                y: huY,
                diameter: layout.sealDiameter,
                year: Number(options.huYear || new Date().getFullYear()),
                month: Number(options.huMonth || 1),
                rotation: Number(options.huRotation || 0)
            })}
            ${renderAuthoritySeal({
                x: sealX,
                y: authorityY,
                diameter: layout.sealDiameter
            })}
        </g>
    `;
}

function renderAuthoritySeal({ x, y, diameter }) {
    const r = diameter / 2;

    return `
        <g opacity="0.96">
            <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r}" fill="${AUTHORITY_SEAL_FILL}" stroke="${AUTHORITY_SEAL_STROKE}" stroke-width="1"/>
            <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(r * 0.66).toFixed(2)}" fill="none" stroke="${AUTHORITY_SEAL_HIGHLIGHT}" stroke-width="0.8" opacity="0.85"/>
            <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(r * 0.22).toFixed(2)}" fill="${AUTHORITY_SEAL_STROKE}" opacity="0.55"/>
        </g>
    `;
}

function renderHuSeal({ x, y, diameter, year, month, rotation }) {
    const r = diameter / 2;
    const color = tuevColorForYear(year);
    const shortYear = String(year || "").slice(-2) || "--";
    const markerRotation = Number.isFinite(rotation) ? rotation : ((month % 12) * 30);

    return `
        <g transform="rotate(${markerRotation} ${x.toFixed(2)} ${y.toFixed(2)})">
            <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r}" fill="${color}" stroke="${PLATE_EDGE_COLOR}" stroke-width="0.95"/>
            ${Array.from({ length: 12 }, (_, index) => {
                const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
                const x1 = x + Math.cos(angle) * r * 0.62;
                const y1 = y + Math.sin(angle) * r * 0.62;
                const x2 = x + Math.cos(angle) * r * 0.86;
                const y2 = y + Math.sin(angle) * r * 0.86;
                return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${PLATE_EDGE_COLOR}" stroke-width="0.55"/>`;
            }).join("")}
            <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(r * 0.31).toFixed(2)}" fill="${PLATE_EDGE_COLOR}"/>
            <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(r * 0.23).toFixed(2)}" fill="${color}"/>
            <text
                x="${x.toFixed(2)}"
                y="${y.toFixed(2)}"
                text-anchor="middle"
                dominant-baseline="middle"
                font-family="Arial, sans-serif"
                font-size="${(r * 0.48).toFixed(2)}"
                font-weight="700"
                fill="${PLATE_EDGE_COLOR}"
                transform="rotate(${-markerRotation} ${x.toFixed(2)} ${y.toFixed(2)})"
            >${escapeHtml(shortYear)}</text>
        </g>
    `;
}

function renderStar(cx, cy, r) {
    const points = [];

    for (let index = 0; index < 10; index += 1) {
        const radius = index % 2 === 0 ? r : r * 0.42;
        const angle = -Math.PI / 2 + index * Math.PI / 5;
        points.push(`${(cx + Math.cos(angle) * radius).toFixed(2)},${(cy + Math.sin(angle) * radius).toFixed(2)}`);
    }

    return `<polygon points="${points.join(" ")}" fill="${EU_YELLOW}"/>`;
}

function renderDebugLayer(analysis) {
    const { layout, inner, width, height } = analysis;

    return `
        <g opacity="0.72">
            <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#00aaff" stroke-width="0.6" stroke-dasharray="4 4"/>
            <rect x="${inner.x}" y="${inner.y}" width="${inner.width}" height="${inner.height}" fill="none" stroke="#44cc44" stroke-width="0.6" stroke-dasharray="3 3"/>
            <line x1="${analysis.openLeftBoundary}" y1="${inner.y}" x2="${analysis.openLeftBoundary}" y2="${inner.y + inner.height}" stroke="#aa44ff" stroke-width="0.6" stroke-dasharray="3 3"/>
            <line x1="${analysis.openRightBoundary}" y1="${inner.y}" x2="${analysis.openRightBoundary}" y2="${inner.y + inner.height}" stroke="#aa44ff" stroke-width="0.6" stroke-dasharray="3 3"/>
            <text x="8" y="${height - 7}" font-family="monospace" font-size="7" fill="#0055aa">${escapeHtml(`${analysis.font.label}, ${Math.round(width)}×${height} mm, white ${Math.round(inner.height)} mm`)}</text>
        </g>
    `;
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
