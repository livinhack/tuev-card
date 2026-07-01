// Kennzeichen Physical Lab b281 / generic row-chain solver primitives.
//
// This module contains format-neutral helpers for CAD-like horizontal row
// chains. Format-specific modules still provide their legal item ranges and
// template rules; these helpers only count fixed widths, initialise/grow
// variable surfaces and assemble common solution diagnostics.

import { countItemsOfType, getItemsOfType, sumItemWidthsWhere, sumResolvedOrRangeMinWidths, sumVariableRangeMinWidths } from "./plate-sequence-width-utils.js";

export function createGenericChainSolver({ getVariableRangeForItem, average, defaultGaps = {} }) {
  if (!getVariableRangeForItem || !average) {
    throw new Error("createGenericChainSolver requires getVariableRangeForItem and average");
  }

  function getChainStats(sequence, options = {}) {
    const fixedTypes = options.fixedTypes || ["char", "seals", "season-field"];
    const gapTypes = options.gapTypes || ["char-gap", "group-gap", "seal-gap", "season-gap"];
    const minContentWidthKey = options.minContentWidthKey || "minContentWidth";
    const fixedWidth = sumItemWidthsWhere(sequence, (item) => fixedTypes.includes(item.type));
    const variableItems = sequence.filter((item) => Boolean(getVariableRangeForItem(item)));
    const counts = Object.fromEntries(gapTypes.map((type) => [toCountKey(type), countItemsOfType(sequence, type)]));
    const minGapWidth = sumVariableRangeMinWidths(variableItems, getVariableRangeForItem);
    return {
      fixedWidth,
      variableItems,
      ...counts,
      minGapWidth,
      [minContentWidthKey]: fixedWidth + minGapWidth
    };
  }

  function makeChainSolution({
    fits,
    availableWidth,
    minNeededWidth,
    fixedWidth,
    minContentWidth,
    stats,
    variableItems,
    itemWidths,
    sideMarginLeft,
    sideMarginRight,
    sideMargin = null,
    extra = {}
  }) {
    const contentWidth = fixedWidth + sumResolvedOrRangeMinWidths(variableItems, itemWidths, getVariableRangeForItem);
    const typedGapAverage = (type, fallback) => {
      const values = getItemsOfType(variableItems, type).map((item) => itemWidths.get(item.key));
      return average(values) ?? fallback;
    };

    return {
      fits,
      availableWidth,
      minNeededWidth,
      contentWidth,
      fixedWidth,
      minContentWidth,
      charGapCount: stats.charGapCount || 0,
      groupGapCount: stats.groupGapCount || 0,
      sealGapCount: stats.sealGapCount || 0,
      seasonGapCount: stats.seasonGapCount || 0,
      charGap: typedGapAverage("char-gap", defaultGaps.charGap ?? null),
      groupGap: typedGapAverage("group-gap", defaultGaps.groupGap ?? null),
      sealGap: typedGapAverage("seal-gap", defaultGaps.sealGap ?? null),
      seasonGap: typedGapAverage("season-gap", defaultGaps.seasonGap ?? null),
      itemWidths,
      sideMargin,
      sideMarginLeft,
      sideMarginRight,
      ...extra
    };
  }

  function growFiniteVariables(itemWidths, items, remaining) {
    let nextRemaining = remaining;
    if (!items.length || nextRemaining <= 0.0001) return nextRemaining;
    const finiteItems = items.filter((item) => Number.isFinite(getVariableRangeForItem(item)?.max));
    const capacity = finiteItems.reduce((sum, item) => {
      const range = getVariableRangeForItem(item);
      return sum + Math.max(0, range.max - (itemWidths.get(item.key) ?? range.min));
    }, 0);
    const add = Math.min(nextRemaining, capacity);
    if (add > 0.0001 && capacity > 0.0001) {
      let left = add;
      for (const item of finiteItems) {
        const range = getVariableRangeForItem(item);
        const current = itemWidths.get(item.key) ?? range.min;
        const share = capacity > 0 ? add * Math.max(0, range.max - current) / capacity : 0;
        const applied = Math.min(Math.max(0, range.max - current), share);
        itemWidths.set(item.key, current + applied);
        left -= applied;
      }
      nextRemaining -= add - Math.max(0, left);
    }
    return nextRemaining;
  }

  function growVariablesTowardPreferred(itemWidths, items, remaining) {
    let left = remaining;
    for (const item of items) {
      if (left <= 0.0001) break;
      const range = getVariableRangeForItem(item);
      if (!range) continue;
      const current = itemWidths.get(item.key) ?? range.min;
      const target = Number.isFinite(range.preferred) ? Math.min(range.preferred, range.max ?? range.preferred) : current;
      const add = Math.min(Math.max(0, target - current), left);
      if (add > 0.0001) {
        itemWidths.set(item.key, current + add);
        left -= add;
      }
    }
    return left;
  }

  return {
    getChainStats,
    makeChainSolution,
    growFiniteVariables,
    growVariablesTowardPreferred
  };
}

export function distributeRemainingToUnboundedItems({ itemWidths, items, getVariableRangeForItem, remaining, outsideSurfaceCount }) {
  const unboundedItems = items.filter((item) => !Number.isFinite(getVariableRangeForItem(item)?.max));
  const unboundedSurfaceCount = outsideSurfaceCount + unboundedItems.length;
  const unboundedAdd = remaining > 0.0001 ? remaining / unboundedSurfaceCount : 0;
  for (const item of unboundedItems) {
    const range = getVariableRangeForItem(item);
    itemWidths.set(item.key, (itemWidths.get(item.key) ?? range.min) + unboundedAdd);
  }
  return remaining > 0.0001 ? remaining - unboundedAdd * unboundedItems.length : remaining;
}

function toCountKey(type) {
  return `${type.replace(/-([a-z])/g, (_, char) => char.toUpperCase())}Count`;
}
