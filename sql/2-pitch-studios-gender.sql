-- Pitch's studios and "directed by a woman" (rule 1661; lib/pitch-data.ts, app/api/ops/fill-pitch-data).
-- Not run by the agent: run it once in the Supabase SQL editor, then run the Ops workflow's `fill-pitch-data`
-- task (or `node scripts/ops-call.mjs fill-pitch-data`) until it reports nothing remaining.
--
-- Until this runs: a studio ask reads TMDB's production companies kept on films.raw_tmdb (about a third of the
-- films Pitch ranks have them), and "directed by a woman" says the data isn't loaded and filters nothing.

-- A film's production companies (TMDB details' production_companies), one row per company.
create table if not exists public.film_companies (
  film_slug text not null references public.films (letterboxd_slug) on delete cascade,
  company_id integer not null,
  name text not null,
  primary key (film_slug, company_id)
);
create index if not exists film_companies_name on public.film_companies (name);
-- The films whose companies were asked (an empty answer is an answer), so the fill asks each film once.
create table if not exists public.film_companies_checked (
  film_slug text primary key references public.films (letterboxd_slug) on delete cascade,
  checked_at timestamptz not null default now()
);

-- TMDB's gender for a person (directors first): 0 not set, 1 woman, 2 man, 3 non-binary.
create table if not exists public.person_gender (
  person_id integer primary key,
  gender smallint not null default 0,
  checked_at timestamptz not null default now()
);
create index if not exists person_gender_gender on public.person_gender (gender);

alter table public.film_companies enable row level security;
alter table public.film_companies_checked enable row level security;
alter table public.person_gender enable row level security;
revoke all on table public.film_companies from anon, authenticated;
revoke all on table public.film_companies_checked from anon, authenticated;
revoke all on table public.person_gender from anon, authenticated;
-- No policies: read and written with the service role only, like film_awards.

-- What enrichment already holds: every film whose raw_tmdb carries production_companies.
insert into public.film_companies (film_slug, company_id, name)
select f.letterboxd_slug, (c->>'id')::integer, c->>'name'
from public.films f, jsonb_array_elements(f.raw_tmdb->'production_companies') c
where f.raw_tmdb ? 'production_companies' and jsonb_typeof(f.raw_tmdb->'production_companies') = 'array'
  and (c->>'id') ~ '^[0-9]+$' and coalesce(c->>'name', '') <> ''
on conflict do nothing;
insert into public.film_companies_checked (film_slug)
select f.letterboxd_slug from public.films f
where f.raw_tmdb ? 'production_companies' and jsonb_typeof(f.raw_tmdb->'production_companies') = 'array'
on conflict do nothing;
