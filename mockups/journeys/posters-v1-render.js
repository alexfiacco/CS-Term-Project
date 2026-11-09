// Renders posters-v1 at 2x with the local fonts: NODE_PATH=/opt/node22/lib/node_modules node mockups/journeys/posters-v1-render.js
// Writes posters-v1-1.png .. posters-v1-4.png (one per sheet: Lately, grouped + drawer, chat + vote, search + Spot on).
const { chromium } = require('playwright');
const path = require('path');
const N = 'posters-v1';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1760, height: 1000 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, N + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 22px "Bodoni Moda"', '400 16px Newsreader', '400 15px Inter', '500 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  const ok = await page.evaluate(() => ['Bodoni Moda', 'Newsreader', 'Inter'].map((f) => [...document.fonts].some((x) => x.family.replace(/"/g, '') === f && x.status === 'loaded')));
  if (ok.includes(false)) throw new Error('fonts not loaded ' + JSON.stringify(ok));
  // Any element wider than its phone (horizontal overflow) is reported.
  const over = await page.evaluate(() => [...document.querySelectorAll('.phone *')].filter((e) => {
    const p = e.closest('.phone').getBoundingClientRect(); const r = e.getBoundingClientRect();
    return r.width > 0 && (r.right > p.right + 0.5 || r.left < p.left - 0.5) && !e.classList.contains('stamp');
  }).map((e) => e.className).slice(0, 10));
  await page.waitForTimeout(500);
  for (const el of await page.$$('[data-shot]')) {
    const s = await el.getAttribute('data-shot');
    await el.screenshot({ path: path.join(__dirname, N + '-' + s + '.png') });
  }
  console.log('rendered', N, ok, 'overflow:', JSON.stringify(over));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
