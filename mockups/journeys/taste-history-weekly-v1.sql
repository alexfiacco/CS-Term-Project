-- Taste history by week (Montage rule 1203; owner, 2026-11-06: "Track how someone's taste,
-- archetype, Film DNA, all the things that go into taste change over time. We're not showing it
-- to the consumer yet, but we'll track it, maybe for Pro or for Montages.").
--
-- Two server-only tables beside public.taste_snapshots (monthly, kept as is):
--   taste_history_weekly  one row per profile per ISO week (Monday, UTC), rewritten on every
--                         publish (lib/taste-snapshots.ts recordTasteWeek, called from
--                         snapshotTaste), so each row holds that week's last state.
--   taste_change_events   one row the moment the archetype or the streaks change against the last
--                         stored week, so a change is exact in time, not only weekly.
-- The app no-ops until these exist. Account deletion clears both (app/api/delete-account).
-- profile_id is text, as public.public_profiles.id and public.taste_snapshots.profile_id are.
-- Server only (INVARIANTS rule 21): RLS on, no policies, nothing granted to the public roles.

create table if not exists public.taste_history_weekly (
  profile_id       text not null,
  week             date not null,          -- the ISO week's Monday (UTC)
  archetype_id     text,
  archetype_label  text,
  top              jsonb,                  -- [{ id, weight }], the top 3
  scores           jsonb,                  -- [{ id, share, lift, score }], every archetype (share/lift null on a graph read)
  streaks          text[],                 -- the streak ids shown beside the name, in order
  unified          boolean,                -- read by the one taste model (rule 587)
  dna              jsonb,                  -- [{ id, score }], the nine Film DNA strands (tasteDnaV2); [] when none
  dna8             jsonb,                  -- [{ id, score }], the eight-dimension Film DNA vector
  axes             jsonb,                  -- [{ id, value }]
  total_films      int,
  rated_films      int,
  favorite_films   int,                    -- loved films (isLoved); null on rows seeded before it was stored
  defining         text[],                 -- the five defining film slugs, in order
  identity_version int,                    -- identityScoringVersion of the read
  updated_at       timestamptz not null default now(),
  primary key (profile_id, week)
);
alter table public.taste_history_weekly enable row level security;
revoke all on public.taste_history_weekly from anon, authenticated;

create table if not exists public.taste_change_events (
  id              bigint generated always as identity primary key,
  profile_id      text not null,
  at              timestamptz not null default now(),
  kind            text not null check (kind in ('archetype', 'streak')),
  from_value      text,                    -- archetype id, or the streak ids sorted and comma-joined
  to_value        text,
  films_at_change int
);
create index if not exists taste_change_events_profile_at on public.taste_change_events (profile_id, at);
alter table public.taste_change_events enable row level security;
revoke all on public.taste_change_events from anon, authenticated;

-- This week's starting point for every published profile, from the stored read, so the first
-- change after this is caught. Share and lift arrive with each profile's next publish.
insert into public.taste_history_weekly (profile_id, week, archetype_id, archetype_label, top, scores, streaks, unified,
  dna, dna8, axes, total_films, rated_films, favorite_films, defining, identity_version)
select p.id,
  date_trunc('week', now() at time zone 'utc')::date,
  p.result_json->'archetype'->>'id',
  p.result_json->'archetype'->>'label',
  coalesce((select jsonb_agg(jsonb_build_object('id', t.v->>'id', 'weight', (t.v->>'weight')::numeric) order by t.n)
            from jsonb_array_elements(p.result_json->'archetype'->'top') with ordinality t(v, n) where t.n <= 3), '[]'::jsonb),
  coalesce((select jsonb_agg(jsonb_build_object('id', s->>'id', 'share', (s->>'share')::numeric, 'lift', (s->>'lift')::numeric, 'score', (s->>'score')::numeric))
            from jsonb_array_elements(p.result_json->'archetype'->'scores') s), '[]'::jsonb),
  coalesce((select array_agg(t.v->>'id' order by t.n)
            from jsonb_array_elements(p.result_json->'archetype'->'top') with ordinality t(v, n) where t.n > 1), '{}'::text[]),
  coalesce((p.result_json->'archetype'->>'unified')::boolean, false),
  coalesce((select jsonb_agg(jsonb_build_object('id', d->>'id', 'score', (d->>'score')::numeric))
            from jsonb_array_elements(p.result_json->'tasteDnaV2'->'strands') d), '[]'::jsonb),
  coalesce((select jsonb_agg(jsonb_build_object('id', d->>'id', 'score', (d->>'score')::numeric))
            from jsonb_array_elements(p.result_json->'tasteDNAVector') d), '[]'::jsonb),
  coalesce((select jsonb_agg(jsonb_build_object('id', a->>'id', 'value', (a->>'value')::numeric))
            from jsonb_array_elements(p.result_json->'axes') a), '[]'::jsonb),
  coalesce((p.result_json->>'totalFilms')::int, 0),
  coalesce((p.result_json->>'ratedFilms')::int, 0),
  (p.result_json->>'favoriteFilms')::int,
  coalesce((select array_agg(f.v->>'slug' order by f.n)
            from jsonb_array_elements(p.result_json->'signatures') with ordinality f(v, n) where f.n <= 5 and f.v->>'slug' is not null), '{}'::text[]),
  (p.result_json->>'identityScoringVersion')::int
from public.public_profiles p
where p.result_json ? 'archetype'
on conflict (profile_id, week) do nothing;
