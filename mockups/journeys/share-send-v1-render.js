// Renders share-send-v1 at 2x after the fonts load: the whole board, then the film page Now and Proposed, the drawer,
// the glyph places, the three Social frames and the inventory:
//   node mockups/journeys/share-send-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'share-send-v1';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['500 28px "Bodoni Moda"', '400 16px Newsreader', '400 13px Inter', '600 15px Inter', '600 11px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  console.log(await page.evaluate(() => ['500 28px "Bodoni Moda"', '400 16px Newsreader', '400 13px Inter'].map((f) => `${f}: ${document.fonts.check(f)}`).join('\n')));
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  for (const [id, out] of [['film-now', 'film-now'], ['film-new', 'film-proposed'], ['drawer', 'drawer'], ['places', 'places'], ['soc-now', 'social-now'], ['soc-new', 'social-proposed'], ['soc-fb', 'social-fallback'], ['inventory', 'inventory']])
    await (await page.$('#' + id)).screenshot({ path: path.join(__dirname, `${n}-${out}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
