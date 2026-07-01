# Handover – b329 Card Renderer Legacy Audit

Current stand: b329.

b329 keeps the b328 HU smoke checkpoint unchanged and adds a focused Card renderer legacy-path audit. It is intentionally conservative: no geometry changes, no legacy switch, and no file deletion yet.

## Changes

- Added `check:renderer-legacy-audit` in the Lab and Full/Card packages.
- The audit proves the active Card renderer chain:
  - `src/tuev-card-entry.js` / editor
  - `src/plate/renderer.js`
  - `src/plate/lab-renderer-adapter.js`
  - `src/plate/lab-renderer/plate-public-api.js`
- The audit confirms `src/plate/mm-model.js` in the Full/Card source tree has no incoming imports and is only a later removal candidate.
- The audit confirms Lab-only/compatibility renderer files are not imported through the Card-facing boundary.
- b328 HU checks remain active and unchanged.

## Card state

- The Card adapter still sets `huBadgeRenderer: "full"`.
- Reminder-fed `huYear`, `huMonth` and `huRotation` are still passed into the Lab renderer.
- The Wechselkennzeichen supplement still receives the same resolved HU badge options through the render shell.
- The old blue HU placeholder remains allowed only in Lab/debug/placeholder contexts; the active full HU path is still guarded by smoke checks.

## Validation

- `npm run check` passed.
- `npm run build` passed and rebuilt `dist/tuev-card.js` for b329.

## Files

- Matching standalone Lab ZIP: `plate-physical-lab-b329-card-renderer-legacy-audit.zip`.
- Full/Card handover ZIP: `tuev-card-full-b329-card-renderer-legacy-audit-handover.zip`.

## Next suggested step

After visual confirmation, do a small b330 removal checkpoint for the demonstrably unimported old `src/plate/mm-model.js` Full/Card path, or leave it until a later cleanup if you want one more test round first.
