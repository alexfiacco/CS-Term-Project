-- Montage DB cleanup, STEP 1 (2026-11-05, keep list re-checked 2026-11-06: added fit:v4). Owner-ready. NOT RUN: nothing here has touched the project.
-- Project uktamekqqsiijugpaxit. Replaces the drop groups D1 and D2 of cleanup-db-v1.sql
-- (audit: mockups/journeys/cleanup-audit-v1.md, A7-A9). D3-D6 of the draft are NOT in this file.
--
-- What it does, and what it frees (sizes measured read-only on 2026-11-05):
--   PART 3  drops 21 backup tables that hold catalog data only (no user rows) ......... ~14.3 MB
--   PART 4a deletes public-similar:v1..v7 from ai_cache (58,147 rows; code reads v8) .... ~85 MB
--   PART 4b deletes the other stale ai_cache versions (21,226 rows, 28 families) ........ ~5.4 MB
--   Total ~105 MB. The table drops free disk at once. The ai_cache deletes free space for reuse after
--   PART 5's VACUUM; the file only shrinks on disk with VACUUM FULL (see PART 5).
--
-- Backups, and which kind each item gets:
--   * The 21 backup tables: an IN-DATABASE copy (PART 1), every row as jsonb plus each table's
--     column list, so any one can be rebuilt without a restore. PART 3 refuses to drop a table whose
--     copy count does not match. The ~14 MB comes back when the copy itself is dropped (PART 6, after
--     ~30 days); until then the saving is the cleaner schema, not space.
--   * The ai_cache rows: NO in-database copy. They rely on the Supabase daily backup / PITR
--     (Dashboard > Database > Backups: confirm one exists from today before PART 4). Why: the code
--     reads none of these versions, so restoring them would bring back nothing the app shows;
--     public-similar and filmography are recomputed data with no model cost; and the text families
--     (summary, insights, hidden, tension, visitor, dna-notes, ...) are per-person reads. A copy in
--     `archive` would escape account deletion: public.purge_account_backups() only scans
--     public.*backup* tables (rule 169). PART 1 records a per-version COUNT (no keys, no values).
--
-- How to run: each PART is self-contained and can be run on its own, in order, in the SQL editor.
--   Everything is idempotent (IF [NOT] EXISTS, ON CONFLICT DO NOTHING, guarded loops): re-running
--   any part, before or after the others, is harmless. Run PART 1, look at PART 2, then 3, 4a, 4b, 5.
--
-- Verified read-only on 2026-11-05 (execute_sql SELECTs, and git grep on origin/main 93a67900):
--   * No code in app/, lib/, ios/, supabase/functions or the kept scripts/ reads any of the 21
--     tables. One kept script names one in a comment as its rollback copy (scripts/drop-wrong-lane-ties.ts
--     -> backup_20261009_wrong_lane_ties, a fix done on 2026-10-09; the copy in PART 1 keeps it).
--   * No view or SQL function depends on them (pg_depend / pg_proc checked).
--   * ai_cache versions: the keep list in PART 1 is every version string the code names for these
--     families today, fallbacks included (insights:v31, summary:v22-v25, fit:v1, the taste-mixes
--     ladder v47-v60, dna-notes:v1 kept as in the audit). Families NOT in the keep list are never
--     touched.
--
-- Deliberately NOT touched:
--   identity_backup_v45 (lib/taste/summary-brief.ts reads it), film_labels_formula_v1
--   (/api/ops/formula-rescore reads it); user-data backups archive.rating_predictions_backup_20261027
--   (1,921 rows), archive.rating_reasons_backup_20261028, archive.backup_20260928_lb_ratings; and
--   archive.backup_20261002_film_dna: 13 rows of 13 people's earlier Film DNA (id, username, dna,
--   vec, archetype). The audit counted it as a non-user backup; it is per-person data, so it needs
--   the owner's yes like the other three. Note for the owner: none of these four is cleared by
--   account deletion (purge_account_backups scans public only).
--   ai_cache match-model:* (match-model.mjs builds `match-model:v${POPULATION_VERSION}` and v6/v7
--   are live; the v1 draft would have deleted them), and every family the code builds by template.
--   user_film_score_legacy, the v1 pipeline tables and indexes (draft D3-D5): later batches.
--
-- Before PART 4: other sessions bump cache versions. Re-check with
--   git grep -n -E '"(<family>):v[0-9]+' origin/main -- app lib
-- and add any new version to archive.cleanup_20261105_cache_keep before deleting.


-- ============================================================================================
-- PART 1. Backups and records (one transaction; idempotent; writes only to schema `archive`)
-- ============================================================================================
begin;

create schema if not exists archive;
revoke all on schema archive from public, anon, authenticated;

-- 1a. Row copies of the 21 backup tables (jsonb, one row per source row) and a manifest with each
--     table's columns, so a table can be rebuilt exactly. Restore one table:
--       create table <schema>.<name> (<columns from the manifest>);
--       insert into <schema>.<name> select (jsonb_populate_record(null::<schema>.<name>, r.row)).*
--         from archive.cleanup_20261105_table_rows r where r.src = '<schema>.<name>';
create table if not exists archive.cleanup_20261105_tables (
  src text primary key, columns jsonb not null, rows_copied bigint not null, bytes bigint, copied_at timestamptz not null default now());
create table if not exists archive.cleanup_20261105_table_rows (src text not null, row jsonb not null);
create index if not exists cleanup_20261105_table_rows_src on archive.cleanup_20261105_table_rows (src);

do $$
declare
  t text;
  n bigint;
begin
  foreach t in array array[
    'public.film_clusters_backup_20261104', 'public.film_clusters_backfill_20261104',
    'archive.library_slug_fix_backup_20261001', 'archive.backup_20261028_new_release_embeddings',
    'archive.backup_20260928_mislinked_films', 'archive.backup_20260927_dup_films',
    'archive.films_backup_year_slug_20260929', 'archive.backup_films_title_fix_20260929',
    'archive.backup_20260927_adult_films', 'archive.backup_20260927_adult_film_cast',
    'archive.backup_20260927_adult_film_clusters', 'archive.backup_20260927_adult_film_tone',
    'archive.backup_20260927_adult_film_collection', 'archive.backup_20261009_wrong_lane_ties',
    'archive.backup_20261009_lane_renames', 'archive.backup_20261002_lane_blurbs',
    'archive.cluster_text_backup', 'archive.film_clusters_backup',
    'backups.films_cerebral_20261014', 'backups.films_nonlinear_20261014', 'backups.films_nonlinear_20261014b']
  loop
    -- Skip a table already copied, or one already dropped (a re-run after PART 3).
    continue when to_regclass(t) is null or exists (select 1 from archive.cleanup_20261105_tables m where m.src = t);
    execute format('insert into archive.cleanup_20261105_table_rows (src, row) select %L, to_jsonb(x) from %s x', t, t);
    get diagnostics n = row_count;
    insert into archive.cleanup_20261105_tables (src, columns, rows_copied, bytes)
    select t,
           (select jsonb_agg(jsonb_build_object('name', a.attname, 'type', format_type(a.atttypid, a.atttypmod)) order by a.attnum)
              from pg_attribute a where a.attrelid = t::regclass and a.attnum > 0 and not a.attisdropped),
           n, pg_total_relation_size(t::regclass);
  end loop;
end $$;

-- 1b. The ai_cache keep list: for each family PART 4 may clean, every version the code reads.
create table if not exists archive.cleanup_20261105_cache_keep (fam text, ver text, primary key (fam, ver));
insert into archive.cleanup_20261105_cache_keep (fam, ver) values
  ('public-similar','v8'), ('filmography','v2'), ('feel-pool','v2'),
  ('insights','v1'), ('insights','v31'), ('insights','v32'),
  ('seen-why','v43'), ('seen-why-unrated','v26'),
  ('summary','v22'), ('summary','v23'), ('summary','v24'), ('summary','v25'),
  ('hidden','v24'), ('tension','v10'), ('pick-desc','v9'), ('similar-desc','v4'), ('whyloved','v12'),
  ('visitor','v6'), ('dna-notes','v1'), ('dna-notes','v17'), ('seasonal-lane','v2'), ('blend','v4'),
  ('fit','v1'), ('fit','v2'), ('fit','v4'), ('weekly-pick-shared-pools','v2'), ('release-tags','v3'),
  ('compare-split','v9'), ('divergence','v7'), ('compare-shared','v5'), ('suggest-people','v5'),
  ('taste-mixes','v47'), ('taste-mixes','v48'), ('taste-mixes','v52'), ('taste-mixes','v53'),
  ('taste-mixes','v54'), ('taste-mixes','v55'), ('taste-mixes','v56'), ('taste-mixes','v57'),
  ('taste-mixes','v58'), ('taste-mixes','v59'), ('taste-mixes','v60'), ('taste-mixes','v61'),
  ('weekly-pick-top','v22'), ('group-id','v2'), ('group-recap','v5'), ('rec-reason','v4'),
  ('lately','v3'), ('group-read','v4'), ('group-story','v3')
on conflict do nothing;

-- 1c. A record of what PART 4 removes: counts and bytes per family and version (no keys, no values).
create table if not exists archive.cleanup_20261105_ai_cache_stale_counts (
  fam text, ver text, n bigint, bytes bigint, counted_at timestamptz default now(), primary key (fam, ver));
insert into archive.cleanup_20261105_ai_cache_stale_counts (fam, ver, n, bytes)
select split_part(c.key, ':', 1), split_part(c.key, ':', 2), count(*), sum(pg_column_size(c.*))
from public.ai_cache c
where split_part(c.key, ':', 2) ~ '^v[0-9]+[a-z]?$'
  and split_part(c.key, ':', 1) in (select fam from archive.cleanup_20261105_cache_keep)
  and (split_part(c.key, ':', 1), split_part(c.key, ':', 2)) not in (select fam, ver from archive.cleanup_20261105_cache_keep)
group by 1, 2
on conflict (fam, ver) do nothing;

-- 1d. Lock the new tables down like the existing backups: RLS on with no policies, no grants.
do $$
declare t text;
begin
  foreach t in array array['archive.cleanup_20261105_tables', 'archive.cleanup_20261105_table_rows',
                           'archive.cleanup_20261105_cache_keep', 'archive.cleanup_20261105_ai_cache_stale_counts']
  loop
    execute format('alter table %s enable row level security', t);
    execute format('revoke all on %s from public, anon, authenticated', t);
  end loop;
end $$;

commit;


-- ============================================================================================
-- PART 2. Checks (read-only). Expected values are from 2026-11-05.
-- ============================================================================================
-- Every table copied, with the live count:
--   select m.src, m.rows_copied, (select count(*) from archive.cleanup_20261105_table_rows r where r.src = m.src) as copy_rows
--   from archive.cleanup_20261105_tables m order by m.bytes desc;
--   expect 21 rows; e.g. public.film_clusters_backup_20261104 20,603; backup_20261028_new_release_embeddings 922;
--   backup_20260927_dup_films 599; backup_20261009_wrong_lane_ties 369; library_slug_fix_backup_20261001 0.
-- What PART 4 will remove:
--   select fam, sum(n) as rows, pg_size_pretty(sum(bytes)::bigint) from archive.cleanup_20261105_ai_cache_stale_counts
--   group by 1 order by sum(bytes) desc;
--   expect public-similar 58,147 rows / 85 MB; filmography 16,364 / 1.4 MB; seen-why 838; 79,373 rows / 91 MB in all.


-- ============================================================================================
-- PART 3. Drop the 21 backup tables (one transaction). Refuses any table whose copy is missing or
--         short. Re-runnable: a table already gone is skipped.
-- ============================================================================================
begin;
do $$
declare
  m record;
  live bigint;
begin
  if to_regclass('archive.cleanup_20261105_tables') is null then
    raise exception 'Run PART 1 first: archive.cleanup_20261105_tables does not exist';
  end if;
  if (select count(*) from archive.cleanup_20261105_tables) <> 21 then
    raise exception 'PART 1 copied % of 21 tables; check PART 2 before dropping', (select count(*) from archive.cleanup_20261105_tables);
  end if;
  for m in select src, rows_copied from archive.cleanup_20261105_tables loop
    continue when to_regclass(m.src) is null;
    execute format('select count(*) from %s', m.src) into live;
    if live <> m.rows_copied
       or live <> (select count(*) from archive.cleanup_20261105_table_rows r where r.src = m.src) then
      raise exception '% has % rows but the copy has %: not dropping anything', m.src, live, m.rows_copied;
    end if;
    execute format('drop table %s', m.src);   -- no CASCADE: fails loudly if anything depends on it
  end loop;
  -- The `backups` schema held only these three; drop it when empty (no CASCADE).
  if to_regnamespace('backups') is not null
     and not exists (select 1 from pg_class where relnamespace = 'backups'::regnamespace) then
    drop schema backups;
  end if;
end $$;
commit;


-- ============================================================================================
-- PART 4a. Delete public-similar:v1..v7 (58,147 rows, ~85 MB). The code reads public-similar:v8 only
--          (lib/film-page.ts). Confirm today's Supabase backup first (see the header).
--          Row locks only; readers are never blocked. Re-runnable (0 rows the second time).
-- ============================================================================================
delete from public.ai_cache c
where c.key like 'public-similar:v%'
  and split_part(c.key, ':', 2) ~ '^v[0-9]+[a-z]?$'
  and exists (select 1 from archive.cleanup_20261105_cache_keep k where k.fam = 'public-similar')   -- PART 1 ran
  and ('public-similar', split_part(c.key, ':', 2)) not in (select fam, ver from archive.cleanup_20261105_cache_keep);


-- ============================================================================================
-- PART 4b. Delete the other stale versions (21,226 rows, ~5.4 MB): filmography:v1, seen-why v1-v42,
--          weekly-pick-shared-pools:v1, seasonal-lane:v1, similar-desc v1-v3, insights v2-v30,
--          dna-notes v2-v16, feel-pool:v1, and old pick-desc, visitor, summary, tension, hidden,
--          whyloved, blend, ... versions. Only families in the keep list; never a kept version.
-- ============================================================================================
delete from public.ai_cache c
where split_part(c.key, ':', 2) ~ '^v[0-9]+[a-z]?$'
  and split_part(c.key, ':', 1) <> 'public-similar'
  and split_part(c.key, ':', 1) in (select fam from archive.cleanup_20261105_cache_keep)
  and (split_part(c.key, ':', 1), split_part(c.key, ':', 2)) not in (select fam, ver from archive.cleanup_20261105_cache_keep);


-- ============================================================================================
-- PART 5. Reclaim the space (run on its own, outside a transaction).
-- ============================================================================================
vacuum (analyze) public.ai_cache;
-- Plain VACUUM makes the ~91 MB reusable by new cache rows but does not shrink the file.
-- To give it back to the disk: VACUUM FULL public.ai_cache; rewrites the table (~150 MB left) under
-- an ACCESS EXCLUSIVE lock, so every cache read and write waits until it finishes (likely well under
-- a minute, not measured). Only at a quiet hour, or skip it.


-- ============================================================================================
-- PART 6. LATER (~2026-12-05, once nothing needed restoring): drop the row copies, which is when the
--         ~14 MB of PART 3 actually comes back. Keep the two small record tables.
-- ============================================================================================
-- drop table if exists archive.cleanup_20261105_table_rows;
