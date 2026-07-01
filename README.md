# TÜV Reminder Card b346

Full/Card handover ZIP for **b346 Windows Path Audit Fix**.

This stand fixes a Windows-only audit-script path-normalization issue from b345. Runtime Card behavior is unchanged.

See `HANDOVER.md` and `docs/B346_WINDOWS_PATH_AUDIT_FIX.md`.

## Font-/HACS-Hinweis

Die ChatGPT-Übergabe-ZIPs enthalten keine TTF-Binaries. Für GitHub/HACS müssen die GL-Fonts lokal im Release vorhanden sein, insbesondere:

- `fonts/GL-Nummernschild-Mtl.ttf`
- `fonts/GL-Nummernschild-Eng.ttf`

Beim lokalen Release-Build kopiert `scripts/build-bundle.mjs` vorhandene Fontdateien nach `dist/fonts/`.

## Scope

No plate geometry changed in b346. Reminder integration remains a later phase.

## Übernommene Card-/Editor-Fixes

Die früheren Fixes bleiben in b346 erhalten: Die Option **Kennzeichen grafisch darstellen** steuert weiterhin grafische Kennzeichen vs. Textanzeige; Sortierfunktionen bleiben auf dem b337-Config-Fluss; Gruppen-Farben bleiben beim Verschieben erhalten.

## b346 Final Release Audit Status

b346 keeps the Final Release Audit boundary from the previous release-audit stand and only adds the Windows path audit fix.

ChatGPT-ZIPs enthalten keine TTF-Binaries. Für GitHub/HACS müssen die lokalen GL-Fontdateien vorhanden sein.

Nicht-Ziele in b346:

- keine Kennzeichen-Geometrie
- keine Reminder-Integration
- keine HU-Logik
- keine Sortierlogik
- keine neuen Features
