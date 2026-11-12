// Time-split check of the top-of-scale flatten (post-rescore-check.md, 2026-11-12). Step 1 of 2.
// Split A of montage scripts/eval-time-split/run.mjs, production config only, plus each model's best unseen reference films.
//   MT=<montage>/lib/ TS_DATA=<dump>/data TS_OUT=out node top-flatten-run.mjs   (about 40 s)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
const MT = process.env.MT;
const DATA = process.env.TS_DATA ?? ".work/time-split/data", OUT = process.env.TS_OUT ?? ".work/time-split/out";
const mm = await import(MT + "taste/match-model.mjs");
const pc = await import(MT + "taste/personal-curve.mjs");
const fk = await import(MT + "film-kind.mjs");
// shown-match.ts points, read from the source so the two cannot drift
const SP = JSON.parse("[" + readFileSync(MT + "taste/shown-match.ts", "utf8").match(/SHOWN_MATCH_POINTS[^=]*=\s*\[([\s\S]*?)\];/)[1].replace(/,\s*$/, "") + "]");
const shownMatch = (st) => { const s = Math.max(0, Math.min(100, st)); for (let i = 1; i < SP.length; i++) { const [x0, y0] = SP[i - 1], [x1, y1] = SP[i]; if (s <= x1) return y0 + ((s - x0) / (x1 - x0)) * (y1 - y0); } return 99; };

// ---- data
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
console.error("films", F.size, "ref", REF.length, "users", U.size);

// ---- one (user, train set): features once, then every config
const cache = new Map();
function prep(pid, trainIdx) {
  const key = pid + ":" + createHash("md5").update(trainIdx.join(",")).digest("hex");
  if (cache.has(key)) return cache.get(key);
  const all = U.get(pid), rated = trainIdx.map((i) => all[i]);
  const m = mm.buildUserModel(rated), st = mm.v3Stats(rated);
  const X = rated.map((c, j) => mm.v3Features(m, st, c, j));
  const Xref = REF.map((c) => mm.v3Features(m, st, { ...c, series: undefined }));
  const o = { pid, rated, m, st, X, y: st.like, Xref, feat: (c) => mm.v3Features(m, st, c) };
  cache.set(key, o); return o;
}
const D = mm.V3_FEATS.length;
function fit(P, pop, cfg) {
  if (cfg === "base") return mm.v3FitUser(pop, P.X, P.y, P.rated, undefined, true, false);
  if (cfg === "f1") return mm.v3FitUser(pop, P.X, P.y, P.rated, undefined, true, true);
  const w0 = mm.v3FitUser(pop, P.X, P.y, P.rated, undefined, false);
  if (cfg === "nocap") return w0;
  if (cfg === "f1a") { const c = mm.constrainShares(w0.slice(0, D + 1), mm.featureSd(P.X.map((x) => mm.v3Norm(pop, x))), true); return [...c, ...w0.slice(D + 1)]; }
  throw new Error(cfg);
}
const POPCFG = { base: "old", f1: "new", f1a: "new", nocap: "off" };
function populations(preps) {
  const X = [], y = [];
  for (const P of preps) if (P.rated.length >= 3) { for (const x of P.X) X.push(x.map((v) => Math.round(v * 1e6) / 1e6)); y.push(...P.y); }
  return { old: mm.v3Population(X, y, true, false), new: mm.v3Population(X, y, true, true), off: mm.v3Population(X, y, false) };
}
/** scores for test films + the LOO scores of the train films (for the personal curve) under one config */
function run(P, pops, cfg, tests) {
  const pop = pops[POPCFG[cfg]], w = fit(P, pop, cfg);
  const q = mm.v3Scale(P.Xref.map((x, i) => mm.v3Logit(pop, w, x) + mm.v3DecadeOffset(P.st, REF[i].year)));
  const n = P.rated.length, sf = mm.spreadFor(n);
  const sc = (x, c) => mm.atSpread(mm.v3FilmScore(q, mm.v3Logit(pop, w, x) + mm.v3DecadeOffset(P.st, c.year), c), sf);
  const loo = P.X.map((x, j) => sc(x, P.rated[j]));
  const curve = pc.fitPersonalCurve(loo, P.rated.map((c) => c.r));
  const out = tests.map((c) => { const s = sc(P.feat(c), c); const sh = shownMatch(s); return { s, sh, sh3: pc.personalShown(curve, s, sh) }; });
  const seen = new Set(U.get(P.pid).map((c) => c.slug));
  const top = REF.map((c, i) => ({ c, i })).filter((x) => !seen.has(x.c.slug)).map((x) => { const s = sc(P.Xref[x.i], { ...x.c, series: undefined }); const sh = shownMatch(s); return { s, sh, sh3: pc.personalShown(curve, s, sh) }; }).sort((a, b) => b.s - a.s).slice(0, 150);
  TOPS[P.pid] = { n, top, curve: !!curve };
  return { out, loo, w: w.slice(0, D + 1), shrink: w[w.length - 1], curve };
}
const CFGS = ["f1"]; const TOPS = {};
const preds = [];   // {split, pid, slug, r, n, date, <cfg>: {s, sh, sh3}}
const meta = { splits: {}, weights: [] };
function doSplit(name, parts, popPreps = null) {
  // parts: [{pid, train:[idx], test:[idx]}]; population from every user's train rows
  const t0 = Date.now();
  const preps = parts.map((p) => prep(p.pid, p.train));
  const pops = populations(popPreps ?? preps);
  let nt = 0;
  parts.forEach((p, i) => {
    if (!p.test.length) return;
    const all = U.get(p.pid), tests = p.test.map((k) => all[k]);
    const res = Object.fromEntries(CFGS.map((c) => [c, run(preps[i], pops, c, tests)]));
    tests.forEach((c, k) => { const row = { split: name, pid: p.pid, slug: c.slug, r: c.r, n: p.train.length, date: c.date }; for (const c2 of CFGS) row[c2] = res[c2].out[k]; preds.push(row); nt++; });
    for (const c2 of CFGS) meta.weights.push({ split: name, pid: p.pid, n: p.train.length, cfg: c2, w: res[c2].w.map((v) => +v.toPrecision(4)), shrink: +res[c2].shrink.toFixed(3) });
  });
  meta.splits[name] = { users: parts.filter((p) => p.test.length).length, tests: nt, popOld: pops.old.w.map((v) => +v.toFixed(3)), popNew: pops.new.w.map((v) => +v.toFixed(3)), popOff: pops.off.w.map((v) => +v.toFixed(3)) };
  console.error(name, meta.splits[name].users, "users", nt, "tests", ((Date.now() - t0) / 1000).toFixed(0) + "s");
  return { preps, pops };
}
const idx = (n) => [...Array(n).keys()];

// ---- A. per-user: the last ~20% by date
const partsA = [];
for (const [pid, all] of U) {
  const n = all.length; let best = null;
  for (let k = 1; k < n; k++) {
    if (!all[k].date || all[k].date === all[k - 1].date) continue;   // a boundary between two distinct dates, test all dated
    const share = (n - k) / n;
    if (share < 0.10 || share > 0.35 || n - k < 8 || k < 15) continue;
    if (!best || Math.abs(share - 0.2) < Math.abs(best.share - 0.2)) best = { k, share };
  }
  partsA.push(best ? { pid, train: idx(best.k), test: idx(n).slice(best.k), cut: all[best.k].date } : { pid, train: idx(n), test: [] });
}
meta.A = partsA.map((p) => ({ pid: p.pid, n: U.get(p.pid).length, train: p.train.length, test: p.test.length, cut: p.cut ?? null, dated: U.get(p.pid).filter((x) => x.date).length }));
const A = doSplit("A", partsA);


mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/preds.json`, JSON.stringify(preds));
writeFileSync(`${OUT}/tops.json`, JSON.stringify(TOPS));
console.error("done", preds.length);
