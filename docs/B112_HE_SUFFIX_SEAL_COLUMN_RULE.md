# b112 – H/E suffix seal column rule in Physical Lab

b112 updates only the standalone Physical Lab model. The Home Assistant card renderer is still not integrated with this new mm model.

## Reason

In b111 the one-line seal column always used the normal range:

- normal seal column: `63.5 mm` to `67.5 mm`

This made `HH EV 204E` fail the equal outside margin rule because the b111 solver could not keep both outside margins at the required minimum of `8 mm`.

According to the current project interpretation of Anlage 4, one-line plates with a final Oldtimer/Electric suffix may use a wider seal-column range:

- final `H` / `E` suffix after a digit: `58.0 mm` to `67.5 mm`

## Implementation

The Lab now detects a final `H` or `E` suffix on the recognition part when it follows a digit:

```text
recognition matches /\d[HE]$/
```

When that condition is true, the solver uses:

```js
sealColumnHistoricalOrElectric: { min: 58, preferred: 63.5, max: 67.5 }
```

Normal plates continue to use:

```js
sealColumn: { min: 63.5, preferred: 63.5, max: 67.5 }
```

The preferred value intentionally remains `63.5 mm` because this is still the DXF/default reference width. The lower `58.0 mm` value is used only when the solver must shrink variable spacing to keep the plate within legal width and equal outside margins.

## UI / diagnostics

The metrics table now includes a separate row for the active seal-column rule.

The SVG dimension line for the seal column continues to show the actually solved width directly on the plate.

`Auto ausgewogen` is now the default width mode in the Lab, because it is the better default for physical/visual validation. `Auto kompakt` remains selectable.

## Re-check results with `fontMode: auto`, `widthMode: balanced`, `I = 35.5 mm`

| Plate | Font | Width | Seal column | Seal range | Outside margins | Result |
|---|---:|---:|---:|---:|---:|---|
| `BIT GT500` | narrow | 520 mm | 64.7 mm | 63.5-67.5 mm | 8.0 / 8.0 mm | OK |
| `K S 70` | middle | 380 mm | 67.5 mm | 63.5-67.5 mm | 17.3 / 17.3 mm | OK |
| `TR M 6` | middle | 380 mm | 67.5 mm | 63.5-67.5 mm | 15.8 / 15.8 mm | OK |
| `HH EV 204E` | narrow | 520 mm | 58.6 mm | 58.0-67.5 mm | 8.0 / 8.0 mm | OK |
| `DA CI 500` | middle | 520 mm | 67.5 mm | 63.5-67.5 mm | 8.5 / 8.5 mm | OK |

## Files changed

- `tools/plate-physical-lab/mm-model.js`
- `tools/plate-physical-lab/app.js`
- `tools/plate-physical-lab/index.html`
- `tools/plate-physical-lab/README.md`
- `package.json`
- `package-lock.json`
- `HANDOVER.md`
- `docs/B112_HE_SUFFIX_SEAL_COLUMN_RULE.md`

## Notes

No font binary files were added. The Lab still expects local fonts in the repo/Home Assistant project environment.
