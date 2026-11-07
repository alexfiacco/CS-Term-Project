// Renders logo directions v1: node mockups/journeys/logo-v8-render.js name [name ...]
// Writes name.png (the whole sheet) and name-<data-shot>.png for each phone marked data-shot, at 2x.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const dir = __dirname;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
  for (const n of process.argv.slice(2)) {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto('file://' + path.join(dir, n + '.html'), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready); await page.evaluate(() => Promise.all(["400 20px \"Bodoni Moda\"","600 46px \"Bodoni Moda\"","400 16px Newsreader","500 12px Inter"].map(f => document.fonts.load(f))));
    await page.waitForTimeout(400);
    const w = await page.evaluate(() => Math.ceil(document.querySelector('.page').getBoundingClientRect().width));
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(dir, n + '.png'), fullPage: true });
    for (const el of await page.$$('[data-shot]')) {
      const s = await el.getAttribute('data-shot');
      await el.screenshot({ path: path.join(dir, `${n}-${s}.png`) });
    }
    console.log('rendered', n);
  }
  await browser.close();
})();
