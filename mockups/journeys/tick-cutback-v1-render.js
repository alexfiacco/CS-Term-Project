// Renders tick-cutback-v1 (combined + six Before | After pairs at 390), 2x, after fonts load:
//   node mockups/journeys/tick-cutback-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'tick-cutback-v1';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 820, height: 844 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all(['600 20px "Bodoni Moda"', '400 15px Inter', '600 15px Inter', '500 22px Newsreader'].map((f) => document.fonts.load(f))));
  await page.waitForTimeout(250);
  await (await page.$('#all')).screenshot({ path: path.join(__dirname, `${n}.png`) });
  for (let i = 1; i <= 6; i++) await (await page.$('#s' + i)).screenshot({ path: path.join(__dirname, `${n}-${i}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
