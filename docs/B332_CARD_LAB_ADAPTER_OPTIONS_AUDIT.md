# b332 – Card/Lab Adapter Options Audit

b332 is a small cleanup/audit checkpoint after b331.

## Goal

Keep the Card/Lab renderer boundary from b331 unchanged, but make the Card-specific option mapping in `src/plate/lab-renderer-adapter.js` easier to audit.

## Changes

- Added a centralized `CARD_LAB_RENDERER_DEFAULTS` object in `src/plate/lab-renderer-adapter.js`.
- Moved Card-owned defaults into that object:
  - `fontMode: "auto"`
  - `widthMode: "balanced"`
  - `specialIWidth: 35.5`
  - `stage: "complete"`
  - `showDimensions: false`
  - `showSeals: true`
  - `showText: true`
  - `huBadgeRenderer: "full"`
- Kept Reminder/vehicle-specific values as explicit pass-throughs:
  - `huYear`
  - `huMonth`
  - `huRotation`
  - `changePlate`
- Normalized `options.debug === true` once and mapped it to the two Lab debug flags.
- Added `scripts/check-card-lab-adapter-options-audit.mjs`.
- Added npm script `check:card-lab-adapter-options-audit` and included it in `npm run check`.

## Not changed

- No plate geometry changed.
- No HU renderer behavior changed.
- No Wechselkennzeichen geometry changed.
- No renderer boundary from b331 changed.
- No legacy/alternate renderer switch was added.

## Guarded by the new check

The new check verifies that:

- Adapter defaults remain centralized.
- Required Card-owned defaults are declared exactly once.
- Full HU badge rendering remains active by default.
- Old blue HU placeholder output is not emitted by the Card adapter default render.
- Change-plate data is still explicitly passed through.
- The adapter does not contain legacy/toggle/placeholder fragments.
