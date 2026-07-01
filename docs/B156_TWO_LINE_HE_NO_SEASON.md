# b156 – Two-line H/E without season

This is a Physical Lab stabilisation step. It does not integrate the two-line renderer into the production Card.

## Change

The two-line lower-row H/E rule now applies whenever the recognition number ends in a final `H` or `E` after a digit, independent of whether a season field is enabled.

Before b156, the balanced H/E lower-row surface solver was only used for `season.enabled && final H/E`. Without season, the group-gap range was already 20-30 mm, but the generic row solver could still solve the row differently than the documented H/E reference chain.

After b156:

- two-line normal lower-row group gap: 24-30 mm
- two-line final H/E lower-row group gap: 20-30 mm across the complete lower row
- the H/E bottom-row solver water-fills outside `*`, character `**`, and H/E group `***` surfaces within their limits
- the rule applies with and without a season field

## Regression examples

- `WIL DE 13H`
- `HH EV 204E`
- `B EQ 203E`
- `CW EE 54E`

## Non-goals

No season geometry, season typography, Eurofield, green plate, one-line, or production Card logic was changed in this step.
