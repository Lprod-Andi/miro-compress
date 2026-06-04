# Miro Bildkompressor

Minimalistische Single-File-Miro-App zum Verkleinern von Bildern auf einem Miro Board.

## Was muss auf GitHub Pages?

Nur diese Datei:

```text
index.html
```

Mehr nicht. Fuer die neue Variante brauchst du auf GitHub Pages keine `src/`, keine `dist/`, kein `package.json`, kein Vite, kein npm und keinen Workflow.

## Welche lokalen Dateien sind noch sinnvoll?

```text
index.html
README.md
app-manifest.yaml
app-manifest.github-pages.example.yaml
.gitignore
```

Alles andere ist fuer die Single-File-Variante entweder Entwicklungsrest oder lokal erzeugter Output.

## GitHub Pages anlegen

1. Auf GitHub ein neues Repository erstellen, zum Beispiel `miro-bildkompressor`.
2. In dieses Repository nur `index.html` hochladen.
3. In GitHub zu `Settings` -> `Pages` gehen.
4. Bei `Build and deployment` die Quelle `Deploy from a branch` waehlen.
5. Branch `main` und Folder `/root` auswaehlen.
6. Speichern.

Danach bekommst du eine URL in dieser Form:

```text
https://DEIN-GITHUB-USER.github.io/DEIN-REPO-NAME/
```

Diese URL ist spaeter die `sdkUri` fuer Miro.

## Miro App anlegen

In Miro Developers eine neue App erstellen und als Manifest-Vorlage `app-manifest.github-pages.example.yaml` verwenden.

Die wichtige Zeile ist:

```yaml
sdkUri: https://DEIN-GITHUB-USER.github.io/DEIN-REPO-NAME/
```

Noetige Scopes:

```yaml
scopes:
  - boards:read
  - boards:write
```

Danach App installieren, Board oeffnen und das App-Icon anklicken.

## Funktionen

- vorhandene Bilder im Board komprimieren
- Auswahl oder ganzes Board bearbeiten
- lokale Bilder vor dem Einfuegen komprimieren
- komprimierte lokale Bilder direkt ins Board einfuegen
- lokales Backup vor dem Ersetzen
- letztes Backup wiederherstellen
- Fortschritt, Abbruch und Log

## Backup-System

Wenn `Backup vor dem Ersetzen lokal sichern` aktiv ist, speichert die App jedes Originalbild direkt vor dem Ersetzen im lokalen Browser-Speicher (`IndexedDB`) der GitHub-Pages-App.

Das Backup wird nicht an einen externen Server gesendet. Es liegt nur im Browser der Person, die die Komprimierung ausgefuehrt hat.

Im Board-Tab gibt es:

```text
Letztes Backup wiederherstellen
Backups loeschen
```

Die Wiederherstellung versucht zuerst, das bestehende Miro-Bild per Item-ID zurueckzusetzen. Falls das Item nicht mehr existiert, wird das Originalbild neu auf dem Board erstellt.

Wichtig: Browser-Speicher ist nicht unbegrenzt. Bei sehr vielen extrem grossen Bildern kann das Backup gross werden. Fuer wichtige Trainingsboards weiterhin zuerst auf einer Board-Kopie testen.

## Hinweis

Die App verarbeitet Bilder im Browser per Canvas. Es gibt kein Backend und keine externen Uploads ausser dem normalen Einfuegen in Miro.
