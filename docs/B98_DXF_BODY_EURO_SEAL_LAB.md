# b98 - DXF body, Euro field and seal geometry in Physical Lab

## Purpose

b98 keeps the card stable and continues the license plate renderer outside Home Assistant in the Physical Lab. The lab remains CAD-like: all model geometry is built in millimetres, and only the finished SVG is scaled by the viewer.

## DXF-derived fixed geometry

The user supplied two DXF references:

- `Euro-Einzeilig.dxf`
- `Skizze2.dxf`

They are stored in:

```text
tools/plate-physical-lab/reference/
```

The runtime does not parse them dynamically. The extracted dimensions are fixed in `DXF_REFERENCE_MM` inside `tools/plate-physical-lab/mm-model.js`.

Extracted values used in b98:

```text
Outer height:             110 mm
Inner/white height:       101 mm
Inner inset/border:       4.5 mm
Outer corner radius:      9.25 mm
Inner corner radius:      4.75 mm
Euro field:               x 4.5 / y 4.5 / 45 x 101 mm
EU stars:                 center x 27 / y 36.5 / r 15 mm
Seal inner column:        63.5 mm
Seal reference column:    67.5 mm
HU seal:                  diameter 35 mm / center y 29.5 mm
Authority seal:           diameter 45 mm / center y 75.5 mm
Visible seal gap:         6 mm
```

## Important correction from b97

b97 still treated both visible seal placeholders as 35 mm. b98 separates them:

- HU placeholder: 35 mm
- Authority placeholder: 45 mm

## Model rule

```text
Build physical object in mm -> render complete SVG -> scale only the complete SVG in viewer.
```

No individual scaling of glyphs, Euro field, seal circles or layout distances is allowed in the viewer layer.

## Font calibration

`font-size` and baseline are exposed in the lab UI as mm-based font calibration. This is not a pixel/viewer scale. It only compensates that SVG font-size does not equal visible cap height for the chosen GL font.
