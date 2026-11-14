-- 13-deck-exposures.sql (rule 2039, 2026-11-14). Safe to run more than once. Needed before any
-- Picks deck exposure is stored; until it runs, the app sends its beacons and the server drops them
-- (POST /api/deck-shown backs off for ten minutes when it finds the function missing).
--
-- What it does:
--   1. Lets pick_exposures.surface take 'deck' (Picks' For you tab) and 'deck_new' (its New releases
--      tab). The check is rebuilt from the values it has now plus these two, so a surface another
--      session added in the meantime is kept.
--   2. Adds record_deck_exposures(): one call per beacon batch. A film is counted at most once per
--      person, per tab, per UTC day (times_shown + 1 only when the last showing was before today).
--      Unlike record_pick_exposures_v2 it never stamps "passed" on earlier films (a deck has no
--      slates) and leaves outcomes alone.
--
-- Touches no one's data: a wider check and a new function. Server-only like the table (rule 21).

-- 1. The surface check, widened.
do $$
declare
  def text;
  vals text[];
begin
  select pg_get_constraintdef(c.oid) into def
  from pg_constraint c
  where c.conrelid = 'public.pick_exposures'::regclass and c.conname = 'pick_exposures_surface_check';
  if def is not null and def like '%''deck''%' and def like '%''deck_new''%' then
    return;
  end if;
  vals := array(
    select distinct v from unnest(
      array(select (regexp_matches(coalesce(def, ''), '''([a-z_]+)''', 'g'))[1])
      || array['weekly', 'top', 'tonight', 'room', 'mix', 'today', 'deck', 'deck_new']
    ) as v order by v
  );
  alter table public.pick_exposures drop constraint if exists pick_exposures_surface_check;
  execute format(
    'alter table public.pick_exposures add constraint pick_exposures_surface_check check (surface = any (%L::text[]))',
    vals
  );
end $$;

-- 2. The write.
create or replace function public.record_deck_exposures(
  p_owner_key text, p_tab text, p_slugs text[], p_matches int[], p_positions int[]
) returns void language sql security invoker set search_path = public as $$
  insert into public.pick_exposures as e (owner_key, slug, surface, match, position)
  select p_owner_key, s.slug,
         case when p_tab = 'new' then 'deck_new' else 'deck' end,
         case when s.m between 0 and 100 then s.m::smallint end,
         case when s.pos between 0 and 999 then s.pos end
  from unnest(p_slugs, p_matches, p_positions) as s(slug, m, pos)
  where s.slug is not null and s.slug <> '' and coalesce(p_owner_key, '') <> ''
  on conflict (owner_key, slug, surface) do update
    set last_shown_at = now(),
        times_shown = e.times_shown + 1,
        match = coalesce(excluded.match, e.match),
        position = coalesce(excluded.position, e.position)
    where e.last_shown_at < date_trunc('day', now());
$$;
revoke all on function public.record_deck_exposures(text, text, text[], int[], int[]) from public, anon, authenticated;
grant execute on function public.record_deck_exposures(text, text, text[], int[], int[]) to service_role;

-- 3. Check (read-only): both values allowed, the function present.
select pg_get_constraintdef(c.oid) as surface_check
from pg_constraint c
where c.conrelid = 'public.pick_exposures'::regclass and c.conname = 'pick_exposures_surface_check';
select proname, pg_get_function_identity_arguments(oid) as args
from pg_proc where proname = 'record_deck_exposures';
