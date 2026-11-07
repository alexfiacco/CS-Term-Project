// Renders lane-person-compact-v2 (Now | Proposed at 390, plus Proposed lane at 320), 2x, after fonts load:
//   node mockups/journeys/lane-person-compact-v2-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'lane-person-compact-v2';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 820, height: 844 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all(['600 20px "Bodoni Moda"', '400 15px Inter', '600 15px Inter', '500 22px Newsreader'].map((f) => document.fonts.load(f))));
  await page.waitForTimeout(250);
  for (const [id, out] of [['lane', 'lane'], ['person', 'person'], ['lane320', 'lane-320']])
    await (await page.$('#' + id)).screenshot({ path: path.join(__dirname, `${n}-${out}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
