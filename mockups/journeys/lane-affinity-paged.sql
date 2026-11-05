-- NOT YET APPLIED. Speed fix 4 (rule 1139): people's lanes in pages, resumable.
--
-- refresh_lane_affinity() (20261015_lane_affinity_incremental.sql) works out every profile's input
-- fingerprint in one statement and, on a full run (lanes changed, or weekly), re-reads every
-- library in the same transaction: one call that grows with every member and has no place to stop
-- and carry on. This adds refresh_lane_affinity_page, the same work for one page of profiles in id
-- order (after p_after, at most p_limit), so app/api/cron/lane-affinity can stop before its budget,
-- keep its cursor and carry on in a fresh invocation or the next night.
--
-- Same rows: each profile's fingerprint, the test for whether it is redone and its lane sums are the
-- old function's, word for word, restricted to the page (the per-profile aggregates are lateral
-- joins instead of one grouped join over everyone: the same strings, so the stored fingerprints
-- still match and nothing is redone because of the switch). Whether the pass is a full run is
-- decided on its first page (p_full null) and handed back, with the lane fingerprint it was decided
-- on; the cron passes both to every later page, so one pass is all full or all incremental, and
-- '*lanes' is stamped (with the fingerprint from the pass's start) only when its last page is done.
-- One call at a time (an advisory lock, as refresh_crowd_film_means_step): a second gets {busy}.
--
-- Exact effect once applied:
--  - Adds function public.refresh_lane_affinity_page(p_after text, p_limit integer, p_full boolean,
--    p_lanes_sig text) returning jsonb { done, last, profiles, redone, rows, full, lanes_sig } or
--    { busy: true }. Execute-only for service_role.
--  - Changes nothing existing: refresh_lane_affinity() stays, and the cron falls back to it while
--    this function is missing (PGRST202).
--  - Data: writes user_cluster_affinity and lane_affinity_marks exactly as the old function does,
--    a page at a time.
--
-- Tested on a local Postgres 16 against the old function (scripts/sim-lane-affinity.sh): identical
-- user_cluster_affinity and lane_affinity_marks on 3,000 made-up profiles, full and incremental.

begin;

create or replace function public.refresh_lane_affinity_page(p_after text, p_limit integer, p_full boolean default null, p_lanes_sig text default null)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  v_rows integer := 0;
  v_n integer;
  v_todo integer;
  v_last text;
  lanes_sig text;
  full_run boolean;
begin
  if not pg_try_advisory_xact_lock(hashtext('public.refresh_lane_affinity_page')) then
    return jsonb_build_object('busy', true);
  end if;
  -- Several pages in one transaction (a test, or a caller's loop) reuse the names: start clean.
  drop table if exists _aff_page, _aff_sig, _aff_todo, _fresh_aff;
  if p_full is null then
    select md5(count(*)::text || ':' || coalesce(sum(hashtext(film_slug || '|' || cluster_id || '|' || weight))::text, ''))
      into lanes_sig from film_clusters where cluster_id >= 300;
    full_run := not exists (
      select 1 from lane_affinity_marks m
      where m.profile_id = '*lanes' and m.sig = lanes_sig and m.refreshed_at > now() - interval '7 days');
  else
    full_run := p_full;
    lanes_sig := p_lanes_sig;
  end if;

  create temp table _aff_page on commit drop as
    select p.id pid from public_profiles p
    where p.username is not null and (p_after is null or p.id > p_after)
    order by p.id limit greatest(1, p_limit);
  select count(*), max(pid) into v_n, v_last from _aff_page;

  create temp table _aff_sig on commit drop as
    select p.id pid, md5(concat_ws('|', coalesce(p.library_changed_at::text, '-'), coalesce(p.user_id, '-'),
                                   coalesce(r.s, '-'), coalesce(x.s, '-'))) sig
    from public_profiles p
    left join lateral (select string_agg(u.slug || '=' || u.rating::text, ',' order by u.slug) s
                       from user_ratings u where u.owner_key = p.user_id::text and u.rating is not null) r on true
    left join lateral (select string_agg(y.slug, ',' order by y.slug) s
                       from user_removed y where y.owner_key = p.user_id::text and y.kind = 'rating') x on true
    where p.id in (select pid from _aff_page);
  create temp table _aff_todo on commit drop as
    select s.pid, s.sig from _aff_sig s
    where full_run
       or not exists (select 1 from lane_affinity_marks m where m.profile_id = s.pid and m.sig = s.sig)
       or not exists (select 1 from user_cluster_affinity a where a.profile_id = s.pid);
  select count(*) into v_todo from _aff_todo;

  if v_todo > 0 then
    create temp table _fresh_aff on commit drop as
    with lib as (
      select p.id pid, r->>'slug' slug, (r->>'rating')::numeric rating
      from public_profiles p, jsonb_array_elements(coalesce(p.library_json->'rated', '[]'::jsonb)) r
      where p.username is not null and p.id in (select pid from _aff_todo)
        and r->>'slug' is not null and coalesce(r->>'rating', '') <> ''
    ),
    app as (
      select p.id pid, u.slug, u.rating::numeric rating
      from public_profiles p join user_ratings u on u.owner_key = p.user_id::text
      where p.username is not null and p.id in (select pid from _aff_todo) and u.rating is not null
    ),
    merged as (
      select pid, slug, rating from app
      union all
      select l.pid, l.slug, l.rating from lib l where not exists (select 1 from app a where a.pid = l.pid and a.slug = l.slug)
    ),
    rated as (
      select m.* from merged m join public_profiles p on p.id = m.pid
      where not exists (select 1 from user_removed x where x.owner_key = p.user_id::text and x.kind = 'rating' and x.slug = m.slug)
    )
    select r.pid profile_id, fc.cluster_id,
           round(sum((r.rating - 3) * fc.weight)::numeric, 3) affinity,
           round(sum(fc.weight)::numeric, 3) exposure
    from rated r join film_clusters fc on fc.film_slug = r.slug and fc.cluster_id >= 300
    group by 1, 2;
    -- Only profiles with rows are replaced: a profile whose read came back empty keeps what it had.
    delete from user_cluster_affinity where profile_id in (select distinct profile_id from _fresh_aff);
    insert into user_cluster_affinity (profile_id, cluster_id, affinity, exposure)
      select profile_id, cluster_id, affinity, exposure from _fresh_aff;
    get diagnostics v_rows = row_count;

    insert into lane_affinity_marks (profile_id, sig, refreshed_at)
      select pid, sig, now() from _aff_todo
    on conflict (profile_id) do update set sig = excluded.sig, refreshed_at = excluded.refreshed_at;
  end if;

  -- The last page (a short one): a full pass stamps the lanes it was decided on.
  if v_n < greatest(1, p_limit) and full_run then
    insert into lane_affinity_marks (profile_id, sig, refreshed_at) values ('*lanes', lanes_sig, now())
    on conflict (profile_id) do update set sig = excluded.sig, refreshed_at = excluded.refreshed_at;
  end if;
  return jsonb_build_object('done', v_n < greatest(1, p_limit), 'last', v_last, 'profiles', v_n, 'redone', v_todo,
                            'rows', v_rows, 'full', full_run, 'lanes_sig', lanes_sig);
end;
$$;
revoke all on function public.refresh_lane_affinity_page(text, integer, boolean, text) from public, anon, authenticated;
grant execute on function public.refresh_lane_affinity_page(text, integer, boolean, text) to service_role;

commit;
