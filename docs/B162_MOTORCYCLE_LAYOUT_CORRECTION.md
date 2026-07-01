# b162 – Motorcycle layout correction in standalone Lab

## Scope

b162 is a Lab correction and documentation sync step.

The productive Home Assistant Card code is not changed in this step. The standalone Physical Lab is the authoritative working project for renderer validation; the Full ZIP is updated only to keep `HANDOVER.md`, `docs/` and version metadata current for handover safety.

## Why b162 exists

b161 added `motorcycle` as a width-limited 180-220 × 200 mm format, but it still reused too much of the standard two-line renderer. That was not sufficient because Kraftradkennzeichen do not differ only by overall size.

The correction is based on the Anlage-4-FZV detail layout noted during review:

- Kraftradkennzeichen have 180-220 mm width and 200 mm height.
- The Euro field is identical to the two-line Euro field.
- The Kraftrad text fields use reduced 49 mm character fields.
- The reduced middle script dimensions are relevant; no narrow-script fallback is used in this Lab model.
- The seal arrangement is not the vertical seal column from standard two-line plates.
- Section 4 number 2a remains important for H/E.
- Section 5 number 2a remains important for season.

## Lab changes

The standalone Lab b162 updates the `motorcycle` format:

```text
width bands: 180 / 200 / 220 mm
outer height: 200 mm
inner inset: 4.5 mm
inner height: 191 mm
euro field: 40 × 88 mm, same as two-line
upper character field: y 10.5 mm, height 49 mm
middle seal band: 45 mm high, center y 100 mm
lower character field: y 140.5 mm, height 49 mm
letter cell width: 31 mm
digit cell width: 29 mm
HU placeholder: 35 mm
authority seal placeholder: 45 mm
bottom recognition group gap: 5-20 mm
font policy: reduced middle script only
```

The vertical model follows:

```text
4.5 + 6 + 49 + 18 + 45 + 18 + 49 + 6 + 4.5 = 200 mm
```

## Regression status

- Existing fourteen non-motorcycle b160 cases remain byte-identical in the Lab.
- Five motorcycle cases now validate the corrected 49 mm character field, middle-only font policy, motorcycle width bands, 35/45 mm seal placeholders and 5-20 mm recognition group gap.

Hashes from the b162 Lab validation:

```text
existing 14 cases: 7e15978c05e2b4e5066a93840bb2fec09716a4959b67737737ec2e2add1df699
motorcycle 5 cases: 4bc589a481afb859fef9af0f25bfa7d9daddf6365dc9c915542e77e53a48cff2
complete 19 cases: d1a776e2cc4fc752bc2423679cd3d0a0a7cbb1980974712b2a79f5f1ef47f42c
```

## Important note

b162 replaces b161 as the valid Kraftrad base. b161 should be considered a structural placeholder that was corrected immediately after visual/rule review.

The next Lab step should visually inspect b162 and then decide whether H/E and season require a dedicated b163 correction before moving on to verkleinerte zweizeilige Kennzeichen.
