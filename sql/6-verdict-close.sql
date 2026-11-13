-- Montage: allow the "Close" verdict in How we did (owner, 2026-11-13).
-- Shown 85%+ and rated 4 stars reads "Close". Saved verdicts are untouched.
alter table public.match_predictions drop constraint if exists match_predictions_verdict_check;
alter table public.match_predictions add constraint match_predictions_verdict_check
  check (verdict = any (array['called'::text, 'higher'::text, 'lower'::text, 'close'::text]));
