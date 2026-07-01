# b330 Remove Unused Legacy mm-model

The b330 code removal applies to the Full/Card package only:

- removed: Full/Card `src/plate/mm-model.js`

The standalone Lab keeps its own `src/plate/mm-model.js` compatibility boundary. This is intentional and is checked by `check:renderer-legacy-audit`.
