// b139 v4: each card alone at 1080 x 1920 (b139-v4-card-<kind>.png), its text contrast, and a contact sheet of the six.
// node mockups/journeys/b139-v4-render.js   (needs playwright and python3 with Pillow)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const FILE = 'file://' + path.join(__dirname, 'b139-v4-card.html');
const KINDS = ['archetype', 'blend', 'night', 'tonight', 'pitch', 'list'];
const MEASURE = `
import json,sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB'); bx=json.load(open(sys.argv[2]))
def L(c):
  c=c/255; return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def lum(p): return 0.2126*L(p[0])+0.7152*L(p[1])+0.0722*L(p[2])
def hexl(h): h=h.lstrip('#'); return lum((int(h[0:2],16),int(h[2:4],16),int(h[4:6],16)))
res=[]
for b in bx:
  if b['w']<2 or b['h']<2: continue
  ls=sorted(lum(p) for p in im.crop((b['x'],b['y'],b['x']+b['w'],b['y']+b['h'])).getdata())
  bg=ls[int(len(ls)*0.95)-1] if len(ls)>20 else ls[-1]
  t=hexl(b['c']); hi,lo=max(t,bg),min(t,bg)
  res.append({'t':b['t'],'k':b['k'],'r':round((hi+0.05)/(lo+0.05),1)})
print(json.dumps(res))`;
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ ...(proxy ? { proxy } : {}) });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'b139v4-'));
  const summary = [];
  for (const k of KINDS) {
    await page.goto(`${FILE}?card=${k}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => Promise.all(['600 22px "Bodoni Moda"', '400 16px Newsreader', 'italic 400 16px Newsreader', '600 16px Newsreader', '400 15px Inter', '600 15px Inter', '800 15px Inter'].map((f) => document.fonts.load(f))));
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => { const urls = new Set(); document.querySelectorAll('*').forEach((el) => { const m = getComputedStyle(el).backgroundImage.match(/url\("([^"]+)"\)/); if (m) urls.add(m[1]); }); document.querySelectorAll('img').forEach((i) => urls.add(i.src)); await Promise.all([...urls].map((u) => new Promise((r) => { const i = new Image(); i.onload = r; i.onerror = r; i.src = u; }))); });
    await page.waitForTimeout(400);
    const out = path.join(__dirname, `b139-v4-card-${k}.png`);
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
    const boxes = await page.evaluate(() => [...document.querySelectorAll('[data-c]')].map((el) => { const r = el.getBoundingClientRect(); return { c: el.dataset.c, k: el.dataset.k, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), t: el.textContent.trim().slice(0, 40) || 'Montage wordmark' }; }));
    await page.addStyleTag({ content: '[data-c]{visibility:hidden!important}' });
    await page.waitForTimeout(80);
    const bg = path.join(tmp, k + '.png'); await page.screenshot({ path: bg });
    fs.writeFileSync(path.join(tmp, k + '.json'), JSON.stringify(boxes));
    const r = JSON.parse(execFileSync('python3', ['-I', '-W', 'ignore', '-c', MEASURE, bg, path.join(tmp, k + '.json')]).toString());
    const min = (a) => a.reduce((m, x) => (x.r < m.r ? x : m), { r: 99, t: '' });
    const s = min(r.filter((x) => x.k === 'small')), b = min(r.filter((x) => x.k === 'big'));
    summary.push({ k, small: s.r, smallWorst: s.t, big: b.r, bigWorst: b.t, all: r });
    console.log(`${k}: small ${s.r}:1 (${s.t}), big ${b.r}:1 (${b.t})`);
  }
  fs.writeFileSync(path.join(__dirname, 'b139-v4-contrast.json'), JSON.stringify(summary, null, 1));
  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  // The contact sheet: the six at full size, side by side (6 x 1080 + 7 x 40 = 6760 wide).
  execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image, ImageDraw, ImageFont
d=sys.argv[1]; ks=sys.argv[2].split(',')
W=6*1080+7*40; H=1920+80+40
s=Image.new('RGB',(W,H),(18,18,21)); dr=ImageDraw.Draw(s)
try: f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',34)
except Exception: f=ImageFont.load_default()
names={'archetype':'Archetype','blend':'Blend','night':'Movie night result','tonight':'Tonight','pitch':'Pitch shortlist','list':'List'}
for i,k in enumerate(ks):
  x=40+i*(1080+40); dr.text((x,22),names[k]+'  ·  1080 x 1920',fill=(239,232,218),font=f)
  s.paste(Image.open(f'{d}/b139-v4-card-{k}.png').convert('RGB'),(x,80))
s.save(f'{d}/b139-v4-cards.png',optimize=True); print('sheet',W,H)
`, __dirname, KINDS.join(',')], { stdio: 'inherit' });
})().catch((e) => { console.error(e); process.exit(1); });
