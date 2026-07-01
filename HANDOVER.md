# Handover – b346 Windows Path Audit Fix

Current stand: **b346**.

b346 builds on **b345 Card Editor Preview Columns / Popup Stability Fix** and fixes a Windows-only release-check problem reported from the local `.bat` build.

## Change in b346

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

- `plate-physical-lab-b346-windows-path-audit-fix.zip`
- `tuev-card-full-b346-windows-path-audit-fix-handover.zip`

## Scope confirmation

No plate geometry changed in b346. Reminder integration remains a later phase.

## Übernommene Card-/Editor-Fixes

Die früheren Sortier- und Farben-Fixes bleiben in b346 erhalten: Sortierfunktionen bleiben auf dem b337-Config-Fluss, und Gruppen-Farben werden beim Verschieben materialisiert/mitgenommen.

## b346 Final Release Audit Status

b346 keeps the Final Release Audit boundary and only fixes Windows path normalization in audit scripts.

Reminder-ZIP analysis and real End-to-End integration remain the next later phase.
