# Taste layer: what people tell us about their taste moves their match %

2026-11-13. Research and spec only: no app behavior changes here. Backtest: `taste-layer-backtest.md` in this folder (verdict: **does not pass; keep off**, mostly because the signals barely exist yet).

## Goal and the rule (owner-approved)

The match % is the product's defining number. Today it is fitted only from ratings (model 9, `lib/taste/match-model.mjs`). What a person *tells* us about their taste only re-ranks Picks:

- Show less of: `skipPoints`, 10 to 26 rank points.
- Learned chips: `learnedPoints`, ±5 to 10.

The % itself stays put ("keeps its true %", rule 1417; "never the match %", rule 1570).

**Rule:** statements about taste feed the %. Mood or temporary signals only reorder.

| Feeds the % | Does not feed the % (reorder only) |
|---|---|
| After-watch chips (`rating_reasons.reasons`, `lib/rating-chips.ts`, "what did you like") | Temporary soft skips ("less war for now", `lib/day-signals.ts`, `lib/held-prefs.ts`) |
| Lasting Show less of / Things I'd rather avoid (`viewingPrefs.notMine`, `viewingPrefs.avoid`) | Tonight moods |
| "Not quite" corrections and removed learned chips (`viewingPrefs.learnedOff`) | Pitch asks |
| Repeated not-interested on the same kind of film (`lib/not-interested.ts`, `lib/not-for-me.ts`): a weak signal | |

**Open question for the owner:** the soft tells (`lib/soft-tells.ts`, rule 1474) already take up to 7 points off the *shown* % at read time (`softRows` in `lib/taste/film-scores.ts`). They are temporary and recover on their own. Under this rule they belong in the reorder-only column. This spec does not change them, but they should be decided together with this layer.

## What the layer is

A per-person table of small, capped adjustments, applied per film on the **stored scale** (0 to 100, the scale `user_film_score` holds), after the model and before the display curves:

```
model score s (v9, at the account's spread)
  → post-hoc correction (MATCH_POSTHOC, off today)
  → + taste layer Δ(person, film), clamped to ±CAP          ← new
  → per-person curve (personal-curve.mjs) or shared curve (shown-match.ts)
  → top flatten (topFlatten, ×0.45 above 85)
  → soft-tell offset (today; see the open question)
  → shown %
```

### Signals → film features → points

Each signal is mapped to features a film row already carries. The candidate row and the full pass both read these: `genres`, `tmdb_keywords`, `film_labels`, `character_traits`, `moods`, `runtime_minutes`, `year`, `original_language`, `directors`, the strand labels and lanes (clusters).

| Signal | Features | Points per matching feature (default, CAP = 10) |
|---|---|---|
| Positive film chip on 2+ films (`LEARNED_MIN_FILMS`), e.g. "The teacher and student", "How tense it gets" | The chip's `features` in `lib/rating-chips.ts` (keyword, mood, trait, label ≥ min, genre, runtime) | +0.3 × CAP (+3) |
| Negative film chip on 2+ films, e.g. "Too bleak", "Too long" | as above | −0.3 × CAP (−3) |
| General aspect chips (Story, Pacing, Ending, Visuals, Music, Emotional payoff) | Mapped only where a film label measures the aspect: pacing → `propulsion`; visuals → `visual_artistry`; ending → `ending`; emotional payoff → `tearjerker`. Story, characters and performances have no per-film measure, so they give 0. | ±0.2 × CAP, only on 3+ films with the same polarity |
| Show less of kind (NOT_MINE: genre, theme, era, long, subtitled …) | The kind's own test (`NOT_MINE[k].test`) | −0.6 × CAP (−6) per kind |
| Show less of lane / director (`lane:<id>`, `dir:<id>`) | `notMineFilms` for the lane; `film_directors` | −0.6 × CAP |
| Things I'd rather avoid (content warning) | `film_labels.content_warnings` | −0.2 × CAP. **Lowest weight:** avoiding a warning in suggestions is not disliking those films once watched (backtest: no signal). Suggestions already filter them hard. |
| learnedOff / Not quite | Removes that chip's contribution. A Not quite swaps the films over to the chip the person meant. | 0 for the removed chip; the corrected chip counts as above |
| Repeated not-interested | A kind or director shared by 2+ hidden films in the last 90 days, whose share of hidden films is at least 2× its share of the person's library | −0.3 × CAP × min(1, (n − 1)/2). **Default off within the layer.** The backtest found no signal: hides read as "not now / seen it". The nudge already turns a real pattern into a stated Show less of. |

`Δ(person, film)` is the sum, clamped to ±CAP. Default CAP = 10 on the stored scale, sweepable (5 / 10 / 15). Because the per-person curve is steeper in the middle, 10 stored points is roughly 5 to 12 shown points.

### Guardrails

1. **No double counting with ratings.**
   - A chip comes with a rating, and the rating has already trained the model. So a chip feature counts only for the part the model has not learned. For each chip feature, take the person's leave-one-out residual on their rated films that carry it, `mean(rating_pts − LOO score)`; the full pass already computes those LOO scores for the curve. The chip's points are reduced by that residual, never flipped, and dropped when it already covers them.
   - A chip never moves the film it was picked on.
   - **Rated films are never touched.** A rated film keeps showing its held-out number (rule 1545).
2. **No double counting between signals.** A kind in Show less of switches off any repeated-not-interested term for that kind. A learned chip and a Show less of kind on the same feature: take the larger magnitude, not the sum. One film is capped at ±CAP in all.
3. **Ratings overrule statements.** If, after a signal's date, the person rates 2+ films that carry the feature against the signal's direction (4★+ on a Show less of kind, 2.5★ or less on a liked chip feature), that feature's term switches off. Settings shows "Your ratings disagree, so we stopped using this".
4. **Decay and recency.** Stated preferences (Show less of, avoid, chips) do not decay while they are set; removing one removes it at once. Repeated not-interested (if it is ever turned on) counts hides from the last 90 days at full weight, and from 90 to 180 days at half weight.
5. **No feedback loop.**
   - The layer never feeds the model: it is not in `v3FitUser`, the population fit, the LOO scores, the personal curve's fit or `taste_profiles`. Training stays on ratings only.
   - The demoted films still reach people through explicit asks: a Browse or Tonight filter for the kind lifts it for that search, as `skipKinds(chose)` already does. That keeps rated evidence flowing, which is how guardrail 3 can fire.
   - The CAP keeps a −10 film inside the person's normal range rather than burying it.
6. **Kinds people ask for.** On a search that asks for the kind, the layer for that kind is 0, as rank points are today.

## Where it applies

**At read time, not baked into `user_film_score`.** That keeps the stored score the honest model number (`raw_predicted` stays clean), so a preference change shows at once with no rescore. It is also how the soft tells and the per-person curve are applied today.

- **Nightly full pass (`lib/taste/full-pass.ts`).** In `finish`, alongside the personal curve, compute the person's layer table: feature → points, with the residual discount (guardrail 1) and the overrule check (guardrail 3), from the LOO scores the pass already has. Save it to `ai_cache` under `taste-layer:<profileId>` with `model_version`, as `PERSONAL_CURVE_KEY` is saved. A table whose model version is not the account's current one is ignored, as the curve is.
- **Per-rating refresh (`updateMatchScoresForRating` / `drainRescoreQueue`).** No change to scoring. After a chip save, a Show less of change, a learnedOff or a Not quite, recompute only the table (cheap: features of the person's rated films and their stored LOO scores) and clear the score caches (`invalidateScoringProfile`).
- **Reads (`lib/taste/film-scores.ts`).** Add `layer(profileId, rows)` between `posthoc` and `personal` in `asShown`, `fetchFilmScores` / `shownBeforeSoft`, `fetchShownAndRaw` (shown side only), `personalMap` and `personalAdjuster` (the Browse RPC path). Rows need their film features. Candidate rows already carry them; for bare `{slug, score}` reads, load them with the same film-meta read `softRows` uses.
- **Ordering.** `film_scores_top` sorts in SQL by the stored score. Negative points only move films down, which is safe to re-sort after the read (`fetchTopFilmScores` already re-sorts after the soft tells). Positive points can lift a film from below the page, so over-fetch by CAP: read the rows down to (page floor − CAP) before re-sorting.
- **Display curve, personal curve and top flatten.** The layer moves the *input* to the curve: Δ on the stored scale, then `personalShown` (or `shownMatch`), then `topFlatten`. The flatten above 85 therefore also dampens big lifts at the top, and a +10 cannot push a film past the 91% ceiling. The curve is fitted without the layer (guardrail 5).
- **Picks.** Rank points for the same signals (`skipPoints`, `learnedPoints`) stay as they are while the layer is off. When it is on, a film's % already carries the stated signal, so cut Show less of to the era push only, and learned chips to 0, so the same statement is not counted twice in ranking. That is a rule-1417/1570 amendment for the owner.
- **Groups and friends.** A friend's or group's number for a film is that person's own layered score (each person's table), as the soft tells are.
- **iPhone.** No client change: the server sends the stored number, and the iPhone draws it with its copy of `SHOWN_MATCH_POINTS`.

## Predictions logged before rating (fair verdicts)

`match_predictions` already logs `predicted` (shown) and `raw_predicted` (model, before post-hoc) at the moment a film is shown, before any rating, plus `holdout` (the permanent ~10% of owner-film pairs, migration `20261104_learn_groundwork.sql`). Add:

- `taste_layer` (smallint, stored points applied, 0 if none), and `taste_layer_v` (the table's version). The row then says exactly what the layer did to the number the person saw.
- **Shadow mode (while the switch is off):** compute Δ and log it in `taste_layer`, but do not apply it. Every later rating then compares `raw` with `raw + Δ` against stars on predictions made before the rating. That is the forward test the backtest could not run.
- **When on:** pairs with `holdout = true` get the layer logged and **not applied**, so a clean comparison continues. The Prediction card's verdict ("Called it", rule 1545) is computed against what was shown, so the layer cannot grade itself on a number the person never saw.

## Kill switch

- `MATCH_TASTE_LAYER` = `off` (default) | `shadow` | `on`. With `off` nothing is read or computed. `shadow` logs only. `on` applies.
- `MATCH_TASTE_LAYER_CAP` (default 10) and `MATCH_TASTE_LAYER_FAMILIES` (default `chips,lessof,learnedoff`; `avoid` and `hidden` must be listed on purpose).
- `MATCH_PERSONAL_CURVE=off` does **not** stop the layer: the layer then feeds the shared curve.
- **Stays `off` until the backtest passes its bar** (`taste-layer-backtest.md`). Recommended now: `shadow`, once built, because it changes nothing a person sees.

## What the UI says

Only when the layer moves a film's shown % by 3 points or more (otherwise nothing):

- **Film page, under the %, in the match explanation's line:** "Lower because you asked for less horror." / "Up a little: you liked the tension in films like this." It names one signal, the largest.
- **Settings → Tune for you → What we've learned:** each item says "This nudges your match %, by a few points at most". Remove (learnedOff) says "Your match % no longer uses this". Show less of's footer: "Films like these show a slightly lower match % and come up less in your picks." That replaces "keeps its true %".
- **Overruled items (guardrail 3):** "Your ratings disagree, so we stopped using this", with Keep using it / OK.
- **Never:** a number of points, the word "penalty", or any of this to anyone else. A group shows each person's own number, with no reason line.

## What has to be true before it switches on

1. The backtest bar passes: per-user Spearman and held-out 4.5★+ at 83%+ improve with 95% intervals over users excluding zero, and thin accounts (< 100 ratings) do not regress.
2. Stated preferences are dated (`notMineAt`, `avoidAt`, `learnedOffAt`), so the test is leak-free.
3. Enough signal: see the backtest's volume section, which asks for at least 10 accounts per family and about 40+ held-out 4.5★+ films touched by positive chips.
4. The owner approves the amendments to rules 1417 and 1570 (the "% never moves" wording) and decides on the soft tells.
