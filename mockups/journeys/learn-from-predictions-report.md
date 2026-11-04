# Learning from our own predictions: design and offline evaluation

2026-11-04. Design and offline evaluation only. Nothing in production changed. The only database access was read-only SELECTs (Supabase project uktamekqqsiijugpaxit), with no writes, migrations or crons. The eval script is unpushed, in the worktree `/home/user/wt-learn` (origin/main 5b769a2f) at `scripts/eval-learn-from-predictions.mjs`. It reads JSON exports in `/home/user/wt-learn/.work/learn/` (git-ignored; users appear only as md5 prefixes and no titles are included). Results: `/home/user/wt-learn/.work/learn/eval-learn-2026-11-04.json`.

## Summary for the owner

- **We have very little honest data.** "Honest" means the match we showed before someone rated the film. There are 194 such ratings from 13 people. Only 3 people have 30 or more, and nobody has 100. 187 of the 194 were made by the older match model (before model 5 on Oct 27). The model running today has 7 honest predictions behind it. The "what held it back" chips have been tapped once in total.
- **There is one real, consistent pattern: the level and spread of the number, not which films rank higher.** Under the old model, the shown % ran about 11 points below what people's stars implied. Films shown under 50% averaged 3.7 stars. Shown numbers were also more spread out than their accuracy supported. When I split the error by genre, lane, decade, language, runtime, popularity, or how long someone had used the app, no pattern survived the noise.
- **The current model looks mostly fine on level.** The larger proxy set (1,527 "guess a rated film without it" predictions, 3 people) shows only about 1-2 points of average bias. It shows the same over-spread pattern: low matches are a little too low and 80%+ a little too high.
- **What we'd do:** add a small correction layer applied after the model, with three parts:
  1. One population line for everyone.
  2. A per-person bias and scale, used only once that person has 30+ honest predictions. Even then it is pulled hard toward the population line.
  3. A cap so it never moves a number more than 8 points.

  It updates nightly, never between ratings. It never changes the order of a person's films, so picks don't jump. Chips don't add a second score. They tell the existing "pace/ending/tension" part of the model which knobs a person cares about, and the ratings still decide how far each knob moves.
- **How we keep it from overfitting:**
  - The layer learns only from predictions shown before the rating.
  - It learns from the raw model output, never from its own corrected output.
  - Each person's correction is shrunk toward everyone's by n/(n+30).
  - Corrections are capped at 8 points and blended slowly.
  - 10% of new ratings are permanently held out, and a weekly check alerts if the corrected numbers do worse than the raw ones on that holdout.
  - A single switch turns it all off.
- **Expected gain:**
  - On the old model's live data: average error drops from 19.0 to 16.0 points (90% interval of the gain 0.8 to 5.3), and "Called it" rises from 30% to 33%.
  - On today's model (proxy): no measurable gain. Error goes from 9.9 to 9.8 (interval -0.8 to +0.2), and Called it slips from 63% to 60%.

  So today this is mainly a safety net against drift and a way to keep "Called it" honest, not a big accuracy win.
- **Chip-driven tilts can't be tested yet (1 chip row).** A stand-in tilt using genre, lane and decade gave no gain over the plain correction, while reordering 1-6% of film pairs. Recommendation: build the logging, holdout and monitor now. Turn on the population line at 300+ honest predictions on the current model, per-person corrections at 30+ for that person, and chip guidance at 200+ chip-tagged ratings from 20+ people.

---

## 1. What data exists

### match_predictions (honest: shown match captured at first log, before any rescore)

| | rows | rated | people | first | last |
|---|---|---|---|---|---|
| app (film sheet) | 71 | 66 | 5 | 2026-10-02 | 2026-11-04 |
| grid (grid / deck) | 135 | 116 | 6 | 2026-09-30 | 2026-11-01 |
| rss (Letterboxd sync) | 15 | 12 | 7 | 2026-10-03 | 2026-11-04 |
| **all rated** | | **194** | **13** | | |

| People with N rated honest predictions | ≥1 | ≥10 | ≥30 | ≥100 | max |
|---|---|---|---|---|---|
| match_predictions | 13 | 3 | 3 | 0 | 62 |

Per person (rated rows): 62, 61, 46, 6, 4, 3, 3, 2, 2, 2, 1, 1, 1. The three heavy contributors rated in bursts: one person's 62 came over 2 days and another's 46 in one day. These are mostly onboarding or grid ratings of films seen long ago, not "we recommended it, they watched it, they rated it".

By model era (by predicted_at): **187 before model 5** (Oct 27), 0 under models 5-6, **7 under model 7** (today's, from 5 people). Since model 7 shipped, about 13 rows have been captured, roughly 2 a day.

### rating_predictions (not honest, so diagnostics only)

| source | rows | people | per-person max |
|---|---|---|---|
| shown | 12 | 6 | 3 |
| held_out | 1,916 | 4 | 1,078 |

People with ≥10 / ≥30 / ≥100 rows (all sources): 4 / 4 / 3. "Shown" rows: 0 people reach 10.

**Important:** `backfillHeldOut` (lib/rating-predictions.ts) overwrites every row, shown ones included, with a leave-one-out guess from the current model. In that guess the person's weights were fitted with the film itself in the data. The 2026-10-27 owner decision ("switch to current model") made this table a model snapshot, not a pre-rating record. It must never be used to train the correction, but it is a useful larger proxy for checking whether there is a pattern.

### rating_reasons (chips)

1 row total: 1 person, 1 film, chip `emotional_payoff` (stored in the legacy `reason` column). Per chip: emotional_payoff 1; pacing, story, characters and ending 0. **There is not enough chip data to test anything.**

## 2. Is there systematic error the refit doesn't absorb?

Error here means **star-target minus shown match**. The star-target is the match a star rating typically carries (`DEFAULT_BY_STAR` in lib/how-we-did.ts: 3.5 stars = 61, 4 = 77, 4.5 = 87). A positive error means we under-called the film. The live numbers use honest, pre-rating predictions only. ± is one standard error.

### Per person (live, n≥5)

| person | n | bias (pts) | slope of target on shown | sd shown / sd target | Spearman (shown vs stars) |
|---|---|---|---|---|---|
| 5f60e8 | 62 | **+25.3** | 0.49 | 13.3 / 14.3 | 0.22 |
| 91c12a | 61 | -3.8 | 0.51 | 9.7 / 16.0 | 0.23 |
| b481a0 | 46 | +10.5 | 0.29 | 14.9 / 15.5 | 0.22 |
| cf2c61 | 6 | +31.7 | -0.23 | 16.2 / 9.3 | 0.03 |

Proxy (held_out, current-ish model): bias +0.1, +1.7, +5.3 and +2.9, with slopes 0.78, 0.50, 0.57 and 1.00 (n = 1,078 / 419 / 389 / 30).

**Reading:** each person has a different level, and slopes are consistently below 1, so shown numbers are spread wider than their accuracy supports. That is the bias + scale a per-person layer would fix. 5f60e8 is a lenient rater: 52 of 62 rated 4+. Note that "Called it" in the app already uses a per-person star table (`expectedByStar`), which hides part of this on the verdict.

### By shown band (calibration curve)

| shown band | live n | live avg stars | live err | proxy n | proxy err |
|---|---|---|---|---|---|
| 0-49 | 41 | 3.68 | **+26.0 ± 3.1** | 240 | **+10.6 ± 0.8** |
| 50-64 | 79 | 3.97 | +14.9 ± 1.8 | 626 | +3.2 ± 0.5 |
| 65-79 | 64 | 3.86 | -0.5 ± 2.3 | 709 | +0.5 ± 0.4 |
| 80-89 | 10 | 4.15 | -4.2 ± 3.1 | 306 | **-5.4 ± 0.5** |
| 90+ | 0 | | | 35 | -4.4 ± 1.0 |

This is the clearest pattern. Low matches are too low and high matches a bit too high, so the curve is too steep. It is learnable and monotone.

### By film features

| cut | live (err ± se, n) | proxy (err ± se, n) |
|---|---|---|
| Lane | Drama +11.3±3.2 (35), Thriller +7.6±3.5 (29), Action +12.8±3.5 (24), Horror +18.5±5.1 (17), Fantasy -6.2±3.7 (9) | Drama +2.0±0.6 (411), Action +2.0±0.8, **Comedy +5.3±0.9 (177)**, Thriller -1.0±1.0, Crime -2.1±1.2 |
| Genre | Action +15.6±2.9, Sci-Fi +17.6±4.4, Romance +2.0±3.9, Crime +5.2±3.0 | Comedy +3.2±0.5, Family +2.9±0.8, Crime -1.2±0.7, Drama +0.8±0.4 |
| Decade | 2010s +15.0±2.5, 2000s +9.1, 2020s +9.5, 1990s +2.3±4.6 | 2010s +3.3, 2020s +3.8, 1990s -0.9, 1980s -1.8, 1950s -8.0±2.9 (16) |
| Language | en +10.4±1.5 (172), non-en +5.0±4.4 (10) | en +1.6±0.3, non-en +1.9±1.2 (97) |
| Runtime | all buckets +9 to +12 | all buckets +0.4 to +2.1 |
| Popularity | 100k+ +10.1 (167); too few others | 100k+ +1.4; 5k-20k +8.0±3.5 (17) |
| Recency (person's 1st-10th / 11-30th / 31st+ honest prediction) | +9.3 / +14.9 / +9.6 | -0.6 / +2.0 / +1.6 |
| Source (live) | app +24.4 (66, avg 4.33 stars), grid +4.3 (116), rss +5.5 (12) | |

**Reading:** apart from the overall offset, nearly every feature difference sits within about 2 standard errors once you allow for the roughly 40 cuts tested. Live feature differences mostly come from who rated what: the app source belongs mainly to the lenient rater. In the proxy, Comedy (+5) and older decades (pre-1980 negative) are the only cuts that clear the noise. Both line up with features the refit already learns (`genreAff`, `decadeAff`), so a correction there would double-count (see section 3). I found no recency trend: errors don't shrink as people rate more, but they don't grow either.

**Live vs offline accuracy:** within-person Spearman is 0.22 live against 0.52 on the proxy. The live predictions are much weaker than the offline evaluation suggests. Old model, onboarding grids of remembered films and few dislikes are likely reasons, but this is worth tracking on model 7 regardless of this project.

## 3. Why "correct by past error" double-counts, and how to avoid it

1. **The rating is already a training row.** After a rating, `loadViewerModel` sees the rated count change, and `v3FitUser` refits the person's weights with that film included. Those weights cover `genreAff`, `decadeAff`, `langAff`, `knn*`, and `labelLean` (pace/propulsion, tension, plot_clarity, ambiguous_ending, and so on). A correction that also shifts "comedies for this person" by the same film's error learns the same thing twice. **So the correction must not touch anything the refit already learns.** In practice that means no residual-based genre, lane, decade or label tilts as an extra additive score.
2. **What the refit can't absorb is level and spread.** The match % is a rank: the film's log-odds placed on the person's reference set of popular films (`v3Scale`, `V3_ANCHORS`: median = 50, 90th percentile = 70), then pulled toward 50 by `spreadFor(n_rated)`. However a person rates, their numbers keep the same distribution, so the refit can never move the level, by design. A monotone bias + scale layer on the output is therefore not a double count, as long as it is learned only from predictions made before the rating.
3. **The spread is already a population-level scale correction.** The per-person scale must be learned on the shown number (after the spread), and the population line should be fitted as a function of (shown, rated-count bucket). It replaces hand-tuning `SPREAD_POINTS`, rather than stacking a second spread on top.
4. **No feedback loop.** Store the raw model number (before the layer) at capture time and always fit raw → outcome. If the layer learned from its own corrected output, it would compound its corrections.
5. **No held-out rows as training.** `rating_predictions` held_out rows are regenerated by the current model, with the film inside the weights. Only `match_predictions`, captured before the 10-second rescore, counts.
6. **Model-version resets.** A correction learned on model N's errors describes model N. Store `model_version` with each prediction. A new model starts again from the population line, with old-model rows down-weighted by 0.25.
7. **Chips decide where, the ratings decide how much.** A chip doesn't add points. It lowers the ridge penalty (`LABEL_RIDGE` = 60 films) on the label-lean dimensions it maps to, so the existing per-person regression may move those dimensions faster. The size of the move still comes from the person's ratings, and each rating is still used once.

## 4. Design

### 4a. The post-hoc calibration layer (output only, monotone)

`final = raw + clamp(pop(raw, nBucket) − raw + s·(c_u + d_u·(raw − p̄_u)), −CAP, +CAP)`

- **Population line** `pop(x) = a + b·x`, one per rated-count bucket (<30, 30-299, 300+). Each person is weighted 1/√n so no single heavy rater defines it. The slope is clamped to [0.3, 2]. Refit nightly on all honest, non-holdout predictions with an outcome. It is used only once there are ≥300 honest predictions on the current model version (an isotonic version, pooled, can replace the line at ≥1,000).
- **Per-person bias + scale** (c_u, d_u), fitted on the population's residual for that person. The slope has a ridge worth about 10 rows.
  - Empirical-Bayes shrinkage s = n/(n+k), with **k = 30**. The CV grid {5…160} was flat on both datasets (live MAE 16.0-16.2, proxy 9.2-9.4), so the data can't pick k. Take the conservative end, where a person's own estimate gets half weight at 30 predictions.
  - Minimum **nMin = 30** honest predictions before any per-person term. The eval used 10, which is optimistic.
  - **Monotone:** the total slope stays at least 0.3 of the population's, so the order of a person's films never changes.
- **Cap:** at most ±8 points (proxy tuning chose 8 from {4, 8, 12}).
- **Slow updates:** fitted nightly only (never at rating time), with an EWMA over the person's rows. Half-life is 60 predictions with a floor of 0.25 per row, so old rows never vanish. Between nights the map is fixed. The eval showed why this matters: a map that moves after every rating cut within-person Spearman from 0.30 to 0.25 in the 30+ bucket, even though each snapshot was monotone.
- **Where it's applied:** in `lib/taste/film-scores.ts`, after `atSpread`, wherever shown numbers are read. Stored scores (`user_score_vec`) stay raw. Top-N order is unchanged because the map is monotone per person. "Called it" (`expectedByStar`) must read the same post-layer numbers so verdicts stay on one scale.

### 4b. Chip guidance (after enough data exists)

- **Chip → feature map** (new `lib/taste/chip-features.ts`). Every chip maps to a label-lean dimension or flag the model already has:
  - pacing → propulsion
  - ending → ambiguous_ending, plot_clarity
  - emotional_payoff → tearjerker, warmth, heaviness
  - story → plot_clarity, brain_demand
  - characters → moral_greyness, warmth

  The planned film-specific chips (thematic_tags, moods, tmdb_keywords, runtime, DNA strands, lanes) each map either to an existing dimension or flag, or to a candidate new feature. A candidate feature has to win the normal model eval (`scripts/eval-label-lean.mjs`) before it counts.
- **Per person:**
  - A dimension becomes "guided" only after the same chip-feature appears on ≥3 rated films (counting hits and misses alike, signed by whether the film was a hit or a miss).
  - Guidance lowers that dimension's ridge from 60 toward a floor of 20, by m/(m+5) for m chip-tagged films.
  - Guidance decays with a 180-day half-life.
  - The resulting per-dimension lean stays capped by the existing label-lean range, and the whole lean is still one feature whose weight the refit decides.
  - So chips decide where; ratings and calibration decide how much. The output layer in 4a never reads chips.
- **Turn-on threshold:** ≥200 chip-tagged ratings from ≥20 people. Keep it only if, on a time split, it beats 4a alone on held-out within-person AUC and MAE, without hurting the <30-rating bucket.

### 4c. Guardrails

- **Kill switch:** `ai_cache` key `match-posthoc:enabled` (checked at read, cached 60 s), plus env `MATCH_POSTHOC=off`. Either one turns it off and returns the raw numbers immediately.
- **Per-person cap** of ±8 points (above), and a population cap of ±8 too.
- **Permanent 10% holdout:** `hash(owner_key ∥ slug) mod 10 = 0` marks a prediction `holdout = true` at capture. It is never used to fit, and kept forever.
- **Logging:** each nightly fit writes n, a, b, c_u, d_u, s, cap hits, and holdout metrics per person and in total (new table `match_posthoc_fit`).
- **Weekly monitor:** compare raw vs calibrated on the holdout over a rolling 4 weeks (MAE in points, MAE in percentile, Called it, within-person Spearman), overall and by bucket. Alert, and auto-flip the switch, if the calibrated MAE is worse than raw by more than 1 point, or Called it is worse by more than 3 points, with n ≥ 50. A GitHub issue is opened with the numbers.

## 5. Offline results

Two protocols:

- **Proxy:** held_out guesses, time-split per person (first 70% of each person's ratings by watched date for training, last 30% for testing). k and the cap were tuned on an inner split of the training part only.
- **Live:** honest predictions, prequential. Each rating is scored with a layer fitted only on rows rated before it. Settings were carried over from the proxy unchanged.

Called it here uses `DEFAULT_BY_STAR`, not the app's per-person star table, so the absolute rates differ from the in-app numbers. dMAE is method MAE minus raw MAE, with a 90% person-clustered bootstrap interval.

Methods:
- **M0:** raw.
- **M1:** population line.
- **M2:** M1 plus a shrunk per-person layer (k = 5 from tuning, nMin 10, cap 8).
- **M3:** M2 plus a genre/lane/decade tilt (≥3 films, shrunk at 6, cap ±3), standing in for chips.

### Live (honest, 194 ratings, 13 people; 96% old model)

| method | Spearman pooled | within person | MAE star pts | Called it | bias | pair churn | dMAE 90% |
|---|---|---|---|---|---|---|---|
| M0 raw | 0.09 | 0.22 | 19.0 | 30% | +11.2 | 0% | |
| M1 pop | 0.21 | 0.21 | 16.4 | 30% | +7.1 | 3% | [-4.8, -0.2] |
| M2 user | 0.29 | 0.21 | **16.0** | **33%** | +7.9 | 4% | [-5.3, -0.8] |
| M3 tilt | 0.30 | 0.22 | 15.9 | 32% | +7.9 | 6% | [-5.3, -0.8] |

Percentile space (layer fitted to the rating's percentile instead): MAE 26.3 → 24.6 (M1) / 24.8 (M2).

Pooled Spearman rises because people are put on a common level. Within-person order doesn't improve, and can't, because the layer is monotone. The 3-6% churn comes only from the map changing over time.

### By data bucket (live; "prior" = that person's honest predictions before this one)

| bucket | n | M0 MAE / Called | M1 | M2 | M3 |
|---|---|---|---|---|---|
| 0-9 prior | 55 | 16.5 / 36% | 14.4 / 42% | 14.4 / 42% | 14.4 / 42% |
| 10-29 prior | 60 | 21.8 / 27% | 18.1 / **23%** | 17.5 / 27% | 17.5 / 27% |
| 30+ prior | 79 | 18.7 / 29% | 16.4 / 28% | 15.8 / 32% | 15.8 / 30% |

The layer doesn't hurt people with little data: in the 0-9 bucket it is the population line only. The population line alone lowered Called it in the 10-29 bucket, which is a reason to watch Called it, not only MAE.

### Proxy (current-ish model, 460 test ratings, 3 people)

| method | within-person Spearman | MAE star | MAE pct (pct-fitted) | Called it | pair churn | dMAE 90% |
|---|---|---|---|---|---|---|
| M0 raw | 0.52 | 9.9 | 22.4 | **63%** | 0% | |
| M1 pop | 0.52 | 9.9 | 20.4 | 59% | 0% | [-0.8, +0.4] |
| M2 user | 0.52 | 9.8 | 20.4 | 60% | 0% | [-0.8, +0.2] |
| M3 tilt | 0.53 | 9.8 | 20.4 | 60% | 1% | [-0.8, +0.3] |

Per person (MAE star, raw → M2): 8.6 → 8.6, 13.4 → 12.7, **10.8 → 11.6 (worse)**.

**Verdict:**
- The layer reliably fixes a level offset when one exists, as it did on the old model.
- On the current model there is little offset left, and the scale correction compresses numbers enough to cost some "Called it" hits.
- Feature tilts never beat the plain per-person layer, and they add churn. Drop them.

## 6. Risks

- **Too little honest data on today's model** (7 rows). Anything fitted now describes the old model. That is why the thresholds gate everything.
- **Selection bias:** honest rows today are mostly onboarding or grid ratings of remembered films, and the in-app sheet is dominated by one lenient rater. The "recommend, watch, rate" loop (rss/app after a pick) is thin. Weight or segment by source once there's volume.
- **Compression hurts the feel:** a calibrated match is flatter, more 60-75s, and Called it fell on the proxy. The cap of 8 and the requirement to beat raw on Called it as well as MAE guard this.
- **Verdict mismatch:** if the layer ships without `expectedByStar` reading the same post-layer numbers, verdicts mix scales.
- **Model churn:** frequent model versions reset the layer. Down-weighting old-version rows (not deleting them) keeps it from starting cold every time.
- **Chip sparsity and wording:** a chip tapped only on misses would only ever push dimensions down. Asking on hits too (the planned direction) is needed for the "same chip-feature on ≥3 films" rule to work in both directions.
- **Eval caveats:** the proxy's leave-one-out guesses saw the film inside the weights and saw later films, so they are optimistic. Live Called it uses default star targets. Users are identified by hash; a person may hold several profiles.

## 7. Files that would change on "go"

- `supabase/migrations/2026MMDD_match_posthoc.sql`:
  - add to `match_predictions`: `raw_predicted smallint`, `model_version int`, `n_rated int`, `spread real`, `holdout boolean`
  - new tables `match_posthoc` (population and per-person parameters, version, updated_at) and `match_posthoc_fit` (nightly log)
  - RLS on, no policies
- `lib/how-we-did.ts`: `capture()` stores the raw score (pre-layer), model version, n_rated, spread and the holdout flag. `expectedByStar` reads post-layer numbers.
- `lib/taste/posthoc-calibration.ts` (new): pure fit and apply functions, constants (K = 30, NMIN = 30, CAP = 8, half-life, thresholds), monotone check.
- `lib/taste/film-scores.ts`: apply the layer after `atSpread` in `asShown`, `fetchFilmScores` and `fetchTopFilmScores`, behind the kill switch, with a 60 s cache like `spreadCache`.
- `scripts/fit-posthoc-calibration.mjs` (new) plus a step in `.github/workflows/nightly-match-scores.yml`, run after `scripts/backfill-match-scores.mjs`.
- `scripts/eval-live.ts`: holdout section (raw vs calibrated, by bucket). New `.github/workflows/weekly-calibration-monitor.yml` for the alert and auto-off.
- `scripts/eval-learn-from-predictions.mjs`: the offline eval in this report. Move it from the worktree, and give it a DB-read mode instead of JSON exports.
- Later, for chips: `lib/taste/chip-features.ts` (new), `lib/how-we-did.ts` (`HELD_BACK` becomes a chip catalog for hits and misses), `lib/taste/match-model.mjs` (per-dimension ridge in the label-lean fit), `lib/taste/match-score-update.ts` and `scripts/backfill-match-scores.mjs` (pass chip guidance into the fit), and `scripts/eval-label-lean.mjs` (chip-guided vs unguided).
- Unchanged: `lib/rating-predictions.ts` stays diagnostics only. Add a comment that held_out rows must never train the layer.

## Appendix: how to re-run

The data is exported with read-only SELECTs into `.work/learn/{live,heldout,lanes}.json` (queries in the session log: match_predictions plus film features; rating_predictions plus library ratings and percentiles; film_clusters to parent lane). Then run:

```
cd /home/user/wt-learn && node scripts/eval-learn-from-predictions.mjs --json
```
