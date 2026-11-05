-- perf-indexes-v1.sql
-- Montage performance audit, 2026-11-05 (Supabase project uktamekqqsiijugpaxit).
-- Written for the owner to run by hand in the Supabase SQL editor. Nothing here has been run.
--
-- HOW TO RUN
--   * Every statement is safe to re-run (IF NOT EXISTS / IF EXISTS / ANALYZE / ALTER ... SET).
--   * CREATE/DROP INDEX CONCURRENTLY cannot run inside a transaction block. Run each CONCURRENTLY
--     statement on its own (highlight it and run it alone). Do NOT wrap this file in BEGIN/COMMIT.
--     If a concurrent build fails partway it leaves an INVALID index; drop it with
--     DROP INDEX CONCURRENTLY IF EXISTS <name>; and run the create again.
--   * Nothing here changes data. Nothing locks a table for writes for more than a moment.
--
-- WHAT THE AUDIT FOUND (short version)
--   * The database is not the bottleneck today: 99.8% table / 99.3% index cache hit, 1.7 GB on disk,
--     about 20 PostgREST connections idle out of 90, ~1,900 s of app query time over 44 h.
--   * No unindexed foreign keys and no RLS-per-row auth.*() lints. The advisors only flag unused
--     indexes (small), backup tables without primary keys (harmless), and a few security notes.
--   * The slow first load is mostly app-side: many sequential PostgREST round trips per API route,
--     about 10 API routes per Discover load, and heavy per-instance warm-up (labels, vectors).
--   So this file is small on purpose. The big wins are code changes (see the report).


-- ============================================================================================
-- A. RECOMMENDED (low risk)
-- ============================================================================================

-- A1. Refresh planner statistics on tables autovacuum has never analyzed (stats were reset around
--     2026-11-04; several tables show n_live_tup far below their real size, e.g. film_crew 19k
--     counted vs ~357k estimated). Wrong row counts can push the planner to bad plans.
--     ANALYZE reads a sample only; it takes no write lock. Expected gain: plan safety, not speed today.
analyze public.film_crew;
analyze public.film_cast;
analyze public.film_clusters;
analyze public.film_collection;
analyze public.film_vec;
analyze public.film_neighbours;
analyze public.film_tone;
analyze public.score_catalog;
analyze public.films;

-- A2. Keyset-paged catalogue read (lib/recut-server.ts readCatalog, also the sitemap):
--       films WHERE watch_count >= X AND avg_rating >= Y AND duplicate_of IS NULL
--             AND poster_url IS NOT NULL AND letterboxd_slug > $after
--       ORDER BY letterboxd_slug LIMIT 1000
--     Today each 1,000-row page bitmap-scans ~13k rows and re-sorts them (measured 61 ms, 8.8k
--     buffers per page), so a full read is quadratic in pages. With this partial index the page is
--     an ordered index range scan that stops after 1,000 matches. Expected: ~60 ms -> ~5-10 ms per
--     page on cold instances. Size: ~2-3 MB. Risk: very low (one more index to maintain on films writes).
create index concurrently if not exists films_pool_slug_idx
  on public.films (letterboxd_slug)
  where duplicate_of is null and poster_url is not null;

-- A3. Scale insurance for "Suggested for you" / similar-people (lib/follows.ts similarTo):
--       public_profiles WHERE result_json IS NOT NULL AND username IS NOT NULL AND user_id IS NOT NULL
--       ORDER BY updated_at DESC LIMIT 400
--     With 20 profiles this is a trivial seq scan; at 10k+ profiles it would be a full scan that
--     touches wide TOASTed rows on every cache miss. Tiny index, no gain today, removes a cliff later.
create index concurrently if not exists public_profiles_stranger_pool_idx
  on public.public_profiles (updated_at desc)
  where result_json is not null and username is not null and user_id is not null;

-- A4. Vacuum sooner on the two tables that churn in bulk. film_watch is rewritten by the twice-weekly
--     refresh-watch cron (89k dead rows of 621k now, never auto-vacuumed since the stats reset);
--     ai_cache takes ~9k upserts a day. The default 20% threshold lets ~125k dead rows build up on
--     film_watch before a vacuum. 5% keeps both tables tight. Takes a brief SHARE UPDATE EXCLUSIVE
--     lock (does not block reads or writes). Re-running is harmless.
alter table public.film_watch set (autovacuum_vacuum_scale_factor = 0.05, autovacuum_analyze_scale_factor = 0.05);
alter table public.ai_cache   set (autovacuum_vacuum_scale_factor = 0.05, autovacuum_analyze_scale_factor = 0.05);


-- ============================================================================================
-- B. OPTIONAL CLEANUP (commented out; small gain, run only if you agree)
-- ============================================================================================
-- Redundant indexes: each one is fully covered by the left edge of another index on the same table,
-- so Postgres can use the other one for the same lookups. Gain: slightly cheaper writes, a few hundred
-- kB of memory. Risk: low, but check pg_stat_user_indexes first if you are unsure.
--
-- public_profiles_username_idx (3 scans) duplicates public_profiles_username_uniq (username) where username is not null.
-- drop index concurrently if exists public.public_profiles_username_idx;
--
-- follows_follower_idx (follower_id) is covered by follows_pkey (follower_id, followee_id).
-- drop index concurrently if exists public.follows_follower_idx;
--
-- uca_profile_idx (profile_id) is covered by user_cluster_affinity_pkey (profile_id, cluster_id).
-- drop index concurrently if exists public.uca_profile_idx;
--
-- Never used since the stats reset (advisor "unused_index"). Keep if a planned feature needs them.
-- drop index concurrently if exists public.films_moods_gin;
-- drop index concurrently if exists public.films_thematic_tags_gin;
-- drop index concurrently if exists public.user_cluster_affinity_cluster_id_idx;
-- drop index concurrently if exists public.pair_compat_scores_other_idx;
--
-- Not dropped here on purpose: public.user_film_score_legacy (39 MB, legacy) and the archive./backups.
-- tables. Dropping a table is irreversible; decide that separately.


-- ============================================================================================
-- C. SECURITY ADVISOR ITEM (commented out; read the note)
-- ============================================================================================
-- Advisor WARN "function_search_path_mutable" on public.search_key(text). The function only calls
-- pg_catalog built-ins, so pinning the path does not change its result. CAVEAT: a SQL function with a
-- SET clause can no longer be inlined, and search_key() backs the index films_search_key_trgm, so every
-- films insert/update of title and any query that evaluates it per row gets a little slower. Low value
-- because nothing untrusted can create objects in your schemas today. Run only if you want the lint green.
-- alter function public.search_key(text) set search_path = pg_catalog, pg_temp;
