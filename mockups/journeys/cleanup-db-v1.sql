-- Montage DB cleanup, DRAFT v1 (2026-11-05). Goes with mockups/journeys/cleanup-audit-v1.md.
-- Project: uktamekqqsiijugpaxit. NOTHING HERE HAS BEEN RUN. The owner runs it in pieces.
--
-- How to use:
--   0. Take (or confirm) a Supabase backup first: Dashboard > Database > Backups (daily or PITR),
--      or `pg_dump --table=public.ai_cache --table=public.user_film_score_legacy ...` locally.
--      The two big items (stale ai_cache ~85 MB, user_film_score_legacy ~39 MB) rely on that backup
--      by default. An in-database full copy is offered below, commented out.
--   1. Run SECTION B (backups and manifests). Everything in it is idempotent
--      (IF NOT EXISTS / ON CONFLICT DO NOTHING), so it is safe to re-run.
--   2. Run SECTION C (checks) and compare the counts with the audit.
--   3. Uncomment ONE drop group in SECTION D at a time, run it, check, and go on.
--      Every drop uses IF EXISTS, so re-running is harmless.
--   Before D2: re-check the cache versions the code reads (grep app/ lib/ for "<family>:v"),
--   because other sessions bump versions. Edit archive.cleanup_20261105_cache_keep if they moved.

begin;

-- ============================================================================================
-- SECTION A. Schema for archive copies (already exists; harmless if so)
-- ============================================================================================
create schema if not exists archive;
revoke all on schema archive from anon, authenticated;

-- ============================================================================================
-- SECTION B. Backups and manifests (idempotent)
-- ============================================================================================

-- B1. User-data backup tables stay. Nothing to copy; listed so no one drops them by accident:
--     archive.rating_predictions_backup_20261027 (1,921 rows), archive.rating_reasons_backup_20261028,
--     archive.backup_20260928_lb_ratings. Dropping them needs a separate owner yes.

-- B2/B3. Copies of the public backup tables before they move (20,603 + 113 rows), and of the
--     v1 pipeline tables (0 rows each today; copied anyway in case something was written
--     meanwhile). Guarded: skips a copy that already exists or whose source is gone, so
--     re-running after a drop in SECTION D is harmless.
do $$ declare p record; begin
  for p in select * from (values
      ('public.film_clusters_backup_20261104',  'film_clusters_backup_20261104'),
      ('public.film_clusters_backfill_20261104','film_clusters_backfill_20261104'),
      ('public.profiles',                       'v1_profiles_20261105'),
      ('public.profile_films',                  'v1_profile_films_20261105'),
      ('public.processing_jobs',                'v1_processing_jobs_20261105'),
      ('public.film_match_queries',             'v1_film_match_queries_20261105')) v(src, dst)
  loop
    if to_regclass(p.src) is not null and to_regclass('archive.' || p.dst) is null then
      execute format('create table archive.%I as select * from %s', p.dst, p.src);
    end if;
  end loop; end $$;

-- B4. user_film_score_legacy (197,568 rows, 39 MB, per-user scores, read by nothing).
--     Default: rely on the Supabase backup from step 0. If you want an in-DB copy too
--     (adds ~25 MB until the archive copy is dropped), uncomment:
-- do $$ begin
--   if to_regclass('public.user_film_score_legacy') is not null and to_regclass('archive.user_film_score_legacy_20261105') is null then
--     create table archive.user_film_score_legacy_20261105 as select * from public.user_film_score_legacy;
--   end if; end $$;

-- B5. ai_cache: the versions the code reads (as of origin/main 5cac7aba). Families not listed
--     here are never touched by D2.
create table if not exists archive.cleanup_20261105_cache_keep (fam text, ver text, primary key (fam, ver));
insert into archive.cleanup_20261105_cache_keep (fam, ver) values
  ('public-similar','v8'),('feel-pool','v2'),('kw-pool','v2'),('filmography','v2'),
  ('insights','v31'),('insights','v32'),('seen-why','v43'),('seen-why-unrated','v26'),
  ('summary','v22'),('summary','v24'),('summary','v25'),('hidden','v24'),('tension','v10'),
  ('pick-desc','v9'),('similar-desc','v4'),('whyloved','v12'),('visitor','v6'),
  ('dna-notes','v1'),('dna-notes','v17'),('seasonal-lane','v2'),('blend','v4'),
  ('fit','v1'),('fit','v2'),('weekly-pick-shared-pools','v2'),('release-tags','v3'),
  ('compare-split','v9'),('divergence','v7'),('compare-shared','v5'),('suggest-people','v5'),
  ('taste-mixes','v60'),('taste-mixes','v61'),('weekly-pick-top','v22'),('group-id','v2'),
  ('group-recap','v5'),('rec-reason','v4'),('match-model','v3'),('lately','v3'),
  ('group-read','v4'),('group-story','v3')
on conflict do nothing;

-- B6. A manifest of the stale keys (key + date + size, no values), a record of what D2 removes.
create table if not exists archive.cleanup_20261105_ai_cache_stale (
  key text primary key, fam text, ver text, created_at timestamptz, bytes int);
insert into archive.cleanup_20261105_ai_cache_stale (key, fam, ver, created_at, bytes)
select c.key, split_part(c.key, ':', 1), split_part(c.key, ':', 2), c.created_at, pg_column_size(c.value)
from public.ai_cache c
where split_part(c.key, ':', 2) ~ '^v[0-9]+[a-z]?$'
  and split_part(c.key, ':', 1) in (select fam from archive.cleanup_20261105_cache_keep)
  and (split_part(c.key, ':', 1), split_part(c.key, ':', 2)) not in (select fam, ver from archive.cleanup_20261105_cache_keep)
on conflict (key) do nothing;

--     Full copy of the small stale families (everything except public-similar and filmography,
--     ~4.5 MB), so generated text (summaries, insights, why-lines) can be restored without the
--     backup:
create table if not exists archive.ai_cache_stale_text_20261105 (like public.ai_cache);
insert into archive.ai_cache_stale_text_20261105
  select c.* from public.ai_cache c
  join archive.cleanup_20261105_ai_cache_stale s on s.key = c.key
  where s.fam not in ('public-similar', 'filmography')
    and not exists (select 1 from archive.ai_cache_stale_text_20261105 x where x.key = c.key);
--     public-similar old versions (58k rows, 85 MB) and filmography:v1 (16k rows) are recomputed
--     data with no model cost. Rely on the step-0 backup for them.

-- Lock the archive copies down (service role only), like the existing backups.
do $$ declare t text; begin
  for t in select format('%I.%I', schemaname, tablename) from pg_tables where schemaname = 'archive'
           and tablename like any (array['%20261105%','film_clusters_backup_20261104','film_clusters_backfill_20261104','cleanup_20261105_%'])
  loop execute format('alter table %s enable row level security', t);
       execute format('revoke all on %s from anon, authenticated', t); end loop; end $$;

commit;

-- ============================================================================================
-- SECTION C. Checks (read-only). Compare with the audit before any drop.
-- ============================================================================================
-- select fam, count(*), pg_size_pretty(sum(bytes)::bigint) from archive.cleanup_20261105_ai_cache_stale group by 1 order by sum(bytes) desc;
--   expect roughly: public-similar 58,147 rows / 81 MB; filmography 16,364; seen-why 838; ~80k rows total
-- select count(*) from archive.ai_cache_stale_text_20261105;
-- select (select count(*) from public.film_clusters_backup_20261104) = (select count(*) from archive.film_clusters_backup_20261104) as clusters_copy_ok;  -- before D1 only
-- select count(*) from public.profiles; select count(*) from public.profile_films;      -- expect 0
-- select count(*) from public.processing_jobs; select count(*) from public.film_match_queries; -- expect 0
-- select count(*) from public.user_film_score_legacy;                                   -- expect 197,568

-- ============================================================================================
-- SECTION D. Drops. ALL COMMENTED OUT. The owner uncomments one group at a time.
-- ============================================================================================

-- D1. Backup tables with no code reference and no user data (~14 MB). Copies of the two public
--     ones were made in B2.
-- begin;
-- drop table if exists public.film_clusters_backup_20261104;
-- drop table if exists public.film_clusters_backfill_20261104;
-- drop table if exists archive.library_slug_fix_backup_20261001;   -- 0 rows, commented "to drop"
-- drop table if exists archive.backup_20261028_new_release_embeddings;
-- drop table if exists archive.backup_20260928_mislinked_films;
-- drop table if exists archive.backup_20260927_dup_films;
-- drop table if exists archive.films_backup_year_slug_20260929;
-- drop table if exists archive.backup_films_title_fix_20260929;
-- drop table if exists archive.backup_20261002_film_dna;
-- drop table if exists archive.backup_20260927_adult_films;
-- drop table if exists archive.backup_20260927_adult_film_cast;
-- drop table if exists archive.backup_20260927_adult_film_clusters;
-- drop table if exists archive.backup_20260927_adult_film_tone;
-- drop table if exists archive.backup_20260927_adult_film_collection;
-- drop table if exists archive.backup_20261009_wrong_lane_ties;
-- drop table if exists archive.backup_20261009_lane_renames;
-- drop table if exists archive.backup_20261002_lane_blurbs;
-- drop table if exists archive.cluster_text_backup;
-- drop table if exists archive.film_clusters_backup;
-- drop table if exists backups.films_cerebral_20261014;
-- drop table if exists backups.films_nonlinear_20261014;
-- drop table if exists backups.films_nonlinear_20261014b;
-- -- drop schema if exists backups;   -- only if it is empty afterwards (no CASCADE)
-- commit;

-- D2. Stale ai_cache versions (~80k rows, ~90 MB). Deleted in chunks of 5,000 so no long lock;
--     re-runnable. Afterwards: VACUUM (ANALYZE) public.ai_cache; (outside a transaction).
-- do $$ declare n int; begin
--   loop
--     delete from public.ai_cache c
--     where c.key in (select s.key from archive.cleanup_20261105_ai_cache_stale s
--                     join public.ai_cache a on a.key = s.key limit 5000)
--       -- belt and braces: never a version the code reads
--       and (split_part(c.key, ':', 1), split_part(c.key, ':', 2)) not in (select fam, ver from archive.cleanup_20261105_cache_keep);
--     get diagnostics n = row_count;
--     exit when n = 0;
--     perform pg_sleep(0.2);
--   end loop; end $$;
-- vacuum (analyze) public.ai_cache;

-- D3. Legacy v1 pipeline tables (0 rows). ONLY after batch B13 has shipped (lib/pipeline.ts,
--     lib/cache.ts and lib/taste/engine.ts removed, and delete-account no longer lists these tables).
--     events.profile_id has an FK to profiles; drop that FK first (events rows are kept).
-- begin;
-- alter table if exists public.events drop constraint if exists events_profile_id_fkey;
-- drop table if exists public.profile_films;
-- drop table if exists public.film_match_queries;
-- drop table if exists public.processing_jobs;
-- drop table if exists public.profiles;
-- commit;

-- D4. user_film_score_legacy (39 MB, per-user scores, read by nothing). Needs an explicit owner yes
--     (user data) and batch B14's code change (remove it from app/api/delete-account/route.ts).
--     Back up first (step 0 or B4).
-- drop table if exists public.user_film_score_legacy;

-- D5. Unused films indexes (~3.8 MB). DO NOT run before ~2026-12-05: the stats only cover the
--     period since 2026-11-04. Re-check first:
--     select indexrelname, idx_scan from pg_stat_user_indexes
--      where indexrelname in ('films_pool_slug_idx','films_thematic_tags_gin','films_moods_gin');
-- drop index concurrently if exists public.films_pool_slug_idx;      -- run each alone, outside a transaction
-- drop index concurrently if exists public.films_thematic_tags_gin;
-- drop index concurrently if exists public.films_moods_gin;

-- D6. Later, once the archive copies have been kept for ~30 days with no restore needed:
-- drop table if exists archive.film_clusters_backup_20261104;
-- drop table if exists archive.film_clusters_backfill_20261104;
-- drop table if exists archive.ai_cache_stale_text_20261105;
-- drop table if exists archive.user_film_score_legacy_20261105;
-- (keep archive.cleanup_20261105_ai_cache_stale and _cache_keep: they are the record, ~10 MB)

-- NOT IN THIS DRAFT (owner decision, user data): archive.rating_predictions_backup_20261027,
-- archive.rating_reasons_backup_20261028, archive.backup_20260928_lb_ratings.
-- KEEP (look unused but are live): identity_backup_v45 (lib/taste/summary-brief.ts),
-- film_labels_formula_v1 (/api/ops/formula-rescore), crowd_film_acc, crowd_film_pass,
-- lane_affinity_marks, film_vec (SQL functions), user_taste_fit, user_graph_calibration.
