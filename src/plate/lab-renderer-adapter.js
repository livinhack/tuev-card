// TÜV Reminder Card b325 / direct Card plate renderer integration adapter
//
// This module is imported by the active Card renderer boundary in renderer.js.
// No legacy toggle or fallback is planned; rollback remains the previous ZIP.

import {
    ONE_LINE_RULES_MM as LAB_ONE_LINE_RULES_MM,
    buildPlateModelMm as buildLabPlateModelMm,
    renderPlateSvgMm as renderLabPlateSvgMm
} from "./lab-renderer/plate-public-api.js";
import {
    checkPlateFontAvailable,
    ensurePlateFont,
    getPlateFontFaceCss,
    getPlateFontStatus,
    injectPlateFont,
    isPlateFontLoaded
} from "./font.js";

export {
    checkPlateFontAvailable,
    ensurePlateFont,
    getPlateFontStatus,
    isPlateFontLoaded
};

let labPlateFontRequested = false;

export function normalizeLabRendererPlate(plate) {
    return String(plate || "")
        .trim()
        .replace(/[-–—]+/g, " ")
        .replace(/\s+/g, " ")
        .toUpperCase();
}

export function getLabRendererLicensePlateMetrics(plate, options = {}) {
    const normalizedPlate = normalizeLabRendererPlate(plate);

    if (!normalizedPlate) {
        return {
            width: 0,
            height: 0,
            scaleBasisWidth: LAB_ONE_LINE_RULES_MM.maxWidth,
            normalizedPlate: ""
        };
    }

    const model = buildLabPlateModelMm(normalizedPlate, createLabRendererOptions(options));

    return {
        width: model.metrics.width,
        height: model.metrics.height,
        scaleBasisWidth: model.metrics.width,
        normalizedPlate: model.metrics.normalized,
        model,
        canvas: { x: 0, y: 0, width: model.metrics.width, height: model.metrics.height },
        fontVariant: null,
        fontMode: model.metrics.fontMode,
        fontLabel: model.metrics.fontLabel,
        sealColumnWidth: model.metrics.sealColumnWidth,
        sealColumnRange: model.metrics.sealColumnRange,
        sealColumnRule: model.metrics.sealColumnRule,
        sideMarginLeft: model.metrics.remainingLeft,
        sideMarginRight: model.metrics.remainingRight,
        overflow: !model.metrics.width || model.metrics.remainingLeft < LAB_ONE_LINE_RULES_MM.content.sideClearance - 0.01
    };
}

export function renderLicensePlateWithLabRenderer(plate, options = {}) {
    if (!labPlateFontRequested) {
        labPlateFontRequested = true;
        if (typeof document !== "undefined") {
            injectPlateFont();
        }
    }

    const analysis = getLabRendererLicensePlateMetrics(plate, options);

    if (!analysis.normalizedPlate) {
        return "";
    }

    const requestedScale = Number(options.scale || 0);
    const maxWidth = Number(options.maxWidth || 0);
    const scaleBasisWidth = analysis.scaleBasisWidth || analysis.width || LAB_ONE_LINE_RULES_MM.maxWidth;
    const fallbackScale = Number.isFinite(maxWidth) && maxWidth > 0
        ? maxWidth / scaleBasisWidth
        : 1;
    const scale = Number.isFinite(requestedScale) && requestedScale > 0
        ? Math.min(1, requestedScale)
        : Math.min(1, fallbackScale);
    const displayWidth = Math.max(1, Math.round(analysis.width * scale));
    const displayHeight = Math.max(1, Math.round(analysis.height * scale));

    const result = renderLabPlateSvgMm(analysis.normalizedPlate, {
        ...createLabRendererOptions(options),
        extraDefs: renderEmbeddedFontDefs()
    });

    return addLabRendererCardSvgAttributes(result.svg, {
        displayWidth,
        displayHeight,
        model: analysis.model
    });
}

export function normalizePlate(plate) {
    return normalizeLabRendererPlate(plate);
}

export function getLicensePlateMetrics(plate, options = {}) {
    return getLabRendererLicensePlateMetrics(plate, options);
}

export function renderLicensePlate(plate, options = {}) {
    return renderLicensePlateWithLabRenderer(plate, options);
}

function createLabRendererOptions(options = {}) {
    return {
        fontMode: options.fontMode || "auto",
        widthMode: options.widthMode || "balanced",
        specialIWidth: options.specialIWidth || 35.5,
        stage: "complete",
        showDimensions: false,
        showDxfReferenceGuides: options.debug === true,
        showGrid: options.debug === true,
        showSeals: true,
        showText: true,
        huYear: options.huYear,
        huMonth: options.huMonth,
        huRotation: options.huRotation
    };
}

function renderEmbeddedFontDefs() {
    const css = getPlateFontFaceCss();

    if (!css.trim()) {
        return "";
    }

    return `<style>${css}</style>`;
}

function addLabRendererCardSvgAttributes(svg, { displayWidth, displayHeight, model }) {
    return svg.replace(
        /<svg\s+class="physical-plate-svg"/,
        `<svg class="tuev-plate tuev-plate-physical physical-plate-svg" width="${displayWidth}" height="${displayHeight}" data-card-renderer="physical-lab" data-font-mode="${escapeAttr(model.metrics.fontMode)}" data-seal-column-rule="${escapeAttr(model.metrics.sealColumnRule)}"`
    );
}

function escapeAttr(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}
