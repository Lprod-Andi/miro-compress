# Board Compress — Weg zur Miro-Veröffentlichung

*Handover-Dokument. Stand: 2026-06-22. Enthält am Ende einen fertigen Prompt für einen neuen Chat.*

---

## Wo wir stehen ✅

- **App funktioniert im echten Miro-Board** (vom Anbieter verifiziert) — größtes Risiko abgehakt.
- Single-File-App `index.html` (Mirotone-Design, **englische UI**), deployt über **GitHub Pages** (Repo `Lprod-Andi/miro-compress`, live unter `https://lprod-andi.github.io/miro-compress/`).
- Git lokal eingerichtet, Stand gepusht (Commit `1ebc33c`).
- **Automatische Tests:** Playwright-Suite, 12/12 grün (`npm test`).
- **Backups:** deutsche Fassung in Git-Historie (Commit `af1177b`) + lokal `index.backup-de-2026-06-20.html`; Original `index.backup-2026-06-19.html` (beide gitignored).
- Doku vorhanden: `docs/ueberblick.md`, `docs/technische-doku.md`, `docs/marketplace-listing.md`, `PRIVACY.md` (Anbieter: Andreas Lindenberg, Kontakt: andreas@lindenberg.dev).

---

## Strategische Empfehlung: kostenlos starten

Eine reine Browser-App kann **keine Bezahlung erzwingen** (kein Backend). Empfehlung: **v1 kostenlos** veröffentlichen → schnell in den Marketplace, Nutzer + Bewertungen + Feedback sammeln. Eine bezahlte **v2** (Lizenzprüfung über kleinen Backend-Dienst; der Haken `checkLicense()`/`FEATURES` ist schon eingebaut) kommt **danach** als eigenes Projekt. Die Pricing-Entscheidung fällt erst im Listing-Formular — alle Schritte unten gelten unverändert für „kostenlos".

---

## Phase A — Letzte Verifikation im echten Board (Anbieter)

Im **Test-Board** (nicht Produktiv), App neu laden, durchklicken:

- [ ] **Compress**: Bild(er) markieren → „Compress" → Bild wird im Board ersetzt, Qualität ok. *(bereits ok)*
- [ ] **Backup → Restore**: „Back up now" → Bild ändern → „Restore" → Original kommt zurück.
- [ ] **Embed → Link** + **Undo**: Embed markieren → „Convert" → Sticky mit Link, Original weg → „Undo" → Embed zurück.
- [ ] **Report to board**: erzeugt sauberen Frame, Text passt rein.
- [ ] **Audit auf großem Board** (viele Objekte/Bilder): Scan läuft im Timeout durch; „Measure sizes" beobachten (lädt jedes Bild).
- [ ] **Sonderfall**: ein CORS-/GIF-/SVG-Bild → wird sauber „skipped/Fehler" statt Hänger.
- [ ] Konsole (F12) im Board: keine CSP-/JS-Fehler aus dem App-Code.

---

## Phase B — Sicherheit & Konfiguration (Anbieter)

- [ ] 🔴 **Secrets rotieren** im Miro Developer Dashboard (Client-Secret + Access-Token neu generieren). Die alten lagen im Klartext in `.env`. Hinweis: Die App **braucht** diese Secrets nicht (reine SDK-/iframe-App); `.env` ist gitignored und wird nie deployt.
- [ ] **App-Konfiguration prüfen** (Dashboard → deine App):
  - `sdkUri` = `https://lprod-andi.github.io/miro-compress/`
  - `appName` = `Board Compress`
  - Scopes: nur `boards:read`, `boards:write`
- [ ] Sicherstellen, dass nur `index.html` produktiv ausgeliefert wird (Backups/`.env` nicht).

---

## Phase C — Listing vorbereiten, auf Englisch (gemeinsam)

- [ ] **Englisches Marketplace-Listing + PRIVACY** erstellen (Claude liefert die Texte zum Reinkopieren — siehe Prompt unten). Aktuell sind `docs/marketplace-listing.md` und `PRIVACY.md` noch deutsch.
- [ ] **Datenschutz-URL** bereitstellen: nach dem Push erreichbar unter
  `https://github.com/Lprod-Andi/miro-compress/blob/main/PRIVACY.md`
  (oder als eigene Seite hosten).
- [ ] **Screenshots** erstellen (3–5, Panel-Breite ~390 px): Board-Audit mit Ergebnis · Images-Tab mit Einstellungen · laufender Fortschritt/Log · Embeds-Tab · Bestätigungsdialog.
- [ ] **App-Icon** prüfen (liegt im Manifest, Miro-Blau).

---

## Phase D — Im Miro Developer Dashboard einreichen (Anbieter)

1. `https://developers.miro.com` → deine App öffnen.
2. Bereich für **Marketplace / Distribution** (öffentliche Veröffentlichung) aufrufen.
3. Listing-Felder befüllen: Name, Tagline, Beschreibung (EN), Kategorie, Screenshots, **Datenschutz-URL**, Support-Mail (andreas@lindenberg.dev).
4. **Pricing**: „Free" wählen (Empfehlung v1).
5. **Zur Review einreichen** — Miro prüft die App selbst (Funktion, Design-Guidelines, Datenschutz).

---

## Phase E — Finale Gesamt-Prüfung VOR dem „Submit" (gemeinsam)

Das ist der „nochmal alles überprüfen"-Schritt. Im neuen Chat geht Claude das mit dir durch:

- [ ] Alle Phase-A-Flüsse im echten Board ✅
- [ ] `npm test` lokal grün (12/12)
- [ ] Secrets rotiert, `.env` nicht deployt
- [ ] Manifest korrekt (sdkUri, appName, Scopes)
- [ ] Datenschutz-URL erreichbar und korrekt verlinkt
- [ ] Listing-Texte Englisch, fehlerfrei, Screenshots aktuell
- [ ] Keine Konsolen-Fehler im Board
- [ ] Naming überall „Board Compress" (Titel, Manifest, Listing)
- [ ] GitHub: letzter Commit gepusht, nur nötige Dateien öffentlich (kein `.env`, keine Backups)
- [ ] Entscheidung Pricing dokumentiert (Free für v1)

→ Wenn alle Haken sitzen: **einreichen.**

---

## Phase F — Nach der Veröffentlichung (später)

- Nutzer-Feedback + Bewertungen sammeln.
- Bei Bedarf **v2 mit Bezahlmodell**: kleiner Lizenz-/Backend-Dienst, `checkLicense()` aktivieren, rechtliche Themen klären (Verkäufer-Identität, AGB, Umsatzsteuer).
- Optional: Doku (`ueberblick.md`, `technische-doku.md`) auf Englisch.

---

## Offene Punkte (Kurzliste)

| Wer | Punkt |
|---|---|
| Anbieter | Secrets rotieren; Phase-A-Flüsse final testen; Dashboard-Config + Listing + Submit |
| Claude (neuer Chat) | Englisches Listing + PRIVACY liefern; finale Gesamt-Prüfung durchgehen; bei Bugs fixen (TDD: erst Test, dann Fix) |

---

## 🟦 Prompt für den neuen Chat

> Kopiere den folgenden Block als erste Nachricht in einen neuen Chat:

```text
Projekt: Miro-App „Board Compress" unter Z:\Projects\MiroCompress (Single-File index.html,
englische UI, Mirotone-Design). Repo: Lprod-Andi/miro-compress, live über GitHub Pages
(https://lprod-andi.github.io/miro-compress/). Lokal ist ein Git-Repo eingerichtet; Pushes
mache ich selbst (git push, Credential Manager). Es gibt eine Playwright-Testsuite (npm test,
12 Tests). Die App wurde bereits in einem echten Miro-Board getestet und funktioniert.

Lies zuerst docs/veroeffentlichung-naechste-schritte.md — dort steht der ganze Plan.

Ich will die App jetzt offiziell im Miro Marketplace veröffentlichen. Bitte hilf mir damit:

1. Erstelle mir das komplette MARKETPLACE-LISTING auf ENGLISCH zum Reinkopieren
   (Tagline, Kurz- und Langbeschreibung, Kategorie-Vorschlag, Begründung der Scopes
   boards:read/write, Support-Kontakt andreas@lindenberg.dev, Screenshot-Checkliste)
   und übersetze PRIVACY.md ins Englische. Deutsche Fassungen als Backup behalten.

2. Geh dann mit mir die FINALE GESAMT-PRÜFUNG (Phase E im Dokument) Schritt für Schritt
   durch, bevor ich im Miro Developer Dashboard auf „Submit for review" klicke.

3. Falls beim finalen Testen im Board noch etwas hakt: nach test-driven-development
   vorgehen (erst einen Playwright-Test schreiben, der das Problem zeigt, dann fixen).

Wichtig: Ich starte v1 KOSTENLOS (kein Backend/Bezahlschranke jetzt). Offene Anbieter-
Aktionen, an die du mich erinnern darfst: Secrets rotieren, Manifest/Listing/Datenschutz-URL
im Miro Developer Dashboard eintragen.
```
