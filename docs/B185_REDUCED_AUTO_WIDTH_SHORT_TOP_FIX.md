# b185 – Reduced auto width and short-top centering fix

b185 ist ein Lab-/Docs-Stand ohne Card-Codeänderung.

## Ausgangspunkt

b184 zeigte bei verkleinert zweizeilig Standard mit kurzer Oberzeile und oberer Siegelreihe:

- Auto-/Balanced-Breite konnte durch die virtuelle 3er-Zone falsch wirken.
- Bei manueller Breite konnte die kurze Oberzeile ihre saubere Zentrierung verlieren oder negative Debug-Margins erzeugen.

## Änderung

- Auto/Balanced akzeptiert eine Breite nur, wenn die vollständige virtuelle 3er-Zone legal zwischen Eurofeld, Text→Siegel-Korridor und oberer Siegelreihe passt.
- Manuelle Breiten, die dafür zu schmal sind, klemmen nur die effektive Anzeigezone; die sichtbaren Buchstaben bleiben darin zentriert.
- Reduced H/E, Saison und Grün bleiben deaktiviert.

## Artefakte

- Lab: `plate-physical-lab-b185-reduced-auto-width-short-top-fix.zip`
- Full: `tuev-card-full-b185-reduced-auto-width-short-top-docs-sync.zip`
