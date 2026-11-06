-- Called it, step 1: data honesty (owner-approved direction, mockups/journeys/taste-model-trust-v1.html;
-- Montage rule 1178). Run by the owner on project uktamekqqsiijugpaxit.
--
-- match_predictions keeps every guess captured before a rating (lib/how-we-did.ts). Two gaps:
--
-- 1. "Shown" was not shown. The capture logs the stored match for every first log, so a deck
--    rating where no % was on screen (source 'grid', 116 of 196 rated rows on 2026-11-06) counted
--    as a guess the person saw. `displayed` says whether the % was on screen before the rating:
--    the client sent the match it showed (web and iPhone, the guess check's own test), or a
--    Letterboxd diary film's page served its % first; never with the match gate closed (rule 202).
--    The record counts displayed rows only. Rows from before this column stay null (unknown) and
--    are not counted in the record from the day it exists.
--
-- 2. Verdicts moved. Called it was judged on every read against expectedByStar, which moves as the
--    model re-scores, so a past "Called it" could quietly become a miss. `verdict` is decided once
--    when the rating is given (and again only if the person changes the rating), with the star
--    table value it used (`verdict_expected`) and when (`verdict_at`). Old rows have none and are
--    judged live as before.
--
-- Safe on the live database: nullable columns only, no backfill, nothing rewritten or deleted.
-- Until this runs the app writes and reads the old shape (it retries the columns every ten
-- minutes, so no deploy is needed after). RLS unchanged: on, no policies, server only (rule 21).

alter table public.match_predictions
  add column if not exists displayed boolean,
  add column if not exists verdict text check (verdict in ('called', 'higher', 'lower')),
  add column if not exists verdict_expected smallint check (verdict_expected between 0 and 100),
  add column if not exists verdict_at timestamptz;

comment on column public.match_predictions.displayed is
  'The % was on screen before the rating (client sent the match it showed, or a diary film''s page served it; gate open). Null: logged before the column. Rule 1178.';
comment on column public.match_predictions.verdict is
  'Called it (called) or liked it more (higher) / less (lower), decided when the rating was given; never recomputed later. Rule 1178.';
comment on column public.match_predictions.verdict_expected is
  'The star table value (expectedByStar, else DEFAULT_BY_STAR) the verdict was judged against.';
comment on column public.match_predictions.verdict_at is
  'When the verdict was decided (the rating, or the latest change of it).';

-- Unchanged, restated: server only.
alter table public.match_predictions enable row level security;
revoke all on table public.match_predictions from anon, authenticated;
