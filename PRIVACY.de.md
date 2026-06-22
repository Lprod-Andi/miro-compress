# Datenschutzerklärung – Image Compress

**Stand: 19. Juni 2026**

Image Compress ist eine Miro-App zum Optimieren von Boards (Bilder verkleinern,
Board-Audit, Embeds in Links umwandeln, lokale Backups). Diese Erklärung
beschreibt, welche Daten dabei verarbeitet werden.

## Verantwortlich

- **Anbieter:** Andreas Lindenberg
- **Kontakt / Support:** andreas@lindenberg.dev

## Kurzfassung

**Image Compress sendet keine personenbezogenen Daten an eigene Server.** Es gibt
keinen Backend-Server und keine Datenbank des Anbieters. Die gesamte Verarbeitung
findet ausschließlich im Browser auf dem Gerät der nutzenden Person statt.

## Welche Daten werden verarbeitet?

- **Board-Inhalte (lokal im Browser):** Zum Komprimieren oder Analysieren liest die
  App Objekte des aktuellen Miro-Boards über das offizielle Miro Web SDK
  (Berechtigungen `boards:read`, `boards:write`). Bilder werden im Browser per
  Canvas verkleinert und das Ergebnis über das SDK zurück ins Board geschrieben.
- **Lokale Backups (nur auf dem Gerät):** Wenn die Backup-Option aktiv ist, werden
  Originalbilder bzw. Embed-Daten vor dem Ersetzen in der lokalen Browser-Datenbank
  (`IndexedDB`, Speicher `image-compress-backups`) gesichert. Diese Daten verlassen
  das Gerät nicht und sind an dieses Browserprofil gebunden.

## Was die App NICHT tut

- Keine Übertragung von Board- oder Nutzerdaten an Server des Anbieters.
- Kein Tracking, keine Analyse-Tools, keine Werbung, keine Cookies zu
  Tracking-Zwecken.
- Kein Verkauf oder keine Weitergabe von Daten an Dritte.

## Datenflüsse durch Dritte

- **Miro:** Die App läuft innerhalb von Miro und nutzt das Miro Web SDK. Für die
  Verarbeitung deiner Board-Daten durch Miro gilt die
  [Datenschutzerklärung von Miro](https://miro.com/legal/privacy-policy/).
- **Bildquellen:** Beim Komprimieren lädt die App die Bilddaten von den im Board
  hinterlegten Bild-URLs (in der Regel Miro-eigene Speicher). Es werden keine
  zusätzlichen externen Dienste kontaktiert.

## Speicherdauer & Löschung

Lokale Backups bleiben im Browser, bis sie über die Funktion „Alle löschen"
entfernt oder die Browserdaten gelöscht werden. Es gibt keine serverseitige
Speicherung, daher auch keine serverseitige Aufbewahrungsfrist.

## Rechte der Nutzenden

Da der Anbieter keine personenbezogenen Daten speichert oder verarbeitet, liegen
keine vom Anbieter gehaltenen Daten vor, auf die sich Auskunfts- oder
Löschansprüche beziehen könnten. Lokale Backups können jederzeit selbst gelöscht
werden. Für Board-Daten in Miro ist Miro der verantwortliche Dienst.

## Änderungen

Diese Erklärung kann angepasst werden, wenn sich die App ändert. Der jeweils
aktuelle Stand wird mit der App veröffentlicht.
