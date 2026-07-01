# b247 – Change Plate Motorcycle Seal Diameter Swap Fix

Fix for the motorcycle Wechselkennzeichen main plate branch.

## Problem

b246 swapped W and authority seal positions for the Kraftrad Wechselkennzeichen branch, but the physical diameter/slot semantics were still wrong.

## Fix

- authority seal remains 45 mm and is placed on the left
- W is placed on the right in the HU-sized 35-mm slot
- existing non-Wechselkennzeichen renderers remain untouched

## Verification

- Lab regression: 41/41 OK
- Disabled Wechselkennzeichen hash comparison against b246: 41/41 model and SVG identical
