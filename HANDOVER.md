# b340 – Sortierlogik-Rollback auf b337

Status: baut auf b339 auf. Die in b338/b339 geänderten Sortierfunktionen für ungruppiert/Gruppen wurden auf den bewährten b337-Fluss zurückgesetzt, weil die gemeldete Fehlbeobachtung durch Testen im falschen Bereich entstand. Beibehalten aus b339: integrierte GL-Fonts ohne asynchronen Editor-Fontcheck, stabile Text/Grafik-Umschaltung, Gruppenfarben-Mitnahme beim Verschieben und Eurofeld/Rahmen-Overlay-Fix.

# Handover – b340 Card Editor Sort / Font / Frame Fix

Current stand: **b340**.

b340 fixes the issues reported after testing b338 in Home Assistant:

1. Sorting still not working
   - Group sorting no longer waits behind the manual-sort confirmation popover.
   - Clicking group sort fields applies the sort directly.
   - Ungrouped sorting keeps the b338 saved-order behavior.
   - Asc/desc continues to rewrite the corresponding entity order.

2. `Kennzeichen grafisch darstellen` and font availability
   - The option is now independent from asynchronous font availability probes.
   - Editor preview always exposes the checkbox.
   - The editor keeps the public renderer boundary import, but no longer imports or calls `checkPlateFontAvailable()` / `ensurePlateFont()`.
   - Card font availability is now a stable compatibility no-op; graphical/text rendering obeys `plate_style`.
   - This should remove the preview jitter seen after switching to text plate display.

3. Euro field/frame layer order
   - The physical plate body now draws a black base frame, then reflective field + Euro field, then a black top frame stroke.
   - This keeps the Euro field visually behind the black frame at rounded corners.
   - No physical dimensions were changed.

Changed files of interest:

- `src/editor/editor.js`
- `src/tuev-card-entry.js`
- `src/card/groups.js`
- `src/plate/lab-renderer/plate-body.js`
- `tools/plate-physical-lab/src/plate/plate-body.js`
- `scripts/check-card-editor-sort-font-frame-fix.mjs`
- updated b340 cache/version markers and existing check expectations

Checks run:

- Full/Card: `npm run build` passed
- Full/Card: `npm run check` passed
- Lab: `npm run check` passed

Notes:

- No Kennzeichen layout/geometric solver changes.
- No HU-Plakettenrenderer changes.
- No Wechselkennzeichen geometry changes.
- No Reminder integration yet.
- ChatGPT ZIPs do not contain TTF binaries; final GitHub/HACS release still needs the selected GL font files locally.

Next suggested test in HA:

- Confirm all group sort chips and asc/desc work.
- Confirm disabling graphical plate display shows text and no longer jitters.
- Confirm graphical plate display still works.
- Confirm the blue Euro field no longer appears over the black frame corner.

No plate geometry changed. Later Reminder integration remains separate.

Sortier- und Farben-Verhalten aus b338 bleibt erhalten; b340 korrigiert die noch blockierte Sortierausführung.
