# TÜV Reminder Card – Handover b116

## Current state

b116 replaces the productive Card license-plate renderer fully with the Physical Lab renderer path. The previous Card-specific character/SVG placement renderer is no longer used as a separate rendering implementation.

## Main decision implemented

The Physical Lab is the single source of truth for plate geometry:

```text
mm model -> complete physical SVG -> scale only the final SVG in the Card
```

The Card now calls the Lab SVG builder with production overlays disabled:

- no dimension lines
- no DXF reference guides
- no cell/grid guides
- same mm viewBox as the Lab plate result

## Important project rules

- Code, filenames and functions stay English.
- German UI text must go through translations/localisation.
- ZIP versioning is continuous; next version after this is b117.
- Every new work ZIP must include an updated `HANDOVER.md`.
- Do not include font binary files in Chat ZIPs.
- Local fonts remain in the user's repo/Home Assistant project separately.

## Renderer status

### Physical Lab

- Location: `tools/plate-physical-lab/`
- Live Server entry: `tools/plate-physical-lab/index.html`
- Lab and Card share the same `renderPlateSvgMm()` production path.
- Lab overlays remain available in the Lab.

### Card

- `src/plate/renderer.js` is rebuilt as a thin production adapter around the Lab renderer.
- The adapter only:
  - normalizes the plate input
  - gets the shared scale from the Card layout
  - calls `renderPlateSvgMm()` with production overlays disabled
  - adds Card CSS classes and display width/height
- No separate Card character positioning path remains.

### Fonts

- Canonical font-family names remain:
  - `GL-Nummernschild-Mtl`
  - `GL-Nummernschild-Eng`
- b116 embeds canonical `@font-face` CSS into the produced Card SVG `<defs>` in addition to global injection.
- No `.ttf`, `.otf`, `.woff` or `.woff2` files are included in the ZIP.

## Key validation values

With `fontMode: auto`, `widthMode: balanced`, `I = 35.5 mm`:

| Plate | Script | Width | Seal column | Left/right margin |
|---|---:|---:|---:|---:|
| `BIT GT500` | Narrow | 520 mm | 64.7 mm | 8.0 / 8.0 mm |
| `K S 70` | Middle | 380 mm | 67.5 mm | 17.3 / 17.3 mm |
| `TR M 6` | Middle | 380 mm | 67.5 mm | 15.8 / 15.8 mm |
| `HH EV 204E` | Narrow | 520 mm | 58.6 mm | 8.0 / 8.0 mm |
| `DA CI 500` | Middle | 520 mm | 67.5 mm | 8.5 / 8.5 mm |

## Files changed in b116

- `src/plate/renderer.js`
- `src/plate/font.js`
- `src/plate/mm-model.js`
- `tools/plate-physical-lab/mm-model.js`
- `dist/tuev-card.js`
- `docs/B116_CARD_RENDERER_FULL_LAB_REBUILD.md`
- `package.json`
- `HANDOVER.md`

## Checks

- `npm run check` passed.
- `npm run build` passed.
- Production Card SVG for `DA CI 500` was checked for:
  - mm `viewBox="0 0 520 110"`
  - no `layer-grid`
  - no `layer-dxf-guides`
  - no dimension lines

## Next recommended test

Install b116 in Home Assistant and compare the Card result for:

- `DA CI 500`
- `HH EV 204E`
- `BIT GT500`
- `K S 70`
- `TR M 6`

Expected result: the Card plate should match the Lab geometry, except for uniform final downscaling to the available Card width.
