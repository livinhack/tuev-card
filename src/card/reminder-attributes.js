function asBoolean(value) {
    return value === true || value === "true" || value === 1 || value === "1";
}

function cleanText(value) {
    return String(value || "").trim().replace(/\s+/g, " ").toUpperCase();
}

function cleanCompactText(value) {
    return cleanText(value).replace(/\s+/g, "");
}

function normalizeSuffix(value) {
    const suffix = cleanCompactText(value);
    if (suffix === "H" || suffix === "E" || suffix === "HE" || suffix === "EH") {
        return suffix === "EH" ? "HE" : suffix;
    }
    return "";
}

export function getReminderPlateSuffix(attr = {}) {
    const suffixH = asBoolean(attr.plate_suffix_h);
    const suffixE = asBoolean(attr.plate_suffix_e);

    if (suffixH || suffixE) {
        return `${suffixH ? "H" : ""}${suffixE ? "E" : ""}`;
    }

    return normalizeSuffix(attr.plate_suffix);
}

function composeDisplayPlate(basePlate, suffix) {
    const base = cleanText(basePlate);
    const normalizedSuffix = normalizeSuffix(suffix);

    if (!base || !normalizedSuffix) {
        return base;
    }

    return base.endsWith(normalizedSuffix) ? base : `${base}${normalizedSuffix}`;
}

export function mapReminderPlateFormat(value) {
    const key = String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");

    if (["two_line", "twoline", "twoLine"].includes(key)) {
        return "twoLine";
    }

    if (["small_two_line", "reduced_two_line", "reducedtwoline", "reduced", "verkleinert_two_line"].includes(key)) {
        return "reducedTwoLine";
    }

    if (["motorcycle", "motorcycle_plate", "kraftrad"].includes(key)) {
        return "motorcycle";
    }

    return "oneLine";
}

export function getReminderPlateData(attr = {}) {
    const suffix = getReminderPlateSuffix(attr);
    const plateBase = cleanText(attr.plate_base || attr.plate || "");
    const plateDisplay = cleanText(attr.plate_display || composeDisplayPlate(plateBase, suffix) || attr.plate || "");
    const plateKind = String(attr.plate_kind || "").trim().toLowerCase();
    const changeEnabled = asBoolean(attr.change_plate_enabled) || plateKind === "change";
    const changeCommonText = cleanText(attr.change_plate_common_text || "");
    const changeVehicleDigit = cleanCompactText(attr.change_plate_vehicle_digit || attr.change_plate_vehicle_text || "");
    const changeVehicleText = changeVehicleDigit && suffix && !changeVehicleDigit.endsWith(suffix)
        ? `${changeVehicleDigit}${suffix}`
        : changeVehicleDigit;
    const seasonal = asBoolean(attr.seasonal);
    const seasonStartMonth = Number(attr.season_start_month);
    const seasonEndMonth = Number(attr.season_end_month);
    const plateColorMode = String(attr.plate_color_mode || "").trim().toLowerCase() === "green"
        ? "green"
        : "standard";
    const labPlateFormat = mapReminderPlateFormat(attr.plate_format);

    return {
        plate: plateDisplay || plateBase,
        plateBase,
        plateDisplay: plateDisplay || plateBase,
        suffix,
        suffixH: suffix.includes("H"),
        suffixE: suffix.includes("E"),
        plateColorMode,
        seasonal,
        seasonStartMonth: Number.isFinite(seasonStartMonth) ? seasonStartMonth : null,
        seasonEndMonth: Number.isFinite(seasonEndMonth) ? seasonEndMonth : null,
        changeEnabled,
        changeCommonText,
        changeVehicleDigit,
        changeVehicleText,
        plateFormat: attr.plate_format || "single_line",
        labPlateFormat,
        rendererOptions: {
            plateFormat: labPlateFormat,
            visualStyle: {
                plateColorMode
            },
            season: {
                enabled: seasonal,
                from: Number.isFinite(seasonStartMonth) ? seasonStartMonth : null,
                to: Number.isFinite(seasonEndMonth) ? seasonEndMonth : null
            },
            changePlate: {
                enabled: changeEnabled,
                commonText: changeCommonText,
                vehicleText: changeVehicleText
            }
        }
    };
}
