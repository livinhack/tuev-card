# b167 – Motorcycle season visual correction

b167 is a split-project documentation sync for a standalone Physical Lab correction. The production Card code is unchanged.

## Reason

The b165 motorcycle-season output was visually compared against the Anlage-4 reference and was not confirmed. The visible problems were:

- the right top-margin measurement was still tied to the middle-zone season column;
- the reduced middle-script calibration in the 49 mm fields was visibly wrong;
- the season month digits were shifted inside their 20 mm fields.

## Standalone Lab changes

- Motorcycle-season top row no longer uses the season column as its right content limit.
- Top-row debug margin is measured against the first-row inner plate edge.
- Motorcycle reduced middle-script calibration is restored to `fontSize: 81.67` with `baselineY: 59.5`.
- Physical field values remain unchanged: character height `49 mm`, letter cells `31 mm`, digit cells `29 mm`.
- Motorcycle season month fields use field-local baselines:
  - top month field `73.375–93.375 mm`, baseline `93.375 mm`;
  - separator `98.375–101.625 mm`;
  - bottom month field `106.625–126.625 mm`, baseline `126.625 mm`.
- In auto/balanced mode, motorcycle-season uses the 220 mm reference canvas.

## Full project changes

- `package.json` / `package-lock.json`: `0.1.1-b167`
- `README.md` updated
- `HANDOVER.md` updated
- this documentation file added

## Not changed

- no Card renderer code change
- no Card integration
- no font binaries
- no copy of the standalone Lab renderer into Card production code

## Validation

```text
existing 14 non-motorcycle cases:
7e15978c05e2b4e5066a93840bb2fec09716a4959b67737737ec2e2add1df699

motorcycle 5 cases:
6097be4ae7a008871b67c82d4062baebfb518d4314154334bc9b1d32628f6f43

complete 19 cases:
d9ae68411c789bd1f1194b00f7de62b961fffa79b74296db5facc7fa8cbcb127

unchanged 14 against b164: true
```

## Next step

Visually check b167 in the standalone Lab. If accepted, continue with either a confirmed motorcycle checkpoint or the reduced two-line `255 × 130 mm` variant.
