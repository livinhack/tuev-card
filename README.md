# TÜV Reminder Card b332

Full handover ZIP for b332.

b332 is a Card/Lab adapter-options audit checkpoint on top of b331. It keeps the renderer boundary unchanged and centralizes Card-owned Lab renderer defaults inside `src/plate/lab-renderer-adapter.js`.

No renderer geometry was changed, no HU behavior was changed, and no files were removed in this step.

## Checks

- `npm run check`
- `npm run build`

## Notes

Font binaries are not included in this ChatGPT ZIP. For GitHub/HACS, the GL font TTF files still need to be present in the real repository/release assets.
