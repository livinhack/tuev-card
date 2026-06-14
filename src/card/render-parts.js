import { renderBadge } from "../badge/renderer.js?v=b83";

export function renderMissingEntity(entityId, localize) {
    return `
        <div style="
            padding: 12px;
            border-radius: 12px;
            background: var(--card-background-color);
            border: 1px solid var(--divider-color);
        ">
            <div style="font-weight: 600; margin-bottom: 4px;">
                ${localize("error.entity_not_found")}
            </div>
            <div style="font-size: 13px; opacity: 0.75;">
                ${entityId}
            </div>
        </div>
    `;
}

export function renderVehicleHeader({
    compact,
    vehicleName,
    plate,
    plateLayout,
    renderPlate
}) {
    return `
        <div style="
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 1px;
            text-align: center;
        ">
            <div style="
                font-size: ${compact ? "18px" : "22px"};
                font-weight: 600;
                line-height: 1.2;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            ">
                ${vehicleName}
            </div>

            ${plateLayout && plate ? `
                <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    margin-top: 3px;
                    overflow: hidden;
                ">
                    ${renderPlate()}
                </div>
            ` : `
                <div style="
                    font-size: ${compact ? "13px" : "15px"};
                    opacity: 0.75;
                    letter-spacing: 0.08em;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                ">
                    ${plate}
                </div>
            `}
        </div>
    `;
}

export function renderVehicleDetails({ showDetails, compact, huLabel, statusColor, statusLabel }) {
    if (!showDetails) {
        return "";
    }

    return `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            font-size: ${compact ? "12px" : "13px"};
            line-height: 1.25;
            opacity: 0.82;
            text-align: center;
        ">
            <div style="font-weight: 600;">
                ${huLabel}
            </div>
            <div style="
                display: inline-flex;
                align-items: center;
                gap: 5px;
            ">
                <span style="
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: ${statusColor};
                    display: inline-block;
                    box-shadow: 0 0 5px ${statusColor};
                    flex: 0 0 auto;
                "></span>
                <span style="color: inherit;">
                    ${statusLabel}
                </span>
            </div>
        </div>
    `;
}

export function renderBadgeLayer(badge, size) {
    return `
        <div style="
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 1;
            z-index: 1;
        ">
            ${renderBadge(badge.year, badge.rotation, badge.blurred, size)}
        </div>
    `;
}

export function renderCrossfadeLayer(crossfade, size) {
    if (!crossfade.from) {
        return "";
    }

    return `
        <div style="
            position: absolute;
            inset: 0;
            z-index: 2;
            pointer-events: none;
        ">
            <div
                style="
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: tuevFadeOut ${crossfade.duration}ms ease forwards;
                "
            >
                ${renderBadge(crossfade.from.year, crossfade.from.rotation, crossfade.from.blurred, size)}
            </div>

            <div
                style="
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: tuevFadeIn ${crossfade.duration}ms ease forwards;
                "
            >
                ${renderBadge(crossfade.to.year, crossfade.to.rotation, crossfade.to.blurred, size)}
            </div>

            <style>
                @keyframes tuevFadeOut {
                    from { opacity: 1; transform: scale(1); }
                    to { opacity: 0; transform: scale(0.985); }
                }

                @keyframes tuevFadeIn {
                    from { opacity: 0; transform: scale(1.015); }
                    to { opacity: 1; transform: scale(1); }
                }
            </style>
        </div>
    `;
}

function renderStampLines(text) {
    const parts = String(text || "").trim().split(/\s+/).filter(Boolean);

    if (parts.length <= 1) {
        return `<span>${text}</span>`;
    }

    return `
        <span>${parts[0]}</span>
        <span>${parts.slice(1).join(" ")}</span>
    `;
}

export function renderCompactConfirmPanel({
    entityId,
    ui,
    overlayTitle,
    actionText,
    compact,
    expired,
    withBadge = false,
    badgeSize = 0,
    layoutColumns = 1
}) {
    if (ui.confirmStampHidden) {
        return "";
    }

    const confirming = ui.confirming;
    const safeBadgeSize = Number(badgeSize) || 0;
    const effectiveColumns = Number(layoutColumns) || 1;
    const badgeSingleColumn = withBadge && effectiveColumns <= 1;
    const badgeCompactText = withBadge && compact && !badgeSingleColumn;
    const badgeSpaciousText = withBadge && !badgeCompactText;
    const badgeScale = badgeSingleColumn
        ? Math.min(1.42, Math.max(1.14, safeBadgeSize / 170))
        : 1;
    const px = (value) => `${Math.round(value * badgeScale * 10) / 10}px`;
    const warningFontSize = badgeCompactText ? "8.2px" : (badgeSpaciousText ? px(12.8) : (compact ? "10px" : "11px"));
    const actionFontSize = badgeCompactText ? "7.0px" : (badgeSpaciousText ? px(10.9) : (compact ? "9px" : "10px"));
    const frozenExpired = typeof ui.confirmStampExpired === "boolean" ? ui.confirmStampExpired : expired;
    const stampColor = frozenExpired
        ? "var(--error-color, #db5337)"
        : "var(--warning-color, #ffa000)";
    const actionColor = "var(--success-color, #2e9d43)";
    const stampLines = renderStampLines(overlayTitle);
    const actionLines = renderStampLines(actionText);
    const warningAnimation = confirming
        ? "tuevStampB62WarningFade 680ms ease 760ms forwards"
        : "none";
    const actionAnimation = confirming
        ? "tuevStampB62ActionFade 620ms ease 1320ms forwards"
        : "none";
    const checkAnimation = confirming
        ? "tuevStampB62CheckDraw 680ms cubic-bezier(.2, .88, .18, 1) 0ms forwards"
        : "none";

    return `
        <style>
            @keyframes tuevStampB62CheckDraw {
                0% {
                    stroke-dashoffset: 1;
                    opacity: 0.2;
                }
                12% {
                    opacity: 1;
                }
                100% {
                    stroke-dashoffset: 0;
                    opacity: 1;
                }
            }

            @keyframes tuevStampB62WarningFade {
                0%, 36% {
                    opacity: 0.92;
                    filter: saturate(1.18) brightness(1);
                }
                100% {
                    opacity: 0;
                    filter: saturate(0.88) brightness(0.72);
                }
            }

            @keyframes tuevStampB62ActionFade {
                0%, 48% {
                    opacity: 0.92;
                    filter: saturate(1.18) brightness(1);
                }
                100% {
                    opacity: 0;
                    filter: saturate(0.88) brightness(0.76);
                }
            }
        </style>
        <div style="
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(-18deg);
            z-index: 6;
            width: max-content;
            max-width: min(98%, ${badgeSingleColumn ? px(Math.min(236, Math.max(196, safeBadgeSize * 0.98))) : (compact ? (withBadge ? "168px" : "154px") : (badgeSpaciousText ? "218px" : "178px"))});
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: ${badgeCompactText ? "4px" : (badgeSingleColumn ? px(5.5) : (compact ? "3px" : "4px"))};
            pointer-events: none;
            filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.48));
        ">
            <div style="
                position: relative;
                box-sizing: border-box;
                min-width: ${badgeCompactText ? "74px" : (badgeSingleColumn ? px(116) : (badgeSpaciousText ? "104px" : (compact ? "62px" : "72px")))};
                max-width: 100%;
                padding: ${badgeCompactText ? "4px 10px 5px" : (badgeSingleColumn ? `${px(6)} ${px(15)} ${px(7)}` : (badgeSpaciousText ? "6px 13px 7px" : (compact ? "4px 8px 5px" : "5px 10px 6px")))};
                border: 2px solid color-mix(in srgb, ${stampColor} 88%, transparent);
                outline: 1px dashed color-mix(in srgb, ${stampColor} 64%, transparent);
                outline-offset: -4px;
                border-radius: 4px;
                background:
                    radial-gradient(circle at 24% 24%, color-mix(in srgb, ${stampColor} 28%, transparent), transparent 45%),
                    radial-gradient(circle at 72% 70%, color-mix(in srgb, ${stampColor} 16%, transparent), transparent 48%),
                    linear-gradient(135deg, transparent 0 10%, color-mix(in srgb, ${stampColor} 18%, transparent) 10% 21%, transparent 21% 100%),
                    color-mix(in srgb, ${stampColor} 18%, rgba(0, 0, 0, 0.78));
                color: color-mix(in srgb, ${stampColor} 78%, white 22%);
                font-family: 'Arial Narrow', 'DIN Condensed', 'Bahnschrift SemiCondensed', sans-serif;
                font-size: ${warningFontSize};
                font-weight: 900;
                line-height: ${badgeCompactText ? "0.90" : (badgeSpaciousText ? "0.94" : "0.92")};
                letter-spacing: ${badgeCompactText ? "0.12px" : (badgeSingleColumn ? px(0.34) : (badgeSpaciousText ? "0.34px" : "0.28px"))};
                text-transform: uppercase;
                text-align: center;
                text-shadow: 0 1px 1px rgba(0, 0, 0, 0.78), 0 0 5px rgba(0, 0, 0, 0.35);
                opacity: 0.92;
                overflow: hidden;
                pointer-events: none;
                backdrop-filter: blur(2.2px) saturate(1.18);
                animation: ${warningAnimation};
            ">
                <span style="position: absolute; left: 10%; top: -3px; width: 20px; height: 6px; background: rgba(0, 0, 0, 0.60); transform: rotate(-7deg); opacity: 0.34;"></span>
                <span style="position: absolute; right: 16%; bottom: -3px; width: 26px; height: 5px; background: rgba(0, 0, 0, 0.62); transform: rotate(5deg); opacity: 0.32;"></span>
                <span style="position: absolute; left: 46%; top: 47%; width: 31px; height: 2px; background: rgba(0, 0, 0, 0.50); transform: rotate(-10deg); opacity: 0.22;"></span>
                <span style="position: relative; z-index: 1; display: flex; width: 100%; flex-direction: column; align-items: center; justify-content: center; gap: 1px; white-space: nowrap; text-align: center;">
                    ${stampLines}
                </span>
            </div>

            <button
                data-confirm-entity="${entityId}"
                ${confirming ? "disabled" : ""}
                style="
                    position: relative;
                    transform: translateX(${badgeSingleColumn ? px(18) : (compact ? "9px" : (badgeSpaciousText ? "17px" : "13px"))}) rotate(14deg);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: ${badgeCompactText ? "5px" : (badgeSingleColumn ? px(7) : (badgeSpaciousText ? "7px" : (compact ? "5px" : "6px")))};
                    max-width: 100%;
                    min-width: ${badgeCompactText ? "82px" : (badgeSingleColumn ? px(130) : (badgeSpaciousText ? "118px" : "0"))};
                    box-sizing: border-box;
                    padding: ${badgeCompactText ? "4px 8px" : (badgeSingleColumn ? `${px(6)} ${px(11)}` : (badgeSpaciousText ? "6px 10px" : (compact ? "4px 6px" : "5px 8px")))};
                    border-radius: 4px;
                    border: 2px solid color-mix(in srgb, ${actionColor} 88%, transparent);
                    outline: 1px dashed color-mix(in srgb, ${actionColor} 62%, transparent);
                    outline-offset: -4px;
                    background:
                        radial-gradient(circle at 72% 28%, color-mix(in srgb, ${actionColor} 26%, transparent), transparent 44%),
                        radial-gradient(circle at 24% 76%, color-mix(in srgb, ${actionColor} 14%, transparent), transparent 48%),
                        linear-gradient(135deg, transparent 0 12%, color-mix(in srgb, ${actionColor} 18%, transparent) 12% 23%, transparent 23% 100%),
                        color-mix(in srgb, ${actionColor} 18%, rgba(0, 0, 0, 0.76));
                    color: color-mix(in srgb, ${actionColor} 76%, white 24%);
                    font-family: 'Arial Narrow', 'DIN Condensed', 'Bahnschrift SemiCondensed', sans-serif;
                    font-size: ${actionFontSize};
                    font-weight: 900;
                    line-height: ${badgeCompactText ? "0.86" : (badgeSpaciousText ? "0.96" : "0.94")};
                    letter-spacing: ${badgeCompactText ? "0.08px" : (badgeSingleColumn ? px(0.24) : (badgeSpaciousText ? "0.22px" : "0.18px"))};
                    text-transform: uppercase;
                    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.75), 0 0 5px rgba(0, 0, 0, 0.35);
                    cursor: ${confirming ? "default" : "pointer"};
                    opacity: 0.92;
                    pointer-events: auto;
                    box-shadow: 0 0 10px color-mix(in srgb, ${actionColor} 28%, transparent);
                    backdrop-filter: blur(2.2px) saturate(1.18);
                    animation: ${actionAnimation};
                "
            >
                <span style="
                    min-width: 0;
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1px;
                    white-space: nowrap;
                ">${actionLines}</span>
                <span style="
                    flex: 0 0 auto;
                    width: ${badgeSingleColumn ? px(22) : (compact ? "17px" : (badgeSpaciousText ? "21px" : "19px"))};
                    height: ${badgeSingleColumn ? px(22) : (compact ? "17px" : (badgeSpaciousText ? "21px" : "19px"))};
                    border-radius: 2px;
                    border: 1.7px solid currentColor;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                    background: rgba(0, 0, 0, 0.24);
                    overflow: visible;
                    transform: translateX(${badgeCompactText ? "3.5px" : "0"});
                ">
                    <svg viewBox="0 0 18 18" width="${badgeSingleColumn ? Math.round(22 * badgeScale) : (compact ? "17" : (badgeSpaciousText ? "21" : "19"))}" height="${badgeSingleColumn ? Math.round(22 * badgeScale) : (compact ? "17" : (badgeSpaciousText ? "21" : "19"))}" aria-hidden="true" style="display: block; overflow: visible;">
                        <path
                            pathLength="1"
                            d="M3.1 9.5 L7.0 13.0 L15.2 4.3"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.9"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            style="stroke-dasharray: 1; stroke-dashoffset: ${confirming ? "1" : "1"}; opacity: ${confirming ? "1" : "0"}; animation: ${checkAnimation}; filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.58)) drop-shadow(0 0 4px color-mix(in srgb, currentColor 55%, transparent));"
                        />
                    </svg>
                </span>
            </button>
        </div>
    `;
}


export function renderBadgeArea({
    badgeSize,
    badgeLayer,
    crossfadeLayer,
    overlay
}) {
    return `
        <div style="
            position: relative;
            width: ${badgeSize}px;
            height: ${badgeSize}px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            ${badgeLayer}
            ${crossfadeLayer}
            ${overlay}
        </div>
    `;
}
