// Renders b119 at 2x after fonts and posters load: node mockups/journeys/b119-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ ...(proxy ? { proxy } : {}) });
  const page = await browser.newPage({ viewport: { width: 1900, height: 1200 }, deviceScaleFactor: 2 });
  const name = 'b119-quiet-switch';
  await page.goto('file://' + path.join(__dirname, name + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 22px "Bodoni Moda"', '500 22px "Bodoni Moda"', '400 15px Inter', '500 15px Inter', '600 15px Inter', '700 15px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  const bad = await page.evaluate(async () => {
    const urls = new Set();
    document.querySelectorAll('*').forEach((el) => { const m = getComputedStyle(el).backgroundImage.match(/url\("([^"]+)"\)/); if (m) urls.add(m[1]); });
    const res = await Promise.all([...urls].map((u) => new Promise((r) => { const i = new Image(); i.onload = () => r(null); i.onerror = () => r(u); i.src = u; })));
    return res.filter(Boolean);
  });
  // Any segment whose words overflow their segment.
  const over = await page.evaluate(() => [...document.querySelectorAll('.sg span,.wseg span')].filter((s) => s.scrollWidth > s.clientWidth + 1).map((s) => s.textContent));
  await page.waitForTimeout(300);
  for (const n of [1, 2]) {
    const bb = await page.evaluate((n) => { const r = document.querySelector('#board' + n).getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: Math.ceil(r.width), height: Math.ceil(r.height) }; }, n);
    await page.screenshot({ path: path.join(__dirname, `${name}-${n}.png`), fullPage: true, clip: bb });
    console.log(n, bb.width * 2, 'x', bb.height * 2);
  }
  console.log('fonts', await page.evaluate(() => ['600 22px "Bodoni Moda"', '400 15px Inter'].map((f) => document.fonts.check(f)).join(',')), 'failed images', bad.length, 'overflow', JSON.stringify(over));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
