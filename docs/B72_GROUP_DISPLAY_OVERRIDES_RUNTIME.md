# b72 – Group display overrides runtime + editor

This version turns the previously documented group display concept into a working first implementation.

## Implemented

Groups can now override selected global display settings via `group.display`.

Supported overrides:

```yaml
groups:
  - id: daily
    title: Alltag
    display:
      columns: "2"
      show_badge: false
      show_details: true
```

The inheritance rule is intentionally simple:

```text
group.display.value ?? card.value
```

Only values present inside `group.display` are stored and applied.

## Editor

Each group now has an optional editor section:

```text
Eigene Darstellung für diese Gruppe
```

When enabled, the group can override:

- Spaltenbegrenzung
- TÜV-Plakette anzeigen
- Details anzeigen

The reset button removes all group display overrides and returns the group to the global card display.

## Not implemented yet

The following display options intentionally remain global for now:

- `plate_style`

Reason: graphical plate display still depends on reachable `EuroPlate.ttf`, so group-level plate rendering should be designed separately.

## Scope

No changes to:

- stamp confirm animation
- EuroPlate detection
- plate renderer
- badge renderer
- group sorting
- HACS/root bundle naming
