-- 18-language-calibration.sql (Montage rule 2080, calibrated picks by language, 2026-11-14). Safe to run more than once.
-- Not applied by the build: run it when ready, ideally before 2026-11-15 00:00 UTC (the language start and
-- the first day of rule 2043's evaluation). Until it runs, the app still calibrates languages on "on" days and
-- stamps cal_arm / cal_k as before; it only cannot stamp cal_lang (lib/pick-outcomes.ts markCalRows finds the
-- column missing, stamps the arm without it, and retries after ten minutes per server). Nothing errors.
--
--   cal_lang   true when the row was first served on an "on" day with language calibrated (rule 2080);
--              false on "off" days and on "on" rows with no language step (the Starter Today, or
--              before the build); NULL on rows stamped before this column existed.
--
-- Touches no one's data: a nullable column; existing rows stay NULL. Server-only like the table (rule 21).

alter table public.pick_exposures add column if not exists cal_lang boolean;

-- For reference only (a SELECT; run after the evaluation window, not now): the language start as deployed,
-- T_L, the first row served with language calibrated. Rule 2043's evaluation splits its "on" rows on it
-- (docs/DATA-SCIENCE-LOG.md, 2026-11-14, rule 2080 entry).
--
-- select min(first_shown_at) as t_l from public.pick_exposures where cal_lang;
