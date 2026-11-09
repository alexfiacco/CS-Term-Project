// Renders called-it-v2 at 2x: NODE_PATH=$(npm root -g) node mockups/journeys/called-it-v2-render.js
// Writes called-it-v2-1.png, -2.png, -3.png (one per sheet).
const { chromium } = require('playwright');
const path = require('path');
const N = 'called-it-v2';
(async () => {
  let browser;
  try { browser = await chromium.launch(); } catch { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  const page = await browser.newPage({ viewport: { width: 2200, height: 1000 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, N + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 22px "Bodoni Moda"', '400 16px Newsreader', 'italic 400 16px Newsreader', '400 15px Inter', '500 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  const ok = await page.evaluate(() => ['Bodoni Moda', 'Newsreader', 'Inter'].map((f) => [...document.fonts].some((x) => x.family.replace(/"/g, '') === f && x.status === 'loaded')));
  if (ok.includes(false)) throw new Error('fonts not loaded ' + JSON.stringify(ok));
  await page.waitForTimeout(400);
  for (const el of await page.$$('[data-shot]')) await el.screenshot({ path: path.join(__dirname, `${N}-${await el.getAttribute('data-shot')}.png`) });
  console.log('rendered', ok);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
