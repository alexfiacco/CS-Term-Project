# Why thin-evidence films show ~87%, and why almost nothing reaches 90%

Investigation only: no code changes and no database writes. Date: 2026-11-13. Profile `467a3dgd` (owner, 1,080 rated films in the fit, average 3.63★, 77% of ratings are 3.5★ or higher).

**Short answer.** The 87% doesn't come from evidence about these particular films. It comes from **rank**. The stored score is where the film's log-odds falls among the person's 6,000 most-watched reference films. The Outfit and Blindspotting (stored 77) and A Taxi Driver (stored 80) sit in the top 6–7%, pushed there by a lot of small positives. No one strong signal does it. The display curve then turns stored 77–80 into 86–87. That curve isn't specific to thin evidence: the owner's own curve almost matches the shared one above stored 62. **On held-out data, films with weak nearest-film similarity did no worse at 85–89% than films with strong similarity** (+0.11★, CI −0.06 to +0.29). So an evidence term would carry no information, and its measured gain equals a random pull of the same size. What *is* off is the whole 85–89 band for this owner: held-out films shown there averaged **3.86★**, while the owner's own target table reads 87% as about 4.5★.

Data note: Supabase went down partway through (container restart). The decomposition and the owner's curve below come from live SELECTs made before that. The calibration numbers come from the offline time-split dump (`scripts/eval-time-split` data, 19 accounts, 1,059 held-out films, each person's last ~20% by date), re-run with the production model code from `/home/user/montage/lib`. The `match_predictions` / `rating_predictions` queries could not be run. They are listed at the end.

---

## 1. What drives the stored score

### The pipeline
1. **Nightly full pass** (`lib/taste/full-pass.ts`, scheduled by the cron): for each person it fits model 9, `v3FitUser`, in `lib/taste/match-model.mjs`. This is a logistic regression for "rated 3.5★ or higher", pulled toward a population fit (`ai_cache match-model:v7n9sfd:population`, prior worth 20 films). It has 13 features: crowd (the film's Letterboxd average minus the crowd mean of the person's 30 nearest rated films), hasCrowd, dock, knnLocal, knnBase, lovedSim, dislikedSim, genreAff, directorAff, decadeAff, langAff, popularity (fixed at weight 0), and labelLean. The share cap (V9) limits crowd to 30%.
2. **Scale**: the film's log-odds is placed among the log-odds of the **6,000 most-watched recommendable films** for that person (`ref_q`, 401 quantiles), then mapped through `V3_ANCHORS`: 50th percentile = 50, 90th = 70, **99.5th = 90**, top = 96. **The stored number is a rank, not a probability, and it carries no confidence.**
3. The pass writes integers to `user_score_vec`, indexed by `score_catalog.ord`. `user_film_score` is a view over them.
4. On read (`lib/taste/film-scores.ts`): spread (none at 300+ rated) → post-hoc correction (OFF) → `personalStored` (personal curve, then top flatten, then turned back into a stored integer) → soft tells. The client draws `shownMatch(stored)`.
5. **The taste layer** (`taste-layer.ts`) is in SHADOW. It only logs `match_predictions.taste_layer*` and never changes a shown number. **No collaborative term is in model 9.** The old taste-twin `collabOff` lives in model 2's `filmTerms`, which the v3 path doesn't use. The embedding enters only through the similarity features (knn, lovedSim, dislikedSim, crowd centre, genre neighbours). `match.ts` is the LLM "why" writer and doesn't set the stored number.

### Decomposition (owner's live weights, recomputed in SQL plus a script; labelLean inferred as the residual)
Logit contributions, after normalising with the population mean and SD and clamping to the owner's range. Stored 77 needs a logit of about 3.31, stored 80 about 3.63, and stored 90 about 5.26. The median reference film is at 0.43.

| term | The Outfit (st 77) | Blindspotting (st 77) | A Taxi Driver (st 80) |
|---|---|---|---|
| intercept (base rate 77% liked) | +1.58 | +1.58 | +1.58 |
| crowd | 0 (was −0.81; zeroed because Letterboxd 3.57 ≥ 3.5, `CROWD_FLOOR`) | +0.81 (4.08 vs neighbours' 3.76) | +0.47 (4.23 vs 4.03) |
| genreAff | +0.60 | +0.33 | +0.36 |
| knnBase (weight −1.11 on a near-constant feature) | +0.20 | +0.13 | +0.36 |
| knnLocal | +0.11 | +0.06 | −0.09 |
| lovedSim / dislikedSim | 0.00 / +0.04 | +0.15 / −0.15 | −0.51 / +0.71 |
| director, decade, dock | ~0 | ~0 | ~0 |
| **labelLean (inferred residual)** | **+0.79** (≈ +0.22★ lean) | **+0.37** (+0.10★) | **+0.70** (+0.19★) |
| total | ≈3.31 → 77 | ≈3.31 → 77 | ≈3.6 → 80 |

What this shows:
- **A film with every feature at the population average scores logit 1.58, which is stored ~61 and shown ~68%.** For this owner, "nothing special" already starts above the reference median, because their intercept is high: they like most of what they rate.
- From there, three or four modest positives take a film into the top 7%: genre lean, label lean (the "theme leans a few tenths of a star"), a decent crowd score and a few tenths from knnBase. No single strong signal is needed. Because the scale is a rank, adding up many small leans is enough.
- **The Outfit's crowd score is below its neighbours' (3.57 vs 3.87). That would cost −0.81, but `CROWD_FLOOR` (rule 1489) cancels it.** Without the floor it would be around stored 68 (shown ~79). This is the clearest single reason The Outfit reads high.
- knnBase has a negative weight on a feature whose spread is tiny (SD 0.029). It adds +0.1 to +0.4 to these films almost by accident. Worth a separate look.
- "Nearest only ~0.26" refers to the *why's* mean-centred cosine (`anchor_sims`). The model uses raw cosine, where these films' nearest loved films are 0.50–0.57 and the top-5 loved average (0.47–0.53) sits **at the population mean** (0.513). To the model, the similarity evidence looks average, not thin. It isn't driving the score up or down.
- Caveats: labelLean wasn't recomputed (the ridge fit was too heavy for SQL), so it absorbs every approximation error. The other features were recomputed from `film_vec` in SQL and may differ slightly from the pass (for example in the director mask).

## 2. The display curve, stored → shown (owner)

Owner's saved curve (`ai_cache match-personal-curve:467a3dgd`, n=1080, blend weight 1080/1180 = 0.915): `[0,0] [7,8] [12,15] [18,22] [23,30] [33,40] [49,55] [62,70] [70,82] [81,90] [88,96] [100,99]`. These are the middle LOO scores of the owner's 3★ / 3.5★ / 4★ / 4.5★ / 5★ blocks.

Full chain = `shownMatch(round(storedForShown(topFlatten(blend(personal, shared)))))`:

| raw stored | shared curve | personal blend | after flatten | drawn % |
|---|---|---|---|---|
| 50 | 50 | 55.6 | 55.6 | 56 |
| 60 | 66 | 67.5 | 67.5 | 68 |
| 62 | 69.6 | 70.0 | 70.0 | 70 |
| 66 | 76.4 | 76.0 | 76.0 | 76 |
| 70 | 82 | 82.0 | 82.0 | 82 |
| 74 | 85.2 | 84.9 | 84.9 | 85 |
| **77** | 87.2 | 87.1 | 85.9 | **86** |
| **80** | 89.0 | 89.2 | 86.9 | **87** |
| 84 | 91.4 | 92.5 | 88.4 | 88 |
| 88 | 93.5 | 95.8 | 89.9 | 90 |
| 94 | 96.5 | 97.4 | 90.6 | 91 |
| 100 | 99 | 99.0 | 91.3 | 91 |

Shown 86 → 87 happens between stored 78 and 79. The Outfit at 87 most likely came from a slightly different score when it was shown (a rescore, or a live path). It's within a point either way.

**Is the curve inflating mid scores?** It does lift them: stored 60–77 is shown 8–11 points higher (stored 70 → 82). But this is the deliberate rule 1512/1546 calibration, and above stored 62 the owner's personal curve is almost identical to the shared one. The real issue is how the personal curve is built. It maps the score at the middle of a star block to that star, which is **quantile matching**. That treats the score as a perfect ranker. With a per-user Spearman around 0.45, the actual rating at a given score regresses toward the person's mean. So stored 77–80 is placed at "4.3–4.4★" (between the 4★ = 82 and 4.5★ = 90 points), when held-out films there actually average 3.86★ for this owner (section 3).

## 3. Is 87% honest? Calibration

Time split A, production model and display chain re-run offline (`/tmp/claude-0/-home-user-CS-Term-Project/3b15a6fd-9770-5491-87a5-4cf8acc3cc2b/scratchpad/ev/run.mjs`, `an.py`, `an2.py`, `an3.py`). Evidence = mean-centred cosine (the `anchor_sims` method) to the nearest **training** film rated 4★+. Centring uses the dump's mean vector as a stand-in for `taste_config.embedding_mean`. Quantiles across all held-out films: p25 0.25, p50 0.30, p75 0.36.

**By shown band, all 19 accounts (1,059 held-out films)**

| shown | n | mean ★ | vs own avg | 4★+ | 4.5★+ | under 3.5★ |
|---|---|---|---|---|---|---|
| 90+ | 19 | 4.68 | +1.13 | 100% | 84% | 0% |
| **85–89** | 194 | **4.11** | +0.42 | 74% | 39% | 7% |
| 78–84 | 225 | 3.88 | +0.19 | 64% | 21% | 12% |
| 65–77 | 294 | 3.58 | −0.10 | 38% | 7% | 28% |
| 40–64 | 258 | 3.28 | −0.40 | 22% | 7% | 43% |
| <40 | 69 | 2.60 | −1.00 | 7% | 1% | 80% |

**Owner only (216 held-out films, trained on the first 864)**: 85–89 n=33, **mean 3.86★**, 64% 4★+, **12% 4.5★+**, 6% under 3.5★. 78–84: n=50, 3.83★. 90+: n=1 (4.5★).

**Thin vs strong evidence at the same shown %**

| shown 85–89 | n | mean ★ | 4★+ | 4.5★+ | under 3.5★ |
|---|---|---|---|---|---|
| nearest loved < 0.30 (thin) | 74 | **4.18** | 76% | 42% | 7% |
| 0.30–0.40 | 62 | 4.19 | 82% | 44% | 2% |
| ≥ 0.40 (strong) | 58 | **3.95** | 64% | 31% | 12% |
| owner, < 0.30 | 5 | 3.90 | 80% | 0% | 0% |
| owner, ≥ 0.40 | 20 | 3.85 | 55% | 20% | 10% |

- Thin minus strong at 85–89: **+0.11★, 95% bootstrap over users −0.06 to +0.29**. No sign that thin evidence does worse.
- Across all bands, rating minus band mean regressed on nearest similarity: **−0.04★ per +0.1 cosine** (95% CI −0.08 to −0.006). If anything, *closer* resemblance comes with slightly *lower* ratings at the same shown %. A plausible reason: close twins of films you loved are often sequels and imitations that disappoint, while a film with no twin got its score from crowd, genre and label signals that hold up.

**Honest?** On the owner's own target table (rule 1820: 4★ = 80, 4.5★ = 85, 5★ = 90), shown 87 promises about 4.5★. Held-out films at 85–89 averaged 4.11★ across everyone (≈ 82 on that table) and **3.86★ for the owner (≈ 78)**. So 87% overstates by about 4 points for an average account and about **8–9 points for the owner**. It's within the "really like it" words (78–89), but the digits are high. **The problem is the same for strong-evidence films.** Thin evidence isn't what makes 87 dishonest.

Earlier production evidence agrees (DATA-SCIENCE-LOG 2026-11-13, rule 1820: 227 rated `match_predictions`, 19 accounts). Median *shown* % by eventual rating was 4★ 73, 4.5★ 70, 5★ 74. The live guesses are bunched, and the model doesn't separate 4★ from 5★ well.

## 4. Why 90%+ is nearly unreachable, and is that a problem?

- Shown 90 needs flattened ≥ 89.5, so a pre-flatten personal % of about 95.6, so **raw stored ≥ ~88**. On `V3_ANCHORS`, 88 is about the **98.6th percentile of the 6,000 reference films**, roughly the top 85 most-watched-film equivalents. The owner has rated 1,080 films, mostly well-known ones, so they've already seen most of the films that rank that high. A handful of unseen films is left (the reported 4 of ~30,000).
- The cap of 91 is arithmetic: `85 + (99 − 85) × 0.45 = 91.3` (rule 1593).
- **Is it a problem?** For honesty, no. The 90+ band is the one band that is clearly right: 19 held-out films, mean 4.68★, 84% 4.5★+, none under 4★. It was built that way on purpose (owner, 2026-11-12). The cost is in the product: the owner's whole top list reads 85–88, which says little about order, and 5★ films shown 90+ fell from 35% to 13% (log, rule 1593). The real gap sits below 90: 85–89 is too generous, not 90+ too strict.

## 5. Options, ranked

Measured offline on the same time split against the owner's target table. Spot on = within 5 points. Baseline: all accounts MAE 10.95, spot on 37%, over 30%, under 34%, Spearman 0.441. Owner: MAE 8.35, spot on 39%, over 37%, under 24%, Spearman 0.466.

**1. (b) Curve change, top half: refit the personal curve as an expected-rating map instead of quantile matching. Recommended, but build and measure it first.** As a proxy, compressing shown 78+ by ×0.7 (or shifting 78+ down 3) gave:
- **All accounts**: MAE 10.95 → 10.62, spot on 37 → 40%, overshoot 30 → 25%, Spearman 0.441 → 0.438.
- **Owner**: MAE 8.35 → 7.83, spot on 39 → 44%, overshoot 37 → 31%.
- 85–89 then holds 79 films averaging 4.32★, close to its 4.5★ promise.

The proper version is an isotonic fit of rating on LOO score per person, blended with the shared curve by n/(n+100). It would put the owner's stored 77–80 at about 80–82 instead of 86–87.

Risks:
- These proxies were chosen after seeing the data. The real fit needs a pre-registered bar.
- Fewer films reach 85+. The "5★ shown 85%+" bar (54%) would fall, and the owner asked for that bar not to drop.
- Picks floors, the 65% Pitch floor and Our read's word cut-offs all sit on the shown scale and would need checking.
- Rule 1068 says no shown-number correction without the owner's go-ahead.

**2. (c) Leave the number, explain it in the why. Do this now regardless.** Zero calibration change. The why already names the nearest films down to 0.20 (rule 1880). It can say where the score comes from: "It scores high on your genre and pacing leans and a strong crowd, not on a close twin." Risk: none to the numbers, but it doesn't fix the ~4–9 point overshoot in 85–89.

**3. (a) Evidence or confidence term. Not recommended.** Pulling shown % halfway toward 65 when nearest-loved < 0.35 (full pull at 0.25): all accounts MAE 10.95 → 10.14, owner 8.35 → 7.74. **But moving the same number of random films in the same shown bands by the same amounts gives 10.22 (5–95%: 10.08–10.36) and 7.74 (7.56–7.94).** The evidence term adds nothing beyond lowering high numbers in general. Per-user Spearman drops to 0.444 for all accounts and from 0.466 to 0.426 for the owner. A 0.30 threshold cut Spearman to 0.423. It would also make the order inconsistent between Picks and the shown %. The intuition is reasonable, but the data says thin similarity isn't a thin prediction here.

Separate from the display, worth a look in the model:
- **CROWD_FLOOR** makes The Outfit's below-neighbours crowd score count as zero (−0.81 logit). It's an owner rule, so it's flagged only.
- **knnBase** has a negative weight on a near-constant feature and adds +0.1 to +0.4 to ordinary films.
- Neither was measured.

## Not done / still to query (DB was down)
- Live `match_predictions` (rated rows) and `rating_predictions` (join to `user_ratings` for the rating): bands 85–89 shown for this owner and for everyone, split by `anchor_sims` < 0.30. Note that `predicted` is on the stored scale, after the personal and flatten layer since rule 1593; draw it with `shownMatch`. Production n was ~227 rated rows on 2026-11-13, so expect 20–40 rows in 85–89.
- The owner's unseen score distribution (count at stored ≥ 88 to confirm "4 of ~30k").
- The offline dump's reference set is 2,035 films (production uses 6,000), and evidence was centred on the dump mean rather than `taste_config.embedding_mean`. The three named films aren't in the held-out set, so the calibration covers similar films, not those three.
- Bootstrap CIs for the option deltas weren't computed, only the random-pull control. All options were tried after seeing the data.
