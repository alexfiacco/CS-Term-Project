-- The monthly "How the model did" email (rule 2016; lib/model-report.ts, /api/cron/model-report).
--
-- One read that hands back COUNTS, never rows: the rated pre-watch predictions (match_predictions) and the
-- held-out guesses (rating_predictions source 'held_out', paired with the stars from user_ratings, else the
-- published library's rated list) grouped by (stored match, stars, ...), plus the month's write counts per UTC
-- day. No account id, handle, email or film leaves the database: the email is built from these cells alone
-- (the shown band and the verdict are worked out in lib/model-report.ts with pctShown and bandVerdict, so the
-- display curve and the verdict rule stay in one place).
--
-- p_from / p_to: the month's window [p_from, p_to). "This month" is rated_at in it for match_predictions,
-- the guess's own rated_at (when it was written) for rating_predictions, predicted_at for writes.
--
-- Safe to apply on the live database: one new read-only function, nothing written. Until it is applied
-- lib/model-report.ts reads the same columns itself (bounded) and builds the same cells.

create or replace function public.model_report_cells(p_from timestamptz, p_to timestamptz)
returns jsonb
language sql
stable
set search_path = ''
as $$
  with mp as (
    select predicted, rating, coalesce(displayed, false) as displayed, rated_at, predicted_at,
           taste_layer, taste_layer_v, raw_predicted, model_version, owner_key
    from public.match_predictions
  ),
  held as (
    select owner_key, slug, predicted, rated_at from public.rating_predictions where source = 'held_out'
  ),
  owners as (select distinct owner_key from held),
  prof as (
    select distinct on (p.user_id) p.user_id, p.library_json
    from public.public_profiles p join owners o on o.owner_key = p.user_id
    order by p.user_id, p.updated_at desc nulls last
  ),
  lib as (
    select prof.user_id as owner_key, e->>'slug' as slug,
           case when jsonb_typeof(e->'rating') = 'number' then (e->>'rating')::real end as rating
    from prof, jsonb_array_elements(coalesce(prof.library_json->'rated', '[]'::jsonb)) e
  ),
  lib_best as (select owner_key, slug, max(rating) as rating from lib where rating > 0 group by 1, 2),
  held_rated as (
    select h.predicted, coalesce(ur.rating, lb.rating) as rating,
           (h.rated_at >= p_from and h.rated_at < p_to) as m
    from held h
    left join public.user_ratings ur on ur.owner_key = h.owner_key and ur.slug = h.slug and ur.rating > 0
    left join lib_best lb on lb.owner_key = h.owner_key and lb.slug = h.slug
  ),
  days as (
    select (d at time zone 'UTC')::date as day from generate_series(p_from, p_to - interval '1 day', interval '1 day') d
  )
  select jsonb_build_object(
    'mp', (select coalesce(jsonb_agg(jsonb_build_array(c.p, c.r, c.d, c.m, c.tl, c.v, c.n)), '[]'::jsonb) from (
      select predicted as p, rating as r, displayed as d, (rated_at >= p_from and rated_at < p_to) as m,
             taste_layer as tl, (taste_layer_v is not null) as v, count(*)::int as n
      from mp where rating > 0 group by 1, 2, 3, 4, 5, 6) c),
    'rp', (select coalesce(jsonb_agg(jsonb_build_array(c.p, c.r, c.m, c.n)), '[]'::jsonb) from (
      select predicted as p, rating as r, m, count(*)::int as n from held_rated where rating > 0 group by 1, 2, 3) c),
    'tl', (select jsonb_build_object(
      'first', min(predicted_at) filter (where taste_layer_v is not null),
      'accounts', count(distinct owner_key) filter (where rating > 0 and taste_layer_v is not null and taste_layer <> 0)
    ) from mp),
    'health', jsonb_build_object(
      'mpWritten', (select count(*) from mp where predicted_at >= p_from and predicted_at < p_to),
      'mpRated', (select count(*) from mp where rated_at >= p_from and rated_at < p_to and rating > 0),
      'mpDisplayed', (select count(*) from mp where rated_at >= p_from and rated_at < p_to and rating > 0 and displayed),
      'mpNoRaw', (select count(*) from mp where predicted_at >= p_from and predicted_at < p_to and (raw_predicted is null or model_version is null)),
      'mpLayerLogged', (select count(*) from mp where predicted_at >= p_from and predicted_at < p_to and taste_layer_v is not null),
      'rpShown', (select count(*) from public.rating_predictions where source = 'shown' and rated_at >= p_from and rated_at < p_to),
      'rpHeld', (select count(*) from held where rated_at >= p_from and rated_at < p_to),
      'rpHeldNoStars', (select count(*) from held_rated where rating is null)
    ),
    'days', (select coalesce(jsonb_agg(jsonb_build_array(d.day, coalesce(a.n, 0), coalesce(b.n, 0), coalesce(c.n, 0)) order by d.day), '[]'::jsonb)
      from days d
      left join (select (predicted_at at time zone 'UTC')::date as day, count(*)::int as n from mp
                 where predicted_at >= p_from and predicted_at < p_to group by 1) a on a.day = d.day
      left join (select (rated_at at time zone 'UTC')::date as day, count(*)::int as n from public.rating_predictions
                 where source = 'shown' and rated_at >= p_from and rated_at < p_to group by 1) b on b.day = d.day
      left join (select (rated_at at time zone 'UTC')::date as day, count(*)::int as n from held
                 where rated_at >= p_from and rated_at < p_to group by 1) c on c.day = d.day)
  );
$$;

-- Server-only, like the tables it reads (rule 21): only the service role may call it.
revoke all on function public.model_report_cells(timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.model_report_cells(timestamptz, timestamptz) to service_role;
