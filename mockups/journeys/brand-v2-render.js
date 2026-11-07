// Renders the brand fix 6-10 mocks: node mockups/journeys/brand-v2-render.js [name ...]
// Phones are 390px wide inside a 1360px sheet; deviceScaleFactor 2.
const { chromium } = require('playwright');
const path = require('path');
const names = process.argv.slice(2).length ? process.argv.slice(2) : ['brand-defaults-v1', 'brand-red-v1', 'brand-loading-v1', 'brand-chat-v1', 'brand-system-v1'];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1360, height: 900 }, deviceScaleFactor: 2 });
  for (const n of names) {
    await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(__dirname, n + '.png'), fullPage: true });
    console.log('rendered', n);
  }
  await browser.close();
})();
