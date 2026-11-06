/**
 * NO-SAVE dry run of the re-score batch (build list after-build-22 item 9; owner, 2026-11-06:
 * "go with Theorist, then run numbers on how people will change, and then we'll have to add the
 * nostalgia streak as well"):
 *   (a) a 15th archetype, Theorist (twist mysteries and cerebral sci-fi),
 *   (b) a Nostalgic streak (a pull toward an earlier era's films, rewatches where the export has them),
 *   (c) TV series dropped from everything the archetype and Film DNA read (rule 1195's idea).
 *
 * It never connects to a database. The inputs are JSON files exported beforehand with SELECT-only
 * queries (see the report, "How the numbers were made"), and the read is the one taste model's own
 * pure code (computeReport, readFilmsWith), so nothing can be written anywhere. No AI calls.
 *
 *   npx tsx scripts/theorist-dry-run.ts <data dir>  > report-tables.md
 *
 * Needs `GATES` exported from lib/taste/unified/report.ts (a one-word change, made in the scratch
 * worktree only) so a Theorist fact gate can be tried, and for `--floor` (the streak-floor comparison:
 * `npx tsx scripts/theorist-dry-run.ts <data dir> --floor`) readPerson's 0.15 in model.ts replaced by an
 * exported `STREAK_FLOOR = { family: 0.15 }`. People are printed as P01..P21 (most rated
 * first); no names, handles, emails or ids are printed.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ARCHETYPE_STRANDS } from "../lib/taste/taste-dna";
import { FAMILY, FILM_FACT, STREAK_FLOOR, type FilmFacts } from "../lib/taste/unified/model";
import { mergeInAppRated } from "../lib/inapp-merge";
import { isNonFilm } from "../lib/film-kind.mjs";
import { trustArt } from "../lib/label-confidence";
import { ARCHETYPES } from "../lib/archetype-info";

// Theorist's Film DNA strand: Complexity (report.ts maps moral_ambiguity onto it). Set before
// report.ts loads, since it builds its STRANDS map at load. Unused while no Theorist direction exists.
(ARCHETYPE_STRANDS as Record<string, string[]>).theorist = ["narrative_complexity"];

type Report = typeof import("../lib/taste/unified/report");
let R: Report;

const DIR = process.argv[2];
if (!DIR) throw new Error("usage: theorist-dry-run.ts <data dir>");
const load = <T,>(f: string): T => JSON.parse(readFileSync(join(DIR, f), "utf8")) as T;

// ── Inputs (exported read-only) ────────────────────────────────────────────────────────────
type ProfileIn = { id: string; user_id: string | null; rated: { slug: string; rating: number | null; liked: boolean; rw?: boolean; rc?: number; lc?: number }[] | null;
  keys: string[] | null; arch_label: string | null; arch_top: string[] | null; v2_arch: { name: string; streaks: string[] } | null };
type FilmIn = { s: string; t: string; y: number | null; d: string[] | null; g: string[] | null; l: string | null; r: number | null; c: number | null;
  m: string | null; du: string | null; w: number | null; sp: boolean; lb: Record<string, number | string | boolean | null> | null; ln: string[] | null };
type InApp = { k: "r" | "x" | "c"; owner_key: string; slug: string; rating: number | null; liked: boolean | null; source: string | null; is_rewatch: boolean | null };

const profilesIn = load<ProfileIn[]>("profiles.json");
const filmsIn = load<FilmIn[]>("films.json");
const inapp = load<InApp[]>("inapp.json");

const filmRow = new Map(filmsIn.map((f) => [f.s, f]));
const nonFilm = (slug: string) => { const f = filmRow.get(slug); return !!f && isNonFilm({ media_type: f.m, tmdb_keywords: f.sp ? ["tv special"] : [], runtime_minutes: f.r, letterboxd_slug: f.s, title: f.t }); };

// loadFacts (lib/taste/unified/report.ts), on the exported rows.
const facts = new Map<string, FilmFacts>();
for (const f of filmsIn) {
  facts.set(f.s, {
    slug: f.s, title: f.t, year: f.y, directors: f.d ?? [], genres: f.g ?? [], nonEnglish: !!f.l && f.l !== "en", runtime: f.r,
    crowd: f.c != null ? Number(f.c) : null, watches: f.w, poster: null,
    labels: f.lb ? trustArt(f.lb as never) : null, lanes: f.ln ?? [],
    feature: !(f.g ?? []).some((g) => g === "Documentary" || g === "TV Movie") && !(f.r != null && f.r > 0 && f.r < 40)
      && !(f.m && f.m !== "movie") && !f.du && !/special look|making of|behind the scenes|: live at|live in concert/i.test(f.t ?? ""),
  });
}

// ── People: library + in-app ratings (withInAppRatingsMany), watched-only keys (watchedOnly) ──
const ntitle = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]/g, "");
const byTitle = new Map<string, FilmIn[]>();
for (const f of filmsIn) { const k = ntitle(f.t ?? ""); byTitle.set(k, [...(byTitle.get(k) ?? []), f]); }
type Film = { slug: string; rating: number | null; liked: boolean; rw?: boolean; rc?: number; lc?: number };
type P = { label: string; row: { id: string; username: null; user_id: string | null; arch: null; sigs: null }; films: Film[]; canon: Set<string>;
  live: { name: string | null; streaks: string[] }; stored: { name: string; streaks: string[] } | null };

const people: P[] = profilesIn.map((p) => {
  const mine = inapp.filter((x) => x.k === "r" && x.owner_key === p.user_id).map((x) => ({ slug: x.slug, rating: x.rating, liked: x.liked, source: x.source }));
  const gone = new Set(inapp.filter((x) => x.k === "x" && x.owner_key === p.user_id).map((x) => x.slug));
  const lib = { rated: (p.rated ?? []).filter((e) => e?.slug) };
  const merged = p.user_id ? mergeInAppRated(lib as never, mine, gone) ?? lib : lib;
  const rated = (merged.rated as Film[]).filter((f) => f.slug && !gone.has(f.slug)).map((f) => ({ slug: f.slug, rating: f.rating ?? null, liked: !!f.liked, rw: !!f.rw, rc: f.rc, lc: f.lc }));
  // Watched with no rating or heart: the library keys, resolved as loadWatchedSet does (exact
  // normalised title, the year or one either side, then two; a duplicate goes to its film; a
  // rated film's own key and series are left out).
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
  return { label: "", row: { id: p.id, username: null, user_id: p.user_id, arch: null, sigs: null }, films: [...rated.filter((f) => f.rating != null || f.liked), ...watched], canon,
    live: { name: p.arch_label, streaks: (p.arch_top ?? []).slice(1) }, stored: p.v2_arch ? { name: p.v2_arch.name, streaks: p.v2_arch.streaks ?? [] } : null };
}).filter((p) => p.films.some((f) => f.rating != null));
const ratedN = (p: P) => p.films.filter((f) => f.rating != null).length;
people.sort((a, b) => ratedN(b) - ratedN(a)).forEach((p, i) => { p.label = `P${String(i + 1).padStart(2, "0")}`; });

// The directory's defining films as slugs: the most watched film of each title (exemplarSlugs).
const slugOfTitle = (t: string) => filmsIn.filter((f) => f.t === t).sort((a, b) => (b.w ?? 0) - (a.w ?? 0))[0]?.s;
const baseExemplars = new Map(ARCHETYPES.map((a) => [a.name, a.films.map(slugOfTitle).filter((s): s is string => !!s)]));

// ── Theorist definitions ───────────────────────────────────────────────────────────────────
const OWNER_11 = ["The Prestige", "Memento", "Shutter Island", "Knives Out", "Gone Girl", "Arrival", "Interstellar", "Inception", "Primer", "Ex Machina", "Tenet"];
/** The eight proposed for the directory (and so the direction): Nolan twice, not four times;
 *  Interstellar and Tenet left out because their scale pulls the direction toward IMAX Idealist. */
const PROPOSED_8 = ["Memento", "The Prestige", "Shutter Island", "Gone Girl", "Knives Out", "Arrival", "Primer", "Ex Machina"];
const lab = (f: FilmFacts, k: string) => (typeof f.labels?.[k] === "number" ? (f.labels![k] as number) : -1);
/** A puzzle film: a twist, or a film that asks a lot of you (brain demand 75+). */
const PUZZLE = (f: FilmFacts) => f.labels?.twist === true || lab(f, "brain_demand") >= 75;
const PUZZLE_STRICT = (f: FilmFacts) => (f.labels?.twist === true && lab(f, "brain_demand") >= 65) || lab(f, "brain_demand") >= 80;

type Theo = { name: string; films: string[]; family: "mind" | "craft" | "dark" | "epic"; fact?: (f: FilmFacts) => boolean; gate?: { of: (f: FilmFacts) => boolean; mult: number } };
const THEO: Record<string, Theo> = {
  bare: { name: "T-bare: 8 films, own family, no fact, no gate", films: PROPOSED_8, family: "mind" },
  owner11: { name: "T-owner11: the owner's 11 films, own family, no fact, no gate", films: OWNER_11, family: "mind" },
  proposed: { name: "T (proposed): 8 films, own family, puzzle fact, gate 1.5x", films: PROPOSED_8, family: "mind", fact: PUZZLE, gate: { of: PUZZLE, mult: 1.5 } },
  strict: { name: "T-strict: 8 films, own family, strict puzzle fact, gate 2x", films: PROPOSED_8, family: "mind", fact: PUZZLE_STRICT, gate: { of: PUZZLE_STRICT, mult: 2 } },
  wide: { name: "T-wide: owner's 11 + 5 more twist films (16), own family, puzzle fact, no gate", films: [...OWNER_11, "The Usual Suspects", "Fight Club", "Prisoners", "Zodiac", "The Sixth Sense"], family: "mind", fact: PUZZLE },
  craft: { name: "T-craft: as proposed but in the craft family", films: PROPOSED_8, family: "craft", fact: PUZZLE, gate: { of: PUZZLE, mult: 1.5 } },
};

// ── One run of the model under a configuration ─────────────────────────────────────────────
type Cfg = { theo?: Theo; dropSeries?: boolean; floor?: number };
type Read = { name: string; streaks: string[]; shares: Map<string, number>; top: { label: string; share: number }[]; gated: string[]; dna: { label: string; score: number }[] };
const FACT_MULT = new Map<string, number>(); // the gate's multiple (report.ts uses 1.5 for all)

function run(cfg: Cfg, ppl: P[] = people, extra: P[] = []): { reads: Map<string, Read>; extraReads: Read[] } {
  const IDS = R.IDS as Record<string, string>;
  const GATES = R.GATES as Record<string, { of: (f: FilmFacts) => boolean; why: string }>;
  const fam = FAMILY as Record<string, string>;
  const ff = FILM_FACT as Record<string, (f: FilmFacts) => boolean>;
  const exemplars = new Map(baseExemplars);
  if (cfg.theo) {
    IDS.Theorist = "theorist"; fam.theorist = cfg.theo.family;
    if (cfg.theo.fact) ff.theorist = cfg.theo.fact;
    if (cfg.theo.gate) GATES.theorist = { of: cfg.theo.gate.of, why: "twists or puzzles" };
    exemplars.set("Theorist", cfg.theo.films.map(slugOfTitle).filter((s): s is string => !!s));
  }
  // A gate multiple other than 1.5 is had by scaling the average the bar is read against.
  STREAK_FLOOR.family = cfg.floor ?? 0.15;
  try {
    const strip = (p: P): P => cfg.dropSeries ? { ...p, films: p.films.filter((f) => !nonFilm(f.slug)), canon: new Set([...p.canon].filter((s) => !nonFilm(s))) } : p;
    const ps = ppl.map(strip);
    const canonBy = new Map(ps.map((p) => [p.row.user_id ?? "", p.canon]));
    const full = R.computeReport({ people: ps.map((p) => ({ row: p.row, films: p.films })), exemplars, canonBy, facts });
    if (cfg.theo?.gate && cfg.theo.gate.mult !== 1.5) {
      for (const m of [full.norms.factAvg, full.norms.deck.factAvg]) { const fa = m.get("theorist"); if (fa != null) m.set("theorist", fa * cfg.theo.gate.mult / 1.5); }
    }
    // As the profile reads it: each library on its own against the run's saved (rounded) norms.
    const norms = R.normsFromJson(JSON.parse(JSON.stringify(R.normsToJson(full.norms))));
    const readP = (p: P): Read => {
      const r = R.readFilmsWith(p.row, p.films, p.canon, norms, facts)!;
      const by = new Map(r.next.scores.map((s) => [s.label, s.share]));
      return { name: r.next.name, streaks: r.next.streaks, shares: by, gated: r.next.gated,
        top: [r.next.name, ...r.next.streaks].map((l) => ({ label: l, share: by.get(l) ?? 0 })), dna: r.dnaNew.map((d) => ({ label: d.label, score: d.score })) };
    };
    return { reads: new Map(ps.map((p) => [p.label, readP(p)])), extraReads: extra.map(strip).map(readP) };
  } finally {
    delete IDS.Theorist; delete fam.theorist; delete ff.theorist; delete GATES.theorist; STREAK_FLOOR.family = 0.15;
  }
}
void FACT_MULT;

// ── Nostalgic (a streak about how someone rates, like Contrarian: never the name) ───────────
const PAST = (y: number | null) => y != null && y >= 1980 && y <= 2010;
const RECENT = (y: number | null) => y != null && y >= 2015;
type Nos = { eraGap: number | null; loveRatio: number | null; pastLoved: number; childLoved: number; rewatchShare: number | null; rewatchLoved: number; hasDiary: boolean };
function nostalgia(p: P, dropSeries = true): Nos {
  const rated = p.films.filter((f) => f.rating != null && facts.get(f.slug)?.feature && (!dropSeries || !nonFilm(f.slug)));
  const withCrowd = rated.filter((f) => facts.get(f.slug)!.crowd != null);
  const lift = (xs: Film[]) => { let s = 0, w = 0; for (const f of xs) { const c = facts.get(f.slug)!; const wt = Math.max(0.2, Math.min(1, (c.watches ?? 0) / 2000)); s += wt * ((f.rating as number) - c.crowd!); w += wt; } return w ? s / w : null; };
  const past = withCrowd.filter((f) => PAST(facts.get(f.slug)!.year)), recent = withCrowd.filter((f) => RECENT(facts.get(f.slug)!.year));
  const lp = past.length >= 12 ? lift(past) : null, lr = recent.length >= 12 ? lift(recent) : null;
  const loved = rated.filter((f) => (f.rating as number) >= 4.5);
  const pastAll = rated.filter((f) => PAST(facts.get(f.slug)!.year)), restAll = rated.filter((f) => !PAST(facts.get(f.slug)!.year));
  const pLove = (xs: Film[]) => xs.length ? xs.filter((f) => (f.rating as number) >= 4.5).length / xs.length : 0;
  const pastLoved = loved.filter((f) => PAST(facts.get(f.slug)!.year)).length;
  const childLoved = loved.filter((f) => { const x = facts.get(f.slug)!; return PAST(x.year) && (x.genres.includes("Family") || x.genres.includes("Animation") || x.labels?.audience === "all"); }).length;
  const hasDiary = rated.some((f) => f.lc != null);
  const rwLoved = loved.filter((f) => f.rw || (f.rc ?? 0) > 0).length;
  return { eraGap: lp != null && lr != null ? lp - lr : null, loveRatio: pastAll.length >= 12 && restAll.length >= 12 && pLove(restAll) > 0 ? pLove(pastAll) / pLove(restAll) : null,
    pastLoved, childLoved, rewatchShare: hasDiary && loved.length ? rwLoved / loved.length : null, rewatchLoved: rwLoved, hasDiary };
}
type NosRule = { name: string; gap: number; ratio: number; minPast: number; rewatch: number };
const NOS_RULES: NosRule[] = [
  { name: "N (proposed): era gap >= +0.30 with 10+ loved from 1980-2010 (no love ratio); or 25%+ rewatched", gap: 0.30, ratio: 0, minPast: 10, rewatch: 0.25 },
  { name: "N-ratio: era gap >= +0.30 and love ratio >= 1.5, 10+ loved from 1980-2010; or 25%+ of loved rewatched (5+)", gap: 0.30, ratio: 1.5, minPast: 10, rewatch: 0.25 },
  { name: "N-loose: era gap >= +0.20 and love ratio >= 1.25, 8+ loved; or 20%+ rewatched", gap: 0.20, ratio: 1.25, minPast: 8, rewatch: 0.20 },
  { name: "N-strict: era gap >= +0.40 and love ratio >= 2, 12+ loved; or 33%+ rewatched", gap: 0.40, ratio: 2.0, minPast: 12, rewatch: 0.33 },
];
const isNos = (n: Nos, r: NosRule) => (n.eraGap != null && n.loveRatio != null && n.eraGap >= r.gap && n.loveRatio >= r.ratio && n.pastLoved >= r.minPast)
  || (n.rewatchShare != null && n.rewatchShare >= r.rewatch && n.rewatchLoved >= 5);

// ── Synthetic probes for over-capture (never part of the averages) ─────────────────────────
function persona(label: string, love: (f: FilmFacts) => boolean, extra5: string[] = [], n = 45): P {
  const pool = [...facts.values()].filter((f) => f.feature && f.labels && f.crowd != null && (f.watches ?? 0) > 20000);
  let x = 7; const rnd = () => { x = (x * 1103515245 + 12345) >>> 0; return x / 4294967296; };
  const loves = pool.filter(love).sort((a, b) => (b.watches ?? 0) - (a.watches ?? 0)).slice(0, n);
  const rest = pool.filter((f) => !love(f)).sort(() => rnd() - 0.5).slice(0, n);
  const films: Film[] = [...loves.map((f) => ({ slug: f.slug, rating: rnd() < 0.5 ? 5 : 4.5, liked: false })), ...rest.map((f) => ({ slug: f.slug, rating: [2.5, 3, 3, 3.5][Math.floor(rnd() * 4)], liked: false }))];
  for (const t of extra5) { const s = slugOfTitle(t); if (s && !films.some((f) => f.slug === s)) films.push({ slug: s, rating: 5, liked: true }); }
  return { label, row: { id: label, username: null, user_id: null, arch: null, sigs: null }, films, canon: new Set(), live: { name: null, streaks: [] }, stored: null };
}
const g = (f: FilmFacts, x: string) => f.genres.includes(x);
const PERSONAS = [
  persona("Noir/crime fan (crime films loved, the rest middling)", (f) => g(f, "Crime") && !g(f, "Comedy") && !g(f, "Animation")),
  persona("Same noir fan + Inception 5 stars", (f) => g(f, "Crime") && !g(f, "Comedy") && !g(f, "Animation"), ["Inception"]),
  persona("Animation lover", (f) => g(f, "Animation")),
  persona("Animation lover + Inception 5 stars", (f) => g(f, "Animation"), ["Inception"]),
  persona("Big-screen sci-fi fan (spectacle 80+ sci-fi loved)", (f) => g(f, "Science Fiction") && lab(f, "spectacle") >= 80),
  persona("Puzzle fan (twist or brain demand 75+ loved)", PUZZLE),
];

// ── Output ─────────────────────────────────────────────────────────────────────────────────
const pct = (x: number) => `${Math.round(x * 100)}%`;
const hdr = (r: Read) => `${r.name}${r.streaks.length ? ` (streaks: ${r.streaks.join(", ")})` : ""}`;
const mix = (r: Read) => r.top.map((t) => `${t.label} ${pct(t.share)}`).join(" · ");
const same = (a: Read, b: Read) => a.name === b.name && a.streaks.join() === b.streaks.join();

async function floorSection(): Promise<string> {
  const out: string[] = []; const say = (x = "") => out.push(x);
  const base = run({});
  const nos = new Map(people.map((p) => [p.label, nostalgia(p)]));
  const famOf = (label: string) => (label === "Theorist" ? "mind" : (FAMILY as Record<string, string>)[(R.IDS as Record<string, string>)[label] ?? ""] ?? label);
  const famShare = (r: Read, fam: string) => [...r.shares].filter(([l]) => famOf(l) === fam && !r.gated.some((x) => x.startsWith(`${l} (`))).reduce((a, [, x]) => a + x, 0);
  const cases: { key: string; name: string; cfg: Cfg; nosOn: boolean }[] = [
    { key: "a", name: "(a) 15% floor + Theorist + Nostalgic + series drop", cfg: { theo: THEO.proposed, dropSeries: true, floor: 0.15 }, nosOn: true },
    { key: "c", name: "(c) 12% floor + Theorist + Nostalgic + series drop", cfg: { theo: THEO.proposed, dropSeries: true, floor: 0.12 }, nosOn: true },
    { key: "b", name: "(b) 10% floor + Theorist + Nostalgic + series drop", cfg: { theo: THEO.proposed, dropSeries: true, floor: 0.10 }, nosOn: true },
    { key: "d", name: "(d) 10% floor alone (no other change)", cfg: { floor: 0.10 }, nosOn: false },
  ];
  const dist = (reads: Map<string, Read>) => [0, 1, 2].map((n) => people.filter((p) => reads.get(p.label)!.streaks.length === n).length);
  const bd = dist(base.reads);
  say("## Streak floor: 15% vs 12% vs 10%");
  say();
  say("Owner, 2026-11-06: \"run the numbers. If 10% looks good, let's do 10%.\" The floor is the share of what someone loves a family of feel (dark, epic, heart, craft, and now Theorist's own) must hold before its best archetype can be a streak (lib/taste/unified/model.ts `readPerson`, 15% on main). Same no-save method as above: fresh SELECT-only exports, the model's own code in a scratch worktree with no database keys, the floor made a variable there only. Each row is against today's replay (15%, no other change), which again matched the live profile 21 of 21.");
  say();
  say(`Today: ${bd[0]} people have no streak, ${bd[1]} have one, ${bd[2]} have two (content streaks; Nostalgic counted apart).`);
  say();
  say(`| Change | Header changes | Name changes | Streaks 0 / 1 / 2 (today ${bd.join(" / ")}) | Gain a streak | Lose a streak | Thin new streaks | Strong streak displaced | Nostalgic | Theorist (name / streak) |`);
  say("|---|---|---|---|---|---|---|---|---|---|");
  const details: string[] = [];
  for (const c of cases) {
    const x = run(c.cfg);
    let head = 0, names = 0, gain = 0, lose = 0, thin = 0, displaced = 0, nosN = 0, thName = 0, thStreak = 0;
    const lines: string[] = [];
    for (const p of people) {
      const a = base.reads.get(p.label)!, b = x.reads.get(p.label)!;
      const nosY = c.nosOn && isNos(nos.get(p.label)!, NOS_RULES[0]);
      if (nosY) nosN++;
      if (b.name === "Theorist") thName++;
      if (b.streaks.includes("Theorist")) thStreak++;
      if (a.name !== b.name) names++;
      if (!same(a, b) || nosY) head++;
      const added = b.streaks.filter((l) => !a.streaks.includes(l)), dropped = a.streaks.filter((l) => !b.streaks.includes(l));
      if (added.length || nosY) gain++;
      if (dropped.length) lose++;
      if (!same(a, b) || nosY) {
        const notes = added.map((l) => {
          const fs = famShare(b, famOf(l)), own = b.shares.get(l) ?? 0;
          const isThin = own < 0.08 || fs < 0.15 && fs - (c.cfg.floor ?? 0.15) < 0.015;
          if (isThin) thin++;
          return `+${l} (its own share ${pct(own)}, its family ${pct(fs)}${isThin ? ", THIN" : ""})`;
        });
        const lost = dropped.map((l) => { const own = a.shares.get(l) ?? 0; const big = added.length > 0 && added.every((n) => (b.shares.get(n) ?? 0) < own - 0.03); if (big) displaced++; return `-${l} (its own share ${pct(own)}${big ? ", DISPLACED by a smaller streak" : ""})`; });
        lines.push(`- ${p.label}: ${hdr(a)} → ${hdr(b)}${nosY ? ", plus Nostalgic" : ""}. ${[...notes, ...lost].join("; ")}`);
      }
    }
    const dd = dist(x.reads);
    say(`| ${c.name} | ${head} | ${names} | ${dd.join(" / ")} | ${gain} | ${lose} | ${thin} | ${displaced} | ${nosN} | ${thName} / ${thStreak} |`);
    details.push(`**${c.name}**`, "", ...lines, "");
  }
  say();
  say("Displaced: a streak lost to new streaks that each hold at least 3 points less of what they love (a strong same-family streak pushed out because other families now clear the floor first).");
  say();
  say("Thin: a new streak whose own archetype holds under 8% of what they love (the share the five films need before a group gets a film of its own), or whose family clears the floor by under 1.5 points.");
  say();
  say("Who changes, and how (shares are of what they love):");
  say();
  out.push(...details);
  return out.join("\n") + "\n";
}

async function main() {
  R = await import("../lib/taste/unified/report");
  if (process.argv[3] === "--floor") { process.stdout.write(await floorSection()); return; }
  const out: string[] = [];
  const say = (s = "") => out.push(s);

  const base = run({});
  const S = run({ dropSeries: true });
  const theoRuns = Object.fromEntries(Object.entries(THEO).map(([k, t]) => [k, run({ theo: t })]));
  const T = theoRuns.proposed;
  const ALL = run({ theo: THEO.proposed, dropSeries: true }, people, PERSONAS);
  const personaBase = run({}, people, PERSONAS).extraReads;
  const nos = new Map(people.map((p) => [p.label, nostalgia(p)]));
  const NR = NOS_RULES[0];

  say("## Check: the baseline replay against what is live");
  const liveSame = people.filter((p) => p.live.name === base.reads.get(p.label)!.name).length;
  const storedSame = people.filter((p) => p.stored && p.stored.name === base.reads.get(p.label)!.name && p.stored.streaks.join() === base.reads.get(p.label)!.streaks.join()).length;
  say(`Baseline (today's rules, replayed here) names the same archetype as the live profile for ${liveSame} of ${people.length}; same name and streaks as the stored nightly read (taste_model_v2) for ${storedSame} of ${people.length}.`);
  const off = people.filter((p) => p.live.name !== base.reads.get(p.label)!.name).map((p) => `${p.label} live ${p.live.name} / replay ${base.reads.get(p.label)!.name}`);
  if (off.length) say(`Differs: ${off.join("; ")}.`);
  say();

  say("## Per profile: today → all three changes together");
  say("| | Rated | Today (replay) | Mix today (top 3) | After all changes | Mix after (top 3) | Nostalgic |");
  say("|---|---|---|---|---|---|---|");
  for (const p of people) {
    const a = base.reads.get(p.label)!, b = ALL.reads.get(p.label)!;
    say(`| ${p.label} | ${ratedN(p)} | ${hdr(a)} | ${mix(a)} | ${same(a, b) ? "same" : hdr(b)} | ${mix(b)} | ${isNos(nos.get(p.label)!, NR) ? "yes" : ""} |`);
  }
  say();

  const totals = (name: string, x: { reads: Map<string, Read> }, nosOn: boolean) => {
    let nameCh = 0, theo = 0, theoStreak = 0, gain = 0, lose = 0, nostal = 0, anyCh = 0;
    const from: string[] = [];
    for (const p of people) {
      const a = base.reads.get(p.label)!, b = x.reads.get(p.label)!;
      if (a.name !== b.name) nameCh++;
      if (b.name === "Theorist") { theo++; from.push(`${p.label} from ${a.name}`); }
      if (b.streaks.includes("Theorist")) theoStreak++;
      const nosY = nosOn && isNos(nos.get(p.label)!, NR);
      const sa = new Set(a.streaks), sb = new Set([...b.streaks, ...(nosY ? ["Nostalgic"] : [])]);
      if ([...sb].some((s) => !sa.has(s))) gain++;
      if ([...sa].some((s) => !sb.has(s))) lose++;
      if (nosY) nostal++;
      if (!same(a, b) || nosY) anyCh++;
    }
    return `| ${name} | ${anyCh} | ${nameCh} | ${theo}${from.length ? ` (${from.join("; ")})` : ""} | ${theoStreak} | ${gain} | ${lose} | ${nostal} |`;
  };
  say("## Which change moves whom (each against today's replay)");
  say("| Change | Header changes | Name changes | Become Theorist (from) | Theorist as a streak | Gain a streak | Lose a streak | Nostalgic |");
  say("|---|---|---|---|---|---|---|---|");
  say(totals("Drop series alone", S, false));
  say(totals("Theorist alone (proposed)", T, false));
  say(totals("Nostalgic alone (proposed)", base, true));
  say(totals("All together", ALL, true));
  say();
  // Film DNA moved by dropping series.
  const dnaMoves = people.map((p) => {
    const a = base.reads.get(p.label)!.dna, b = S.reads.get(p.label)!.dna;
    const d = Math.max(0, ...a.map((x) => Math.abs((b.find((y) => y.label === x.label)?.score ?? x.score) - x.score)));
    const nSeries = p.films.filter((f) => f.rating != null && nonFilm(f.slug)).length;
    return { p: p.label, d, nSeries };
  }).filter((x) => x.nSeries > 0);
  say(`Series among rated films: ${dnaMoves.length} profiles rate at least one (${dnaMoves.map((x) => `${x.p} ${x.nSeries}`).join(", ") || "none"}). Largest Film DNA strand move when they are dropped: ${dnaMoves.map((x) => `${x.p} ${x.d} pts`).join(", ") || "none"}.`);
  say();

  say("## Theorist definitions compared (each alone, against today's replay)");
  say("| Definition | Header changes | Name changes | Become Theorist | Theorist as a streak | Highest Theorist share (who) | Who becomes Theorist (from) |");
  say("|---|---|---|---|---|---|---|");
  for (const [k, t] of Object.entries(THEO)) {
    const x = theoRuns[k];
    const becomes = people.filter((p) => x.reads.get(p.label)!.name === "Theorist");
    const hi = people.map((p) => ({ p: p.label, s: x.reads.get(p.label)!.shares.get("Theorist") ?? 0 })).sort((a, b) => b.s - a.s)[0];
    say(`| ${t.name} | ${people.filter((p) => !same(x.reads.get(p.label)!, base.reads.get(p.label)!)).length} | ${people.filter((p) => x.reads.get(p.label)!.name !== base.reads.get(p.label)!.name).length} | ${becomes.length} | ${people.filter((p) => x.reads.get(p.label)!.streaks.includes("Theorist")).length}${people.filter((p) => x.reads.get(p.label)!.streaks.includes("Theorist")).map((p) => ` (${p.label})`).join("")} | ${pct(hi.s)} (${hi.p}) | ${becomes.map((p) => `${p.label} from ${base.reads.get(p.label)!.name}`).join("; ") || "nobody"} |`);
  }
  say();
  say("Theorist share and lift per profile under the proposed definition (share of what they love that reads as Theorist; puzzle = twist or brain demand 75+ among loved feature films):");
  say("| | Today | Theorist share | Puzzle share of loved | Loved puzzle films | Gated? | After |");
  say("|---|---|---|---|---|---|---|");
  for (const p of people) {
    const r = T.reads.get(p.label)!;
    const loved = p.films.filter((f) => (f.rating ?? 0) >= 4.5 && facts.get(f.slug)?.feature);
    const pz = loved.filter((f) => PUZZLE(facts.get(f.slug)!)).length;
    say(`| ${p.label} | ${base.reads.get(p.label)!.name} | ${pct(r.shares.get("Theorist") ?? 0)} | ${loved.length ? pct(pz / loved.length) : "-"} | ${pz} | ${r.gated.some((x) => x.startsWith("Theorist")) ? "below bar" : ""} | ${hdr(r)} |`);
  }
  say();

  say("Where the proposed Theorist moves a header, what it took (shares before → after):");
  for (const p of people) {
    const a = base.reads.get(p.label)!, b = T.reads.get(p.label)!;
    if (same(a, b)) continue;
    const labels = [...new Set([...a.streaks, ...b.streaks, "Nihilist", "Hardboiled", "Theorist"])];
    say(`- ${p.label}: ${hdr(a)} → ${hdr(b)}. ${labels.map((l) => `${l} ${pct(a.shares.get(l) ?? 0)} → ${pct(b.shares.get(l) ?? 0)}`).join(", ")}.`);
  }
  say();
  say("## Over-capture probes (synthetic libraries, not part of the averages)");
  say("| Probe | Today's rules | All changes |");
  say("|---|---|---|");
  PERSONAS.forEach((pp, i) => say(`| ${pp.label} | ${hdr(personaBase[i])} | ${hdr(ALL.extraReads[i])} |`));
  say();
  // Real profiles with one extra 5-star Inception.
  const plusInc = people.map((p) => { const s = slugOfTitle("Inception")!; return { ...p, films: [...p.films.filter((f) => f.slug !== s), { slug: s, rating: 5, liked: true }] }; });
  const inc = run({ theo: THEO.proposed, dropSeries: true }, people, plusInc).extraReads;
  const flips = people.map((p, i) => ({ p: p.label, a: ALL.reads.get(p.label)!, b: inc[i] })).filter((x) => x.a.name !== x.b.name);
  say(`Every real profile with Inception added at 5 stars (all changes on): ${flips.length} of ${people.length} change name${flips.length ? ` (${flips.map((x) => `${x.p} ${x.a.name} → ${x.b.name}`).join("; ")})` : ""}.`);
  say();

  say("## Nostalgic: the signals per profile");
  say("| | Era gap (1980-2010 vs 2015+, stars above Letterboxd) | Love ratio (1980-2010 vs rest) | Loved 1980-2010 | Of them family/animated | Rewatched share of loved | " + NOS_RULES.map((r) => r.name.split(":")[0]).join(" | ") + " |");
  say("|---|---|---|---|---|---|" + NOS_RULES.map(() => "---").join("|") + "|");
  for (const p of people) {
    const n = nos.get(p.label)!;
    say(`| ${p.label} | ${n.eraGap == null ? "-" : (n.eraGap >= 0 ? "+" : "") + n.eraGap.toFixed(2)} | ${n.loveRatio == null ? "-" : n.loveRatio.toFixed(2)} | ${n.pastLoved} | ${n.childLoved} | ${n.rewatchShare == null ? "no diary" : pct(n.rewatchShare)} | ${NOS_RULES.map((r) => (isNos(n, r) ? "yes" : "")).join(" | ")} |`);
  }
  say(`Totals: ${NOS_RULES.map((r) => `${r.name.split(":")[0]} ${people.filter((p) => isNos(nos.get(p.label)!, r)).length}`).join(", ")} of ${people.length}.`);
  process.stdout.write(out.join("\n") + "\n");
}
main().catch((e) => { console.error(e); process.exit(1); });
