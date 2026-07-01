# TÜV Reminder Card b334

Full handover ZIP for b334.

b334 is a **Lab Public API Boundary Audit** checkpoint on top of b333. It does not change renderer geometry or behavior. It protects the final boundary between the Card adapter and the staged Physical Lab renderer internals.

## Main points

- Card/Editor still use only `src/plate/renderer.js`.
- `renderer.js` still delegates only to `src/plate/lab-renderer-adapter.js`.
- The adapter may enter the staged Lab renderer only through `src/plate/lab-renderer/plate-public-api.js`.
- New check: `check:lab-public-api-boundary`.
- No geometry, HU, Wechselkennzeichen, or font logic changed.

## Checks

- `npm run check`
- `npm run build`

Both passed for this handover build.

## Font note

The ChatGPT ZIP does not include GL TTF binaries. A real GitHub/HACS release must include the GL font files before build so the graphical plate renderer is available in Home Assistant.
