// Kennzeichen Physical Lab b301 / seal component helpers
// Thin wrapper around seal geometry, marker selection plan, and marker SVG rendering.

import { getEffectiveSealGeometry, getSealGeometry } from "./seal-geometry-plan.js";
import { createSealMarkerPlan } from "./seal-marker-plan.js";
import { renderAuthoritySealMarker, renderChangePlateWMarker, renderHuSealMarker } from "./seal-slot-marker.js";
import { getItemsOfType } from "./plate-sequence-width-utils.js";


export { getEffectiveSealGeometry, getSealGeometry };

export function renderSeals({ content, rules }) {
  const sealItems = getItemsOfType(content, "seals");
  if (!sealItems.length) return "";
  const parts = sealItems.map((seal) => renderSealItem(rules, seal)).filter(Boolean).join("\n");
  return `<g class="layer layer-seals">${parts}</g>`;
}

function renderSealItem(rules, seal) {
  const geometry = getEffectiveSealGeometry(rules, seal);
  const markerPlan = createSealMarkerPlan({ rules, seal, geometry });
  const parts = [];
  if (markerPlan.renderChangePlateW) {
    parts.push(renderChangePlateWMarker({ seal, geometry }));
  }
  if (markerPlan.renderHu) {
    parts.push(renderHuSealMarker({ seal, geometry }));
  }
  if (markerPlan.renderAuthority) {
    parts.push(renderAuthoritySealMarker({ seal, geometry }));
  }
  return parts.join("");
}
