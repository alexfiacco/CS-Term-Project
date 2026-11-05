-- Pitch recents: lets the × hide a recent search without deleting the pitch or its share link.
-- Safe to run more than once. recuts already has RLS on (server only), so no policy change is needed.
alter table public.recuts add column if not exists hidden_recent boolean not null default false;
