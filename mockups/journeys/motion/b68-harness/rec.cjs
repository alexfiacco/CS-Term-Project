// Records a clip of the BUILT motion (no motion layered on): CDP screencast at 2x, then a constant 30fps frame sequence.
// node rec.cjs <clip> [rm]   rm: prefers-reduced-motion: reduce, emulated.
const { chromium } = require("/opt/node-tools/node_modules/playwright");
const { wire, URL } = require("./common.cjs");
const fs = require("fs");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// A soft ring where the finger lands (a recording aid only).
const ring = (p, x, y) => p.evaluate(([x, y]) => { const d = document.createElement("i"); d.style.cssText = `position:fixed;z-index:99999;left:${x - 22}px;top:${y - 22}px;width:44px;height:44px;border-radius:50%;background:rgba(242,234,220,.22);border:1.5px solid rgba(242,234,220,.55);pointer-events:none`; document.body.appendChild(d); d.animate([{ transform: "scale(.6)", opacity: 0 }, { transform: "scale(1)", opacity: 1, offset: .35 }, { transform: "scale(1.15)", opacity: 0 }], { duration: 520, fill: "forwards" }).finished.then(() => d.remove()); }, [x, y]);
async function tap(p, loc) { const b = await loc.boundingBox(); const x = b.x + b.width / 2, y = b.y + b.height / 2; await ring(p, x, y); await sleep(120); await p.mouse.click(x, y); }
const PLAY = {
  async choose(p) { await sleep(500); await tap(p, p.getByRole("button", { name: "Choose one from these" })); await sleep(3300); await tap(p, p.getByRole("button", { name: "Next fit" })); await sleep(2300); },
  async reveal(p) { await sleep(1200); await p.evaluate(() => window.__name()); await sleep(2600 + 3600); },
  async blend(p) { await sleep(400); await p.evaluate(() => window.__open()); await sleep(2600); },
  async picks(p) {
    await sleep(600);
    await tap(p, p.locator(".pk-slide").first().locator(".pk-stub button").filter({ hasText: "Seen it" }));
    await sleep(700);
    const star = p.locator(".dstar-half-r").nth(3); await tap(p, star);
    // "When did you watch it?" (Today), then "What stuck with you?" (the after-rating drawer): Done, then the beat and the move.
    const today = p.locator("button").filter({ hasText: /^\s*Today\s*$/ }).last();
    await today.waitFor({ state: "visible", timeout: 8000 }); await sleep(300); await tap(p, today);
    const done = p.locator("button").filter({ hasText: /^\s*Done\s*$/ }).last();
    await done.waitFor({ state: "visible", timeout: 8000 }); await sleep(500);
    await tap(p, done);
    await sleep(2200);
  },
};
(async () => {
  const [c, rm] = process.argv.slice(2);
  const name = c + (rm ? "-rm" : "");
  const dir = __dirname + "/vid/" + name; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark", hasTouch: false, reducedMotion: rm ? "reduce" : "no-preference" });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => console.log("ERR", (e.stack || e.message).slice(0, 400)));
  await wire(p);
  await p.goto(URL(c));
  await p.evaluate(() => document.fonts.ready);
  await sleep(c === "picks" ? 2500 : 1500);
  const s = await ctx.newCDPSession(p);
  const frames = [];
  s.on("Page.screencastFrame", (f) => { frames.push({ t: f.metadata.timestamp * 1000, data: f.data }); s.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
  await s.send("Page.startScreencast", { format: "jpeg", quality: 90, maxWidth: 780, maxHeight: 1688, everyNthFrame: 1 });
  await p.evaluate(() => { const d = document.createElement("i"); d.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;opacity:.01;z-index:99999;pointer-events:none"; document.body.appendChild(d); let k = 0; setInterval(() => { d.style.background = (k++ % 2) ? "#000" : "#010101"; }, 33); });
  await sleep(300);
  const ts = Date.now();
  await PLAY[c](p);
  const te = Date.now();
  await s.send("Page.stopScreencast");
  if (process.env.SHOT) await p.screenshot({ path: __dirname + "/vid/" + name + "-end.png" });
  await ctx.close(); await b.close();
  frames.sort((a, z) => a.t - z.t);
  const N = Math.round((te - ts) / 1000 * 30); let j = 0;
  for (let i = 0; i < N; i++) { const t = ts + i * 1000 / 30; while (j + 1 < frames.length && frames[j + 1].t <= t) j++; fs.writeFileSync(`${dir}/f${String(i).padStart(4, "0")}.jpg`, Buffer.from(frames[j].data, "base64")); }
  console.log(name, "frames", frames.length, "out", N, (N / 30).toFixed(2) + "s");
})();
