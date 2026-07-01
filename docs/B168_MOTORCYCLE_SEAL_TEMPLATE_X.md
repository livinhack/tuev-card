# b168 – Motorcycle seal x template

## Goal

Fine-tune only the Kraftrad seal x positions after visual b167 review.

## Decision

The motorcycle seal pair must no longer be solved from the complete available middle-zone width. Instead, it uses fixed visual template centers:

- HU: `x = 87.5 mm`
- authority seal: `x = 132.5 mm`

This keeps the HU position close to the good seasonal visual reference and the authority seal close to the good non-season visual reference.

## Scope

Changed in standalone Lab only. Full/Card code is not modified.

## Non-changes

- No Card integration.
- No font binaries.
- No change to non-motorcycle geometries.
- No change to motorcycle season vertical template.
- No change to motorcycle text fields or font calibration.
