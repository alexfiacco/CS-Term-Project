# Match accuracy on the owner's own account

2026-11-12. Read-only. Profile `467a3dgd`. Model as shipped: montage `9211453c` (crowd cap 30%, per-person curve on).

## Short answer

- **The model ranks the owner's films a little better than it ranks the average account.** On their later films, Spearman is 0.47 (19-account average 0.43). On random folds it is 0.62 (average 0.51).
- **The Letterboxd average alone does about as well, and on some measures better.** On later films it ranks slightly worse overall (0.43) but finds the 4.5★+ films better (AUC 0.90 against 0.85). On random folds it wins on every ranking measure (0.68 against 0.62). The owner's taste follows the crowd closely, and the cap holds the crowd to 30% of the score.
- **Low scores are safe.** Of 301 films shown under 65%, the owner rated 2 at 4.5★+ (1%). On later films, 0 of 40.
- **High scores are good but not sharp.** Of films shown 90%+, they rated 88% at 4★+ and 53% at 4.5★+ (random folds). On later films, 5 of 7 and 3 of 7.
- **Top cause of misses:** the film's nearest neighbours in their library outvote a strong crowd rating. No miss is due to missing labels: 1,078 of 1,080 films have them.

## How it was run

- The harness and data dump from `match-time-split.md`: production code (`lib/taste/match-model.mjs`, `personal-curve.mjs`) at `9211453c`, run offline on today's read-only dump. No new database read was needed. The all-account figures reproduce that report (Spearman 0.432, AUC 0.743, 5★ at 85%+ 56%).
- **The account:** 1,080 rated films after the model's filters, all dated. Stars: 40 at 5★, 104 at 4.5★, 331 at 4★, 352 at 3.5★, 177 at 3★, 76 lower.
- **Time split:** trained on the 864 films rated before 2024-07-09, tested on the 216 after. Those 216 hold only 3 five-star films and 11 at 4.5★+ (5%), against 13% across the whole library.
- **Random 5-fold:** every film scored once by a model that did not see it. All 1,080 films.
- **Shown %** is what the app draws: stored score, shared curve, then the owner's own curve fitted on training films only.
- **19-account average:** the 19 accounts in the time split. Spearman, AUC and precision are means over accounts. Band and share rows pool all films.
- **Letterboxd-average-only baseline:** films ranked by their Letterboxd average. To give it shown numbers, the average is mapped to the shown scale by the owner's own stars on training films (the same star scale the personal curve uses).
- **Precision@10 / @25:** of the 10 or 25 highest-scored held-out films, the share rated 4.5★+ (or 4★+).

## Time split (the owner's last 216 films)

| | Owner, model | 19-account average | Owner, Letterboxd average only |
|---|---|---|---|
| Spearman | 0.471 | 0.432 | 0.426 |
| AUC for 4.5★+ | 0.849 | 0.743 | 0.904 |
| Precision@10, 4.5★+ / 4★+ | 30% / 70% | 47% / 78% | 30% / 60% |
| Precision@25, 4.5★+ / 4★+ | 20% / 68% | 36% / 78% (8 accounts) | 20% / 76% |
| Held-out 5★ shown at 85%+ | 1 of 3 | 56% (44 of 79) | 3 of 3 |
| Held-out 4.5★+ shown at 78%+ | 91% (10 of 11) | 76% (138 of 181) | 100% (11 of 11) |
| Shown 90%+: rated 4★+ | 71% (5 of 7) | 87% (84 of 97) | 58% (7 of 12) |
| Shown 90%+: rated 4.5★+ | 43% (3 of 7) | 56% (54 of 97) | 33% (4 of 12) |
| Shown under 65%: rated 4.5★+ | 0% (0 of 40) | 6% (20 of 326) | 0% (0 of 32) |

Mean actual rating by shown band (films / mean ★):

| Band | Owner, model | 19 accounts pooled | Owner, Letterboxd average only |
|---|---|---|---|
| 90+ | 7 / 4.00 | 97 / 4.31 | 12 / 4.00 |
| 78–89 | 69 / 3.83 | 328 / 3.93 | 74 / 3.77 |
| 65–77 | 100 / 3.48 | 308 / 3.59 | 98 / 3.45 |
| 40–64 | 38 / 3.29 | 258 / 3.26 | 30 / 3.37 |
| Under 40 | 2 / 2.50 | 68 / 2.64 | 2 / 2.50 |

- Bands are in order. The model's bands are slightly better separated than the baseline's.
- The owner's precision looks low next to the average only because their later films hold few loved ones: 5% are 4.5★+ (19 accounts: 17%). 30% in the top 10 is six times their base rate.
- The 19-account Letterboxd-only average is Spearman 0.398, AUC 0.770.

## Random 5-fold (all 1,080 films)

| | Owner, model | 19-account average | Owner, Letterboxd average only |
|---|---|---|---|
| Spearman | 0.622 | 0.511 | 0.679 |
| AUC for 4.5★+ | 0.827 | 0.762 | 0.884 |
| Precision@10, 4.5★+ / 4★+ | 90% / 100% | 67% / 88% | 100% / 100% |
| Precision@25, 4.5★+ / 4★+ | 76% / 92% | 61% / 88% (17 accounts) | 84% / 92% |
| Held-out 5★ shown at 85%+ | 75% (30 of 40) | 68% (299 of 437) | 93% (37 of 40) |
| Held-out 4.5★+ shown at 78%+ | 85% (122 of 144) | 76% (847 of 1,111) | 92% (133 of 144) |
| Shown 90%+: rated 4★+ | 88% (99 of 113) | 89% (657 of 737) | 86% (88 of 102) |
| Shown 90%+: rated 4.5★+ | 53% (60 of 113) | 57% (423 of 737) | 55% (56 of 102) |
| Shown under 65%: rated 4.5★+ | 1% (2 of 301) | 5% (83 of 1,813) | 0% (0 of 307) |

| Band | Owner, model | 19 accounts pooled | Owner, Letterboxd average only |
|---|---|---|---|
| 90+ | 113 / 4.31 | 737 / 4.37 | 102 / 4.32 |
| 78–89 | 367 / 3.85 | 1,556 / 3.96 | 328 / 3.95 |
| 65–77 | 299 / 3.65 | 1,288 / 3.71 | 343 / 3.63 |
| 40–64 | 241 / 3.25 | 1,288 / 3.31 | 255 / 3.23 |
| Under 40 | 60 / 2.38 | 525 / 2.53 | 52 / 2.21 |

- The 19-account Letterboxd-only average is Spearman 0.472, AUC 0.761. So the model beats the crowd for the average account, and loses to it for the owner.
- The owner ranks 8th of 19 on model Spearman, and 4th of 19 on how well the Letterboxd average alone predicts them.

## The 10 biggest misses each way

From the random folds, so every film in the library is eligible. "Crowd-only" is what the baseline would have shown.

### Loved, but scored low

| Film | Rated | Shown | Crowd-only | Likely why |
|---|---|---|---|---|
| Boyhood (2014) | 4.5★ | 56 | 74 | Nearest films by text are poor guides: That's My Boy (2★), The Tree of Life (2★). Slow-drama label lean is negative. |
| Superbad (2007) | 4.5★ | 63 | 77 | Sits among broad comedies they rated low (Step Brothers 2.5★, That's My Boy 2★). Comedy lean is negative. |
| Barry Lyndon (1975) | 4.5★ | 66 | 95 | Sparse neighbours (best similarity 0.49); other Kubricks at 3.5★. Label lean strongly against long, slow period films. |
| Black Swan (2010) | 4.5★ | 67 | 86 | Neighbours are a mixed bag (Frances Ha, The Whale, Tangled at 3.5★). Label lean against dark, intense drama. |
| Moonlight (2016) | 4.5★ | 68 | 87 | Quiet-drama label lean is negative; neighbours average 4★. Crowd says 4.19. |
| The Big Lebowski (1998) | 4.5★ | 68 | 84 | Label lean strongly negative (loose, plotless comedy); other Coens at 3.5–4★. |
| The Exorcist (1973) | 4.5★ | 68 | 78 | Horror runs below their average (3.49★), and Carrie and The Witch sit at 3.5★. |
| Shrek 2 (2004) | 4.5★ | 69 | 85 | Franchise drag: Shrek the Third (2.5★) is its closest film. Family animation sequels rated low. |
| Pan's Labyrinth (2006) | 4.5★ | 69 | 86 | Nearest are del Toro and fantasy films at 3–3.5★ (The Shape of Water, Spirited Away). |
| Shrek (2001) | 5★ | 70 | 85 | Same franchise drag as Shrek 2. |

Across all 24 loved films shown under 78%: mean Letterboxd average 4.07, and the crowd-only number would have been higher for every one in the table. None is obscure (median 1.7 million watches) and all have labels.

### Scored high, but rated 3★ or less

| Film | Rated | Shown | Crowd-only | Likely why |
|---|---|---|---|---|
| How to Train Your Dragon (2025) | 3★ | 94 | 75 | Remake of a 5★ film. Similarity 0.80 to the original; the model cannot tell a remake from a film like it. Also missed on the time split (92). |
| Spirited Away (2001) | 3★ | 89 | 94 | Crowd 4.43 and liked Ghibli neighbours (4★). A personal exception nothing in the data flags. |
| The Game (1997) | 2.5★ | 88 | 74 | Director halo: sits by Se7en (5★), Zodiac, Gone Girl (4.5★). |
| Dog Day Afternoon (1975) | 3★ | 88 | 91 | Crowd 4.31 plus a strong 1970s crime-drama lean. Crowd-only misses it too. |
| The Abyss (1989) | 3★ | 87 | 71 | Director and genre halo (Aliens 4★, The Thing 4.5★). Film DNA lean is the largest push. |
| The Red Shoes (1948) | 3★ | 86 | 94 | Crowd 4.41 carries it; neighbours are sparse (best 0.52). Crowd-only misses it worse. |
| Wall Street (1987) | 3★ | 85 | 66 | Lookalike of a loved film (The Wolf of Wall Street 4.5★). Crowd is a modest 3.62. Also missed on the time split (84). |
| Amélie (2001) | 3★ | 84 | 87 | Crowd 4.20 plus liked romance neighbours. A personal exception. |
| The Wicker Man (1973) | 3★ | 83 | 80 | Horror, which the model over-scores for them, with The Exorcist (4.5★) nearby. |
| Snowpiercer (2013) | 3★ | 82 | 70 | Sits by Parasite and Interstellar (5★). Film DNA lean is the largest push; crowd is 3.67. |

On the time split the same pattern shows: Insomnia (Nolan, shown 80), Hard Eight (P. T. Anderson, 82), Face/Off (82) and Bugonia (Lanthimos, 83), all rated 3★.

## Why the misses happen

1. **Personal signals outvote a strong crowd rating.** For this account the model under-scores acclaimed films and over-scores middling ones. Films with a Letterboxd average of 4.0+ are rated 0.15★ above what their shown number implies (357 films); films at 3.2–3.6 are rated 0.11★ below (214 films). Every loved-but-low film has a high crowd rating that the 30% cap could not turn into a high score.
2. **"Similar" means similar on paper, not similar in quality.** The nearest neighbours are sequels, remakes, the same director, or films with a shared word in the title. A weak sequel drags down a loved original (Shrek); a loved original lifts a weak remake or a lesser film by the same director (How to Train Your Dragon, The Game, Insomnia, Wall Street).
3. **The Film DNA lean overreaches on middling genre films.** In the 26 over-scored films the DNA group pushes twice as hard as on the average film. It is strongest on 1980s and 1990s crime, thriller and action films with a crowd rating near 3.6–3.8. 1980s films are rated 0.11★ below what they were shown. Horror and thrillers run 0.07★ below.

What it is not:

- **Missing labels:** 2 of 1,080 films lack them, and neither is a miss.
- **Sparse neighbours:** only 29 films have no neighbour above 0.5 similarity. Barry Lyndon and The Red Shoes are the two in the tables.
- **Obscure films:** films under 300,000 watches are slightly over-scored (0.09★), but few are in the library (147).

Some of this is rating noise. The owner uses a narrow range: 63% of ratings are 3.5★ or 4★, so a 3★ against a 3.5★ can be mood on the night.

## Caveats

- **Small numbers on the time split.** 216 films, 11 at 4.5★+, 3 at 5★, 7 shown at 90%+. "1 of 3" and "5 of 7" are not rates to act on.
- **Random folds flatter the model.** The owner's Spearman falls from 0.62 to 0.47 on later films, the same drop seen across accounts.
- **The owner is one account.** That the Letterboxd average beats the model here does not hold on average: across the 19 accounts the model is ahead on Spearman on both splits.
- **The baseline's shown numbers are a construction.** Its ranking figures (Spearman, AUC, precision) do not depend on it; its band and share figures do.
- **Offline rerun, not the live rows.** The numbers come from the production code on a dump, with the reference scale thinned to every third film. They were not checked against what the app shows today.
- **The "why" column is a reading of each film's neighbours and feature pushes, not a test.** No fix was tried here.
