# b205 – Reduced vertical preferred spacing

This step adjusts only the Reduced standard vertical-seal spacing distribution.

## Why

The first Reduced visual test group showed that `HVL D191` was technically valid in b204, but internally over-expanded:

- top used large inner/text-to-seal values, e.g. about `11 / 10 / 10 / 20 / 8`
- bottom used `8 / 18 / 10 / 10 / 15 / 8`

The whole text/seal block could sit calmer if the inner gaps stayed closer to preferred values and the remaining space was handled by the row edges.

## Change

For Reduced standard vertical layouts only:

- use preferred internal spacing before growing to maxima
- character gap prefers `9 mm` within the legal `8–10 mm` range
- lower group gap prefers `15 mm` within the legal `15–18 mm` range
- text/seal gap prefers `15 mm` inside the `5–20 mm` corridor
- derive the shared vertical seal X-axis from this preferred bottom-row solution

Upper side-by-side seal templates and H/E/Saison switching are unchanged.
