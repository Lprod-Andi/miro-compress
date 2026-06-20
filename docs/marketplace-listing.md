# Miro Marketplace – Listing-Paket für „Image Compress"

Vorbereitete Inhalte für die Einreichung im Miro Developer Dashboard
(App → Marketplace listing / App review). Felder ggf. an die aktuelle
Dashboard-Maske anpassen.

## Eckdaten

| Feld | Wert |
|---|---|
| **App-Name** | Image Compress |
| **Tagline** (kurz) | Boards verschlanken: Bilder verkleinern, Embeds zu Links, Board-Audit |
| **Kategorie (Vorschlag)** | Productivity / Utilities |
| **Plattform** | Web SDK (SDK_V2), Panel-App |
| **Preis** | Kostenlos |
| **Sprachen** | Deutsch |
| **Berechtigungen** | `boards:read`, `boards:write` |
| **Hosting / sdkUri** | https://lprod-andi.github.io/miro-compress/ |
| **Datenschutz-URL** | Link zu `PRIVACY.md` (z. B. GitHub-Raw oder eigene Seite) |
| **Support-Kontakt** | andreas@lindenberg.dev |

## Kurzbeschreibung (für die Übersicht, ~max. 250 Zeichen)

> Image Compress macht schwere Miro-Boards wieder flüssig – besonders auf
> schwächeren Rechnern. Verkleinere Bilder direkt im Board, wandle schwere Embeds
> in leichte Links um und finde mit dem Board-Audit die größten Bremsen. Backups
> bleiben lokal im Browser.

## Langbeschreibung

> **Warum Image Compress?**
> Große, unkomprimierte Bilder, viele Objekte und eingebettete Webseiten (Embeds)
> bremsen Miro-Boards aus: langsames Laden, ruckeliges Zoomen, „Syncing…". Image
> Compress hilft, ein Board gezielt zu verschlanken – ohne Daten aus dem Browser
> zu schicken.
>
> **Funktionen**
> - **Bilder komprimieren:** Vorhandene Board-Bilder per Canvas verkleinern
>   (max. Kante & JPEG-Qualität einstellbar, „nur ersetzen wenn kleiner",
>   PNG-Beibehaltung optional). Auswahl oder ganzes Board.
> - **Board-Audit:** Zählt alle Objekte, gleicht sie mit Miros Schwellen ab
>   (ab ~1.000 spürbar, unter 5.000 empfohlen) und zeigt einen gewichteten
>   Lastindex sowie die schwersten Inhalte (Embeds, Bilder, Tabellen, Objekte
>   außerhalb von Frames). Markiert Kandidaten direkt auf dem Board.
> - **Embed → Link:** Wandelt schwere Embeds in schlanke Sticky Notes mit
>   klickbarem Link um (reversibel über „Rückgängig").
> - **Lokales Backup:** Sichert Originale vor dem Ersetzen in der Browser-Datenbank
>   (IndexedDB) – wiederherstellbar, jederzeit löschbar.
>
> **Datenschutz**
> Keine eigenen Server, kein Tracking. Die gesamte Verarbeitung läuft im Browser.
> Backups verlassen das Gerät nicht.

## Begründung der Berechtigungen (für das App-Review)

- **`boards:read`** – nötig, um Board-Objekte zu zählen (Audit), Bilder und Embeds
  auszulesen und die Bilddaten zum Komprimieren zu laden.
- **`boards:write`** – nötig, um komprimierte Bilder zurückzuschreiben, Embeds in
  Sticky Notes umzuwandeln und Backups wiederherzustellen.

Es werden ausschließlich diese beiden minimal nötigen Scopes verwendet.

## Hinweise für die Reviewer

- Single-File-App (`index.html`), keine externen Abhängigkeiten außer dem
  offiziellen Miro Web SDK (`https://miro.com/app/static/sdk/v2/miro.js`).
- Content-Security-Policy als Meta-Tag gesetzt.
- Alle Aktionen mit destruktivem Potenzial (Ersetzen, Umwandeln, Löschen) sind
  durch einen In-App-Bestätigungsdialog abgesichert; Backups sind standardmäßig
  aktiv und reversibel.
- Keine Datenübertragung an Dritt-Server.

## Screenshot-Checkliste (für das Listing)

Empfohlen 3–5 Screenshots, Panel-Breite (~ 320–400 px Inhalt):

- [ ] Board-Audit mit Ergebnis (Objektzahl, Lastindex, schwere Inhalte)
- [ ] Tab „Bilder" mit Einstellungen (Qualität, max. Kante)
- [ ] Laufender Komprimierungs-Fortschritt + Log
- [ ] Tab „Embed → Link" mit erkannten Embeds
- [ ] Bestätigungsdialog (zeigt Sicherheits-/Backup-Hinweis)

## Vor dem Absenden prüfen

- [ ] `app-manifest.yaml`: `appName: Image Compress`, korrekte `sdkUri`
- [ ] Datenschutz-URL erreichbar
- [x] Support-E-Mail eingetragen (andreas@lindenberg.dev) – Listing + `PRIVACY.md`
- [ ] Test in einem echten Board: Icon erscheint, Panel öffnet, alle Tabs laufen
- [ ] `.env` mit Secrets ist **nicht** deployed (nur lokal)
