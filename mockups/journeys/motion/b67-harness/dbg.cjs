const { chromium } = require("/opt/node-tools/node_modules/playwright");
const { wire, URL } = require("./common.cjs");
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark", hasTouch: true });
  const p = await ctx.newPage();
  p.on("console", (m) => console.log(m.type(), m.text().slice(0, 300)));
  p.on("pageerror", (e) => console.log("ERR", e.message));
  await wire(p);
  await p.goto(URL(process.argv[2] || "open-row"));
  await p.waitForTimeout(3000);
  const at = await p.evaluate(() => { const i = [...document.querySelectorAll("img")].find((x) => (x.currentSrc || x.src).includes("e09dLw1Ljtccd2P4NsuUvVtS5du") && x.getBoundingClientRect().width > 40); const r = i.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r.width, r.height, i.complete]; });
  console.log("at", at);
  await p.evaluate(() => { document.addEventListener("click", (e) => console.log("click", e.target.tagName, e.target.className, e.detail, e.clientX, e.clientY), true);
    const t0 = performance.now(); const tick = () => { const o = document.querySelector(".modal-overlay"); if (o) console.log(Math.round(performance.now() - t0), o.className, !!document.querySelector(".fo-fly")); if (performance.now() - t0 < 4000) setTimeout(tick, 50); }; tick(); });
  await p.touchscreen.tap(at[0], at[1]);
  await p.waitForTimeout(1500);
  await b.close();
})();
