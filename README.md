# TÜV Reminder Card b343

Full/Card handover ZIP for **b343 Card Security / Timer Cleanup**.

## Inhalt

b343 setzt kleine, konkrete Review-Punkte vor einem späteren Release um:

- toter Font-Refresh-Timer entfernt
- keine wiederholten Font-No-op-Aufrufe mehr bei `setConfig()`/`hass`
- gemeinsames HTML-Escape-Util ergänzt
- Card-Renderpfad escaped Fahrzeugname, Text-Kennzeichen, Gruppenüberschrift und Missing-Entity-ID
- Editor nutzt das gemeinsame HTML-Escape-Util
- Confirm-Timings `stampHideMs` und `serviceCallMs` benannt
- Card-Timeouts werden verwaltet und beim Entfernen der Card aufgeräumt
- Adapter nutzt den vorhandenen SVG-Escape-Helper statt lokaler Kopie

## Nicht geändert

Keine Kennzeichen-Geometrie, HU-Logik, Sortierlogik oder Reminder-Integration wurde geändert. Kein Buildsystem-/Lit-Refactor.

## Checks

- `npm run check`
- `npm run build`

## Hinweis Fonts

Die ChatGPT-ZIPs enthalten keine TTF-Binaries. Für GitHub/HACS müssen die GL-Fonts lokal im Release vorhanden sein.

## Renderer-Grenze

Der Nummernschildrenderer bleibt Card-seitig vorbereitet/eingefroren. b343 ist ein Sicherheits-/Wartbarkeitscheckpoint, kein neuer Renderer-Schritt.

## Beibehaltene Editor-Fixes

Die Option **Kennzeichen grafisch darstellen** bleibt wirksam. Die Sortierlogik bleibt auf dem zurückgesetzten b337-Fluss, und Gruppen-Farben bleiben beim Verschieben erhalten.
