# b349 – Editor Popup Rollback / Text Preview Stability

b349 keeps the b347 text-preview scrollbar/grid stability fix but rolls the floating-panel outside-click implementation back to the safer b344-style deferred `click` capture path.

## Why

After b347 the text-mode preview jitter was fixed, but the editor page could hang and floating panels did not reliably close on outside click. The risky part was the b345/b347 popup change using `pointerdown` capture and immediate close.

## Change

- remove the document-level `pointerdown` capture outside-close listener
- remove the added `keydown` listener from that popup experiment
- restore the deferred click close path:
  - document `click` capture remains
  - outside close runs through `setTimeout(..., 0)`
- keep b347 text-preview scrollbar/grid stability

## Non-goals

- no plate geometry change
- no HU logic change
- no sorting change
- no Reminder integration
- no graphical renderer change
