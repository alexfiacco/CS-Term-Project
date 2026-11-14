# Calibrated picks by language: offline measurement

Rule 2080 (amends 2043), build 41, Montage branch `b41-langcal`, commit `93fb6cd0c`. Date: 2026-11-14. Data: read-only SELECTs on the Montage project; accounts named by user-id prefix only.

**What was asked.** The owner approved extending calibration (rule 2043) to language. Then: "if you're based where they speak that language, how do you factor it in?" English is not assumed. Calibration is per language. A person's home languages count as their own share and are never capped.

---

## 1. Short answer

- **It does what was asked on the owner's mother's account.** `dded73de` has 4.3% non-English films in her library. Over the last 30 days her main pick surfaces showed **30.6%** non-English (genre-and-decade calibration as live: 26.9%). With language calibration that becomes **9.0%**. Tonight goes from 29.3% to **8.6%**, and her stored For you top 50 from 46% to **10%**.
- **Across 11 accounts** (main surfaces, last 30 days), the non-English share goes from 39.5% (live: 41.0%) to **22.8%**. The libraries average 6.7% non-English. Language distance (TVD) falls from 0.357 to 0.185, which is −48% against live.
- **Per-language caps alone do not work.** The picks spread over a dozen languages, and each language gets a 5% floor. Without the "all non-home languages together" cap, the mother stays at 26.9% and the mean at 36.1%. The group cap is what does the work.
- **2× does not beat 1.5×.** At 2× the mean is 25.7%, and it is no better on the guardrail (51 vs 52 liked non-English films in the top 50). Language therefore uses the account's own k (start 1.3, 1.5 or 2.0; adaptive range 1.0–3.0), the same as genres.
- **Guardrails it fails or weakens. Read these.**
  - **Liked non-English films in the top 50 (in-sample) fall 30%** against live genre-and-decade calibration (74 → 52), and 20% against no calibration (65). That would fail a 10% bar at 50; no bar was registered there. At 200 the drop is −4% (123 → 118), inside the earlier test's 10% guardrail.
  - **Decade distance gets worse:** 0.244 (live) → 0.291 on the replay. Replacement films come from a stored order that leans old.
  - **The time-split recall@50/200 of the earlier test was not re-run.** Its fold scores lived in a session scratchpad that no longer exists, and refitting model 9 per fold was not redone. The recall numbers below are in-sample on the stored order, not a forward test.
- **No account outside the US could be measured from settings.** No account has a saved region or `home_country`, and the request's country is not stored. One account with a mostly Indian-language library was **simulated** as region IN (section 4).

## 2. What was built

**Home languages.** A person's home languages are the union of two sets:
- what they chose: Settings' Languages, "Also show films in" / onboarding's `home_languages`, minus any language muted on Tune your picks;
- their region's main languages, from a 57-country table (`REGION_LANGUAGES`). Some examples: FR → French; CA → English and French; CH → German, French and Italian; IN → Hindi, English and seven regional languages; HK → Cantonese, Mandarin and English. Every Where to watch region is in the table.

The region is read in this order:
1. the saved `viewingPrefs.region`;
2. else `home_country`;
3. else the request's country (`x-vercel-ip-country`).

English stands in only when no region is known, or when the region is not in the table.

**The caps.** A film in a home language is never capped. Any other film carries two keys: `l:<language>` and `l:~` (all non-home languages together). Each key is capped exactly like a genre: max(k × smoothed library share, 5%). The share is smoothed by 20 films of the Picks pool's share. The pool is 22,033 films: English 65.4%, French 8.1%, Japanese 4.3%, Spanish 3.4%, Italian 2.9%, Hindi 2.2%, and so on. For `l:~`, the pool share is the share outside the person's home languages.

**Same rules as rule 2043:**
- The 5 best matches are never held back.
- Nothing is pushed under the person's own share.
- Films wait; none is removed.
- The 30-day exposure history counts toward the caps.
- About 1 in 10 picks is a discovery pick (a language under 5% of the library counts as "outside the mix").
- Adaptive multipliers per key, and How adventurous's dials.

**Bypasses:**
- A language filter (For you, Browse) and Tonight's language choice leave language alone.
- Everything 2043 already bypasses still bypasses.

**Not calibrated by language:**
- movie night rooms and Tonight with friends (the host's language filter and the members' languages already act there, and rooms could not be measured);
- the reveal, Starter picks and New releases.

## 3. Numbers, before and after, per account

**Method.** The module itself (`lib/calibrate.mjs` as committed) ran on exported data:
- Libraries: rated films from the latest import job plus in-app ratings. `dded73de` has 395 films and `322bf90c` has 398.
- Exposures: `pick_exposures`, last 30 days, rooms left out.
- Stored order: `user_score_vec`, Picks pool, top 700.

**The replay** follows the earlier test. Real exposures are walked in shown order with rolling caps. A pick that is over its cap is replaced by the best unseen stored-score film that fits and scores within 5 points of it. If none exists, the pick is kept.

**Arms:**
- **GD15** is what is live today (genres and decades, k 1.5).
- **L15** adds language (per language plus the group), k 1.5. This is what was built.
- **L20** is the same as L15 with k 2.0 for language.
- **noGroup** is per-language caps only.

Home is English for every measured account: none has a region or a chosen language. The one exception is `d14f1626`, which chose English only.

### 3.1 Main surfaces (Today, weekly, mixes, deck; last 30 days): non-English share shown

| Account | Library | Shown n | Base | GD15 (live) | **L15** | L20 | noGroup |
|---|---|---|---|---|---|---|---|
| `dded73de` (owner's mother) | 4.3% | 134 | 30.6% | 26.9% | **9.0%** | 11.9% | 26.9% |
| `322bf90c` | 3.8% | 112 | 34.8% | 24.1% | **8.0%** | 10.7% | 21.4% |
| `1b73ada1` | 5.9% | 172 | 29.7% | 26.7% | **12.2%** | 15.1% | 24.4% |
| `032e0fd5` | 6.9% | 66 | 33.3% | 42.4% | **13.6%** | 16.7% | 30.3% |
| `d73ace86` | 1.3% | 61 | 54.1% | 44.3% | **13.1%** | 16.4% | 36.1% |
| `e686712b` | 9.8% | 91 | 42.9% | 41.8% | **18.7%** | 24.2% | 35.2% |
| `ac5a0d32` | 5.7% | 73 | 61.6% | 64.4% | **45.2%** | 46.6% | 63.0% |
| `9d78754a` | 13.9% | 98 | 86.7% | 95.9% | **67.3%** | 67.3% | 79.6% |
| `9782716a` | 9.2% | 160 | 33.1% | 35.0% | **33.8%** | 33.8% | 35.0% |
| `da7f90da` | 7.8% | 47 | 17.0% | 29.8% | **17.0%** | 23.4% | 25.5% |
| `dbd4371e` | 5.6% | 55 | 10.9% | 20.0% | **12.7%** | 16.4% | 20.0% |
| **Mean** | 6.7% | | 39.5% | 41.0% | **22.8%** | 25.7% | 36.1% |

Mean distances, shown against library:

| | Base | GD15 | L15 | L20 | noGroup |
|---|---|---|---|---|---|
| Language TVD | 0.346 | 0.357 | **0.185** | 0.210 | 0.307 |
| Genre TVD | 0.312 | 0.272 | 0.271 | 0.272 | 0.267 |
| Decade TVD | 0.275 | 0.244 | **0.291** | 0.283 | 0.258 |

Notes:
- `9782716a` and `9d78754a` barely move: most of their over-cap picks had no replacement within 5 points, so the pick was kept.
- `9d78754a`'s library is mostly Japanese animation, which is the subtitle-tolerant case. It goes 86.7% → 67.3% at both 1.5× and 2×, so 1.5× does not over-correct it more than 2× does.
- Genre-and-decade calibration alone *raises* non-English for some accounts (`032e0fd5`, `da7f90da`, `dbd4371e`). Its replacements are often older or world-cinema films.

### 3.2 Tonight (4 accounts; no mood known, an upper bound)

| Account | Library | n | Base | GD15 | **L15** | L20 |
|---|---|---|---|---|---|---|
| `dded73de` | 4.3% | 116 | 29.3% | 30.2% | **8.6%** | 12.1% |
| `322bf90c` | 3.8% | 53 | 22.6% | 9.4% | **7.5%** | 9.4% |
| `1b73ada1` | 5.9% | 81 | 58.0% | 30.9% | **9.9%** | 13.6% |
| `9782716a` | 9.2% | 48 | 56.3% | 66.7% | **58.3%** | 58.3% |
| Mean | 5.8% | | 41.6% | 34.3% | **21.1%** | 23.4% |

### 3.3 Stored For you top 50 (unseen, 300-film window), all 17 accounts with a stored vector

The mean goes from 43.2% (base) and 43.6% (GD15) to **32.7%** (L15); L20 gives 33.9%. Language TVD goes 0.388 → 0.279.

| Account | Base | GD15 | L15 |
|---|---|---|---|
| `dded73de` | 46% | 34% | **10%** |
| `322bf90c` | 8% | 10% | **8%** |
| `dbd4371e` | 56% | 70% | **30%** |
| `3c73aace` | 56% | 48% | **20%** |
| `d561961e` | 24% | 20% | **8%** |

### 3.4 Guardrails

| | Base | GD15 (live) | **L15** | L20 |
|---|---|---|---|---|
| Liked recall@50, in-sample (hits, 17 accounts) | 346 | 378 | **406** | 402 |
| Liked recall@200, in-sample | 1,005 | 1,037 | **1,053** | 1,054 |
| Liked non-English films in top 200 | 121 | 123 | **118** (−4%) | 117 |
| Liked non-English films in top 50 | 65 | 74 | **52 (−30%)** | 51 |
| Engaged exposures (saved / 3.5★+) the replay would replace | 0 of 17 | 9 of 17 | **9 of 17** | 9 of 17 |

How to read this table:
- "In-sample" means: the stored order re-ranked, seen films included, with liked = 4★+. The stored vector was fitted on these same ratings, so a rise here is not evidence of better recall. It only shows that the re-rank does not push the person's own liked films out of the top of the order.
- The earlier test's guardrails, applied here:
  1. recall@200 non-inferior: holds (in-sample).
  2. recall@50 no worse than −2%: holds (+7% against live, in-sample).
  3. Rare-kind liked recall@200 loses no more than 10%: holds (−4%).
  4. Replay distance falls by 20% or more: holds for language (−48%), with no change in genre distance.
- **Not met:**
  - liked non-English films in the top 50 (−30%; no bar was set at 50);
  - decade distance, which is worse than live (+19%).
- **Not measured:**
  - held-out (time-split) recall, for the reason above;
  - any real behaviour.

## 4. Outside the US (simulated)

**No account could be measured from settings.**
- `public_profiles.home_country` is null everywhere, and so is `viewingPrefs.region`.
- `release_reminders_sent` has US rows only.
- The request's country is not stored.

`09aa21db` has a library that is 61% non-English (Telugu 13, Hindi 10, Tamil 8, Malayalam 4 of 61), so it was run three ways on its stored top 50:

| Region | Home | Non-English in top 50 | Top languages |
|---|---|---|---|
| (base, no calibration) | | 70% | en 30, ja 18, ta 12, zh 10, es 6, ko 6 |
| unknown / US | en | 64% | en 36, ta 14, zh 6, ja 6, es 6, ko 6 |
| **IN** | hi, en, ta, te, ml, kn, bn, mr, pa | 40% | en 60, ta 14, hi 8, zh 2, fa 2, ja 2 |

As IN, the Indian languages are never capped, and Japanese and Chinese are trimmed toward this person's own share.

Honest caveat: English also counts as home under IN, so English rises to 60% of the top 50 against 39% of the library. Home languages are never capped in either direction. Nothing boosts Telugu or Hindi, which the stored order ranks low for this person.

In-sample recall@50 goes 6 → 8 as IN and 6 → 7 as US.

## 5. How rule 2043's evaluation (the Dec 12 read) stays valid

This is written into Montage `docs/DATA-SCIENCE-LOG.md` (2026-11-14, rule 2080) as a pre-registered amendment, before any forward data.

**The design:**
- Language joins the **"on" arm**: the same alternate days per account, the same starting multiplier and the same adaptive range.
- It starts at `LANG_CAL_FROM` = 2026-11-15 00:00 UTC, the evaluation's first day, and never before.
- Every exposure row is stamped `cal_lang`: true when it was served on an "on" day with language calibrated. The column comes from `sql/18-language-calibration.sql`, which is not applied by the build.

**What stays and what changes:**
- The arms, dates, metric, duration, decision rule and the How adventurous exclusion are unchanged.
- The "on" arm now means **calibration as served**: genres, decades and, from the language start, languages.

**Why the comparison stays valid:**
- The arm alternates daily per account, so "on" and "off" rows span the same calendar days.
- A change to the "on" policy that reaches every account at the same moment is balanced across both arms.
- The "off" arm is untouched.

**What it costs:** after the start, the read cannot isolate genres and decades alone. The alternative was to hold language until 2026-12-06. That would have answered a question about a policy that will not keep running, and left the largest measured gap unfixed for three weeks.

**If the build lands after 2026-11-15:**
- "On" rows before the deploy are genre-and-decade only.
- T_L is the first `first_shown_at` with `cal_lang = true`. If sql/18 has not run, T_L is the deploy time from Vercel, written into the log by whoever lands the build.
- The on-minus-off difference is reported separately before and after T_L. This split is not deciding.
- Also reported from T_L: the non-home-language share and language TVD per arm.

## 6. Gates (Montage, branch `b41-langcal`)

| Gate | Result |
|---|---|
| tsc | clean |
| check-invariants | exit 0, no ✗; 2043 amended, 2080 added |
| check-security | ok |
| check-ds-log origin/main | ok |
| Swift | none changed, so no new duplicate types |
| pre-push hook | passed on push |

## 7. To do (owner)

- Run `sql/18-language-calibration.sql`, ideally before 2026-11-15 00:00 UTC.
- Land `b41-langcal` before then too, so the whole evaluation window is uniform.
