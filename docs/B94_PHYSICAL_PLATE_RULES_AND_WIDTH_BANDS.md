# b94 – Physical plate rules and width bands

b94 tightens the active one-line Card plate renderer around one central rule:

> The plate is first built as one physical SVG model in millimetres. Scaling is only applied to the whole SVG afterwards.

## Fixed model before scaling

The renderer no longer derives layout from browser glyph widths or per-element stretch values. It uses fixed physical coordinates for:

- outside plate size,
- black border inside the outside size,
- white inner field,
- Euro field,
- character cells,
- character gaps,
- seal zone,
- HU placeholder,
- neutral authority-seal placeholder.

The browser may only scale the final complete SVG via the `width` and `height` attributes. It must not independently scale text, seals, Euro field or individual characters.

## One-line dimensions currently used in the Card renderer

- outside height: `110 mm`
- black border band: `4.5 mm`
- white inner height: `101 mm`
- Euro field width: `45 mm`
- Euro field visual height: full inner height, because the optional bright top/bottom edge looks unlike most real plates
- minimum side gap: `8 mm`
- character gap: `8 mm`
- recognition letter/number group gap: `24 mm`
- Mittelschrift character cells:
  - letters: `47.5 mm`
  - digits: `44.5 mm`
- Engschrift character cells:
  - letters: `40.5 mm`
  - digits: `38.5 mm`
- HU placeholder: `35 mm`
- authority placeholder visible disc: `35 mm`
- authority placeholder reserved outer embossing circle: `45 mm`

## Width bands

The law gives the one-line maximum width as `520 mm` but does not give a one-line minimum. For display purposes the renderer uses practical outer-width bands:

### Mittelschrift

```text
340 / 380 / 420 / 460 / 480 / 520 mm
```

### Engschrift

```text
320 / 340 / 380 / 420 / 480 / 520 mm
```

Engschrift remains an escape path and is tried after Mittelschrift. The `320 mm` band is therefore not used just to make short plates artificially shorter when Mittelschrift already fits.

## Sources used for b94

- Official FZV Anlage 4 / BMV overview for legal maximum sizes and motorcycle min/max sizes.
- Uploaded `kennzeichenmasse_liste.xlsx` for the consolidated geometry values used during this work session.
- Manufacturer/retailer size listings for practical one-line width bands; these are not treated as a legal minimum.

## Not changed

- The large TÜV badge renderer was not changed.
- Editor and grouping logic were not changed.
- HACS `dist/` structure from b87 remains active.
- Font binaries are still not included in Chat-created ZIPs.
