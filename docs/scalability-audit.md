# Montage scalability audit

Date: 2026-11-03. Scope: the Next.js app on Vercel (`/home/user/montage`, `main` at `ff24d61`), the Supabase
project `uktamekqqsiijugpaxit`, the GitHub Actions nightly job and the iPhone app (`ios/`).

How it was done: read-only. I read the code, ran SELECT and EXPLAIN (no ANALYZE) queries, read
`pg_stat_statements` (reset 2026-10-29 06:18 UTC, so about 5.1 days of data), `pg_stat_user_tables`,
the Supabase performance advisor and edge logs (last 24 h), Vercel runtime errors (7 days) and log
counts, and the logs of one nightly GitHub Actions run. I changed no code, wrote nothing to the database
and did not load-test.

**Today's scale, for context:** 23 auth users, 20 published profiles, 1 to 4 daily active users (the
owner is most of the traffic), 70,341 rows in `films`, 30,062 films in `score_catalog`, a 1.66 GB
database. Every per-user number below comes from a sample this small, and most of it is the owner's own
use. The user counts at which each risk bites are estimates, worked out in the text, not measurements.

---

## Executive summary

Montage is built more carefully than most apps of its size. The browser never touches the database. All
traffic goes through PostgREST over HTTPS, so serverless functions cannot run out of Postgres
connections (27 idle PostgREST connections out of `max_connections = 90`). Scores are already packed into
one array per user. Crons store cursors and hand off to the next run. Rate limits and spend caps exist.
The one realtime RLS policy wraps `auth.uid()` in a `select`. The obvious failure modes are covered.

What breaks first comes from the design, not from missing indexes:

1. **Things that already hurt at 23 users and do not depend on the user count.** Crawlers walking
   about 500k person and film pages cause 13,850 function timeouts a week. Every cold server instance
   loads all of `film_labels` again, and that load is **65% of all database time**.
2. **Global ceilings that real usage will hit at about 1k to 10k users.** The whole app gets 4,000
   Claude calls a day. `refresh_crowd_film_means` is O(users × catalog) with a 60 s budget and fails at
   about 1,300 score vectors. The nightly match-score job can rescore about 210 users a night, which
   saturates at about 6k users. The weekly crons max out at 13 hops of about 4 minutes each.
3. **Per-request overheads that grow with traffic and bite at about 50k to 100k users.** Every signed-in
   request makes a network call to Supabase Auth, whose Postgres pool is fixed at 10 connections. Every
   rate-limited request makes a Postgres write. Movie-night rooms poll every 4 s even when realtime is
   working.
4. **Storage and write amplification at about 1M users.** The score vectors would total about 41 GB,
   with a 41 KB row rewritten on every rating. The working set would far exceed the RAM of the current
   compute tier (about 2 GB, by its settings).

None of these needs a rewrite. Items 1 and 2 are S/M fixes and should come first. Per 1k MAU, the money
goes mostly to the LLM (about $60 to $200 a month, most of it on the Sonnet-backed "seen-why" read).
Vercel and the database come to roughly $10 to $25 combined, before fixed plan fees.

---

## Top 10 risks, ranked by likelihood × impact

Likelihood and impact are each scored 1 to 5. "Bites at" is the user count (registered users unless it
says MAU or DAU) where I expect it to cause visible failures.

| # | Risk | L | I | Bites at | Effort |
|---|---|---|---|---|---|
| 1 | Crawler fan-out on `/person/*/as/*` and `/film/*/v/*` SSR pages | 5 | 4 | **now** | M |
| 2 | Global Claude cap of 4,000 calls a day | 5 | 4 | ~1-2k MAU | S |
| 3 | `refresh_crowd_film_means` is O(users × catalog) with a 60 s budget | 5 | 3 | ~1.3k score vectors | S |
| 4 | Every cold instance re-reads all of `film_labels` (65% of DB time) | 5 | 3 | now; worse with every new instance | S |
| 5 | Nightly match-score job capacity (~45 s per user, 4 machines × 40 min) | 4 | 4 | ~6k users | M |
| 6 | Weekly crons (pregen, digest) capped at 13 hops; pregen's sign-in scan stops at 20k users | 4 | 3 | ~5-20k | M |
| 7 | Every authenticated request calls Supabase Auth (`auth.getUser`), whose pool is 10 connections | 3 | 4 | ~50-100k | S |
| 8 | Rate limiting stored in Postgres, one write per request, fails open | 3 | 3 | ~100k | M |
| 9 | Movie-night rooms poll every 4 s even when realtime is live | 3 | 3 | a few hundred concurrent rooms (~100k) | S |
| 10 | Score-vector storage and write amplification; working set larger than RAM | 2 | 5 | ~200k-1M | L |

### 1. Crawlers are already timing out SSR pages for about 500k people and films

**Evidence**
- Vercel runtime errors over 7 days: `Task timed out after 30 seconds`, **count=13,850, distinct
  "users"=13,671**, on `/person/[slug]/as/[role]` and `/film/[slug]/v/[variant]`. There were also 340
  `person index read failed: TimeoutError` and 160 + 110 `person index read failed / film read failed:
  <!DOCTYPE html> … supabase.co | 521: Web server is down`. That is, Supabase's edge returned 521
  errors during these bursts.
- 13,671 distinct callers against 1 to 4 real DAU means almost all of this is bots. I could not see user
  agents, so this attribution is inferred.
- Size of the long tail: `film_cast` has 386,327 distinct people, `film_crew` 115,646, `films` 70,341.
  `app/robots.ts` allows everything except `/api/`, and the sitemaps list these pages.
- `app/person/[slug]/as/[role]/page.tsx:10-20` has `revalidate = 600`, `force-static` and
  `maxDuration = 15`. With half a million distinct URLs, nearly every crawler hit misses the ISR cache
  and renders cold. A cold render reads the `ai_cache` person-index shards (`lib/person-index.ts:72-75`),
  then `films`, `film_cast` and so on.
- Supabase edge logs show 268k REST requests in the last 24 h, 114k of them to `/rest/v1/films` and
  12.9k to `/rest/v1/film_cast`, with about 2 real users active.

**Bites at:** now. This cost does not depend on users, but it takes database capacity away from them,
and it is the most likely cause of the 521s users have already met.

**Fix**
1. In Vercel Firewall, add a rate-limit rule (or Bot Protection) for `/person/*` and `/film/*/v/*` per
   IP or ASN, and challenge unverified bots.
2. Cut the sitemap down to people with N+ films or a photo. Leave the rest reachable by links but
   `noindex`.
3. Make a cold render cheap. Serve the person and film index shards as static JSON from Storage or the
   CDN, not from `ai_cache` rows. Lower `maxDuration` and return a cached "not ready" shell instead of
   timing out.
4. Use longer `revalidate` values (a day or more) on these pages.

**Effort:** M.

### 2. The global Claude daily cap will switch off generated copy for everyone at about 1-2k MAU

**Evidence**
- `lib/claude.ts:281`: `DAILY_CLAUDE_CALLS = Number(process.env.DAILY_CLAUDE_CALLS ?? 4000)` is one
  counter for the whole app (`bump("claude", …)`, line 336). When it fills, the app serves templated
  copy, and the weekly-pick reason and "Why you enjoyed it" are left empty (`docs/ARCHITECTURE.md`).
- Measured (`usage_counters`, last 14 days): 55 to 757 Claude calls a day with 1 to 4 DAU. Today's mix
  of about 40 calls to onboard a new user and roughly 5 to 15 per active user-day reaches 4,000 calls at
  about 250 to 400 DAU, or about 1-2k MAU at 25% DAU/MAU.
- The anonymous sub-cap is a quarter of that, 1,000 a day (`lib/claude.ts:294`).

**Bites at:** about 1-2k MAU. It fails quietly: there is no error, the product just gets worse after
mid-morning UTC.

**Fix**
- Replace the call count with a **dollar budget per day**, computed from `PRICES` in
  `lib/claude-models.mjs`, plus a **per-user daily allowance** (the per-user counter from rule 538
  already exists).
- Raise the global cap well above the expected spend, so it only works as a circuit breaker.
- Alert when the budget is 80% used.

**Effort:** S.

### 3. `refresh_crowd_film_means` fails at about 1,300 score vectors

**Evidence**
- The function body (read from `pg_proc`) loops over every `user_score_vec` row in batches of 200 and
  runs `unnest(v.scores)` on each 30k-element array. That is O(users × catalog).
- If it goes over `p_budget_ms`, it **raises an exception**.
- It is called from `app/api/cron/lane-affinity/route.ts:32` with `p_budget_ms: 60_000`.
- `pg_stat_statements`: 4 calls, **mean 926 ms for 20 vectors** (about 46 ms per vector), 25 MB of WAL.
  At that rate, 60 s covers about 1,300 vectors.

**Bites at:** about 1.3k users with scores. After that, the crowd means stop refreshing every night. The
seasonal mix and anything else that reads `crowd_film_means` goes stale.

**Fix**
1. Keep running sums: `crowd_film_sum(ord, total, n)`, updated inside `put_film_scores` from the diff
   between the old and new vector. Its loop already touches every changed ordinal.
2. Or compute the means in the nightly GitHub job, which already holds every vector in memory, and
   upsert only the means.
3. As a stopgap, sample a fixed set of 2,000 users.

**Effort:** S.

### 4. Every cold function instance re-reads all of `film_labels`, and that is 65% of DB time

**Evidence**
- `lib/film-labels.ts:36-77` holds about 27k labelled rows, 32 columns each, in module memory with a
  6 h TTL. Each new instance loads them all, in 1,000-row keyset pages, 6 lanes at a time.
- `pg_stat_statements` since 2026-10-29: the two keyset queries ran **74,948 + 67,029 calls, 3,375 s +
  1,961 s**. That is **5,494 s of 8,422 s total statement time (65%)**, about 18 minutes of database
  time a day.
- At about 28 pages per load, that works out to roughly **1,000 full loads a day**, which means about
  1,000 cold instances a day at 23 users. The loads are triggered by `ensureFilmLabels()` in browse,
  tonight, tag pages, film facets and `similar-rerank`, by `/api/cron/keep-warm` every 5 minutes, and,
  very likely, by the crawler traffic in risk 1.
- Instance count grows with concurrency, so this grows with traffic, not with the size of the catalog.

**Bites at:** now in database time. At 10k+ users, cold-start bursts (a deploy, or a traffic spike) start
dozens of these loads at the same moment. That is how a small instance falls over.

**Fix**
1. Build the label map once (in a cron, or when labels change) as **one compact blob**: a columnar
   `Int8Array` per dimension plus a slug list, about 1-2 MB gzipped.
2. Serve the blob from Supabase Storage behind the CDN, or from Vercel Runtime Cache or Edge Config.
   Each cold instance then makes **one** fetch and no database queries.
3. Do the same for the other whole-table, per-instance caches: lanes, directors and pick pools.

**Effort:** S-M.

### 5. The nightly match-score job saturates at about 6k users

**Evidence**
- `.github/workflows/nightly-match-scores.yml` together with `scripts/backfill-match-scores.mjs:142`
  sets `MAX_SHARDS = 4` and `USERS_PER_SHARD = 20`, with `MONTAGE_RESCORE_BUDGET_MIN: "40"`.
- Run 41326981558 (2026-11-01) rescored **16 users in about 12 minutes on one machine, about 45 s per
  user**.
- Capacity is 4 machines × 40 min ÷ 45 s ≈ **210 users a night**. The monthly refresh alone puts
  users ÷ 30 users due every night. New accounts, re-imports and anyone with 5+ new ratings come on
  top of that.
- The planner hard-codes the 4-machine maximum. Separately, GitHub limits how many jobs run at once (20
  on Free and Pro plans, by my understanding).

**Bites at:** about 6k users. After that the backlog grows every night. Because the order is "most
urgent first", the monthly refreshes simply never happen, and match % drifts away from current
Letterboxd averages. At 100k users this needs about 60 machine-hours a night.

**Fix**
1. The work is mostly dense similarity: about 30k catalog films × a user's rated films × 1536
   dimensions, roughly 46 GFLOP for a user with 1,000 ratings. Run it as a matrix multiply (BLAS through
   numpy or onnxruntime, or `Float32Array` with SIMD). That should take seconds per user, not 45 s.
   This is a guess; I did not profile it.
2. Score only candidate films: top-K neighbours from `film_neighbours`, plus films above a popularity
   floor, instead of all 30k.
3. Size the shard count from how many users are due, not a fixed 4.

**Effort:** M.

### 6. Weekly crons: per-user work in-process, capped at 13 hops

**Evidence**
- `lib/cron-continue.ts:7`: `MAX_HOPS = 12`, so at most 13 invocations of about 4 minutes, or about
  52 minutes a run.
- **Pregen** (`app/api/cron/pregen/route.ts`) runs 3 workers. Per user it does one POST to
  `/api/weekly-pick` (another function invocation) and 4 sequential `whyLovedReading` Claude calls
  (lines 120-131). At a guessed 5-10 s per user, that is about 1-2k users a run.
- `activeProfiles()` reads every `public_profiles` row and **pages `auth.admin.listUsers` only up to 20
  pages of 1,000** (line 107). Anyone past 20k users who is "active" only by signing in is silently
  left out.
- **Weekly digest** (`app/api/cron/weekly-digest/route.ts`) goes to every published profile, not only
  active ones, 4 at a time with a 230 s deadline. It has the same 13-hop ceiling.

**Bites at:** about 5-20k users, depending on how long each user takes, which I did not measure.

**Fix**
1. Move per-user fan-out onto a queue (Vercel Queues, Upstash QStash, or Supabase `pgmq` + `pg_cron`)
   with one message per user.
2. Find active users in a single SQL query, using `auth.users.last_sign_in_at` through a
   security-definer view, instead of `listUsers`.
3. Send the digest only to users active in the last 30-60 days.
4. Use the Anthropic Batch API (50% cheaper) for the pregen readings, since they are not urgent.

**Effort:** M.

### 7. Each authenticated request makes a network call to Supabase Auth

**Evidence**
- `lib/server-auth.ts:40`: `serviceClient().auth.getUser(token)` runs on every request that carries a
  token. The result is memoised per request only.
- The edge logs show 2,395 `/auth/v1/user` calls in 24 h with about 2 users.
- The performance advisor reports: "Your project's Auth server is configured to use at most **10
  connections**." (the `auth_db_connections_absolute` lint).
- Room polling (risk 9) is `perUser`-limited, so it verifies the token on every poll.

**Bites at:** about 50-100k users, or sooner at evening peaks. Auth latency adds to every API call, and
the 10-connection pool queues.

**Fix**
- Verify JWTs locally: switch to asymmetric JWT signing keys and use `supabase.auth.getClaims()` or
  `jose` with the JWKS. Keep `getUser` only for sensitive writes such as account deletion.
- Switch Auth to percentage-based connection allocation.

**Effort:** S.

### 8. Rate limiting writes to Postgres on every request and fails open

**Evidence**
- `lib/rate-limit.ts:228-235`: every limited request calls `bump_usage`, an upsert into
  `usage_counters`, a normal logged table. Each window writes a new row per caller.
- If the database is slow (`DB_TIMEOUT_MS = 1500`) or errors, the limiter lets the request through.
  So **the brake disappears exactly when the database is overloaded**.
- The in-process pre-check is per instance (`LOCAL_MAX_KEYS = 20_000`, cleared all at once), so it is
  much looser across many instances.
- Today: 14,764 `bump_usage` calls in 5 days, 0.9 ms each, about 1.2 KB of WAL each.

**Bites at:** about 100k users. At 30% DAU and around 200 limited requests per DAU, that is about 6M
upserts a day, roughly 70 a second on average and several hundred at peak. The table and its WAL then
compete with real queries.

**Fix**
- Move the short-window limits to Upstash Redis or Vercel KV, using sliding windows. Or use Vercel
  Firewall rate-limit rules for the IP-keyed routes; they never reach a function.
- Keep Postgres for the daily spend caps, which are few and low-frequency.
- At minimum, make `usage_counters` `UNLOGGED` for the `rl:*` rows, kept in a separate table.

**Effort:** M.

### 9. Movie-night rooms poll every 4 s even when realtime is live

**Evidence**
- iOS `ios/Montage/Sources/Features/Room/RoomModel.swift:481-495` reloads the room every 4 s while the
  room screen shows, **whether or not realtime is live**. Lines 506-516 refresh the tally every 4 s only
  when `!rtLive`, which is right. On top of that: a 60 s presence ping and a 30 s chat read.
- Web `app/t/[id]/TheaterRoom.tsx:258-264` does the same 4 s roster poll, and has a 15 s `refreshAll`.
- Each poll to `GET /api/theater` (`app/api/theater/route.ts:23`) costs a `room-poll` rate-limit write
  (limit 360/min, `perUser`, so plus an Auth call), then reads of the room meta, roster and events.
- A 6-person room on the room screen makes 1.5 polls a second, or **about 10,800 requests an hour**.

**Bites at:** a few hundred rooms open at once, which a Friday evening at about 100k users could
produce. That is several hundred requests and about 1-2k database queries a second. It also adds to
Vercel invocations and Active CPU.

**Fix**
- Gate the 4 s roster poll on `!rtLive`, as the vote loop already is, and keep a 30 s backstop.
- Have `/api/theater` return an `ETag` (a roster version) so a poll with no changes is a cheap `304`.
- Send roster changes as realtime nudges, which already exist (`broadcastTheater(…, "roster")`).

**Effort:** S.

### 10. Score-vector storage and write amplification

**Evidence**
- `user_score_vec`: average row 41,378 bytes (compressed). There is one `smallint` per
  `score_catalog` film, and the catalog is 30,062 films, growing as films are scored.
- `put_film_scores` reads, pads, edits and **rewrites the whole array**:
  `pg_stat_statements` shows 226 calls, 41.5 ms mean, **14.9 MB of WAL, about 66 KB per call**.
- `get_film_score_map` unnests the whole vector, 80.7 ms mean. `film_scores_for` loops once per
  profile.
- Current database: 1.66 GB. `shared_buffers` is 640 MB and `effective_cache_size` 1.5 GB, which
  suggests the Small tier with about 2 GB of RAM. I inferred that and could not confirm the tier.
- Projected vector storage: **10k users about 0.4 GB, 100k about 4 GB, 1M about 41 GB**. If the catalog
  grows towards the 70k rows in `films`, every vector grows with it.
- At 1M users, with 300k DAU making about 3 ratings a day and an incremental rescore after each, that
  is about 60 GB of WAL a day from this one table.

**Bites at:** about 200k-1M users. Below that, the fix is a bigger compute tier.

**Fix**, in order of payoff:
1. Store only scores at or above a floor, or the top-K (for example 3,000), as two sorted parallel
   arrays. Unscored films are already "score on first show".
2. Split the vector into fixed blocks of about 1k ordinals, so a rescore rewrites only the blocks that
   changed.
3. Move to a Medium or Large tier before 100k users.
4. Leave `get_film_score_map` callers on the 2-minute in-memory map, as now.

**Effort:** L.

---

## Other findings (lower priority, or checked and fine)

**Database**
- **Connections are fine.** All app traffic goes through PostgREST (27 idle `authenticator`
  connections) and nothing connects directly from Vercel. Watch the PostgREST pool, not
  `max_connections`. The GitHub job also goes through PostgREST.
- **RLS cost is not a factor.** Only `film_cast` has a public policy. Everything else is deny-all,
  reached only by the service role. The one hot policy, on `realtime.messages`, calls
  `private.can_hear_topic(( SELECT realtime.topic()))`, which uses `(select auth.uid())`.
- **Sequential scans:** the biggest `seq_tup_read` numbers are `films` (122M tuples, 4,987 scans),
  `score_catalog` (8.3M) and `clusters` (5,639 scans of a small table). Note that `n_live_tup` is stale
  (it shows 3,370 for `films`, which really has 70,341 rows). Run `ANALYZE` (not done; that would be a
  write).
- **Paging through `films` with OFFSET:** `lib/popularity.ts:38` reads the whole catalog with
  `.range()` (OFFSET), 506 ms a page, 350 calls. The plan is a `films_pkey` index scan plus a filter
  that detoasts `raw_tmdb`. It is bounded by the catalog and runs daily. Replace it with one SQL
  `percentile_disc` over a stored `tmdb_vote_count` column.
- **`nearest_films`** (pgvector HNSW, 114 MB index): 302 ms mean, max 3.6 s. It is cached in
  `film_neighbours`. Watch it if more surfaces call it live.
- **`watch_providers_in`:** 1.1 s mean (27 calls). It is cached in memory per instance in
  `app/api/watch-services/route.ts`.
- **Advisor:** 35 unused indexes and 22 backup tables with no primary key. Dropping them saves disk and
  write overhead. Also 2 unindexed foreign keys (`group_messages.reply_to`, `theater_messages.reply_to`),
  harmless at today's size.
- **No function loops per row in a hot path,** except `film_scores_for` (one pass per profile in the
  `p_profile_ids` list, 3.1 ms mean) and the two covered above.

**API routes**
- **Friend fan-out is bounded.** `lib/whos-watching.ts:29` sets `MAX_WITH = 3`. `computeTasteMatches`
  reads full profiles and libraries per friend (`result_json` up to 145 KB raw, `library_json` up to
  118 KB) and is cached for 10 minutes. That is acceptable.
- **`.in()` lists** are chunked at 300 in most label and film readers (`lib/taste/dna-labels.ts`,
  `outlook.ts`, `copy-refresh.ts`, `report.ts`). Several are not chunked: `lib/taste/forming-leans.ts:64`
  (`.in("slug", rated…)`, the whole rated list), `lib/taste/dna-more.ts:89` and `lib/film-labels.ts:99`.
  A library of 2,000+ films would make a PostgREST URL of more than 40 KB. Chunk these too.
- **Payload sizes:** `/api/whos-watching` accepts up to 3,000 slugs. Profiles and libraries are tens to
  hundreds of KB. I did not measure response sizes.
- **In-memory caches:** 50 module-level `Map`s. Most have TTLs or a size check. Unbounded ones are
  `lib/director-photos.ts:14` (`mem`, one entry per director looked up), `lib/taste/film-scores.ts:23`
  (`spreadCache`, keyed per user with an expiry but never evicted) and `app/api/watch-services`. On
  Fluid Compute, an instance lives long, so these grow slowly. Cap them with a small LRU.
- **Function durations:** 45 routes have `maxDuration = 300`, almost all of them crons, ops tools or
  profile builders. The OG image routes are Node `ImageResponse` renders. `app/u/[id]/card/route.tsx`
  is `force-dynamic` with no cache header I could find. I could not check whether Next caches the
  dynamic `opengraph-image` routes for `/u/[id]`, `/t/[id]` and `/film/[slug]`. If link-preview bots
  fetch them uncached, every share costs a full render. Set `revalidate` on them explicitly.
- **Keep-warm:** `/api/cron/keep-warm` warms 3 routes every 5 minutes, about 26k invocations a month,
  and each one forces a `film_labels` load whenever it lands on a new instance (risk 4).

**Realtime, polling and the inbox**
- Realtime is used only for broadcast nudges with empty payloads, sent over REST
  (`lib/realtime-broadcast.ts`). **Every nudge is sent twice** (a private and a public copy) until
  public access is turned off. That doubles Realtime message usage.
- Signed-in iOS clients open an `activity:<id>` socket for as long as they run
  (`MontageApp.swift:405-425`), with a 300 s poll fallback if it drops. Peak concurrent Realtime
  connections are therefore about the number of users with the app open. My understanding is that Pro
  includes about 500 concurrent connections, with more billed in blocks; check the current Supabase
  pricing.
- Web polling cadences: the Activity bell every 60 s (`app/_components/Activity.tsx:225`), the update
  check every 5 minutes (`UpdateNotice.tsx:10`), a group thread every 30 s when realtime is live and
  every 10 s when not (`app/g/[id]/GroupThread.tsx:165`), the room chat every 30 s, and room votes every
  4 s only without realtime. All of them pause while the tab is hidden. Apart from the room roster
  poll (risk 9), these are reasonable.
- The iOS shell calls `chats.refresh()` (`/api/dm`) **on every tab change**
  (`MontageApp.swift:253`). That is cheap, but it adds up; debounce it to once every 30 s.

**iPhone client**
- **Requests when Picks opens** (`Features/Picks/PicksModel.swift:44-80, 236-262`): about 9 to 12 on
  cold launch. They are `weekly-pick`, `browse` (×2-3), `taste-mixes` (×1-2, plus a revalidate),
  `new-releases`, `pick-why`, `LastNight.resolve` (about 3-4: `user-library`, `browse`, `match-csv`,
  `tonight/shown`) and `how-we-did`/`rate-seen`. `load()` returns early when cards are already loaded,
  so there is **no refetch storm on appear**. Pull-to-refresh is explicit.
- **Image caching:** posters load through `AsyncImage` on `URLSession.shared`. I found no custom
  `URLCache` setup in the repo (no `URLCache`, `memoryCapacity` or `diskCapacity`), so it runs on the
  system default, which is small. Scrolling Browse and Profile grids will re-download posters. Set
  `URLCache.shared = URLCache(memoryCapacity: 64 MB, diskCapacity: 512 MB)` at launch, or use an image
  pipeline (Nuke).
- **Image sizes:** sizes are picked deliberately (`w185`/`w342`/`w500` rewrites in `PicksScreen.swift`,
  `RatingSheet.swift` and `TasteDeckModel.swift`). Posters come straight from `image.tmdb.org`, so they
  cost Montage no bandwidth.

**Third parties**
- **TMDB:** 21 modules import `lib/tmdb.ts`. It has an 8 s timeout, one retry with jitter, and results
  are stored in the catalog. Traffic grows with catalog enrichment and search fallbacks more than with
  users. My understanding is that TMDB's soft limit is around 40-50 requests a second per IP; Vercel
  egress IPs are shared across instances. Also, **TMDB's free API terms are for non-commercial use.** If
  Montage monetizes, it needs a commercial agreement. That is a business blocker, not a technical one.
- **JustWatch:** watch-provider data comes through TMDB (`lib/watch-providers.ts`, `lib/film-watch.ts`),
  so there is no separate rate limit, but JustWatch attribution is required.
- **Email (Resend):** batched, 100 per call (`lib/email.ts:41-61`). The weekly digest goes to every
  published profile, about 4.3 emails per user per month.
- **Push (APNs):** direct HTTP/2 with a cached JWT (`lib/apns.ts`), no paid relay. That scales fine.
  Make sure fan-out (group or room events) is batched per HTTP/2 session.

---

## Quick wins (each is an S effort and can be done now)

1. **Raise or restructure the Claude cap** (risk 2): set `DAILY_CLAUDE_CALLS` high, add a dollar
   budget and a per-user allowance, and alert at 80%.
2. **Serve `film_labels` as one CDN blob** (risk 4). This alone removes about 65% of current database
   time.
3. **Make `refresh_crowd_film_means` incremental, or move it into the nightly job** (risk 3), before the
   score-vector count reaches about 1k.
4. **Firewall rule plus a smaller sitemap for the person and film-variant pages** (risk 1). Vercel
   Firewall rate limiting is configuration, not code.
5. **Gate the 4 s room roster poll on `!rtLive`**, on iOS and web (risk 9).
6. **Verify JWTs locally** (`getClaims` or JWKS) and switch Auth connections to percentage-based
   (risk 7).
7. **Chunk the remaining unbounded `.in("slug", …)` reads** (`forming-leans.ts:64`, `dna-more.ts:89`,
   `film-labels.ts:99`).
8. **Configure a larger `URLCache` on iOS** at launch.
9. **Stop sending both the public and private realtime copies** once "Allow public access" is off.
10. **Housekeeping:** drop the 22 backup tables and the unused legacy tables
    (`user_film_score_legacy`, `profiles`, `profile_films`, `processing_jobs`) once their readers are
    confirmed gone, review the 35 unused indexes, and run `ANALYZE` (the stats are stale).

---

## What to monitor

| Signal | Where | Alert when |
|---|---|---|
| Statement time by query | `pg_stat_statements` (top 20 by `total_exec_time`), weekly snapshot | any single query is more than 20% of total |
| DB CPU, RAM, cache hit (today 99.87% heap, 99.23% index) | Supabase dashboard / `pg_statio_*` | cache hit below 99%, CPU above 70% sustained |
| Supabase 521/5xx at the edge | `query_logs` on `edge_logs` | any burst |
| Vercel timeouts and 5xx by route | `get_runtime_errors` | more than 100 a day on any route |
| Claude calls and $ a day vs cap | `usage_counters` kinds `claude`, `claude:*:in/out`, `claude-user:*` | 80% of the cap; any user above $1 a day |
| Nightly job: due vs rescored, deferred count | GitHub Actions run summary | deferred > 0 two nights running |
| `lane-affinity` cron: `refresh_crowd_film_means` errors | errlog / Vercel logs | any |
| Cron hop count reaching `MAX_HOPS` (pregen, digest, enrich) | cron JSON response (`continued`, `skipped`) | `skipped > 0` at hop 12 |
| `usage_counters` rows and WAL | `pg_stat_user_tables` | more than 1M rows |
| `user_score_vec` total size | `pg_total_relation_size` | more than 50% of RAM |
| Realtime concurrent connections and messages | Supabase usage page | 80% of plan |
| Auth `/auth/v1/user` latency | edge logs | p95 above 200 ms |
| Vercel Active CPU, invocations, data transfer | Vercel usage | month-to-date above budget |

---

## Rough cost per 1k MAU per month

**Assumptions** (all estimates; today's data is too small to calibrate them)
- 30% DAU/MAU (300 DAU). Each DAU makes about 75 API requests a day, so about 675k requests a month.
- Average function wall time 0.6 s at 1 GB, with about 120 ms of Active CPU.
- 10% of MAU host one 2 h movie night a month with 5 phones. At today's 4 s polling that adds about 900k
  polls.
- 25% of MAU are new each month (about 40 Claude calls each to onboard). Each MAU gets about 10 "seen-why"
  reads a month on Sonnet 5.5 (measured: about 3,460 input and 82 output tokens per call), plus weekly
  pregen on Haiku 5.5.
- Model prices are from `lib/claude-models.mjs` and the Anthropic price list: Haiku 5.5 $0.10/$0.50 per
  MTok, Sonnet 5.5 $2/$10.
- Vercel and Supabase unit prices are list prices as I understand them. I did not read the billing
  pages; check them there.

| Line | Estimate per 1k MAU | Notes |
|---|---|---|
| **LLM (Anthropic)** | **$60-200** | Seen-why on Sonnet 5.5 is about $0.008 a call, roughly $0.08 per MAU. Onboarding copy is about $0.01-0.02 per new user. Pregen and blurbs on Haiku 5.5 are under $0.01 per MAU. Moving seen-why to Haiku 5.5 (rule 564 chose Sonnet; the owner's call) would cut this line by about 70-80%. Catalog labelling on Sonnet does not grow with users. |
| **Vercel** | **$5-15** | Invocations about $0.4, Active CPU about $3, memory about $1-2, plus room polling about $3-5 at today's cadence. Excludes the $20/seat Pro fee and the **crawler load, which today is far more than the user load**. |
| **Database (Supabase)** | **$3-10** | Storage about 0.3 GB per 1k users (vectors, profiles, ratings, exposures), under $0.10. The real cost is compute steps (Small, then Medium, then Large), spread across users. Excludes the $25/month Pro base. |
| **TMDB** | **$0 API** | Free tier. It is the licence (non-commercial) that matters, not the price. |
| GitHub Actions (nightly) | $0-10 | About 45 s per due user. Free minutes cover about 1k users. At 100k users it is about $900/month at today's per-user speed, unless risk 5 is fixed. |
| Email (Resend) | about $1-3 | About 4.3k digest emails per 1k MAU. |
| Push (APNs) | $0 | |
| **Total** | **about $70-240** | **The LLM is 80-90% of the variable cost.** |

At 100k MAU that is about $7k-24k a month, mostly Anthropic. At 1M it is about $70k-240k, plus the
database tier and storage jump in risk 10.

---

## What I could not measure (honest limits)

- **Real user behaviour.** There are 1 to 4 DAU, and the owner's development use is most of the Claude
  tokens (one hash accounts for 1.5M of about 1.6M attributed input tokens in 7 days). Every per-user
  rate above is extrapolated from that sample.
- **Bot vs human split.** Vercel runtime errors do not show user agents. I inferred "crawlers" from
  13,671 distinct callers against 1 to 4 DAU.
- **Vercel invocation counts and spend.** I did not open billing. The log counts by path cover only
  requests that logged something.
- **The Supabase compute tier.** I inferred it from `max_connections = 90` and `shared_buffers = 640 MB`.
- **Nightly per-user time** comes from one run (16 users, about 12 minutes including catalog restore).
- **Pregen and digest time per user.** I did not time them, so the 5-20k range in risk 6 is wide.
- **Whether Next caches the dynamic OG routes,** and the real response payload sizes.
- **iOS request counts** come from reading the code, not from a network trace on a device.
- **TMDB's current rate limit and the Realtime plan quotas** are from my understanding of the published
  limits, not from this account's dashboards.
- **No load test was run**, as instructed. The "bites at" numbers are arithmetic on measured per-unit
  costs, not observed breaking points.
