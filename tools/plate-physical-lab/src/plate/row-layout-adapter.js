// Kennzeichen Physical Lab b234 / common row layout adapter.
//
// This module keeps the small, repeatable bridge between solver row items and
// renderable positioned row items in one place. Solvers decide widths and
// format-specific modules provide legal ranges; this adapter only applies a
// solved width map, advances the x cursor and attaches row metadata.

export function resolveSolvedItemWidth(item, widths = {}) {
  if (widths?.itemWidths?.has?.(item.key)) return widths.itemWidths.get(item.key);
  if (item.type === "char-gap" && widths.charGap != null) return widths.charGap;
  if (item.type === "group-gap" && widths.groupGap != null) return widths.groupGap;
  if (item.type === "seal-gap" && widths.sealGap != null) return widths.sealGap;
  if (item.type === "season-gap" && widths.seasonGap != null) return widths.seasonGap;
  return item.width;
}

export function positionRowItems(sequence, { startX, widths = {}, rowKey = null, band = null, contentLimits = null } = {}) {
  let cursor = Number(startX) || 0;
  return sequence.map((item) => {
    const width = resolveSolvedItemWidth(item, widths);
    const positioned = {
      ...item,
      width,
      x: cursor
    };
    cursor += width;
    return attachRowMetadataToItem(positioned, { rowKey, band, contentLimits });
  });
}

export function attachRowMetadata(items, { rowKey, band, contentLimits } = {}) {
  return items.map((item) => attachRowMetadataToItem(item, { rowKey, band, contentLimits }));
}

function attachRowMetadataToItem(item, { rowKey, band, contentLimits } = {}) {
  const hasRowMetadata = rowKey != null || band != null || contentLimits != null;
  if (!hasRowMetadata) return item;
  const explicitBandY = Number(item?.bandY);
  const explicitBandHeight = Number(item?.bandHeight);
  return {
    ...item,
    rowKey: rowKey ?? item.rowKey ?? null,
    bandY: Number.isFinite(explicitBandY) ? explicitBandY : band?.y ?? item.bandY ?? null,
    bandHeight: Number.isFinite(explicitBandHeight) ? explicitBandHeight : band?.height ?? item.bandHeight ?? null,
    baselineY: item.type === "char" ? band?.baselineY ?? item.baselineY ?? null : null,
    contentLimits: contentLimits ?? item.contentLimits ?? null
  };
}
