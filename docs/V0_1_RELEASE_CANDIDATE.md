# TÜV Card v0.1 / post-v0.1 development notes

Current checked version: `b75`.

## Release status

- `v0.1.0` was prepared as the initial technical test release.
- Later `bXX` checkpoints continue as internal development/test builds.
- `b65` finalized the stamp-based HU confirmation flow as the single confirm UI.
- `b70` documents that flow and updates release checks/README wording.

## Current stable baseline

- Root HACS bundle naming is active: `tuev-card.js` is the production bundle in the repository root.
- The modular source entry is `src/tuev-card-entry.js`.
- HACS should load `/hacsfiles/tuev-card/tuev-card.js`.
- Card type remains `custom:tuev-card`.
- Graphical license plates are available only when `EuroPlate.ttf` is reachable.
- There is no graphical system-font fallback for license plates.
- Group title editing should keep focus while typing.
- Display, color, and manual-sort confirmation floating panels are stable.
- Due/expired HU confirmation uses the stamp-style overlay for both `show_badge: true` and `show_badge: false`.

## Confirmed HU confirmation behavior

1. Click/tap the green `HU bestanden?` / `HU passed?` stamp.
2. The checkmark is drawn.
3. The red/orange warning stamp fades out.
4. The green HU action stamp fades out.
5. The existing `tuev_reminder.confirm_passed` flow runs afterwards.

## Deferred ideas

- Plate Renderer v2 based on FZV Anlage 4.
- Replacing manual `EuroPlate.ttf` installation with bundled GL-Nummernschild fonts, after license/NOTICE review.
- Mittelschrift/Engschrift selection.
- Seasonal, two-line, motorcycle, interchangeable, or other special plate types.
- Group-specific display overrides.
- Compact mode refinements.
- Optional side-by-side group layout for small groups only.
- README screenshots and final image assets, late in the release process.

## Product decisions

- Code and file names stay English.
- User-facing labels are handled through translations.
- ZIP/version numbering continues for generated ZIPs.
- Save/transition checkpoints should be created before the conversation or version chain gets too long.
- Graphical license plates require a real plate font. System-font rendering is intentionally not used for graphical plates.
