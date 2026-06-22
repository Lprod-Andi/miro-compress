const { test } = require('@playwright/test');
const { openApp, expect } = require('./helpers');

// Reine Logik – läuft im echten Browser, aber ohne Miro-SDK-Abhängigkeit.
test.describe('logic', () => {
  test('formatBytes formats sizes', async ({ page }) => {
    const frame = await openApp(page);
    const r = await frame.evaluate(() => [formatBytes(0), formatBytes(1536), formatBytes(5 * 1024 * 1024)]);
    expect(r[0]).toBe('0 B');
    expect(r[1]).toBe('1.5 KB');
    expect(r[2]).toBe('5.0 MB');
  });

  test('getTargetSize downscales by longest edge', async ({ page }) => {
    const frame = await openApp(page);
    const r = await frame.evaluate(() => getTargetSize(2000, 1000, 1000));
    expect(r.width).toBe(1000);
    expect(r.height).toBe(500);
    const noUp = await frame.evaluate(() => getTargetSize(400, 300, 1600));
    expect(noUp.width).toBe(400); // never upscales
  });

  test('safeHttpUrl blocks non-http(s) protocols', async ({ page }) => {
    const frame = await openApp(page);
    const r = await frame.evaluate(() => ({
      js: safeHttpUrl('javascript:alert(1)'),
      data: safeHttpUrl('data:text/html,x'),
      https: safeHttpUrl('https://example.com/x'),
    }));
    expect(r.js).toBe('');
    expect(r.data).toBe('');
    expect(r.https).toBe('https://example.com/x');
  });

  test('escapeHtml escapes dangerous chars', async ({ page }) => {
    const frame = await openApp(page);
    const r = await frame.evaluate(() => escapeHtml('<img src=x onerror="y">&\'"'));
    expect(r).not.toContain('<img');
    expect(r).toContain('&lt;img');
  });

  test('objectStatus thresholds', async ({ page }) => {
    const frame = await openApp(page);
    const r = await frame.evaluate(() => [objectStatus(500).cls, objectStatus(1500).cls, objectStatus(6000).cls]);
    expect(r).toEqual(['ok', 'warn', 'bad']);
  });

  test('computeAuditMetrics weights the load index', async ({ page }) => {
    const frame = await openApp(page);
    const r = await frame.evaluate(() => computeAuditMetrics({ image: 10, tag: 999 }));
    // image weight = 1.44 -> 10 * 1.44 = 14.4 -> round 14; tags are ignored
    expect(r.loadIndex).toBe(14);
  });

  test('size presets drive readSettings', async ({ page }) => {
    const frame = await openApp(page);
    const r = await frame.evaluate(() => {
      const set = (v) => { document.querySelector(`input[name="sizePreset"][value="${v}"]`).checked = true; return readSettings().maxEdge; };
      return { xs: set('xs'), s: set('s'), m: set('m') };
    });
    expect(r.xs).toBe(800);
    expect(r.s).toBe(1200);
    expect(r.m).toBe(1600);
  });

  test('chooseOutputMime keeps PNG only in png-for-png mode', async ({ page }) => {
    const frame = await openApp(page);
    const r = await frame.evaluate(() => [
      chooseOutputMime('image/png', 'png-for-png'),
      chooseOutputMime('image/png', 'jpeg'),
      chooseOutputMime('image/jpeg', 'png-for-png'),
    ]);
    expect(r).toEqual(['image/png', 'image/jpeg', 'image/jpeg']);
  });
});
