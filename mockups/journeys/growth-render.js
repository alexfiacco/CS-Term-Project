// node mockups/journeys/growth-render.js [name ...]: the growth mocks to PNG at 2x (Playwright, Chromium).
const { chromium } = require('playwright');
const path = require('path');
const ALL = ['challenges', 'referral', 'official-account', 'match-link', 'year-card', 'plus'];
(async () => {
  const names = process.argv.slice(2).length ? process.argv.slice(2) : ALL;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
  for (const n of names) {
    await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(__dirname, n + '.png'), fullPage: true });
    console.log('rendered', n);
  }
  await browser.close();
})();
