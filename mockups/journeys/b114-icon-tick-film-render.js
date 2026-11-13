// Renders b114 at 2x: TMPDIR=/dev/shm NODE_PATH=/opt/node22/lib/node_modules node mockups/journeys/b114-icon-tick-film-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2520, height: 1200 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, 'b114-icon-tick-film.html'), { waitUntil: 'load' });
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => null))));
  const bb = await page.evaluate(() => { const r = document.querySelector('#board').getBoundingClientRect(); return { x: 0, y: 0, width: Math.ceil(r.width), height: Math.ceil(r.height) }; });
  await page.screenshot({ path: path.join(__dirname, 'b114-icon-tick-film.png'), clip: bb, fullPage: true });
  console.log('board', bb.width * 2, 'x', bb.height * 2);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
