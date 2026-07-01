# b161 – Lab: Kraftradkennzeichen-Geometrie

b161 ist ein Split-Projekt-Checkpoint.

Das autoritative Code-Artefakt ist:

```text
plate-physical-lab-b161-motorcycle-geometry.zip
```

Das Full-Artefakt enthält nur aktuelle Übergabe-/Dokumentationsinformationen und keine produktive Card-Renderer-Integration.

## Lab-Änderung

Im standalone Physical Lab wurde `motorcycle` als eigene Formatvariante für Kraftradkennzeichen ergänzt.

Regel:

```text
Kraftradkennzeichen: 180 / 200 / 220 mm Breite
Höhe:                200 mm
```

Der Solver darf bei `motorcycle` nicht auf 260 / 280 / 320 / 340 mm ausweichen.

## Abgrenzung zu b160

b160 war die zweizeilige Untervariante für zwei-/dreirädrige Kraftfahrzeuge mit 260 / 280 mm.

b161 ist dagegen eine eigene Kraftrad-Formatvariante mit 180 / 200 / 220 mm. Sie nutzt intern den zweizeiligen physischen Zeilenrenderer, bleibt aber als eigener Format-Key im Lab-Modell erhalten.

## Full-Status

Nicht geändert:

- keine produktive Card-Renderer-Erweiterung
- keine Card-Editor-/UI-Änderung
- keine neue produktive Kennzeichengeometrie
- kein Austausch des eingebetteten Full-Lab-Snapshots gegen standalone Lab b161
- keine Font-Binärdateien

Geändert:

- `HANDOVER.md` auf b161 aktualisiert
- `docs/B161_MOTORCYCLE_GEOMETRY.md` ergänzt
- `README.md` um b161-Hinweis ergänzt
- `package.json` und `package-lock.json` auf `0.1.1-b161` gesetzt

## Validierung standalone Lab b161

- Bestehende vierzehn b160-SVG-Ausgaben sind in b161 byte-identisch.
- SHA256 bestehende vierzehn b161-SVGs: `50f499a8734727ad6b10875986357fc7646cb5123a1d2dab3355ef5423531515`
- Alle fünf neuen Kraftradfälle bestehen.
- SHA256 neue Kraftrad-SVGs: `5bad70ebaab7e3cf54c13f2e4fcb739a385525d6f5d84d320838c60e91157a62`
- SHA256 komplette b161-Testmatrix-SVGs: `d12406d20f92886179510e65f75a80a7c2523490ca7c6ea33d55226661b1ece6`


## Nächster Schritt

b162: verkleinerte zweizeilige Kennzeichen `255 × 130 mm` im Lab prüfen/umsetzen.
