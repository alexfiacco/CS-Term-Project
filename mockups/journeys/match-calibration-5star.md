# Match % on films rated 5 stars: calibration audit

2026-11-12. Read-only: SELECT queries on Supabase `uktamekqqsiijugpaxit`, and the code in `/home/user/montage` at `05fda487`. Nothing was written to the database or to the app.

## Short answer

- **I could not reproduce "mostly 66–74%" for the owner's 5★ films in today's data.** The owner's account is `467a3dgd` (1,080 rated; named as the owner in `docs/DATA-SCIENCE-LOG.md` and `scripts/smoke.mjs`). Across all 40 of their 5★ films, the web card shows a median of **94** and the "What we'd have predicted" row shows a median of **~90**. Only 3 of the 40 show 74 or less.
- **Most likely source of the report:** the films the owner rated in the app. 4 of their 7 in-app 5★ films have held-out guesses of **64–70**: The Lion King 64, La La Land 67, The Odyssey 68 and The Prestige 70. Through the display curve those read 73–82; on a client without the curve (an iOS build from before 2026-11-11) they read 64–70. These are real misses, not a display bug: on each one, the person's own neighbours and the crowd point to "good, typical", and the owner liked it more.
- **Real defects found:**
  1. The model 9 share cap can blow up a thin profile's weights.
  2. On thin profiles, the share cap undoes the cold-start shrink. This is the case Fable flagged.
  3. The web and iOS apps show different numbers for a rated film. Web shows the in-sample stored score; iOS shows the held-out one.
  4. A handful of accounts have a low level offset, so their loves sit in the 55–75 band.
- **Overall, scores are not compressed.** On rated films, only 17% of shown stored scores fall in 55–75, and 30% of held-out ones do. The bands are monotone and roughly calibrated (see section 3).

## Data and method

- **Ratings:** `public_profiles.library_json.rated`, with the person's `user_ratings` rows on top (the newest wins). This is the same merge `full-pass-io.ts` uses.
- **Stored score:** `user_score_vec`, unpacked through `score_catalog` (what `get_film_score_map` and `fetchFilmScoreMap` read). It is put through `atSpread` using the account's `n_rated` from `user_match_calibration`, then through the display curve `shownMatch` (`lib/taste/shown-match.ts`).
- **Held-out score:** `rating_predictions.predicted` with `source='held_out'`. This is the value `leaveOneOutScores` writes, already at the account's spread.
- **Coverage:** stored scores for 23 accounts (5,573 rated films). Held-out scores for 8 accounts with 30 or more rows (2,646 films). The owner's account has 1,080 of those.
- **Metrics:** Spearman with average ranks. AUC is Mann–Whitney for "rated 4.5★ or more". "Pooled" means across accounts; "per-user" is the mean over accounts. Folds for the backtest are `hashtext(slug) % 5`, and every recalibration is fitted on the other four folds.

## 1. The owner's 5★ distribution (`467a3dgd`)

Quantiles are p10 / p25 / p50 / p75 / p90.

| Stars | n | Stored (raw) | Shown, from stored (web card) | Held-out (raw) | Shown, from held-out (iOS, "What we'd have predicted") |
|---|---|---|---|---|---|
| 5 | 40 | 80 / 85 / 88.5 / 91 / 94 | 89 / 92 / 94 / 95 / 96.5 | 67 / 70 / 81 / 86 / 89 | 78 / 82 / 90 / 92 / 94 |
| 4.5 | 104 | 73 / 81 / 84.5 / 88 / 90 | 84 / 90 / 92 / 94 / 94.5 | 61 / 67 / 70 / 80 / 85 | 69 / 78 / 82 / 89 / 92 |
| 4 | 331 | 68 / 73 / 80 / 85 / 88 | 79 / 84 / 89 / 92 / 93.5 | 55 / 62 / 67 / 72 / 80 | 58 / 70 / 78 / 84 / 89 |
| 3.5 | 353 | 49 / 57 / 64 / 68 / 74 | 48 / 61 / 73 / 79 / 85 | 47 / 55 / 63 / 67 / 74 | 44 / 58 / 71 / 78 / 85 |
| ≤3 | 253 | 14 / 26 / 38 / 53 / 60 | 11 / 21 / 33 / 55 / 66 | 23 / 34 / 48 / 60 / 66 | 18 / 29 / 46 / 66 / 76 |

For this account, a shown 66–74 is the typical 3.5★ film. On the held-out path, 4 of the 40 5★ films show 65–77; on the stored path, none do.

The lowest held-out 5★ films (raw → shown) are:

| Film | Held-out raw | Shown |
|---|---|---|
| Your Name | 62 | 70 |
| The Lion King | 64 | 73 |
| It's a Wonderful Life | 65 | 75 |
| Like Stars on Earth | 65 | 75 |
| La La Land | 67 | 78 |
| There Will Be Blood | 68 | 79 |
| Shrek | 68 | 79 |
| Get Out | 68 | 79 |
| The Odyssey | 68 | 79 |
| 12 Years a Slave | 69 | 81 |
| The Prestige | 70 | 82 |

Their stored scores are 75–85. The 8–15 point gap is the film's own rating leaking into the stored score (section 2).

## 2. Is the number on a rated film computed leave-one-out?

**It depends on the surface, and web and iOS disagree.**

- **Stored score (`user_score_vec`): not leave-one-out.** `scoreShard` (`lib/taste/full-pass.ts:157`) calls `v3Features(model, st, c)` with no `selfIdx`. A rated film is therefore its own nearest neighbour: similarity 1, so the full weight under `sim³` in `knnLocal`, and `labelLean` reads its exact self entry. Only the per-user fit (`v3Training`) is leave-one-out. The leak is large. For the owner, Spearman between rating and stored score is **0.86**, against **0.60** held-out; AUC for 4.5★+ is 0.89 against 0.81.
- **Held-out (`rating_predictions`, written by `leaveOneOutScores`): leave-one-out on the features** (`v3Features(..., j)`). The weights and the reference scale `refQ` were still fitted with the film included. That is a minor leak.
- **What each app shows for a rated film:**
  - Web card (`app/_components/Result.tsx:3714`): `rowGuess?.predicted ?? res.score`. That is the honest pre-rating number when one was logged in `match_predictions`, otherwise the **in-sample stored score**.
  - Web "What we'd have predicted" row (`Result.tsx:3916`): the held-out score.
  - iOS (`FilmScreen.swift:599`): `said ?? fresh ?? predictedBefore (held-out) ?? stored`.
  - So the same 5★ film can read 93 on the web card and 73 on iOS or in the web drawer (The Lion King: stored 75 → 86 shown, held-out 64 → 73 shown).
- **Recommendation:** a rated film should never show the in-sample stored score. Its stored score mostly echoes the person's own stars, and putting a 93 next to a 5★ says nothing. Show "what we'd have predicted": the logged pre-rating number when one exists, else the held-out one, labelled as such. That is the question the owner is really asking ("did you see this coming?"). It is also the only number on a rated film that can be checked against the rating. Make the web card read `said ?? predictedMatch ?? score`, as iOS does.
- **Staleness:** held-out rows carry no `model_version` (all null), and the upsert keeps the first `rated_at` (all 2026-10-22 for the owner). Their age cannot be told from the table. Write `model_version` and an updated-at time on every held-out refresh.

## 3. Calibration across all users

Shown band against actual rating, pooled across accounts:

| Band (shown) | Stored path: n | Mean ★ | P(≥4.5★) | P(≥4★) | Held-out path: n | Mean ★ | P(≥4.5★) | P(≥4★) |
|---|---|---|---|---|---|---|---|---|
| Love 90+ | 1,519 | 4.31 | 0.47 | 0.96 | 313 | 4.34 | 0.51 | 0.91 |
| Really like 78–89 | 1,177 | 4.00 | 0.24 | 0.71 | 615 | 4.00 | 0.27 | 0.73 |
| Like 65–77 | 831 | 3.73 | 0.12 | 0.38 | 654 | 3.76 | 0.13 | 0.55 |
| 50–64 | 612 | 3.46 | 0.07 | 0.20 | 471 | 3.53 | 0.05 | 0.33 |
| Under 50 | 1,434 | 2.79 | 0.03 | 0.07 | 593 | 2.99 | 0.02 | 0.11 |

- The bands are monotone and sensibly ordered on both paths.
- **Spread:** 55–75 holds 17% of rated films on the stored path and 30% on the held-out path. SD of shown scores is 28 and 22.
- **Where 5★ land:** pooled, held-out 5★ films have a shown median of 92; 57% read 90+, and 14% read under 78.

**The accounts where 5★ really do land in "like"** (stored → shown, mean over 5★ films):

| Account | Rated | 5★ shown | Spearman | Note |
|---|---|---|---|---|
| `ymbkwaf2` | 234 | 69 (4.5★: 58) | 0.56 | Their 4.5★+ films have a crowd average of only 3.65, so the fixed reference-set scale puts them near the 60th percentile. This is a level offset, not a ranking failure. |
| `mf7j6b2m` | 105 | 75 | 0.33 | |
| `4r7bwc7t` | 32 | 76 | 0.26 | |
| `mcrd3w6r` | 34 | 70 | 0.42 | |
| `n4gfx95v` | 26 | 63 | **−0.51** | Not explained here. Recheck its ratings and rescore. |
| `supcn9cd` | 13 | 55 | **−0.60** | Broken weights; see 4a. |

## 4. Why 5★ films land low

Each candidate cause in turn.

### a. The share cap: a real bug

`constrainShares` (`match-model.mjs:758`) scales each group by `target mass / current mass`, where mass is Σ|w|·SD over the shrunk training rows (`featureSd(Xn)` in `v3FitUser`).

**When a group's SD is about zero, the factor explodes.** `supcn9cd` (13 rated, shrink 0.317) has stored weights genreAff **2.6e15**, directorAff 1.0e15, decadeAff 1.4e15 and labelLean 4.2e15. The population values are 0.49, 0.19, 0.26 and 0.78. Its scores are effectively noise, and inverted: Spearman −0.60, 5★ shown 55.

**On ordinary thin profiles the cap cancels the cold-start shrink, as Fable feared.** The shrink multiplies the personal features by s = n/(n+K'). Their SD over the training rows falls by s, so the crowd group looks over its 20% share. The cap then moves the "freed" movement back into the personal groups, growing them by about 1/s. Example, `mcrd3w6r` (34 rated, s = 0.577):

| Weight | `mcrd3w6r` | Population | Ratio |
|---|---|---|---|
| genreAff | 0.77 | 0.49 | 1.6× |
| directorAff | 0.33 | 0.19 | 1.7× |
| decadeAff | 0.43 | 0.26 | 1.7× |
| labelLean | 1.20 | 0.78 | 1.5× |

Those ratios are close to 1/s = 1.73: the DNA group is put back at full strength, and the shrink does nothing on it. The thin accounts in the table above are exactly the ones with low or negative Spearman.

The owner's account is not affected: at 1,080 rated films, s = 1, and the cap only moves 'other' into 'similar' and 'DNA'.

### b. Crowd weight pulling to the mean: partly

- For the owner it does not drag 5★ films down. Their 5★ films have a crowd average of 4.21 against 3.67 for the rest, so the crowd pushes them up.
- For `ymbkwaf2`-type accounts (loves the crowd rates about 3.6), the crowd term and the reference-set percentile scale together put loves around stored 59–64. That is the "shown 66–74" pattern exactly, but on those accounts, not the owner's.

### c. The display curve: no

It is monotone and lifts the upper middle (60 → 66, 70 → 82). It turns a stored 64 into a 73. It cannot make a stored 88 into a 70.

### d. Stale scores: possible, but cannot be checked

- The owner's `user_score_vec` was rewritten 2026-11-12 00:52.
- Held-out rows have no version or refresh time (see 2).
- An iOS build from before the 2026-11-11 curve would show raw held-out values (5★ p10–p25 = 67–70).

### e. Compression in the model: no

The full-width rank scale (`V3_ANCHORS`) spreads scores widely: SD 28 shown on rated films.

## 5. Fixes and held-out backtest

The backtest uses the held-out path: 8 accounts, 2,646 rated films, 5-fold, each fix fitted on the other folds. A second run on the stored path (23 accounts, 5,573 films) covers the thin and offset accounts. Stored-path numbers are inflated by the self-leak, but equally for the baseline and the fix. Per-user Spearman and AUC are unchanged by every fix below, because each is monotone within an account. Only pooled ranking and calibration move.

**The fixes tested:**

- **A. Percentile map onto the person's own ratings.** A film's held-out score becomes its percentile among the training-fold scores. That percentile becomes the person's training-fold rating at the same quantile (`percentile_cont`). The rating becomes a match % on a fixed star scale: 5★ = 96, 4.5 = 90, 4 = 82, 3.5 = 70, 3 = 55, 2.5 = 40, 2 = 30, 1 = 15.
- **B. Linear fit, rating against score per user,** put on the same star scale.
- **D. Two-anchor stretch.** The person's mean score for 4.5★+ films goes to 85 and for ≤3★ films goes to 40, blended by n/(n+50).
- **E. Shift only.** The person's median score for 4.5★+ films goes to 80, blended by n/(n+50).
- **F. Lift only.** As E, but only raises, with a target of 78.

**Held-out path**

| Fix | Spearman, pooled | AUC 4.5★+, pooled | Per-user Spearman / AUC | 5★ median shown | 5★ at 90+ | 5★ under 78 | Shown 55–75 | Love band: n / mean ★ / P(≥4.5★) |
|---|---|---|---|---|---|---|---|---|
| Base | 0.636 | 0.804 | 0.640 / 0.834 | 92 | 57% | 14% | 30% | 313 / 4.34 / 0.51 |
| **A: percentile map** | **0.658** | **0.828** | 0.636 / 0.834 | 91 | **78%** | **6%** | 43% | **448 / 4.35 / 0.56** |
| B: linear fit | 0.675 | 0.846 | 0.623 / 0.826 | 88 | 40% | 10% | 37% | 108 / 4.67 / 0.85 |
| D: two-anchor | 0.628 | 0.801 | n/a | 96 | 73% | 10% | 18% | 566 / 4.21 / 0.42 |
| E: shift to 80 | 0.606 | 0.792 | n/a | 92 | 66% | 11% | n/a | 454 / 4.24 / 0.44 |
| F: lift to 78 | 0.626 | 0.800 | n/a | 93 | 67% | 10% | n/a | 441 / 4.25 / 0.45 |

Calibration by band on the held-out path (n / mean ★ / P(≥4.5★)):

| Band | Base | A: percentile map |
|---|---|---|
| Love 90+ | 313 / 4.34 / 0.51 | 448 / 4.35 / 0.56 |
| Really like 78–89 | 615 / 4.00 / 0.27 | 867 / 3.89 / 0.17 |
| Like 65–77 | 654 / 3.76 / 0.13 | 680 / 3.55 / 0.05 |
| 50–64 | 471 / 3.53 / 0.05 | 458 / 3.24 / 0.03 |
| Under 50 | 593 / 2.99 / 0.02 | 193 / 2.59 / 0.01 |

**Stored path** (all 23 accounts, including the offset ones)

| Fix | Spearman, pooled | AUC, pooled | 5★ under 78 | Love band P(≥4.5★) | 5★ median: `ymbkwaf2` / `mf7j6b2m` / `4r7bwc7t` / `mcrd3w6r` |
|---|---|---|---|---|---|
| Base | 0.769 | 0.804 | 16% | 0.47 | 81 / 84 / 73 / 71 |
| D: two-anchor | 0.791 | 0.817 | 10% | 0.46 | n/a |
| E: shift to 80 | 0.807 | 0.838 | 11% | 0.56 | 91 / 89 / 82 / 82 |
| F: lift to 78 | 0.789 | 0.820 | 12% | 0.47 | 90 / 88 / 81 / 81 |

**What the numbers say:**

- **A is the best fix on held-out data.** 5★ films in love rise from 57% to 78%, and 5★ films under 78 fall from 14% to 6%. Pooled Spearman goes 0.636 → 0.658 and AUC 0.804 → 0.828. The love band gets bigger *and* more precise (P(≥4.5★) 0.51 → 0.56).
- **A's costs.** It is lumpy, because ratings are discrete. It compresses the middle: shown 55–75 goes from 30% to 43%. It lifts films the person disliked: the owner's ≤3★ median goes 46 → 55.
- **B is honest but over-cautious.** Only 4% of films read 90+, so it would make "love" rare.
- **D, E and F help the offset accounts** (their 5★ films go from 71–84 to 81–91) but slightly worsen pooled held-out ranking.

## 6. Recommendation

In priority order.

1. **Fix the share cap** (`constrainShares`, `v3FitUser`, `v3Population`).
   - Skip any group whose mass is under about 1e-6 of the total.
   - Clamp every group factor to at most 2×.
   - Measure shares on the *unshrunk* normalised features, so the shrink survives.
   - Apply the cap only from 100 rated films, as Fable suggested.
   - Then rescore every account under 100 rated. That covers `supcn9cd`, `n4gfx95v`, `4r7bwc7t`, `mcrd3w6r`, `j9zpqg22` and `mf7j6b2m`, about 260 rated films in all.
   - I cannot backtest this without the service key. Run `scripts/eval-cold-start.mjs` and `scripts/eval-match-v9.ts` with the cap on, off and fixed. Success: no weight over 10, and Spearman above 0 on every account.
2. **Show "what we'd have predicted" on every rated film.** On web, the card should read `said ?? predictedMatch ?? score`, so web matches iOS. Never show the in-sample stored score on a rated film.
3. **Recalibrate each person's shown % on their own held-out history: fix A,** smoothed by interpolating within tied star levels. Use it for accounts with 100 or more held-out rows; below that, blend toward the current curve by n/(n+100).
   - Expected effect (held-out backtest): 5★ films in love 57% → 78%, 5★ under 78 14% → 6%, pooled AUC for 4.5★+ 0.804 → 0.828, Spearman 0.636 → 0.658, love-band precision 0.51 → 0.56. Per-user ranking unchanged.
   - It is display-only, like `shownMatch`. Fit it in the full pass from `rating_predictions` held-out rows and store it per account. For accounts without held-out rows, run `backfillHeldOut` first. Today only 8 of 23 accounts have them.
4. **Log `model_version` and a refresh time on held-out rows,** so stale ones can be found.

The owner's own 5★ films change little under any of these: under A, their median stays about 90 and p10 goes 78 → 81. The 4 in-app 5★ films at 64–70 held-out are genuine misses, and fix A would show them at about 82 (they sit near the 60th percentile of the owner's held-out scores, where the owner's ratings are 4★).
