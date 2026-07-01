# b164 – Motorcycle season/seal raster correction

b164 is a split-project documentation sync for a standalone Physical Lab correction. The production Card code is unchanged.

## Reason

b163 was visually compared with motorcycle and motorcycle-season reference drawings and was not confirmed. The visible issues were the first row/reduced middle script and the horizontal seal placement, especially for seasonal motorcycle plates.

## Lab correction

The standalone Lab b164 changes the motorcycle renderer only:

- reduced middle-script calibration for the 49-mm Kraftrad fields changed from `81.67` to `72`
- HU/authority visible-circle gap changed from `18 mm` to `6 mm`
- seasonal motorcycle seal pair is centered before the right-hand 30-mm validity column
- the 18-mm value remains part of the vertical motorcycle band layout, but is no longer used as horizontal seal spacing
- non-motorcycle regression cases remain byte-identical

## Full project

This Full ZIP only synchronizes:

- package version `0.1.1-b164`
- `HANDOVER.md`
- this documentation file
- README checkpoint text

No Card renderer code was changed, and no font binaries are included.

## Validation

```text
existing 14 non-motorcycle cases: 7e15978c05e2b4e5066a93840bb2fec09716a4959b67737737ec2e2add1df699
motorcycle 5 cases: 3bd9e42d7ef43c695de81012a5f6c2396817656f87206bb4a571ef7b28d56248
complete 19 cases: 7583885b68666bc87f2713c2485595a1b6cc56165676ef61f3ab336d37003773
```

## Next

Visually check b164 in the standalone Lab. If it matches the references, create a confirmed checkpoint before moving on to the reduced two-line `255 × 130 mm` format.
