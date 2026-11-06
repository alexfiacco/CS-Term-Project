// Screenshots email HTML at 390px, in dark and light (prefers-color-scheme). Writes <prefix><name>.png, or
// <prefix><name>-dark.png and -light.png when the two differ.
//   node emails-shot.js <dir of .html files> <prefix>          (one email per file)
//   node emails-shot.js <file.html> <prefix> --sections        (each [data-email] element in one file)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const [src, prefix, mode] = process.argv.slice(2);
const out = __dirname;
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ proxy });
  const shoot = async (scheme, url, sel) => {
    const page = await browser.newPage({ viewport: { width: sel ? 1300 : 390, height: 800 }, deviceScaleFactor: 2, colorScheme: scheme });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);
    const shots = {};
    if (sel) for (const el of await page.$$(sel)) shots[await el.getAttribute('data-email')] = await el.screenshot();
    else shots[''] = await page.screenshot({ fullPage: true });
    await page.close();
    return shots;
  };
  const jobs = mode === '--sections' ? [['file://' + path.resolve(src), '[data-email]', null]]
    : fs.readdirSync(src).filter(f => f.endsWith('.html')).map(f => ['file://' + path.resolve(src, f), null, f.replace('.html', '')]);
  for (const [url, sel, name] of jobs) {
    const d = await shoot('dark', url, sel), l = await shoot('light', url, sel);
    for (const k of Object.keys(d)) {
      const n = name ?? k;
      if (Buffer.compare(d[k], l[k]) === 0) { fs.writeFileSync(path.join(out, `${prefix}${n}.png`), d[k]); console.log(`${prefix}${n}.png (same in both schemes)`); }
      else for (const [s, b] of [['dark', d[k]], ['light', l[k]]]) { fs.writeFileSync(path.join(out, `${prefix}${n}-${s}.png`), b); console.log(`${prefix}${n}-${s}.png`); }
    }
  }
  await browser.close();
})();
