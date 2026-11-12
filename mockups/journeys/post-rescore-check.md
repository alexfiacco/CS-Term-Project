# After today's rescore: did it land, and are the scores too high?

2026-11-12. Read-only: montage at `/home/user/montage` (nothing pushed there) and Supabase `uktamekqqsiijugpaxit` (SELECT only, through MCP). Profiles are anonymized except the owner (`467a3dgd`) and the owner's mom (`syyd8u4q`, handle baohonghf). No emails were read.

## Short answer

1. **All four changes were in today's pass.** No change waits for a later pass.
2. **The top of every list is crowded at 90%+.** On each person's top 50 unseen picks, 95% show 90%+ on average. 22 of 23 accounts are over the 15% line, almost all of them at 100%.
3. **The 90% band itself holds up on rated films.** Held-out films shown 90%+ average 4.33★, and 9% of them are rated under 4★. The problem is crowding, not wrong numbers. The worst account is the owner's mom: 18% of her held-out 90%+ films are under 4★. The owner is at 13%.
4. **Proposed fix:** flatten the display curve above 85, so a number over 85 moves half as far (it ships behind a switch). On the held-out films it makes the 90% band honest (83% of those films get 4.5★+, up from 50%). 5★ films at 85%+ stay where they were. Ranking does not change. The top 50 at 90%+ falls from 95% to 59%. It has not been run on the time split; see below.
5. **The Prestige: no.** The owner's library still has one dated watch for it (2026-06-28) and a count of 3. Today's re-import ran at 03:44 UTC. The code that keeps every diary date (`956fdc8d`) landed at 04:46. One more re-import will store the 3 dates.

## 1. Did today's pass include all four changes?

| Change | Commit | Committed (UTC) | Before the 08:33 pass? |
|---|---|---|---|
| Safe share cap (rule 1488/1545) | `33686382` | 02:11 | yes |
| Per-person display curve on (rule 1546) | `f3a1a17c` | 02:25 | yes (applied when scores are read) |
| Crowd cap 30% | `9211453c` | 03:17 | yes |
| Director cap on neighbours (rule 1555) | `b6298bf2` | 04:31 | yes |

- All four are on `origin/main`. Each of the first three is an ancestor of `b6298bf2`.
- `FULL_PASS.CATALOG_FIXED_AT` is `2026-11-12T08:00:00Z`, and its comment names rule 1555. Every full calibration from before 08:00 therefore counted as none, and everyone was refitted.
- **The deployed pass ran the director-cap code.** The population fit was saved at 08:33:36 under `match-model:v7n9sfd:population`. The trailing `d` in that key is set only when `NEIGHBOUR_DIRECTOR_CAP` is on. The 30% crowd cap and the safe share cap come before `b6298bf2` in history, so that build contains them too.
- **All 23 rows in `user_match_calibration` are model_version 9, source `full`,** written 08:51:00–08:51:04. All 23 `user_score_vec` rows were written 08:50:48–08:51:00.
- **22 profiles got a per-person curve** (`match-personal-curve:*`, model_version 9, matching their calibration rows). The one without is the 13-rating account, which is under the 20-rating minimum. So the display curve is live for 22 of 23, unless Vercel has `MATCH_PERSONAL_CURVE=off` set. I did not check Vercel's environment variables.
- **Next pass:** nothing is waiting. The cron runs daily at 08:33 UTC, but it will only rescore people with new ratings, a re-import, or a profile change.

## 2. Shown % per account

How the shown % is worked out:
- I take the stored score and apply the account's spread (`spreadFor(n_rated)`).
- That goes through the person's curve (`personalShown`, blended n/(n+100)) and back through `storedForShown`. Then `shownMatch` and rounding give the number, as in `lib/taste/film-scores.ts` and `shown-match.ts`.
- Soft-tell offsets (a point or two) are left out.
- "Top 50 unseen" means the 50 highest stored scores not in the person's library or app ratings. The Picks screen may filter more, for example TV or unreleased films.

**Before vs after:** there is no snapshot from before today. `user_film_score_legacy` covers only 7 profiles and dates from the September move to packed scores, so it is no baseline for model 9. The nearest stand-in is today's scores with the shared curve only (as before `f3a1a17c`): 92% of the top 50 at 90%+, against 95% now. Held-out band numbers are the same either way.

### Top 50 unseen picks, and 5★ films

- "Stored" columns use the current stored score on the rated film. That score is in-sample, because the film helped fit it.
- "Held-out" columns use `rating_predictions` held-out rows. These are what the web card shows on a rated film. Only 8 accounts have them yet.

| Account | Rated | 90%+ | 78–89 | 65–77 | <65 | 90%+ with fix | 5★ at 85%+ (stored) | 5★ at 85%+ (held-out) | 90%+ rated <4★ (held-out) |
|---|---|---|---|---|---|---|---|---|---|
| Owner | 1080 | 100% | 0% | 0% | 0% | 16% | 100% of 40 | 68% of 40 | 13% of 86 |
| Account A | 872 | 100% | 0% | 0% | 0% | 100% | 94% of 88 | – | – |
| Account B | 564 | 100% | 0% | 0% | 0% | 30% | 98% of 45 | – | – |
| Owner's mom | 426 | 100% | 0% | 0% | 0% | 36% | 100% of 6 | 100% of 6 | 18% of 85 |
| Account C | 393 | 100% | 0% | 0% | 0% | 66% | 81% of 16 | 69% of 16 | 7% of 72 |
| Account D | 331 | 100% | 0% | 0% | 0% | 100% | 90% of 31 | 71% of 31 | 0% of 33 |
| Account E | 292 | 100% | 0% | 0% | 0% | 100% | 83% of 12 | – | – |
| Account F | 250 | 100% | 0% | 0% | 0% | 100% | 91% of 22 | – | – |
| Account G | 234 | 100% | 0% | 0% | 0% | 100% | 52% of 25 | – | – |
| Account H | 225 | 100% | 0% | 0% | 0% | 100% | 100% of 25 | 96% of 25 | 0% of 39 |
| Account I | 142 | 100% | 0% | 0% | 0% | 100% | 93% of 15 | – | – |
| Account J | 126 | 100% | 0% | 0% | 0% | 100% | 92% of 13 | 77% of 13 | 0% of 14 |
| Account K | 105 | 100% | 0% | 0% | 0% | 100% | 55% of 38 | – | – |
| Account L | 92 | 100% | 0% | 0% | 0% | 100% | 80% of 10 | – | – |
| Account M | 90 | 100% | 0% | 0% | 0% | 32% | 50% of 4 | – | – |
| Account N | 81 | 100% | 0% | 0% | 0% | 72% | 82% of 11 | – | – |
| Account O | 71 | 100% | 0% | 0% | 0% | 100% | 71% of 7 | – | – |
| Account P | 53 | 100% | 0% | 0% | 0% | 14% | 100% of 16 | – | – |
| Account Q | 34 | 100% | 0% | 0% | 0% | 0% | 8% of 13 | 38% of 13 | – |
| Account R | 33 | 96% | 4% | 0% | 0% | 0% | 67% of 3 | 67% of 3 | 0% of 2 |
| Account S | 32 | 100% | 0% | 0% | 0% | 0% | 50% of 12 | – | – |
| Account T | 26 | 100% | 0% | 0% | 0% | 0% | 40% of 10 | – | – |
| Account U | 13 | 0% | 100% | 0% | 0% | 0% | 0% of 1 | – | – |

### Mean actual rating by shown band, rated films (stored score; n in brackets)

| Account | 90%+ | 78–89 | 65–77 | <65 |
|---|---|---|---|---|
| Owner | 4.25 (308) | 3.83 (257) | 3.46 (207) | 2.95 (309) |
| Account A | 4.47 (230) | 3.92 (216) | 3.54 (92) | 2.38 (337) |
| Account B | 4.32 (191) | 3.86 (118) | 3.53 (95) | 2.89 (161) |
| Owner's mom | 4.11 (135) | 3.88 (120) | 3.58 (61) | 2.92 (110) |
| Account C | 4.17 (131) | 3.90 (131) | 3.59 (60) | 3.07 (72) |
| Account D | 4.46 (104) | 4.09 (84) | 3.74 (44) | 2.89 (97) |
| Account E | 4.28 (61) | 3.96 (85) | 3.78 (58) | 2.94 (88) |
| Account F | 4.35 (73) | 3.95 (58) | 3.46 (25) | 2.61 (94) |
| Account G | 4.40 (41) | 4.10 (54) | 3.98 (43) | 3.59 (96) |
| Account H | 4.65 (55) | 3.90 (29) | 3.69 (21) | 2.65 (120) |
| Account I | 4.30 (61) | 4.01 (34) | 3.73 (11) | 2.96 (36) |
| Account J | 4.53 (31) | 4.05 (29) | 3.71 (14) | 2.96 (52) |
| Account K | 4.64 (37) | 4.56 (40) | 4.47 (16) | 3.46 (12) |
| Account L | 4.48 (26) | 4.08 (43) | 3.57 (7) | 3.22 (18) |
| Account M | 4.17 (18) | 3.73 (15) | 3.50 (15) | 2.92 (42) |
| Account N | 4.53 (18) | 4.15 (17) | 3.95 (10) | 2.93 (37) |
| Account O | 4.30 (20) | 4.22 (18) | 3.77 (15) | 3.28 (18) |
| Account P | 4.54 (35) | 4.09 (17) | 3.50 (1) | – |
| Account Q | 3.50 (1) | 4.45 (11) | 4.19 (16) | 3.50 (6) |
| Account R | 4.40 (5) | 4.22 (9) | 3.68 (11) | 3.06 (8) |
| Account S | 4.75 (4) | 4.30 (15) | 4.56 (9) | 2.62 (4) |
| Account T | 3.40 (10) | 4.33 (3) | 4.33 (3) | 4.50 (10) |
| Account U | – | 4.29 (7) | – | 4.58 (6) |

### The same, on held-out numbers

| Account (held-out rows) | 90%+ | 78–89 | 65–77 | <65 |
|---|---|---|---|---|
| Owner | 4.30 (86) | 3.91 (348) | 3.67 (256) | 3.20 (390) |
| Owner's mom | 4.02 (85) | 3.79 (115) | 3.61 (77) | 3.35 (141) |
| Account C | 4.22 (72) | 3.95 (112) | 3.74 (90) | 3.40 (115) |
| Account D | 4.67 (33) | 4.38 (68) | 4.11 (56) | 3.32 (170) |
| Account H | 4.78 (39) | 4.22 (18) | 3.77 (22) | 2.87 (146) |
| Account J | 4.75 (14) | 4.41 (16) | 4.00 (16) | 3.29 (80) |
| Account Q | – | 4.62 (12) | 4.12 (8) | 3.88 (12) |
| Account R | 4.75 (2) | 4.12 (8) | 3.71 (14) | 3.08 (6) |


**Pooled held-out (2,627 films, 8 accounts):**

| Shown band | Films | Mean rating |
|---|---|---|
| 90%+ | 331 | 4.33★ |
| 78–89 | 697 | 3.98★ |
| 65–77 | 539 | 3.74★ |
| under 65 | 1,060 | 3.23★ |

- 5★ films at 85%+: 72.8% (147 films).
- The bands are in order everywhere except the thin Accounts Q, T and U (13–34 rated). Account T's order is reversed: its 90%+ films average 3.4★ and its under-65 films 4.5★, on 10 films each.

## 3. Are high scores over-represented?

**Yes, at the top of the list.**
- Every account except the 13-rating one shows 90%+ on 96–100% of its top 50 unseen picks. The owner's top 50 run 90–97%.
- That is far over the 15% line. On the time split, only 43% of a person's 10 best-scored later films were rated 4.5★+ (`match-time-split.md`), so 90%+ on all 50 claims more than the model can deliver.
- **Why:** these are each person's top ~1% of a 6,000-film catalog. From 300 ratings the stored scale is not narrowed at all (spread factor 1), so the top 50 sit at stored 80–97, which the curves place at 90–98.

**Not much, inside the 90% band on rated films.** Held-out 90%+ films are rated under 4★ 9% of the time. The accounts above 10%:

| Account | 90%+ held-out films rated under 4★ |
|---|---|
| Owner's mom | 18% (15 of 85) |
| Owner | 13% (11 of 86) |

On stored scores, Account T (26 rated) has 7 of its 10 90%+ films under 4★. It is too thin to trust either way.

### Proposed fix: flatten the top of the display curve

The change: a final remap `y → y` for y ≤ 85, and `85 + (y − 85) × 0.5` above 85. It can live in `shownMatch`'s top points plus the personal curve's 4.5★/5★ anchors, or as one function after `personalShown`. The 90% band then needs a raw 95, and the top shown number becomes 92.

Measured on held-out leave-one-out films (8 accounts, 2,627 films; 147 5★). Top-50 columns are all 23 accounts.

| | Now | Fix (85, ×0.5) | Stronger (85, ×0.4) |
|---|---|---|---|
| Top 50 unseen at 90%+ (mean over accounts) | 95% | **59%** | 26% |
| Accounts over 15% at 90%+ | 22 | 17 | 8 |
| Held-out films shown 90%+ | 331 | 64 | 12 |
| …of those rated 4.5★+ | 50% | **83%** | 100% |
| …of those rated under 4★ | 9.4% | 3.1% | 0% |
| Mean rating in the 90%+ band | 4.33★ | 4.69★ | 4.96★ |
| Mean rating, 78–89 band | 3.98★ | 4.05★ | 4.08★ |
| 5★ films at 85%+ | 72.8% | **72.8%** | 72.8% |
| 5★ films at 90%+ | 57.8% | 25.2% | 7.5% |
| Ranking (Spearman, AUC) | – | unchanged | unchanged |

For the two named accounts, the share of the top 50 at 90%+ falls:

| Account | Now | With the fix |
|---|---|---|
| Owner | 100% | 16% |
| Owner's mom | 100% | 36% |

Accounts whose top 50 are all stored 95+ stay at 100%. That is A, D–L and O. Getting them under 15% would also empty the 90% band for rated films.

**Time split: not rerun.**
- The dump it needs (`.work/time-split/`, about 15 MB of film vectors) is not on this machine. The honest forward log (`match_predictions`, displayed then rated) has only 15 rows.
- Two results on the time split hold by construction anyway. The remap rises everywhere, so per-user and pooled ranking cannot move. It leaves everything at or under 85 alone and keeps over-85 over 85, so **5★ at 85%+ on the time split stays at its last value (49% with the per-person curve).**
- What still needs the time split is the share of 90%+ films rated 4.5★+ after the change. Run `scripts/eval-time-split/run.mjs` with the remap added to `sh3` before shipping.
- It changes shown numbers, so per rule 1068 it needs the owner's go before it ships.

**Recommendation:** ship the ×0.5 version behind a kill switch, after the time-split check above.

## 4. The Prestige (owner)

- `public_profiles.library_json.rated` for `the-prestige` has: rating 5, liked, rewatch, `lc` 3, `rc` 3, one watched date `w` 2026-06-28, and first-logged date `a` 2022-02-06.
- There is **no `wd` (diary dates) field.** None of the owner's films has one.
- There are no `user_ratings` rows for it.
- `letterboxd_imported_at` is 03:44 UTC today, about an hour before `956fdc8d` (04:46, on main), which added `wd`.
- **So: 3 watches are counted but only 1 date is stored.** A fresh Letterboxd re-import now will store all 3 dates. The commit notes that the same-export check counts dates, so the re-import will not be skipped.
