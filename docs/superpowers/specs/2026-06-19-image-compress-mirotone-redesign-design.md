# Image Compress — Mirotone-Redesign & Marketplace-Reife

**Datum:** 2026-06-19
**Status:** freigegeben

## Ziel
Die bestehende Single-File-Miro-App (`index.html`) optisch auf Miros echtes
Designsystem **Mirotone** bringen, für den Miro Marketplace härten und in
**„Image Compress"** umbenennen. Die Funktionslogik bleibt unverändert — es ist
ein Re-Skin + Härtung + Doku, kein funktionaler Umbau.

## Entscheidungen (aus Brainstorming)
- **Redesign-Tiefe:** echtes Miro-Design, Tokens **inline** (Single-File bleibt, keine externe Abhängigkeit, CSP-sauber).
- **Monetarisierung:** jetzt reviewfertig & kostenlos; Andock-Punkt für spätere Lizenzprüfung vorbereiten (kein Backend).
- **Hosting:** vorerst wie gehabt (GitHub Pages).
- **Name:** „Image Compress" überall.
- **Backup:** altes `index.html` lokal als `index.backup-2026-06-19.html` (nicht deployen).

## 1. Design-Tokens (echte Mirotone-Werte, inline ersetzt)
| Zweck | Neu (Mirotone) |
|---|---|
| Primär / Buttons | `#314cd9`, Hover `#2a41b6` |
| Akzent / Flächen hell | `#3859ff` / `#f7f8fc`, `#d9dffc` |
| Text / Ink | `#343741` |
| Muted | `rgba(9,9,9,.6)` |
| Linien | `#e0e1e6`, kräftig `#c1c3cd` |
| Flächen-Grau | `#f3f4f6` |
| OK / Warn / Bad | `#1a7b02` / `#d7b029` / `#9c1825` |
| Schrift | `"Open Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` |
| Größen / Radius | 12/14/16px, Radius 8px |

Schrift bleibt System-Stack (Open Sans zuerst) — kein externer Font-Request.

## 2. Komponenten im Miro-Look
Buttons, Tabs, Segmented-Control, Inputs, Range-Slider, Cards, Badges,
Progress-Bar, Log-Zeilen, Drop-Zone, Status-Pill werden auf Mirotone-Optik
gebracht (Höhen, Radien, Hover/Active/Focus-States, blauer Fokus-Ring).
Layout/Struktur bleibt. Reines Skin.

## 3. Naming → „Image Compress"
- `<title>`, Header-H1, `eyebrow`
- `appName` im Manifest
- IndexedDB: neuer Name `image-compress-backups` **mit Migration** vom alten
  `miro-bildkompressor-backups` (bestehende Backups übernehmen, sonst gehen sie verloren)
- `app`-Feld in Backup-Metadaten

## 4. Marketplace-Härtung
- **Produktions-Manifest** `app-manifest.yaml`: `sdkUri` → `https://lprod-andi.github.io/miro-compress/`, `appName: Image Compress`
- **CSP-Meta-Tag** im `<head>`: erlaubt nur `self` + `https://miro.com` (SDK) + benötigte `img-src`/`connect-src` (data:, blob:, https: für Bildquellen)
- **`window.confirm` → In-Panel-Bestätigungsdialog** im Mirotone-Stil (4 Stellen: großer Kompressionslauf, Embed-Umwandlung, Embed-Restore, Backups löschen). Promise-basiert, ersetzt native Popups.
- **`index.live.html`** entfernen (Duplikat-Risiko).

## 5. Listing-Paket (neue Dateien)
- `PRIVACY.md` — Datenschutzerklärung (keine Server, Backups nur lokal im Browser, keine Weitergabe, kein Tracking).
- `docs/marketplace-listing.md` — Name, Tagline, Kategorie, Kurz-/Langbeschreibung, Scope-Begründung, Support-Kontakt, Screenshot-Checkliste.
- `README.md` aktualisiert auf „Image Compress".

## 6. Lizenz-Andockpunkt (kein Backend)
- `const FEATURES = { ... }` zentrale Feature-Flags.
- `async function checkLicense()` — liefert heute immer `true`; dokumentierter Einhängepunkt für spätere serverseitige Prüfung.

## Nicht im Scope
- Kein Backend, keine echte Bezahlschranke, kein Code-Schutz.
- Keine Änderung an Audit-Index-Berechnung, Kompressions-, Embed- oder Backup-Logik.
- Kein Hosting-Wechsel.

## Verifikation
- Datei lokal im Browser öffnen: rendert ohne JS-Fehler, Tabs/Subtabs schalten, „Lokal"-Status korrekt, Dialoge erscheinen als In-Panel-Overlay.
- IndexedDB-Migration: alter Store wird gelesen, Daten landen im neuen Store.
- Manifest/CSP syntaktisch gültig.
