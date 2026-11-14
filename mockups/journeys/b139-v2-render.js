// b139 v2: measures each new card's text contrast over its still, writes the result into the board, renders the board at 2x.
// node mockups/journeys/b139-v2-render.js   (needs playwright and python3 with Pillow)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const FILE = 'file://' + path.join(__dirname, 'b139-v2-share.html');
const TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'b139-'));
const ready = async (page) => {
  await page.evaluate(() => Promise.all(['600 22px "Bodoni Moda"', '400 16px Newsreader', 'italic 400 16px Newsreader', '600 16px Newsreader', '400 15px Inter', '600 15px Inter', '800 15px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const urls = new Set();
    document.querySelectorAll('*').forEach((el) => { const m = getComputedStyle(el).backgroundImage.match(/url\("([^"]+)"\)/); if (m) urls.add(m[1]); });
    await Promise.all([...urls].map((u) => new Promise((r) => { const i = new Image(); i.onload = r; i.onerror = r; i.src = u; })));
  });
  await page.waitForTimeout(400);
};
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ ...(proxy ? { proxy } : {}) });
  const results = {};
  const solo = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  for (const k of ['archetype', 'blend', 'pitch', 'night', 'tonight', 'list']) {
    await solo.goto(`${FILE}?card=${k}`, { waitUntil: 'networkidle' });
    await ready(solo);
    // Boxes of the words on the card itself (not those on the cream ticket or the stub's own ground).
    const boxes = await solo.evaluate(() => [...document.querySelectorAll('[data-c]')].map((el) => {
      const r = el.getBoundingClientRect();
      let n = el, ground = 'card';
      while (n && n.id !== 'solo') { const bg = getComputedStyle(n).backgroundColor; if (bg && bg !== 'rgba(0, 0, 0, 0)' && !n.classList.contains('card')) { ground = bg; break; } n = n.parentElement; }
      return { c: el.dataset.c, k: el.dataset.k, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), t: el.textContent.trim().slice(0, 40), ground };
    }));
    await solo.addStyleTag({ content: '[data-c]{visibility:hidden!important}' });
    await solo.waitForTimeout(100);
    const shot = path.join(TMP, k + '.png');
    await solo.screenshot({ path: shot });
    fs.writeFileSync(path.join(TMP, k + '.json'), JSON.stringify(boxes));
    const out = execFileSync('python3', ['-I', '-c', `
import json,sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB'); bx=json.load(open(sys.argv[2]))
def L(c):
  c=c/255; return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def lum(r,g,b): return 0.2126*L(r)+0.7152*L(g)+0.0722*L(b)
def hexl(h): h=h.lstrip('#'); return lum(int(h[0:2],16),int(h[2:4],16),int(h[4:6],16))
res=[]
for b in bx:
  if b['w']<2 or b['h']<2: continue
  px=list(im.crop((b['x'],b['y'],b['x']+b['w'],b['y']+b['h'])).getdata())
  ls=sorted(lum(*p) for p in px); bg=ls[int(len(ls)*0.95)-1] if len(ls)>20 else ls[-1]
  t=hexl(b['c']); hi,lo=max(t,bg),min(t,bg)
  res.append({'t':b['t'],'k':b['k'],'r':round((hi+0.05)/(lo+0.05),1),'onCard':b['ground']=='card'})
print(json.dumps(res))
`, shot, path.join(TMP, k + '.json')]).toString();
    results[k] = JSON.parse(out);
  }
  await solo.close();
  const summary = Object.entries(results).map(([k, r]) => {
    const on = r;
    const sm = on.filter((x) => x.k === 'small'), bg = on.filter((x) => x.k === 'big');
    const min = (a) => a.length ? Math.min(...a.map((x) => x.r)) : null;
    const worst = (a) => a.length ? a.reduce((m, x) => (x.r < m.r ? x : m)).t : '';
    return { k, small: min(sm), smallWorst: worst(sm), big: min(bg), bigWorst: worst(bg) };
  });
  fs.writeFileSync(path.join(__dirname, 'b139-v2-contrast.json'), JSON.stringify({ summary, results }, null, 1));
  console.log(summary.map((s) => `${s.k}: small ${s.small}:1 (${s.smallWorst}), big ${s.big}:1 (${s.bigWorst})`).join('\n'));
  const page = await browser.newPage({ viewport: { width: 2300, height: 1200 }, deviceScaleFactor: 2 });
  await page.goto(FILE, { waitUntil: 'networkidle' });
  await ready(page);
  const name = { archetype: 'Archetype', blend: 'Blend', pitch: 'Pitch', night: 'Movie night', tonight: 'Tonight', list: 'List' };
  await page.evaluate((txt) => { document.getElementById('contrast').innerHTML = txt; },
    '<b>Contrast, measured</b> on the cards\' own ground (each text box against the brightest 5% of the still behind it, worst line per card; WCAG AA asks 4.5:1 for small text, 3:1 for large): ' +
    summary.map((s) => `${name[s.k]} ${s.small}:1 small, ${s.big}:1 large`).join('; ') + '. Every text box is measured, the cream ticket and the stub included.');
  const bb = await page.evaluate(() => { const r = document.querySelector('#board').getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: Math.ceil(r.width), height: Math.ceil(r.height) }; });
  await page.screenshot({ path: path.join(__dirname, 'b139-v2-share.png'), fullPage: true, clip: bb });
  console.log('b139-v2-share', bb.width * 2 + 'x' + bb.height * 2);
  await browser.close();
  fs.rmSync(TMP, { recursive: true, force: true });
})().catch((e) => { console.error(e); process.exit(1); });
