// node mockups/journeys/b44-render.js -> b44-unlocks-real-profile.png (deviceScaleFactor 2)
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 1700 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(__dirname, 'b44-unlocks-real-profile.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const fonts = await p.evaluate(() => [...document.fonts].filter((x) => x.status === 'loaded').map((x) => x.family));
  if (!fonts.includes('Bod')) throw new Error('Bodoni not loaded');
  await p.locator('#all').screenshot({ path: path.join(__dirname, 'b44-unlocks-real-profile.png') });
  await b.close();
})();
