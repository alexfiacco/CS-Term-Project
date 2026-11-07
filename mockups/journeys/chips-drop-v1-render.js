// Renders chips-drop-v1 at 2x after the fonts and the poster load: the whole board, then each phone:
//   node mockups/journeys/chips-drop-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'chips-drop-v1';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  const faces = ['500 28px "Bodoni Moda"', 'italic 400 18px "Bodoni Moda"', '400 16px Newsreader', '400 13px Inter', '500 13px Inter', '600 13px Inter', '700 11px Inter'];
  await page.evaluate((f) => Promise.all(f.map((x) => document.fonts.load(x))), faces);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  console.log(await page.evaluate((f) => f.map((x) => `${x}: ${document.fonts.check(x)}`).join('\n'), faces));
  console.log(await page.evaluate(() => {
    const w = (s) => Math.round(document.querySelector(s).getBoundingClientRect().width);
    const pills = [...document.querySelectorAll('#f-b .pill')].map((p) => Math.round(p.getBoundingClientRect().width));
    const pts = [...document.querySelectorAll('.phone')].map((p) => `${p.id} ${p.dataset.pt}`).join(', ');
    return `A line ${w('#f-a-rest .rnote.left > span')} · pills ${pills.join('+')} row ${w('#f-b .skiprow')} · menu ${w('#f-a-open .menu')}x${Math.round(document.querySelector('#f-a-open .menu').getBoundingClientRect().height)} · ${pts}`;
  }));
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  for (const [id, out] of [['f-now', 'now'], ['f-a-rest', 'a-rest'], ['f-a-open', 'a-open'], ['f-b', 'b'], ['f-c-rest', 'c-rest'], ['f-c-open', 'c-open']])
    await (await page.$('#' + id)).screenshot({ path: path.join(__dirname, `${n}-${out}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
