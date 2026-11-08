// Renders tier-list-v2 (v1's script, v2's frames) at 2x after the fonts and posters load: the whole board, each phone at 390 alone, then the
// share images at their real size (1080x1920 Story, 1080x1350 Post) at 1x:
//   node mockups/journeys/tier-list-v2-render.js
const { chromium } = require('playwright');
const path = require('path');
const n = 'tier-list-v2';
const FONTS = ['500 96px "Bodoni Moda"', '500 28px "Bodoni Moda"', '600 22px "Bodoni Moda"', '500 22px "Bodoni Moda"', '600 15px "Bodoni Moda"', '400 16px Newsreader', '500 18px Newsreader', '600 15px Newsreader', 'italic 400 44px Newsreader', '400 15px Inter', '500 15px Inter', '600 15px Inter', '400 10px Inter', '600 11px Inter'];
const ready = async (page) => {
  await page.evaluate((fs) => Promise.all(fs.map((f) => document.fonts.load(f))), FONTS);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  const fonts = await page.evaluate(() => ['500 22px "Bodoni Moda"', '400 16px Newsreader', '400 15px Inter'].map((f) => `${f}: ${document.fonts.check(f)}`));
  const imgs = await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src));
  console.log(fonts.join('\n') + `\nbroken images: ${imgs.length} ${imgs.join(' ')}`);
  await page.waitForTimeout(300);
};
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const url = 'file://' + path.join(__dirname, n + '.html');
  const page = await browser.newPage({ viewport: { width: 1800, height: 900 }, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await ready(page);
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  const frames = { palette: '0-palette', auto: '2-auto', drag: '3-drag', sharesheet: '4-share', saved: '5-saved' };
  for (const [id, name] of Object.entries(frames)) await (await page.$(`#${id}`)).screenshot({ path: path.join(__dirname, `${n}-${name}.png`) });
  const full = await browser.newPage({ viewport: { width: 1200, height: 1000 }, deviceScaleFactor: 1 });
  await full.goto(url, { waitUntil: 'networkidle' });
  await full.evaluate(() => document.body.classList.add('full'));
  await ready(full);
  for (const el of await full.$$('[data-card]')) await el.screenshot({ path: path.join(__dirname, `${n}-card-${await el.getAttribute('data-card')}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
