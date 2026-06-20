# Image Compress — Technische Dokumentation

*Stand: 2026-06-20. Diese Doku ist bewusst explizit und strukturiert, damit sie
sowohl von Entwickler:innen als auch von LLMs/Agenten zuverlässig gelesen werden
kann.*

> **Orientierung für AI-Agenten:** Das gesamte Produkt ist **eine einzige Datei**:
> `index.html` (HTML + CSS + JS inline, ~174 KB inkl. eingebetteter Schrift).
> Es gibt **keinen Build, kein Framework, kein Backend, keine Module**. Der
> `<script>`-Block ist ein klassisches Script (keine ES-Module) — alle
> Top-Level-`function`-Deklarationen sind im selben Scope sichtbar. Logik ändern =
> in `index.html` editieren. Es gibt keine weiteren Quelldateien.

---

## 1. TL;DR / Architektur in einem Absatz

Image Compress ist eine **client-seitige Single-File-Miro-Panel-App**. Sie wird
von Miro in einem iframe geladen, kommuniziert ausschließlich über das **Miro Web
SDK v2** (`window.miro.board.*`), verarbeitet Bilder lokal per **Canvas** und
speichert optionale Backups in **IndexedDB**. UI-Muster: ein zentrales
`state`-Objekt, jede Änderung ruft `renderAll()`, das das DOM aus `state` neu
aufbaut. Kein externer Netzwerkverkehr außer dem Laden des SDK-Skripts und dem
Abrufen der Board-Bilddaten.

---

## 2. Tech-Stack & Rahmenbedingungen

| Aspekt | Entscheidung |
|---|---|
| Sprache | Vanilla HTML/CSS/JS (ES2020+), keine Frameworks |
| Build | **Keiner.** Datei wird unverändert ausgeliefert |
| Hosting | GitHub Pages (statisch), nur `index.html` nötig |
| Miro | Web SDK v2 (`https://miro.com/app/static/sdk/v2/miro.js`) |
| Scopes | `boards:read`, `boards:write` (minimal) |
| Persistenz | IndexedDB (Backups), localStorage (Flags) |
| Design | Mirotone-Design-Tokens (inline), Open Sans als eingebetteter Variable-Font (Base64) |
| Sicherheit | Content-Security-Policy als `<meta>`-Tag |
| Backend | **Keins.** Keine Server, keine Uploads, kein Tracking |

**Bewusste Constraints (nicht „aus Versehen"):**
- *Single-File:* erleichtert Deploy (eine Datei hochladen) und Review.
- *Schrift eingebettet statt CDN:* kein Versand der Nutzer-IP an Dritte
  (DSGVO/Privacy), bleibt self-contained und CSP-konform.
- *Kein Backend:* maximale Privacy-Story; Konsequenz: keine erzwingbare
  Bezahlschranke und kein IP-Schutz des Codes (siehe §10 Lizenz-Hook).

---

## 3. Anatomie von `index.html`

```
<head>
  <meta CSP>                      … Content-Security-Policy
  <title>Image Compress</title>
  <script src=miro.js>            … Miro Web SDK (extern, einziges Fremd-Skript)
  <style>
    @font-face Open Sans          … Base64-woff2 (Variable, 300–800), eingebettet
    :root { --tokens }            … Mirotone-Farben/Schrift/Radien
    … Komponenten-CSS …
</head>
<body>
  <main class="app">
    header (eyebrow, h1, status-pill)
    nav.tabs            … obere Ebene: Gruppen (Analyse / Optimierung)
    nav.subtabs (×2)    … Werkzeuge je Gruppe
    section#metrics     … Bearbeitet / Gespart
    form#settings-form  … Bereich, Größe XS/S/M, <details>Erweitert, <details>Backup
    section#board-panel … Komprimieren-Button
    section#audit-panel … Board scannen, Ergebnisse, Bericht aufs Board
    section#info-panel  … Erklärtexte
    section#embed-panel … Embeds → Link
    #cancel-row, #progress-card, #log-section
  </main>
  <script> … gesamte App-Logik … </script>
</body>
```

---

## 4. Laufzeitmodell (State + Render)

**Einziges Quellobjekt der Wahrheit:** `state`
```js
state = {
  group,            // 'analyse' | 'optimierung'  (obere Navigationsebene)
  mode,             // 'audit' | 'info' | 'board' | 'embed'  (aktives Werkzeug)
  selectedCount,    // Anzahl ausgewählter Bilder (live via selection:update)
  running,          // ein Lauf (Kompression/Umwandlung/Restore) aktiv?
  busy,             // kurzfristige asynchrone Arbeit (Scan/Messung)?
  cancelRequested,  // Abbruch angefordert?
  summary: { total, done, skipped, failed, savedBytes },
  entries: [],      // Log-Einträge (max. 30)
  audit,            // Ergebnis von runAudit() (oder {error}/{scanning})
  embeds,           // Ergebnis von refreshEmbedSelection()
  backups,          // Ergebnis von loadBackupInfo()
  backupsLoading,   // Guard gegen Mehrfachladen
}
```

**Render-Prinzip:** Es gibt **kein** Virtual DOM. `renderAll()` liest `state` und
schaltet Panels/Buttons/Texte. Untergeordnete Renderer: `renderLog()`,
`renderAudit()`, `renderEmbedPanel()`, `renderBackup()`. **Wichtig:** `renderAll()`
deaktiviert während `running`/`busy` **alle** Buttons/Inputs (außer „Abbrechen" und
Elementen im Modal-Overlay).

**Navigation:** `setGroup(group)` / `setMode(mode)`. Erlaubte Modi pro Gruppe in
`GROUP_MODES`. Beim Wechsel auf `embed` wird die Auswahl automatisch geprüft.

---

## 5. Einstiegspunkte & Miro-Integration

| Auslöser | Code | Zweck |
|---|---|---|
| App-Icon-Klick in Miro | `miro.board.ui.on('icon:click')` (Top-Level, **vor** DOMContentLoaded) | öffnet das Panel via `openPanel({ url: origin+pathname })` |
| DOMContentLoaded | `cacheElements` → `bindUi` → Auto-Backup-Toggle setzen → `wireMiroEntryPoint` → `ensureMigration` → `renderAll` → `refreshSelectionCount` | Initialisierung |
| Verbindungs-Polling | `connectionTimer` (500 ms, max 12×) → `setConnection`, `subscribeSelectionEvents` | „Lokal" vs. „Miro"-Status, Event-Abo |
| Auswahländerung | `miro.board.ui.on('selection:update')` → `onSelectionUpdate` | Live-Aktualisierung von `selectedCount` + Embed-Liste |

**Gotchas (bewusste Lösungen, nicht anfassen ohne Grund):**
- `icon:click` wird **auf oberster Ebene** registriert (nicht erst bei
  DOMContentLoaded), sonst erscheint die App nicht in der Werkzeugleiste.
- `openPanel` bekommt die **blanke** App-URL ohne Query-Parameter — mit
  `?_miro=…&_sdk=…` kommt kein SDK-Handshake zustande und alle `board.*`-Aufrufe
  hängen.
- `hasMiro()` = `isEmbedded() && window.miro?.board`. Außerhalb von Miro
  (lokaler Test) liefert das SDK `SdkConnectionError` — das ist erwartet.

**Genutzte SDK-Aufrufe:** `board.get()`, `board.get({type})`, `board.getSelection()`,
`board.getById()`, `board.select()`, `board.viewport.get()/zoomTo()`,
`board.createFrame/createText/createStickyNote/createEmbed/createImage()`,
`board.remove()`, `board.notifications.showInfo()`, `board.ui.on/openPanel()`,
sowie pro Item: `image.getDataUrl('original')`, `image.sync()`, `image.setMetadata()`.

---

## 6. Feature-Module (Funktionen + Ablauf)

### 6.1 Board-Audit (Analyse)
- `runAudit()` → `board.get()` (mit `withTimeout`), zählt Typen, sammelt
  `frames/images/tables/embeds`, ermittelt via `findItemsOutsideFrames()` Objekte
  außerhalb von Frames → `state.audit`.
- `computeAuditMetrics(counts)` → gewichteter `loadIndex` aus `TYPE_WEIGHTS`
  (analytische Multiplikatoren, **keine gemessenen Miro-Werte**) + Top-Beiträge
  für „Live-Sync-Risiko" und „Lade/RAM-Risiko".
- `objectStatus(total)` → Ampel an `OBJECT_THRESHOLD_SOFT` (1000) /
  `OBJECT_THRESHOLD_MAX` (5000).
- `measureImageBytes()` → lädt je Bild `getDataUrl` und misst Bytes (`sourceByteSize`).
- `renderAudit()` baut die Ergebnis-UI; `bindAuditActions()` verdrahtet
  „Markieren"/„Messen"; `focusItems()`/`focusSelection()` markieren+zoomen.
- `exportAuditToBoard()` → erzeugt `createFrame` + `createText` (Kennzahlen,
  Top-Typen, Empfehlung) und hängt den Text via `frame.add()` in den Frame.
- Anzeige-Helfer: `TYPE_LABELS`, `typeLabel()`, `TYPE_ICONS`, `typeIco()`.

### 6.2 Bildkompression (Optimierung → Bilder)
- `runBoardCompression(settings)` → Lizenz-Check → Items holen → optional
  Backup-Run anlegen → pro Bild `compressExistingImage()`.
- `readSettings()` liest Form: `scope`, `SIZE_PRESETS[sizePreset]` (→ `maxEdge` +
  `quality`), `onlyIfSmaller`, `keepPng`, `rasterizeSpecial`; `createBackup`
  kommt aus `getAutoBackup()` (globaler Schalter).
- `compressExistingImage()` → `getDataUrl('original')` → ggf. Backup
  (`saveBackupRecord`) → `compressDataUrl()` → `image.url = result.dataUrl` →
  `image.sync()` → `image.setMetadata('bildkompressor', …)`.
- Bildpfad: `compressSourceInner` → `fetchImageSource` (bevorzugt `fetch`→Blob,
  Fallback crossOrigin-`<img>`) → `decodeBlob` (`createImageBitmap` oder `<img>`)
  → Canvas → `toDataURL`. CORS-getainttes Canvas wirft sauber abgefangenen Fehler.
- `confirmLargeRun()` zeigt bei ≥100 Bildern bzw. ohne Backup eine Rückfrage.

### 6.3 Embeds → Link (Optimierung → Embeds)
- `refreshEmbedSelection()` (auto bei Tab-Wechsel / `selection:update`) → Liste.
- `convertSelectedEmbeds()` → Lizenz-Check → Rückfrage → pro Embed
  `convertOneEmbed()`: `safeHttpUrl()`-Prüfung → `createStickyNote` (Link) →
  optional `saveEmbedBackupRecord` → `board.remove(embed)`. Alles über `withBackoff`.
- `restoreLatestEmbedRun()` / `restoreEmbedRecord()` machen die Umwandlung
  rückgängig (Embed neu erstellen, Ersatz-Sticky entfernen).

### 6.4 Backup (Bilder-Tab → ▾ Backup)
- Globaler Schalter: `getAutoBackup()/setAutoBackup()` (localStorage
  `image-compress-auto-backup`, Default an). Steuert `createBackup` in
  `readSettings()` **und** `readEmbedSettings()`.
- `runManualBackup()` („Jetzt sichern"), `restoreLatestBackup()`
  („Wiederherstellen", deaktiviert wenn kein Backup), `clearBackups()`.
- `renderBackup()` zeigt Liste/Status; `loadBackupInfo()` lädt aus IndexedDB.

---

## 7. Daten & Speicher

### IndexedDB — DB `image-compress-backups` (Version 1)
| Store | keyPath | Index | Inhalt |
|---|---|---|---|
| `runs` | `id` | – | Backup-Lauf-Metadaten (`kind: 'image' | 'embed'`, `createdAt`, …) |
| `items` | `key` (`"${runId}:${itemId}"`) | `runId` | gesicherte Objekte (Bild-DataURL bzw. Embed-Daten) |

- Öffnen: `openBackupDb()` (= `ensureMigration()` → `openBackupDbRaw()`),
  CRUD-Helfer `dbPut/dbGetAll/dbClear`.
- **Migration:** `migrateLegacyBackups()` übernimmt einmalig Daten aus der alten
  DB `miro-bildkompressor-backups` und löscht sie danach. Guard: localStorage
  `image-compress-backups-migrated`.

### localStorage-Schlüssel
- `image-compress-auto-backup` — `'1'`/`'0'` (Default an)
- `image-compress-backups-migrated` — `'1'` nach erfolgter Migration

---

## 8. Gemeinsame Utilities

`hasMiro`, `isEmbedded`, `notify` (Miro-Toast), `confirmDialog` (Promise-basiertes
In-Panel-Overlay; ersetzt `window.confirm`), `withTimeout`, `withBackoff` (429-
Retry mit Backoff), `wait`, `clamp`, `formatBytes`, `escapeHtml` (XSS-Schutz für
alle in `innerHTML` eingefügten Strings), `safeHttpUrl` (nur http/https),
`isQuotaError`, `messageFrom`, `createBackupRunId`.

---

## 9. Sicherheit & Datenschutz (Ist-Zustand)

- **CSP** (`<meta>`): `default-src 'self' https://miro.com https://*.miro.com;`
  `script-src` zusätzlich `'unsafe-inline'` (Inline-Script nötig); `style-src
  'unsafe-inline'`; `font-src 'self' data:`; `img-src/connect-src` erlauben
  `data:`/`blob:`/`https:`; `object-src 'none'; base-uri 'self'`.
- **XSS:** konsequentes `escapeHtml()` bei dynamischem `innerHTML`; Embed-Links
  über `safeHttpUrl()` (blockt `javascript:`/`data:`).
- **Keine Geheimnisse im Client.** `.env` ist gitignored und wird **nie**
  deployed; die App benötigt sie nicht (reine SDK-/iframe-App).
- **Keine externen Requests** außer SDK-Skript + Board-Bildquellen. Schrift
  eingebettet.

---

## 10. Lizenz-Andockpunkt (für spätere Kommerzialisierung)

- `FEATURES = { compress, embedConvert, audit, backup }` (Feature-Flags).
- `async checkLicense(feature)` liefert heute immer „frei". Wird in
  `runBoardCompression()` und `convertSelectedEmbeds()` aufgerufen. Hier kann
  später eine echte (serverseitige) Prüfung andocken, **ohne** UI-Umbau. Echte
  Bezahlschranke + IP-Schutz erfordern ein Backend (heute bewusst nicht vorhanden).

---

## 11. Lokal entwickeln & testen

Die App läuft voll nur **innerhalb von Miro**. Lokal lässt sich das UI-Verhalten
(Rendering, Tabs, Dialoge, Presets) prüfen — `hasMiro()` ist dann `false`.

```bash
# statischer Server im Projektordner
python -m http.server 3000
# Browser: http://localhost:3000
```

**SDK-Fehler lokal sind normal.** `miro.js` versucht außerhalb von Miro eine
Verbindung und wirft `SdkConnectionError` — kein Bug. Für saubere Screenshots ohne
Netzwerk-Hänger kann man die SDK-Skriptzeile temporär entfernen (Kopie ohne die
`miro.js`-Zeile).

**Deploy:** `index.html` ins GitHub-Repo (`Lprod-Andi/miro-compress`) → GitHub
Pages deployt automatisch. `sdkUri` im Miro-Manifest zeigt auf die Pages-URL.

---

## 12. Funktionsindex (gruppiert)

- **Init/Nav:** `cacheElements`, `bindUi`, `wireMiroEntryPoint`, `setConnection`,
  `setGroup`, `setMode`, `renderAll`, `renderLog`
- **Auswahl:** `refreshSelectionCount`, `subscribeSelectionEvents`, `onSelectionUpdate`
- **Kompression:** `runBoardCompression`, `compressExistingImage`, `readSettings`,
  `confirmLargeRun`, `compressDataUrl`, `compressSourceInner`, `fetchImageSource`,
  `decodeBlob`, `loadImageEl`, `sourceByteSize`, `getTargetSize`, `getDataUrlMime`,
  `estimateDataUrlBytes`, `shouldSkipMime`, `chooseOutputMime`, `formatBytes`
- **Lauf-Lifecycle:** `startRun`, `resetRun`, `finishRun`, `addEntry`
- **Audit:** `runAudit`, `findItemsOutsideFrames`, `measureImageBytes`,
  `objectStatus`, `computeAuditMetrics`, `renderAudit`, `bindAuditActions`,
  `focusItems`, `focusSelection`, `exportAuditToBoard`, `weightFor`, `typeLabel`,
  `typeIco`
- **Embeds:** `domainOf`, `embedLabel`, `refreshEmbedSelection`, `renderEmbedPanel`,
  `readEmbedSettings`, `convertSelectedEmbeds`, `convertOneEmbed`,
  `saveEmbedBackupMeta`, `saveEmbedBackupRecord`, `getLatestRunByKind`,
  `restoreLatestEmbedRun`, `restoreEmbedRecord`
- **Backup/IndexedDB:** `getAutoBackup`, `setAutoBackup`, `openBackupDbRaw`,
  `ensureMigration`, `migrateLegacyBackups`, `openBackupDb`, `saveBackupMeta`,
  `saveBackupRecord`, `restoreLatestBackup`, `restoreBackupRecord`,
  `getBoardItemById`, `getLatestBackupRun`, `getBackupRecords`, `clearBackups`,
  `dbPut`, `dbGetAll`, `dbClear`, `renderBackup`, `loadBackupInfo`, `runManualBackup`
- **Lizenz:** `checkLicense`
- **Utilities:** `isImageItem`, `hasMiro`, `isEmbedded`, `notify`, `confirmDialog`,
  `messageFrom`, `clamp`, `wait`, `safeHttpUrl`, `isQuotaError`, `withTimeout`,
  `withBackoff`, `escapeHtml`, `createBackupRunId`

---

## 13. Glossar

- **Lastindex:** gewichtete Summe aller Objekte (Multiplikatoren aus `TYPE_WEIGHTS`)
  zum *Priorisieren* — analytisch, keine gemessenen Miro-Performance-Werte.
- **Run:** ein zusammenhängender Backup-/Verarbeitungslauf (eigene `runId`).
- **Others:** per SDK nicht lesbare/unbekannte Objekttypen (intern `unsupported`).
- **Panel:** die App-UI im Miro-iframe (über `openPanel` geöffnet).
