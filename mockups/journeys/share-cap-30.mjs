// Split A with the production share cap at 20/30/35/off (curve on), and the accuracy levers (recency, loved/rewatch, neighbours, noise ceiling).
// Run from a montage worktree at /home/user/wt-cap30: it first writes lib/taste/_eval_capNN.mjs (match-model.mjs with the four V9_SHARE_* constants
// replaced and a per-row weight hook in fitLogistic), then: node share-cap-30.mjs <data dir> <signals.json: {pid:{slug:[liked,rewatch]}}> <out.json>
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
const MT = "/home/user/wt-cap30/lib/", DATA = process.argv[2];
const M = { cap20: await import(MT + "taste/_eval_cap20.mjs"), cap30: await import(MT + "taste/_eval_cap30.mjs"), cap35: await import(MT + "taste/_eval_cap35.mjs") };
const mm = M.cap30; M.off = mm;
const pc = await import(MT + "taste/personal-curve.mjs");
const fk = await import(MT + "film-kind.mjs");
const SIG = JSON.parse(readFileSync(process.argv[3], "utf8"));
const SP = JSON.parse("[" + readFileSync(MT + "taste/shown-match.ts", "utf8").match(/SHOWN_MATCH_POINTS[^=]*=\s*\[([\s\S]*?)\];/)[1].replace(/,\s*$/, "") + "]");
const shownMatch = (st) => { const s = Math.max(0, Math.min(100, st)); for (let i = 1; i < SP.length; i++) { const [x0, y0] = SP[i - 1], [x1, y1] = SP[i]; if (s <= x1) return y0 + ((s - x0) / (x1 - x0)) * (y1 - y0); } return 99; };
const F = new Map();
for (const x of JSON.parse(readFileSync(`${DATA}/films.json`, "utf8"))) {
  const b = Buffer.from(x[17], "base64"); const v = new Float32Array(mm.DIM); for (let i = 0; i < mm.DIM; i++) v[i] = (b[i] - 128) / 666;
  const kw = x[12] == null ? [] : (x[13] > 0 && !x[12].length ? ["_"] : x[12]);
  const raw = { letterboxd_slug: x[0], media_type: x[15], title: x[2] ?? "", runtime_minutes: x[11], tmdb_keywords: kw };
  F.set(x[0], { slug: x[0], rn: x[1], title: x[2] ?? "", year: x[3], lb: x[4], tm: x[5], watch: x[6], traits: x[7] ?? [], genres: x[8] ?? [], directors: x[9] ?? [], lang: x[10], runtime: x[11], keywords: kw, dup: !!x[14],
    tv: (!!x[15] && x[15] !== "movie") || fk.isNonFilm(raw), labels: x[16] ?? null, v: mm.unit(v) });
}
const REF = [...F.values()].filter((f) => f.rn != null).sort((a, b) => a.rn - b.rn).filter((f) => mm.v3Recommendable(f));
const h = (s) => createHash("md5").update(s).digest().readUInt32BE(0);
const U = new Map(); const rerate = [];
for (const [pid, slug, lr, a, w, ur, src, wo, ca] of JSON.parse(readFileSync(`${DATA}/ratings.json`, "utf8"))[0].j) {
  if (lr != null && ur != null) rerate.push([pid, lr, ur, src, a ?? w, wo ?? ca]);
  const f = F.get(slug); if (!f || f.tv) continue;
  const r = ur ?? lr; if (r == null) continue;
  const own = ur != null && (lr == null || lr !== ur);
  const date = own ? (wo ?? ca) : (a ?? w ?? (ur != null ? (wo ?? ca) : null));
  if (!U.has(pid)) U.set(pid, []);
  const sg = SIG[pid]?.[slug] ?? [0, 0];
  U.get(pid).push({ ...f, r, lb: mm.realCrowd(f.lb, f.watch), date: date ?? null, hash: h(pid + slug), liked: sg[0], rw: sg[1] });
}
for (const v of U.values()) v.sort((x, y) => (x.date ?? "").localeCompare(y.date ?? "") || x.hash - y.hash);
function prep(pid, trainIdx) {
  const all = U.get(pid), rated = trainIdx.map((i) => all[i]);
  const m = mm.buildUserModel(rated), st = mm.v3Stats(rated);
  const X = rated.map((c, j) => mm.v3Features(m, st, c, j));
  const Xref = REF.map((c) => mm.v3Features(m, st, { ...c, series: undefined }));
  return { pid, rated, m, st, X, y: st.like, Xref, feat: (c) => mm.v3Features(m, st, c) };
}
const D = mm.V3_FEATS.length;
function populations(preps) {
  const X = [], y = [];
  for (const P of preps) if (P.rated.length >= 3) { for (const x of P.X) X.push(x.map((v) => Math.round(v * 1e6) / 1e6)); y.push(...P.y); }
  const o = {}; for (const k of ["cap20", "cap30", "cap35"]) o[k] = M[k].v3Population(X, y, true, true);
  o.off = mm.v3Population(X, y, false);
  const ones = o.off.sd.map((_, k) => (X.some((x) => x[k] !== o.off.mu[k]) ? 1 : 0));
  o._shares = Object.fromEntries(Object.entries(o).map(([k, p]) => [k, mm.v9Shares(p.w, ones).share]));
  return o;
}
const fit = (P, pop, cfg, roww = null) => { globalThis.__ROWW = roww; try { return cfg === "off" ? mm.v3FitUser(pop, P.X, P.y, P.rated, undefined, false) : M[cfg].v3FitUser(pop, P.X, P.y, P.rated, undefined, true, true); } finally { globalThis.__ROWW = null; } };
const shareOf = (P, pop, w) => { const s = w[w.length - 1]; return mm.v9Shares(w.slice(0, D + 1), mm.featureSd(P.X.map((x) => mm.v3Shrunk(mm.v3Norm(pop, x), s)))).share; };
function run(P, pops, cfg, tests, roww = null) {
  const pop = pops[cfg], w = fit(P, pop, cfg, roww);
  const q = mm.v3Scale(P.Xref.map((x, i) => mm.v3Logit(pop, w, x) + mm.v3DecadeOffset(P.st, REF[i].year)));
  const sf = mm.spreadFor(P.rated.length);
  const sc = (x, c) => mm.atSpread(mm.v3FilmScore(q, mm.v3Logit(pop, w, x) + mm.v3DecadeOffset(P.st, c.year), c), sf);
  const loo = P.X.map((x, j) => sc(x, P.rated[j]));
  const curve = pc.fitPersonalCurve(loo, P.rated.map((c) => c.r));
  const xs = [], ys = []; REF.forEach((c, i) => { if (c.lb != null) { xs.push(mm.v3Logit(pop, w, P.Xref[i])); ys.push(c.lb); } });
  return { curve, maxW: Math.max(...w.slice(0, D + 1).map(Math.abs)), share: shareOf(P, pop, w), acclaim: spearman(xs, ys),
    out: tests.map((c) => { const s2 = sc(P.feat(c), c); const sh = shownMatch(s2); return { s: s2, sh, sh3: pc.personalShown(curve, s2, sh) }; }) };
}
const idx = (n) => [...Array(n).keys()];
const rank = (xs) => { const o = xs.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]); const r = new Array(xs.length); let i = 0; while (i < o.length) { let j = i; while (j + 1 < o.length && o[j + 1][0] === o[i][0]) j++; for (let k = i; k <= j; k++) r[o[k][1]] = (i + j) / 2; i = j + 1; } return r; };
function spearman(a, b) { const ra = rank(a), rb = rank(b), n = a.length, m = (n - 1) / 2; let s = 0, sa = 0, sb = 0; for (let i = 0; i < n; i++) { s += (ra[i] - m) * (rb[i] - m); sa += (ra[i] - m) ** 2; sb += (rb[i] - m) ** 2; } return sa && sb ? s / Math.sqrt(sa * sb) : NaN; }
const auc = (s, pos) => { const r = rank(s); let np = 0, sum = 0; for (let i = 0; i < s.length; i++) if (pos[i]) { np++; sum += r[i] + 1; } const nn = s.length - np; return np && nn ? (sum - np * (np + 1) / 2) / (np * nn) : NaN; };
const mean = (xs) => { const v = xs.filter((x) => Number.isFinite(x)); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN; };
const med = (xs) => { const v = xs.slice().sort((a, b) => a - b); return v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2; };
const BANDS = [["love", 90, 101, (r) => r >= 4.5], ["really", 78, 90, (r) => r === 4], ["like", 65, 78, (r) => r === 3.5], ["mixed", 40, 65, (r) => r >= 2.5 && r <= 3], ["not", -1, 40, (r) => r <= 2]];
const bandOf = (sh) => BANDS.find((b) => Math.round(sh) >= b[1] && Math.round(sh) < b[2]);
// rows: {pid, r, slug, n, v:{name:{s, sh}}}; variant value f(row) = shown %, g(row) = raw score for ranking
function userStats(rows, f) {
  const s = rows.map(f), r = rows.map((p) => p.r);
  const top = rows.map((p, i) => [s[i], p.r, p.slug]).sort((a, b) => b[0] - a[0] || (a[2] < b[2] ? -1 : 1)).slice(0, 10);
  return { rho: rows.length >= 8 ? spearman(s, r) : NaN, auc: auc(s, r.map((x) => x >= 4.5)), p10a: rows.length >= 20 ? top.filter((t) => t[1] >= 4.5).length / top.length : NaN, p10b: rows.length >= 20 ? top.filter((t) => t[1] >= 4).length / top.length : NaN };
}
function summarize(rows, f) {
  const by = new Map(); for (const p of rows) { if (!by.has(p.pid)) by.set(p.pid, []); by.get(p.pid).push(p); }
  const us = [...by.values()].map((v) => userStats(v, f));
  const s = rows.map(f), r = rows.map((p) => p.r); const five = rows.filter((p) => p.r === 5).map(f);
  const bands = BANDS.map((b) => { const xs = rows.filter((p) => bandOf(f(p)) === b); return { band: b[0], n: xs.length, mean: mean(xs.map((p) => p.r)), p45: mean(xs.map((p) => +(p.r >= 4.5))) }; });
  const ms = bands.filter((b) => b.n >= 5).map((b) => b.mean);
  return { users: by.size, rhoU: mean(us.map((u) => u.rho)), aucU: mean(us.map((u) => u.auc)), p10a: mean(us.map((u) => u.p10a)), p10b: mean(us.map((u) => u.p10b)), rho: spearman(s, r), auc: auc(s, r.map((x) => x >= 4.5)),
    n5: five.length, five85: mean(five.map((x) => +(Math.round(x) >= 85))), bandAcc: mean(rows.map((p) => +bandOf(f(p))[3](p.r))), monotone: ms.every((m, i) => i === 0 || m <= ms[i - 1] + 1e-9), bands };
}
let seed = 12345; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const KEYS = ["rhoU", "aucU", "p10a", "p10b", "rho", "auc", "five85", "bandAcc"];
function boot(rows, V, base, B = 1000) {
  seed = 12345;
  const by = new Map(); for (const p of rows) { if (!by.has(p.pid)) by.set(p.pid, []); by.get(p.pid).push(p); }
  const groups = [...by.values()], names = Object.keys(V);
  const draws = Object.fromEntries(names.map((v) => [v, Object.fromEntries(KEYS.map((k) => [k, []]))])), diffs = JSON.parse(JSON.stringify(draws));
  for (let b = 0; b < B; b++) {
    const samp = []; groups.forEach(() => { const g = groups[Math.floor(rnd() * groups.length)]; const tag = samp.length; for (const p of g) samp.push({ ...p, pid: p.pid + "#" + tag }); });
    const bs = summarize(samp, V[base]);
    for (const v of names) { const s = v === base ? bs : summarize(samp, V[v]); for (const k of KEYS) { draws[v][k].push(s[k]); diffs[v][k].push(s[k] - bs[k]); } }
  }
  const ci = (xs) => { const v = xs.filter(Number.isFinite).sort((a, b) => a - b); return v.length ? [v[Math.floor(0.025 * v.length)], v[Math.min(v.length - 1, Math.floor(0.975 * v.length))]] : [NaN, NaN]; };
  return Object.fromEntries(names.map((v) => [v, Object.fromEntries(KEYS.map((k) => [k, { ci: ci(draws[v][k]), dci: ci(diffs[v][k]) }]))]));
}
const f3 = (x) => (Number.isFinite(x) ? x.toFixed(3) : "n/a"), pct = (x) => (Number.isFinite(x) ? Math.round(x * 100) + "%" : "n/a");
function table(title, rows, V, base, B = 1000) {
  const bt = boot(rows, V, base, B), out = {};
  console.log(`\n## ${title}: ${new Set(rows.map((p) => p.pid)).size} users, ${rows.length} films, ${rows.filter((p) => p.r === 5).length} five-star; Δ vs ${base}`);
  console.log("variant | Spearman/user [CI] (ΔCI) | AUC/user [CI] (ΔCI) | P@10 4.5+ (ΔCI) | P@10 4+ | pooled rho (ΔCI) | band acc [CI] (ΔCI) | 5★≥85 [CI] (ΔCI) | monotone");
  for (const [v, f] of Object.entries(V)) {
    const s = summarize(rows, f), b = bt[v]; out[v] = { ...s, boot: b };
    const c = (k, fmt = f3) => `${fmt(s[k])} [${fmt(b[k].ci[0])},${fmt(b[k].ci[1])}] (${fmt(b[k].dci[0])},${fmt(b[k].dci[1])})`;
    console.log(`${v} | ${c("rhoU")} | ${c("aucU")} | ${f3(s.p10a)} (${f3(b.p10a.dci[0])},${f3(b.p10a.dci[1])}) | ${f3(s.p10b)} | ${f3(s.rho)} (${f3(b.rho.dci[0])},${f3(b.rho.dci[1])}) | ${c("bandAcc", pct)} | ${c("five85", pct)} | ${s.monotone}`);
  }
  return out;
}
// ---- split A
const parts = [];
for (const [pid, all] of U) {
  const n = all.length; let best = null;
  for (let k = 1; k < n; k++) { if (!all[k].date || all[k].date === all[k - 1].date) continue; const share = (n - k) / n; if (share < 0.10 || share > 0.35 || n - k < 8 || k < 15) continue; if (!best || Math.abs(share - 0.2) < Math.abs(best.share - 0.2)) best = { k, share }; }
  parts.push(best ? { pid, train: idx(best.k), test: idx(n).slice(best.k) } : { pid, train: idx(n), test: [] });
}
const preps = parts.map((p) => prep(p.pid, p.train)); const pops = populations(preps);
console.log("population shares", JSON.stringify(pops._shares));
const CFGS = ["cap20", "cap30", "cap35", "off"];
const rows = []; const res = { shares: {}, acclaim: {}, maxW: {} };
parts.forEach((p, i) => {
  const all = U.get(p.pid), tests = p.test.map((k) => all[k]);
  const R = Object.fromEntries(CFGS.map((c) => [c, run(preps[i], pops, c, tests)]));
  for (const c of CFGS) { (res.shares[c] ??= []).push({ pid: p.pid, n: p.train.length, inSplit: p.test.length > 0, ...R[c].share }); if (preps[i].rated.length >= 15) (res.acclaim[c] ??= []).push(R[c].acclaim); (res.maxW[c] ??= []).push(R[c].maxW); }
  tests.forEach((c, k) => rows.push({ pid: p.pid, slug: c.slug, r: c.r, n: p.train.length, date: c.date, k: p.test[k], pi: i, v: Object.fromEntries(CFGS.map((cf) => [cf, R[cf].out[k]])) }));
  p.R30 = R.cap30;
});
const V = {}; for (const c of CFGS) { V[`${c} + curve`] = (p) => p.v[c].sh3; } for (const c of CFGS) V[`${c} (no curve)`] = (p) => p.v[c].sh;
res.A = table("Split A, all", rows, V, "cap20 + curve");
res.Athick = table("Split A, train>=100", rows.filter((p) => p.n >= 100), V, "cap20 + curve");
res.Athin = table("Split A, train<100", rows.filter((p) => p.n < 100), V, "cap20 + curve");
for (const v of Object.keys(V).slice(0, 4)) console.log(`  bands ${v}: ` + res.A[v].bands.map((b) => `${b.band} n=${b.n} ${f3(b.mean)}★ p45=${pct(b.p45)}`).join(" | "));
const shr = (list) => `median ${pct(med(list))}, range ${pct(Math.min(...list))} to ${pct(Math.max(...list))}`;
for (const c of CFGS) {
  const S = res.shares[c];
  console.log(`shares ${c} (training fits): crowd all ${S.length}: ${shr(S.map((s) => s.crowd))}; 100+ (${S.filter((s) => s.n >= 100).length}): ${shr(S.filter((s) => s.n >= 100).map((s) => s.crowd))}; under 100 (${S.filter((s) => s.n < 100).length}): ${shr(S.filter((s) => s.n < 100).map((s) => s.crowd))}; similar 100+: ${shr(S.filter((s) => s.n >= 100).map((s) => s.similar))}; dna 100+: ${shr(S.filter((s) => s.n >= 100).map((s) => s.dna))}; acclaim median ${f3(med(res.acclaim[c]))} max ${f3(Math.max(...res.acclaim[c]))}; max |w| ${Math.max(...res.maxW[c]).toFixed(2)}`);
}
// full-library fits (what production will hold), cap 30 and cap 20
{
  const full = [...U.keys()].map((pid) => { const all = U.get(pid); const m = mm.buildUserModel(all), st = mm.v3Stats(all); return { pid, rated: all, X: all.map((c, j) => mm.v3Features(m, st, c, j)), y: st.like }; });
  const X = [], y = []; for (const P of full) if (P.rated.length >= 3) { for (const x of P.X) X.push(x.map((v) => Math.round(v * 1e6) / 1e6)); y.push(...P.y); }
  for (const c of ["cap20", "cap30"]) {
    const pop = M[c].v3Population(X, y, true, true);
    const S = full.filter((P) => P.rated.length >= 3).map((P) => { const w = fit(P, pop, c); return { pid: P.pid, n: P.rated.length, maxW: Math.max(...w.slice(0, D + 1).map(Math.abs)), ...shareOf(P, pop, w) }; });
    res["fullShares_" + c] = S;
    console.log(`FULL-library ${c}: crowd all ${S.length}: ${shr(S.map((s) => s.crowd))}; 100+ (${S.filter((s) => s.n >= 100).length}): ${shr(S.filter((s) => s.n >= 100).map((s) => s.crowd))}; under 100 (${S.filter((s) => s.n < 100).length}): ${shr(S.filter((s) => s.n < 100).map((s) => s.crowd))}; similar+dna 100+: ${shr(S.filter((s) => s.n >= 100).map((s) => s.similar + s.dna))}; max |w| ${Math.max(...S.map((s) => s.maxW)).toFixed(2)}`);
  }
}
// ---- levers, on cap 30 with the curve
const LV = { "cap30 (base)": (p) => p.v.cap30.sh3 };
const dayOf = (d) => (d ? Date.parse(d.length <= 10 ? d + "T00:00:00Z" : d + "Z") / 864e5 : null);
const lever = (name, wf) => {
  parts.forEach((p, i) => { if (!p.test.length) return; const P = preps[i]; const w0 = wf(P); const m = mean(w0); const R = run(P, pops, "cap30", p.test.map((k) => U.get(p.pid)[k]), w0.map((x) => x / m)); rows.filter((r) => r.pi === i).forEach((r, k) => { r.v[name] = R.out[k]; }); });
  LV[name] = (p) => p.v[name].sh3;
};
for (const hl of [180, 365, 730, 1460]) lever(`recency half-life ${hl}d`, (P) => { const ds = P.rated.map((c) => dayOf(c.date)); const known = ds.filter((d) => d != null); if (!known.length) return ds.map(() => 1); const mx = Math.max(...known), mn = Math.min(...known); return ds.map((d) => Math.pow(0.5, (mx - (d ?? mn)) / hl)); });
for (const [nm, a, b] of [["loved x1.5", 1.5, 1], ["loved x2", 2, 1], ["rewatch x2", 1, 2], ["loved x2, rewatch x2", 2, 2], ["loved x3, rewatch x3", 3, 3]]) lever(nm, (P) => P.rated.map((c) => (c.liked ? a : 1) * (c.rw ? b : 1)));
// neighbour signal: other members' ratings dated before this person's cutoff
{
  const zs = new Map(); for (const [pid, all] of U) { const m = mean(all.map((c) => c.r)); const sd = Math.sqrt(mean(all.map((c) => (c.r - m) ** 2))) || 1; zs.set(pid, new Map(all.map((c) => [c.slug, { z: (c.r - m) / sd, date: c.date, res: c.lb != null ? c.r - c.lb : null }]))); }
  let cov = 0, tot = 0; const nb = new Map(), mb = new Map();
  parts.forEach((p, i) => {
    if (!p.test.length) return; const all = U.get(p.pid); const cut = all[p.test[0]].date; const mine = new Map(p.train.map((k) => [all[k].slug, all[k]]));
    const mm_ = mean(p.train.map((k) => all[k].r)), sd_ = Math.sqrt(mean(p.train.map((k) => (all[k].r - mm_) ** 2))) || 1;
    const sims = [];
    for (const [q, zq] of zs) { if (q === p.pid) continue; const a = [], b = []; for (const [slug, o] of zq) { if (o.date != null && o.date >= cut) continue; const c = mine.get(slug); if (c) { a.push((c.r - mm_) / sd_); b.push(o.z); } }
      if (a.length < 5) continue; const ma = mean(a), mb2 = mean(b); let s = 0, sa = 0, sb = 0; for (let j = 0; j < a.length; j++) { s += (a[j] - ma) * (b[j] - mb2); sa += (a[j] - ma) ** 2; sb += (b[j] - mb2) ** 2; } const r = sa && sb ? s / Math.sqrt(sa * sb) : 0; sims.push([q, r * a.length / (a.length + 10)]); }
    for (const k of p.test) { const c = all[k]; let num = 0, den = 0, mn = 0, mc = 0; for (const [q, s] of sims) { const o = zs.get(q).get(c.slug); if (!o || (o.date != null && o.date >= cut)) continue; mn += o.z; mc++; if (s > 0) { num += s * o.z; den += s; } }
      tot++; if (mc) cov++; nb.set(p.pid + c.slug, den > 0 ? num / (den + 0.5) : 0); mb.set(p.pid + c.slug, mc ? mn / (mc + 1) : 0); }
  });
  console.log(`\nneighbour coverage: ${cov} of ${tot} held-out films have at least one other member's earlier rating (${pct(cov / tot)})`);
  for (const lam of [5, 10, 20]) {
    for (const [nm, mp] of [[`neighbours (similar members) +${lam}/z`, nb], [`members' mean, unweighted +${lam}/z`, mb]]) {
      rows.forEach((r) => { const P = parts[r.pi].R30; const s2 = Math.max(0, Math.min(100, r.v.cap30.s + lam * mp.get(r.pid + r.slug))); const sh = shownMatch(s2); r.v[nm] = { s: s2, sh, sh3: pc.personalShown(P.curve, s2, sh) }; });
      LV[nm] = (p) => p.v[nm].sh3;
    }
  }
}
res.levers = table("Levers on cap 30 + curve, split A all", rows, LV, "cap30 (base)");
res.leversThick = table("Levers, train>=100", rows.filter((p) => p.n >= 100), LV, "cap30 (base)", 500);
// dated accounts only for recency (imported: day-level dates spanning > 180 days in training)
{ const span = new Set(); parts.forEach((p, i) => { const ds = preps[i].rated.map((c) => dayOf(c.date)).filter((d) => d != null); if (ds.length && Math.max(...ds) - Math.min(...ds) > 180) span.add(i); });
  const RV = Object.fromEntries(Object.entries(LV).filter(([k]) => k.startsWith("cap30") || k.startsWith("recency")));
  res.leversDated = table("Recency, accounts whose training dates span > 180 days", rows.filter((p) => span.has(p.pi)), RV, "cap30 (base)", 500); }
// ---- noise ceiling
{
  const dif = rerate.filter((x) => x[1] !== x[2]); console.log(`\nre-rated: ${rerate.length} films carry both an imported and an in-app rating; ${dif.length} differ; mean |Δ| among those ${f3(mean(dif.map((x) => Math.abs(x[1] - x[2]))))}; RMS over all pairs ${f3(Math.sqrt(mean(rerate.map((x) => (x[1] - x[2]) ** 2))))}; users ${new Set(rerate.map((x) => x[0])).size}`);
  const by = new Map(); for (const p of rows) { if (!by.has(p.pid)) by.set(p.pid, []); by.get(p.pid).push(p.r); }
  const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const q = (x) => Math.max(0.5, Math.min(5, Math.round(x * 2) / 2));
  res.ceiling = {};
  for (const se of [0, 0.25, 0.35, 0.5, 0.7, 1.0]) {
    const per = [], perA = [];
    for (const rs of by.values()) { if (rs.length < 8) continue; const m = mean(rs), vo = mean(rs.map((r) => (r - m) ** 2)); const vt = Math.max(0.01, vo - se * se - 1 / 48); const st = Math.sqrt(vt);
      const rr = [], aa = []; for (let t = 0; t < 400; t++) { const tr = rs.map(() => m + st * gauss()); const ob = tr.map((x) => q(x + se * gauss())); const s = spearman(tr, ob); if (Number.isFinite(s)) rr.push(s); const a = auc(tr, ob.map((x) => x >= 4.5)); if (Number.isFinite(a)) aa.push(a); }
      per.push(mean(rr)); perA.push(mean(aa)); }
    res.ceiling[se] = { rho: mean(per), auc: mean(perA) };
    console.log(`ceiling, rating noise SD ${se}★: best achievable per-user Spearman ${f3(mean(per))}, AUC 4.5★+ ${f3(mean(perA))} (users ${per.length})`);
  }
  console.log("held-out rating SD per user: median", f3(med([...by.values()].filter((r) => r.length >= 8).map((rs) => { const m = mean(rs); return Math.sqrt(mean(rs.map((r) => (r - m) ** 2))); }))));
  // references on the same held-out films
  const REFV = { "cap30 (base)": LV["cap30 (base)"], "crowd average alone": (p) => (F.get(p.slug).lb ?? 3.3) * 20 };
  res.refs = table("Reference: crowd average alone", rows, REFV, "cap30 (base)", 300);
}
writeFileSync(process.argv[4], JSON.stringify(res));
