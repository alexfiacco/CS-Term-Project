// Renders reveal-loading-v1.html at 2x after the fonts load: the sheet, then each 390-wide frame.
// node mockups/journeys/reveal-loading-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const dir = __dirname;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1912, height: 1000 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(dir, 'reveal-loading-v1.html') + '?still', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(dir, 'reveal-loading-v1.png'), fullPage: true });
  for (const [id, name] of [['f-now', 'now'], ['f-a', 'a'], ['f-b', 'b'], ['f-c', 'c']]) {
    await page.locator('#' + id).screenshot({ path: path.join(dir, `reveal-loading-v1-${name}.png`) });
    console.log('rendered', name);
  }
  await browser.close();
})();
