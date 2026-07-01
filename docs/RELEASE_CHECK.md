# Release / Check Notes

Current checked version: `b120`.

## b117 release asset guard

b117 adds a release asset check to prevent false renderer debugging when HACS installs the card without the GL font binaries.

The productive Card renderer from b116 remains the current geometry baseline:

- Card and Lab share the Physical Lab SVG path.
- The Card scales only the finished physical SVG.
- No separate Card character placement path should be reintroduced.

## Font release rule

ChatGPT ZIPs intentionally do not contain `.ttf`, `.otf`, `.woff` or `.woff2` font binaries.

For a GitHub/HACS release, rebuild locally with the real font files present:

```text
fonts/GL-Nummernschild-Mtl.ttf
fonts/GL-Nummernschild-Eng.ttf
```

After `npm run build`, they must exist under:

```text
dist/fonts/GL-Nummernschild-Mtl.ttf
dist/fonts/GL-Nummernschild-Eng.ttf
```

If they do not exist in Home Assistant after HACS installation, graphical plates will use a browser fallback font and the correct mm geometry will look wrong.

## Check commands

```bash
npm run build
npm run check
```

`npm run check` runs:

```text
node scripts/check-js.mjs
node scripts/check-release-assets.mjs
```

The release asset check:

- fails if `dist/tuev-card.js` is missing,
- fails if a local font binary exists in `fonts/` but not in `dist/fonts/`,
- fails if mirrored font file sizes differ,
- warns, but does not fail, when no local font binaries are present.

## Version sync

- `package.json`: `0.1.1-b120`
- `package-lock.json`: `0.1.1-b120`
- `dist/tuev-card.js` should start with `// TÜV Card bundled b120` after build.
- `src/tuev-card-entry.js` should start with `// TÜV Card source entry b120`.
- Source imports should use `?v=b120`.

## Next renderer work

Do not start another Card renderer rewrite unless b117 has been rebuilt locally with fonts and the installed HACS files were checked first.

When the current one-line renderer remains stable, the next Physical Lab format should be the normal two-line plate format.
