# TÜV Reminder Card b352

Full/Card handover ZIP for **b352 Editor Preview Layout Diagnostics**.

b352 is a diagnostic build on top of b351. It does **not** try another layout fix. Instead, it shows the live editor-preview layout values directly inside the preview so the remaining clipping/scale problem can be diagnosed from a screenshot.

## Current status

- Current Card stand: **b352**
- Purpose: diagnostic only
- Base: b351 Editor Preview Force Scale Contract
- Reminder integration remains a later End-to-End step.

## Changed in b352

- Added a small overlay in the Home Assistant editor preview with:
  - `reason`
  - `plate`
  - `cols`
  - `measured`
  - `rawVisible`
  - `visible`
  - `sim`
  - `layout`
  - `scaled`
  - `scale`
- The overlay appears only in editor preview context.
- The existing b351 scale contract remains unchanged.
- Cache/version markers were advanced to b352.

## Not changed

- keine Kennzeichen-Geometrie
- keine HU-Logik
- keine Wechselkennzeichen-Geometrie
- keine Sortierlogik
- keine Reminder-Integration
- kein Popup-Experiment
- kein neuer Layout-Fix

## Test instruction

Install/build b352 and open the editor preview in the problematic state. Please send a screenshot that includes the small diagnostic overlay. The relevant values are especially:

- `measured`
- `rawVisible`
- `visible`
- `sim`
- `layout`
- `scaled`
- `scale`
- `reason`

## Font note

The ChatGPT ZIP does not include TTF binaries. A local GitHub/HACS release build must include the GL font files under `fonts/` so `npm run build` can copy them to `dist/fonts/`.

No plate geometry changed. Reminder integration remains a later phase.

Historical b338/b352 note: Kennzeichen grafisch darstellen remains the editor option that gates graphical/text plate rendering. Sortierfunktionen and group color behavior remain preserved from the earlier b337/b340 path.

b352 also preserves the prior Card Final Release Audit status. ChatGPT-ZIPs enthalten keine TTF-Binaries. Nicht-Ziele: keine Kennzeichen-Geometrie, keine Reminder-Integration.
