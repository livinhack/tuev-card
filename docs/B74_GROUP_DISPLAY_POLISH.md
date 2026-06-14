# b74 – Group display overrides polish

This version polishes the group-specific display override work from b72/b73.

## Scope

- No runtime layout changes.
- No new display options.
- No changes to the stamp confirm flow.
- No changes to the EuroPlate rule.

## Cleanup

- Removed the old inline group display panel renderer that was left behind after the display controls moved into floating eye-badge popovers.
- Kept the floating-panel implementation as the single editor UI path for group display overrides.
- Fixed historical documentation headings that had been accidentally bumped by broad version replacements.
- Updated README wording so the visual editor and group configuration describe the eye-badge workflow.

## Confirmed model

Global display settings remain the default.

Groups may optionally override individual display values:

```yaml
groups:
  - id: daily
    title: Alltag
    display:
      columns: "2"
      show_badge: false
      show_details: true
```

Only values present in `group.display` override the global card setting.

`plate_style` remains global for now because graphical plates depend on the EuroPlate availability check.
