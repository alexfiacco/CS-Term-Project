// Renders film-discussion-v1 at 2x after the fonts and the film art load: the whole board, then each phone alone:
//   node mockups/journeys/film-discussion-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'film-discussion-v1';
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 2160, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['500 28px "Bodoni Moda"', '500 22px "Bodoni Moda"', '500 18px "Bodoni Moda"', '600 18px "Bodoni Moda"', '500 15px "Bodoni Moda"', '400 16px Newsreader', 'italic 400 15px Newsreader', '500 22px Newsreader', '500 32px Newsreader', '400 15px Inter', '500 15px Inter', '600 15px Inter', '400 13px Inter', '600 11px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  const fonts = await page.evaluate(() => ['500 28px "Bodoni Moda"', '400 16px Newsreader', 'italic 400 15px Newsreader', '400 15px Inter'].map((f) => `${f}: ${document.fonts.check(f)}`));
  const imgs = await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src));
  console.log(fonts.join('\n') + `\nbroken images: ${imgs.length} ${imgs.join(' ')}`);
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  const list = ['1-now-full', '2-now-empty', '3-a-row', '4-a-empty', '5-a-sheet', '6-b-tabs', '7-b-empty', '8-c-bar', '9-c-empty'];
  const phones = await page.$$('#board .phone');
  for (let i = 0; i < list.length; i++) await phones[i].screenshot({ path: path.join(__dirname, `${n}-${list[i]}.png`) });
  await (await page.$('#states')).screenshot({ path: path.join(__dirname, `${n}-10-a-states.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
