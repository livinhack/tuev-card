# b201 – Reduced upper district anchor

b201 fixes the visible upper district letter drift in the Reduced Standard vertical-seal template.

In b200, one-letter upper rows such as `W` were solved directly against the shared vertical seal X-axis. When the lower row forced a larger plate, the upper letter moved to the right, even though the legal/visual intent for short upper district codes is to stay inside the virtual three-letter district zone.

b201 keeps the complete row-chain width logic, but after the vertical seal X-axis is solved it anchors one- and two-letter upper district codes inside the virtual three-letter district area. The top seal remains on the same X-axis as the lower authority seal. H/E and season continue to force the upper side-by-side seal row.

Regression remains `36/36 cases OK`.
