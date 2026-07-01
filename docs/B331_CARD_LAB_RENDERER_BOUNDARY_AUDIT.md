# b331 – Card/Lab Renderer Boundary Audit

b331 is a small audit checkpoint after b330.

## Goal

Verify that the Card-facing plate renderer still has a clean boundary after the Lab renderer integration:

```text
tuev-card-entry.js / editor.js
→ src/plate/renderer.js
→ src/plate/lab-renderer-adapter.js
→ src/plate/lab-renderer/plate-public-api.js
→ Lab renderer internals
```

## Rules checked

- `src/plate/renderer.js` remains a thin public Card boundary.
- Card/Editor code must not import Lab renderer internals directly.
- Card/Editor code must not import `lab-renderer-adapter.js` directly.
- `lab-renderer-adapter.js` may import only:
  - `src/plate/lab-renderer/plate-public-api.js`
  - `src/plate/font.js`
- The adapter must not bypass the Lab public API by importing geometry/render internals directly.
- Full-HU-badge activation remains explicit in the adapter.
- Change-plate pass-through remains explicit in the adapter.

## Result

No renderer geometry was changed and no files were removed in b331. The new check documents and protects the current boundary before later cleanup steps.
