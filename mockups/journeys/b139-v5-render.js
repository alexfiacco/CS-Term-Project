// b139 v5: renders the two phones (the pop-up with Search pinned first, and the Send in Montage panel it opens) at 2x.
// node mockups/journeys/b139-v5-render.js   (needs playwright)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ ...(proxy ? { proxy } : {}) });
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, 'b139-v5-share.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 22px "Bodoni Moda"', '400 16px Newsreader', '400 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const urls = new Set();
    document.querySelectorAll('*').forEach((el) => { const m = getComputedStyle(el).backgroundImage.match(/url\("([^"]+)"\)/); if (m) urls.add(m[1]); });
    await Promise.all([...urls].map((u) => new Promise((r) => { const i = new Image(); i.onload = r; i.onerror = r; i.src = u; })));
  });
  await page.waitForTimeout(600);
  await page.locator('#v5').screenshot({ path: path.join(__dirname, 'b139-v5-share.png') });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
