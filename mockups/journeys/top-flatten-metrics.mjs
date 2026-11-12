// Step 2 of 2: the five bar numbers, now against each flatten. Reads out/preds.json and out/tops.json from step 1,
// and two live reads (SELECT only): LIVE_TOP {profile8: [top 50 unseen stored scores]}, LIVE_CAL {profile8: [n_rated, curve points|null]}.
//   MT=<montage>/lib/ LIVE_TOP=top.json LIVE_CAL=cal.json VARS='[[85,0.5],[85,0.45]]' node top-flatten-metrics.mjs
import { readFileSync } from "node:fs";
const MT = process.env.MT;
const mm = await import(MT + "taste/match-model.mjs");
const pc = await import(MT + "taste/personal-curve.mjs");
const SP = JSON.parse("[" + readFileSync(MT + "taste/shown-match.ts", "utf8").match(/SHOWN_MATCH_POINTS[^=]*=\s*\[([\s\S]*?)\];/)[1].replace(/,\s*$/, "") + "]");
const sm = (st) => { const s = Math.max(0, Math.min(100, st)); for (let i = 1; i < SP.length; i++) { const [x0, y0] = SP[i - 1], [x1, y1] = SP[i]; if (s <= x1) return y0 + ((s - x0) / (x1 - x0)) * (y1 - y0); } return 99; };
const inv = (sh) => { const y = Math.max(0, Math.min(99, sh)); for (let i = 1; i < SP.length; i++) { const [x0, y0] = SP[i - 1], [x1, y1] = SP[i]; if (y <= y1) return x0 + ((y - y0) / (y1 - y0)) * (x1 - x0); } return 100; };
const preds = JSON.parse(readFileSync("out/preds.json", "utf8")), tops = JSON.parse(readFileSync("out/tops.json", "utf8"));
const liveTop = JSON.parse(readFileSync(process.env.LIVE_TOP ?? "top.json", "utf8")), cal = JSON.parse(readFileSync(process.env.LIVE_CAL ?? "cal.json", "utf8"));
const g = (T, k) => (y) => (y <= T ? y : T + (y - T) * k);
// production emulation: y (unrounded shown, after personal curve) -> flatten -> stored int -> shown int.
// exact=false keeps the unrounded flatten (to see what rounding costs)
const prod = (y, hasCurve, f) => { const z = f ? f(y) : y; return hasCurve || f ? Math.round(sm(Math.max(0, Math.min(100, Math.round(inv(z)))))) : Math.round(z); };
const rank = (xs) => { const o = xs.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]); const r = new Array(xs.length); let i = 0; while (i < o.length) { let j = i; while (j + 1 < o.length && o[j + 1][0] === o[i][0]) j++; for (let k = i; k <= j; k++) r[o[k][1]] = (i + j) / 2; i = j + 1; } return r; };
const spearman = (a, b) => { const ra = rank(a), rb = rank(b), n = a.length, m = (n - 1) / 2; let s = 0, sa = 0, sb = 0; for (let i = 0; i < n; i++) { s += (ra[i] - m) * (rb[i] - m); sa += (ra[i] - m) ** 2; sb += (rb[i] - m) ** 2; } return sa && sb ? s / Math.sqrt(sa * sb) : NaN; };
const auc = (s, pos) => { const r = rank(s); let np = 0, sum = 0; for (let i = 0; i < s.length; i++) if (pos[i]) { np++; sum += r[i] + 1; } const nn = s.length - np; return np && nn ? (sum - np * (np + 1) / 2) / (np * nn) : NaN; };
const mean = (xs) => { const v = xs.filter(Number.isFinite); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN; };
const median = (xs) => { const v = [...xs].sort((a, b) => a - b); return v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2; };
const BANDS = [["90+", 90, 101], ["78-89", 78, 90], ["65-77", 65, 78], ["40-64", 40, 65], ["<40", -1, 40]];
const pct = (x) => (Number.isFinite(x) ? (x * 100).toFixed(1) + "%" : "n/a");
const by = new Map(); for (const p of preds) { if (!by.has(p.pid)) by.set(p.pid, []); by.get(p.pid).push(p); }
function evalVar(name, f) {
  const sh = (p) => prod(p.f1.sh3, tops[p.pid].curve, f);
  const us = [...by.values()].map((v) => ({ rho: v.length >= 8 ? spearman(v.map(sh), v.map((p) => p.r)) : NaN, auc: auc(v.map(sh), v.map((p) => p.r >= 4.5)) }));
  const rawUs = [...by.values()].map((v) => ({ rho: v.length >= 8 ? spearman(v.map((p) => p.f1.s), v.map((p) => p.r)) : NaN, auc: auc(v.map((p) => p.f1.s), v.map((p) => p.r >= 4.5)) }));
  const hi = preds.filter((p) => sh(p) >= 90), five = preds.filter((p) => p.r === 5);
  const bands = BANDS.map((b) => { const xs = preds.filter((p) => sh(p) >= b[1] && sh(p) < b[2]); return `${b[0]} n=${xs.length} ${mean(xs.map((p) => p.r)).toFixed(2)}`; });
  const t = (src, k) => Object.entries(src).map(([pid, v]) => v.slice(0, k).filter((x) => x >= 90).length / Math.min(k, v.length));
  const tsTop = Object.fromEntries(Object.entries(tops).filter(([pid]) => by.has(pid)).map(([pid, v]) => [pid, v.top.map((x) => prod(x.sh3, v.curve, f))]));
  const live = Object.fromEntries(Object.entries(liveTop).map(([pid, v]) => { const [n, curve] = cal[pid]; const sf = mm.spreadFor(n); const c = curve ? { pts: curve, n } : null; return [pid, v.map((s) => { const s1 = mm.atSpread(s, sf); return prod(pc.personalShown(c, s1, sm(s1)), !!c, f); })]; }));
  const l50 = t(live, 50), t50 = t(tsTop, 50), t17 = t(tsTop, 17);
  console.log(`\n== ${name}`);
  console.log(` per-user Spearman ${mean(us.map((u) => u.rho)).toFixed(4)} (stored score ${mean(rawUs.map((u) => u.rho)).toFixed(4)})  per-user AUC ${mean(us.map((u) => u.auc)).toFixed(4)} (stored ${mean(rawUs.map((u) => u.auc)).toFixed(4)})  pooled rho ${spearman(preds.map(sh), preds.map((p) => p.r)).toFixed(4)}`);
  console.log(` shown 90+: n=${hi.length}  4.5+ ${pct(mean(hi.map((p) => +(p.r >= 4.5))))}  <4 ${pct(mean(hi.map((p) => +(p.r < 4))))}  mean ${mean(hi.map((p) => p.r)).toFixed(2)}`);
  console.log(` 5-star n=${five.length}: at 85+ ${pct(mean(five.map((p) => +(sh(p) >= 85))))}  at 90+ ${pct(mean(five.map((p) => +(sh(p) >= 90))))}`);
  console.log(" bands: " + bands.join(" | "));
  console.log(` top50 at 90+ LIVE (23): median ${pct(median(l50))} mean ${pct(mean(l50))} over15: ${l50.filter((x) => x > 0.15).length}  owner ${pct(live["467a3dgd"].filter((x) => x >= 90).length / 50)} mom ${pct(live["syyd8u4q"].filter((x) => x >= 90).length / 50)}`);
  console.log(`   live sorted: ${l50.map((x) => Math.round(x * 100)).sort((a, b) => a - b).join(",")}`);
  console.log(` top at 90+ time-split models (19): top50 median ${pct(median(t50))} mean ${pct(mean(t50))} | top17 median ${pct(median(t17))} mean ${pct(mean(t17))}`);
  for (const [who, pid] of [["owner", "467a3dgd"], ["mom", "syyd8u4q"]]) {
    const v = by.get(pid) ?? []; const h = v.filter((p) => sh(p) >= 90), f5 = v.filter((p) => p.r === 5);
    console.log(` ${who}: held-out ${v.length}; 90+ n=${h.length}, 4.5+ ${pct(mean(h.map((p) => +(p.r >= 4.5))))}, <4 ${pct(mean(h.map((p) => +(p.r < 4))))}; 5-star ${f5.length}, at 85+ ${pct(mean(f5.map((p) => +(sh(p) >= 85))))}; rho ${spearman(v.map(sh), v.map((p) => p.r)).toFixed(3)}; live top50: ${live[pid].slice(0, 50).join(" ")}`);
  }
}
evalVar("now", null);
for (const [T, k] of (process.env.VARS ? JSON.parse(process.env.VARS) : [[85, 0.5]])) evalVar(`flatten above ${T} x${k}`, g(T, k));
