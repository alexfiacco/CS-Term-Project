// Renders chooser-names-v1 at 2x after the fonts load: the whole board, then each phone:
//   node mockups/journeys/chooser-names-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'chooser-names-v1';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1760, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  const faces = ['500 28px "Bodoni Moda"', '500 22px "Bodoni Moda"', '400 15px Newsreader', '400 13px Inter', '500 11px Inter', '600 15px Inter', '600 11px Inter'];
  await page.evaluate((f) => Promise.all(f.map((x) => document.fonts.load(x))), faces);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  console.log(await page.evaluate((f) => f.map((x) => `${x}: ${document.fonts.check(x)}`).join('\n'), faces));
  console.log(await page.evaluate(() => document.body.dataset.fit));
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  for (const [id, out] of [['f-now', 'now'], ['f-a', 'a'], ['f-b', 'b'], ['f-c', 'c']])
    await (await page.$('#' + id)).screenshot({ path: path.join(__dirname, `${n}-${out}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
