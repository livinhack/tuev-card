# TÜV Reminder Card b335

Full handover ZIP for b335.

b335 is a **Card Editor/Preview Final Check** checkpoint on top of b334. It does not change renderer geometry or HU/Wechselkennzeichen rendering. It stabilizes the editor-side font availability handling and keeps Card renderer options explicit.

## Main points

- Card/Editor now use the b335 renderer cache boundary.
- Editor font availability checks are guarded and throttled.
- Temporary font unavailability no longer rewrites `plate_style` to `text`.
- The editor font check no longer fires config changes.
- `huBadgeRenderer: "full"` remains the Card default.
- Reminder/vehicle values remain explicit pass-through:
  - `huYear`
  - `huMonth`
  - `huRotation`
  - `changePlate`
- New check: `check:card-editor-preview-final`.
- No geometry, HU, Wechselkennzeichen, or font path changes.

## Checks

- `npm run check`
- `npm run build`

Both passed for this handover build.

## Font note

The ChatGPT ZIP does not include GL TTF binaries. A real GitHub/HACS release must include the GL font files before build so the graphical plate renderer is available in Home Assistant.
