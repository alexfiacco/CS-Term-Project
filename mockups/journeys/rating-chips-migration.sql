-- Rating chips (owner-approved, 2026-11-04, mockups/journeys/rating-flow-v5; lib/rating-chips.ts):
-- the take step's optional, private chips on hits and misses, saved in the same rating_reasons row
-- as "What held it back?" (rule 544). Each entry is "<polarity>:<chip id>" ("pos:story",
-- "neg:too_long"); the five bare ids rows already hold stay valid and read as misses.
-- Until this is applied the code falls back to the five bare ids (lib/rating-chips-server.ts saveChips).
-- Server only: RLS stays on, no policies.
alter table public.rating_reasons drop constraint if exists rating_reasons_reasons_ok;
alter table public.rating_reasons add constraint rating_reasons_reasons_ok check (
  reasons is null or (
    cardinality(reasons) between 1 and 24
    and array_to_string(reasons, '|') ~ '^((pos|neg):[a-z0-9_]{1,60}|pacing|emotional_payoff|story|characters|ending)(\|((pos|neg):[a-z0-9_]{1,60}|pacing|emotional_payoff|story|characters|ending))*$'
  )
);
-- "What others picked" reads one film's rows (counts only).
create index if not exists rating_reasons_slug_idx on public.rating_reasons (slug);
alter table public.rating_reasons enable row level security;
revoke all on table public.rating_reasons from anon, authenticated;
