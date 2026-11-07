// Renders signin-drawer-v1 (combined + Now n1-n3 and Proposed a1, a2, b1, b2 at 390), 2x, after fonts load:
//   node mockups/journeys/signin-drawer-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'signin-drawer-v1';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1800, height: 1100 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all(['500 22px "Bodoni Moda"', '500 44px "Bodoni Moda"', '400 15px Inter', '600 15px Inter', '500 13px Inter', '500 15px Roboto'].map((f) => document.fonts.load(f))));
  await page.waitForTimeout(300);
  await (await page.$('#all')).screenshot({ path: path.join(__dirname, `${n}.png`) });
  const names = ['n1', 'n2', 'n3', 'a1', 'a2', 'b1', 'b2'];
  for (let i = 0; i < names.length; i++) await (await page.$('#' + names[i] + ' .ph')).screenshot({ path: path.join(__dirname, `${n}-${names[i]}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
