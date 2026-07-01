# b235 – Waterfill Loop Helper Cleanup

Base: uploaded b234 artifacts.

## Purpose

Restart from the safe b234 base and perform only a tiny cleanup that cannot alter geometry.

## Lab change

The Lab adds one local helper in `src/plate/plate-svg-renderer.js`:

- `waterFillSpacingSurfaces(surfaces, targetWidth)`

Only the identical repeated waterfill loop is centralized. The caller still decides:

- which surfaces exist
- min/preferred/max widths
- side margins
- reason text
- result structure

## Card status

No Card renderer/runtime/editor code changed in this full package.

## Verification

- Lab regression: `41/41 cases OK`
- b234 vs b235 model hashes: `41/41 identical`
- b234 vs b235 SVG hashes: `41/41 identical`
- Full check: passed
