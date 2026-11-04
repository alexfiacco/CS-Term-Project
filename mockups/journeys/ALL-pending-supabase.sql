-- ===== learn-groundwork-migration.sql =====
-- Learning from our own predictions, groundwork (owner, 2026-11-04; the correction itself stays
-- OFF). Design: mockups/journeys/learn-from-predictions-report.md; code: lib/taste/calibration.ts,
-- lib/taste/calibration-io.ts.
--
-- 1. Honest logging. Every match_predictions row and every rating_predictions "shown" row also
--    keeps the RAW model number (before any post-hoc correction), the model version that produced
--    the stored score, and (match_predictions) the account's rated count, which picks the
--    population line. Learning reads raw -> outcome only, never its own corrected output.
-- 2. The permanent holdout: about 10% of (owner, film) pairs, by hash (lib/taste/calibration.ts
--    isHoldout), flagged when the row is written. Never used to fit; the weekly monitor scores it.
-- 3. A held-out guess (rating_predictions source 'held_out', the daily background pass in
--    lib/rating-predictions.ts backfillHeldOut) never replaces a 'shown' row: the code skips them
--    and this trigger refuses the overwrite in the database as well.
--
-- Safe to apply on the live database: nullable columns and one trigger, nothing rewritten. Until it
-- is applied the app writes rows without these columns (logged once per table) and the nightly
-- status reports columnsMissing.

alter table public.match_predictions
  add column if not exists raw_predicted smallint check (raw_predicted between 0 and 100),
  add column if not exists model_version integer,
  add column if not exists n_rated integer,
  add column if not exists holdout boolean;

alter table public.rating_predictions
  add column if not exists raw_predicted smallint check (raw_predicted between 0 and 100),
  add column if not exists model_version integer,
  add column if not exists n_rated integer,
  add column if not exists holdout boolean;

create or replace function public.rating_predictions_keep_shown()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- Skipping the row (return null) leaves the shown prediction exactly as it was.
  if old.source = 'shown' and new.source is distinct from 'shown' then
    return null;
  end if;
  return new;
end;
$$;
revoke all on function public.rating_predictions_keep_shown() from public, anon, authenticated;

drop trigger if exists rating_predictions_keep_shown on public.rating_predictions;
create trigger rating_predictions_keep_shown
  before update on public.rating_predictions
  for each row execute function public.rating_predictions_keep_shown();

-- Both stay server-only (rule 21): RLS on, no policies, nothing granted to the public roles.
alter table public.match_predictions enable row level security;
alter table public.rating_predictions enable row level security;
revoke all on table public.match_predictions from anon, authenticated;
revoke all on table public.rating_predictions from anon, authenticated;

-- ===== rating-chips-migration.sql =====
-- Rating chips (owner-approved, 2026-11-04, mockups/journeys/rating-flow-v5; lib/rating-chips.ts):
-- the take step's optional, private chips on hits and misses, saved in the same rating_reasons row
-- as "What held it back?" (rule 544). Each entry is "<polarity>:<chip id>" ("pos:story",
-- "neg:too_long"); the five bare ids rows already hold stay valid and read as misses.
-- Until this is applied the code falls back to the five bare ids (lib/rating-chips-server.ts saveChips).
-- Server only: RLS stays on, no policies.
alter table public.rating_reasons drop constraint if exists rating_reasons_reasons_ok;
alter table public.rating_reasons add constraint rating_reasons_reasons_ok check (
  reasons is null or (
    cardinality(reasons) between 1 and 24
    and array_to_string(reasons, '|') ~ '^((pos|neg):[a-z0-9_]{1,60}|pacing|emotional_payoff|story|characters|ending)(\|((pos|neg):[a-z0-9_]{1,60}|pacing|emotional_payoff|story|characters|ending))*$'
  )
);
-- "What others picked" reads one film's rows (counts only).
create index if not exists rating_reasons_slug_idx on public.rating_reasons (slug);
alter table public.rating_reasons enable row level security;
revoke all on table public.rating_reasons from anon, authenticated;

-- ===== recuts-migration.sql =====
-- Recut (owner, 2026-11-04: "Start all"; "the recut behind a paywall after 3 free uses"; rule 1077).
-- Spec: docs/BACKLOG.md "Recut: build me a movie from a sentence". Mocks: recut-mock.png,
-- journeys/beli-5-sentence-search.png.
--
-- recuts       one row per Recut started: its share link (/recut/<id>) and the monthly count.
--   id         short random id (base64url, 8 characters), the public link.
--   user_id    who started it (null signed out). Never shown; used only to count the month.
--   handle     the sharer's handle when their profile was public at the time, else null. The
--              only personal thing the public page shows.
--   sentence   what they typed or said (no audio is ever stored).
--   query      the read: anchor, dials, facts, words not used (lib/recut.ts RecutQuery).
--   top        the first three films as shown to the sharer (public film data only, no match %).
--   source     how the sentence was read: model | cache | keywords.
--   counted    false for a shared link opened by someone else (always free) and follow-ups.
--
-- Safe on the live database: one new empty table and one index; nothing existing changes.
-- RLS on with no policies: only the server (service role) reads or writes it. A person's rows go
-- with their account (on delete cascade).

create table if not exists public.recuts (
  id          text primary key,
  user_id     uuid references auth.users (id) on delete cascade,
  handle      text,
  sentence    text not null,
  query       jsonb not null,
  anchor_title text,
  top         jsonb not null default '[]'::jsonb,
  source      text not null default 'keywords' check (source in ('model', 'cache', 'keywords')),
  counted     boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists recuts_user_month on public.recuts (user_id, created_at) where counted;

alter table public.recuts enable row level security;

-- ===== invites-migration.sql =====
-- Invite bonuses (owner, 2026-11-04: "Start all"; "ship all"; rule 1078; mock
-- journeys/beli-8-invite-reward.png). A thank-you on top, never a gate: nothing in Montage is locked
-- behind inviting, and sign-up never needs an invite.
--
-- invites               one row per account that joined from someone's link (or named them in the
--                       iPhone's optional "Who invited you?" step). One inviter per invitee, first wins.
--   invitee_profile_id  the new member's public profile id (text, as public_profiles.id).
--   inviter_profile_id  whose link it was.
--   invitee_user_id     the new member's account (text, as public_profiles.user_id).
--   via                 link | asked.
--   qualified_at        stamped the first time the invitee is seen with 15+ rated films
--                       (lib/invite-bonus.ts inviteStatus); the month it lands in is the month its
--                       +3 Recuts count for. Never cleared.
--
-- Safe on the live database: one new empty table and an index; nothing existing changes. RLS on with
-- no policies: only the server (service role) reads or writes it. Rows go with either profile.

create table if not exists public.invites (
  invitee_profile_id text primary key references public.public_profiles (id) on delete cascade,
  inviter_profile_id text not null references public.public_profiles (id) on delete cascade,
  invitee_user_id    text,
  via                text not null default 'link' check (via in ('link', 'asked')),
  created_at         timestamptz not null default now(),
  qualified_at       timestamptz,
  check (invitee_profile_id <> inviter_profile_id)
);

create index if not exists invites_inviter on public.invites (inviter_profile_id, created_at);

alter table public.invites enable row level security;

-- ===== film-ratings-migration.sql =====
-- How many Montage ratings a film has, and their average (owner, 2026-11-04,
-- mockups/journeys/beli-1-friends-score: "Start all"; docs/INVARIANTS.md, "Your people's rating").
-- A card with no friends' ratings says "12k ratings" from 50 Montage ratings up; the film page's
-- "Everyone on Montage 3.9★ · 12k ratings". Montage ratings only: user_ratings (rated here), never
-- Letterboxd's counts. Aggregates only: no rater is named. Until this is applied the app reads the
-- page's films from user_ratings directly (lib/friends-rating.ts montageRatings).
--
-- Read-only function and one index; no table is created, so no new RLS policy is needed
-- (user_ratings keeps its own). Service role only.
create index if not exists user_ratings_slug_rated_idx on public.user_ratings (slug) where rating is not null;

create or replace function public.montage_film_ratings(p_slugs text[])
returns table (slug text, n bigint, avg real)
language sql stable
set search_path = public, extensions, pg_temp
as $$
  select r.slug, count(*)::bigint, avg(r.rating)::real
  from public.user_ratings r
  where r.slug = any(p_slugs) and r.rating is not null and r.rating > 0
  group by r.slug;
$$;

revoke execute on function public.montage_film_ratings(text[]) from public, anon, authenticated;
grant execute on function public.montage_film_ratings(text[]) to service_role;

-- ===== lanes-110-write.sql =====
begin;
delete from film_clusters_backfill_20261104 where status='proposed';
insert into film_clusters_backfill_20261104 (film_slug,cluster_id,weight,status,note) select s,c,w,'approved','kNN/centroid shortlist + hand review; owner approved 2026-11-04 (JSA left out; all kept)' from (values ('finding-dory',567,.75),('transformers',531,.75),('minions-the-rise-of-gru',615,.75),('frances-ha',657,.85),('the-hangover-part-iii',644,.75),('watchmen',578,.85),('watchmen',439,.75),('tmdb-109418',644,.85),('o-brother-where-art-thou',611,.75),('transformers-dark-of-the-moon',531,.75),('tmdb-614409',503,.75),('tmdb-385687',477,.75),('the-lego-movie-2-the-second-part',581,.85),('roman-holiday',487,.85),('tmdb-337401',328,.75),('fantasia',612,.75),('alvin-and-the-chipmunks-the-squeakquel-2009',422,.75),('amsterdam-2022',439,.75),('valentines-day',658,.85),('ricky-stanicky',644,.75),('tmdb-475303',665,.85),('tmdb-11451',617,.75),('tmdb-20662',663,.75),('pokemon-the-first-movie',553,.85),('the-lego-ninjago-movie',581,.75),('frank-2014',382,.75),('pee-wees-big-adventure',611,.75),('anna-2019',452,.85),('anna-2019',476,.75),('witness',455,.85),('tmdb-1072876',433,.85),('tmdb-11838',653,.85),('what-lies-beneath',653,.75),('tmdb-43947',599,.85),('perfect-strangers-2016',644,.75),('tmdb-9896',611,.75),('magic-mike-xxl',611,.75),('fantasia-2000',612,.75),('swingers',657,.75),('tmdb-4442',609,.75),('altered-states',377,.85),('pain-hustlers',585,.75),('tmdb-16643',668,.75),('midnight-special',667,.75),('tmdb-10028',322,.75),('the-toxic-avenger-2023',578,.75),('the-toxic-avenger-2023',437,.75),('memories',612,.85),('tmdb-2362',536,.75),('tmdb-1214506',625,.75),('tmdb-72710',531,.75),('tmdb-46146',430,.85),('tmdb-46146',431,.75),('tmdb-8780',643,.85),('tmdb-9494',643,.85),('tmdb-431580',607,.85),('tmdb-862551',644,.75),('tmdb-570503',485,.75),('tmdb-13041',317,.75),('tmdb-11199',611,.75),('the-last-witch-hunter',558,.75),('tmdb-2069',447,.75),('hoop-dreams',342,.75),('something-from-tiffanys',610,.75),('kicking-and-screaming',657,.75),('the-muppets-take-manhattan',322,.75),('tmdb-11827',612,.75),('tmdb-20992',505,.75),('tmdb-26405',432,.75),('tmdb-10753',475,.75),('sullivans-travels',590,.75),('tmdb-146239',662,.75),('black-rain',475,.75),('il-sorpasso',611,.75),('tmdb-19933',552,.85),('the-burial',445,.85),('tmdb-1061671',625,.85),('leave-her-to-heaven',453,.75),('sallie-gardner-at-a-gallop',675,.85),('tmdb-148265',599,.75),('diego-maradona',625,.85),('jexi',547,.75),('tmdb-179826',667,.75),('a-bag-of-marbles-2017',307,.85),('cabaret-1993',666,.75),('exit-2019',380,.75),('ganja-hess',427,.75),('italianamerican',625,.75),('kind-hearts-and-coronets',358,.75),('legally-blonde-the-musical',666,.85),('mr-mom',662,.75),('pokemon-heroes',553,.85),('spies-like-us',360,.75),('tmdb-1032760',398,.75),('tmdb-11286',611,.75),('tmdb-12521',429,.75),('tmdb-14906',612,.75),('tmdb-1492',663,.85),('tmdb-15356',635,.75),('tmdb-4480',406,.85),('tmdb-46929',612,.75),('tmdb-601635',591,.85),('tmdb-9822',607,.75),('when-we-were-kings',625,.75),('white-bird-2023',307,.85),('sonic-the-hedgehog-3',543,.75),('rocky',331,.75),('rocky-ii',331,.75),('rocky-iii',331,.75),('rocky-iv',331,.75),('creed-ii',331,.75),('the-devil-and-daniel-johnston',625,.85),('tmdb-318044',625,.85)) v(s,c,w);
insert into film_clusters (film_slug,cluster_id,weight) select film_slug,cluster_id,weight from film_clusters_backfill_20261104 where status='approved' on conflict do nothing;
update film_clusters_backfill_20261104 b set status='inserted' where status='approved' and not exists (select 1 from film_clusters_backup_20261104 k where k.film_slug=b.film_slug and k.cluster_id=b.cluster_id);
update clusters c set size=(select count(*) from film_clusters fc where fc.cluster_id=c.id) where c.id in (select distinct cluster_id from film_clusters_backfill_20261104);
update clusters set name='Underdog Fighter Rise' where id=331 and name='Martial Arts Underdog Rise';
commit;
