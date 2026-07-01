# b119 – Two-line general plate in the Physical Lab

## Purpose

b119 starts the next Anlage 4 format in the standalone Physical Lab: Abschnitt 2 Nummer 2, Allgemeines zweizeiliges Kennzeichen.

This is a Lab-only geometry step. The Home Assistant Card remains on the existing one-line production renderer path by default.

## Source rules used

The initial b119 model uses the following physical assumptions from Anlage 4:

- general two-line plate maximum: 340 × 200 mm;
- additional 280 mm width check for two- and three-wheeled motor vehicles;
- 75 mm Middle/Narrow script family, same glyph-cell calibration as the one-line Lab;
- minimum outside/reference gap: 8 mm;
- character gap: 8-10 mm;
- recognition group gap: 20-30 mm;
- Euro field in the upper-left area;
- district and neutral seal placeholders in the upper row;
- recognition number in the lower row.

The detailed top-row Euro/seal positions are implemented as an explicit first Lab interpretation and must be visually checked against Anlage 4 before Card integration.

## Implementation

### Shared mm model

`tools/plate-physical-lab/mm-model.js` and `src/plate/mm-model.js` now expose:

- `TWO_LINE_WIDTH_BANDS`
- `TWO_LINE_RULES_MM`
- `resolvePlateRules(plateFormat)`

`buildPlateModelMm()` and `renderPlateSvgMm()` accept:

```js
plateFormat: "oneLine" | "twoLine"
```

The default is still `oneLine`, so the Card production renderer is not switched to two-line automatically.

### Lab UI

`tools/plate-physical-lab/index.html` now has a format selector:

- Anlage 4 · Abschnitt 2 Nr. 1 · einzeilig
- Anlage 4 · Abschnitt 2 Nr. 2 · zweizeilig

b119 defaults the Lab to the two-line format for the next visual checks.

### Two-line layout solver

The two-line solver solves two rows independently:

- top row: district cells + 8-10 mm gap + seal field;
- bottom row: recognition groups across the full plate width;
- both rows keep equal left/right margins in their own physical reference area;
- variable gaps grow to max before remaining free space becomes equal outside margin.

## Initial validation values

With `fontMode: auto`, `widthMode: balanced`, `specialIWidth: 35.5`:

| Plate | Format | Script | Width | Top margins | Bottom margins |
|---|---|---:|---:|---:|---:|
| `DD GD 24 H` | two-line | Middle | 340 mm | 65.5 / 65.5 mm | 9.75 / 9.75 mm |
| `B AB 123` | two-line | Middle | 320 mm | 84.25 / 84.25 mm | 11.25 / 11.25 mm |
| `DA CI 500` | two-line | Middle | 320 mm | 55.5 / 55.5 mm | 17.25 / 17.25 mm |
| `K S 70` | two-line | Middle | 280 mm | 64.25 / 64.25 mm | 47.25 / 47.25 mm |

## Not yet done

- The two-line model is not integrated into the Card UI/config yet.
- The 280 mm special rule is available as a Lab width band/check, but there is no vehicle-class selector yet.
- Motorradkennzeichen, verkleinertes zweizeiliges Kennzeichen, Saison, Wechsel, Kurzzeit and Export formats are still future steps.
- The first top-row Euro/seal coordinates must be visually reviewed before treating b119 as final.
