# b335 – Card Editor/Preview Final Check

b335 is the second condensed finalization checkpoint after b334.

Scope:

- no plate geometry changes;
- no HU badge rendering changes;
- no Wechselkennzeichen geometry changes;
- no renderer boundary changes beyond b335 cache markers;
- Card-side editor/preview and option handling only.

## Changes

- Advanced the active Card renderer cache boundary to b335:
  - `src/tuev-card-entry.js` imports `./plate/renderer.js?v=b335`.
  - `src/editor/editor.js` imports `../plate/renderer.js?v=b335`.
  - `src/plate/renderer.js` re-exports from `./lab-renderer-adapter.js?v=b335`.
- Removed the duplicate unreachable `return normalizeLabRendererPlate(plate);` in `src/plate/lab-renderer-adapter.js`.
- Stabilized the editor font availability check:
  - guarded against overlapping font probes;
  - throttled repeated probes to 10 seconds;
  - no automatic rewrite from graphical plate mode to text mode when a temporary font check fails;
  - no config-changed event from the font availability check.
- Added `scripts/check-card-editor-preview-final.mjs`.
- Added npm script `check:card-editor-preview-final` and included it in `npm run check`.

## Why

The Card runtime already had guarded font availability checks. The editor still reacted aggressively to temporary font unavailability by mutating `plate_style` and firing config changes. That could make the editor preview feel unstable or "zitternd" when fonts were being installed, cached, or rechecked.

b335 keeps the editor state stable: the availability flag can still hide/disable graphical rendering in the UI, but the font check no longer rewrites the user configuration.

## Protected behavior

The new check verifies that:

- Card and editor consume the b335 public renderer boundary;
- the editor font check is guarded and throttled;
- the editor font check does not mutate `plate_style`;
- the editor font check does not call `fireConfigChanged()`;
- Card runtime still uses a single guarded graphical-plate availability gate;
- `huBadgeRenderer: "full"` remains the production Card default;
- `huYear`, `huMonth`, `huRotation`, and `changePlate` remain explicit entity/reminder/vehicle pass-through values;
- the adapter remains legacy-toggle free.
