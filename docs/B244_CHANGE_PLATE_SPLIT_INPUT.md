# b244 – Change Plate Split Input Lab

b244 is a Lab-only input-model update for the Wechselkennzeichen branch.

The Lab now has separate fields for:

- common plate part
- vehicle-specific part

This prevents duplicate interpretation of the tail character(s) at the plate end. The productive TÜV Reminder integration should later store these vehicle-specific properties on the vehicle entity/integration side; the Card should remain a display layer.

No Card code was changed in b244.

Checks:

- Lab regression: 41/41 cases OK.
- Disabled Wechselkennzeichen output is hash-identical to b243 for all 41 regression cases.
