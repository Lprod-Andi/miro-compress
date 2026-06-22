# Board Compress — Überblick (Why · How · What)

*Produktdokumentation. Stand: 2026-06-20.*

Eine Miro-App, die schwere, langsame Boards wieder flüssig macht — besonders auf
schwächeren Rechnern. Läuft komplett im Browser, ohne Server.

---

## Why — Warum gibt es Board Compress?

Große Miro-Boards werden mit der Zeit träge: das Laden dauert, Zoomen ruckelt,
„Syncing…" blockiert die Arbeit. Auf älteren oder leistungsschwachen Geräten wird
das schnell zum echten Problem — gerade in Trainings, Workshops und großen
Team-Boards.

Die Ursache ist fast immer dieselbe: **zu viele und zu „schwere" Objekte**. Der
Browser muss alles gleichzeitig zeichnen, im Arbeitsspeicher halten und live mit
allen Teilnehmenden synchronisieren. Die größten Bremsen:

- **Schiere Menge** an Objekten (ab ~1.000 spürbar, über 5.000 rät Miro ab)
- **Embeds / iFrames** — laden ganze Webseiten ins Board, der schwerste Einzeltyp
- **Große, unkomprimierte Bilder** — viele MB pro Bild
- **Tabellen, Dokumente, Kanban, Timelines** — teuer beim Live-Sync

Bisher mussten Nutzende das mühsam von Hand aufräumen — oder wussten gar nicht,
*was* ihr Board bremst. Genau diese Lücke schließt Board Compress: **erst sehen,
was bremst — dann gezielt verschlanken**, ohne dass Daten den Rechner verlassen.

---

## How — Wie löst die App das Problem?

**Grundprinzip: alles lokal, im Browser, ohne Backend.** Die App liest das Board
über das offizielle Miro Web SDK, verarbeitet Bilder per Canvas direkt im Browser
und schreibt das Ergebnis zurück. Es gibt keinen Server, keine Uploads, kein
Tracking.

Drei Bausteine:

1. **Analysieren statt raten.** Ein *Board-Audit* zählt alle Objekte, gleicht sie
   mit Miros Schwellen ab und berechnet einen gewichteten *Lastindex*, der die
   wirklich schweren Klassen (Embeds, Tabellen, große Bilder) priorisiert. Man
   sieht sofort, wo der Hebel sitzt — und kann betroffene Objekte direkt auf dem
   Board markieren.

2. **Gezielt verschlanken.** Bilder werden per Voreinstellung (XS / S / M) klein
   gerechnet; schwere Embeds lassen sich in leichte Link-Notizen umwandeln.

3. **Sicher arbeiten.** Vor jedem Ersetzen kann automatisch ein lokales Backup
   angelegt werden (im Browser), das sich mit einem Klick wiederherstellen lässt.
   Alle riskanten Aktionen sind durch eine Rückfrage abgesichert.

**Design:** an Miros echtes Designsystem (Mirotone) angelehnt, damit sich die App
wie ein nativer Teil von Miro anfühlt. Bewusst aufgeräumt — wenige Knöpfe,
Detail-Optionen sind eingeklappt.

---

## What — Was kann die App konkret?

**Analyse**
- **Board-Audit:** Objektzahl, Ampel (grün / kritisch / über Empfehlung),
  gewichteter Lastindex, Aufschlüsselung nach Last-Dimension (Live-Sync vs.
  Laden/RAM) und nach Typ. Schwere Inhalte (Embeds, Bilder, Tabellen, „Others",
  Objekte außerhalb von Frames) werden gelistet und sind per Klick markierbar.
- **Schwere messen:** ermittelt die Byte-Größe der Bilder und zeigt die größten.
- **Bericht aufs Board:** legt den Audit als beschrifteten Frame (mit Kennzahlen,
  Top-Typen und Empfehlung) direkt aufs Board — editierbar und teilbar.
- **Info:** erklärt, was Boards bremst und was hilft.

**Optimierung**
- **Bilder komprimieren:** Auswahl oder ganzes Board, Größen-Presets XS / S / M
  (rechnen Kante + Qualität automatisch), Detail-Optionen unter „Erweitert".
- **Embeds → Link:** wandelt markierte Embeds in breite Sticky Notes mit Titel +
  klickbarem Link um und entfernt das Original (reversibel).
- **Backup:** automatische Backups (global an/aus schaltbar), manuelles „Jetzt
  sichern" und „Wiederherstellen" des letzten Backups.

**Datenschutz**
- Keine eigenen Server, keine Datenübertragung, kein Tracking. Backups bleiben
  lokal im Browser. Details: [PRIVACY.md](../PRIVACY.md).

---

## Für wen?

Miro-Nutzende mit großen, langsamen Boards — Moderator:innen, Trainer:innen,
Teams — und besonders alle, die auf weniger leistungsstarken Geräten arbeiten.

## Verwandte Dokumente

- Technische Doku: [technische-doku.md](technische-doku.md)
- Marketplace-Listing: [marketplace-listing.md](marketplace-listing.md)
- Datenschutz: [PRIVACY.md](../PRIVACY.md)
