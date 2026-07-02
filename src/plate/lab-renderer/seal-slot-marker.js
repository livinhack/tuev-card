// Kennzeichen Physical Lab b348 / seal slot marker rendering helpers
// Draws concrete seal-slot marker SVGs. Geometry and slot decisions are
// resolved by seal-components.js and change-plate-slot-plan.js.

import { escapeSvgAttrOrEmpty as escapeText } from "./svg-escape-utils.js";
import { renderFullHuBadgeMarker } from "./hu-badge-marker.js";

export function renderChangePlateWMarker({ seal, geometry, plateInkColor = "#111" }) {
  const wGeometry = geometry.hu;
  const wHeight = Number(seal.wHeight) || 20;
  const wWidth = Number(seal.wWidth) || 25;
  return `
  <g class="seal-slot seal-slot-change-w" data-seal-row="${escapeText(seal.rowKey || "top")}" data-change-plate-w="true">
    <text x="${wGeometry.cx ?? geometry.cx}" y="${wGeometry.cy + wHeight * 0.36}" text-anchor="middle" font-family="'GL-Nummernschild-Mtl', Arial Narrow, sans-serif" font-size="${wHeight * 1.42}" font-weight="400" textLength="${wWidth}" lengthAdjust="spacingAndGlyphs" fill="${plateInkColor}">W</text>
  </g>`;
}

export function renderHuSealMarker({ seal, geometry, huBadge = null }) {
  if (huBadge?.renderer === "full") {
    return renderFullHuBadgeMarker({ geometry, badge: huBadge });
  }

  return `
  <g class="seal-slot seal-slot-hu" data-seal-row="${escapeText(seal.rowKey || "top")}">
    <circle cx="${geometry.hu.cx ?? geometry.cx}" cy="${geometry.hu.cy}" r="${geometry.hu.radius}" fill="#1ea5ff" stroke="#111" stroke-width="1.25"/>
    <circle cx="${geometry.hu.cx ?? geometry.cx}" cy="${geometry.hu.cy}" r="${geometry.hu.radius * 0.68}" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="0.8" stroke-dasharray="1.4 1.8"/>
    <text x="${geometry.hu.cx ?? geometry.cx}" y="${geometry.hu.cy + 3.3}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="700" fill="#111">HU</text>
  </g>`;
}

export function renderAuthoritySealMarker({ seal, geometry }) {
  const authorityGeometry = geometry.authority;
  return `
  <g class="seal-slot seal-slot-authority" data-seal-row="${escapeText(seal.rowKey || "bottom")}">
    <circle cx="${authorityGeometry.cx ?? geometry.cx}" cy="${authorityGeometry.cy}" r="${authorityGeometry.radius}" fill="#d7d7d2" stroke="#999" stroke-width="1"/>
    <circle cx="${authorityGeometry.cx ?? geometry.cx}" cy="${authorityGeometry.cy}" r="${authorityGeometry.radius * 0.55}" fill="none" stroke="rgba(120,120,115,.65)" stroke-width="1"/>
  </g>`;
}
