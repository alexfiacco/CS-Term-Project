// Renders share-card-v1 at 2x after the Google fonts load (Bodoni Moda, Newsreader, Inter): node mockups/journeys/share-card-v1-render.js
// Writes share-card-v1.png (the whole sheet), share-card-v1-<shot>.png for each [data-shot] phone, and each
// [data-card] at its real size (1080x1920 Story, 1080x1350 Post) at 1x as share-card-v1-card-<name>.png.
const { chromium } = require('playwright');
const path = require('path');
const N = 'share-card-v1';
const fontsReady = async (page) => {
  await page.evaluate(() => Promise.all(['500 250px "Bodoni Moda"', '600 46px "Bodoni Moda"', 'italic 400 48px Newsreader', '400 16px Newsreader', '400 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  const ok = await page.evaluate(() => ['Bodoni Moda', 'Newsreader', 'Inter'].map((f) => [...document.fonts].some((x) => x.family.replace(/"/g, '') === f && x.status === 'loaded')));
  if (ok.includes(false)) throw new Error('fonts not loaded ' + JSON.stringify(ok));
  await page.waitForTimeout(300);
  return ok;
};
(async () => {
  const browser = await chromium.launch();
  const url = 'file://' + path.join(__dirname, N + '.html');
  const page = await browser.newPage({ viewport: { width: 1800, height: 1000 }, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle' });
  const ok = await fontsReady(page);
  await page.screenshot({ path: path.join(__dirname, N + '.png'), fullPage: true });
  for (const el of await page.$$('[data-shot]')) {
    await el.screenshot({ path: path.join(__dirname, N + '-' + (await el.getAttribute('data-shot')) + '.png') });
  }
  const full = await browser.newPage({ viewport: { width: 1800, height: 1000 }, deviceScaleFactor: 1 });
  await full.goto(url, { waitUntil: 'networkidle' });
  await full.evaluate(() => document.body.classList.add('full'));
  await fontsReady(full);
  for (const el of await full.$$('[data-card]')) {
    await el.screenshot({ path: path.join(__dirname, N + '-card-' + (await el.getAttribute('data-card')) + '.png') });
  }
  console.log('rendered', N, ok);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
