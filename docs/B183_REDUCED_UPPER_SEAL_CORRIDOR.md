# b183 – Reduced upper seal row corridor clearance

## Scope

Documentation sync for the separate Physical Lab work. Card code is unchanged.

Authoritative Lab ZIP:

```text
plate-physical-lab-b183-reduced-upper-seal-corridor.zip
```

Full ZIP:

```text
tuev-card-full-b183-reduced-upper-seal-docs-sync.zip
```

## Change

b183 keeps the b180/b181/b182 Reduced long-lower-row upper seal template, but improves the visual placeholder spacing.

Official field chain remains unchanged:

```text
*** text-to-seal corridor: 5 mm in the long case
45-mm authority seal field
35-mm HU field
right * margin >= 8 mm
```

The visible Lab placeholders now use that otherwise empty `5 mm` corridor:

```text
authority placeholder: 43 mm visible, shifted/borrowed 5 mm left into the *** corridor
HU placeholder:        35 mm visible, shifted 2 mm left
official fields:       still adjacent 45 mm + 35 mm
```

This keeps the right minimum margin while making the upper seal row less visually cramped.

## Not changed

- No Card renderer change.
- No Card integration.
- No Reduced H/E implementation.
- No Reduced season implementation.
- No Reduced green implementation.
- No font binaries.

## Validation

Lab:

```bash
node --check app.js
node --check src/plate/plate-svg-renderer.js
node --check src/plate/regression-cases.js
npm run check:regression
```

Expected:

```text
Regression passed: 23/23 cases OK.
```

Full:

```bash
npm run check
```

Expected: successful, with known font warnings because ChatGPT ZIPs do not include local `.ttf` files.
