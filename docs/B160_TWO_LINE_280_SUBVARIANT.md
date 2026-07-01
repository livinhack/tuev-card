# b160 – Lab two-line 280-mm subvariant

## Zweck

b160 ist ein Split-Projekt-Stand. Der aktive Code-Schritt findet ausschließlich im Standalone Physical Lab statt. Das Full-/Card-Artefakt wird nur für Übergabe, Docs und Version synchronisiert.

## Autoritatives Lab-Artefakt

```text
plate-physical-lab-b160-two-line-280-subvariant.zip
```

## Full-Artefakt

```text
tuev-card-full-b160-two-line-280-docs-sync.zip
```

## Änderung im Lab

Die zweizeilige Untervariante für zwei- und dreirädrige Kraftfahrzeuge wurde als Breitenregel ergänzt:

```text
standard:          260 / 280 / 320 / 340 mm, max 340 mm
twoAndThreeWheel:  260 / 280 mm, max 280 mm
```

Die Variante ist kein neuer Renderer-Typ. Sie nutzt das bestehende zweizeilige physische Modell weiter und begrenzt nur die erlaubten Breitenbänder. Es gibt keinen Fallback auf 320 oder 340 mm.

## Neue Lab-Testmatrixfälle

```text
two-280-standard   K S 70    -> 260 mm, middle
two-280-he         K S 70E   -> 280 mm, middle
two-280-season     K S 70    -> 260 mm, middle
two-280-season-he  K S 70E   -> 280 mm, middle
two-280-green      K S 70    -> 260 mm, middle
```

## Regression

- Bestehende neun b159-SVG-Ausgaben bleiben in b160 byte-identisch.
- SHA256 bestehende neun b160-SVGs: `54cdea8496c0a31f2015d5c803ff9c7fad1715a102fa6f91b9e09306cbb0e2bd`
- Alle 14 b160-Testmatrixfälle bestehen.
- SHA256 b160-Testmatrix-SVGs: `50f499a8734727ad6b10875986357fc7646cb5123a1d2dab3355ef5423531515`

## Full/Card-Status

Im Full-/Card-Projekt wurde kein produktiver Card-Code geändert. Der b160-Full-ZIP dient nur dazu, den aktuellen Übergabe- und Dokumentationsstand vollständig mitzunehmen.

Nicht geändert:

- keine produktive Card-Renderer-Erweiterung;
- keine Card-Editor-/UI-Änderung;
- keine Übernahme des Standalone-Lab-Codes in die Card;
- keine Font-Binärdateien.

## Nächster Schritt

Nächster sinnvoller Lab-Schritt: Kraftradkennzeichen `180–220 × 200 mm` als eigene Geometrie prüfen/umsetzen.
