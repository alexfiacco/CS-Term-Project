-- How many Montage ratings a film has, and their average (owner, 2026-11-04,
-- mockups/journeys/beli-1-friends-score: "Start all"; docs/INVARIANTS.md, "Your people's rating").
-- A card with no friends' ratings says "12k ratings" from 50 Montage ratings up; the film page's
-- "Everyone on Montage 3.9★ · 12k ratings". Montage ratings only: user_ratings (rated here), never
-- Letterboxd's counts. Aggregates only: no rater is named. Until this is applied the app reads the
-- page's films from user_ratings directly (lib/friends-rating.ts montageRatings).
--
-- Read-only function and one index; no table is created, so no new RLS policy is needed
-- (user_ratings keeps its own). Service role only.
create index if not exists user_ratings_slug_rated_idx on public.user_ratings (slug) where rating is not null;

create or replace function public.montage_film_ratings(p_slugs text[])
returns table (slug text, n bigint, avg real)
language sql stable
set search_path = public, extensions, pg_temp
as $$
  select r.slug, count(*)::bigint, avg(r.rating)::real
  from public.user_ratings r
  where r.slug = any(p_slugs) and r.rating is not null and r.rating > 0
  group by r.slug;
$$;

revoke execute on function public.montage_film_ratings(text[]) from public, anon, authenticated;
grant execute on function public.montage_film_ratings(text[]) to service_role;
