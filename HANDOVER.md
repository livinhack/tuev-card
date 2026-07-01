# Handover – b328 HU Badge Smoke Checkpoint

Current stand: b328.

b328 keeps the b327 Card activation unchanged and adds a focused HU badge smoke checkpoint. The goal is to guard against regressions where the old blue HU placeholder accidentally reappears in the active full-badge path.

## Changes

- Added `check:hu-badge-smoke` in the Lab and Full/Card packages.
- Smoke coverage checks normal HU badge rendering with `huBadgeRenderer: "full"`.
- Smoke coverage checks Wechselkennzeichen supplement rendering with `huBadgeRenderer: "full"`.
- Smoke coverage verifies different HU years produce different badge output.
- Lab placeholder mode remains available as an explicit comparison path only.
- No geometry, spacing, adapter mapping, or legacy switch changes.

## Card state

- The Card adapter still sets `huBadgeRenderer: "full"`.
- Existing Reminder-fed `huYear`, `huMonth` and `huRotation` are still passed into the Lab renderer.
- The Wechselkennzeichen supplement receives the same resolved HU badge options through the render shell.

## Validation

- `npm run check` passed.
- `npm run build` passed and rebuilt `dist/tuev-card.js` for b328.

## Files

- Matching standalone Lab ZIP: `plate-physical-lab-b328-hu-badge-smoke-checkpoint.zip`.
- Full/Card handover ZIP: `tuev-card-full-b328-hu-badge-smoke-checkpoint-handover.zip`.

## Next suggested step

If b328 is visually confirmed, continue with the planned Card-renderer cleanup/audit: remove only demonstrably dead old paths, with no legacy toggle and no geometry changes.
