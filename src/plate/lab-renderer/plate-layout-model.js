// Kennzeichen Physical Lab b225 / solved plate layout model helpers
// Centralises the model shape consumed by rendering, debug and metrics layers.
// This helper must not solve or mutate geometry; it only groups already-solved mm data.

export function createPlateModel({ parsed, rules, font, content, metrics, layout = null, season = null }) {
  const rows = buildSolvedRows(layout, content);
  const groupedContent = groupContentByType(content);
  return {
    parsed,
    rules,
    font,
    content,
    metrics,
    layout,
    season,
    rows,
    groupedContent,
    seals: groupedContent.seals,
    seasonField: groupedContent.seasonFields[0] || layout?.seasonField || null,
    debug: {
      rowDiagnostics: metrics?.rowDiagnostics || layout?.rowDiagnostics || [],
      spacingItems: groupedContent.spacing,
      margins: {
        left: metrics?.remainingLeft ?? null,
        right: metrics?.remainingRight ?? null,
        top: metrics?.topRowMargins || null,
        bottom: metrics?.bottomRowMargins || null
      }
    }
  };
}

function buildSolvedRows(layout, content) {
  if (layout?.top || layout?.bottom) {
    return {
      top: createSolvedRow("top", layout.top, content),
      bottom: createSolvedRow("bottom", layout.bottom, content)
    };
  }
  return {
    main: createSolvedRow("main", layout, content)
  };
}

function createSolvedRow(key, rowLayout, allContent) {
  const positionedContent = rowLayout?.positionedContent || allContent.filter((item) => !item.row || item.row === key);
  return {
    key,
    fits: rowLayout?.fits ?? null,
    renderable: rowLayout?.renderable ?? null,
    contentLimits: rowLayout?.contentLimits || null,
    contentWidth: rowLayout?.contentWidth ?? null,
    sideMarginLeft: rowLayout?.sideMarginLeft ?? null,
    sideMarginRight: rowLayout?.sideMarginRight ?? null,
    actualCharGap: rowLayout?.actualCharGap ?? null,
    actualGroupGap: rowLayout?.actualGroupGap ?? null,
    actualSeasonGap: rowLayout?.actualSeasonGap ?? null,
    actualTopSealGap: rowLayout?.actualTopSealGap ?? null,
    actualUpperSealPairGap: rowLayout?.actualUpperSealPairGap ?? null,
    positionedContent
  };
}

function groupContentByType(content = []) {
  return content.reduce((groups, item) => {
    if (item?.type === "char") groups.chars.push(item);
    else if (item?.type === "seals") groups.seals.push(item);
    else if (item?.type === "season-field") groups.seasonFields.push(item);
    else if (isSpacingItem(item)) groups.spacing.push(item);
    else groups.other.push(item);
    return groups;
  }, { chars: [], seals: [], seasonFields: [], spacing: [], other: [] });
}

function isSpacingItem(item) {
  return item?.type === "char-gap"
    || item?.type === "group-gap"
    || item?.type === "seal-gap"
    || item?.type === "season-gap"
    || item?.type === "variable-gap";
}
