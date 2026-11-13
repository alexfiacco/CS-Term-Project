// Renders b93 at 2x (each phone 393 x 852) after fonts and posters load: node mockups/journeys/b93-walls-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 1000, height: 1200 }, deviceScaleFactor: 2 });
  for (const name of (process.argv[2] ? [process.argv[2]] : ['import', 'deck', 'reveal'])) {
    await page.goto('file://' + path.join(__dirname, `b93-walls-${name}.html`), { waitUntil: 'networkidle' });
    await page.evaluate(() => Promise.all(['500 28px "Bodoni Moda"', '500 44px "Bodoni Moda"', '400 15px Inter', '600 15px Inter', '400 16px Newsreader'].map((f) => document.fonts.load(f))));
    await page.waitForFunction(() => document.body.dataset.ready === '1');
    console.log(name, await page.evaluate(() => ['500 28px "Bodoni Moda"', '400 15px Inter'].map((f) => `${f}: ${document.fonts.check(f)}`).join(', ')));
    await (await page.$('#board')).screenshot({ path: path.join(__dirname, `b93-walls-${name}.png`) });
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
