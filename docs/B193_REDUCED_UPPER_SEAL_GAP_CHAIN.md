# b193 – Reduced upper seal gap chain

Stand: b193

## Scope

Documentation-only Full/Card handover for a Lab-only Reduced Standard fix. Card code is unchanged.

Authoritative Lab ZIP: `plate-physical-lab-b193-reduced-upper-seal-gap-chain.zip`.

## Problem

In b192 the upper side-by-side seal row used a dynamic text-to-seal corridor, but the gap between the 45-mm authority seal and the 35-mm HU seal was not a separately solved row-chain gap. Visually the two seals could appear attached.

## Fix

The upper side-by-side Reduced row is now solved as:

```text
Top text
+ dynamic text-to-authority gap
+ 45-mm authority seal field
+ dynamic authority-to-HU gap
+ 35-mm HU seal field
+ equal outside margins
```

Both dynamic seal gaps use the 5–20-mm corridor. The authority seal and HU seal are rendered as separate items, so debug labels and collision checks use the same solved geometry that is rendered.

## Validation

```text
npm run check:regression
Regression passed: 29/29 cases OK.
```

The regression checks that Upper-Seal cases expose a dynamic `upperSealPairGap` in the 5–20-mm corridor.

## Full/Card sync status

The Full ZIP updates handover/docs/version only. `tools/plate-physical-lab/` remains intentionally frozen and non-authoritative. The separate Lab ZIP is the source of truth.
