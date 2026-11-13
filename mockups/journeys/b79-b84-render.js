// Renders b79-b84 at 2x after fonts and posters load: node mockups/journeys/b79-b84-render.js [b79 b80 ...]
// Each HTML marks its board with data-shot="<png name>".
const { chromium } = require('playwright');
const path = require('path');
const all = ['b79-moods', 'b80-action-bar', 'b81-vote', 'b82-result', 'b83-share-card', 'b84-suggest-error'];
const want = process.argv.slice(2);
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 1800, height: 1000 }, deviceScaleFactor: 2 });
  for (const html of all.filter((h) => !want.length || want.some((w) => h.startsWith(w)))) {
    await page.goto('file://' + path.join(__dirname, html + '.html'), { waitUntil: 'networkidle' });
    await page.evaluate(() => Promise.all(['600 22px "Bodoni Moda"', '500 18px "Bodoni Moda"', '400 16px Newsreader', '400 15px Inter', '600 13px Inter'].map((f) => document.fonts.load(f))));
    await page.evaluate(() => document.fonts.ready);
    console.log(html, await page.evaluate(() => ['600 22px "Bodoni Moda"', '400 16px Newsreader', '400 15px Inter'].map((f) => `${f}: ${document.fonts.check(f)}`).join(', ')));
    for (const el of await page.$$('[data-shot]')) {
      const out = await el.getAttribute('data-shot');
      await el.screenshot({ path: path.join(__dirname, out + '.png') });
    }
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
