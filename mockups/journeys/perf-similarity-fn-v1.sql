-- perf-similarity-fn-v1.sql
-- Montage speed fix 2 (performance audit, 2026-11-05; Supabase project uktamekqqsiijugpaxit).
-- Written for the owner to run by hand in the Supabase SQL editor. Nothing here has been run.
--
-- WHY
--   Reading film vectors by slug list (films.embedding over PostgREST) was 31% of all app database
--   time: 12,038 calls at 50 ms mean, 608 s in pg_stat_statements. Each vector is about 19 KB as
--   JSON, so a 300-film page is about 5.8 MB to serialize and send, only for the app to take one
--   cosine per film from it.
--   The app (rule 1135, lib/taste/embedding-engine.ts) now reads film_vec.emb first (the same
--   numbers: all 28,913 rows equal films.embedding exactly, half the bytes on disk) and keeps an
--   LRU memo. This file adds the function that lets the cosine be worked out IN the database, so
--   only (slug, score) comes back: about 40 bytes a film instead of 19 KB.
--
-- HOW TO RUN
--   * Section A is the one to run. It is safe to re-run (CREATE OR REPLACE, REVOKE/GRANT).
--   * Section B is optional and commented out; read its notes first.
--   * Until A is run the app keeps working: its ready-check sees the function missing, remembers that
--     for ten minutes, and scores from the vectors instead (the same numbers).
--
-- WHAT A ENABLES
--   similarityToSlugs(vec, slugs) in lib/taste/embedding-engine.ts calls it for the vectors not
--   already in the server's memory. Callers today: the film page's public "similar" ranking
--   (lib/film-page.ts getPublicSimilar, ~180 films), Pitch's anchor neighbours (lib/recut-server.ts
--   anchorSims, 300 films) and Movie Night's "like X" title-word guard (lib/movie-night.ts, 200).
--
-- MEASURED (read-only SELECTs, 2026-11-05)
--   * 300 slugs, warm cache: films.embedding as text 65 ms, film_vec.emb as text 36 ms, this
--     function's body 7 ms (31 ms with a cold page and the films fallback for non-movies).
--   * Scores vs the app's own cosine() (float8 over the same arrays), 10 taste centroids x 1,000
--     films: max difference 5.6e-7, mean 1.1e-7, top 20 identical for all 10.


-- ============================================================================================
-- A. RECOMMENDED: score_films_against_vector
-- ============================================================================================
-- Cosine similarity (1 - cosine distance) of q with each slug's stored vector.
--   * film_vec.emb (halfvec) is upcast to vector so q keeps full precision (a taste centroid is
--     not half-quantized; casting q down to halfvec would move scores by ~1e-4).
--   * Slugs film_vec does not hold (TV and other non-movies, ~128 rows) fall back to films.embedding.
--   * A slug with no vector is simply absent from the result, as in the app's own reads.
--   * A zero vector gives NaN distance; reported as 0, as the app's cosine() does.
--   * More than 5,000 slugs returns nothing (the app sends pages of 1,000).
--   * SECURITY DEFINER with a fixed search_path; executable by service_role only (the app's server
--     client). anon and authenticated cannot call it.

create or replace function public.score_films_against_vector(q extensions.vector, slugs text[])
returns table (letterboxd_slug text, sim double precision)
language sql
stable
security definer
set search_path = public, extensions, pg_temp
as $$
  with s as (
    select distinct u.slug
    from unnest(slugs) as u(slug)
    where cardinality(slugs) <= 5000
  ),
  d as (
    select v.letterboxd_slug, v.emb::vector <=> q as dist
    from public.film_vec v
    join s on s.slug = v.letterboxd_slug
    union all
    select f.letterboxd_slug, f.embedding <=> q
    from public.films f
    join s on s.slug = f.letterboxd_slug
    where f.embedding is not null
      and not exists (select 1 from public.film_vec v2 where v2.letterboxd_slug = f.letterboxd_slug)
  )
  select d.letterboxd_slug, case when d.dist = 'NaN'::float8 then 0 else 1 - d.dist end
  from d;
$$;

revoke all on function public.score_films_against_vector(extensions.vector, text[]) from public;
revoke all on function public.score_films_against_vector(extensions.vector, text[]) from anon, authenticated;
grant execute on function public.score_films_against_vector(extensions.vector, text[]) to service_role;

comment on function public.score_films_against_vector(extensions.vector, text[]) is
  'Montage rule 1135: cosine of q with each slug''s vector (film_vec, films.embedding fallback). service_role only.';

-- PostgREST picks up a new function on its schema reload; this asks for one now.
notify pgrst, 'reload schema';

-- Check (read-only): should return a few rows with sim between -1 and 1, the film itself at 1.
-- select * from public.score_films_against_vector(
--   (select emb::vector from public.film_vec where letterboxd_slug = 'parasite-2019'),
--   array['parasite-2019', 'memories-of-murder', 'no-such-film']);


-- ============================================================================================
-- B. OPTIONAL: nearest_films and its index (read the notes; none of this is needed for A)
-- ============================================================================================
-- What is there now: film_vec_hnsw, HNSW on film_vec.emb halfvec_cosine_ops, default build
-- settings (m = 16, ef_construction = 64), 114 MB; nearest_films sets hnsw.ef_search to k clamped
-- to 40..1000 per call. pgvector 0.8.0, shared_buffers 512 MB.
-- Verdict: the index is the right kind (HNSW on halfvec is pgvector's fastest and smallest choice for
-- 29k x 1536; IVFFlat would be smaller to build but needs probes tuning and recalls worse) and
-- ef_search = k is the minimum that returns k results reliably. The 319 ms mean (max 2.7 s) is
-- disk: 280k of its 1.1M block reads missed the cache (75% hit). The fix is fewer calls, not a new
-- index: the app now caches every caller's answer (film_neighbours 90 days; a film's own neighbours
-- a week; a taste centroid's a day, which now includes lib/taste/blindspots.ts, the one caller that
-- asked every time).
--
-- B1. Warm the index into shared buffers after a restart or a quiet spell. Reads 114 MB once (a few
--     seconds), takes no lock, changes nothing; it does not survive a restart and the cache can evict
--     it again under pressure. pg_prewarm is already installed.
-- select pg_prewarm('public.film_vec_hnsw');
--
-- B2. Keep film_vec rows out of TOAST so a slug read is one heap page, not heap + TOAST (each 3 KB
--     halfvec row is over the 2 KB TOAST threshold today: 37.6M TOAST block hits in pg_statio).
--     SET STORAGE is instant and takes a brief ACCESS EXCLUSIVE lock; it only applies to rows
--     written afterwards, so existing rows need a rewrite: VACUUM FULL holds an ACCESS EXCLUSIVE
--     lock on film_vec for the whole rewrite (about 250 MB, likely under a minute), blocking
--     nearest_films and the films_sync_vec trigger (so film embedding writes) until it ends. Run in
--     a quiet hour, or skip: the gain is modest now that most reads are scores or memo hits.
-- alter table public.film_vec alter column emb set storage main;
-- vacuum full public.film_vec;
--
-- B3. NOT recommended: rebuilding the HNSW with larger m / ef_construction raises recall, not speed,
--     and makes the index bigger (worse for the cache). If ever wanted, build it alongside without a
--     write lock (CREATE INDEX CONCURRENTLY cannot run in a transaction; several minutes for 29k rows
--     with maintenance_work_mem 128 MB), then drop the old one concurrently:
-- create index concurrently if not exists film_vec_hnsw_v2 on public.film_vec
--   using hnsw (emb halfvec_cosine_ops) with (m = 16, ef_construction = 128);
-- drop index concurrently if exists public.film_vec_hnsw;
