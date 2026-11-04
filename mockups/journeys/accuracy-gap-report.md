# Why the live match looks worse than the offline one, and how good model 7 really is

2026-11-04. This was a read-only investigation. Nothing in production changed: no writes, no migrations, no pushes. All database access was SELECTs on Supabase project uktamekqqsiijugpaxit. The work used:

- the production model code, imported as is from `/home/user/montage/lib/taste/match-model.mjs`
- exports in `/home/user/wt-learn/.work/gap/` (git-ignored; users appear only as md5 prefixes, films as md5(slug) prefixes, no titles)

Scripts in that folder:

- `eval-gap.mjs`: leakage and time split
- `eval-gap2.mjs`: learning curve and ten model variants
- `eval-gap3.mjs`: label-space neighbours
- `eval-replay.mjs`: model 7 replayed on the live predictions
- `live_an.py` and `range_an.py`: live data cuts

## Summary for the owner

- **The 0.22 vs 0.52 gap is mostly not leakage and not the old model. It comes from who and what we measured.** The 0.52 comes from people with long Letterboxd histories, scored over their whole library. That library includes years of backlog that is easy to rank. The 0.22 comes from three new accounts rating popular films in onboarding grids. Two of them had 7 and 30 ratings when they were scored.
- **Leakage is real but small.** Taking the film out of the person's weights changes the score order by only 0.01-0.03. Taking out everything rated after the film costs another 0.00-0.06.
- **Model 7 is not better than the old model on the live films.** I replayed model 7 on the same 157 live films, trained only on what each person had rated before. It ordered them about as well as, or slightly worse than, the number we actually showed: 0.19 average against 0.21. So we should not expect model 7's live number to climb to 0.5 by itself.
- **Our best honest estimate for model 7 (ordering, 1 = perfect, 0 = random):**
  - About 0.63 for an established Letterboxd user (500+ ratings) predicting the next films they log.
  - About 0.57 at 100 ratings.
  - About 0.48 at 30 ratings, which is no better than sorting by the Letterboxd average alone (0.49).
  - About 0.2-0.3 for onboarding-style in-app users, who are most of our live data.
  - "Called it" (within 10 points, using the app's own star table) lands about 70% of the time for established users and 45-50% for new in-app users.
- **Where the order breaks down:** the model leans mostly on the crowd rating. When the films being rated all have similar Letterboxd averages, it has little to go on. A typical onboarding grid of well-known films is exactly that case. On those films the honest score drops by 0.10-0.22.
- **Tuning the current model won't fix ordering.** Ten variants all landed within ±0.02 of today's model: prior strength, like threshold, an ordinal fit, recency weighting, a label-based neighbour signal, and a per-person popularity weight. The order can only improve with new information or better use of thin profiles.
- **Three things most likely to help:**
  1. Lean on the crowd until a person has rated enough. This showed a small but consistent gain at 30 ratings, and a large one for the coldest live accounts.
  2. Pick onboarding films that teach us something.
  3. Add a real "people like you" signal.

  Gains and tests for each are in section 6.

---

## 1. Data and how faithful the re-run is

The kNN pass (similarity of each film to the person's rated films, from the 1,536-d embeddings) was computed in SQL with pgvector. Everything else ran through the production model functions: `v3Stats`, `labelFit`/`labelLean`, `v3FitUser`, `v3Logit`, `v3Scale`, `v3FilmScore` and `spreadFor`/`atSpread`.

**Accounts.** I used the five accounts with the most ratings that I could time-order:

| account | rated films (model's count) | source of ratings | dated? |
|---|---|---|---|
| 16fec5 | 1,078 | Letterboxd import, 2021-2026 | yes |
| 31537e | 872 | Letterboxd import, 2017-2026 | yes |
| 29eae5 | 561 | Letterboxd import, 2021-2026 | yes |
| 91c12a | 420 | 41 imported, 379 in-app (onboarding grids, 11 days) | yes |
| 5f60e8 | 105 | 30 imported, 75 in-app over 2 days | partly |

For the replay I also used b481a0 (70 films, 46 live predictions). Live predictions come from 13 people, but only these 3 have more than 6 rated, so the live within-person numbers rest on 5f60e8, 91c12a and b481a0.

**Fidelity checks:**

- My refit of each person's weights matches the stored `user_match_calibration.weights` to within 0.003-0.014 on every coefficient.
- For 16fec5, my held-out scores match the stored `rating_predictions` held_out rows with Spearman 0.999 and a mean difference of 0.2 points. For 91c12a it is 0.94 and 4 points; their stored rows are a few days older than their current library.

**Protocols (per person):**

- **In-sample (= held_out).** This is what `backfillHeldOut`/`leaveOneOutScores` does. The film is left out of its own features, but the weights are fitted with it, and all of the person's other films, past and future, are available.
- **Film out of weights.** The same features, but the weights are refitted in 20 folds so a scored film's own like/dislike never enters its weights.
- **Honest time split.** Ratings are ordered by date. The first 70% are the past and the last 30% are the test. Everything is rebuilt from the past only: kNN, affinities, label fit, weights, and the reference scale (200 films sampled evenly from the 6,000 most-watched). Test films are then scored the way the app would have scored them.
- **Learning curve.** The same test films, with the model built from only the first 30 or the first 100 ratings.
- **Replay.** For each live user, the model is built from everything rated before their first live prediction and scores exactly the films we showed them live.

Scores are compared with the person's stars using:

- within-person Spearman, the main ordering metric
- AUC for 3.5 stars and up
- MAE in percentile space: |shown − the rating's percentile among that person's ratings|
- "Called it": within 10 points of the star's typical match. "Default" uses `DEFAULT_BY_STAR`. "Own table" uses the median shown score at each star among the person's past films, as `expectedByStar` does in the app.

## 2. Question 1: is 0.52 inflated by leakage?

Within-person Spearman, current model 7:

| account | in-sample = held_out (all films) | film out of weights (all films) | in-sample, test films only | **honest time split (test films)** | 90% CI (honest) |
|---|---|---|---|---|---|
| 16fec5 | 0.73 | 0.72 | 0.55 | **0.56** | 0.47-0.64 |
| 31537e | 0.77 | 0.76 | 0.70 | **0.64** | 0.56-0.71 |
| 29eae5 | 0.74 | 0.73 | 0.70 | **0.68** | 0.58-0.76 |
| 91c12a | 0.47 | 0.44 | 0.36 | **0.31** | 0.15-0.44 |
| 5f60e8 | 0.43 | 0.42 | 0.38 | **0.21** (n=32) | -0.18-0.57 |

AUC, in-sample → honest: 0.88→0.77, 0.89→0.85, 0.90→0.82, 0.78→0.70, 0.96→0.90.

The drop from in-sample to honest breaks into three parts:

1. **The film in its own weights: about 0.01-0.03.** Compare the first and second columns. Each film is 1 row out of hundreds, behind a prior worth 20 films. The features are already leave-one-out, and `labelLean` is exact leave-one-out. **This is the only part that is strictly leakage, and it is small.**
2. **Future films as neighbours and affinities: about 0.00-0.06.** Compare the third and fourth columns on the same films.
3. **Which films are scored: the largest part, up to 0.18 (16fec5).** Compare the first and third columns.
   - The whole library includes the person's backlog: the classics and duds they logged when they joined, which are easy to rank.
   - The films they log later have a narrower star range. For 16fec5 the star SD is 0.66 across the library but 0.53 in the test period, and those films are harder to order even in-sample.

So the old "held_out 0.52" was not mainly a leak. It was measured on easier films and on established users.

## 3. Question 2: are the live 0.22 predictions mostly old-model?

Yes, but that is not why they are low.

By era, using the predicted_at date (within-person, people with ≥5 rated):

| era | rows | within-person Spearman |
|---|---|---|
| up to Oct 8 (model 3) | 129 | 0.23 (5f60e8 0.22, 91c12a 0.24) |
| Oct 9-26 (model 4) | 58 | 0.12 (b481a0 0.22; cf2c61 0.03 on 6) |
| Oct 27 on (models 5-7) | 7 | too few |

By source: app (film sheet) 0.26 (5f60e8 only), grid 0.13 (3 people), rss too few.

**Replay of model 7 on the same live films** (trained only on what was rated before):

| account | ratings before | live films | shown live (old model) | **model 7 replay** | model 7 + cold-start shrink | crowd average alone |
|---|---|---|---|---|---|---|
| 91c12a | 350 | 61 | 0.23 | **0.30** | 0.28 | -0.03 |
| 5f60e8 | 30 | 53 | 0.22 | **0.17** | 0.23 | 0.26 |
| b481a0 | 7 | 43 | 0.17 | **0.10** | 0.31 | 0.35 |
| mean | | 157 | 0.21 | **0.19** | 0.27 | 0.19 |

The other metrics, live vs replay:

| account | MAE (percentile) | Called it (default table) | Called it (replay, own table) |
|---|---|---|---|
| 91c12a | 29.9 vs 31.4 | 44% vs 41% | 49% |
| 5f60e8 | 24.0 vs 24.7 | 19% vs 15% | 45% |
| b481a0 | 26.0 vs 26.6 | 28% vs 42% | 42% |

**Model 7 would not have done better on these films.** The replay agrees with what we showed (rank correlation 0.82 with the live numbers for 91c12a and 5f60e8). For the two cold accounts it did worse than simply sorting by the Letterboxd average.

## 4. Question 3: other causes

**Cold start (large).** Learning curve on the same honest test films (mean of 16fec5, 31537e and 29eae5):

| ratings the model has | 30 | 100 | 390-750 (70%) |
|---|---|---|---|
| model 7 | 0.48 | 0.57 | 0.63 |
| Letterboxd average alone | 0.49 | 0.49 | 0.49 |

At 30 ratings the personal part adds nothing yet. The live accounts were at 7, 30 and roughly 40-350 ratings when they were scored.

**Narrow crowd range (large).** The model's strongest weight is the crowd rating: population weight +1.34, the largest. When the films being ranked have similar Letterboxd averages, that weight cannot separate them.

- Restricting each heavy user's honest test set to well-known films with averages of 3.4-4.2, which is what onboarding grids look like:
  - 16fec5 drops from 0.56 to 0.39
  - 31537e drops from 0.64 to 0.54
  - 29eae5 drops from 0.68 to 0.46
- 91c12a's live films had a crowd-average SD of only 0.25, and the crowd alone ordered them at -0.03.
- Popularity on its own is not the problem: films with 500k+ logs score the same as all films (0.55, 0.65, 0.69).

**In-app onboarding vs Letterboxd history (large; overlaps the two causes above).**

- Honest Spearman is 0.56-0.68 for the three Letterboxd libraries and 0.31 for 91c12a, whose 379 in-app ratings were made in grids over 11 days.
- Grid ratings are fast and from memory, of films the app chose. They are not films the person picked and just watched.

**Restricted star range (moderate for some people, not the live gap).**

- Lenient raters do compress the range: 84% of 5f60e8's live ratings are 4+.
- But the live star SDs (0.65-0.67) are not narrower than the heavy users' test sets. Resampling the heavy users' test films to the live star mix *raises* their Spearman (to 0.60-0.74), so a narrow star spread does not explain the live gap.
- For 16fec5's recent films (SD 0.53) it explains part of the drop from the backlog.

**Compression of the % toward 50 (`spreadFor`) and the popular-film scale (no effect on order).**

- Both are monotone within a person, so they cannot change the order.
- They only add ties when rounded: Spearman on the raw log-odds equals Spearman on the shown % (0.56/0.56, 0.64/0.64, 0.68/0.68, 0.31/0.31).
- They do move MAE and Called it. At 7 ratings b481a0's scores are squeezed to 0.6 of their width. That is why "own table" Called it is far above "default table" Called it for thin profiles: 66% vs 12% for 5f60e8's honest test.

**Star rounding (small).** Half-star ratings tie heavily (most fall between 3.5 and 4.5). This caps Spearman slightly below 1 but does not explain a 0.3 gap.

## 5. Bottom line: the best honest estimate for model 7 today

| who | Spearman | AUC (3.5+) | MAE, percentile pts | MAE vs star target | Called it (own table) | Called it (default) |
|---|---|---|---|---|---|---|
| Established Letterboxd user (390-750 prior ratings), next films logged | **0.63** (0.56-0.68) | 0.81 | **20.5** | 10.9 | **70%** | 59% |
| Same people, model built from 100 ratings | 0.57 | | | | | |
| Same people, model built from 30 ratings | 0.48 (≈ crowd alone) | | | | | |
| In-app onboarding user, 294 prior (91c12a, honest split) | **0.31** (0.15-0.44) | 0.70 | 28.5 | 14.6 | 49% | 44% |
| Live-type films, replayed (3 people, 157 films) | **0.19** | 0.63 | 27.6 | 19.8 | 46% | 33% |

For the people who use the app today, expect model 7 to show about **0.2-0.3** on its honest predictions, not 0.5. That is the same as what the old model showed, and the reasons are the users and the films, not the model version. For a Letterboxd veteran it is genuinely good (about 0.63, AUC about 0.81).

## 6. What would most improve ORDERING

Everything below was measured on the honest time split. Each gain is the paired change in within-person Spearman, with a 90% interval from bootstrapping films within each person.

**Variants that did not help** (all within ±0.02, so don't spend time here):

| variant | @30 | @100 | @70% |
|---|---|---|---|
| prior strength τ=5 / 10 / 40 / 80 (today 20) | -0.03 / -0.02 / +0.01 / +0.015 | ≤ ±0.01 | ≤ ±0.01 |
| like threshold 3.0 or 4.0 (today 3.5) | 0.00 / +0.01 | -0.02 / -0.01 | -0.02 / 0.00 |
| ordinal (3.0 + 3.5 + 4.0 fits summed) | +0.006 | 0.00 | 0.00 |
| recency-weighted fit | +0.01 | 0.00 | -0.005 |
| label-space neighbours (pace/tension/...) as a 2nd kNN | -0.005 | -0.003 | -0.002 |
| per-person popularity weight (informational only; rule 310) | -0.004 | +0.002 | +0.01 |

The current features are used about as well as they can be.

### 1. Lean on the crowd until we know the person (cold-start shrink)

**What.** Pull every personal signal toward the population average by n/(n+30), where n is the number of rated films, both when fitting and when scoring. The personal signals are the kNN pair, the loved and disliked similarity, the genre, director, decade and language affinities, and the label lean. Crowd terms are untouched.

**Gain:**

- Time split: +0.022 at 30 ratings (90% CI +0.009 to +0.037), +0.005 at 100, 0.00 at 70%.
- On the replayed live films: 0.19 → 0.27 on average.
  - b481a0 at 7 ratings: 0.10 → 0.31
  - 5f60e8 at 30 ratings: 0.17 → 0.23
  - 91c12a at 350 ratings: 0.30 → 0.28, a small cost; k could fall with n.
- The replay rests on 3 people and 157 films, so treat +0.08 as the optimistic end. +0.02 to +0.05 for thin profiles is a fair expectation.

**Test.** It is already reproducible offline (`eval-gap2.mjs`, `eval-replay.mjs`). Ship it behind a flag, then compare raw vs shrunk scores on the next 300 honest `match_predictions` from accounts under 100 ratings (store both numbers at capture). It is monotone per person, so it can't make anyone's top picks jump.

### 2. Make onboarding ratings informative (choose what we ask)

**Why.** Going from 30 to 100 ratings is worth +0.09. The films we ask about in grids are popular, similarly-rated films where the main signal goes flat (−0.10 to −0.22 on such films).

**What.** Pick grid films for spread rather than fame:

- Spread across crowd averages, including well-known films rated 2.5-3.3.
- Spread across label clusters and decades.
- Include a few divisive films, where Letterboxd ratings are known to split.
- Keep asking "seen it, didn't like it", so we get dislikes. Live ratings were 59-84% four stars and up.

**Expected gain.** Roughly a third to a half of the 30→100 gap at the same number of taps: **+0.03 to +0.05** after onboarding. This is an estimate and is not measured yet.

**Test.**

- Offline: for each heavy user, build the 30-film training set three ways from their first 200 ratings: chronological, the proposed spread rule, and random. Re-export the kNN for each set (the SQL in `knnN.txt` takes any training set) and compare honest Spearman on the same test films.
- Live: run the new grid selection for half of new sign-ups and compare honest Spearman at 30-60 ratings.

### 3. A real "people like you" signal (new information)

**Why.** Every variant built from today's ingredients (crowd, content embedding, labels, genre, director and decade affinities) lands within 0.02. Nothing in today's inputs separates two well-liked popular films for a given person, and the crowd alone orders onboarding-style films at about 0 for 91c12a. The only kind of signal not tried is how people with overlapping ratings rated the film (collaborative filtering; `docs/COLLAB_FILTERING_PLAN.md`; `user_collab_signal` was dropped on 2026-10-23).

**Expected gain.** Unknown on our data. With about 20 accounts the overlap is thin, so it only becomes testable as the user base grows, or with an external ratings source.

**Test.** Add it as one more feature in the same harness: time split plus replay, with a paired bootstrap. Require +0.03 at 100 ratings and no loss at 30 before it ships.

**Measurement fix.** Not a model change, but needed to see any of these gains: report live accuracy separately for onboarding-grid ratings and for "picked from the app, watched, then rated". Track model 7 on its own; it has 7 honest rows so far. Today's live number mostly measures grid ratings of remembered popular films, where the ceiling is low for any model.

## 7. Caveats

- **Few people.** Five accounts for the time split, three for the live replay, so person-level intervals are wide. The heavy-user results are consistent with each other. The in-app results rest on 91c12a and two thin profiles.
- **Film data is from today.** Crowd averages, labels and embeddings are current, not what they were at prediction time. This would favour the replay slightly, and it still did not beat the live numbers.
- **The replay is conservative.** It uses one cutoff, the person's first live prediction, so it does not refit during a rating burst. Production would have refitted, which matters for 5f60e8 and b481a0.
- **Small approximations.**
  - The reference scale uses 200 sampled films instead of 1,200. This changes the level, not the order.
  - The recommendable-film filter is a SQL approximation of `isDocOrTv`.
  - One film's labels were partly missing and treated as unknown.
- **Undated ratings.** Imported films with no date (41 for 91c12a, 30 for 5f60e8) were placed first in time.
