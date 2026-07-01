# TÜV Reminder Card b347

Full/Card handover ZIP for **b347 Card Editor Text Preview Scrollbar/Grid Stability Fix**.

This stand fixes a Windows-only audit-script path-normalization issue from b345. Runtime Card behavior is unchanged.

See `HANDOVER.md` and `docs/B347_WINDOWS_PATH_AUDIT_FIX.md`.

## Font-/HACS-Hinweis

Die ChatGPT-Übergabe-ZIPs enthalten keine TTF-Binaries. Für GitHub/HACS müssen die GL-Fonts lokal im Release vorhanden sein, insbesondere:

- `fonts/GL-Nummernschild-Mtl.ttf`
- `fonts/GL-Nummernschild-Eng.ttf`

Beim lokalen Release-Build kopiert `scripts/build-bundle.mjs` vorhandene Fontdateien nach `dist/fonts/`.

## Scope

No plate geometry changed in b347. Reminder integration remains a later phase.

## Übernommene Card-/Editor-Fixes

Die früheren Fixes bleiben in b347 erhalten: Die Option **Kennzeichen grafisch darstellen** steuert weiterhin grafische Kennzeichen vs. Textanzeige; Sortierfunktionen bleiben auf dem b337-Config-Fluss; Gruppen-Farben bleiben beim Verschieben erhalten.

## b347 Final Release Audit Status

b347 keeps the Final Release Audit boundary from the previous release-audit stand and only adds the Windows path audit fix.

ChatGPT-ZIPs enthalten keine TTF-Binaries. Für GitHub/HACS müssen die lokalen GL-Fontdateien vorhanden sein.

Nicht-Ziele in b347:

- keine Kennzeichen-Geometrie
- keine Reminder-Integration
- keine HU-Logik
- keine Sortierlogik
- keine neuen Features


## b347 Editor Text Preview Stability

b347 fixes the remaining editor-preview jitter seen only when graphical license plates are disabled. It stabilizes scrollbar-gutter sized preview-width changes, adds text-preview height hysteresis, shortens delayed width refreshes in text preview mode, and fixes the text plate fallback box so it cannot expand the preview grid. No renderer geometry, HU logic, sorting, or Reminder integration changed.
