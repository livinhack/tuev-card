import { tuevColorForYear } from "../badge/profile.js?v=b114";
import {
    buildPlateModelMm,
    getCanvasMm,
    getCharacterBand,
    ONE_LINE_RULES_MM
} from "./mm-model.js?v=b114";
import {
    checkPlateFontAvailable,
    ensurePlateFont,
    getDefaultPlateFontVariant,
    getPlateFontStatus,
    injectPlateFont,
    isPlateFontLoaded
} from "./font.js?v=b114";

export {
    checkPlateFontAvailable,
    ensurePlateFont,
    getPlateFontStatus,
    isPlateFontLoaded
};

const PLATE_FACE_COLOR = "#f4f3ee";
const PLATE_EDGE_COLOR = "#0d0d0d";
const EU_BLUE = "#0046ad";
const EU_YELLOW = "#ffd200";
const AUTHORITY_SEAL_FILL = "#d7d7d2";
const AUTHORITY_SEAL_STROKE = "#999";
const AUTHORITY_SEAL_HIGHLIGHT = "#f4f4ed";

let plateFontRequested = false;

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

    const analysis = getLicensePlateMetrics(plate, options);

    if (!analysis.normalizedPlate) {
        return "";
    }

    const requestedScale = Number(options.scale || 0);
    const maxWidth = Number(options.maxWidth || 0);
    const scaleBasisWidth = analysis.scaleBasisWidth || analysis.width || ONE_LINE_RULES_MM.maxWidth;
    const fallbackScale = Number.isFinite(maxWidth) && maxWidth > 0
        ? maxWidth / scaleBasisWidth
        : 1;
    const scale = Number.isFinite(requestedScale) && requestedScale > 0
        ? Math.min(1, requestedScale)
        : Math.min(1, fallbackScale);

    return renderPhysicalPlateSvg({
        analysis,
        displayWidth: Math.max(1, Math.round(analysis.width * scale)),
        displayHeight: Math.max(1, Math.round(analysis.height * scale)),
        options
    });
}

export function getLicensePlateMetrics(plate, options = {}) {
    const normalizedPlate = normalizePlate(plate);

    if (!normalizedPlate) {
        return {
            width: 0,
            height: 0,
            scaleBasisWidth: ONE_LINE_RULES_MM.maxWidth,
            normalizedPlate: ""
        };
    }

    const model = buildPlateModelMm(normalizedPlate, {
        fontMode: options.fontMode || "auto",
        widthMode: options.widthMode || "balanced",
        specialIWidth: options.specialIWidth || 35.5
    });
    const fontVariant = getFontVariantForMode(model.metrics.fontMode);
    const canvas = getCanvasMm(model, false);

    return {
        width: model.metrics.width,
        height: model.metrics.height,
        scaleBasisWidth: model.metrics.width,
        normalizedPlate: model.metrics.normalized,
        model,
        canvas,
        fontVariant,
        fontMode: model.metrics.fontMode,
        fontLabel: model.metrics.fontLabel,
        sealColumnWidth: model.metrics.sealColumnWidth,
        sealColumnRange: model.metrics.sealColumnRange,
        sealColumnRule: model.metrics.sealColumnRule,
        sideMarginLeft: model.metrics.remainingLeft,
        sideMarginRight: model.metrics.remainingRight,
        overflow: !model.metrics.width || model.metrics.remainingLeft < ONE_LINE_RULES_MM.content.sideClearance - 0.01
    };
}

function getFontVariantForMode(fontMode) {
    const status = getPlateFontStatus();
    const fonts = Array.isArray(status?.fonts) ? status.fonts : [];
    const role = fontMode === "narrow" ? "eng" : "mtl";
    return fonts.find((font) => font.source === "gl" && font.role === role)
        || fonts.find((font) => font.source === "gl" && font.role === "mtl")
        || fonts.find((font) => font.source === "gl" && font.role === "eng")
        || fonts.find((font) => font.source === "europlate")
        || getDefaultPlateFontVariant();
}

function renderPhysicalPlateSvg({ analysis, displayWidth, displayHeight, options }) {
    const { model, fontVariant } = analysis;
    const { rules, metrics } = model;
    const clipId = `tuev-physical-plate-${hashString(metrics.normalized)}-${Math.round(metrics.width)}`;
    const fontFamily = fontVariant?.family || model.font.fontFamily;
    const fontWeight = fontVariant?.weight || 400;

    return `
        <svg
            class="tuev-plate tuev-plate-physical"
            xmlns="http://www.w3.org/2000/svg"
            width="${displayWidth}"
            height="${displayHeight}"
            viewBox="0 0 ${metrics.width} ${rules.outerHeight}"
            role="img"
            aria-label="${escapeHtml(metrics.normalized)}"
            data-model-unit="mm"
            data-plate-width-mm="${metrics.width}"
            data-plate-height-mm="${rules.outerHeight}"
            data-font-mode="${escapeHtml(metrics.fontMode)}"
            data-seal-column-rule="${escapeHtml(metrics.sealColumnRule)}"
            preserveAspectRatio="xMidYMid meet"
        >
            <defs>
                <clipPath id="${clipId}">
                    <rect
                        x="0"
                        y="0"
                        width="${metrics.width}"
                        height="${rules.outerHeight}"
                        rx="${rules.outerCornerRadius}"
                        ry="${rules.outerCornerRadius}"
                    />
                </clipPath>
                <style>
                    .tuev-physical-plate-text-${clipId} {
                        font-family: "${fontFamily}", "Arial Narrow", sans-serif;
                        font-size: ${model.font.fontSize}px;
                        font-weight: ${fontWeight};
                        text-anchor: middle;
                    }
                </style>
            </defs>
            <g clip-path="url(#${clipId})">
                ${renderBody(model)}
                ${renderSeals(model, options)}
                ${renderText(model, `tuev-physical-plate-text-${clipId}`)}
                ${options.debug ? renderDebugLayer(model) : ""}
            </g>
            <rect
                x="${rules.innerInset / 2}"
                y="${rules.innerInset / 2}"
                width="${metrics.width - rules.innerInset}"
                height="${rules.outerHeight - rules.innerInset}"
                rx="${rules.outerCornerRadius}"
                ry="${rules.outerCornerRadius}"
                fill="none"
                stroke="${PLATE_EDGE_COLOR}"
                stroke-width="${rules.innerInset}"
            />
        </svg>
    `;
}

function renderBody({ rules, metrics }) {
    const w = metrics.width;
    const h = rules.outerHeight;
    const inset = rules.innerInset;
    const euro = rules.euro;

    return `
        <g class="tuev-plate-body">
            <rect x="0" y="0" width="${w}" height="${h}" rx="${rules.outerCornerRadius}" fill="${PLATE_EDGE_COLOR}"/>
            <rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${rules.innerHeight}" rx="${rules.innerCornerRadius}" fill="${PLATE_FACE_COLOR}"/>
            <rect x="${euro.x}" y="${euro.y}" width="${euro.width}" height="${euro.height}" fill="${EU_BLUE}"/>
            ${renderEuStars(euro.starsCenterX, euro.starsCenterY, euro.starsRadius)}
            <text
                x="${euro.countryCenterX}"
                y="${euro.countryBaselineY}"
                text-anchor="middle"
                font-family="DIN1451Alt, AlteDIN1451Mittelschrift, Arial, sans-serif"
                font-size="30"
                font-weight="500"
                fill="#fff"
            >${escapeHtml(euro.country)}</text>
        </g>
    `;
}

function renderSeals({ content, rules }, options) {
    const seal = content.find((item) => item.type === "seals");

    if (!seal) {
        return "";
    }

    const geometry = getSealGeometry(rules, seal);

    return `
        <g class="tuev-plate-seals">
            ${renderHuSeal({
                x: geometry.cx,
                y: geometry.hu.cy,
                diameter: geometry.hu.diameter,
                year: Number(options.huYear || new Date().getFullYear()),
                month: Number(options.huMonth || 1),
                rotation: Number(options.huRotation || 0)
            })}
            ${renderAuthoritySeal({
                x: geometry.cx,
                y: geometry.authority.cy,
                diameter: geometry.authority.diameter
            })}
        </g>
    `;
}

function renderText({ content, font }, className) {
    return `
        <g class="tuev-plate-text">
            ${content.filter((item) => item.type === "char").map((cell) => `
                <text
                    class="${className}"
                    x="${(cell.x + cell.width / 2).toFixed(2)}"
                    y="${font.baselineY}"
                    fill="${PLATE_EDGE_COLOR}"
                >${escapeHtml(cell.char)}</text>
            `).join("")}
        </g>
    `;
}

function getSealGeometry(rules, sealItem) {
    const charBand = getCharacterBand(rules);
    const sealRules = rules.content.seal;
    const innerWidth = Number(sealItem.width) || sealRules.columnWidth;
    const cx = sealItem.x + innerWidth / 2;

    return {
        cx,
        innerColumnLeft: sealItem.x,
        innerColumnRight: sealItem.x + innerWidth,
        innerColumnWidth: innerWidth,
        hu: {
            cy: sealRules.huCenterY,
            diameter: sealRules.huDiameter,
            radius: sealRules.huDiameter / 2
        },
        authority: {
            cy: sealRules.authorityCenterY,
            diameter: sealRules.authorityDiameter,
            radius: sealRules.authorityDiameter / 2
        },
        charBand
    };
}

function renderAuthoritySeal({ x, y, diameter }) {
    const r = diameter / 2;

    return `
        <g opacity="0.96">
            <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r.toFixed(2)}" fill="${AUTHORITY_SEAL_FILL}" stroke="${AUTHORITY_SEAL_STROKE}" stroke-width="1"/>
            <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(r * 0.55).toFixed(2)}" fill="none" stroke="${AUTHORITY_SEAL_HIGHLIGHT}" stroke-width="1" opacity="0.85"/>
            <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(r * 0.18).toFixed(2)}" fill="${AUTHORITY_SEAL_STROKE}" opacity="0.55"/>
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

function renderEuStars(cx, cy, r) {
    return `<g class="tuev-plate-eu-stars">${Array.from({ length: 12 }, (_, index) => {
        const angle = -Math.PI / 2 + (Math.PI * 2 * index) / 12;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        return `<text x="${x.toFixed(2)}" y="${(y + 1.6).toFixed(2)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="${EU_YELLOW}">●</text>`;
    }).join("")}</g>`;
}

function renderDebugLayer({ content, rules, metrics }) {
    const charBand = getCharacterBand(rules);
    const cells = content.map((item) => {
        if (item.type === "char") {
            return `<rect x="${item.x}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="none" stroke="#1ea5ff" stroke-width="0.4"/>`;
        }
        if (item.type === "seals") {
            return `<rect x="${item.x}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="none" stroke="#ffd36b" stroke-width="0.5"/>`;
        }
        return `<rect x="${item.x}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="none" stroke="#ff7777" stroke-width="0.35" stroke-dasharray="1.5 1"/>`;
    }).join("");

    return `
        <g class="tuev-plate-debug" opacity="0.72">
            <rect x="0" y="0" width="${metrics.width}" height="${rules.outerHeight}" fill="none" stroke="#00aaff" stroke-width="0.6" stroke-dasharray="4 4"/>
            ${cells}
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
