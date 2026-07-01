# TÜV Reminder Card b337

Full handover ZIP for **b337 Post-Plate Card Cleanup / Open Tasks Audit**.

b337 starts the Card-finish phase after the technically prepared number-plate renderer checkpoint b336. It does not change number-plate geometry, HU badge rendering, Wechselkennzeichen geometry, font paths, or Reminder integration. The purpose is to freeze the plate renderer as a prepared Card-side checkpoint and to sort the remaining Card work before the current Reminder ZIP is connected later.

## Main points

- Number-plate renderer status is now documented as **prepared/frozen in the Card** until real Reminder-side options are available for end-to-end tests.
- b336 remains the technical plate-renderer checkpoint; b337 only updates version/cache markers and post-plate documentation.
- Open Card work is re-sorted into clear buckets:
  - Card/editor finish work
  - Layout/group/overlay follow-ups
  - HACS/font release checks
  - Later Reminder integration and real end-to-end plate tests
- New check: `check:post-plate-card-open-tasks`.
- No plate geometry changed.
- No geometry, HU, Wechselkennzeichen, font path, or Reminder-data changes.

## Checks

- `npm run check`
- `npm run build`

Both passed for this handover build.

## Font note

The ChatGPT ZIP does not include GL TTF binaries. A real GitHub/HACS release must include the GL font files before build so the graphical plate renderer is available in Home Assistant.

## Status

Use b337 as the **post-plate Card cleanup/audit checkpoint**. The plate renderer should now only be touched for concrete bugs or for the later Reminder integration tests when the current Reminder ZIP is supplied.
