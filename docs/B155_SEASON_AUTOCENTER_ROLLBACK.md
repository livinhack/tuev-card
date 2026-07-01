# b155 – Season auto-centering rollback

Basis: b153. b154 introduced a Lab-side post-render visible-BBox compensation for season month rows. That compensation produced extreme translation values in the Physical Lab and could move the season digits out of their 30 mm fields.

This version removes the b154 compensation approach and keeps the deterministic season layout:

- no post-render BBox auto-centering
- no manual X correction
- no centering button
- season digits are constructed from digit width + configured digit gap + digit width
- the constructed month width is centered inside each 30 mm season field
- season font size continues to influence both height and constructive width

No physical plate geometry, spacing solver, green plate logic, Euro-field grid, or production Card renderer was changed. The b129 seal-circle change remains reverted.
