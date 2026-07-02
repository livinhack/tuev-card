# Notices and attributions

This project contains software code and bundled artwork/data with separate licensing notes.

## Software code

Unless otherwise noted, the source code is licensed under:

```text
AGPL-3.0-or-later
```

See `LICENSE`.

## TÜV badge digit path data

Affected file:

```text
src/badge/digits.js
```

This file contains SVG path data used to render the TÜV badge month digits and center year
digits. The path data was extracted, normalized, adjusted and integrated for use in the TÜV
badge renderer.

Potential source/derivation:

```text
File: Bahnschrift.svg
Description: Specimen of the Bahnschrift font
Author: Denis Moyogo Jacquerye
Source: https://commons.wikimedia.org/wiki/File:Bahnschrift.svg
License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
```

Modifications made for this project:

- digit paths extracted from the source material
- paths normalized for renderer use
- digit bounding boxes added
- per-digit fill rules added where needed
- integrated into `src/badge/digits.js`
- rendered as badge artwork, not loaded as an external font file

If the bundled digit paths are treated as an adaptation of the Wikimedia Commons source,
the digit artwork/data in `src/badge/digits.js` should be distributed under CC BY-SA 4.0.
The surrounding software code remains licensed separately under AGPL-3.0-or-later.

## GL-Nummernschild

The card can render graphical German-style license plates with GL-Nummernschild by Gutenberg Labo.

Bundled/expected runtime font file names:

```text
fonts/GL-Nummernschild-Mtl.ttf
fonts/GL-Nummernschild-Eng.ttf
```

License/readme notes are kept in:

```text
fonts/LICENSE.GL-Nummernschild.txt
fonts/GL-Nummernschild-Mtl-readme.txt
fonts/GL-Nummernschild-Eng-readme.txt
```

The upstream readmes state that unlimited permission is granted to use, copy, and distribute the fonts, with or without modification, commercially and noncommercially, and that the fonts are provided "AS IS" without warranty.

When the font binary files are present in `fonts/`, the build mirrors them to `dist/fonts/`. HACS installs the `dist` contents and Home Assistant serves the fonts via `/hacsfiles/tuev-card/fonts/...`.

## EuroPlate.ttf legacy fallback

`EuroPlate.ttf` is not included in this repository or package. The renderer still recognizes it as a legacy fallback at:

```text
/local/EuroPlate.ttf
```

GL-Nummernschild is preferred when available. The card falls back to plain text license plates when no valid plate font is available.

Physical Lab note (b101): The standalone lab can use a locally supplied `din1451alt.ttf` for the Euro-field country mark `D`. The font binary is not included in ChatGPT-generated ZIP files.


b200: Full/Card code unchanged; separate Lab ZIP is authoritative for the Reduced Standard lower-row threshold fix. Standard four-character lower rows remain vertical; H/E/season still force upper side-by-side seals. No font binaries are included in the chat ZIP.

b201: Full/Card code unchanged; separate Lab ZIP is authoritative for the Reduced upper-district anchor fix. Historical checkpoint; superseded by b202 for the visible W Q1 short-top placement.

b202: Full/Card code unchanged; separate Lab ZIP is authoritative for the Reduced short-top left-anchor fix. W Q1 remains 180 mm with vertical seals, but the upper W is no longer pulled against the vertical seal axis. No font binaries are included in the chat ZIP.


b203: Full/Card code unchanged; separate Lab ZIP is authoritative for the Reduced upper district corridor-centering fix. One-/two-letter top district codes are centered between Euro field and the first seal/plaque field; no font binaries are included in the chat ZIP.

b204: Full/Card code unchanged; separate Lab ZIP is authoritative. Added Lab check-chain input presets for Reduced Standard, H/E, Saison and H/E+Saison. No font binaries are included in the chat ZIP.


b205: Full/Card code unchanged; separate Lab ZIP is authoritative for the Reduced vertical preferred-spacing correction. The Lab keeps b204 presets and adjusts the vertical Reduced standard solver so internal **/*** gaps prefer their nominal values before edge space is consumed. No font binaries are included in the chat ZIP.


b207: Full/Card code unchanged; separate Lab ZIP is authoritative for the Reduced 9-slot Saison/H-E tight-fit rule. The Lab allows the official 255-mm border case to use a >=6-mm right edge and a top 8/8/8/5/4/6 tight chain. No font binaries are included in the chat ZIP.


b208: Full/Card code unchanged; separate Lab ZIP is authoritative. Physical Lab fixes Reduced H/E/Saison 8-slot counting: district + recognition including E/H suffix + season field are counted; `HVL DI9E` + Saison now triggers the 8-slot upper-seal guard and keeps right top margin >=8 mm. No font binaries are included in the chat ZIP.

b209: Full/Card code unchanged; separate Lab ZIP is authoritative. Physical Lab corrects the Reduced H/E/Saison 8-slot upper-seal fit from b208: 8-slot cases now use 3/4/8 (text→authority / authority→HU / right edge), while the separate 9-slot season case keeps 5/4/6. No font binaries are included in the chat ZIP.

b246 note: Lab handover updated for Wechselkennzeichen high-format supplement. Card runtime code is unchanged; no font binaries are included in the chat ZIP.

b247 note: Corrected Kraftrad Wechselkennzeichen W/authority swap so the 45-mm authority seal moves left and W uses the 35-mm HU slot on the right. Card runtime code is unchanged; no font binaries are included in the chat ZIP.


b248 note: Kraftrad Wechselkennzeichen W is centered in the 35-mm HU/W slot and Lab-only random Wechselkennzeichen presets were added. Card runtime code is unchanged; no font binaries are included in the chat ZIP.


## b350
Editor preview visible-width bypass fix. No license-relevant asset changes.
