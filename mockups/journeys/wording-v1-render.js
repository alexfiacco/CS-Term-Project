// Renders wording-v1 at 2x after the fonts load: the whole sheet, then each of its three tables alone:
//   node mockups/journeys/wording-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'wording-v1';
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 1480, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['500 28px "Bodoni Moda"', '600 38px "Bodoni Moda"', '400 15px Newsreader', '500 15px Newsreader', '400 13px Inter', '600 15px Inter', '600 11px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  const fonts = await page.evaluate(() => ['500 28px "Bodoni Moda"', '400 15px Newsreader', '400 13px Inter'].map((f) => `${f}: ${document.fonts.check(f)}`));
  console.log(fonts.join('\n'));
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  const parts = { s1: '1-terms', s2: '2-empty', s3: '3-buttons' };
  for (const [id, name] of Object.entries(parts)) await (await page.$(`#${id}`)).screenshot({ path: path.join(__dirname, `${n}-${name}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
