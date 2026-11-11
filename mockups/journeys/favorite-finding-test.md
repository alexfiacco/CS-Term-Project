# Favorite-finding test: the old label lean vs the new chart lift, in matching and in the archetype

2026-11-11. Read-only SQL on production (every number computed inside Postgres, nothing written). Same accounts, folds and method as `dna-measure-backtest.md`. Nothing in the app was changed.

## Short answer

- **Matching: keep the current model (label lean only).** Adding the new chart lift on top changes nothing measurable: precision@10 0.775 → 0.771, precision@25 0.664 → 0.668, favorite AUC 0.759 → 0.759, Spearman 0.530 → 0.530, RMSE 0.5625 → 0.5625. Every difference is inside its 95% bootstrap interval around 0, and the fitted weight on the lift is about 0.04 stars per unit in both halves.
- **Replacing the label lean with the new lift is worse, and that part is beyond noise:** favorite AUC −0.0045 [−0.0077, −0.0010] (worse for 15 of 19), Spearman −0.008 [−0.013, −0.003] (worse for 14 of 19), per-user RMSE +0.006 [+0.003, +0.010], precision@10 −0.039 [−0.082, −0.001]. It lands about where the model with no DNA input at all lands.
- **Archetype: a 50/50 blend of the old strand reads and the new lift barely moves anyone.** The strands only reach the archetype through one rule (an archetype whose own strands all sit at 35 or under, centred on the person, may not be the name or a streak). The blend changes that block list for 4 of 23 members, and the visible name or streaks for 2: one name change (Nihilist → IMAX Idealist) and three streak changes.
- **The changed assignments do not fit favorites better.** Across members with 30+ ratings, the share of their top-third films that carry the name's own strands is 0.480 (old) vs 0.479 (blend); over name plus streaks 0.440 vs 0.435. In the one name change, Nihilist fit that person's favorites better than IMAX Idealist does (0.40 vs 0.38 of favorites; 1.49x vs 1.27x their overall rate), and the one new streak (Comic Relief) fits 8% of their favorites, under their overall rate.

**Recommendation: change nothing.** The match model keeps the label lean and does not take the chart lift (neither added nor swapped in). The archetype keeps its current strand reads; the blend is a wash at best. The new lift stays a display measure for the chart, as rule 1522 already says.

## Data and folds

- 19 accounts with 30+ rated feature films (latest profile per user, `library_json.rated`, joined to `films` on movie, not duplicate): 4,872 ratings. 11 accounts have 100+ ("heavy"), 8 have 30-93 ("thin").
- 5 folds by `hashtext(user:slug) % 5`. For each held-out fold, every personal input is fit on the other four folds only: the label lean's ridge fit and its z-scoring, the chart lift (favorites boundary, strong-film counts, ratios), the taste-neighbour reads, the person's mean rating and crowd mean.
- Favorites (the target) are each person's top third of all their ratings, with the boundary tie block counted in part, exactly as `lovedWeights` does. Random ranking gives precision about 0.33.

## What was compared

All variants share one stand-in for the match model, rebuilt from its main parts as in the earlier backtests (the production fit needs the full per-person logistic with shares; see Caveats):

- **Crowd:** the film's real Letterboxd average minus the person's crowd mean (3.2★ stand-in when there is no real crowd), plus a has-crowd flag.
- **Taste neighbours (production `knn()`):** top-25 neighbours by embedding similarity, weighted sim³, of their rating-minus-crowd residual; the all-positive-similarity version; the loved-film similarity (top 5 of films rated 4★+) and the disliked one (top 3 of 2.5★ and under).
- **(1) current: + label lean.** `labelFit` / `labelLean` from `lib/taste/match-model.mjs` reimplemented in SQL: 19 label dimensions plus 7 yes/no flags, z-scored over the person's training films with a real crowd, ridge 60 against rating − crowd, needs 30 films. Out-of-fold it correlates 0.40 with the held-out rating − crowd.
- **(2) both: current + new chart lift.** `lib/taste/dna-lift.ts` as on origin/main (rule 1522 amended): loved = top third with the partial tie block; strong = strand value at or above the 85th percentile of the 3,000 most-watched labelled films; hit shrunk toward the person's usual rate by 15 films; ratio needs 25+ strong films; most viewers = every labelled film with 3,000+ watches, watch-weighted, favorites = weighted top third by Letterboxd average; shown = (ratio / their mean) / (viewers' ratio / viewers' mean) − 1. A film's lift score = Σ over strands of shown × (film is strong on it). A z-score version (shown × the film's standardized strand value) was also run.
- **(3) new: new chart lift instead of the label lean.**
- References: crowd only, and crowd + neighbours with no DNA input ("base").

Weights: one linear fit predicting rating − the person's training mean, fit on the held-out predictions of folds 0-2 and scored on folds 3-4, then the reverse. Every number below is out of sample. A second fit with "is a favorite" as the target gave the same ordering (below).

Coverage: the label lean exists for 4,746 of 4,872 held-out films. The new lift exists for 12 of 19 accounts (mostly the heavy libraries) and 3,520 films; the 25-strong-film minimum rules out most thin libraries, where it reads 0.

## A) Matching: per-user means (19 accounts)

| model | precision@10 | precision@25 | recall in top 10% (max 0.30) | favorite AUC | Spearman | RMSE pooled | RMSE heavy / thin |
|---|---|---|---|---|---|---|---|
| crowd only | 0.712 | 0.613 | 0.225 | 0.739 | 0.487 | 0.6421 | 0.6406 / 0.6603 |
| crowd + neighbours (no DNA) | 0.749 | 0.659 | 0.241 | 0.754 | 0.520 | 0.5713 | 0.5633 / 0.6594 |
| **(1) current: + label lean** | **0.775** | 0.664 | **0.242** | **0.759** | **0.530** | **0.5625** | 0.5542 / 0.6534 |
| (2) current + new lift | 0.771 | **0.668** | 0.241 | 0.759 | 0.530 | 0.5625 | 0.5542 / 0.6536 |
| (2z) current + new lift (z) | 0.778 | 0.663 | 0.241 | 0.759 | 0.530 | 0.5626 | 0.5543 / 0.6533 |
| (3) new lift instead | 0.736 | 0.658 | 0.242 | 0.755 | 0.522 | 0.5706 | 0.5624 / 0.6596 |
| (3z) new lift (z) instead | 0.739 | 0.662 | 0.241 | 0.754 | 0.521 | 0.5712 | 0.5632 / 0.6592 |

Heavy libraries only (11 accounts), precision@10: crowd 0.830, no DNA 0.894, current 0.925, current + new 0.916, new instead 0.873.

### Against the current model: mean per-user difference, 95% bootstrap CI over users (4,000 resamples), users better / worse

| | precision@10 | precision@25 | recall top 10% | favorite AUC | Spearman | per-user RMSE |
|---|---|---|---|---|---|---|
| (2) + new lift | −0.004 [−0.016, +0.004] 1/1 | +0.004 [−0.002, +0.011] 3/1 | −0.001 [−0.002, +0.000] 1/3 | +0.0000 [−0.0006, +0.0006] 9/7 | +0.0002 [−0.0013, +0.0015] 9/7 | +0.0001 [−0.0001, +0.0003] 7/12 |
| (2z) + new lift (z) | +0.002 [−0.013, +0.017] 2/1 | −0.001 [−0.004, 0.000] 0/1 | −0.001 [−0.002, +0.000] 1/4 | −0.0004 [−0.0010, +0.0001] 4/9 | −0.0001 [−0.0013, +0.0009] 8/9 | −0.0001 [−0.0003, +0.0001] 10/9 |
| (3) new instead | **−0.039 [−0.082, −0.001]** 3/9 | −0.007 [−0.018, +0.006] 6/10 | −0.000 [−0.013, +0.014] 5/7 | **−0.0045 [−0.0077, −0.0010]** 4/15 | **−0.0082 [−0.0133, −0.0031]** 5/14 | **+0.0062 [+0.0025, +0.0101]** 5/13 (worse) |
| no DNA at all | −0.027 [−0.059, +0.005] 3/8 | −0.005 [−0.018, +0.009] 6/9 | −0.001 [−0.014, +0.013] 4/7 | −0.0057 [−0.0094, −0.0016] 4/15 | −0.0096 [−0.0146, −0.0042] 3/16 | +0.0062 [+0.0023, +0.0102] 6/13 (worse) |

("better / worse" counts users whose value moved at all; on precision most users do not move, because their top 10 is the same films.)

Read:
- **Adding the lift is a tie.** No metric moves by more than 0.004 and every interval straddles 0. On the 11 heavy libraries alone, where the lift exists for everyone, it is still a tie (precision@10 −0.009 [−0.027, 0.000], AUC +0.0001 [−0.0001, +0.0003]).
- **Swapping is a real loss.** The label lean is worth +0.006 AUC and +0.010 Spearman over no DNA input, beyond noise (15-16 of 19 users better). The lift alone is worth +0.001 AUC [+0.0001, +0.0025] over no DNA input and nothing on precision. It recovers almost none of what the lean gives.
- **Why:** the same reason as the earlier backtest. The lift is built against the person's own usual and most viewers' favorites, so most of what it knows is "acclaimed films with strong strands", which the crowd term already carries. The lean is fit against the crowd, so it carries what the crowd cannot.

Fitted weights (stars per unit, half A / half B; the halves agree, so the fits are stable): label lean 0.46 / 0.53 in the current model, 0.45 / 0.52 with the lift beside it; the lift 0.047 / 0.044 beside the lean, 0.15 / 0.14 on its own.

Favorite-as-target fit (sensitivity): current precision@10 0.775, + new 0.771, new instead 0.751; AUC 0.768 / 0.768 / 0.768; recall top 10% 0.249 / 0.249 / 0.240 (new instead worse for 10 of 19, CI just touching 0). Same conclusion.

## B) Archetype

### How strands reach the archetype today

The name and streaks come from the one taste model (`lib/taste/unified/report.ts` → `readPerson` in `model.ts`; called by `unifiedIdentity` in `apply.ts`, which `profile.ts` uses for every unified read). The name is the best archetype of the strongest family of feel (share of what they love × √lift), the streaks are the best of the next families holding 15%+ of it. Inside a family, the pick is by share × `dnaFit` (a 24-dimension pull per archetype direction, not the strands).

The nine Film DNA strands (`newDna`: the label DNA blended with the against-the-crowd pull, all pull from 100 rated) enter in one place: **`dnaBlocked`**. Each strand is centred on the person's own average (50 + score − their mean); an archetype whose own strands (`STRANDS`, e.g. Nihilist = Complexity + Slow burn, IMAX Idealist = Spectacle) all sit at 35 or under may not be the name or a streak. They also pick which films fill the five posters (`topStrands`, 70+), which does not change names.

### The variant

For every member with a new lift (12 of 23, the ones with 25+ strong films on some strands), each strand input = 50/50 of the old strand read and the new lift, after standardizing:
- The two are on different scales (old: 0-100, mean 46.5, SD 19.1 across members × strands; new: signed %, mean +2.8, SD 22.9) and agree only partly (correlation 0.52 over 85 member-strands). Each was z-scored pooled across members and strands (pooled, not per strand, so a strand that really runs high for someone stays high), averaged, and the average rescaled to SD 1. Without that rescale the blend's spread shrinks by about 10% and fewer strands would cross 35 just because of the averaging, not the signal. The result is mapped back onto the old scale (46.5 + 19.1 × z), so the existing 35 and 70 thresholds keep their meaning.
- Equal weights because neither measure has shown it is the better guide to what someone loves inside an archetype read: the old one wins on "above the crowd", the new one on raw favorites (`dna-measure-backtest.md`). Strands with no new value (under 25 strong films) keep the old read.

The rule was then rerun with the members' stored archetype shares and lifts (`result_json.archetype.scores`), stored strands (`tasteDnaV2`) and the fact gates (Globetrotter, Old Soul, Animation Devotee, Eyewitness, Overthinker) recomputed from their 4.5★+ feature films. Inside a family the stored pick stands in for `dnaFit`, which is not stored. With the old strands, this reproduces the stored name and streaks for 20 of 23 members (the 3 misses are stored reads made before their latest strands, and a within-family tie). The changes below are old vs blend on the same replay, so they isolate the strand change.

### What would change (anonymized, 23 members)

| | count |
|---|---|
| members whose strand block list changes | 4 (libraries of 94 to 877 ratings) |
| members whose shown name or streaks change | 2 |
| name changes | 1: Nihilist → IMAX Idealist |
| streak changes | 3: Hardboiled → Nihilist (1); IMAX Idealist → Nihilist (1, the same member as the name change, the two swap); none → Comic Relief (1, same member) |
| block lifted with no visible change | 2: Midnight Cultist unblocked (1), Comic Relief unblocked (1) |
| new blocks | 0 |

Every change is an archetype being unblocked: the lift reads Complexity, Slow burn, Intensity, Wonder or Comedy as less low for these people than the old pull does, so fewer archetypes are ruled out.

### Does the new assignment fit their favorites better?

Fit = the share of the person's top third (partial tie block) whose film is strong (85th percentile cut) on at least one of the archetype's own strands; "lift" = that over the same share among all their rated labelled films.

| | old | blend |
|---|---|---|
| name, mean share of favorites fitting (members with 30+ ratings) | 0.480 | 0.479 |
| name, mean lift over their overall rate | 1.34x | 1.32x |
| name + streaks, mean share fitting | 0.440 | 0.435 |

The changed slots, one by one:
- Name, Nihilist → IMAX Idealist: 0.40 → 0.38 of favorites fit; 1.49x → 1.27x their overall rate. Worse.
- Streak, Hardboiled → Nihilist: 0.36 → 0.39 fit; 1.30x → 1.27x. A wash.
- New streak, Comic Relief: 0.08 fit, 0.81x their overall rate (fewer of their favorites are comedies than their films overall). Worse.

So the blend does not make the archetype match favorites better; where it changes anything, it is neutral or slightly worse.

## Caveats

- 19 accounts for matching (two libraries hold 40% of the ratings) and 23 members for the archetype. The matching tie and the archetype counts are small-sample findings; the swap loss in matching is the robust one (intervals clear of 0, 14-15 of 19 users).
- The match model is a stand-in, as in the earlier backtests: one pooled linear fit over the main parts, not the per-person logistic with shrinkage toward the population and the model 9 share caps. Genre, director, decade and language affinities are left out of every variant equally. The label lean itself is the production formula.
- The new lift is null for 7 of 19 matching accounts (the 25-strong-film minimum), so variants (2) and (3) can only help heavy libraries. On those alone the result is the same.
- The archetype replay uses stored shares (rounded to two places) and stands in for `dnaFit` with the stored pick; 3 of 23 stored reads do not reproduce exactly. A full rerun of `unifiedReport` with the blended strands would settle the 2 changed members, but would not change the conclusion: the strands only touch the block rule, and the blend lifts blocks rather than placing better-fitting archetypes.
- The fit measure uses each archetype's own strands, which is the same lens the block rule uses. It cannot see archetype facts that are not strands (true stories, non-English, animation).
