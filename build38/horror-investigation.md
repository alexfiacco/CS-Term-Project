# Why a horror fan's picks are animation: account `dbd4371e`

Date: 2026-11-14. Read-only SELECTs on the Montage project. No database writes, no code change. Accounts are named by user-id prefix only.

## 1. Short answer

- **It is a real model defect, not their taste.** It is not a hidden genre penalty, a mis-labelled genre, the Less of list, calibration caps, the starter set, or the crowd prior. It comes from **three of the person's own similarity signals in match model 9**. Each was fitted on a library where nearly every "not liked" rating is a horror film:
  - `dislikedSim`: how close a film is to the films they disliked;
  - `knnBase`: how far above the crowd they rate films like it, with a negative weight;
  - `genreAff`: how often they like films sharing its genres.
- **Those three explain about 95% of the gap.**
  - On 80 well-known unseen films (the 40 most-watched horror and the 40 most-watched animated), animated films get **+2.67 log-odds** over horror from the terms I could recompute.
  - The breakdown of that gap: `dislikedSim` **+1.35**, `knnBase` **+0.76**, `genreAff` **+0.67**, crowd +0.13, and `lovedSim` −0.24, which favours horror but carries a small weight.
  - These terms correlate **r = 0.96** with the stored scores for those 80 films (horror mean 35.6, animation mean 73.9).
- **It is systematic.** A second horror fan, `1e98e112`, shows the same thing:
  - Library: 63% horror. Stored top 50: 4% horror.
  - All 9 of their non-likes and all 3 of their dislikes are horror.
  - Their horror stored mean is 40.9, against 46.5 for animation.
- **The wider pattern.** In 11 of 16 accounts with a strong genre, a genre they rate above the crowd (and at 25%+ of their library) gets under half its library share in their top 50. The detail is in section 4.
- **Not fixed here.**
  - The defect is clear. The fix is not one obvious line: two of the three terms are fitted weights.
  - Any change to match model 9 must pass the time-split eval (`scripts/eval-time-split`), and that needs database credentials this session does not have.
  - The owner's rule is never to call a model change better without that comparison. So nothing went to `b41-horror`, and no worktree was made.
  - Section 5 gives the candidate fixes, their expected size on this account, and the test to run. Every fix needs a full rescore (nightly full pass), which is a database write I did not do.

## 2. The account

| | |
|---|---|
| Rated films the model reads | 234 (236 in the library; 2 are not films or have no embedding) |
| Mean rating | 3.93★; median 4★ |
| Share rated 3.5★ or more ("liked", the model's target) | **88.5%** |
| Archetype | Midnight Cultist (2nd: IMAX Idealist). Animation Devotee lift is 0.28 |
| Model | 9, fitted 2026-11-12 (`user_match_calibration`) |

Their library by genre (a film counts once for each of its genres):

| Genre | Films | Mean ★ | Liked share | Letterboxd mean | Their rating vs Letterboxd |
|---|---|---|---|---|---|
| Horror | 116 (49%) | 3.75 | 0.79 | 3.09 | **+0.68** |
| Thriller | 77 | 3.95 | 0.84 | 3.37 | +0.58 |
| Action | 62 | 4.15 | 0.97 | 3.43 | +0.73 |
| Animation | 10 (4%) | 4.10 | 1.00 | 3.80 | +0.30 |
| All | 236 | 3.93 | 0.89 | 3.38 | +0.55 |

**Where the not-liked ratings are.** Of their 27 ratings under 3.5★, **23 are horror**. Most are 3★ horror films the crowd rates 2.0-3.3, so the person rated them at or above the crowd. Their 4 dislikes (2.5★ or less) are all horror the crowd also panned, which is how far above or below the crowd they rated each:

| Their rating | Crowd | Their rating vs crowd |
|---|---|---|
| 1★ | 1.09 | −0.09 |
| 2★ | 2.04 | −0.04 |
| 2★ | 2.41 | −0.41 |
| 2★ | no crowd | n/a |

Two readings of the same data:

- **In stars, horror is genuinely their lowest genre.** It is 3.75 against 3.93 overall, and its liked share is 79% against 98% for everything else.
- **Against the crowd, horror is their strongest genre.** They rate it +0.68 above Letterboxd, against +0.30 for animation.

The model's target is the first reading, absolute "liked" (rule: `V3_LIKE_AT` 3.5). That is where the trouble starts.

## 3. Walking the score (match model 9, `lib/taste/match-model.mjs`)

**Method.** Model 9 scores a film as a logistic sum of 13 features, each normalised by the population's mean and SD and clamped to the person's own range. I recomputed five of them in SQL from the real embeddings (pgvector inner products against their 234 rated films):

- the neighbour-centred crowd term;
- `knnBase`;
- `lovedSim`;
- `dislikedSim`;
- the neighbour `genreAff`.

I read the person's stored weights (`user_match_calibration.weights`) and the population's (`ai_cache` `match-model:v7n9sfd:population`). Left out: the director, decade and language leans, `labelLean`, and the dock. The five terms alone correlate 0.96 with the stored scores, so the left-out terms do not drive the gap.

**Weights.** Each is per SD of the feature; the population's are in brackets:

| Feature | This person | Population |
|---|---|---|
| crowd | 0.74 | 1.25 |
| knnLocal | **0.01** | 0.31 |
| knnBase | **−1.19** | −0.68 |
| lovedSim | 0.22 | 0.46 |
| dislikedSim | **−1.01** | −0.65 |
| genreAff | 0.46 | 0.40 |
| labelLean | 0.59 | 0.65 |

**Mean contribution to the log-odds,** over the 40 most-watched unseen horror films and the 40 most-watched unseen animated films (each 50k+ logs):

| Term | Horror | Animation | Animation's edge |
|---|---|---|---|
| dislikedSim | −0.11 | +1.24 | **+1.35** |
| knnBase | +0.08 | +0.84 | **+0.76** |
| genreAff | −0.40 | +0.27 | **+0.67** |
| crowd | +0.74 | +0.87 | +0.13 |
| lovedSim | +0.13 | −0.11 | −0.24 |
| **Sum** | 0.44 | 3.11 | **+2.67** |
| Stored score (mean) | 35.6 | 73.9 | |

### Examples

| Film | Stored | crowd | knnBase | dislikedSim | genreAff | lovedSim |
|---|---|---|---|---|---|---|
| The Thing | 74 | +1.53 | −0.36 | +0.66 | +0.19 | +0.33 |
| Psycho | 59 | +1.70 | +0.51 | +0.31 | −0.33 | +0.18 |
| Scream | 55 | +1.58 | +0.18 | +0.16 | −0.57 | +0.24 |
| Sinners | 31 | +1.67 | −0.03 | −0.38 | −0.29 | +0.18 |
| Ratatouille | 93 | +0.95 | +1.53 | +1.85 | +0.29 | −0.11 |
| Toy Story | 90 | +0.80 | +1.24 | +1.58 | +0.37 | +0.06 |
| Spirited Away | 89 | +1.51 | +1.20 | +1.24 | +0.24 | −0.14 |

Scream and Sinners get as much from the crowd as Spirited Away. They lose on the three similarity terms.

### Why each term points the wrong way

1. **`dislikedSim`: "far from what you disliked" acts as a reward for being unlike the whole library.**
   - The feature is the mean similarity to the 3 nearest disliked films. All 4 of their dislikes are crowd-panned horror, so every horror film sits near one.
   - An animated film, a concert film or a Winnie-the-Pooh short sits far from them, and gets up to +2 log-odds.
   - The mirror feature `lovedSim` cannot balance it. With 142 loved films, almost every film like their library is close to something loved, so `lovedSim` barely separates liked from not-liked inside the library, and the fit gave it a small weight (0.22).
   - The result is lopsided: being far from the library earns a large bonus and costs a small penalty. That is why the top of the stored list includes music documentaries, My Little Pony and Pooh shorts, none of which resemble anything they rated.
2. **`knnBase` is negative for every account (−0.33 to −1.52), and here it stands alone.**
   - The feature is the similarity-weighted mean of how far above the crowd they rated each rated film.
   - In the population it pairs with a positive `knnLocal` as a contrast. For this person `knnLocal` fitted to 0.01, so only the negative part acts.
   - Horror neighbourhoods are where they beat the crowd most (+0.68), so a horror film is **pushed down for being in the area where they outrate the crowd**. That is the taste signal read backwards.
   - Why it fits that way: the target is absolute "liked", and their high-residual films are low-crowd horror rated 3★. Those count as "not liked" even though they beat the crowd.
3. **`genreAff`: horror's liked share is 0.79 against a base of 0.885, and animation's is 10 of 10.**
   - That is true in stars.
   - Animation sits at the top of the person's clamp range (0.099) on the strength of 10 films, and probably a selected 10 at that (A Goofy Movie, WALL·E, Onward, Pinocchio, Roger Rabbit).

**The common cause.** The model's target is absolute stars (3.5★ or more), and a horror fan's misses are in horror, because that is where they watch the films the crowd rates low. Model 9 centres the crowd term on the crowd average of the film's nearest rated films (`crowdCentre`), and the crowd group is capped at 30% of the score's movement (`V9_SHARE_CROWD`). Together these stop the crowd term from soaking up "horror films are rated lower by everyone". The fit puts the blame on the similarity terms instead, and those read as "this person dislikes horror".

### Ruled out

| Candidate | Finding |
|---|---|
| Hidden genre penalty, Less of, soft tells | None in the stored score. Score writing does not read them; they act on surfaces. |
| Mis-labelled genre | Horror films carry Horror; animated films carry Animation. |
| Crowd prior | Its share of the gap is +0.13 of 2.67. In a crowd-only top 500, horror is 2.8% (pool 15.8%) and animation 13.2%. Their top 50 is **0% horror and 64% animation**, so the personal side made both worse than the crowd alone would. |
| Calibration caps | Not built (`calibration-test.md`). |
| Starter set | Only one in-app rating; the library is imported. |
| Stale vector | Rescored 2026-11-12 on model 9. |
| `labelLean` | Not recomputed (it needs the label ridge fit). Its target is rating minus crowd, where horror is their strongest genre, so it most likely favours horror. The 0.96 correlation without it says it is not what decides the order. |

## 4. Is it systematic?

**Accounts.** 23 accounts have a stored score vector; 18 of them have 50 or more rated films (library_json plus in-app ratings).

**Top-50 pool.** Each account's stored top 50 over films only:

- not a duplicate;
- 1,000+ Letterboxd logs;
- runtime 40 minutes or more;
- no Documentary or TV Movie;
- rated films removed.

A genre counts as **under-represented** when its share of the top 50 is under half its share of the library.

**Definition A (as briefed): 25%+ of rated films, rated above their own mean in stars.**

- 22 account-genre pairs in 18 accounts. 15 of the 22 are Drama, and Drama is over-represented in every one of them (Drama is 79% of the crowd's top 500).
- Of the 7 non-Drama pairs, **4 are under-represented**, in 3 accounts:

| Account | Genre | Library | Top 50 |
|---|---|---|---|
| `d14f1626` | Crime | 27% | 6% |
| `d73ace86` | Adventure | 35% | 4% |
| `dbd4371e` | Thriller | 33% | 0% |
| `dbd4371e` | Action | 27% | 6% |

- The other three non-Drama pairs: `da7f90da` Crime 0.63×, `75afae0b` Thriller 1.0×, `032e0fd5` Romance 2.0×.
- **This definition misses both horror fans**, because each rates horror *below* their own mean in stars (3.75 vs 3.93, and 3.78 vs 3.91). That is the defect itself: it only shows against the crowd.

**Definition B: 25%+ of rated films, rated further above the crowd than their own average.**

- 32 pairs in 16 accounts, 22 of them not Drama.
- **14 of the 22 non-Drama pairs are under-represented, in 11 of the 16 accounts:**

| Account | Genre | Library | Top 50 |
|---|---|---|---|
| `dbd4371e` | Horror | 50% | **0%** |
| `dbd4371e` | Thriller | 33% | 0% |
| `dbd4371e` | Action | 27% | 6% |
| `1e98e112` | Horror | 63% | **4%** |
| `da7f90da` | Comedy | 51% | 4% |
| `dded73de` | Comedy | 38% | 4% |
| `032e0fd5` | Comedy | 52% | 24% |
| `d561961e` | Adventure | 40% | 4% |
| `d73ace86` | Adventure | 35% | 4% |
| `d73ace86` | Action | 34% | 2% |
| `1b73ada1` | Adventure | 26% | 0% |
| `75afae0b` | Adventure | 26% | 10% |
| `e686712b` | Thriller | 34% | 12% |
| `d14f1626` | Crime | 27% | 6% |

- Not under-represented: `d561961e` Action 0.51×, `eee3834e` Comedy 0.78×, `75afae0b` Thriller 1.0×, `da7f90da` Crime 0.63×, `032e0fd5` Romance 2.0×, and Romance for `dded73de` (0.77×), `09aa21db` (0.73×) and `3c73aace` (1.0×).

**Caveat.** Low-crowd genres are under-shown by a crowd-only ranking too:

| Genre | Share of the pool | Share of the crowd's top 500 |
|---|---|---|
| Comedy | 36% | 16% |
| Action | 19% | 8% |
| Horror | 16% | 2.8% |
| Adventure | 12% | 9% |
| Thriller | 24% | 13% |

So part of definition B's count is the crowd term, which is known and was decided. The part that is clearly a defect is where the personal side makes it *worse* than crowd-only. That holds for both horror fans: 0% and 4% against the crowd's 2.8%, with animation pushed to 64% for `dbd4371e`. I did not decompose the other 9 accounts term by term.

**Model-wide fact.** The person's fitted `knnBase` weight is negative in all 18 accounts with 50+ rated films (−0.33 to −1.52), and the population's is −0.68.

## 5. What would fix it (not built; needs the time-split test)

Candidates, each with its rough effect on `dbd4371e`'s animation-over-horror edge of 2.67 log-odds:

1. **A dislike counts as taste only when it is below the crowd.** In `dislikedSim`, a disliked film counts only when they rated it at least 0.5★ under its Letterboxd average. A film everyone panned says nothing about them. Here none of the 4 qualifies, so `dislikedSim` goes neutral: **−1.35**, leaving +1.32.
2. **Sign-lock `knnBase` against going negative without `knnLocal`.** Fit the two as one contrast term, or never let the pair's net effect point against "they outrate the crowd near this film". Rule 1489's sign lock for `langAff` is the precedent. Here: **−0.76**.
3. **Bound the far-from-library bonus.** Read `dislikedSim` as a contrast with `lovedSim`, or scale it by how near the film is to the library at all. This stops "unlike anything you rated" from earning a bonus, which also explains the concert films and Pooh shorts at 96.
4. **Fit to stars against the person's own scale instead of liked / not liked.** `V10.stars` exists, was measured on 2026-11-12, and did not ship. It would not by itself stop the crowd cap moving blame onto the similarity terms.

1 and 2 together take the edge from 2.67 to about 0.56 log-odds. That is a static estimate on 80 films, not a recall measurement.

**The test to pre-register** (same harness as `volume-prior-test.md` and `calibration-test.md`):

- Data: the 9 time-split accounts and folds.
- Primary: recall@200 non-inferior.
- Guardrail: liked films in the account's heaviest genre, which is the reverse of the volume-prior guardrail. Here that means `dbd4371e`'s later horror ratings. Its recall was 0 at every fold under every arm in that test.
- Also report: top-50 genre share against the library for the two horror fans.

**If one passes:**

- the model version bumps;
- the population is refitted (`ai_cache` population key);
- the nightly full pass rescores everyone (`scripts/backfill-match-scores.mjs`), which rewrites every `user_score_vec` and `user_match_calibration` row;
- it gets an INVARIANTS rule and a DATA-SCIENCE-LOG entry with the before and after.

**What needs the owner or a session with credentials:**

- running `scripts/eval-time-split` (service-role key);
- the rescore;
- the go/no-go.

`docs/HANDOFF.md`'s line "cause still open" can be updated to point here. I did not edit the montage repo.
