# Onboarding deck check: do the films people rate tell the taste model anything?

Date: 2026-11-12. Read-only analysis of `/home/user/montage` and Supabase `uktamekqqsiijugpaxit`, using SELECT queries only. No app code changed.

## Verdict

**Partly.** Every card is model-ready. Only about **a third of the deck (96 of 293 cards, 33%)** is clearly informative: widely seen, rated differently by different people, and far from the middle on the Film DNA strands. A looser bar (the combined score below, 0.30 or more) passes 136 cards (46%). The seed is mostly sound. It covers all 15 archetypes, but it leans on consensus favourites (The Dark Knight, Good Will Hunting, Se7en) and has no slow-burn film. The weak cards sit in three places:

1. **The back of the deck.** 57 cards (19%) are films few people have seen: under about 0.7M Letterboxd logs, and logged by at most 2 of the 9 members with full libraries. Most are world films and pre-1970 classics. A person who skips them gives the model nothing.
2. **Consensus classics.** The Shawshank Redemption, The Godfather, Schindler's List, Goodfellas, Fellowship of the Ring, Gladiator and similar films are seen by almost everyone and loved by almost everyone. Member spread on each is 0.07 to 0.36 stars. A rating on one of them barely moves a profile.
3. **Near-duplicate pairs.** Several cards sit almost on top of another card in strand space: The Pianist and 12 Years a Slave (distance 0.11), Shrek and Shrek 2 (0.15), Alien and Suspiria (0.21), Chinatown and The Godfather (0.23). The second card of each pair adds little.

The deck card count is **293**, not 298. 298 is the deck plus the 5 "Everyone's seen these" films that are not cards.

## How this was measured

| Signal | Source | Notes |
|---|---|---|
| Model-ready | `films.embedding` not null, a `film_labels` row, `confidence` at least 40 (`LABEL_MIN_CONFIDENCE`; visual artistry needs 60) | |
| Seen rate (`seenp`, 0 to 1) | 0.6 × Letterboxd log count on a log scale (0.2M scores 0, 5M scores 1) + 0.4 × the share of the 9 member libraries with 200+ ratings that contain the film | `deck_unseen` holds only 808 marks from 5 people, too few to rank cards; it is listed where it matters |
| Divisiveness (`div`) | Standard deviation of member ratings, each rating centred on that member's own average, across the 23 `public_profiles` libraries. Shrunk toward a prior from the crowd average: films the crowd rates 4.4 or higher are assumed consensus | n is small: 0 to 19 raters per film. Read it as a direction, not a measurement |
| Strand separation (`ext`) | RMS z-score of the film's 9 Film DNA strand values (`strandValue9` formulas in `lib/taste/dna-labels.ts`) against the deck's own mean and spread | A film near the deck's middle on every strand moves no strand |
| Redundancy (`nnd`) | Distance in the same 9-strand z-space to the nearest other card | Under 0.30 means near-duplicate |
| Archetype | `lib/taste-test/probe-archetypes.json`, the card's strongest membership | |
| **Score** | `seenp × div × ext` | Deck quartiles: 0.18 / 0.28 / 0.40 |

"Informative" means seenp ≥ 0.5, div ≥ 0.55 and ext ≥ 0.75, all three at once.

## 1. Model readiness: all clear

- **All 293 cards** and all 36 "Everyone's seen these" films are in the catalog, with no `duplicate_of`, an embedding and labels. Label confidence runs from 65 to 95.
- 13 cards have confidence under 80, all recent or panned films: A Minecraft Movie (65), Nosferatu, Superman, Marty Supreme, KPop Demon Hunters, Anyone But You, Only God Forgives, Asteroid City, Five Nights at Freddy's, Joker: Folie à Deux, No Hard Feelings, Babygirl (75), and The Master (78). All of them clear both floors.
- All 15 seed cards have confidence 90 to 95.
- **Rate films you love rows:** the pool behind these rows is every film with more than 100k logs, 3,767 films. 3,628 of them (96%) are ready.
  - The genre rows' top-90 pools are 87 to 90 out of 90 ready. Modern classics is 90 out of 90.
  - The "Popular this year" fallback (the top 36 of 2025 to 2026) is all ready, but its confidence is only 65 to 88 because the labeller knows new films less well. The calibration note in `lib/label-confidence.ts` puts that at about 5 points of label noise. That is acceptable.
  - The weekly TMDB trending list is the one row that can show films that are not yet ready. 92 of the 289 films from 2025 onward with more than 100k logs are not ready.

## 2. Informativeness across the deck

| | Cards | Informative |
|---|---|---|
| Whole deck | 293 | 96 (33%) |
| First 30 (seed + rest of the first thirty) | 30 | 18 (60%) |
| Cards 150 and later | 143 | 21 (15%) |
| Panned cards | 13 | 5 |
| Non-English cards | 48 | 6 (13%) |

**The most informative cards** (highest score) are 2001: A Space Odyssey (1.11), Star Wars: The Rise of Skywalker (1.06, panned), Inside Out (0.96, not a card), Superbad (0.93), Mean Girls (0.85), Coraline (0.84), Barbie (0.81), Inception (0.77), Titanic (0.76), Interstellar (0.72), Jurassic Park (0.70), Requiem for a Dream (0.68) and Home Alone (0.68). What they share is that they are seen widely and people split on them.

**Consensus films** are seen widely but rarely split anyone. These are the "Shawshank" problem:

| Film | Member mean | Member spread | Score |
|---|---|---|---|
| The Shawshank Redemption | 4.67 | 0.55 (strands near the middle, ext 0.59) | 0.24 |
| The Godfather | 4.86 | 0.36 | 0.22 |
| Schindler's List | 4.92 | 0.30 | 0.20 |
| Goodfellas | 4.33 | 0.28 | 0.16 |
| The Lord of the Rings: The Fellowship of the Ring | 5.00 | 0.07 | 0.19 |
| Gladiator | 4.20 | 0.26 | 0.19 |
| No Country for Old Men | 4.67 | 0.33 | 0.29 |
| Good Will Hunting (seed) | 4.63 | 0.44 | 0.51, carried only by its strands |

Keep them as recognisable anchors. Do not spend a seed slot on one.

**Redundant pairs** (nearest-card distance under 0.30). In each pair, drop the second or move it late:

- The Pianist / 12 Years a Slave (0.11)
- Shrek / Shrek 2 (0.15)
- Alien / Suspiria (0.21)
- Chinatown / The Godfather (0.23)
- La Haine / Sunset Boulevard (0.23)
- Punch-Drunk Love / Chungking Express (0.23)
- Phantom Thread / Citizen Kane (0.23)
- Eraserhead / Under the Skin (0.24)
- Se7en / No Country for Old Men (0.26)
- Uncut Gems / Reservoir Dogs (0.26)
- Coco / Wicked (0.26)

## 3. The weakest 10 cards and their replacements

These are the lowest-scoring cards that are not panned. Panned cards are kept on purpose for contrarians. Each replacement is better known (3 to 20 times the logs), likely to split people (crowd average 3.2 to 4.3, or a member spread of 0.8 or more), model-ready, and fills an archetype or language gap.

| # | Weak card | Logs | Members / spread | Problem | Replacement | Logs | Why |
|---|---|---|---|---|---|---|---|
| 1 | Hero (2002) | 0.13M | 0 | Nobody has seen it | **Akira** (ja, 1988) | 1.01M | Same seat: a non-English spectacle film. Visceral 75, spectacle 92 |
| 2 | Only God Forgives | 0.18M | 0 | Unseen; duplicates There Will Be Blood | **The Platform** (es) | 1.00M | Nihilist plus Globetrotter. Crowd 3.23, so it truly splits people |
| 3 | The Lives of Others (de) | 0.22M | 0 | Unseen | **Society of the Snow** (es) | 1.24M | World prestige drama, emotional realism 59 |
| 4 | The Assassination of Jesse James | 0.21M | 0 | Unseen; near-duplicate of The Power of the Dog (0.29) | **Blade Runner** (1982) | 1.58M | Aesthete slow burn: slow burn 67, visual style 97 |
| 5 | A Separation (fa) | 0.22M | 1 | Unseen | **I'm Still Here** (pt) | 0.82M | Brazilian; slow burn 66, emotional realism 62 |
| 6 | Wild Tales (es) | 0.29M | 0 | Unseen | **No Other Choice** (ko, 2025) | 0.92M | The same dark-comic niche (playful 61, complexity 68), and current |
| 7 | The Secret in Their Eyes (es) | 0.23M | 3 / 0.32 | Unseen; near-duplicate of The Lives of Others | **Once Upon a Time in Hollywood** | 3.40M | Disciple, which has 1 informative card in 17. Crowd 3.78, member spread 0.81, originality 82 |
| 8 | Crouching Tiger, Hidden Dragon (zh) | 0.30M | 0 | Unseen | **The Boy and the Heron** (ja) | 1.34M | Crowd 3.90, a divisive Miyazaki. Originality 82, visual 95, wonder 90 |
| 9 | To Kill a Mockingbird | 0.28M | 1 | Unseen | **The Sound of Music** (1965) | 0.75M | Old Soul (pre-1970 only), which has 1 informative card in 19 |
| 10 | Sunset Boulevard | 0.39M | 2 / 0.21 | Seen little; near-duplicate of La Haine (0.23) | **Rosemary's Baby** (1968) | 0.65M | Old Soul plus Midnight Cultist |

**Next tier:** Seven Samurai (0.48M), Shoplifters (0.32M), Amadeus (0.61M), Amores Perros (0.34M), Apollo 13 (0.33M), The Neon Demon (0.33M), Y Tu Mamá También, Come and See, RRR and Drive My Car (each 0.37M to 0.54M with 0 to 4 member ratings), and 12 Years a Slave (it duplicates The Pianist). Other candidates that are both well known and divisive: **Challengers** (3.04M, crowd 3.80, originality 78), **Weapons** (3.48M, 3.57; a Theorist horror), **Glass Onion** (3.09M, 3.38; it splits Knives Out fans), **Brokeback Mountain** (1.73M; emotional realism 89, slow burn 78), **Grave of the Fireflies** (1.43M) and **Ponyo** (1.52M).

Run `npx tsx scripts/check-probes.ts` and rebake `probe-archetypes.json` (`npx tsx scripts/quiz-personas.ts probe-arch`) after any swap.

## 4. Strand and archetype coverage

**Archetypes.** All 15 archetypes have 16 to 28 cards, and the seed has one card per archetype. Coverage of informative cards is very uneven:

| Archetype (label) | Cards | Informative |
|---|---|---|
| Old Soul (`cinephile_scholar`) | 19 | **1** |
| Disciple (`auteur_devotee`) | 17 | **1** |
| Globetrotter (`world_cinema_wanderer`) | 19 | **2** |
| Midnight Cultist | 28 | 6 |
| Hardboiled / Eyewitness | 18 each | 4 each |
| Tenderhearted | 21 | 5 |
| Aesthete | 16 | 5 |
| Comic Relief / Overthinker / Voyager | 22 / 16 / 18 | 8 / 6 / 7 |
| Lovestruck / IMAX Idealist / Nihilist | 20 / 25 / 16 | 10 / 13 / 9 |
| Animation Devotee | 20 | 15 |

The three thin archetypes are thin because few people have seen their cards, not because there are too few cards. Adding more cards will not fix them. Swapping in better-known films will, which is what the replacements above do.

**Film DNA strands.** These are the strand on which each card is furthest above the deck average:

| Strand | Cards | Strand | Cards |
|---|---|---|---|
| Playful lightness | 51 | Slow burn | 29 |
| Complexity | 46 | Spectacle | 27 |
| Visceral charge | 46 | **Originality** | **10** |
| Wonder | 42 | **Visual style** | **4** |
| Emotional realism | 38 | | |

Originality and visual style are not missing. They are saturated. In the seed, 13 of 15 cards score 60 or more on both, so neither strand can tell seed raters apart. To separate people on these two strands, the deck needs a few well-known cards that score low on them. Top Gun: Maverick (originality 38) and Superbad (visual 20) do that.

**Seed (current), raw strand values:**

- **Slow burn: 0 of 15 cards score 60 or more.** The highest is Good Will Hunting at 58. Slow burn is the *lowest* strand for 3 seed cards. A patient-cinema viewer gets no early read.
- **Emotional realism: 1 of 15** (La La Land, 66).
- Wonder: 3. Playful lightness: 2. Visceral charge: 4.
- Complexity (7) and spectacle (7) are well covered.

## 5. Best 15-seed order (proposed)

Rule 213 still holds: one card per archetype, crime, comedy, romance, horror, animation, sci-fi and a subtitled film all inside the first dozen, at least six films from before 2000 (this order has 8) and at least two from before 1980 (it has 3). The most informative and most widely seen cards come first, because `adaptDeck` reads from the fifth rating.

| # | Card | Archetype | Score | Change |
|---|---|---|---|---|
| 1 | Inception | Overthinker | 0.77 | was 5th |
| 2 | Superbad | Comic Relief | 0.93 | |
| 3 | **Titanic** | Lovestruck | 0.76 | replaces La La Land (0.51). Emotional realism 89 against 66; spread 0.71 against 0.52 |
| 4 | Pulp Fiction | Hardboiled | 0.59 | |
| 5 | Spirited Away | Animation Devotee (subtitled) | 0.58 | |
| 6 | **Fight Club** | Nihilist | 0.51 | replaces Se7en (0.38, a near-duplicate of No Country). The most logged card (6.3M) |
| 7 | **Top Gun: Maverick** | IMAX Idealist | 0.57 | replaces The Dark Knight (0.41, member mean 4.59, consensus). A low-originality contrast |
| 8 | **2001: A Space Odyssey** | Aesthete | 1.11 | replaces Drive (0.24, Aesthete read only 0.62). The only seed card with slow burn of 60 or more (72), visual 98, member spread 1.51 |
| 9 | Star Wars | Voyager | 0.50 | |
| 10 | 12 Angry Men | Old Soul | 0.49 | |
| 11 | Parasite | Globetrotter (subtitled) | 0.36 | kept as the most seen non-English film (6.0M) |
| 12 | The Shining | Midnight Cultist | 0.37 | Midsommar (0.41, spread 0.86) works if a pre-1980 card is not needed here |
| 13 | **Oppenheimer** | Eyewitness | 0.41 | replaces The Social Network (0.34, a near-duplicate of 12 Angry Men) |
| 14 | **Forrest Gump** | Tenderhearted | 0.41 | replaces Good Will Hunting (consensus: spread 0.44 across 16 members). Emotional realism 68 |
| 15 | The Grand Budapest Hotel | Disciple | 0.37 | Once Upon a Time in Hollywood, if added, is a stronger Disciple |

The dropped seed cards (The Dark Knight, La La Land, Good Will Hunting, The Social Network, Se7en, Drive) stay in the deck as ordinary cards.

## 6. Non-English gaps (ties to fable-final-audit 1.4)

- **48 of 293 cards (16%) are not in English, but only 6 are informative.** Their median log count is 0.87M, against 1.92M for English cards.
- **25 of the 48 sit at position 200 or later**, where only people who skip a lot ever reach them.
- Only 4 non-English cards have more than 2M logs: Spirited Away, Parasite, Howl's Moving Castle and My Neighbor Totoro.
- **Indian cinema:** 2 cards, 3 Idiots (0.25M) and RRR (0.37M). Both are informative only for viewers who have seen them, and the deck never shows them early.
- **No cards at all** in Tamil, Malayalam, Turkish, Arabic, Thai or Indonesian. Mainland Chinese cinema is limited to Hero and Crouching Tiger, which are the two lowest-scoring world cards.
- **Rate films you love rows** are close to all English. Their top-90 pools hold this many non-English films: Sci-fi 0, Comedy 1, Horror 2, Drama 2, Crime 5, Romance 6, Animation 13, Modern classics 2.
- The cause is the one 1.4 names: Letterboxd log counts undercount non-Western audiences, so any "well known" filter built on logs selects English films. The best-known non-English films the deck lacks are Akira, The Boy and the Heron, Ponyo, Grave of the Fireflies, Kiki's Delivery Service, A Silent Voice, Society of the Snow, The Platform, No Other Choice, I'm Still Here and Flow. Each has 0.7 to 1.5M logs and is ready. The swaps in section 3 bring in six of them.
- The deck cannot fix the gap for Indian viewers. This supports the home-language shelves design in 1.4: rows picked by TMDB popularity within the language, added beside the shared rows, Hindi, Korean, Japanese, Spanish and French first. With those shelves, the shared deck can stay balanced across archetypes, and home-language films reach a viewer before card 200.

## Caveats

- Member variance comes from 23 libraries, only 9 of which have 200+ ratings. Most cards have 2 to 10 raters. Treat each spread as a ranking signal, not an estimate.
- Some libraries are taste-test-only, so seed cards are over-represented in them. That inflates the seed's member counts but not its spread.
- `deck_unseen` (808 marks from 5 people) and `deck_passes` (74 from 2) are too sparse to measure seen rate directly. Once more people have taken the test, re-run this check on true seen rates (rated ÷ (rated + unseen)) per card.
- Divisiveness on Letterboxd itself (the rating histogram) is not in the catalog. Scraping it would give a far better split signal than 23 members can.
