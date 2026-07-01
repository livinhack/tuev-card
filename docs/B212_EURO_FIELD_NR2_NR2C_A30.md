# b212 – Euro field check for Nr. 2 / Nr. 2c

b212 is a Lab-only Euro-field correction on top of b211.

## Reason

b211 correctly componentised the EU star wreath and Euro country mark, and fixed the Reduced two-line Euro field. During visual review, Nr. 2 two-line and Nr. 2c motorcycle looked wrong because their shared Euro field still used the old 13.5 mm star-centre radius (`a = 27 mm`).

## Change

- Nr. 1 one-line Euro field remains `45 × 101 mm`, star wreath `a = 30 mm`, star size `5 mm`, D height `20 mm`.
- Nr. 2 two-line Euro field now uses `a = 30 mm`, star size `5 mm`, D height `20 mm`.
- Nr. 2a / 280-mm two-/three-wheel subvariant inherits Nr. 2 Euro field and therefore also uses `a = 30 mm`.
- Nr. 2c motorcycle inherits the same Nr. 2 Euro field and therefore also uses `a = 30 mm`.
- Nr. 3 Reduced two-line Euro field remains `35 × 56 mm`, star wreath `a = 22.5 mm`, star size `3.75 mm`, D height `15 mm`.

## Not changed

- Reduced width / H/E / season / 8-slot / 9-slot logic is unchanged from b209/b211.
- Kraftrad layout/seal logic is unchanged from the confirmed b170 lineage.
- Card renderer code is not integrated.

## Checks

- `npm run check:regression` passes with Euro-field component checks for one-line, two-line, motorcycle, and Reduced.
