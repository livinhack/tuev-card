# b197 – Reduced H/E/Saison Render Guard

## Ziel

Gezielter Nachlauf zu b196: sichtbare H/E- oder Saisonvarianten dürfen nicht in das vertikale Standardtemplate zurückfallen und das Saisonfeld muss unabhängig vom Siegel-Layer im SVG erscheinen.

## Änderungen

- H/E-Erkennung für Reduced robuster gemacht.
  - `W Q1H` und `W Q1E` erzwingen die obere Nebeneinander-Siegelreihe.
  - Manuell getrennte Lab-Eingaben wie `W Q 1 H/E` werden ebenfalls als H/E-Anforderung behandelt, damit die sichtbare H/E-Zeichenkette nicht vertikal gerendert wird.
- Saison bleibt Pflichtauslöser für die obere Nebeneinander-Siegelreihe.
- Saisonfeld wird als eigener SVG-Layer gerendert und nicht mehr nur zusammen mit dem Siegel-Layer ausgegeben.
- Regression erweitert auf 35 Fälle.

## Erwartete Kurzfälle

- `W Q1` → 180 mm, Standard mit vertikalen Siegeln.
- `W Q1H` / `W Q1E` → 180 mm, obere Nebeneinander-Siegelreihe.
- `W Q1` + Saison → 180 mm, obere Nebeneinander-Siegelreihe und Saisonfeld sichtbar.
- `W Q1E` + Saison → 200 mm, obere Nebeneinander-Siegelreihe und Saisonfeld sichtbar.

## Check

```text
Regression passed: 35/35 cases OK.
```
