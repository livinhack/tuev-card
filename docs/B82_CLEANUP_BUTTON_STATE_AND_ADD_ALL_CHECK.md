# b82 - Cleanup, button-state audit, and Add all check

## Previous state

- Previous ZIP: `tuev-card-full-b81-sort-confirm-modal.zip`
- Previous version: `0.1.1-b81`
- New version: `0.1.1-b82`
- New ZIP: `tuev-card-full-b82-cleanup-button-state-add-all-check.zip`

## User-confirmed before b82

The user reported that the b81 behavior fits:

- b79 single-column HU stamp overlay: passed.
- Editor group functions: passed.
- Normal display/color floating panels: passed.
- Manual-sort discard confirmation: passed.

The user then asked to immediately check the two next candidate items before doing the planned cleanup:

1. Editor button active/inactive behavior.
2. The `Alle hinzufügen` / `Add all` approach.

## Result of the check

### 1. Editor button active/inactive behavior

No functional blocker was found.

The sort/display buttons already use `aria-pressed` consistently:

- Ungrouped sort chips use `aria-pressed` for the active sort.
- Group sort chips use `aria-pressed` for the active sort.
- Display eye buttons use `aria-pressed` when the panel is open.
- Group display eye buttons also stay visually active when the group has a custom display override.
- Display column chips use `aria-pressed` for the selected column value.
- Group display column chips use `aria-pressed` for the selected group column value.
- Disabled action buttons use native `disabled` state.

One small visual outlier was cleaned up:

- The group color button already opened/closed correctly, but its open state was not explicitly exposed as an active/pressed state.
- b82 adds `aria-pressed` to the group color toggle while its color panel is open.
- The existing color-accent behavior is preserved.

### 2. `Alle hinzufügen` / `Add all`

The preferred non-dynamic approach is already implemented.

Current behavior:

- The top entity section contains an `Alle hinzufügen` button.
- It is enabled only when HA exposes TÜV entities that are not already configured.
- It adds all still-unselected TÜV entities to the explicit card config.
- It closes open pickers/search and writes the config through the existing `config-changed` flow.
- It does not reintroduce the discarded dynamic `auto_add_entities` approach.

No functional code change was needed for this item.

## b82 cleanup changes

### Version sync

- `package.json`: `0.1.1-b82`
- `package-lock.json`: `0.1.1-b82`
- All source import cachebusters: `?v=b82`
- `src/tuev-card-entry.js`: `// TÜV Card source entry b82`
- Generated bundle header: `// TÜV Card bundled b82`

### Editor cleanup

Files:

- `src/editor/editor.js`
- `src/editor/render-parts.js`
- `src/editor/buttons.js`
- `src/editor/styles.js`

Changes:

- Removed unused/legacy inline-display-menu references left over from before floating panels were moved to `floating-panels.js`.
- Removed unused old group-layout toggle styles. The option now lives in the global display popover.
- Removed unused `groupsLayout` plumbing from the group-section renderer. The value remains in the global display popover where it is actually used.
- Removed the unused `active` parameter from the generic pill-button renderer.
- Removed an unused extra argument passed into the group entity picker renderer.
- Added explicit active/open state for the group color toggle.

## Intentionally untouched

- No HU badge renderer changes.
- No license-plate renderer changes.
- No EuroPlate/TTF/font availability changes.
- No group runtime layout behavior changes.
- No stamp overlay size changes.
- No dynamic auto-add behavior reintroduced.

## Checks run

```bash
npm run check
npm run build
```

Additional spot checks:

- `package.json` version is `0.1.1-b82`.
- `tuev-card.js` starts with `// TÜV Card bundled b82`.
- Source entry comment is `// TÜV Card source entry b82`.
- No active source import remains on `?v=b81`.

## Manual test focus for b82

Use a fresh cachebuster:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js?v=b82
type: module
```

Test only the editor polish points plus quick regression checks:

1. Open and close the group color popover. The color dot should now clearly show an active/open state.
2. Check group display eye, sort chips, sort direction, and disabled group up/down buttons for unchanged behavior.
3. Click `Alle hinzufügen` with one or more unconfigured TÜV entities available. They should be written into the card config.
4. With all entities already configured, `Alle hinzufügen` should be disabled and the all-added hint should be shown.
5. Recheck normal outside-click behavior for display/color panels.
6. Recheck that the manual-sort discard confirmation only closes via `Abbrechen` or `Ja`.
