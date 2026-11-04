# Decade affinity in the match score: built, backtested, left OFF (2026-11-04)

## The short version

**What I built.** A "how much do you like films from this era" signal that goes into the match % itself. There are no caps or quotas. For each person it looks at how they rate films from around a given year compared with what the crowd would predict for them. It does not care how many films from that era they've seen. Neighbouring years count a little (1950s ratings tell you something about the 1960s), and a decade with only a handful of ratings is pulled to "no opinion". So someone with 30 films and nothing old gets **no penalty** on old films. As you asked afterwards, it also counts proportion: how much of their watching falls in each decade, as a softer second input that only nudges and never zeroes out a decade.

**Did it predict better? No.** I hid a fifth of each person's real ratings and checked how close the model came to them, with and without the new signal. Across 19 accounts and 4,845 hidden ratings the difference is too small to matter (typical error 0.588 stars before and after). On the case you care about, **old films, it got slightly worse**: pre-1970 error went from 0.620 to 0.631 stars. Proportion added nothing on top. So **my recommendation is not to switch it on**. It's in the code, switched off, and the scores everyone sees are exactly what they were.

**Why it doesn't help.** The match score already knows about era, in two ways:
1. It compares each film with the films you rated that are most like it, and those comparisons already pick up era. A film-noir fan's noir neighbours are old films.
2. The model already has a small decade feature of its own.

What's left over once those are counted is mostly noise. The one consistent pattern runs the other way. For everyone, thin and heavy libraries alike, the model scores pre-1970 films about **0.1 stars too high**. People rate the acclaimed classics a little below what their crowd average promises. That is the crowd-acclaim effect the existing era lean (`lib/taste/era-lean.ts`) already discounts, so the data backs keeping that lean.

**What you'd see if it were on.**
- **Your list (afiacco):** two of your top 20 unseen films change. High and Low and Judgment at Nuremberg drop out, and Rocky and Se7en come in. Pre-1970 films go from 7 to 5 of 20.
- **jakelorimer (heavy classics):** he rates 1940-1970 films about 0.4 stars above what the crowd predicts, so the signal pushes his list further toward old films. His top 20 goes from 17 to 20 pre-1990, with 7 swaps. That's the opposite of a balance.
- **A thin user (movies123, 53 rated):** one swap. The signal correctly says "not enough to go on".

## Your follow-up: proportion and "I don't watch old films"

- **Proportion was tested as its own input.** Its best weight is tiny (about 0.03 stars), and it makes no measurable difference on top of ratings. It's in the switched-off code at that weight, so it nudges and never zeroes a decade. With the whole feature off it does nothing.
- **"None at all" stays a hard rule.** The taste test's "Older and black-and-white films? → I stick to modern" and the Settings "since 19xx" picker (`noOlder` / `since`, `lib/viewing-prefs.ts`) remove older films from suggestions. "Not my thing: Black-and-white / Silent films" does the same. The new term never touches those filters and never fights them, because it only changes a film's score. A decade someone picks on Tonight or Browse still overrides everything. Inside one chosen decade the term is almost flat, so it can't reorder much.
- **There is no softer "rarely" answer today.** The question has three options:
  - "I seek them out": leans older.
  - "If the story's great": only a small taste-axis nudge.
  - "I stick to modern": the hard filter.

  The Settings picker is also all-or-nothing (a cut-off year). If you want a "Rarely" option, it could be a fixed score penalty on pre-1980 films for that person instead of a filter. Ratings can't tell us how big that penalty should be, though: people who rarely watch old films have almost none rated, which is exactly why the rating signal reads "no opinion" for them. So it would be a judgment call that we then check against what people actually pick. My suggestion: only add it if "rarely" users actually complain about old films. "I stick to modern" plus the era caps already cover most of it. I didn't build any UI.

## What to do with the decade quota (`DECADE_BALANCE`)

**Recommend removing it**, not keeping it as a light guard:
- You rejected quotas ("it should still be best match").
- It's switched off but wired into six surfaces, which is upkeep for code that never runs.
- Variety by era is already handled by the existing era lean and era caps (`lib/taste/era-lean.ts`).
- A "light" version would bring back the cap you objected to.

The decade-balance replay showed that today's caps let a 5%-classics library see **zero** pre-1970 films (the "4% is nothing" problem). If that bothers you, the fix that fits "best match first" is a score-level crowd-acclaim correction for old films: about -0.1 stars, measured the same way as this report. It would replace the caps, rather than add a quota. I didn't delete anything.

**The one-line switch** (don't, per the above): in `lib/taste/match-model.mjs`, `export const DECADE_AFFINITY = false;` → `true`, then the nightly match-score run rewrites everyone's scores.

---

## The numbers

### How it was measured
- **Data:** real ratings for every account with 20 or more rated films, a dated film and an embedding. That's 19 accounts and 4,845 ratings. Everything was computed inside Postgres with read-only SQL. Nothing was written.
- **Split:** each rating goes into one of 5 folds by a hash of user + film. Each fold is predicted from the other four.
- **Base model** (stands in for today's score on a star scale; the production model needs the per-film embedding matrix, so this rebuilds its two main parts):
  - a per-person regression of their stars on the Letterboxd average (pulled toward slope 1);
  - plus their personal leaning on the 25 most similar rated films (cosine on the stored embeddings, weighted sim³, leave-one-out), with a per-person weight.
- **Variants, all added to the base:**

  | Code | Variant |
  |---|---|
  | B | Today's `decadeAff`: like-rate by exact decade, shrink 8 (already in model 3) |
  | C | The new lean, with the residual type, bandwidth (0 = exact decade, 4, 8, 15 years) and shrinkage (3, 10, 30, 80 films) chosen by held-out error |
  | X | Exposure only: log of the decade share blended with 60 typical films, over the typical share |
  | E | B + C + X together |

- **Honesty:** weights and settings were chosen on folds 0-2 and scored on folds 3-4, then the reverse, so every number below is out of sample. Spearman is per user, then averaged.

### Overall (4,845 held-out ratings)
| | MAE | RMSE | mean per-user Spearman |
|---|---|---|---|
| A base | 0.4366 | 0.5882 | 0.407 |
| B + today's decadeAff | 0.4370 | 0.5884 | 0.410 |
| **C + new decade lean** | 0.4370 | **0.5880** | 0.413 (11 of 19 better) |
| X + exposure only | 0.4363 | 0.5880 | 0.407 (8 of 19 better) |
| E + all three | 0.4372 | 0.5884 | 0.412 |

### By era of the held-out film (RMSE; bias = actual minus predicted)
| | pre-1970 (218) | 1970-89 (521) | pre-1990 (739) | 1990+ (4,106) |
|---|---|---|---|---|
| A base | 0.620 (bias -0.11) | 0.591 (-0.06) | 0.600 (-0.07) | 0.586 (-0.02) |
| B today's | 0.632 (-0.16) | 0.598 (-0.10) | 0.608 | 0.585 |
| C new lean | 0.631 (-0.12) | 0.595 (-0.07) | 0.606 | 0.585 |
| X exposure | 0.616 (-0.11) | 0.591 (-0.07) | 0.599 | 0.586 |
| E all | 0.635 | 0.597 | 0.608 | 0.585 |

### By library size (RMSE all films / pre-1990 films; Spearman)
| | thin <60 (5 users, 173) | mid 60-299 (9 users, 1,350) | heavy 300+ (5 users, 3,322) |
|---|---|---|---|
| A base | 0.798 / 0.905; 0.091 | 0.611 / 0.600; 0.468 | 0.565 / 0.587; 0.613 |
| C new lean | 0.800 / 0.917; 0.102 | 0.611 / 0.607; 0.475 | 0.565 / 0.593; 0.611 |
| X exposure | 0.798 / 0.901; 0.087 | 0.612 / 0.596; 0.470 | 0.565 / 0.587; 0.613 |

Thin libraries hold only 20 held-out pre-1990 ratings, which is too few to read anything into. The shrinkage keeps their lean near zero, as intended.

### Chosen settings and weights
- **Lean:** the best residual is against the crowd prediction. Against their own mean was worse every time: old films are rated above someone's mean because they're acclaimed, and the base already knows that.
- **Bandwidth and shrinkage:** an 8-year bandwidth with 30-film shrinkage is used. Bandwidth 0 to 15 years and shrinkage 10 to 80 films were all within noise.
- **Lean weight:** 0.64 on one half and 1.84 on the other (pooled 1.1). Weights that unstable are a sign there's no stable signal.
- **Exposure weight:** 0.037 and 0.057 stars per unit of log share alone. Next to the lean it drops to about 0 (0.012 and -0.026).
- **The new lean for a few people** (stars, at mid-decade):

  | Account | Lean |
  |---|---|
  | jakelorimer | +0.37 to +0.45 for 1935-1975, -0.54 for 2015+ |
  | alexfiacco | -0.10 to -0.14 for 1935-1975 |
  | afiacco | +0.06 for the 1980s, otherwise within ±0.06 |
  | movies123 and quinlanoc | within ±0.03 everywhere (shrunk) |

### Top 20 unseen films, decade mix, with the lean applied to stored scores
Stored model-7 scores (`user_score_vec`) for films with 20k+ Letterboxd logs, documentaries left out. The score is turned back into log-odds on the person's own scale, the offset is added (2.9 log-odds per star × 1.1 × lean), and the list is re-ranked.

| user | rated | pre-1970 / pre-1990 of 20, now → with lean | swaps | in / out |
|---|---|---|---|---|
| afiacco | 390 | 7 / 12 → 5 / 11 | 2 | + Rocky, Se7en; − High and Low, Judgment at Nuremberg |
| alexfiacco | 1,078 | 2 / 4 → 1 / 3 | 2 | + The Best of Youth, Serial Experiments Lain; − Judgment at Nuremberg, Bound by Honor |
| jakelorimer | 873 | 12 / 17 → 15 / 20 | 7 | + A Matter of Life and Death, Rebecca, Vertigo, …; − Happy Together, A Tale of Winter, Eraserhead, … |
| movies123 | 53 | 9 / 13 → 8 / 12 | 1 | + Madoka Magica: Rebellion; − Le Trou |
| quinlanoc | 81 | 2 / 4 → 2 / 4 | 2 | + Black Swan, Kill Bill; − 1917, Schindler's List |

These raw top-20s are before the era lean and era caps, which act where picks are made. The thin user's raw top 20 is already 9 of 20 pre-1970 (his library is 9%) because of crowd acclaim. The new lean doesn't change that. The era lean does.

### How it would interact with the existing era lean
The era lean is a ranking-only discount on old films whose score is mostly crowd acclaim. It is skipped when a film suits the person 10+ points more than a typical viewer. With the decade lean on, a classics fan's old films would gain points over the typical viewer, cross that 10-point line more often and escape the discount. The two would compound for heavy classics fans and cancel out for others. That's one more reason not to switch it on as it stands.

### Caveats
- The base is a faithful rebuild of model 3's two main parts on the star scale, not the production logistic model itself. The production fit needs the full embedding matrix, which isn't available locally. The existing `decadeAff` feature (variant B) and the pre-1980 label flag are already inside production, so the real question ("does the new lean add anything on top of production?") is, if anything, even less favourable than shown here.
- There are only 218 held-out pre-1970 ratings, and 104 of them are jakelorimer's. Old-film results lean heavily on a few accounts.
- The log-odds-per-star conversion (2.9) used for the top-20 illustration is an approximation (1.7 / the residual sd of 0.59). It affects how far films move, not whether the signal predicts.

### Files
- `lib/taste/match-model.mjs`: `DECADE_AFFINITY` (false), the weights, `decadeLeanTable`, `v3DecadeOffset`. `v3Stats` adds the lean only when the flag is on.
- Wired, as a zero offset while off: `scripts/backfill-match-scores.mjs` (reference scale and catalog) and `lib/taste/match-score-update.ts` (reference scale, rescore, rated films, missing films).
- Rule 1024 in `docs/INVARIANTS.md`, checked in `scripts/check-invariants.ts`. Entry in `docs/DATA-SCIENCE-LOG.md` (2026-11-04).
