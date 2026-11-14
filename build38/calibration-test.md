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
