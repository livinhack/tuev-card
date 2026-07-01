# b198 – Reduced season field row baseline

b198 is a Lab-only documentation/handover sync for the Reduced season-field baseline fix. Card code is unchanged.

## Problem

The Reduced row-chain appended the season field to the lower row, but the month digits still used the absolute standard two-line season baseline. The visible result was that `04/10` could overlap the HU/authority-seal area although the season field boxes were in the lower row.

## Fix

- Reduced season digits are now positioned relative to the actual lower-row `season-field` item.
- The upper month baseline is tied to the upper 20-mm season box.
- The lower month baseline is tied to the lower 20-mm season box.
- Auto width and H/E/season template selection are unchanged from b197.

## Checks

```text
Lab:  Regression passed: 35/35 cases OK.
Full: Checked 33 JavaScript files.
Full: Release asset check passed.
```

`tools/plate-physical-lab/` in the Full ZIP remains intentionally frozen/not authoritative. The separate Lab ZIP is authoritative.
