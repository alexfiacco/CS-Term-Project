// Renders b35-v1 at 2x (seven sheets): node mockups/journeys/b35-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'b35-v1';
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 1400, height: 1100 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 28px "Bodoni App"', '500 36px "Bodoni Moda"', '400 16px Newsreader', '400 15px Inter', '600 15px Inter', '700 15px Inter'].map((x) => document.fonts.load(x))));
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  console.log('broken images', await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src)));
  console.log('overflow', await page.evaluate(() => [...document.querySelectorAll('.ch,.tile b,.ac p,.ac .f,.lead,.seg span,.pt,.bk .t span,.bc b,.cmp,.capsub,.ft3 b')].filter((e) => e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1).map((e) => e.textContent).join(' | ') || 'none'));
  for (const i of [1, 2, 3, 4, 5, 6, 7]) {
    const el = await page.$('#s' + i);
    const b = await el.boundingBox(); console.log(i, b.width, b.height);
    await el.screenshot({ path: path.join(__dirname, `${n}-${i}.png`) });
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
