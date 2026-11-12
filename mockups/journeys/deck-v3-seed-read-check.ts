/** NO-SAVE replay (deck-v3-archetype-check): the shipped-tonight deck, archetype from 15/20/30 rated vs the full library. JSON exports only. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { type FilmFacts, sharesOf } from "../lib/taste/unified/model";
import { mergeInAppRated } from "../lib/inapp-merge";
import { isNonFilm } from "../lib/film-kind.mjs";
import { trustArt } from "../lib/label-confidence";
import { ARCHETYPES } from "../lib/archetype-info";
import * as PR from "../lib/taste-test/probes";
import * as R from "../lib/taste/unified/report";

const DIR = process.argv[2], OUT = process.argv[3];
const load = <T,>(f: string): T => JSON.parse(readFileSync(join(DIR, f), "utf8")) as T;
type ProfileIn = { id: string; user_id: string | null; rated: { slug: string; rating: number | null; liked: boolean; rw?: boolean; rc?: number; lc?: number }[] | null; keys: string[] | null; arch_label: string | null; arch_top: string[] | null; quiz: string | null };
type FilmIn = { s: string; t: string; y: number | null; d: string[] | null; g: string[] | null; l: string | null; r: number | null; c: number | null; m: string | null; du: string | null; w: number | null; sp: boolean; lb: Record<string, number | string | boolean | null> | null; ln: string[] | null };
type InApp = { k: "r" | "x" | "c"; owner_key: string; slug: string; rating: number | null; liked: boolean | null; source: string | null; is_rewatch: boolean | null };
const profilesIn = load<ProfileIn[]>("profiles.json"), filmsIn = load<FilmIn[]>("films.json"), inapp = load<InApp[]>("inapp.json");
const filmRow = new Map(filmsIn.map((f) => [f.s, f]));
const nonFilm = (slug: string) => { const f = filmRow.get(slug); return !!f && isNonFilm({ media_type: f.m, tmdb_keywords: f.sp ? ["tv special"] : [], runtime_minutes: f.r, letterboxd_slug: f.s, title: f.t }); };
const facts = new Map<string, FilmFacts>();
for (const f of filmsIn) facts.set(f.s, { slug: f.s, title: f.t, year: f.y, directors: f.d ?? [], genres: f.g ?? [], nonEnglish: !!f.l && f.l !== "en", language: f.l, runtime: f.r, crowd: f.c != null ? Number(f.c) : null, watches: f.w, poster: null,
  labels: f.lb ? trustArt(f.lb as never) : null, lanes: f.ln ?? [],
  feature: !(f.g ?? []).some((g) => g === "Documentary" || g === "TV Movie") && !(f.r != null && f.r > 0 && f.r < 40) && !(f.m && f.m !== "movie") && !f.du && !/special look|making of|behind the scenes|: live at|live in concert/i.test(f.t ?? "") } as FilmFacts);
const ntitle = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]/g, "");
const byTitle = new Map<string, FilmIn[]>();
for (const f of filmsIn) { const k = ntitle(f.t ?? ""); byTitle.set(k, [...(byTitle.get(k) ?? []), f]); }
type Film = { slug: string; rating: number | null; liked: boolean; rw?: boolean; rc?: number; lc?: number };
type P = { label: string; quiz: boolean; row: { id: string; username: null; user_id: string | null; arch: null; sigs: null }; films: Film[]; canon: Set<string> };
const people: P[] = profilesIn.map((p) => {
  const mine = inapp.filter((x) => x.k === "r" && x.owner_key === p.user_id).map((x) => ({ slug: x.slug, rating: x.rating, liked: x.liked, source: x.source }));
  const gone = new Set(inapp.filter((x) => x.k === "x" && x.owner_key === p.user_id).map((x) => x.slug));
  const lib = { rated: (p.rated ?? []).filter((e) => e?.slug) };
  const merged = p.user_id ? mergeInAppRated(lib as never, mine, gone) ?? lib : lib;
  const rated = (merged.rated as Film[]).filter((f) => f.slug && !gone.has(f.slug)).map((f) => ({ slug: f.slug, rating: f.rating ?? null, liked: !!f.liked, rw: !!f.rw, rc: f.rc, lc: f.lc }));
  const known = new Set(rated.map((f) => f.slug));
  const exact = new Set(rated.map((f) => { const r = filmRow.get(f.slug); return r ? `${ntitle(r.t)}|${r.y ?? ""}` : ""; }));
  const watched: Film[] = [];
  for (const k of p.keys ?? []) {
    const i = k.lastIndexOf("|"); if (i < 0) continue;
    const t = ntitle(k.slice(0, i)), y = Number(k.slice(i + 1));
    if (Number.isFinite(y) && [y, y - 1, y + 1].some((yy) => exact.has(`${t}|${yy}`))) continue;
    const rows = byTitle.get(t) ?? [];
    const at = (dy: number) => { const xs = rows.filter((r) => r.y === y + dy); return xs.find((r) => !r.du) ?? xs[0]; };
    let row: FilmIn | undefined;
    for (let d = 0; d <= 2 && !row; d++) row = at(-d) ?? at(d);
    if (!row) continue;
    const slug = row.du || row.s;
    if (gone.has(slug) || known.has(slug) || nonFilm(slug) || !facts.has(slug)) continue;
    known.add(slug); watched.push({ slug, rating: null, liked: false });
  }
  const canon = new Set(inapp.filter((x) => x.k === "c" && x.owner_key === p.user_id).map((x) => x.slug));
  return { label: "", quiz: p.quiz === "true", row: { id: p.id, username: null, user_id: p.user_id, arch: null, sigs: null }, films: [...rated.filter((f) => f.rating != null || f.liked), ...watched], canon };
}).filter((p) => p.films.some((f) => f.rating != null));
const ratedFeat = (p: P) => p.films.filter((f) => f.rating != null && facts.get(f.slug)?.feature).length;
people.sort((a, b) => ratedFeat(b) - ratedFeat(a)).forEach((p, i) => { p.label = `P${String(i + 1).padStart(2, "0")}`; });

const slugOfTitle = (t: string) => filmsIn.filter((f) => f.t === t).sort((a, b) => (b.w ?? 0) - (a.w ?? 0))[0]?.s;
const exemplars = new Map(ARCHETYPES.map((a) => [a.name, a.films.map(slugOfTitle).filter((s): s is string => !!s)]));
const canonBy = new Map(people.map((p) => [p.row.user_id ?? "", p.canon]));
import { BIG_ONES } from "../lib/taste-test/big-ones";
import { lowHistorySignal as lowHistory, type CardOutcome } from "../lib/taste-test/low-history";
const full = R.computeReport({ people: people.map((p) => ({ row: p.row, films: p.films })), exemplars, canonBy, facts });
const norms = R.normsFromJson(JSON.parse(JSON.stringify(R.normsToJson(full.norms))));
const v = R.vectorsIn(norms.space, facts);
const allowedAll = new Set(norms.dirs.map((d) => d.id));
const labelOf = new Map(norms.dirs.map((d) => [d.id, d.label]));
const mem = (slug: string): Map<string, number> => { const f = facts.get(slug); if (!f || !f.labels) return new Map(); return sharesOf([{ film: f, v: v(slug), w: 1, rating: 5 } as never], norms.dirs, allowedAll).m.get(slug) ?? new Map(); };
const topId = (slug: string) => [...mem(slug)].sort((a, b) => b[1] - a[1])[0]?.[0];
type Rd = { name: string; streaks: string[] };
const rd = (r: R.ReportRow | null): Rd | null => r ? { name: r.next.name, streaks: r.next.streaks } : null;
const truth = new Map(people.map((p) => [p.label, rd(R.readFilmsWith(p.row, p.films, p.canon, norms, facts))!]));
const liveSame = people.filter((p) => (p as never as { live?: { name: string } }).live?.name === truth.get(p.label)?.name).length;

// ── the grid's films (approximation of /api/start-films) ──
const GENRE: Record<string, [string, string]> = { crime: ["Crime", "Hardboiled"], scifi: ["Science Fiction", "Voyager"], horror: ["Horror", "Midnight Cultist"], comedy: ["Comedy", "Comic Relief"], animation: ["Animation", "Animation Devotee"], drama: ["Drama", "Tenderhearted"], romance: ["Romance", "Lovestruck"] };
const feat = filmsIn.filter((f) => facts.get(f.s)?.feature && !f.du).sort((a, b) => (b.w ?? 0) - (a.w ?? 0));
const pool = new Set<string>(BIG_ONES.map((b) => b.slug));
for (const [g] of Object.values(GENRE)) feat.filter((f) => (f.g ?? []).includes(g)).slice(0, 60).forEach((f) => pool.add(f.s));
feat.filter((f) => (f.y ?? 0) >= 1995 && (f.y ?? 0) <= 2015).slice(0, 60).forEach((f) => pool.add(f.s));
const ratedOf = (p: P) => p.films.filter((f) => f.rating != null && facts.get(f.slug)?.feature);
const best = (fs: Film[]) => fs.slice().sort((a, b) => (b.rating as number) - (a.rating as number) || ((b.rating as number) - (facts.get(b.slug)!.crowd ?? 3.5)) - ((a.rating as number) - (facts.get(a.slug)!.crowd ?? 3.5)) || (facts.get(b.slug)!.watches ?? 0) - (facts.get(a.slug)!.watches ?? 0)).slice(0, 15);
const gridA = (p: P) => best(ratedOf(p).filter((f) => pool.has(f.slug)));
const gridB = (p: P): { kind: string; arch: string; films: Film[] } | null => {
  const by = Object.entries(GENRE).map(([k, [g, arch]]) => { const fs = ratedOf(p).filter((f) => facts.get(f.slug)!.genres.includes(g)); return { kind: k, arch, fs, loved: fs.filter((f) => (f.rating as number) >= 4.5).length }; })
    .filter((x) => x.fs.length >= 15 && !(process.env.NODRAMA && x.kind === "drama")).sort((a, b) => b.loved - a.loved);
  return by[0] ? { kind: by[0].kind, arch: by[0].arch, films: best(by[0].fs) } : null;
};

// ── the deck after a grid ──
const SEED = PR.PROBES.slice(0, PR.SEED_SIZE), REST = PR.PROBES.slice(PR.SEED_SIZE);
const seedId = (c: PR.Probe) => (c.seed === "Disciple" ? "auteur_devotee" : (R.IDS as Record<string, string>)[c.seed ?? ""]) ?? topId(c.slug);
type Run = { films: (Film & { src?: "grid" })[]; shown: number; deckRated: number; replaced: number };
function afterGrid(p: P, grid: Film[], opts: { seed: boolean; simple?: boolean; confirm?: boolean }): Run {
  const mine = new Map(ratedOf(p).map((f) => [f.slug, f]));
  const films: Run["films"] = grid.map((f) => ({ slug: f.slug, rating: f.rating, liked: false, src: "grid" as const }));
  if (!opts.seed) return { films, shown: 0, deckRated: 0, replaced: 0 };
  const done = new Set(grid.map((f) => f.slug)); const outcomes: CardOutcome[] = []; let deckRated = 0, replaced = 0;
  const show = (slug: string): boolean => { done.add(slug); const f = mine.get(slug); outcomes.push(f ? "rated" : "skipped"); if (f) { films.push({ slug, rating: f.rating, liked: false }); deckRated++; } return !!f; };
  for (const c of SEED) {
    if (done.has(c.slug)) continue;
    if (show(c.slug)) continue;
    const id = seedId(c);
    const rep = REST.filter((r) => !done.has(r.slug) && facts.has(r.slug) && topId(r.slug) === id).sort((a, b) => (facts.get(b.slug)!.watches ?? 0) - (facts.get(a.slug)!.watches ?? 0))[0];
    if (rep && !opts.simple) { replaced++; show(rep.slug); }
  }
  if (opts.confirm) for (const g of Object.values(R.GATES)) {
    if (grid.filter((f) => (f.rating as number) >= 4 && g.of(facts.get(f.slug)!)).length < 3) continue;
    REST.filter((r) => !done.has(r.slug) && facts.has(r.slug) && facts.get(r.slug)!.feature && g.of(facts.get(r.slug)!)).sort((x, y) => (facts.get(y.slug)!.watches ?? 0) - (facts.get(x.slug)!.watches ?? 0)).slice(0, 2).forEach((r) => { replaced++; show(r.slug); });
  }
  for (const c of REST) {
    if (opts.simple) break;
    if (films.length >= 15 && deckRated >= 6) break;
    if (outcomes.length >= 25 || lowHistory(outcomes)) break;
    if (done.has(c.slug)) continue;
    show(c.slug);
  }
  return { films, shown: outcomes.length, deckRated, replaced };
}
function deckOnly(p: P, n: number): Run | null {
  const mine = new Map(ratedOf(p).map((f) => [f.slug, f])); const films: Run["films"] = []; let shown = 0;
  for (const c of PR.PROBES) { if (films.length >= n) break; shown++; const f = mine.get(c.slug); if (f) films.push({ slug: f.slug, rating: f.rating, liked: false }); }
  return films.length >= n ? { films, shown, deckRated: n, replaced: 0 } : null;
}
// the mix a read is made of: each film's model membership times its weight (the section 7 measure)
const ids = norms.dirs.map((d) => d.id);
function mixOf(films: Run["films"], gridW: number | null): number[] {
  const base = gridW == null ? { mean: films.reduce((a, f) => a + (f.rating as number), 0) / films.length, grid: 1 } : (R as never as { ratingBase: (f: unknown) => { mean: number; grid: number } }).ratingBase(films);
  const out = new Map(ids.map((i) => [i, 0]));
  for (const f of films) { const w = ((f.rating as number) - base.mean) * (f.src === "grid" ? base.grid : 1); if (w <= 0) continue; for (const [i, m] of mem(f.slug)) out.set(i, (out.get(i) ?? 0) + m * w); }
  const tot = [...out.values()].reduce((a, b) => a + b, 0) || 1;
  return ids.map((i) => (out.get(i) ?? 0) / tot);
}
const fullMix = new Map(people.map((p) => [p.label, mixOf(ratedOf(p) as never, null)]));
const corr = (a: number[], b: number[]) => { const ma = a.reduce((x, y) => x + y, 0) / a.length, mb = b.reduce((x, y) => x + y, 0) / b.length; let n = 0, da = 0, db = 0; for (let i = 0; i < a.length; i++) { n += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2; } return da && db ? n / Math.sqrt(da * db) : 0; };
function within(rows: { p: string; mix: number[] }[]): number {
  const T = rows.map((r) => fullMix.get(r.p)!); const colMean = (M: number[][]) => ids.map((_, j) => M.reduce((a, r) => a + r[j], 0) / M.length);
  const mm = colMean(rows.map((r) => r.mix)), tm = colMean(T);
  return rows.reduce((a, r, i) => a + corr(r.mix.map((x, j) => x - mm[j]), T[i].map((x, j) => x - tm[j])), 0) / rows.length;
}


const GATED = new Set(["Animation Devotee", "Old Soul", "Globetrotter", "Eyewitness", "Overthinker"]);
const tryRead = (p: P, films: Run["films"], keep: boolean) => { try { return rd(R.readFilmsWith({ ...p.row, user_id: null }, films.map((f) => ({ ...f, src: keep ? f.src : undefined })) as never, new Set(), norms, facts)); } catch { return null; } };
const ind = people.filter((p) => !p.quiz && ratedFeat(p) >= 100);
const med = (xs: number[]) => xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)];
for (const [arm, keep] of [["baseline d9a06c01", false], ["two confirmation cards + kind needs one served", true]] as const) {
  const one = (p: P, g: Film[]) => { const run = afterGrid(p, g, { seed: true, simple: true, confirm: keep }); return { p: p.label, run, read: tryRead(p, run.films, keep), base: tryRead(p, run.films, false), t: truth.get(p.label)! }; };
  const A = ind.map((p) => ({ kind: "top15", arch: "", ...one(p, gridA(p)) }));
  console.log(`A | ${arm}: primary ${A.filter((r) => r.read?.name === r.t.name).length}/${A.length} top2 ${A.filter((r) => r.read && [r.read.name, ...r.read.streaks.slice(0, 1)].includes(r.t.name)).length} streak ${A.filter((r) => r.read && (r.read.streaks[0] ?? null) === (r.t.streaks[0] ?? null)).length}`);
  const K = ind.flatMap((p) => Object.entries(GENRE).flatMap(([kind, [g, arch]]) => { const fs = ratedOf(p).filter((f) => facts.get(f.slug)!.genres.includes(g)); return fs.length >= 15 ? [{ kind, arch, ...one(p, best(fs)) }] : []; }));
  const byKind = Object.keys(GENRE).map((k) => { const xs = K.filter((r) => r.kind === k); return `${k} ${xs.filter((r) => r.read?.name === r.arch && r.t.name !== r.arch).length}/${xs.length}`; }).join(", ");
  console.log(`K | ${arm}: wrongKind ${K.filter((r) => r.read?.name === r.arch && r.t.name !== r.arch).length}/${K.length} (${byKind}) primary ${K.filter((r) => r.read?.name === r.t.name).length} top2 ${K.filter((r) => r.read && [r.read.name, ...r.read.streaks.slice(0, 1)].includes(r.t.name)).length} anyGatedWrong ${K.filter((r) => r.read && GATED.has(r.read.name) && r.read.name !== r.t.name).length}`);
  console.log(`   shown: top15 median ${med(A.map((r) => r.run.shown))} max ${Math.max(...A.map((r) => r.run.shown))}; one-kind median ${med(K.map((r) => r.run.shown))} max ${Math.max(...K.map((r) => r.run.shown))}; confirmation cards served: top15 ${A.map((r) => r.run.replaced).join(",")}; one-kind with any ${K.filter((r) => r.run.replaced > 0).length}/${K.length}, animation grids ${K.filter((r) => r.kind === "animation").map((r) => r.run.replaced).join(",")}`);
  const all = [...A, ...K];
  const lost = all.filter((r) => r.base && GATED.has(r.base.name) && r.base.name === r.t.name && r.read?.name !== r.t.name);
  const kept = all.filter((r) => r.base && GATED.has(r.base.name) && r.base.name === r.t.name);
  console.log(`   true gated names at baseline ${kept.length}, lost ${lost.length}: ${lost.map((r) => `${r.p} ${r.kind} ${r.t.name} -> ${r.read?.name}`).join("; ")}`);
  if (keep) { const ch = all.filter((r) => r.read?.name !== r.base?.name); console.log(`   changed reads ${ch.length}: ${ch.map((r) => `${r.p} ${r.kind}: ${r.base?.name} -> ${r.read?.name} (truth ${r.t.name})`).join("; ")}`); }
}
// full libraries: no grid marks, so the same read; shown by reading each with every rating marked absent (as stored)
console.log("full-library names equal to truth map:", people.filter((p) => rd(R.readFilmsWith(p.row, p.films, p.canon, norms, facts))?.name === truth.get(p.label)?.name).length, "of", people.length);
process.exit(0);
