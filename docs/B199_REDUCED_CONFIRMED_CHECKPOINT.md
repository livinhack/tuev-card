# b199 – Reduced confirmed checkpoint

b199 is a checkpoint build after the b198 Reduced season-field row-baseline fix.

No renderer logic changed compared with b198. The purpose is to secure the current state before continuing visual Reduced H/E, season and H/E+season validation.

Confirmed baseline:

- `W Q1` can auto-select 180 mm with vertical seals.
- H/E or season requires the upper side-by-side seal row.
- `W Q1H` / `W Q1E` can auto-select 180 mm with upper side-by-side seals.
- `W Q1` with season can auto-select 180 mm with upper side-by-side seals and a lower-row season field.
- `W Q1E` with season steps to 200 mm.
- Reduced season digits render field-locally inside the actual lower row season field.

Open after b199:

1. Visual validation of Reduced H/E.
2. Visual validation of Reduced season.
3. Visual validation of Reduced H/E+season.
4. Refactor later only after the Reduced variant is visually stable.
