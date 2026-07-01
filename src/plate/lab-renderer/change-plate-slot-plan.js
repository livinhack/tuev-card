// Kennzeichen Physical Lab b258 / Wechselkennzeichen main-seal slot plan helpers
// Keeps the geometric decision for W/authority slot placement separate from
// the marker rendering. No standalone renderer logic belongs here.

export function getChangePlateSealSlotPlan(rules, seal, geometry) {
  if (seal?.changePlateW !== true || seal?.changePlateSwapWAndAuthority !== true) return null;
  return getSwappedChangePlateSealSlotPlan(rules, seal, geometry);
}

function getSwappedChangePlateSealSlotPlan(rules, seal, geometry) {
  if (geometry.arrangement === "motorcycle-horizontal") {
    const authorityRadius = geometry.authority.radius;
    const authorityCx = seal.x + authorityRadius;
    const currentB252VisualCenterCorrectionX = -4.0;
    const wCx = geometry.authority.cx + currentB252VisualCenterCorrectionX;
    return {
      // Kraftrad-Wechselkennzeichen keeps the W rendering formula from b247.
      // To preserve the visually approved W location from b252 without shifting
      // the glyph inside its slot, the complete 35-mm W/HU slot is moved to the
      // former b252 visual W center. Authority remains 45 mm on the left.
      authority: { ...geometry.authority, cx: authorityCx, cy: geometry.authority.cy },
      w: { ...geometry.hu, cx: wCx, cy: geometry.hu.cy }
    };
  }
  return {
    w: { ...geometry.hu, cx: geometry.authority.cx, cy: geometry.authority.cy },
    authority: { ...geometry.authority, cx: geometry.hu.cx, cy: geometry.hu.cy }
  };
}
