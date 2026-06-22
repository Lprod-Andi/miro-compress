# Image Compress

Single-File-Miro-App, die schwere Boards wieder flüssig macht – besonders auf
schwächeren Rechnern. Komprimiert Bilder, analysiert das Board (Audit), wandelt
Embeds in Links um und legt lokale Backups an. Alles läuft im Browser, ohne
eigenen Server.

## Was muss auf GitHub Pages?

Nur diese Datei:

```text
index.html
```

Mehr nicht – keine `src/`, kein `dist/`, kein `package.json`, kein Vite, kein npm,
kein Workflow.

> Hinweis: `index.backup-*.html` sind lokale Sicherungen früherer Stände und
> gehören **nicht** auf GitHub Pages.

## Sinnvolle lokale Dateien

```text
index.html
README.md
PRIVACY.md
app-manifest.yaml
app-manifest.github-pages.example.yaml
docs/marketplace-listing.md
.gitignore
```

## GitHub Pages anlegen

1. Repository erstellen, z. B. `miro-compress`.
2. Nur `index.html` hochladen.
3. `Settings` → `Pages`.
4. `Build and deployment` → Quelle `Deploy from a branch`.
5. Branch `main`, Folder `/root`, speichern.

Ergebnis-URL der Form:

```text
https://DEIN-GITHUB-USER.github.io/DEIN-REPO-NAME/
```

Diese URL ist die `sdkUri` für Miro.

## Miro-App anlegen

In Miro Developers eine App erstellen und als Manifest-Vorlage
`app-manifest.github-pages.example.yaml` verwenden. Wichtig:

```yaml
appName: Image Compress
sdkUri: https://DEIN-GITHUB-USER.github.io/DEIN-REPO-NAME/
scopes:
  - boards:read
  - boards:write
```

App installieren, Board öffnen, App-Icon anklicken.

## Funktionen

- vorhandene Board-Bilder komprimieren (Auswahl oder ganzes Board)
- Board-Audit: Objektzahl, gewichteter Lastindex, schwerste Inhalte
- Embeds in schlanke Links (Sticky Notes) umwandeln – reversibel
- lokales Backup vor dem Ersetzen, Wiederherstellen, Löschen
- Fortschritt, Abbruch und Log

## Backup-System

Bei aktivem Backup speichert die App Originale vor dem Ersetzen in der lokalen
Browser-Datenbank (`IndexedDB`, Speicher `image-compress-backups`). Die Daten
verlassen das Gerät nicht und sind an dieses Browserprofil gebunden.

> Backups früherer Versionen (Speicher `miro-bildkompressor-backups`) werden beim
> ersten Start automatisch übernommen.

Im Backup-Tab: letztes Backup wiederherstellen, alle löschen. Die
Wiederherstellung setzt zuerst das bestehende Item per ID zurück; existiert es
nicht mehr, wird das Original neu erstellt.

Wichtig: Browser-Speicher ist begrenzt. Für wichtige Boards zusätzlich eine
Board-Kopie in Miro anlegen.

## Sicherheit & Datenschutz

- Kein Backend, keine externen Uploads außer dem normalen Einfügen in Miro.
- Kein Tracking. Verarbeitung per Canvas im Browser.
- Content-Security-Policy als Meta-Tag gesetzt.
- Details: [PRIVACY.md](PRIVACY.md).

## Tests

Automatisierte Tests (Playwright, echter Browser + gefälschtes Miro-SDK):

```bash
npm install && npm run test:install   # einmalig
npm test
```

Details & was bewusst manuell bleibt: [tests/README.md](tests/README.md).

## Dokumentation

- Überblick (Why · How · What): [docs/ueberblick.md](docs/ueberblick.md)
- Technische Doku (Entwickler & LLMs): [docs/technische-doku.md](docs/technische-doku.md)

## Marketplace

Vorbereitete Listing-Inhalte: [docs/marketplace-listing.md](docs/marketplace-listing.md).
