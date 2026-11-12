// node mockups/journeys/b39-render.js -> b39-*.png (deviceScaleFactor 2)
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1800, height: 1000 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(__dirname, 'b39-next-build-v2.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const fonts = await p.evaluate(() => [...document.fonts].filter((x) => x.status === 'loaded').map((x) => x.family));
  if (!fonts.includes('Bod')) throw new Error('Bodoni not loaded');
  const over = await p.evaluate(() => [...document.querySelectorAll('.ph')].map((ph, i) => { const r = ph.getBoundingClientRect(); const bad = [...ph.querySelectorAll('.g > *, .foot')].filter((e) => { const c = e.getBoundingClientRect(); return c.bottom > r.bottom - 6 && getComputedStyle(e.parentElement).position !== 'absolute'; }).length; return bad ? i + ':' + bad : null; }).filter(Boolean));
  console.log('overflow', JSON.stringify(over));
  for (const [id, out] of [['s1', 'b39-home-language-v2.png'], ['s2', 'b39-unlocks-v2.png'], ['s4', 'b39-post-watch-v2.png']])
    await p.locator('#' + id).screenshot({ path: path.join(__dirname, out) });
  await b.close();
})();
