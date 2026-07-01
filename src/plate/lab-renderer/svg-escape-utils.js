// Kennzeichen Physical Lab b297 / SVG escape helpers
// Centralises only exact text/attribute escaping formulas. This module does not
// alter renderer geometry, layout or component-specific semantics.

export function escapeSvgText(value) {
  return String(value).replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]));
}

export function escapeSvgTextOrEmpty(value) {
  return String(value ?? "").replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]));
}

export function escapeSvgAttr(value) {
  return escapeSvgText(value).replace(/"/g, "&quot;");
}

export function escapeSvgAttrOrEmpty(value) {
  return escapeSvgTextOrEmpty(value).replace(/"/g, "&quot;");
}
