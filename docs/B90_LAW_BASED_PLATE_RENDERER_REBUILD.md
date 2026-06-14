# b90 - Law-based plate renderer rebuild

b90 replaces the card license-plate renderer with a new implementation that is built from the FZV Anlage 4 measurement model instead of the old visual EuroPlate/GL renderer geometry.

## Goal

The b88 physical renderer was visibly wrong and b89 therefore restored the old renderer while adding a standalone lab. b90 starts the card renderer again from zero with only these rules:

- FZV Anlage 4 one-line standard plate as physical base model.
- One-line standard plate height: 110 mm.
- One-line standard plate maximum width: 520 mm.
- GL Mittelschrift 75 mm is tried first.
- GL Engschrift 75 mm is used only if Mittelschrift does not fit the 520 mm model.
- No system font fallback.
- Authority seal is only a neutral grey/silver placeholder.
- HU seal is a tiny generic TÜV Reminder marker using the vehicle year/month color logic.
- No real authority/land seal, coat of arms, Druckstücknummer or official seal art is reproduced.
- Card scaling rule remains: widest plate in one card determines the scale; all other one-line plates keep the same visible height.

## Main implementation details

### `src/plate/renderer.js`

Completely rewritten. The old visual geometry objects were removed.

New model:

- mm coordinates
- `FZV_ONE_LINE` physical model
- parsed split into local prefix and recognition number
- centered content area between Euro field and right border
- seal column between local prefix and recognition group when both exist
- Mittelschrift-first layout selection
- Engschrift fallback only when needed
- measured GL glyph widths via canvas, deterministic fallback widths when canvas is unavailable
- SVG rendered with physical viewBox and externally supplied card scale

### `src/tuev-card-entry.js`

Now passes `huMonth` into the plate renderer so the small HU seal can use month/year information.

## Files changed

- `src/plate/renderer.js`
- `src/tuev-card-entry.js`
- `package.json`
- `package-lock.json`
- `dist/tuev-card.js`
- `HANDOVER.md`
- `docs/B90_LAW_BASED_PLATE_RENDERER_REBUILD.md`

## Not changed

- The large TÜV badge renderer.
- Editor groups and floating panels.
- HACS `dist/` structure.
- Font loading paths.
- README end-user level.
- `tools/plate-renderer-lab/` remains as a separate experiment/lab.

## Test focus

1. Keep GL fonts in the local repo `fonts/` folder.
2. Run `npm run build` so fonts are copied to `dist/fonts/`.
3. Commit/push and redownload through HACS.
4. Test one-line standard plates:
   - `WIL CL 212`
   - `BKS R 95`
   - `WIL LM 216`
   - `TR A 77`
   - `S AB 1234`
   - `DA CI 500`
   - `K S 70`
   - `HH EV 204E`
5. Check shared height rule inside one card.
6. Check if the seal column spacing is usable at 1, 2, 3 and 4 columns.

## Known limits after b90

- This is the first card integration of the rebuilt renderer and will likely need b91 visual tuning.
- Only one-line standard plates are actively wired into the card.
- The standalone lab still contains broader experimental plate-type rules; it has not yet been merged into the card renderer.
- Real official seal artwork remains intentionally out of scope.
