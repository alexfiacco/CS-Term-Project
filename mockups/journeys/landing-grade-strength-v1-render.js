// Renders landing-grade-strength-v1 at 2x after Bodoni Moda, Newsreader and Inter load, measures text contrast
// against the backdrop behind each line, writes it into the chips, then shoots the frames.
// node mockups/journeys/landing-color-v1-render.js [scratch-dir]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const N = 'landing-grade-strength-v1';
const D = __dirname;
const TMP = process.argv[2] || require('os').tmpdir();
// WCAG contrast of each line against the lightest 5% of the backdrop behind it (needs python3 + Pillow).
const CONTRAST_PY = "import json, sys\nfrom PIL import Image\ndef lin(c):\n    c=c/255; return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4\ndef L(rgb): r,g,b=rgb; return .2126*lin(r)+.7152*lin(g)+.0722*lin(b)\ndef cr(a,b):\n    la,lb=L(a),L(b); hi,lo=max(la,lb),min(la,lb); return (hi+.05)/(lo+.05)\ndef mix(fg,bg,a): return tuple(fg[i]*a+bg[i]*(1-a) for i in range(3))\nCREAM=(239,232,218); IMPBG=(20,20,23)\ndata=json.load(open(sys.argv[1])); out={}\nfor fr in data:\n    im=Image.open(fr['png']).convert('RGB'); s=fr['scale']; res={}\n    for key,(x,y,w,h),alpha,onimp in fr['boxes']:\n        px=list(im.crop((int(x*s),int(y*s),int((x+w)*s),int((y+h)*s))).getdata())\n        px.sort(key=L)\n        worst=px[int(len(px)*.95)-1]  # lightest 5%: worst case for light text\n        if onimp: worst=mix(IMPBG,worst,.72)\n        text=mix(CREAM,worst,alpha)\n        res[key]=round(cr(text,worst),1)\n    out[fr['id']]=res\nprint(json.dumps(out))\n";
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(D, N + '.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all(['600 36px "Bodoni Moda"', '400 15px Newsreader', '400 15px Inter', '600 15px Inter'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  const ok = await page.evaluate(() => ['Bodoni Moda', 'Newsreader', 'Inter'].map((f) => [...document.fonts].some((x) => x.family.replace(/"/g, '') === f && x.status === 'loaded')));
  if (ok.includes(false)) throw new Error('fonts not loaded ' + JSON.stringify(ok));
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
  await page.waitForTimeout(400);

  // Contrast: boxes per frame, then the same frames with the foreground hidden.
  const ids = ['g50', 'g60', 'g67', 'g75', 'g100'];
  const boxes = await page.evaluate(() => [...document.querySelectorAll('[data-frame]')].map((f) => {
    const o = f.getBoundingClientRect();
    const r = (sel) => { const e = f.querySelector(sel); const b = e.getBoundingClientRect(); return [b.x - o.x, b.y - o.y, b.width, b.height]; };
    // [key, box, text alpha over the backdrop, sits inside the import row's own fill]
    return [['Heading', r('.h'), 1, false], ['Subtitle', r('.sub'), .7, false], ['Letterboxd sub', r('.imp-s'), .7, true],
      ['"or"', r('.foot'), .56, false], ['Brand', r('.brand'), 1, false]];
  }));
  await page.evaluate(() => document.querySelectorAll('[data-frame]').forEach((f) => f.classList.add('probe')));
  const frames = await page.locator('[data-frame]').all();
  const jobs = [];
  for (let i = 0; i < frames.length; i++) {
    const png = path.join(TMP, `probe-${ids[i]}.png`);
    await frames[i].screenshot({ path: png });
    jobs.push({ id: ids[i], png, scale: 2, boxes: boxes[i] });
  }
  fs.writeFileSync(path.join(TMP, 'probe.json'), JSON.stringify(jobs));
  const res = JSON.parse(execFileSync('python3', ['-I', '-c', CONTRAST_PY, path.join(TMP, 'probe.json')]).toString());
  console.log(JSON.stringify(res, null, 1));
  await page.evaluate((res) => {
    document.querySelectorAll('[data-frame]').forEach((f) => f.classList.remove('probe'));
    for (const [id, r] of Object.entries(res)) {
      const el = document.querySelector(`[data-cr="${id}"]`);
      el.innerHTML = Object.entries(r).map(([k, v]) => `<span>${k} <b class="${v < 4.5 ? 'lo' : ''}">${v.toFixed(1)}:1</b></span>`).join('')
        + '<span>Button text <b>16.1:1</b></span>';
    }
  }, res);
  await page.waitForTimeout(200);

  await page.screenshot({ path: path.join(D, N + '.png'), fullPage: true });
  for (const id of ids) await page.locator('#f-' + id).screenshot({ path: path.join(D, N + '-' + id.slice(1) + '.png') });
  console.log('rendered', N, ok);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
