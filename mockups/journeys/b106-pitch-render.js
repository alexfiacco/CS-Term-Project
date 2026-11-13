// Renders b106 at 2x after fonts and images load: node mockups/journeys/b106-pitch-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 1500, height: 1000 }, deviceScaleFactor: 2 });
  const fonts = ['600 22px "Bodoni Moda"', '400 26px "Bodoni Moda"', '400 16px Newsreader', '400 15px Inter', '600 15px Inter', '500 15px Inter'];
  await page.goto('file://' + path.join(__dirname, 'b106-pitch.html'), { waitUntil: 'networkidle' });
  await page.evaluate((f) => Promise.all(f.map((x) => document.fonts.load(x))), fonts);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  await page.evaluate(() => size());
  await page.waitForTimeout(1500);
  console.log(await page.evaluate((f) => f.map((x) => `${x}: ${document.fonts.check(x)}`).join(', '), fonts));
  await (await page.$('#board')).screenshot({ path: path.join(__dirname, 'b106-pitch.png') });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
