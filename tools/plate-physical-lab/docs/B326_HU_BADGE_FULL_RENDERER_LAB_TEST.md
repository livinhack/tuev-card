# b326 – HU Badge Full Renderer Lab Test

Lab-only test for rendering the existing full TÜV badge SVG inside the 35 mm HU seal slot.

## Scope

- Copies the existing badge renderer modules into the standalone Lab under `src/badge/`.
- Adds an opt-in Lab path that scales the full badge SVG into the HU geometry.
- The default renderer path without `huBadgeRenderer: "full"` remains the previous blue placeholder.
- Card integration is intentionally not changed in this step.

## Safety

- No geometry or solver change.
- No Card renderer activation change.
- Regression stays identical because regression cases do not opt into the full HU badge path.
