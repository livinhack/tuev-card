# Kennzeichen-Renderer-Lab

Standalone-Testumgebung für den Nummernschildrenderer. Sie läuft ohne Home Assistant direkt über VS Code Live Server.

## Start

1. Ordner `tools/plate-renderer-lab/` in VS Code öffnen oder im Projekt öffnen.
2. Fontdateien optional hierher kopieren:

```text
fonts/GL-Nummernschild-Mtl.ttf
fonts/GL-Nummernschild-Eng.ttf
```

Alternativ werden auch die Fonts aus `../../fonts/` versucht, wenn der Lab-Ordner im Projekt liegt.

3. `index.html` mit Live Server öffnen.

## Zweck

Diese Testumgebung rendert Kennzeichen zuerst in Millimeter-Koordinaten nach der Regelbasis aus FZV Anlage 4 und zeigt anschließend Maße, gewählte Schrift, Überlaufstatus und Debug-Rahmen an.

Echte amtliche Stempelplaketten, Landeswappen und Druckstücknummern werden bewusst nicht nachgebildet. Die Siegelstellen werden nur als neutrale Platzhalter dargestellt.

## Hinweis

Die Card soll erst nach visueller Prüfung dieses Labs wieder auf den neuen Renderer umgestellt werden. Dadurch vermeiden wir weitere Seiteneffekte im Home-Assistant-Layout.
