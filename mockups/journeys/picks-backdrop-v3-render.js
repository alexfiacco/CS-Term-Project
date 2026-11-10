// Renders picks-backdrop-v3 at 2x (three sheets) after fonts and images load:
//   node mockups/journeys/picks-backdrop-v3-render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const n = 'picks-backdrop-v3';
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch(proxy ? { proxy } : {});
  const page = await browser.newPage({ viewport: { width: 920, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, n + '.html'), { waitUntil: 'networkidle' });
  const faces = ['600 28px "Bodoni App"', '500 36px "Bodoni Moda"', 'italic 400 16px Newsreader', '400 15px Inter', '600 15px Inter'];
  await page.evaluate((f) => Promise.all(f.map((x) => document.fonts.load(x))), faces);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  console.log(await page.evaluate((f) => f.map((x) => `${x}: ${document.fonts.check(x)}`).join('\n'), faces));
  console.log('broken images', await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).length));
  // Clipping check: any title/meta/tag text wider than its box.
  console.log('geom', await page.evaluate(() => [...document.querySelectorAll('.ph')].map((p) => { const t = p.getBoundingClientRect().top; const g = (s) => { const r = p.querySelector(s).getBoundingClientRect(); return Math.round(r.top - t) + '-' + Math.round(r.bottom - t); }; return p.id + ' poster ' + g('.inset') + ' head ' + g('.head') + ' m ' + g('.m') + ' mw ' + p.querySelector('.m span').offsetWidth; }).join(' / ')));
  console.log('overflow', await page.evaluate(() => [...document.querySelectorAll('.head h2,.head .m,.head .fr,.head .w,.tags span,.stub .p,.sl')].filter((e) => e.scrollWidth > e.clientWidth + 1).map((e) => e.textContent).join(' | ') || 'none'));
  await (await page.$('#s1')).screenshot({ path: path.join(__dirname, `${n}-1.png`) });
  await (await page.$('#s2')).screenshot({ path: path.join(__dirname, `${n}-2.png`) });
  await (await page.$('#s3')).screenshot({ path: path.join(__dirname, `${n}-3.png`) });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
