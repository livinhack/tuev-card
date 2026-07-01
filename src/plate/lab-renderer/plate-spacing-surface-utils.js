// Kennzeichen Physical Lab b272 / shared spacing-surface utilities
// Formula-only helpers for water-filling spacing surfaces.

export function createSpacingSurfaces(spacingItems, sideMin, { getMinWidth, getMaxWidth }) {
  return [
    { key: "__left_margin", min: sideMin, max: Number.POSITIVE_INFINITY, width: sideMin },
    ...spacingItems.map((item) => {
      const min = getMinWidth(item);
      return {
        key: item.key,
        min,
        max: getMaxWidth(item),
        width: min,
        type: item.type
      };
    }),
    { key: "__right_margin", min: sideMin, max: Number.POSITIVE_INFINITY, width: sideMin }
  ];
}

export function waterFillSpacingSurfaces(surfaces, targetWidth) {
  const minTotal = surfaces.reduce((sum, item) => sum + item.min, 0);
  let remaining = Math.max(0, targetWidth - minTotal);

  while (remaining > 0.0001) {
    const active = surfaces.filter((item) => item.width < item.max - 0.0001);
    if (!active.length) break;
    const equalStep = remaining / active.length;
    let consumed = 0;
    for (const item of active) {
      const cap = item.max - item.width;
      const applied = Math.min(equalStep, cap);
      item.width += applied;
      consumed += applied;
    }
    if (consumed <= 0.0001) break;
    remaining -= consumed;
  }

  return { minTotal, surplus: Math.max(0, targetWidth - minTotal) };
}

export function spacingSurfaceResult(surfaces, sideMin, reason) {
  const widths = new Map();
  for (const surface of surfaces) {
    if (surface.key !== "__left_margin" && surface.key !== "__right_margin") widths.set(surface.key, surface.width);
  }
  return {
    leftMargin: surfaces.find((item) => item.key === "__left_margin")?.width ?? sideMin,
    rightMargin: surfaces.find((item) => item.key === "__right_margin")?.width ?? sideMin,
    widths,
    reason
  };
}
