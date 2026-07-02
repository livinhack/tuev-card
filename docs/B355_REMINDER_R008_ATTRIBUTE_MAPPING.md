# B355 – Reminder r008 Attribute Mapping

b355 maps the separately versioned Reminder r008 sensor attributes into the existing Card renderer boundary.

## Mapping rules

- Display plate: `plate_display || plate`
- Base plate fallback: `plate_base || plate`
- H/E: `plate_suffix_h` and `plate_suffix_e` are preferred; `plate_suffix` remains a compatibility fallback.
- Green: `plate_color_mode === "green"` maps to renderer `visualStyle.plateColorMode = "green"`.
- Season: `seasonal`, `season_start_month`, and `season_end_month` map to renderer `season` options.
- Format: Reminder `plate_format` maps to Lab `oneLine`, `twoLine`, `reducedTwoLine`, or `motorcycle`.
- Wechselkennzeichen: `change_plate_enabled`/`plate_kind` map to renderer `changePlate.enabled`; common text and vehicle digit are passed through.

## Renderer boundary

The active Card renderer remains the Lab adapter. b355 does not rebuild plate geometry. It only passes the new vehicle-specific data into renderer options and adjusts shared layout measurements to use those options.

## Compatibility

- Card b355 expects Reminder r008 attributes but keeps old `plate` fallback behavior.
- Reminder r008 remains unchanged.
