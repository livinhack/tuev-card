# b348 – Card Editor Text Preview Scrollbar/Grid Stability

b348 builds on b346 and targets the remaining editor-preview jitter that appears only when **Kennzeichen grafisch darstellen** is disabled.

## Diagnosis

The issue is not a renderer geometry problem and not a checkbox state oscillation. In the Home Assistant card editor preview, text-mode license plates can change the preview height just enough for the surrounding preview scrollbar to appear or disappear. That scrollbar changes the available preview width by roughly one gutter, which can trigger a new preview scale/grid calculation and create a continuous width/height feedback loop.

## Changes

- The scaled editor preview wrapper reserves a stable scrollbar gutter.
- Preview visible width now ignores scrollbar-sized fluctuations.
- Text-plate editor preview height updates use a wider hysteresis tolerance.
- Text-plate editor preview uses a shorter delayed width-refresh train.
- Text license plate fallback has a fixed line box and cannot expand the vehicle tile/grid.

## Non-goals

- No license-plate geometry changes.
- No HU badge changes.
- No sorting changes.
- No Reminder integration.
- No graphical renderer changes.

## Check

The new `check:card-editor-text-preview-scrollbar-stability` script verifies the stabilizing guardrails.
