# Genre volume prior: time-split test

Offline analysis. No app code changes, no database writes. Date: 2026-11-14. Data: read-only SELECTs on the Montage project (Supabase MCP). Accounts are named by user-id prefix only. The proposal under test is `tuning-and-volume.md` section 4(c).

**Question (owner):** if someone watches very little of a genre, should Picks push that genre down, even when they rated a few films in it well?

---

## 1. Pre-registration (written before any result was computed)

This section was written and saved before the test was run. Nothing in it was changed after results were seen. Results are in section 2 onward.

### Accounts
- Every account with **150 or more dated, rated films** (films only, TV and duplicates dropped, by the date rule of `scripts/eval-time-split/run.mjs`: an in-app rating that differs from the import uses its watched/created date; otherwise the Letterboxd rated date `a`, then the diary date `w`/`wd`, then the in-app date). Undated ratings always count as history (they were known before any cut).
- Count at the first read (before results): 9 accounts (`1b73ada1`, `032e0fd5`, `d561961e`, `dded73de`, `e686712b`, `ac5a0d32`, `9d78754a`, `dbd4371e`, `9782716a`). The final count after the film filters is reported in section 2.

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

---

## 2. Short answer

**Verdict: don't ship the volume prior as proposed.** It failed its pre-registered guardrail on both the choosing folds and the held-out folds, and it lowered recall a little everywhere. It does what it was designed to do, which is to empty the top 50 of rarely watched genres (8.3% → 1.1% of the top 50 on held-out folds). The trouble is that the rare-genre films it pushed down were often the very films these people went on to rate 4★ or more.

- **Accounts qualifying (150+ dated rated films): 9.** `1b73ada1`, `032e0fd5`, `d561961e`, `dded73de`, `e686712b`, `ac5a0d32`, `9d78754a`, `dbd4371e`, `9782716a`. Together: 41 account-folds and 937 future films rated 4★+ that sit in the pool. That is small. But the main harm (the guardrail) is large enough to show at this n.
- **Held-out folds 4-5, P = 4 (the arm the rule picked):**
  - Recall@200 of future liked films: 0.189 → 0.187. The change is −0.003, 95% interval −0.009 to 0.000 (−1.5% relative; lower bound −4.5%). 0 accounts better, 1 worse, 8 tied.
  - Recall@50: 0.101 → 0.093. Change −0.009, interval −0.018 to −0.001, wholly below zero.
  - **Guardrail:** liked films in rarely watched genres. Recall@200 fell from 0.116 to 0.058, a 50% relative loss against a 10% limit. In raw hits that is 6 of 32 films → 3 of 32. **Fails.**
- **All 41 account-folds, P = 4:** recall@200 change −0.012, interval −0.030 to −0.000, wholly below zero (1 account better, 6 worse). Rare-genre liked recall@200 fell from 0.259 to 0.078 (24 → 11 hits of 89; 0 accounts better, 6 worse). P = 6 is worse on every count.
- **The owner's premise does not hold in this data.** Of the films these accounts later rated 4★+, **8.9% were in a genre they had watched at under half the pool rate**. The current model already ranks those films *better* than average: recall@200 0.26 against 0.21 overall. A light watcher who later loves the genre is common enough, and the model already finds them. The prior takes that away.
- **Animation specifically: nothing to gain and nothing measurable either way.** No qualifying account watched animation at under half the pool rate. Only two (`032e0fd5` and `dbd4371e`) were under the pool rate at all. An animation-only prior (exploratory, not pre-registered) changed held-out recall by exactly 0.000 and moved one liked film into the top 200 across all folds. Its one visible effect is `dbd4371e`'s top 50, where animation fell from 25-41 films to 15-36. That account's own problem (section 5) is not volume.
- **The named parent account `322bf90c`** cannot enter the time split: only 66 of its 398 ratings are dated. On its stored order, the prior would barely touch animation. Its animation is 5.8% of its library against a 7.1% pool rate, which gives r = 0.84 and only 1.0 to 1.5 points. Animated films in its top 200 go from 31 to 26 (P = 4), and its top 50 stays at 5. Its over-serving happens in the logged picks (20.8% animated, against 5.8% of its library), and the prior is too weak to fix that. **The second handle matched no profile** (section 6).
- **What would decide the narrower animation question:** not more rating history but **logged exposures with outcomes**. See section 7.

---

## 3. What was run

- Data read on 2026-11-14 (read-only):
  - Every rating: library plus in-app, minus removed. 23 accounts.
  - The 20,679 films the test needs: the browse_v5 pool (20,207 films), every rated film and the 6,600 most-watched, with embeddings and labels. These used the same SELECTs as the 2026-11-12 time-split eval, plus a pool flag.
  - `user_score_vec` for the stored-order checks.
  - `pick_exposures` for the parent account.
- Baseline: `lib/taste/match-model.mjs` at `/home/user/montage`, unchanged, run offline (Node).
  - It follows `prepareUser` / `scoreShard` with `buildUserModel`, `v3Stats`, `v3Training`, `v3FitUser` and `v3Scale` over the 6,000-film reference, then `v3FilmScore` with `v3DecadeOffset`.
  - The fit uses each account's history only, with a population refitted per fold.
  - About 20 minutes for 41 account-folds × 20,207 films.
- Scripts and dumps live in the session scratchpad (`vp/code/score.mjs`, `eval.mjs`, `eval-anim.mjs`, `stored.mjs`) and are not committed.
- Pool genre shares c_g:

  | Genre | Share |
  |---|---|
  | Animation | 7.1% |
  | Horror | 16.2% |
  | Family | 8.5% |
  | War | 3.2% |
  | Western | 1.7% |
  | Music | 3.0% |
  | Romance | 18.2% |
  | Science Fiction | 9.9% |
  | Fantasy | 9.5% |

- **Deviations from the pre-registration:**
  - Accounts outside the 9 entered each fold's population fit with their whole library. The pre-registration's "every account's history" has no cut for them.
  - Fold cuts land on date boundaries. `dded73de` has 13 distinct dates, so it got folds 1 and 5 only. `dbd4371e` lost fold 3 (two quantiles shared a boundary). That gives 41 account-folds, not 45.
  - Nothing else changed.

### Folds

| Account | Rated (dated) | Cuts (fold: history size, date) |
|---|---|---|
| `1b73ada1` | 1,080 (1,080) | 1: 541 2022-05 · 2: 648 2022-12 · 3: 756 2024-01 · 4: 864 2024-07 · 5: 971 2025-07 |
| `032e0fd5` | 872 (872) | 436 2024-05 · 522 2024-06 · 610 2024-09 · 698 2025-03 · 785 2025-09 |
| `d561961e` | 564 (564) | 279 2022-06 · 338 2022-12 · 395 2024-03 · 451 2025-03 · 508 2025-08 |
| `dded73de` | 426 (395) | 1: 345 2026-09-30 · 5: 393 2026-10-05 |
| `e686712b` | 333 (333) | 167 2025-09 · 200 2025-11 · 233 2026-03 · 266 2026-06 · 300 2026-08 |
| `ac5a0d32` | 292 (292) | 146 2025-06 · 174 2025-08 · 203 2025-12 · 231 2026-02 · 263 2026-05 |
| `9d78754a` | 250 (250) | 125 2025-03 · 150 2025-04 · 175 2025-07 · 200 2025-12 · 225 2026-05 |
| `dbd4371e` | 234 (234) | 1: 104 · 2: 153 · 4: 187 (all Dec 2022) · 5: 210 2026-10 |
| `9782716a` | 226 (226) | 114 2026-08-22 · 142 08-26 · 156 09-13 · 183 10-13 · 195 11-08 |

---

## 4. Results

### Choosing the strength (folds 1-3: 9 accounts, 24 account-folds, 597 liked future films, 57 in rare genres)

| | Baseline | P = 4 | P = 6 |
|---|---|---|---|
| Recall@200 liked | 0.221 [0.141, 0.307] | 0.203 (change −0.018 [−0.047, +0.002]; 1 better / 6 worse / 2 tied) | 0.187 (−0.033 [−0.098, +0.011]; 2 / 6 / 1) |
| Recall@50 liked | 0.096 | 0.071 (−0.024 [−0.067, −0.001]) | 0.070 (−0.026 [−0.068, −0.002]) |
| Recall@200, anything watched | 0.123 | 0.114 (−0.010 [−0.027, +0.002]) | 0.105 (−0.018) |
| **Guardrail:** recall@200, liked in rare genres | 0.383 | 0.100 (−74%) | 0.021 (−95%) |
| Rare-genre films in top 50 | 7.4% | 0.3% | 0.1% |
| Animated films in top 50 | 12.6% | 10.3% | 8.9% |

Both arms failed the guardrail, so the rule took P = 4.

### Held out (folds 4-5: 9 accounts, 17 account-folds, 340 liked future films, 32 in rare genres)

| | Baseline | P = 4 (chosen) | P = 6 (reference) |
|---|---|---|---|
| Recall@200 liked | 0.189 [0.092, 0.288] | 0.187: **change −0.003 [−0.009, 0.000]**; 0 better / 1 worse / 8 tied | 0.186 (−0.004 [−0.016, +0.008]; 1 / 2 / 6) |
| Recall@50 liked | 0.101 | 0.093: **−0.009 [−0.018, −0.001]**; 0 / 3 / 6 | 0.093 (−0.009 [−0.018, −0.001]) |
| Recall@200, anything watched | 0.111 | 0.106 (−0.005 [−0.012, −0.001]) | 0.106 (−0.005 [−0.014, +0.002]) |
| **Guardrail:** recall@200, liked in rare genres | 0.116 (6 of 32 hits) | **0.058 (3 of 32), −50%** | 0.024 (1 of 32), −79% |
| Rare-genre films in top 50 | 8.3% | 1.1% | 0% |
| Animated films in top 50 | 18.0% | 17.1% | 16.8% |
| Share of liked future films in rare genres | 7.7% | | |

### Against the bar

| Test | Result | Met |
|---|---|---|
| Ship: recall@200 interval wholly above 0 | −0.009 to 0.000 | No |
| Product-choice: interval lower bound above −2% relative (−0.0038) | −0.0085 (−4.5%) | No |
| Guardrail: rare-genre liked recall loses at most 10% | −50% (6 → 3 hits) | **No** |
| Top-50 rare-genre over-serving falls by 25%+ | 8.3% → 1.1% (−87%) | Yes |
| Don't ship: interval wholly below 0, **or guardrail fails** | Guardrail fails. On all folds, recall@200 −0.012 [−0.030, −0.000] is also wholly below 0 | **Yes: don't ship** |

The held-out guardrail rests on 32 films. On its own it is thin. It matches the choosing folds, though (57 films, 18 → 5 hits), and every account where the prior changed anything moved the same way: 0 better and 6 worse over all folds. So the result is not one noisy fold.

### Which "rare" genres the future likes were in

Of the 89 liked films in rarely watched genres (all folds):

| Genre | Films | Accounts |
|---|---|---|
| **Horror** | 53 | 4 |
| Romance | 24 | 4 |
| Western | 6 | 4 |
| War | 6 | 2 |
| Animation | 0 | 0 |

Horror is a sixth of the pool, so a library that is "only" 5-8% horror reads as rare (r ≈ 0.35-0.48, 4-6 points). These people went on to like horror films the model was already ranking highly.

Genres under half the pool rate at each account's last fold, with the P = 4 points:

| Account | Rare genres (r, points) |
|---|---|
| `dded73de` | Horror 0.20 (9.4) |
| `032e0fd5` | Horror 0.35 (6.1) |
| `ac5a0d32` | Romance 0.49 (4.1) |
| `d561961e` | Horror 0.35 (6.0); Romance 0.48 (4.2) |
| `9d78754a` | Horror 0.45 (4.6) |
| `e686712b` | Romance 0.46 (4.5) |
| `dbd4371e` | War 0.43 (4.8); Music 0.19 (9.5); Romance 0.38 (5.5) |
| `9782716a` | Horror 0.33 (6.4) |
| `1b73ada1` | Horror 0.48 (4.2) |

---

## 5. The animation case

**No qualifying account is a light animation watcher by the prior's own measure.** The ratio r and the points are from each fold's history.

| Account | Animation in history | r (range over folds) | P = 4 points | Liked animated films later (all folds) | What the prior did to them |
|---|---|---|---|---|---|
| `032e0fd5` | 24-28 films, 3-5% | 0.53-0.80 | 1.3-3.6 | 1 (Who Framed Roger Rabbit, rank 9,860) | 9,860 → 10,767; top 50/200 had no animation either way |
| `dbd4371e` | 4-10 films, 4% | 0.66-0.81 | 1.2-2.4 | 5 (A Goofy Movie, WALL·E, Frankenweenie, Pinocchio, Roger Rabbit) | All pushed down: A Goofy Movie 293 → 505, WALL·E 795 → 885. None was in the top 200 before |
| other 7 | 9-25% of history | 1.4-4.2 | 0 | 59 | Animation gets 0 points; liked animated films rose slightly, since other genres dropped (e.g. Princess Mononoke 175 → 160, Toy Story 5 126 → 123) |

- **`dbd4371e`'s top 50 is mostly animation** at every fold: 25, 38, 41 and 41 films. The prior at P = 4 cut that to 15, 22, 36 and 34. **Its recall was 0 at every fold in every arm.** It went on to rate horror, which the model doesn't surface for it. Section 3.2 of `tuning-and-volume.md` already pointed this way: the animation flood for this account is a model problem (crowd centre or label lean on a horror-heavy library), not a volume problem. The prior hides some of the symptom without finding anything it likes.
- **Animation-only prior (exploratory, not pre-registered, so not a basis for a ship call):** held-out recall@200 and @50 changes were exactly 0.000 for every account. Over all folds, one liked film entered the top 200 (`dbd4371e`, fold 2). It cut the top-50 animated share from 12.6% to 9.0% on folds 1-3 and from 18.0% to 16.4% on folds 4-5. So it is safe here, but only because no account in the sample is a light animation watcher who later liked animation. **It cannot be judged from this data.**

---

## 6. The owner's parents (per the coordinator)

- **First account named: `322bf90c`.**
  - Library: 528 entries in the imported library; 398 ratings once in-app ratings are merged and removals dropped; 394 of them are films in the catalog. **Only 66 are dated**, so it cannot enter the time split, and its history order is unknown.
  - Library animation: 23 films, **5.8%**. Mostly family studio films, rated 3-4.5★: Toy Story 5 at 4★ (in-app), Into the Spider-Verse 4.5★, the Cars films, Zootopia, Shrek 2. Pool rate is 7.1%.
  - **Picks shown** (`pick_exposures`, rooms left out):
    - All time: 75 of 360 animated, **20.8%**.
    - Last 30 days: 39 of 154, **25.3%**.
    - Outcomes: 0 of 75 animated picks were watchlisted or rated 3.5★+, against 5 of 285 others.
  - **Stored For you top 50** (`user_score_vec`, the browse_v5 pool, rated films removed, watchlist not removed): 5 animated (10%), 31 in the top 200. The highest are Shrek 89, Toy Story 89, The Iron Giant 88, The Lion King 87 and My Little Pony: Equestria Girls – Rainbow Rocks 87.
  - **What the volume prior would do:** r = 0.84, so 1.0 point at P = 4 and 1.5 at P = 6. Top 50 stays at 5 animated. Top 200 goes from 31 to 26 (P = 4) or 22 (P = 6). The first animated film moves from rank 7 to 16 (or 21). **That is close to nothing.** Their animation is only a little under the pool rate, so a volume rule cannot see it. The over-serving is in the logged picks (4× library share), not in the base order. Its causes are the surfaces' own lanes and the family-canon pull of the crowd side, not volume (`tuning-and-volume.md` 2, 3.2).
- **Second handle named: no match.** No row in `public_profiles` (username, Letterboxd handle or display name), `profiles` or `dna_jobs` matches it, exactly or as a substring. Of the 23 profiles, the only ones in the stated 150 to 1,000 range are the 9 test accounts and `322bf90c`. I did not guess which one it might be. The coordinator should confirm the handle or the user id.
- **Check this before relying on the pairing:**
  - The data-science log entry of 2026-11-11 (actor leans) calls the first named handle "Owner's own (… 390 rated)".
  - `tuning-and-volume.md` treats `1b73ada1` as the owner.
  - Whether `322bf90c` is the owner's parent or a second owner account is not something the data settles.

---

## 7. What would decide it

- **The broad prior (all kind genres):** decided. Don't ship. More accounts won't rescue it: its harm on rare-genre likes is −0.18 recall with a per-account SD of about 0.20, so the interval already excludes zero at 8 accounts.
- **The narrower question, "push down animation for people who watch very little of it":** undecided, and a rating time split can hardly decide it.
  - That needs accounts with 150+ dated films and animation under about 3.5% of their library who later rate animated films. Today there are none in the sample.
  - A rough count: at about 9% of future likes landing in a rare genre, and animation being one of nine genres, a decisive test needs about **30-50 such "light watcher later liked animation" events**. With roughly 1-2 per qualifying account, that is **several dozen qualifying accounts, not 9**.
- **The better evidence is exposure outcomes, as proposal 4(c) step 1 already says.** Log the For you deck (`surface: "foryou"`), then compare pass, hide, watchlist and rate on animated versus other picks for accounts with under 5% animation.
  - Today's signal is 0 positives in 87 animated exposures against about 2% for other picks.
  - Telling 0.5% from 2% with 80% power needs about **900 animated impressions** to low-share accounts. At current traffic (about 360 picks logged in 5 months for the busiest such account), that is months, unless the deck is logged.
- A shadow run of an animation-only prior on those logs would answer the owner's question directly. The time split cannot.

## 8. What was not measured

- The real For you slates: watchlist, Show less of, day signals, variety and the era mix were not applied. The stored-order checks also leave the watchlist in.
- Picks surfaces other than the base order: Today, weekly, Taste Mixes and Tonight have their own lanes.
- **Undated and bulk dates.** The time split trusts the Letterboxd rated date (`a`), which often marks when a backlog was entered, not when the film was watched. `dbd4371e` has 37 distinct dates and `dded73de` 13, and some "future" sets are bulk entries.
- "Future rated 4★+" is revealed demand from what people chose to watch, partly steered by Montage itself in 2026 folds. It is not a randomized outcome.
- 9 accounts, several of them related (family accounts). The bootstrap treats them as independent.
