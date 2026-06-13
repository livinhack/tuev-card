# b73 display eye badge editor

`b73` moves display settings into the same visual control area as sorting.

## Goal

Keep the editor more consistent between ungrouped vehicles and groups:

- Ungrouped vehicles now use a round eye badge next to the sort badges.
- Groups now use a round eye badge at the start of the second header row, next to the sort badges.
- Group headers keep the two-line layout:
  - first row: group title, move buttons, delete button
  - second row: vehicle count/color, display eye, sort controls

## Behavior

Global/ungrouped display eye:

- Opens the global display popover.
- Contains the global display options such as columns, badge visibility, details, and graphical plates when available.

Group display eye:

- Opens the group-specific display popover.
- Allows enabling/disabling custom display settings for the group.
- When enabled, the group can override columns, badge visibility, and details.
- A group with custom display settings is visually indicated by the active eye badge.

## Removed/changed editor structure

- The standalone global `Darstellung` pill below the entity section is no longer rendered.
- The inline group display panel is no longer rendered inside each group card.
- Display configuration is now opened through the same floating-panel pattern as color and sort controls.

## Not changed

- Runtime display override behavior from b72 remains unchanged.
- `plate_style` is still not group-specific.
- EuroPlate rule remains unchanged.
- Stamp confirm behavior remains unchanged.
- HACS/root bundle naming remains unchanged.
