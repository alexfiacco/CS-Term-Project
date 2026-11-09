// Renders walkthrough-v1.html: the whole sheet, then one PNG per group (-1 walkthrough, -2 first screen, -3 services).
//   NODE_PATH=/opt/node22/lib/node_modules node mockups/journeys/walkthrough-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1720, height: 1200 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, 'walkthrough-v1.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all(['500 20px "Bodoni Moda"', '400 16px Newsreader', '400 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
  const ok = await page.evaluate(() => ['Bodoni Moda', 'Newsreader', 'Inter'].map((f) => [...document.fonts].some((x) => x.family.replace(/"/g, '') === f && x.status === 'loaded')));
  if (ok.includes(false)) throw new Error('fonts not loaded ' + JSON.stringify(ok));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(__dirname, 'walkthrough-v1.png'), fullPage: true });
  for (const [i, id] of [[1, 'g1'], [2, 'g2'], [3, 'g3']]) await (await page.$('#' + id)).screenshot({ path: path.join(__dirname, `walkthrough-v1-${i}.png`) });
  console.log('rendered', ok);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
