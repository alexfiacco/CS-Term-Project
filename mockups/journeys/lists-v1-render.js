// Renders lists-v1 at 2x after the fonts and posters load: the whole board, then each phone at 390 alone:
//   node mockups/journeys/lists-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'lists-v1';
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 1800, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['500 28px "Bodoni Moda"', '600 22px "Bodoni Moda"', '500 18px "Bodoni Moda"', '600 15px "Bodoni Moda"', '400 16px Newsreader', '500 22px Newsreader', '600 15px Newsreader', '400 15px Inter', '500 15px Inter', '600 15px Inter', '400 13px Inter', '600 11px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  const fonts = await page.evaluate(() => ['600 22px "Bodoni Moda"', '400 16px Newsreader', '400 15px Inter'].map((f) => `${f}: ${document.fonts.check(f)}`));
  const imgs = await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src));
  console.log(fonts.join('\n') + `\nbroken images: ${imgs.length} ${imgs.join(' ')}`);
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  const frames = { hold: '1-hold', add: '1-add', new: '2-new', 'own-grid': '3-own-grid', 'own-ranked': '3-own-ranked', edit: '5-edit', theirs: '4-theirs', 'report-menu': '8-report-menu', report: '8-report', profile: '6-profile', empty: '7-empty' };
  for (const [id, name] of Object.entries(frames)) await (await page.$(`#${id}`)).screenshot({ path: path.join(__dirname, `${n}-${name}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
