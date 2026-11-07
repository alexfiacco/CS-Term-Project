// Renders poster-badges-v1 at 390 wide, 2x, after the Google fonts (Bodoni Moda, Inter, Newsreader) load,
// measures every badge's contrast from the render itself, writes the numbers into the tables, then
// screenshots the page and each frame:
//   node mockups/journeys/poster-badges-v1-render.js
// Contrast: the page is screenshotted twice, as shown and with the badge glyphs transparent (body.measure).
//   Text  = WCAG ratio of the badge colour vs the lightest 5% of the pixels behind its glyphs (under the ink only).
//   Fig   = the height of the badge's digits in points (font size x the face's digit height, 0.77em Bodoni, 0.70em Newsreader).
//   Ink   = WCAG ratio of each rendered glyph pixel vs the same pixel without the glyph (median, share >= 4.5).
//   Edge  = the badge's outer colour (border or chip) vs the poster in a 3px ring around it (3:1 target).
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const N = 'poster-badges-v1';
const FRAMES = ['now', 'a', 'b', 'c', 'rec'];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, N + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all(['600 20px "Bodoni Moda"', '600 12px "Bodoni Moda"', '400 15px Inter', '600 11px Inter', '600 16px Newsreader', '400 16px Newsreader'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => null))));
  const ok = await page.evaluate(() => {
    const got = new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')));
    return ['Bodoni Moda', 'Inter', 'Newsreader'].map((f) => got.has(f));
  });
  if (ok.includes(false)) throw new Error(`fonts not loaded ${JSON.stringify(ok)}`);
  const broken = await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src));
  if (broken.length) throw new Error('images missing: ' + broken.join(', '));
  await page.waitForTimeout(300);

  // Two passes for the measurement.
  const shown = (await page.screenshot({ fullPage: true })).toString('base64');
  await page.evaluate(() => document.body.classList.add('measure'));
  await page.waitForTimeout(100);
  const bare = (await page.screenshot({ fullPage: true })).toString('base64');
  await page.evaluate(() => document.body.classList.remove('measure'));

  const results = await page.evaluate(async ({ shown, bare }) => {
    const load = (b) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + b; });
    const [i1, i2] = await Promise.all([load(shown), load(bare)]);
    const px = (img) => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, c.width, c.height); };
    const A = px(i1), B = px(i2), W = A.width, S = 2;
    const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    const cr = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const hexLum = (h) => lum(parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16));
    const rgbLum = (s) => { const m = s.match(/\d+(\.\d+)?/g).map(Number); return lum(m[0], m[1], m[2]); };
    const mctx = document.createElement('canvas').getContext('2d');
    // Digit height from the font files at weight 600 (fontTools): Bodoni Moda's 8 is 0.77em at every opsz,
    // Newsreader's 0.70em. Canvas measureText rounds to whole pixels, so the ratio is used instead.
    const digitH = (el) => { const cs = getComputedStyle(el); return parseFloat(cs.fontSize) * (/Bodoni/.test(cs.fontFamily) ? 0.77 : 0.70); };
    const out = [];
    for (const t of document.querySelectorAll('table[data-table]')) {
      const id = t.dataset.table;
      const sec = document.getElementById(id);
      const edgeHex = sec.querySelector('.ph').dataset.edge;
      const rows = [];
      for (const g of sec.querySelectorAll('[data-b]')) {
        const r = g.getBoundingClientRect();
        if (r.right > 390 || r.left < 0) continue; // scrolled off the strip
        const tileEl = g.closest('.tile');
        const textL = rgbLum(getComputedStyle(g).color);
        const x0 = Math.ceil((r.left + window.scrollX + 1) * S), x1 = Math.floor((r.right + window.scrollX - 1) * S);
        const y0 = Math.ceil((r.top + window.scrollY + 1) * S), y1 = Math.floor((r.bottom + window.scrollY - 1) * S);
        const bgL = [], ink = []; let iy0 = 1e9, iy1 = -1;
        for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
          const k = (y * W + x) * 4;
          const lb = lum(B.data[k], B.data[k + 1], B.data[k + 2]);
          const d = Math.abs(A.data[k] - B.data[k]) + Math.abs(A.data[k + 1] - B.data[k + 1]) + Math.abs(A.data[k + 2] - B.data[k + 2]);
          if (d > 30) { ink.push(cr(lum(A.data[k], A.data[k + 1], A.data[k + 2]), lb)); bgL.push(lb); iy0 = Math.min(iy0, y); iy1 = Math.max(iy1, y); }
        }
        bgL.sort((a, b) => a - b); ink.sort((a, b) => a - b);
        const bg95 = bgL[Math.floor(bgL.length * 0.95)];
        const row = {
          poster: tileEl.dataset.poster, where: { row: 'row', 3: '3-up', 4: '4-up' }[tileEl.dataset.grid],
          text: cr(textL, bg95), figH: digitH(g), inkMed: ink[Math.floor(ink.length / 2)], ink45: ink.filter((v) => v >= 4.5).length / ink.length,
        };
        if (edgeHex) {
          const bd = g.closest('.bd').getBoundingClientRect();
          const ex0 = Math.round((bd.left + window.scrollX) * S), ex1 = Math.round((bd.right + window.scrollX) * S);
          const ey0 = Math.round((bd.top + window.scrollY) * S), ey1 = Math.round((bd.bottom + window.scrollY) * S);
          const pr = tileEl.querySelector('.po').getBoundingClientRect();
          const px0 = (pr.left + window.scrollX) * S, px1 = (pr.right + window.scrollX) * S, py0 = (pr.top + window.scrollY) * S, py1 = (pr.bottom + window.scrollY) * S;
          let sum = 0, n = 0; const R = 3 * S;
          for (let y = ey0 - R; y < ey1 + R; y++) for (let x = ex0 - R; x < ex1 + R; x++) {
            if (x >= ex0 && x < ex1 && y >= ey0 && y < ey1) continue;
            if (x < px0 || x >= px1 || y < py0 || y >= py1) continue; // the ring inside the poster only
            const k = (y * W + x) * 4; sum += lum(B.data[k], B.data[k + 1], B.data[k + 2]); n++;
          }
          row.edge = cr(hexLum(edgeHex), sum / n);
        }
        rows.push(row);
      }
      out.push({ id, rows });
    }
    // Fill the tables.
    const f = (v) => v.toFixed(1) + ':1';
    const cls = (v, lo, hi) => (v >= hi ? 'ok' : v >= lo ? 'mid' : 'bad');
    for (const { id, rows } of out) {
      const tb = document.querySelector(`table[data-table="${id}"] tbody`);
      tb.innerHTML = rows.map((r) => `<tr><td>${r.poster}</td><td>${r.where}</td><td>${r.figH.toFixed(1)}</td><td class="${cls(r.text, 3, 4.5)}">${f(r.text)}</td><td>${f(r.inkMed)}</td><td>${Math.round(r.ink45 * 100)}%</td>${r.edge != null ? `<td class="${cls(r.edge, 1.5, 3)}">${f(r.edge)}</td>` : ''}</tr>`).join('');
      const s = (k) => rows.reduce((a, r) => a + r[k], 0) / rows.length, mn = (k) => Math.min(...rows.map((r) => r[k]));
      tb.insertAdjacentHTML('beforeend', `<tr><td><b>Worst<br>mean</b></td><td></td><td>${s('figH').toFixed(1)}</td><td class="${cls(mn('text'), 3, 4.5)}">${f(mn('text'))}<br>${f(s('text'))}</td><td>${f(s('inkMed'))}</td><td>${Math.round(s('ink45') * 100)}%</td>${rows[0].edge != null ? `<td>${f(mn('edge'))}<br>${f(s('edge'))}</td>` : ''}</tr>`);
    }
    return out;
  }, { shown, bare });
  fs.writeFileSync(path.join(__dirname, N + '-contrast.json'), JSON.stringify(results, (k, v) => (typeof v === 'number' ? Math.round(v * 100) / 100 : v), 1));

  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(__dirname, N + '.png'), fullPage: true });
  for (const s of FRAMES) await (await page.$('#' + s)).screenshot({ path: path.join(__dirname, `${N}-${s}.png`) });
  for (const { id, rows } of results) {
    const avg = (k) => (rows.reduce((a, r) => a + r[k], 0) / rows.length).toFixed(2);
    console.log(id, 'text min', Math.min(...rows.map((r) => r.text)).toFixed(2), 'text avg', avg('text'), 'ink med avg', avg('inkMed'), 'ink>=4.5', avg('ink45'), 'figH', avg('figH'), rows[0].edge != null ? 'edge min ' + Math.min(...rows.map((r) => r.edge)).toFixed(2) : '');
  }
  console.log('rendered', N, ok);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
