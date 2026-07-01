# b158 – Lab-only refactor boundaries and Full handover sync

b158 is a split-project checkpoint. The standalone Physical Lab is the authoritative code artifact for the b158 refactor. The Full/Home-Assistant Card project is included as a separate handover artifact so the documentation, handover state and transition notes stay complete when the chat reaches its limit.

## Authoritative code artifact

Use this ZIP for the actual b158 Lab code:

```text
plate-physical-lab-b158-lab-only-refactor-boundaries.zip
```

It was created from the standalone b157 Lab ZIP and moves the Lab model behind explicit module boundaries:

```text
src/plate/mm-model.js
src/plate/plate-rules.js
src/plate/spacing-solver.js
src/plate/euro-field.js
src/plate/season-field.js
src/plate/plate-svg-renderer.js
src/plate/text-utils.js
```

## Full artifact scope

This Full ZIP is not the working base for the Lab refactor. It is a documentation/handover sync derived from the Full b157 project.

Intentionally unchanged in the Full project:

- no production Card renderer integration
- no Card UI/editor change
- no new plate geometry
- no new physical rule
- no bundled font binaries
- no replacement of the Full project's embedded Lab snapshot with the standalone Lab b158 code

## Validation carried over from Lab b158

The standalone Lab b158 was checked against b157 with the nine regression matrix cases. The generated model/SVG regression output is byte-identical.

```text
SHA256 b157: f869548dffb8b0d1e1b1a7fb87237b50c54ec135dbe797a49e796aadae919043
SHA256 b158: f869548dffb8b0d1e1b1a7fb87237b50c54ec135dbe797a49e796aadae919043
```

## Next step

b159 should visually re-check the b158 standalone Lab against b157/b158 regression cases before preparing any Card/Full integration.
