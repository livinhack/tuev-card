// Kennzeichen Physical Lab b261 / seal marker selection plan
// Decides which visual seal markers are rendered for an already resolved seal
// slot. Geometry stays in seal-geometry-plan.js; SVG drawing stays in
// seal-slot-marker.js.

function isReducedVerticalSealSlot(rules, geometry) {
  return rules.formatKey === "reducedTwoLine" && geometry.arrangement === "reduced-standard-vertical";
}

function isReducedUpperSingleSealSlot(rules, geometry, seal) {
  return rules.formatKey === "reducedTwoLine"
    && geometry.arrangement === "reduced-standard-upper-row"
    && Boolean(seal.sealKind);
}

function shouldRenderHuMarker({ seal, isReducedVertical, isReducedUpperSingleSeal, isChangePlateW }) {
  if (isChangePlateW) return false;
  if (isReducedUpperSingleSeal) return seal.sealKind === "hu";
  return !isReducedVertical || seal.rowKey === "top";
}

function shouldRenderAuthorityMarker({ seal, isReducedVertical, isReducedUpperSingleSeal }) {
  if (isReducedUpperSingleSeal) return seal.sealKind === "authority";
  return !isReducedVertical || seal.rowKey === "bottom";
}

export function createSealMarkerPlan({ rules, seal, geometry }) {
  const isReducedVertical = isReducedVerticalSealSlot(rules, geometry);
  const isReducedUpperSingleSeal = isReducedUpperSingleSealSlot(rules, geometry, seal);
  const isChangePlateW = seal.changePlateW === true;
  return {
    renderChangePlateW: isChangePlateW,
    renderHu: shouldRenderHuMarker({ seal, isReducedVertical, isReducedUpperSingleSeal, isChangePlateW }),
    renderAuthority: shouldRenderAuthorityMarker({ seal, isReducedVertical, isReducedUpperSingleSeal }),
  };
}
