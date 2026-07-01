# b280 – Exact Item Type Count Helper Cleanup

Full/Handover update for the synchronized Lab b280 mirror. Card runtime code is unchanged.

## Lab change

The authoritative Lab extracted only an exact count formula:

- `countItemsOfType(items, type)` in `src/plate/plate-sequence-width-utils.js`
- replaces `items.filter((item) => item.type === type).length`

## Checks

- Lab Regression: 41/41 OK
- b279 → b280 model hashes: 41/41 identical
- b279 → b280 SVG hashes: 41/41 identical
- Full/Card Check: passed

## Mirror note

`tools/plate-physical-lab/` is synchronized to b280 for handover convenience. The separate Lab ZIP remains authoritative.
