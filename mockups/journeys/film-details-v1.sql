-- Film page Details and Parental guide: data (rule 1188, 2026-11-06).
-- Run once in the Supabase SQL editor (project uktamekqqsiijugpaxit). Safe to run again.
-- Until it runs, nothing changes: /api/cron/tmdb-details and the label-traits guide set no-op,
-- no TMDB or model call is made, and page opens queue nothing.
-- Nothing here rewrites existing data: new nullable columns and two new tables only.

-- 1. Explicit Details columns on films. raw_tmdb is not used for these: it is the full TMDB
--    response for 8,184 films, a slim one (no budget, no companies) for 14,513 and null for
--    48,567 (read 2026-11-06). TMDB's 0 for an unknown budget or revenue is stored as null.
alter table public.films
  add column if not exists studios            text[],        -- production companies, TMDB order, at most 6
  add column if not exists budget_usd         bigint,
  add column if not exists revenue_usd        bigint,        -- box office, worldwide, as TMDB reports it
  add column if not exists release_date       date,          -- TMDB's primary release date
  add column if not exists origin_countries   text[],        -- ISO 3166-1 codes, for the rating fallback
  add column if not exists details_fetched_at timestamptz;   -- set by every fetch (a 404 included)

-- The backfill's walk (never fetched, most logs first) and the weekly refresh of recent releases.
create index if not exists films_details_due_idx on public.films (letterboxd_watch_count desc nulls last, letterboxd_slug)
  where details_fetched_at is null and tmdb_id is not null and duplicate_of is null;
create index if not exists films_release_date_idx on public.films (release_date) where release_date is not null;

-- 2. Every country's age rating, one row per film and country. release_type is TMDB's
--    (1 premiere, 2 limited, 3 theatrical, 4 digital, 5 physical, 6 TV), the release the rating
--    was taken from by lib/certification.mjs's order (3, 2, 4, 5, 6, 1).
--    Size: TMDB has ratings in about 8 countries for a typical film: about 560,000 rows at about
--    90 bytes with the primary key: about 50 MB once the pass is done.
create table if not exists public.film_certifications (
  slug          text not null,
  country       text not null check (country ~ '^[A-Z]{2}$'),
  certification text not null check (length(certification) between 1 and 16),
  release_type  smallint not null check (release_type between 1 and 6),
  release_date  date,
  fetched_at    timestamptz not null default now(),
  primary key (slug, country)
);
alter table public.film_certifications enable row level security;
revoke all on public.film_certifications from anon, authenticated;

-- 3. Films a page open queued for the next detail run (a recent release whose box office is a
--    week old, or a film never fetched). Drained first each night; a row leaves once fetched.
create table if not exists public.film_detail_queue (
  slug      text primary key,
  queued_at timestamptz not null default now()
);
alter table public.film_detail_queue enable row level security;
revoke all on public.film_detail_queue from anon, authenticated;

-- 4. The parental guide's two new label traits, on violence's 0-100 scale
--    (None 0-14, Mild 15-39, Moderate 40-69, Strong 70+). Filled by /api/cron/label-traits'
--    guide set, most Letterboxd logs first, at most 5,000 films a day (LABEL_GUIDE_DAILY):
--    about $31 for the 27,800 labelled films over about 6 days, at batch price.
alter table public.film_labels
  add column if not exists language   smallint check (language between 0 and 100),
  add column if not exists substances smallint check (substances between 0 and 100);

-- Checks after a night or two:
--   select count(*) filter (where details_fetched_at is not null) fetched, count(*) filter (where budget_usd is not null) with_budget from films;
--   select country, count(*) from film_certifications group by 1 order by 2 desc limit 20;
--   select count(*) filter (where language is not null) from film_labels;
