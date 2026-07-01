# b184 – Reduced upper-seal short-top centering and display cleanup

## Scope

Lab-only renderer step for the standalone Physical Lab. The Card production renderer is not changed.

## Basis

- Based on b183.
- b172 remains discarded.
- b170 remains the confirmed motorcycle baseline.

## Changes

- Reduced two-line standard plates with a long lower row still switch the authority seal into the upper row next to the HU seal.
- When the upper district row has fewer than three letters, the virtual three-letter field is now part of the physical fit check.
- This prevents the virtual placeholders from running under the Euro field. If the legal virtual field does not fit at 240 mm, the solver chooses 255 mm.
- Added regression case: `W QU111`.
- Display cleanup: top margin dimensions use the virtual three-letter field for short upper rows; a light `3er-Feld` dimension line is shown; upper seal row and text-to-seal corridor labels are clearer.

## Explicitly not changed

- No Reduced H/E implementation.
- No Reduced season implementation.
- No Reduced green implementation.
- No Card code changes.
- No font binaries in the ChatGPT ZIP.

## Full/Lab sync note

The separately delivered Lab ZIP is the authoritative Lab state. The Full ZIP carries current handover/docs and does not make `tools/plate-physical-lab/` authoritative unless a future handover explicitly states that it was synchronized.
