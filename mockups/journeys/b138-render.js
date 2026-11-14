// Renders the b138 boards at 2x after fonts and posters load: node mockups/journeys/b138-render.js [name ...]
const { chromium } = require('playwright');
const path = require('path');
const all = ['b138-share-popup', 'b138-share-everywhere', 'b138-card-upgrades'];
(async () => {
  const want = process.argv.slice(2);
  const list = want.length ? all.filter((n) => want.some((w) => n.includes(w))) : all;
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ ...(proxy ? { proxy } : {}) });
  const page = await browser.newPage({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 2 });
  for (const name of list) {
    await page.goto('file://' + path.join(__dirname, name + '.html'), { waitUntil: 'networkidle' });
    await page.evaluate(() => Promise.all(['600 22px "Bodoni Moda"', '400 16px Newsreader', '600 16px Newsreader', 'italic 400 16px Newsreader', '400 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
    await page.evaluate(() => document.fonts.ready);
    const bad = await page.evaluate(async () => {
      const urls = new Set();
      document.querySelectorAll('*').forEach((el) => { const m = getComputedStyle(el).backgroundImage.match(/url\("([^"]+)"\)/); if (m) urls.add(m[1]); });
      const res = await Promise.all([...urls].map((u) => new Promise((r) => { const i = new Image(); i.onload = () => r(null); i.onerror = () => r(u); i.src = u; })));
      return res.filter(Boolean);
    });
    await page.waitForTimeout(500);
    const bb = await page.evaluate(() => { const r = document.querySelector('#board').getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: Math.ceil(r.width), height: Math.ceil(r.height) }; });
    await page.screenshot({ path: path.join(__dirname, name + '.png'), fullPage: true, clip: bb });
    console.log(name, bb.width * 2 + 'x' + bb.height * 2, 'fonts', await page.evaluate(() => ['600 22px "Bodoni Moda"', '400 16px Newsreader', '400 15px Inter'].map((f) => document.fonts.check(f)).join(',')), 'failed images', bad.length, bad.join(' '));
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
