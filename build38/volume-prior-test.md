# Genre volume prior: time-split test

Offline analysis. No app code changes, no database writes. Date: 2026-11-14. Data: read-only SELECTs on the Montage project (Supabase MCP). Accounts are named by user-id prefix only. The proposal under test is `tuning-and-volume.md` section 4(c).

**Question (owner):** if someone watches very little of a genre, should Picks push that genre down, even when they rated a few films in it well?

---

## 1. Pre-registration (written before any result was computed)

This section was written and saved before the test was run. Nothing in it was changed after results were seen. Results are in section 2 onward.

### Accounts
- Every account with **150 or more dated, rated films** (films only, TV and duplicates dropped, by the date rule of `scripts/eval-time-split/run.mjs`: an in-app rating that differs from the import uses its watched/created date; otherwise the Letterboxd rated date `a`, then the diary date `w`/`wd`, then the in-app date). Undated ratings always count as history (they were known before any cut).
- Count at the first read: 9 accounts (`1b73ada1`, `032e0fd5`, `d561961e`, `dded73de`, `e686712b`, `ac5a0d32`, `9d78754a`, `dbd4371e`, `9782716a`). The final count after the film filters is reported in section 2.

### Folds (rolling origin, in time)
- For each account, 5 cut points at the boundaries nearest to 50%, 60%, 70%, 80% and 90% of its dated ratings (a cut must fall between two different dates; if two quantiles land on the same boundary the later fold is dropped for that account).
- Fold k: **history** = every rating before cut k (plus undated ones). **Future** = ratings from cut k up to cut k+1 (fold 5: to the end). Futures do not overlap.
- **Folds 1-3 (cuts 50/60/70%) choose the strength. Folds 4-5 (cuts 80/90%) are the held-out report.** Tuning on earlier time and reporting on later time, as the decade and actor tests chose on folds 0-2 and scored on 3-4.

### Candidate pool and baseline
- Pool: browse_v5's base pool, read with its own filter (movie, not a duplicate, poster, 3,000+ Letterboxd logs, no Documentary or TV Movie, runtime 40-400, not Music/Documentary-only, the concert/making-of title filter), with an embedding: about 20,200 films. Minus every film the account rated in its history. Future films stay in the pool (unseen at the cut). Watchlists, Show less of, day signals and variety are not applied (not known at the cut, or not logged).
- **Baseline = the real model**, run offline: `lib/taste/match-model.mjs` (model 9, production defaults), the steps of `prepareUser` / `scoreShard` in `lib/taste/full-pass.ts`, fitted on **history only**. The population prior is refitted per fold from every account's history at that fold's cut (accounts with 3+ rated). The scale uses the 6,000 most-watched recommendable films, as `V3_REF_SIZE`. The stored score is `v3FilmScore` (an integer, as in `user_score_vec`); rank by it, ties by Letterboxd logs (browse_v5's order). Not reproduced: the series pull for unreleased films (pool films all have 3,000+ logs, so it does not apply).

### Treatment: the volume prior (history only, only ever lowers)
For kind genres G = Animation, Horror, Family, War, Western, Music, Romance, Science Fiction, Fantasy:

```
c_g      = genre g's share of the pool (the whole ~20,200-film pool)
s~_g     = (count_g in history + K * c_g) / (N_history + K)      K = 50
r_g      = s~_g / c_g
points_g = clamp(P * log2(1 / r_g), 0, 10)                         10 = one Show less of step (SKIP_ONE)
film     = max over the film's kind genres (never summed); 0 if none
rank key = stored score - film points (the match % itself is untouched)
```

Two arms, fixed now: **P = 4** and **P = 6** (points per halving of the ratio). A genre at or above its pool rate gets 0. Nothing is boosted.

### Metrics (per account-fold, then averaged)
- **Primary: recall@200** of future films rated **4★ or more** that are in the pool: share of them inside the top 200 of the ranked pool.
- Secondary: **recall@50** of the same films; recall@200 of all future rated films (anything they went on to watch).
- **Guardrail:** recall@200 on future liked films that are in a **rarely watched genre**: a film with any kind genre at r_g < 0.5 in that account's history (watched at under half the pool rate, after smoothing). Also reported: the share of future liked films that are in such genres (how often a light watcher goes on to love the rare genre).
- Descriptive: share of each kind genre in the top 50, baseline vs treatment, against the history share; the animation case on its own.
- Averaging: each account-fold's recall, averaged within account, then across accounts (each account counts once). Account-folds with no future liked film in the pool are skipped.
- Uncertainty: **95% bootstrap over accounts** (2,000 draws, accounts resampled with all their folds, changes paired against the baseline in the same draw). Also "N of M accounts better / worse / tied".

### Choosing the strength
On folds 1-3: the arm with the higher mean change in recall@200 among arms that meet the guardrail (no more than 10% relative loss); if both fail the guardrail, P = 4 (the milder). Only that arm is judged on folds 4-5; the other is shown for reference.

### Pass bar (held-out folds 4-5, chosen arm)
- **Ship:** the 95% interval of the recall@200 change lies wholly above 0, the recall@50 change is not negative, and the guardrail holds (rare-genre liked films lose no more than 10% of their recall@200, point estimate).
- **Ship only as a product choice (accuracy-neutral):** the interval's lower bound is above −2% of the baseline recall (non-inferior), the guardrail holds, and the top-50 over-serving of rare genres falls by 25% or more. This would say the prior is safe, not that it is better.
- **Don't ship:** the interval lies wholly below 0, or the guardrail fails.
- **Not enough data:** anything else (the interval reaches below −2% relative and above 0). Then: the number of accounts that would make the interval narrow enough, from the observed spread of per-account changes.

### Also reported (requested)
- How many accounts qualify.
- The animation case for every qualifying account.
- The owner's parents (two accounts named by the coordinator): library size, animation share of library, of picks shown (`pick_exposures`, rooms excluded) and of the stored For you top 50, and what the prior would do to their animation ranking. They are included in the time split only if they meet the 150-dated bar.
