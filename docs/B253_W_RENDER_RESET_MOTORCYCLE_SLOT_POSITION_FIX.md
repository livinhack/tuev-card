# b253 – W Render Reset + Motorcycle Slot Position Fix

Basis: b252.

## Ziel

Der b249/b250/b252-Versuch, das W über eine horizontale Glyph-/Textbox-Korrektur im Siegelkreis zu verschieben, hat beim einzeiligen Wechselkennzeichen einen sichtbaren Fehler erzeugt. Das W muss wieder mit der bestätigten b247-Renderformel gezeichnet werden.

## Änderung

- W-Renderformel auf b247 zurückgesetzt:
  - `text-anchor="middle"`
  - X direkt auf Slot-Mitte
  - keine `wVisualCenterCorrectionX` mehr
  - keine Textbox-Start-X-Korrektur mehr
- Beim Kraftrad-Wechselkennzeichen wird stattdessen der komplette 35-mm-W/HU-Slot verschoben.
- Der 35-mm-Slot liegt auf der ehemaligen b252-Visuell-W-Mitte, damit das Kraftrad-W optisch an der zuletzt akzeptierten Stelle bleibt, ohne das W innerhalb des Slots zu schieben.
- Normale Renderer bleiben unangetastet.

## Wichtig

Dies ist kein neuer Geometrie-Refactor, sondern eine Rücknahme der falschen W-Glyph-Korrektur. Die spätere Modulaufteilung soll W/HU/Authority über Slot-Pläne lösen, nicht über Glyph-Korrekturen.

## Prüfungen

- Lab Regression: 41/41 OK
- Nicht-Wechsel-Fälle gegenüber b252 unverändert
- Smoke:
  - einzeilig Wechsel: W nutzt b247-Position
  - zweizeilig Wechsel: W nutzt b247-Position
  - Kraftrad Wechsel: W nutzt b247-Renderformel, aber verschobenen 35-mm-Slot
