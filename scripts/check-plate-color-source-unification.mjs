import assert from 'node:assert/strict';
import { renderPlateSvgMm } from '../src/plate/lab-renderer/plate-public-api.js';

const renderOptions = {
  visualStyle: { plateColorMode: 'green' },
  changePlate: { enabled: true, commonText: 'DD GD 64', vehicleText: '5' },
  huBadgeRenderer: 'full',
  huYear: 2027,
  huMonth: 5,
  showDimensions: false,
  showDxfReferenceGuides: false,
  showGrid: false
};

const { svg } = renderPlateSvgMm('DD GD 64', renderOptions);

assert.match(svg, /class="layer layer-change-plate"[\s\S]*?<rect[^>]+fill="#287233"/, 'Wechselkennzeichen-Zusatzrahmen nutzt die zentrale grüne Rahmenfarbe.');
assert.match(svg, /data-change-plate-w="true"[\s\S]*?<text[^>]+fill="#287233"[^>]*>W<\/text>/, 'W-Markierung nutzt die zentrale Plattenfarbe.');
assert.match(svg, /<text[^>]+fill="#287233"[^>]*>DD GD 64<\/text>/, 'Kleiner gemeinsamer Text im Zusatzschild nutzt die zentrale Plattenfarbe.');
assert.match(svg, /class="layer layer-change-plate"[\s\S]*?<text[^>]+fill="#287233"[^>]*>5<\/text>/, 'Fahrzeugbezogener Text im Zusatzschild bleibt an die zentrale Textfarbe angebunden.');

const standard = renderPlateSvgMm('DD GD 64', {
  changePlate: { enabled: true, commonText: 'DD GD 64', vehicleText: '5' },
  huBadgeRenderer: 'full',
  huYear: 2027,
  showDimensions: false,
  showDxfReferenceGuides: false,
  showGrid: false
}).svg;
assert.match(standard, /class="layer layer-change-plate"[\s\S]*?<rect[^>]+fill="#111"/, 'Standard-Zusatzrahmen bleibt schwarz.');
assert.match(standard, /data-change-plate-w="true"[\s\S]*?<text[^>]+fill="#111"[^>]*>W<\/text>/, 'Standard-W-Markierung bleibt schwarz.');

console.log('plate color source unification check passed');
