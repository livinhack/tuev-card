# Handover – b347 Card Editor Text Preview Scrollbar/Grid Stability Fix

Current stand: **b347**.

b347 builds on **b346 Windows Path Audit Fix** and fixes the remaining editor-preview jitter that occurs only when graphical license plates are disabled.

## Change in b347

- Fixed path normalization in audit scripts that compared imported/source file paths against allowlists.
- Replaced the incorrect double-backslash normalization with single-backslash normalization in the affected scripts.
- This makes `check:renderer-legacy-audit` recognize the allowed blue placeholder fallback files on Windows too.

## Important

The old blue HU/debug placeholder is still only allowed in the documented fallback/debug files. Productive Full-HU rendering remains unchanged.

## Not changed

- no license plate geometry
- no HU logic
- no change-plate geometry
- no sort logic
- no popup behavior
- no font logic
- no Reminder integration
- no new features

## Validation

- Lab: `npm run check` passed
- Full/Card: `npm run check` passed
- Full/Card: `npm run build` passed

## ZIPs

- `plate-physical-lab-b347-windows-path-audit-fix.zip`
- `tuev-card-full-b347-windows-path-audit-fix-handover.zip`

## Scope confirmation

No plate geometry changed in b347. Reminder integration remains a later phase.

## Übernommene Card-/Editor-Fixes

Die früheren Sortier- und Farben-Fixes bleiben in b347 erhalten: Sortierfunktionen bleiben auf dem b337-Config-Fluss, und Gruppen-Farben werden beim Verschieben materialisiert/mitgenommen.

## b347 Final Release Audit Status

b347 keeps the Final Release Audit boundary and only fixes Windows path normalization in audit scripts.

Reminder-ZIP analysis and real End-to-End integration remain the next later phase.


## b347 change

- Stabilized editor-preview text plate mode against scrollbar/grid feedback loops.
- Added stable scrollbar gutter reservation to the scaled preview wrapper.
- Cached preview visible width and ignored scrollbar-gutter sized oscillations.
- Added wider text-preview height hysteresis.
- Shortened delayed width refreshes in text preview mode.
- Fixed text fallback plate box width/height so it cannot expand the preview grid.

No license-plate geometry, HU logic, sorting logic, popup logic, or Reminder integration changed.
