# Calibrated picks: genre and decade exposure caps, tested

Offline analysis, then (only if it passes) a build. Date: 2026-11-14. Data: read-only SELECTs on the Montage project. Accounts are named by user-id prefix only.

**Owner's requirement (2026-11-14):** a person whose library is 6% animated should not be shown 20% animation, with no input from them. Picks should notice on its own. Extended the same day: the same for eras (decades), and languages if the data supports it. Rarely watched kinds can still be shown when the match is strong, at a much lower volume, never zero and never swamping.

---

## 1. Pre-registration (written before any calibration result was computed)

This section was written and saved before the test was run. Nothing in it was changed after results were seen. At the time of writing, only descriptive facts were known: the mom's account id (section 3), the `pick_exposures` columns, and the previous volume-prior test's numbers (`volume-prior-test.md`).

### What is tested: (a) exposure calibration

A re-rank of a ranked list (best first). For each attribute value `a` of a person (each TMDB genre, and each release decade):

```
lib_a   = smoothed library share = (count_a + K * pool_a) / (N + K)     K = 20 films, pool_a = share in the browse_v5 pool
cap_a   = max(k * lib_a, FLOOR)                                          FLOOR = 5%
```

Shares are by film: a film counts once for each genre it has (a 2-genre film counts toward both), and once for its decade. Walking the ranked list, position `n` (1 = first) takes the best remaining film for which every attribute it carries has `count_a + 1 <= cap_a * n + 1` (one film of slack, so a single film is never blocked by a small list). A film that would break a cap waits; it is not removed, and takes the first later position where it fits.

- **Strong-match exception:** a film among the person's **5 best unseen films** (uncalibrated ranks 1-5) is never held back by a cap.
- **Never below their own share:** a cap is never under `k * lib_a >= lib_a` (k >= 1), so a genre is never pushed under the person's own share, and nothing is ever boosted.
- **Window:** the re-rank runs over the top 300 of the uncalibrated order (For you's existing `LESS_OF_WINDOW`), so it moves films only among strong matches.
- People with under 20 rated films: no calibration (their library is mostly the onboarding deck).

**Arms (fixed now):**

| Arm | Attributes | k | FLOOR |
|---|---|---|---|
| `G2` | genres | 2 | 5% |
| `GD2` | genres and decades | 2 | 5% |
| `GD15` | genres and decades | 1.5 | 5% |

Languages are not an arm: they are reported descriptively only (section 4), because rule 171 already decides language and a language cap would interact with the person's own language setting.

### What is tested: (b) implicit negative feedback

From `pick_exposures` (rooms left out). Engagement on an exposure = rated 3.5★ or more (`rating >= 3.5`), or watchlisted (`watchlisted_at`). Nothing records an *open* of a film, so opens cannot count (stated, not assumed). Hidden and passed are non-engagement.

- A genre is **ignored** for a person when, in the 30 days before a date T, films carrying it were shown **8 or more times** (distinct films) with **zero** engagement.
- Proposed effect: an ignored genre's cap becomes `max(lib_a, cap_a / 2)` (never below the person's own share), decaying back as the 30-day window moves.
- **Test (b), predictive:** T = 2026-11-01. Flag ignored genres from exposures first shown 2026-10-02 to 2026-10-31. Outcome: the engagement rate of exposures first shown from T on, films with a flagged genre against the same accounts' other films. **Passes only if** the flagged films' later engagement rate is lower, with a one-sided Fisher exact p < 0.10, flags in 3 or more accounts, and no flagged genre later produced 2 or more engaged films for its account (the false-positive check). Anything else: (b) is not built.

### Evaluation (i): the time-split recall test

Exactly as `volume-prior-test.md`: the same 9 accounts (150+ dated ratings), the same folds (41 account-folds), the same pool (20,207 films), the same baseline scores (model 9 fitted on history only; `out/folds.json` from that run, reused unchanged). `lib_a` is computed from each fold's **history** only.

- **Primary:** recall@200 of future films rated 4★+ in the pool (calibrated list of 200 against the baseline's top 200).
- **Secondary:** recall@50 (the first 50 of the calibrated list).
- **Guardrail:** recall@200 of future liked films in a rarely watched kind genre (the previous test's definition: any of Animation, Horror, Family, War, Western, Music, Romance, Science Fiction, Fantasy at r_g < 0.5 against the pool, K = 50).
- Averaging and uncertainty as before: account-fold, then account means; 95% bootstrap over accounts (2,000 draws, paired); N better / worse / tied.

### Evaluation (ii): exposure match

- **Distance:** total variation distance (TVD) between the shown mix and the library mix, computed separately for genres (film-weighted genre mentions normalised to sum 1) and decades. Also the shown/library ratio for animation.
- **On the stored top 50:** `user_score_vec` order over the browse_v5 pool, rated films removed, for every account with 50+ rated films and a stored vector; baseline against each arm.
- **On a pick_exposures replay** (accounts with 50+ rated and 30+ non-room exposures in the last 30 days): walk the account's real exposures of the last 30 days in shown order (first shown, then position). Calibration is applied with a rolling count over everything shown so far in the window. An exposure that would break a cap is replaced by the best stored-score film that is unseen, not yet shown, fits every cap, and scores no more than 5 points under the film it replaces; if none exists it is kept. Report the TVD before and after, and how many were replaced.

### Choosing the arm (folds 1-3)

Among arms that meet both (1) the guardrail (rare-genre liked recall@200 loses no more than 10%, point estimate) and (2) recall@200 change of no worse than -2% relative (point estimate), take the one with the largest mean reduction in top-50 TVD (genre TVD plus decade TVD, on the folds' own top 50s). If none meets both, take `G2` (the mildest) and report it as failing.

### Pass bar (held-out folds 4-5, the chosen arm)

**(a) passes and is built** only if all of these hold:

1. recall@200: the 95% interval's lower bound of the change is above -2% of the baseline recall (non-inferior);
2. recall@50: the point change is no worse than -2% relative, and the interval's lower bound is above -5% relative;
3. guardrail: rare-genre liked recall@200 loses no more than 10% (point estimate);
4. it does what was asked: on the pick_exposures replay, the mean genre TVD across accounts falls by at least 20%.

Otherwise it is not built, and the report says which condition failed and what would decide it.

### Also reported

- The root causes of over-exposure, quantified per surface for the two named accounts and all 50+ accounts.
- Accounts `322bf90c` and `dded73de` specifically: library share vs shown share for animation, the decade mix, and what the chosen arm does.

### Amendment A (2026-11-14, coordinator's relay of the owner; written before any calibration result was computed)

Three owner additions arrived while the descriptive root-cause numbers (section 4) were being computed. No calibration arm had been run. They are added here before any test result exists.

1. **Languages.** The owner asked for languages "if the data supports it". The plan above keeps languages descriptive. One **exploratory arm** is added and labelled as such: `GDL2` = `GD2` plus a cap on "not in English" as one attribute (original language other than `en`; animation is not exempt from it, since rule 171's exemption is about the language *filter*, not about volume). It is reported next to the others but **cannot be chosen or be the basis of a build** in this run; if it looks good it is the next pre-registered test.
2. **Tonight and movie night.**
   - **Tonight** (one film plus re-rolls): the same caps apply to the pool it draws from, counted over the rolling 30-day exposure window, so a few re-rolls follow the person's mix. Tonight's explicit choices are never capped: a genre the chosen mood asks for, the runtime, services and who's watching stay as asked.
   - **Movie night rooms:** the room's mix is the **mean of the members' smoothed shares** (each member weighted equally). Reason: the max (union) lets any one member's niche genre flood the room, which is the complaint; the min starves a genre one member watches a lot. With the mean and k = 2, a genre one of two members watches at share s gets a cap of at least s (2 × s/2), so no member's own genre is pushed under that member's share of the room. Room moods override caps as Tonight's do.
   - **Measured:** the `tonight` and `room` rows of `pick_exposures` get the same replay as section 1's exposure-match evaluation, reported separately. `pick_exposures` does not record the mood asked for, so the Tonight replay treats every request as having no mood: an **upper bound** on what calibration would change. Room rows are replayed against the room's members' mean mix where all members' libraries are known; otherwise against the logged account's own mix (stated per room).
   - These surfaces are **not part of the pass bar** (no recall test exists for them). If (a) passes, they are built with it.
3. **Explicit asks bypass calibration** (owner rule): any explicit genre, decade or language filter (Browse filters, a genre or decade door, a lane or theme page, a person page, Pitch chips and named things, Tonight and movie-night moods, a list) gets exactly what was asked. A filter on one dimension leaves the others calibrated: a decade filter still caps genres, never decades. This changes no test number (the test lists carry no filter); it is part of the build and its check.

---

## 2. Short answer

**Verdict: (a) did not pass its pre-registered bar, so it was not built. (b) failed clearly and was not built either.** Nothing was pushed. The worktree for `b40-calibrate` was made from origin/main and removed with no commit; the module that would ship (`calibrate.mjs`) is kept in the session scratchpad.

- **(a) improves what it was meant to and costs no measurable recall@200.** But the chosen arm's recall@50 interval on the held-out folds reaches −10.9% against a −5% limit. That one condition fails (condition 2). It is a width failure, not a measured drop: the point change is −1.7% (3 accounts better, 1 worse, 5 tied). Nine accounts cannot rule out a 10% recall@50 loss.
- **Everything else passed:**
  - recall@200 is non-inferior and in fact rose: held-out +4.6%; all folds +2.3% to +6.0% by arm, and for `GD2` the interval over all 41 account-folds is wholly above 0.
  - The rarely-watched-but-liked guardrail did not fall. It rose, 6 → 8 hits held out.
  - The exposure replay cut the shown-vs-library genre distance by 22.3%, against a 20% bar.
- **For `322bf90c`, the account the owner described:** over the last 30 days, the replay brings animation in the main pick surfaces from **22.9% to 9.5%** of what was shown (library 5.8%). In Tonight (an upper bound, with no moods known) it goes from **30.6% to 10.2%**. That is the behaviour the owner asked for, and it needs no input from them.
- **The mom's account is `dded73de`.** The owner's handle matched it, and it is one of the nine time-split accounts. **Animation is not over-shown for her:** 11.0% of her library against 8.7% of picks shown (11.8% in the last 30 days), and 0 of 50 in her stored top 50. Her over-exposures are **War** (2.8% of library, 9.7% shown, though she has War in Show less of) and **pre-1990 decades** (1940s–80s: 0.7–4.9% of library, 4–8% each shown). Her library's animation share is itself mostly onboarding: 36 of her 213 in-app grid ratings are animated (17%), against 6 of 31 imported films.
- **Root cause.** For `322bf90c`, about **two thirds** of the excess animation comes from the base order itself: the stored top 200 is 15.5% animated, 2.7× the library. About **one third** comes from the surfaces' own rules:
  - Today's pick: 4 of 7 animated.
  - The weekly picks: 26%, from one film per taste lane.
  - Tonight's light moods: 26.5%.

  The crowd average is **not** the cause at the top: animated and other films in their top 200 average 4.09 and 4.08. The English-only exemption (rule 171) applies to **one** account (`d14f1626`), where 70% of its non-English picks were animated. "Because you loved X" anchor lanes are not the cause either: animated mix films are spread across every lane block.
- **The largest calibration gap in the data is not animation. It is language.** Libraries that are 4–6% non-English are shown 30–50% non-English picks, in 15 of 17 accounts. The exploratory language arm (`GDL2`) had the best recall of all arms (held-out recall@200 +11.7% and recall@50 +12.8%, with both intervals at or above zero). It cut the top-50 non-English share by a third. It was not pre-registered as choosable, so it is the next test, not a ship.
- **What would decide (a):**
  - Either about **60+ accounts** with 150+ dated ratings, which would make the recall@50 interval narrow enough at the observed spread;
  - or, better and sooner, a **forward test on the deck's new exposure log** (rule 2039): calibration on for half of each account's sessions, with save and 3.5★+ rates compared.
  - Or the owner can choose to ship it as a product decision, knowing this result. That is their call and should be said in their words, not inferred from this test.

## 3. The mom's account (part 1)

- **The handle the owner gave matched exactly one account, `dded73de`.** It was a case-insensitive partial match on the username, the display name and the Letterboxd handle in `public_profiles`. `profiles` and `dna_jobs` had no match.
- One other hit, `12a43a67`, is an auth-only user that signed in once on 2026-11-05 and has no profile, ratings or picks. It is not her.
- Note: `dded73de` was already in the previous test as one of the nine 150+ accounts, and was not named there.

| | `322bf90c` | `dded73de` (mom) |
|---|---|---|
| Rated films (films only) | 394 | 426 |
| Where the library came from | 331 imported, 51 RSS, 12 in-app | **213 in-app grid, 182 in-app lookup**, 31 imported |
| Animation in library | 23 (5.8%) | 47 (11.0%); 36 of them from the in-app grid |
| Animation in picks shown, all time (rooms excluded) | **75 of 361 (20.8%)** | 53 of 608 (8.7%) |
| … last 30 days | 26.8% | 11.8% |
| … by surface | Today 4/7 · weekly 9/35 · mix 40/236 · Tonight 22/83 | Today 0/10 · weekly 0/48 · mix 17/361 · Tonight 36/186 |
| Stored For you top 50 / top 200 animated | 10% / 15.5% | 0% / 1.5% |
| Engaged with animated picks | 0 of 75 (other picks 5 of 286) | 0 of 53 (other picks 48 of 555) |
| Most over-shown | Animation 5.8% → 20.8%, Family 7.4% → 15.8%; 1960s–80s 1–6% → 8–11%; 2010s and 2020s under-shown (37% → 15%, 22% → 7%) | War 2.8% → 9.7%; 1940s–80s 0.7–4.9% → 4–8%; non-English 4.5% → 30.6% |

## 4. Root cause (part 2)

Data:
- `pick_exposures`: 3,865 non-room rows from 2026-09-26 to 11-14, plus 280 room films in 36 rooms.
- The libraries.
- `user_score_vec` for the 13 accounts with 50+ rated and a stored vector.

The surfaces `deck` and `deck_new` have **no rows yet**: rule 2039 shipped today. So the For you deck is measured only through its stored order.

### 4.1 Animation by surface, accounts with 50+ rated

| Account | Library | Shown (all) | Today | Weekly | Mix | Tonight | Stored top 50 / 200 | Shown ÷ library |
|---|---|---|---|---|---|---|---|---|
| `322bf90c` | 5.8% | **20.8%** | 4/7 | 9/35 | 40/236 | 22/83 | 10% / 15.5% | **3.6** |
| `eee3834e` | 7.7% | 20.4% | – | 1/8 | 19/86 | 0/4 | 8% / 15% | 2.6 |
| `d14f1626` | 1.1% | 12.5% | – | 0/4 | 11/81 | – | 10% / 12.5% | **11.6** |
| `09aa21db` | 6.7% | 13.7% | – | 2/15 | 15/114 | 5/29 | – | 2.0 |
| `1e98e112` | 4.2% | 8.3% | – | 0/4 | 4/42 | – | – | 2.0 |
| `d73ace86` | 11.1% | 20.6% | 0/1 | 5/17 | 25/139 | – | – | 1.9 |
| `e686712b` | 9.3% | 16.0% | 0/1 | 2/4 | 13/86 | – | 4% / 11% | 1.7 |
| `ac5a0d32` | 17.5% | 28.0% | 0/1 | 2/7 | 21/81 | 3/4 | 38% / 22.5% | 1.6 |
| `9d78754a` | 15.6% | 24.6% | 1/5 | 11/24 | 33/182 | 11/17 | 32% / 23.5% | 1.6 |
| `75afae0b` | 9.4% | 14.3% | 0/2 | 7/36 | 21/204 | 9/17 | – | 1.5 |
| `1b73ada1` | 12.4% | 11.5% | 0/12 | 1/42 | 27/281 | 33/196 | 0% / 1.5% | 0.9 |
| `dded73de` | 11.0% | 8.7% | 0/10 | 0/48 | 17/361 | 36/186 | 0% / 1.5% | 0.8 |
| `d561961e`, `032e0fd5`, `dbd4371e`, `da7f90da`, `9782716a` | 3–25% | 1–12% | | | | | | 0.1–0.5 |

### 4.2 Each suspected cause, quantified

| Cause | Finding | Size |
|---|---|---|
| **The base order (stored scores)** | `322bf90c`'s stored top 200 is 15.5% animated (2.7× library). Their animated films are rated like everything else (3.76★ vs 3.79★ mean), so the genre like-rate does not explain it. The source inside model 9 (kNN neighbours or the label lean) was not isolated here. `dbd4371e` is the extreme case: 68% of its top 50 is animated with a 4.3% library. That is the second bug `tuning-and-volume.md` flagged; its logged picks escape it because their surfaces use their own lanes. | `322bf90c`: of 54 animated picks above the library rate, about **35 (65%)** match the base order's own rate (15.5% × 361 = 56 vs 21 at library rate). |
| **High crowd averages** | Pool-wide, animated films average 3.34 against 3.20. Inside each account's top 200 the gap disappears (`322bf90c` 4.09 vs 4.08; similar for 10 of 12 accounts). | **Not a material cause at the top of the list.** |
| **English-only exemption (rule 171)** | Only one account with 50+ rated sets English only (`d14f1626`): 7 of its 11 animated picks are non-English, and 70% of its non-English picks are animated. No other account has a language filter, so the exemption cannot act for them. | 1 account; there it drives most of the 11.6× ratio. |
| **Onboarding family films** | In-app grid and lookup ratings are 7.5% animated across 50+ accounts, against 11.8% for imported ones. So it is not a general inflation. `322bf90c` has no in-app animated ratings. The mom's 11% animation share is mostly the grid (36 of 47). | Not a cause for `322bf90c`. For `dded73de` it inflates the library share that any calibration would follow. |
| **"Similar films" / anchor lanes** | Mixes are logged lane by lane (6 a lane). `322bf90c`'s animated mix picks are spread 1–3 per lane across all 7 lane blocks. All accounts: 0–14% per block, no block dominated. A "Because you loved <animated film>" lane would show as one block of 4–6. | **Not a cause.** |
| **Diversity and slot rules** | Weekly picks take **at most one film per taste lane** (`lib/weekly-picks.ts`). Animation is a tight lane of its own, so a 4-film week gives it a whole slot (25%) whenever one animated film clears 70. Mixes allow **2 per lane per "genre"** with Animation keyed on its own (`varietyKey`, maxPerGenre 2 of 6 = up to 33%). Today's pick walks the same rotation day by day. | `322bf90c`: weekly 26% and Today 57% against a 15.5% base order. 9d78754a: weekly 46% vs 23.5%. e686712b: weekly 2 of 4 vs 11%. Mixes run about at the base rate (17% vs 15.5%). **About a third of `322bf90c`'s excess** (≈ 19 films), concentrated in Today and weekly. |
| **Tonight moods** (something else) | Light, Brain off and similar moods list Animation and Family as their genres (`lib/mood-profile.ts`). | Tonight is the most animated surface for 6 accounts (`9d78754a` 65%, `ac5a0d32` 75%, `75afae0b` 53%, `322bf90c` 27%). Moods are an explicit ask, so the owner's bypass rule keeps them. |
| **Language (something else)** | Libraries that are 4–6% non-English are shown **30–50%** non-English picks, in 15 of 17 accounts. It is the largest gap in the data, bigger than animation. | Genre-only calibration does not touch it. See the exploratory `GDL2`. |

**Other genres over-shown at 2× or more** (shown ≥ 5%; 17 accounts with 30+ exposures):
- War: 7 accounts.
- History: 5.
- Drama and Mystery: 4 each.
- Animation: 4.
- Romance and Crime: 3 each.

War and History follow the crowd pull of acclaimed canon, as `tuning-and-volume.md` found.

**Decades:** almost every account is shown more 1940s–1980s films and fewer 2010s–2020s films than it watches, despite the existing era mix (rule 546) and the mixes' old-film caps (rule 279). `322bf90c`: 2010s 37% → 15%, 2020s 22% → 7%.

## 5. Results of the test (part 3)

As pre-registered:
- the same 9 accounts, the same 41 account-folds and the same baseline scores as `volume-prior-test.md`;
- 597 liked future films on folds 1–3 and 340 held out;
- 89 in rarely watched genres.

The scripts are in the session scratchpad (`vp/code/cal-eval.mjs`, `cal-agg.mjs`, `replay.mjs`, `implicit.mjs`, `stored-cal.mjs`, and the module `calibrate.mjs`). They are not committed.

### 5.1 Choosing the arm (folds 1–3)

| | Base | `G2` | `GD2` | `GD15` | `GDL2` (exploratory) |
|---|---|---|---|---|---|
| Recall@200 liked | 0.221 | +0.015 [+0.004, +0.029] | +0.016 [+0.005, +0.029] | +0.003 [−0.003, +0.009] | +0.016 |
| Recall@50 liked | 0.096 | +0.007 | +0.015 | +0.019 [+0.002, +0.038] | +0.009 |
| Guardrail, rare-genre liked recall@200 | 0.383 | 0.0% | +1.6% | −2.3% | +1.6% |
| Top-50 genre TVD | 0.452 | −0.077 | −0.077 | −0.106 | −0.073 |
| Top-50 decade TVD | 0.502 | +0.002 | −0.120 | −0.132 | −0.055 |
| Meets guardrail and recall rule | | yes | yes | yes | (not choosable) |

**`GD15` was chosen**, by the largest combined TVD cut (−0.238, against −0.197 for `GD2`).

### 5.2 Held out (folds 4–5, `GD15`)

| | Base | `GD15` (chosen) | `GD2` (ref.) | `GDL2` (exploratory) |
|---|---|---|---|---|
| Recall@200 liked | 0.189 | 0.198: **+0.009 [−0.003, +0.023]**, +4.6%; 3 better / 1 worse / 5 tied | +0.010 [−0.003, +0.027] | +0.022 [+0.002, +0.045] |
| Recall@50 liked | 0.101 | 0.100: **−0.002 [−0.011, +0.005]**, −1.7%; 3 / 1 / 5 | −0.005 [−0.012, 0.000] | +0.013 [−0.000, +0.030] |
| Recall@200, anything watched | 0.111 | +0.002 | +0.001 | +0.005 |
| Guardrail, rare-genre liked recall@200 | 0.116 (6 of 32) | **0.144 (8 of 32), +19%** | 0.144 | 0.144 |
| Top-50 genre TVD | 0.443 | 0.326 (−26.5%) | −16.9% | −17.5% |
| Top-50 decade TVD | 0.440 | 0.330 (−24.9%) | −18.8% | −12.6% |
| Top-50 animated share | 18.0% | 11.6% | 10.8% | 10.0% |
| Top-50 non-English share | 48.4% | 49.2% | 49.7% | **31.9%** |

All 41 account-folds, for reference: `GD15` recall@200 +0.005 [−0.002, +0.013] and recall@50 +0.010 [−0.002, +0.023]. `GD2` recall@200 +0.013 [+0.003, +0.023], wholly above 0, with 6 accounts better and 1 worse.

### 5.3 Exposure replay (`pick_exposures`, last 30 days)

**Main surfaces** (Today, weekly, top, mix). These are the 10 accounts with 50+ rated, a stored vector and 30+ exposures in the window.

| | Genre TVD | Decade TVD |
|---|---|---|
| Base | 0.320 | 0.275 |
| `GD15` | 0.249 (**−22.3%**) | 0.255 (−7.1%) |
| `GD2` | 0.282 (−11.9%) | 0.256 (−6.6%) |

Per account, `GD15`:
- **`322bf90c`:** genre TVD 0.259 → 0.118; **animation 22.9% → 9.5%**; 55 of 105 films replaced.
- **`dded73de`:** 0.338 → 0.322; animation 3.9% → 3.1%; decade TVD rose slightly, 0.088 → 0.120.
- **`9782716a`** (Crime/Drama/Thriller over-shown): 0.574 → 0.472, but 107 of 175 over-cap films had no replacement within 5 points and stayed.
- `9d78754a` and `1b73ada1` were about unchanged.

The replay's decade improvement is small. Replacements come from the stored order, which itself leans old for these accounts.

### 5.4 Against the bar

| Condition | Result | Met |
|---|---|---|
| 1. recall@200 lower bound above −2% relative (−0.0038) | −0.003 (−1.6%) | Yes |
| 2. recall@50 point change no worse than −2%, and lower bound above −5% relative | −1.7%, but **lower bound −0.011 (−10.9%)** | **No** |
| 3. Guardrail: rare-genre liked recall loses at most 10% | +19% (6 → 8 hits) | Yes |
| 4. Replay genre TVD falls by 20% or more | −22.3% | Yes |

**(a) fails on condition 2 and is not built.** The held-out recall@50 changes per account were +0.002, +0.003, −0.036, +0.015, and 0 for the other five. One account, `d561961e` (fold 4: 0.407 → 0.333), holds the interval down. At the observed spread (SD 0.014 per account), the lower bound clears −5% only with **about 63 accounts**. The decision rule was fixed before the result and is kept.

### 5.5 Tonight and movie night (amendment A; not part of the bar)

- **Tonight** (4 accounts with 10+ Tonight films in 30 days, no mood known: an upper bound):
  - Genre TVD 0.347 → 0.257 (−26.0%).
  - Decade TVD rose: 0.191 → 0.235.
  - `322bf90c`: animation 30.6% → 10.2%.
  - `dded73de`: 22.2% → 15.7%.
  - `1b73ada1`: 16.2% → 12.2%.
- **Rooms:**
  - 36 rooms and 280 films; 22.5% of room films are animated, against 13.1% for the members' mean library share (film-weighted).
  - Under the members' mean-mix caps (k = 1.5), 74% of room films would have to wait. Rooms show 2–10 films each, many of them old-canon decades, against libraries mostly from the 2010s.
  - With no replacement source logged (room candidates are built per room), removing them makes the room mix *less* like the members' (genre TVD 0.486 → 0.617).
  - **Rooms cannot be judged from this data.** A room calibration needs the room's own candidate list, which is not logged.

### 5.6 The stored For you top 50, all 13 accounts with a stored vector

| | Genre TVD | Decade TVD |
|---|---|---|
| Base | 0.429 | 0.494 |
| `GD15` | 0.338 | 0.378 |
| `GD2` | 0.360 | 0.388 |

- `322bf90c` keeps 5 animated films in its top 50 under every arm. Its stored top 50 is not where the over-exposure is. Its pre-1990 films fall from 25 to 19.
- `dbd4371e`'s 34 animated films fall to 13. Its top 50 still leans old.
- `dded73de`'s pre-1990 films fall from 30 to 17.

### 5.7 (b) implicit negative feedback

- **It does not discriminate.** Engagement is rare: 118 of 3,865 exposures were saved or rated 3.5★+. So "8 or more shown, zero engaged" flags nearly every genre: 15 accounts, up to 9 genres each, including Drama and Comedy.
- After T, flagged-genre films were engaged at 1.0% (4 of 395), against 1.3% (4 of 301) for the rest. One-sided Fisher p = 0.48.
- One false positive: Comedy for `dded73de`, with 2 engaged films later.
- **(b) fails and is not built.** It would need an engagement signal that fires far more often than saves and ratings. Card opens and dwell are not logged. The deck's new log has positions, which could give a "swiped past at once" signal.

## 6. What was not measured

- **The For you deck as dealt.** It has no exposure rows yet (rule 2039 is a day old). Only its stored order was tested, without day signals, Less of, the era mix or capRuns.
- **Moods in Tonight and the room's candidates.** The Tonight replay is an upper bound, and rooms are descriptive only.
- **The model-side cause** of `322bf90c`'s 15.5% animated top 200 (kNN neighbours or the label lean) was not isolated.
- **Real behaviour.** Recall on future ratings measures what people chose to watch, partly steered by Montage in 2026. Nobody was shown a calibrated list.
- **The sample.** 9 accounts in the time split, several of them related, and 10 in the replay. The bootstrap treats them as independent.
- **Languages.** The language arm is exploratory, and one result is not a test.

## 7. What would decide it, and what to build next

1. **A forward test of `GD15` on real exposures.** The deck now logs what it shows. Switch calibration on for alternate days per account (Today, weekly, mixes, deck), then compare save and 3.5★+ rates and the shown-vs-library distance after 2–3 weeks. This answers the owner's question directly. The offline recall test cannot at 9 accounts.
2. **Pre-register the language arm** (`GDL2`, or language alone) as its own test. It is where the largest gap is, and it had the best offline recall here.
3. **Two cheap fixes that need no calibration test, since they are rules that amplify on their own.** Each needs the owner's decision:
   - The weekly picks' one-per-lane rule gives a small lane a whole slot of four.
   - The mixes' `maxPerGenre` 2 allows any genre up to a third of every lane.

   Holding both to the person's own share (the same cap) is the smallest change that would have kept `322bf90c`'s Today and weekly picks near its base rate.
4. **`dbd4371e`'s animated base order** is a separate model bug that calibration only hides (68% → 26% of its top 50). It needs its own look.
