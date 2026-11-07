// Renders landing-tick-v1 (based on owner-v1-render.js): the combined sheet and each frame, 2x,
// after the Google fonts (Bodoni Moda, Inter) load:
//   node mockups/journeys/landing-tick-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
const N = 'landing-tick-v1';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1300, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, N + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all(['500 40px "Bodoni Moda"', '600 20px "Bodoni Moda"', '400 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
  const ok = await page.evaluate(() => {
    const got = new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')));
    return ['Bodoni Moda', 'Inter'].map((f) => got.has(f));
  });
  if (ok.includes(false)) throw new Error(`fonts not loaded ${JSON.stringify(ok)}`);
  await page.evaluate(() => fit());
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(__dirname, N + '.png'), fullPage: true });
  for (const [id, suffix] of [['A', 'A'], ['B', 'B'], ['C', 'C-320']]) {
    await page.locator('#' + id).screenshot({ path: path.join(__dirname, `${N}-${suffix}.png`) });
  }
  // Geometry check: nothing past the frame, heading lines on one line.
  const geo = await page.evaluate(() => ['A', 'B', 'C'].map((id) => {
    const s = document.getElementById(id).getBoundingClientRect();
    const r = (q) => document.getElementById(id).querySelector(q).getBoundingClientRect();
    return { id, frameH: s.height, lockBottom: r('.lockup').bottom - s.top, headTop: r('.h').top - s.top,
      archBottom: r('.arch').bottom - s.top, hFont: getComputedStyle(document.getElementById(id).querySelector('.h + .h')).fontSize,
      subH: r('.sub').height, tickY: r('.tick').top - s.top };
  }));
  console.log(JSON.stringify(geo, null, 1));
  console.log('rendered', N, ok);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
