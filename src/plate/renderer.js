import {
    buildPlateModelMm,
    ONE_LINE_RULES_MM,
    renderPlateSvgMm
} from "./mm-model.js?v=b117";
import {
    checkPlateFontAvailable,
    ensurePlateFont,
    getPlateFontFaceCss,
    getPlateFontStatus,
    injectPlateFont,
    isPlateFontLoaded
} from "./font.js?v=b117";

export {
    checkPlateFontAvailable,
    ensurePlateFont,
    getPlateFontStatus,
    isPlateFontLoaded
};

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
        if (typeof document !== "undefined") {
            injectPlateFont();
        }
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
    const displayWidth = Math.max(1, Math.round(analysis.width * scale));
    const displayHeight = Math.max(1, Math.round(analysis.height * scale));

    const result = renderPlateSvgMm(analysis.normalizedPlate, {
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
        huRotation: options.huRotation,
        extraDefs: renderEmbeddedFontDefs()
    });

    return addCardSvgAttributes(result.svg, {
        displayWidth,
        displayHeight,
        normalizedPlate: analysis.normalizedPlate,
        model: analysis.model
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
        overflow: !model.metrics.width || model.metrics.remainingLeft < ONE_LINE_RULES_MM.content.sideClearance - 0.01
    };
}

function renderEmbeddedFontDefs() {
    const css = getPlateFontFaceCss();

    if (!css.trim()) {
        return "";
    }

    return `<style>${css}</style>`;
}

function addCardSvgAttributes(svg, { displayWidth, displayHeight, normalizedPlate, model }) {
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
