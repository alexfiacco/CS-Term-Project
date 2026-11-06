-- Pitch: Save a cut (rule 1174, journeys/pitch-saved-v1). The owner runs this once in the Supabase
-- SQL editor (project uktamekqqsiijugpaxit). Safe to run more than once.
--
-- What it does: one nullable column on public.recuts, saved_at, set when a person saves a cut and
-- cleared when they unsave it, and a small partial index for "my saved cuts, newest first".
-- Nothing existing changes: every current row reads as not saved (null). No data is rewritten or
-- deleted.
--
-- Why recuts and not a new table: a saved cut is that pitch's own row (per owner: user_id), so
-- reopening it is the free re-rank of its stored query (rule 1133). Checked 2026-11-06 before
-- choosing this: no cron, job, trigger or database function deletes from recuts (vercel.json crons,
-- app/api/cron/cleanup, cron.job is empty, no public function mentions recuts), so a saved row is
-- never purged. Account deletion removes them with the account: recuts.user_id references
-- auth.users (id) on delete cascade (confirmed live: recuts_user_id_fkey, confdeltype 'c'), and
-- /api/delete-account ends with auth.admin.deleteUser.
--
-- RLS stays as it is: recuts has RLS on with no policies, so only the server (service role) reads
-- or writes it, and the server only touches the signed-in viewer's own rows (.eq("user_id", ...)).
--
-- Until this runs the app hides Save (op "recents" says canSave: false) and the Saved cuts list is
-- empty; nothing errors.

alter table public.recuts add column if not exists saved_at timestamptz;

create index if not exists recuts_user_saved on public.recuts (user_id, saved_at desc) where saved_at is not null;

-- Check (read-only): the column and the index are there.
-- select column_name, data_type, is_nullable from information_schema.columns
--   where table_schema = 'public' and table_name = 'recuts' and column_name = 'saved_at';
-- select indexname from pg_indexes where tablename = 'recuts' and indexname = 'recuts_user_saved';
