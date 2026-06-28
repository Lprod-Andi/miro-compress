# Tests

Automated tests for Board Compress using **Playwright** (real headless Chromium →
real DOM, real canvas, real IndexedDB). The real Miro SDK is intercepted and
replaced with a controllable mock.

## Run

```bash
npm install            # once
npm run test:install   # once: download the Chromium browser
npm test               # all tests
npm run test:headed    # visible browser (debugging)
npm run test:report    # HTML report of the last run
```

## Structure

- **`tests/harness.html`** – loads `index.html` in an iframe so that
  `isEmbedded()`/`hasMiro()` behave like inside real Miro.
- **`tests/helpers.js`** – `installMiroMock()` (a fake `window.miro`, the
  `__mkImage`/`__mkEmbed` factories, a call recorder) and `openApp(page)`.
- **`tests/logic.spec.js`** – pure functions without the SDK: `formatBytes`,
  `getTargetSize`, `safeHttpUrl`, `escapeHtml`, `objectStatus`,
  `computeAuditMetrics` (load index), size presets, `chooseOutputMime`.
- **`tests/flows.spec.js`** – flows with the mock SDK: image compression
  (including the confirmation dialog and real canvas JPEG generation), board
  audit, backup→restore (real IndexedDB), embed→sticky conversion.

## What these tests do NOT cover (deliberately → manual)

The **real** Miro behavior can't be automated: whether Miro persists the
`sync()`ed image, real rate limits, real CORS on Miro's image CDN, and rendering
inside the real panel. Those stay a **manual smoke test in a real board** (see the
release checklist) plus Miro's own app review.

> Note: the `package.json` scripts call Playwright via
> `node node_modules/playwright/cli.js …` (instead of just `playwright …`) so it
> runs independently of the bin shim on every platform.
