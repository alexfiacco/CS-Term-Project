-- 5-fix-wrong-posters.sql  (Montage, Supabase uktamekqqsiijugpaxit)  2026-11-13
-- Wrong posters: a films row showing a same-name film's poster ("Enemy" 2013, Villeneuve, showed
-- the Tamil "Enemy" / Shatru). Code fix: branch b39-posters, rule 1970.
--
-- What the sweep found (SELECT only, 2026-11-13):
--   * poster_url / backdrop_url never drift from raw_tmdb (0 of 11,600 rows with a poster_path differ;
--     backdrops 0; raw id vs tmdb_id 0; imdb_id vs raw imdb_id 0). Every wrong poster is a wrong
--     TMDB match, not a stale image column. So a poster-only UPDATE would leave the wrong film's
--     title, overview, cast and embedding in place: nothing below touches poster_url alone.
--   * 11 rows whose raw_tmdb release year is more than one from films.year.
--   * 1,689 rows marked duplicate_of.
--   * 821 live pairs: one title, years within one, two TMDB ids. 33 of them are a real-looking slug
--     with NO Letterboxd data (no watch count, no nanogenres) beside a film of 1,000+ watches:
--     enemy-2013 (Shatru) beside enemy (Villeneuve, 658k), taxi-driver-1976 (a Turkish film),
--     scream-1996, past-lives-2023, aftersun-2022, about-time-2013, rocky-1976, annihilation-2018 ...
--
-- Why nothing is rewritten blindly: these slugs may be Letterboxd's OWN pages for the obscure film
-- (Letterboxd names the second film of a title "<title>-<year>"; "eternity-2025-1" is Freyne's
-- film, so "eternity-2025" really is another one), or they may be made-up title keys the import
-- stored when it could not resolve a film. Only the page itself says which, and this session had
-- no Letterboxd or TMDB access. Clearing enriched_at does NOT help: the TMDB-details cron re-reads
-- by the stored tmdb_id, so it would fetch the wrong film again.
--
-- The right tool already exists: POST /api/ops/repair-matches?slugs=a,b,... (max 25 a call, from the "Ops" workflow or
-- cron secret or scripts/ops-call.mjs) re-reads each row from its own Letterboxd page and rebuilds
-- it from the page's TMDB link (lib/film-rematch.ts, rematchFilm with fromAddress:false).
--   "fixed"          -> the row was wrong and is now the page's film (poster included).
--   "already right"  -> the page really is that obscure film; the row is correct. Rule 1970's
--                       lookup change stops "Enemy" 2013 resolving to it.
--   "no page"        -> a made-up title key: step 3 below.
--
-- Run order: step 1 (preview), call the ops route with the step-2 slug list, then step 3 only for
-- the slugs it answered "no page".

-- ---------------------------------------------------------------------------------------------
-- STEP 1. PREVIEW (read only)
-- ---------------------------------------------------------------------------------------------

-- 1a. The suspects: an unscraped real-looking slug sharing a title (years within one) with an
--     established film under another TMDB id. Who holds each is in the last columns.
with l as (
  select letterboxd_slug s, tmdb_id, title, original_title, year, original_language lang,
         coalesce(letterboxd_watch_count, 0) wc, coalesce(array_length(nanogenres, 1), 0) ng, directors,
         regexp_replace(regexp_replace(lower(title), '[^a-z0-9]+', ' ', 'g'), '^ *(the|a|an) ', '') k
  from films
  where duplicate_of is null and tmdb_id is not null and coalesce(media_type, 'movie') = 'movie'
)
select b.s as suspect_slug, b.tmdb_id as suspect_tmdb, b.title, b.original_title, b.year, b.lang, b.directors[1] as suspect_director,
       a.s as established_slug, a.tmdb_id as established_tmdb, a.year as established_year, a.wc as established_watches, a.directors[1] as established_director,
       (select count(*) from user_ratings u where u.slug = b.s) as in_app_ratings,
       (select count(*) from user_watchlist w where w.slug = b.s) as in_app_watchlist,
       (select count(*) from public_profiles p where p.library_json::text like '%"' || b.s || '"%') as profiles_holding,
       (select count(*) from score_catalog c where c.slug = b.s) as in_score_catalog
from l a
join l b on a.k = b.k and a.tmdb_id <> b.tmdb_id and abs(a.year - b.year) <= 1 and a.s <> b.s and a.wc > b.wc
where b.wc = 0 and b.ng = 0 and a.wc > 1000 and b.s not like 'tmdb-%'
order by profiles_holding desc, in_app_ratings desc, a.wc desc;

-- 1b. The 11 rows whose TMDB release year is more than one from films.year.
select letterboxd_slug, tmdb_id, title, original_title, year, raw_tmdb->>'release_date' as tmdb_date,
       letterboxd_watch_count, poster_url
from films
where coalesce(media_type, 'movie') = 'movie'
  and substring(raw_tmdb->>'release_date', 1, 4) ~ '^\d{4}$' and year is not null
  and abs(substring(raw_tmdb->>'release_date', 1, 4)::int - year) > 1
order by letterboxd_watch_count desc nulls last;

-- 1c. The Enemy rows.
select letterboxd_slug, tmdb_id, title, original_title, year, letterboxd_watch_count, poster_url, duplicate_of
from films where letterboxd_slug in ('enemy', 'enemy-2013');

-- ---------------------------------------------------------------------------------------------
-- STEP 2. Re-read the suspects from their own Letterboxd pages (not SQL; no guessing):
--   node scripts/ops-call.mjs repair-matches slugs:enemy-2013,taxi-driver-1976,scream-1996,past-lives-2023,aftersun-2022,about-time-2013,rocky-1976,annihilation-2018,eternity-2025,predator-1987,pocahontas-1995,chicago-2002,the-apartment-1960,hell-or-high-water-2016,silence-2016,brooklyn-2015,krampus-2015,flight-2012,9-2009,match-point-2005,the-running-man-1987,the-heat-2013,old-school-2003,selma-2014,blue-jay
--   node scripts/ops-call.mjs repair-matches slugs:life-1999,day-night-2010,play-dirty-2025,loop-2020,identity-2024-2,aftermath-2024,salvation-2025-1,backrooms
--   (the 33 from 1a on 2026-11-13; re-run 1a first and use its list if it has changed)
-- ---------------------------------------------------------------------------------------------

-- ---------------------------------------------------------------------------------------------
-- STEP 3. UPDATE: only the slugs step 2 answered "no page" (a made-up title key, no Letterboxd
-- film behind it). Each is pointed at the established film it was meant to be, so every surface
-- that skips duplicate_of rows drops it and lookups follow it to the right film (and poster).
-- Paste those slugs into the VALUES list; the joins re-check that each still has no Letterboxd
-- data and that its established film is a live, 1,000+ watch row of the same title within a year.
-- ---------------------------------------------------------------------------------------------
begin;

with no_page(slug) as (values
  ('PASTE-NO-PAGE-SLUG-HERE')          -- e.g. ('enemy-2013'), ('taxi-driver-1976') ... only if step 2 said "no page"
),
l as (
  select letterboxd_slug s, tmdb_id, year, coalesce(letterboxd_watch_count, 0) wc,
         coalesce(array_length(nanogenres, 1), 0) ng, duplicate_of,
         regexp_replace(regexp_replace(lower(title), '[^a-z0-9]+', ' ', 'g'), '^ *(the|a|an) ', '') k
  from films where coalesce(media_type, 'movie') = 'movie'
),
target as (
  select distinct on (b.s) b.s as slug, a.s as established
  from no_page n
  join l b on b.s = n.slug and b.duplicate_of is null and b.wc = 0 and b.ng = 0
  join l a on a.k = b.k and a.s <> b.s and a.tmdb_id <> b.tmdb_id and abs(a.year - b.year) <= 1
          and a.duplicate_of is null and a.wc > 1000 and a.s not like 'tmdb-%'
  order by b.s, a.wc desc
)
select * from target;                 -- check this list, then run the UPDATE below in the same transaction

with no_page(slug) as (values
  ('PASTE-NO-PAGE-SLUG-HERE')
),
l as (
  select letterboxd_slug s, tmdb_id, year, coalesce(letterboxd_watch_count, 0) wc,
         coalesce(array_length(nanogenres, 1), 0) ng, duplicate_of,
         regexp_replace(regexp_replace(lower(title), '[^a-z0-9]+', ' ', 'g'), '^ *(the|a|an) ', '') k
  from films where coalesce(media_type, 'movie') = 'movie'
),
target as (
  select distinct on (b.s) b.s as slug, a.s as established
  from no_page n
  join l b on b.s = n.slug and b.duplicate_of is null and b.wc = 0 and b.ng = 0
  join l a on a.k = b.k and a.s <> b.s and a.tmdb_id <> b.tmdb_id and abs(a.year - b.year) <= 1
          and a.duplicate_of is null and a.wc > 1000 and a.s not like 'tmdb-%'
  order by b.s, a.wc desc
)
update films f
set duplicate_of = t.established, updated_at = now()
from target t
where f.letterboxd_slug = t.slug
returning f.letterboxd_slug, f.duplicate_of;

-- commit;   -- after checking the returned rows; otherwise: rollback;
--
-- Note: the rows marked here have a different TMDB id from the row they point at, so
-- merge_duplicate_film (which wants one TMDB id) will not fold them, and the daily identity audit
-- counts them under "marked duplicate_of still unmerged". That is expected; nobody's ratings or
-- lists are rewritten by this file. The 2 profiles whose library_json holds "enemy-2013" (both
-- in the watchlist) keep that slug; reads follow duplicate_of to "enemy".
