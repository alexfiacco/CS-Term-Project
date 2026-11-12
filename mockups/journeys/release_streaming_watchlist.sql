-- Release reminders' "now streaming" for EVERY film on anyone's watchlist (owner-approved 2026-11-12,
-- rule 1537; lib/release-reminders.ts). Until both of these exist the job keeps its old reach
-- (this and last year's films only, release_watchlist_films) and nothing new is sent.
-- Not run by the agent: run it once in the Supabase SQL editor. Additive only: one new function and
-- one new empty table; nothing existing is rewritten or dropped.

-- Every film on anyone's watchlist (imported or saved in Montage), any year, with a TMDB id. Driven
-- from the watchlists (not the whole catalog, which release_watchlist_films(0) would scan), keyset
-- paged by slug (p_after) so the job reads it in pages of at most 5,000. ~30 ms at today's size.
create or replace function public.release_watchlist_all_films(p_after text default '', p_limit integer default 5000)
returns table (slug text, tmdb_id integer)
language sql stable set search_path = public as $$
  with w as (
    select uw.slug from user_watchlist uw
    union
    select jsonb_array_elements_text(pp.library_json->'watchlist')
    from public_profiles pp
    where pp.user_id is not null and jsonb_typeof(pp.library_json->'watchlist') = 'array'
  )
  select f.letterboxd_slug, f.tmdb_id
  from w join films f on f.letterboxd_slug = w.slug
  where w.slug > coalesce(p_after, '') and f.tmdb_id is not null and f.duplicate_of is null
    and coalesce(f.media_type, 'movie') = 'movie'
  order by w.slug
  limit greatest(1, least(p_limit, 5000));
$$;
revoke execute on function public.release_watchlist_all_films(text, integer) from public, anon, authenticated;
grant execute on function public.release_watchlist_all_films(text, integer) to service_role;

-- Each person's services as the job knows them: their region and, per service id (Settings, Your
-- services), the day it was first in their list (no earlier than their profile's updated_at when the
-- job first saw it). A film landing on a service counts only after that day, so adding a service, or
-- the first run, never announces what was already on it (the silent baseline).
create table if not exists public.release_stream_services (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  region     text not null,
  services   jsonb not null default '{}'::jsonb,   -- { "8": "2026-11-12", ... }
  updated_at timestamptz not null default now()
);
alter table public.release_stream_services enable row level security;
revoke all on table public.release_stream_services from anon, authenticated;
-- No policies: read and written with the service role only, like release_reminders_sent.
