-- Tonight's reminder channel (rule 1146, owner-approved notifications plan, mockups/journeys/notif-ask-v3.html).
--
-- The double ask: on an iPhone with notifications allowed, Remind me (Three for tonight) and
-- Watching this tonight schedule the local 10:00 "How was <film>?" AND write tonight_shown, so the
-- 16:00 UTC morning-after email (/api/cron/tonight-followup) asked again. POST /api/tonight/shown
-- now sends remind: "push" | "email"; this column keeps it, and the cron skips "push" rows.
--
-- Safe to run on the live database and safe to run again: one column with a default, so every
-- existing row reads "email" (today's behaviour). RLS is unchanged (on, no policies, service role
-- only). Until it is run, the app detects the column is missing and behaves exactly as before.

alter table public.tonight_shown
  add column if not exists remind_channel text not null default 'email';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'tonight_shown_remind_channel_check') then
    alter table public.tonight_shown
      add constraint tonight_shown_remind_channel_check check (remind_channel in ('push', 'email'));
  end if;
end $$;

-- So PostgREST sees the new column at once.
notify pgrst, 'reload schema';
