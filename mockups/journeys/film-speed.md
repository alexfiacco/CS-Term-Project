# Film page speed pass (2026-11-13)

Owner ask: "Make sure we're doing the most to make sure that film pages are loading quickly."

Short version: the film page was already in good shape (one streamed screen request, edge-cached
HTML and head, parallel iPhone reads, memoized embeddings, right-sized hero images). I removed three
server waterfalls, added the timing log that was missing, and gave the iPhone a recent-film cache.
The biggest remaining wait is not a waterfall: it is a film with no embedding, which makes the
match % wait on an OpenAI call (9 to 10 s in the logs). That needs your call (below).

## 1. What could and could not be measured

| Source | Result |
|---|---|
| Vercel Observability (p50/p95 by route) | **Not available.** `get_observability_schema` and `create_observability_query` both answer 404 "Observability Data not found" for this team (the plan does not include it). |
| Vercel runtime logs | Available, but they carry log lines only, no request durations. `/api/screen/film` wrote 20 lines in 72 h, all from `[step-timing] score-missing`. |
| Timing production from here | Blocked: this container's proxy refuses montagefilm.app (403 on CONNECT). The deployment fetch tool returns bodies and headers but no timings. |
| Supabase `pg_stat_statements` | Available: real database execution times for every query on the film path. |
| Local server timing | Not possible: no `.env.local` (no Supabase or OpenAI keys) in this environment. |

**So there are no honest p50/p95 numbers for before.** What exists:

- **Database time is not the problem.** Every query on the film path runs in about a millisecond in
  Postgres (pg_stat_statements, mean): profile id by user 0.06 ms (3,087 calls), film_collection by
  slug 0.07 ms, film_vec by slugs 17 ms (4,167 calls, the library vectors), ai_cache get 1.1 ms
  (44,603 calls). The cost on each read is the HTTP round trip to PostgREST, so the wins are fewer
  reads in a row, not indexes.
- **Region is right.** Functions run in pdx1 (`x-vercel-id ...::pdx1::`), Supabase is us-west-2
  (Oregon). Runtime Node 24. No change needed.
- **The match % on a film nobody has scored for you yet** (`[step-timing] score-missing`, from
  `/api/screen/film`, 12 Nov):

  | Request | total | viewer model | embedding | score + store |
  |---|---|---|---|---|
  | 22:37 | 425 ms | 244 | 41 | 140 |
  | 22:35 | 529 ms | 395 | 28 | 106 |
  | 21:50 | 795 ms | 540 | 61 | 194 |
  | 21:52 | **9,944 ms** | 457 | **9,320** | 167 |
  | 21:54 | **9,349 ms** | 390 | **8,818** | 141 |

  The two 9 to 10 s opens were a film with no embedding: the match waits for OpenAI to embed it.
  The same person hit it twice two minutes apart, which suggests the vector was not stored the first
  time (not confirmed).

**From now on there is a p50/p95 source** (change D below): one `[screen-timing]` line per screen
answer. To read it: `get_runtime_logs` with query `screen-timing` and a `deploymentId`, then take
percentiles of `total=` and of each section. Read 24 to 72 h after the deploy for a real
before/after on a fuller sample.

## 2. Critical path for first paint

- **Web, `/film/<slug>`:** the HTML is edge-cached for a week (rules 483, 770, 981; middleware sends
  `m`/`p` variants). The head (backdrop w1280 `fetchPriority="high"`, poster w342
  `fetchPriority="high"`, title, facts) paints from that HTML. A member's match then comes from one
  streamed `POST /api/screen/film?stream=1`; the `match` line paints the % the moment it lands, and
  the other sections stream in after it. A film opened in the last few seconds repaints from memory
  first (`recall`, rule 445).
- **iPhone:** the page opens on the tapped card's poster, title and year (`FilmSeeds`); the head
  comes from `/api/public-film` (edge-cached, no token); the match and the rest come from one
  streamed screen request (`ScreenLoads.film`), all started together in `FilmScreen.task`.
- **What blocks the match %:** `resolveScoringProfile` (shared single flight), then the stored
  score, or for an unscored film `scoreMissingFilms` (viewer model 250 to 550 ms, plus the embedding
  call when the film has none).

## 3. Checked and already right (no change)

- Sections already run side by side in `/api/screen/film`; explain and said wait for match only
  because they depend on it.
- iPhone `FilmModel.load` already fires every read at once (`async let`), not in sequence.
- Images: hero backdrop w1280 and poster w342, both `fetchPriority="high"`; row posters go through
  `posterImg` (w185/w342 srcset) on the web.
- `getPublicFilm` is in Next's data cache for a day; `getPublicSimilar` is cached per film;
  `/api/public-film` and `/api/trailer` are CDN-cached.
- `raw_tmdb` is not sent to clients: it is read on the server and reduced to cast and crew.
- Supabase performance advisor: no unindexed foreign keys or slow-query findings; only unused
  indexes and archive tables without primary keys, nothing on the film path.
- Web hover prefetch: not added. Prefetching the personal payload on hover would run the match
  for films nobody opens (database load and cost), and the request bodies must match the sheet's
  exactly to be claimed. A pointer-down prefetch would save roughly 100 ms; not done here.

## 4. What changed

### On `main` (commit `8682f5ea`, rule 1810, deployed `dpl_DiycdRPB2x94Mk4A42s22zX2BsTU`)

A. **`/api/watch-providers`**: after the rate limit, it ran six reads one after another (providers
cache, film tmdb id, film title, release tags, token, profile id, services). Now three chains start
together: providers; title then theaters; token, profile, services. The section now costs its
longest chain (about 3 round trips) instead of the sum (about 6). Answer checked byte-identical
on The Dark Knight before and after.

B. **`/api/film-series`**: token and profile id were read before the series lookup. Now they start
beside it and `filmSeries` only waits for them once the film is known to be in a series. Most films
are in none, so they now answer after one read (`film_collection` by slug), not three. Checked
on The Dark Knight: the same series answer.

C. **`/api/similar`** (More like this): the seed film's row (`enrichBySlugDB`, which carries
`raw_tmdb`) waited for the scoring profile; now it is read beside it.

D. **`[screen-timing]` log line** in `lib/screen-endpoint.ts`, for every screen endpoint (film,
picks, groups, profile, room): `[screen-timing] screen/film cold=0 total=812 auth=40
match=640:200 similar=790:200 watch=120:200 ... said=0:skip`. Section names, milliseconds and
statuses only; nothing personal. `cold=1` marks an instance's first answer after a cold start.

Not changed: answers, statuses, login checks and rate limits. `match-csv` was left alone: starting its
film-row read earlier would waste a `raw_tmdb` read on every seen film, which takes another path.

Before → after: **not measured end to end** (see section 1). Expected saving: two to three
PostgREST round trips off the Where to watch section, two off the series section for most films,
and one off More like this. Read the real effect from the `[screen-timing]` lines.

Gates: tsc, check-invariants (exit 0, no ✗; 1810's check was confirmed to fail when broken),
check-security ok, `check-ds-log origin/main` ok (marked n/a: request order only).

### iPhone, branch `build38-film-speed` (commit `c15a42a5`, not pushed; rule 1811)

Patch: `/home/user/CS-Term-Project/build38/film-speed.patch`

- `FilmModel.publicFilm(slug)`: films read this session are kept for 10 minutes (60 at most), and
  a read already under way is joined, not repeated. A film opened again within ten minutes shows its
  whole head (backdrop, poster, facts, cast) on the first frame. Before, it showed only the seed
  (poster, title, year) and asked `/api/public-film` again.
- `FilmModel.init` starts the head read at once. Before, it waited for `FilmScreen`'s
  `await auth.accessToken()`, though it needs no token.
- Match, rating and friends are still read fresh every time.
- Rule 1535's check now counts the calls through `publicFilm`, the same guarantee as before:
  only `fetchPublic` reads it, with no token, a log line and one retry.
- **Not compiled** (Linux, no Xcode). Every changed line was read. Compile before merging.

## 5. Owner SQL

**None.** Every query on the film path executes in about 1 ms in Postgres. No index would make a
film page faster, so there is no `docs/sql/film-speed.sql`.

## 6. Top remaining bottlenecks (in order)

1. **Films with no embedding make the match wait on OpenAI (9 to 10 s seen).** 41,525 of 72,512
   catalog films have no vector, **2,758 of them with more than 1,000 Letterboxd watches**. A signed-in
   open of one embeds it in the request (`scoreMissingFilms`, then `ensureEmbeddingsForFilms`). Two
   options:
   - (a) A one-off backfill of the 2,758 watched films. About 0.5M tokens on the embedding model:
     cents. The catch: those films then enter More like this and nearest-neighbour pools, so this is a
     data science change that needs a log entry and your OK.
   - (b) Cap the in-request embed (about 1.5 s) and finish it behind the response. The match would
     show without a % on that first open.

   I recommend (a). Also worth checking: why the same film embedded twice two minutes apart
   (`films.embedding` write failing or timing out?).
2. **Viewer model load for an unscored film: 250 to 550 ms, up to 2.9 s.** `loadViewerModel` re-reads
   the library, ratings, removed films, population and calibration on every call. A short in-process
   cache keyed by the library version would cut it, but it has to be invalidated exactly on a
   rating, so it needs care (rule 1149 territory).
3. **iPhone posters load at the catalog's stored size (often w500)** in small rows (the series row,
   More like this). The web resizes through `posterImg`; the iPhone `Poster` view loads the URL as
   given. Resizing to w185/w342 would cut each thumbnail from about 60 to 90 KB to about 15 to 25 KB.
   Not done: it touches every screen's images, so it gets its own pass.
4. **No real p50/p95 yet.** Read the `[screen-timing]` lines after 24 to 72 h and fill in a table
   here. If you want dashboards, Vercel Observability Plus would give per-route percentiles without
   log parsing (a plan cost; not needed for this).
5. **Possible pointer-down prefetch on the web** (about 100 ms) and **tap-down prefetch on the iPhone**
   (would need a press gesture on every poster; the risk is breaking scrolling and context menus).
   Both are small wins with some risk, so they were not done here.
