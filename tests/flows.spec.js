const { test } = require('@playwright/test');
const { openApp, expect } = require('./helpers');

// Abläufe mit gefälschtem Miro-SDK – echtes DOM, echtes Canvas, echtes IndexedDB.
test.describe('flows', () => {
  test('compress replaces a selected image (with confirm dialog)', async ({ page }) => {
    const frame = await openApp(page);
    await frame.evaluate(() => {
      setAutoBackup(false);
      document.getElementById('auto-backup-toggle').checked = false;
      setGroup('optimierung'); setMode('board');
      window.__mock.selection = [window.__mkImage({ id: 'i1', dataUrl: window.__makeNoisyPng(256, 256) })];
    });

    await frame.locator('#compress-board-button').click();
    // Backup aus + <100 Bilder -> Bestätigungsdialog erscheint
    await frame.locator('.modal-overlay [data-confirm]').click();
    await frame.waitForFunction(() => state.running === false && (state.summary.done + state.summary.skipped + state.summary.failed) > 0);

    const r = await frame.evaluate(() => ({
      done: state.summary.done,
      failed: state.summary.failed,
      urlPrefix: window.__mock.selection[0].url.slice(0, 15),
      synced: window.__mock.selection[0].__synced,
    }));
    expect(r.failed).toBe(0);
    expect(r.done).toBe(1);
    expect(r.urlPrefix).toBe('data:image/jpeg');
    expect(r.synced).toBe(1);
  });

  test('audit counts objects, hides the load index and only shows present heavy classes', async ({ page }) => {
    const frame = await openApp(page);
    await frame.evaluate(() => {
      window.__mock.items = [
        ...Array.from({ length: 5 }, (_, i) => ({ type: 'shape', id: 's' + i, x: 0, y: 0, width: 10, height: 10 })),
        ...Array.from({ length: 3 }, (_, i) => ({ type: 'embed', id: 'e' + i, x: 0, y: 0, width: 10, height: 10 })),
        ...Array.from({ length: 2 }, (_, i) => ({ type: 'image', id: 'im' + i, x: 0, y: 0, width: 10, height: 10, getDataUrl: async () => 'data:,' })),
      ];
      setGroup('analyse'); setMode('audit');
    });
    await frame.locator('#run-audit-button').click();
    await frame.waitForFunction(() => state.audit && !state.audit.scanning && !state.audit.error);

    const r = await frame.evaluate(() => {
      const txt = document.getElementById('audit-results').innerText;
      return {
        total: state.audit.total,
        embeds: state.audit.embeds.length,
        images: state.audit.images.length,
        hasIndex: txt.includes('Weighted load index'),
        heavyHasEmbeds: txt.includes('Embeds ·'),   // 3 embeds -> shown
        heavyHasTables: txt.includes('Tables ·'),    // 0 tables -> hidden
      };
    });
    expect(r.total).toBe(10);
    expect(r.embeds).toBe(3);
    expect(r.images).toBe(2);
    expect(r.hasIndex).toBe(false);
    expect(r.heavyHasEmbeds).toBe(true);
    expect(r.heavyHasTables).toBe(false);
  });

  test('manual backup then restore brings back the original', async ({ page }) => {
    const frame = await openApp(page);
    await frame.evaluate(() => {
      const img = window.__mkImage({ id: 'b1', url: window.__makeNoisyPng(64, 64) });
      img.__orig = img.url;
      window.__mock.items = [img];
      setGroup('optimierung'); setMode('board');
      document.getElementById('auto-backup-toggle').closest('details').open = true;
    });

    await frame.locator('#backup-now-button').click();
    await frame.waitForFunction(() => state.running === false && state.summary.done > 0);

    // Bild "verändern", dann letztes Backup wiederherstellen
    await frame.evaluate(() => {
      window.__mock.items[0].url = 'data:image/jpeg;base64,CHANGED';
      document.getElementById('auto-backup-toggle').closest('details').open = true;
    });
    await frame.locator('#restore-latest-button:not([disabled])').click();
    await frame.locator('.modal-overlay [data-confirm]').click();
    await frame.waitForFunction(() => state.running === false && state.summary.done > 0);

    const r = await frame.evaluate(() => ({
      url: window.__mock.items[0].url,
      orig: window.__mock.items[0].__orig,
      synced: window.__mock.items[0].__synced,
    }));
    expect(r.url).toBe(r.orig);
    expect(r.synced).toBeGreaterThan(0);
  });

  test('convert embed creates a sticky with link and removes the original', async ({ page }) => {
    const frame = await openApp(page);
    await frame.evaluate(() => {
      setAutoBackup(false);
      document.getElementById('auto-backup-toggle').checked = false;
      window.__mock.selection = [window.__mkEmbed({ id: 'em1', url: 'https://example.com/page', title: 'Example' })];
      setGroup('optimierung'); setMode('embed');
    });

    await frame.locator('#embed-convert-button').click();
    await frame.locator('.modal-overlay [data-confirm]').click();
    await frame.waitForFunction(() => state.running === false && (state.summary.done + state.summary.failed) > 0);

    const r = await frame.evaluate(() => {
      const calls = window.__mock.calls;
      const sticky = calls.find((c) => c.name === 'createStickyNote');
      return {
        done: state.summary.done,
        stickyHasLink: !!sticky && sticky.payload.content.includes('https://example.com/page'),
        removed: calls.some((c) => c.name === 'remove'),
      };
    });
    expect(r.done).toBe(1);
    expect(r.stickyHasLink).toBe(true);
    expect(r.removed).toBe(true);
  });
});
