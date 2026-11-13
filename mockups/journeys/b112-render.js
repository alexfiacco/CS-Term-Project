// Renders b112 at 2x after fonts and posters load: node mockups/journeys/b112-render.js
const { chromium } = require('playwright');
const path = require('path');
const all = ['b112-list-page'];
(async () => {
  const want = process.argv.slice(2);
  const list = want.length ? all.filter((n) => want.some((w) => n.startsWith(w))) : all;
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ ...(proxy ? { proxy } : {}) });
  const page = await browser.newPage({ viewport: { width: 2340, height: 1200 }, deviceScaleFactor: 2 });
  for (const name of list) {
    await page.goto('file://' + path.join(__dirname, name + '.html'), { waitUntil: 'networkidle' });
    await page.evaluate(() => Promise.all(['600 22px "Bodoni Moda"', 'italic 400 16px "Bodoni Moda"', '400 16px Newsreader', 'italic 400 16px Newsreader', '400 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
    await page.evaluate(() => document.fonts.ready);
    // Every background poster decoded.
    const bad = await page.evaluate(async () => {
      const urls = new Set();
      document.querySelectorAll('*').forEach((el) => { const m = getComputedStyle(el).backgroundImage.match(/url\("([^"]+)"\)/); if (m) urls.add(m[1]); });
      const res = await Promise.all([...urls].map((u) => new Promise((r) => { const i = new Image(); i.onload = () => r(null); i.onerror = () => r(u); i.src = u; })));
      return res.filter(Boolean);
    });
    console.log(JSON.stringify(await page.evaluate(() => window.__rows))); console.log(JSON.stringify(await page.evaluate(() => window.__fit)));
    await page.waitForTimeout(300);
    
    const bb = await page.evaluate(() => { const r = document.querySelector('#board').getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: Math.ceil(r.width), height: Math.ceil(r.height) }; });
    await page.screenshot({ path: path.join(__dirname, name + '.png'), fullPage: true, clip: bb });
    console.log(name, 'fonts', await page.evaluate(() => ['600 22px "Bodoni Moda"', '400 16px Newsreader', '400 15px Inter'].map((f) => document.fonts.check(f)).join(',')), 'failed images', bad.length);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
