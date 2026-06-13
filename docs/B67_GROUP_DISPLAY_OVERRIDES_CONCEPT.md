# b69 group display overrides concept

`b69` is a concept/data-model checkpoint for a later group-specific display feature.
It does not implement runtime behavior yet.

## Goal

The card already has global display options such as:

- `columns`
- `show_details`
- `show_badge`
- `plate_style`

A later feature may allow individual groups to override selected display options while keeping the global card settings as the default.

## Design decision

Group-specific display settings should be optional overrides, not full copies of the global display config.

That means:

- Global display settings remain the default.
- Each group may override only the values that are intentionally different.
- Missing group values inherit the global card setting.
- Existing card configs stay compatible.

## Proposed YAML shape

```yaml
type: custom:tuev-card
columns: auto
show_details: true
show_badge: true
plate_style: plate

groups:
  - id: daily
    title: Alltag
    color: "#42a5f5"
    display:
      columns: "2"
      show_badge: false
    entities:
      - sensor.focus_rs_tuv
      - sensor.dacia_duster_tuv

  - id: classic
    title: Oldtimer
    color: "#66bb6a"
    display:
      show_details: true
      show_badge: true
    entities:
      - sensor.porsche_911_tuv
```

## Inheritance model

For each group, the effective display settings are resolved like this:

```text
effective.columns      = group.display.columns      ?? card.columns
effective.show_details = group.display.show_details ?? card.show_details
effective.show_badge   = group.display.show_badge   ?? card.show_badge
effective.plate_style  = group.display.plate_style  ?? card.plate_style
```

## Editor model

The editor should avoid showing all display options inside every group by default.

Recommended UI:

```text
Group card
└─ Display
   ├─ Use global display settings
   └─ Use custom display settings
      ├─ Columns
      ├─ Show details
      ├─ Show TÜV badge
      └─ Render graphical plate
```

A group should only write a `display` object when at least one override differs from the global setting.

## Scope for first implementation

Recommended first implementation:

- `show_badge`
- `show_details`
- `columns`

Recommended to postpone:

- `plate_style`, because it depends on the global EuroPlate availability rule and can make the editor more complex.

## Not in scope

This concept does not include:

- group-specific stamp styling
- group-specific colors beyond the existing group accent color
- group-specific sorting changes
- group layouts side-by-side
- compact mode

## Risks

- Editor can become too busy if every group shows all display controls.
- Group overrides can confuse users if inheritance is not visible.
- YAML should stay compact and readable.

## Recommendation

Implement later as a deliberate feature block, not as part of the current release cleanup.
Start with the data model and inherited effective config helper, then add editor controls after the rendering path is stable.
