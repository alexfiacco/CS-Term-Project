-- The taste layer in SHADOW (owner-approved 2026-11-13; rule 1831; lib/taste/taste-layer.ts, lib/taste/taste-layer-io.ts;
-- spec: CS-Term-Project mockups/journeys/taste-layer-spec.md "Predictions logged before rating").
--
-- When a prediction is logged (lib/how-we-did.ts capture, at a film's first log), the app also records what the taste
-- layer WOULD have added to that film on the stored scale, without applying it. Every later rating then compares
-- raw_predicted with raw_predicted + taste_layer against the stars, on predictions made before the rating: the
-- forward test (scripts/taste-layer-forward.mjs).
--
--   taste_layer        smallint  stored points, the families in MATCH_TASTE_LAYER_FAMILIES summed and clamped to ±cap
--                                (default chips + lessof + learnedoff, cap 10); 0 when the film matches nothing;
--                                null when no table existed for the person yet (or the layer was off).
--   taste_layer_v      smallint  the layer's version (TASTE_LAYER_V), null when not logged.
--   taste_layer_parts  jsonb     every family's own part, each clamped to ±cap on its own, logged whether or not it is in
--                                the total: {"chips":3,"learnedoff":0,"lessof":-6,"avoid":0,"hidden":-1.5,"cap":10,
--                                "fams":["chips","lessof","learnedoff"]}. Not-interested ("hidden") is always its own part.
--
-- Safe to apply on the live database: three nullable columns, nothing rewritten, no trigger. Until it is applied the app
-- skips the layer's update (it notices the missing columns, logs once, and tries again after ten minutes), so applying it
-- needs no deploy. match_predictions stays server-only (RLS on, no policies, nothing granted to anon or authenticated).

alter table public.match_predictions
  add column if not exists taste_layer smallint check (taste_layer between -30 and 30),
  add column if not exists taste_layer_v smallint,
  add column if not exists taste_layer_parts jsonb;

comment on column public.match_predictions.taste_layer is
  'Taste layer (shadow, rule 1831): stored points it would have added, never applied. Null: not logged.';
comment on column public.match_predictions.taste_layer_v is 'Taste layer version (lib/taste/taste-layer.ts TASTE_LAYER_V).';
comment on column public.match_predictions.taste_layer_parts is 'Taste layer per family (chips, learnedoff, lessof, avoid, hidden), cap and the families in the total.';

-- Check after applying (should list the three columns):
-- select column_name, data_type from information_schema.columns
--  where table_schema = 'public' and table_name = 'match_predictions' and column_name like 'taste_layer%';
