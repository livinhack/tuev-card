# b63 stamp flash fix

`b63` fixes a short visual flash that could appear after the `show_badge: false` stamp-confirm animation finished and before Home Assistant applied the service result.

## Problem

After the red warning stamp and green HU confirmation stamp faded out, the card could re-render while the local confirmation state was still active. This restarted the stamp overlay briefly, causing a visible flash.

## Change

For the no-badge stamp overlay only:

- the stamp overlay is explicitly hidden after the fade sequence has finished;
- the service call is triggered shortly after the overlay has been hidden;
- the hidden state prevents a re-render from restarting the animation;
- the existing service flow and error handling remain unchanged.

## Not changed

- `show_badge: true` confirmation behavior
- EuroPlate handling
- card layout
- grouping and sorting
- plate renderer
