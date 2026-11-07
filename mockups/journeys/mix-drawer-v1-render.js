// Renders mix-drawer-v1 at 2x after the fonts load: the whole board, then each phone at 390 alone:
//   node mockups/journeys/mix-drawer-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'mix-drawer-v1';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1300, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 28px "Bodoni Moda"', '600 22px "Bodoni Moda"', '500 18px "Bodoni Moda"', '400 16px Newsreader', '400 15px Newsreader', '500 22px Newsreader', '400 15px Inter', '400 13px Inter', '600 11px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  const fonts = await page.evaluate(() => ['600 22px "Bodoni Moda"', '400 16px Newsreader', '400 15px Inter'].map((f) => `${f}: ${document.fonts.check(f)}`));
  console.log(fonts.join('\n'));
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  for (const v of ['now', 'proposed', 'readmore']) await (await page.$(`#${v} .ph`)).screenshot({ path: path.join(__dirname, `${n}-${v}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
