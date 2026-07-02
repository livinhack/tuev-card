// TÜV Reminder Card b339 / direct Card plate renderer integration
//
// The active Card plate renderer now delegates directly to the staged Physical
// Lab renderer adapter. There is intentionally no legacy renderer toggle and no
// parallel fallback path in this module; rollback is the previous ZIP.

export {
    checkPlateFontAvailable,
    ensurePlateFont,
    getPlateFontStatus,
    isPlateFontLoaded,
    normalizePlate,
    getLicensePlateMetrics,
    renderLicensePlate
} from "./lab-renderer-adapter.js?v=b350";
