# b215 – Seal component cleanup

b215 is a Lab-only cleanup after b214.

## Lab change

- Add `src/plate/seal-components.js`.
- Move generic HU/authority seal geometry resolution into the component.
- Move generic seal SVG rendering into the component.
- Keep layout solving in the Lab renderer.

## Unchanged

- Card renderer code.
- Reduced auto-width and row-chain logic.
- Reduced H/E, Saison and H/E+Saison logic.
- 8-slot and 9-slot rules.
- Euro-field geometry.

## Lab mirror status

`tools/plate-physical-lab/` in the Full ZIP remains intentionally frozen/non-authoritative.
