// Renders find-film-entry-v1 at 2x after the fonts and posters load: the whole board, then each phone:
//   node mockups/journeys/find-film-entry-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'find-film-entry-v1';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1720, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  const faces = ['500 28px "Bodoni Moda"', '600 40px "Bodoni Moda"', '400 16px Newsreader', '400 18px Newsreader', '400 13px Inter', '600 15px Inter', '700 11px Inter'];
  await page.evaluate((f) => Promise.all(f.map((x) => document.fonts.load(x))), faces);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  console.log(await page.evaluate((f) => f.map((x) => `${x}: ${document.fonts.check(x)}`).join('\n'), faces));
  console.log('asked line', JSON.stringify(await page.evaluate(() => window.__asked)));
  await page.screenshot({ path: path.join(__dirname, `${n}.png`), fullPage: true });
  for (const [id, out] of [['n1', 'now-1-social'], ['n2', 'now-2-tonight'], ['n3', 'now-3-tonight-friends'], ['n4', 'now-4-pitch'],
    ['a1', 'a1-chooser'], ['a2', 'a2-just-me'], ['a3', 'a3-describe'], ['a4', 'a4-with-friends'], ['b1', 'b1-just-me'], ['b2', 'b2-describe'], ['wording', 'wording']])
    await (await page.$('#' + id)).screenshot({ path: path.join(__dirname, `${n}-${out}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
