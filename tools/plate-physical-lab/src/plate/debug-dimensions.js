// Kennzeichen Physical Lab b290 / debug and dimension layer component
// This module renders grid, horizontal diagnostics and measurement overlays.
// It reads already-solved physical mm layout items and must not solve or mutate layout geometry.

import { formatNumber } from "./plate-number-utils.js";
import { escapeSvgAttr as escapeAttr, escapeSvgText as escapeText } from "./svg-escape-utils.js";
import { getEffectiveSealGeometry } from "./seal-geometry-plan.js";
import { getBandForItem, getCharacterBand } from "./text-utils.js";
import { createHorizontalBounds } from "./plate-layout-result-utils.js";

export function renderGrid({ content, rules, metrics }) {
  const parts = content.map((item) => {
    const charBand = getBandForItem(rules, item);
    if (item.type === "char") {
      return `<rect x="${item.x}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="rgba(30,165,255,.08)" stroke="rgba(30,165,255,.55)" stroke-width="0.6"/>`;
    }
    if (item.type === "season-field") {
      const rowHeight = rules.content.season.monthBoxHeight;
      const lowerY = charBand.y + charBand.height - rowHeight;
      return `<rect x="${item.x}" y="${charBand.y}" width="${item.width}" height="${rowHeight}" fill="rgba(30,165,255,.08)" stroke="rgba(30,165,255,.55)" stroke-width="0.6" data-season-box="from"/><rect x="${item.x}" y="${lowerY}" width="${item.width}" height="${rowHeight}" fill="rgba(30,165,255,.08)" stroke="rgba(30,165,255,.55)" stroke-width="0.6" data-season-box="to"/>`;
    }
    if (item.type === "season-gap") {
      return `<rect x="${item.x}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="rgba(255,179,107,.04)" stroke="rgba(255,179,107,.6)" stroke-width="0.35" stroke-dasharray="1.5 1"/>`;
    }
    if (item.type === "seals") {
      const sealGeometry = getEffectiveSealGeometry(rules, item);
      return `
        <rect x="${sealGeometry.outerColumnLeft}" y="${charBand.y}" width="${sealGeometry.outerColumnWidth}" height="${charBand.height}" fill="rgba(255,211,107,.05)" stroke="rgba(255,211,107,.5)" stroke-width="0.6" stroke-dasharray="2 1.5"/>
        <rect x="${sealGeometry.innerColumnLeft}" y="${charBand.y}" width="${sealGeometry.innerColumnWidth}" height="${charBand.height}" fill="rgba(255,211,107,.09)" stroke="rgba(255,211,107,.75)" stroke-width="0.8"/>
        <line x1="${sealGeometry.cx}" y1="${charBand.y - 8}" x2="${sealGeometry.cx}" y2="${charBand.y + charBand.height + 8}" stroke="rgba(255,211,107,.45)" stroke-width="0.5"/>
        <circle cx="${sealGeometry.hu.cx ?? sealGeometry.cx}" cy="${sealGeometry.hu.cy}" r="${sealGeometry.hu.radius}" fill="none" stroke="rgba(255,211,107,.8)" stroke-width="0.65" stroke-dasharray="2 1.5"/>
        <circle cx="${sealGeometry.authority.cx ?? sealGeometry.cx}" cy="${sealGeometry.authority.cy}" r="${sealGeometry.authority.radius}" fill="none" stroke="rgba(255,211,107,.8)" stroke-width="0.65" stroke-dasharray="2 1.5"/>`;
    }
    return `<rect x="${item.x}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="rgba(255,99,99,.07)" stroke="rgba(255,99,99,.4)" stroke-width="0.4"/>`;
  });
  const centerLine = `<line x1="0" y1="${rules.outerHeight / 2}" x2="${metrics.width}" y2="${rules.outerHeight / 2}" stroke="rgba(255,255,255,.35)" stroke-width="0.5" stroke-dasharray="4 3"/>`;
  return `<g class="layer layer-grid">${centerLine}${parts.join("")}</g>`;
}

export function renderHorizontalDiagnostics({ content, rules }) {
  const parts = [];

  for (const item of content) {
    const charBand = getBandForItem(rules, item);
    const yTop = Math.max(0, charBand.y - 6);
    const yBottom = Math.min(rules.outerHeight, charBand.y + charBand.height + 6);
    const labelY = Math.max(6, charBand.y - 2.5);
    const x1 = item.x;
    const x2 = item.x + item.width;
    const cx = x1 + item.width / 2;

    if (item.type === "char") {
      parts.push(`<line x1="${x1}" y1="${yTop}" x2="${x1}" y2="${yBottom}" stroke="rgba(30,165,255,.9)" stroke-width="0.45"/>`);
      parts.push(`<line x1="${x2}" y1="${yTop}" x2="${x2}" y2="${yBottom}" stroke="rgba(30,165,255,.9)" stroke-width="0.45"/>`);
      parts.push(`<line x1="${cx}" y1="${yTop - 2}" x2="${cx}" y2="${yBottom + 2}" stroke="rgba(255,255,255,.7)" stroke-width="0.35" stroke-dasharray="1.5 1"/>`);
      parts.push(`<text x="${cx}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="4.3" fill="#1ea5ff">${escapeText(item.char)} · ${formatMm(item.width)}</text>`);
      continue;
    }

    if (item.type === "seals") {
      const geometry = getEffectiveSealGeometry(rules, item);
      parts.push(`<line x1="${geometry.innerColumnLeft}" y1="${yTop}" x2="${geometry.innerColumnLeft}" y2="${yBottom}" stroke="rgba(255,211,107,.95)" stroke-width="0.55"/>`);
      parts.push(`<line x1="${geometry.innerColumnRight}" y1="${yTop}" x2="${geometry.innerColumnRight}" y2="${yBottom}" stroke="rgba(255,211,107,.95)" stroke-width="0.55"/>`);
      parts.push(`<line x1="${geometry.cx}" y1="${yTop - 3}" x2="${geometry.cx}" y2="${yBottom + 3}" stroke="rgba(255,211,107,.8)" stroke-width="0.4" stroke-dasharray="1.5 1"/>`);
      parts.push(`<text x="${geometry.cx}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="4.3" fill="#ffd36b">${getSealDebugLabel(geometry)}</text>`);
      continue;
    }

    if (item.type === "seal-gap") {
      parts.push(`<rect x="${x1}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="rgba(255,179,107,.05)" stroke="rgba(255,179,107,.75)" stroke-width="0.4" stroke-dasharray="1.5 1"/>`);
      parts.push(`<text x="${cx}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="3.5" fill="#ffb36b">${getSealGapDebugLabel(item)}</text>`);
      continue;
    }

    if (item.type === "season-gap") {
      parts.push(`<rect x="${x1}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="rgba(255,179,107,.04)" stroke="rgba(255,179,107,.75)" stroke-width="0.35" stroke-dasharray="1.5 1"/>`);
      parts.push(`<text x="${cx}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="3.4" fill="#ffb36b">Season gap · ${formatMm(item.width)}</text>`);
      continue;
    }

    if (item.type === "season-field") {
      const rowHeight = rules.content.season.monthBoxHeight;
      const lowerY = charBand.y + charBand.height - rowHeight;
      parts.push(`<rect x="${x1}" y="${charBand.y}" width="${item.width}" height="${rowHeight}" fill="rgba(30,165,255,.07)" stroke="rgba(30,165,255,.85)" stroke-width="0.4"/>`);
      parts.push(`<rect x="${x1}" y="${lowerY}" width="${item.width}" height="${rowHeight}" fill="rgba(30,165,255,.07)" stroke="rgba(30,165,255,.85)" stroke-width="0.4"/>`);
      parts.push(`<text x="${cx}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="3.5" fill="#1ea5ff">Season fields · ${formatMm(item.width)} × ${formatMm(rowHeight)}</text>`);
      continue;
    }

    parts.push(`<rect x="${x1}" y="${charBand.y}" width="${item.width}" height="${charBand.height}" fill="rgba(255,99,99,.03)" stroke="rgba(255,99,99,.55)" stroke-width="0.35" stroke-dasharray="1.5 1"/>`);
    parts.push(`<text x="${cx}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="3.6" fill="#ff7777">${formatMm(item.width)}</text>`);
  }

  return `<g class="layer layer-horizontal-diagnostics">${parts.join("")}</g>`;
}

export function renderDimensions(model) {
  const { metrics, rules } = model;
  const h = rules.outerHeight;
  const w = metrics.width;
  const y = h + rules.dimensions.baselineOffset;
  const localDimensions = renderSolvedSpacingDimensions(model);
  return `
<g class="layer layer-dimensions" font-family="Arial, sans-serif" font-size="5" fill="#333" stroke="#333" stroke-width="0.45">
  <line x1="0" y1="${y}" x2="${w}" y2="${y}"/>
  <line x1="0" y1="${y - 3}" x2="0" y2="${y + 3}"/>
  <line x1="${w}" y1="${y - 3}" x2="${w}" y2="${y + 3}"/>
  <text x="${w / 2}" y="${y + 8}" text-anchor="middle">${w} mm</text>
  <line x1="${w + 14}" y1="0" x2="${w + 14}" y2="${h}"/>
  <line x1="${w + 11}" y1="0" x2="${w + 17}" y2="0"/>
  <line x1="${w + 11}" y1="${h}" x2="${w + 17}" y2="${h}"/>
  <text x="${w + 23}" y="${h / 2}" dominant-baseline="middle">${h} mm</text>
  ${localDimensions}
  ${renderEuroInternalDimensions(model)}
</g>`.trim();
}

function renderSolvedSpacingDimensions({ content, rules, metrics }) {
  if (rules.layoutType === "two-line") {
    return renderSolvedSpacingDimensionsByRows({ content, rules, metrics });
  }

  const charBand = getCharacterBand(rules);
  const contentLimits = getContentLimits(rules, metrics.width);
  const first = content[0];
  const last = content[content.length - 1];
  const lines = [];
  const add = createDimensionLineAdder(lines);

  if (first && last) {
    const leftMargin = first.x - contentLimits.left;
    const rightMargin = contentLimits.right - (last.x + last.width);
    add(contentLimits.left, first.x, charBand.y + charBand.height + 9, `Margin ${formatMm(leftMargin)}`, "#6de28d", { kind: "outside-margin", labelOffset: 5.4, fontSize: 3.7 });
    add(last.x + last.width, contentLimits.right, charBand.y + charBand.height + 9, `Margin ${formatMm(rightMargin)}`, "#6de28d", { kind: "outside-margin", labelOffset: 5.4, fontSize: 3.7 });
  }

  for (const item of content) {
    const x1 = item.x;
    const x2 = item.x + item.width;
    if (item.type === "seals") {
      add(x1, x2, charBand.y - 7.5, getSealDebugLabel(getEffectiveSealGeometry(rules, item)), "#ffd36b", { kind: "seal-column", labelOffset: -1.8, fontSize: 4.0 });
      continue;
    }
    if (item.type === "group-gap") {
      add(x1, x2, charBand.y - 13.5, `Group ${formatMm(item.width)}`, "#ff7777", { kind: "group-gap", labelOffset: -1.8, fontSize: 3.8 });
      continue;
    }
    if (item.type === "season-gap") {
      add(x1, x2, charBand.y - 13.5, `Season gap ${formatMm(item.width)}`, "#ffb36b", { kind: "season-gap", labelOffset: -1.8, fontSize: 3.5 });
      continue;
    }
    if (item.type === "season-field") {
      add(x1, x2, charBand.y - 7.5, `Season ${formatMm(item.width)}`, "#ffffff", { kind: "season-field", labelOffset: -1.8, fontSize: 3.7 });
      continue;
    }
    if (item.type === "char-gap") {
      add(x1, x2, charBand.y + charBand.height + 4.2, formatMm(item.width), "#7fd3ff", { kind: "char-gap", labelOffset: 5.1, fontSize: 3.3, opacity: 0.75, tick: 1.8 });
    }
  }

  return `<g class="layer layer-solved-dimensions">${lines.join("")}
  </g>`;
}

function renderEuroInternalDimensions(model) {
  const { rules } = model;
  const euro = rules.euro;
  if (!Number.isFinite(Number(euro.innerTopClearance))) return "";

  const x = euro.x + euro.width + 5;
  const tickLeft = x - 2.5;
  const tickRight = x + 2.5;
  const starsTop = euro.y + euro.innerTopClearance;
  const starsBottom = starsTop + euro.starsBoxHeight;
  const countryTop = starsBottom + euro.starsToCountryGap;
  const countryBottom = countryTop + euro.countryBoxHeight;
  const segments = [
    [euro.y, starsTop, formatNumber(euro.innerTopClearance)],
    [starsTop, starsBottom, formatNumber(euro.starsBoxHeight)],
    [starsBottom, countryTop, formatNumber(euro.starsToCountryGap)],
    [countryTop, countryBottom, formatNumber(euro.countryBoxHeight)],
    [countryBottom, euro.y + euro.height, formatNumber(euro.innerBottomClearance)]
  ];
  const boundaries = [
    euro.y,
    starsTop,
    starsBottom,
    countryTop,
    countryBottom,
    euro.y + euro.height
  ];
  const segmentLines = segments.map(([y1, y2, label]) => `
    <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#7fd3ff" stroke-width="0.35"/>
    <line x1="${tickLeft}" y1="${y1}" x2="${tickRight}" y2="${y1}" stroke="#7fd3ff" stroke-width="0.35"/>
    <line x1="${tickLeft}" y1="${y2}" x2="${tickRight}" y2="${y2}" stroke="#7fd3ff" stroke-width="0.35"/>
    <text x="${x + 4}" y="${(y1 + y2) / 2 + 1.7}" font-family="Arial, sans-serif" font-size="3.6" fill="#7fd3ff" stroke="none">${label}</text>`).join("");
  const boundaryGuides = boundaries.map((y) => `<line x1="${euro.x}" y1="${y}" x2="${euro.x + euro.width}" y2="${y}" stroke="#7fd3ff" stroke-width="0.25" stroke-dasharray="1.2 1.2" opacity="0.45"/>`).join("");
  const countryBox = `<rect x="${euro.x}" y="${countryTop}" width="${euro.width}" height="${euro.countryBoxHeight}" fill="none" stroke="#7fd3ff" stroke-width="0.35" opacity="0.7"/>`;
  return `<g class="dimension dimension-euro-internal" opacity="0.9">${boundaryGuides}${countryBox}${segmentLines}
  </g>`;
}

function renderSolvedSpacingDimensionsByRows({ content, rules }) {
  const lines = [];
  const add = createDimensionLineAdder(lines);
  const rows = ["top", "bottom"];

  for (const rowKey of rows) {
    const rowItems = content.filter((item) => item.rowKey === rowKey);
    if (!rowItems.length) continue;
    const charBand = getCharacterBand(rules, rowKey);
    const limits = rowItems[0].contentLimits || (rowKey === "top" ? getTwoLineTopContentLimits(rules, rowItems[0].x) : getTwoLineBottomContentLimits(rules, rowItems[0].x));
    const first = rowItems[0];
    const last = rowItems[rowItems.length - 1];
    const marginY = rowKey === "top" ? charBand.y - 8.5 : charBand.y + charBand.height + 8.5;
    const marginLabelOffset = rowKey === "top" ? -1.8 : 5.4;
    const firstCharWithVirtualField = rowKey === "top" ? rowItems.find((item) => item.type === "char" && Number.isFinite(Number(item.reducedVirtualFieldLeft))) : null;
    const marginLeftX = firstCharWithVirtualField ? firstCharWithVirtualField.reducedVirtualFieldLeft : first.x;
    const marginRightX = last.x + last.width;
    const leftMargin = marginLeftX - limits.left;
    const rightMargin = limits.right - marginRightX;
    add(limits.left, marginLeftX, marginY, `${rowKey === "top" ? "Top" : "Bottom"} margin ${formatMm(leftMargin)}`, "#6de28d", { kind: `outside-margin-${rowKey}`, labelOffset: marginLabelOffset, fontSize: 3.5 });
    add(marginRightX, limits.right, marginY, `${rowKey === "top" ? "Top" : "Bottom"} margin ${formatMm(rightMargin)}`, "#6de28d", { kind: `outside-margin-${rowKey}`, labelOffset: marginLabelOffset, fontSize: 3.5 });
    if (firstCharWithVirtualField && Number.isFinite(Number(firstCharWithVirtualField.reducedVirtualFieldRight))) {
      add(firstCharWithVirtualField.reducedVirtualFieldLeft, firstCharWithVirtualField.reducedVirtualFieldRight, rowKey === "top" ? charBand.y + charBand.height + 6.5 : charBand.y + charBand.height + 6.5, `3er-Feld ${formatMm(firstCharWithVirtualField.reducedVirtualFieldWidth)}`, "#8ad4ff", { kind: "reduced-virtual-top-field", labelOffset: 5.1, fontSize: 3.1, opacity: 0.55, tick: 1.6 });
    }

    for (const item of rowItems) {
      const x1 = item.x;
      const x2 = item.x + item.width;
      if (item.type === "seals") {
        add(x1, x2, charBand.y - 14, getSealDebugLabel(getEffectiveSealGeometry(rules, item)), "#ffd36b", { kind: "seal-column", labelOffset: -1.8, fontSize: 3.8 });
        continue;
      }
      if (item.type === "group-gap") {
        add(x1, x2, charBand.y - 10, `Group ${formatMm(item.width)}`, "#ff7777", { kind: "group-gap", labelOffset: -1.8, fontSize: 3.6 });
        continue;
      }
      if (item.type === "seal-gap") {
        add(x1, x2, charBand.y - 10, getSealGapDebugLabel(item), "#ffb36b", { kind: "seal-gap", labelOffset: -1.8, fontSize: 3.4 });
        continue;
      }
      if (item.type === "season-gap") {
        add(x1, x2, charBand.y - 7, `Season gap ${formatMm(item.width)}`, "#ffb36b", { kind: "season-gap", labelOffset: -1.8, fontSize: 3.2 });
        continue;
      }
      if (item.type === "season-field") {
        add(x1, x2, charBand.y - 14, `Season ${formatMm(item.width)}`, "#ffffff", { kind: "season-field", labelOffset: -1.8, fontSize: 3.4 });
        continue;
      }
      if (item.type === "char-gap") {
        const y = rowKey === "top" ? charBand.y + charBand.height + 3.8 : charBand.y + charBand.height + 4.2;
        add(x1, x2, y, formatMm(item.width), "#7fd3ff", { kind: "char-gap", labelOffset: 5.1, fontSize: 3.1, opacity: 0.75, tick: 1.8 });
      }
    }
  }

  return `<g class="layer layer-solved-dimensions">${lines.join("")}
  </g>`;
}

function createDimensionLineAdder(lines) {
  return (x1, x2, y, label, color, options = {}) => {
    if (!Number.isFinite(x1) || !Number.isFinite(x2) || Math.abs(x2 - x1) < 0.25) return;
    const left = Math.min(x1, x2);
    const right = Math.max(x1, x2);
    const tick = options.tick ?? 2.4;
    const labelOffset = options.labelOffset ?? -1.2;
    const textY = y + labelOffset;
    const opacity = options.opacity ?? 0.95;
    lines.push(`
      <g class="dimension dimension-${escapeAttr(options.kind || "spacing")}" opacity="${opacity}">
        <line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="${color}" stroke-width="0.55"/>
        <line x1="${left}" y1="${y - tick}" x2="${left}" y2="${y + tick}" stroke="${color}" stroke-width="0.55"/>
        <line x1="${right}" y1="${y - tick}" x2="${right}" y2="${y + tick}" stroke="${color}" stroke-width="0.55"/>
        <text x="${(left + right) / 2}" y="${textY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${options.fontSize || 3.9}" fill="${color}" stroke="none">${escapeText(label)}</text>
      </g>`);
  };
}

function getContentLimits(rules, width) {
  const contentLeft = rules.euro.x + rules.euro.width;
  const right = width - rules.innerInset;
  return createHorizontalBounds(contentLeft, right);
}

function getTwoLineTopContentLimits(rules, width) {
  const left = rules.euro.x + rules.euro.width;
  const right = width - rules.innerInset;
  return createHorizontalBounds(left, right);
}

function getTwoLineBottomContentLimits(rules, width) {
  const left = rules.innerInset;
  const right = width - rules.innerInset;
  return createHorizontalBounds(left, right);
}

function getSealGapDebugLabel(item) {
  if (item?.key === "reduced-top-text-to-authority-gap") return `Text→Landessiegel ${formatMm(item.width)}`;
  if (item?.key === "reduced-top-authority-to-hu-gap") return `Siegel→HU ${formatMm(item.width)}`;
  if (item?.key === "reduced-top-seal-gap-upper-row") return `Text→Siegel ${formatMm(item.width)}`;
  return `Seal gap ${formatMm(item?.width ?? 0)}`;
}

function getSealDebugLabel(geometry) {
  if (geometry?.arrangement === "reduced-standard-upper-row") {
    if (geometry.sealKind === "authority") return `Landessiegel ${formatMm(geometry.innerColumnWidth)}`;
    if (geometry.sealKind === "hu") return `HU ${formatMm(geometry.innerColumnWidth)}`;
    return `Siegelreihe ${formatMm(geometry.innerColumnWidth)}`;
  }
  return `Seal ${formatMm(geometry?.innerColumnWidth ?? 0)}`;
}

function formatMm(value) {
  return `${formatNumber(value)} mm`;
}

