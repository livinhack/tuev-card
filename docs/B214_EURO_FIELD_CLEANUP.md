# b214 – Euro field cleanup

b214 is a Lab-only cleanup after the b213 checkpoint.

## Scope

- No Card renderer code was changed.
- The separate Lab ZIP is authoritative.
- `tools/plate-physical-lab/` remains intentionally unsynchronised / frozen in the Full ZIP.

## Lab changes

- `src/plate/euro-field.js` becomes the single Euro-field component entry point.
- The Lab main renderer imports Euro-field helpers only through that entry point.
- The old local star-wreath compatibility helper was removed from the Lab main renderer.
- Star wreath and country mark geometries remain dedicated Lab components.

## Geometry status

No solved geometry changed versus b213.

- Nr. 1 / Nr. 2 / Nr. 2a / Nr. 2c Euro fields: `a = 30 mm`, star size `5 mm`, D height `20 mm`.
- Reduced Euro field: `a = 22.5 mm`, star size `3.75 mm`, D height `15 mm`.
- Reduced width/seal/H/E/Saison/8-slot/9-slot logic unchanged.
