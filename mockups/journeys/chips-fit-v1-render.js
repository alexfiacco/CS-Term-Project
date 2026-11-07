// Renders chips-fit-v1 at 2x after the fonts and posters load: the whole board, then each phone and the wording table:
//   node mockups/journeys/chips-fit-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'chips-fit-v1';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  const faces = ['500 28px "Bodoni Moda"', 'italic 400 18px "Bodoni Moda"', '400 16px Newsreader', '400 13px Inter', '600 13px Inter', '700 11px Inter'];
  await page.evaluate((f) => Promise.all(f.map((x) => document.fonts.load(x))), faces);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  console.log(await page.evaluate((f) => f.map((x) => `${x}: ${document.fonts.check(x)}`).join('\n'), faces));
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  for (const [id, out] of [['f1-now', '1-picker-now'], ['f1-new', '1-picker-proposed'], ['f2-now', '2-result-now'], ['f2-new', '2-result-proposed'],
    ['f3-a', '3-relax-notice'], ['f3-b', '3-relax-drop-another'], ['f4-now', '4-room-now'], ['f4-new', '4-room-proposed'], ['wording', 'wording']])
    await (await page.$('#' + id)).screenshot({ path: path.join(__dirname, `${n}-${out}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
