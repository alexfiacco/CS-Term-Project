-- ===== films-together-v1.sql =====
-- Films together (owner-approved 2026-11-06, mockups/journeys/films-together-v1.html, option A).
-- Code: lib/films-together.ts, app/api/films-together/route.ts, app/api/theater/close/route.ts.
--
-- Why a table: movie-night attendance is not a reliable record today. theater_members seats are
-- deleted when someone idles 15 minutes (sweepIdleParticipants), says Not tonight, or is removed by
-- the host, and theater_events keeps only 50 rows per room. This table writes down a room's members
-- once, when its film is locked in (POST /api/theater/close, server-side, service role).
--
-- One row per (room, member): the room, the film it locked, the member's profile id, when it locked.
-- Account members only (guests have no profile). RLS on with no policy, and anon/authenticated have
-- no grants: only the server (service role) reads or writes it.
--
-- Safe on the live database: a new table, an index, a partial index on activity_feed, and an
-- insert of best-effort rows. Nothing existing is rewritten or deleted. Until it is applied the
-- app counts tags only, and the close route's write fails quietly.
--
-- Account deletion (rule 169 / app/api/delete-account) deletes the person's rows by profile_id.

create table if not exists public.movie_night_attendance (
  room_id     text        not null,
  slug        text        not null,
  profile_id  text        not null,
  decided_at  timestamptz not null default now(),
  primary key (room_id, profile_id)
);

create index if not exists movie_night_attendance_profile_idx
  on public.movie_night_attendance (profile_id, decided_at desc);

alter table public.movie_night_attendance enable row level security;
revoke all on public.movie_night_attendance from anon, authenticated;
grant select, insert, update, delete on public.movie_night_attendance to service_role;

-- The tag half of the count reads activity_feed by (recipient, actor) in each direction. The
-- existing activity_feed_recipient_idx (recipient_id, created_at desc) already serves it; this
-- partial index keeps it to the few tag rows. Optional, small.
create index if not exists activity_feed_ww_pair_idx
  on public.activity_feed (recipient_id, actor_id)
  where kind in ('watched_with', 'watched_with_added');

-- ---------------------------------------------------------------------------------------------
-- BACKFILL, BEST-EFFORT. Rebuilt from what still exists for rooms that locked a film
-- (theaters.decided_slug). A member counts as there when ANY of these says so:
--   1. their seat is still in theater_members and they arrived (last_seen_at or a mood set, or
--      they are the host): the same test as the "How was it?" follow-up (wasThere);
--   2. they host the room (theaters.owner_id);
--   3. they got the room's "is decided" summary or the next-day "How was it?" in Activity
--      (activity_feed movie_night_decided / movie_night_followup, ref_id = the room);
--   4. the room's chat lines say they joined, set a mood, voted, spun or locked before the lock
--      (theater_events; only the newest 50 per room survive).
-- What it cannot recover: a member swept or removed before the lock whose events have rolled off
-- and who got no summary. Read-only check on 2026-11-06: 26 decided rooms, 37 (room, member) rows,
-- 10 rooms with two or more members; every row from 2-4 was also found by 1.
-- decided_at is the room's closed_at (every decided room has one today), else its created_at.
-- Only profiles that still exist; re-running it adds nothing twice.
with rooms as (
  select id, owner_id, decided_slug, coalesce(closed_at, created_at) as decided_at
  from public.theaters
  where decided_slug is not null
),
src as (
  select m.theater_id as room_id, m.member_id as profile_id
  from public.theater_members m join rooms r on r.id = m.theater_id
  where m.member_id is not null
    and (m.last_seen_at is not null or m.signal is not null or m.member_id = r.owner_id)
  union
  select r.id, r.owner_id from rooms r where r.owner_id is not null
  union
  select a.ref_id, a.recipient_id
  from public.activity_feed a join rooms r on r.id = a.ref_id
  where a.kind in ('movie_night_decided', 'movie_night_followup')
  union
  select e.theater_id, e.actor_key
  from public.theater_events e join rooms r on r.id = e.theater_id
  where e.kind in ('joined', 'mood', 'voted', 'spun', 'kept', 'locked')
    and e.actor_key not like 'guest-%'
    and e.created_at <= r.decided_at + interval '5 minutes'
)
insert into public.movie_night_attendance (room_id, slug, profile_id, decided_at)
select s.room_id, r.decided_slug, s.profile_id, r.decided_at
from src s
join rooms r on r.id = s.room_id
join public.public_profiles p on p.id = s.profile_id
on conflict (room_id, profile_id) do nothing;

-- Check after applying (expect about 37 rows today):
-- select count(*) as rows, count(distinct room_id) as rooms from public.movie_night_attendance;
