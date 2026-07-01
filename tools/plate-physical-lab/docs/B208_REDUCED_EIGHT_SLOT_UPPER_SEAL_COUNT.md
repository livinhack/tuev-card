# b208 – Reduced 8-slot upper-seal counting

b208 is a targeted Lab-only follow-up to b207.

## Fix

The H/E/Saison upper-side-by-side seal guard now counts the complete visible Reduced chain:

- district letters
- recognition letters/digits
- final H/E suffix
- season field as one occupied block

This means `HVL DI9E` with season is treated as an 8-slot upper-seal edge case even though the lower row contains `I`. The rule is anchored on the full-width three-letter upper district (`HVL`, `HRO`, etc.); `I` in the lower row no longer prevents the guard.

## Geometry

For 8-slot H/E/Saison cases, the top row keeps the right edge at at least 8 mm. The authority-to-HU gap may use 4 mm, while text-to-authority remains in the 5–20 mm corridor.

The separate 9-slot season tight case from b206 remains active and may use a right edge of at least 6 mm.

## Regression

Adds `HVL DI9E` + Saison as an explicit lower-I 8-slot case.
