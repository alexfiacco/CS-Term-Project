# Montage cleanup audit, v1 (read-only)

Audited 2026-11-05 against `origin/main` at `5cac7aba` (a fresh worktree; nothing in the app repo was changed, deleted or pushed). Database read with SELECTs only (project `uktamekqqsiijugpaxit`); no DDL and no DML was run.

Tools: knip 5 (installed in a scratch folder, run with an explicit Next.js entry list), hand greps over app/, lib/, ios/, scripts/, .github/, vercel.json, package.json, next.config.mjs and `scripts/check-invariants.ts`, git history (`git log -S`) for API paths older iPhone builds used, and `pg_stat_*` / `pg_class` / `ai_cache` queries. Periphery isn't available on Linux, so the Swift results are an approximation (see section 2). `next build` compiled but stopped at prerender because it needs `NEXT_PUBLIC_SUPABASE_URL`. I didn't fake the env, so page sizes come from the compiled `.next/static` output, not from the build table.

---

## One-page summary (plain English)

**Is the code clean? Mostly yes. The live app has very little dead code. The clutter is around it.**

- **Dead app code is rare.** knip, checked by hand, found **6 unused source files (665 lines)** and **about 45 functions or constants nothing calls (~315 lines)** in 140k lines of web code. Every npm dependency is used. Of 215 API routes, only **3 have no caller today**, and one of those (`/api/setup-status`) was called by the iPhone app until 2026-11-02, so it stays until older builds are gone. Swift is similar: about 7 small helpers nothing uses (~40 lines) and no unused image assets.
- **Most of the "unnecessary stuff" is one-off tooling and leftovers.** **151 of the 210 scripts (~12.5k lines)** are backfills, taxonomy builds, evals and scratch files that already ran. Nothing in CI, cron or package.json uses them. Add `spike/`, `prototype/`, `analysis/`, a root `lat-tmp.mjs`, a stray `ef.png` and two committed `.pyc` files. None of it ships to users (`.vercelignore` already drops scripts/ and spike/), so it costs reading time, not speed.
- **The one real performance item is CSS.** `app/globals.css` is 15.3k lines and compiles to **one 958 KB stylesheet (166 KB gzipped)** that every page loads. About **1,300 of its 5,300 class names (~4.5k lines, roughly 30%)** appear nowhere in app/ or lib/. Removing them could save **about 50 KB gzipped on every first page load**. This needs careful review: 171 of those classes are pinned by invariant checks, and some class names are built from strings.
- **The database has a clear, big win.** `ai_cache` (243 MB) holds **about 80k rows (~90 MB) under old key versions the code no longer reads**. Most of it is `public-similar:v1` to `v7` (85 MB; the code reads `v8`). Separately, `user_film_score_legacy` (39 MB, 197k rows) is read by nothing; only account deletion still clears it. There are **23 backup tables (~16 MB)**, mostly 2026-09-27 to 2026-11-04. Four legacy v1-pipeline tables are empty (`profiles`, `profile_films`, `processing_jobs`, `film_match_queries`). Together that is **roughly 130 MB of a ~1.7 GB database**.
- **The rulebook is the biggest maintenance cost.** 956 rule entries (numbered to 1134), 1,128 checks in one 11.5k-line file. **94% of checks match exact source text with regexes**, including pixel values and exact JSX, not behaviour. A refactor that keeps behaviour still fails them. Some checks still pin files that are now dead (`BrowseMix.tsx`, `lib/pipeline.ts`, `lib/cache.ts`), so those files can't be removed without editing a rule. Under CLAUDE.md that needs the owner. The check suite runs in 14 s, so speed is fine. The problem is that it is brittle.
- **Feature switches:** 4 Browse switches plus `WATCHED_WITH_ON` and `FRIENDS_RATING` have been on since 2026-11-04. Blend v2 has been on since 2026-11-05. Three features are switched off (Lately since 2026-09-29, Year in review and Film goal since 2026-11-04). None should go yet: wait about 2 weeks on the "on" switches, and the owner must decide on Lately. The server can't tell which iPhone build is calling (there is no build header), so code kept for older builds can't be retired safely until a build header is added. That is the most useful small change this audit recommends.

**What I'd do first** (all low risk, one commit each): delete the root junk, archive the one-off scripts to `scripts/archive/`, and remove the ~20 truly dead UI helpers. Then the owner signs off on the DB backup and cleanup SQL, starting with the old `public-similar` cache rows (85 MB). Everything else is in the plan at the end.

**What I did not verify:** no iOS compile (the iOS build check is currently blocked). There is no Periphery, so Swift findings are grep-based. Index stats cover about 1 day (reset 2026-11-04). I didn't check which env flags are actually set in Vercel, because that would mean reading env values. Bundle numbers are from compiled output, not from a full build.

### Bucket totals

| Bucket | Items | Size | Risk |
|---|---|---|---|
| SAFE TO DELETE | 13 | ~25 files, ~0.9k lines, 50 KB png | Very low; batch S-4 needs the iOS build check working |
| ARCHIVE | 9 | ~200 files, ~28k lines; DB ~105 MB (stale cache + backup tables), after a backup | Low; nothing runs them; DB items need owner SQL |
| KEEP / NEEDS OWNER DECISION | 17 | ~6k lines of code (mostly the unused CSS) plus the rules restructure; DB ~42 MB | Medium: rules, scores, user data, old builds, auth |

---

## SAFE TO DELETE (high confidence, no reference anywhere)

"No reference" means I grepped app/, lib/, ios/, scripts/ (including `check-invariants.ts`), .github/workflows, vercel.json, package.json, next.config.mjs and middleware.ts, checked for string-built paths and dynamic imports, and checked git history for old iPhone callers. Nothing here touches data, scores, privacy or auth.

| # | What | Size | Evidence | Risk |
|---|---|---|---|---|
| S1 | `lat-tmp.mjs` (repo root) | 4 lines | A one-off DB latency probe that reads `.env.local`; nothing references it. | None |
| S2 | `ef.png` (repo root) | 50 KB | Not referenced by any file. | None |
| S3 | `scripts/__pycache__/classify-tail.cpython-312.pyc`, `spike/__pycache__/character_tags.cpython-312.pyc` | 2 binaries | Python bytecode committed by mistake. Also add `__pycache__/` to `.gitignore`. | None |
| S4 | `lib/taste-test/blend.ts` (`dnaRankPhrase`) | 10 lines | knip: unused file. 0 imports, 0 mentions in docs or checks. | None |
| S5 | Dead share-card helpers in `lib/share-card.ts`: `cardNameSize`, `cardFormingShape`, `FORMING_TITLE`, `formingLine`, `cardShapeStyle` | ~26 lines | Only the declaration matches across the repo (word-boundary grep). Not in checks. | Very low |
| S6 | Dead UI helpers: `sentenceCase` (lib/taste/theme-labels.ts, copy casing), `sinceLine` (lib/watched-with-shared.ts), `roomVerdictWords` (lib/night-rating.ts), `lovedDay` (lib/why-loved.ts), `matchProgress` (lib/match-link.ts), `clawBreath` (lib/soft-claw.ts), `RECUT_CARD_SIZE` (lib/recut-card.tsx), `exitToVia` (lib/return-to.ts), `moodSummary` (MoodQuestions.tsx), `RateSeenLink` (RateSeenDeck.tsx), `DOOR_KINDS`, `WHY_KINDS`, `isHumorKind`, `friendNeeds`, `recentlyWatched`, `previewCircleWatchAlerts`, `sendPush` (push.ts; `sendPushToProfile` is the live one) | ~55 lines | Same grep: declaration only. I hand-verified 12 of them (see the false-positive sample below). | Very low |
| S7 | Dead types: `LibrarySnapshot` (lib/library-client.ts), `ProfileCopy` (lib/public-profile.ts) | 5 lines | Declaration only. | None |
| S8 | `nonMovieSlugs` (lib/media-type.ts) | 15 lines | Only docs/TV_PLAN.md mentions it (as a plan). | Very low |
| S9 | `/api/follow/counts` route | 11 lines | No caller in app/, lib/, ios/ or android/ today, and **no client has ever called it** (`git log -S"follow/counts" -- ios app lib` finds nothing). docs/app/API.md already says "no caller; counts come with /api/profile-meta". Remove its two API.md entries in the same commit. | Low |
| S10 | Swift: `RateDeckModel.answeredCard`, `LibFilterModel.popOf`, `FilmGoal.sheetLine`, `WatchedWhen.sinceLine`, `LiveDot` (MovieNightViews.swift), `NotBuiltYet` (MontageApp.swift, private) | ~40 lines | Each identifier appears exactly once in ios/ and not in any check. `popOf` is mentioned only in a script's comment. **Can't be verified until the iOS build check works again.** | Low |
| S11 | `docs/match-model-rebalance.patch` | 143 lines | A git patch left in docs/; only marketing/brand/positioning.md mentions the filename. Or archive it (A6). | None |
| S12 | Stale doc lines: SCREENS-ACCOUNT.md lines 1518 and 3166 say the Setup card calls `/api/setup-status` (it hasn't since 2026-11-02, commit 82e74473) | 2 lines | Doc fix only. | None |
| S13 | `browse-mix:` entry in the cleanup cron's `RETIRE` list (app/api/cron/cleanup/route.ts) | 1 line | Only if K2 removes `/api/browse-mix`; otherwise keep. | None |

**False-positive rate (TS):** I hand-checked 15 knip findings: 6 unused files plus 9 sampled dead exports (`circleNewLoves`, `sendPush`, `nonMovieSlugs`, `contrastDna`, `isGuestNow`, `appleRevocationConfigured`, `countLoggedWatches`, `laneTags`, `exitToVia`, plus `moodSummary`, `RateSeenLink` and `initProfileGraphForUser` as extras). **All 15 were really unreferenced (0% false positives)**. However, 4 of them are pinned by invariant checks or sit in scoring or auth files, so they moved to KEEP. Two more knip hits (`Constants`, `TablesUpdate` in `lib/database.types.ts`) are generated code: false positives for cleanup, keep. knip's other **983 "unused exports" are just an unneeded `export` keyword** on code that its own file uses. Removing the keyword saves nothing; skip them.

**False-positive rate (Swift):** the naive "identifier appears once" scan found 19 items. **12 were false positives** (63%): protocol or delegate methods (`textViewDidChange`, `presentationAnchor`, `downloadDidFinish`, `messageComposeViewController`, `suggestedEntities`, `explicitAlignment`, `textView*`) and `@main` structs (`MatchClip`, `MontageWidgets`). The 7 left are S10 (6) plus `togetherLine`, which a check pins (see K8). Assets: all 64 entries in Assets.xcassets are used. Lucide icons are loaded through `Image("lucide.\(name)")`, and every name appears as a string. All 159 Swift files are inside an XcodeGen `sources:` path.

---

## ARCHIVE (move out of the main paths; keep in git)

| # | What | Size | Evidence | Risk |
|---|---|---|---|---|
| A1 | **One-off scripts → `scripts/archive/`** (data backfills, taxonomy and cluster builds, evals, scratch `_*.mjs` files) | **140 files, ~12.4k lines** | No reference from .github/workflows, package.json, vercel.json, the cleanup cron or any keep-script's imports. No archived script is pinned by `check-invariants.ts`. Full list in the appendix. | Very low; they don't deploy (`.vercelignore` has `scripts/*`) |
| A2 | `scripts/*.sql` and `scripts/sql/*.sql` → `scripts/archive/sql/` | 11 files, 147 lines | DDL that was already applied (the tables exist). Code comments cite these paths, so update those comments or leave a README pointer. | Very low |
| A3 | `spike/` (Python model experiments, 22 files, 8.1k lines) | 468 KB | Referenced only by two persist-* scripts that go to the archive with them. | Very low |
| A4 | `prototype/` (5 HTML files), `analysis/taste-clustering/` (5 files) | 1.2k lines, ~960 KB | No references. | None |
| A5 | `docs/launch/` (13 files, 2.4k lines, the 2026-10-14 launch pack), `docs/AUDIT_*.md`, `docs/LEGACY_NANOGENRE_AUDIT.md`, `docs/clusters-250.txt` → `docs/archive/` | ~4.3k lines | Point-in-time audits. Several cite routes that no longer exist (`app/api/match`, `/enrich`, `/profile`, `/scrape`, `/movie-night`). | None; .md commits skip the Vercel build |
| A6 | Superseded and withdrawn rule text: rules 200, 229, 236, 307, 458 (first), 709, 983, 1010 (marked superseded), 1018, 1021, 1043 (removed or withdrawn, kept "for history") → `docs/INVARIANTS-history.md` | ~11 rules, ~150 lines | Owner rule: rules change only when the owner asks, so this is a **proposal**, and their checks move or retire with them (see section 5). | Low |
| A7 | **DB: stale `ai_cache` versions** (keys whose version the code no longer reads) | **~80k rows, ~90 MB** of 243 MB | Code reads `public-similar:v8` only. v1 to v7 hold 58,147 rows (85.4 MB). The cleanup cron excludes `public-similar` on purpose ("bounded by the catalog"), so old versions never expire. Further stale versions: `filmography:v1` (16k rows), `seen-why` v1-v42 (838 rows, 0.6 MB), `weekly-pick-shared-pools:v1` (0.7 MB), `seasonal-lane:v1`, `similar-desc` v1-v3, `insights` v1-v30, `dna-notes` v2-v16, `summary` and `tension`/`hidden`/`visitor`/`whyloved`/`pick-desc` old versions. Versions the code still reads as fallbacks (`insights:v31`, `summary:v22`/`v24`, `fit:v1`, `dna-notes:v1`) are **kept**. | Medium-low: cache, never read; generated text costs money only if regenerated, and these versions aren't read |
| A8 | **DB: backup tables** in `archive` (20 tables), `backups` (3), and public `film_clusters_backup_20261104` and `film_clusters_backfill_20261104` | ~16 MB total; largest `archive.backup_20261028_new_release_embeddings` (7.6 MB, 922 rows) and `archive.backup_20260928_mislinked_films` (2.6 MB, 136 rows) | No code references any of them. `archive.library_slug_fix_backup_20261001` is commented "to drop: audit 2026-10-01" and has 0 rows. **Exceptions that hold user data, kept for an owner yes:** `archive.rating_predictions_backup_20261027` (1,921 rows), `archive.rating_reasons_backup_20261028` (1), `archive.backup_20260928_lb_ratings` (0). | Low; table list and rows in the SQL draft |
| A9 | Move the two public 2026-11-04 cluster backups into `archive` (`ALTER TABLE … SET SCHEMA archive`) | 1.5 MB | Keeps the public schema clean before dropping them later. | Very low |

---

## KEEP / NEEDS OWNER DECISION

| # | What | Size | Why it isn't safe | What removing it takes |
|---|---|---|---|---|
| K1 | **Legacy v1 pipeline:** `lib/pipeline.ts` (277), `lib/cache.ts` (128), `lib/taste/engine.ts` (117), plus empty tables `profiles`, `profile_films`, `processing_jobs`, `film_match_queries` (0 rows each) | 522 lines; 4 empty tables | knip shows all three files unused. But **checks pin them**: rule 78 (check-invariants.ts:349-350) and rule 115 (line 724) regex-test `lib/cache.ts`, and rule 192 (line 1882) tests `lib/pipeline.ts`. They guard dead files. `events.profile_id` has a foreign key to `profiles`, and `delete-account` still clears these tables. Scoring and account area. | Owner OKs retiring those check lines. Then one commit deletes the 3 files, the check lines and the delete-account entries. A later SQL batch drops the FK `events_profile_id_fkey` and the 4 tables. |
| K2 | `app/_components/BrowseMix.tsx` (90) + `/api/browse-mix` (53) | 143 lines | Orphaned **today** by rule 1098 (landing v6, commit b4c3a0a4), but rule 137's check (lines 1054-1057) still asserts the file's exact combo list, and INVARIANTS rule 221 describes it. Another session may still be working on it. | Owner confirms that the landing's Browse tile is gone for good. Then update rules 221 and 137 and their checks, and delete both files plus S13. |
| K3 | `/api/setup-status` | 22 lines | No caller today, but the iPhone app called it until 2026-11-02 (commit 82e74473). **TestFlight builds from before that still call it.** | Keep until those builds are retired (needs K16). |
| K4 | `/api/ops/*` routes with no app caller (formula-preview, formula-rescore, summary-preview, summary-rewrite-preview, taste-model-dna-compat/report/sample/watch, …) | ~500 lines | All of them are dispatched by `.github/workflows/ops.yml` or `scripts/ops-call.mjs`. They are owner tools, not dead. | Keep. Retire each one only when its ops job is retired. |
| K5 | `user_film_score_legacy` | 39 MB, 197,568 rows, 16 MB of it an unused PK index | Read by nothing (the `user_film_score` view reads `score_catalog` + `user_score_vec`). Only delete-account clears it. **It is per-user score data**, so owner yes required. | Back up (Supabase backup or pg_dump), drop it, and remove it from delete-account in the same batch. |
| K6 | **Lately** (`LATELY_ON = false` since 2026-09-29) | ~720 lines web (LatelyCard 233, lib/taste/lately.ts 321, lately-data 116, api 39) | The owner said it "will be revised later". taste_snapshots are still written for it. 5 invariant checks reference the flag. | Owner decides: keep, or archive the UI and keep the snapshot writer. |
| K7 | Year in review and Film goal (`YEAR_REVIEW_ON`, `FILM_GOAL_ON = false` since 2026-11-04; web + iOS YearInReview.swift 212, FilmGoal.swift 364) | ~1.6k lines | Off for a redesign the owner is mocking. Owner preview still works. | Keep. |
| K8 | Dead functions in **scoring, data, auth or privacy** files: `calibrateFromSample`, `scoreWithCalibration` (match-model.mjs), `namesSynopsis`, `LovedAnchor` (match.ts), `initProfileGraphForUser`, `countLoggedWatches`, `topLaneFor`, `letterboxdHandlesByIds`, `TASTE_COLS`, `laneTags`, `contrastDna`, `leaningKind`, `appleRevocationConfigured`, `isGuestNow`, `circleNewLoves` (90 lines, friend recs), `lib/taste/graph-score.ts` (43, a dead file), Swift `togetherLine` (pinned by a check) | ~270 lines | Truly unreferenced, but per the owner's guidance anything in scores, data, auth or privacy stays out of the safe bucket. `circleNewLoves`, `formatLetterboxdAvg` and `peopleLine` appear in checks only as **must-not-call** regexes, so deleting them keeps the checks green. | One commit with owner OK, running tsc, the invariants and the ds-log check (`[ds-log: n/a dead code]`). |
| K9 | **Unused CSS in `app/globals.css`** | ~1,321 classes, ~1,900 rules, **~4.5k of 15.3k lines**; compiled CSS 958 KB / 166 KB gzipped on every page; estimated saving ~50 KB gzipped | Class names that appear nowhere in app/ or lib/ (template-built prefixes such as `foo-${x}` are filtered out). Spot check: 7 of 8 sampled were truly unused. **171 are named in invariant checks**, and rule 415 and others pin globals.css 250 times. Classes built by string concatenation are the false-positive risk. | Do it per component area (account, activity, browse, …), one commit each, then a visual pass on web. Owner OK for each pinned class. |
| K10 | **On-switches** shipped 2026-11-04 and 05: `BROWSE_WITH_CHIP`, `BROWSE_WATCH_ACTIONS`, `FRIENDS_RATING`, `BROWSE_LIST_VIEW` (lib/browse-flags.ts), `WATCHED_WITH_ON`, `blendV2On()` (env `BLEND_V2`, on by default since 2026-11-05) | ~60 conditionals over ~25 files; 3-6 checks each | They are the owner's one-push kill switches and are 1-2 days old. **The iPhone reads `/api/browse/flags`**, so even after inlining, that endpoint must keep answering `true` for builds in the wild. Blend v2's off path is scoring code. | After about 2 weeks with no rollback: inline the constants, keep `/api/browse/flags` returning a fixed `true`, update the checks. For Blend v2, remove the v1 path plus a DATA-SCIENCE-LOG entry. |
| K11 | Env kill switches with a default: `MN_SHARE_CARD`, `MN_HOW_WAS_IT` (on unless "off"), `RECUT_ENABLED` (on unless "0"), `REALTIME_PUBLIC_NUDGES`, `MATCH_POSTHOC` (off unless "on"), `TASTE_GRAPH_MATCH` (off unless "on", in match-csv), `APPLE_LINKING_ON`, `NEXT_PUBLIC_APPLE_SIGN_IN`, `NEXT_PUBLIC_GOOGLE_INPAGE` | small | I didn't read Vercel env values. If `TASTE_GRAPH_MATCH` and `MATCH_POSTHOC` are unset in production, their "on" paths are dead code in scoring. The auth ones stay. | The owner checks the Vercel env **names** (no values needed) and says which are set. Then remove the unused branches, one per commit. |
| K12 | TEMP instrumentation: `TONIGHT_TIMING` (lib/movie-night.ts:1681), `MATCH_TIMING` (match-csv:62) | ~30 lines | Marked "TEMP" in its own comments. Harmless when off. | Remove when the owner is done profiling. |
| K13 | Eval knobs `CROWD_LOVES`, `ARCH_DISLIKE_PULL` (graph-archetype.ts) | ~10 lines | Used by `scripts/quiz-personas.ts` (CI workflow quiz-personas.yml). | Keep. |
| K14 | Old-build compatibility in routes: `/api/browse` (`lane`, `hideSeen` and single-language params "older clients send"), `/api/search` (POST without `part`: older iPhone builds and the Siri intent), `/api/public-film` (`crowd`), `/api/friend-feed` (`together=1`), `/api/probes` | ~40 lines | The Siri intent and old builds call these, and the server **can't tell build numbers apart** (no build header is sent; only `CURRENT_PROJECT_VERSION: 21` in project.yml). | Do K16 first, then retire each path once logs show no caller below the build that stopped sending it. |
| K15 | `letterboxd-export/` (root: diary.csv, ratings.csv, watched.csv, likes; 3,100 rows of a personal Letterboxd export) | 228 KB | Unreferenced (the `/go/letterboxd-export` route is unrelated). **It is someone's own data** (repo is private). | Owner decides. Removing it from HEAD doesn't remove it from git history. |
| K16 | **(Recommended addition, not a removal)** Send `X-Montage-Build: <CFBundleVersion>` from the iPhone APIClient and log it with errors and route hits | +10 lines web and iOS | This is what makes K3, K14 and the K10 flag endpoint retirable with evidence instead of guesses. | One small web and iOS parity change, with no UI. |
| K17 | Tables that look unused but are live: `identity_backup_v45` (read and written by lib/taste/summary-brief.ts), `film_labels_formula_v1` (read by /api/ops/formula-rescore), `crowd_film_acc`, `crowd_film_pass`, `lane_affinity_marks`, `film_vec` (used only by SQL functions such as `refresh_crowd_film_means_step`, `refresh_lane_affinity`, `nearest_films`), `user_taste_fit` (7 rows) and `user_graph_calibration` (18 rows, written by scripts) | — | No app TS references them, but DB functions or ops routes use them. | Keep. `user_taste_fit` and `user_graph_calibration` are candidates later, once their scripts are archived (scoring: owner). |

---

## 1. Dead TS/JS code (detail)

- **knip 5** with entries for middleware, next.config, scripts, and every App Router convention file (page, layout, route, error, not-found, opengraph-image, icon, apple-icon, manifest, robots, sitemap). Results:
  - **Unused files (6, 665 lines):** `lib/cache.ts`, `lib/pipeline.ts`, `lib/taste/engine.ts`, `lib/taste/graph-score.ts`, `lib/taste-test/blend.ts`, `app/_components/BrowseMix.tsx`. A second run without scripts/ as entries gives the same 6, so no lib/ file is kept alive only by one-off scripts.
  - **Unused exports:** 1,028 flagged (660 values + 368 types). **45 are referenced nowhere** (~315 lines). The other 983 are only an unneeded `export` keyword.
  - **Dependencies:** all 12 runtime deps and 6 dev deps are used. "Unlisted": `postcss` (check-invariants.ts:2730, comes with Next) and `postgres` (three old `scripts/migrate-*.mjs`, which go to the archive). `scripts/lane-fill-candidates.mjs` imports an absolute Mac path (`/Users/alexfiacco/montage/scripts/_env.mjs`), so it only runs on the owner's laptop.
  - **Duplicate exports** (the same value under two names): `FULL_ARCHETYPE_AT`/`FILM_DNA_SHOW_AT`/`GROUP_ROLE_MIN_RATED`/`MATCH_SHOW_AT` (lib/taste/maturity.ts), `ALL_ROWS`/`BROWSE_ROWS`/`PAGE_ROWS` (lib/filters.ts), `ROOM_NAME_MAX`/`ROOM_NAME_SUGGEST_MAX`. These are intentional aliases; leave them.
- **API routes:** 215 under app/api plus 9 card and image routes. 28 are crons in vercel.json. Excluding crons and rewrites (`/.well-known/apple-app-site-association` → `/api/apple-app-site-association`, `/sitemap.xml` → `/api/sitemap-index`, `assetlinks`), **24 routes have no web or iOS caller**. 19 of those are ops or admin routes run from GitHub workflows or `ops-call.mjs` (K4). That leaves `/api/follow/counts` (S9), `/api/browse-mix` (K2) and `/api/setup-status` (K3).

## 2. Dead Swift code (detail)

There is no Periphery, so I ran an identifier-count scan over 159 Swift files (57.8k lines). Declarations (struct, class, enum, func, typealias) whose name appears exactly once in ios/, minus overrides, @objc and SwiftUI conventions. 19 hits, 12 false positives (protocol methods, @main), 7 real (S10 plus `togetherLine`). Its web twin `lib/watched-with-shared.ts sinceLine` is also dead, which suggests that feature's "since" line was dropped on both sides. Every Swift file is inside a `sources:` path in project.yml (Sources, Resources, Widgets, Clip; the Clip and Widgets reuse Theme.swift). Assets: 64 sets, all used.

## 3. Scripts (all 210 classified)

| Class | Files | Lines | How decided |
|---|---|---|---|
| **Keep** (CI workflows, package.json, vercel ignoreCommand, build, the gates and their import chain; README, `_env.mjs`, `deploy.sh`, `build-wordmark.py` + its font) | 54 | 19.7k | Named in `.github/workflows/*.yml` (22 workflows), package.json scripts or vercel.json, or imported by one of those (checked transitively) |
| **One-off data jobs, done** (backfill-, apply-, migrate-, persist-, classify-, embed-, fill-, mark-, …) | 62 | 5.4k | Name plus no reference; the tables they fill exist and are populated |
| **One-off taxonomy and cluster build** (assign-*, cluster-graph.py, draft/finalize/install-taxonomy, reembed-*, recluster-*, name-clusters, super-clusters.py, …) | 36 | 2.7k | The 2026-09/10 lane taxonomy is installed (`clusters` has 343 rows) |
| **One-off evals and diagnostics** (eval-*, calibrate-*, audit-*, check-recut-schema, …) not in a workflow | 28 | 3.7k | Not in any workflow; results are in DATA-SCIENCE-LOG |
| **Scratch** (`_dnacmp.ts`, `_label-*.mjs`, `_realpicks.ts`, … dated 2026-10-30/31) | 14 | 0.6k | Leading underscore, ad hoc |
| **Applied SQL** | 11 | 0.1k | DDL already applied |
| **Unclear (ask)** | 5 | 0.3k | `lane-backlog.mts`, `lane-fill-apply.mts`, `lane-fill-candidates.mjs`, `lane-fill-judge.mts` (2026-11-03, cited in DATA-SCIENCE-LOG; may be rerun), `new-release-themes.ts` (the ops route of the same name points at it) |

The full per-file list is in the appendix. Archiving isn't deleting: `git mv scripts/X scripts/archive/X` keeps history. Recommend a one-line `scripts/archive/README.md` saying "ran once, kept for the record, not maintained".

## 4. Feature switches and old-build compatibility

Covered in K6, K7 and K10 to K14 and K16. Summary of what removing each takes:

| Switch | State | Since | Remove when | Work |
|---|---|---|---|---|
| `BROWSE_WITH_CHIP`, `BROWSE_WATCH_ACTIONS`, `FRIENDS_RATING`, `BROWSE_LIST_VIEW` | on | 2026-11-04 | ~2026-11-18, no rollback | Inline in ~13 files; `/api/browse/flags` keeps answering true for old iPhone builds; update 16 checks |
| `WATCHED_WITH_ON` | on | 2026-11-04 | same | 25 uses in 5 files; `/api/watched-with` keeps `on: true` |
| `blendV2On()` / `BLEND_V2` | on (env opt-out) | 2026-11-05 | after 2 weeks, owner | Remove the v1 baseline path in lib/compatibility.ts; a ds-log entry; 4 checks |
| `MN_SHARE_CARD_ON`, `MN_HOW_WAS_IT_ON` | on (env opt-out) | 2026-11-04 | when stable | 4 uses each |
| `LATELY_ON` | **off** | 2026-09-29 | owner | ~720 lines; keep the snapshot writer |
| `YEAR_REVIEW_ON`, `FILM_GOAL_ON` | **off** | 2026-11-04 | no: redesign pending | — |
| `TASTE_GRAPH_MATCH`, `MATCH_POSTHOC` | off unless "on" | ? | owner confirms Vercel env | Remove the unused branch (scoring) |
| `TONIGHT_TIMING`, `MATCH_TIMING` | off | "TEMP" | when profiling is done | ~30 lines |

## 5. Rules (docs/INVARIANTS.md + scripts/check-invariants.ts)

**Counts**
- 5,881-line doc; **956 rule entries**, numbered 1 to 1134. **179 numbers are unused** (655-669, 681, 689, 693-699, 710-714, 720-729, …: gaps from parallel sessions). **One duplicate number: 458** (the superseded "marquee and tickets" vote rule and a live "no caps tab rows" rule share it, and the 5 `check("458", …)` calls mix the two).
- **1,128 `check()` calls over 918 ids**; 17 rules at 33 or above have no check. Runtime 13.6 s locally, so speed isn't the problem.
- **94% of checks (1,059 of 1,128) are regexes over source text**: 9,334 `.test(` calls and 4,067 `src(...)` reads over **893 distinct files**. The most-pinned files are `app/globals.css` (250), `Result.tsx` (148), `Discover.tsx` (88), `TheaterRoom.tsx` (62), `lib/movie-night.ts` (58). **359 checks pin numeric literals** (px, pt, frame sizes).
- Checks by area (estimated from the files each one reads): web UI 441, lib (non-scoring) 208, iOS 163, taste and scoring 107, API 86, pure-function 59, CSS 51, scripts and DB 13.

**Superseded or amended**
- 8 rules carry a "superseded" note (200, 229, 236, 307, 458, 709, 983, 1010). 3 are "SUPERSEDED, REMOVED" or "Withdrawn" but kept as history (1018, 1021, 1043). Their checks still run: rule 200 has 5 checks, rule 458 has 5, and rules 1018 and 1021 have a check asserting that a deleted file stays deleted.
- 33 rules are amended, extended or superseded by later ones (for example 112 by 615 and 616; 145 by 617; 609 by 815; 1029 by 1048; 229, 307, 983 and 1010 by 1109). The longest rules run 40-72 lines (248, 114, 225, 244, 130, 145, 116, 226), and the most cross-referenced are 202 (21 refs), 415, 598, 142 and 674.

**Checks that pin implementation, not behaviour (examples)**
- Rule 611 (check-invariants.ts:6807): requires the literal `translateBy(x: 32, y: 44.7)` and `var open: CGFloat` in the Swift launch animation. Moving the fan by half a point to the same visual result fails the check.
- Rule 458 (line 5012): requires the exact JSX `markOpened(m); track("picks_tab_opened", { tab: tabKind(m.id) }); }}>{tabCase(m.label)}</button>`. Renaming a variable fails it.
- Rule 137 (lines 1054-1057): requires six exact film entries in BrowseMix.tsx, a file nothing imports any more. **The check guards dead code.** The same goes for rule 78 and rule 115 on `lib/cache.ts` and rule 192 on `lib/pipeline.ts`.
- 250 regexes over globals.css pin selectors and pixel values rather than "buttons share a height", which is what the owner rule actually says.

**Suggested split** (no behaviour change, one file per area, the same `check()` helper):
```
scripts/invariants/
  index.ts          // runs all, prints, exits 1 on failure (what npm run check:invariants calls)
  lib.ts            // check(), src(), cached reads, shared regex helpers
  profile-identity.ts  // rules 1-60, owner profile / archetype / publish
  scoring.ts        // match %, Blend, picks, taste model (107 checks, the pure-function ones first)
  api-security.ts   // routes, rate limits, RLS, delete-account (86)
  web-ui/<section>.ts  // one per INVARIANTS "##" section: picks, browse, film page, social, movie night, onboarding, share cards (441)
  ios.ts            // Swift source checks (163), runnable alone when only ios/ changed
  css-tokens.ts     // replace ~250 globals.css pins with a token and height check (rule 415's intent)
  history.ts        // checks for superseded rules, until the owner retires them
```
Then, as separate owner decisions: (a) retire the checks for superseded rules, (b) rewrite pixel pins as a design-token check (one check covering "every button height is a token"), (c) prefer calling exported pure functions (the 59 checks that already do are the robust ones), (d) give the duplicate 458 a new number.

## 6. Comments and docs

- **Comment share** (lines that are only comments): app/ 18% (12.9k of 69.9k), **lib/ 24% (17.1k of 71.5k)**, ios/ 12% (7.0k of 57.8k), scripts/ 15%. 3,512 comment lines quote the owner or a date, and **5,021 cite a rule number**, so a lot of INVARIANTS lives in code comments too.
- **Longest comment blocks:** lib/activity-feed.ts:15 (68 lines), scripts/eval-cluster-affinity.mjs:1 (58), lib/circle-watch.ts:13 (50), lib/taste-test/probes.ts:1 (37), lib/analytics.ts:4 (32), lib/claude.ts:31 (31). 31 blocks are 25 lines or longer. They're useful, but most repeat their rule; a pointer (`// rule 393`) would do.
- **Stale docs (examples):** `docs/launch/03-architecture-review.md`, `docs/AUDIT_IDENTITY.md`, `docs/AUDIT_DISCOVER.md` and `docs/LEGACY_NANOGENRE_AUDIT.md` cite removed routes (`app/api/match`, `/enrich`, `/profile`, `/scrape`). `docs/AUDIT_SOCIAL.md` cites `app/api/movie-night/route.ts`. `docs/COLLAB_FILTERING_PLAN.md` cites `scripts/build-cf-neighbors.mjs` (gone). `docs/launch/09-onboarding-redesign.md` cites `FeatureGuide.tsx` (gone). `docs/ENGINE.md` and `docs/AUDIT_IDENTITY.md` describe `lib/cache.ts` and `lib/taste/engine.ts` as the live engine (K1). `docs/app/API.md` still documents `/api/follow/counts` and `lib/ticket-card.tsx` (gone). `docs/app/SCREENS-ACCOUNT.md` says the Setup card calls `/api/setup-status` (S12). docs/app/*, the owner's living spec, is otherwise current (0 missing paths across SCREENS-*.md and IOS.md).

## 7. Database (read-only findings)

**Sizes:** the largest tables are films 517 MB, film_vec 253 MB, film_cast 251 MB, **ai_cache 243 MB**, film_watch 141 MB, film_crew 88 MB, film_neighbours 41 MB, **user_film_score_legacy 39 MB**.

**Backup and archive tables** (exact `count(*)`; the stats show no reads or writes since the 2026-11-04 reset):

| Table | Size | Rows | Notes |
|---|---|---|---|
| archive.backup_20261028_new_release_embeddings | 7.6 MB | 922 | embeddings before a re-embed |
| archive.backup_20260928_mislinked_films | 2.6 MB | 136 | |
| public.film_clusters_backup_20261104 | 1.3 MB | 20,603 | "Full copy before the 2026-11-04 lane backfill" |
| backups.films_cerebral_20261014 | 1.0 MB | 32 | |
| backups.films_nonlinear_20261014 / _20261014b | 0.6 / 0.4 MB | 22 / 24 | |
| archive.backup_20260927_dup_films | 0.5 MB | 599 | |
| archive.rating_predictions_backup_20261027 | 256 KB | 1,921 | **user data** |
| public.film_clusters_backfill_20261104 | 144 KB | 113 | record of the backfill |
| archive.library_slug_fix_backup_20261001 | 72 KB | 0 | commented "to drop" |
| archive.films_backup_year_slug_20260929, backup_films_title_fix_20260929, backup_20261002_film_dna, backup_20260927_adult_* (5), backup_20261009_wrong_lane_ties, backup_20261009_lane_renames, backup_20261002_lane_blurbs, cluster_text_backup, film_clusters_backup | 16-72 KB each | 1-369 | |
| archive.rating_reasons_backup_20261028, archive.backup_20260928_lb_ratings | 16-24 KB | 1 / 0 | **user data** |

**Unused indexes** (`idx_scan = 0` since the 2026-11-04 reset, about 1 day, so treat these as candidates only): `user_film_score_pkey` on the legacy table (16 MB, goes with K5); `films_pool_slug_idx` (2.2 MB); `films_thematic_tags_gin` (768 KB); `films_moods_gin` (744 KB); everything else is 8-72 KB (mostly primary keys of near-empty tables). **Recheck on about 2026-12-05 before dropping any films index.** Total possible saving outside K5 is under 4 MB.

**Tables no code references:** see K1 (4 empty v1 tables), K5 (legacy scores), A8 (backups). Tables that look unreferenced from TS but are used by SQL functions or ops are listed in K17.

**ai_cache:** 134k rows across 96 key families. Biggest families: `public-similar` 95 MB (67.7k rows), `person` 26 MB, `tag-pages` 19 MB (34 rows; actors v2 is 18.8 MB in 33 rows), `kw-pool` 10 MB, `feel-pool` 10 MB, `browse` 4.3 MB. All current versions are read. **Never read: the old versions** (A7, ~90 MB). Six tiny families have no reader in code at all: `compare-chips`, `group-why`, `person-bio`, `recent-reads`, `sharecard`, and `new-release-feed` (written under a computed prefix; it is read). The real dead ones total under 5 KB.

## 8. Rough wins

| Area | Removable | User impact |
|---|---|---|
| Root junk, pyc, dead files and helpers (S1-S13) | ~25 files, ~0.9k lines, 50 KB | none (cleaner tree) |
| Scripts, spike, prototype, analysis (A1-A4) | ~185 files, ~22k lines out of the main paths | none; faster search and onboarding |
| Docs archive (A5-A6) | ~4.5k lines | none |
| Unused CSS (K9) | ~4.5k lines; ~30% of a 958 KB / 166 KB-gzip stylesheet | **about 50 KB less CSS per first page load** (estimate, not measured) |
| DB stale cache + backups + legacy (A7, A8, K5, K1) | ~145 MB (~90 + ~16 + 39) | smaller backups, faster `ai_cache` scans and vacuum |
| Rules restructure | no line loss; fewer false failures | faster safe refactors |

Build: `next build` compiled cleanly in this sandbox and failed only at prerender for lack of `NEXT_PUBLIC_SUPABASE_URL`. Client JS is 3.6 MB raw over 109 chunks; the largest is 840 KB (250 KB gzipped). Removing dead TS won't move bundle size measurably, because unused files aren't bundled. CSS is the only measurable bundle win. `tsc --noEmit` and `check:invariants` both pass on this commit (invariants 13.6 s).

---

## Proposed execution plan (small, one area per batch, one commit per batch)

**Every code batch runs these gates before pushing:** `npx tsc --noEmit`, `npm run check:invariants`, `npm run check-security`, `node scripts/check-ds-log.mjs origin/main` (commit message `[ds-log: n/a dead code]` where it applies), and **an iOS compile once the iOS build check is working again**. Pull with `--rebase` first. Batch pushes (Vercel deploy budget): docs-only and ios-only batches skip the build. Each batch is one commit, so `git revert <sha>` undoes it. **Scripts are archived (`git mv` to scripts/archive/), never deleted.** **DB batches: run the backup section of `cleanup-db-v1.sql` first, check the counts, then the owner uncomments one drop group at a time.**

| Order | Batch | Contents | Owner needed? | Verifiable now? |
|---|---|---|---|---|
| 1 | B1 root junk | S1, S2, S3 (+ `.gitignore` `__pycache__/`) | no | yes |
| 2 | B2 docs | S11, S12, A5 (docs/archive/), stale API.md rows | no | yes (docs skip the build) |
| 3 | B3 scripts archive (a) | `_*` scratch + applied SQL (A1 scratch, A2) | no | yes |
| 4 | B4 scripts archive (b) | taxonomy and cluster build + spike/ + prototype/ + analysis/ (A1, A3, A4) | no | yes |
| 5 | B5 scripts archive (c) | one-off data jobs + evals not in CI (A1); ask about the 5 "unclear" first | yes (5 unclear) | yes |
| 6 | B6 web dead helpers | S4-S8 (lib/ and app/_components only, no scoring/auth) | no | yes |
| 7 | B7 dead route | S9 `/api/follow/counts` + API.md | no | yes |
| 8 | B8 Swift dead helpers | S10 | no | **no: waits for the iOS build check** |
| 9 | B9 DB backups | run the backup section of cleanup-db-v1.sql (creates `archive.*` copies; uses the Supabase daily backup for the big cache rows) | **yes (SQL)** | yes |
| 10 | B10 DB drops: backup tables | uncomment group D1 (A8 without the user-data tables, A9) | **yes (SQL)** | yes |
| 11 | B11 DB: stale ai_cache | uncomment group D2 (A7), in chunks | **yes (SQL)** | yes |
| 12 | B12 build header | K16: `X-Montage-Build` on iOS + logging on web | yes (parity task) | partly: **iOS part waits for the iOS build check** |
| 13 | B13 v1 pipeline | K1 code + checks 78/115/192 lines + delete-account entries | **yes (rule edits)** | yes for web |
| 14 | B14 DB: v1 tables and legacy scores | D3 (K1 tables, FK) and D4 (K5), after B13 is live | **yes (SQL, user data)** | yes |
| 15 | B15 BrowseMix | K2 + rule 137/221 edits + S13 | **yes (rule edits)** | yes |
| 16 | B16 scoring/auth dead code | K8, with a ds-log `n/a` note | **yes** | web yes; `togetherLine` **waits for iOS** |
| 17 | B17+ CSS, per area | K9, one component area per commit + web visual check | yes for the 171 pinned classes | yes (web) |
| 18 | after 2026-11-18 | K10 flags inlined (Browse, Watched with, MN), keeping `/api/browse/flags` answering | yes | web yes; **iOS parity waits for iOS** |
| 19 | when builds are retired | K3 `/api/setup-status`, K14 compat paths | yes, with B12 data | needs B12 logs |
| 20 | separate | rules restructure (section 5): first the mechanical file split (no rule change), then the owner-approved retirements | yes for retirements | yes |

**Can't be verified until the iOS build check works again:** B8, the iOS half of B12, `togetherLine` in B16, and any iOS side of B18. They're also the only batches that touch ios/. Everything else is web-, docs- or DB-only.

---

## Appendix: scripts classification (every file)

**KEEP** (54 files, 19,687 lines): README.md, _env.mjs, deploy.sh, fonts/Fraunces-SemiBold.woff (used by build-wordmark.py), add-shelves.mjs, backfill-films.ts, backfill-match-scores.mjs, backfill-take-watches.ts, backfill-taste-history.ts, backtest-blend-v2.ts, bake-landing-samples.ts, build-tag-maps.mjs, build-wordmark.py, calibrate-axes.ts, check-design-tokens.mjs, check-ds-log.mjs, check-invariants.ts, check-probes.ts, check-security.mjs, compat-code-sig.mjs, drop-wrong-lane-ties.ts, dump-schema.mjs, eval-crowd.mjs, eval-label-lean.mjs, eval-live.ts, eval-match-quality.mjs, eval-pitch.ts, exposure-blend-trial.ts, extract-traits.mjs, filter-check.ts, gen-fanmark-static.mjs, label-backlog.mts, learn-status.mjs, match-consistency.ts, match-spread.ts, name-clusters-from-synopses.mjs, ops-call.mjs, park-taxonomy.mjs, pick-check/personas.json, pick-check/run.ts, quiz-archetype-trial.ts, quiz-live.ts, quiz-personas.ts, recalibrate-film-dna.ts, refresh-from-library.ts, repick-signatures.ts, rescore-new-audience.ts, run-profile.ts, smoke.mjs, test-csv-import.ts, test-recut-rank.ts, test-resolution.ts, vercel-ignore.sh, warm-discover.mjs. (Some of these, such as backfill-films.ts and calibrate-axes.ts, are kept only because a package.json script or workflow names them. If the owner drops those npm scripts, they can be archived too.)

**ARCHIVE: one-off data jobs, done** (62 files, 5445 lines): __pycache__/classify-tail.cpython-312.pyc (273), apply-confident-reassign.mjs (59), apply-judge-picks.mjs (78), apply-passenger-moves.mjs (30), apply-taxonomy-edits.mjs (79), backfill-broken-films.mjs (96), backfill-cast-credits.ts (39), backfill-directors.mjs (27), backfill-film-cast.mjs (66), backfill-film-countries.mjs (193), backfill-film-moods.mjs (126), backfill-film-neighbours.ts (54), backfill-keywords.mjs (119), backfill-media-type.mjs (60), backfill-original-language.ts (192), backfill-overviews.mjs (34), backfill-runtimes.mjs (130), backfill-taste-fit.mjs (93), backfill-tmdb-cast.mjs (81), backfill-tone-axis.ts (40), backfill-user-affinity.mjs (107), bake-archetype-posters.mjs (12), build-entity-list.mjs (42), build-newsreader.py (63), classify-films.mjs (237), classify-keywords.mjs (107), classify-media-type.mjs (126), classify-tail.py (423), dedupe-slug-variants.mjs (135), embed-films.mjs (78), extract-overview.mjs (59), fetch-certifications.mjs (81), fill-filmographies.ts (101), fill-new-shelves.mjs (109), fix-definition-contrasts.mjs (46), fix-merged-library-doubles.ts (57), fix-ratings.ts (84), ingest-tmdb.mjs (121), label-traits.ts (48), load-clusters.mjs (60), load-film-labels-pass2.mjs (32), load-film-labels.mjs (26), load-super.mjs (28), mark-duplicate-films.mjs (116), merge-audit-duplicates.mjs (123), migrate-activity-feed.mjs (87), migrate-film-details.mjs (80), migrate-user-feedback.mjs (110), persist-archetype-centroids.mjs (94), persist-film-tone.mjs (73), persist-graph.mjs (83), purge-score-caches.mjs (45), refresh-profiles.ts (52), rename-cluster.mjs (25), restore-signatures.mjs (62), restore-watchlists.ts (72), seed-cache.mjs (75), split-large-clusters.mjs (106), split-shelf.mjs (66), write-cluster-moods.mjs (8), write-runtimes.mjs (61), write-theme-vocab.mjs (56)

**ARCHIVE: scratch** (14 files, 564 lines): _dnacmp.ts (33), _dnalabels.mjs (48), _known-slugs.mjs (14), _label-batch.mjs (37), _label-direct.mjs (33), _label-lib.mjs (30), _label-lib2.mjs (29), _label-pass2.mjs (70), _label-pilot.mjs (76), _outlook-users.mjs (35), _pass2-slugs.mjs (9), _realpicks.ts (63), _relabel-web.ts (72), _user-slugs.mjs (15)

**ARCHIVE: applied SQL** (11 files, 147 lines): activity-feed.sql (14), sql/film_cast.sql (19), sql/group_watchlist.sql (13), sql/groups_avatar_url.sql (3), sql/public_profiles_ratings_hidden.sql (4), sql/suggestion_dismissals.sql (10), sql/tag-pages-indexes.sql (16), sql/user_blocks_and_reports.sql (26), sql/user_graph_calibration.sql (10), sql/user_match_calibration.sql (22), sql/user_taste_fit.sql (10)

**ARCHIVE: taxonomy and cluster build** (36 files, 2672 lines): assign-cluster-moods.mjs (59), assign-clusters-top3.mjs (113), assign-macros.mjs (58), assign-orphan-films.py (67), cluster-graph.py (114), compute-user-affinity.mjs (65), consistency-pass.py (35), cov-check.ts (17), create-masked-vigilante-cluster.mjs (103), draft-taxonomy.mjs (114), finalize-taxonomy.mjs (40), finish-keyword-backfill.mjs (42), init-profile-graph.ts (3), install-taxonomy.mjs (93), knn-hints.py (42), library-integrity.ts (64), name-clusters.mjs (133), nudge-one.ts (2), partial-test.ts (85), propose-cluster-moods.mjs (37), propose-gap-shelves.mjs (87), reassign-franchise-clusters.mjs (162), recalibrate-identity-numbers.ts (48), recluster-preview.py (63), recluster-reembedded.mjs (123), reembed-nocast.mjs (46), reembed-staging.mjs (40), reembed-stragglers.mjs (65), refetch-credits.ts (205), retry-none-traits.mjs (36), scrape-missing-films.ts (201), second-shelf.mjs (72), super-clusters.py (35), sweep-collab.mjs (93), v3-preview.mjs (66), vary-shelf-names.mjs (44)

**ARCHIVE: evals and diagnostics** (28 files, 3717 lines): audit-clusters.mjs (90), audit-film-identity.ts (77), audit-passengers-local.mjs (112), audit-passengers.mjs (95), audit-top-films.mjs (118), calibrate-compat.ts (47), calibrate-graph-score.mjs (75), calibrate-taste-dna.mjs (101), check-recut-schema.ts (34), eval-cluster-affinity.mjs (551), eval-cold-start.mjs (32), eval-crowd-prior.mjs (231), eval-embedding-text.mjs (144), eval-graph-accuracy.mjs (80), eval-learn-from-predictions.mjs (361), eval-like-model.mjs (244), eval-match-model.mjs (391), export-and-mean.mjs (42), pair-scores-equiv.ts (125), score-cluster-quality.mjs (131), score-mapping-compare.mjs (31), score-title-concentration.mjs (94), test-aicache-prune.ts (38), test-dictation.ts (96), test-profile-patch.ts (96), test-recut-parser.ts (181), test-title-match.ts (58), test-wanted-flush.ts (42)

**UNCLEAR (ask the owner)** (5 files, 305 lines): lane-backlog.mts (208), lane-fill-apply.mts (22), lane-fill-candidates.mjs (24), lane-fill-judge.mts (20), new-release-themes.ts (31)

The `__pycache__/classify-tail.cpython-312.pyc` entry listed under data jobs is S3 (delete, not archive). The six `test-*.ts` self-checks under evals (test-recut-parser, test-dictation, test-aicache-prune, test-profile-patch, test-title-match, test-wanted-flush) are worth wiring into CI as tests instead of archiving. Ask the owner before batch B5.
