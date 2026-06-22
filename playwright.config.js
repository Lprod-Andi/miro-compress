const { defineConfig, devices } = require('@playwright/test');

// Image Compress – Test-Konfiguration.
// Die App wird über einen kleinen iframe-Harness (tests/harness.html) geladen,
// damit isEmbedded()/hasMiro() wie im echten Miro greifen. Ein statischer
// Server liefert die Dateien aus; das echte Miro-SDK wird im Test abgefangen
// und durch ein Mock ersetzt (siehe tests/helpers.js).
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 8000 },
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3100',
    headless: true,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'python -m http.server 3100',
    port: 3100,
    reuseExistingServer: true,
    timeout: 30000,
  },
});
