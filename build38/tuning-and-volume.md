# "Why do I get so many animated movies?": tuning entry points, genre volume, and real data

Investigation only. No code changes and no database writes. Date: 2026-11-14. Code read at `origin/main` 541cc998 in a detached scratch worktree. Data from live read-only SELECTs on the Montage project. Accounts are identified by user-id prefix only.

## Short answer

1. **Finding the tuning page.** Three static doors lead to *What we've learned*: the Settings row, the ☰ menu row, and a quiet link on your own Taste tab. All three are live on web and iPhone. Nothing in the Picks deck links to it. The deck does have contextual nudges after skips: the "Showing less animation for now" pill, the "Sharpen your picks?" drawer and the "Show fewer Animation?" nudge. But they send people to **Settings › Show less of › Learned this week**, or they apply the change in place. None of them mentions *What we've learned*. There are no pushes, no onboarding step and no empty state for tuning. No rule or mock is named "Picks tab hint". The closest is the walkthrough's "The Picks tab" card (rule 2015), which says "Every rating sharpens your match score" and nothing about tuning.
2. **Watch volume.** **The model does not use genre volume.** The genre feature is a like-rate *within* the genre (rated films at 3.5★ or above, minus the person's base rate), shrunk by 5 films. A genre seen 8 times out of 800 with good ratings gets a *positive* lean, not a penalty. The embedding neighbours of an animated candidate are the few animated films the person rated, so those few ratings drive the personal side for every animated film. Three more things can push animation up:
   - **The crowd side.** Animated canon has high Letterboxd averages.
   - **The language exemption.** "English only" still lets every animated film through (rule 171; browse_v5).
   - **Cold start.** The taste deck and the start rows are full of family classics that parents *have seen* (often with kids) and rate warmly.

   Archetype and Screen DNA strands do not rank Picks. The only exception is the reveal's three "echo" picks. Film-label leans (wonder, playfulness) are inside the model's "dna" group, though.
3. **Real data.** Only 11 accounts have 100 or more rated films, so every number below is small-n. Two kinds of over-serving show up:
   - In **logged picks**, `322bf90c` gets 4.4× its library share of animation (4.7% of library, 20.7% of picks shown, 30% of its Today/weekly picks). `eee3834e` gets 2.8×.
   - In the **For you deck's base order** (stored scores, which are not logged when shown), `dbd4371e` is the outlier. Animation is 4.2% of their library, but 66% of their top 50 unseen films is animated. These are mostly anime and kids' films, with My Little Pony at the top. They are a horror fan, and horror is 0 of their top 50.

   **The likely parents are `2ac1afd6` and `09aa21db`.** They joined 5 hours apart on 2026-09-27, follow each other, and both have mutual follows with the owner. Their libraries are small, undated canon rated through the deck: 23 films, 35% animated (Toy Story 5★, Lion King 5★, Finding Nemo 5★), and 37 films, 14% animated. `2ac1afd6` got animated films as **Today's pick twice** (Spirited Away at 79%, Totoro at 76%). On 2026-11-10 they used the existing contextual path: Not for me on Totoro opened the drawer, and Show less of → Animation was set 22 seconds later. After that no animated film was logged for them. **War, not animation, is the most consistently over-served genre across accounts.**

---

## 1. How people find the tuning page today

The page is *What we've learned* (rule 1780; web `app/_components/LearnedPage.tsx`, iPhone `ios/Montage/Sources/Features/Account/LearnedScreen.swift`). It is two days old (2026-11-12). **No account has removed a lean on it yet**: `viewingPrefs.learnedOff` is empty on all 23 profiles. One account has added a boost. Two accounts have any Show less of kind.

### Doors that open *What we've learned*

| # | Where | Web | iPhone | When / how often | Live? |
|---|---|---|---|---|---|
| 1 | Settings › **Tune for you**, first row: "What we've learned" over a preview line (the first four "into" chips, or "Rate N more to see what we've learned" under 15 rated) | `ProfileMenu.tsx:1150-1151` → `LearnedSetting.tsx:22`; `openLearnedPage("settings")` at `ProfileMenu.tsx:102,621` | `AccountScreens.swift:798` `LearnedSettingRow(route: .learned)`, `:113` | Always, for any signed-in account. Two taps deep (☰ › Settings) | Yes (rules 1597, 1780) |
| 2 | ☰ menu row "What we've learned" under Settings, with this week's count and a blue first-time dot while signals exist | `ProfileMenu.tsx:847-851` | `AccountScreens.swift:67` | Always. The dot shows until the row is opened once (`mtg_tuned_seen`) | Yes (rule 1783) |
| 3 | Your own profile › Taste tab, a quiet "What we've learned ›" under Screen DNA | `Result.tsx:933-935` dispatches `OPEN_WE_LEARNED_EVENT`; `MyProfileButton.tsx:68-69` opens it | `ProfileScreen.swift:539-542`, a sheet at `:240-241` | Always on your own profile, at the bottom of the DNA block | Yes (rule 1780) |

### Picks-deck paths: contextual, but none reaches *What we've learned*

| # | What | Code | Trigger and frequency | Where it leads |
|---|---|---|---|---|
| 4 | **"Showing less animation for now"** pill with Undo | `PicksFeed.tsx:1373-1406, 1538-1552`; `lib/day-signals.ts:27-61`; iPhone `DaySignals.swift:442-530` | For you tab only. Shows when a genre's or lane's *day* weight reaches −1.3 or lower. Each Not for me adds −1.0 and each swipe-past −0.3; swipe-pasts count only once 3 of today's films share the facet. The weight halves every 24 h. Two animated Not-for-mes in a day, or about 5 animated swipe-pasts, trigger it. Shows for 5 s, once a day per facet. | Tapping the words opens **Settings › Show less of › Learned this week** (web `OPEN_LEARNED_EVENT` → `MyProfileButton.tsx:63`; iPhone `PicksScreen.swift:172` → `SkipChipsSheet`). |
| 4a | "See what Picks has learned ›" under the pill | `PicksFeed.tsx:1390-1395, 1550`; `DaySignals.swift:442-445, 526-527` | **Once ever** per account (`mtg_learn_hint_seen`), on the first pill | Same: Show less of, not the page |
| 4b | Promotion to lasting: "Showing less animation from now on" | `PicksFeed.tsx:1412-1427`; `day-signals.ts:44-46` | 3 Not-for-mes sharing the genre within 14 days. Not repeated for 30 days | Writes `viewingPrefs.notMine` directly |
| 5 | **"Sharpen your picks?"** drawer after Not for me | `HideAsk.tsx:11-24, 38-60`; `lib/not-for-me.ts:6-20, 48-60`; iPhone `HideAsk.swift:224-240` | The **first** Not for me ever on a film with kinds. Once per account (`mtg_nfm.drawn`) | One tap on "Animation" saves Show less of. No link to the page |
| 6 | **"Show fewer Animation?"** with "You've passed on 2 animation" | `HideAsk.tsx:97-108`; `not-for-me.ts` `NFM_DAYS` 60; `HideAsk.swift:293` | A second Not for me of the same kind within 60 days. At most once a session, never again after "Not now", none after 3 Not-nows | Show fewer saves Show less of. No link |
| 7 | **"Show fewer Horror?"** with "You keep skipping Horror" (soft tells) | `HideAsk.tsx:129-132`; `lib/soft-tells.ts:21-36`; `HideAsk.swift:179-189` | Weekly swipe-past patterns until the facet's match offset reaches −4 (`SOFT_ASK_AT`). Then quiet for 30 days | Show less of. No link |
| 8 | Film drawer (Your match): "−2 from recent skips of Horror · Learned this week"; "We're showing fewer westerns. Show westerns again" | `HiddenNote.tsx:30-77`; `Result.tsx:3987-3989` | Only when a soft tell or a Show less of kind applies to that film | Show less of (Learned this week), or undo in place |

There is no separate **"Not interested" / "Less like this"** action on the Picks card. The stub's third answer is **Not for me** (rule 368; `PicksFeed.tsx:1835-1838`), which hides the film and feeds rows 4 to 6. "Not interested" exists only on Taste Mix slides (`Reel.tsx:517`). That route also feeds HideAsk.

### Not present

- **Onboarding.** "Anything you'd rather skip?" was taken out of the first run on 2026-11-12 (rule 1567; `HomeShell.tsx:2271-2272`; `MontageApp.swift:449-452`). It is now asked "in context, after a Not for me".
- **The walkthrough.** The Picks card reads "The Picks tab · Picks that learn you · Every rating sharpens your match score" (`WelcomeTour.tsx:325-326`, `WelcomeTour.swift:39-40`, rule 2015). This is the nearest thing to a "Picks tab hint". It says nothing about Not for me or tuning.
- **Picks coach marks.** Only "Swipe up for the next film" and the popcorn (`PicksFeed.tsx:282-326`).
- **Pushes and emails.** No push or email template mentions learned, Tune or Show less.
- **Empty states.** None point to tuning. Under 15 rated, the page itself shows the steps.

**So, is there a contextual nudge after several skips of one genre? Yes, three of them** (rows 4, 6 and 7). It worked for one parent (section 3.3). The gaps:

- The strong nudges need the explicit **Not for me**. Plain swiping only feeds the temporary day pill and the slow weekly soft tell.
- None of them names or links *What we've learned*. They teach "Show less of", and people never learn that the page exists.
- The pill lasts 5 seconds and shows on For you only. Its "See what Picks has learned ›" shows once in the account's life.
- Today's pick, the weekly picks and Taste Mixes have no pill.

---

## 2. Does the model use watch volume by genre?

**No.** The match score is model 9 (`lib/taste/match-model.mjs`), a per-person logistic fit of "rated 3.5★ or above". It is ranked into a 0–100 stored score in `user_score_vec`, which the For you deck reads in that order through `browse_v5` (`app/api/browse/route.ts:640-700`). Its genre input:

```js
// match-model.mjs:529-546  (v3Stats): per-genre [likes, count] over rated films
genre: tally((x) => x.genres ?? []),
// match-model.mjs:708-717  (v3Aff): like-rate minus base rate, shrunk by `shrink` films
s += (likes - cnt * p) / (cnt + shrink);
// match-model.mjs:738-744  (v3Features): genreX = v3Aff(..., 5) or, with 8+ near films sharing a genre,
genreX = simGenreAff(gNear.map((j) => ({ s: m.sims[j], like: st.like[j] })), st.p) ?? genreX;
```

The feature measures **how often you like the genre**, not how often you watch it. Example: 800 rated, 8 animated, 7 of them liked, base like-rate p = 0.6. Then genreX = (7 − 4.8)/(8 + 5) = **+0.17**, a mild *lift*. Animation's 1% volume never enters the calculation. A rarely watched genre is pushed down only if its few films were rated *below* the person's usual. Three other channels let a few good animated ratings reach every animated candidate:

- **kNN on embeddings** (`knnLocal` and `knnBase`, 25 nearest with weights sim³). Animated films cluster in embedding space, so an animated candidate's nearest rated films *are* the handful of animated ones, and their residuals decide it. For `dbd4371e`, Onward is rated 4★ against a crowd of 3.32, a +0.68 residual.
- **The crowd side** (the 65/35 blend, capped at 30% by `V9_SHARE_CROWD`). Ghibli, Pixar and Spider-Verse average 4.0–4.4 on Letterboxd. Model 9 centres the crowd on the person's nearest films, but where those neighbours are animated canon that centre is high too.
- **labelLean** (the "dna" group, `V9_SHARE_DNA` 0.286). Film labels such as wonder and playfulness are learned from the person's ratings, and animated films score high on them.

**Volume was tried once and switched off.** The decade affinity (rule 1024) had an exposure term, "log of their share of rated films in the decade, blended with a typical library" (`match-model.mjs:565-616`), with `DECADE_AFFINITY = false`. Backtest (`CS-Term-Project/decade-affinity-report.md`): exposure's fitted weight was 0.02–0.06★ per log-share, and it "adds nothing measurable on top". The owner's own words, quoted in the code comment: "someone who has 30 films rated and no older films doesn't mean they won't like old films". That test scored **rating accuracy**, and it is the wrong test for this complaint (section 4c).

**Other effects that inject animation:**

- **The language exemption** (rule 171). Settings' languages keep animation "in any language (dubbed)". `browse_v5`: `p_languages is null or f.original_language = any(p_languages) or f.original_language = 'xx' or genres @> array['Animation']` (database function). Also `app/api/browse/route.ts:400-412`, `lib/candidate-pool.ts:795`. For the one English-only account (`d14f1626`, 1.1% animated library), **7 of the 10 non-English films it was shown were animated** (Perfect Blue, Mononoke, Whisper of the Heart, Look Back, Your Name, Howl's, A Silent Voice). Animation was 12.5% of what it was shown, 11× its library share.
- **Cold start.** "Rate films you love" has an Animation row, 18 films and one of seven genre rows (`app/api/start-films/route.ts:19-27`). "Everyone's seen these" has 4 animated films in 36 (`lib/taste-test/big-ones.ts`). 17 of the 232 deck probes are animated (`lib/taste-test/probes.ts`), and Spirited Away seeds "Animation Devotee". Parents have *seen* Toy Story and The Lion King, so they rate them, warmly. With 23 rated films, 8 animated is a 35% library, and the model reads it as taste. The cold-start shrink (`SHRINK_K` 30, rule 1080) pulls the *weights* toward the population. It doesn't stop the knn neighbours of an animated candidate from being those 8 films.
- **Archetype.** "Animation Devotee" is gated by its share (8% or more, and 1.5× the average) plus 3 loved animated films (`lib/taste/unified/report.ts:128-139, 208-216`). It only labels the person. It isn't a ranking feature, apart from the reveal's three echo picks (`lib/weekly-picks.ts:622-660`). The parents are Lovestruck and Hardboiled. Screen DNA strands affect rank only when the person removes or adds one on the page (rule 1781, `learned-leans.ts:138-144`, 4 points, capped at 8). **No family or kids strand exists.** "animation_devotee" maps to the "heart" family only for copy (`unified/model.ts:147`).
- **The taste layer** (`lib/taste/taste-layer.ts:7-31`) is shadow only, logged to `match_predictions.taste_layer*`, and changes nothing.
- **What does push a genre down:** Show less of costs 10 rank points (`SKIP_ONE`, `pick-demotions.ts:61`) and never touches the %. The less-of patterns need 8 or more hidden films (`less-of.ts:16-23`), the day signals last days, and soft tells are capped at −7. All of these need the person to act first.

---

## 3. Real data

### 3.1 Where shown picks are logged

| Table | Rows | What it covers |
|---|---|---|
| `pick_exposures` | 4,385 | Today's pick (`today`), the weekly picks (`weekly`, `top`), Taste Mixes (`mix`), Tonight, and movie-night rooms (`room`, left out below). Has outcome, position and match. |
| `match_predictions` | 274 | Ratings from the app, the grid and RSS, against the shown %. Not a shown-picks log. |
| `film_reads_shown`, `tonight_shown` | 75, 18 | Too small to use |

**The For you deck itself (`/api/browse`) is not logged anywhere.** To approximate it, I rebuilt each account's **base order** from `user_score_vec` with browse_v5's own pool filter: movies, 3,000+ logs, no documentaries, TV movies or concert titles, unseen and not on the watchlist. The top 50 of that order is what the deck deals from before day signals, Show less of, variety (`capRuns`, which reorders and doesn't change the share) and the era mix. Of that pool, 7.1% is animated.

### 3.2 Animation, accounts with 100+ rated (all 11)

The ratios are shown share divided by library share. "Picks shown" is every `pick_exposures` row except movie-night rooms, all time.

| Account | Rated | Library animation | Picks shown animation | Ratio shown | For you top 50 (stored) | Ratio top 50 |
|---|---|---|---|---|---|---|
| `322bf90c` | 528 | 4.7% | 20.7% (30-day 27.2%; Today/weekly 11 of 37) | **4.40** | 10% | 2.13 |
| `eee3834e` | 149 | 7.4% | 20.4% | **2.76** | 6% | 0.81 |
| `e686712b` | 337 | 9.6% | 16.0% | 1.67 | 4% | 0.42 |
| `ac5a0d32` | 300 | 18.0% | 28.0% | 1.56 | 28% | 1.56 |
| `9d78754a` | 253 | 15.9% | 24.6% (Today/weekly 12 of 29) | 1.55 | 30% | 1.89 |
| `1b73ada1` (owner) | 1,093 | 12.3% | 11.5% | 0.93 | 0% | 0 |
| `d561961e` | 578 | 23.7% | 12.3% | 0.52 | 4% | 0.17 |
| `dbd4371e` | 236 | 4.2% | 1.8% | 0.43 | **66%** | **15.7** |
| `032e0fd5` | 956 | 3.4% | 1.4% | 0.41 | 0% | 0 |
| `da7f90da` | 128 | 6.3% | 2.1% | 0.33 | 0% | 0 |
| `9782716a` | 228 | 25.0% | 2.2% | 0.09 | 0% | 0 |

- **Distribution of the shown ratio:** min 0.09, quartile 0.41, **median 0.93**, upper quartile 1.67, max 4.40. 5 of 11 accounts are above 1.
- **Worst ten by shown ratio:** `322bf90c`, `eee3834e`, `e686712b`, `ac5a0d32`, `9d78754a`, `1b73ada1`, `d561961e`, `dbd4371e`, `032e0fd5`, `da7f90da`. With 11 accounts this is nearly everyone. The real signal is the top two, plus `dbd4371e` on the deck measure.
- **`dbd4371e` looks like a second, separate bug.** It is a Midnight Cultist with 49% horror in the library. Its stored mean is **63 for animated films and 31 for horror**, and 44.5% of its films stored at 85 or above are animated. The top 20 includes My Little Pony: Rainbow Rocks (96), Ponyo, Aladdin, Mulan and Kiki's Delivery Service. The 10 animated films it rated are mostly 4★, against an overall mean of 3.93★. Its *logged* picks are 61% horror, because Taste Mixes and the weekly picks use their own lanes. Its For you deck is very likely mostly animation and family. A volume prior would only partly fix this (−2.4 points by the formula in section 4c). The cause, probably the crowd centre or the label lean on a horror-heavy library, needs its own look.
- **Under 100 rated:** `d14f1626` (94 rated, English only) has 1.1% animation in its library and 12.5% in its shown picks, about 11×. The cause is the language exemption above.
- **Outcomes.** Accounts whose library is under 5% animated were shown 87 animated picks with **0 positive outcomes** (watchlisted or rated 3.5★ or more). The same accounts' 611 other picks had 2.0% positive outcomes. That is suggestive and not significant at this n. For accounts at 12% or more animated, the rates were 2.2% for animated and 3.7% for everything else.
- **Rating accuracy is not the problem.** In `rating_predictions`, animated films the low-share accounts *chose* to rate scored 4.10★ when predicted at 75 or above, against 4.24★ for other films (n = 5 and 112). People rate fine what they pick. The cost is the slot spent on films they won't pick.

### 3.3 The likely parents: `2ac1afd6` and `09aa21db`

Why they look like a pair:

- Profiles created on 2026-09-27 at 02:20 and 07:39 UTC.
- `09aa21db` followed `2ac1afd6` on the day of joining. The follow back came on 2026-11-05.
- Both have mutual follows with the owner `1b73ada1`.
- Both set the same preference, `noOlder`.
- Both libraries contain only widely seen canon, with no rating dates.

This is circumstantial. Nothing in the data names them.

| | `2ac1afd6` | `09aa21db` |
|---|---|---|
| Rated (library) | 23 | 37 |
| Animated in library | 8 (35%): Toy Story 5★, Lion King 5★, Finding Nemo 5★, Ratatouille 4★, Shrek 4★, Spider-Verse 4★, Coraline 3.5★, Frozen 3.5★ | 5 (14%): Spider-Verse 4★, Frozen 3.5★, Lion King 3★, Nemo 2.5★, Your Name 2.5★ |
| Picks shown, animated (excluding rooms) | 18.9% (Today/weekly/top: 7 of 26) | 13.7% |
| Movie-night rooms, animated | 10 of 28 | n/a |
| Stored For you top 50 / top 200 animated | 12% / 17.5% | 12% / 10% |
| Share of stored-85+ films that are animated | 21.7% | 11.6% |
| Stored mean, animated vs all | 50.3 vs 44.8 | 47.6 vs 45.3 |
| Archetype | Hardboiled | Lovestruck |
| Show less of | **animation** (set 2026-11-10) | none |
| Last pick logged | 2026-11-10 | 2026-09-28 |

How `2ac1afd6` found the control:

- Today's pick was **Spirited Away (79%) on Nov 5** and **My Neighbor Totoro (76%) on Nov 10**.
- In the week of Nov 2, 10 of 31 Taste Mix films were animated: Tangled, The Princess and the Frog, Anastasia, Mulan, Beauty and the Beast, among others.
- On Nov 9–10 they passed Your Name, Princess Mononoke, Howl's, Klaus, A Silent Voice, Wall-E and The Iron Giant.
- At 23:44:08 UTC on Nov 10 they hit Not for me on Totoro. That was their first ever, so "Sharpen your picks?" opened (`mtg_nfm.drawn`). At 23:44:30 they hit Not for me on Whisper of the Heart, and `notMine: ["animation"]` was set.
- Nothing animated has been logged for them since. They have not been back to the app since.

**The contextual path worked, but only after 6 weeks and on a tap the person had to discover.** It never named *What we've learned*.

Their "volume" is itself the problem. The library says 35% animation because the deck offered the family classics they had seen. A volume prior on that library would *protect* animation for them. For them the fix belongs at cold start (section 4b).

### 3.4 Other genres (shown ratio and stored top 50, 100+ accounts)

- **War is the most consistently over-served genre.** It is 2–4% of each library and 3.2% of the pool. Shown: `1b73ada1` 8.9% (3.2×), `9782716a` 10.8% (3.1×), `eee3834e` 5.1% (3.9×), `ac5a0d32` 6.5% (2.8×), `9d78754a` 5.7% (2.4×), `322bf90c` 5.4% (2.2×). In the stored top 50: `da7f90da` 22% (9×), `9782716a` 18% (5×), `1b73ada1` 16% (6×), and `e7f6a30e` 28% (rated under 100). This is probably the crowd side, since war canon such as Come and See averages very high.
- **Romance** is over-served for `ac5a0d32` (6.7% → 16.1%) and `e686712b` (6.6% → 17.0%). Otherwise it is close.
- **Family** follows animation: `322bf90c` 7.0% → 14.7%, and the `dbd4371e` top 50 is 68% family.
- **Horror** is *under*-served almost everywhere. `e686712b` goes from 18.2% to 1.1%. `dbd4371e` gets 0 in its top 50 despite a 49% library.
- **Documentary** is 0 shown, because browse_v5 excludes documentaries unless asked for, and the weekly picks do too. It can't be over-served.
- **Music and musicals** run 0–7%, about equal to the library, except concert films with stored scores of 94–96. browse_v5's title filter catches those.
- **Western** is 0–5%, small and noisy.

---

## 4. Proposals (text only)

### (a) A better page title

Recommend **"Tune your picks"**. It is a verb the person can act on, it uses the section's own word ("Tune for you"), and it matches the Picks tab. Keep "What we've learned" as the page's first section heading, above the summary line, so the meaning survives. Rule 1780 and rule 2031 pin the title, and rule 1783 pins the menu row label, so this needs an owner amendment and a mock first. Runners-up: "Your picks, tuned" (passive) and "Tune what you see" (vague).

### (b) Surface tuning in the Picks deck

1. **A one-time card in the deck, not a 5-second pill.** When the day weight for a genre or lane reaches −1.3 or lower (today's pill trigger), or after 3 skips of one genre within 10 cards, deal one card in the next slot:

   > **Seeing too much animation?**
   > [Show less ›]   Not now
   > *Tune your picks ›*

   **Show less** applies `changeNotMine(["animation"])` in one tap, with the toast "Showing less animation from now on" and Undo, which is the existing promotion path. *Tune your picks ›* opens the page itself, not Settings › Show less of. "Not now" quiets that genre for 30 days (`notePromoted`). Show it at most once per genre, and at most one card per session. This needs the same card on iPhone (`DaySignals.swift`).
2. **Count swipe-pasts too.** The Not for me drawer and nudge (`not-for-me.ts`) only fire on the explicit tap. Parents swipe. Let 4 or more swipe-pasts of one genre within 12 cards (with `DAY_SEEN_MS` met) offer the same card.
3. **Point every existing exit at the page.** The pill's "See what Picks has learned ›", the HideAsk drawers and the film drawer's "Learned this week" should open *Tune your picks*, where Less of this already lists Show less of and the soft skips. Today they open Settings › Show less of, so the page stays undiscovered.
4. **Cover Today's pick and the weekly picks.** A Not for me on Today's pick is the strongest single "not this" the app gets. It should feed the same card.
5. **Cold start (for the parents' case).** In the deck and the start rows, ask **"Seen it with kids?"** on Family or Animation cards. If yes, record the film as seen (so it is never suggested) and leave it out of the taste fit. This matches the Seen-it-but-not-for-me idea. It needs owner approval and a mock.

### (c) A volume-based prior, measured before shipping

**Shape: rank points, not the match %.** This keeps rules 1417 and 1570, "never the match %", and slots in beside `skipRankPoints`.

For a person with **N ≥ 150 rated** (above `V9_SHARE_MIN_RATED` 100, so the library is not mostly the deck), and each of the kind genres (Animation, Horror, Family, War, Western, Music, Romance, Science Fiction, Fantasy):

```
smoothed share  s̃_g = (count_g + K · c_g) / (N + K)       K = 50 films of catalog share c_g (pool share, e.g. animation 7.1%)
ratio           r_g = s̃_g / c_g
points_g        = clamp( P · log2(1 / r_g), 0, CAP )    P = 4 per halving, CAP = 10 (one Show less of step)
film's points   = max over the film's kind genres (never summed)
```

Downweight only. A genre watched at or above the catalog rate gets 0, never a boost. The owner's decade comment ("doesn't mean they won't like") argues for a cap, not a ban. Worked numbers:

| Library | s̃ | r | Points |
|---|---|---|---|
| 8 animated of 800 (the "1%" case) | (8 + 3.55)/850 = 1.36% | 0.19 | **9.6** (about one Show less of) |
| 40 of 800 (5%) | 5.1% | 0.72 | 1.9 |
| 57 of 800 (7.1%, catalog rate) | 7.1% | 1.0 | 0 |
| `322bf90c`: 25 of 528 animated | (25 + 3.55)/578 = 4.9% | 0.70 | 2.1 |
| `dbd4371e`: 10 of 236 animated | 4.7% | 0.66 | 2.4 (does not fix it, see 3.2) |
| `1b73ada1`: war 31 of 1,093 | (31 + 1.6)/1,143 = 2.85% | 0.89 | 0.7 |

Honest read: at these settings the prior is a strong correction only for really rare genres (under about 2%). It is small for the accounts in section 3, which argues for testing P = 6 as a second arm. It does nothing for under-150 accounts like the parents. Their fix is (b).

**How to measure it before shipping (pre-registered, in the style of model 7 and the decade affinity).**

Why the usual check doesn't fit: a rating-accuracy backtest (`scripts/eval-time-split`) will likely show nothing again, as it did for decade exposure. A rank-only change never moves a predicted %, and people rate fine the films they choose. The claim to test is about **choice**: the prior should rank higher the films the person later went on to watch.

1. **Prerequisite: log the deck.** Add `surface: "foryou"` exposures from `/api/browse` (`recordExposuresLater`, the same row shape as the other surfaces). Until then, For you can't be measured.
2. **Primary metric: offline time split** (frozen before any number is seen).
   - Accounts with 150 or more rated, which today is 7. For each, hold out the last 20% of rated films by watch date.
   - Fit the model on the first 80% (the existing `eval-time-split` dump).
   - Rank the browse_v5 pool, unseen as of the split, with and without the prior.
   - Metric: **recall@200 and NDCG@200 of held-out films later rated 3.5★ or above**. A film the person went on to watch and like counts as revealed demand.
   - Pooled, with 95% bootstrap intervals resampled **by account**, plus "N of 7 accounts better".
   - Ship bar: the recall@200 change has a 95% upper loss bound under 2% relative, **and** pooled genre divergence improves by 25% or more.
   - Genre divergence = mean over kind genres of |log(top-50 share / s̃_g)|.
3. **Guardrails.**
   - Held-out liked films *in* the downweighted genres must not lose more than 10% recall@200. This protects the real animation lover with 12% animation (the owner's "Wheres my animation").
   - Stored scores and shown % must be unchanged (bit-identical), because the prior is rank only.
4. **Arms.** P = 4 and P = 6, K = 50, N at 150 or more. Two arms only, named before the run. No tuning on the test half: choose the arm on folds 1–3 and report folds 4–5, as the decade affinity did.
5. **Forward check after shipping (2 weeks, shadow first).**
   - Log the prior's points per shown film into `match_predictions.taste_layer_parts` (or a new `volume_points`) without applying them, as the taste layer does now.
   - Compare outcomes of high-points films (shown but would have been pushed down) against the rest: pass/hide rate against watchlist/rate.
   - The current data has 87 animated exposures and 0 positive outcomes for low-share accounts. That is the effect to confirm with real n.
6. **Report.** A dated entry in `docs/DATA-SCIENCE-LOG.md` (before → after, the numbers, the data touched), an invariant for the formula and its constants, and `docs/app` copy for wherever the page explains it.

**What was not measured:**

- The real For you deck slates. Only the stored base order was rebuilt.
- The effect of day signals and variety on share.
- The pill, drawer and nudge show rates. These are client-only and not logged.
- Anything from the iPhone that differs from web. Swift was read but not run.

The parent pairing is inferred from join time, follows and settings, and isn't confirmed.
