// Kennzeichen Physical Lab b239 / plate body and background component
// Renders only the invariant physical plate body: black frame, white reflective
// field, blue Euro field background and Euro-field subcomponents.
// It does not solve layout or change any physical coordinates.

import { renderEuroFieldComponents } from "./euro-field.js";

export function renderPlateBody({ rules, metrics }) {
  const w = metrics.changePlateMainPlateWidth || metrics.width;
  const h = rules.outerHeight;
  const inset = rules.innerInset;
  const euro = rules.euro;
  const frameColor = metrics?.frameColor || "#111";
  return `
<g class="layer layer-body" filter="url(#plateShadow)">
  <rect data-plate-frame="true" x="0" y="0" width="${w}" height="${h}" rx="${rules.outerCornerRadius}" fill="${frameColor}"/>
  <rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${rules.innerHeight}" rx="${rules.innerCornerRadius}" fill="#f4f3ee"/>
  <rect x="${euro.x}" y="${euro.y}" width="${euro.width}" height="${euro.height}" fill="#0046ad"/>
  ${renderEuroFieldComponents(euro)}
</g>`.trim();
}
