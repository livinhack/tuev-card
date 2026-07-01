# TÜV Reminder Card b338

Full handover ZIP for **b338 Card Editor Options / Sort / Group Color Fix**.

b338 follows the b337 post-plate Card audit and fixes three concrete Home Assistant editor/runtime findings:

- **Kennzeichen grafisch darstellen** now works again. If unchecked, the Card renders the plate as text even when the graphical renderer is available.
- Ungrouped sort controls and ascending/descending direction now update the visible draft order and saved entity order.
- Group colors now move with the group when the group order is changed.

The number-plate renderer remains Card-side prepared/frozen from the b336/b337 checkpoints. b338 does not change plate geometry, HU badge rendering, Wechselkennzeichen geometry, font paths, or Reminder integration. No plate geometry changed.

## Build/Test

- `npm run check`
- `npm run build`

## Font note

The graphical number-plate renderer needs the GL number plate TTF assets in the installed Card package. The ChatGPT ZIP may not contain binary font files; for GitHub/HACS release, keep the real font files in the release asset structure.

## Current scope

Use b338 as the current Card/editor-fix checkpoint. The plate renderer should still only be touched for concrete bugs or for the later Reminder integration tests when the current Reminder ZIP is supplied.
