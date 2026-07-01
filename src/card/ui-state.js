export const CONFIRM_TIMING = {
    minConfirmMs: 700,
    successMs: 800,
    crossfadeMs: 800,
    stampHideMs: 1980,
    serviceCallMs: 2160
};

export function getEntityUiState(uiStateByEntity, entityId) {
    if (!uiStateByEntity[entityId]) {
        uiStateByEntity[entityId] = {
            confirming: false,
            confirmStartedAt: 0,
            confirmFinishScheduled: false,
            confirmServiceScheduled: false,
            confirmStampExpired: null,
            confirmStampHidden: false,
            frozenBadge: null,
            crossfadeBadge: null,
            showSuccessUntil: 0
        };
    }

    return uiStateByEntity[entityId];
}

export function resetEntityUiStateAfterError(ui) {
    ui.confirming = false;
    ui.confirmFinishScheduled = false;
    ui.confirmServiceScheduled = false;
    ui.confirmStampExpired = null;
    ui.confirmStampHidden = false;
    ui.frozenBadge = null;
    ui.crossfadeBadge = null;
}

export function startEntityConfirmation(ui, badge) {
    ui.confirming = true;
    ui.confirmFinishScheduled = false;
    ui.confirmServiceScheduled = false;
    ui.confirmStampExpired = typeof badge.stampExpired === "boolean" ? badge.stampExpired : null;
    ui.confirmStampHidden = false;
    ui.confirmStartedAt = Date.now();
    ui.crossfadeBadge = null;
    ui.frozenBadge = {
        ...badge,
        blurred: true
    };
}
