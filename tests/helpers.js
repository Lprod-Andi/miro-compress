const { expect } = require('@playwright/test');

// Wird VOR den App-Skripten in jedem Frame ausgeführt: ersetzt window.miro durch
// ein steuerbares Mock-SDK und stellt Test-Factories (__mkImage/__mkEmbed) bereit.
function installMiroMock() {
  const mock = { selection: [], items: [], calls: [], created: [] };
  window.__mock = mock;
  const rec = (name, payload) => { mock.calls.push({ name, payload }); };

  // Erzeugt ein verrauschtes PNG als data-URL (rauscht schlecht in PNG -> JPEG wird kleiner).
  window.__makeNoisyPng = (w, h) => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(w, h);
    for (let i = 0; i < img.data.length; i += 4) {
      img.data[i] = (i * 7) % 255;
      img.data[i + 1] = (i * 13) % 255;
      img.data[i + 2] = (i * 29) % 255;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return c.toDataURL('image/png');
  };

  window.__mkImage = (o = {}) => {
    const item = {
      type: 'image',
      id: o.id || ('img-' + mock.created.length + '-' + (mock.items.length + mock.selection.length)),
      title: o.title || 'Image',
      url: o.url || '',
      x: o.x ?? 0, y: o.y ?? 0, width: o.width ?? 100, height: o.height ?? 100, rotation: 0,
      __orig: o.url || '',
      __synced: 0,
      getDataUrl: async () => o.dataUrl || item.url,
      sync: async function () { this.__synced++; rec('image.sync', this.id); },
      setMetadata: async (k, v) => rec('setMetadata', { k, v }),
    };
    return item;
  };

  window.__mkEmbed = (o = {}) => ({
    type: 'embed',
    id: o.id || ('emb-' + mock.created.length),
    title: o.title || '',
    url: o.url || '',
    previewUrl: o.previewUrl || '',
    providerName: o.providerName || '',
    x: o.x ?? 0, y: o.y ?? 0, width: o.width ?? 360, height: o.height ?? 200, rotation: 0,
  });

  window.miro = {
    board: {
      getSelection: async () => mock.selection,
      get: async (q) => {
        const items = mock.items;
        if (!q) return items;
        if (q.type) return items.filter((i) => i.type === q.type);
        if (q.id) return items.filter((i) => i.id === q.id);
        return items;
      },
      getById: async (id) =>
        mock.items.find((i) => i.id === id) || mock.selection.find((i) => i.id === id) || null,
      select: async (a) => rec('select', a),
      viewport: { get: async () => ({ x: 0, y: 0, width: 1200, height: 800 }), zoomTo: async () => {} },
      createFrame: async (o) => {
        rec('createFrame', o);
        const f = { id: 'frame-' + (mock.created.length + 1), type: 'frame', ...o, add: async (it) => rec('frame.add', it && it.id) };
        mock.created.push(f); return f;
      },
      createText: async (o) => { rec('createText', o); const t = { id: 'text-' + (mock.created.length + 1), type: 'text', ...o }; mock.created.push(t); return t; },
      createStickyNote: async (o) => { rec('createStickyNote', o); const s = { id: 'sticky-' + (mock.created.length + 1), type: 'sticky_note', ...o }; mock.created.push(s); return s; },
      createEmbed: async (o) => { rec('createEmbed', o); const e = { id: 'embed-' + (mock.created.length + 1), type: 'embed', ...o }; mock.created.push(e); return e; },
      createImage: async (o) => { rec('createImage', o); const im = { id: 'image-new-' + (mock.created.length + 1), type: 'image', ...o }; mock.created.push(im); return im; },
      remove: async (it) => rec('remove', it && it.id),
      notifications: { showInfo: async () => {} },
      ui: { on: () => {}, openPanel: async () => {} },
    },
  };
}

// Lädt den Harness, fängt das echte SDK-Skript ab und gibt den App-Frame zurück.
async function openApp(page) {
  await page.route('**/sdk/v2/miro.js', (route) => route.abort());
  await page.addInitScript(installMiroMock);
  await page.goto('/tests/harness.html');
  const handle = await page.waitForSelector('#app');
  const frame = await handle.contentFrame();
  await frame.waitForFunction(
    () => document.readyState === 'complete' && typeof renderAll === 'function' && typeof window.__mock !== 'undefined'
  );
  return frame;
}

module.exports = { installMiroMock, openApp, expect };
