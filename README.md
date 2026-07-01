# b340 – Sortierlogik-Rollback auf b337

Dieser Stand setzt die Sortierbedienung wieder auf den bewährten b337-Fluss zurück. Die b339-Korrekturen für integrierte Fonts, Preview-Stabilität und Eurofeld/Rahmen bleiben erhalten.

# TÜV Reminder Card b340

Full handover ZIP for **b340 Card Editor Sort / Font / Frame Fix**.

b340 follows b338 and fixes the concrete findings from the HA test:

- Sortierchips for name, plate, HU/due date, status, and asc/desc are treated as active editor/runtime options.
- Group sorting now applies directly instead of getting stuck behind the manual-sort confirmation path.
- The graphical plate checkbox is no longer hidden or controlled by asynchronous font availability probes. The GL fonts are treated as bundled release assets; the checkbox only controls `plate_style`.
- Card and editor no longer repaint/fallback because of font availability checks, which should remove the text-preview jitter after disabling graphical plates.
- The Euro field is still drawn as part of the physical plate body, but the black frame is drawn again as the top border layer so the blue field no longer appears in front of the frame at the rounded corners.

No intended changes:

- no plate geometry recalculation
- no HU badge logic change
- no Wechselkennzeichen geometry change
- no Reminder integration
- no legacy renderer switch

Important Font/TTF note: ChatGPT ZIPs do not include font binaries. For the real GitHub/HACS release, the previously selected GL font binaries still need to be present in the release package under `fonts/` / `dist/fonts/`. The UI no longer treats the option as unavailable while probes settle, but the actual release still needs the font files.

Use b340 as the current Card/editor fix checkpoint after b337/b338.

No plate geometry changed. Later Reminder integration remains separate.

Option „Kennzeichen grafisch darstellen“ bleibt der sichtbare Schalter für grafisch/text.
