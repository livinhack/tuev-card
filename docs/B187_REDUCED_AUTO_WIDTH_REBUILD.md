# b187 – Reduced Auto Width Rebuild

Dieser Stand ändert keinen Card-Code. Er dokumentiert den separat gelieferten Physical-Lab-Stand b187.

## Hintergrund

b186 hatte noch eine falsche Kopplung zwischen Auto-Breitenwahl und der virtuellen 3-Buchstaben-Hilfszone in der oberen Reduced-Zeile. Diese Hilfszone ist für Positionierung und Debug wichtig, darf aber bei normaler vertikaler Siegelanordnung nicht automatisch die kleineren Breiten blockieren.

## Änderung

- Reduced bleibt Standard-only: kein H/E, keine Saison, kein Grün.
- Auto/Balanced wählt die Breite über echte sichtbare Text-/Gap-/Siegelketten.
- Die virtuelle 3er-Zone blockiert die kompakte Auto-Breite nur noch, wenn die obere Nebeneinander-Siegelreihe aktiv ist.
- `W QU1` springt automatisch auf `200 × 130 mm`.
- Upper-seal-row-Fälle bleiben konservativ bei `255 × 130 mm`.

## Regression

- Lab: `npm run check:regression`
- Ergebnis: `25/25 cases OK`

## Artefakte

- Lab: `plate-physical-lab-b187-reduced-auto-width-rebuild.zip`
- Full: `tuev-card-full-b187-reduced-auto-width-docs-sync.zip`
