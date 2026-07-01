# b245 – Change Plate High-Format Supplement Lab

Adds separate Wechselkennzeichen Lab branches for two-line standard and motorcycle plates. Existing renderers remain untouched when the Wechselkennzeichen option is disabled.

## Scope

- one-line keeps the accepted 60 × 110 mm supplement
- two-line and motorcycle get a separate 60 × 200 mm supplement
- Reduced is intentionally not enabled for Wechselkennzeichen
- split input from b244 remains

## Verification

- Regression: 41/41 OK
- Disabled Wechselkennzeichen hashes vs b244: model 41/41, SVG 41/41
