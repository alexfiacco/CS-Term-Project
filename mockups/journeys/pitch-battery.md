# Pitch battery (rules 1532 and 1539, 2026-11-12)

126 asks a person might type into Pitch, run by `scripts/pitch-battery.ts` in the montage repo (montage commits dc603886 and bb3c7075).

**Result: 70/118 (59.3%) before, 126/126 (100%) after.** The 8 asks added later cover the clarifying question (rule 1539) and the empty box's examples. On the first 73 general asks: 54/73 (74%) before, 73/73 after. Trait asks: 16/45 before, 45/45 after.

How it runs (honest about what it covers):
- **Parse:** the keyword parser plus `backfillFacts`, which is the whole parser when the model is off and the layer that patches the model's answer in production. The model parse itself was not run (there is no API key in this environment, and the live API is blocked from here). Its prompt and schema were updated to match.
- **Results:** the server's own `rankPool` / `rankSoBad` over a read-only catalogue snapshot (20,787 films with 3,000+ logs, 2026-11-04), signed out, plus TMDB keyword lists for settings and topics read through SELECT-only Supabase.
- **Server-only asks** (a service, theaters, awards, the watchlist, a group, a person's credits, traits matched by meaning) are graded on their parse. Their films are marked "server" in the table, because that filter cannot run on the snapshot.
- **Pass** means three things: the reading holds what the ask needs and nothing it rules out; every top-10 film passes the stated facts; and an empty or thin answer carries its plain line. Where a `top` list is set, at least one expected film is also in the top 10.

Still weak:
- Two languages ("Indian and Korean") read as Not in English, not both languages.
- "Long takes" has only 6 tagged films, so the note says it couldn't match exactly.
- Free traits ("great soundtrack", "practical effects") rely on the embedding fallback, which has not been measured here.
- The model path is unverified live.

## After

| # | Area | Ask | Read as (chips) | Films | Top 3 | Line shown | Result |
|---|---|---|---|---|---|---|---|
| 1 | genre+mood | a funny horror movie | Funny ↑ · Horror | 193 | What We Do in the Shadows (2014); The Rocky Horror Picture Show (1975); Shaun of the Dead (2004) |  | Pass |
| 2 | genre+mood | something cozy and romantic | Romance ↑ · Warmth ↑ | 1466 | Before Sunrise (1995); Amélie (2001); When Harry Met Sally... (1989) |  | Pass |
| 3 | genre+mood | a dark psychological thriller | Bleakness ↑ · Thriller | 1120 | Oldboy (2003); Hereditary (2018); Se7en (1995) |  | Pass |
| 4 | genre+mood | feel good sports movie | Sports · Bleakness ↓ · Heavy ↓ | 5075 | Singin' in the Rain (1952); Ferris Bueller's Day Off (1986); Back to the Future (1985) |  | Pass |
| 5 | genre+mood | mind-bending sci-fi | Brainy ↑ · Sci-fi · Twist ending | 211 | Inception (2010); Tenet (2020); The Prestige (2006) |  | Pass |
| 6 | genre+mood | a sad movie that will make me cry | Tearjerker ↑ | 1652 | The Green Mile (1999); Life Is Beautiful (1997); Schindler's List (1993) |  | Pass |
| 7 | language | Telugu comedy | Comedy · Telugu | 5 | Eega (2012); Ala Vaikunthapurramuloo (2020); Jathi Ratnalu (2021) | Only 5 films fit Comedy and Telugu in our catalogue, so that's all of them. | Pass |
| 8 | language | best korean thrillers | Thriller · Korean | 119 | Oldboy (2003); Memories of Murder (2003); Parasite (2019) |  | Pass |
| 9 | language | a French romance | Romance ↑ · French | 204 | Portrait of a Lady on Fire (2019); Amélie (2001); The Umbrellas of Cherbourg (1964) |  | Pass |
| 10 | language | Bollywood movie for the family | Hindi · For everyone | 56 | Like Stars on Earth (2007); 12th Fail (2023); Dangal (2016) |  | Pass |
| 11 | language | anime movies | Animation · Japanese | 378 | Your Name. (2016); Howl's Moving Castle (2004); Princess Mononoke (1997) |  | Pass |
| 12 | language | Indian and Korean film | Not in English | 5375 | City of God (2002); Oldboy (2003); La Haine (1995) |  | Pass |
| 13 | language | a Scandinavian crime drama | Crime · Drama · Not in English | 458 | City of God (2002); Memories of Murder (2003); Shoplifters (2018) |  | Pass |
| 14 | language | something with no subtitles | No subtitles | 8142 | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 15 | dates | 80s action | Action · 1980s | 222 | The Empire Strikes Back (1980); Raiders of the Lost Ark (1981); Scarface (1983) |  | Pass |
| 16 | dates | a classic western | Western · Before 1980 | 188 | The Good, the Bad and the Ugly (1966); Once Upon a Time in the West (1968); For a Few Dollars More (1965) |  | Pass |
| 17 | dates | new horror movies | Horror · 2025 or later | 51 | Sinners (2025); Obsession (2026); Frankenstein (2025) |  | Pass |
| 18 | dates | comedies from 2010 to 2015 | Comedy · 2010 to 2015 | 646 | The Grand Budapest Hotel (2014); The Intouchables (2011); Moonrise Kingdom (2012) |  | Pass |
| 19 | dates | a movie from 1999 | 1999 | 203 | The Green Mile (1999); Fight Club (1999); The Matrix (1999) |  | Pass |
| 20 | gems/popular | underrated 90s thrillers | Thriller · 1990s · Hidden gems | 73 | Sonatine (1993); Red Dawn (1990); Bullet in the Head (1990) |  | Pass |
| 21 | gems/popular | a crowd pleaser everyone will like | Popular | 13518 | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 22 | gems/popular | hidden gem horror | Horror · Hidden gems | 210 | Demons (1971); The Cremator (1969); Kwaidan (1965) |  | Pass |
| 23 | length | funny movie under 90 minutes | Funny ↑ · Under 95 min | 1215 | Monty Python and the Holy Grail (1975); Airplane! (1980); Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb (1964) |  | Pass |
| 24 | length | short and funny for a weeknight | Funny ↑ · Under 95 min | 1215 | Monty Python and the Holy Grail (1975); Airplane! (1980); Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb (1964) |  | Pass |
| 25 | length | a long epic | Spectacle ↑ · Long | 386 | Dune: Part Two (2024); The Lord of the Rings: The Return of the King (2003); Interstellar (2014) |  | Pass |
| 26 | services | thriller on Netflix | Thriller · On Netflix | 2750 (server: service) | Se7en (1995); The Dark Knight (2008); The Departed (2006) |  | Pass |
| 27 | services | something free to stream | On Tubi | 13518 (server: service) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 28 | services | whats on hulu or prime | On Hulu · On Prime Video | 13518 (server: service) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 29 | services | what's playing on netflix tonight | On Netflix | 13518 (server: service) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 30 | theaters | what's playing near me | In theaters | 13518 (server: theaters) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 31 | theaters | a horror movie in theaters | Horror · In theaters | 1386 (server: theaters) | The Shining (1980); Psycho (1960); Alien (1979) |  | Pass |
| 32 | anchor | like Arrival | From Arrival | 111 | Enemy (2014); Interstellar (2014); Dune (2021) |  | Pass |
| 33 | anchor | like Heat but shorter | From Heat · Under 95 min | 3777 | The Limey (1999); Crime Wave (1953); Following (1999) |  | Pass |
| 34 | anchor | Knives Out meets Parasite | Knives Out × Parasite | 13516 | Get Out (2017); Mother (2009); Us (2019) |  | Pass |
| 35 | anchor | the opposite of La La Land | Opposite of La La Land | 147 | Whiplash (2014); Babylon (2022); Frances Ha (2013) |  | Pass |
| 36 | anchor | like La La Land except darker | From La La Land · Bleakness ↑ | 145 | Babylon (2022); Whiplash (2014); Victoria (2015) |  | Pass |
| 37 | anchor | something like the godfather but korean | From the godfather · Korean | 303 | Memories of Murder (2003); Mother (2009); The Housemaid (1960) |  | Pass |
| 38 | limits | a thriller with no gore | Violence ↓ · Thriller · No gore | 681 | Ocean's Eleven (2001); Conclave (2024); Anatomy of a Fall (2023) |  | Pass |
| 39 | limits | nothing sad please | Tearjerker ↓ · Nothing too sad | 6686 | Monty Python and the Holy Grail (1975); Raiders of the Lost Ark (1981); The Big Lebowski (1998) |  | Pass |
| 40 | limits | a mystery that isn't scary | Scary ↓ · Mystery · Not scary | 605 | Citizen Kane (1941); Anatomy of a Fall (2023); Knives Out (2019) |  | Pass |
| 41 | limits | family movie for kids | For everyone | 2247 | The Empire Strikes Back (1980); Project Hail Mary (2026); Back to the Future (1985) |  | Pass |
| 42 | limits | date night movie | Date night | 1291 | Amélie (2001); When Harry Met Sally... (1989); The Princess Bride (1987) |  | Pass |
| 43 | people | a Christopher Nolan movie | Directed by Christopher Nolan | 13518 (server: credits) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 44 | people | comedies with Jim Carrey | With Jim Carrey · Comedy | 4627 (server: credits) | The Grand Budapest Hotel (2014); Pulp Fiction (1994); Little Miss Sunshine (2006) |  | Pass |
| 45 | people | Greta Gerwig vibes | Feels like Greta Gerwig | 13518 (server: credits) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 46 | group | something my friends and I can watch together | For your group | 13518 (server: group) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 47 | watchlist | something from my watchlist | From your watchlist | 13518 (server: watchlist) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 48 | rewatch | a comfort rewatch | Comfort rewatch | 4559 (server: rewatch) | Amélie (2001); Paddington 2 (2017); The Princess Bride (1987) |  | Pass |
| 49 | awards | an Oscar winning drama | Drama · Oscar winner | 8193 (server: awards) | GoodFellas (1990); The Prestige (2006); The Godfather (1972) |  | Pass |
| 50 | occasion | a Halloween movie | At Halloween | 13518 | The Shining (1980); Psycho (1960); The Rocky Horror Picture Show (1975) |  | Pass |
| 51 | occasion | christmas movie | At Christmas | 13518 | The Holdovers (2023); Little Women (2019); Harry Potter and the Prisoner of Azkaban (2004) |  | Pass |
| 52 | occasion | rainy day movie | Rainy · Warmth ↑ · Pace ↓ | 2527 | Howl's Moving Castle (2004); We Bought a Zoo (2011); Pather Panchali (1955) |  | Pass |
| 53 | occasion | something to put on in the background | Background watch | 3523 | Ferris Bueller's Day Off (1986); Home Alone (1990); The Princess Bride (1987) |  | Pass |
| 54 | occasion | im so hungover | Hungover | 3102 | Paddington 2 (2017); Mamma Mia! (2008); The Princess Bride (1987) |  | Pass |
| 55 | typos | scary movei | Scary ↑ | 1039 | The Shining (1980); Alien (1979); The Thing (1982) |  | Pass |
| 56 | typos | romcom | Romance · Comedy | 1160 | Amélie (2001); Forrest Gump (1994); La La Land (2016) |  | Pass |
| 57 | typos | a thriler from the 90s | Thriller · 1990s | 338 | Se7en (1995); The Silence of the Lambs (1991); Pulp Fiction (1994) |  | Pass |
| 58 | typos | smth chill no cap | Heavy ↓ | 4926 | Monty Python and the Holy Grail (1975); Singin' in the Rain (1952); Paddington 2 (2017) |  | Pass |
| 59 | negation | action but not a superhero movie | Action · No superheroes | 2007 | The Empire Strikes Back (1980); Inception (2010); The Lord of the Rings: The Return of the King (2003) |  | Pass |
| 60 | topic | time travel movies | Time travel | 13518 | Interstellar (2014); Terminator 2: Judgment Day (1991); Back to the Future (1985) |  | Pass |
| 61 | topic | a funny coming of age movie | Funny ↑ · Coming of age | 3235 | Superbad (2007); Ferris Bueller's Day Off (1986); Bottoms (2023) |  | Pass |
| 62 | negation | family drama minus anything western | Drama | 8193 | GoodFellas (1990); The Prestige (2006); The Godfather (1972) |  | Pass |
| 63 | negation | a comedy that isn't too violent | Violence ↓ · Comedy · No gore | 3533 | La La Land (2016); When Harry Met Sally... (1989); Singin' in the Rain (1952) |  | Pass |
| 64 | negation | anything but horror | Scary ↓ | 10884 | Before Sunrise (1995); In the Mood for Love (2000); Before Sunset (2004) |  | Pass |
| 65 | negation | not too long and not in english | Under 95 min · Not in English | 1363 | Persona (1966); Rashomon (1950); Bicycle Thieves (1948) |  | Pass |
| 66 | trait | Plot twists can be rewatch or not | Twist ending · Seen or not | 13518 | The Prestige (2006); The Empire Strikes Back (1980); Inception (2010) |  | Pass |
| 67 | trait | a movie with an unreliable narrator | Twist ending | 13518 | The Prestige (2006); The Empire Strikes Back (1980); Inception (2010) |  | Pass |
| 68 | trait | a thriller that keeps you guessing | Thriller · Twist ending | 2750 | Oldboy (2003); Fight Club (1999); Shutter Island (2010) |  | Pass |
| 69 | trait | didn't see it coming | Twist ending | 13518 | The Prestige (2006); The Empire Strikes Back (1980); Inception (2010) |  | Pass |
| 70 | trait | a twist villain | Twist ending | 13518 | The Prestige (2006); The Empire Strikes Back (1980); Inception (2010) |  | Pass |
| 71 | trait | mind-bending | Brainy ↑ · Twist ending | 1575 | Memento (2000); Inception (2010); Tenet (2020) |  | Pass |
| 72 | trait | seen or unseen, a thriller | Thriller · Seen or not | 2750 | Se7en (1995); The Dark Knight (2008); The Departed (2006) |  | Pass |
| 73 | trait | a good heist movie | A heist · Crime | 2209 | Heat (1995); Reservoir Dogs (1992); A Clockwork Orange (1971) |  | Pass |
| 74 | trait | a time loop movie | Time loop | 13518 | Groundhog Day (1993); Palm Springs (2020); Edge of Tomorrow (2014) |  | Pass |
| 75 | trait | one location thriller | One location · Thriller | 2750 | Se7en (1995); The Dark Knight (2008); The Departed (2006) |  | Pass |
| 76 | trait | found footage horror | Horror · Found footage | 1386 | What We Do in the Shadows (2014); Talk to Me (2023); [REC] (2007) |  | Pass |
| 77 | trait | slow-burn horror | Pace ↓ · Tension ↑ · Horror | 197 | Twin Peaks: Fire Walk with Me (1992); Cure (1997); Eraserhead (1977) |  | Pass |
| 78 | trait | movies with a strong female lead | Strong female lead | 13518 | Kill Bill: Vol. 1 (2003); Alien (1979); Black Swan (2010) |  | Pass |
| 79 | trait | a morally gray hero | Morally grey | 13518 | GoodFellas (1990); The Prestige (2006); The Godfather (1972) |  | Pass |
| 80 | trait | a movie with a great soundtrack | Great soundtrack | 13518 (server: meaning) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 81 | trait | beautiful cinematography | Visual style ↑ | 4206 | 2001: A Space Odyssey (1968); In the Mood for Love (2000); Portrait of a Lady on Fire (2019) |  | Pass |
| 82 | trait | based on a true story | True story | 13518 | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 83 | trait | courtroom drama | In court · Drama | 8193 | GoodFellas (1990); The Prestige (2006); The Godfather (1972) |  | Pass |
| 84 | trait | a sports underdog movie | Sports · Underdog story | 13518 | Rocky (1976); Edward Scissorhands (1990); Moneyball (2011) |  | Pass |
| 85 | trait | a coming of age road trip | Road trip · Coming of age | 13518 | Stand by Me (1986); City of God (2002); Dead Poets Society (1989) |  | Pass |
| 86 | trait | ensemble cast comedy | Comedy · Ensemble cast | 4627 (server: meaning) | The Grand Budapest Hotel (2014); Pulp Fiction (1994); Little Miss Sunshine (2006) |  | Pass |
| 87 | trait | a nonlinear story | Nonlinear story | 13518 | Mulholland Drive (2001); Pulp Fiction (1994); Eternal Sunshine of the Spotless Mind (2004) |  | Pass |
| 88 | trait | a dialogue-heavy drama | Drama · Dialogue-heavy | 8193 | GoodFellas (1990); The Godfather (1972); The Departed (2006) |  | Pass |
| 89 | trait | a movie with no dialogue | Little or no dialogue | 13518 | Mad Max: Fury Road (2015); A Quiet Place (2018); Modern Times (1936) |  | Pass |
| 90 | trait | something that makes you cry | Tearjerker ↑ | 1652 | The Green Mile (1999); Life Is Beautiful (1997); Schindler's List (1993) |  | Pass |
| 91 | trait | a feel-good ending | Bleakness ↓ · Happy ending | 4627 | Back to the Future (1985); Amélie (2001); Ferris Bueller's Day Off (1986) |  | Pass |
| 92 | trait | an ambiguous ending | Open ending | 977 | The Empire Strikes Back (1980); Inception (2010); Kill Bill: Vol. 1 (2003) |  | Pass |
| 93 | trait | dark comedy | Bleakness ↑ · Funny ↑ · Comedy | 171 | Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb (1964); The Wolf of Wall Street (2013); The Favourite (2018) |  | Pass |
| 94 | trait | political satire | Satire | 13518 | Get Out (2017); A Clockwork Orange (1971); Hot Fuzz (2007) |  | Pass |
| 95 | trait | a revenge thriller | Thriller · Revenge | 2750 | Se7en (1995); The Dark Knight (2008); The Departed (2006) |  | Pass |
| 96 | trait | survival movie | Survival | 13518 | The Pianist (2002); The Thing (1982); Mad Max: Fury Road (2015) |  | Pass |
| 97 | trait | con artists | Con artists | 13518 | Parasite (2019); The Handmaiden (2016); Catch Me If You Can (2002) |  | Pass |
| 98 | trait | small town mystery | Small town · Mystery | 1153 | Blue Velvet (1986); Scream (1996); Twin Peaks: Fire Walk with Me (1992) |  | Pass |
| 99 | trait | something set in space | In space · Sci-fi | 1096 | The Empire Strikes Back (1980); Interstellar (2014); Alien (1979) |  | Pass |
| 100 | trait | a dystopia | Dystopian future | 13518 | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 101 | trait | a period piece romance | Romance ↑ · Period piece | 1837 | Portrait of a Lady on Fire (2019); Pride & Prejudice (2005); The Curious Case of Benjamin Button (2008) |  | Pass |
| 102 | trait | a movie with musical numbers | Music | 476 | Whiplash (2014); Sound of Metal (2020); The Sound of Music (1965) |  | Pass |
| 103 | trait | long takes | Long takes | 13518 | Boiling Point (2021); Victoria (2015); Utøya: July 22 (2018) |  | Pass |
| 104 | trait | practical effects | Practical effects | 13518 (server: meaning) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 105 | trait | a cozy mystery | Warmth ↑ · Mystery | 138 | The Sheep Detectives (2026); Remarkably Bright Creatures (2026); Arrival (2016) |  | Pass |
| 106 | trait | a slow romance | Romance ↑ · Pace ↓ | 1758 | In the Mood for Love (2000); Before Sunrise (1995); Past Lives (2023) |  | Pass |
| 107 | trait | something bittersweet | Bittersweet | 4972 | GoodFellas (1990); The Dark Knight (2008); City of God (2002) |  | Pass |
| 108 | trait | a quotable comedy | Comedy · Dialogue-heavy | 4627 | Pulp Fiction (1994); The Holdovers (2023); 10 Things I Hate About You (1999) |  | Pass |
| 109 | trait | something surreal | Dreamlike | 13518 | Mulholland Drive (2001); The Shining (1980); Trainspotting (1996) |  | Pass |
| 110 | trait | stop motion | Stop motion | 13518 | Fantastic Mr. Fox (2009); Coraline (2009); Isle of Dogs (2018) |  | Pass |
| 111 | clarify | Alien | From Alien | 107 | Aliens (1986); Alien: Covenant (2017); Prometheus (2012) |  | Pass |
| 112 | clarify | Christmas | At Christmas | 13518 | The Holdovers (2023); Little Women (2019); Harry Potter and the Prisoner of Azkaban (2004) |  | Pass |
| 113 | examples | Plot twists, seen or not | Twist ending · Seen or not | 13518 | The Prestige (2006); The Empire Strikes Back (1980); Inception (2010) |  | Pass |
| 114 | examples | Telugu comedy on Netflix | Comedy · Telugu · On Netflix | 5 (server: service) | Eega (2012); Ala Vaikunthapurramuloo (2020); Jathi Ratnalu (2021) | Only 5 films fit Comedy and Telugu in our catalogue, so that's all of them. | Pass |
| 115 | examples | Like Parasite but funnier | From Parasite · Funny ↑ | 200 | No Other Choice (2025); Zombie for Sale (2019); Mickey 17 (2025) |  | Pass |
| 116 | examples | Something short for me and Sam | Under 95 min | 3779 | Stand by Me (1986); Trainspotting (1996); Before Sunset (2004) |  | Pass |
| 117 | examples | Hidden gem 90s thrillers | Thriller · 1990s · Hidden gems | 73 | Sonatine (1993); Red Dawn (1990); Bullet in the Head (1990) |  | Pass |
| 118 | examples | Playing near me tonight | In theaters | 13518 (server: theaters) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 119 | vague | surprise me | Popular | 13518 | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 120 | vague | something good | Popular | 13518 | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 121 | vague | idk | Popular | 13518 | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 122 | vague | asdf qwerty | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Pass |
| 123 | impossible | a 1920s Telugu horror under 90 minutes | Horror · 1920s · Under 95 min · Telugu | 0 | none | No films match. Remove “Telugu” to see 8 films. | Pass |
| 124 | long | ok so me and my girlfriend want something kind of romantic but not cheesy, maybe from the 2000s, not too long because we have work tomorrow, and ideally something neither of us has seen | Romance ↑ · 2000s · Under 95 min · Not seen yet | 103 | Before Sunset (2004); (500) Days of Summer (2009); Imagine Me & You (2006) |  | Pass |
| 125 | one word | zombies | Zombies | 13518 | Train to Busan (2016); Shaun of the Dead (2004); What We Do in the Shadows (2014) |  | Pass |
| 126 | one word | heist | A heist · Crime | 2209 | Heat (1995); Reservoir Dogs (1992); A Clockwork Orange (1971) |  | Pass |

**126/126 pass (100%).**

## Before (the same battery on the code before this change)

| # | Area | Ask | Read as (chips) | Films | Top 3 | Line shown | Result |
|---|---|---|---|---|---|---|---|
| 1 | genre+mood | a funny horror movie | Funny ↑ · Horror | 193 | What We Do in the Shadows (2014); The Rocky Horror Picture Show (1975); Shaun of the Dead (2004) |  | Pass |
| 2 | genre+mood | something cozy and romantic | Romance ↑ · Warmth ↑ | 1466 | Before Sunrise (1995); Amélie (2001); When Harry Met Sally... (1989) |  | Pass |
| 3 | genre+mood | a dark psychological thriller | Bleakness ↑ · Thriller | 1120 | Oldboy (2003); Hereditary (2018); Se7en (1995) |  | Pass |
| 4 | genre+mood | feel good sports movie | Sports · Bleakness ↓ · Heavy ↓ | 5075 | Singin' in the Rain (1952); Ferris Bueller's Day Off (1986); Back to the Future (1985) |  | Pass |
| 5 | genre+mood | mind-bending sci-fi | Brainy ↑ · Sci-fi | 211 | 2001: A Space Odyssey (1968); Inception (2010); Stalker (1979) |  | Pass |
| 6 | genre+mood | a sad movie that will make me cry | Tearjerker ↑ | 1652 | The Green Mile (1999); Life Is Beautiful (1997); Schindler's List (1993) |  | Pass |
| 7 | language | Telugu comedy | Comedy · Telugu | 5 | Eega (2012); Ala Vaikunthapurramuloo (2020); Jathi Ratnalu (2021) | Only 5 films fit Comedy and Telugu in our catalogue, so that's all of them. | Pass |
| 8 | language | best korean thrillers | Thriller · Korean | 119 | Oldboy (2003); Memories of Murder (2003); Parasite (2019) |  | Pass |
| 9 | language | a French romance | Romance ↑ · French | 204 | Portrait of a Lady on Fire (2019); Amélie (2001); The Umbrellas of Cherbourg (1964) |  | Pass |
| 10 | language | Bollywood movie for the family | Hindi · For everyone | 56 | Like Stars on Earth (2007); 12th Fail (2023); Dangal (2016) |  | Pass |
| 11 | language | anime movies | Animation | 1085 | The Lion King (1994); Spider-Man: Across the Spider-Verse (2023); Your Name. (2016) |  | Fail: language null not ja |
| 12 | language | Indian and Korean film | Korean | 303 | Oldboy (2003); Memories of Murder (2003); Parasite (2019) |  | Fail: language ko not foreign |
| 13 | language | a Scandinavian crime drama | Crime · Drama | 1270 | GoodFellas (1990); The Godfather (1972); City of God (2002) |  | Fail: language null not foreign |
| 14 | language | something with no subtitles | No subtitles | 8142 | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 15 | dates | 80s action | Action · 1980s | 222 | The Empire Strikes Back (1980); Raiders of the Lost Ark (1981); Scarface (1983) |  | Pass |
| 16 | dates | a classic western | Western · Before 1980 | 188 | The Good, the Bad and the Ugly (1966); Once Upon a Time in the West (1968); For a Few Dollars More (1965) |  | Pass |
| 17 | dates | new horror movies | Horror · 2025 or later | 51 | Sinners (2025); Obsession (2026); Frankenstein (2025) |  | Pass |
| 18 | dates | comedies from 2010 to 2015 | Comedy · 2010 to 2015 | 646 | The Grand Budapest Hotel (2014); The Intouchables (2011); Moonrise Kingdom (2012) |  | Pass |
| 19 | dates | a movie from 1999 | 1999 | 203 | The Green Mile (1999); Fight Club (1999); The Matrix (1999) |  | Pass |
| 20 | gems/popular | underrated 90s thrillers | Thriller · 1990s · Hidden gems | 73 | Sonatine (1993); Red Dawn (1990); Bullet in the Head (1990) |  | Pass |
| 21 | gems/popular | a crowd pleaser everyone will like | Popular | 13518 | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 22 | gems/popular | hidden gem horror | Horror · Hidden gems | 210 | Demons (1971); The Cremator (1969); Kwaidan (1965) |  | Pass |
| 23 | length | funny movie under 90 minutes | Funny ↑ · Under 95 min | 1215 | Monty Python and the Holy Grail (1975); Airplane! (1980); Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb (1964) |  | Pass |
| 24 | length | short and funny for a weeknight | Funny ↑ · Under 95 min | 1215 | Monty Python and the Holy Grail (1975); Airplane! (1980); Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb (1964) |  | Pass |
| 25 | length | a long epic | Spectacle ↑ · Long | 386 | Dune: Part Two (2024); The Lord of the Rings: The Return of the King (2003); Interstellar (2014) |  | Pass |
| 26 | services | thriller on Netflix | Thriller · On Netflix | 2750 (server: service) | Se7en (1995); The Dark Knight (2008); The Departed (2006) |  | Pass |
| 27 | services | something free to stream | (none) | 0 (server: service) | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); streaming tubi missing |
| 28 | services | whats on hulu or prime | On Hulu · On Prime Video · In theaters | 13518 (server: service) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Fail: theaters read |
| 29 | services | what's playing on netflix tonight | On Netflix · In theaters | 13518 (server: service) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Fail: theaters read |
| 30 | theaters | what's playing near me | In theaters | 13518 (server: theaters) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 31 | theaters | a horror movie in theaters | Horror · In theaters | 1386 (server: theaters) | The Shining (1980); Psycho (1960); Alien (1979) |  | Pass |
| 32 | anchor | like Arrival | From Arrival | 111 | Enemy (2014); Interstellar (2014); Dune (2021) |  | Pass |
| 33 | anchor | like Heat but shorter | From Heat · Under 95 min | 3777 | The Limey (1999); Crime Wave (1953); Following (1999) |  | Pass |
| 34 | anchor | Knives Out meets Parasite | Knives Out × Parasite | 13516 | Get Out (2017); Mother (2009); Us (2019) |  | Pass |
| 35 | anchor | the opposite of La La Land | Opposite of La La Land | 147 | Whiplash (2014); Babylon (2022); Frances Ha (2013) |  | Pass |
| 36 | anchor | like La La Land except darker | From La La Land · Bleakness ↑ | 145 | Babylon (2022); Whiplash (2014); Victoria (2015) |  | Pass |
| 37 | anchor | something like the godfather but korean | From the godfather · Korean | 303 | Memories of Murder (2003); Mother (2009); The Housemaid (1960) |  | Pass |
| 38 | limits | a thriller with no gore | Violence ↓ · Thriller · No gore | 681 | Ocean's Eleven (2001); Conclave (2024); Anatomy of a Fall (2023) |  | Pass |
| 39 | limits | nothing sad please | Tearjerker ↓ · Nothing too sad | 6686 | Monty Python and the Holy Grail (1975); Raiders of the Lost Ark (1981); The Big Lebowski (1998) |  | Pass |
| 40 | limits | a mystery that isn't scary | Scary ↑ · Mystery | 207 | The Thing (1982); Hereditary (2018); [REC] (2007) |  | Fail: limit scary missing |
| 41 | limits | family movie for kids | For everyone | 2247 | The Empire Strikes Back (1980); Project Hail Mary (2026); Back to the Future (1985) |  | Pass |
| 42 | limits | date night movie | Date night | 1291 | Amélie (2001); When Harry Met Sally... (1989); The Princess Bride (1987) |  | Pass |
| 43 | people | a Christopher Nolan movie | Directed by Christopher Nolan | 13518 (server: credits) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 44 | people | comedies with Jim Carrey | With Jim Carrey · Comedy | 4627 (server: credits) | The Grand Budapest Hotel (2014); Pulp Fiction (1994); Little Miss Sunshine (2006) |  | Pass |
| 45 | people | Greta Gerwig vibes | Feels like Greta Gerwig | 13518 (server: credits) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 46 | group | something my friends and I can watch together | (none) | 0 (server: group) | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); group undefined not mine |
| 47 | watchlist | something from my watchlist | From your watchlist | 13518 (server: watchlist) | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 48 | rewatch | a comfort rewatch | Comfort rewatch | 4559 (server: rewatch) | Amélie (2001); Paddington 2 (2017); The Princess Bride (1987) |  | Pass |
| 49 | awards | an Oscar winning drama | Drama · Oscar winner | 8193 (server: awards) | GoodFellas (1990); The Prestige (2006); The Godfather (1972) |  | Pass |
| 50 | occasion | a Halloween movie | At Halloween | 13518 | The Shining (1980); Psycho (1960); The Rocky Horror Picture Show (1975) |  | Pass |
| 51 | occasion | christmas movie | At Christmas | 13518 | The Holdovers (2023); Little Women (2019); Harry Potter and the Prisoner of Azkaban (2004) |  | Pass |
| 52 | occasion | rainy day movie | Rainy | 13518 | Rashomon (1950); Howl's Moving Castle (2004); Thief (1981) |  | Fail: warmth not up |
| 53 | occasion | something to put on in the background | Background watch | 3523 | Ferris Bueller's Day Off (1986); Home Alone (1990); The Princess Bride (1987) |  | Pass |
| 54 | occasion | im so hungover | Hungover | 3102 | Paddington 2 (2017); Mamma Mia! (2008); The Princess Bride (1987) |  | Pass |
| 55 | typos | scary movei | Scary ↑ | 1039 | The Shining (1980); Alien (1979); The Thing (1982) |  | Pass |
| 56 | typos | romcom | Romance · Comedy | 1160 | Amélie (2001); Forrest Gump (1994); La La Land (2016) |  | Pass |
| 57 | typos | a thriler from the 90s | 1990s | 1611 | GoodFellas (1990); Se7en (1995); Schindler's List (1993) |  | Fail: genre Thriller missing |
| 58 | typos | smth chill no cap | Heavy ↓ | 4926 | Monty Python and the Holy Grail (1975); Singin' in the Rain (1952); Paddington 2 (2017) |  | Pass |
| 59 | negation | action but not a superhero movie | From action | 13518 | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Fail: genre Action missing; ruled-out topic superheroes missing |
| 60 | topic | time travel movies | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); topic time travel missing |
| 61 | topic | a funny coming of age movie | Funny ↑ | 3235 | Monty Python and the Holy Grail (1975); The Big Lebowski (1998); Hot Fuzz (2007) |  | Fail: topic coming of age missing |
| 62 | negation | family drama minus anything western | Western · Drama | 131 | Django Unchained (2012); The Hateful Eight (2015); The Revenant (2015) |  | Fail: genre Western read but negated |
| 63 | negation | a comedy that isn't too violent | Violence ↓ · Comedy | 3533 | La La Land (2016); When Harry Met Sally... (1989); Singin' in the Rain (1952) |  | Fail: limit gore missing |
| 64 | negation | anything but horror | Scary ↓ | 10884 | Before Sunrise (1995); In the Mood for Love (2000); Before Sunset (2004) |  | Pass |
| 65 | negation | not too long and not in english | Under 95 min · Not in English | 1363 | Persona (1966); Rashomon (1950); Bicycle Thieves (1948) |  | Pass |
| 66 | trait | Plot twists can be rewatch or not | Comfort rewatch | 4559 | Amélie (2001); Paddington 2 (2017); The Princess Bride (1987) |  | Fail: comfort rewatch read; seenOk missing; topic twists missing; reason lines: Warm, hopeful comedy. / Warm, hopeful comedy. / Hopeful, warm fantasy.; off target: none of The Prestige, Shutter Island, The Sixth Sense, Gone Girl, Memento, Oldboy, Fight Club, The Usual Suspects, Primal Fear, Parasite, Get Out in the top 10 |
| 67 | trait | a movie with an unreliable narrator | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); topic twists missing |
| 68 | trait | a thriller that keeps you guessing | Thriller | 2750 | Se7en (1995); The Dark Knight (2008); The Departed (2006) |  | Fail: topic twists missing |
| 69 | trait | didn't see it coming | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); topic twists missing |
| 70 | trait | a twist villain | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); topic twists missing |
| 71 | trait | mind-bending | Brainy ↑ | 1575 | Mulholland Drive (2001); Memento (2000); 2001: A Space Odyssey (1968) |  | Fail: topic twists missing |
| 72 | trait | seen or unseen, a thriller | Thriller · Not seen yet | 2750 | Se7en (1995); The Dark Knight (2008); The Departed (2006) |  | Fail: seenOk missing |
| 73 | trait | a good heist movie | A heist · Crime | 2209 | Heat (1995); Reservoir Dogs (1992); A Clockwork Orange (1971) |  | Pass |
| 74 | trait | a time loop movie | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); topic time loop missing |
| 75 | trait | one location thriller | One location · Thriller | 2750 | Se7en (1995); The Dark Knight (2008); The Departed (2006) |  | Pass |
| 76 | trait | found footage horror | Horror | 1386 | The Shining (1980); Psycho (1960); Alien (1979) |  | Fail: topic found footage missing; off target: none of The Blair Witch Project, REC, Cloverfield, Talk to Me, Late Night with the Devil, Sinister in the top 10 |
| 77 | trait | slow-burn horror | Pace ↓ · Tension ↑ · Horror | 197 | Twin Peaks: Fire Walk with Me (1992); Cure (1997); Eraserhead (1977) |  | Pass |
| 78 | trait | movies with a strong female lead | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); topic strong female lead missing |
| 79 | trait | a morally gray hero | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); topic morally grey missing |
| 80 | trait | a movie with a great soundtrack | (none) | 0 (server: meaning) | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); trait soundtrack not kept |
| 81 | trait | beautiful cinematography | Visual style ↑ | 4206 | 2001: A Space Odyssey (1968); In the Mood for Love (2000); Portrait of a Lady on Fire (2019) |  | Pass |
| 82 | trait | based on a true story | True story | 13518 | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 83 | trait | courtroom drama | In court · Drama | 8193 | GoodFellas (1990); The Prestige (2006); The Godfather (1972) |  | Pass |
| 84 | trait | a sports underdog movie | Sports | 13518 | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Fail: topic underdog missing |
| 85 | trait | a coming of age road trip | Road trip | 13518 | Stand by Me (1986); Little Miss Sunshine (2006); Logan (2017) |  | Fail: topic coming of age missing |
| 86 | trait | ensemble cast comedy | Comedy | 4627 (server: meaning) | The Grand Budapest Hotel (2014); Pulp Fiction (1994); Little Miss Sunshine (2006) |  | Fail: trait ensemble not kept |
| 87 | trait | a nonlinear story | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); topic nonlinear missing |
| 88 | trait | a dialogue-heavy drama | Heavy ↑ · Drama | 3947 | Schindler's List (1993); Requiem for a Dream (2000); The Pianist (2002) |  | Fail: topic dialogue missing |
| 89 | trait | a movie with no dialogue | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); topic no dialogue missing |
| 90 | trait | something that makes you cry | Tearjerker ↑ | 1652 | The Green Mile (1999); Life Is Beautiful (1997); Schindler's List (1993) |  | Pass |
| 91 | trait | a feel-good ending | Bleakness ↓ · Heavy ↓ | 5075 | Singin' in the Rain (1952); Ferris Bueller's Day Off (1986); Back to the Future (1985) |  | Fail: ending null not happy |
| 92 | trait | an ambiguous ending | Open ending | 977 | The Empire Strikes Back (1980); Inception (2010); Kill Bill: Vol. 1 (2003) |  | Pass |
| 93 | trait | dark comedy | Bleakness ↑ · Funny ↑ · Comedy | 171 | Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb (1964); The Wolf of Wall Street (2013); The Favourite (2018) |  | Pass |
| 94 | trait | political satire | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); topic satire missing |
| 95 | trait | a revenge thriller | Thriller | 2750 | Se7en (1995); The Dark Knight (2008); The Departed (2006) |  | Fail: topic revenge missing |
| 96 | trait | survival movie | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); topic survival missing |
| 97 | trait | con artists | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); topic con artists missing |
| 98 | trait | small town mystery | Small town · Mystery | 1153 | Blue Velvet (1986); Scream (1996); Twin Peaks: Fire Walk with Me (1992) |  | Pass |
| 99 | trait | something set in space | In space · Sci-fi | 1096 | The Empire Strikes Back (1980); Interstellar (2014); Alien (1979) |  | Pass |
| 100 | trait | a dystopia | Dystopian future | 13518 | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 101 | trait | a period piece romance | Romance ↑ | 1837 | Before Sunrise (1995); In the Mood for Love (2000); Portrait of a Lady on Fire (2019) |  | Fail: topic period piece missing |
| 102 | trait | a movie with musical numbers | Music | 476 | Whiplash (2014); Sound of Metal (2020); The Sound of Music (1965) |  | Pass |
| 103 | trait | long takes | Long | 1057 | GoodFellas (1990); The Godfather (1972); Inception (2010) |  | Fail: topic long takes missing |
| 104 | trait | practical effects | (none) | 0 (server: meaning) | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); trait practical effects not kept |
| 105 | trait | a cozy mystery | Warmth ↑ · Mystery | 138 | The Sheep Detectives (2026); Remarkably Bright Creatures (2026); Arrival (2016) |  | Pass |
| 106 | trait | a slow romance | Romance ↑ · Pace ↓ | 1758 | In the Mood for Love (2000); Before Sunrise (1995); Past Lives (2023) |  | Pass |
| 107 | trait | something bittersweet | Bittersweet | 4972 | GoodFellas (1990); The Dark Knight (2008); City of God (2002) |  | Pass |
| 108 | trait | a quotable comedy | Comedy | 4627 | The Grand Budapest Hotel (2014); Pulp Fiction (1994); Little Miss Sunshine (2006) |  | Fail: topic dialogue missing |
| 109 | trait | something surreal | Dreamlike | 13518 | GoodFellas (1990); The Prestige (2006); Se7en (1995) |  | Pass |
| 110 | trait | stop motion | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); topic stop motion missing |
| 111 | vague | surprise me | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); crowd missing |
| 112 | vague | something good | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); crowd missing |
| 113 | vague | idk | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); crowd missing |
| 114 | vague | asdf qwerty | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Pass |
| 115 | impossible | a 1920s Telugu horror under 90 minutes | Horror · 1920s · Under 95 min · Telugu | 0 | none | No films match. Remove “Telugu” to see 8 films. | Pass |
| 116 | long | ok so me and my girlfriend want something kind of romantic but not cheesy, maybe from the 2000s, not too long because we have work tomorrow, and ideally something neither of us has seen | Romance ↑ · 2000s · Under 95 min | 103 | Before Sunset (2004); (500) Days of Summer (2009); Imagine Me & You (2006) |  | Fail: unseen missing |
| 117 | one word | zombies | (none) | 0 | none | Didn't catch that. Try a mood, a genre or a film it's like. | Fail: read nothing (Didn't catch that); topic zombies missing |
| 118 | one word | heist | A heist · Crime | 2209 | Heat (1995); Reservoir Dogs (1992); A Clockwork Orange (1971) |  | Pass |

**70/118 pass (59.3%).**
