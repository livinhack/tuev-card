# b248 – Change Plate Motorcycle W Center + Random Presets

Base: b247.

## Changes

- Centers the Kraftrad Wechselkennzeichen `W` text in the 35 mm HU/W seal slot using the physical slot center instead of a baseline offset.
- Adds Lab-only Wechselkennzeichen random preset buttons for one-line, two-line and motorcycle variants, with and without H/E vehicle-specific parts.
- Keeps the split Lab inputs from b244: common part and vehicle-specific part remain separate.
- Reduced Wechselkennzeichen remains disabled.

## Safety

Existing non-Wechselkennzeichen renderers are not changed. The normal renderer paths remain original; the b248 changes are limited to the Wechselkennzeichen branch and Lab UI helpers.
