// Kennzeichen Physical Lab b309 / reduced two-line row-chain solver
// Pure mm row-chain solver for the Reduced/verkürztes zweizeiliges template.
// The renderer owns the legal constants and row item construction; this module
// only supplies Reduced-specific ranges/templates and delegates generic chain
// mechanics to chain-solver.js.

import { createGenericChainSolver, distributeRemainingToUnboundedItems } from "./chain-solver.js";
import { countItemsOfType, createRangeMinWidthMap, getFirstItemOfType, getItemsOfType, sumItemWidthsWhere, sumResolvedOrRangeMinWidths, sumVariableRangeMinWidths } from "./plate-sequence-width-utils.js";

export function createReducedRowChainSolver({
  spacingRules,
  getOutsideMarginMinLeft,
  getOutsideMarginMinRight,
  average,
  positionSequence
}) {
  if (!spacingRules || !getOutsideMarginMinLeft || !getOutsideMarginMinRight || !average || !positionSequence) {
    throw new Error("createReducedRowChainSolver requires spacing rules, margin helpers, average and positionSequence");
  }

  function getVariableRangeForItem(item) {
    if (item.type === "char-gap") return spacingRules.charGap;
    if (item.type === "group-gap") return spacingRules.reducedRecognitionGroupGap;
    if (item.type === "seal-gap" || item.type === "season-gap") {
      return {
        min: item.minWidth ?? spacingRules.reducedTopSealGap.min,
        preferred: item.preferredWidth ?? spacingRules.reducedTopSealGap.preferred,
        max: item.maxWidth ?? spacingRules.reducedTopSealGap.max
      };
    }
    return null;
  }

  const {
    getChainStats: getRowChainStats,
    makeChainSolution: makeRowSolution,
    growFiniteVariables,
    growVariablesTowardPreferred
  } = createGenericChainSolver({
    getVariableRangeForItem,
    average,
    defaultGaps: {
      charGap: spacingRules.charGap.min,
      groupGap: spacingRules.reducedRecognitionGroupGap.min,
      sealGap: spacingRules.reducedTopSealGap.min,
      seasonGap: null
    }
  });

  function growVariableItemsByTypeOrder(itemWidths, variableItems, types, grow, remaining) {
    let nextRemaining = remaining;
    for (const type of types) {
      nextRemaining = grow(itemWidths, getItemsOfType(variableItems, type), nextRemaining);
    }
    return nextRemaining;
  }

  function distributeRemainingToSideMargins(sideMinLeft, sideMinRight, remaining) {
    const extraMargin = Math.max(0, remaining) / 2;
    return {
      sideMarginLeft: sideMinLeft + extraMargin,
      sideMarginRight: sideMinRight + extraMargin
    };
  }

  function solveRowChain(sequence, contentLimits, rules) {
    const sideMinLeft = getOutsideMarginMinLeft(rules, contentLimits);
    const sideMinRight = getOutsideMarginMinRight(rules, contentLimits);
    const stats = getRowChainStats(sequence);
    const minNeededWidth = stats.minContentWidth + sideMinLeft + sideMinRight;
    const availableWidth = contentLimits.width;
    const fits = availableWidth + 0.0001 >= minNeededWidth;
    let remaining = Math.max(0, availableWidth - minNeededWidth);
    const variableItems = stats.variableItems || [];
    const itemWidths = createRangeMinWidthMap(variableItems, getVariableRangeForItem);

    remaining = growVariableItemsByTypeOrder(itemWidths, variableItems, ["char-gap", "group-gap", "seal-gap"], growFiniteVariables, remaining);

    remaining = distributeRemainingToUnboundedItems({
      itemWidths,
      items: variableItems,
      getVariableRangeForItem,
      remaining,
      outsideSurfaceCount: 2
    });

    const { sideMarginLeft, sideMarginRight } = distributeRemainingToSideMargins(sideMinLeft, sideMinRight, remaining);

    return makeRowSolution({
      fits,
      availableWidth,
      minNeededWidth,
      fixedWidth: stats.fixedWidth,
      minContentWidth: stats.minContentWidth,
      stats,
      variableItems,
      itemWidths,
      sideMarginLeft,
      sideMarginRight,
      sideMargin: (sideMarginLeft + sideMarginRight) / 2
    });
  }

  function solveRowChainPreferredInternalSpacing(sequence, contentLimits, rules) {
    const sideMinLeft = getOutsideMarginMinLeft(rules, contentLimits);
    const sideMinRight = getOutsideMarginMinRight(rules, contentLimits);
    const stats = getRowChainStats(sequence);
    const minNeededWidth = stats.minContentWidth + sideMinLeft + sideMinRight;
    const availableWidth = contentLimits.width;
    const fits = availableWidth + 0.0001 >= minNeededWidth;
    let remaining = Math.max(0, availableWidth - minNeededWidth);
    const variableItems = stats.variableItems || [];
    const itemWidths = createRangeMinWidthMap(variableItems, getVariableRangeForItem);

    remaining = growVariableItemsByTypeOrder(itemWidths, variableItems, ["char-gap", "group-gap", "seal-gap", "season-gap"], growVariablesTowardPreferred, remaining);

    const { sideMarginLeft, sideMarginRight } = distributeRemainingToSideMargins(sideMinLeft, sideMinRight, remaining);

    return makeRowSolution({
      fits,
      availableWidth,
      minNeededWidth,
      fixedWidth: stats.fixedWidth,
      minContentWidth: stats.minContentWidth,
      stats,
      variableItems,
      itemWidths,
      sideMarginLeft,
      sideMarginRight,
      sideMargin: (sideMarginLeft + sideMarginRight) / 2,
      extra: { preferredInternalSpacing: true }
    });
  }

  function getPreSealStats(sequence) {
    const sealIndex = sequence.findIndex((item) => item.type === "seals");
    const prefix = sealIndex >= 0 ? sequence.slice(0, sealIndex) : sequence;
    const seal = sealIndex >= 0 ? sequence[sealIndex] : null;
    const fixedWidth = sumItemWidthsWhere(prefix, (item) => item.type === "char" || item.type === "season-field");
    const variableItems = prefix.filter((item) => Boolean(getVariableRangeForItem(item)));
    const charGapCount = countItemsOfType(prefix, "char-gap");
    const groupGapCount = countItemsOfType(prefix, "group-gap");
    const sealGapCount = countItemsOfType(prefix, "seal-gap");
    const seasonGapCount = countItemsOfType(prefix, "season-gap");
    const minGapWidth = sumVariableRangeMinWidths(variableItems, getVariableRangeForItem);
    return {
      prefix,
      seal,
      fixedWidth,
      variableItems,
      charGapCount,
      groupGapCount,
      sealGapCount,
      seasonGapCount,
      minGapWidth,
      minPrefixWidth: fixedWidth + minGapWidth,
      sealWidth: Number(seal?.width) || 0
    };
  }

  function getMinimumSealX(sequence, contentLimits, rules) {
    const sideMinLeft = getOutsideMarginMinLeft(rules, contentLimits);
    const stats = getPreSealStats(sequence);
    return contentLimits.left + sideMinLeft + stats.minPrefixWidth;
  }

  function getFixedSealMaxX(sequence, contentLimits, rules) {
    const sideMinRight = getOutsideMarginMinRight(rules, contentLimits);
    const stats = getPreSealStats(sequence);
    return contentLimits.right - sideMinRight - stats.sealWidth;
  }

  function solveRowChainBeforeFixedSeal(sequence, contentLimits, rules, fixedSealX, options = {}) {
    const sideMinLeft = getOutsideMarginMinLeft(rules, contentLimits);
    const sideMinRight = getOutsideMarginMinRight(rules, contentLimits);
    const stats = getPreSealStats(sequence);
    const availableBeforeSeal = fixedSealX - contentLimits.left;
    const rightMargin = contentLimits.right - fixedSealX - stats.sealWidth;
    let remaining = Math.max(0, availableBeforeSeal - sideMinLeft - stats.minPrefixWidth);
    const variableItems = stats.variableItems || [];
    const itemWidths = createRangeMinWidthMap(variableItems, getVariableRangeForItem);

    if (options.spacingMode === "preferred-internal") {
      remaining = growVariableItemsByTypeOrder(itemWidths, variableItems, ["char-gap", "group-gap", "seal-gap", "season-gap"], growVariablesTowardPreferred, remaining);
    } else {
      remaining = growVariableItemsByTypeOrder(itemWidths, variableItems, ["char-gap", "group-gap", "seal-gap"], growFiniteVariables, remaining);

      remaining = distributeRemainingToUnboundedItems({
        itemWidths,
        items: variableItems,
        getVariableRangeForItem,
        remaining,
        outsideSurfaceCount: 1
      });
    }

    const prefixWidth = stats.fixedWidth + sumResolvedOrRangeMinWidths(variableItems, itemWidths, getVariableRangeForItem);
    const sideMarginLeft = fixedSealX - contentLimits.left - prefixWidth;
    const sideMarginRight = rightMargin;
    const fits = sideMarginLeft + 0.0001 >= sideMinLeft && sideMarginRight + 0.0001 >= sideMinRight;

    return makeRowSolution({
      fits,
      availableWidth: contentLimits.width,
      minNeededWidth: stats.minPrefixWidth + stats.sealWidth + sideMinLeft + sideMinRight,
      fixedWidth: stats.fixedWidth + stats.sealWidth,
      minContentWidth: stats.minPrefixWidth + stats.sealWidth,
      stats,
      variableItems,
      itemWidths,
      sideMarginLeft,
      sideMarginRight,
      extra: {
        availableBeforeSeal,
        fixedSealX,
        preferredInternalSpacing: options.spacingMode === "preferred-internal"
      }
    });
  }

  function solveVerticalSharedSealRows({ rules, topSequence, bottomSequence, topLimits, bottomLimits }) {
    const bottomInitial = solveRowChainPreferredInternalSpacing(bottomSequence, bottomLimits, rules);
    const bottomInitialItems = positionSequence(
      bottomSequence,
      bottomLimits.left + bottomInitial.sideMarginLeft,
      "bottom",
      rules,
      bottomLimits,
      null,
      { charGap: bottomInitial.charGap, groupGap: bottomInitial.groupGap, sealGap: bottomInitial.sealGap, seasonGap: bottomInitial.seasonGap, itemWidths: bottomInitial.itemWidths }
    );
    const bottomInitialSeal = getFirstItemOfType(bottomInitialItems, "seals");
    const topMinSealX = getMinimumSealX(topSequence, topLimits, rules);
    const bottomMinSealX = getMinimumSealX(bottomSequence, bottomLimits, rules);
    const maxSealX = Math.min(
      getFixedSealMaxX(topSequence, topLimits, rules),
      getFixedSealMaxX(bottomSequence, bottomLimits, rules)
    );
    const preferredSealX = Number(bottomInitialSeal?.x);
    const sharedSealX = Math.max(
      Number.isFinite(preferredSealX) ? preferredSealX : bottomMinSealX,
      topMinSealX,
      bottomMinSealX
    );
    const fixedSealX = Math.min(sharedSealX, maxSealX);
    const top = solveRowChainBeforeFixedSeal(topSequence, topLimits, rules, fixedSealX, { spacingMode: "preferred-internal" });
    const bottom = solveRowChainBeforeFixedSeal(bottomSequence, bottomLimits, rules, fixedSealX, { spacingMode: "preferred-internal" });
    return {
      top,
      bottom,
      fixedSealX,
      maxSealX,
      topMinSealX,
      bottomMinSealX,
      fits: top.fits && bottom.fits,
      preferredInternalSpacing: true
    };
  }

  function getCriticalRowMinWidth(sequence, rules, contentLimits = null) {
    const sideMinLeft = getOutsideMarginMinLeft(rules, contentLimits);
    const sideMinRight = getOutsideMarginMinRight(rules, contentLimits);
    const stats = getRowChainStats(sequence);
    return stats.minContentWidth + sideMinLeft + sideMinRight;
  }

  return {
    getReducedRowChainStats: getRowChainStats,
    solveReducedRowChain: solveRowChain,
    solveReducedRowChainPreferredInternalSpacing: solveRowChainPreferredInternalSpacing,
    getReducedMinimumSealX: getMinimumSealX,
    getReducedFixedSealMaxX: getFixedSealMaxX,
    solveReducedRowChainBeforeFixedSeal: solveRowChainBeforeFixedSeal,
    solveReducedVerticalSharedSealRows: solveVerticalSharedSealRows,
    solveReducedTextChain: solveRowChain,
    getReducedCriticalRowMinWidth: getCriticalRowMinWidth
  };
}
