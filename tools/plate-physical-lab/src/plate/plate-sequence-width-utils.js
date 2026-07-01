// Kennzeichen Physical Lab b304 / generic sequence width helpers.
// Formula-only helpers for variable-width content sequences.

import { formatNumber } from "./plate-number-utils.js";

export function shrinkVariablesToFit(sequence, targetContentWidth) {
  const preferredTotal = sumSequenceWidth(sequence, "preferred");
  const deficit = Math.max(0, preferredTotal - targetContentWidth);
  const variableItems = sequence.filter((item) => isVariableItem(item));
  const totalShrinkCapacity = variableItems.reduce((sum, item) => sum + Math.max(0, getItemPreferredWidth(item) - getItemMinWidth(item)), 0);
  if (!deficit || !totalShrinkCapacity) return sequence.map((item) => ({ ...item, width: getItemPreferredWidth(item) }));
  const ratio = Math.min(1, deficit / totalShrinkCapacity);
  return sequence.map((item) => {
    const preferred = getItemPreferredWidth(item);
    if (!isVariableItem(item)) return { ...item, width: preferred };
    const min = getItemMinWidth(item);
    return { ...item, width: preferred - (preferred - min) * ratio };
  });
}

export function growVariablesToFit(sequence, targetContentWidth) {
  const preferredTotal = sumSequenceWidth(sequence, "preferred");
  const surplus = Math.max(0, targetContentWidth - preferredTotal);
  const variableItems = sequence.filter((item) => isVariableItem(item));
  const totalGrowCapacity = variableItems.reduce((sum, item) => sum + Math.max(0, getItemMaxWidth(item) - getItemPreferredWidth(item)), 0);
  if (!surplus || !totalGrowCapacity) return sequence.map((item) => ({ ...item, width: getItemPreferredWidth(item) }));
  const ratio = Math.min(1, surplus / totalGrowCapacity);
  return sequence.map((item) => {
    const preferred = getItemPreferredWidth(item);
    if (!isVariableItem(item)) return { ...item, width: preferred };
    const max = getItemMaxWidth(item);
    return { ...item, width: preferred + (max - preferred) * ratio };
  });
}

export function sumSequenceWidth(sequence, mode) {
  return sequence.reduce((sum, item) => {
    if (mode === "min") return sum + getItemMinWidth(item);
    if (mode === "max") return sum + getItemMaxWidth(item);
    return sum + getItemPreferredWidth(item);
  }, 0);
}

export function sumItemWidths(items, getWidth) {
  return items.reduce((sum, item) => sum + getWidth(item), 0);
}

export function sumResolvedItemWidths(items) {
  return items.reduce((sum, item) => sum + item.width, 0);
}

export function createItemWidthMap(items, getWidth) {
  return new Map(items.map((item) => [item.key, getWidth(item)]));
}

export function createRangeMinWidthMap(items, getRange) {
  return new Map(items.map((item) => [item.key, getRange(item)?.min ?? 0]));
}

export function sumItemWidthsExcept(items, shouldSkip) {
  return items.reduce((sum, item) => sum + (shouldSkip(item) ? 0 : item.width), 0);
}

export function sumItemWidthsWhere(items, shouldInclude) {
  return items.reduce((sum, item) => sum + (shouldInclude(item) ? (Number(item.width) || 0) : 0), 0);
}

export function getItemsOfType(items, type) {
  return items.filter((item) => item.type === type);
}

export function getFirstItemOfType(items, type) {
  return items.find((item) => item.type === type);
}

export function countItemsOfType(items, type) {
  return getItemsOfType(items, type).length;
}

export function applySharedTypeWidth(item, type, totalWidth, itemCount) {
  if (item.type !== type) return item;
  return { ...item, width: totalWidth / Math.max(1, itemCount) };
}

export function getItemWidthsByType(items, type) {
  return getItemsOfType(items, type).map((item) => item.width);
}

export function isVariableItem(item) {
  return item.variable === true;
}

export function getItemMinWidth(item) {
  return isVariableItem(item) ? item.minWidth : item.width;
}

export function getItemPreferredWidth(item) {
  return isVariableItem(item) ? item.preferredWidth : item.width;
}

export function getItemMaxWidth(item) {
  return isVariableItem(item) ? item.maxWidth : item.width;
}

export function getFixedTypeOrItemMinWidth(item, fixedType, fixedWidth) {
  if (item.type === fixedType) return fixedWidth;
  return getItemMinWidth(item);
}

export function getFixedTypeOrItemPreferredWidth(item, fixedType, fixedWidth) {
  if (item.type === fixedType) return fixedWidth;
  return getItemPreferredWidth(item);
}

export function getFixedTypeOrItemFiniteMaxWidth(item, fixedType, fixedWidth) {
  if (item.type === fixedType) return fixedWidth;
  return getItemMaxWidth(item);
}

export function getFixedTypeOrItemMaxWidth(item, fixedType, fixedMaxWidth) {
  if (item.type === fixedType) return fixedMaxWidth;
  return getItemMaxWidth(item);
}

export function sumValues(values) {
  return values.reduce((sum, value) => sum + value, 0);
}

export function sumVariableRangeMinWidths(items, getRange) {
  return items.reduce((sum, item) => sum + (getRange(item)?.min ?? 0), 0);
}

export function sumResolvedOrRangeMinWidths(items, itemWidths, getRange) {
  return items.reduce((sum, item) => sum + (itemWidths.get(item.key) ?? getRange(item)?.min ?? 0), 0);
}

export function average(values) {
  if (!values.length) return null;
  return sumValues(values) / values.length;
}

export function getVariableRangeLabel(item, fallbackRange) {
  const range = item || fallbackRange;
  if (!range) return null;
  return `${formatNumber(range.minWidth ?? range.min)}-${formatNumber(range.maxWidth ?? range.max)}`;
}

export function minVariableWidth(items) {
  const values = items.map((item) => item.minWidth).filter((value) => Number.isFinite(value));
  return values.length ? Math.min(...values) : null;
}
