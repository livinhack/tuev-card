# b343 – Card Security / Timer Cleanup

## Basis

b343 baut auf b342 auf. Der Kennzeichenrenderer bleibt geometrisch unverändert.

## Ziel

Externe Review-Punkte vor einem späteren HACS-/Release-Stand abarbeiten, ohne neue Features oder Renderer-Geometrie anzufassen.

## Änderungen

- Toter Font-Refresh-Timer in der Card entfernt.
- Card ruft die Font-Verfügbarkeits-No-op nicht mehr bei `setConfig()` oder jedem `hass`-Update auf.
- Neues gemeinsames HTML-Escape-Util: `src/utils/html-escape.js`.
- Card-Renderpfad escaped jetzt mindestens:
  - Fahrzeugname
  - Text-Kennzeichen
  - Gruppenüberschrift
  - Missing-Entity-ID
- Editor nutzt das gemeinsame HTML-Escape-Util statt eigener lokaler Formel.
- Confirm-Timings `1980` und `2160` wurden in `CONFIRM_TIMING` benannt:
  - `stampHideMs`
  - `serviceCallMs`
- Card-Timeouts werden über `setManagedTimeout()` verwaltet und in `disconnectedCallback()` mit `clearManagedTimeouts()` abgeräumt.
- `lab-renderer-adapter.js` nutzt für SVG-Attribute den bestehenden `escapeSvgAttr`-Helper statt eigener lokaler Kopie.

## Nicht geändert

- keine Kennzeichen-Geometrie
- keine HU-/TÜV-Plakettenlogik
- keine Wechselkennzeichen-Geometrie
- keine Sortierlogik
- keine Reminder-Integration
- kein Buildsystemwechsel
- kein Lit-/Vite-/Rollup-Refactor

## Check

Neu: `check:card-security-timer-cleanup`.

Der Check schützt die oben genannten Punkte und läuft im Full/Card-`npm run check` mit.
