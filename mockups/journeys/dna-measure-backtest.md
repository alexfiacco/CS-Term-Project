# Film DNA measure backtest: pull (old) vs favorite lift (new)

2026-11-11. Read-only SQL on production (everything computed inside Postgres, nothing written). Same style as the decade-affinity backtest (docs/DATA-SCIENCE-LOG.md 2026-11-04).

## Short answer

- **Standalone, against the raw star rating, the new lift wins.** Per-user Spearman 0.205 vs 0.141; favorite AUC 0.600 vs 0.571. It wins on heavy libraries (0.31 vs 0.17) and loses on thin ones (0.06 vs 0.11).
- **Against "above or below the crowd", the old pull wins by about 2x** (0.195 vs 0.100). That is the gap the match model needs filled, because the crowd average is already in the model.
- **Inside the match model, the old pull wins.** With a crowd-only base, swapping old for new costs RMSE 0.618 → 0.628. With a crowd + taste-neighbour base (closer to production), old adds a sliver (0.5661 → 0.5648 to 0.5657) and new makes it slightly worse (0.5663 to 0.5668). The old and new measures together add nothing over old alone.
- **The Fable variant (baseline = the crowd's favorites among the user's own films)** is the weakest standalone (Spearman about 0, AUC 0.50). Inside the model it ties old on RMSE and is the best on Spearman, but only by +0.001.
- **The new lift's edge on raw ratings is mostly acclaim.** Strong-strand films (visual style, complexity, originality) are the films the crowd rates highly. The crowd average alone scores Spearman 0.51 and AUC 0.75, far above either DNA measure.

**Recommendation: keep both.** The chart keeps the new lift. It is the more readable "what your favorites have" story and predicts raw favorites better. The model keeps the old pull, which predicts what the crowd can't. Don't switch the model to the new lift.

## Data

- 19 real accounts with 30+ rated feature films (latest profile per user, `library_json.rated`, joined to `films` on movie, not duplicate). All 19 libraries are distinct.
- 4,872 ratings, of which 4,828 have a Film DNA label at confidence 40+. 11 accounts have 100+ ratings ("heavy", 4,495 ratings) and 8 have 30-93 ("thin", 377).
- 5 folds by `hashtext(user:slug) % 5`. Each fold is held out in turn. Every measure is computed from the other four folds only. That includes the favorites boundary, the crowd-favorite boundary, the pulls and the lifts.

## Measures (per user, per strand, nine strands via `strandValue9`)

- **OLD, pull** (`strandPull` / `pullScore`): weighted correlation of strand value against rating − Letterboxd average. The weight is min(1, max(0.2, watches/2000)). It is shrunk by n/(n+30), clamped to ±0.3 (the 5..95 range), and needs 16+ films. Used as (pull − 50)/150.
- **NEW, lift** (`dna-lift.ts`, rule 1522): `lovedWeights` top third with a partial tie block. Ratio = favorite share among strong films (≥ 85th percentile of the 3,000 most-watched labelled films) / favorite share among all labelled films. It needs 10+ strong films. Recentred: ratio / mean ratio of the person's qualifying strands − 1.
- **NEW-B, Fable variant:** the same, but the baseline is the crowd's favorite share among the same strong films. "Crowd favorites" are the top third of the user's own training films by Letterboxd average. Ratio = user hit / crowd hit. Recentred the same way.
- Also scored as diagnostics: NEW not recentred (ratio − 1).
- **Film strength:** `_z` is (value − pool mean)/pool sd; `_s` is 1 if strong, else 0. A film's DNA score = Σ_s measure_s × strength_s. A missing measure or label adds 0.
- **Coverage:** OLD exists for 855 of 855 user-fold-strands. NEW and NEW-B exist for 628 of 855. Thin libraries rarely reach 10 strong films on a strand.

## (a) Standalone: DNA score alone vs the held-out film

Mean per-user Spearman. AUC is for "favorite" (top third of all their ratings, tie block fractional), per user then averaged.

| score | Spearman vs rating | Spearman vs rating − crowd | AUC favorite | users > 0 | beats OLD (Spearman / AUC) | Spearman heavy / thin | AUC heavy |
|---|---|---|---|---|---|---|---|
| OLD pull (z) | 0.141 | **0.195** | 0.571 | 12/19 | n/a | 0.167 / **0.106** | 0.592 |
| OLD pull (strong) | 0.141 | **0.197** | 0.570 | 14/19 | n/a | 0.159 / **0.116** | 0.586 |
| NEW lift (z) | **0.205** | 0.100 | **0.600** | 14/19 | 12 / 13 of 19 | **0.309** / 0.062 | **0.663** |
| NEW lift (strong) | 0.169 | 0.096 | 0.587 | 15/19 | 10 / 9 | 0.240 / 0.071 | 0.633 |
| NEW, not recentred (z) | 0.248 | 0.055 | 0.623 | 15/19 | 12 / 13 | 0.377 / 0.071 | 0.694 |
| NEW-B crowd baseline (z) | −0.007 | 0.116 | 0.497 | 11/19 | 5 / 5 | 0.026 / −0.051 | 0.529 |
| NEW-B crowd baseline (strong) | 0.038 | 0.119 | 0.517 | 11/19 | 5 / 4 | 0.076 / −0.014 | 0.548 |
| reference: Letterboxd average alone | 0.512 | −0.024 | 0.752 | 19/19 | 17 / 18 | 0.604 / 0.385 | 0.785 |

How to read it: NEW predicts the raw rating better, and the un-recentred version does better still. That is a sign the signal is "strong-strand films are acclaimed films", which the crowd average already carries at Spearman 0.51. OLD is built against the crowd and predicts the crowd gap twice as well.

## (b) Inside the match model: swap the DNA input

This is a stand-in for model 3 on the star scale, as in the decade test: the production fit needs the full embedding matrix and ridge label fit, so the model is rebuilt here from its two main parts.
- **Crowd base:** the person's rating on the Letterboxd average, slope ridge-shrunk toward the pooled slope by 30 films, fit on training folds.
- **Taste neighbours:** the leave-fold-out 25-nearest-neighbour residual on the stored embeddings, weighted sim³.
- **DNA term:** one weight for the DNA score.

Weights were fit on folds 0-2's held-out predictions and scored on folds 3-4, then the reverse. All numbers are out of sample. RMSE is pooled; Spearman is per user, averaged.

| model | RMSE | Spearman | users better than base (Spearman / RMSE) | RMSE heavy / thin | DNA weight (half A / B) |
|---|---|---|---|---|---|
| crowd + neighbours (base) | 0.5661 | 0.5323 | n/a | 0.5578 / 0.6562 | n/a |
| + OLD pull (strong) | **0.5648** | 0.5321 | 10 / 10 | **0.5564** / 0.6561 | 0.17 / 0.28 |
| + OLD pull (z) | 0.5657 | 0.5301 | 6 / 11 | 0.5574 / 0.6570 | 0.033 / 0.050 |
| + NEW-B crowd baseline (z) | 0.5657 | **0.5330** | 12 / 12 | 0.5575 / 0.6556 | 0.023 / 0.018 |
| + NEW lift (strong) | 0.5663 | 0.5300 | 7 / 8 | 0.5581 / 0.6560 | 0.03 / 0.12 |
| + NEW, not recentred (z) | 0.5664 | 0.5326 | 9 / 9 | 0.5583 / 0.6560 | 0.00 / 0.01 |
| + NEW lift (z) | 0.5668 | 0.5310 | 5 / 8 | 0.5587 / 0.6555 | 0.00 / 0.03 |
| crowd only (no neighbours) | 0.6373 | 0.4787 | | 0.6351 / 0.6633 | |
| crowd + OLD (z) | **0.6182** | **0.4951** | | 0.6140 / 0.6659 | 0.27 / 0.27 |
| crowd + OLD + NEW (z) | 0.6179 | 0.4960 | | 0.6140 / 0.6621 | 0.25, 0.02 / 0.21, 0.06 |
| crowd + NEW-B (z) | 0.6262 | 0.4810 | | 0.6227 / 0.6668 | 0.12 / 0.13 |
| crowd + NEW (z) | 0.6279 | 0.4833 | | 0.6252 / 0.6601 | 0.09 / 0.12 |

Read: without neighbours, OLD takes RMSE down 0.019 with an identical weight in both halves (0.27 / 0.27), and NEW takes it down 0.009. Once taste neighbours are in, both add very little: neighbours already capture most of what labels say. OLD still helps a little and NEW hurts a little. NEW's fitted weight swings from 0.00 to 0.03 between halves, a sign there is no stable signal left. Adding NEW on top of OLD is worth 0.0003.

## Caveats

- 19 accounts, and the two largest libraries carry 40% of the ratings. The model differences with neighbours (≤ 0.002 RMSE) are within noise. The crowd-only comparison (0.618 vs 0.628, stable weights) and the standalone gap vs the crowd (0.195 vs 0.100) are the robust findings.
- The production label lean (`labelLean`) is a 25-dimension ridge fit on raw labels, not the nine strands. The OLD tested here is the strand pull the DNA chart used to show, the closest strand-level stand-in. The real `labelLean` is already in production and likely captures OLD's signal, so the real question ("does NEW add anything on top of production?") is, if anything, less favourable to NEW than shown.
- Thin libraries (under 100 ratings): NEW is null on most strands because it needs 10 strong films. OLD is the better standalone read there (Spearman 0.11 vs 0.06).

## Recommendation

**Keep both.** The chart stays on the new lift: it is honest about favorites, and it is the better standalone predictor of whether a film becomes a favorite on libraries of 100+. It should not claim to be "what you like more than most people", because that is the old pull's job. The model stays on the pull and label lean, with no switch to the new lift. The Fable crowd-baseline variant is not worth adopting for the chart: it loses nearly all its power on raw favorites (AUC 0.50) and is at best a tie inside the model.
