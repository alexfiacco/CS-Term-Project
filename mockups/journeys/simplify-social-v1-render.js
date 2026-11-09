// Renders simplify-social-v1.html at 2x: one PNG per [data-shot] section.
const { chromium } = require('playwright');
const D = '/home/user/CS-Term-Project/mockups/journeys/';
const N = 'simplify-social-v1';
const only = process.argv[2];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2 });
  await page.goto('file://' + D + N + '.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 22px BD', '400 16px NR', '600 16px NR', '400 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  const ok = await page.evaluate(() => ['BD', 'NR'].map((f) => [...document.fonts].some((x) => x.family.replace(/"/g, '') === f && x.status === 'loaded')));
  if (ok.includes(false)) throw new Error('fonts ' + JSON.stringify(ok));
  await page.waitForTimeout(400);
  for (const el of await page.$$('[data-shot]')) {
    const s = await el.getAttribute('data-shot');
    if (only && s !== only) continue;
    await el.screenshot({ path: D + N + '-' + s + '.png' });
  }
  console.log('done', ok);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
