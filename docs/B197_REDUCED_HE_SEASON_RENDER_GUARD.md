# b197 – Reduced H/E/Saison Render Guard

Stand: b197

Dieser Stand ist ein Lab-/Handover-Nachlauf zu b196. Card-Code wurde nicht geändert.

## Ziel

- H/E oder Saison dürfen beim verkleinerten zweizeiligen Kennzeichen nicht in das vertikale Standardtemplate fallen.
- Das Saisonfeld muss sichtbar im SVG gerendert werden.
- Manuelle H/E-Lab-Eingaben sollen robuster erkannt werden.

## Änderungen im autoritativen Lab

- `W Q1H` / `W Q1E` erzwingen die obere Nebeneinander-Siegelreihe.
- Manuelle Eingaben wie `W Q 1 H/E` fallen nicht mehr in das vertikale Standardtemplate zurück.
- Saison bleibt Pflichtauslöser für die obere Nebeneinander-Siegelreihe.
- Saisonfeld wird als eigener SVG-Layer gerendert, unabhängig vom Siegel-Layer.
- Regression erweitert auf 35 Fälle.

## Checks

```text
Lab: Regression passed: 35/35 cases OK.
Full: Checked 33 JavaScript files.
Full: Release asset check passed.
```

## Full-/Lab-Sync

`tools/plate-physical-lab/` im Full-ZIP ist weiterhin bewusst nicht synchronisiert/eingefroren. Autoritativ ist das separate Lab-ZIP.
