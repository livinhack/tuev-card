# Handover – Card b355 / Reminder r008 Attribute Mapping

Current Card stand: **b355**.

Card and Reminder are separate projects with separate versioning. Card b355 is based on the tested Card b354 preview-cleanup stand and maps the new vehicle attributes from Reminder r008 into the existing Card renderer boundary.

## Goal

Activate the new Reminder r008 displays in the Card without changing Reminder code:

- green plates
- seasonal plates
- Wechselkennzeichen
- H/E suffixes from booleans
- plate format selection

## Changed in b355

- Added `src/card/reminder-attributes.js`.
- `renderVehicle()` now uses `getReminderPlateData(attr)`.
- Text mode and entity labels prefer `plate_display` where available.
- Graphical `renderLicensePlate()` receives entity-specific renderer options.
- `getSharedPlateLayout()`/`getSharedPlateScale()` now measure each entity with its Reminder-derived renderer options.
- `lab-renderer-adapter.js` now forwards:
  - `plateFormat`
  - `visualStyle`
  - `season`
  - existing `changePlate`
- SVG top-level attributes now expose renderer diagnostics relevant to mapping:
  - `data-plate-format`
  - `data-plate-color-mode`
  - `data-season-enabled`
  - `data-change-plate`
  - `data-change-plate-vehicle-text`
- Green + season is allowed in the Card render path instead of being silently disabled.
- Added `scripts/check-card-reminder-r008-attribute-mapping.mjs`.

## Reminder r008 attributes consumed

- `plate`
- `plate_base`
- `plate_display`
- `plate_kind`
- `plate_format`
- `plate_color_mode`
- `plate_suffix_h`
- `plate_suffix_e`
- `plate_suffix`
- `seasonal`
- `season_start_month`
- `season_end_month`
- `change_plate_enabled`
- `change_plate_common_text`
- `change_plate_vehicle_digit`
- `change_plate_vehicle_text`

## Preserved

- b350 visible-width bypass fix.
- b351 force-scale contract.
- b347/b348 text preview stability and popup rollback.
- b349 scroll edge polish.
- b354 editor-preview scale cleanup.
- Sortierlogik remains on the b337 rollback path, and group Farben continue to move with their groups.

## Not changed

- No Reminder code changes.
- No Calendar-v3 changes.
- No `local_calendar` sync.
- No Sidebar/Manager UI.
- No Area-Code autocomplete list.
- No broad Kennzeichen geometry rebuild.
- No HU logic change.

No plate geometry changed. Do not continue broad number-plate renderer cleanup in this step. Reminder integration is now limited to the r008 attribute mapping boundary.

## Checks

- `npm run build`
- `npm run check`
- `npm run check:card-reminder-r008-attribute-mapping`

All passed in this build.

Compatibility note for the preserved b355 Final Release Audit checks: Reminder-ZIP integration remains a later End-to-End step for Reminder-side code; b355 only maps Reminder r008 attributes inside the Card.
