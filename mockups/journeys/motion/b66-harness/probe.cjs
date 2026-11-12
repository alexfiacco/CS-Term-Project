const { chromium } = require("/opt/node-tools/node_modules/playwright");
const { wire, URL } = require("./common.cjs");
(async () => {
  const [c, wait, js] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark", hasTouch: true });
  p.on("pageerror", (e) => console.log("ERR", (e.stack || e.message).slice(0, 500)));
  p.on("console", (m) => { if (m.type() === "error" || m.type() === "log") console.log(m.type(), m.text().slice(0, 300)); });
  await wire(p);
  await p.goto(URL(c));
  await p.waitForTimeout(+(wait || 2500));
  if (js) { console.log(await p.evaluate(js)); await p.waitForTimeout(800); }
  await p.screenshot({ path: __dirname + "/p-" + c + ".png" });
  await b.close();
})();
