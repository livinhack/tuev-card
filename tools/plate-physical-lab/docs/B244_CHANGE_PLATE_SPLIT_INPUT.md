# b244 – Change Plate Split Input Lab

b244 keeps the b243 Wechselkennzeichen geometry and changes only the Lab input model.

## Change

- Added separate Lab inputs for Wechselkennzeichen:
  - common plate part (`commonText`)
  - vehicle-specific part (`vehicleText`)
- `changePlate.commonText` and `changePlate.vehicleText` are passed into the renderer.
- The Wechselkennzeichen branch renders the main plate from the common part and the supplement from the vehicle-specific part.
- A backward-compatible fallback still splits the tail of the one-line input for direct API/smoke calls when no split values are supplied.

## Boundaries

- No geometry change.
- b243 Wechselteil dimensions remain unchanged.
- The confirmed b237 one-line original path remains untouched when Wechselkennzeichen is disabled.
- Card code was not changed.

## Checks

- Lab regression: 41/41 cases OK.
- b243 → b244 with `changePlate.enabled === false`: model hashes 41/41 identical.
- b243 → b244 with `changePlate.enabled === false`: SVG hashes 41/41 identical.
- Wechselkennzeichen smoke verified split input does not duplicate the vehicle-specific tail on the main plate.
