# b145 – Season deterministic centering

## Goal

b145 keeps the b144 plate geometry unchanged and removes the error-prone manual season X-offset / measurement-button workflow.

The seasonal validity field is now centered directly by construction:

```text
month digit 1 + configured digit gap + month digit 2 = rendered month string
rendered month string -> anchored at the center of the 30 mm season field
```

## What changed

- Removed the Lab control `Saison X-Korrektur in mm`.
- Removed the button `Saison-Block aus Messung zentrieren/skalieren`.
- The season month strings are rendered at the season field center without a manual offset.
- `Saison Zifferngap in mm` remains the only horizontal gap control between the two month digits.
- `Saison Breitenfaktor` remains available for typography calibration.
- The season readout remains diagnostic only and no longer writes values back into controls.

## Stable defaults

```text
Saison sichtbare Ziel-Glyphenhöhe: 20 mm
Saison Font-Kalibriergröße: 28
Saison Baseline Y: 37.5 mm
Saison Breitenfaktor: 1
Saison Zifferngap: 1.5 mm
```

## Unchanged

- b143 Euro country mark grid remains active.
- b142 green standard plate mode remains active.
- b141 one-line season field remains active.
- b140 two-line seasonal H/E bottom spacing remains active.
- The b129 two-line seal circle change remains discarded.
- Two-line and seasonal variants remain Physical Lab only.
- The production Card renderer remains on the stable one-line b116/b117 renderer path.
