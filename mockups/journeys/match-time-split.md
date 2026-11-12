# Match scores: do the three fixes predict the future? A time-split test

2026-11-12. Read-only on Supabase `uktamekqqsiijugpaxit` (SELECT only). Follows `match-calibration-5star.md` and `fable-final-audit.md`.

## The bar (written before any result was run)

The owner's goal is to predict what a person will like **next**, not to fit what they already rated. The owner's bar: films a person rates 5★ should generally show 85% or more.

A fix ships only if, **on the time split** (train on a person's earlier ratings, predict their later ones), it does all three:

1. **Ranking not worse beyond noise.** Per-user Spearman and AUC for 4.5★+ do not fall: the 95% bootstrap interval (over users) of the change must not sit wholly below zero.
2. **Calibration better.** Shown bands (love 90+, really like 78–89, like 65–77, mixed 40–64, probably not under 40) stay ordered by actual mean rating, and band accuracy rises. Band accuracy is the share of held-out films whose stars fall in the range their band names: love 4.5★+, really like 4★, like 3.5★, mixed 2.5–3★, probably not 2★ or less.
3. **More held-out 5★ films at a shown 85% or more.**

If a fix fails any of the three, it does not ship, and the report says why.

Set in advance as well:

- **Fix 1 (share cap)** only changes accounts under 200 ratings in any real way, so it is judged on the thin results: real accounts under 100 ratings, plus thin profiles simulated from dated accounts (their first 15, 30 and 60 ratings predicting the next 40). It must also leave no weight above 10. The pre-set form is the audit's: skip a group with almost no movement, no group grows more than 2×, shares read on the unshrunk features, per-person cap only from 100 rated films. "Cap at every size" and "no cap" are run as sensitivity checks only.
- **Fix 2 (web shows the leave-one-out number on a rated film)** changes no forward prediction, so the three tests cannot move. Its pre-set test: on the films held out by the time split, once they are rated, is the leave-one-out number closer to the forward prediction (what we really said before the rating) than the stored number is? It ships if the leave-one-out number's mean gap to the forward prediction is smaller. Its effect on 5★ at 85%+ on rated films is reported, whichever way it goes.
- **Fix 3 (per-person calibration)** is the audit's fix A, smoothed: the person's held-out score percentile maps to their own rating at that percentile, on a fixed star scale (5★ = 96, 4.5 = 90, 4 = 82, 3.5 = 70, 3 = 55, 2.5 = 40, 2 = 30, 1 = 15), blended with today's curve by n/(n+100). Fitted on training films only. It is monotone per person, so per-user Spearman and AUC cannot move; test 1 is read on the pooled numbers.
- Random 5-fold is a secondary check and cannot overrule the time split.

## Short answer

- **Shipped (montage `33686382`, rules 1545 and 1546):**
  - **Fix 1, the share cap made safe.** Passed. Thin profiles rank later films better, and no weight is above 2.1 (it was 9.7e16).
  - **Fix 2, the held-out number on a rated film (web).** Passed its pre-set test. The stored number sits 13 points from what we really predicted; the held-out one sits 6.
  - **Fix 3, the per-person curve.** Passed the bar, and it is built and pushed, but **switched off** (`MATCH_PERSONAL_CURVE=on` turns it on). It moves every number a person sees, and rule 1068 keeps corrections to shown numbers off until the owner says go.
- **The owner's bar is not met by any of this.** On later films, 43% of 5★ films showed 85%+ before. With what is live now it is 44%. With the curve switched on it would be 49%.
- **The largest lever is not one of the three fixes.** With no share cap at all (rule 1488 off), 57% of later 5★ films show 85%+, and 62% with the curve as well. Ranking improves too: Spearman 0.373 → 0.451. The cap is the owner's product decision ("personal taste dominates"), so it was measured and left alone. This is the decision to bring to the owner.
- **Predicting later films is harder than a random hold-out.** For accounts with 100+ ratings, Spearman is 0.47 on the time split against 0.58 on random folds. Earlier reports used random hold-outs and so read high.

## Data and method

- **Accounts:** all 23 profiles. 5,564 rated films after the model's own filters (films only, with an embedding).
- **Dates:** the Letterboxd rating date for imported films (day precision), the save time for in-app ratings (to the second). A rating with no date is treated as earlier than any dated one.
- **Split A (main), each person's own cutoff:** the boundary between two distinct dates that leaves closest to 20% of their films after it (10–35% allowed, at least 8 held out, at least 15 to train on). 19 accounts qualify: 1,059 held-out films, 79 of them 5★. 7 of the 19 train on under 100 ratings.
- **Split B, one global date:** 2026-09-09, the date that leaves 20% of all dated ratings after it. 13 accounts, 895 films. One account supplies 395 of them.
- **Split C (secondary):** random 5-fold by a hash of the film. 22 accounts, 5,551 films.
- **Split D, thin profiles simulated:** an account with dates on 90%+ of its ratings is cut to its first 15, 30 or 60 ratings and scores the next 40. 11 accounts, 635 films.
- **Nothing from the future is used.** The population fit is refitted for each split from training ratings only. The per-person curve is fitted on training films only.
- **The model is the production code** (`lib/taste/match-model.mjs`), run offline on a read-only dump. Two shortcuts: vectors are stored as one byte per dimension, and the reference scale uses every third of the 6,000 reference films. Check against production: the refitted population weights match the stored ones to two decimals, the owner's fitted weights match to three, and the owner's 1,080 held-out scores match the stored `rating_predictions` rows (correlation 0.999, mean gap 0.3 points). The 13-rating account's 1e15 weights reproduce exactly.
- **Shown %** is the stored score at the account's spread, through the display curve, as the app draws it.
- **Intervals** are 95% bootstrap over users (1,000 draws; 300 for split C). "Change" is the paired difference from the baseline in the same draws.
- **Precision@10:** of each person's 10 highest-scored held-out films, the share they rated 4.5★+ (or 4★+). Only accounts with 20+ held-out films. Base rates there: 21% rate 4.5★+, 49% rate 4★+.
- Scripts: `scripts/eval-time-split/` in montage. Run time about 7 minutes.

## Results: time split A (each person's last ~20%)

19 accounts, 1,059 held-out films, 79 five-star.

| | Spearman per user | AUC 4.5★+ per user | P@10 4.5★+ | P@10 4★+ | Pooled Spearman | Pooled AUC | Band accuracy | 5★ at 85%+ |
|---|---|---|---|---|---|---|---|---|
| Baseline (model 9) | 0.373 [0.252, 0.483] | 0.686 [0.605, 0.771] | 0.43 | 0.75 | 0.450 | 0.710 | 28% | **43%** [24, 60] |
| Fix 1: safe cap | 0.400 | 0.717 | 0.42 | 0.75 | 0.465 | 0.724 | 28% | 44% |
| change vs baseline | +0.003 to +0.061 | +0.003 to +0.074 | −0.03 to 0 | 0 | 0 to +0.040 | 0 to +0.037 | 0 to +1 | −7 to +10 |
| Fix 2: held-out on rated films | no forward prediction changes | | | | | | | |
| Fix 3: per-person curve | 0.373 | 0.686 | 0.43 | 0.75 | 0.483 | 0.728 | 36% | 49% |
| change vs baseline | 0 | 0 | 0 | 0 | +0.007 to +0.057 | −0.002 to +0.042 | +5 to +14 | +1 to +16 |
| All three | 0.400 | 0.717 | 0.42 | 0.75 | 0.496 | 0.742 | 36% | **49%** [33, 65] |
| change vs baseline | +0.003 to +0.061 | +0.003 to +0.074 | −0.03 to 0 | 0 | +0.016 to +0.078 | +0.007 to +0.069 | +5 to +14 | −1 to +17 |
| *Not a fix: no share cap* | 0.451 | 0.761 | 0.49 | 0.80 | 0.523 | 0.767 | 33% | 57% |
| *No share cap + curve* | 0.451 | 0.761 | 0.49 | 0.80 | 0.563 | 0.795 | 39% | 62% [42, 82] |

Calibration by shown band (n / mean ★ / share rated 4.5★+):

| Band | Baseline | Fix 1 | Fix 3 | All three |
|---|---|---|---|---|
| Love 90+ | 104 / 4.17 / 42% | 105 / 4.16 / 43% | 91 / 4.22 / 49% | 93 / 4.21 / 48% |
| Really like 78–89 | 255 / 3.93 / 26% | 254 / 3.93 / 27% | 322 / 3.92 / 25% | 324 / 3.93 / 26% |
| Like 65–77 | 237 / 3.66 / 12% | 244 / 3.68 / 14% | 313 / 3.61 / 11% | 310 / 3.61 / 10% |
| Mixed 40–64 | 295 / 3.44 / 9% | 291 / 3.45 / 9% | 267 / 3.31 / 9% | 261 / 3.31 / 8% |
| Probably not <40 | 168 / 3.09 / 8% | 165 / 3.02 / 6% | 66 / 2.67 / 2% | 71 / 2.66 / 1% |

- Bands are ordered in every variant.
- **"Probably not" is too harsh today:** films shown under 40% average 3.1★. The curve cuts that band from 168 films to 66 and its mean to 2.7★.
- **"Love" is weaker on later films than it looked:** 42% of films shown 90%+ are rated 4.5★+. The random hold-out says 50%.

## Thin profiles (under 100 training ratings)

| Set | Variant | Spearman per user | AUC per user | Band accuracy | 5★ at 85%+ |
|---|---|---|---|---|---|
| Split A, real thin accounts (7 accounts, 96 films, 19 five-star) | Baseline | 0.214 | 0.572 | 18% | 37% (7 of 19) |
| | Fix 1 | 0.285 (+0.015 to +0.141) | 0.666 (+0.018 to +0.198) | 21% (0 to +8) | 32% (6 of 19; −23 to +20) |
| | All three | 0.285 | 0.666 | 26% | 37% |
| Split D, simulated (11 accounts, 635 films, 38 five-star) | Baseline | 0.418 | 0.739 | 18% | 32% |
| | Fix 1 | 0.535 (+0.060 to +0.172) | 0.801 (+0.021 to +0.102) | 21% (+1 to +4) | 47% (−4 to +36) |
| | All three | 0.527 | 0.796 | 23% | 53% (+3 to +40) |
| Split B, global date, thin (7 accounts, 731 films, 49 five-star) | Baseline | 0.230 | 0.589 | 24% | 27% |
| | Fix 1 | 0.333 (+0.033 to +0.179) | 0.673 (+0.042 to +0.119) | 24% | 37% (−8 to +46) |
| Split C, random folds, thin (11 accounts, 706 films) | Baseline | 0.371 | 0.686 | 19% | 35% |
| | Fix 1 | 0.383 (−0.048 to +0.066) | 0.698 | 23% | 45% (+5 to +19) |

Accounts with 100+ training ratings (12 accounts, 963 films): fix 1 changes nothing (Spearman 0.466 → 0.467). Fix 3 there: 5★ at 85%+ 45% → 52%, band accuracy 29% → 37%.

Sensitivity for fix 1 (split D): the cap kept at every size, only guarded and read unshrunk, gives Spearman 0.486. The pre-set form (no per-person cap under 100) gives 0.535. No cap at all gives 0.540.

## Other splits, all accounts

| Split | Variant | Spearman per user | AUC per user | Band accuracy | 5★ at 85%+ |
|---|---|---|---|---|---|
| B, global date (13 accounts, 895 films) | Baseline | 0.406 | 0.743 | 25% | 37% |
| | Fix 1 | 0.461 (+0.014 to +0.112) | 0.788 (+0.018 to +0.078) | 25% | 45% (−6 to +34) |
| | Fix 3 | 0.406 | 0.743 | 28% (+1 to +8) | 43% (0 to +9) |
| | All three | 0.461 | 0.788 | 28% | 49% (−3 to +41) |
| C, random 5-fold, secondary (22 accounts, 5,551 films) | Baseline | 0.466 | 0.733 | 31% | 57% |
| | Fix 1 | 0.471 (−0.025 to +0.034) | 0.738 | 32% | 59% (+1 to +6) |
| | Fix 3 | 0.464 | 0.731 | 38% (+3 to +9) | 63% (+4 to +11) |
| | All three | 0.469 | 0.736 | 38% | 64% (+4 to +13) |

## Fix 2: the number on a film once it is rated

The 1,059 films held out in split A, after the person "rates" them and the model is refitted on everything:

| Number on the card | Mean gap to the forward prediction | Spearman with the rating | 5★ at 85%+ |
|---|---|---|---|
| What we really predicted (forward) | 0 | 0.37 | 43% |
| Stored score (web card until now) | 13.1 points | 0.72 | 79% |
| Held-out score (iPhone, and web now) | 5.8 points | 0.54 | 49% |

- The held-out number is 7.3 points closer to the truth (6.1 to 8.5). It passes its pre-set test.
- The stored number's 0.72 is not skill: the film's own rating is in the fit.
- Even the held-out number flatters the model a little (0.54 against 0.37), because the weights were fitted with the film included.
- **Cost, stated plainly:** across every rated 5★ film (461), the web card showed 85%+ on 79%. With the held-out number it is 60%. For the owner: 40 of 40 → 27 of 40. That drop is the old number's echo going away, not the model getting worse.

## Decisions against the bar

| Fix | 1. Ranking not worse | 2. Calibration better | 3. More 5★ at 85%+ | Decision |
|---|---|---|---|---|
| 1. Safe share cap | Yes. Better on every thin set; unchanged from 100 ratings. | Yes, a little. Bands ordered; thin band accuracy 18% → 21%. | Mixed. Simulated thin 32% → 47%, global date 37% → 45%, all of split A 43% → 44%. Real thin accounts in split A fell by one film (7 → 6 of 19). | **Shipped.** Pooled over the two pre-set thin sets, 19 of 57 → 24 of 57. The one-film fall is inside the noise, and the fix also removes a real defect (weights of 1e15). |
| 2. Held-out number on rated films | Not applicable | Not applicable | Not applicable | **Shipped** on its own pre-set test (gap 13.1 → 5.8 points). |
| 3. Per-person curve | Yes. Per-user ranking cannot move; pooled Spearman +0.007 to +0.057. | Yes. Band accuracy 28% → 36%. | Yes. 43% → 49% (+1 to +16). | **Passed. Built and pushed, switched off.** See below. |

**Why fix 3 is off.** It changes every match % every person sees. Rule 1068 (owner, 2026-11-04) keeps corrections to shown numbers off until the owner says go, and rule 1512 (owner, 2026-11-11) approved one shared display curve. Thresholds set on the stored scale (weekly picks, mixes, in theaters) and "How we did" have not been checked on the personal scale. Turning it on is one environment variable; the curves are written by the nightly pass from tonight.

## What was built

- **Fix 1** (`lib/taste/match-model.mjs`): no per-person cap under 100 rated films; from 100, shares are read on the unshrunk features; a group with almost no movement is left alone; no group grows past 2×, and the crowd comes down further instead so its 20% cap still holds. `FULL_PASS.CATALOG_FIXED_AT` moved to 2026-11-12 02:00 UTC, so the existing match-scores cron (08:33 UTC) refits and rescores everyone once. No database write was made by hand. Server-side only, so iPhone needs no change.
- **Fix 2** (`app/_components/Result.tsx`): the web Prediction card on a rated film reads the pre-rating guess, else the held-out number, else the stored match. iPhone already did.
- **Fix 3** (`lib/taste/personal-curve.mjs`, `film-scores.ts`, `full-pass.ts`): the nightly pass fits and saves each person's curve; the read path applies it only when `MATCH_PERSONAL_CURVE=on`. It is applied on the server, so web and iPhone would draw the same number with no client change.
- Rules 1545 and 1546 in `docs/INVARIANTS.md`, checks in `scripts/check-invariants.ts`, tests in `scripts/test-match-v9.ts`, two entries in `docs/DATA-SCIENCE-LOG.md`.
- Gates run before the push: `tsc` clean, `check-invariants` exit 0 with no ✗, `check-security` ok, `check-ds-log` ok.

## Caveats

- **Small sample.** 19 accounts and 79 held-out 5★ films in the main split. Most intervals on "5★ at 85%+" are 30 to 40 points wide. Fix 1's gain on all of split A clears zero by 0.003.
- **The owner's own later films say little.** Only 3 of the owner's last 216 rated films are 5★.
- **"Later" is weak for in-app accounts.** Their held-out films were often rated minutes after the training ones, in the same sitting. Imported accounts have day-level dates.
- **Undated ratings are assumed earlier.** 6 accounts have a mix; if an undated rating was in fact later, it leaked into training.
- **Split B leans on one account** (395 of 895 films).
- **Band accuracy favours fix 3 by construction:** its star ranges are the same star scale the curve aims at. Band means and their order are the neutral check, and they also improve.
- **Fix 3 is not exactly order-neutral.** Rounding to whole points makes a few ties: per-user Spearman moves by 0.002 at most (0.418 → 0.416 on the simulated thin set, 0.466 → 0.464 on random folds), and is unchanged on split A.
- **Fix 1's form was fixed in advance from the audit.** The 100-rating threshold is a step: an account's order can shift when it crosses 100.
- **Not verified in production.** There is no service key here. The cron rescore, the Vercel deploy and the web card were not watched running. Check `user_match_calibration.updated_at` after 08:33 UTC, and that no weight exceeds 10.
- **Held-out rows refresh at most once a day**, so a rated film can show yesterday's held-out number for a day after the rescore.
- **The bar itself.** With Spearman near 0.4 on later films, no display curve can put most 5★ films at 85%+ without also putting many 3.5★ films there. The share cap costs about 13 points of it.

## Appendix: the two reads

Both are SELECT only, through the Supabase MCP. Profile ids are cut to 8 characters; no names or emails are read.

```sql
-- ratings: imported library, in-app ratings over it, minus removed
with lib as (select left(p.id,8) pid, e->>'slug' slug, (e->>'rating')::float8 r, e->>'a' a, e->>'w' w
  from public_profiles p, jsonb_array_elements(p.library_json->'rated') e
  where jsonb_typeof(p.library_json->'rated')='array' and e->>'rating' is not null and e->>'slug' is not null),
ur as (select left(p.id,8) pid, u.slug, u.rating::float8 r, u.source src, u.watched_on::text wo,
  to_char(u.created_at at time zone 'utc','YYYY-MM-DD"T"HH24:MI:SS') ca
  from public_profiles p join user_ratings u on u.owner_key=p.user_id::text where u.rating is not null),
rm as (select left(p.id,8) pid, u.slug from public_profiles p join user_removed u on u.owner_key=p.user_id::text where u.kind='rating')
select json_agg(json_build_array(coalesce(l.pid,u.pid), coalesce(l.slug,u.slug), l.r, l.a, l.w, u.r, u.src, u.wo, u.ca)) j
from lib l full join ur u on u.pid=l.pid and u.slug=l.slug
where not exists (select 1 from rm where rm.pid=coalesce(l.pid,u.pid) and rm.slug=coalesce(l.slug,u.slug));

-- films: every rated film plus every third of the 6,600 most-watched movies, 650 a page (k)
with rs as (select distinct e->>'slug' s from public_profiles p, jsonb_array_elements(p.library_json->'rated') e
  where jsonb_typeof(p.library_json->'rated')='array' union select slug from user_ratings),
ref as (select letterboxd_slug s, row_number() over (order by letterboxd_watch_count desc, letterboxd_slug) rn from films
  where (media_type is null or media_type='movie') and embedding is not null and letterboxd_watch_count>0),
w as (select s, max(rn) rn from (select s, null::bigint rn from rs union all select s, rn from ref where rn<=6600 and rn%3=0) q group by s),
pg as (select w.s, w.rn, row_number() over (order by w.s) k from w join film_vec v on v.letterboxd_slug=w.s where v.emb is not null)
select json_agg(json_build_array(f.letterboxd_slug, pg.rn, f.title, f.year, f.letterboxd_avg_rating, f.tmdb_vote_average,
  f.letterboxd_watch_count, f.character_traits, f.genres, f.directors, f.original_language, f.runtime_minutes,
  case when f.tmdb_keywords is null then null else (select coalesce(json_agg(x),'[]'::json) from unnest(f.tmdb_keywords) x
    where x ~* 'special|episode|stand-up|filmed|live|concert|proshot|pro-shot|album|music video|stage') end,
  coalesce(cardinality(f.tmdb_keywords),-1), f.duplicate_of is not null, f.media_type,
  (select to_jsonb(l) - array['slug','hook','content_warnings','lane_picks','model','labeled_at','confidence'] from film_labels l where l.slug=f.letterboxd_slug),
  (select translate(encode(decode(string_agg(lpad(to_hex(greatest(1,least(255,round(x*666)::int+128))),2,'0'),'' order by o),'hex'),'base64'),E'\n','')
     from unnest(v.emb::vector::real[]) with ordinality u(x,o)))) j
from pg join films f on f.letterboxd_slug=pg.s join film_vec v on v.letterboxd_slug=pg.s where pg.k between 1 and 650;
```
