# b159 – Regression confirmed after Lab-only refactor

b159 is a validation and handover checkpoint after the b158 standalone Physical Lab refactor. The Lab and Full/Home-Assistant-Card projects remain separate working artifacts.

## Authoritative Lab artifact

Use this ZIP for the actual b159 Lab state:

```text
plate-physical-lab-b159-regression-confirmed.zip
```

It is based on `plate-physical-lab-b158-lab-only-refactor-boundaries.zip`. The b158 module split remains the active Lab implementation. b159 adds only visible versioning/documentation and records the regression confirmation.

## Full artifact scope

Use this ZIP for the complete project handover state:

```text
tuev-card-full-b159-regression-confirmed.zip
```

This Full ZIP is a documentation/handover sync derived from the Full b158 docs-sync artifact. It intentionally does not import the standalone Lab b158/b159 code into the production Card project.

Intentionally unchanged in the Full project:

- no production Card renderer integration
- no Card UI/editor change
- no new plate geometry
- no new physical rule
- no bundled font binaries
- no replacement of the Full project's embedded Lab snapshot with the standalone Lab code

## Regression result

The user visually approved the b158 Lab test matrix with “passt”. The automated nine-case model/SVG regression output remains byte-identical across b157, b158 and b159.

```text
SHA256 b157: f869548dffb8b0d1e1b1a7fb87237b50c54ec135dbe797a49e796aadae919043
SHA256 b158: f869548dffb8b0d1e1b1a7fb87237b50c54ec135dbe797a49e796aadae919043
SHA256 b159: f869548dffb8b0d1e1b1a7fb87237b50c54ec135dbe797a49e796aadae919043
```

## Next step

b160 should prepare the Card/Full integration strategy. Do not directly merge the Lab modules into the Card without first defining how the Lab model becomes a production renderer while preserving the split-project workflow and the rule that every step produces both ZIP artifacts.
