// b67: the BUILT poster open (rule 1720) on the real components, mocked fetch only. No motion layered on: what plays is the app's own.
import React from "react";
import { createRoot } from "react-dom/client";
import { EMPTY_QUERY } from "@/lib/recut";
import { pctShown } from "@/lib/taste/shown-match";
import { PicksFeed, MoreForYou } from "@/app/_components/PicksFeed";
import { TagPage } from "@/app/_components/TagPage";
import { BottomNav } from "@/app/_components/BottomNav";

const q = new URLSearchParams(location.search);
const c = q.get("c") || "choose";
(window as any).CLIP = c;
// Harness only: hold the reveal's name beat (RevealBeats moves to the proof after REVEAL_NAME_MS) so the clip can show the name setting.
if (c.startsWith("reveal")) { const st = window.setTimeout; (window as any).setTimeout = (f: any, ms?: number, ...a: any[]) => st(f, ms === 2400 ? 1e9 : ms, ...a); }
const J = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });
const T = (p: string, w = "w500") => `https://image.tmdb.org/t/p/${w}/${p}.jpg`;
try {
  localStorage.setItem("montage_my_username", "emma"); localStorage.setItem("montage_viewer_rated", "320"); localStorage.setItem("montage_job", "job1");
  for (const k of ["popcorn", "picks", "film", "lanes", "pitch", "match-tip"]) localStorage.setItem("montage_hint_seen:" + k, "1");
} catch {}

// ---- Pitch shortlist (b64's mocks)
const P: Record<string, string> = {
  anatomy: "1ho0d4LNZw3Y0voeKmSvPSgJOJ2", godfather: "3bhkrj58Vtu7enYsRolD1fZdja1", nocountry: "6d5XOczc226jECq0LIX0siKtgHR",
  parasite: "7IiTTgloJzvGI1TAYymCfbfl3vT", whiplash: "7fn624j5lj3xTme2SgiLCeuedmO", goodfellas: "9OkCLM73MIU2CrKZbqiT8Ln1wY2",
  heat: "e09dLw1Ljtccd2P4NsuUvVtS5du", br2049: "gajva2L0rPYkEWjzgFlBXCAVBE5", samurai: "lOMGc8bnSwQhS4XyE1S99uH8NXf",
  oldboy: "pWDtjs568ZfOTMbURQBYuT4Qxka", shining: "uAR0AWqhQL1hQa69UDEbb2rE5Wx", substance: "lqoMzCcZYEFK729d6qzt349fB4o",
};
type F = [string, string, number, number, number, string[], string];
const film = ([k, title, year, match, runtime, genres, why]: F) => ({ slug: k, title, year, posterUrl: T(P[k]), match, why, runtime, genres, language: "en" });
const NEW: F[] = [
  ["oldboy", "Oldboy", 2003, 91, 120, ["Thriller", "Crime"], "Tense and propulsive, a revenge story that keeps tightening."],
  ["nocountry", "No Country for Old Men", 2007, 89, 122, ["Crime", "Thriller"], "Slow-burn dread, near the films you rate highest."],
  ["parasite", "Parasite", 2019, 87, 132, ["Thriller", "Drama"], "Tension that builds through the house."],
  ["anatomy", "Anatomy of a Fall", 2023, 84, 152, ["Crime", "Drama"], "A courtroom thriller, cool and exact."],
  ["shining", "The Shining", 1980, 82, 144, ["Thriller", "Horror"], "Dread over spectacle."],
  ["whiplash", "Whiplash", 2014, 80, 107, ["Drama"], "Propulsive, under two hours."],
  ["br2049", "Blade Runner 2049", 2017, 78, 164, ["Thriller", "Science Fiction"], "Slow and tense, the look you like."],
];

// ---- Film page (b36f's mocks)
const heat = { slug: "heat-1995", title: "Heat", year: 1995, posterUrl: T(P.heat), backdropUrl: "/_j/picks-immersive-v1-img/bd-heat.jpg", runtimeMinutes: 170, certification: "R", genres: ["Crime", "Drama", "Thriller"], directors: ["Michael Mann"],
  letterboxdAvg: 4.3, letterboxdWatchCount: 1250000, tmdbVote: 7.9, avg: 4.3, popularity: "Widely seen",
  overview: "Obsessive master thief Neil McCauley leads a top-notch crew on various daring heists throughout Los Angeles while determined detective Vincent Hanna pursues him without rest.",
  cast: [{ id: 1, name: "Al Pacino", character: "Lt. Vincent Hanna", order: 0, profilePath: null }, { id: 2, name: "Robert De Niro", character: "Neil McCauley", order: 1, profilePath: null }],
  crew: [{ name: "Michael Mann", character: "Director", order: 0, profilePath: null }], countries: ["United States"], originalLanguage: "en", originalTitle: "Heat", imdbId: "tt0113277", clusters: [], themes: [] };
let stored = 88; for (let s = 0; s <= 100; s += 0.1) { if (pctShown(s) === 88) { stored = Math.round(s * 10) / 10; break; } }
const match = { film: heat, score: stored, verdict: "Strong match", explanation: "You rate patient, procedural crime highest when both sides are professionals. Heat is the template: two men who are the best at what they do, and a city at night.",
  anchors: ["Collateral", "Zodiac", "Thief"], anchorFilms: [{ title: "No Country for Old Men", year: 2007, slug: "nocountry", posterUrl: T(P.nocountry), rating: 4.5 }, { title: "The Godfather", year: 1972, slug: "godfather", posterUrl: T(P.godfather), rating: 5 }],
  dontPreferAnchors: [], sharedTags: ["Heist films", "Slow-burn crime", "Los Angeles noir"], themes: ["Professionals at work", "Obsession"], fitBand: "strong", alreadyLogged: false, onWatchlist: false, userRating: null,
  lanes: [{ name: "Heist films", slug: "heist-films", fill: 0.8, note: "" }, { name: "Slow-burn crime", slug: "slow-burn-crime", fill: 0.6, note: "" }] };

// ---- Picks feed cards
const pick = (k: string, title: string, year: number, m: number, director: string, runtime: number, bd?: string) => ({ slug: k, title, year, posterUrl: T(P[k]), match: m, director, runtime, backdropUrl: bd ?? null, stillUrl: bd ?? null, genres: ["Crime"] });
const PICKS = [
  pick("heat", "Heat", 1995, 92, "Michael Mann", 170, "/_j/picks-immersive-v1-img/bd-heat.jpg"),
  pick("parasite", "Parasite", 2019, 89, "Bong Joon Ho", 132, "/_j/picks-immersive-v1-img/bd-parasite.jpg"),
  pick("oldboy", "Oldboy", 2003, 87, "Park Chan-wook", 120),
  pick("nocountry", "No Country for Old Men", 2007, 85, "Joel Coen", 122),
  pick("anatomy", "Anatomy of a Fall", 2023, 83, "Justine Triet", 152),
];

const sug = [["noor", "Noor", "Tenderhearted", 84], ["theo", "Theo", "Aesthete", 79], ["mara", "Mara", "Comic Relief", 76]]
  .map(([u, n, a, m]) => ({ id: "p-" + u, username: u, displayName: n, avatarUrl: null, archetype: a, match: m, following: false, followsYou: false }));

const of = window.fetch.bind(window);
(window as any).fetch = async (u: any, init?: any) => {
  const url = String(u?.url ?? u);
  if (!url.includes("/api/")) return of(u, init);
  let body: any = {}; try { body = init?.body ? JSON.parse(init.body) : {}; } catch {}
  const path = url.replace(/^https?:\/\/[^/]+/, "").split("?")[0];
  if (path.startsWith("/api/recut")) {
    if (body.op === "status") return J({ enabled: true, signedIn: true, pro: true, used: 3, limit: null });
    if (body.op === "recents") return J({ recents: [], saved: [] });
    if (body.op === "run" || body.op === "rank") return J({ id: "k3x9a2", query: { ...EMPTY_QUERY, genres: ["Crime", "Thriller"], dials: [{ label: "tension", dir: "up" }] }, films: NEW.map(film), considered: 2400 });
    return J({});
  }
  if (path === "/api/probes") return J({ probes: [], wall: Array.from({ length: 90 }, (_, i) => T("wall" + String(i).padStart(3, "0"), "w342")) });
  if (path === "/api/tag-page") return J(person);
  if (path === "/api/match-csv") return J({ ...match, explainPending: false });
  if (path === "/api/browse") {
    if (body.detailFor) return J({ films: [] });
    if (body.page > 0) return J({ films: [], hasMore: false });
    // Opening a film: Heat sits mid-list (second row, middle) so its flight to the header reads.
    if (c.startsWith("open")) { const [h0, ...r] = PICKS; return J({ films: [...r.slice(0, 4), { ...h0, match: 83 }, pick("whiplash", "Whiplash", 2014, 81, "Damien Chazelle", 107), pick("shining", "The Shining", 1980, 80, "Stanley Kubrick", 144), pick("br2049", "Blade Runner 2049", 2017, 78, "Denis Villeneuve", 164), pick("godfather", "The Godfather", 1972, 77, "Francis Ford Coppola", 175)], hasMore: false }); }
    return J({ films: PICKS, hasMore: false });
  }
  if (path === "/api/similar") return J({ seed: { slug: "heat-1995", title: "Heat", year: 1995, posterUrl: T(P.heat) }, results: ["nocountry", "oldboy", "parasite", "godfather"].map((k, i) => ({ slug: k, title: k, year: 2000, posterUrl: T(P[k]), score: 90 - i * 2, match: 90 - i * 2 })) });
  if (path === "/api/film-people") return J({ saw: [], want: [], watchWith: [], invite: [], everyone: { n: 214, a: 4.1 } });
  if (path === "/api/film-takes") return J({ canPost: false, myRating: null, canPostPublic: true, perWatch: true, takes: [], everyone: [], counts: { takes: 0, replies: 0, everyone: 0 }, takeMax: 2000 });
  if (path === "/api/watch-providers") return J({ region: "US", stream: [], free: [], rent: [], buy: [], theater: null, yoursLine: null });
  if (path === "/api/rating-chips") return J({ pos: ["pos:heist", "pos:tension"], neg: ["neg:pacing"], mine: [] });
  if (path === "/api/my-profile") return J({ id: "me1", username: "emma", displayName: "Emma", avatarUrl: null });
  if (path === "/api/discover-people") return J({ people: sug });
  if (path === "/api/friends") return J({ circle: [] });
  if (path === "/api/recent-takes") return J({ takes: [] });
  if (path === "/api/movie-nights") return J({ open: [], nights: [] });
  if (path === "/api/groups") return J({ groups: [], suggest: [] });
  if (path === "/api/blends") return J({ blends: [], invites: [], cap: 3 });
  if (path === "/api/invites") return J({ ready: false });
  if (path.startsWith("/api/screen")) return J({}, 404);
  if (init?.method === "POST") return J({ ok: true });
  return J({});
};

class EB extends React.Component<any, { e: any }> { state = { e: null as any }; static getDerivedStateFromError(e: any) { return { e }; } render() { return this.state.e ? <pre style={{ color: "#f88", whiteSpace: "pre-wrap", fontSize: 11 }}>{String(this.state.e?.stack || this.state.e).slice(0, 900)}</pre> : this.props.children; } }
const noop = () => {};

// ---- 9. Opening a film: a source screen (a Picks list row, or a person's poster grid) with the real film page
// mounted in a hidden layer over it; motion.js flies the poster between the two.
const mm = ["heat", "Heat", 1995, "e09dLw1Ljtccd2P4NsuUvVtS5du"], gridFilms = [
  ["thief", "Thief", 1981, P.goodfellas, 4, null], ["heat-1995", "Heat", 1995, P.heat, null, 78], ["collateral", "Collateral", 2004, P.br2049, null, 91],
  ["the-insider", "The Insider", 1999, P.nocountry, null, 88], ["manhunter", "Manhunter", 1986, P.shining, 4, null], ["public-enemies", "Public Enemies", 2009, P.godfather, null, 82],
  ["ali", "Ali", 2001, P.whiplash, null, 79], ["miami-vice", "Miami Vice", 2006, P.anatomy, null, 77], ["last-mohicans", "The Last of the Mohicans", 1992, P.samurai, 4.5, null],
].map(([slug, title, year, p, rating, m], i) => ({ slug, title, year, posterUrl: T(p as string, "w342"), crowd: 4.0, match: m, rating, seen: rating != null, watch: 3e6 - i * 2e5, genres: ["Crime"], runtime: 120 }));
const person: any = { kind: "person", slug: "michael-mann", name: "Michael Mann", blurb: null, count: gridFilms.length, seenCount: 3, ratingDelta: 0.4, viewerMean: 4.3, crowdMean: 3.9, overallMean: 3.9, best: 91, films: gridFilms, neighbours: [], yearSpan: [1981, 2015], personal: true,
  roles: [{ id: "directed", count: gridFilms.length, slugs: gridFilms.map((f) => f.slug) }], mainRole: "directed", profilePath: null, similar: [] };
void mm;
import { useFilmDetail } from "@/app/_components/FilmDetailSheet";
import { SheetSwipe } from "@/app/_components/SheetSwipe";
function OpenFilm() {
  const { openFilmFromList, node } = useFilmDetail();
  const src = c.startsWith("open-grid") ? "grid" : "row";
  return (<>
    {src === "row"
      ? <main className="wrap hastabs"><section className="stage"><MoreForYou jobId="job1" username="emma" onOpenFilm={(l: any, i: number) => openFilmFromList(l, i, "More for you")} /></section><BottomNav active={"discover" as any} onChange={noop} /></main>
      : <TagPage kind="person" slug="michael-mann" initial={person} />}
    {node}
    <SheetSwipe />
  </>);
}
createRoot(document.getElementById("root")!).render(<EB><OpenFilm /></EB>);
