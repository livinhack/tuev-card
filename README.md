# TÜV Reminder Card b341

Full/Card handover ZIP for **b341 Card Text Preview Stability**.

## Stand

b341 builds on b340.

- b340 kept the b337 sorting flow and preserved the b339 fixes for integrated GL-font behavior, group color movement, and Euro-field/frame layering.
- b341 fixes the remaining issue where the Home-Assistant editor preview jittered after disabling **Kennzeichen grafisch darstellen**.

## b341 change

When `plate_style` is `text`, the editor preview no longer uses the simulated multi-column preview scaling wrapper. Text plates do not have a fixed SVG box, so the scaled editor wrapper could react to its own height changes and remeasure/repaint repeatedly.

The text plate display also has a fixed line-height/min-height to keep the text branch stable.

## Not changed

- no sorting logic change from b340/b337 rollback
- no license plate geometry change
- no HU badge logic change
- no Wechselkennzeichen geometry change
- no Reminder integration
- no legacy renderer switch

## Checks

- Full/Card: `npm run check` passed
- Full/Card: `npm run build` passed
- Lab companion: `npm run check` passed

## Font note

ChatGPT ZIPs do not include font binaries. For the real GitHub/HACS release, the selected GL font binaries must be present under `fonts/` / `dist/fonts/`.

No plate geometry changed. Later Reminder integration remains separate.

TTF reminder: The ZIP generated here may contain placeholders/readmes only. A real release must include the GL `.ttf` files before building/publishing for HACS.
