# b107 – Law-oriented auto Engschrift rule in Physical Lab

## Goal

Add an automatic font-selection mode to the standalone physical plate lab without changing the Home Assistant card renderer.

The rule is intentionally conservative:

```text
Use Mittelschrift by default.
Use Engschrift only when Mittelschrift does not fit the relevant maximum/width cap.
```

## Legal interpretation used for the lab

- Anlage 4 FZV keeps Mittelschrift as the default for one-line and standard two-line plates.
- Engschrift is an exception when the intended maximum length is not sufficient or when the prescribed/manufacturer mounting position does not allow Mittelschrift.
- In the lab, width `Auto` uses the one-line maximum width `520 mm` as the relevant cap.
- If the user chooses a fixed width, the lab treats that width as a simulated restricted mounting position.
- b107 does not mix Middle/Narrow inside the same plate. The whole lab plate switches to Engschrift if Mittelschrift does not fit.

## Files changed

- `tools/plate-physical-lab/mm-model.js`
- `tools/plate-physical-lab/app.js`
- `tools/plate-physical-lab/index.html`
- `tools/plate-physical-lab/README.md`
- `HANDOVER.md`
- `docs/B107_AUTO_ENGSCHRIFT_RULE.md`
- `docs/RELEASE_CHECK.md`

## Test examples

Use `Schrift = Auto: Mittelschrift, Engschrift nur wenn nötig`.

Expected behaviour:

- `BKS R 95` should remain Mittelschrift.
- `DA CI 500` should remain Mittelschrift if it fits the relevant width cap.
- `WIL CL 212` should switch to Engschrift when the middle build does not fit within 520 mm.
- Fixed small widths may trigger Engschrift because the selected width simulates a restricted mounting position.
