-- merge_duplicate_film without user_collab_signal (NOT YET APPLIED; needs the owner's approval).
-- 20261023_drop_user_collab_signal.sql dropped the table, but the live function (last defined in
-- 20260930_merge_library_rename.sql) still moved/deleted that table's rows, so every merge failed
-- with: relation "user_collab_signal" does not exist (/api/cron/cleanup, lib/duplicate-sweep.ts,
-- and lib/film-rematch.ts). The body below is the live definition (pg_get_functiondef, 2026-11-05)
-- with those two statements removed; nothing else changes. Grants are restated as in 20260930.
create or replace function public.merge_duplicate_film(p_dup text, p_force boolean default false)
returns boolean language plpgsql security definer set search_path to public as $$
declare c text; dt text; dy int; ct text; cy int; hops int := 0;
begin
  select f.duplicate_of, f.title, f.year into c, dt, dy from films f where f.letterboxd_slug = p_dup;
  if c is null then return false; end if;
  while hops < 5 and exists (select 1 from films where letterboxd_slug = c and duplicate_of is not null) loop
    select duplicate_of into c from films where letterboxd_slug = c;
    hops := hops + 1;
  end loop;
  select title, year into ct, cy from films where letterboxd_slug = c and duplicate_of is null;
  if ct is null then return false; end if;
  -- p_force: the caller has already established the copy is this film another way (the repair
  -- job resolves an address with no Letterboxd page to a film another row already is).
  if not p_force then
    if not public.same_film_titles(dt, dy, ct, cy) then return false; end if;
    -- The copy's own title may be the wrong TMDB match's; its Letterboxd slug says what it is.
    if not public.slug_fits_title(p_dup, dy, ct) then return false; end if;
  end if;

  -- Film data: the real film keeps its own; what only the stand-in had moves over.
  update film_tone set slug = c where slug = p_dup and not exists (select 1 from film_tone where slug = c);
  delete from film_tone where slug = p_dup;
  update film_collection set slug = c where slug = p_dup and not exists (select 1 from film_collection where slug = c);
  delete from film_collection where slug = p_dup;
  update film_clusters set film_slug = c where film_slug = p_dup and not exists (select 1 from film_clusters where film_slug = c);
  delete from film_clusters where film_slug = p_dup;
  update film_cast set film_slug = c where film_slug = p_dup and not exists (select 1 from film_cast where film_slug = c);
  delete from film_cast where film_slug = p_dup;

  -- People's data: moved unless they already have the real film, which then wins.
  update user_ratings u set slug = c where slug = p_dup and not exists (select 1 from user_ratings v where v.owner_key = u.owner_key and v.slug = c);
  delete from user_ratings where slug = p_dup;
  update user_watchlist u set slug = c where slug = p_dup and not exists (select 1 from user_watchlist v where v.owner_key = u.owner_key and v.slug = c);
  delete from user_watchlist where slug = p_dup;
  update user_canon u set slug = c where slug = p_dup and not exists (select 1 from user_canon v where v.owner_key = u.owner_key and v.slug = c);
  delete from user_canon where slug = p_dup;
  update user_removed u set slug = c where slug = p_dup and not exists (select 1 from user_removed v where v.owner_key = u.owner_key and v.slug = c and v.kind = u.kind);
  delete from user_removed where slug = p_dup;
  update pick_exposures u set slug = c where slug = p_dup and not exists (select 1 from pick_exposures v where v.owner_key = u.owner_key and v.slug = c and v.surface = u.surface);
  delete from pick_exposures where slug = p_dup;
  update profile_films u set letterboxd_slug = c where letterboxd_slug = p_dup and not exists (select 1 from profile_films v where v.profile_id = u.profile_id and v.letterboxd_slug = c);
  delete from profile_films where letterboxd_slug = p_dup;
  update group_watchlist u set slug = c where slug = p_dup and not exists (select 1 from group_watchlist v where v.group_id = u.group_id and v.slug = c);
  delete from group_watchlist where slug = p_dup;
  update group_reactions u set slug = c where slug = p_dup and not exists (select 1 from group_reactions v where v.group_id = u.group_id and v.target_member = u.target_member and v.slug = c and v.reactor_id = u.reactor_id and v.emoji = u.emoji);
  delete from group_reactions where slug = p_dup;
  update rescore_queue u set slug = c where slug = p_dup and not exists (select 1 from rescore_queue v where v.owner_key = u.owner_key and v.slug = c);
  delete from rescore_queue where slug = p_dup;
  update user_library_events set slug = c where slug = p_dup;
  update taste_feedback set slug = c where slug = p_dup;
  update theater_votes set film_slug = c where film_slug = p_dup;
  update theaters set seed_slug = c where seed_slug = p_dup;

  -- The redirect first: guard_library_rated (rule 114) reads it to allow the library rename below.
  insert into film_slug_redirects (old_slug, new_slug) values (p_dup, c)
    on conflict (old_slug) do update set new_slug = excluded.new_slug;
  update film_slug_redirects set new_slug = c where new_slug = p_dup;

  -- The imported Letterboxd library: ratings are objects with a slug, the watchlist is slugs.
  update public_profiles p set library_json = jsonb_set(p.library_json, '{rated}', coalesce((
      select jsonb_agg(case when e->>'slug' = p_dup then jsonb_set(e, '{slug}', to_jsonb(c)) else e end order by i)
      from jsonb_array_elements(p.library_json->'rated') with ordinality t(e, i)
      where not (e->>'slug' = p_dup and exists (select 1 from jsonb_array_elements(p.library_json->'rated') e2 where e2->>'slug' = c))
    ), '[]'::jsonb))
  where jsonb_typeof(p.library_json->'rated') = 'array'
    and p.library_json->'rated' @> jsonb_build_array(jsonb_build_object('slug', p_dup));
  update public_profiles p set library_json = jsonb_set(p.library_json, '{watchlist}', coalesce((
      select jsonb_agg(case when e #>> '{}' = p_dup then to_jsonb(c) else e end order by i)
      from jsonb_array_elements(p.library_json->'watchlist') with ordinality t(e, i)
      where not (e #>> '{}' = p_dup and p.library_json->'watchlist' ? c)
    ), '[]'::jsonb))
  where jsonb_typeof(p.library_json->'watchlist') = 'array' and p.library_json->'watchlist' ? p_dup;

  delete from films where letterboxd_slug = p_dup;
  return true;
end $$;
revoke execute on function public.merge_duplicate_film(text, boolean) from public, anon, authenticated;
grant execute on function public.merge_duplicate_film(text, boolean) to service_role;
