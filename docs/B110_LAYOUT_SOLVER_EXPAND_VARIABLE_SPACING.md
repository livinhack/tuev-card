# b110 Layout Solver Expand Variable Spacing

## Purpose

b110 updates the standalone physical plate lab. It keeps the CAD-like millimetre model and fixes the behaviour observed in b109: when the selected physical width had enough spare room, the solver left the spare room almost entirely as outside margin instead of using the allowed variable spacing ranges first.

## Rule

The physical model is still solved before rendering. Pixels, DPR, browser zoom and monitor calibration remain viewer-only.

For a selected width, the solver now works in this order:

1. Build fixed cells and variable items in millimetres.
2. Choose the physical width band.
3. If preferred values fit, expand variable items toward their max values:
   - character gap: 8–10 mm, preferred 9 mm;
   - group gap: 20–30 mm, preferred 24 mm;
   - seal column: 63.5–67.5 mm, preferred 63.5 mm.
4. Only after variable items reach their max values does remaining space become equal outside margin.
5. If preferred values do not fit, shrink variable items down toward their min values.
6. If the minimum values do not fit, the layout is marked as not fitting.

## Effect

Examples in Auto kompakt should now show expanded spacing when possible:

- `K S 70` should use 380 mm and expand variable spacing up to max values.
- `TR M 6` should use 380 mm and expand variable spacing up to max values.
- `5` may remain 340 mm, but the seal column should expand from 63.5 mm to 67.5 mm before the rest becomes equal outside margin.

## Files

- `tools/plate-physical-lab/mm-model.js`
- `tools/plate-physical-lab/app.js`
- `tools/plate-physical-lab/index.html`
- `tools/plate-physical-lab/README.md`
- `HANDOVER.md`
