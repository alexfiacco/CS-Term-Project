// Renders intuitive-pass-v1.html: the whole sheet, then one PNG per group.
//   NODE_PATH=/opt/node22/lib/node_modules node mockups/journeys/intuitive-pass-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1720, height: 1200 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, 'intuitive-pass-v1.html'), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all(['500 20px "Bodoni Moda"', '400 16px Newsreader', '400 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
  const ok = await page.evaluate(() => ['Bodoni Moda', 'Newsreader', 'Inter'].map((f) => [...document.fonts].some((x) => x.family.replace(/"/g, '') === f && x.status === 'loaded')));
  if (ok.includes(false)) throw new Error('fonts not loaded ' + JSON.stringify(ok));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(__dirname, 'intuitive-pass-v1.png'), fullPage: true });
  const names = [['g0', '0-audit'], ['g1', '1-pattern'], ['g2', '2-movienight-take'], ['g3', '3-film-pitch'], ['g4', '4-canon-activity']];
  for (const [id, n] of names) { console.log(id); const b = await (await page.$('#' + id)).boundingBox(); await page.screenshot({ path: path.join(__dirname, `intuitive-pass-v1-${n}.png`), clip: b, fullPage: true, timeout: 60000 }); }
  console.log('rendered', ok);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
