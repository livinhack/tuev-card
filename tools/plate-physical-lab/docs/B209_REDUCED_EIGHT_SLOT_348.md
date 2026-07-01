# b209 – Reduced 8-slot upper-seal 3/4/8 rule

b209 is a targeted Lab-only follow-up to b208.

## Fix

For Reduced two-line H/E/Saison cases with 8 occupied slots, the top row must keep the normal `* >= 8 mm` right outside margin. b208 counted the slots correctly but could still show the b206-like `5 / 4 / 6` visual chain.

## Geometry

8-slot H/E/Saison top row:

```text
Text → authority seal = 3 mm
authority seal → HU = 4 mm
right outside margin >= 8 mm
```

9-slot H/E/Saison top row remains the separate tight season edge case:

```text
Text → authority seal = 5 mm
authority seal → HU = 4 mm
right outside margin >= 6 mm
```

The slot counter remains complete-visible-chain based: district + recognition including H/E suffix + season field as one occupied block.

## Regression

Existing 8-slot tests now assert the 3-mm text-to-authority gap and the 8-mm right edge.
