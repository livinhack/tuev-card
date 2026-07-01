# b157 – Physical Lab regression/test matrix

b157 is a no-geometry-change Physical Lab stabilisation step after b156. It adds a fixed regression/test matrix to the lab UI so the current one-line and two-line variants can be reloaded and checked before refactor or Card integration.

## Scope

No renderer geometry was intentionally changed. The Card production renderer remains unchanged.

## Added Lab cases

- one-line standard: `DA CI 500`
- one-line H/E: `HH EV 204E`
- one-line season: `DA CI 500` with `04/10`
- one-line green standard: `DA CI 500`
- two-line standard: `DD GD 645`
- two-line season: `DD GD 645` with `04/10`
- two-line H/E: `CW EE 54E`
- two-line season H/E: `CW EE 54E` with `04/10`
- two-line green standard: `DD GD 645`

## Checks shown

The matrix evaluates the active mm-model and reports central values: width, font mode, outside margins, group-gap rule, seal-column rule and whether season/green/H/E mode is active as expected.

The matrix is intended as a quick visual/logic guard. It does not replace final visual inspection in the lab.
