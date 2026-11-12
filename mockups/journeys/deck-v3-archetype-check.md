# Deck v3 archetype check: does onboarding on the new deck name the right archetype?

Date: 2026-11-12. Read-only replay. No app code changed, nothing written to the database. Inputs: `onboarding-deck-v3.json`, the live deck (`lib/taste-test/probes.ts`), and SELECT-only exports from Supabase `uktamekqqsiijugpaxit`. Members appear as P01 to P23 (most rated first); no names, handles or emails.

## Verdict

**No better than the live deck, and neither is good.** On the 12 members whose libraries came from a Letterboxd import, deck v3 names the full-library archetype for 3 of 12 at 15 rated, 2 of 12 at 20 and 3 of 10 at 30. The live deck gets 3, 2 and 1. A difference of one or two members is noise at this sample size. Two things are real:

1. **v3 loses the streak.** The first streak matches for 1 member in 12 at every stop (live deck: 3 to 4).
2. **v3 reaches 15 rated sooner than the live deck as shipped**: 42 cards on average against 56 (median 31 against 64), because it does not adapt toward classics and world films.

The misses have clear, fixable causes (section 4). Seven card moves, tried on the same members, lift v3 to 4, 5 and 6 of 11 to 12 (section 5). That result is tuned on the people it is scored on, so read it as a direction only.

## 1. How this was measured

- **The read is the app's own code.** The archetype shown at the reveal comes from the one taste model (`lib/taste/unified/`, called by `computeProfile` through `unifiedIdentity`). The replay runs that code unchanged (`computeReport`, `readFilmsWith`) in a scratch copy of the repo with no database keys, on exported JSON. The feature classifier in `lib/taste/archetypes.ts` is only the fallback under 10 rated films and is not what a 15-card reveal shows.
- **Full-library archetype (the target):** each member's whole library (import plus in-app ratings, Canon, watched-only films) read against norms rebuilt from all 23 libraries. It gives the stored live name for 21 of 23 members.
- **Onboarding read:** only the member's ratings on deck cards, in the order the deck serves them. A card they have not rated is a "Haven't seen". Read at 15, 20 and 30 rated, with no Canon, hearts or rewatches, against first-deck averages built by replaying the same deck at 30 on the 17 members with 60+ rated films (as the nightly run does). For the live deck these averages equal the ones `computeReport` produces itself.
- **Decks:**
  - Live deck as shipped: 293 cards, seed 15, then `adaptDeck` after every answer (the repo's own `deckOf`).
  - Live deck in curated order only, to separate the cards from the adapting.
  - Deck v3 in its own order: 224 cards, seed 15, then the order in the JSON.
  - Deck v3 with `adaptDeck`: approximate. 74 v3 cards have no baked lanes or archetype tags yet, so they got lanes from language, year and the deck's own label.
  - Language side decks are not replayed. No member has a language set, and almost none has rated those films.
- **Match definitions:** primary match = same name. Primary in top 2 = the full-library name is the onboarding name or its first streak. Streak match = same first streak (both having none counts).

**Limits, stated plainly:**

- **The sample is 23 members, and only 12 are a fair test.** The other 11 have small libraries made mostly of live-deck cards (6 are taste-test profiles). For them the live deck replays its own ratings and v3's new cards read as unseen, so table B flatters the live deck. Table A is the honest comparison, and at 12 people each member is 8 points.
- **The target is itself soft.** A full-library name is often the lead of a close mix: the named archetype holds 8% to 28% of what these members love. A swap inside a family (Nihilist for Hardboiled) is a small error; a different family is a large one.
- **Known baseline:** `docs/TASTE-MODEL.md` records that a random 20 of a member's own films gave the full name 31% of the time and 30 gave 46%. Fifteen to thirty cards cannot be expected to reach much more than that.
- **"Not rated" is not "not seen".** Libraries undercount what people have watched, so the card counts in section 3 are upper bounds.
- v3's seed is not the live seed. It swaps six cards: Titanic, Fight Club, Top Gun: Maverick, 2001, Oppenheimer and Forrest Gump replace La La Land, Se7en, The Dark Knight, Drive, The Social Network and Good Will Hunting.

## 2. Agreement with the full-library archetype

**A. The 12 members with an imported library of 100+ rated films**

| Deck | Stop | Members | Primary match | Primary in top 2 | Streak match |
|---|---|---|---|---|---|
| Live deck, as shipped (adaptive) | 15 | 12 | 3/12 (25%) | 5/12 (42%) | 4/12 (33%) |
| Live deck, as shipped (adaptive) | 20 | 12 | 2/12 (17%) | 5/12 (42%) | 3/12 (25%) |
| Live deck, as shipped (adaptive) | 30 | 11 | 1/11 (9%) | 3/11 (27%) | 4/11 (36%) |
| Live deck, curated order only | 15 | 12 | 4/12 (33%) | 4/12 (33%) | 3/12 (25%) |
| Live deck, curated order only | 20 | 12 | 3/12 (25%) | 4/12 (33%) | 4/12 (33%) |
| Live deck, curated order only | 30 | 11 | 2/11 (18%) | 5/11 (45%) | 2/11 (18%) |
| Deck v3, its own order | 15 | 12 | 3/12 (25%) | 5/12 (42%) | 1/12 (8%) |
| Deck v3, its own order | 20 | 12 | 2/12 (17%) | 4/12 (33%) | 1/12 (8%) |
| Deck v3, its own order | 30 | 10 | 3/10 (30%) | 4/10 (40%) | 1/10 (10%) |
| Deck v3 + adaptDeck (approximate) | 15 | 12 | 1/12 (8%) | 4/12 (33%) | 2/12 (17%) |
| Deck v3 + adaptDeck (approximate) | 20 | 12 | 1/12 (8%) | 3/12 (25%) | 1/12 (8%) |
| Deck v3 + adaptDeck (approximate) | 30 | 10 | 1/10 (10%) | 2/10 (20%) | 1/10 (10%) |
| Deck v3 with the section 5 tweaks, fixed order | 15 | 12 | 4/12 (33%) | 5/12 (42%) | 3/12 (25%) |
| Deck v3 with the section 5 tweaks, fixed order | 20 | 12 | 5/12 (42%) | 6/12 (50%) | 2/12 (17%) |
| Deck v3 with the section 5 tweaks, fixed order | 30 | 11 | 6/11 (55%) | 7/11 (64%) | 3/11 (27%) |

**B. All members who reach the stop (includes libraries made mostly of live-deck cards)**

| Deck | Stop | Members | Primary match | Primary in top 2 | Streak match |
|---|---|---|---|---|---|
| Live deck, as shipped (adaptive) | 15 | 22 | 6/22 (27%) | 9/22 (41%) | 6/22 (27%) |
| Live deck, as shipped (adaptive) | 20 | 22 | 5/22 (23%) | 11/22 (50%) | 5/22 (23%) |
| Live deck, as shipped (adaptive) | 30 | 18 | 5/18 (28%) | 9/18 (50%) | 6/18 (33%) |
| Live deck, curated order only | 15 | 22 | 7/22 (32%) | 10/22 (45%) | 8/22 (36%) |
| Live deck, curated order only | 20 | 22 | 8/22 (36%) | 11/22 (50%) | 8/22 (36%) |
| Live deck, curated order only | 30 | 18 | 6/18 (33%) | 10/18 (56%) | 4/18 (22%) |
| Deck v3, its own order | 15 | 22 | 5/22 (23%) | 8/22 (36%) | 2/22 (9%) |
| Deck v3, its own order | 20 | 18 | 4/18 (22%) | 7/18 (39%) | 1/18 (6%) |
| Deck v3, its own order | 30 | 14 | 3/14 (21%) | 5/14 (36%) | 1/14 (7%) |
| Deck v3 + adaptDeck (approximate) | 15 | 22 | 4/22 (18%) | 9/22 (41%) | 4/22 (18%) |
| Deck v3 + adaptDeck (approximate) | 20 | 18 | 3/18 (17%) | 7/18 (39%) | 1/18 (6%) |
| Deck v3 + adaptDeck (approximate) | 30 | 14 | 1/14 (7%) | 3/14 (21%) | 1/14 (7%) |
| Deck v3 with the section 5 tweaks, fixed order | 15 | 22 | 7/22 (32%) | 9/22 (41%) | 4/22 (18%) |
| Deck v3 with the section 5 tweaks, fixed order | 20 | 19 | 7/19 (37%) | 8/19 (42%) | 3/19 (16%) |
| Deck v3 with the section 5 tweaks, fixed order | 30 | 15 | 7/15 (47%) | 9/15 (60%) | 4/15 (27%) |

- **Adapting hurts agreement in this replay.** On both decks the adaptive order scores lower at 20 and 30 than the fixed order. After a loved 12 Angry Men or Parasite it serves a run of classics and world films, and members with large libraries have rated many of them, so the read turns into Old Soul or Globetrotter (P02, P03, P06, P08).
- More cards do not help on either deck. Agreement is flat or falls from 15 to 30.

Per member (bold = primary match):

| Member | Rated | Full library | Live deck @15 | Live deck @30 | v3 @15 | v3 @30 | v3 tweaked @30 |
|---|---|---|---|---|---|---|---|
| P01 | 1073 | Nihilist + Lovestruck | Hardboiled + Lovestruck | Hardboiled + Lovestruck | Hardboiled | **Nihilist + IMAX Idealist** | **Nihilist + Lovestruck** |
| P02 | 863 | Lovestruck + Old Soul | Old Soul + Lovestruck | Old Soul | Comic Relief + Aesthete | Old Soul + Nihilist | Nihilist + Lovestruck |
| P03 | 555 | Animation Devotee + IMAX Idealist | Nihilist + Tenderhearted | Globetrotter + Nihilist | IMAX Idealist + Nihilist | IMAX Idealist + Nihilist | IMAX Idealist + Midnight Cultist |
| P04 | 425 | Tenderhearted + Lovestruck | **Tenderhearted + Lovestruck** | Lovestruck + Tenderhearted | **Tenderhearted + IMAX Idealist** | Lovestruck + Hardboiled | Lovestruck + Midnight Cultist |
| P05 | 384 | Lovestruck + Hardboiled | Hardboiled + Tenderhearted | Voyager + Hardboiled | Hardboiled + Voyager | Hardboiled + Voyager | Hardboiled + Tenderhearted |
| P06 | 324 | Nihilist + IMAX Idealist | Globetrotter + Lovestruck | Globetrotter + Voyager | Globetrotter + Nihilist | **Nihilist + Animation Devotee** | **Nihilist + Tenderhearted** |
| P07 | 290 | IMAX Idealist + Nihilist | Tenderhearted + Globetrotter | Tenderhearted + Nihilist | Nihilist + IMAX Idealist | Nihilist + Globetrotter | **IMAX Idealist + Nihilist** |
| P08 | 247 | Lovestruck + Voyager | Old Soul + Lovestruck | Old Soul + Lovestruck | **Lovestruck + IMAX Idealist** | Aesthete + Lovestruck | **Lovestruck + Aesthete** |
| P09 | 227 | Midnight Cultist + IMAX Idealist | Nihilist + IMAX Idealist | Nihilist + IMAX Idealist | Nihilist + Aesthete | ran out at 29 | Nihilist + IMAX Idealist |
| P10 | 213 | Nihilist + Globetrotter | **Nihilist + Globetrotter** | **Nihilist** | **Nihilist** | **Nihilist + Aesthete** | **Nihilist + Lovestruck** |
| P11 | 140 | Lovestruck + Voyager | Tenderhearted + Nihilist | Tenderhearted + Nihilist | Comic Relief + Voyager | Comic Relief + Voyager | **Lovestruck + IMAX Idealist** |
| P12 | 124 | Old Soul + Tenderhearted | **Old Soul + Nihilist** | ran out at 29 | Nihilist + Midnight Cultist | ran out at 27 | ran out at 28 |
| P13 (deck-made) | 104 | Voyager + Animation Devotee | **Voyager + Nihilist** | **Voyager + Animation Devotee** | Eyewitness + IMAX Idealist | Eyewitness + Voyager | Eyewitness + Voyager |
| P14 (deck-made) | 92 | Hardboiled + Eyewitness | **Hardboiled + Eyewitness** | **Hardboiled + Tenderhearted** | IMAX Idealist + Overthinker | Eyewitness + Overthinker | Eyewitness + Overthinker |
| P15 (deck-made) | 90 | Lovestruck + Hardboiled | Hardboiled + Lovestruck | Hardboiled + Lovestruck | Hardboiled + IMAX Idealist | Hardboiled + IMAX Idealist | **Lovestruck + Hardboiled** |
| P16 (deck-made) | 79 | Animation Devotee + IMAX Idealist | Lovestruck + Hardboiled | ran out at 25 | Overthinker + IMAX Idealist | ran out at 25 | ran out at 27 |
| P17 (deck-made) | 70 | Midnight Cultist + Nihilist | Nihilist | **Midnight Cultist + Tenderhearted** | Nihilist + Midnight Cultist | ran out at 20 | ran out at 21 |
| P18 (deck-made) | 53 | Nihilist + Hardboiled | Midnight Cultist + Globetrotter | Midnight Cultist + Animation Devotee | Hardboiled + IMAX Idealist | Hardboiled + IMAX Idealist | Hardboiled + Lovestruck |
| P19 (deck-made) | 34 | Hardboiled + Animation Devotee | Midnight Cultist + IMAX Idealist | ran out at 23 | Nihilist + IMAX Idealist | ran out at 16 | ran out at 17 |
| P20 (deck-made) | 32 | IMAX Idealist + Hardboiled | **IMAX Idealist + Hardboiled** | **IMAX Idealist + Hardboiled** | **IMAX Idealist + Nihilist** | ran out at 15 | ran out at 15 |
| P21 (deck-made) | 32 | Hardboiled + Lovestruck | Lovestruck + Voyager | Lovestruck + Hardboiled | Voyager + Nihilist | ran out at 18 | ran out at 20 |
| P22 (deck-made) | 26 | Comic Relief + Hardboiled | Lovestruck + IMAX Idealist | ran out at 21 | **Comic Relief + Voyager** | ran out at 15 | ran out at 16 |

## 3. Cards needed to reach 15 rated

| Deck | 12 imported libraries: mean (median) | 6 libraries of 300+ rated: mean | All 22: mean (median) |
|---|---|---|---|
| Live deck, as shipped (adaptive) | 56 (64) | 33 | 69 (74) |
| Live deck, curated order only | 35 (35) | 25 | 44 (40) |
| Deck v3, its own order | 42 (31) | 23 | 73 (61) |
| Deck v3 + adaptDeck (approximate) | 57 (52) | 31 | 80 (75) |
| Deck v3 with the section 5 tweaks, fixed order | 38 (31) | 21 | 64 (43) |

- v3 in its own order is the fastest real option for people with broad libraries: about 23 cards for the six largest libraries, 42 on average for the 12.
- The live deck as shipped needs the most, because the adaptive order moves toward less-seen classics and world films.
- The "all 22" column is biased against v3: deck-made libraries hold few of v3's 74 new cards.

## 4. Which archetypes are misplaced, and why

All members and stops pooled:

| True archetype | Members | Live deck: right name (of member-stops) | v3: right name | v3: most common wrong name |
|---|---|---|---|---|
| Lovestruck | 5 | 0/15 | 1/15 | Hardboiled (6), Comic Relief (4) |
| Nihilist | 4 | 2/12 | 7/12 | Hardboiled (4), Globetrotter (1) |
| Hardboiled | 3 | 2/8 | 0/5 | IMAX Idealist (2), Eyewitness (1) |
| Animation Devotee | 2 | 0/5 | 0/5 | IMAX Idealist (4), Overthinker (1) |
| IMAX Idealist | 2 | 3/6 | 1/4 | Nihilist (3) |
| Midnight Cultist | 2 | 2/6 | 1/4 | Nihilist (3) |
| Tenderhearted | 1 | 2/3 | 1/3 | Lovestruck (2) |
| Old Soul | 1 | 2/2 | 0/2 | Nihilist (2) |
| Voyager | 1 | 3/3 | 0/3 | Eyewitness (2), IMAX Idealist (1) |
| Comic Relief | 1 | 0/2 | 1/1 |  |

**Cause 1: the read only counts films rated above the person's own average, and v3 took out the well-loved cards.** The model weights each film by its rating minus the person's mean and ignores the rest. v3 selects for cards that split people, so its early cards for several archetypes are ones even fans rate low:

- **Lovestruck (0 to 1 right of 15).** Lovestruck members had rated 0, 1 and 2 romance cards above their average by 30 rated (P02, P05, P11). The early romance cards are Twilight (card 18) and We Live in Time (27). La La Land, Pride & Prejudice and The Notebook are gone. The dark seed cards they also love then win: Hardboiled, 6 times.
- **IMAX Idealist.** P07 rated five spectacle cards by 30, including Star Wars: The Rise of Skywalker (0.5 stars) and Iron Man 2 (2.5). Panned franchise cards stand in for the archetype and count for nothing. The Dark Knight and Mad Max: Fury Road are gone.
- **Midnight Cultist read as Nihilist.** P09 rated five horror cards by 20 and only The Shining above their average (It, Midsommar, Smile, Get Out came lower). Hereditary, Alien and The Thing are gone; Get Out sits at card 161. Meanwhile four of the first 29 cards read as Nihilist to the model (Fight Club, Black Swan, Joker, There Will Be Blood).

**Cause 2: the deck's archetype labels are not the model's.** For 64 of the 220 v3 cards the model can read, the deck's label differs from the archetype the model gives the film most weight for. The "11 to 17 cards each" balance is on the deck's labels only.

- In the seed, Titanic (the Lovestruck card) reads as Eyewitness, because it is flagged a true story. Forrest Gump (the Tenderhearted card) reads as Lovestruck. With The Grand Budapest Hotel the seed has one weak Tenderhearted card and two Eyewitness cards.
- By the model's reading, v3's first 60 cards are 13% IMAX Idealist and 12% Nihilist, but 3% Midnight Cultist and 1% Overthinker.
- Four true-story cards sit in the first 22 (Titanic, Oppenheimer, Hamnet, The Zone of Interest). Eyewitness is then named for two deck-made members (P13, P14) who are Voyager and Hardboiled.

**Cause 3: the kind gates cannot be passed in a fixed order.** Animation Devotee, Old Soul, Globetrotter, Eyewitness and Overthinker each need three films of the kind rated 4.5 or more, plus a share 1.5 times the deck average.

- **Animation Devotee (0 of 5 on both decks).** v3 has three animated cards in the first 30 (Spirited Away, Inside Out, Howl's Moving Castle). A member must love all three. Inside Out averages 3.0 among these members.
- **Old Soul.** P12 had one pre-1980 card (12 Angry Men) by 20 rated on v3; the next are at cards 33 and 44. The live deck's adapting found three, the one case where adapting helps.
- **Overthinker** is out of reach on v3: its bar is 44% of loved films, because v3's deck average for puzzle films is 29%.

**Cause 4: a swap inside the dark family** (Nihilist, Hardboiled, Midnight Cultist) accounts for about a third of the misses on both decks. These are near misses and partly the soft target.

## 5. Deck tweaks that would fix most of it

Tried as one change on v3's fixed order (in-sample, so a direction only): primary match on the 12 goes from 3, 2, 3 to **4, 5, 6** at 15, 20, 30; primary in top 2 from 5, 4, 4 to 5, 6, 7; streak match from 1, 1, 1 to 3, 2, 3. Lovestruck is found for 3 of 5 instead of 0 to 1. Cards to reach 15 fall from 42 to 38.

1. **Seed: La La Land back in for Titanic.** The model reads La La Land as Lovestruck (0.91) and Titanic as Eyewitness. Titanic moves to about card 40.
2. **Seed: Good Will Hunting back in for Forrest Gump.** It is the model's Tenderhearted card. Forrest Gump moves to card 18 as a second, widely seen Lovestruck card.
3. **Cards 16 to 30, romance:** Before Sunrise for Twilight, and Crazy, Stupid, Love. for We Live in Time. Twilight and We Live in Time move back past 50.
4. **Spectacle:** Dune: Part Two (card 149) for Star Wars: The Rise of Skywalker (card 26). Keep panned franchise cards after card 30.
5. **Horror:** add Hereditary near card 22 and bring Get Out from 161 to about 26 in place of Joker, which is one of four early Nihilist-reading cards.
6. **Animation:** Spider-Man: Into the Spider-Verse (card 95) for Inside Out (card 16).

Two changes outside the card list would do more than any swap:

- **Rebake the archetype tags from the model before balancing.** Build `probe-archetypes.json` for v3 and count archetypes by the model's membership, not the deck's labels. Then re-check that each archetype has two or three widely loved cards in the first 30. The variance bar should not apply to those.
- **Follow a loved kind, not unexplored lanes.** After a 4.5 on an animated, pre-1980 or horror card, bring the next two of that kind forward so the three-film gates can be met. Leave out the pull toward classics and world films for people who merely rated one highly; it is what makes the live deck slower and less accurate here.

Still not fixed by the tweaks: Animation Devotee (0 of 2 members), Hardboiled read as Lovestruck or IMAX Idealist, and P05 (Lovestruck, read as Hardboiled on every deck).

## 6. How the numbers were made

1. SELECT-only exports: the 23 published profiles with a library (id, user id, rated films, library keys, the stored archetype; never the username or email), their in-app ratings, removed films and Canons, and the model's facts for 3,332 films (3,067 labelled).
2. Libraries rebuilt as `withInAppRatingsMany` and `watchedOnly` do, then `computeReport` for the norms and each library read on its own with `readFilmsWith`, as the profile reads it.
3. Each deck replayed per member as `deckOf` does, stopping at 15, 20 and 30 rated and counting the cards shown. Deck swaps were made in the scratch copy only.
4. Approximations: the lane guard and the fallbacks for unmatched library keys are not replayed (the full read still matched the stored name 21 of 23; the two that differ have in-app ratings newer than their stored profile). v3 with `adaptDeck` uses guessed lanes for 74 cards. The montage checkout was 10 commits behind `origin/main`. The one model change there is Globetrotter's fact (films outside a member's home languages, not simply non-English); it leaves the read as it was for anyone with no home language set or English alone, and it is not replayed here. The deck is unchanged.

## 7. Follow-up, 2026-11-12: the three approved fixes, tried against a bar set first

Nothing was changed in the app. **None of the three fixes cleared the bar, so nothing was pushed to montage `main`.** The deck measured is the one now on `main` (commit 8b3f619b: La La Land and Good Will Hunting in the seed; romance, horror and spectacle in cards 16 to 30; 227 cards). Same exports, same 12 imported libraries, same stops.

**The bar, written before any "after" number:**

1. Fixed-order replay (the one section 5's 4, 5, 6 came from): summed over the three stops, primary match, primary in top 2 and first-streak match each strictly higher than before, and none lower at 15.
2. As-served replay (the app's own `deckOf`, `adaptDeck` on): none of the three sums lower than before.
3. Full libraries: the primary archetype changes for at most 2 of 23 members.
4. Animation Devotee: at most 1 more full library named it; at most 1 false naming across the onboarding member-stops.

**Before and after (12 imported libraries; 12, 12 and 11 members at 15, 20, 30; each cell is 15 / 20 / 30, then the sum of 35 member-stops):**

| Variant | Replay | Primary match | Primary in top 2 | Streak match | Full-library primary changes | Bar |
|---|---|---|---|---|---|---|
| Before (main today) | fixed | 4 / 5 / 6 = 15 | 5 / 6 / 7 = 18 | 3 / 2 / 3 = 8 | | |
| Before (main today) | as served | 2 / 2 / 2 = 6 | 4 / 4 / 4 = 12 | 4 / 4 / 3 = 11 | | |
| Fix 1 as asked: every rating, signed, below-average films subtract in full | fixed | 4 / 4 / 4 = 12 | 5 / 5 / 6 = 16 | 0 / 1 / 1 = 2 | 5 of 23 | fails 1, 3 |
| Fix 1, half strength | fixed | 4 / 4 / 5 = 13 | 5 / 7 / 6 = 18 | 1 / 3 / 1 = 5 | 0 | fails 1 |
| Fix 1, quarter strength | fixed | 4 / 6 / 7 = 17 | 5 / 7 / 7 = 19 | 2 / 1 / 1 = 4 | 0 | fails 1 (streak) |
| Fix 1 as a prior on the mean (their mean with 15 ratings of 3.5 added) | fixed | 4 / 5 / 6 = 15 | 4 / 6 / 8 = 18 | 1 / 1 / 3 = 5 | 0 | fails 1 |
| Fix 2: all card tags rebaked from the model | fixed | 4 / 5 / 6 = 15 | 5 / 6 / 7 = 18 | 3 / 2 / 3 = 8 | 0 | no change (tags only steer the order) |
| Fix 2: all card tags rebaked from the model | as served | 4 / 4 / 2 = 10 | 5 / 5 / 3 = 13 | 3 / 4 / 2 = 9 | 0 | fails 2 (streak 11 to 9) |
| Fix 2, only the 67 hand-tagged cards | as served | 3 / 2 / 3 = 8 | 5 / 5 / 6 = 16 | 2 / 3 / 3 = 8 | 0 | fails 2 (streak 11 to 8) |
| Fix 3: Animation Devotee needs 2 loved animated films when none is rated below their average | both | same as before | same | same | 0 | no change on any member |

About twenty settings of fix 1 were run (strength, how the prior counts, a rate-based version, each with and without fixes 2 and 3). None raised all three sums on the fixed replay.

**Fix 1: counting below-average ratings makes the read worse, not better.** A finer measure than name matching, on the 17 members with 60+ rated films: how well each member's onboarding archetype mix lines up with their full-library mix (correlation, 1 is perfect).

| What counts | Fixed @15 | @20 | @30 | Served @15 | @20 | @30 |
|---|---|---|---|---|---|---|
| Today: films above their average, by distance | 0.50 | 0.55 | 0.58 | 0.53 | 0.59 | 0.66 |
| Signed, half strength | 0.39 | 0.43 | 0.44 | 0.43 | 0.50 | 0.54 |
| Signed, full strength | 0.27 | 0.28 | 0.27 | 0.32 | 0.38 | 0.36 |
| Average signed rating per archetype | 0.27 | 0.28 | 0.30 | 0.29 | 0.35 | 0.34 |
| A lower bar: films above (their average minus half a star) | 0.50 | 0.58 | 0.60 | 0.52 | 0.58 | 0.63 |

The full-library archetype is itself "what share of what you love", so what someone rates low on a deck says little about it. The original cause (too few loved cards for Lovestruck, IMAX Idealist and Midnight Cultist) was a deck problem, and the deck tweak already addressed it. A slightly lower bar is the only version that does not hurt, and its gain is too small to show in names.

**Fix 2: the tags are wrong for 64 cards, and correcting them helps the name but not the streak.** On the shipped deck 64 of 223 readable cards carry a top tag that is not the model's top archetype (77 counting Disciple cards, which the model does not read; those were kept). Rebaked, the as-served primary match goes from 6 to 10 of 35 member-stops and top 2 from 12 to 13, but the first streak falls from 11 to 9. That misses the bar by two member-stops, which is within noise at 12 people, in either direction. The rebaked file is beside this report (`deck-v3-probe-archetypes-rebaked.json`), ready to drop in as `lib/taste-test/probe-archetypes.json` if the owner accepts the streak cost.

**Fix 3: the gate is not what keeps Animation Devotee out.** On members' ratings the looser gate changes no read at any stop, and no full library. The two Animation Devotee members did not love the deck's animated cards (P03: Spirited Away 3, Howl's 4; P16: one loved by 15), so no gate would name them honestly. Six made-up raters were also walked: as served, an animation lover is already named Animation Devotee by 20 rated (the deck brings animation forward after a loved Spirited Away), with or without the change. In fixed order the looser gate names them at 20 instead of 30, but also names a rater who loved two animated cards and then rated the next ones 2.5, and takes it back at 30. No gain on the shipped deck and a small over-firing risk, so it was left alone.

**What the replay says matters more than these three:** the as-served order scores well under the fixed order on primary match (6 against 15 of 35). After a loved Parasite or 12 Angry Men the deck serves world films and classics, and the read turns into Globetrotter or Old Soul (P01, P02, P03, P06, P07, P10). That pull lives in `adaptDeck` and was outside the approved fixes.

**Limits:** 12 members, so one member-stop is 3 points and every row above is within noise of its neighbours; the choices were tried on the people they are scored on; exports are from 2026-11-12 04:47 UTC; four deck cards have no model facts in the export and read as unseen. The fixed-order "before" reproduces section 5 exactly (4, 5, 6 / 5, 6, 7 / 3, 2, 3).

## 8. Follow-up, 2026-11-12: seed cards for everyone who starts on the grid

Owner's question: a person who rates 15 films on "Rate films you love" skips the deck, and 15 self-picked favourites (all animated, say) give a skewed name. The approved design: everyone answers the seed 15; a seed film already rated on the grid is pre-answered and not shown; a "Haven't seen" gets one replacement of the same archetype as the model reads it; grid ratings count half and the average is the served cards' own (8 or more), fading from 30 rated to nothing at 60; a kind may head the read only with one loved film of the kind that the deck served (under 30 rated).

**The bar, written before any number was run:**

1. Recommended arm (grid, then seed, grid at 0.5) is at or above shipped (grid only) on primary match, primary in top 2 and first-streak match, and not below the deck alone at 15 rated (fixed order) on any of the three.
2. Mix correlation (each member's onboarding archetype mix against their full-library mix, the section 7 measure, 17 members with 60+ rated) is at least 0.50 and at least 0.05 above shipped.
3. Skewed grid (the member's 15 best films of their single biggest grid kind): wrong namings of that kind's archetype are at most 1 of 12 and strictly fewer than shipped.
4. Median deck cards shown is 18 or fewer.
5. Zero full-library name changes (23 members).

How it is run: the 12 imported libraries; the read at the reveal (one read per member, not three stops). Grid (a): the member's 15 highest-rated films among those the grid would show (the "Everyone's seen these" list, the 60 most logged films of each of the seven genre rows and of 1995 to 2015), ties by how far above Letterboxd's average, then by how widely seen. Grid (b): their 15 highest-rated films of the grid genre they love most films of (4.5 and up; any film, since the grid has search). The archetype of a kind: Animation to Animation Devotee, Horror to Midnight Cultist, Romance to Lovestruck, Crime to Hardboiled, Sci-fi to Voyager, Comedy to Comic Relief, Drama to Tenderhearted. A wrong naming is that archetype named when it is not the member's full-library name. Arms: shipped (grid only); grid plus seed with no weighting; grid plus seed at 0.5 (recommended) and at 0.33; the deck alone at 15 in fixed order.

**Result: the recommended arm fails the bar on points 1 and 4, so nothing was built and nothing was pushed to montage.** Montage `main` at 2ca0d9ec, same exports, 12 imported libraries, one read per member at the reveal.

| Arm | Grid | Primary match | Primary in top 2 | Streak match | Mix correlation (17) | Deck cards shown, median (max) | Wrong kind namings | No read at all |
|---|---|---|---|---|---|---|---|---|
| Shipped: grid only | (a) top 15 | 4/12 | 5/12 | 2/12 | 0.51 | 0 | | 3 |
| Grid + seed, no weighting | (a) | 5/12 | 5/12 | 3/12 | 0.68 | 19 (25) | | 0 |
| **Grid + seed, grid at 0.5 (recommended)** | (a) | **4/12** | **4/12** | **3/12** | **0.68** | **19 (25)** | | 0 |
| Grid + seed, grid at 0.33 | (a) | 4/12 | 4/12 | 2/12 | 0.66 | 19 (25) | | 0 |
| Deck alone at 15, fixed order | | 4/12 | 5/12 | 2/12 | 0.53 | 31 (118) | | 0 |
| Shipped: grid only | (b) one kind | 2/12 | 2/12 | 1/12 | 0.45 | 0 | 2 | 6 |
| Grid + seed, no weighting | (b) | 6/12 | 6/12 | 2/12 | 0.68 | 20 (25) | 1 | 0 |
| **Grid + seed, grid at 0.5 (recommended)** | (b) | **5/12** | **6/12** | **1/12** | **0.68** | **20 (25)** | **1** | 0 |
| Grid + seed, grid at 0.33 | (b) | 4/12 | 6/12 | 1/12 | 0.64 | 20 (25) | 1 | 0 |

| Bar | Result | |
|---|---|---|
| 1. At or above shipped and the deck alone on all three | Primary 4 against 4 and 4; top 2 **4 against 5 and 5**; streak 3 against 2 and 2 | **Fails** (top 2, by one member) |
| 2. Mix correlation 0.50 or more, and 0.05 above shipped | 0.68 against 0.51 | Passes |
| 3. Skewed grid: wrong kind namings at most 1, fewer than shipped | 1 against 2 | Passes |
| 4. Median deck cards shown 18 or fewer | **19** (grid a), **20** (grid b) | **Fails** |
| 5. Zero full-library name changes | 0 of 23: no library carries a grid mark, so the code path is the old one | Passes |

What the run shows:

- **The seed cards are the part that helps.** Adding them lifts the mix correlation from 0.51 to 0.68 and, on the one-kind grid, primary match from 2 to 6 of 12. The owner's design does what it was meant to.
- **Down-weighting the grid does not help, and I was wrong to make it a condition.** Against the same grid and seed with no weighting it is one member lower on primary (grid a and b) and on top 2 (grid a), and no better on the correlation or on wrong kind namings. The gate rule ("one loved film of the kind that the deck served") took Animation Devotee away from P03, whose full-library name it is.
- **Replacements cost about five cards and buy nothing measurable.** The median member had 7 seed cards unseen. Without replacements the median is 14 cards (max 20) and the unweighted arm still scores 5, 5, 3 and 0.67.
- **Shipped today is worse than "skewed": 3 of 12 top-15 grids and 6 of 12 one-kind grids give no read from the taste model at all.** When every grid rating is the same (fifteen 5s), no film is above the person's own average, `readPerson` throws, and the reveal falls back to the older feature classifier (`lib/taste/unified/apply.ts` catches it). Those count as misses above.
- **The one-kind grid as I defined it is a weak test.** The biggest kind is Drama for 11 of the 12, so it barely tests the owner's animation case. Run again after the fact with Drama left out (kinds: crime 4, sci-fi 3, comedy 2, romance 2, horror 1; a direction only): shipped 4, 4, 3 with 2 wrong namings; grid + seed unweighted 6, 8, 1 with 1; at 0.5, 7, 9, 1 with 1. The streak falls in both.

**What would pass, tried after the fact (in-sample, so a direction only):** grid + seed, no weighting, no replacements. Grid (a): 5, 5, 3 against shipped 4, 5, 2; correlation 0.67; median 14 cards. It passes 1, 2, 4 and 5. On point 3 it ties shipped (2 wrong namings of 12 on the Drama-heavy grid; 1 against 2 with Drama left out). This is the owner's original proposal with nothing added.

**Limits:** 12 members, one member is 8 points, and every difference between the seed arms is one or two members. The grid is simulated: the grid's rows are rebuilt from the export (the "Everyone's seen these" list plus the 60 most logged films per genre row and of 1995 to 2015; 320 films), and a member's top-rated films stand in for what they would pick. A card the member has not rated is a "Haven't seen". The read uses the full-library averages unless half the ratings are deck cards, as the app does. Replacements are the most-logged later card whose top model-read archetype is the seed card's.

## 9. Follow-up, 2026-11-12: the simpler variant (seed cards, nothing else)

Owner approved testing the simpler variant: grid ratings count as any other rating, the seed 15 in fixed order with grid-rated seed films pre-answered and not shown, no replacements (a "Haven't seen" just moves on), the reveal when the seed is done and 15 are rated in all. No change to the taste model.

**The bar, written before this run, but after seeing section 8.** Section 8's after-the-fact row (5, 5, 3; correlation 0.67; median 14) is nearly this variant, so points 1, 2 and 4 are set knowing roughly where they will land. That is a post hoc risk: read a pass on them as "consistent with section 8", not as new evidence. Point 3 is a new test that has not been run.

1. Top-15 grid: at or above shipped (grid only) on primary match, primary in top 2 and first-streak match.
2. Mix correlation (17 members with 60+ rated) at least 0.05 above shipped.
3. One-kind grids, every kind: for each member and each of the seven grid kinds they have 15 or more rated films of, their best 15 of that kind as the grid (all member-kinds pooled, 12 imported libraries). Wrong namings of the kind's archetype strictly fewer than shipped. A grid with no read from the taste model counts as neither right nor wrong, and is reported.
4. Median deck cards shown 16 or fewer, on the top-15 grid and on the pooled one-kind grids.
5. Zero full-library name changes (true by construction: the model is not touched).
