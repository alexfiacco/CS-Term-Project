const { chromium } = require("playwright");
const [html, outPrefix] = process.argv.slice(2);
(async () => {
  let b; try { b = await chromium.launch(); } catch { b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); }
  let bad = 0;
  for (const w of [390, 320]) {
    const p = await b.newPage({ viewport: { width: w, height: 800 }, deviceScaleFactor: 2 });
    await p.goto("file://" + html);
    const probs = await p.evaluate(() => {
      const out = [];
      const ov = (a, b) => a && b && a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
      for (const r of document.querySelectorAll(".act-row")) {
        const k = r.dataset.kind;
        const body = r.querySelector(".act-body").getBoundingClientRect();
        const colEl = r.querySelector(":scope > .act-pa, :scope > .act-col, :scope > .act-pa-ended, :scope > a.act-pa, :scope > span.act-pa");
        const col = colEl && colEl.getBoundingClientRect();
        const dot = r.querySelector(".act-dot"); const d = dot && dot.getBoundingClientRect();
        const row = r.getBoundingClientRect();
        if (col && body.right > col.left - 4) out.push(`${k}: text ${body.right.toFixed(1)} reaches column ${col.left.toFixed(1)}`);
        if (col && d && ov(col, d)) out.push(`${k}: dot over column`);
        if (col && col.right > row.right) out.push(`${k}: column past row`);
        if (col && col.width < 83.5 && !r.querySelector(".act-col-thumb")) out.push(`${k}: column ${col.width}`);
        const l1 = r.querySelector(".act-l1"); const lines = Math.round(l1.getBoundingClientRect().height / 20);
        if (lines > 2) out.push(`${k}: line 1 ${lines} lines`);
        for (const el of r.querySelectorAll(".act-l1, .act-l2")) if (el.scrollWidth > el.clientWidth + 1) out.push(`${k}: ${el.className} overflows by ${el.scrollWidth - el.clientWidth}`);
        const tm = r.querySelector(".act-tm"), nt = r.querySelector(".act-l2 .act-not");
        if (tm && nt && ov(tm.getBoundingClientRect(), nt.getBoundingClientRect())) out.push(`${k}: time under Not`);
        if (r.getBoundingClientRect().right > document.documentElement.clientWidth) out.push(`${k}: row past screen`);
      }
      if (document.documentElement.scrollWidth > document.documentElement.clientWidth) out.push("page scrolls sideways");
      return out;
    });
    console.log(w, probs.length ? probs : "ok"); bad += probs.length;
    await p.screenshot({ path: `${outPrefix}-${w}.png`, fullPage: true });
    await p.close();
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
