// Kennzeichen Physical Lab b306 / EU star wreath component
// Geometry-only SVG helper. Euro-field variants provide only the wreath centre
// and the legal diameter "a" through the star centre points. The star size is
// derived as a / 6 unless explicitly overridden for a measured reference.

import { numberOrFallback as n, formatSvgNumber as format } from "./plate-number-utils.js";

function starPolygonPoints(cx, cy, outerRadius) {
  const innerRadius = outerRadius * 0.38196601125;
  const points = [];
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + i * Math.PI / 5;
    points.push(`${format(cx + Math.cos(angle) * radius)},${format(cy + Math.sin(angle) * radius)}`);
  }
  return points.join(" ");
}

export function resolveEuStarWreathGeometry(config = {}) {
  const centerX = n(config.centerX ?? config.cx, 0);
  const centerY = n(config.centerY ?? config.cy, 0);
  const diameterThroughCenters = n(config.diameterThroughCenters ?? config.a ?? config.diameter, n(config.radius, 0) * 2);
  const starSize = n(config.starSize, diameterThroughCenters / 6);
  return Object.freeze({
    centerX,
    centerY,
    diameterThroughCenters,
    radiusThroughCenters: diameterThroughCenters / 2,
    starSize,
    starOuterRadius: starSize / 2
  });
}

export function renderEuStarWreath(config = {}) {
  const geometry = resolveEuStarWreathGeometry(config);
  const stars = [];
  for (let i = 0; i < 12; i += 1) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / 12;
    const x = geometry.centerX + Math.cos(angle) * geometry.radiusThroughCenters;
    const y = geometry.centerY + Math.sin(angle) * geometry.radiusThroughCenters;
    stars.push(`<polygon class="eu-star" points="${starPolygonPoints(x, y, geometry.starOuterRadius)}" fill="#ffd200"/>`);
  }
  return `<g class="eu-stars" data-eu-star-a="${format(geometry.diameterThroughCenters)}" data-eu-star-size="${format(geometry.starSize)}">${stars.join("")}</g>`;
}
