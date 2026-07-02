# TÜV Reminder Card b355

Full/Card handover ZIP for **Card b355 – Reminder r008 Attribute Mapping**.

b355 starts the Card-side integration for the separately versioned Reminder project. It uses **Card b354** as the tested preview-cleanup baseline and reads the new vehicle/plate attributes emitted by **Reminder r008**.

## Changed in b355

- Added `src/card/reminder-attributes.js` as the Card-side mapping boundary for Reminder r008 attributes.
- Text and graphical plate display now prefer `plate_display`/structured Reminder data while preserving the existing `plate` fallback.
- Graphical renderer receives Reminder options for:
  - `plate_color_mode` → green plate rendering
  - `seasonal`, `season_start_month`, `season_end_month` → season field rendering
  - `plate_format` → one-line, two-line, reduced two-line, motorcycle
  - `plate_suffix_h`, `plate_suffix_e` → H/E handling
  - `change_plate_enabled`, `change_plate_common_text`, `change_plate_vehicle_digit` → Wechselkennzeichen supplement
- Shared plate layout now measures each entity with its own renderer options.
- Adapter now forwards `plateFormat`, `visualStyle`, and `season` to the Lab renderer.
- Green + season is no longer silently suppressed by the Card renderer path.
- Added `check:card-reminder-r008-attribute-mapping`.

## Compatibility target

- Reminder target: **r008**
- Card baseline: **b354**
- New Card version: **b355**

## Preserved from b354

- Editor-preview scale cleanup.
- Textmode jitter fix.
- Popup rollback/stability.
- Sortierlogik remains on the b337 rollback path.
- Security/timer cleanup.
- HU badge logic.

## Not changed

- No Reminder code changes.
- No Calendar-v3 changes.
- No `local_calendar` sync.
- No Sidebar/Manager UI.
- No Area-Code autocomplete list.
- No broad Kennzeichen geometry rebuild.

No plate geometry changed. Do not continue broad number-plate renderer cleanup in this step. Reminder integration is now limited to the r008 attribute mapping boundary.

Historical b338/b355 note: Kennzeichen grafisch darstellen remains the editor option that switches between graphical and text plate rendering.
Historical b344/b355 note: Final Release Audit status remains preserved.
ChatGPT-ZIPs enthalten keine TTF-Binaries. Für GitHub/HACS müssen die GL-Fonts lokal vorhanden sein.

Compatibility note for the preserved b355 Final Release Audit checks: keine Kennzeichen-Geometrie, keine Reminder-Integration im Reminder-Projekt; b355 contains only Card-side Reminder-r008 attribute mapping.
