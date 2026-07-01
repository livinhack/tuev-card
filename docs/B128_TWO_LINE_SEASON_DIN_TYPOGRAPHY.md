# b128 – Two-line seasonal field DIN typography

b128 refines the Lab-only two-line seasonal validity field.

## Reason

In b127 the seasonal validity geometry followed the supplied Anlage-4 crop, but the month values were still rendered with the GL plate glyph font. Visually this did not match the intended field typography. Since the seasonal validity months are separate data fields that will later be supplied by the integration, they should not be treated like regular plate text.

The Euro-field country mark `D` already uses the DIN1451Alt font stack and is calibrated to a 20 mm high field. The seasonal month fields use the same approach from b128 onward.

## Geometry kept from b127

```text
field width:        30 mm
season gap:          8 mm
month row height:   20 mm
content span:       75 mm
separator height:    3.25 mm
separator position: centered
```

For the current two-line top band (`17.5–92.5 mm`):

```text
upper month center: 27.5 mm
separator rect:     53.375–56.625 mm
lower month center: 82.5 mm
```

## New typography

```text
month digit target height: 20 mm
font stack: DIN1451Alt, AlteDIN1451Mittelschrift, AlteDIN1451Middle script, Arial, sans-serif
SVG font size: 27 mm
font weight: 500
```

The `27 mm` SVG font size mirrors the current Euro-field `D` calibration, where the DIN glyph visually targets a `20 mm` high field.

## Integration note

The season values remain explicit model fields:

```js
season: {
  enabled: true,
  from: "04",
  to: "10"
}
```

They are not parsed as plate characters. This keeps the future integration path clean.

## Card status

The two-line seasonal field is still Lab-only. The production Card remains on the stable one-line renderer path until the two-line model is visually validated.
