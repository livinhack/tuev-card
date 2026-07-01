# b237 – Formula Width Helpers Cleanup

Base: `b236-spacing-surface-result-helper-cleanup`

## Goal

Reduce repeated code without changing renderer behaviour.

This change centralises only identical formulas:

- sum widths by a provided getter
- create a width map by a provided getter

The caller still provides the getter. Therefore all top-row, bottom-row and one-line-season rules remain where they were.

## Changed file

- `src/plate/plate-svg-renderer.js`

## Added helpers

```js
function sumItemWidths(items, getWidth) {
  return items.reduce((sum, item) => sum + getWidth(item), 0);
}

function createItemWidthMap(items, getWidth) {
  return new Map(items.map((item) => [item.key, getWidth(item)]));
}
```

## Safety boundary

This is not a solver abstraction. It only removes formula duplication.

Not changed:

- geometry
- width bands
- spacing rules
- Reduced tight cases
- H/E handling
- season handling
- row adapter
- Card code

## Checks

- `npm run check:regression` → `41/41 cases OK`
- b236 vs b237 model hashes: `41/41 identical`
- b236 vs b237 SVG hashes: `41/41 identical`
