# b336 Final Plate Smoke / Release Checkpoint

b336 is the condensed final checkpoint for the Card number-plate renderer track after b334/b335.

## Scope

This checkpoint does not change plate geometry, HU rendering, Wechselkennzeichen geometry, or font paths. It adds a final smoke/release check and updates the handover documentation.

## Protected renderer chain

```text
Card/Editor
→ src/plate/renderer.js
→ src/plate/lab-renderer-adapter.js
→ src/plate/lab-renderer/plate-public-api.js
→ Lab renderer internals
```

## Final smoke matrix

The new `check:plate-final-smoke-matrix` renders the core cases that should stay available from the Card-backed Lab renderer:

- standard one-line plate
- short one-line plate
- long / auto narrow candidate
- season one-line plate
- electric suffix
- historic suffix
- green plate
- two-line plate
- motorcycle plate
- reduced two-line plate
- Wechselkennzeichen with vehicle-specific supplement

The smoke check also verifies:

- full HU badge mode does not fall back to the old `#1ea5ff` placeholder;
- different HU years still create different badge output;
- change-plate rendering keeps the vehicle-specific layer;
- Card/Editor cache markers are current for b336;
- the Full/Card legacy `src/plate/mm-model.js` path stays removed;
- README/HANDOVER keep the b336 and font-release notes visible.

## Release/HACS note

The ChatGPT ZIP intentionally contains no GL TTF binaries. A real GitHub/HACS release must include the GL font files in the expected release asset path before build, otherwise Home Assistant cannot make the graphical plate renderer available.

## Result

With b336, the number-plate renderer part of the Card is considered a final checkpoint. Future work on this area should be bug-fix driven or explicitly scoped, not broad structural cleanup.
