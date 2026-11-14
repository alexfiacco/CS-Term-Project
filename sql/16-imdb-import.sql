-- 16-imdb-import.sql (montage rules 2068 and 2048 amended, 2026-11-14, branch b41-imdb; mock
-- mockups/journeys/b121-imdb-import). Safe to run more than once. Needed before:
--   * the nightly IMDb id backfill (GET /api/cron/imdb-ids) does anything: until it runs the cron answers
--     "not ready" and makes no TMDB call;
--   * an IMDb import can save a person's TV series ratings: until it runs the import matches them, writes
--     nothing to user_shows and says the shows are not saved yet. Films import either way.
--
-- What it does:
--   1. films.imdb_checked_at: when the backfill last asked TMDB for this film's IMDb id. Set on every film it
--      asks about (found or not), so each is asked once and the pass can resume.
--   2. films_imdb_id_idx: an IMDb import looks films up by imdb_id (hundreds of ids per import); there was no
--      index on it (73,721 films, a sequential scan per chunk).
--   3. user_shows.source may be 'imdb' (was 'montage' or 'letterboxd', rule 2048): a series rating from an
--      IMDb import is kept as what it is.
--
-- Touches no one's data: a nullable column, an index, and a check constraint widened (every existing row
-- already passes it). Nothing is granted to anon or authenticated.

-- 1. The backfill's marker.
alter table public.films add column if not exists imdb_checked_at timestamptz;

-- 2. The IMDb id lookup.
create index if not exists films_imdb_id_idx on public.films (imdb_id) where imdb_id is not null;
-- The backfill's queue: films with a TMDB id and no IMDb id not yet asked about, most watched first.
create index if not exists films_imdb_backfill_idx on public.films (letterboxd_watch_count desc nulls last, letterboxd_slug)
  where imdb_id is null and imdb_checked_at is null and tmdb_id is not null and duplicate_of is null;

-- 3. IMDb as a show rating's source.
do $$
begin
  if exists (select 1 from pg_constraint where conname = 'user_shows_source_check' and conrelid = 'public.user_shows'::regclass) then
    alter table public.user_shows drop constraint user_shows_source_check;
  end if;
  alter table public.user_shows add constraint user_shows_source_check check (source = any (array['montage'::text, 'letterboxd'::text, 'imdb'::text]));
end $$;

-- Check (read only):
--   select count(*) filter (where imdb_id is null and tmdb_id is not null) as to_fill,
--          count(*) filter (where imdb_checked_at is not null) as asked
--     from public.films;
--   select pg_get_constraintdef(oid) from pg_constraint where conname = 'user_shows_source_check';
