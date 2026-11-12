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
