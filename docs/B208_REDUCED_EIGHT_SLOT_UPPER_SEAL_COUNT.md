# b208 – Reduced 8-slot upper-seal counting

This Full handover documents the separate Physical Lab b208. Card code was not changed.

## Lab change

Reduced two-line H/E/Saison upper side-by-side seal edge cases now count the complete occupied chain:

- district letters
- recognition letters/digits
- final H/E suffix
- season field as one occupied block

`HVL DI9E` + Saison is therefore an 8-slot case (`3 + 4 + 1`) even though the lower row contains `I`.

For these 8-slot cases the top right edge stays at least 8 mm. `authority → HU` may use 4 mm; `text → authority` remains in 5–20 mm.

The 9-slot season border case remains separate and may use right >=6 mm.

## Full/Card status

No Card renderer integration. `tools/plate-physical-lab/` in the Full ZIP is intentionally not synchronized/frozen. The separate Lab ZIP is authoritative.
