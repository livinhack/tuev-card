export function normalizePlate(plate) {
    return String(plate || "")
        .trim()
        .replace(/[-–—]+/g, " ")
        .replace(/\s+/g, " ")
        .toUpperCase();
}

export function getPlateCharacterCount(plate) {
    return normalizePlate(plate)
        .replace(/\s/g, "")
        .length;
}

export function getPlateMaxWidth(tileWidth) {
    return Math.max(84, Math.floor(tileWidth - 2));
}

export function getSharedPlateScale(entityIds, hass, maxWidth, getLicensePlateMetrics) {
    const widestScaleBasisWidth = entityIds.reduce((widestWidth, entityId) => {
        const plate = hass.states[entityId]?.attributes?.plate || "";
        const metrics = getLicensePlateMetrics(plate);
        const scaleBasisWidth = metrics.scaleBasisWidth || metrics.width || 0;

        return Math.max(widestWidth, scaleBasisWidth);
    }, 0);

    if (!widestScaleBasisWidth || !maxWidth) {
        return 1;
    }

    const rawScale = Math.min(1, maxWidth / widestScaleBasisWidth);
    const baseHeight = getLicensePlateMetrics(entityIds
        .map((entityId) => hass.states[entityId]?.attributes?.plate || "")
        .find(Boolean) || "0").height || 38;

    // Snap the shared visible plate height to even pixels. The law-based
    // renderer uses a 520 mm standard-width reference for scaling, so very
    // short physical plates keep their shorter width without inflating the
    // shared visible height in wide single-column cards.
    const snappedHeight = Math.max(18, Math.floor((baseHeight * rawScale) / 2) * 2);

    return Math.min(1, snappedHeight / baseHeight);
}

export function getSharedPlateLayout({
    entityIds,
    hass,
    tileWidth,
    isGraphicalPlateAvailable,
    getLicensePlateMetrics
}) {
    if (!isGraphicalPlateAvailable) {
        return null;
    }

    const maxWidth = getPlateMaxWidth(tileWidth);
    const scale = getSharedPlateScale(entityIds, hass, maxWidth, getLicensePlateMetrics);

    return {
        maxWidth,
        scale
    };
}
