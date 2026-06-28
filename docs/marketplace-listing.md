# Miro Marketplace – Listing pack for “Board Compress”

Ready-to-paste content for submission in the Miro Developer Dashboard
(App → Marketplace listing / App review). Adjust field names if the current
dashboard form differs.

## Key facts

| Field | Value |
|---|---|
| **App name** | Board Compress |
| **Tagline** (short) | Slim down heavy boards: shrink images, turn embeds into links, audit your board |
| **Category (suggested)** | Productivity / Utilities |
| **Platform** | Web SDK (SDK_V2), panel app |
| **Price** | Free |
| **Languages** | English |
| **Permissions** | `boards:read`, `boards:write` |
| **Hosting / sdkUri** | https://lprod-andi.github.io/miro-compress/ |
| **Privacy policy URL** | https://github.com/Lprod-Andi/miro-compress/blob/main/PRIVACY.md |
| **Support contact** | andreas@lindenberg.dev |

## Tagline (one line, ~60–80 chars)

> Slim down heavy boards: shrink images, turn embeds into links, audit your board.

## Short description (for the overview, ~250 chars)

> Board Compress makes heavy Miro boards responsive again — especially on
> lower-spec machines. Shrink images right inside the board, turn heavy embeds
> into lightweight links, and use the Board Audit to find your biggest slowdowns.
> Backups stay local in your browser.

## Long description

> **Why Board Compress?**
> Large uncompressed images, thousands of objects, and embedded web pages (embeds)
> slow Miro boards down: sluggish loading, choppy zooming, endless “Syncing…”.
> Board Compress helps you slim a board down on purpose — without sending any data
> to a server of ours.
>
> **What it does**
> - **Compress images:** Shrink existing board images in the browser via canvas
>   (configurable max edge & JPEG quality, “only replace if smaller”, optional
>   PNG preservation). Work on your selection or the whole board.
> - **Board Audit:** Counts every object, compares it against Miro’s thresholds
>   (noticeable from ~1,000 objects, staying under 5,000 recommended), breaks the
>   load into two risk dimensions (live-sync lag and load/RAM), and flags the
>   heaviest content actually present on the board (embeds, images, tables, items
>   outside frames). Selects the candidates right on the board so you can act fast.
> - **Embed → Link:** Converts heavy embeds into slim sticky notes with a clickable
>   link (reversible via “Undo”).
> - **Local backup:** Saves originals before replacing them, in your browser’s
>   local database (IndexedDB) — restorable anytime, deletable anytime.
> - **Report to board:** Drops a clean summary frame onto the board so you can
>   share audit results with your team.
>
> **Privacy**
> No servers of ours, no tracking. All processing happens in your browser.
> Backups never leave your device. See our privacy policy for details.

## Permission justification (for app review)

- **`boards:read`** — required to count board objects (audit), read out images and
  embeds, and load image data for compression.
- **`boards:write`** — required to write compressed images back, convert embeds into
  sticky notes, drop the report frame, and restore backups.

Only these two minimally necessary scopes are used. No other scopes are requested.

## Notes for the reviewers

- Single-file app (`index.html`), no external dependencies other than the official
  Miro Web SDK (`https://miro.com/app/static/sdk/v2/miro.js`).
- Content-Security-Policy set as a meta tag.
- Every action with destructive potential (replace, convert, delete) is guarded by
  an in-app confirmation dialog; backups are on by default and reversible.
- No data is transmitted to any third-party server.

## Screenshot checklist (for the listing)

Recommended 3–5 screenshots, panel width (~320–400 px of content):

- [ ] Board Audit with result (object count, risk dimensions, heaviest content)
- [ ] “Images” tab with settings (quality, max edge)
- [ ] Compression in progress + log
- [ ] “Embeds” tab with detected embeds
- [ ] Confirmation dialog (showing the safety/backup note)

## Check before submitting

- [ ] `app-manifest.yaml`: `appName: Board Compress`, correct `sdkUri`
- [ ] Privacy policy URL reachable
- [x] Support email entered (andreas@lindenberg.dev) — listing + `PRIVACY.md`
- [ ] Tested in a real board: icon appears, panel opens, all tabs work
- [ ] `.env` with secrets is **not** deployed (local only)
