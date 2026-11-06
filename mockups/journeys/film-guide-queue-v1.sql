-- Montage: film page opens queue films for the parental guide's language/substances fill (rule 1188).
-- Films outside the 10,000 most-logged labelled films are filled once someone opens them
-- (owner, 2026-11-06: "when a user opens a film outside of the 10,000, then it can fill in").
-- The film page's daily read inserts a row for a labelled film whose language is empty
-- (lib/film-details.ts queueGuideFill); /api/cron/label-traits takes queued films first, oldest
-- first, and drops a row once its guide columns are filled or the film is no longer labelled.
-- Same caps as the rest of the guide set (LABEL_GUIDE_DAILY 5,000 a day, LABEL_GUIDE_MAX_USD $6).
-- Safe to run more than once. Server-only: the service role reads and writes it.
create table if not exists public.film_guide_queue (
  slug      text primary key,
  queued_at timestamptz not null default now()
);
alter table public.film_guide_queue enable row level security;
revoke all on public.film_guide_queue from anon, authenticated;
