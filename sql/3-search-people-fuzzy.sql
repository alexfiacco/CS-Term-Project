-- Search: a slight typo in an actor's name ("quentin tarrantino", "tom hnaks", "leonardo dicapro") finds them
-- (owner bug 2026-11-13, rule 1790; lib/tag-pages.ts searchActors). Directors already match typos in memory.
-- Not run by the agent: run it once in the Supabase SQL editor. Additive only: one new read-only function on
-- the existing trigram index film_cast_name_trgm_idx (pg_trgm is installed); nothing is rewritten or dropped.
-- Until it exists the search asks for it, gets an error, and simply shows no typo actors (as today).
-- Called only when the name read found no real match, so most keystrokes never run it. ~275 ms measured
-- (2026-11-13, "tom hnaks", default similarity threshold 0.3).
create or replace function public.search_cast_fuzzy(q text, lim integer default 12)
returns table (person_id integer, name text, sim real)
language sql stable set search_path = public, extensions as $$
  select c.person_id, c.name, max(similarity(c.name, q)) as sim
  from film_cast c
  where length(coalesce(q, '')) >= 5 and c.name % q
  group by c.person_id, c.name
  order by sim desc
  limit greatest(1, least(lim, 30));
$$;
revoke execute on function public.search_cast_fuzzy(text, integer) from public, anon, authenticated;
grant execute on function public.search_cast_fuzzy(text, integer) to service_role;
