# b70 – Badge stamp frame/text tuning

This iteration starts from the b69 approach and only adjusts the stamp overlay used when `show_badge: true` in compact badge layouts.

## Goal

Keep the stamp frame visually close to the accepted design, but improve text fit and centering in four-column badge layouts.

## Changes

- The red warning stamp frame is slightly wider in compact badge contexts.
- The red warning text is centered more explicitly within the frame.
- The green HU confirmation frame is slightly wider.
- The green confirmation text is reduced a little further.
- The no-badge stamp path remains unchanged.

## Not changed

- No service-call logic changes.
- No animation timing changes.
- No EuroPlate behavior changes.
- No group/editor behavior changes.
- No plate renderer changes.
