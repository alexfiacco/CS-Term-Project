-- 15-room-live-activities.sql (montage rules 800-802 amended and rule 2056, 2026-11-14, branch b41-lobbyla; mock
-- mockups/journeys/b134-lobby-live-activity.png). Safe to run more than once. Needed before the server
-- can keep a movie night's Live Activity current with the phone locked; until it runs the iPhone still
-- registers its activity's push token and the server drops it (lib/room-live-activity.ts backs off for
-- ten minutes per instance when it finds the table or functions missing). Nothing errors either way.
--
-- What it does:
--   1. room_live_activities: one row per Live Activity push token (POST /api/theater/live-activity),
--      with the room, the seat it belongs to (a profile id or guest-<row id>) and the APNs environment.
--      last_sent_at / last_hash / last_loud remember the last push, so a burst of votes sends at most
--      one update per activity every few seconds and unchanged content is not sent again;
--      trailing_at lets one invocation per room claim the send at the end of a window; ended_at marks
--      an activity the server has ended (the night closed, the seat left).
--   2. claim_room_live_activity_sends(): atomically claims which activities this invocation may send
--      to now, and says which ones changed but are inside the window (throttled).
--   3. claim_room_live_activity_trailing(): one trailing send per room per window.
--
-- Touches no one's data: one new empty table and two functions. Server-only like push_tokens
-- (rule 21): RLS on, no policies, nothing granted to anon or authenticated; the functions are
-- executable by the service role only.

-- 1. The table.
create table if not exists public.room_live_activities (
  token        text primary key,                 -- the activity's APNs push token, hex
  theater_id   text not null,
  seat_key     text not null,                    -- profile id, or guest-<theater_members.id>
  env          text not null default 'production' check (env in ('development', 'production')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  last_sent_at timestamptz,
  last_hash    text,
  last_loud    text,
  trailing_at  timestamptz,
  ended_at     timestamptz
);
create index if not exists room_live_activities_theater_idx on public.room_live_activities (theater_id) where ended_at is null;
create index if not exists room_live_activities_updated_idx on public.room_live_activities (updated_at);

alter table public.room_live_activities enable row level security;
revoke all on table public.room_live_activities from public, anon, authenticated;
grant select, insert, update, delete on table public.room_live_activities to service_role;

-- 2. Which activities to send to now. p_tokens, p_hashes and p_louds line up (one entry per activity,
-- the content each seat would get). An activity is claimed (its last_sent_at, last_hash and last_loud
-- set) when p_end is true (the night closed or the seat left: always sent, and ended), or it was never
-- sent to, or the window has passed and either its content changed or the keep-alive is due. The
-- conditions read the row itself, so two invocations racing on the same row cannot both claim it.
-- loud: the stage, head count, ready count or decided film moved since the last push (priority 10).
-- throttled: the content changed but the window has not passed (the caller claims a trailing send).
create or replace function public.claim_room_live_activity_sends(
  p_theater text, p_tokens text[], p_hashes text[], p_louds text[],
  p_gap_seconds int, p_keepalive_seconds int, p_end boolean
) returns table (activity_token text, apns_env text, loud boolean, throttled boolean)
language sql volatile security invoker set search_path = public as $$
  with want as (
    select w.token, w.hash, w.loud from unnest(p_tokens, p_hashes, p_louds) as w(token, hash, loud)
  ),
  cur as (
    select a.token, a.env, a.last_hash, a.last_loud, w.hash, w.loud
    from public.room_live_activities a join want w on w.token = a.token
    where a.theater_id = p_theater and a.ended_at is null
  ),
  upd as (
    update public.room_live_activities a
       set last_sent_at = now(), last_hash = c.hash, last_loud = c.loud, updated_at = now(),
           ended_at = case when p_end then now() else null end
      from cur c
     where a.token = c.token and a.ended_at is null
       and (p_end
            or a.last_sent_at is null
            or (a.last_sent_at < now() - make_interval(secs => p_gap_seconds)
                and (a.last_hash is distinct from c.hash
                     or a.last_sent_at < now() - make_interval(secs => p_keepalive_seconds))))
    returning a.token, a.env, (c.last_loud is distinct from c.loud) as loud
  )
  select u.token, u.env, u.loud, false from upd u
  union all
  select c.token, c.env, false, true from cur c
   where not exists (select 1 from upd u where u.token = c.token)
     and c.last_hash is distinct from c.hash;
$$;
revoke all on function public.claim_room_live_activity_sends(text, text[], text[], text[], int, int, boolean) from public, anon, authenticated;
grant execute on function public.claim_room_live_activity_sends(text, text[], text[], text[], int, int, boolean) to service_role;

-- 3. One trailing send per room per window: true for the invocation that claimed it.
create or replace function public.claim_room_live_activity_trailing(p_theater text, p_due timestamptz)
returns boolean
language sql volatile security invoker set search_path = public as $$
  with t as (
    update public.room_live_activities
       set trailing_at = p_due
     where theater_id = p_theater and ended_at is null
       and (trailing_at is null or trailing_at < now())
    returning 1
  )
  select count(*) > 0 from t;
$$;
revoke all on function public.claim_room_live_activity_trailing(text, timestamptz) from public, anon, authenticated;
grant execute on function public.claim_room_live_activity_trailing(text, timestamptz) to service_role;
