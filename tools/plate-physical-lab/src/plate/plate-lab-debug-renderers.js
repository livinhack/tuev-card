// Kennzeichen Physical Lab b312 / Lab-only debug renderer wiring
// Keeps debug-dimensions out of the production render shell while preserving
// Lab diagnostics through explicit dependency injection.

import { renderDimensions, renderGrid, renderHorizontalDiagnostics } from "./debug-dimensions.js";

export const labDebugRenderers = {
  renderDimensions,
  renderGrid,
  renderHorizontalDiagnostics
};
