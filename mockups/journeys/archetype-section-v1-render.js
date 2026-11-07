// Renders archetype-section-v1 at 390, 2x, after the fonts load: the three side by side with the spacing
// guides and the notes, then each phone alone, clean:
//   node mockups/journeys/archetype-section-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'archetype-section-v1';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1300, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 38px "Bodoni Moda"', '600 28px "Bodoni Moda"', '400 15px Newsreader', '500 22px Newsreader', '400 13px Inter', '600 11px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  const fonts = await page.evaluate(() => ['600 38px "Bodoni Moda"', '400 15px Newsreader', '400 13px Inter'].map((f) => `${f}: ${document.fonts.check(f)}`));
  console.log(fonts.join('\n'));
  console.log(await page.$eval('#fit', (t) => t.innerText));
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  await page.evaluate(() => document.body.classList.add('clean'));
  for (const v of ['now', 'p1', 'p2']) await (await page.$('#' + v)).screenshot({ path: path.join(__dirname, `${n}-${v}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
