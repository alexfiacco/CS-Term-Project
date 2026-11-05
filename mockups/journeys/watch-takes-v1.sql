-- watch-takes-v1: one take per watch (mockups/journeys/watch-edit-v1.html). NOT APPLIED.
-- Safe to re-run: every step checks before it changes anything.
--
-- ORDER: ship the code first. lib/film-takes.ts postTake upserts with onConflict "film_slug,author_id"
-- and reads the prior take with maybeSingle(); lib/taste/read-evidence.ts reads the take with
-- maybeSingle(). All three break once the unique (film_slug, author_id) is gone and an author has two
-- takes on one film. Change them to insert / update by take id (or by watch_id) and to read the newest
-- take, then apply this.
--
-- RLS: unchanged. film_takes, film_take_replies, film_take_reactions and film_take_reads keep RLS on with
-- no policies (server only, through the service role). No new table. Replies and reactions hang off
-- take_id, so every take keeps its own thread; film_take_reads stays per film.

begin;

-- 1. The watch a take is about: a user_library_events row (a logged watch). When the watch is deleted
--    the take stays and is unlinked (on delete set null). watched_on is copied at post time so an
--    unlinked take still shows its date.
alter table public.film_takes add column if not exists watch_id bigint;
alter table public.film_takes add column if not exists watched_on date;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'film_takes_watch_id_fkey' and conrelid = 'public.film_takes'::regclass) then
    alter table public.film_takes
      add constraint film_takes_watch_id_fkey foreign key (watch_id)
      references public.user_library_events(id) on delete set null;
  end if;
end $$;

-- 2. One take per author per film becomes one take per watch. No uniqueness on unlinked takes
--    (watch_id null): a set-null on watch delete must never fail on a unique check.
alter table public.film_takes drop constraint if exists film_takes_film_slug_author_id_key;
create unique index if not exists film_takes_watch_uniq on public.film_takes (watch_id) where watch_id is not null;
-- Discussion folds an author's takes on a film, newest first.
create index if not exists film_takes_author_film_idx on public.film_takes (film_slug, author_id, created_at desc);

-- 3. Backfill (only rows still unlinked, so re-running is a no-op): link each existing take to its
--    author's newest watch of that film logged on or before the take was written (a day of slack).
--    author_id is a public_profiles id; watches are keyed by the account's user_id (owner_key).
--    A watch already holding a take is skipped, so the unique index above holds.
--    Checked read-only on 2026-11-05: links 0 of the 7 takes (all on Letterboxd-imported or undated
--    films, no in-app watch event). They stay unlinked: film-level takes, shown with their post date.
with cand as (
  select distinct on (t.id) t.id as take_id, e.id as watch_id, e.watched_on
  from public.film_takes t
  join public.public_profiles p on p.id::text = t.author_id
  join public.user_library_events e
    on e.owner_key = p.user_id::text and e.slug = t.film_slug and e.watch is not null
   and e.at <= t.created_at + interval '1 day'
  where t.watch_id is null
    and not exists (select 1 from public.film_takes o where o.watch_id = e.id)
  order by t.id, e.at desc
)
update public.film_takes t
   set watch_id = c.watch_id, watched_on = coalesce(t.watched_on, c.watched_on)
  from cand c
 where t.id = c.take_id and t.watch_id is null;

commit;

-- Check after: no author should have two takes on one watch, and every link should be their own watch.
-- select watch_id, count(*) from public.film_takes where watch_id is not null group by 1 having count(*) > 1;
-- select t.id from public.film_takes t join public.user_library_events e on e.id = t.watch_id
--   join public.public_profiles p on p.id::text = t.author_id where e.owner_key <> p.user_id::text;
