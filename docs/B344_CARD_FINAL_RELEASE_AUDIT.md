# b344 – Card Final Release Audit

## Basis

b344 baut auf b343 auf. b343 hatte die konkreten Review-Punkte zu Sicherheit, Timer-Cleanup und Escape-Duplizierung erledigt.

## Ziel

b344 ist ein finaler Card-Release-/Doku-Audit. Dieser Schritt soll den Card-Stand für den nächsten Projektblock vorbereiten: spätere Reminder-Integration und echte End-to-End-Tests.

## Änderungen

- README/HANDOVER auf b344 aktualisiert.
- Neuer Check: `check:card-final-release-audit`.
- Card-/Editor-/Renderer-Cachemarker auf b344 aktualisiert.
- Release-/Font-/HACS-Hinweise gebündelt.
- Reminder-Integration als späterer, separater End-to-End-Schritt dokumentiert.
- b343-Security-/Timer-Cleanup bleibt weiter geschützt.

## Nicht geändert

- keine Kennzeichen-Geometrie
- keine HU-/TÜV-Plakettenlogik
- keine Wechselkennzeichen-Geometrie
- keine Sortierlogik
- keine Reminder-Integration
- keine neuen Features
- kein Buildsystemwechsel
- kein Lit-/Vite-/Rollup-Refactor

## Release-/HACS-Notiz

Die ChatGPT-ZIPs enthalten keine TTF-Binaries. Vor einem echten GitHub-/HACS-Release müssen die GL-Fonts lokal vorhanden sein:

- `fonts/GL-Nummernschild-Mtl.ttf`
- `fonts/GL-Nummernschild-Eng.ttf`

`npm run build` spiegelt vorhandene lokale Fonts nach `dist/fonts/`. Die vorhandenen README-/Lizenzdateien sind kein Ersatz für die Font-Binaries.

## Späterer Reminder-Block

Nach b344 soll das aktuelle Reminder-ZIP analysiert werden. Dann werden die Card-seitig vorbereiteten Datenpfade real angebunden und getestet.

Bis dahin gilt: Der Nummernschildrenderer ist Card-seitig vorbereitet/eingefroren; Änderungen nur bei echten Bugs.
