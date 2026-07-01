# b175 – Reduced width candidates and regression infrastructure

b175 is a documentation/infrastructure plus small Lab-rule step. It does not change Card code.

## Lab scope

The standalone Lab artifact `plate-physical-lab-b175-reduced-width-and-regression-infra.zip` is the authoritative Lab code for this step.

Changes in the standalone Lab:

- Reduced two-line standard keeps the b174 template as visual basis.
- Reduced width candidates were added: `180 / 200 / 220 / 240 / 255 mm`.
- The maximum remains `255 × 130 mm`.
- H/E, season and green variants for reduced two-line remain disabled.
- Regression cases moved to `src/plate/regression-cases.js`.
- `scripts/run-regression.mjs` runs the regression without browser/DOM and exits with code `1` on failure.
- The Lab README documents monitor calibration for non-Acer displays.

## Full/Card scope

No productive Card renderer code was changed.

The Full ZIP remains a handover/docs artifact. Its `tools/plate-physical-lab/` mirror must not be treated as the current Lab code unless a future handover explicitly marks it as synchronized.

## External review points

Handled now:

- Regression automation.
- Monitor calibration documentation.
- Explicit Lab/Full sync status.

Deferred until visual stability:

- Real extraction from `plate-svg-renderer.js` into `text-utils.js`, `plate-rules.js`, etc.
- Variant/Strategy object refactor.

Reason: b174/b175 Reduced Standard still requires visual confirmation before structural renderer changes.

## Next step

Visually check b175 Reduced Standard, especially whether the `240 mm` balanced result reduces the left margin acceptably compared with the Anlage-4 reference image.
