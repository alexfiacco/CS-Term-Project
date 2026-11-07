// Renders the brand audit v2 mocks (items 3, 4, 5, 11, 12, 13, 14), 2x, after the Google fonts load:
//   node mockups/journeys/brand-audit-v2-render.js [profile-sections-v1 landing-grade-v1 cleanups-v1]
// Based on landing-tick-v1-render.js. Each sheet is saved whole, then each [data-shot] element on its own
// as <name>-<data-shot>.png.
const { chromium } = require('playwright');
const path = require('path');
const names = process.argv.slice(2).length ? process.argv.slice(2) : ['profile-sections-v1', 'landing-grade-v1', 'cleanups-v1'];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1360, height: 900 }, deviceScaleFactor: 2 });
  for (const N of names) {
    await page.goto('file://' + path.join(__dirname, N + '.html'), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all(['500 40px "Bodoni Moda"', '600 20px "Bodoni Moda"', '500 22px Newsreader', '400 15px Newsreader', '400 15px Inter'].map((f) => document.fonts.load(f))));
    const ok = await page.evaluate(() => {
      const got = new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')));
      const want = ['Bodoni Moda'].concat(document.querySelector('link[href*="Newsreader"]') ? ['Newsreader'] : []);
      return want.map((f) => got.has(f));
    });
    if (ok.includes(false)) throw new Error(`${N}: fonts not loaded ${JSON.stringify(ok)}`);
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(__dirname, N + '.png'), fullPage: true });
    const shots = await page.$$eval('[data-shot]', (els) => els.map((e) => e.dataset.shot));
    for (const s of shots) await page.locator(`[data-shot="${s}"]`).screenshot({ path: path.join(__dirname, `${N}-${s}.png`) });
    // Nothing wider than its frame.
    const over = await page.evaluate(() => [...document.querySelectorAll('[data-shot]')].flatMap((f) => {
      const r = f.getBoundingClientRect();
      return [...f.querySelectorAll('*')].filter((e) => { const b = e.getBoundingClientRect(); return b.width && getComputedStyle(e).overflow !== 'hidden' && b.right > r.right + 1 && !e.closest('.reel, .wall, .bleed'); }).map((e) => f.dataset.shot + ':' + e.className);
    }));
    console.log('rendered', N, shots.join(' '), over.length ? 'OVER ' + over.slice(0, 8).join(', ') : '');
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
