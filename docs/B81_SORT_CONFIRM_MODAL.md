# b81 - Manual-sort discard confirmation is modal-like

## Input

- Previous ZIP: `tuev-card-full-b80-floating-panel-outside-click-cleanup.zip`
- Previous version: `0.1.1-b80`
- New version: `0.1.1-b81`
- New ZIP: `tuev-card-full-b81-sort-confirm-modal.zip`

## User feedback before this update

The b80 behavior was not strict enough for the manual-sort discard confirmation.

Requested behavior:

- When switching a group from manual sorting to an automatic sorting mode, the confirmation dialog must not close on outside click.
- It should close only when the user clicks `Abbrechen` / `Cancel` or `Ja` / `Yes`.

## Change

`src/editor/editor.js` now treats the manual-sort discard confirmation as a small modal state while `_pendingGroupSort` exists.

During that state:

- Clicks inside `.tuev-editor-sort-confirm` are allowed.
- `Cancel` and `Yes` keep working normally.
- Clicks outside the confirmation are ignored.
- Outside clicks no longer close `_pendingGroupSort`.
- Other editor controls behind the confirmation are not allowed to consume that same outside click.

This avoids accidental dismissal and avoids hidden state changes while the confirmation is open.

## Files changed

- `src/editor/editor.js`
  - Updated `handleDocumentClick()`.
  - Added strict `_pendingGroupSort` guard before normal floating-panel outside-click handling.
- `package.json`
  - Version set to `0.1.1-b81`.
- `package-lock.json`
  - Version set to `0.1.1-b81`.
- `src/**/*.js`
  - Import cachebusters updated from `?v=b80` to `?v=b81`.
- `src/tuev-card-entry.js`
  - Source entry comment updated to `b81`.
- `tuev-card.js`
  - Rebuilt bundle; expected header: `// TÜV Card bundled b81`.
- `HANDOVER.md`
  - Fully refreshed for b81.
- Current checklist docs
  - Active checkpoint/cachebuster references updated to b81.

## Deliberately not changed

- TÜV badge renderer.
- HU stamp overlay size values from b79.
- License plate renderer.
- EuroPlate/TTF availability rule.
- System-font fallback remains excluded.
- Group side-by-side runtime layout logic.
- Button/active-state polishing was not started yet.

## Test checklist

Use this resource URL while testing:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js?v=b81
```

Test the manual-sort confirmation:

1. Put a group into manual sorting if it is not already manual.
2. Choose an automatic sort option such as name, plate, due date, or status.
3. Confirm the discard dialog appears.
4. Click outside the dialog, inside the editor.
   - Expected: dialog stays open; no other editor control reacts to that click.
5. Click outside the dialog, outside the editor/card.
   - Expected: dialog stays open.
6. Click `Abbrechen`.
   - Expected: dialog closes; manual sorting remains unchanged.
7. Open the dialog again and click `Ja`.
   - Expected: dialog closes and the selected automatic sort is applied.

Regression checks:

1. Global display/eye panel still closes on outside click.
2. Group display/eye panel still closes on outside click.
3. Group color panel still closes on outside click.
4. Clicks inside normal floating panels still keep those panels open.
5. `Zur Gruppe hinzufügen` still reacts on the first click.

## Next recommended step

If b81 passes, the next safe step is still a small editor-polish pass for active/inactive button consistency:

- display eye badges
- sort badges
- group release / add buttons
- manual-sort state buttons

Avoid large renderer or layout rewrites until this editor behavior is confirmed stable.
