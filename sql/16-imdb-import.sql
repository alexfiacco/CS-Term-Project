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
--   4. user_episode_ratings.source ('montage' by default, or 'letterboxd' or 'imdb'; the column is new): an
--      episode rating from an IMDb import is kept as what it is (montage rule 2068 amended, branch b41-imdb2).
--   5. imdb_episode_queue: an IMDb import's rated episodes, waiting to be placed (TMDB /find gives the show,
--      season and episode) and written to user_episode_ratings after the import (GET /api/cron/imdb-episodes).
--      One row per person and episode tt id; a person's data (owner_key and their rating), so it is in account
--      deletion and merge. Rows stay once done (written, kept, no_match, failed) so a re-import never asks TMDB
--      about the same episode twice. Until this runs an import queues nothing and says the episodes aren't saved.
--
-- Touches no one's data: nullable or defaulted columns, indexes, a new empty table, and check constraints
-- widened (every existing row already passes them; every existing episode rating reads source 'montage').
-- Nothing is granted to anon or authenticated; the new table is service role only (RLS on, no policies).

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

-- 4. A source on episode ratings, IMDb among them.
alter table public.user_episode_ratings add column if not exists source text not null default 'montage';
do $$
begin
  if exists (select 1 from pg_constraint where conname = 'user_episode_ratings_source_check' and conrelid = 'public.user_episode_ratings'::regclass) then
    alter table public.user_episode_ratings drop constraint user_episode_ratings_source_check;
  end if;
  alter table public.user_episode_ratings add constraint user_episode_ratings_source_check check (source = any (array['montage'::text, 'letterboxd'::text, 'imdb'::text]));
end $$;

-- 5. The episode queue.
create table if not exists public.imdb_episode_queue (
  id uuid not null default gen_random_uuid() unique,
  owner_key text not null,
  imdb_id text not null check (imdb_id ~ '^tt[0-9]{7,10}$'),
  rating real not null check (rating >= 0.5 and rating <= 5 and rating * 2 = round(rating * 2)),
  state text not null default 'pending' check (state in ('pending', 'resolved', 'no_show', 'no_match', 'written', 'kept', 'failed')),
  tmdb_show_id integer,
  season_number smallint check (season_number is null or season_number >= 0),
  episode_number smallint check (episode_number is null or episode_number >= 0),
  tries smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (owner_key, imdb_id)
);
alter table public.imdb_episode_queue enable row level security;
-- The drain's pages: rows still to place or write, by state.
create index if not exists imdb_episode_queue_todo on public.imdb_episode_queue (state, tries, created_at)
  where state in ('pending', 'resolved', 'no_show');

-- Check (read only):
--   select count(*) filter (where imdb_id is null and tmdb_id is not null) as to_fill,
--          count(*) filter (where imdb_checked_at is not null) as asked
--     from public.films;
--   select pg_get_constraintdef(oid) from pg_constraint where conname = 'user_shows_source_check';
--   select pg_get_constraintdef(oid) from pg_constraint where conname = 'user_episode_ratings_source_check';
--   select state, count(*) from public.imdb_episode_queue group by state;
