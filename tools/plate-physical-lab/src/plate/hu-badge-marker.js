// Kennzeichen Physical Lab b329 / HU badge marker bridge
// Lab-only experiment: render the existing full TÜV badge SVG into the 35-mm HU seal slot.

import { renderBadge } from "./badge/renderer.js";
import { escapeSvgAttrOrEmpty as escapeAttr } from "./svg-escape-utils.js";

export function renderFullHuBadgeMarker({ geometry, badge = {} }) {
  const hu = geometry.hu || geometry;
  const diameter = Number(hu.diameter) || Number(hu.radius) * 2 || 35;
  const cx = Number(hu.cx ?? geometry.cx);
  const cy = Number(hu.cy ?? geometry.cy);
  const x = cx - diameter / 2;
  const y = cy - diameter / 2;
  const year = Number.isFinite(Number(badge.year)) ? Number(badge.year) : new Date().getFullYear();
  const rotation = Number.isFinite(Number(badge.rotation)) ? Number(badge.rotation) : 0;
  const rawSvg = renderBadge(year, rotation, false, 300);
  const nestedSvg = rawSvg.replace(/<svg[^>]*>/, `<svg x="${format(x)}" y="${format(y)}" width="${format(diameter)}" height="${format(diameter)}" viewBox="0 0 300 300" class="hu-badge-svg" data-hu-year="${escapeAttr(year)}" data-hu-rotation="${escapeAttr(rotation)}" preserveAspectRatio="xMidYMid meet">`);
  return `<g class="seal-slot seal-slot-hu seal-slot-hu-full-badge" data-hu-badge-renderer="full">${nestedSvg}</g>`;
}

export function resolveHuBadgeOptions(options = {}) {
  if (options.huBadgeRenderer !== "full") return null;
  const year = Number(options.huYear);
  return {
    renderer: "full",
    year: Number.isFinite(year) ? year : new Date().getFullYear(),
    month: Number.isFinite(Number(options.huMonth)) ? Number(options.huMonth) : null,
    rotation: Number.isFinite(Number(options.huRotation)) ? Number(options.huRotation) : 0
  };
}

function format(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(3).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1") : "0";
}
