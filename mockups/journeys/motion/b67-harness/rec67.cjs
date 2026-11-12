// b67: records the BUILT poster open (rule 1720) with CDP screencast at 2x, then a constant-30fps frame sequence.
// Args: clip (open-row | open-grid), rm (1: Reduce Motion), slow (ms the film's read is held, to show the slow page).
const { chromium } = require("/opt/node-tools/node_modules/playwright");
const { wire, URL } = require("./common.cjs");
const fs = require("fs");
(async () => {
  const [c, rm, slow, shots] = process.argv.slice(2);
  const name = c + (rm === "1" ? "-rm" : "") + (+slow ? "-slow" : "");
  const dir = __dirname + "/vid/" + name; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark", hasTouch: true, reducedMotion: rm === "1" ? "reduce" : "no-preference" });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => console.log("ERR", (e.stack || e.message).slice(0, 400)));
  await wire(p);
  if (+slow) await p.route("**/api/match-csv**", async (r) => { await new Promise((s) => setTimeout(s, +slow)); r.fallback(); });
  await p.goto(URL(c));
  const HEAT = "e09dLw1Ljtccd2P4NsuUvVtS5du";
  const findSrc = () => p.evaluate((h) => { const i = [...document.querySelectorAll("img")].find((x) => (x.currentSrc || x.src).includes(h) && x.getBoundingClientRect().width > 40 && x.complete && x.naturalWidth > 0); if (!i) return null; const r = i.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, HEAT);
  let at = null; for (let i = 0; i < 100 && !(at = await findSrc()); i++) await p.waitForTimeout(100);
  if (!at) { console.log("no source poster"); await b.close(); process.exit(1); }
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(900);
  at = await findSrc();
  const s = await ctx.newCDPSession(p);
  const frames = [];
  s.on("Page.screencastFrame", (f) => { frames.push({ t: f.metadata.timestamp * 1000, data: f.data }); s.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
  await s.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 780, maxHeight: 1688, everyNthFrame: 1 });
  await p.evaluate(() => { const d = document.createElement("i"); d.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;opacity:.01;z-index:2147483647;pointer-events:none"; document.body.appendChild(d); let k = 0; setInterval(() => { d.style.background = (k++ % 2) ? "#000" : "#010101"; }, 33); });
  // The finger: a soft ring where the tap lands (recording aid only).
  await p.addStyleTag({ content: `.b67-tap{position:fixed;z-index:2147483646;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(242,234,220,.22);border:1.5px solid rgba(242,234,220,.55);pointer-events:none}` });
  const ring = (x, y) => p.evaluate(([x, y]) => { const d = document.createElement("i"); d.className = "b67-tap"; d.style.left = x + "px"; d.style.top = y + "px"; document.body.appendChild(d); d.animate([{ transform: "scale(.6)", opacity: 0 }, { transform: "scale(1)", opacity: 1, offset: .35 }, { transform: "scale(1.15)", opacity: 0 }], { duration: 520, easing: "ease-out", fill: "forwards" }).finished.then(() => d.remove()); }, [x, y]);
  await p.waitForTimeout(500);
  const ts = Date.now();
  await ring(...at);
  await p.waitForTimeout(90);
  await p.touchscreen.tap(...at);
  if (shots) for (const ms of [60, 150, 250, 350, 470, 700, 1200]) { await p.waitForTimeout(ms - (ms > 60 ? [60, 150, 250, 350, 470, 700, 1200][[60, 150, 250, 350, 470, 700, 1200].indexOf(ms) - 1] : 0)); await p.screenshot({ path: `${__dirname}/shot-${name}-${ms}.png` }); }
  await p.waitForTimeout(shots ? 600 : 1900);
  // Close, unchanged (rule 1141): the sheet dragged straight down at full width.
  const T = (type, y) => s.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x: 200, y }] });
  await T("touchStart", 300);
  for (let k = 1; k <= 20; k++) { const e = 1 - Math.pow(1 - k / 20, 2); await T("touchMove", 300 + e * 330); await p.waitForTimeout(16); }
  await T("touchEnd", 630);
  await p.waitForTimeout(1000);
  const te = Date.now();
  await s.send("Page.stopScreencast");
  await ctx.close(); await b.close();
  frames.sort((a, z) => a.t - z.t);
  const N = Math.round((te - ts) / 1000 * 30); let j = 0;
  for (let i = 0; i < N; i++) {
    const t = ts + i * 1000 / 30;
    while (j + 1 < frames.length && frames[j + 1].t <= t) j++;
    fs.writeFileSync(`${dir}/f${String(i).padStart(4, "0")}.jpg`, Buffer.from(frames[j].data, "base64"));
  }
  console.log(name, "frames", frames.length, "out", N, (N / 30).toFixed(2) + "s");
})();
