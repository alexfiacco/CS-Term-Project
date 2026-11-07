// Renders chips-drop-v2 at 2x after the fonts and the poster load: the whole board, then each phone:
//   node mockups/journeys/chips-drop-v2-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'chips-drop-v2';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  const faces = ['500 28px "Bodoni Moda"', 'italic 400 18px "Bodoni Moda"', '400 16px Newsreader', '400 13px Inter', '500 13px Inter', '600 13px Inter', '700 11px Inter'];
  await page.evaluate((f) => Promise.all(f.map((x) => document.fonts.load(x))), faces);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  console.log(await page.evaluate((f) => f.map((x) => `${x}: ${document.fonts.check(x)}`).join('\n'), faces));
  console.log(await page.evaluate(() => [...document.querySelectorAll('.phone')].map((p) => `${p.id} poster ${p.dataset.pt} line ${p.dataset.w}`).join('\n')));
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  for (const [id, out] of [['f-norm', 'normal'], ['f-a', 'a2a'], ['f-b', 'a2b'], ['f-c', 'a2c'], ['f-a-open', 'a2a-open'], ['f-b-open', 'a2b-open'], ['f-c-open', 'a2c-open']])
    await (await page.$('#' + id)).screenshot({ path: path.join(__dirname, `${n}-${out}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
