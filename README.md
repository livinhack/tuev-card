# TÜV Reminder Card b348

Full/Card handover ZIP for **b348 Editor Popup Rollback / Text Preview Stability**.

b348 keeps the b347 fix for the editor text-mode preview jitter, but rolls the floating-panel outside-click handling back to the safer b344-style deferred click path because the pointerdown-capture experiment could make the editor page hang and break outside-click closing.

## Status

- Current Card stand: **b348**
- Plate renderer remains Card-side prepared/frozen until later Reminder integration.
- GL fonts are expected as bundled release assets under `fonts/` / `dist/fonts/`.

## Changed in b348

- removed document-level `pointerdown` capture close handler from the editor
- removed the added popup `keydown` listener from that experiment
- restored deferred click outside-close behavior
- kept b347 text-preview scrollbar/grid stability

## Not changed

- keine Kennzeichen-Geometrie
- keine HU-Logik
- keine Wechselkennzeichen-Geometrie
- keine Sortierlogik
- keine Reminder-Integration
- keine neuen Features


## Font / HACS Hinweis

Die ChatGPT-ZIPs enthalten keine TTF-Binaries. Für GitHub/HACS müssen die GL-Fonts lokal im Release vorhanden sein, damit `npm run build` sie nach `dist/fonts/` kopieren kann.


## Editor option status

Die Option **Kennzeichen grafisch darstellen** bleibt wirksam: an = grafischer Renderer, aus = Textanzeige.


## Final Release Audit

b348 behält den Final Release Audit Status bei; dieser Stand ist ein gezielter Editor-Popup-Rollback ohne neue Features.
