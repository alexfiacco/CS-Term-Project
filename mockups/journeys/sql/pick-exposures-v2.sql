-- pick_exposures v2: better feedback logging, step 1 (owner-approved 2026-11-09; rule 1419).
-- Run by the OWNER in the Supabase SQL editor. Safe to run more than once. The app code that fills
-- these columns is already live and works with or without them (lib/pick-outcomes.ts feature-detects
-- the new function and columns and falls back to the old shape until this has run).
--
-- What each column means (one row per owner, film and surface, as before):
--   position   where the film sat on the slate the last time it was shown (0 = first)
--   slate_id   which response showed it last (one id per slate a route served)
--   passed_at  when the person was shown a NEW slate on the same surface that left this film out,
--              without having rated, saved or hidden it (a reshuffle past it)
--   outcome    how it landed in the end: 'watched' (seen after it was shown), 'already_seen' (marked
--              seen with no watch date after it was first shown), 'watchlisted', 'hidden', 'passed'
--
-- RLS: the table has RLS on and NO policies (only service_role, which bypasses RLS, reads or
-- writes it). Nothing here adds a policy or a grant, so that stays exactly as it is.

begin;

alter table public.pick_exposures
  add column if not exists position  integer,
  add column if not exists slate_id  text,
  add column if not exists passed_at timestamptz,
  add column if not exists outcome   text;

do $$ begin
  alter table public.pick_exposures add constraint pick_exposures_outcome_check
    check (outcome is null or outcome in ('watched', 'already_seen', 'watchlisted', 'hidden', 'passed'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.pick_exposures add constraint pick_exposures_position_check
    check (position is null or position between 0 and 999);
exception when duplicate_object then null; end $$;

-- Marking a slate's films "passed" looks up the owner's last slate on a surface.
create index if not exists pick_exposures_owner_surface_slate_idx
  on public.pick_exposures (owner_key, surface, slate_id);
-- Outcome analysis (rates by outcome and surface over time); partial, so un-acted rows cost nothing.
create index if not exists pick_exposures_outcome_idx
  on public.pick_exposures (surface, outcome, last_shown_at) where outcome is not null;

-- The writer: record_pick_exposures plus position and slate. The old function stays untouched (the
-- app falls back to it), with the same 1-hour rule for counting a showing again; position and slate
-- always follow the latest showing. A film shown again comes off "passed". Before inserting, the
-- films of the owner's previous slate on this surface that this slate leaves out, and that have no
-- outcome yet, are stamped passed.
create or replace function public.record_pick_exposures_v2(
  p_owner_key text, p_profile_id text, p_surface text, p_room_id text,
  p_slugs text[], p_matches integer[], p_positions integer[], p_slate_id text
) returns void
language sql
set search_path to 'public'
as $function$
  update public.pick_exposures e
     set passed_at = now(), outcome = 'passed'
   where e.owner_key = p_owner_key and e.surface = p_surface
     and p_slate_id is not null and e.slate_id is not null and e.slate_id <> p_slate_id
     and e.last_shown_at > now() - interval '1 day'
     and e.outcome is null and e.rated_at is null and e.watchlisted_at is null and e.hidden_at is null
     and not (e.slug = any (p_slugs));

  insert into public.pick_exposures as e (owner_key, profile_id, slug, surface, match, room_id, position, slate_id)
  select p_owner_key, p_profile_id, s.slug, p_surface,
         case when s.m between 0 and 100 then s.m::smallint end, p_room_id,
         case when s.pos between 0 and 999 then s.pos end, p_slate_id
  from unnest(p_slugs, p_matches, p_positions) as s(slug, m, pos)
  where s.slug is not null and s.slug <> ''
  on conflict (owner_key, slug, surface) do update
    set last_shown_at = case when e.last_shown_at < now() - interval '1 hour'
                               or e.room_id is distinct from coalesce(excluded.room_id, e.room_id)
                             then now() else e.last_shown_at end,
        times_shown = case when e.last_shown_at < now() - interval '1 hour'
                             or e.room_id is distinct from coalesce(excluded.room_id, e.room_id)
                           then e.times_shown + 1 else e.times_shown end,
        match = coalesce(excluded.match, e.match),
        profile_id = coalesce(excluded.profile_id, e.profile_id),
        room_id = coalesce(excluded.room_id, e.room_id),
        position = excluded.position,
        slate_id = excluded.slate_id,
        passed_at = case when e.outcome = 'passed' then null else e.passed_at end,
        outcome = case when e.outcome = 'passed' then null else e.outcome end;
$function$;

-- Same privileges as record_pick_exposures: the service role only.
revoke all on function public.record_pick_exposures_v2(text, text, text, text, text[], integer[], integer[], text) from public, anon, authenticated;
grant execute on function public.record_pick_exposures_v2(text, text, text, text, text[], integer[], integer[], text) to service_role;

commit;

-- Check afterwards (expect 4 rows, and the function):
--   select column_name, data_type from information_schema.columns
--    where table_name = 'pick_exposures' and column_name in ('position','slate_id','passed_at','outcome');
--   select proname from pg_proc where proname = 'record_pick_exposures_v2';
