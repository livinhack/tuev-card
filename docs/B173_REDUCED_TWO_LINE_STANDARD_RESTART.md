# b173 – Reduced two-line standard restart

## Purpose

b173 restarts the reduced two-line work after the rejected b172 attempt.

The implementation principle remains unchanged:

- Physical Lab is the authoritative visual validation project.
- Full/Card stays separate.
- Card renderer is not integrated or modified in this step.
- All physical model coordinates remain in millimetres.
- Pixel/DPR/monitor calibration stays only in the viewer layer.

## Status history

- b170: confirmed motorcycle checkpoint and current safe base.
- b171: first technical reduced draft, not visually confirmed.
- b172: rejected; font size/position and season field were broken.
- b173: fresh reduced restart from b170, standard case only.

## Reduced scope in b173

Only this case is active in the Lab:

```text
Format: reducedTwoLine
Case:   standard, no H/E, no season, no green
Size:   255 × 130 mm
```

Implemented reduced baseline:

```text
Euro field:        35 × 56 mm
Euro vertical grid: 5 / 22.5 / 8 / 15 / 5.5 mm
Top row:           y=10 mm, h=49 mm
Bottom row:        y=71 mm, h=49 mm
Inter-row gap:     12 mm
Letters:           31 mm cells
Digits:            29 mm cells
Seal template:     35-mm HU placeholder top, 45-mm authority placeholder bottom
```

## Explicitly not part of b173

- Reduced H/E
- Reduced season
- Reduced season H/E
- Reduced green
- Card integration
- Reusing b172 logic

## Next step

b174 should be based on visual feedback for the b173 reduced standard case. Only after the standard case is stable should H/E and season be introduced separately.
