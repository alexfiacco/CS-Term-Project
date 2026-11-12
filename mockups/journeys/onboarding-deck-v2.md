# Onboarding deck v2: the full proposed deck

Date: 2026-11-12. Read-only proposal. No app code changed. Follows `onboarding-deck-check.md`. The machine-readable list, with a reason for every card, is `onboarding-deck-v2.json` in this folder.

## Summary

- **209 cards** (was 293): 203 core cards that pass the bar below, plus 6 owner-approved replacements parked at the back as provisional.
- **Informative share rises from 33% to 66%** on the first report's definition, and from 41% to 89% when "widely seen" means the popularity floor.
- **Every archetype now has at least 5 informative cards.** Old Soul goes from 4 to 6, Disciple from 2 to 5, Globetrotter from 3 to 5 (floor-based definition).
- **Cards few people have seen fall from 19% of the deck to 3%.** The expected not-seen rate over the whole deck falls from 47% to 40%. The first 30 cards are unchanged at about 28%.
- 159 cards leave the deck: 71 are under the popularity floor and 88 are consensus films. 75 cards are new.
- **Three things you should know before approving:**
  1. Only 1 of the 10 approved replacements (The Platform) passes the full bar. Two are under the floor and go to the home-language rows. Six pass the floor but have too few member ratings to show variance, so they sit at the back as provisional. Once Upon a Time in Hollywood passes on spread and is in the core deck.
  2. The bar rests consensus favourites: La La Land, Good Will Hunting, Se7en, Whiplash, The Shawshank Redemption, The Godfather and 82 others. They are still on the "Everyone's seen these" row. Putting any back is a one-line change.
  3. 77 of the 209 cards have fewer than 4 member ratings. Their spread comes from the crowd-average prior, not from measured variance.

## 1. The bar every core card passes

| Test | Rule |
|---|---|
| Widely seen | **At least 1.0M Letterboxd logs.** Films from before 1970 need 0.65M, because Letterboxd's audience skews young and undercounts them |
| Informative | Divisiveness of 0.55 or more. This is the spread of member ratings, each centred on that member's own average, shrunk toward a prior from the crowd average when few members rated the film |
| Model-ready | Embedding present, labels present, label confidence 60 or more (the floor for visual artistry) |

"Informative" in the tables below adds the first report's third test: strand separation of 0.75 or more. 16 core cards pass the bar on spread but sit near the deck's middle on the strands (Parasite is one). They are marked "spread only" in the full list.

Archetypes for the 75 new cards are my assignment, not the model's. Rebake `probe-archetypes.json` (`npx tsx scripts/quiz-personas.ts probe-arch`) and run `npx tsx scripts/check-probes.ts` before shipping.

## 2. Seed 15

| # | Card | Archetype | Logs (M) | Spread | Why it is here |
|---|---|---|---|---|---|
| 1 | Inception | Overthinker | 4.58 | 0.85 | Most informative widely seen card; high wonder, low slow burn |
| 2 | Superbad | Comic Relief | 2.50 | 0.83 | Furthest card on playful lightness; low visual style |
| 3 | Titanic | Lovestruck | 3.56 | 0.72 | Emotional realism 89, the seed's high end; low originality |
| 4 | Pulp Fiction | Hardboiled | 4.69 | 0.80 | Complexity high, emotional realism low |
| 5 | Spirited Away | Animation Devotee | 4.14 | 0.77 | Subtitled; wonder 95 |
| 6 | Fight Club | Nihilist | 6.29 | 0.72 | Most logged card in the deck |
| 7 | Top Gun: Maverick | IMAX Idealist | 2.46 | 0.69 | Spectacle high, originality low: the contrast the old seed lacked |
| 8 | 2001: A Space Odyssey | Aesthete | 1.65 | 1.19 | **The slow-burn card** (slow burn 72, visual style 98); the widest member spread in the deck |
| 9 | Star Wars | Voyager | 2.92 | 0.66 | Pre-1980; wonder 90 |
| 10 | 12 Angry Men | Old Soul | 1.80 | 0.80 | Pre-1970; spectacle and wonder at the low end |
| 11 | Parasite | Globetrotter | 5.99 | 0.62 | Subtitled; the most seen non-English film |
| 12 | The Shining | Midnight Cultist | 3.55 | 0.62 | Visceral charge high, playful lightness low |
| 13 | Oppenheimer | Eyewitness | 4.74 | 0.62 | True story; complexity high |
| 14 | Forrest Gump | Tenderhearted | 4.42 | 0.61 | Emotional realism high, complexity low |
| 15 | The Grand Budapest Hotel | Disciple | 3.54 | 0.56 | Playful and stylised |

- All 15 archetypes, one card each. Eight films from before 2000, three from before 1980.
- Crime, comedy, romance, horror, animation, sci-fi and two subtitled films sit inside the first twelve (rule 213).
- Six swaps from today's seed: Titanic for La La Land, Fight Club for Se7en, Top Gun: Maverick for The Dark Knight, 2001 for Drive, Oppenheimer for The Social Network, Forrest Gump for Good Will Hunting.
- Expected not-seen rate for the seed: 24% (today 23%).

## 3. Order after the seed

1. **Round-robin by archetype.** Each round takes every archetype's best remaining card, so no archetype goes more than 15 cards without one. The first 30 cards hold every archetype at least once and no archetype more than three times.
2. **Within a round, the highest score goes first** (seen rate × spread × strand separation). `adaptDeck` reads from the fifth rating, so the cards it learns from are the ones most people have seen and disagree on.
3. **Non-English, pre-1970 and slow-burn cards get a lift** (×2.0, ×1.4, ×1.3). A viewer who loves them is read early and `adaptDeck` (`deckKinds`) serves more of that kind. All 11 non-English core cards sit at position 90 or earlier; today 25 of 48 sit past 200.
4. **Love-it-or-hate-it cards are spaced, not stacked at the back** (section 4).
5. **Provisional cards are last** (204 to 209), reached only by people who skip a lot.

Cards 16 to 30: Your Name, City of God, Twilight, Avengers: Endgame, Mean Girls, Anatomy of a Fall, Interstellar, Jurassic Park, Requiem for a Dream, Crazy, Stupid, Love, Star Wars: The Rise of Skywalker, Sinners, Black Swan, Michael, Hamnet.

`adaptDeck` still reorders everything past card 15. This order is the starting point it reorders from.

## 4. Famous "bad" and love-it-or-hate-it films

17 cards. Each has 1.1M logs or more, the crowd rates it under 3.3, and it is model-ready.

| # in deck | Film | Logs (M) | Crowd avg | Members: n, spread | Separates people? |
|---|---|---|---|---|---|
| 18 | Twilight | 2.64 | 3.12 | 1, n/a | Not measurable yet (1 rating); kept as the best-known film of its kind |
| 26 | Star Wars: The Rise of Skywalker | 1.55 | 2.29 | 6, 1.41 | Yes: the second-widest spread in the deck |
| 38 | Jurassic World | 1.41 | 3.22 | 3, 1.20 | Yes, on 3 ratings |
| 46 | Iron Man 2 | 2.08 | 3.09 | 7, 0.85 | Yes |
| 54 | Free Guy | 1.33 | 3.02 | 4, 1.32 | Yes |
| 62 | A Minecraft Movie | 1.69 | 2.42 | 5, 0.60 | Yes |
| 70 | Captain Marvel | 1.92 | 2.63 | 2, 0.31 | Weak evidence |
| 78 | Suicide Squad | 1.81 | 2.33 | 2, 0.57 | Weak evidence |
| 86 | Thor: Love and Thunder | 1.75 | 2.32 | 2, 0.67 | Weak evidence |
| 94 | Eternals | 1.36 | 2.68 | 3, 1.02 | Yes, on 3 ratings |
| 102 | Star Wars: The Phantom Menace | 2.18 | 3.18 | 3, 0.31 | Weak evidence |
| 110 | The Blair Witch Project | 1.14 | 3.23 | 0 | Not measurable yet |
| 118 | Smile | 1.66 | 2.88 | 2, 0.19 | Weak evidence |
| 126 | Five Nights at Freddy's | 1.69 | 2.60 | 1, n/a | Not measurable yet |
| 134 | Star Wars: The Last Jedi | 1.73 | 2.84 | 4, 0.45 | Modest |
| 142 | Bird Box | 1.34 | 2.97 | 0 | Not measurable yet |
| 150 | Don't Look Up | 2.62 | 3.06 | 1, n/a | Not measurable yet |

**Where they go:** two inside the first 30 (cards 18 and 26), then one every eighth card from 38 to 150. Today all 13 panned cards sit at the very back and only a contrarian meets them. A casual viewer who loved Twilight, or a fan who hated The Rise of Skywalker, now says so before card 30. Keep the `panned` flag on all 17 so `adaptDeck` still pulls more forward for someone rating acclaimed cards low.

**The films you named:**

| Film | Logs (M) | Verdict |
|---|---|---|
| Twilight | 2.64 | In, card 18 |
| Transformers | 0.95 | Out by 5%. First in if the floor drops to 0.9M (spread 0.63 on 2 ratings) |
| Fifty Shades of Grey | 0.59 | Out: under the floor |
| Batman & Robin | 0.36 | Out: under the floor |
| The Room | 0.28 | Out: under the floor |
| Cats (2019) | 0.19 | Out: under the floor |

These five are famous as jokes but few people have logged them, so most viewers would tap "Haven't seen".

Left out for weak variance or overlap: Anyone But You (spread 0.48), No Hard Feelings (0.54), Joker: Folie à Deux and Babygirl (under the floor).

## 5. Non-English

- **11 non-English core cards** (was 48), all at position 90 or earlier: Spirited Away (5), Parasite (11), Your Name (16), City of God (17), Anatomy of a Fall (21), Oldboy (36), Amélie (53), All Quiet on the Western Front (61), Godzilla Minus One (68), Sentimental Value (71), The Platform (90).
- 3 more are provisional at the back: The Boy and the Heron, Society of the Snow, Akira.
- **39 non-English cards leave the core deck** for the home-language rows (fable-final-audit 1.4):
  - 27 are under the floor, including RRR, 3 Idiots, Seven Samurai, Shoplifters, A Separation and Roma.
  - 12 are well seen but consensus among members: Howl's Moving Castle (0.51), My Neighbor Totoro (0.45), Princess Mononoke (0.28), Pan's Labyrinth (0.34), Portrait of a Lady on Fire (0.32), Train to Busan (0.43), Perfect Blue (0.40), La Haine (0.43), Memories of Murder (0.47), In the Mood for Love (0.52), The Worst Person in the World (0.52), The Intouchables (0.38).
- I'm Still Here (0.82M) and No Other Choice (0.92M) were approved replacements but are under the floor. They belong on the Portuguese and Korean home rows.
- The core deck now has no Indian film. That is the floor working as asked, and it makes the home-language rows a requirement, not an extra.

## 6. Before and after

### Share of informative cards

| | Before | After |
|---|---|---|
| Cards | 293 | 209 |
| Informative, first report's definition (seen rate ≥ 0.5, spread ≥ 0.55, separation ≥ 0.75) | 96 (33%) | 138 (66%) |
| Informative, floor-based (floor, spread ≥ 0.55, separation ≥ 0.75) | 119 (41%) | 187 (89%) |
| Pass floor and spread | 134 (46%) | 203 (97%) |

### Expected "Haven't seen" rate

This is 1 minus the seen-rate index from the first report (Letterboxd logs plus the share of full member libraries holding the film). It is an index, not a measured rate: `deck_unseen` has marks from only 5 people.

| | Before | After |
|---|---|---|
| Whole deck | 47% | 40% |
| Seed 15 | 23% | 24% |
| First 30 | 27% | 28% |
| Cards few have seen (index under 0.35) | 19% | 3% |
| Median logs per card | 1.65M | 2.01M |
| Least-logged card | 0.13M | 0.65M |

The first 30 were already widely seen, so the gain is all in the cards a skipper reaches after them.

### Archetype coverage (informative = floor-based definition)

| Archetype | Before: cards | Before: informative | After: cards | After: informative |
|---|---|---|---|---|
| Aesthete | 16 | 6 | 12 | 10 |
| Animation Devotee | 20 | 15 | 23 | 21 |
| Comic Relief | 22 | 12 | 17 | 17 |
| **Disciple** | 17 | 2 | 6 | **5** |
| Eyewitness | 18 | 7 | 13 | 12 |
| **Globetrotter** | 19 | 3 | 7 | **5** |
| Hardboiled | 18 | 4 | 9 | 6 |
| IMAX Idealist | 25 | 13 | 23 | 22 |
| Lovestruck | 20 | 11 | 18 | 18 |
| Midnight Cultist | 28 | 12 | 21 | 19 |
| Nihilist | 16 | 10 | 10 | 10 |
| **Old Soul** | 19 | 4 | 9 | **6** |
| Overthinker | 16 | 7 | 13 | 11 |
| Tenderhearted | 21 | 5 | 14 | 12 |
| Voyager | 18 | 8 | 14 | 13 |

Disciple, Globetrotter, Old Soul and Hardboiled are still the thinnest at 5 or 6. The catalog has few films of those kinds that are both above 1.0M logs and divisive.

### Strand coverage

"High" counts cards whose furthest-above-the-deck strand is this one. "Low" counts cards whose furthest-below strand is this one.

| Strand | Before: high / low | After: high / low | After, informative only: high / low |
|---|---|---|---|
| Emotional realism | 38 / 25 | 21 / 23 | 19 / 20 |
| Complexity | 46 / 23 | 23 / 19 | 18 / 18 |
| Slow burn | 29 / 33 | 9 / 27 | 7 / 22 |
| Originality | 10 / 29 | 4 / 42 | 2 / 41 |
| Visual style | 4 / 26 | 2 / 22 | 1 / 22 |
| Visceral charge | 46 / 30 | 32 / 18 | 27 / 15 |
| Spectacle | 27 / 37 | 28 / 14 | 25 / 12 |
| Wonder | 42 / 17 | 48 / 5 | 47 / 3 |
| Playful lightness | 51 / 73 | 42 / 39 | 41 / 34 |

All 9 strands have cards at both ends. Three ends are thin:

- **Slow burn, high end: 9 cards** (was 29). Slow films are rarely above 1.0M logs. The seed carries 2001; then The Zone of Interest (41), Sentimental Value (71), The Virgin Suicides (80), The Whale, A Complete Unknown, A Real Pain, Asteroid City, The Royal Tenenbaums, and Blade Runner (provisional). Hamnet (card 30) has slow burn 78 but counts under emotional realism.
- **Originality and visual style, high end: 4 and 2 cards.** These strands are saturated, as the first report found: most cards score high on both, so few stand out above the rest. The low end is now well stocked (42 and 22 cards), which is what separates people on them.
- **Wonder, low end: 5 cards.**

### Eras

| Decade | Before | After |
|---|---|---|
| Before 1970 | 23 | 11 |
| 1970s | 19 | 8 |
| 1980s | 17 | 7 |
| 1990s | 39 | 19 |
| 2000s | 67 | 44 |
| 2010s | 84 | 69 |
| 2020s | 44 | 51 |

The deck gets newer. Older films lose out on both tests: fewer logs, and those who log them mostly agree. Genre spread was not measured directly; the archetype table is the proxy.

## 7. Full deck in order

Spread = divisiveness. Sep. = strand separation. "spread only" = passes the bar but separation is under 0.75. "new" = not in today's deck.

| # | Film | Year | Lang | Archetype | Logs (M) | Spread | Sep. | High / low strand | Note |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Inception | 2010 | en | Overthinker | 4.58 | 0.85 | 1.02 | wonder / slow burn | seed |
| 2 | Superbad | 2007 | en | Comic Relief | 2.50 | 0.83 | 1.61 | playful lightness / visual style | seed |
| 3 | Titanic | 1997 | en | Lovestruck | 3.56 | 0.72 | 1.39 | emotional realism / originality | seed |
| 4 | Pulp Fiction | 1994 | en | Hardboiled | 4.69 | 0.80 | 0.92 | complexity / emotional realism | seed |
| 5 | Spirited Away | 2001 | ja | Animation Devotee | 4.14 | 0.77 | 1.08 | wonder / emotional realism | seed |
| 6 | Fight Club | 1999 | en | Nihilist | 6.29 | 0.72 | 0.82 | complexity / slow burn | seed |
| 7 | Top Gun: Maverick | 2022 | en | IMAX Idealist | 2.46 | 0.69 | 1.08 | spectacle / originality | seed |
| 8 | 2001: A Space Odyssey | 1968 | en | Aesthete | 1.65 | 1.19 | 1.41 | wonder / playful lightness | seed |
| 9 | Star Wars | 1977 | en | Voyager | 2.92 | 0.66 | 1.20 | wonder / slow burn | seed |
| 10 | 12 Angry Men | 1957 | en | Old Soul | 1.80 | 0.80 | 0.90 | complexity / spectacle | seed |
| 11 | Parasite | 2019 | ko | Globetrotter | 5.99 | 0.62 | 0.67 | complexity / wonder | seed, spread only |
| 12 | The Shining | 1980 | en | Midnight Cultist | 3.55 | 0.62 | 0.90 | visceral charge / playful lightness | seed |
| 13 | Oppenheimer | 2023 | en | Eyewitness | 4.74 | 0.62 | 0.82 | complexity / playful lightness | seed |
| 14 | Forrest Gump | 1994 | en | Tenderhearted | 4.42 | 0.61 | 0.89 | emotional realism / complexity | seed |
| 15 | The Grand Budapest Hotel | 2014 | en | Disciple | 3.54 | 0.56 | 0.86 | playful lightness / emotional realism | seed |
| 16 | Your Name. | 2016 | ja | Animation Devotee | 1.74 | 0.83 | 1.17 | wonder / complexity |  |
| 17 | City of God | 2002 | pt | Globetrotter | 1.34 | 1.14 | 0.80 | visceral charge / playful lightness |  |
| 18 | Twilight | 2008 | en | Lovestruck | 2.64 | 0.60 | 0.99 | wonder / visual style | love-or-hate |
| 19 | Avengers: Endgame | 2019 | en | IMAX Idealist | 4.23 | 0.87 | 1.08 | spectacle / originality | new |
| 20 | Mean Girls | 2004 | en | Comic Relief | 3.61 | 0.79 | 1.41 | playful lightness / visual style |  |
| 21 | Anatomy of a Fall | 2023 | fr | Hardboiled | 1.59 | 0.68 | 1.00 | complexity / spectacle |  |
| 22 | Interstellar | 2014 | en | Overthinker | 6.62 | 0.69 | 1.10 | wonder / slow burn |  |
| 23 | Jurassic Park | 1993 | en | Voyager | 2.52 | 0.79 | 1.20 | wonder / emotional realism |  |
| 24 | Requiem for a Dream | 2000 | en | Nihilist | 1.84 | 1.12 | 1.02 | emotional realism / playful lightness |  |
| 25 | Crazy, Stupid, Love. | 2011 | en | Lovestruck | 1.82 | 0.86 | 1.36 | playful lightness / visual style | new |
| 26 | Star Wars: The Rise of Skywalker | 2019 | en | IMAX Idealist | 1.55 | 1.14 | 1.42 | wonder / originality | love-or-hate |
| 27 | Sinners | 2025 | en | Midnight Cultist | 5.08 | 0.75 | 0.89 | visceral charge / slow burn | new |
| 28 | Black Swan | 2010 | en | Aesthete | 3.48 | 0.98 | 0.82 | visceral charge / playful lightness | new |
| 29 | Michael | 2026 | en | Eyewitness | 1.95 | 0.81 | 1.27 | spectacle / originality | new |
| 30 | Hamnet | 2025 | en | Tenderhearted | 1.80 | 0.73 | 1.29 | emotional realism / visceral charge | new |
| 31 | Once Upon a Time... in Hollywood | 2019 | en | Disciple | 3.40 | 0.79 | 0.69 | originality / emotional realism | new, spread only |
| 32 | Citizen Kane | 1941 | en | Old Soul | 0.70 | 0.83 | 0.89 | complexity / playful lightness |  |
| 33 | Inside Out | 2015 | en | Animation Devotee | 3.51 | 1.33 | 0.96 | wonder / visceral charge | new |
| 34 | Barbie | 2023 | en | Comic Relief | 6.27 | 0.87 | 1.03 | playful lightness / visceral charge |  |
| 35 | F1 | 2025 | en | IMAX Idealist | 2.17 | 0.78 | 1.32 | spectacle / originality | new |
| 36 | Oldboy | 2003 | ko | Globetrotter | 1.77 | 0.63 | 1.00 | complexity / playful lightness |  |
| 37 | Everything Everywhere All at Once | 2022 | en | Overthinker | 4.22 | 0.78 | 1.11 | wonder / slow burn |  |
| 38 | Jurassic World | 2015 | en | IMAX Idealist | 1.41 | 0.94 | 1.48 | spectacle / originality | love-or-hate, new |
| 39 | Night at the Museum | 2006 | en | Voyager | 1.24 | 0.84 | 1.41 | wonder / originality | new |
| 40 | Call Me by Your Name | 2017 | en | Lovestruck | 3.39 | 0.74 | 1.26 | emotional realism / visceral charge |  |
| 41 | The Zone of Interest | 2023 | en | Eyewitness | 1.00 | 0.89 | 1.24 | slow burn / playful lightness |  |
| 42 | The Perks of Being a Wallflower | 2012 | en | Tenderhearted | 3.77 | 0.61 | 1.17 | emotional realism / originality |  |
| 43 | Poor Things | 2023 | en | Aesthete | 2.70 | 0.85 | 0.97 | wonder / visceral charge |  |
| 44 | It | 2017 | en | Midnight Cultist | 3.19 | 0.67 | 0.88 | visceral charge / originality | new |
| 45 | Prisoners | 2013 | en | Nihilist | 2.56 | 0.66 | 1.02 | visceral charge / playful lightness |  |
| 46 | Iron Man 2 | 2010 | en | IMAX Idealist | 2.08 | 0.82 | 1.22 | spectacle / originality | love-or-hate, new |
| 47 | Joker | 2019 | en | Hardboiled | 5.01 | 0.70 | 0.78 | complexity / playful lightness |  |
| 48 | Singin' in the Rain | 1952 | en | Old Soul | 0.71 | 0.72 | 1.05 | playful lightness / visceral charge |  |
| 49 | The French Dispatch | 2021 | en | Disciple | 1.05 | 0.78 | 0.90 | visual style / visceral charge | new |
| 50 | Coraline | 2009 | en | Animation Devotee | 3.41 | 1.20 | 0.99 | wonder / emotional realism |  |
| 51 | Spider-Man: No Way Home | 2021 | en | IMAX Idealist | 4.37 | 0.86 | 1.00 | spectacle / originality | new |
| 52 | Home Alone | 1990 | en | Comic Relief | 3.11 | 0.68 | 1.37 | playful lightness / visual style |  |
| 53 | Amélie | 2001 | fr | Globetrotter | 1.50 | 0.77 | 0.95 | playful lightness / visceral charge |  |
| 54 | Free Guy | 2021 | en | Comic Relief | 1.33 | 1.04 | 1.15 | playful lightness / originality | love-or-hate, new |
| 55 | The Prestige | 2006 | en | Overthinker | 2.29 | 0.98 | 0.82 | complexity / playful lightness | new |
| 56 | Mamma Mia! | 2008 | en | Lovestruck | 2.40 | 0.89 | 1.21 | playful lightness / originality |  |
| 57 | Dune | 2021 | en | Aesthete | 4.57 | 0.57 | 1.04 | wonder / playful lightness | new |
| 58 | Back to the Future | 1985 | en | Voyager | 3.04 | 0.56 | 1.13 | playful lightness / slow burn |  |
| 59 | Taxi Driver | 1976 | en | Nihilist | 2.63 | 0.71 | 0.98 | complexity / playful lightness |  |
| 60 | Obsession | 2026 | en | Midnight Cultist | 5.53 | 0.65 | 0.80 | visceral charge / originality | new |
| 61 | All Quiet on the Western Front | 2022 | de | Eyewitness | 1.29 | 0.59 | 0.98 | visceral charge / playful lightness |  |
| 62 | A Minecraft Movie | 2025 | en | Voyager | 1.69 | 0.66 | 1.60 | wonder / originality | love-or-hate |
| 63 | The Pursuit of Happyness | 2006 | en | Tenderhearted | 1.26 | 0.63 | 1.32 | emotional realism / originality | new |
| 64 | Fargo | 1996 | en | Hardboiled | 1.53 | 0.75 | 0.75 | visceral charge / spectacle |  |
| 65 | Casablanca | 1943 | en | Old Soul | 0.90 | 0.75 | 0.77 | emotional realism / wonder |  |
| 66 | Blue Velvet | 1986 | en | Disciple | 1.05 | 0.72 | 0.91 | visceral charge / playful lightness |  |
| 67 | Cars | 2006 | en | Animation Devotee | 2.22 | 0.78 | 1.25 | playful lightness / originality | new |
| 68 | Godzilla Minus One | 2023 | ja | IMAX Idealist | 1.01 | 0.61 | 0.92 | spectacle / playful lightness |  |
| 69 | The Hangover | 2009 | en | Comic Relief | 2.28 | 0.71 | 1.50 | playful lightness / visual style |  |
| 70 | Captain Marvel | 2019 | en | IMAX Idealist | 1.92 | 0.60 | 1.34 | spectacle / originality | love-or-hate |
| 71 | Sentimental Value | 2025 | no | Globetrotter | 1.07 | 0.71 | 0.76 | slow burn / visceral charge | new |
| 72 | Knives Out | 2019 | en | Overthinker | 4.39 | 0.60 | 0.92 | playful lightness / emotional realism |  |
| 73 | (500) Days of Summer | 2009 | en | Lovestruck | 3.50 | 0.77 | 0.90 | emotional realism / spectacle |  |
| 74 | Blade Runner 2049 | 2017 | en | Aesthete | 2.40 | 0.73 | 1.04 | spectacle / playful lightness |  |
| 75 | Wicked | 2024 | en | Voyager | 2.93 | 0.69 | 0.92 | wonder / visceral charge |  |
| 76 | Alien: Romulus | 2024 | en | Midnight Cultist | 1.33 | 0.70 | 1.29 | visceral charge / originality | new |
| 77 | The Greatest Showman | 2017 | en | Eyewitness | 1.49 | 0.70 | 1.14 | spectacle / originality |  |
| 78 | Suicide Squad | 2016 | en | IMAX Idealist | 1.81 | 0.69 | 1.18 | spectacle / originality | love-or-hate |
| 79 | Shutter Island | 2010 | en | Nihilist | 3.91 | 0.64 | 0.78 | visceral charge / playful lightness |  |
| 80 | The Virgin Suicides | 2000 | en | Tenderhearted | 1.46 | 0.62 | 1.00 | slow burn / spectacle | new |
| 81 | Baby Driver | 2017 | en | Hardboiled | 3.31 | 0.66 | 0.71 | spectacle / slow burn | spread only |
| 82 | Alice in Wonderland | 1951 | en | Old Soul | 0.67 | 0.75 | 1.19 | wonder / emotional realism | new |
| 83 | Babylon | 2022 | en | Disciple | 1.14 | 0.66 | 0.77 | spectacle / playful lightness | new |
| 84 | Spider-Man: Into the Spider-Verse | 2018 | en | Animation Devotee | 5.12 | 0.61 | 1.14 | wonder / slow burn |  |
| 85 | Dune: Part Two | 2024 | en | IMAX Idealist | 3.77 | 0.71 | 1.08 | spectacle / playful lightness |  |
| 86 | Thor: Love and Thunder | 2022 | en | IMAX Idealist | 1.75 | 0.72 | 1.10 | wonder / originality | love-or-hate, new |
| 87 | How the Grinch Stole Christmas | 2000 | en | Comic Relief | 1.28 | 1.03 | 1.06 | playful lightness / emotional realism | new |
| 88 | Eternal Sunshine of the Spotless Mind | 2004 | en | Lovestruck | 3.92 | 0.80 | 0.93 | emotional realism / visceral charge |  |
| 89 | Project Hail Mary | 2026 | en | Overthinker | 4.71 | 0.65 | 0.80 | wonder / complexity | new |
| 90 | The Platform | 2019 | es | Globetrotter | 1.00 | 0.60 | 0.95 | visceral charge / playful lightness | new |
| 91 | The Lord of the Rings: The Two Towers | 2002 | en | Voyager | 2.51 | 0.61 | 1.03 | wonder / slow burn | new |
| 92 | Midsommar | 2019 | en | Midnight Cultist | 4.14 | 0.80 | 0.78 | visceral charge / playful lightness |  |
| 93 | Arrival | 2016 | en | Aesthete | 2.79 | 0.59 | 0.94 | wonder / playful lightness |  |
| 94 | Eternals | 2021 | en | IMAX Idealist | 1.36 | 0.87 | 0.84 | wonder / originality | love-or-hate, new |
| 95 | Lady Bird | 2017 | en | Tenderhearted | 3.31 | 0.59 | 0.95 | playful lightness / spectacle |  |
| 96 | 1917 | 2019 | en | Eyewitness | 2.04 | 0.70 | 0.91 | spectacle / playful lightness |  |
| 97 | Nightcrawler | 2014 | en | Nihilist | 2.01 | 0.65 | 0.77 | complexity / playful lightness |  |
| 98 | Marty Supreme | 2025 | en | Hardboiled | 3.23 | 0.69 | 0.60 | complexity / slow burn | spread only |
| 99 | Rear Window | 1954 | en | Old Soul | 0.92 | 0.70 | 0.64 | visual style / slow burn | spread only |
| 100 | Moonrise Kingdom | 2012 | en | Disciple | 1.14 | 0.62 | 0.81 | playful lightness / visceral charge | new |
| 101 | Shrek 2 | 2004 | en | Animation Devotee | 2.28 | 0.78 | 1.12 | playful lightness / complexity |  |
| 102 | Star Wars: Episode I - The Phantom Menace | 1999 | en | Voyager | 2.18 | 0.56 | 1.05 | wonder / originality | love-or-hate, new |
| 103 | Superman | 2025 | en | IMAX Idealist | 3.48 | 0.66 | 1.13 | wonder / originality |  |
| 104 | Pitch Perfect | 2012 | en | Comic Relief | 1.50 | 0.76 | 1.54 | playful lightness / visual style |  |
| 105 | Past Lives | 2023 | en | Lovestruck | 1.91 | 0.77 | 1.20 | emotional realism / spectacle |  |
| 106 | Glass Onion: A Knives Out Mystery | 2022 | en | Overthinker | 3.09 | 0.63 | 0.92 | playful lightness / emotional realism | new |
| 107 | The Texas Chain Saw Massacre | 1974 | en | Midnight Cultist | 1.09 | 0.74 | 1.11 | visceral charge / playful lightness |  |
| 108 | The Whale | 2022 | en | Tenderhearted | 1.25 | 0.58 | 1.20 | slow burn / spectacle | new |
| 109 | E.T. the Extra-Terrestrial | 1982 | en | Voyager | 1.42 | 0.73 | 0.96 | wonder / complexity |  |
| 110 | The Blair Witch Project | 1999 | en | Midnight Cultist | 1.14 | 0.75 | 1.34 | visceral charge / visual style | love-or-hate, new |
| 111 | Her | 2013 | en | Aesthete | 2.36 | 0.62 | 0.98 | emotional realism / visceral charge |  |
| 112 | The Big Short | 2015 | en | Eyewitness | 1.20 | 0.59 | 1.03 | complexity / visual style |  |
| 113 | Gone Girl | 2014 | en | Nihilist | 3.39 | 0.55 | 0.82 | complexity / wonder |  |
| 114 | The Usual Suspects | 1995 | en | Hardboiled | 1.16 | 0.58 | 0.88 | complexity / emotional realism | new |
| 115 | Snow White and the Seven Dwarfs | 1938 | en | Old Soul | 0.65 | 0.75 | 0.91 | wonder / complexity | new |
| 116 | Zootopia | 2016 | en | Animation Devotee | 2.30 | 1.01 | 0.91 | playful lightness / emotional realism | new |
| 117 | Guardians of the Galaxy | 2014 | en | IMAX Idealist | 3.49 | 0.66 | 1.22 | wonder / slow burn |  |
| 118 | Smile | 2022 | en | Midnight Cultist | 1.66 | 0.56 | 1.16 | visceral charge / originality | love-or-hate |
| 119 | 21 Jump Street | 2012 | en | Comic Relief | 1.54 | 0.64 | 1.44 | playful lightness / visual style | new |
| 120 | 50 First Dates | 2004 | en | Lovestruck | 1.10 | 0.70 | 1.34 | playful lightness / visual style | new |
| 121 | The Matrix | 1999 | en | Overthinker | 3.19 | 0.57 | 1.08 | wonder / slow burn |  |
| 122 | Psycho | 1960 | en | Midnight Cultist | 1.51 | 0.63 | 0.87 | visceral charge / playful lightness |  |
| 123 | Harry Potter and the Goblet of Fire | 2005 | en | Voyager | 2.80 | 0.69 | 0.87 | wonder / originality | new |
| 124 | Juno | 2007 | en | Tenderhearted | 1.70 | 0.64 | 1.18 | playful lightness / visual style | new |
| 125 | Uncut Gems | 2019 | en | Nihilist | 1.84 | 0.69 | 0.76 | complexity / slow burn |  |
| 126 | Five Nights at Freddy's | 2023 | en | Midnight Cultist | 1.69 | 0.60 | 1.06 | visceral charge / visual style | love-or-hate |
| 127 | The Social Network | 2010 | en | Eyewitness | 2.94 | 0.62 | 0.74 | complexity / spectacle | spread only |
| 128 | Life of Pi | 2012 | en | Aesthete | 1.08 | 0.65 | 0.98 | wonder / playful lightness | new |
| 129 | The Nice Guys | 2016 | en | Hardboiled | 1.38 | 0.64 | 0.81 | playful lightness / emotional realism | new |
| 130 | Shrek | 2001 | en | Animation Devotee | 3.09 | 0.71 | 1.07 | playful lightness / complexity |  |
| 131 | Iron Man | 2008 | en | IMAX Idealist | 2.95 | 0.69 | 1.01 | spectacle / slow burn | new |
| 132 | White Chicks | 2004 | en | Comic Relief | 1.78 | 0.64 | 1.57 | playful lightness / visual style | new |
| 133 | Love Actually | 2003 | en | Lovestruck | 1.31 | 0.81 | 1.38 | playful lightness / originality | new |
| 134 | Star Wars: The Last Jedi | 2017 | en | IMAX Idealist | 1.73 | 0.60 | 0.80 | spectacle / slow burn | love-or-hate, new |
| 135 | Anora | 2024 | en | Tenderhearted | 2.68 | 0.79 | 0.65 | emotional realism / spectacle | spread only |
| 136 | Pirates of the Caribbean: The Curse of the Black Pearl | 2003 | en | Voyager | 2.23 | 0.57 | 1.01 | wonder / slow burn |  |
| 137 | The Substance | 2024 | en | Midnight Cultist | 3.99 | 0.61 | 0.75 | visceral charge / wonder |  |
| 138 | Conclave | 2024 | en | Overthinker | 2.04 | 0.72 | 0.65 | complexity / emotional realism | spread only |
| 139 | Apocalypse Now | 1979 | en | Nihilist | 1.10 | 0.58 | 1.12 | complexity / playful lightness |  |
| 140 | A Complete Unknown | 2024 | en | Eyewitness | 1.10 | 0.65 | 0.88 | slow burn / originality | new |
| 141 | The Lobster | 2015 | en | Aesthete | 1.23 | 0.68 | 0.81 | originality / spectacle |  |
| 142 | Bird Box | 2018 | en | Midnight Cultist | 1.34 | 0.75 | 0.91 | visceral charge / originality | love-or-hate |
| 143 | Léon: The Professional | 1994 | en | Hardboiled | 1.55 | 0.55 | 0.50 | visceral charge / wonder | spread only |
| 144 | Coco | 2017 | en | Animation Devotee | 3.39 | 0.82 | 1.07 | wonder / originality |  |
| 145 | Deadpool | 2016 | en | IMAX Idealist | 3.05 | 0.65 | 1.06 | playful lightness / visual style |  |
| 146 | We Live in Time | 2024 | en | Lovestruck | 1.18 | 0.73 | 1.49 | emotional realism / originality | new |
| 147 | Elf | 2003 | en | Comic Relief | 1.15 | 0.60 | 1.22 | playful lightness / complexity |  |
| 148 | Men in Black | 1997 | en | Voyager | 1.14 | 0.69 | 1.13 | wonder / emotional realism | new |
| 149 | Marriage Story | 2019 | en | Tenderhearted | 1.47 | 0.70 | 1.02 | emotional realism / spectacle |  |
| 150 | Don't Look Up | 2021 | en | Comic Relief | 2.62 | 0.60 | 0.78 | playful lightness / visual style | love-or-hate |
| 151 | Get Out | 2017 | en | Overthinker | 4.90 | 0.60 | 0.64 | visceral charge / slow burn | spread only |
| 152 | The Conjuring | 2013 | en | Midnight Cultist | 2.15 | 0.57 | 1.01 | visceral charge / originality | new |
| 153 | A Clockwork Orange | 1971 | en | Nihilist | 1.62 | 0.56 | 1.01 | complexity / emotional realism |  |
| 154 | Dunkirk | 2017 | en | Eyewitness | 2.05 | 0.59 | 0.86 | spectacle / slow burn | new |
| 155 | Drive | 2011 | en | Aesthete | 2.15 | 0.57 | 0.68 | visceral charge / playful lightness | spread only |
| 156 | Puss in Boots: The Last Wish | 2022 | en | Animation Devotee | 2.02 | 0.73 | 1.06 | wonder / slow burn |  |
| 157 | About Time | 2013 | en | Lovestruck | 1.71 | 0.57 | 1.36 | emotional realism / visual style | new |
| 158 | Black Panther | 2018 | en | IMAX Idealist | 3.19 | 0.74 | 0.84 | spectacle / originality |  |
| 159 | A Real Pain | 2024 | en | Tenderhearted | 1.16 | 0.61 | 0.96 | slow burn / spectacle | new |
| 160 | Zombieland | 2009 | en | Comic Relief | 1.28 | 0.67 | 1.16 | playful lightness / visual style | new |
| 161 | Nope | 2022 | en | Overthinker | 2.22 | 0.64 | 0.84 | spectacle / emotional realism | new |
| 162 | The Rocky Horror Picture Show | 1975 | en | Midnight Cultist | 1.02 | 0.94 | 0.83 | originality / emotional realism | new |
| 163 | Ford v Ferrari | 2019 | en | Eyewitness | 1.16 | 0.62 | 0.90 | spectacle / originality | new |
| 164 | The Truman Show | 1998 | en | Voyager | 5.51 | 0.61 | 0.44 | originality / visceral charge | spread only |
| 165 | The Shape of Water | 2017 | en | Aesthete | 1.11 | 0.58 | 0.79 | wonder / complexity | new |
| 166 | Tangled | 2010 | en | Animation Devotee | 2.70 | 0.73 | 1.30 | wonder / originality | new |
| 167 | The Dark Knight | 2008 | en | IMAX Idealist | 4.99 | 0.58 | 0.83 | spectacle / slow burn |  |
| 168 | Clueless | 1995 | en | Lovestruck | 2.07 | 0.59 | 1.20 | playful lightness / visual style |  |
| 169 | Moonlight | 2016 | en | Tenderhearted | 1.61 | 0.64 | 1.05 | emotional realism / spectacle |  |
| 170 | Scott Pilgrim vs. the World | 2010 | en | Comic Relief | 2.77 | 0.57 | 0.96 | playful lightness / slow burn |  |
| 171 | The Witch | 2015 | en | Midnight Cultist | 1.63 | 0.60 | 0.85 | visceral charge / playful lightness |  |
| 172 | The Revenant | 2015 | en | Eyewitness | 1.55 | 0.64 | 0.87 | spectacle / playful lightness | new |
| 173 | Saw | 2004 | en | Overthinker | 1.29 | 0.55 | 1.17 | visceral charge / visual style |  |
| 174 | Jumanji | 1995 | en | Voyager | 1.00 | 0.57 | 1.05 | wonder / complexity |  |
| 175 | Kung Fu Panda | 2008 | en | Animation Devotee | 1.86 | 0.67 | 1.33 | playful lightness / originality | new |
| 176 | The Parent Trap | 1998 | en | Lovestruck | 1.43 | 0.57 | 1.38 | playful lightness / originality |  |
| 177 | Kill Bill: Vol. 1 | 2003 | en | IMAX Idealist | 3.68 | 0.58 | 0.94 | spectacle / slow burn |  |
| 178 | Asteroid City | 2023 | en | Comic Relief | 1.15 | 0.60 | 0.84 | slow burn / visceral charge |  |
| 179 | The Royal Tenenbaums | 2001 | en | Tenderhearted | 1.11 | 0.66 | 0.71 | slow burn / visceral charge | spread only |
| 180 | 28 Days Later | 2002 | en | Midnight Cultist | 1.53 | 0.64 | 0.85 | visceral charge / playful lightness |  |
| 181 | Us | 2019 | en | Overthinker | 2.58 | 0.60 | 0.78 | visceral charge / emotional realism |  |
| 182 | The Imitation Game | 2014 | en | Eyewitness | 1.21 | 0.55 | 0.99 | emotional realism / originality |  |
| 183 | Soul | 2020 | en | Animation Devotee | 2.70 | 0.82 | 0.84 | wonder / visceral charge | new |
| 184 | When Harry Met Sally... | 1989 | en | Lovestruck | 1.37 | 0.57 | 1.30 | playful lightness / visual style | new |
| 185 | John Wick | 2014 | en | IMAX Idealist | 2.05 | 0.59 | 0.90 | spectacle / slow burn |  |
| 186 | The Iron Claw | 2023 | en | Tenderhearted | 1.11 | 0.63 | 0.93 | emotional realism / visual style | new |
| 187 | Shaun of the Dead | 2004 | en | Comic Relief | 1.33 | 0.74 | 0.87 | playful lightness / complexity |  |
| 188 | Halloween | 1978 | en | Midnight Cultist | 1.22 | 0.60 | 1.06 | visceral charge / emotional realism |  |
| 189 | Up | 2009 | en | Animation Devotee | 3.38 | 0.65 | 0.95 | wonder / complexity |  |
| 190 | Pride & Prejudice | 2005 | en | Lovestruck | 2.38 | 0.65 | 0.87 | playful lightness / originality |  |
| 191 | Hot Fuzz | 2007 | en | Comic Relief | 1.06 | 0.62 | 1.09 | playful lightness / emotional realism |  |
| 192 | Saltburn | 2023 | en | Midnight Cultist | 3.28 | 0.58 | 0.65 | complexity / emotional realism | spread only |
| 193 | Spider-Man 2 | 2004 | en | IMAX Idealist | 2.70 | 0.56 | 0.66 | spectacle / slow burn | spread only |
| 194 | Finding Nemo | 2003 | en | Animation Devotee | 2.67 | 0.62 | 1.01 | wonder / complexity |  |
| 195 | The Great Gatsby | 2013 | en | Lovestruck | 1.64 | 0.70 | 0.89 | emotional realism / playful lightness | new |
| 196 | The Lighthouse | 2019 | en | Midnight Cultist | 1.68 | 0.55 | 0.94 | complexity / emotional realism |  |
| 197 | KPop Demon Hunters | 2025 | en | Animation Devotee | 1.99 | 0.74 | 1.02 | wonder / slow burn |  |
| 198 | Pearl | 2022 | en | Midnight Cultist | 2.17 | 0.75 | 0.65 | visceral charge / playful lightness | spread only |
| 199 | Grease | 1978 | en | Lovestruck | 1.23 | 0.60 | 1.02 | playful lightness / complexity |  |
| 200 | WALL·E | 2008 | en | Animation Devotee | 3.02 | 0.55 | 1.02 | wonder / complexity |  |
| 201 | Frozen | 2013 | en | Animation Devotee | 2.01 | 0.62 | 1.07 | wonder / complexity |  |
| 202 | The Nightmare Before Christmas | 1993 | en | Animation Devotee | 2.11 | 0.58 | 1.13 | wonder / complexity |  |
| 203 | The Lion King | 1994 | en | Animation Devotee | 2.32 | 0.63 | 0.84 | wonder / complexity |  |
| 204 | Blade Runner | 1982 | en | Aesthete | 1.58 | 0.51 | 1.01 | slow burn / playful lightness | provisional, new |
| 205 | The Boy and the Heron | 2023 | ja | Animation Devotee | 1.34 | 0.51 | 1.06 | wonder / visceral charge | provisional, new |
| 206 | Society of the Snow | 2023 | es | Globetrotter | 1.24 | 0.48 | 0.69 | emotional realism / originality | provisional, new |
| 207 | Akira | 1988 | ja | Animation Devotee | 1.01 | 0.39 | 1.10 | spectacle / playful lightness | provisional, new |
| 208 | The Sound of Music | 1965 | en | Old Soul | 0.75 | 0.49 | 0.86 | playful lightness / complexity | provisional, new |
| 209 | Rosemary's Baby | 1968 | en | Old Soul | 0.65 | 0.45 | 0.69 | visceral charge / playful lightness | provisional, new |

## 8. Cards removed

**Under the popularity floor (71):** The Tree of Life, mother!, Tár, Paddington 2, The Favourite, Punch-Drunk Love, Phantom Thread, Eraserhead, Perfect Days, Beau Is Afraid, The Handmaiden, The Master, Life Is Beautiful, Monty Python and the Holy Grail, Barry Lyndon, Chungking Express, Under the Skin, Another Round, The Hunt, Breakfast at Tiffany's, Cinema Paradiso, The Graduate, Come and See, Chinatown, Seven Samurai, Persona, Groundhog Day, Some Like It Hot, Spotlight, Airplane!, Hidden Figures, Children of Men, The Power of the Dog, Y Tu Mamá También, Shoplifters, Being John Malkovich, Amadeus, Moneyball, 12 Years a Slave, Apollo 13, The King's Speech, Roma, Decision to Leave, Drive My Car, RRR, Crouching Tiger, Hidden Dragon, The Lives of Others, Burning, Lawrence of Arabia, The Apartment, Sunset Boulevard, North by Northwest, Roman Holiday, To Kill a Mockingbird, The Neon Demon, Magnolia, Paris, Texas, Incendies, Amores Perros, Wild Tales, A Separation, The Secret in Their Eyes, 3 Idiots, Suspiria, Stalker, Hero, The Assassination of Jesse James, Only God Forgives, Melancholia, Joker: Folie à Deux, Babygirl.

**Consensus, spread under 0.55 (88), with their spread:** La La Land (0.54), Good Will Hunting (0.44), Se7en (0.51), Whiplash (0.50), Toy Story (0.52), Hereditary (0.51), Mulholland Drive (0.43), No Country for Old Men (0.38), Gladiator (0.39), The Avengers (0.43), Pan's Labyrinth (0.34), Mad Max: Fury Road (0.47), Harry Potter and the Philosopher's Stone (0.42), Birdman (0.44), Donnie Darko (0.54), There Will Be Blood (0.43), Lost in Translation (0.53), Manchester by the Sea (0.49), 10 Things I Hate About You (0.51), The Batman (0.53), Charlie and the Chocolate Factory (0.54), The Hunger Games (0.48), The Devil Wears Prada (0.42), Nosferatu (0.47), Dead Poets Society (0.44), American Psycho (0.37), Jaws (0.51), Inglourious Basterds (0.46), Aftersun (0.48), Scream (0.44), The Godfather (0.37), Fantastic Mr. Fox (0.43), School of Rock (0.46), Avatar (0.38), Portrait of a Lady on Fire (0.32), The Notebook (0.52), The Florida Project (0.45), The Princess Bride (0.42), La Haine (0.43), Alien (0.49), Little Women (0.49), Howl's Moving Castle (0.51), The Menu (0.51), Matilda (0.50), The Fellowship of the Ring (0.26), Little Miss Sunshine (0.45), In the Mood for Love (0.52), Rocky (0.46), The Shawshank Redemption (0.49), Memories of Murder (0.47), The Wizard of Oz (0.53), My Neighbor Totoro (0.45), The Silence of the Lambs (0.49), The Chronicles of Narnia (0.51), Jojo Rabbit (0.42), The Worst Person in the World (0.52), How to Lose a Guy in 10 Days (0.40), The Intouchables (0.38), Catch Me If You Can (0.51), The Thing (0.50), Vertigo (0.39), The Breakfast Club (0.52), It's a Wonderful Life (0.45), Princess Mononoke (0.28), GoodFellas (0.33), Anyone But You (0.48), Train to Busan (0.43), Memento (0.44), The Holdovers (0.38), Perfect Blue (0.40), Zodiac (0.50), Dr. Strangelove (0.39), One Flew Over the Cuckoo's Nest (0.45), Scarface (0.44), The Exorcist (0.45), The Departed (0.52), Raiders of the Lost Ark (0.38), Heat (0.49), Before Sunrise (0.46), Terminator 2 (0.34), Reservoir Dogs (0.38), Ghostbusters (0.51), The Good, the Bad and the Ugly (0.38), Schindler's List (0.32), Bohemian Rhapsody (0.52), The Pianist (0.45), Eyes Wide Shut (0.51), No Hard Feelings (0.54).

About 20 of these sit within 0.05 of the bar (La La Land, Donnie Darko, The Batman, Toy Story and others). With 23 member libraries, that margin is noise. If the deck feels too unfamiliar, these are the first to bring back. Two franchise swaps keep the series in the deck with a more divisive entry: The Two Towers for The Fellowship of the Ring, and Goblet of Fire for Philosopher's Stone.

## Caveats

- Spread comes from 23 member libraries, 9 of them with 200 or more ratings. 77 of the 209 cards have fewer than 4 member ratings and pass on the crowd-average prior alone (crowd average under about 4.2). Treat those as likely, not proven.
- Letterboxd's own rating histogram per film would settle variance far better than 23 members. It is not in the catalog.
- Eleven cards are 2025 or 2026 releases (Sinners, Obsession, Project Hail Mary, F1, Michael, Hamnet and others). They are heavily logged now and their label confidence is 65 to 88. Review them in a year.
- Re-run this check on real `deck_unseen` rates once a few hundred people have taken the test.
