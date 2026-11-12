# Onboarding deck v3: more international films, even archetypes, more slow burn, language packs

Date: 2026-11-12. Read-only proposal; no app code changed. v2 (`onboarding-deck-v2.md`) is kept. The machine-readable deck and the language packs are in `onboarding-deck-v3.json`.

## Summary

- **224 core cards. The seed 15 is exactly v2's.**
- **47 non-English cards (21%)**, up from 11. They are spaced evenly: every window of 15 cards holds 2 to 4 of them, and 5 sit inside the first 30.
- **Archetypes are near even: 11 to 17 cards each** (v2: 6 to 23). Every archetype has at least 10.
- **Slow burn: 27 cards lead on it** (v2: 9), 35 counting films that score 60 or more on it.
- All 10 owner-approved replacements are in. None is under its floor now.
- **Nine language packs** are built for the card deck, 4 to 30 cards each. Kannada (4), Malayalam (16) and Telugu (17) are capped by the catalog.
- **The cost:** 50 cards are in without evidence that they split people. The share of informative cards is 72% (v2: 89%), and the expected not-seen rate rises to 44% over the whole deck (v2: 40%) because international cards average 58%. The first 30 stay at 29%.

## 1. What changed from v2

| Rule | v2 | v3 |
|---|---|---|
| Popularity floor, English | 1.0M Letterboxd logs (0.65M before 1970) | Same |
| Popularity floor, non-English | 1.0M | **0.4M**, because Letterboxd undercounts them. RRR (0.37M) is kept and flagged as the only Indian film in the core deck |
| Variance bar (spread 0.55 or more) | Every card | Waived for three flagged groups: international landmarks (23 cards), slow-burn cards (10), and fill cards for thin archetypes (9) |
| Archetype sizes | Whatever passed | Thin ones filled to about 14; large ones trimmed to 16 by dropping their lowest-scoring English cards |
| Owner-approved replacements | 6 parked at the back | All 10 in the main order |

Card tiers in the JSON: seed 15, core 142, love-it-or-hate-it 17, international landmark 23, slow burn 10, archetype balance 9, owner-approved replacement 8 (the other two approved films qualify as core).

For a non-English card, "Haven't seen" is itself a Globetrotter signal, so these cards teach the model something either way.

## 2. Archetype and strand counts

| Archetype | Cards | Informative (measured) | Non-English |
|---|---|---|---|
| Aesthete | 14 | 11 | 2 |
| Animation Devotee | 16 | 12 | 6 |
| Comic Relief | 16 | 16 | 0 |
| Disciple | 14 | 6 | 4 |
| Eyewitness | 14 | 13 | 1 |
| Globetrotter | 17 | 7 | 17 |
| Hardboiled | 14 | 6 | 2 |
| IMAX Idealist | 16 | 15 | 2 |
| Lovestruck | 16 | 12 | 1 |
| Midnight Cultist | 16 | 14 | 2 |
| Nihilist | 11 | 10 | 1 |
| Old Soul | 14 | 7 | 2 |
| Overthinker | 16 | 11 | 3 |
| Tenderhearted | 16 | 8 | 4 |
| Voyager | 14 | 13 | 0 |

| Strand | v1: high / low | v2: high / low | v3: high / low |
|---|---|---|---|
| Emotional realism | 38 / 25 | 21 / 23 | 27 / 20 |
| Complexity | 46 / 23 | 23 / 19 | 28 / 13 |
| Slow burn | 29 / 33 | 9 / 27 | 27 / 22 |
| Originality | 10 / 29 | 4 / 42 | 5 / 39 |
| Visual style | 4 / 26 | 2 / 22 | 5 / 17 |
| Visceral charge | 46 / 30 | 32 / 18 | 32 / 28 |
| Spectacle | 27 / 37 | 28 / 14 | 23 / 24 |
| Wonder | 42 / 17 | 48 / 5 | 43 / 11 |
| Playful lightness | 51 / 73 | 42 / 39 | 34 / 50 |


- Archetype min 11 (Nihilist), max 17 (Globetrotter). "Informative (measured)" means floor, spread 0.55 or more, and strand separation 0.75 or more.
- Disciple, Hardboiled and Old Soul reach 14 only with fill cards whose member spread is under the bar: There Will Be Blood, Birdman, Eyes Wide Shut, The Departed, Catch Me If You Can, Heat, The Silence of the Lambs, Vertigo, It's a Wonderful Life, Dr. Strangelove and Killers of the Flower Moon (tier "archetype balance" or "slow burn" in the JSON).
- Slow burn cards admitted without the variance bar: The Shawshank Redemption, Manchester by the Sea, Aftersun, The Florida Project, Lost in Translation, Before Sunrise, The Holdovers, There Will Be Blood, Brokeback Mountain, Killers of the Flower Moon.
- Originality and visual style still have few cards at the high end (5 each). Most cards score high on both, so few stand out; the low end carries the separation.
- Archetypes for cards new to the deck are my assignment. Rebake `probe-archetypes.json` before shipping.

## 3. Order

1. Seed 15, unchanged.
2. Each archetype's cards are spread evenly over the rest of the deck, best score first, with slow-burn cards lifted. A smoothing pass avoids repeating an archetype or a leading strand close together.
3. Non-English cards are then spaced evenly: one about every fifth card from card 19 to card 222.
4. Love-it-or-hate-it cards sit at 18 and 26, then every twelfth card from 42 to 210.

Result: **any 15 consecutive cards touch at least 11 archetypes (median 13) and at least 6 of the 9 strands (median 7).** The first 30 touch all 15 archetypes.

Cards 16 to 30: Inside Out, Hamnet, Twilight, Oldboy, Mean Girls, Black Swan, The Zone of Interest, Sentimental Value, Joker, Interstellar, Star Wars: The Rise of Skywalker, We Live in Time, Howl's Moving Castle, There Will Be Blood, Sinners.

## 4. Non-English cards in the core deck (47)

| # | Film | Year | Language | Archetype | Logs (M) | Member spread | Basis |
|---|---|---|---|---|---|---|---|
| 5 | Spirited Away | 2001 | ja | Animation Devotee | 4.14 | 0.77 | measured or prior spread |
| 11 | Parasite | 2019 | ko | Globetrotter | 5.99 | 0.62 | measured or prior spread |
| 19 | Oldboy | 2003 | ko | Globetrotter | 1.77 | 0.63 | measured or prior spread |
| 23 | Sentimental Value | 2025 | no | Globetrotter | 1.07 | 0.71 | measured or prior spread |
| 28 | Howl's Moving Castle | 2004 | ja | Animation Devotee | 2.81 | 0.51 | landmark, variance unmeasured |
| 32 | Grave of the Fireflies | 1988 | ja | Tenderhearted | 1.43 | 0.52 | landmark, variance unmeasured |
| 37 | Perfect Days | 2023 | ja | Disciple | 0.94 | 0.50 | landmark, variance unmeasured |
| 41 | Amélie | 2001 | fr | Globetrotter | 1.50 | 0.77 | measured or prior spread |
| 46 | Godzilla Minus One | 2023 | ja | IMAX Idealist | 1.01 | 0.61 | measured or prior spread |
| 51 | Perfect Blue | 1998 | ja | Overthinker | 1.42 | 0.40 | landmark, variance unmeasured |
| 56 | City of God | 2002 | pt | Globetrotter | 1.34 | 1.14 | measured or prior spread |
| 60 | Cinema Paradiso | 1988 | it | Old Soul | 0.57 | 0.95 | measured or prior spread |
| 64 | Train to Busan | 2016 | ko | Midnight Cultist | 1.36 | 0.43 | landmark, variance unmeasured |
| 70 | Anatomy of a Fall | 2023 | fr | Hardboiled | 1.59 | 0.68 | measured or prior spread |
| 74 | In the Mood for Love | 2000 | cn | Aesthete | 1.12 | 0.52 | landmark, variance unmeasured |
| 79 | Society of the Snow | 2023 | es | Globetrotter | 1.24 | 0.48 | landmark, variance unmeasured |
| 83 | My Neighbor Totoro | 1988 | ja | Animation Devotee | 2.21 | 0.45 | landmark, variance unmeasured |
| 88 | Chungking Express | 1994 | cn | Disciple | 0.86 | 0.55 | measured or prior spread |
| 93 | I'm Still Here | 2024 | pt | Globetrotter | 0.82 | 0.49 | landmark, variance unmeasured |
| 97 | A Silent Voice: The Movie | 2016 | ja | Tenderhearted | 1.03 | 0.55 | measured or prior spread |
| 101 | Memories of Murder | 2003 | ko | Globetrotter | 1.14 | 0.47 | landmark, variance unmeasured |
| 107 | Pan's Labyrinth | 2006 | es | Globetrotter | 1.12 | 0.34 | landmark, variance unmeasured |
| 111 | All Quiet on the Western Front | 2022 | de | Eyewitness | 1.29 | 0.59 | measured or prior spread |
| 116 | The Boy and the Heron | 2023 | ja | Animation Devotee | 1.34 | 0.51 | landmark, variance unmeasured |
| 121 | The Intouchables | 2011 | fr | Globetrotter | 1.06 | 0.38 | landmark, variance unmeasured |
| 125 | The Handmaiden | 2016 | ko | Overthinker | 0.89 | 0.54 | landmark, variance unmeasured |
| 130 | Portrait of a Lady on Fire | 2019 | fr | Lovestruck | 1.21 | 0.32 | landmark, variance unmeasured |
| 134 | Come and See | 1985 | ru | Nihilist | 0.52 | 0.23 | landmark, variance unmeasured |
| 140 | The Platform | 2019 | es | Globetrotter | 1.00 | 0.60 | measured or prior spread |
| 144 | Another Round | 2020 | da | Tenderhearted | 0.74 | 0.59 | measured or prior spread |
| 148 | Stalker | 1979 | ru | Disciple | 0.41 | 0.66 | measured or prior spread |
| 153 | No Other Choice | 2025 | ko | Globetrotter | 0.92 | 0.47 | landmark, variance unmeasured |
| 158 | Princess Mononoke | 1997 | ja | Animation Devotee | 1.88 | 0.28 | landmark, variance unmeasured |
| 163 | Life Is Beautiful | 1997 | it | Globetrotter | 0.87 | 0.47 | landmark, variance unmeasured |
| 167 | La Haine | 1995 | fr | Hardboiled | 1.24 | 0.43 | landmark, variance unmeasured |
| 171 | Roma | 2018 | es | Aesthete | 0.49 | 0.63 | measured or prior spread |
| 177 | Seven Samurai | 1954 | ja | Old Soul | 0.48 | 0.39 | landmark, variance unmeasured |
| 181 | Y Tu Mamá También | 2001 | es | Globetrotter | 0.54 | 0.46 | landmark, variance unmeasured |
| 185 | RRR | 2022 | te | IMAX Idealist | 0.37 | 0.31 | landmark, variance unmeasured; under floor |
| 191 | Akira | 1988 | ja | Midnight Cultist | 1.01 | 0.39 | landmark, variance unmeasured |
| 195 | The Hunt | 2012 | da | Globetrotter | 0.72 | 0.38 | landmark, variance unmeasured |
| 200 | Incendies | 2010 | fr | Overthinker | 0.70 | 0.45 | landmark, variance unmeasured |
| 204 | Persona | 1966 | sv | Disciple | 0.48 | 0.37 | landmark, variance unmeasured |
| 209 | Your Name. | 2016 | ja | Animation Devotee | 1.74 | 0.83 | measured or prior spread |
| 214 | The Worst Person in the World | 2021 | no | Tenderhearted | 1.10 | 0.52 | landmark, variance unmeasured |
| 218 | Drive My Car | 2021 | ja | Globetrotter | 0.40 | 0.56 | measured or prior spread |
| 222 | Decision to Leave | 2022 | ko | Globetrotter | 0.43 | 0.55 | measured or prior spread |

Still out, under 0.4M logs: Shoplifters, Crouching Tiger, Hidden Dragon, The Lives of Others, Burning, Amores Perros, Wild Tales, A Separation, The Secret in Their Eyes, 3 Idiots, Hero. The Spanish and Hindi ones are in their language packs.

## 5. Language packs for the card deck

When a person's languages or country are set (India maps to Hindi plus any chosen regional language), the card deck mixes in cards from that language's pack, in addition to the home-language rows on "Rate films you love".

### Ready today

| Language | Films in catalog | Model-ready in catalog | Pack cards ready today | Also in the core deck | Classic / loved hit / recent hit / divisive |
|---|---|---|---|---|---|
| Hindi | 1590 | 391 | 30 | 0 | 11 / 7 / 7 / 5 |
| Tamil | 504 | 56 | 27 | 0 | 6 / 8 / 7 / 6 |
| Telugu | 288 | 27 | 17 | 1 | 0 / 7 / 7 / 3 |
| Malayalam | 268 | 16 | 16 | 0 | 1 / 5 / 10 / 0 |
| Kannada | 30 | 4 | 4 | 0 | 0 / 0 / 4 / 0 |
| Korean | 1415 | 377 | 20 | 7 | 7 / 4 / 5 / 4 |
| Japanese | 3342 | 985 | 16 | 14 | 3 / 3 / 8 / 2 |
| Spanish | 3612 | 657 | 23 | 5 | 5 / 6 / 4 / 8 |
| French | 6260 | 1952 | 18 | 6 | 7 / 2 / 5 / 4 |

**Hindi (30 cards).** Dilwale Dulhania Le Jayenge (1995); Anand (1971); Like Stars on Earth (2007); Koi... Mil Gaya (2003); Mujhse Dosti Karoge! (2002, divisive); Dhurandhar: The Revenge (2026); Jawan (2023); Andhadhun (2018); 3 Idiots (2009); Saiyaara (2025, divisive); Sholay (1975); Dhurandhar (2025); PK (2014); Border (1997); Animal (2023, divisive); Kill (2024); Dangal (2016); Darr (1993); Uri: The Surgical Strike (2019); Pathaan (2023, divisive); Main Hoon Na (2004); Hum Aapke Hain Koun..! (1994); Bajrangi Bhaijaan (2015); Sarfarosh (1999); War (2019, divisive); Baazigar (1993); My Name Is Khan (2010); Mohabbatein (2000); Ghajini (2008); 12th Fail (2023).

- Archetypes (heuristic): Tenderhearted 11, Comic Relief 6, Nihilist 5, IMAX Idealist 3, Lovestruck 2, Aesthete 1, Voyager 1, Hardboiled 1.
- High strands: emotional realism 13, playful lightness 6, visceral charge 5, spectacle 3, slow burn 1, wonder 1, complexity 1.

**Tamil (27 cards).** Indian (1996); Iruvar (1997); Yavarum Nalam (2009); Enthiran (2010); I (2015, divisive); Anbe Sivam (2003); Roja (1992); Maharaja (2024); Anniyan (2005); Kabali (2016, divisive); Dragon (2025); Nayakan (1987); Leo (2023); Theri (2016); Coolie (2025, divisive); Bombay (1995); Ratsasan (2018); Sivaji: The Boss (2007); Jai Bhim (2021); Jailer (2023, divisive); Master (2021); Thuppakki (2012); Kaithi (2019); 7Aum Arivu (2011); 2.0 (2018, divisive); Kaththi (2014); Beast (2022, divisive).

- Archetypes (heuristic): IMAX Idealist 10, Nihilist 8, Tenderhearted 6, Comic Relief 2, Overthinker 1.
- High strands: spectacle 10, visceral charge 8, emotional realism 6, playful lightness 2, complexity 1.

**Telugu (17 cards).** Bāhubali: The Beginning (2015); Eega (2012); 1: Nenokkadine (2014); Kanche (2015); Mukunda (2014, divisive); Lucky Baskhar (2024); Sita Ramam (2022); Magadheera (2009); Maryada Ramanna (2010); Kalki 2898-AD (2024, divisive); Hi Nanna (2023); Bāhubali 2: The Conclusion (2017); Ala Vaikunthapurramuloo (2020); Jersey (2019); Saaho (2019, divisive); Pushpa: The Rise (2021); Salaar: Part 1 - Ceasefire (2023).

- Archetypes (heuristic): IMAX Idealist 6, Comic Relief 4, Tenderhearted 3, Nihilist 1, Lovestruck 1, Hardboiled 1, Voyager 1.
- High strands: spectacle 6, playful lightness 4, emotional realism 4, visceral charge 1, complexity 1, wonder 1.

**Malayalam (16 cards).** Manichitrathazhu (1993); Premam (2015); Drishyam (2013); Charlie (2015); All We Imagine as Light (2024); Hridayam (2022); Lucifer (2019); Jallikattu (2019); Ustad Hotel (2012); Drishyam 2 (2021); Lokah Chapter 1: Chandra (2025); Kumbalangi Nights (2019); Bangalore Days (2014); Minnal Murali (2021); Manjummel Boys (2024); Thallumaala (2022).

- Archetypes (heuristic): Comic Relief 6, Hardboiled 2, Voyager 2, Aesthete 2, Tenderhearted 1, Lovestruck 1, Overthinker 1, Disciple 1.
- High strands: playful lightness 6, complexity 3, emotional realism 2, wonder 2, slow burn 2, originality 1.

**Kannada (4 cards).** Kantara - A Legend: Chapter 1 (2025); K.G.F: Chapter 2 (2022); Kantara (2022); K.G.F: Chapter 1 (2018).

- Archetypes (heuristic): Voyager 2, IMAX Idealist 2.
- High strands: wonder 2, spectacle 2.

**Korean (20 cards).** Shiri (1999); The Housemaid (1960); The Quiet Family (1998); The Host (2006); Whispering Corridors (1998, divisive); I Saw the Devil (2010); 20th Century Girl (2022); Along with the Gods: The Two Worlds (2017); Christmas in August (1998); The Witch: Part 2. The Other One (2022, divisive); Attack the Gas Station! (1999); Gonjiam: Haunted Asylum (2018); The Gangster, the Cop, the Devil (2019); Even If This Love Disappears Tonight (2025); Peninsula (2020, divisive); Memento Mori (1999); The Witch: Part 1. The Subversion (2018); Green Fish (1997); Hope (2013); Project Wolf Hunting (2022, divisive).

- Archetypes (heuristic): Tenderhearted 5, Nihilist 5, Midnight Cultist 4, Comic Relief 2, Lovestruck 2, Old Soul 1, Voyager 1.
- High strands: visceral charge 10, emotional realism 7, playful lightness 2, wonder 1.

**Japanese (16 cards).** Neon Genesis Evangelion: The End of Evangelion (1997); The Cat Returns (2002); Kiki's Delivery Service (1989); The Secret World of Arrietty (2010); Tales from Earthsea (2006, divisive); Ponyo (2008); The Last: Naruto the Movie (2014); Demon Slayer: Kimetsu no Yaiba Infinity Castle (2025); Chainsaw Man - The Movie: Reze Arc (2025); Dragon Ball Z: Resurrection 'F' (2015, divisive); Attack on Titan: THE LAST ATTACK (2024); Demon Slayer: Mugen Train (2020); Violet Evergarden: The Movie (2020); Evangelion: 3.0+1.0 Thrice Upon a Time (2021); Chiikawa the Movie: The Secret of the Mermaid Island (2026); Look Back (2024).

- Archetypes (heuristic): Animation Devotee 12, Voyager 3, IMAX Idealist 1.
- High strands: wonder 8, spectacle 4, emotional realism 3, complexity 1.

**Spanish (23 cards).** Live Flesh (1997); All About My Mother (1999); El Mariachi (1993); [REC] (2007); Jamon Jamon (1992, divisive); Robot Dreams (2023); Romería (2025); High Heels (1991); The Orphanage (2007); Sex, Shame & Tears (1999, divisive); I Am Frankelda (2025); Radical (2023); El Infierno (2010); The Secret in Their Eyes (2009); Three Steps Above Heaven (2010, divisive); Bad Education (2004); Marrowbone (2017); The Invisible Guest (2017); I Want You (2012, divisive); My Fault (2023, divisive); Through My Window (2022, divisive); Loving Pablo (2017, divisive); Mummies (2023, divisive).

- Archetypes (heuristic): Overthinker 6, Tenderhearted 6, Animation Devotee 3, Aesthete 2, Lovestruck 2, Nihilist 1, Midnight Cultist 1, Comic Relief 1, Hardboiled 1.
- High strands: emotional realism 8, complexity 7, slow burn 3, visceral charge 2, playful lightness 2, wonder 1.

**French (18 cards).** The Swimming Pool (1969); Taxi (1998); The Big Blue (1988); Irreversible (2002); Rubber (2010, divisive); Mommy (2014); The Extraordinary Adventures of Adèle Blanc-Sec (2010); The Three Musketeers: D'Artagnan (2023); Little Amélie or the Character of Rain (2025); Blue Is the Warmest Color (2013, divisive); Les Misérables (2019); Don't Look Now... We're Being Shot At! (1966); Asterix & Obelix: Mission Cleopatra (2002); The Count of Monte Cristo (2024); Miraculous: Ladybug & Cat Noir, The Movie (2023, divisive); Jim Queen (2026); Ruby & Quentin (2003); Asterix & Obelix: The Middle Kingdom (2023, divisive).

- Archetypes (heuristic): Comic Relief 4, Animation Devotee 3, Old Soul 2, Lovestruck 2, IMAX Idealist 2, Nihilist 1, Disciple 1, Tenderhearted 1, Voyager 1, Hardboiled 1.
- High strands: playful lightness 6, emotional realism 3, complexity 2, wonder 2, spectacle 2, visceral charge 1, originality 1, slow burn 1.

How the packs were chosen:

- The most popular films on TMDB within the language that have an embedding and labels, taken from three eras (before 2000, 2000 to 2016, 2017 on) so each pack mixes classics, loved hits and recent hits. "Divisive" means the crowd rates the film under 3.2.
- Raw TMDB popularity ranks adult titles high in Spanish, French, Japanese and Korean. I removed about 16 adult or near-duplicate titles by hand. The picker needs an adult-content filter before this is automated.
- Films already in the core deck are not repeated in a pack; they are pulled forward for that viewer instead (column "Also in the core deck").
- Spanish, French, Korean and Japanese have hundreds of ready films, so their packs can be topped up to 30 with a hand pass. The Japanese pack is almost all anime; popular live-action is thin near the top of the TMDB ranking.
- Pack archetypes are a heuristic from the film's leading strand and genre, not the model's read. Balance is uneven: the Tamil, Telugu and Kannada packs lean heavily on spectacle and visceral action, because that is what is ready.

### What needs the backfill first

This ties to Part 3 (Catalog backfill) of `fable-change-plan.md`.

| Language | Gap | Most-logged films not model-ready |
|---|---|---|
| Kannada | 4 ready of 30 in the catalog. Needs new catalog rows, not just labels | UI, Mark, A (1998), Upendra, Pushpaka Vimana, Kirik Party, Pailwaan |
| Malayalam | 16 ready of 268 | Aavesham, Bramayugam, Sarvam Maya, Eko, Diés Iraé, Marco, L2: Empuraan, Guruvayoor Ambalanadayil |
| Telugu | 27 ready of 288 | Pushpa 2: The Rule, HIT: The Third Case, Saripodhaa Sanivaaram, Kuberaa, They Call Him OG, Devara: Part 1, Guntur Kaaram |
| Tamil | 56 ready of 504 | Meiyazhagan, Tourist Family, Retro, The Greatest of All Time, Amaran, Vettaiyan, Raayan |
| Hindi | 391 ready of 1,590; the pack is full | Homebound, Stree 2, Shaitaan, Superboys of Malegaon, Sitaare Zameen Par, Chhaava, War 2 |

Order: Kannada, Malayalam, Telugu, Tamil, then Hindi. The first three cannot reach 20 cards until the backfill runs. All four southern packs also lack classics from before 2000 (Telugu and Kannada have none ready).

### How a pack interleaves with the core deck

- The seed 15 is the same for everyone, so friends keep films in common and every archetype gets its early read.
- From card 16, **every third card comes from the person's pack** (cards 18, 21, 24 and so on) until the pack runs out. A 30-rating run then shows about 5 pack cards; a person who skips a lot sees the whole pack by about card 105.
- Thin packs (under 15 cards: Kannada today) use every fifth card, so they are not spent in the first minute.
- Two languages alternate pack slots. India with no regional language uses Hindi.
- Inside a pack, cards go round-robin by archetype with loved films first and a divisive film every fifth pack card. `adaptDeck` treats pack cards as ordinary cards for lanes.
- A pack slot that lands on a love-it-or-hate-it position pushes that card back by one.
- Core non-English cards in the person's language move forward into pack slots first (for Japanese, 14 of them).

## 6. Before and after

| | v1 (live) | v2 | v3 |
|---|---|---|---|
| Cards | 293 | 209 | 224 |
| Non-English | 48 (16%), 25 past card 200 | 14 (7%) | 47 (21%), evenly spaced |
| Archetype min / max | 16 / 28 | 6 / 23 | 11 / 17 |
| Cards leading on slow burn | 29 | 9 | 27 |
| Informative (floor, spread, separation) | 119 (41%) | 187 (89%) | 161 (72%) |
| Pass the variance bar | 134 (46%) | 203 (97%) | 174 (78%) |
| Expected not-seen rate, whole deck | 47% | 40% | 44% |
| Expected not-seen rate, first 30 | 27% | 28% | 29% |

Not-seen rate by group in v3: English cards 40%, non-English cards 58%.

## Caveats

- Spread still rests on 23 member libraries. The 50 waived cards are in on the owner's judgement that they are taste tests, not on measured variance.
- The seen-rate index is built from Letterboxd logs, so it overstates "Haven't seen" for non-English films among viewers from those countries. With a language pack set, the real rate for that viewer should be far lower.
- Pack films with under 20k Letterboxd logs (most Tamil, Telugu and Malayalam cards) have thinner label evidence; check a sample by hand before launch.
