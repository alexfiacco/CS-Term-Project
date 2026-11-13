-- 9-fix-phantom-watches.sql (rule 2021, 2026-11-13). OPTIONAL: the app already reads these right.
--
-- The phantom watch ("Your watches 3" for a film seen twice) was never stored: it came from the read
-- (mergeWatchHistory counted a diary-synced watch AND the import's diary count for the same watch).
-- The fix on branch b40-watches corrects every affected film on read; no re-import, no SQL needed.
--
-- What IS stored wrong: the diary backfill of 2026-11-11 wrote each diary-synced watch with the
-- film's CURRENT stars, not the stars given on that watch (The Odyssey: Jul 26 stored 5, the owner
-- gave it 4.5 that night). The new read hides a copied rating on a non-latest diary watch, so this
-- is only to make the stored rows honest. The real per-watch stars are not in the database
-- (library_json keeps no diary row ratings before rule 2021); a fresh Letterboxd import restores them.
--
-- Scope today: 4 events in 2 accounts. Run the SELECT first; the UPDATE only nulls those stars.

-- 1. Preview
with prof as (
  select distinct on (user_id) user_id::text uid, library_json
  from public_profiles where user_id is not null order by user_id, updated_at desc
), imp as (
  select uid, f->>'slug' slug, (f->>'lc')::int lc, (f->>'w')::date w, (f->>'rating')::numeric rating
  from prof, jsonb_array_elements(coalesce(library_json->'rated', '[]'::jsonb)) f
), lb as (
  select owner_key, slug, substring(kind from 4 for 10)::date d, nullif(split_part(kind, ':', 3), '')::bigint id
  from user_removed where kind like 'lb:%'
)
select e.id, left(e.owner_key, 8) owner, e.slug, e.watched_on, e.rating, i.w import_latest, coalesce(ur.rating, i.rating) current_stars
from user_library_events e
join imp i on i.uid = e.owner_key and i.slug = e.slug
join lb on lb.owner_key = e.owner_key and lb.slug = e.slug and lb.d = e.watched_on and (lb.id is null or lb.id = e.id)
left join user_ratings ur on ur.owner_key = e.owner_key and ur.slug = e.slug
where e.kind = 'seen' and e.watched_on < i.w - 1 and i.lc >= 2
  and e.rating = coalesce(ur.rating, i.rating)
  and not exists (select 1 from user_library_events u where u.owner_key = e.owner_key and u.slug = e.slug and u.kind = 'unseen');

-- 2. Fix (only after the preview shows the rows you expect: today 1405, 1457, 1459, 1461)
-- begin;
-- update user_library_events set rating = null where id in (1405, 1457, 1459, 1461) and kind = 'seen';
-- commit;
