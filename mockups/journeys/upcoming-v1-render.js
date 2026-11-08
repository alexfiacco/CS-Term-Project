// Renders upcoming-v1 at 2x after the fonts and posters load: the whole board, then each phone at 390 alone:
//   node mockups/journeys/upcoming-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'upcoming-v1';
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 1760, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['500 28px "Bodoni Moda"', '600 18px "Bodoni Moda"', '500 22px "Bodoni Moda"', '400 15px Newsreader', '500 13px Newsreader', '400 15px Inter', '500 15px Inter', '600 15px Inter', '600 11px Inter', '600 10px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  const fonts = await page.evaluate(() => ['600 18px "Bodoni Moda"', '400 15px Newsreader', '400 15px Inter'].map((f) => `${f}: ${document.fonts.check(f)}`));
  const imgs = await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src));
  console.log(fonts.join('\n') + `\nbroken images: ${imgs.length} ${imgs.join(' ')}`);
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  const names = { browse: ['browse-now', 'browse-a', 'browse-b', 'browse-pick'], wl: ['watchlist-now', 'watchlist-a', 'watchlist-b', 'watchlist-pick'] };
  for (const [id, list] of Object.entries(names)) {
    const phones = await page.$$(`#${id} .ph`);
    for (let i = 0; i < list.length; i++) await phones[i].screenshot({ path: path.join(__dirname, `${n}-${list[i]}.png`) });
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
