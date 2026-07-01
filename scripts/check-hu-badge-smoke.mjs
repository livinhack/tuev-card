import { renderPlateSvgMm } from "../src/plate/lab-renderer/mm-model.js";
import { renderBadge } from "../src/plate/lab-renderer/badge/renderer.js";

function assert(condition, message) {
  if (!condition) {
    console.error(`HU badge smoke check failed: ${message}`);
    process.exit(1);
  }
}

function render(input, options = {}) {
  return renderPlateSvgMm(input, {
    fontMode: "middle",
    widthMode: "balanced",
    stage: "complete",
    showDimensions: false,
    showDxfReferenceGuides: false,
    showGrid: false,
    showSeals: true,
    showText: true,
    ...options
  }).svg;
}

const full2026 = render("GL AB123", {
  huBadgeRenderer: "full",
  huYear: 2026,
  huMonth: 5,
  huRotation: 0
});

assert(full2026.includes('data-hu-badge-renderer="full"'), "normal HU slot must render the full badge marker when huBadgeRenderer is full.");
assert(full2026.includes('data-hu-year="2026"'), "normal HU slot must preserve the supplied HU year.");
assert(!full2026.includes('#1ea5ff'), "normal full badge render must not contain the old blue HU placeholder.");

const full2027 = render("GL AB123", {
  huBadgeRenderer: "full",
  huYear: 2027,
  huMonth: 5,
  huRotation: 0
});

assert(full2026 !== full2027, "different HU years must produce different badge SVG output/colors.");
assert(renderBadge(2026, 0, false, 300) !== renderBadge(2027, 0, false, 300), "badge renderer must produce different yearly color output.");

const changePlate = render("GL AB123", {
  huBadgeRenderer: "full",
  huYear: 2027,
  huRotation: 0,
  changePlate: {
    enabled: true,
    commonText: "GL AB",
    vehicleText: "1"
  }
});

const fullBadgeCount = (changePlate.match(/data-hu-badge-renderer="full"/g) || []).length;
assert(fullBadgeCount >= 1, "change plate render must include a full HU badge marker.");
assert(changePlate.includes('class="change-plate-supplement-hu') || changePlate.includes('layer-change-plate'), "change plate render must include the vehicle-specific supplement layer.");
assert(!changePlate.includes('#1ea5ff'), "change plate full badge render must not contain the old blue HU placeholder.");

const placeholder = render("GL AB123", {
  huBadgeRenderer: "placeholder",
  huYear: 2026
});

assert(placeholder.includes('#1ea5ff'), "Lab placeholder path must remain available for visual comparison when full badge is not enabled.");

console.log("HU badge smoke check passed.");
