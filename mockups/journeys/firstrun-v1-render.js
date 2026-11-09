// Renders firstrun-v1.html at 2x, one PNG per sheet: firstrun-v1-1.png ... firstrun-v1-8.png
//   NODE_PATH=/opt/node22/lib/node_modules node mockups/journeys/firstrun-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
const N = 'firstrun-v1';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, N + '.html'), { waitUntil: 'load' });
  await page.evaluate(() => Promise.all(['600 22px "Bodoni Moda"', '400 16px Newsreader', 'italic 400 16px Newsreader', '400 15px Inter', '500 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  const ok = await page.evaluate(() => ['Bodoni Moda', 'Newsreader', 'Inter'].map((f) => [...document.fonts].some((x) => x.family.replace(/"/g, '') === f && x.status === 'loaded')));
  if (ok.includes(false)) throw new Error('fonts not loaded ' + JSON.stringify(ok));
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
  const bad = await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src));
  if (bad.length) throw new Error('images failed ' + bad.join(' '));
  await page.waitForTimeout(500);
  const sheets = await page.$$('section.sheet');
  for (let k = 0; k < sheets.length; k++) await sheets[k].screenshot({ path: path.join(__dirname, `${N}-${k + 1}.png`) });
  console.log('rendered', sheets.length, ok);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
