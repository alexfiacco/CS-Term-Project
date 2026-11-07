// Renders landing-align-v1 at 2x after the Google fonts load: node mockups/journeys/landing-align-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
const N = 'landing-align-v1';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1360, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, N + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 36px "Bodoni Moda"', '500 34px "Bodoni Moda"', '400 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  const ok = await page.evaluate(() => ['Bodoni Moda', 'Inter'].map((f) => [...document.fonts].some((x) => x.family.replace(/"/g, '') === f && x.status === 'loaded')));
  if (ok.includes(false)) throw new Error('fonts not loaded ' + JSON.stringify(ok));
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(__dirname, N + '.png'), fullPage: true });
  await page.locator('#phone').screenshot({ path: path.join(__dirname, N + '-phone.png') });
  await page.locator('#desktop').screenshot({ path: path.join(__dirname, N + '-desktop.png') });
  console.log('rendered', N, ok);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
