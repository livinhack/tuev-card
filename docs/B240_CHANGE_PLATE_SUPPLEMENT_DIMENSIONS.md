# b240 – Change Plate Supplement Dimensions

Basis: `tuev-card-full-b239-change-plate-hu-full-size-fix-handover.zip` plus authoritative Lab `plate-physical-lab-b239-change-plate-hu-full-size-fix.zip`.

## Project split

The separate Lab ZIP remains the authoritative renderer validation project. Card code was not changed in b240. `tools/plate-physical-lab/` inside the Full ZIP is intentionally frozen/non-authoritative and was not synchronised as the working Lab source.

## Change in authoritative Lab

The vehicle-specific Wechselkennzeichen supplement was corrected according to the latest user measurements:

- supplement field width including frame: 60 mm
- HU sticker remains 35 mm and sits higher at center Y 26.5 mm
- vehicle glyph target height: 32–37 mm
- digit target width: 18.5 mm within the 17–20 mm allowed range
- H/E target width: 14 mm

Implemented in Lab file `src/plate/change-plate.js`; not integrated into Card yet.

## Validation

- Lab regression: 41/41 OK
- b239 → b240 with disabled Wechselkennzeichen: model hashes 41/41 identical
- b239 → b240 with disabled Wechselkennzeichen: SVG hashes 41/41 identical
- Full/Card check passed
