// Renders pitch-layout-v2 at 2x after the fonts load: the whole board, then each v2 phone:
//   node mockups/journeys/pitch-layout-v2-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'pitch-layout-v2';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2160, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  const faces = ['500 28px "Bodoni Moda"', '600 40px "Bodoni Moda"', '600 22px "Bodoni Moda"', '600 17px "Bodoni Moda"', '600 16px "Bodoni Moda"', '400 16px Newsreader', '400 19px Newsreader', '400 15px Inter', '500 15px Inter', '400 13px Inter', '600 13px Inter', '600 11px Inter'];
  await page.evaluate((f) => Promise.all(f.map((x) => document.fonts.load(x))), faces);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  console.log(await page.evaluate((f) => f.map((x) => `${x}: ${document.fonts.check(x)}`).join('\n'), faces));
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  for (const [id, out] of [['f-empty', 'empty'], ['f-typing', 'typing'], ['f-picked', 'picked'], ['f-b', 'b-picked']])
    await (await page.$('#' + id)).screenshot({ path: path.join(__dirname, `${n}-${out}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
