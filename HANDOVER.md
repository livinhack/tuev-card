# TÜV Reminder Card – Handover b117

## Current state

b117 is a stabilization/release-safety step on top of the working b116 Card renderer. It does not change the physical license-plate geometry.

The b116 result was visually checked in Home Assistant after rebuilding locally with the real font files. The observed fallback/geometry problem was caused by a release/build workflow issue, not by the mm renderer itself: ChatGPT handover ZIPs do not include font binary files, so `dist/fonts/` from those ZIPs can only contain readme/license notes until the project is rebuilt locally with the real fonts.

## Main decision kept

The Physical Lab remains the single source of truth for plate geometry:

```text
mm model -> complete physical SVG -> scale only the final SVG in the Card
```

The Card must continue to use the Lab SVG builder with production overlays disabled:

- no dimension lines
- no DXF reference guides
- no cell/grid guides
- same mm viewBox as the Lab plate result
- no separate Card character placement renderer

## Important project rules

- Code, filenames and functions stay English.
- German UI text must go through translations/localisation.
- ZIP versioning is continuous; next version after this is b118.
- Every new work ZIP must include an updated `HANDOVER.md`.
- Do not include font binary files in Chat ZIPs.
- Local fonts remain in the user's repo/Home Assistant project separately.
- Before GitHub/HACS push, rebuild locally with the real fonts present.

## b117 purpose

Prevent a repeated false renderer diagnosis when the Home Assistant/HACS installation has no GL font binaries.

Expected local release flow:

```text
1. Copy/update the ChatGPT ZIP contents into the local repository.
2. Keep the real local font files in fonts/.
3. Run build-tuev-card.bat or npm run build && npm run check.
4. Confirm dist/fonts/*.ttf exists.
5. Commit and push.
```

Expected HACS files:

```text
/config/www/community/tuev-card/tuev-card.js
/config/www/community/tuev-card/fonts/GL-Nummernschild-Mtl.ttf
/config/www/community/tuev-card/fonts/GL-Nummernschild-Eng.ttf
```

## Release asset guard

New script:

```text
scripts/check-release-assets.mjs
```

`npm run check` now runs both:

```text
node scripts/check-js.mjs
node scripts/check-release-assets.mjs
```

The release asset check verifies:

- `dist/tuev-card.js` exists.
- Every local font binary in `fonts/` is mirrored into `dist/fonts/`.
- Mirrored font file sizes match.
- Required Card fonts are explicitly checked when present:
  - `GL-Nummernschild-Mtl.ttf`
  - `GL-Nummernschild-Eng.ttf`

If no font binaries exist in `fonts/`, the check prints a warning but does not fail. This is intentional so ChatGPT ZIPs remain usable without font binaries.

## Build script changes

`scripts/build-bundle.mjs` still copies `fonts/` to `dist/fonts/`, but now reports:

- copied file count
- copied font-binary count
- warning if no font binaries were copied

`build-tuev-card.bat` now labels the check step as JavaScript plus release-asset check and prints explicit hints when the two expected `dist/fonts/GL-Nummernschild-*.ttf` files are missing.

## Renderer status

### Physical Lab

- Location: `tools/plate-physical-lab/`
- Live Server entry: `tools/plate-physical-lab/index.html`
- Lab and Card share the same `renderPlateSvgMm()` production path.
- Lab overlays remain available in the Lab.
- Current implemented one-line formats:
  - one-line normal
  - one-line final H/E suffix with 58.0–67.5 mm seal-column rule

### Card

- `src/plate/renderer.js` remains the thin production adapter around the Lab renderer.
- No separate Card character positioning path should be reintroduced.
- The Card scales only the finished SVG.

### Fonts

- Canonical font-family names remain:
  - `GL-Nummernschild-Mtl`
  - `GL-Nummernschild-Eng`
- The Card SVG contains canonical `@font-face` CSS.
- No `.ttf`, `.otf`, `.woff` or `.woff2` files are included in this Chat ZIP.

## Key validation values retained from the current renderer

With `fontMode: auto`, `widthMode: balanced`, `I = 35.5 mm`:

| Plate | Script | Width | Seal column | Left/right margin |
|---|---:|---:|---:|---:|
| `BIT GT500` | Narrow | 520 mm | 64.7 mm | 8.0 / 8.0 mm |
| `K S 70` | Middle | 380 mm | 67.5 mm | 17.3 / 17.3 mm |
| `TR M 6` | Middle | 380 mm | 67.5 mm | 15.8 / 15.8 mm |
| `HH EV 204E` | Narrow | 520 mm | 58.6 mm | 8.0 / 8.0 mm |
| `DA CI 500` | Middle | 520 mm | 67.5 mm | 8.5 / 8.5 mm |

## Files changed in b117

- `scripts/check-release-assets.mjs`
- `scripts/build-bundle.mjs`
- `build-tuev-card.bat`
- `package.json`
- `package-lock.json`
- `README.md`
- `docs/B117_RELEASE_FONT_ASSET_GUARD.md`
- `docs/HACS_RELEASE_FLOW.md`
- `docs/RELEASE_CHECK.md`
- `src/*` and `tools/plate-physical-lab/*` version references updated to b117
- `dist/tuev-card.js`
- `HANDOVER.md`

## Checks performed for the Chat ZIP

- `npm run build` passed.
- `npm run check` passed.
- Release asset check warned that no local font binaries exist in `fonts/`, as expected for the Chat ZIP.
- No font binary files are included in the ZIP.

## Next recommended step

Before further renderer work, the user should copy b117 into the local repo without deleting the real `fonts/*.ttf`, run the BAT/build locally, and confirm `dist/fonts/*.ttf` exists before pushing.

After this release-safety step is confirmed, the next Physical Lab renderer format should be:

```text
normal two-line plate format
```

Do not start motorcycle/special formats before the normal two-line physical model is stable.
