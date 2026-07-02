# b337 Post-Plate Card Cleanup / Open Tasks Audit

b337 starts the Card-finish phase after the b336 plate renderer checkpoint.

## Scope

The user clarified that several plate smoke cases cannot be manually checked yet because the Reminder does not currently expose all needed options/data. Therefore the Card-side plate renderer is treated as **prepared/frozen**, not as fully end-to-end verified.

## Plate renderer freeze rule

No plate geometry changed. Do not continue broad number-plate renderer cleanup after b337. Only touch the plate renderer for:

- a concrete bug found in Home Assistant;
- a clearly scoped Reminder integration requirement;
- a release/build issue such as missing font assets.

The protected chain stays:

```text
Card/Editor
→ src/plate/renderer.js
→ src/plate/lab-renderer-adapter.js
→ src/plate/lab-renderer/plate-public-api.js
→ Lab renderer internals
```

## Remaining Card buckets

### 1. Card/editor finish work

- Review editor config controls that are unrelated to the plate renderer.
- Keep font availability checks stable.
- Do not reintroduce config mutations from availability checks.

### 2. Layout/group/overlay follow-ups

- Group layout behavior, especially small groups side-by-side.
- Overlay visual polish and responsive behavior.
- Preview polish outside the plate SVG internals.

### 3. HACS/font/release readiness

- Real release builds must contain the GL TTF files.
- README should remain end-user oriented.
- Avoid instructions that imply users need manual cache-buster changes.

### 4. Later Reminder integration

When the current Reminder ZIP is provided:

- map the actual Reminder fields/options to Card inputs;
- keep vehicle-specific data in the Reminder/integration side, not permanent Card config where possible;
- run the real Home Assistant matrix for HU colors, months, rotation, season, E/H/green, and Wechselkennzeichen vehicle-specific supplements.

## b337 technical guard

`check:post-plate-card-open-tasks` keeps the b337 status explicit:

- b337 cache/version markers are present;
- b337 docs mention the prepared/frozen plate status;
- Reminder integration is documented as later work;
- the font-binary release note remains visible;
- the b336 final smoke checkpoint doc remains present as history.

b355 note: No plate geometry changed; do not continue broad number-plate renderer cleanup in this diagnostic step. Reminder integration remains a later phase.
