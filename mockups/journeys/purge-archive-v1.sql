-- purge-archive-v1.sql: account deletion also clears the `archive` schema (rule 169).
--
-- Found 2026-11-06: public.purge_account_backups() (called by app/api/delete-account before the
-- profile rows and the sign-in go) only scanned public.*backup* tables, so a deleted person's rows
-- survived in archive.*:
--   archive.rating_predictions_backup_20261027  owner_key (= auth user id)   1,921 rows, 5 people
--   archive.rating_reasons_backup_20261028      owner_key (= auth user id)   1 row
--   archive.backup_20261002_film_dna            id (= profile id), username  13 rows (dna, vec, archetype)
-- Checked and holding no per-person rows:
--   archive.backup_20260928_lb_ratings          letterboxd_slug, counts only (0 rows)
--   archive.cleanup_20261105_table_rows         jsonb copies of 21 dropped catalog backups (films,
--                                               cast, lanes, clusters, embeddings); no row has a
--                                               user_id/owner_key/username/profile_id/handle key
--   archive.cleanup_20261105_tables, _cache_keep, _ai_cache_stale_counts   metadata only
--   private.*  no tables.  The old `backups` schema no longer exists.
--
-- Backs up nothing: these tables ARE the backups, and the point is that a deleted person's copy goes.
--
-- What changes:
--   1. The id scan (any row whose JSON text holds the account id or a profile id as a quoted value,
--      ids of 8+ characters only, as before) now runs over public.*backup* AND every table in
--      archive.*, so a future archive backup is covered with no edit here. Any id column of any
--      name (user_id, owner_key, profile_id, id, or an id inside jsonb) is caught by this scan.
--   2. New: a handle scan. Every public.*backup* or archive.* table with a column named `username`
--      or `handle` loses rows whose value equals one of the account's usernames (case-insensitive).
--      This is a column match, never a row-text match, so a film whose slug equals a username
--      ("her") is still untouched. Usernames are read from public_profiles, which delete-account
--      deletes after this call.
--   3. SECURITY DEFINER (owner postgres). The current function is SECURITY INVOKER, and service_role
--      has no USAGE on schema archive, so an invoker version would fail with "permission denied for
--      schema archive" and roll back the public purge with it. search_path is pinned
--      (public, pg_temp); execute stays service_role only.
-- Idempotent: create or replace + revoke/grant. Signature and return value (rows deleted) unchanged,
-- so app/api/delete-account needs no change.

create or replace function public.purge_account_backups(p_keys text[])
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  t record;
  n integer := 0;
  c integer;
  ids text[];
  pats text[];
  names text[];
begin
  -- Account and profile ids only for the row-text scan (a uuid and random 8-character ids): a
  -- username can equal a film slug ("her"), and film backups must not lose that film's row.
  select array_agg(distinct k) into ids from unnest(p_keys) k where k is not null and length(k) >= 8;
  if ids is null then return 0; end if;
  select array_agg('%"' || k || '"%') into pats from unnest(ids) k;
  select array_agg(distinct lower(p.username)) into names from public.public_profiles p
   where (p.id::text = any (ids) or p.user_id::text = any (ids)) and coalesce(p.username, '') <> '';

  -- 1. Ids anywhere in the row: public.*backup* and all of archive.*.
  for t in select ns.nspname, c2.relname from pg_class c2 join pg_namespace ns on ns.oid = c2.relnamespace
           where c2.relkind in ('r', 'p')
             and ((ns.nspname = 'public' and c2.relname like '%backup%') or ns.nspname = 'archive') loop
    execute format('delete from %I.%I x where row_to_json(x)::text like any ($1)', t.nspname, t.relname) using pats;
    get diagnostics c = row_count;
    n := n + c;
  end loop;

  -- 2. Handles, by column only (`username` / `handle`), in the same tables.
  if names is not null then
    for t in select ns.nspname, c2.relname, a.attname from pg_class c2
             join pg_namespace ns on ns.oid = c2.relnamespace
             join pg_attribute a on a.attrelid = c2.oid and a.attnum > 0 and not a.attisdropped
             where c2.relkind in ('r', 'p') and a.attname in ('username', 'handle')
               and ((ns.nspname = 'public' and c2.relname like '%backup%') or ns.nspname = 'archive') loop
      execute format('delete from %I.%I x where lower(x.%I::text) = any ($1)', t.nspname, t.relname, t.attname) using names;
      get diagnostics c = row_count;
      n := n + c;
    end loop;
  end if;
  return n;
end;
$$;
revoke all on function public.purge_account_backups(text[]) from public, anon, authenticated;
grant execute on function public.purge_account_backups(text[]) to service_role;


-- ---------------------------------------------------------------------------------------------
-- CHECK (read-only): the live function covers archive, is SECURITY DEFINER with a pinned
-- search_path, and only postgres/service_role may execute it. Every column should read true.
select p.prosecdef                                              as security_definer,
       p.proconfig::text like '%search_path=public, pg_temp%'   as search_path_pinned,
       pg_get_functiondef(p.oid) like '%nspname = ''archive''%' as scans_archive,
       pg_get_functiondef(p.oid) like '%''username'', ''handle''%' as scans_handles,
       not has_function_privilege('anon', p.oid, 'execute')
         and not has_function_privilege('authenticated', p.oid, 'execute')
         and has_function_privilege('service_role', p.oid, 'execute') as grants_ok
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname = 'purge_account_backups';


-- ---------------------------------------------------------------------------------------------
-- DRY RUN (read-only): per-table rows the purge would delete for one auth user id. Put the id in
-- `params`. Run before deletion to see what goes; run after (with the same id and the profile ids
-- / usernames written in by hand, since public_profiles is gone by then) to see zeros.
with params as (
  select '00000000-0000-0000-0000-000000000000'::text as uid        -- the auth user id
), keys as (
  select array_agg(distinct k) as ids from (
    select uid as k from params
    union all select p.id::text from public.public_profiles p, params where p.user_id::text = params.uid
  ) s where k is not null and length(k) >= 8
), handles as (
  select array_agg(distinct lower(p.username)) as names
  from public.public_profiles p, params where p.user_id::text = params.uid and coalesce(p.username, '') <> ''
), tabs as (
  select ns.nspname, c2.relname from pg_class c2 join pg_namespace ns on ns.oid = c2.relnamespace
  where c2.relkind in ('r', 'p') and ((ns.nspname = 'public' and c2.relname like '%backup%') or ns.nspname = 'archive')
), id_hits as (
  select t.nspname, t.relname,
         (xpath('/row/c/text()', query_to_xml(format(
           'select count(*) as c from %I.%I x where row_to_json(x)::text like any (%L::text[])',
           t.nspname, t.relname, (select array_agg('%"' || k || '"%') from unnest(keys.ids) k)), false, true, '')))[1]::text::int as by_id
  from tabs t, keys where keys.ids is not null
), handle_hits as (
  select ns.nspname, c2.relname, string_agg(a.attname, ',') as cols,
         sum((xpath('/row/c/text()', query_to_xml(format(
           'select count(*) as c from %I.%I x where lower(x.%I::text) = any (%L::text[])',
           ns.nspname, c2.relname, a.attname, h.names), false, true, '')))[1]::text::int) as by_handle
  from pg_class c2 join pg_namespace ns on ns.oid = c2.relnamespace
  join pg_attribute a on a.attrelid = c2.oid and a.attnum > 0 and not a.attisdropped, handles h
  where h.names is not null and c2.relkind in ('r', 'p') and a.attname in ('username', 'handle')
    and ((ns.nspname = 'public' and c2.relname like '%backup%') or ns.nspname = 'archive')
  group by 1, 2
)
select t.nspname || '.' || t.relname as table_name,
       coalesce(i.by_id, 0) as rows_by_id,
       coalesce(h.by_handle, 0) as rows_by_handle,
       h.cols as handle_columns
from tabs t
left join id_hits i using (nspname, relname)
left join handle_hits h using (nspname, relname)
order by (coalesce(i.by_id, 0) + coalesce(h.by_handle, 0)) desc, 1;
