# Taste layer: time-split backtest

2026-11-13. Read-only on Supabase `uktamekqqsiijugpaxit` (SELECT only). Spec: `taste-layer-spec.md` in this folder. Follows `match-time-split.md` and the top-flatten entry in montage `docs/DATA-SCIENCE-LOG.md` (rule 1593).

## The bar (written before any result was run)

The taste layer ships (switch on) only if, on time split A (each person's last ~20% by date held out), the layer applied with **only signals dated before each held-out rating**:

1. **Per-user Spearman improves**, with the 95% bootstrap interval (over users, paired against the baseline) of the change excluding zero;
2. **The share of held-out 4.5★+ films shown at 83%+ improves**, its interval also excluding zero;
3. **Nothing regresses for thin accounts** (fewer than 100 training ratings): their Spearman and 4.5★-at-83%+ do not fall.

AUC (4.5★+) and 5★ at 85%+ are reported but are not part of the bar. Each signal family is judged alone and combined; caps 5, 10 and 15 are run, and the cap is not chosen after seeing the results unless the default (10) passes.

## Short answer

- **Verdict: does not pass. Do not switch it on.** No family improves Spearman or the 83%+ metric. Interval for every change touches or sits below zero. The one dated signal there is enough of (repeated not-interested) makes ranking slightly **worse**, and a thin account regresses.
- **The main finding is that the data is too thin to test the idea.** The signals the layer is meant to use barely exist yet:
  - after-watch chips: 2 rows in all of `rating_reasons`. Both are general "aspect" chips (Story, Emotional payoff), which name no film feature, so 0 testable.
  - removed learned chips / "Not quite" (`viewingPrefs.learnedOff`): 0 accounts.
  - Show less of (`notMine`): 2 accounts. Things I'd rather avoid: 1 account. **Neither is dated**, so neither can be tested without leakage.
  - not-interested (`user_removed` kind `hidden`): 53 films across 6 accounts. Only 2 accounts have 2+ hides dated before one of their held-out ratings.
- **The 83%+ metric cannot move with the signals that exist.** Every signal we have only lowers a score (Less of, avoid, hidden). Lowering films cannot raise the share of 4.5★+ films shown 83%+. Only positive signals can do that, and positive chips are where nothing has been recorded.
- **Directional hints, not evidence.** Show less of points the right way: touched films averaged 2.96★ against 3.53★ for the same accounts' other held-out films, and one account's Spearman rose 0.402 → 0.420. That uses undated preferences, so it is a leaky upper bound on 12 films in 2 accounts. Repeated not-interested does not: touched films averaged 3.53★ against 3.48★, three were rated 4.5★+, and ranking fell. Hiding a film looks like "not now / seen it" more than a statement about taste.

## Coverage (all 23 accounts; 19 in split A)

| Signal family | Where it lives | Accounts with any | Dated? | Accounts in split A with the signal **before** a held-out rating | Held-out films it touches (cap 10) |
|---|---|---|---|---|---|
| After-watch chips | `rating_reasons.reasons` | 2 (2 rows, ever) | yes (`created_at`) | 0 usable: both rows are aspect chips (`pos:story`, bare `emotional_payoff`), and each is on the film it rates | 0 |
| Show less of | `viewingPrefs.notMine` | 2 (1 kind; 7 kinds) | **no** | cannot say (no date) | 12 in 2 accounts, if treated as always known (leaky) |
| Things I'd rather avoid | `viewingPrefs.avoid` | 1 (3 warnings) | **no** | cannot say | 11 in 1 account (leaky) |
| Removed learned chips / Not quite | `viewingPrefs.learnedOff` (and `learned`) | 0 | n/a | 0 | 0 |
| Repeated not-interested | `user_removed` kind `hidden` | 6 (53 films; first 2026-09-26) | yes | 2 | 30 in 2 accounts |

Context for volume: 77 in-app ratings by 14 accounts since the chips shipped (2026-11-04), and 1 chip row in that time (about 1%). About 200 ratings a month land across all accounts. The soft-tell log (`viewingPrefs.softTells`) exists on 3 accounts. It is a temporary signal under the owner's rule, so it is not tested here.

## Data and method

- **Harness:** montage `scripts/eval-time-split/` (split A), production config as in the top-flatten check (`mockups/journeys/top-flatten-run.mjs`): model 9 with the crowd cap at 30% and the director cap, the safe share cap, the per-person curve fitted on training films only, the top flatten ×0.45 above 85, and whole-number stored and shown rounding. That gives each number as the person would see it. The dumps are the read-only ones of 2026-11-12 (ratings and films, profile ids cut to 8 characters, no names). Signals were read on 2026-11-13 with SELECT only. They stay in the session scratchpad and none are in this repo.
- **Split A:** each person's boundary between two distinct dates nearest 20% held out (10–35%, 8+ held out, 15+ to train). 19 accounts, 1,059 held-out films, 181 rated 4.5★+, 79 rated 5★. 7 accounts train on under 100 ratings (96 held-out films).
- **The layer as tested** (the spec's default weights, fixed before the run): points on the stored scale, added to the model score before the per-person curve and the flatten. The total is clamped to ±cap.
  - Show less of: −0.6 × cap for each of the person's kinds the film is (NOT_MINE tests, lib/viewing-prefs.ts).
  - Avoid: −0.6 × cap per avoided warning the film carries (`film_labels.content_warnings`).
  - Repeated not-interested: from the films hidden on a day **strictly before** the held-out rating's day, at least 2. A kind or director is active when 2+ hidden films share it and its share of the hidden films is at least 2× its share of the person's training library (floor 2%). It takes −0.3 × cap × min(1, (count − 1)/2).
  - Chips: a film chip's features (lib/rating-chips.ts) at +0.3 × cap (pos) or −0.3 × cap (neg). Aspect chips carry no film feature and give 0.
- **Leakage:** hidden films and chips are filtered by date. Show less of and avoid have no stored date, so their rows are labelled **leaky upper bound**: they use the preference as it is today, even for ratings made before it was set. The strict, leak-free version of both is "no data" (0 touched films).
- **Approximations:** black-and-white is read as "before 1955 or the TMDB keyword" and silent as "before 1928" (production also has hand lists). Keyword kinds use the TMDB keywords read for this test.
- **Intervals:** 95% bootstrap over users, 2,000 draws, each change paired against the baseline in the same draw.

## Baseline reproduced

| | This run | DS log (rule 1593, ×0.45) |
|---|---|---|
| Per-user Spearman | **0.441** | 0.441 |
| Per-user AUC (4.5★+) | **0.748** | 0.748 |
| Held-out 4.5★+ shown 83%+ | **59.7%** | 60% |
| Held-out 5★ shown 85%+ | **54.4%** | 54% |
| Thin accounts (train < 100): Spearman, 4.5★+ at 83%+ | 0.290, 45.5% | not reported |

## Results per signal family

Changes are against the baseline above. Δ is the paired change, and the brackets are its 95% interval.

| Family | Cap | Touched films (accounts) | Per-user Spearman | AUC | 4.5★+ at 83%+ | 5★ at 85%+ | Thin: Spearman / 83%+ |
|---|---|---|---|---|---|---|---|
| Chips | 5 / 10 / 15 | 0 (0) | 0.441 (Δ 0) | 0.748 | 59.7% (Δ 0) | 54.4% | 0.290 / 45.5% |
| learnedOff | 5 / 10 / 15 | 0 (0) | 0.441 (Δ 0) | 0.748 | 59.7% (Δ 0) | 54.4% | 0.290 / 45.5% |
| Show less of (leaky) | 5 | 12 (2) | 0.441 (Δ 0.000 [0, 0]) | 0.748 | 59.7% (Δ 0) | 54.4% | unchanged |
| | 10 | 12 (2) | 0.442 (Δ +0.001 [0.000, +0.003]) | 0.749 [0, +0.002] | 59.7% (Δ 0) | 54.4% | unchanged |
| | 15 | 12 (2) | 0.442 (Δ +0.001 [0.000, +0.003]) | 0.750 [0, +0.004] | 59.7% (Δ 0) | 54.4% | unchanged |
| Avoid (leaky) | 5 / 10 / 15 | 11 (1) | 0.441 (Δ −0.000 [−0.001, 0]) | 0.749 | 59.7% (Δ 0) | 54.4% | unchanged |
| Repeated not-interested (dated) | 5 | 30 (2) | 0.441 (Δ −0.000 [−0.001, 0]) | 0.747 [−0.004, 0] | 59.7% (Δ 0) | 54.4% | 0.290 / 45.5% |
| | 10 | 30 (2) | 0.437 (Δ −0.004 [−0.012, 0]) | 0.740 [−0.022, 0] | 59.7% (Δ 0) | 53.2% | **0.281** / 45.5% |
| | 15 | 30 (2) | 0.433 (Δ −0.008 [−0.021, 0]) | 0.738 [−0.027, 0] | 59.7% (Δ 0) | 53.2% | **0.273** / 45.5% |
| Combined, dated only (chips + not-interested) | 5 / 10 / 15 | 30 (2) | as repeated not-interested | | | | |
| Combined incl. undated (leaky) | 5 | 44 (3) | 0.441 (Δ −0.000 [0, 0]) | 0.748 | 59.7% (Δ 0) | 54.4% | unchanged |
| | 10 | 44 (3) | 0.437 (Δ −0.004 [−0.011, 0]) | 0.742 [−0.017, 0] | 59.7% (Δ 0) | 53.2% | **0.281** / 45.5% |
| | 15 | 44 (3) | 0.434 (Δ −0.007 [−0.021, 0]) | 0.741 [−0.018, 0] | 59.7% (Δ 0) | 53.2% | **0.273** / 45.5% |

What the touched films were rated (cap 10):

- **Show less of (leaky):** 12 films, mean 2.96★, none 4.5★+; the same accounts' other held-out films averaged 3.53★. In the larger account (341 training ratings, 11 touched), Spearman 0.402 → 0.420. The other (26 training ratings) had 1 film touched and did not move.
- **Avoid (leaky):** 11 films, mean 3.50★ against 3.42★ for the rest. No signal: avoiding a content warning in suggestions is not disliking those films once watched.
- **Repeated not-interested:** 30 films, mean 3.53★ against 3.48★ for the rest, and 3 were rated 4.5★+ (one a 5★ in an 18-rating account, whose Spearman fell 0.138 → 0.079). The kinds that fired: thriller (13 films), crime (9), before 1990 (8), sad ending (4), before 1970 (3), sci-fi (2), subtitled (1), superhero (1). A stricter rule (3+ hidden films and 3× lift; then 4+ and 4×) was tried as a check after the fact. Touched films fell to 18 and then 7, but Spearman still fell by about 0.003 to 0.004.

**Against the bar:** (1) Spearman: no family's interval excludes zero on the up side. Not-interested and the combined layers point down. (2) 4.5★+ at 83%+: zero change for every family and cap. It cannot rise with signals that only lower. (3) Thin accounts: they regress (0.290 → 0.281 at cap 10, 0.273 at cap 15) through one 5★ film in an 18-rating account. **Fails on all three.**

## How much data would settle it

These are rough figures, not a power calculation.

- **Where the effect would have to come from.** In the one account where a stated preference touched 11 held-out films, Spearman moved +0.018. Averaged over 19 accounts that is +0.001. For the per-user mean to clear zero, the layer has to move most accounts, not one or two. We would want **at least 10 accounts per family whose signal predates 5–10 of their held-out ratings that it touches**, about 150–200 touched held-out ratings in all.
- **For the 83%+ metric:** positive signals touching **at least 40 held-out 4.5★+ films** across 10+ accounts. Today that number is 0.
- **Dates:** Show less of, avoid and learnedOff need a timestamp per entry (e.g. `notMineAt: {key: ISO date}`), or they can never be backtested without leakage. That is a write-path change for the owner to approve, so it was not made here.
- **Chips:** at today's rate (about 1 chip row per 77 in-app ratings) the chip family will not reach that volume. Either uptake rises a lot, or the shadow log in the spec (compute the layer, log it, don't apply it) collects a forward test as ratings arrive.

## Recommended next step

1. **Keep the layer off.** Build it only behind `MATCH_TASTE_LAYER` (default off) with **shadow logging**: each logged prediction stores the points the layer would have added, so the forward test builds itself from `match_predictions`. Nothing a person sees changes.
2. **Date the stated preferences** (owner approval needed): a timestamp when a Show less of kind, an avoid warning or a learnedOff entry is added.
3. **Leave repeated not-interested out of the %.** It has the most data and no signal. Keep it as it is now (the nudge turns it into a stated Show less of, which then counts).
4. **Look into chip uptake** (1 chip row since launch against 77 in-app ratings). Without positive chips, the 83%+ goal is out of the layer's reach.
5. **Re-run this backtest** (the scripts are reproducible from the dumps) when the volume above is reached, or after about 60 days of shadow logs, whichever comes first.

## Not done, said plainly

- The leak-free test of Show less of and avoid could not be run: they have no dates.
- No chip family test: there are no testable chips.
- Signals were read a day after the rating dumps. A hide on 2026-11-12 can only touch held-out ratings after the dump, so it touches none.
- Scripts used (scratchpad, not committed because they sit next to the data): a split-A run of the top-flatten harness that also saves each person's curve, and the layer and bootstrap script.
