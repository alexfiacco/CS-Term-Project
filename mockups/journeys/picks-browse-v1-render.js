// Renders the picks-browse-v1 mocks at 390 wide, 2x, after the Google fonts (Bodoni Moda, Inter, Newsreader) load:
//   node mockups/journeys/picks-browse-v1-render.js [name ...]
const { chromium } = require('playwright');
const path = require('path');
const NAMES = ['picks-browse-v1'];
(async () => {
  const names = process.argv.slice(2).length ? process.argv.slice(2) : NAMES;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  for (const n of names) {
    await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all(['600 20px "Bodoni Moda"', '500 20px "Bodoni Moda"', '400 15px Inter', '600 15px Inter', '400 16px Newsreader'].map((f) => document.fonts.load(f))));
    const ok = await page.evaluate(() => {
      const got = new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')));
      return ['Bodoni Moda', 'Inter', 'Newsreader'].map((f) => got.has(f));
    });
    if (ok.includes(false)) throw new Error(`${n}: fonts not loaded ${JSON.stringify(ok)}`);
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(__dirname, n + '.png'), fullPage: true });
    for (const s of ['picks','browse']) await (await page.$('#'+s)).screenshot({ path: path.join(__dirname, n + '-' + s + '.png') });
    console.log('rendered', n, ok);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
