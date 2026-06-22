# Privacy Policy – Board Compress

**Last updated: 19 June 2026**

Board Compress is a Miro app for optimizing boards (shrinking images, board audit,
converting embeds into links, local backups). This policy describes which data is
processed while you use it.

*(A German version of this policy is kept as a backup in `PRIVACY.de.md`.)*

## Data controller

- **Provider:** Andreas Lindenberg
- **Contact / support:** andreas@lindenberg.dev

## Summary

**Board Compress does not send any personal data to servers of ours.** There is no
backend server and no database operated by the provider. All processing happens
exclusively in the browser, on the device of the person using the app.

## Which data is processed?

- **Board content (locally, in the browser):** To compress or analyze, the app reads
  objects of the current Miro board through the official Miro Web SDK (permissions
  `boards:read`, `boards:write`). Images are shrunk in the browser via canvas, and
  the result is written back to the board through the SDK.
- **Local backups (on your device only):** When the backup option is enabled, original
  images or embed data are saved before being replaced, in the browser’s local
  database (`IndexedDB`, store `image-compress-backups`). This data never leaves the
  device and is tied to this browser profile.

## What the app does NOT do

- No transmission of board or user data to servers of the provider.
- No tracking, no analytics tools, no advertising, no tracking cookies.
- No selling or sharing of data with third parties.

## Data flows through third parties

- **Miro:** The app runs inside Miro and uses the Miro Web SDK. Miro’s processing of
  your board data is governed by
  [Miro’s privacy policy](https://miro.com/legal/privacy-policy/).
- **Image sources:** When compressing, the app loads image data from the image URLs
  stored in the board (typically Miro’s own storage). No additional external services
  are contacted.

## Retention & deletion

Local backups remain in the browser until they are removed via the “Delete all”
function or the browser data is cleared. There is no server-side storage, hence no
server-side retention period.

## Your rights

Because the provider neither stores nor processes any personal data, there is no
provider-held data that access or deletion requests could relate to. You can delete
local backups yourself at any time. For board data held in Miro, Miro is the
responsible service.

## Changes

This policy may be updated when the app changes. The current version is always
published together with the app.
