# b328 – HU Badge Smoke Checkpoint

Purpose: small safety checkpoint after b327. No plate geometry changes.

## Scope

- Keep b327 full HU badge rendering active.
- Add a smoke check proving that the full badge path renders without the old blue HU placeholder.
- Cover both normal HU slots and the vehicle-specific Wechselkennzeichen supplement.
- Keep the blue placeholder only as the standalone Lab comparison path when `huBadgeRenderer` is not `full`.

## Checks added

- `npm run check:hu-badge-smoke`
  - normal full HU badge contains `data-hu-badge-renderer="full"`.
  - supplied HU year is preserved in the rendered SVG.
  - full HU render does not contain `#1ea5ff`.
  - different HU years produce different badge output.
  - Wechselkennzeichen supplement renders through the same full-badge path.
  - Lab placeholder mode still renders the old blue comparison marker.

## Non-goals

- No geometry or spacing changes.
- No legacy/Card renderer switch.
- No change to the Reminder data mapping introduced in b327.
