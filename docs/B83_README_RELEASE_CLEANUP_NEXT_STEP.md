# b83 - README release cleanup and next-step checkpoint

## Goal

`b83` is a release/readiness cleanup after the confirmed `b82` editor and floating-panel state.

The user explicitly requested:

- Keep `README.md` at end-user level.
- Do not document cache-buster URLs as a normal HACS installation path.
- After this checkpoint, decide between the bundled-font replacement and Integration Architecture V3.

## Changes

### README

`README.md` was rewritten as an end-user facing HACS/manual installation and configuration guide.

Removed from README:

- source-level modular debugging instructions
- local build commands
- project structure internals
- developer/release wording
- normal HACS cache-buster guidance

Kept in README:

- what the card does
- HACS install path
- manual install path
- card examples
- visual editor overview
- HU confirmation explanation
- options table
- current `EuroPlate.ttf` requirement for graphical plates

### Version sync

- `package.json`: `0.1.1-b83`
- `package-lock.json`: `0.1.1-b83`
- `src/tuev-card-entry.js`: `// TÜV Card source entry b83`
- `src/**/*.js` import query markers: `?v=b83`
- generated bundle: `// TÜV Card bundled b83`

### Active documentation

Active repo/check documents were updated to `b83` and changed to show the normal HACS resource path without a cache-buster query where relevant.

Historical bXX checkpoint documents were left unchanged.

## Deliberate non-changes

No behavior was changed in:

- card rendering
- editor rendering
- floating panel behavior
- modal sort-confirm behavior
- groups side-by-side runtime logic
- HU confirmation overlay
- TÜV badge renderer
- license plate renderer
- EuroPlate/font availability logic

## Recommendation after b83

Do the font replacement before Integration Architecture V3.

Reason:

- The card is now close to a stable user-facing state.
- The remaining EuroPlate file requirement is still a user-facing release friction point.
- V3 is a larger integration architecture change and should start after the card package is self-contained and less dependent on manual assets.

Recommended next checkpoint:

- `b84`: GL font/license evaluation and Plate Renderer v2 planning spike, with no renderer rewrite until font files and license documentation are clear.

Then:

- `b85+`: implement bundled GL font path if the license check is acceptable.
- Integration Architecture V3 afterwards.

## Checks

Run for b83:

```bash
npm run check
npm run build
```

Expected bundle header:

```text
// TÜV Card bundled b83
```
