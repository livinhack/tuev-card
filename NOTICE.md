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
