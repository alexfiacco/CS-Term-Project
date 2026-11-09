// Renders simplify-profile-v1 at 2x: the whole sheet, each sheet (-1 profile, -2 backdrop, -3 Blend) and each phone alone.
//   node mockups/journeys/simplify-profile-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'simplify-profile-v1';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1800, height: 1000 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 38px "Bodoni Moda"', '400 15px Newsreader', '600 15px Newsreader'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  console.log(await page.evaluate(() => ['600 38px "Bodoni Moda"', '400 15px Newsreader'].map((f) => `${f}: ${document.fonts.check(f)}`).join('\n')));
  console.log(await page.evaluate(() => [...document.querySelectorAll('[data-wc]')].map((e) => e.dataset.wc + ' ' + e.textContent).join('\n')));
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  for (const [i, s] of [[1, 's1'], [2, 's2'], [3, 's3']]) await (await page.$('#' + s)).screenshot({ path: path.join(__dirname, `${n}-${i}.png`) });
  const frames = { 'p-now': '1-now', 'p-a': '1-a', 'p-b': '1-b', 'p-why': '1-why', 'b-now': '2-now', 'b-edit': '2-edit', 'b-pick': '2-picker', 'b-after': '2-after', 'x-now': '3-now', 'x-new': '3-proposed', 'x-tap': '3-differ' };
  for (const [id, suf] of Object.entries(frames)) await (await page.$('#' + id)).screenshot({ path: path.join(__dirname, `${n}-${suf}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
