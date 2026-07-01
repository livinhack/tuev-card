# b182 – Reduced upper seal row visual clearance

## Scope

- Full/Card ZIP: documentation and handover sync only.
- No Card code changes.
- Authoritative Lab code is the separate Lab ZIP.
- No font binaries are included.

## Lab change

b182 builds on b181 and keeps the Reduced two-line Standard long-lower-row fallback: the 45 mm authority seal moves into the upper row left of the 35 mm HU seal.

The b181 debug placeholder clearance moved the HU circle/right field too far right. b182 keeps the official 45 mm + 35 mm field chain adjacent and creates only the visible placeholder clearance inside the 45 mm authority field: the authority placeholder circle touches the left red field boundary and is drawn 2 mm narrower for debug clarity. The HU circle stays inside the right 35 mm field, so the right `*` minimum margin remains intact.

## Status

- Reduced Standard short/normal cases unchanged.
- Reduced Standard long-lower-row upper seal row still needs visual review.
- Reduced H/E, season, and green are still not enabled.
- b172 remains discarded.
