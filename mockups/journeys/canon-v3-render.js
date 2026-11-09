// Renders canon-v3 at 2x after fonts and images load: two sheets (now / A / B, then A and B scrolled) and each phone alone.
//   node mockups/journeys/canon-v3-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'canon-v3';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1340, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 22px "Bodoni Moda"', '400 16px Newsreader', 'italic 400 16px Newsreader', '400 13px Inter', '500 13px Inter', '600 11px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => window.fit());
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  console.log(await page.evaluate(() => ['600 22px "Bodoni Moda"', '400 16px Newsreader', '500 13px Inter'].map((f) => `${f}: ${document.fonts.check(f)}`).join('\n') + `\nbroken images: ${[...document.images].filter((i) => !i.naturalWidth).length}\nhero title px: ${[...document.querySelectorAll('.ht')].map((t) => getComputedStyle(t).fontSize + '/' + t.getBoundingClientRect().height).join(', ')}`));
  for (const s of ['s1', 's2']) await (await page.$('#' + s)).screenshot({ path: path.join(__dirname, `${n}-${s === 's1' ? '1' : '2'}.png`) });
  for (const v of ['now', 'a', 'b', 'a2', 'b2']) await (await page.$(`#${v} .ph`)).screenshot({ path: path.join(__dirname, `${n}-${v}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
