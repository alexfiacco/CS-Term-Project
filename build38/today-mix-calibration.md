# Calibration across Today's days and within each mix (rule 2720)

2026-11-21. Montage branch `b42-calfix`, commit `86a0bd126` (amends rule 2043). Read-only SELECTs on Supabase
`pick_exposures`, `user_ratings`, `user_state`, `user_film_score` and `films`. Accounts by prefix only.

## What was wrong

Rule 2043 caps a kind's share of a **list** at k times the person's smoothed library share, counted with the last
30 days of every pick surface. Two surfaces escape it:

- **Today** shows one film a day. Its gate counts that one film against 300+ films shown elsewhere in 30 days, so a
  kind the deck and Tonight never show always fits.
- **Mixes** were gated across the whole row and 30 days, so one six-film lane could be a third animated. The lane card
  ("Because you like"), a genre mix and a season's mix left every genre alone.

`dded73de` (the owner's mother), last 7 days: deck 0/33, Tonight 0/24, weekly 0/11 animated; Today 2 of 7 days
(Toy Story 3 on 11-17, an "off" day; Monsters, Inc. on 11-20, an "on" day). On 11-20 the Made for you row held 4
animated films of 36. Three of them were in separate lanes. Mulan and The Iron Giant were together in lane 1 (positions 0-5).

## What was built (server only; the iPhone builds neither surface itself)

- **Today:** on an "on" day only, the film must keep every genre, decade and (from 11-15) language it carries within
  `max(1, floor(cap × 14))` of the person's Today films of the 13 days before plus this one. If no film fits, Today chooses
  as before. Discovery days and newcomers are excepted. The 5 best are not excepted: with one film a day there is no rest of the list.
- **Mixes:** on an "on" day, each lane's six hold each genre to `max(1, floor(cap × 6))` within the lane. A mix keeps
  the genres it is about: a genre mix's named genre, and, in every mix but Comfort, Against the grain, Hidden gems and
  Popular picks, any genre carried by at least 2/3 of its films. Same k, floor and 5-best exception. Decades and
  languages keep the row's 30-day count.

## Today: replay of the last 30 days

Today exposures begin on 2026-11-05. Each film is assigned to an America/New_York day. The arm comes from the
stamped `cal_arm`, with parity used for earlier days. Caps use each account's `cal_k` and its adapted `mtg_cal`
multipliers. On "on" days, an over-cap film is replaced by a fitting, unseen stored-score film. A replacement within
5 points was always available.

| Account | Library animated (smoothed) | Animation allowance / 14 days | Today films | Animated before | Animated after | Other "on"-day replacements |
|---|---|---|---|---|---|---|
| `dded73de` | 10.2% (k 2.0) | 2 | 18 | 2 | **2** | 1 (a second History film) |
| `322bf90c` | 2.4% (k 1.65 adapted) | 1 (5% floor) | 16 | 5 | **3** | 2 (2000s decade) |
| `646395d0` | 11.1% (k 2.0) | 3 | 4 | 1 | **1** | 0 |

- **`dded73de`: Today is not changed for her.** Her animation cap is 2.0 × 10.2% = 20.4%. That allows two animated
  Today films in 14 days, so Monsters, Inc. fits with Toy Story 3 three days earlier. Over 30 days her Today is 2 of 18
  animated (11%), about her library share. Her "2 of 7 days" was a cluster that the requested 14-day window and k allow.
  Holding her to one animated Today a fortnight needs a smaller k for Today or a shorter window. That is an owner
  decision, and it was not built.
- **`322bf90c`:** The Princess and the Frog (11-12) and the next animated pick (11-14) are replaced. The two other
  animated films (11-13, 11-17) fell on "off" days and stay. If every day were "on", only the first animated film would stay.
- **Guardrail cost:** the decade cap replaced A Beautiful Mind on 11-18 for `322bf90c`. They rated it 4★. It was the
  only liked Today film in the sample, so liked-film recall on Today in this replay is 0 of 1. The genre cap replaced no engaged film.

## Mixes: replay of reconstructable lanes

`pick_exposures` keeps one row per film per surface, so a slate keeps only the films whose last showing was in it.
Lanes are `position / 6` within a `slate_id`. Only lanes with at least 5 of their 6 films present are used: 43 lanes
and 250 films over 5 accounts in 30 days. The 5 best are the slate's top 5 by `match`. A displaced film moves to a
spare. The replay assumes that a fitting spare exists, so the "after" figures are the most the cap can do.

| Account | Lanes | Films | Animated before | Animated after ("on" days) | Animated after (every day) | Most animated in one lane, before → after |
|---|---|---|---|---|---|---|
| `dded73de` | 7 | 41 | 3 | 2 | 2 | 2 → 1 |
| `322bf90c` | 8 | 47 | 6 | 5 | 5 | 2 → 1 |
| `646395d0` | 9 | 50 | 12 | 8 | 8 | 2 → 1 |
| `d73ace86` | 13 | 76 | 13 | 12 | 9 | 4 → 4 (lanes at least 2/3 animated are themed and kept) |
| `3c73aace` | 6 | 36 | 3 | 3 | 3 | 1 → 1 |

- For `dded73de`, the 11-20 row goes from 4 to 3 animated of 36. The lane holding Mulan and The Iron Giant keeps one of them.
- **Every genre:** the lane cap covers all genres, not only animation. On "on" days it moves **40 of the 250 shown mix
  films (16%)** to a spare, or 53 (21%) if it ran every day. Most of the moved films are Action, Adventure, Crime,
  Fantasy and Science Fiction, for libraries light in those genres. The cap has a much wider effect than the animation case that prompted it.
- **Guardrails:** 0 of 4 engaged mix films were displaced (saved, rated 3.5★ or more, or marked Seen it). 0 of 1 liked
  (4★+) mix film was displaced. Engagement on mixes is too rare for these counts to show that the change is harmless.

## The Dec 12 evaluation (rule 2043)

Both changes act only on "on" days. "Off" days are served exactly as before. The Today window counts Today films from
both arms, but it changes nothing on an "off" day.

The Dec 12 read keeps its arms, dates, metric, duration and decision rule, as it did when language was added. Its "on"
arm means calibration as served. The arm alternates daily per account, so a policy change that reaches every account
at one moment is balanced in calendar time across both arms.

The cost is that "on" rows before and after the deploy mean slightly different policies for Today and mixes. Let T_C
be the commit's production deploy time from Vercel, recorded by whoever lands it. The read will also report the
on-minus-off difference for surfaces `today` and `mix`, split at T_C. This split is reported only and does not decide
the result. The How adventurous exclusion and the language split stand. This is recorded in docs/DATA-SCIENCE-LOG.md (2026-11-21).

## What was not measured

- Live behaviour.
- Which spare actually fills each place. A lane card has 2 spares and other lanes have 3, so the real reorder can be smaller.
- The exact Today replacements. Today walks a rotation rather than taking the top score.
- Language preferences: the replay treated English as home for all three accounts, because none had chosen languages or saved a region.
- Only 3 accounts have enough Today history (20+ rated films and 4+ Today films in 30 days), and only 5 have reconstructable mix lanes.

## After the 15% limit (main `0019c147e`, rule 2720 amended)

Within a lane, a genre is now capped only when it is under 15% of the person's smoothed library (`MIX_RARE_SHARE`). I
re-ran the same read-only replay on the same 43 lanes, 250 films and 5 accounts. Exposures were frozen at
2026-11-21 12:00 UTC, so this set is the same as the one above.

- **Films moved to spares on "on" days: 40 → 30 of 250 (16% → 12%).** If every day were "on": 53 → 41.
  - `322bf90c`: 14 → 7. Action, Adventure and Crime are no longer capped for them.
  - `646395d0`: 10 → 7.
  - `dded73de`: 2 → 2.
  - `d73ace86`: 5 → 5.
  - `3c73aace`: 9 → 9.
  - The films still moved are Animation, Family, Fantasy, Science Fiction, War, Mystery and Crime, in accounts where those genres are under 15%.
- **Guardrails:** 0 of 4 engaged mix films were displaced, and 0 of 1 liked (4★+) film. This sample is still too small to show the change is harmless.
- **`dded73de`:** animation is 10.2% of her library, under 15%, so it is still capped within a lane.
  - **Per lane:** the most animated films in one lane goes from 2 to 1. The lane with The Iron Giant and Mulan (match 73, ranked 19th and 21st in the row, so neither is among her 5 best) keeps one; the other moves to a spare.
  - **Per row:** the 11-20 slate with that lane goes from 3 to 2 animated of 36. Across both 11-20 responses, it goes from 4 to 3.
  - Each of her other lanes in the 30 days held at most 1 animated film and is unchanged.
