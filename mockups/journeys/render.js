// Renders each journeys/*.html to a PNG beside it at 2x: node mockups/journeys/render.js [name ...]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const dir = __dirname;
  const names = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => f.replace('.html', ''));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
  for (const n of names) {
    await page.goto('file://' + path.join(dir, n + '.html'), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(dir, n + '.png'), fullPage: true });
    console.log('rendered', n);
  }
  await browser.close();
})();
