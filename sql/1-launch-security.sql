-- Launch security pass (2026-11-12). For the owner to run once in the Supabase SQL editor
-- (project uktamekqqsiijugpaxit). Report: CS-Term-Project mockups/journeys/launch-security.md.
--
-- What was found (read-only checks, pg_class / pg_policies / pg_default_acl / advisors):
--   * Every table in `public` has RLS ON. All but one have NO policies, so the anon and
--     authenticated roles read and write nothing; the app reaches them only through the API
--     routes with the service role. `film_cast` has one policy, "film_cast public read" (SELECT,
--     true), which nothing in the browser or the iPhone app uses.
--   * But the grants underneath are wide: 40-odd public tables still grant anon and authenticated
--     full rights (SELECT/INSERT/UPDATE/DELETE/TRUNCATE...), and the DEFAULT privileges in `public`
--     (for postgres and supabase_admin) hand those rights to anon and authenticated on every NEW
--     table. RLS is the only wall: one table created without `enable row level security`, or one
--     careless `using (true)` policy, and it is readable and writable by anyone with the
--     publishable key, which ships in every page.
--   * Two backups of profile data sit in `public` (backup_public_profiles_20261106,
--     identity_backup_v45), on the API's schema, with those wide grants.
--
-- Nothing below deletes or rewrites anyone's data. The app keeps working: the server uses the
-- service role (which these grants do not touch), the browser only signs in and joins Realtime
-- channels (realtime.messages + private.can_hear_topic, untouched), and no client calls .from()
-- or .rpc() directly (checked: lib/supabase-browser.ts users, iOS Sources).

begin;

-- 1. Take the table, sequence and function rights in `public` away from the client roles.
--    RLS stays on as the second wall.
revoke all on all tables    in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
-- (Not from PUBLIC: some functions the service role calls by RPC may rely on the PUBLIC grant.)
revoke execute on all functions in schema public from anon, authenticated;

-- 2. New objects in `public` stop granting them by default.
alter default privileges for role postgres in schema public revoke all on tables    from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public revoke execute on functions from anon, authenticated;

-- 3. The unused public read policy on film_cast (the API reads it with the service role).
drop policy if exists "film_cast public read" on public.film_cast;

-- 4. The two profile backups off the API's schema (archive has no anon/authenticated USAGE).
alter table if exists public.backup_public_profiles_20261106 set schema archive;
alter table if exists public.identity_backup_v45            set schema archive;

commit;

-- 5. supabase_admin's default privileges in `public` grant the same. Only supabase_admin may change
--    them; on most projects this fails with "permission denied" from the SQL editor. If it does, the
--    revoke in step 1 still covers every table that exists, and step 6 covers new ones.
do $$ begin
  execute 'alter default privileges for role supabase_admin in schema public revoke all on tables from anon, authenticated';
  execute 'alter default privileges for role supabase_admin in schema public revoke all on sequences from anon, authenticated';
  execute 'alter default privileges for role supabase_admin in schema public revoke execute on functions from anon, authenticated';
exception when insufficient_privilege then
  raise notice 'supabase_admin default privileges left as they are (needs supabase_admin)';
end $$;

-- 6. A tripwire for new tables: any table created in `public` gets RLS turned on at once, so a
--    migration that forgets it is still deny-all. (Supabase allows event triggers for postgres.)
create or replace function private.rls_on_new_public_tables() returns event_trigger
language plpgsql security definer set search_path = '' as $$
declare r record;
begin
  for r in select * from pg_event_trigger_ddl_commands()
           where command_tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO') and schema_name = 'public'
  loop
    execute format('alter table %s enable row level security', r.object_identity);
  end loop;
end $$;
revoke all on function private.rls_on_new_public_tables() from public, anon, authenticated;
drop event trigger if exists montage_rls_on_new_public_tables;
create event trigger montage_rls_on_new_public_tables on ddl_command_end
  when tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  execute function private.rls_on_new_public_tables();

-- 7. Check (each should return no rows).
--    a) client roles still holding a table right in public:
select c.relname, r.rolname
from pg_class c join pg_namespace n on n.oid = c.relnamespace
cross join (values ('anon'), ('authenticated')) r(rolname)
where n.nspname = 'public' and c.relkind in ('r', 'v', 'm', 'p')
  and (has_table_privilege(r.rolname, c.oid, 'SELECT') or has_table_privilege(r.rolname, c.oid, 'INSERT')
    or has_table_privilege(r.rolname, c.oid, 'UPDATE') or has_table_privilege(r.rolname, c.oid, 'DELETE'));
--    b) a public table with RLS off:
select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind in ('r', 'p') and not c.relrowsecurity;
--    c) a policy left in public:
select tablename, policyname from pg_policies where schemaname = 'public';

-- Not SQL (Dashboard):
--   * Realtime → Settings → turn OFF "Allow public access", then set REALTIME_PUBLIC_NUDGES=off on
--     Vercel (lib/realtime-broadcast.ts). Until then anyone with the publishable key can listen to
--     (and send empty nudges on) a public `theater:<id>` channel. Payloads are empty, so it leaks
--     only "something changed in room X".
--   * Authentication → Rate Limits: confirm sign-ups / anonymous sign-ins / OTP per hour, and turn
--     on CAPTCHA (Turnstile or hCaptcha) for sign-up and anonymous sign-in before launch traffic.
--   * Authentication → Auth DB connections: switch to a percentage (performance advisor).
