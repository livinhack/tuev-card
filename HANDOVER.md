# Handover – b343 Card Security / Timer Cleanup

Current stand: **b343**.

## Basis

b343 baut auf **b342 Plate Color Source Unification** auf.

## Änderung in b343

Dieser Schritt setzt die konkreten, kleinen Punkte aus den externen Bewertungen um, die vor einem späteren Release sinnvoll und risikoarm sind:

- Toter Font-Refresh-Timer in der Card entfernt.
- Font-Verfügbarkeits-No-op wird nicht mehr bei `setConfig()` oder jedem `hass`-Update aufgerufen.
- Gemeinsames HTML-Escape-Util ergänzt: `src/utils/html-escape.js`.
- Card-Renderpfad escaped jetzt Fahrzeugname, Text-Kennzeichen, Gruppenüberschrift und Missing-Entity-ID.
- Editor nutzt das gemeinsame HTML-Escape-Util statt eigener lokaler Escape-Kopie.
- Confirm-Timings `1980` und `2160` sind jetzt als `CONFIRM_TIMING.stampHideMs` und `CONFIRM_TIMING.serviceCallMs` benannt.
- Card-Timeouts werden über `setManagedTimeout()` verwaltet und in `disconnectedCallback()` aufgeräumt.
- `lab-renderer-adapter.js` nutzt den bestehenden SVG-Escape-Helper statt eigener `escapeAttr`-Kopie.

## Nicht geändert

- keine Kennzeichen-Geometrie
- keine HU-Plakettenlogik
- keine Wechselkennzeichen-Geometrie
- keine Sortierlogik
- keine Reminder-Integration
- kein Legacy-/Umschalter
- kein Vite-/Rollup-/Lit-Umbau

## Neue/aktualisierte Checks

- `check:card-security-timer-cleanup`
- bestehende b342/b343 Boundary-/Smoke-Checks bleiben aktiv.

## Durchgeführte Checks

- Lab: `npm run check`
- Full/Card: `npm run check`
- Full/Card: `npm run build`

## Artefakte

- `plate-physical-lab-b343-card-security-timer-cleanup.zip`
- `tuev-card-full-b343-card-security-timer-cleanup-handover.zip`

## Nächster Einstieg

b343 ist ein Card-Sicherheits-/Wartbarkeitscheckpoint nach b342. Der nächste sinnvolle Schritt ist ein kurzer Praxistest von b343 in Home Assistant. Danach können README/HACS/Release-Struktur oder die spätere Reminder-Integration folgen.

## Beibehalten aus vorherigen Card-Fixes

- Option **Kennzeichen grafisch darstellen** bleibt wirksam.
- Sortierlogik bleibt auf dem b337-Rollback-Pfad.
- Gruppen-Farben bleiben beim Verschieben materialisiert und wandern mit.
