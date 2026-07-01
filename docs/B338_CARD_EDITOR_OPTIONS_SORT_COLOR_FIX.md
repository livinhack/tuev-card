# b338 Card Editor Options / Sort / Group Color Fix

b338 fixes three concrete Home Assistant editor findings reported after b337.

## Fixed

- The display option **Kennzeichen grafisch darstellen** now controls the runtime rendering path again.
  - `plate_style: "plate"` enables graphical number plates when the required fonts are available.
  - `plate_style: "text"` keeps the normal text plate display even when the graphical renderer and fonts are available.
- Ungrouped sort controls now update the visible draft order and the persisted entity order.
  - sort by name / plate / due date / status
  - ascending / descending direction
- The `release ungrouped entities` button now calls its existing handler.
- Group reordering now materializes the visible fallback color before the move so the group keeps its color when moved up/down.

## Not changed

- No number-plate geometry changed.
- No HU badge rendering changed.
- No Wechselkennzeichen geometry changed.
- No Reminder integration changed.
- No legacy renderer path was added.

## Guard

`check:card-editor-options-fix` protects the b338 fixes:

- Card graphical rendering is gated by `plate_style === "plate"` and font availability.
- Editor sort controls update `_draftEntityIds` through the same `sortEntityIds` helper used by the Card.
- Group move buttons preserve visible colors by storing the currently visible fallback color before reordering.
