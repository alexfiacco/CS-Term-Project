// Renders b120 at 2x after fonts and posters load: node mockups/journeys/b120-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ ...(proxy ? { proxy } : {}) });
  const page = await browser.newPage({ viewport: { width: 2300, height: 1200 }, deviceScaleFactor: 2 });
  const name = 'b120-low-why';
  await page.goto('file://' + path.join(__dirname, name + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['500 18px "Bodoni Moda"', '400 48px "Bodoni Moda"', '400 17px Newsreader', 'italic 400 15px Newsreader', '400 13px Inter', '600 14px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  const bad = await page.evaluate(async () => {
    const urls = new Set();
    document.querySelectorAll('*').forEach((el) => { const m = getComputedStyle(el).backgroundImage.match(/url\("([^"]+)"\)/); if (m) urls.add(m[1]); });
    const res = await Promise.all([...urls].map((u) => new Promise((r) => { const i = new Image(); i.onload = () => r(null); i.onerror = () => r(u); i.src = u; })));
    return res.filter(Boolean);
  });
  await page.waitForTimeout(300);
  const bb = await page.evaluate(() => { const r = document.querySelector('#board').getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: Math.ceil(r.width), height: Math.ceil(r.height) }; });
  await page.screenshot({ path: path.join(__dirname, name + '.png'), fullPage: true, clip: bb });
  console.log(bb.width * 2, 'x', bb.height * 2, 'failed images', bad.length);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
