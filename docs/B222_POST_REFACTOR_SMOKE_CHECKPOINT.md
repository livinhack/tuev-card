# b222 – Post-refactor smoke checkpoint

b222 is a handover/checkpoint after the Lab refactors b214-b221.

No Card renderer code was changed.

Lab status referenced by this handover:

- authoritative Lab ZIP: `plate-physical-lab-b222-post-refactor-smoke-checkpoint.zip`
- Lab regression: `Regression passed: 41/41 cases OK.`
- Reduced, Eurofield, seals, season field, debug layer, row-chain solver, text/glyph utilities, plate body and render shell remain at the confirmed b221 geometry.

Full/Card status:

- `npm run check` passed.
- Known font warnings are expected in ChatGPT ZIPs because `.ttf` binaries are intentionally not included.
- For GitHub/HACS releases, local font binaries still need to be present before running the build.

Full `tools/plate-physical-lab/` status:

- The Full ZIP does not make the Lab mirror authoritative.
- The separate Lab ZIP remains the source of truth.
