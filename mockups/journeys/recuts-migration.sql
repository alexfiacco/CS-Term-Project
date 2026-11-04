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
