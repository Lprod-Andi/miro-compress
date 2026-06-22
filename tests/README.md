# Tests

Automatisierte Tests für Board Compress mit **Playwright** (echter Headless-Chromium → echtes DOM, echtes Canvas, echtes IndexedDB). Das echte Miro-SDK wird abgefangen und durch ein steuerbares Mock ersetzt.

## Ausführen

```bash
npm install            # einmalig
npm run test:install   # einmalig: Chromium-Browser laden
npm test               # alle Tests
npm run test:headed    # sichtbarer Browser (Debugging)
npm run test:report    # HTML-Report des letzten Laufs
```

## Aufbau

- **`tests/harness.html`** – lädt `index.html` in einem iframe, damit `isEmbedded()`/`hasMiro()` sich wie im echten Miro verhalten.
- **`tests/helpers.js`** – `installMiroMock()` (gefälschtes `window.miro`, Factories `__mkImage`/`__mkEmbed`, Aufruf-Recorder) und `openApp(page)`.
- **`tests/logic.spec.js`** – reine Funktionen ohne SDK: `formatBytes`, `getTargetSize`, `safeHttpUrl`, `escapeHtml`, `objectStatus`, `computeAuditMetrics` (Lastindex), Größen-Presets, `chooseOutputMime`.
- **`tests/flows.spec.js`** – Abläufe mit Mock-SDK: Bildkompression (inkl. Bestätigungsdialog & echter Canvas-JPEG-Erzeugung), Board-Audit, Backup→Restore (echtes IndexedDB), Embed→Sticky-Umwandlung.

## Was diese Tests NICHT abdecken (bewusst → manuell)

Das **echte** Miro-Verhalten lässt sich nicht automatisieren: ob Miro das `sync()`-Bild dauerhaft speichert, echte Rate-Limits, echtes CORS auf Miros Bild-CDN, und das Rendern im echten Panel. Diese Punkte bleiben **manueller Smoke-Test in einem echten Board** (siehe Release-Checkliste) + Miros eigenes App-Review.

> Hinweis: Die `package.json`-Scripts rufen Playwright über `node node_modules/playwright/cli.js …` auf (statt nur `playwright …`), damit es unabhängig vom Bin-Shim auf jeder Plattform läuft.
