-- Montage member numbers: "No. 0042" on the profile share card (rule 1238, owner 2026-11-06).
-- NOT RUN. Review, back up, then run in the Supabase SQL editor (project uktamekqqsiijugpaxit).
--
-- Where it lives: public.public_profiles (the row the card at /u/<id>/card and the browser capture
-- read by id; one row per account: on 2026-11-06 there were 21 rows, every one owned by a real,
-- non-anonymous auth user, and 0 guest rows). public.profiles is the old job table, not accounts.
--
-- A "real account" is a public_profiles row whose user_id is an auth.users row with
-- is_anonymous = false. Guest rows (user_id null, guest_secret_hash set) and rows owned by an
-- anonymous auth user ("Not now" on the reveal, signInAnonymously) get no number until they are
-- claimed / upgraded. Numbers come from a sequence and are never reused: deleting an account
-- leaves a gap, nobody else's number moves. Once set, a number never changes (the trigger keeps
-- OLD.member_no on every update).
--
-- The app ships first and is safe without this: lib/member-number.ts reads member_no and treats a
-- missing column or a null as "no number", so the card simply omits "No." (top left and spine).

-- ─── 0. Backup note ─────────────────────────────────────────────────────────────────────────────
-- Take a point-in-time backup first (Dashboard → Database → Backups), or at least:
--   create table if not exists backup_public_profiles_20261106 as select id, user_id, created_at from public.public_profiles;
-- Rollback (before anyone has shared a numbered card):
--   drop trigger if exists assign_member_no on public.public_profiles;
--   drop trigger if exists assign_member_no_on_upgrade on auth.users;
--   drop function if exists public.assign_member_no(); drop function if exists public.assign_member_no_on_upgrade();
--   alter table public.public_profiles drop column if exists member_no; drop sequence if exists public.member_no_seq;

-- ─── 1. Read-only checks (run these first; nothing below should surprise you) ───────────────────
select count(*) as rows_total,
       count(*) filter (where p.user_id is null) as guest_rows,
       count(*) filter (where u.id is not null and coalesce(u.is_anonymous, false) = false) as real_accounts,
       count(*) filter (where u.is_anonymous) as anonymous_rows,
       count(*) filter (where p.user_id is not null and u.id is null) as orphan_rows
from public.public_profiles p left join auth.users u on u.id::text = p.user_id;
-- Expect real_accounts = 21 (2026-11-06) and no orphans.

select p.user_id, count(*) from public.public_profiles p where p.user_id is not null group by 1 having count(*) > 1;
-- Expect no rows (one profile per account).

select column_name from information_schema.columns where table_schema = 'public' and table_name = 'public_profiles' and column_name = 'member_no';
-- Expect no rows (the column does not exist yet).

-- The order the backfill will use (join order: the account's created_at, then the profile's):
select row_number() over (order by u.created_at, p.created_at, p.id) as member_no, p.id, u.created_at
from public.public_profiles p join auth.users u on u.id::text = p.user_id
where coalesce(u.is_anonymous, false) = false
order by 1;

-- ─── 2. The migration ───────────────────────────────────────────────────────────────────────────
begin;

create sequence if not exists public.member_no_seq as integer start 1 increment 1 no cycle;

alter table public.public_profiles add column if not exists member_no integer;
alter table public.public_profiles add constraint public_profiles_member_no_key unique (member_no);

-- One-time backfill, before the trigger exists: existing real accounts in join order (the
-- account's created_at, then the profile's), 1, 2, 3...
with ordered as (
  select p.id, row_number() over (order by u.created_at, p.created_at, p.id) as n
  from public.public_profiles p join auth.users u on u.id::text = p.user_id
  where coalesce(u.is_anonymous, false) = false
)
update public.public_profiles p set member_no = o.n from ordered o where o.id = p.id;

-- The sequence carries on after the last backfilled number (is_called false when there were none).
select setval('public.member_no_seq', greatest(coalesce((select max(member_no) from public.public_profiles), 0), 1),
              (select max(member_no) from public.public_profiles) is not null);

-- A real account's row gets the next number when it is created, or when a guest row is claimed by a
-- real account (user_id set). A set number never changes and a client cannot pick one. SECURITY
-- DEFINER so it reads auth.users; public_profiles has RLS on with no client policies, so only the
-- service role writes rows at all (RLS-safe either way).
create or replace function public.assign_member_no() returns trigger
language plpgsql security definer set search_path = public, auth as $$
begin
  if tg_op = 'UPDATE' and old.member_no is not null then
    new.member_no := old.member_no;
    return new;
  end if;
  if new.user_id is not null and exists (
    select 1 from auth.users u where u.id::text = new.user_id and coalesce(u.is_anonymous, false) = false
  ) then
    new.member_no := nextval('public.member_no_seq');
  else
    new.member_no := null;
  end if;
  return new;
end $$;

drop trigger if exists assign_member_no on public.public_profiles;
create trigger assign_member_no before insert or update on public.public_profiles
  for each row execute function public.assign_member_no();

-- An anonymous account upgraded to a real one (email, Apple or Google linked: is_anonymous flips to
-- false) gets its number then. The UPDATE goes through assign_member_no, which draws the number.
create or replace function public.assign_member_no_on_upgrade() returns trigger
language plpgsql security definer set search_path = public, auth as $$
begin
  if coalesce(old.is_anonymous, false) = true and coalesce(new.is_anonymous, false) = false then
    update public.public_profiles set member_no = null where user_id = new.id::text and member_no is null;
  end if;
  return new;
end $$;

drop trigger if exists assign_member_no_on_upgrade on auth.users;
create trigger assign_member_no_on_upgrade after update of is_anonymous on auth.users
  for each row execute function public.assign_member_no_on_upgrade();

revoke all on function public.assign_member_no() from public, anon, authenticated;
revoke all on function public.assign_member_no_on_upgrade() from public, anon, authenticated;

commit;

-- ─── 3. Read-only checks after ──────────────────────────────────────────────────────────────────
select count(*) filter (where member_no is not null) as numbered, max(member_no) as highest,
       count(*) filter (where member_no is null and user_id is not null) as real_but_unnumbered
from public.public_profiles;
-- Expect numbered = highest = the real-account count above, and real_but_unnumbered = 0.
select last_value, is_called from public.member_no_seq;
