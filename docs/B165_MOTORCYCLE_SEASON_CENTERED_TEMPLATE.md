# b165 – Motorcycle season centered template

## Purpose

b165 documents the correction of the standalone Physical Lab after the b164 visual motorcycle-season comparison. The production Card code is not changed in this step.

## Key correction

Motorcycle seasonal validity is no longer modeled as part of the top-row spacing. The seasonal column is a separate 30-mm middle-zone field.

Vertical layout:

```text
plate height:          200 mm
plate center:          y = 100 mm
separator height:        3.25 mm
separator y:            98.375–101.625 mm
edge gap to month:       5 mm
upper month field:      73.375–93.375 mm
lower month field:     106.625–126.625 mm
season block height:    53.25 mm
season block center:   100 mm
```

The `20 mm` values in the reference are month-field heights, not free distances above or below the season block.

## Spacing correction

The bottom motorcycle group gaps are kept as template-preferred values inside the valid ranges instead of being waterfilled to the maximum:

```text
normal motorcycle group gap: preferred 15 mm in 15–18 mm
H/E motorcycle group gap:    preferred 14 mm in 14–18 mm
```

Free width is assigned to equal outside margins.

## Split-project note

The Lab remains the authoritative renderer validation project. This Full ZIP synchronizes documentation, handover and version only. The Card renderer is not changed here.

## Validation

```text
existing 14 non-motorcycle cases: unchanged against b164
existing14 hash: 7e15978c05e2b4e5066a93840bb2fec09716a4959b67737737ec2e2add1df699
motorcycle5 hash: da642b14dcf02af6540c5372a8db68aeb7928de4a5a28ac37b6b6a4c7ebeeeee
full19 hash: aab55fb8a6d0bc5a0ac2d99e1f85eb4ff7040c937a8236544e431304a829b6ff
```

## Next

Visually check b165 in the standalone Lab. If accepted, create a b167 confirmation/safety checkpoint before moving to `255 × 130 mm` reduced two-line plates.
