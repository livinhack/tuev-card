# b214 – Euro field cleanup

b214 is a small component cleanup on top of the confirmed b213 restore point.
It intentionally does **not** change the solved plate geometry, width selection,
seal placement, H/E handling, Saison handling, or Card code.

## Scope

- `src/plate/euro-field.js` is now the single Euro-field component entry point.
- `src/plate/plate-svg-renderer.js` imports Euro-field helpers only from `euro-field.js`.
- The previous local compatibility helpers for star wreath rendering were removed from the main renderer.
- Star wreath geometry remains in `src/plate/eu-star-wreath.js`.
- Country mark geometry remains in `src/plate/eu-country-mark.js`.

## Confirmed Euro-field parameters

- Nr. 1 one-line: `a = 30 mm`, star size `5 mm`, D height `20 mm`.
- Nr. 2 two-line: `a = 30 mm`, star size `5 mm`, D height `20 mm`.
- Nr. 2a 280-mm subvariant: inherits the Nr. 2 Euro field.
- Nr. 2c motorcycle: inherits the Nr. 2 Euro field.
- Nr. 3 Reduced two-line: `a = 22.5 mm`, star size `3.75 mm`, D height `15 mm`.

## Verification

```text
Regression passed: 41/41 cases OK.
```

## Full ZIP sync status

The Full ZIP still does not synchronise `tools/plate-physical-lab/`. The separate
Lab ZIP remains authoritative.
