-- Friends' watches you'd like (Montage docs/INVARIANTS.md rule 1178, 2026-11-06).
--
-- The account's switch for a friend's watch that is a 75%+ match for you (circle_watch, rule 524),
-- shown on web Settings and the iPhone's Settings, Notifications once this column exists. Until it is
-- run the code is a no-op: GET /api/notify-prefs leaves friendWatches out, neither app shows the
-- switch, and the alert is sent as before.
--
-- NULL = never chosen (the alert is written; each phone's own switch, else Your films, decides the push).
-- false = no alert at all (no Activity row, no push). true = on.
--
-- Safe on the live database: one new nullable column on a server-only table (0 rows today); no row
-- is changed, nothing is dropped, so there is nothing to back up.

alter table public.notify_prefs add column if not exists friend_watches boolean;

-- Server-only, as before (rule 21): RLS on, no policies, nothing granted to the public roles.
alter table public.notify_prefs enable row level security;
revoke all on table public.notify_prefs from anon, authenticated;
