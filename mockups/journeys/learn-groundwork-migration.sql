-- Learning from our own predictions, groundwork (owner, 2026-11-04; the correction itself stays
-- OFF). Design: mockups/journeys/learn-from-predictions-report.md; code: lib/taste/calibration.ts,
-- lib/taste/calibration-io.ts.
--
-- 1. Honest logging. Every match_predictions row and every rating_predictions "shown" row also
--    keeps the RAW model number (before any post-hoc correction), the model version that produced
--    the stored score, and (match_predictions) the account's rated count, which picks the
--    population line. Learning reads raw -> outcome only, never its own corrected output.
-- 2. The permanent holdout: about 10% of (owner, film) pairs, by hash (lib/taste/calibration.ts
--    isHoldout), flagged when the row is written. Never used to fit; the weekly monitor scores it.
-- 3. A held-out guess (rating_predictions source 'held_out', the daily background pass in
--    lib/rating-predictions.ts backfillHeldOut) never replaces a 'shown' row: the code skips them
--    and this trigger refuses the overwrite in the database as well.
--
-- Safe to apply on the live database: nullable columns and one trigger, nothing rewritten. Until it
-- is applied the app writes rows without these columns (logged once per table) and the nightly
-- status reports columnsMissing.

alter table public.match_predictions
  add column if not exists raw_predicted smallint check (raw_predicted between 0 and 100),
  add column if not exists model_version integer,
  add column if not exists n_rated integer,
  add column if not exists holdout boolean;

alter table public.rating_predictions
  add column if not exists raw_predicted smallint check (raw_predicted between 0 and 100),
  add column if not exists model_version integer,
  add column if not exists n_rated integer,
  add column if not exists holdout boolean;

create or replace function public.rating_predictions_keep_shown()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- Skipping the row (return null) leaves the shown prediction exactly as it was.
  if old.source = 'shown' and new.source is distinct from 'shown' then
    return null;
  end if;
  return new;
end;
$$;
revoke all on function public.rating_predictions_keep_shown() from public, anon, authenticated;

drop trigger if exists rating_predictions_keep_shown on public.rating_predictions;
create trigger rating_predictions_keep_shown
  before update on public.rating_predictions
  for each row execute function public.rating_predictions_keep_shown();

-- Both stay server-only (rule 21): RLS on, no policies, nothing granted to the public roles.
alter table public.match_predictions enable row level security;
alter table public.rating_predictions enable row level security;
revoke all on table public.match_predictions from anon, authenticated;
revoke all on table public.rating_predictions from anon, authenticated;
