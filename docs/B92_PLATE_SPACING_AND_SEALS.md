# b92 - Plate spacing and seal geometry

b92 continues the one-line law-based plate renderer from b91. The user confirmed that b91 was visually better, but the character spacing and seal placement/size were still wrong.

## Main corrections

### One-line pattern values

The renderer now applies the key one-line spacing values more explicitly:

```text
outside height:                 110 mm
black rim inside outside size:    4.5 mm
white face height:              101 mm
EU field:                        45 × 98 mm
minimum side gap:                 8 mm
character gap:                  about 8.5 mm
recognition letter/number gap:  about 26 mm
seal zone:                       65.5 mm
HU field:                        35 mm diameter
authority seal placeholder:      45 mm diameter
```

The seal zone is a fixed-width area between the district letters and the recognition number. The smaller HU field is above the larger neutral authority seal placeholder.

### Recognition number split

The recognition part is now split before rendering:

```text
letters + group gap + digits + optional suffix gap + suffix
```

Examples:

```text
CI500   -> CI + 500
GT500   -> GT + 500
DE13H   -> DE + 13 + H
EV204E  -> EV + 204 + E
```

This prevents blocks such as `CI500`, `GT500`, `DE13H` and `EV204E` from being rendered with only normal character spacing between letters and digits.

### EU field and seals

The EU field is now centred as a 45 × 98 mm field within the 110 mm outside height instead of filling the full 101 mm white face.

The neutral authority seal placeholder is now 45 mm, and the HU placeholder is 35 mm. These remain generic placeholders; no real official authority seal artwork is rendered.

## Changed files

- `src/plate/renderer.js`
- `package.json`
- `package-lock.json`
- `dist/tuev-card.js`
- `HANDOVER.md`
- `docs/RELEASE_CHECK.md`

## Test focus

- `DA CI 500` should show clearer spacing between `CI` and `500`.
- `BIT GT500`, `HH EV204E`, `WIL DE13H` should no longer look glued together.
- The two seal placeholders should be much larger and should sit vertically between district letters and recognition number.
- Short plates such as `K S70` and `TR M6` should keep their b91 width/height behaviour.
