// Renders tap-cues-v1 at 2x after the fonts load: the whole board, each phone at 390 alone, and the inventory:
//   node mockups/journeys/tap-cues-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'tap-cues-v1';
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 1760, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 38px "Bodoni Moda"', '500 28px "Bodoni Moda"', '500 18px "Bodoni Moda"', '400 15px Newsreader', '500 22px Newsreader', '400 15px Inter', '400 13px Inter', '600 11px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  const fonts = await page.evaluate(() => ['600 38px "Bodoni Moda"', '400 15px Newsreader', '400 15px Inter'].map((f) => `${f}: ${document.fonts.check(f)}`));
  // The ticket must not overflow at 390 with the added chevrons.
  const fit = await page.evaluate(() => [...document.querySelectorAll('.tk')].map((t) => `${t.closest('.ph').id}: ticket ${(() => { const g = t.querySelector('.stub').getBoundingClientRect().left - [...t.querySelectorAll('.cell')].pop().getBoundingClientRect().right; return `${g >= 16 ? 'fits' : 'TOO TIGHT'}, ${Math.round(g)} before the stub, label "${t.querySelector('.bl .lab').textContent}"`; })()}`));
  console.log(fonts.join('\n') + '\n' + fit.join('\n'));
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  for (const v of ['tn', 'tp', 'fn', 'fp']) await (await page.$(`#${v}`)).screenshot({ path: path.join(__dirname, `${n}-${v}.png`) });
  await (await page.$('#inv')).screenshot({ path: path.join(__dirname, `${n}-inventory.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
