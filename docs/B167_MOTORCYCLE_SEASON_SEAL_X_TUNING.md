# b167 – Motorcycle season seal x tuning

b167 is a split-project documentation sync for a standalone Physical Lab correction. The production Card code is unchanged.

## Trigger

Visual b166 review showed that motorcycle season and H/E layout were generally acceptable, but the HU/authority seal pair still needed x-position fine tuning.

## Lab-only renderer change

The standalone Lab adjusts only the motorcycle seasonal seal pair:

- HU seal remains `35 mm` diameter.
- Authority seal remains `45 mm` diameter.
- Visible circle-to-circle gap now uses `10 mm`, matching the upper `**` reference range (`8–10 mm`) instead of the inherited one-line `6 mm` value.
- Seasonal motorcycle seal pair gets an `8 mm` x-offset to the right.
- Seal pair stays in the middle zone before the right-hand season field and never below the Euro field.

## Intentionally unchanged

- Top row is not shortened by the season field.
- Season field remains vertically centered around `y=100 mm`.
- Season digit baselines remain field-local.
- Motorcycle text calibration remains `fontSize=81.67`, `baselineY=59.5`.
- Non-motorcycle regression cases remain unchanged.
- No Card code change.
- No renderer integration into the Card yet.
- No font binary files.

## Validation

```text
existing 14 non-motorcycle cases:
7e15978c05e2b4e5066a93840bb2fec09716a4959b67737737ec2e2add1df699

motorcycle 5 cases:
3749be8a065b91f933e7022070d23a022b6f453af02ac32576bd41da71351e3d

complete 19 cases:
172c68c6c9bef7384bd537f813d5ad549be160163ffb0fb0c4717a991e3b0282

unchanged 14 against b164: true
```

## Next

Visually check b167 in the standalone Lab. If accepted, create a confirmed motorcycle checkpoint or continue with the reduced two-line `255 × 130 mm` variant.
