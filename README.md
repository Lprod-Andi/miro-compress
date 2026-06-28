# Board Compress

Board Compress is a single-file Miro app that makes heavy boards smooth again —
especially on lower-spec machines. It compresses board images, audits the board
to find what slows it down, turns embeds into lightweight links, and keeps local
backups. Everything runs in the browser: no backend and no external upload
beyond the normal Miro SDK.

## What it does

- **Compress images** — shrink existing board images in the browser via canvas
  (max-edge + JPEG-quality presets XS/S/M, "only replace if smaller", optional
  PNG preservation). Works on a selection or the whole board.
- **Board Audit** — counts every object, compares it against Miro's thresholds
  (noticeable from ~1,000 objects, recommended under 5,000), breaks the load into
  two risk dimensions (live-sync lag and load/RAM), and flags the heaviest
  content that is actually present on the board (embeds, images, tables, items
  outside frames). Lets you select those objects right on the board. Nothing is
  changed or deleted by the audit itself.
- **Embed → Link** — converts heavy embeds into slim sticky notes with a
  clickable link (reversible).
- **Local backup** — saves originals before replacing them, in the browser's
  local database (IndexedDB). Restore or delete anytime.
- **Report to board** — drops a clean summary frame onto the board so you can
  share audit results with your team.

## For Miro reviewers

A quick map of what to check:

- **Single file.** The entire app is `index.html` — no build step, no bundler,
  no `src/`, no server. The only external resource is the official Miro Web SDK
  (`https://miro.com/app/static/sdk/v2/miro.js`).
- **Scopes — only two, both minimal:**
  - `boards:read` — count objects (audit), read images/embeds, load image data
    for compression.
  - `boards:write` — write compressed images back, convert embeds to sticky
    notes, place the report frame, restore backups.
- **No data leaves the device.** No backend of ours, no tracking, no analytics.
  Image processing happens locally via canvas. Backups live only in the user's
  browser (IndexedDB).
- **Privacy-friendly fonts.** Open Sans is embedded as a data URI — no external
  font request.
- **Safety.** Every destructive action (replace, convert, delete) is behind an
  in-app confirmation dialog; automatic backups are on by default and reversible.
- **Security.** A Content-Security-Policy meta tag restricts sources, and all
  dynamic content is HTML-escaped before it is inserted into the DOM.
- **Privacy policy:** [PRIVACY.md](PRIVACY.md).

## Deploy (GitHub Pages)

Only one file needs to be hosted:

```text
index.html
```

No `src/`, `dist/`, `package.json`, Vite, or npm on the host.

> Note: `index.backup-*.html` are local snapshots of earlier states and must
> **not** be deployed.

Steps:

1. Create a repository (e.g. `miro-compress`).
2. Upload `index.html`.
3. `Settings` → `Pages`.
4. `Build and deployment` → source `Deploy from a branch`.
5. Branch `main`, folder `/root`, save.

The resulting URL …

```text
https://YOUR-GITHUB-USER.github.io/YOUR-REPO/
```

… is the `sdkUri` for Miro.

## Create the Miro app

In Miro Developers, create an app and use
`app-manifest.github-pages.example.yaml` as the manifest template:

```yaml
appName: Board Compress
sdkUri: https://YOUR-GITHUB-USER.github.io/YOUR-REPO/
scopes:
  - boards:read
  - boards:write
```

Install the app, open a board, click the app icon.

## Backups

With backups enabled, the app stores originals before replacing them in the
browser's local database (IndexedDB, store `image-compress-backups`). The data
never leaves the device and is bound to this browser profile.

> Backups from earlier versions (store `miro-bildkompressor-backups`) are
> migrated automatically on first start.

In the Backup section: restore the latest backup, or delete all. Restore first
resets the existing item by ID; if it no longer exists, the original is recreated.

Note: browser storage is limited. For important boards, also keep a board copy in
Miro.

## Tests

Automated tests (Playwright, real browser + mocked Miro SDK):

```bash
npm install && npm run test:install   # once
npm test
```

Details, and what stays manual on purpose: [tests/README.md](tests/README.md).

## Documentation

- Marketplace listing content: [docs/marketplace-listing.md](docs/marketplace-listing.md)
- Overview and technical docs live under [`docs/`](docs/).

## Privacy

No backend, no external uploads beyond the normal insert into Miro. No tracking;
processing happens via canvas in the browser. Content-Security-Policy is set as a
meta tag. Full details: [PRIVACY.md](PRIVACY.md).
