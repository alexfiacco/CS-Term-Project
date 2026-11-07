// Renders pitch-options-v1 at 2x after the fonts and posters load: the whole board, then each phone and the notes:
//   node mockups/journeys/pitch-options-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'pitch-options-v1';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  const faces = ['500 28px "Bodoni Moda"', '600 17px "Bodoni Moda"', '400 18px Newsreader', '400 15px Inter', '600 13px Inter', '600 11px Inter'];
  await page.evaluate((f) => Promise.all(f.map((x) => document.fonts.load(x))), faces);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  console.log(await page.evaluate((f) => f.map((x) => `${x}: ${document.fonts.check(x)}`).join('\n'), faces));
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  for (const [id, out] of [['n1', '1-ask-now'], ['n2', '2-answer-now'], ['n3', '3-add-now'], ['today', '4-today-notes'],
    ['p1', '5-ask-proposed'], ['p2', '6-person-picker'], ['p3', '7-genre-picker'], ['p4', '8-words-and-chips'],
    ['p5', '9-add-menu'], ['p6', '10-added'], ['rec', '11-recommendation']])
    await (await page.$('#' + id)).screenshot({ path: path.join(__dirname, `${n}-${out}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
