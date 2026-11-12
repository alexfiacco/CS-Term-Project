// Records a clip with CDP screencast at 2x (780x1688), then assembles a constant-30fps webm-free master (frames + ffconcat).
const { chromium } = require("/opt/node-tools/node_modules/playwright");
const { wire, URL } = require("./common.cjs");
const fs = require("fs"); const { execSync } = require("child_process");
(async () => {
  const [c, rm] = process.argv.slice(2);
  const name = c + (rm ? "-rm" : "");
  const dir = __dirname + "/vid/" + name; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark", hasTouch: true });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => console.log("ERR", (e.stack || e.message).slice(0, 400)));
  await wire(p);
  await p.goto(URL(c) + (rm ? "&rm=1" : ""));
  for (let i = 0; i < 100; i++) { if (await p.evaluate(() => { try { return !!(window.__ready && window.__ready()); } catch { return false; } })) break; await p.waitForTimeout(100); }
  await p.evaluate(() => document.fonts.ready);
  if (c !== "reveal") await p.waitForTimeout(900);
  const s = await ctx.newCDPSession(p);
  const frames = [];
  s.on("Page.screencastFrame", (f) => { frames.push({ t: f.metadata.timestamp * 1000, data: f.data }); s.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
  await s.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 780, maxHeight: 1688, everyNthFrame: 1 });
  // A heartbeat so the screencast always has a recent frame (it only sends on change).
  await p.evaluate(() => { const d = document.createElement("i"); d.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;opacity:.01;z-index:99999;pointer-events:none"; document.body.appendChild(d); let k = 0; setInterval(() => { d.style.background = (k++ % 2) ? "#000" : "#010101"; }, 33); });
  await p.waitForTimeout(300);
  let ts = Date.now();
  if (c === "ptr") {
    const T = (type, y) => s.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x: 200, y }] });
    await p.waitForTimeout(400);
    await T("touchStart", 180);
    for (let k = 1; k <= 30; k++) { const e = 1 - Math.pow(1 - k / 30, 2); await T("touchMove", 180 + e * 200); await p.waitForTimeout(17); }
    await p.waitForTimeout(200);
    await T("touchEnd", 380);
    await p.waitForTimeout(2300);
  } else {
    await p.evaluate(() => window.__play());
    const pt = await p.evaluate(() => window.__t || 0); if (pt) ts = pt - 200;
  }
  await p.waitForTimeout(60);
  const te = Date.now();
  await s.send("Page.stopScreencast");
  await ctx.close(); await b.close();
  // Frames into a constant 30fps sequence: for each output tick, the latest frame at or before it.
  frames.sort((a, z) => a.t - z.t);
  const N = Math.round((te - ts) / 1000 * 30); let j = 0, k = 0;
  for (let i = 0; i < N; i++) {
    const t = ts + i * 1000 / 30;
    while (j + 1 < frames.length && frames[j + 1].t <= t) j++;
    fs.writeFileSync(`${dir}/f${String(k++).padStart(4, "0")}.jpg`, Buffer.from(frames[j].data, "base64"));
  }
  fs.writeFileSync(__dirname + "/vid/" + name + ".json", JSON.stringify({ n: N, dur: N / 30, frames: frames.length }));
  console.log(name, "frames", frames.length, "out", N, (N / 30).toFixed(2) + "s");
})();
