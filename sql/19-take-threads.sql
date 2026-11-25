-- 19-take-threads.sql (Montage rule 3420, one thread per take, 2026-11-24). Safe to run more than once.
-- Owner-approved mockups/journeys/take-threads-v1.png and take-threads-lately-v1.png.
--
-- Not applied by the build: run it when ready. Until it runs the app works flat, as before: it probes these
-- columns (lib/take-thread.ts threadsReady, a no re-checked each minute, a yes kept an hour), stores every
-- reply at the top level and names who it answers with their @handle, and Discussion and the post sheet
-- already show one conversation (the union of both tables is read; no row moves).
--
-- What it adds (one level deep; a reply to a reply attaches to its top-level parent in the app):
--   film_take_replies.parent_id          a Discussion reply's top-level Discussion reply
--   friend_post_comments.parent_id       a post comment's top-level post comment
--   friend_post_comments.parent_reply_id a post comment that answers a Discussion reply on the take the post
--                                        carries (a reply to a friends-only comment is always a post comment,
--                                        so film_take_replies never points at friend_post_comments)
-- Every parent key is ON DELETE CASCADE (owner, 2026-11-24): a deleted comment or reply takes its replies
-- with it, across tables too; deleting a take removes its replies by the existing take_id key, the
-- comment replies under them by parent_reply_id, and the app deletes the watch post comments it carried.
-- A parent hidden by moderation (hidden_at) hides its replies in the app, read side, so undo brings them back.
--
-- RLS: both tables keep RLS on with no policies (server-only, as now); new columns need nothing more.
-- Touches no one's data except the backfill below, which only fills parent ids that are still NULL.

alter table public.film_take_replies add column if not exists parent_id uuid;
alter table public.friend_post_comments add column if not exists parent_id uuid;
alter table public.friend_post_comments add column if not exists parent_reply_id uuid;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'film_take_replies_parent_id_fkey') then
    alter table public.film_take_replies add constraint film_take_replies_parent_id_fkey
      foreign key (parent_id) references public.film_take_replies(id) on delete cascade;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'friend_post_comments_parent_id_fkey') then
    alter table public.friend_post_comments add constraint friend_post_comments_parent_id_fkey
      foreign key (parent_id) references public.friend_post_comments(id) on delete cascade;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'friend_post_comments_parent_reply_id_fkey') then
    alter table public.friend_post_comments add constraint friend_post_comments_parent_reply_id_fkey
      foreign key (parent_reply_id) references public.film_take_replies(id) on delete cascade;
  end if;
  -- At most one parent, and never itself.
  if not exists (select 1 from pg_constraint where conname = 'friend_post_comments_one_parent') then
    alter table public.friend_post_comments add constraint friend_post_comments_one_parent
      check (parent_id is null or parent_reply_id is null);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'friend_post_comments_not_own_parent') then
    alter table public.friend_post_comments add constraint friend_post_comments_not_own_parent check (parent_id is null or parent_id <> id);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'film_take_replies_not_own_parent') then
    alter table public.film_take_replies add constraint film_take_replies_not_own_parent check (parent_id is null or parent_id <> id);
  end if;
end $$;

create index if not exists film_take_replies_parent_idx on public.film_take_replies (parent_id) where parent_id is not null;
create index if not exists friend_post_comments_parent_idx on public.friend_post_comments (parent_id) where parent_id is not null;
create index if not exists friend_post_comments_parent_reply_idx on public.friend_post_comments (parent_reply_id) where parent_reply_id is not null;

-- Backfill: until now Reply on a Lately comment typed "@handle " first. Such a comment, on the same post, by
-- someone else, after a top-level comment by that handle, becomes that comment's reply (the newest such
-- comment before it), so the real threads read as they should have. Only NULL parents are filled, only
-- parents that do not start with "@" themselves (so nothing ends two deep), and the words are left as typed.
update public.friend_post_comments c
set parent_id = p.id
from public.public_profiles who,
  lateral (
    select x.id from public.friend_post_comments x
    where x.owner_id = c.owner_id and x.post_key = c.post_key and x.author_id = who.id
      and x.author_id <> c.author_id and x.created_at < c.created_at
      and x.parent_id is null and x.parent_reply_id is null and x.body !~ '^@'
    order by x.created_at desc limit 1
  ) p
where c.parent_id is null and c.parent_reply_id is null
  and who.username is not null
  and lower(substring(c.body from '^@([A-Za-z0-9_.]+)')) = lower(who.username);

-- The same for Discussion replies on one take.
update public.film_take_replies c
set parent_id = p.id
from public.public_profiles who,
  lateral (
    select x.id from public.film_take_replies x
    where x.take_id = c.take_id and x.author_id = who.id
      and x.author_id <> c.author_id and x.created_at < c.created_at
      and x.parent_id is null and x.body !~ '^@'
    order by x.created_at desc limit 1
  ) p
where c.parent_id is null
  and who.username is not null
  and lower(substring(c.body from '^@([A-Za-z0-9_.]+)')) = lower(who.username);

-- Check (a SELECT): replies per table, and that nothing is two deep.
-- select 'comments' t, count(*) filter (where parent_id is not null or parent_reply_id is not null) replies from public.friend_post_comments
-- union all select 'replies', count(*) filter (where parent_id is not null) from public.film_take_replies;
-- select count(*) as two_deep from public.friend_post_comments c join public.friend_post_comments p on p.id = c.parent_id
--   where p.parent_id is not null or p.parent_reply_id is not null;
