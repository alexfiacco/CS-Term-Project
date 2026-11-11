const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 1400, height: 1100 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, 'b36-dna-hitrate.html'), { waitUntil: 'networkidle' });

  await page.evaluate(() => document.fonts.ready);
  console.log('broken', await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src)));
  await page.screenshot({ path: path.join(__dirname,'b36-dna-hitrate.png'), fullPage:true });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
