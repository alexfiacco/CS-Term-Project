// Renders b99 at 2x after fonts load: node mockups/journeys/b99-signin-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
  const fonts = ['500 22px "Bodoni Moda"', 'italic 500 22px "Bodoni Moda"', '400 16px Newsreader', '400 15px Inter', '600 15px Inter', '500 15px Inter'];
  for (const name of process.argv.slice(2).length ? process.argv.slice(2) : ['b99-signin-new', 'b99-signin-guest']) {
    await page.goto('file://' + path.join(__dirname, name + '.html'), { waitUntil: 'networkidle' });
    await page.evaluate((f) => Promise.all(f.map((x) => document.fonts.load(x))), fonts);
    await page.waitForFunction(() => document.body.dataset.ready === '1');
    console.log(name, await page.evaluate((f) => f.map((x) => `${x}: ${document.fonts.check(x)}`).join(', '), fonts));
    await (await page.$('#board')).screenshot({ path: path.join(__dirname, name + '.png') });
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
