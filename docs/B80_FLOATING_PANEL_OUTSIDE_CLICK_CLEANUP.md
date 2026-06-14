# b80 - Floating panel outside-click cleanup and handover refresh

## Input

- Previous ZIP: `tuev-card-full-b79-single-column-stamp-rethink-version-sync.zip`
- Previous version: `0.1.1-b79`
- New version: `0.1.1-b80`
- New ZIP: `tuev-card-full-b80-floating-panel-outside-click-cleanup.zip`

## User test result before this update

The b79 runtime/card checks were reported as passed:

1. Single-column HU stamp overlay: passed.
2. Editor group functions: passed.
3. Floating panels: not fully passed. Outside-click closing was inconsistent; in some places it worked, in other places clicking outside did nothing.

The earlier item "automatic adding of new vehicles" is not the next feature. The current project decision is to keep the explicit `Alle hinzufügen` / `Add all` button because a dynamic, non-config-writing auto-add system made the configuration behavior too cumbersome.

## Root cause / design note

The b77/b79 document click handler protected every click inside the editor root:

```js
if (clickedInsideEditor || clickedInsideFloatingControl) {
    return;
}
```

That prevented some outside clicks from closing a floating panel when the click target was still inside the editor card but outside the actual floating panel.

The handler also used the capture phase. Closing and re-rendering immediately during capture can remove the clicked button before its own click handler runs. That was one reason the earlier "Zur Gruppe hinzufügen" click could need a second attempt.

## Change

`src/editor/editor.js` now uses a more precise floating-panel close path:

- It only protects clicks inside an actual `.tuev-editor-floating-panel`.
- It protects real panel triggers such as:
  - display eye buttons
  - group color buttons
- It no longer treats the whole editor root as "inside the floating panel".
- Closing is delayed with `setTimeout(..., 0)` so the clicked control can finish its own action first.
- Group sort buttons are guarded so the manual-sort discard confirmation is not opened and immediately closed by the same click.
- The actual close/reset logic is centralized in `closeFloatingPanels()`.

## Files changed

- `src/editor/editor.js`
  - Reworked `handleDocumentClick()`.
  - Added `hasOpenFloatingPanel()`.
  - Added `closeFloatingPanels()`.
- `package.json`
  - Version set to `0.1.1-b80`.
- `package-lock.json`
  - Version set to `0.1.1-b80`.
- `src/**/*.js`
  - Import cachebusters updated from `?v=b79` to `?v=b80`.
- `src/tuev-card-entry.js`
  - Source entry comment updated to `b80`.
- `tuev-card.js`
  - Rebuilt bundle; header should show `// TÜV Card bundled b80`.
- `HANDOVER.md`
  - Fully refreshed for b80.
- Current checklist docs
  - Updated current checkpoint/cachebuster references to b80 where they describe the active working stand.

## Deliberately not changed

- TÜV badge renderer.
- HU stamp overlay size values from b79.
- License plate renderer.
- EuroPlate/TTF availability rule.
- System-font fallback remains excluded.
- Group runtime layout logic was not refactored.

## Test checklist

Use this resource URL while testing:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js?v=b80
```

Test floating panels:

1. Open the global display/eye panel.
2. Click inside the panel: it should stay open.
3. Click elsewhere inside the editor but outside the panel: it should close.
4. Open a group display/eye panel.
5. Click another editor control outside the panel: the panel should close after that control has processed the click.
6. Open a group color picker.
7. Click inside the color picker: it should stay open or apply the selected color normally.
8. Click elsewhere outside the color picker: it should close.
9. From manual group sorting, choose an automatic sort and check the discard confirmation:
   - The confirmation must stay open after the sort click.
   - Confirm/cancel buttons may close it after being clicked.
10. Re-test `Zur Gruppe hinzufügen`: it should still react on the first click.

## Next recommended step

If b80 fixes the outside-click behavior, the next safe step is a small editor-polish pass for active/inactive button consistency:

- display eye badges
- sort badges
- group release / add buttons
- manual-sort state buttons

Avoid large renderer or layout rewrites until this editor behavior is confirmed stable.
