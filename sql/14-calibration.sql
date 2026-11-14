-- 14-calibration.sql (Montage rule 2041, calibrated picks, 2026-11-14). Safe to run more than once.
-- Not applied by the build: run it when ready. Until it runs, the app still calibrates on its "on"
-- days; it only cannot stamp the arm and the discovery mark on pick_exposures (the update finds the
-- columns missing, stops trying for ten minutes per server instance, and nothing errors), and the
-- adaptive caps see no discovery-marked picks, so they move only on answers to picks of kinds the
-- cap holds back.
--
-- What it does: three nullable/defaulted columns on pick_exposures, a check on the arm, and a partial
-- index for the evaluation's reads. Touches no one's data: existing rows get cal_arm NULL,
-- cal_k NULL and cal_discovery false (rows from before the build are not part of the evaluation).
--
--   cal_arm        'on' or 'off': whether calibration ran for this account on the day the film was
--                  first shown on this surface after the build (the first showing's arm is kept).
--   cal_k          the account's starting multiplier (1.3, 1.5 or 2.0, randomised by account).
--   cal_discovery  true when the film was placed as a discovery pick (a strong match outside the
--                  person's usual genres and decades).
--
-- Server-only like the table (rule 21): no policy changes.

alter table public.pick_exposures add column if not exists cal_arm text;
alter table public.pick_exposures add column if not exists cal_k real;
alter table public.pick_exposures add column if not exists cal_discovery boolean not null default false;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.pick_exposures'::regclass and conname = 'pick_exposures_cal_arm_check'
  ) then
    alter table public.pick_exposures
      add constraint pick_exposures_cal_arm_check check (cal_arm is null or cal_arm in ('on', 'off'));
  end if;
end $$;

create index if not exists pick_exposures_cal_idx
  on public.pick_exposures (owner_key, first_shown_at)
  where cal_arm is not null;

-- The pre-registered evaluation's read (docs/DATA-SCIENCE-LOG.md, 2026-11-14 entry, rule 2041), for
-- reference only (a SELECT; run it after the 2-3 weeks, not now):
--
-- select cal_arm, count(*) as exposures,
--        count(*) filter (where watchlisted_at is not null or rating >= 3.5) as engaged,
--        round(100.0 * count(*) filter (where watchlisted_at is not null or rating >= 3.5) / count(*), 2) as per_100
-- from public.pick_exposures
-- where cal_arm is not null and surface in ('deck', 'today', 'weekly', 'mix', 'tonight')
--   and first_shown_at >= '2026-11-15' and first_shown_at < '2026-12-06'
--   and owner_key not like 'anon\_%'
-- group by cal_arm;
