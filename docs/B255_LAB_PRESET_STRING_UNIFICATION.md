# b255 – Lab Preset String Unification

b255 vereinheitlicht die Lab-Presets zu reinen Kennzeichenstring-Presets.

## Ziel

Die UI soll keine versteckten Format-/Saison-/Reduced-Umschaltungen mehr aus Presets heraus ausführen. Presets sind nur noch schnelle Texteingaben.

## Verhalten

Ein Preset-Klick setzt:

- `plateInput`
- `changePlateCommonInput`

Ein Preset-Klick setzt nicht:

- `plateFormat`
- `twoLineWidthRule`
- `seasonEnabled`
- `widthMode`
- `fontMode`
- `greenPlate`
- `changePlateEnabled`
- `changePlateVehicleInput`

## Abgrenzung

Keine Änderungen an Rendererlogik, Kennzeichen-Geometrie oder Wechselkennzeichen-Modell.
