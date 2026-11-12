# Match scores: can the personal score beat the Letterboxd average on what a person rates next?

2026-11-12. Read-only on Supabase `uktamekqqsiijugpaxit` (SELECT only). Follows `match-time-split.md` and `owner-match-accuracy.md`. Montage commit `b6298bf2` (rule 1555).

## The bar (written before any result was run)

The owner's position: the score stays personal (it is not the Letterboxd average), and it must beat the Letterboxd average at predicting what a person rates next.

**Test.** The time split from `match-time-split.md`: each person's last ~20% of ratings by date, the model fitted only on the earlier ones (19 accounts). Random 5-fold is secondary and cannot overrule it.

**Baselines.**
- *Current*: production model 9 as on montage `main` (`e7929daf`): crowd cap 30%, safe cap, per-person curve on.
- *Letterboxd only*: films ranked by their Letterboxd average alone (3.3 where a film has none). For shown numbers it is put on the shown scale through the person's own stars on training films.

**"Beats the crowd" for one account** means the model's Spearman on that account's held-out films is higher than the Letterboxd-only Spearman on the same films. The same count on AUC for 4.5★+ is reported next to it. The **pooled margin** is the mean over accounts of (model Spearman − Letterboxd-only Spearman), and the same for AUC.

**A change ships only if, on the time split, both hold:**
1. **Ranking not lower beyond noise against current.** The 95% bootstrap interval (over accounts, paired) of the change in mean per-account Spearman, and of the change in mean per-account AUC 4.5★+, does not sit wholly below zero.
2. **More ground against the crowd.** The number of accounts that beat the crowd on Spearman goes up, or the pooled Spearman margin over the crowd goes up by more than 0.005 with the AUC margin not falling.

A change that passes 1 and 2 but breaks an owner rule (the 30% crowd cap, rule 1488; the neighbour-centred crowd reading, rule 1487; the 3.5★ floor, rule 1489) is not shipped: it is reported for the owner to decide.

**Variants, fixed in advance** (each lever gets a few forms; all are reported, none is dropped quietly):
- **A. Similar films.** A1: a film's own series (same TMDB collection, or the same title, which catches a remake) is left out of its nearest films, and each other series counts once (its nearest film). A2: at most 2 of a film's nearest films may share its director. A3: A1 and A2 together. Applied to the nearest-films reading, the loved/disliked likeness, and the neighbour crowd centre.
- **B. Film DNA lean.** B1: a positive Film DNA push is scaled by crowd quality, from 0.4 at a Letterboxd average of 3.3 or less up to 1 at 3.9 or more; a negative push is untouched. B2: the same ramp, on pushes in both directions. B3: the label lean scaled by the film's label confidence (confidence/75, at most 1).
- **C. Crowd first, personal second.** The person's crowd expectation (their own mean plus their own slope on the Letterboxd average) is fitted first; the personal signals are fitted to what is left. C30: crowd share then capped at 30% by rule 1488's own measure. Cfree: no cap, the realised share reported (owner decision if it wins). Cstars: as C30 but fitted to stars (each person's stars on their own scale) instead of liked/not. Clib (diagnostic only, breaks rule 1487): as C30 with the crowd read against the person's whole-library crowd mean instead of the nearest films'. A cap sweep (40%, 50%) is run as a sensitivity check only.
- **D. People like you.** For a film, the ratings of other members against their own crowd expectation, weighted by taste similarity (agreement on films both rated, shrunk) and by shared archetype (primary, and primary + streak blend). It only counts when at least 2 similar members rated the film, and its weight grows with support, n/(n+3). D1: similarity only. D2: similarity and archetype. Only ratings dated before the person's cutoff are used.
- **Best combination:** the forms of A–D that pass on their own, together.

Since the form of each lever is picked on the same held-out films it is judged on, the best-of-several figure is optimistic; this is said next to every such number.

**D is expected to be weak at 23 accounts.** It ships switched off unless it passes 1 and 2 on its own. Reported either way: its coverage, its gain where it has support, and the member count at which it would cover enough films to matter.

**Reported for every variant:** Spearman, AUC 4.5★+, precision@10 and @25, 5★ shown at 85%+, band calibration, per-account wins and losses against current and against Letterboxd only, 95% bootstrap intervals. The owner's account (`467a3dgd`) separately.

**One change to the bar, made after the results and only in the stricter direction.** Test 2 as written ("the count goes up, or the margin goes up") let through two variants where one of the two rose while the other fell (B2: one more account beats the crowd, but the mean margin falls; A3: the margin rises, but two fewer accounts beat the crowd). The reading applied, and the one written into rule 1555: neither the count nor the margin may fall, and at least one must rise. One variant (the fit to stars) passes even that reading and was still not shipped; the reasons are under "Decisions".

## Short answer

- **Before:** the model beats the Letterboxd average on **12 of 19 accounts** on Spearman (95% interval 8 to 16) and on **6 of 18** on AUC for 4.5★+. Mean Spearman 0.432 against 0.398. Mean AUC 0.743 against 0.770: the average alone is still better at picking out a person's 4.5★+ films.
- **After what shipped:** 12 of 19 and 6 of 18, unchanged. The margin over the average moves from +0.034 to +0.041 Spearman, and from −0.027 to −0.023 AUC. It is a small gain and its interval touches zero.
- **What shipped:** one change. Of the rated films that share a director with the film being scored, only the 2 nearest count as its neighbours (A2). Everything else was measured and left off.
- **None of the four levers gets the model clear of the crowd while the 30% crowd cap stands.** The largest lever is again the cap itself: with no cap the model beats the crowd on 13 of 19 accounts, with Spearman 0.456 (+0.024, 95% +0.003 to +0.049) and AUC 0.760. That is the owner's decision (rule 1488) and was not changed.
- **The owner's account:** Spearman 0.471 before, 0.468 after (Letterboxd only 0.426); AUC 0.849 before, 0.854 after (Letterboxd only 0.904). The model already led on Spearman and still trails on AUC. With no cap it would read 0.516 and 0.879.
- **Two of the owner's three miss causes did not hold up as fixes.** Leaving sequels out of the nearest films made things worse for established accounts: a person's stars for the rest of a series do predict the next film in it. Scaling the Film DNA lean down on middling films did not move Spearman.
- **People like you** is built and switched off. It adds nothing on later films with 23 accounts. It does help on random hold-outs, almost only for accounts under 100 ratings. Rough estimate: worth testing again at about 100 members.

## Data and method

- The harness, dumps and split of `match-time-split.md`: production code (`lib/taste/match-model.mjs`, `personal-curve.mjs`) run offline; all 23 profiles; 5,564 rated films after the model's own filters. Time split: each person's last ~20% by date, 19 accounts, 1,059 held-out films, 79 of them 5★. Random 5-fold: 22 accounts, 5,551 films.
- Three small new reads, all SELECT: `film_collection` (9,805 films with a TMDB collection; 1,118 of the 3,878 films in the dump), `film_labels.confidence`, and each profile's archetype mix (`public_profiles.result_json->archetype->top`).
- **Current** reproduces the earlier reports exactly: Spearman 0.432, AUC 0.743, 5★ at 85%+ 56%; owner 0.471 and 0.849.
- Every variant is the production code with one option set. With all options off, the features and the fit are computed by the same lines as before.
- Shown % is the stored score at the account's spread, through the shared curve, then the person's own curve fitted on training films only.
- Intervals are 95% bootstrap over accounts (2,000 draws). "Change" is the paired difference from current in the same draws.
- Precision@10 needs 20+ held-out films; precision@25 needs 50+ (8 accounts on the time split).
- Scripts: `scripts/eval-beat-crowd/` in montage (`run.mjs`, `metrics.mjs`, `peer-scale.mjs`). About 6 minutes per feature set.

## Results: time split (each person's last ~20%)

19 accounts, 1,059 held-out films, 79 five-star. "Beats crowd" counts accounts where the model's figure is above the Letterboxd-only figure on the same films. "Better / worse" counts accounts whose Spearman rose or fell against current.

| Variant | Spearman | change vs current (95%) | AUC 4.5★+ | change (95%) | P@10 4.5★+ / 4★+ | P@25 | 5★ at 85%+ | Band accuracy | Beats crowd: Spearman | AUC | Margin over crowd, Spearman (95%) | Margin, AUC | Better / worse vs current |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Letterboxd average only | 0.398 | −0.034 (−0.116 to +0.046) | 0.770 | +0.027 (−0.022 to +0.073) | 53% / 75% | 34% / 72% | 72% | 40% |  |  |  |  | 7 / 12 |
| Current (model 9) | 0.432 |  | 0.743 |  | 47% / 78% | 36% / 78% | 56% | 38% | 12 of 19 (8–16) | 6 of 18 | +0.034 (−0.046 to +0.117) | −0.027 |  |
| A1 own series out, others once | 0.436 | +0.004 (−0.046 to +0.053) | 0.751 | +0.007 (−0.027 to +0.043) | 48% / 78% | 36% / 75% | 56% | 37% | 9 of 19 (5–13) | 7 of 18 | +0.038 (−0.050 to +0.136) | −0.019 | 8 / 11 |
| **A2 director cap 2 (shipped)** | 0.439 | +0.006 (−0.001 to +0.015) | 0.747 | +0.004 (−0.001 to +0.010) | 44% / 77% | 35% / 76% | 56% | 37% | 12 of 19 (8–16) | 6 of 18 | +0.041 (−0.036 to +0.121) | −0.023 | 9 / 9 |
| A3 = A1 + A2 | 0.447 | +0.015 (−0.029 to +0.069) | 0.763 | +0.020 (−0.008 to +0.056) | 48% / 78% | 35% / 74% | 56% | 38% | 10 of 19 (6–14) | 8 of 18 | +0.049 (−0.044 to +0.150) | −0.007 | 8 / 11 |
| B1 DNA gate, positive leans | 0.435 | +0.002 (−0.008 to +0.015) | 0.752 | +0.009 (−0.001 to +0.021) | 47% / 76% | 35% / 76% | 54% | 38% | 11 of 19 (7–15) | 6 of 18 | +0.036 (−0.035 to +0.113) | −0.018 | 10 / 8 |
| B2 DNA gate, both ways | 0.429 | −0.004 (−0.014 to +0.006) | 0.743 | +0.000 (−0.010 to +0.012) | 46% / 76% | 34% / 76% | 54% | 38% | 13 of 19 (9–17) | 6 of 18 | +0.030 (−0.048 to +0.113) | −0.027 | 7 / 11 |
| B3 label confidence | 0.431 | −0.001 (−0.010 to +0.008) | 0.740 | −0.003 (−0.011 to +0.002) | 47% / 78% | 36% / 77% | 57% | 38% | 11 of 19 (7–15) | 6 of 18 | +0.033 (−0.047 to +0.114) | −0.030 | 7 / 9 |
| C30 crowd first, cap 30% | 0.437 | +0.004 (−0.011 to +0.021) | 0.742 | −0.001 (−0.013 to +0.012) | 43% / 78% | 35% / 76% | 56% | 38% | 11 of 19 (7–15) | 5 of 18 | +0.039 (−0.037 to +0.119) | −0.028 | 6 / 11 |
| Cstars crowd first, stars, cap 30% | 0.441 | +0.009 (−0.020 to +0.036) | 0.750 | +0.007 (−0.010 to +0.026) | 48% / 80% | 36% / 77% | 59% | 38% | 13 of 19 (9–17) | 6 of 18 | +0.043 (−0.021 to +0.111) | −0.020 | 8 / 10 |
| Cstars as first run (weak pull) | 0.460 | +0.028 (−0.011 to +0.072) | 0.751 | +0.008 (−0.013 to +0.028) | 47% / 79% | 33% / 75% | 61% | 38% | 13 of 19 (9–17) | 6 of 18 | +0.062 (−0.005 to +0.131) | −0.019 | 9 / 9 |
| stars only (no crowd-first) | 0.442 | +0.010 (−0.016 to +0.035) | 0.748 | +0.004 (−0.011 to +0.020) | 48% / 79% | 36% / 76% | 59% | 38% | 14 of 19 (10–18) | 6 of 18 | +0.044 (−0.023 to +0.115) | −0.022 | 11 / 7 |
| Clib library crowd (breaks 1487) | 0.412 | −0.020 (−0.052 to +0.014) | 0.726 | −0.017 (−0.030 to −0.005) | 49% / 80% | 35% / 76% | 54% | 37% | 9 of 19 (5–13) | 6 of 18 | +0.014 (−0.082 to +0.114) | −0.044 | 4 / 15 |
| C40 crowd first, cap 40% | 0.453 | +0.021 (+0.004 to +0.039) | 0.756 | +0.013 (−0.002 to +0.027) | 48% / 81% | 37% / 78% | 57% | 39% | 13 of 19 (9–17) | 7 of 18 | +0.055 (−0.015 to +0.129) | −0.014 | 12 / 5 |
| C50 crowd first, cap 50% | 0.457 | +0.025 (+0.006 to +0.045) | 0.760 | +0.016 (+0.000 to +0.033) | 48% / 80% | 37% / 78% | 61% | 39% | 13 of 19 (9–17) | 7 of 18 | +0.059 (−0.011 to +0.132) | −0.010 | 12 / 5 |
| Cfree crowd first, no cap | 0.456 | +0.024 (+0.005 to +0.045) | 0.759 | +0.016 (−0.001 to +0.033) | 48% / 80% | 37% / 77% | 61% | 39% | 13 of 19 (9–17) | 6 of 18 | +0.058 (−0.011 to +0.131) | −0.011 | 10 / 7 |
| no cap (not crowd-first) | 0.451 | +0.019 (+0.001 to +0.040) | 0.761 | +0.018 (+0.003 to +0.036) | 49% / 80% | 37% / 77% | 62% | 39% | 13 of 19 (9–17) | 7 of 18 | +0.053 (−0.013 to +0.123) | −0.009 | 7 / 2 |
| D1 similar members | 0.428 | −0.005 (−0.033 to +0.018) | 0.736 | −0.007 (−0.023 to +0.002) | 48% / 77% | 36% / 78% | 54% | 38% | 11 of 19 (7–15) | 6 of 18 | +0.030 (−0.046 to +0.109) | −0.034 | 5 / 9 |
| D2 similar + archetype | 0.427 | −0.006 (−0.033 to +0.014) | 0.738 | −0.005 (−0.023 to +0.007) | 48% / 78% | 35% / 77% | 57% | 37% | 11 of 19 (7–15) | 6 of 18 | +0.028 (−0.048 to +0.107) | −0.032 | 8 / 9 |
| D2, ratings up to the day | 0.428 | −0.005 (−0.032 to +0.018) | 0.739 | −0.005 (−0.022 to +0.007) | 47% / 77% | 35% / 76% | 58% | 37% | 11 of 19 (7–15) | 6 of 18 | +0.030 (−0.050 to +0.108) | −0.031 | 9 / 8 |
| D2 to the day, twins out | 0.425 | −0.007 (−0.033 to +0.011) | 0.738 | −0.005 (−0.022 to +0.007) | 48% / 78% | 35% / 77% | 58% | 37% | 12 of 19 (8–16) | 6 of 18 | +0.027 (−0.047 to +0.103) | −0.032 | 8 / 7 |
| D2, twins out | 0.421 | −0.011 (−0.035 to +0.001) | 0.738 | −0.005 (−0.022 to +0.006) | 48% / 78% | 35% / 77% | 58% | 37% | 11 of 19 (7–15) | 6 of 18 | +0.023 (−0.051 to +0.099) | −0.032 | 5 / 9 |
| A2 + B1 | 0.438 | +0.006 (−0.007 to +0.023) | 0.754 | +0.010 (+0.001 to +0.021) | 46% / 77% | 35% / 76% | 53% | 38% | 11 of 19 (7–15) | 6 of 18 | +0.040 (−0.031 to +0.117) | −0.017 | 10 / 8 |
| A2 + Cstars | 0.445 | +0.012 (−0.011 to +0.039) | 0.751 | +0.007 (−0.009 to +0.025) | 49% / 81% | 36% / 76% | 61% | 38% | 13 of 19 (9–17) | 6 of 18 | +0.047 (−0.018 to +0.116) | −0.020 | 10 / 8 |
| A2 + B1 + Cstars | 0.447 | +0.015 (−0.010 to +0.047) | 0.759 | +0.016 (−0.001 to +0.036) | 51% / 80% | 38% / 76% | 61% | 39% | 13 of 19 (9–17) | 5 of 18 | +0.049 (−0.011 to +0.115) | −0.011 | 9 / 9 |
| A2 + C40 (cap 40%) | 0.453 | +0.021 (+0.001 to +0.044) | 0.758 | +0.014 (+0.001 to +0.029) | 49% / 82% | 37% / 78% | 58% | 39% | 13 of 19 (9–17) | 7 of 18 | +0.055 (−0.015 to +0.129) | −0.013 | 12 / 6 |
| A2 + Cfree (no cap) | 0.456 | +0.024 (+0.003 to +0.049) | 0.760 | +0.017 (+0.002 to +0.034) | 48% / 81% | 37% / 77% | 61% | 40% | 13 of 19 (9–17) | 6 of 18 | +0.058 (−0.009 to +0.130) | −0.010 | 10 / 8 |
| A2 + B1 + Cfree (no cap) | 0.455 | +0.023 (−0.001 to +0.055) | 0.766 | +0.023 (+0.003 to +0.045) | 49% / 80% | 37% / 77% | 56% | 39% | 13 of 19 (9–17) | 7 of 18 | +0.057 (−0.005 to +0.125) | −0.004 | 12 / 6 |
| A2 + D2 | 0.426 | −0.006 (−0.033 to +0.014) | 0.737 | −0.006 (−0.024 to +0.005) | 47% / 77% | 35% / 77% | 57% | 37% | 11 of 19 (7–15) | 6 of 18 | +0.028 (−0.045 to +0.106) | −0.033 | 11 / 7 |

Calibration by shown band (films / mean ★ / share rated 4.5★+):

| Band | Letterboxd average only | Current (model 9) | **A2 director cap 2 (shipped)** | A2 + Cfree (no cap) |
|---|---|---|---|---|
| 90+ | 134 / 4.33 / 60% | 97 / 4.31 / 56% | 99 / 4.30 / 55% | 110 / 4.32 / 55% |
| 78-89 | 310 / 3.82 / 20% | 328 / 3.93 / 26% | 323 / 3.93 / 26% | 294 / 3.94 / 27% |
| 65-77 | 322 / 3.54 / 7% | 308 / 3.59 / 7% | 310 / 3.60 / 7% | 329 / 3.63 / 8% |
| 40-64 | 200 / 3.33 / 6% | 258 / 3.26 / 7% | 258 / 3.28 / 7% | 247 / 3.29 / 6% |
| <40 | 93 / 2.87 / 4% | 68 / 2.64 / 3% | 69 / 2.60 / 1% | 79 / 2.51 / 3% |

- Bands are ordered in every variant in the table above.
- The Letterboxd average, mapped through a person's own stars, is as well calibrated as the model: its 90+ band holds 134 films at 60% rated 4.5★+, the model's 97 at 56%.
- 5★ at 85%+ is 72% for the Letterboxd average against 56% for the model. A person's 5★ films are mostly films the crowd also rates very highly, and the cap holds that signal to 30%.

### By account size, and random 5-fold (secondary)

| Variant | Time split, 100+ ratings (12 accounts): Spearman, change | beats crowd | Time split, under 100 (7 accounts, 96 films) | beats crowd | Random 5-fold (22 accounts): Spearman, change (95%) | AUC change | beats crowd | 5-fold, 100+ | 5-fold, under 100 |
|---|---|---|---|---|---|---|---|---|---|
| Letterboxd average only | 0.514 |  | 0.200 |  | 0.464 | +0.011 |  | 0.577 | 0.371 |
| Current | 0.522 | 7 of 12 | 0.280 | 5 of 7 | 0.484 |  | 14 of 22 | 0.607 | 0.379 |
| A1 own series out | 0.505, −0.016 (−0.042 to +0.009) | 5 of 12 | 0.318, +0.038 (−0.080 to +0.159) | 4 of 7 | 0.486, +0.002 (−0.022 to +0.037) | −0.005 | 12 of 22 | 0.598, −0.009 | 0.394, +0.016 |
| **A2 director cap (shipped)** | 0.528, +0.007 (−0.001 to +0.016) | 7 of 12 | 0.285, +0.005 (−0.010 to +0.025) | 5 of 7 | 0.485, +0.001 (−0.002 to +0.003) | −0.001 | 14 of 22 | 0.607, −0.000 | 0.381, +0.002 |
| A3 = A1 + A2 | 0.504, −0.017 (−0.044 to +0.010) | 5 of 12 | 0.349, +0.069 (−0.038 to +0.208) | 5 of 7 | 0.485, +0.001 (−0.023 to +0.035) | −0.004 | 12 of 22 | 0.598, −0.009 | 0.392, +0.013 |
| B1 DNA gate, positive | 0.528, +0.006 (−0.006 to +0.025) | 6 of 12 | 0.275, −0.005 (−0.020 to +0.010) | 5 of 7 | 0.487, +0.003 (−0.001 to +0.007) | +0.001 | 13 of 22 | 0.614, +0.006 | 0.379, +0.000 |
| B2 DNA gate, both ways | 0.515, −0.006 (−0.019 to +0.007) | 8 of 12 | 0.280, +0.000 (−0.015 to +0.017) | 5 of 7 | 0.488, +0.004 (−0.003 to +0.012) | −0.000 | 13 of 22 | 0.606, −0.001 | 0.389, +0.010 |
| B3 label confidence | 0.516, −0.005 (−0.014 to +0.002) | 6 of 12 | 0.285, +0.006 (−0.010 to +0.028) | 5 of 7 | 0.483, −0.001 (−0.003 to −0.000) | −0.001 | 13 of 22 | 0.606, −0.001 | 0.377, −0.002 |
| C30 crowd first, cap 30% | 0.526, +0.005 (−0.013 to +0.029) | 6 of 12 | 0.284, +0.004 (−0.022 to +0.029) | 5 of 7 | 0.482, −0.002 (−0.006 to +0.002) | −0.003 | 13 of 22 | 0.604, −0.003 | 0.377, −0.001 |
| Cstars | 0.534, +0.013 (−0.009 to +0.043) | 6 of 12 | 0.281, +0.001 (−0.063 to +0.057) | 7 of 7 | 0.469, −0.015 (−0.035 to +0.002) | −0.003 | 12 of 22 | 0.606, −0.001 | 0.348, −0.031 |
| Cstars, first run | 0.549, +0.027 (−0.015 to +0.072) | 6 of 12 | 0.308, +0.029 (−0.051 to +0.113) | 7 of 7 | 0.447, −0.037 (−0.072 to −0.006) | −0.014 | 9 of 22 | 0.602, −0.005 | 0.309, −0.069 |
| Clib | 0.486, −0.036 (−0.073 to −0.003) | 5 of 12 | 0.286, +0.006 (−0.061 to +0.067) | 4 of 7 | 0.478, −0.006 (−0.016 to +0.005) | +0.003 | 11 of 22 | 0.592, −0.015 | 0.383, +0.005 |
| C40 | 0.552, +0.030 (+0.010 to +0.055) | 8 of 12 | 0.284, +0.004 (−0.022 to +0.029) | 5 of 7 | 0.492, +0.008 (+0.002 to +0.015) | +0.004 | 13 of 22 | 0.624, +0.016 | 0.377, −0.001 |
| Cfree (no cap) | 0.557, +0.035 (+0.011 to +0.062) | 8 of 12 | 0.284, +0.004 (−0.022 to +0.029) | 5 of 7 | 0.497, +0.013 (+0.003 to +0.024) | +0.007 | 13 of 22 | 0.633, +0.025 | 0.377, −0.001 |
| D1 | 0.523, +0.001 (−0.005 to +0.008) | 6 of 12 | 0.265, −0.015 (−0.091 to +0.046) | 5 of 7 | 0.517, +0.033 (+0.003 to +0.073) | +0.026 | 12 of 22 | 0.618, +0.011 | 0.432, +0.053 |
| D2 | 0.518, −0.003 (−0.011 to +0.003) | 6 of 12 | 0.269, −0.011 (−0.083 to +0.044) | 5 of 7 | 0.526, +0.042 (+0.009 to +0.091) | +0.028 | 13 of 22 | 0.618, +0.011 | 0.452, +0.073 |
| D2, twins out | 0.521, −0.000 (−0.004 to +0.003) | 6 of 12 | 0.250, −0.030 (−0.090 to +0.000) | 5 of 7 | 0.512, +0.028 (+0.006 to +0.065) | +0.018 | 16 of 22 | 0.613, +0.005 | 0.430, +0.051 |
| A2 + B1 | 0.531, +0.010 (−0.007 to +0.037) | 6 of 12 | 0.278, −0.002 (−0.017 to +0.014) | 5 of 7 | 0.488, +0.004 (−0.002 to +0.009) | +0.001 | 14 of 22 | 0.612, +0.005 | 0.381, +0.002 |
| A2 + Cstars | 0.537, +0.015 (−0.009 to +0.050) | 6 of 12 | 0.287, +0.008 (−0.037 to +0.049) | 7 of 7 | 0.469, −0.015 (−0.035 to +0.003) | −0.003 | 12 of 22 | 0.606, −0.001 | 0.349, −0.030 |
| A2 + Cfree (no cap) | 0.561, +0.039 (+0.011 to +0.072) | 8 of 12 | 0.278, −0.002 (−0.024 to +0.023) | 5 of 7 | 0.498, +0.014 (+0.003 to +0.025) | +0.007 | 14 of 22 | 0.632, +0.024 | 0.380, +0.001 |
| A2 + B1 + Cfree (no cap) | 0.566, +0.044 (+0.011 to +0.089) | 8 of 12 | 0.265, −0.015 (−0.030 to −0.001) | 5 of 7 | 0.501, +0.017 (+0.005 to +0.029) | +0.009 | 15 of 22 | 0.635, +0.028 | 0.382, +0.003 |

## Lever by lever

### A. Similar films

- **A1, own series left out and every other series counted once: not shipped.** Mean Spearman barely moves (+0.004) and the accounts beating the crowd fall from 12 to 9. Accounts with 100+ ratings lose 0.016. The owner's own account drops from 0.471 to 0.412. The cases in `owner-match-accuracy.md` (a weak sequel dragging down a loved original, a remake lifted by its original) are real, but on average a person's stars for the rest of a series are a good guide to the next film in it.
- **A2, at most 2 same-director films among a film's nearest: shipped.** Spearman +0.006 (−0.001 to +0.015), AUC +0.004 (−0.001 to +0.010), the same 12 accounts beating the crowd, margin +0.034 → +0.041. Random 5-fold is flat (+0.001). The director is still counted, once, by the director lean.
- **A3, both together: not shipped.** Its mean (+0.015) comes from accounts under 100 ratings (7 accounts, 96 films, interval −0.04 to +0.21). Accounts with 100+ ratings lose 0.017 and two fewer accounts beat the crowd.

### B. Film DNA lean on middling films

- **B1, positive leans scaled by crowd quality: not shipped.** Spearman +0.002; AUC +0.009 (−0.001 to +0.021); one fewer account beats the crowd on Spearman. It is the one variant here that leans the right way on AUC, on both splits (5-fold: 16 accounts better, 6 worse on Spearman). It did not pass the bar as written.
- **B2, both directions: not shipped.** Spearman −0.004; 7 accounts better, 11 worse. One more account crosses above the crowd (13), which is noise next to a falling mean.
- **B3, by label confidence: nothing** (−0.001).

### C. Crowd first, personal second

- **C30, under the 30% cap: not shipped.** +0.004 (−0.011 to +0.021); one fewer account beats the crowd. Fitting the crowd first hands it more weight, and the cap then takes that weight back. The order of fitting is not what holds the model down.
- **With the cap lifted the same fit gains.** Cap 40%: +0.021 (+0.004 to +0.039). No cap: +0.024 (+0.005 to +0.045), 13 of 19 accounts. Plain no-cap, without crowd-first, is +0.019, so crowd-first adds little on top of removing the cap.
- **Realised crowd share** (rule 1488's measure; accounts with 100+ ratings): 27% under the cap (the owner's account is at the 30% limit); 32% at cap 40; 36% with no cap, ranging from 13% to 59% (the owner 47%). So with no cap the personal signals still carry about two thirds of the movement on average, but for crowd-following accounts like the owner's the crowd carries about half.
- **Cstars, fitted to stars: not shipped.** Time split +0.009 (−0.020 to +0.036), 13 of 19, but 8 accounts better and 10 worse. Random 5-fold −0.015 (−0.035 to +0.002), and −0.030 for accounts under 100 ratings.
  - The first run of this variant used a pull toward everyone's weights five times weaker than the liked / not-liked fit's. It read +0.028 on the time split and −0.037 (−0.072 to −0.006) on random folds, with bands out of order for thin accounts. The pull was then matched and the variant rerun; both runs are in the table.
- **Clib, the crowd read against the whole-library mean: worse** (−0.020; AUC −0.017, interval wholly below zero). Rule 1487's nearest-films reading is the better one.

### D. People like you

- **On later films: nothing.** Similar taste only −0.005 (−0.033 to +0.018). With archetype −0.006. Using other members' ratings up to the day before the person rated the film (added after the first results, since a nightly refit would have had them): −0.005.
- **Coverage is the first limit.** 55% of held-out films had been rated by no other member before the person's cutoff. 22% had 2 or more similar members (15% on taste alone). 3% had 5 or more.
- **The signal is weak where it exists.** On films with 2+ similar members, the peer mean's correlation with what the model missed is 0.11 (224 films).
- **On random 5-fold it helps:** +0.042 (+0.009 to +0.091), AUC +0.028. Three accounts have largely the same stars (63% to 71% identical on the films both rated), which would leak a person's own rating back to them. With those kept from being each other's peers it is +0.028 (+0.006 to +0.065), 16 of 22 accounts beating the crowd against 14. Almost all of it is on accounts under 100 ratings (+0.051; accounts with 100+: +0.005).
- **Why the two splits disagree.** Random folds hold out films from anywhere in a library, mostly popular films other members have rated. The time split holds out a person's newest films, which few members had rated yet. The time split is the honest test of "what will I like next"; the random-fold result says the signal is real for well-covered films and for thin accounts.
- **When it starts to matter.** Coverage by member count, assuming new members rate films of each popularity as often as today's do and are "similar" as often:

| Members | Held-out films with 2+ similar raters | 5+ | 10+ | 20+ |
|---|---|---|---|---|
| 23 | 44% | 13% | 1% | 0% |
| 50 | 65% | 35% | 13% | 1% |
| 100 | 79% | 57% | 34% | 12% |
| 250 | 89% | 78% | 63% | 40% |
| 500 | 94% | 86% | 79% | 62% |
| 1,000 | 96% | 93% | 85% | 79% |

  - This is for taste plus archetype, counting ratings made at any time. On taste alone: 14% of films have 10+ similar raters at 100 members, 42% at 250, 63% at 500.
  - A correlation of 0.11 with what the model missed, on a fifth of films, is worth about +0.003 Spearman, which matches the nothing that was measured. To add +0.01 it needs roughly a correlation of 0.2 on a third of a person's next films. If a mean over 10+ similar raters reaches that (an assumption; nothing here can test it), the point is **about 100 members with archetype, about 250 on taste alone**.
  - Built to grow: no lean under 2 similar members, weight n/(n+3). It stays off until it passes the bar.

## The owner's account (`467a3dgd`)

Time split: trained on 864 films rated before 2024-07-09, tested on the 216 after (3 five-star, 11 at 4.5★+).

| | Spearman | AUC | P@10 4.5★+/4★+ | P@25 | 5★ at 85%+ | band acc | bands n/mean★ |
|---|---|---|---|---|---|---|---|
| Letterboxd average only | 0.426 | 0.904 | 30% / 60% | 20% / 76% | 3 of 3 | 44% | 12/4.00, 74/3.77, 98/3.45, 30/3.37, 2/2.50 |
| Current (model 9) | 0.471 | 0.849 | 30% / 70% | 20% / 68% | 1 of 3 | 43% | 7/4.00, 69/3.83, 100/3.48, 38/3.29, 2/2.50 |
| **A2 director cap 2 (shipped)** | 0.468 | 0.854 | 30% / 70% | 20% / 68% | 1 of 3 | 42% | 9/4.06, 66/3.82, 101/3.49, 38/3.29, 2/2.50 |
| A1 own series out, others once | 0.412 | 0.843 | 30% / 80% | 24% / 76% | 1 of 3 | 40% | 18/4.03, 68/3.72, 81/3.50, 46/3.34, 3/2.83 |
| B1 DNA gate, positive leans | 0.475 | 0.850 | 30% / 70% | 20% / 68% | 1 of 3 | 44% | 10/3.95, 67/3.84, 104/3.49, 32/3.23, 3/2.83 |
| C30 crowd first, cap 30% | 0.463 | 0.836 | 30% / 70% | 20% / 68% | 1 of 3 | 44% | 8/3.94, 68/3.84, 99/3.49, 38/3.28, 3/2.83 |
| Cstars crowd first, stars, cap 30% | 0.464 | 0.816 | 30% / 70% | 16% / 68% | 2 of 3 | 42% | 13/4.04, 68/3.72, 97/3.53, 36/3.29, 2/2.50 |
| D2 similar + archetype | 0.482 | 0.853 | 30% / 70% | 24% / 68% | 1 of 3 | 44% | 7/4.00, 68/3.84, 100/3.49, 39/3.28, 2/2.50 |
| A2 + Cstars | 0.457 | 0.822 | 30% / 70% | 16% / 64% | 2 of 3 | 44% | 13/4.04, 68/3.73, 98/3.52, 35/3.29, 2/2.50 |
| A2 + C40 (cap 40%) | 0.495 | 0.874 | 30% / 80% | 20% / 72% | 2 of 3 | 42% | 6/4.08, 67/3.83, 105/3.50, 35/3.29, 3/2.67 |
| A2 + Cfree (no cap) | 0.516 | 0.879 | 20% / 70% | 20% / 64% | 2 of 3 | 44% | 12/3.96, 47/3.86, 120/3.54, 34/3.22, 3/2.67 |
| A2 + B1 + Cfree (no cap) | 0.520 | 0.886 | 30% / 70% | 20% / 64% | 3 of 3 | 45% | 13/4.00, 49/3.85, 111/3.54, 40/3.24, 3/2.67 |

Random 5-fold, all 1,080 films:

| | Spearman | AUC | P@10 4.5★+/4★+ | P@25 | 5★ at 85%+ | band acc | bands n/mean★ |
|---|---|---|---|---|---|---|---|
| Letterboxd average only | 0.679 | 0.884 | 100% / 100% | 84% / 92% | 37 of 40 | 48% | 102/4.32, 328/3.95, 344/3.63, 254/3.23, 52/2.21 |
| Current (model 9) | 0.622 | 0.827 | 90% / 100% | 72% / 92% | 30 of 40 | 45% | 114/4.31, 366/3.85, 299/3.65, 241/3.25, 60/2.38 |
| **A2 director cap 2 (shipped)** | 0.622 | 0.827 | 90% / 90% | 68% / 92% | 30 of 40 | 45% | 117/4.33, 361/3.84, 293/3.66, 250/3.26, 59/2.36 |
| A1 own series out, others once | 0.596 | 0.819 | 80% / 90% | 68% / 96% | 30 of 40 | 44% | 127/4.28, 318/3.83, 326/3.67, 250/3.29, 59/2.33 |
| B1 DNA gate, positive leans | 0.631 | 0.831 | 90% / 90% | 80% / 96% | 30 of 40 | 45% | 111/4.33, 359/3.86, 310/3.65, 244/3.23, 56/2.36 |
| C30 crowd first, cap 30% | 0.609 | 0.816 | 90% / 90% | 64% / 92% | 30 of 40 | 43% | 113/4.29, 358/3.85, 304/3.65, 245/3.28, 60/2.37 |
| Cstars crowd first, stars, cap 30% | 0.604 | 0.814 | 90% / 100% | 76% / 96% | 29 of 40 | 43% | 102/4.29, 365/3.87, 312/3.64, 242/3.28, 59/2.32 |
| D2 similar + archetype | 0.647 | 0.845 | 90% / 100% | 80% / 92% | 33 of 40 | 46% | 109/4.36, 353/3.88, 319/3.64, 237/3.23, 62/2.38 |
| A2 + Cstars | 0.607 | 0.817 | 90% / 100% | 72% / 92% | 30 of 40 | 44% | 108/4.31, 363/3.86, 300/3.64, 249/3.29, 60/2.35 |
| A2 + C40 (cap 40%) | 0.650 | 0.849 | 100% / 100% | 80% / 96% | 33 of 40 | 46% | 105/4.41, 346/3.87, 329/3.64, 242/3.24, 58/2.31 |
| A2 + Cfree (no cap) | 0.674 | 0.869 | 100% / 100% | 92% / 100% | 36 of 40 | 46% | 117/4.37, 322/3.90, 343/3.62, 238/3.24, 60/2.33 |
| A2 + B1 + Cfree (no cap) | 0.678 | 0.870 | 100% / 100% | 92% / 100% | 36 of 40 | 46% | 115/4.37, 295/3.93, 368/3.62, 240/3.24, 62/2.34 |

- Before and after what shipped, the owner's numbers are the same within noise: Spearman 0.471 → 0.468, AUC 0.849 → 0.854.
- On later films the model already beats the Letterboxd average on Spearman (0.471 against 0.426) and trails on AUC (0.849 against 0.904). On random folds the average wins both.
- The only variants that move this account are the ones that lift the cap: 0.495 at cap 40, 0.516 with no cap. On random folds no cap reads 0.674 against the average's 0.679.

## Per account, time split

Spearman; AUC for 4.5★+.

| Account | held-out | Letterboxd only | Current | A2 | A2 + Cfree | beats crowd: current → A2 |
|---|---|---|---|---|---|---|
| j9zpqg22 | 11 | 0.228; 0.500 | 0.410; 0.611 | 0.463; 0.639 | 0.429; 0.583 | yes → yes |
| mcrd3w6r | 8 | -0.327; 0.433 | -0.300; 0.400 | -0.300; 0.400 | -0.300; 0.400 | yes → yes |
| syyd8u4q | 85 | -0.021; 0.711 | 0.401; 0.645 | 0.402; 0.633 | 0.393; 0.639 | yes → yes |
| mf7j6b2m | 21 | 0.193; 0.704 | 0.160; 0.639 | 0.167; 0.639 | 0.106; 0.606 | no → no |
| rjjnfv93 | 174 | 0.361; 0.738 | 0.633; 0.801 | 0.635; 0.808 | 0.629; 0.799 | yes → yes |
| rgn55mpx | 61 | 0.763; 0.925 | 0.579; 0.751 | 0.576; 0.748 | 0.689; 0.844 | no → no |
| ybb4pbwk | 65 | 0.464; 0.846 | 0.456; 0.834 | 0.454; 0.844 | 0.508; 0.890 | no → no |
| 355uccj5 | 113 | 0.636; 0.923 | 0.669; 0.873 | 0.663; 0.871 | 0.689; 0.904 | yes → yes |
| yddpsc99 | 16 | 0.762; 0.979 | 0.809; 0.979 | 0.811; 0.979 | 0.811; 0.979 | yes → yes |
| 467a3dgd (owner) | 216 | 0.426; 0.904 | 0.471; 0.849 | 0.468; 0.854 | 0.516; 0.879 | yes → yes |
| gz2cu72r | 19 | 0.321; 0.700 | 0.325; 0.829 | 0.367; 0.864 | 0.378; 0.871 | yes → yes |
| v33936xy | 18 | 0.349; n/a | 0.260; n/a | 0.263; n/a | 0.250; n/a | no → no |
| vyycfrt2 | 14 | 0.350; 0.923 | 0.455; 0.846 | 0.454; 0.846 | 0.511; 0.846 | yes → yes |
| n4gfx95v | 8 | -0.156; 0.375 | 0.165; 0.531 | 0.138; 0.531 | 0.138; 0.531 | yes → yes |
| 34q7p768 | 50 | 0.518; 0.686 | 0.473; 0.653 | 0.472; 0.656 | 0.470; 0.652 | no → no |
| 9wayna4a | 66 | 0.845; 0.880 | 0.850; 0.891 | 0.846; 0.890 | 0.850; 0.880 | yes → yes |
| ymbkwaf2 | 47 | 0.397; 0.785 | 0.067; 0.509 | 0.105; 0.497 | 0.249; 0.605 | no → no |
| 9542gtth | 42 | 0.655; 0.971 | 0.750; 0.996 | 0.749; 0.994 | 0.734; 1.000 | yes → yes |
| m4enav79 | 25 | 0.801; 0.878 | 0.584; 0.744 | 0.600; 0.756 | 0.622; 0.772 | no → no |

- The 7 accounts the model does not beat on Spearman are the same before and after. Three of them are far behind the average (m4enav79, rgn55mpx, ymbkwaf2); with no cap all three close part of the gap and none crosses.
- Seven accounts have under 20 held-out films. Their rows are close to noise.

## Decisions against the bar

| Variant | 1. Ranking not lower beyond noise | 2. Count and margin over the crowd | Decision |
|---|---|---|---|
| A1 own series out | Yes | No: 12 → 9 accounts | Not shipped |
| **A2 director cap 2** | Yes (+0.006, −0.001 to +0.015) | Yes: count 12 → 12, margin +0.034 → +0.041, AUC margin −0.027 → −0.023 | **Shipped** |
| A3 = A1 + A2 | Yes | Margin up, count 12 → 10 | Not shipped (stricter reading) |
| B1 DNA gate, positive | Yes | No: count 12 → 11, margin +0.002 | Not shipped |
| B2 DNA gate, both ways | Yes | Count 12 → 13, margin falls | Not shipped (stricter reading) |
| B3 label confidence | Yes | No | Not shipped |
| C30 crowd first, cap 30% | Yes | No: count 12 → 11 | Not shipped |
| Cstars | Yes | Yes by the letter: 12 → 13, margin +0.009 | **Not shipped, against the letter of the bar.** One account crossing; 8 better and 10 worse; random folds −0.015. I read it as noise. It also replaces the fit's target for every account, which wants stronger evidence than this. |
| Cfree, C40, no cap | Yes, interval above zero | Yes: 13 of 19, margin +0.053 to +0.058 | **Not shipped: breaks rule 1488.** For the owner. |
| Clib | No on AUC | No | Not shipped; rule 1487 stands |
| D1, D2 | Yes | No | Built, off |
| Best combination that passes (A2 alone) | | | Shipped |
| A2 + no cap | Yes (+0.024, +0.003 to +0.049; AUC +0.017, +0.002 to +0.034) | Yes: 13 of 19 | For the owner |

## What was built

- **Shipped (montage `b6298bf2`, rule 1555):** `NEIGHBOUR_DIRECTOR_CAP = 2` in `lib/taste/match-model.mjs`. The cap applies to the two nearest-film readings, the loved and disliked likeness, the neighbour crowd centre and the neighbour genre lean. `MATCH_DIRECTOR_CAP=off` turns it off. The population key is now `n9sfd` and `FULL_PASS.CATALOG_FIXED_AT` moved to 2026-11-12 08:00 UTC, so the 08:33 UTC cron refits and rescores everyone once. No database write was made by hand. Server only, so the iPhone needs no change.
- **Built, off:** `lib/taste/peer-lean.mjs` (people like you). No score reads it.
- **Kept for the eval, off:** the options for A1, B1 to B3, C and the cap sweep (`V10` in `match-model.mjs`).
- **Checks:** `scripts/check-invariants.ts` (1555), `scripts/test-match-v9.ts`. Gates run before the push: `tsc`, `check-invariants` (exit 0), `check-security`, `check-ds-log`.
- **Docs:** rule 1555 in `docs/INVARIANTS.md`; entry in `docs/DATA-SCIENCE-LOG.md`.

## For the owner

1. **The cap is the choice between "personal" and "beats the crowd".** With the cap at 30% the model beats the Letterboxd average on 12 of 19 accounts on Spearman and loses to it on AUC for most. With no cap it is 13 of 19, mean Spearman 0.456 against 0.398, and the personal signals still carry about two thirds of the movement on average. For accounts that follow the crowd closely, the owner's among them, the crowd would carry about half. A cap of 40% gets most of the gain (0.453) and keeps the crowd under half for everyone.
2. **Even with no cap the model does not beat the average on AUC for most accounts** (6 or 7 of 18). Picking out a person's 4.5★+ films is where the crowd is strongest. Nothing tested here changes that.
3. **Ratings per person still matter most.** Accounts with 100+ training ratings: 0.52. Under 100: 0.28.

## Caveats

- **19 accounts, 1,059 films.** No interval for a shipped change excludes zero. A2's gain is +0.006 with an interval of −0.001 to +0.015; 9 accounts rose and 9 fell.
- **Forms were picked on the films they are judged on.** Three or four forms per lever were compared on the same held-out films, so the best of them reads a little high.
- **The bar was tightened after the results**, in the stricter direction only, and one variant that passed it was held back on judgment. Both are stated above.
- **Three accounts look like one person** (63% to 71% identical stars). They are counted as three accounts in every figure. For people like you they were also run kept apart.
- **Archetypes come from whole libraries**, held-out films included. That slightly flatters the archetype form of people like you, which showed no gain anyway.
- **Undated ratings by other members** are treated as earlier than a person's cutoff.
- **The member-count estimate rests on assumptions**: new members rate like today's, and the signal strengthens with more raters. Neither can be tested with 23 accounts.
- **Offline rerun, not live rows.** Production code on a dump, reference scale thinned to every third film. Not verified in production: there is no service key here, and the rescore happens at the 08:33 UTC cron.

## Appendix: SQL (all SELECT)

```sql
select string_agg(slug||':'||collection_id, ',') from film_collection where collection_id is not null;
select string_agg(slug||':'||confidence, ',') from film_labels where confidence is not null;
select left(id::text,8) pid,
  (select jsonb_agg(jsonb_build_array(t->>'id', round((t->>'weight')::numeric,3)))
     from jsonb_array_elements(result_json->'archetype'->'top') t) top
from public_profiles;
```

Ratings and films are the dumps of `match-time-split.md` (its appendix has that SQL).
