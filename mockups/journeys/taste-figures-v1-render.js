// Renders taste-figures-v1 at 2x after the fonts load: the whole board, then each phone at 390 alone and
// the widths grid (320 / 375 / 390):
//   node mockups/journeys/taste-figures-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'taste-figures-v1';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1740, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['500 28px "Bodoni Moda"', '400 15px Newsreader', '500 22px Newsreader', '400 13px Inter', '600 16px Inter', '600 11px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  const fonts = await page.evaluate(() => ['500 28px "Bodoni Moda"', '500 22px Newsreader', '400 13px Inter'].map((f) => `${f}: ${document.fonts.check(f)}`));
  console.log(fonts.join('\n'));
  console.log(await page.$eval('#fit', (t) => t.innerText));
  console.log(await page.$$eval('.meas', (m) => m.map((x) => `${x.dataset.for}: ${x.textContent}`).join('\n')));
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  await page.evaluate(() => document.body.classList.add('clean'));
  for (const v of ['now', 'a', 'b', 'c']) await (await page.$('#' + v)).screenshot({ path: path.join(__dirname, `${n}-${v}.png`) });
  await (await page.$('#widths')).screenshot({ path: path.join(__dirname, `${n}-widths.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
