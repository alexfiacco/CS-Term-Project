// node mockups/journeys/x-banner-v2-render.js  -> x-banner-v2.png (1500x500) and x-banner-v2@2x.png
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch();
  for (const [dpr, out] of [[1, 'x-banner-v2.png'], [2, 'x-banner-v2@2x.png']]) {
    const p = await b.newPage({ viewport: { width: 1500, height: 500 }, deviceScaleFactor: dpr });
    await p.goto('file://' + path.join(__dirname, 'x-banner-v2.html'), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.load('600 36px "Bodoni Moda"')); await p.evaluate(() => document.fonts.ready);
    if (!(await p.evaluate(() => [...document.fonts].some((x) => /Bodoni/.test(x.family) && x.status === 'loaded')))) throw new Error('font not loaded');
    await p.waitForTimeout(400);
    if (dpr === 1) console.log(JSON.stringify(await p.evaluate(() => {
      const r = [...document.querySelectorAll('.names span')].map((e) => { const b = e.getBoundingClientRect(); return { n: e.textContent, l: b.left, t: b.top, r: b.right, b: b.bottom }; });
      const bad = [];
      r.forEach((a, i) => { if (a.l < 30 || a.r > 1470 || a.t < 66 || a.b > 434) bad.push('edge ' + a.n); if (a.l < 395 && a.b > 290) bad.push('avatar ' + a.n);
        r.slice(i + 1).forEach((c) => { if (a.l < c.r + 12 && c.l < a.r + 12 && a.t < c.b + 4 && c.t < a.b + 4) bad.push('overlap ' + a.n + ' / ' + c.n); }); });
      return bad; })));
    await p.locator('.scr').screenshot({ path: path.join(__dirname, out) }); await p.close();
  }
  await b.close();
})();
