# b354 – Editor Preview Scale Cleanup

b354 keeps the b353 editor-preview inner-width scale fix and removes the temporary diagnostic overlay.

## Result

- The editor preview still scales simulated multi-column content to the inner usable preview width.
- Scrollbar/right-edge safety remains named via `getPreviewScaleSafetyPx()`.
- The temporary b352/b353 diagnostic overlay is removed from production UI.
- Checks now assert both the preserved scale contract and the absence of the diagnostic overlay.

## Not changed

- No Kennzeichen geometry.
- No HU logic.
- No Wechselkennzeichen geometry.
- No sorting logic.
- No Reminder integration.
- No popup experiment.
