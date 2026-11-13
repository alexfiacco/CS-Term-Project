// Renders b94 at 2x after fonts load: node mockups/journeys/b94-why-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
  for (const name of ['b94-why-now', 'b94-why-proposed']) {
    await page.goto('file://' + path.join(__dirname, name + '.html'), { waitUntil: 'networkidle' });
    await page.evaluate(() => Promise.all(['500 22px "Bodoni Moda"', '400 16px Newsreader', 'italic 400 13px Newsreader', '400 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
    await page.waitForFunction(() => document.body.dataset.ready === '1');
    console.log(name, await page.evaluate(() => ['500 22px "Bodoni Moda"', '400 16px Newsreader', 'italic 400 13px Newsreader', '400 15px Inter'].map((f) => `${f}: ${document.fonts.check(f)}`).join(', ')));
    await (await page.$('#board')).screenshot({ path: path.join(__dirname, name + '.png') });
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
