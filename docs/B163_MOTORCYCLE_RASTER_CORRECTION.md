# b163 – Motorcycle raster correction

## Scope

b163 is a Lab correction step, not a Card integration step.

The user compared b162 Kraftrad outputs against Anlage-4 reference drawings. b162 had the correct outer size family but still used too much generic two-line layout logic. b163 corrects the motorcycle raster in the standalone Physical Lab and synchronizes the Full project documentation only.

## Lab changes

- Kraftrad remains `motorcycle`, not a generic two-line width rule.
- Outer size family remains `180 / 200 / 220 × 200 mm`.
- Text fields remain 49 mm high with reduced middle script.
- Narrow-script fallback remains disabled for Kraftrad.
- Letter cell width remains 31 mm.
- Digit cell width remains 29 mm.
- Normal motorcycle bottom group gap changed to 15–18 mm.
- Motorcycle H/E bottom group gap changed to 14–18 mm.
- Motorcycle season field is moved into its own right-hand middle validity band:
  - width 30 mm
  - `bandY = 69.5 mm`
  - `bandHeight = 53.25 mm`
  - upper baseline `89.5 mm`
  - lower baseline `122.75 mm`
- Euro field remains identical to the two-line/Kraftrad geometry.
- Horizontal seal arrangement remains in the middle band:
  - HU placeholder 35 mm
  - authority placeholder 45 mm

## Full project changes

Only documentation and version sync:

- `package.json` / `package-lock.json`: `0.1.1-b163`
- `HANDOVER.md` updated
- `README.md` updated
- this document added

No Card renderer code was changed.
No Lab code was copied into the Card.
No font binaries are included.

## Validation

- Existing 14 non-motorcycle regression cases remain byte-identical against b162.
- Five motorcycle cases pass the updated raster checks.

```text
existing 14 non-motorcycle cases: 7e15978c05e2b4e5066a93840bb2fec09716a4959b67737737ec2e2add1df699
motorcycle 5 cases: 89233e3bc83e90c7fc228484d4c5702108fd729907cc4143087dfad11278230f
complete 19 cases: 5ef6368d56ab5dad9e0d82786576179a9f072c739a2759bbc755ec6bf95c09bb
```

## Next step

Visually check b163 in the Lab. If the motorcycle normal / H-E / season outputs match the references, save a confirmed stand before moving on to the reduced two-line `255 × 130 mm` variant.
