// Renders friend-preview-v1 at 2x
// Writes friend-preview-v1.png and -1, -2.
const { chromium } = require('playwright');
const path = require('path');
const N = 'friend-preview-v1';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1760, height: 1000 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, N + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 22px "Bodoni Moda"', '400 16px Newsreader', 'italic 400 16px Newsreader', '400 15px Inter', '500 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  const ok = await page.evaluate(() => ['Bodoni Moda', 'Newsreader', 'Inter'].map((f) => [...document.fonts].some((x) => x.family.replace(/"/g, '') === f && x.status === 'loaded')));
  if (ok.includes(false)) throw new Error('fonts not loaded ' + JSON.stringify(ok));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(__dirname, N + '.png'), fullPage: true });
  for (const el of await page.$$('[data-shot]')) {
    const s = await el.getAttribute('data-shot');
    await el.screenshot({ path: path.join(__dirname, N + '-' + s + '.png') });
  }
  console.log('rendered', N, ok);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
