// Renders person-tabs-v1 (A now | B divider above the tabs | C none, each 390 wide), 2x, after fonts load:
//   node mockups/journeys/person-tabs-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'person-tabs-v1';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1320, height: 1100 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  for (const f of page.frames()) await f.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await page.waitForTimeout(600);
  await (await page.$('#all')).screenshot({ path: path.join(__dirname, `${n}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
