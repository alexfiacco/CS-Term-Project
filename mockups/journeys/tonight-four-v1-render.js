// Renders tonight-four-v1 (whole sheet + one PNG per group) at 2x after fonts load:
//   NODE_PATH=$(npm root -g) node mockups/journeys/tonight-four-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'tonight-four-v1';
  let browser;
  try { browser = await chromium.launch(); } catch { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  const page = await browser.newPage({ viewport: { width: 1840, height: 1200 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 22px "Bodoni Moda"', '400 16px Newsreader', '400 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
  await page.waitForTimeout(400);
  await (await page.$('#all')).screenshot({ path: path.join(__dirname, `${n}.png`) });
  for (let i = 1; i <= 3; i++) await (await page.$('#g' + i)).screenshot({ path: path.join(__dirname, `${n}-${i}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
