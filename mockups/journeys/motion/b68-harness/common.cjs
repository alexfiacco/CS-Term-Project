const fs = require("fs");
const H = __dirname;
const IMGDIRS = ["/home/user/CS-Term-Project/mockups/img/tmdb/", H + "/../b64/img/"];
const pool = [];
for (const d of IMGDIRS.filter((x) => fs.existsSync(x))) for (const f of fs.readdirSync(d)) if (f.endsWith(".jpg")) pool.push(d + f);
const extra = "/home/user/CS-Term-Project/mockups/journeys/lists-v1-img/";
for (const f of fs.readdirSync(extra)) if (f.endsWith(".jpg")) pool.push(extra + f);
const MIME = { html: "text/html", js: "text/javascript", css: "text/css", svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", woff: "font/woff", woff2: "font/woff2", ttf: "font/ttf", webp: "image/webp", ico: "image/x-icon" };
async function wire(p) {
  await p.route("https://image.tmdb.org/**", (r) => {
    const m = r.request().url().match(/\/([A-Za-z0-9_]+)\.jpg/); const id = m ? m[1] : "x";
    let f = IMGDIRS.filter((x) => fs.existsSync(x)).map((d) => d + id + ".jpg").find((x) => fs.existsSync(x));
    if (!f) { let h = 0; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0; f = pool[h % pool.length]; }
    return r.fulfill({ path: f });
  });
  await p.route("http://m.test/**", (r) => { const u = new URL(r.request().url()); let f = decodeURIComponent(u.pathname);
    f = f.startsWith("/_h/") ? H + f.slice(3) : f.startsWith("/_wt/") ? "/home/user/wt-b38-motion" + f.slice(4) : f.startsWith("/_j/") ? "/home/user/CS-Term-Project/mockups/journeys" + f.slice(3) : "/home/user/wt-b38-motion/public" + f;
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({ status: 404, body: "" });
    r.fulfill({ status: 200, contentType: MIME[f.split(".").pop()] || "application/octet-stream", body: fs.readFileSync(f) }); });
}
module.exports = { wire, URL: (c) => "http://m.test/_h/h.html?c=" + c };
