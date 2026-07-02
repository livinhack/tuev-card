# Handover – b348 Editor Popup Rollback / Text Preview Stability

Current stand: **b348**.

b348 builds on b347. The text-mode editor preview jitter fix remains, but the popup outside-click implementation from b345/b347 is rolled back to the safer b344-style deferred click close path.

## Reason

User reported that after the jitter fix the browser could hang on the editor page and floating/hover panels again failed to close reliably via outside click. The risky change was the document-level `pointerdown` capture handler with immediate close.

## Change in b348

- remove `pointerdown` capture listener for floating-panel outside close
- remove the extra `keydown` listener from that popup experiment
- keep the original document `click` capture listener
- restore deferred `setTimeout(..., 0)` close behavior
- keep b347 text-preview scrollbar/grid stability

## Checks

Run:

```bash
npm run check
npm run build
```

## Non-goals

- no plate geometry change
- no HU logic change
- no sorting change
- no Reminder integration
- no renderer rewrite


## Font / HACS Hinweis

Die ChatGPT-ZIPs enthalten keine TTF-Binaries. Für GitHub/HACS müssen die GL-Fonts lokal im Release vorhanden sein, damit `npm run build` sie nach `dist/fonts/` kopieren kann.


No plate geometry changed. Do not continue broad number-plate renderer cleanup in this step; later Reminder integration remains separate.


## Preserved earlier fixes

Sortierfunktionen bleiben auf dem b337-Config-Fluss. Gruppen-Farben werden beim Verschieben weiterhin materialisiert/mitgenommen.


## Final Release Audit

b348 behält den Final Release Audit Status bei; dieser Stand ist ein gezielter Editor-Popup-Rollback ohne neue Features.


## Later Reminder End-to-End phase

Die Reminder-Integration bleibt ein späterer End-to-End-Schritt nach Lieferung des aktuellen Reminder-ZIP.
