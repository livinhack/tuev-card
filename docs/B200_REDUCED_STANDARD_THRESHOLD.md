# b200 – Reduced Standard lower-row threshold

b200 documents the separate Physical Lab fix for the Standard Reduced switching threshold.

## Problem

`W QU11` switched to the upper side-by-side seal row while typing toward `W QU111`, even though the lower row contains only four visible characters.

## Fix

- Standard Reduced without H/E and without season may use upper side-by-side seals only from five visible lower-row characters.
- Four-character lower rows remain in the vertical-seal template and step up in width.
- H/E and season remain mandatory upper-seal templates from 180 mm.

## Validation

The authoritative Lab ZIP reports `Regression passed: 36/36 cases OK`.

The Full/Card package is documentation-only for this step; card code remains unchanged.
