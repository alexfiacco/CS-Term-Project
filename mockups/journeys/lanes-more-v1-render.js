// Renders lanes-more-v1 at 2x: NODE_PATH=$(npm root -g) node mockups/journeys/lanes-more-v1-render.js
// Writes lanes-more-v1.png (whole sheet), -1/-2/-3.png (Browse, Tonight, fallback + data) and one PNG per 390 frame.
const { chromium } = require('playwright');
const path = require('path');
const N = 'lanes-more-v1';
(async () => {
  let browser;
  try { browser = await chromium.launch(); } catch { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  const page = await browser.newPage({ viewport: { width: 1760, height: 1000 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, N + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 22px "Bodoni Moda"', '400 16px Newsreader', '400 15px Inter', '500 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  const ok = await page.evaluate(() => ['Bodoni Moda', 'Newsreader', 'Inter'].map((f) => [...document.fonts].some((x) => x.family.replace(/"/g, '') === f && x.status === 'loaded')));
  if (ok.includes(false)) throw new Error('fonts not loaded ' + JSON.stringify(ok));
  await page.waitForTimeout(400);
  await (await page.$('#all')).screenshot({ path: path.join(__dirname, N + '.png') });
  for (const el of await page.$$('[data-shot]')) await el.screenshot({ path: path.join(__dirname, `${N}-${await el.getAttribute('data-shot')}.png`) });
  for (const id of ['b-now', 'b-a', 'b-b', 'b-head', 't-now', 't-now-dr', 't-new', 't-new-dr', 't-fb']) await (await page.$('#' + id)).screenshot({ path: path.join(__dirname, `${N}-${id}.png`) });
  console.log('rendered', ok);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
