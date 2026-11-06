-- ===== films-together-cleanup-v1.sql =====
-- Films together: remove "Watched with" tags whose watch is gone (Montage docs/INVARIANTS.md rule 1205,
-- amending 1169 and 1129). OPTIONAL: the app already hides these rows on every read (lib/watched-with.ts
-- liveTags), and new ones are removed after Remove from Seen (dropTagsOnUnseen). This only tidies rows
-- left from before that fix.
--
-- A tag (activity_feed kind watched_with / watched_with_added; actor = tagger, recipient = friend,
-- ref_id = film slug) is an orphan when ANY of:
--   1. the tagger no longer has the film on their films (no user_ratings row for that slug);
--   2. the tagger removed the film from Seen at or after tagging (a user_library_events 'unseen'
--      event at or after the tag's created_at);
--   3. an added tag whose friend no longer has the film on their films.
-- Read-only count on 2026-11-06: 1 tag row in total, 1 orphan (a waiting tag on a film the tagger
-- rated, tagged 11s later, then removed from Seen 22s after that). 0 watched_with_joined rows.
--
-- Run step 1, check its count, then step 2. Re-running is harmless (the backup keeps every copy once).

-- 1. Backup: a copy of every orphan row, with when it was copied.
create table if not exists public.activity_feed_ww_orphans_backup_20261106 as
  select a.*, now() as backed_up_at from public.activity_feed a where false;

alter table public.activity_feed_ww_orphans_backup_20261106 enable row level security;
revoke all on public.activity_feed_ww_orphans_backup_20261106 from anon, authenticated;

with orphans as (
  select a.id
  from public.activity_feed a
  left join public.public_profiles pa on pa.id = a.actor_id
  left join public.public_profiles pr on pr.id = a.recipient_id
  where a.kind in ('watched_with', 'watched_with_added')
    and (
      not exists (select 1 from public.user_ratings r where r.owner_key = pa.user_id and r.slug = a.ref_id)
      or exists (select 1 from public.user_library_events e
                 where e.owner_key = pa.user_id and e.slug = a.ref_id and e.kind = 'unseen' and e.at >= a.created_at)
      or (a.kind = 'watched_with_added'
          and not exists (select 1 from public.user_ratings r where r.owner_key = pr.user_id and r.slug = a.ref_id))
    )
)
insert into public.activity_feed_ww_orphans_backup_20261106
select a.*, now()
from public.activity_feed a
join orphans o on o.id = a.id
where not exists (select 1 from public.activity_feed_ww_orphans_backup_20261106 b where b.id = a.id);

-- Check (expect 1 today):
-- select count(*) from public.activity_feed_ww_orphans_backup_20261106;

-- 2. Delete exactly the rows that were backed up and are still tags.
delete from public.activity_feed a
using public.activity_feed_ww_orphans_backup_20261106 b
where a.id = b.id
  and a.kind in ('watched_with', 'watched_with_added');

-- Restore, if ever needed (the backup's columns are activity_feed's plus backed_up_at):
-- insert into public.activity_feed (id, recipient_id, kind, actor_id, ref_id, ref_name, created_at)
--   select id, recipient_id, kind, actor_id, ref_id, ref_name, created_at
--   from public.activity_feed_ww_orphans_backup_20261106
--   on conflict (id) do nothing;
