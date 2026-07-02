import fs from 'node:fs';
import path from 'node:path';
import { getReminderPlateData } from '../src/card/reminder-attributes.js';
import { renderLicensePlate } from '../src/plate/renderer.js';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => {
  console.error(`Card Reminder r008 attribute mapping check failed: ${message}`);
  process.exitCode = 1;
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const pkg = JSON.parse(read('package.json'));
const entry = read('src/tuev-card-entry.js');
const adapter = read('src/plate/lab-renderer-adapter.js');
const plateLayout = read('src/card/plate-layout.js');
const visualStyle = read('src/plate/lab-renderer/plate-visual-style.js');

assert(pkg.version.includes('b355'), 'package version must identify b355.');
assert(entry.includes('getReminderPlateData'), 'Card entry must use Reminder r008 attribute mapping.');
assert(entry.includes('...plateData.rendererOptions'), 'Card render call must pass Reminder renderer options into renderLicensePlate.');
assert(plateLayout.includes('getPlateData = null'), 'shared plate layout must accept entity-specific plate data/options.');
assert(adapter.includes('plateFormat: options.plateFormat'), 'adapter must pass plate format into the Lab renderer.');
assert(adapter.includes('visualStyle: options.visualStyle'), 'adapter must pass visual style into the Lab renderer.');
assert(adapter.includes('season: options.season'), 'adapter must pass season options into the Lab renderer.');
assert(adapter.includes('changePlate: options.changePlate'), 'adapter must keep Wechselkennzeichen options pass-through.');
assert(!visualStyle.includes('enabled: false'), 'green visual style must not silently disable season fields for Reminder green+season vehicles.');

const greenSeason = getReminderPlateData({
  plate_base: 'TR EI 10',
  plate_display: 'TR EI 10',
  plate_color_mode: 'green',
  seasonal: true,
  season_start_month: 4,
  season_end_month: 10,
  plate_format: 'two_line'
});
assert(greenSeason.plate === 'TR EI 10', 'plate display must preserve user spacing.');
assert(greenSeason.rendererOptions.visualStyle.plateColorMode === 'green', 'green plate color mode must map to renderer visual style.');
assert(greenSeason.rendererOptions.season.enabled === true, 'seasonal Reminder attribute must map to renderer season.enabled.');
assert(greenSeason.rendererOptions.season.from === 4 && greenSeason.rendererOptions.season.to === 10, 'season months must map to renderer season range.');
assert(greenSeason.rendererOptions.plateFormat === 'twoLine', 'two_line Reminder format must map to Lab twoLine.');

const changePlate = getReminderPlateData({
  plate: 'WIL AB 123E',
  plate_base: 'WIL AB 123',
  plate_suffix_e: true,
  plate_kind: 'change',
  change_plate_common_text: 'WIL AB 12',
  change_plate_vehicle_digit: '3',
  plate_format: 'single_line'
});
assert(changePlate.plate === 'WIL AB 123E', 'E suffix must be preserved in the Card display plate.');
assert(changePlate.suffixE === true && changePlate.suffixH === false, 'E checkbox state must map from Reminder booleans.');
assert(changePlate.rendererOptions.changePlate.enabled === true, 'change_plate_enabled/plate_kind must enable changePlate renderer mode.');
assert(changePlate.rendererOptions.changePlate.commonText === 'WIL AB 12', 'change-plate common text must map to renderer.');
assert(changePlate.rendererOptions.changePlate.vehicleText === '3E', 'change-plate vehicle digit must receive suffix for renderer supplement.');

const reduced = getReminderPlateData({ plate: 'K AB 1', plate_format: 'small_two_line' });
assert(reduced.rendererOptions.plateFormat === 'reducedTwoLine', 'small_two_line must map to Lab reducedTwoLine.');

const greenSeasonSvg = renderLicensePlate(greenSeason.plate, greenSeason.rendererOptions);
assert(greenSeasonSvg.includes('data-plate-color-mode="green"'), 'green-season SVG must render green visual style.');
assert(greenSeasonSvg.includes('data-season-enabled="true"') || greenSeasonSvg.includes('layer-season-field'), 'green-season SVG must render a season field.');

const changeSvg = renderLicensePlate(changePlate.plate, changePlate.rendererOptions);
assert(changeSvg.includes('data-change-plate="true"'), 'change-plate SVG must include the Wechselkennzeichen supplement.');
assert(changeSvg.includes('3E'), 'change-plate supplement must render the vehicle digit plus E suffix.');

if (!process.exitCode) {
  console.log('Card Reminder r008 attribute mapping OK: b355 maps plate display, color, season, format, H/E and Wechselkennzeichen renderer data.');
}
