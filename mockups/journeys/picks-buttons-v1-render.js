// Renders picks-buttons-v1 at 2x after the fonts and the poster load: the whole board, then each phone with its states:
//   node mockups/journeys/picks-buttons-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'picks-buttons-v1';
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 1820, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  const faces = ['500 28px "Bodoni Moda"', '600 26px "Bodoni Moda"', '500 20px "Bodoni Moda"', 'italic 400 15px Newsreader', '400 16px Newsreader', '400 15px Inter', '600 15px Inter', '600 13px Inter', '600 11px Inter'];
  await page.evaluate((f) => Promise.all(f.map((x) => document.fonts.load(x))), faces);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  console.log(await page.evaluate((f) => f.map((x) => `${x}: ${document.fonts.check(x)}`).join('\n'), faces));
  console.log(await page.evaluate(() => [...document.querySelectorAll('.phone')].map((p) => `${p.id} poster ${p.dataset.ph}`).join('\n')));
  console.log(await page.evaluate(() => [...document.querySelectorAll('.states')].map((p) => `${p.id} widest ${p.dataset.w}`).join('\n')));
  console.log('broken images', await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).length));
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  for (const v of ['now', 'a', 'b', 'c']) await (await page.$(`#f-${v}`)).evaluateHandle((e) => e.parentElement).then((h) => h.asElement().screenshot({ path: path.join(__dirname, `${n}-${v}.png`) }));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
