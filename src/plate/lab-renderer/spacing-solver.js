// Kennzeichen Physical Lab b234 / spacing solver compatibility boundary
//
// The detailed spacing solvers are internal implementation details. This module
// remains as a compatibility boundary and forwards the public model builder via
// the stable public API instead of the renderer implementation file.

export {
  buildPlateModelMm
} from "./plate-public-api.js";
