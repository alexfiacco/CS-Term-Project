-- Pitch: place and setting tags, and learning from use (rule 1153, 2026-11-06).
-- Run once in the Supabase SQL editor (project uktamekqqsiijugpaxit). Safe to run again.
-- Until it runs, the app does not change: the nightly cron (/api/cron/film-settings) no-ops,
-- and Pitch ranks settings by TMDB keywords only and logs no outcomes.

-- 1. Our own setting tags, one row per film.
--    tags: ids from lib/film-settings-vocab.ts (append-only, at most 250 ids, VOCAB_VERSION 1),
--    high-confidence tags only, at most 10 a film (2 places, 3 settings, 1 season, 1 time,
--    3 atmosphere). An empty array means "tagged, nothing central" (not asked again).
--    Size: about 70,600 rows at about 100 bytes each with the primary key index: about 10 MB.
create table if not exists public.film_settings (
  slug          text primary key,
  tags          smallint[] not null default '{}',
  vocab_version smallint not null,
  tagged_at     timestamptz not null default now(),
  constraint film_settings_tags_cap check (cardinality(tags) <= 12)
);
alter table public.film_settings enable row level security;
revoke all on public.film_settings from anon, authenticated;

-- 2. Pitch outcomes, aggregate only: no user id is stored. recut_id (the pitch's share id) is
--    there only so one pitch counts each film and action once. action: 1 open, 2 save, 3 share,
--    4 skip (shown above a film the viewer opened, saved or shared, and passed over).
--    tags: the pitch's parts as ids (lib/recut.ts pitchTagIds: settings, dials, genres).
--    The cron folds the last 120 days into a small table in ai_cache ('pitch:learn:v1').
--    Size: about 70 bytes a row; 100,000 outcomes is about 10 MB with its indexes.
create table if not exists public.pitch_outcomes (
  id         bigint generated always as identity primary key,
  recut_id   text not null,
  slug       text not null,
  action     smallint not null check (action between 1 and 4),
  rank       smallint,
  tags       smallint[] not null default '{}',
  created_at timestamptz not null default now(),
  constraint pitch_outcomes_once unique (recut_id, slug, action)
);
create index if not exists pitch_outcomes_created_idx on public.pitch_outcomes (created_at);
alter table public.pitch_outcomes enable row level security;
revoke all on public.pitch_outcomes from anon, authenticated;

-- 3. THE GATE. The cron tags only the 60 sample films (lib/film-settings-tagger.ts SAMPLE_SLUGS)
--    until this is set. Read the sample first:
--      select f.title, s.tags from film_settings s join films f on f.letterboxd_slug = s.slug order by f.title;
--    then, when the tags look right, unlock the full run (pool films by audience size, then the
--    rest; at most 800 model calls, about $0.56, a day; about $5 for the whole catalogue):
-- insert into public.ai_cache (key, value) values ('film-settings:config', '{"full": true}'::jsonb)
--   on conflict (key) do update set value = excluded.value;
--    To slow it down or stop it: '{"full": true, "dailyCalls": 200}' or '{"full": false}'.
