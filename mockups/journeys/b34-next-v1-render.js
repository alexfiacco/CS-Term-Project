// Renders b34-next-v1 at 2x (three sheets): node mockups/journeys/b34-next-v1-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'b34-next-v1';
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 1400, height: 1100 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 28px "Bodoni App"', '500 36px "Bodoni Moda"', 'italic 400 16px Newsreader', '400 15px Inter', '600 15px Inter'].map((x) => document.fonts.load(x))));
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  console.log('broken images', await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src)));
  console.log('overflow', await page.evaluate(() => [...document.querySelectorAll('.ch,.mi,.lr .t b,.lr .t span,.wc .t,.bk b,.hero h4,.tk h4,.nt b,.nt span,.fld,.cta,.ghost')].filter((e) => e.scrollWidth > e.clientWidth + 1).map((e) => e.textContent).join(' | ') || 'none'));
  console.log('drawer overflow', await page.evaluate(() => [...document.querySelectorAll('.dr')].filter((d) => d.scrollHeight > d.clientHeight + 1).map((d) => d.closest('.ph').id + ' ' + (d.scrollHeight - d.clientHeight)).join(', ') || 'none'));
  for (const i of [1, 2, 3]) {
    const el = await page.$('#s' + i);
    console.log(i, await el.boundingBox());
    await el.screenshot({ path: path.join(__dirname, `${n}-${i}.png`) });
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
