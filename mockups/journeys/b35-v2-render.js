const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 1400, height: 1100 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, 'b35-v2.html'), { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  await page.evaluate(() => document.fonts.ready);
  console.log('broken', await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src)));
  for (const [s, f] of [['s1', 'A'], ['s4', 'D']]) await (await page.$('#' + s)).screenshot({ path: path.join(__dirname, `b35-v2-${f}.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
