// Renders invite-rewards-v1 at 2x after the fonts and stills load: the whole board, then each phone at 390 alone:
//   node mockups/journeys/invite-rewards-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'invite-rewards-v1';
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 1760, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['500 28px "Bodoni Moda"', '600 22px "Bodoni Moda"', '500 20px "Bodoni Moda"', '600 12px "Bodoni Moda"', '600 18px "Bodoni Moda"', '400 16px Newsreader', '500 22px Newsreader', '600 13px Newsreader', '400 15px Inter', '500 15px Inter', '600 15px Inter', '600 11px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  const fonts = await page.evaluate(() => ['600 12px "Bodoni Moda"', '500 22px Newsreader', '400 15px Inter'].map((f) => `${f}: ${document.fonts.check(f)}`));
  const imgs = await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src));
  console.log(fonts.join('\n') + `\nbroken images: ${imgs.length} ${imgs.join(' ')}`);
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  const list = ['1-now', '2-drawer', '3-founding-earned', '4-push', '5-friend-profile', '6-your-profile-as-friend', '7-founding-ticket', '8-optional-cream-ticket'];
  const phones = await page.$$('#board .ph');
  for (let i = 0; i < list.length; i++) await phones[i].screenshot({ path: path.join(__dirname, `${n}-${list[i]}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
