# b75 - Groups side by side and single-column scaling check

## Scope

This update adds an optional, controlled group layout mode and slightly improves badge scaling in single-column/narrow layouts.

## Groups side by side

A new card option is available:

```yaml
groups_layout: auto
```

Default remains:

```yaml
groups_layout: stacked
```

When `groups_layout: auto` is enabled, the card may place small groups next to each other. This is intentionally limited:

- only named groups are considered
- ungrouped vehicles remain separate
- only groups with at most 2 vehicles are eligible
- larger groups remain stacked
- if there is not enough width, groups remain stacked

This avoids a general masonry layout and keeps the result predictable.

## Single-column scaling

Single-column badge sizing now also considers the available tile width instead of always using a fixed maximum size. Wide single cards still use the full large badge, while narrow single-column containers can scale down safely.

## Not changed

- Stamp confirm behavior
- EuroPlate rule
- Plate renderer
- Group sorting
- Group display overrides
