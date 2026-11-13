// Renders b92 at 2x after fonts load: node mockups/journeys/b92-filters-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
  const shots = [['b92-filters-now', [['#board', 'b92-filters-now']]],
                 ['b92-filters-proposed', [['#p1', 'b92-filters-proposed'], ['#p2', 'b92-filters-proposed-2']]]];
  for (const [html, list] of shots) {
    await page.goto('file://' + path.join(__dirname, html + '.html'), { waitUntil: 'networkidle' });
    await page.evaluate(() => Promise.all(['600 22px "Bodoni Moda"', '500 18px "Bodoni Moda"', '400 15px Inter', '500 15px Inter', '600 13px Inter'].map((f) => document.fonts.load(f))));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.body.dataset.ready === '1');
    console.log(html, await page.evaluate(() => ['600 22px "Bodoni Moda"', '400 15px Inter'].map((f) => `${f}: ${document.fonts.check(f)}`).join(', ')));
    for (const [sel, out] of list) await (await page.$(sel)).screenshot({ path: path.join(__dirname, out + '.png') });
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
