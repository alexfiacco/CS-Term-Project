// node share-cap-middle.mjs <data dir with films.json and ratings.json> <out.json>. Split A of montage scripts/eval-time-split/run.mjs, plus middle crowd caps and share readouts. Read-only; imports montage lib.
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
const MT = "/home/user/montage/lib/", DATA = process.argv[2];
const mm = await import(MT + "taste/match-model.mjs");
const pc = await import(MT + "taste/personal-curve.mjs");
const fk = await import(MT + "film-kind.mjs");
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
const U = new Map();
for (const [pid, slug, lr, a, w, ur, src, wo, ca] of JSON.parse(readFileSync(`${DATA}/ratings.json`, "utf8"))[0].j) {
  const f = F.get(slug); if (!f || f.tv) continue;
  const r = ur ?? lr; if (r == null) continue;
  const own = ur != null && (lr == null || lr !== ur);
  const date = own ? (wo ?? ca) : (a ?? w ?? (ur != null ? (wo ?? ca) : null));
  if (!U.has(pid)) U.set(pid, []);
  U.get(pid).push({ ...f, r, lb: mm.realCrowd(f.lb, f.watch), date: date ?? null, hash: h(pid + slug) });
}
for (const v of U.values()) v.sort((x, y) => (x.date ?? "").localeCompare(y.date ?? "") || x.hash - y.hash);
function prep(pid, trainIdx) {
  const all = U.get(pid), rated = trainIdx.map((i) => all[i]);
  const m = mm.buildUserModel(rated), st = mm.v3Stats(rated);
  const X = rated.map((c, j) => mm.v3Features(m, st, c, j));
  const Xref = REF.map((c) => mm.v3Features(m, st, { ...c, series: undefined }));
  return { pid, rated, m, st, X, y: st.like, Xref, feat: (c) => mm.v3Features(m, st, c) };
}
const D = mm.V3_FEATS.length, G = mm.V9_GROUPS;
const gi = (g) => G[g].map((f) => 1 + mm.V3_FEATS.indexOf(f)).filter((k) => k > 0);
// Middle cap: crowd at most `cap` of the movement, 'other' at most 5%, the freed movement to the two
// personal groups in proportion to what they already have (no 42/33 targets); no group grows past 2x.
function midCap(w, sd, cap) {
  const out = w.slice(); const { mass, total } = mm.v9Shares(w, sd); if (!(total > 0)) return out;
  const pers = mass.similar + mass.dna; if (!(pers > 0)) return out;
  let c = mass.crowd, o = mass.other, fp = 1;
  if (mass.crowd <= cap * total + 1e-12 && mass.other <= 0.05 * total + 1e-12) return out;
  c = Math.min(mass.crowd, cap * total); o = Math.min(mass.other, 0.05 * total);
  fp = Math.min(2, (total - c - o) / pers);
  for (let i = 0; i < 60; i++) { const t = pers * fp + c + o; c = Math.min(mass.crowd, cap * t); o = Math.min(mass.other, 0.05 * t); }
  const f = { crowd: mass.crowd > 0 ? c / mass.crowd : 1, other: mass.other > 0 ? o / mass.other : 1, similar: fp, dna: fp };
  for (const g of Object.keys(f)) for (const k of gi(g)) out[k] = w[k] * f[g];
  return out;
}
const CAPS = { mid30: 0.30, mid35: 0.35, mid40: 0.40 };
const CFGS = ["f1", "nocap", "mid30", "mid35", "mid40"];
function populations(preps) {
  const X = [], y = [];
  for (const P of preps) if (P.rated.length >= 3) { for (const x of P.X) X.push(x.map((v) => Math.round(v * 1e6) / 1e6)); y.push(...P.y); }
  const off = mm.v3Population(X, y, false), o = { f1: mm.v3Population(X, y, true, true), nocap: off };
  const ones = off.sd.map((_, k) => (X.some((x) => x[k] !== off.mu[k]) ? 1 : 0));
  for (const [k, cap] of Object.entries(CAPS)) o[k] = { ...off, w: midCap(off.w, ones, cap) };
  o._shares = Object.fromEntries(Object.entries(o).map(([k, p]) => [k, mm.v9Shares(p.w, ones).share]));
  return o;
}
function fit(P, pop, cfg) {
  if (cfg === "f1") return mm.v3FitUser(pop, P.X, P.y, P.rated, undefined, true, true);
  const w0 = mm.v3FitUser(pop, P.X, P.y, P.rated, undefined, false);
  if (cfg === "nocap" || P.X.length < 100) return w0;
  const c = midCap(w0.slice(0, D + 1), mm.featureSd(P.X.map((x) => mm.v3Norm(pop, x))), CAPS[cfg]);
  return [...c, ...w0.slice(D + 1)];
}
function run(P, pops, cfg, tests) {
  const pop = pops[cfg], w = fit(P, pop, cfg);
  const q = mm.v3Scale(P.Xref.map((x, i) => mm.v3Logit(pop, w, x) + mm.v3DecadeOffset(P.st, REF[i].year)));
  const sf = mm.spreadFor(P.rated.length);
  const sc = (x, c) => mm.atSpread(mm.v3FilmScore(q, mm.v3Logit(pop, w, x) + mm.v3DecadeOffset(P.st, c.year), c), sf);
  const loo = P.X.map((x, j) => sc(x, P.rated[j]));
  const curve = pc.fitPersonalCurve(loo, P.rated.map((c) => c.r));
  // shares of the score's movement over this person's own rated films, features as scored (shrunk)
  const s = w[w.length - 1];
  const share = mm.v9Shares(w.slice(0, D + 1), mm.featureSd(P.X.map((x) => mm.v3Shrunk ? mm.v3Shrunk(mm.v3Norm(pop, x), s) : mm.v3Norm(pop, x)))).share;
  const lbs = tests.map((c) => c.lb);
  return { out: tests.map((c) => { const s2 = sc(P.feat(c), c); const sh = shownMatch(s2); return { s: s2, sh, sh3: pc.personalShown(curve, s2, sh) }; }), share,
    refLb: (() => { const xs = [], ys = []; REF.forEach((c, i) => { if (c.lb != null) { xs.push(mm.v3Logit(pop, w, P.Xref[i])); ys.push(c.lb); } }); return [xs, ys]; })() };
}
const idx = (n) => [...Array(n).keys()];
const parts = [];
for (const [pid, all] of U) {
  const n = all.length; let best = null;
  for (let k = 1; k < n; k++) { if (!all[k].date || all[k].date === all[k - 1].date) continue; const share = (n - k) / n; if (share < 0.10 || share > 0.35 || n - k < 8 || k < 15) continue; if (!best || Math.abs(share - 0.2) < Math.abs(best.share - 0.2)) best = { k, share }; }
  parts.push(best ? { pid, train: idx(best.k), test: idx(n).slice(best.k) } : { pid, train: idx(n), test: [] });
}
const preps = parts.map((p) => prep(p.pid, p.train)); const pops = populations(preps);
const rank = (a) => { const o = a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]); const r = new Array(a.length); for (let i = 0; i < o.length;) { let j = i; while (j + 1 < o.length && o[j + 1][0] === o[i][0]) j++; for (let k = i; k <= j; k++) r[o[k][1]] = (i + j) / 2; i = j + 1; } return r; };
const spearman = (a, b) => { const ra = rank(a), rb = rank(b), n = a.length, m = (n - 1) / 2; let s = 0, sa = 0, sb = 0; for (let i = 0; i < n; i++) { s += (ra[i] - m) * (rb[i] - m); sa += (ra[i] - m) ** 2; sb += (rb[i] - m) ** 2; } return sa && sb ? s / Math.sqrt(sa * sb) : NaN; };
const auc = (s, y) => { const r = rank(s); let np = 0, sum = 0; y.forEach((v, i) => { if (v) { np++; sum += r[i] + 1; } }); const nn = y.length - np; return np && nn ? (sum - np * (np + 1) / 2) / (np * nn) : NaN; };
const mean = (a) => { const b = a.filter(Number.isFinite); return b.length ? b.reduce((x, y) => x + y, 0) / b.length : NaN; };
const res = {};
for (const cfg of CFGS) {
  const us = [], five = [], five3 = [], shares = [], acclaim = [];
  parts.forEach((p, i) => {
    const all = U.get(p.pid);
    const R = run(preps[i], pops, cfg, p.test.map((k) => all[k]));
    shares.push({ pid: p.pid, n: p.train.length, ...R.share });
    if (preps[i].rated.length >= 15) acclaim.push(spearman(R.refLb[0], R.refLb[1]));
    if (!p.test.length) return;
    const r = p.test.map((k) => all[k].r), s = R.out.map((o) => o.s);
    const top = s.map((v, k) => [v, r[k]]).sort((a, b) => b[0] - a[0]).slice(0, 10);
    us.push({ n: r.length, train: p.train.length, rho: r.length >= 8 ? spearman(s, r) : NaN, auc: auc(s, r.map((x) => x >= 4.5)), p10: r.length >= 20 ? top.filter((t) => t[1] >= 4.5).length / 10 : NaN });
    R.out.forEach((o, k) => { if (r[k] === 5) { five.push(+(Math.round(o.sh) >= 85)); five3.push(+(Math.round(o.sh3) >= 85)); } });
  });
  res[cfg] = { users: us.length, rho: mean(us.map((u) => u.rho)), auc: mean(us.map((u) => u.auc)), p10: mean(us.map((u) => u.p10)),
    rho100: mean(us.filter((u) => u.train >= 100).map((u) => u.rho)), rhoThin: mean(us.filter((u) => u.train < 100).map((u) => u.rho)),
    five85: mean(five), five85curve: mean(five3), n5: five.length, popShare: pops._shares[cfg], shares, acclaimMedian: acclaim.sort((a, b) => a - b)[Math.floor(acclaim.length / 2)], acclaimMax: Math.max(...acclaim) };
  console.error(cfg, res[cfg].rho.toFixed(3), res[cfg].auc.toFixed(3), res[cfg].p10.toFixed(2), res[cfg].five85.toFixed(2), res[cfg].five85curve.toFixed(2));
}
writeFileSync(process.argv[3], JSON.stringify(res));
