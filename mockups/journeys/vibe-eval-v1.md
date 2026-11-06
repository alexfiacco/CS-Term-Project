# Pitch: vibe and place requests (eval v1, 2026-11-06)

Question: can Pitch answer "a film set in Tokyo at night", "cozy rainy autumn vibes", "set on a train", or only the dimensions we store per film?

Short answer: today it only reads the stored dimensions, and place/setting words are thrown away. TMDB keywords (already stored on `films.tmdb_keywords`, already loaded into Pitch's catalogue) fix most place and setting requests at $0 extra. Pure atmosphere ("at night", "autumn") stays weak.

## What exists today

Code: `lib/recut.ts` (parser, schema, prompt), `lib/recut-rank.ts` (ranking), `lib/recut-server.ts` (cache, model call, catalogue).

Dimensions a pitch can set:
- anchor film ("like X"), resolved to its 300 embedding neighbours
- 14 dials, 0-100 labels: romance, heaviness, bleakness, tearjerker, humor, warmth, tension, scariness, propulsion (pace), wonder, brain_demand, visual_artistry, spectacle, violence
- ending (happy, bittersweet, ambiguous, devastating, bleak)
- hard facts: genres (18 TMDB genres), decade, length, language, audience

There is no place, setting, era-of-story, season, weather or time-of-day field.

## How a vibe/place phrase is handled now

- Model parse (Haiku, cached): the schema has nowhere to put it, so the prompt sends it to `not_used`. Real example from `recuts`: "I want a New York feeling film that will make me cry" parsed to Drama + Tearjerker up + Warmth up, Not used: "New York feeling". The ranking never sees New York.
- Keyword parser (fallback): place words are dropped silently, not even shown as "Not used" (only the fixed KNOWN_UNUSED list is reported). "a film set in Tokyo at night" gives zero chips, which ranks the whole catalogue by quality.
- Feeling words that map to dials do work: "cozy" gives Warmth up.

## Data we already have (read-only SELECTs)

Pitch pool (3,000+ logs, 3.0+ average, poster, not duplicate): 15,433 films. 15,160 (98%) have TMDB keywords, 9.7 per film on average.

Counts in the pool for useful keywords: "tokyo, japan" 70, "paris, france" 331, "los angeles, california" 271, "road trip" 163, "train" 88, "desert" 107, "christmas" 247, "small town" 216, "snow" 75, "winter" 72, "heist" 105, "neo-noir" 202, "comforting" 91, "rain" 31, "autumn" 8, "night" about 0 (only "one night", "nightclub"), "cozy" 0.

So: places and concrete settings are well tagged. Atmosphere (night, autumn, cozy, rain) is thin.

Embeddings: `film_vec.emb` (text-embedding-3-small, built from title, director, genres, TMDB keywords, 400 chars of synopsis). `score_films_against_vector(q, slugs)` and `nearest_films(q, k)` score any vector against the catalogue in the database. A pitch has no vector of its own unless we pay for an embedding call, but we can build one for free: the average of the vectors of films that carry the matched keyword (a "keyword centroid").

## Offline run, 8 pitches

Run in SQL against Supabase, SELECT only. The scoring copies recut-rank.ts closely (fit 60% / quality 40%, the same quality formula, animation ranked down, docs out) but without the percentile part and the fit floor, so treat orders as approximate. Parses are what a correct parse gives (dials and facts the current parser reads, plus a hand-written keyword list for the place/setting).

Three methods:
- A. Today: the parsed dials and facts only.
- B. Keyword filter: films with at least one of the matched TMDB keywords, ranked by most keywords matched, then A's score.
- C. Keyword centroid: average vector of B's films, cosine over the pool, top 300, ranked 80% closeness (plus dial fit) and 20% quality.

| # | Pitch | A. Today, top 5 | Fits? | B. Keyword filter, top 5 | Fits? | C. Centroid, top 5 | Fits? |
|---|---|---|---|---|---|---|---|
| 1 | a film set in Tokyo at night | Inglourious Basterds, Portrait of a Lady on Fire, Parasite, Trainspotting, Django Unchained | No | Perfect Days, Cure, Lost in Translation, Shoplifters, Rental Family | Yes (Tokyo; "night" unread) | Tokyo Story, Pulse, Rental Family, Tokyo Sonata, Tokyo! | Partly (title-word bleed) |
| 2 | cozy rainy autumn vibes | Amelie, Paddington 2, It's a Wonderful Life, The Intouchables, The Princess Bride | Partly (cozy only) | City Lights, Weathering with You, The Intouchables, About Time, Forrest Gump | Partly | This Beautiful Fantastic, Everything Everywhere All at Once, Big, A Man Called Otto, My Old Ass | No |
| 3 | set on a train | Fight Club, The Prestige, Dead Poets Society, The Shining, Shawshank | No | The Darjeeling Limited, Madame Tutli-Putli, Schindler's List, Train to Busan, Paddington 2 | Mostly (a train scene counts) | Strangers on a Train, Night Train, Runaway Train, The Train, Closely Watched Trains | Mostly (title-word bias) |
| 4 | a road trip across the American desert | The Dark Knight, The Green Mile, Silence of the Lambs, Kill Bill 1, There Will Be Blood | No | Paris Texas, Thelma & Louise, Fear and Loathing in Las Vegas, The Hitcher, Breakdown | Yes | Breakdown, Something Wild, Duel, Knockin' on Heaven's Door, Scenic Route | Yes, more obscure |
| 5 | something set in space, slow and quiet | Stalker, 2001, Solaris, Her, Clayface | Partly (Sci-fi + slow, not space) | Interstellar, It! The Terror from Beyond Space, Solaris (2002), Alien, Silent Running | Mostly | 2001, Star Trek: TMP, Spaceman, Alien, 2010 | Yes |
| 6 | a heist in Paris | Stand by Me, Heat, Se7en, The Godfather, The Dark Knight | No | John Wick 4, Le Samourai, Now You See Me, Breathless, The Killer (2023) | Partly (Paris crime, few heists) | The Big Risk, Breathless, Le Deuxieme Souffle, Le Cercle Rouge, L'Argent | Partly (French crime) |
| 7 | a snowy Christmas small town | Good Will Hunting, Aftersun, 12 Angry Men, The Holdovers, Before Sunset | No (Holdovers by luck) | Affliction, The Lodge, Edward Scissorhands, I Am Not a Serial Killer, Peyton Place | Partly (snow/small town, wrong mood) | Anatomy of a Fall, Super Dark Times, Father Mother Sister Brother, Remember the Night, A Christmas Tale | No |
| 8 | neon-soaked 80s Los Angeles crime | Stand by Me, Scarface, Blue Velvet, Once Upon a Time in America, Heathers | No (80s crime, not LA) | Who Framed Roger Rabbit, To Live and Die in L.A., Body Double, 52 Pick-Up, Cop | Yes | To Live and Die in L.A., Body Double, Cop, Blow Out, American Gigolo | Yes |

Score: A fits 0 of 8 on the place/setting (1 partly by genre). B fits 4, partly 4. C fits 3, partly 3, fails 2.

## What works now

- Feelings with a dial (cozy, slow, tense, scary, funny) and the stated facts (genre, decade, language, length).
- "like X" anchors, through the embeddings.
- A place that implies a language, only if the model happens to set it (Tokyo as Japanese), which is not reliable and is wrong for Lost in Translation.

## What fails

- Any place, setting or setup (Tokyo, Paris, LA, a train, a road trip, space, a small town, Christmas): read as nothing, or "Not used". The list is the best films of whatever else was asked.
- The keyword parser hides these words entirely (not even "Not used").
- Atmosphere with no tag and no dial: "at night", "autumn", "neon-soaked". Even with keywords this stays weak; tags for these barely exist.
- Several concepts at once ("snowy Christmas small town") via OR over keywords picks films that hit one tag, often the wrong mood.

## Recommended approach ($0 extra)

1. A new query field `settings: string[]` (places and setups), and a resolver from words to TMDB keywords.
   - Model parse: add `settings` to RECUT_SCHEMA and one prompt line ("a place, setting or situation the film is set in: Tokyo, a train, a road trip"). Same single call, about 10 more output tokens, so cost stays about $0.0001-0.0002 per new sentence. Bump the cache key to `recut:parse:v2` (old sentences re-parse once).
   - Keyword parser: a lexicon of the most common place/setting keywords so the free path reads them too.
   - Resolver: a static map built once from the catalogue's own keyword vocabulary (e.g. "tokyo" to "tokyo, japan", "train" to "train", "train journey"; "space" to "outer space", "space travel", "spacecraft", "space station"). Checked into the repo, no runtime AI.
2. Ranking: keyword match as a soft relevance part, not a hard filter (like a dial; matched films lead, the rest fill in only if fewer than W.keep match). With two or more settings, prefer films matching more of them (B's "most keywords matched").
3. Optional second step: the keyword centroid (C) to rank films inside the matched set, or to fill in films that lack the tag. Apply the existing title-word guard (`titleOnlyNeighbour`, rule 1122) to it, since C showed the same bleed as anchors (Tokyo Story, Strangers on a Train).
4. A chip "Set in Tokyo" (removable like the others) and the reason line ("Tokyo-set drama.").
5. Atmosphere words with no tag: map what we can to dials in the prompt and lexicon ("autumn"/"rainy" to warmth up and propulsion down, already done for "rainy Sunday"; "neon-soaked" to visual_artistry up). Show the rest honestly as "Not used: at night".

Cost: $0 extra. TMDB keywords are stored and already read into the Pitch catalogue (`recut-server.ts` CATALOG_COLS has `tmdb_keywords`, used today only for the erotic flag). Centroid vectors come from `film_vec` in the database. No new embedding or model calls. (Embedding the pitch sentence itself with OpenAI would cost about $0.000001 a pitch but adds a call and latency; not needed.)

Effort: about 1.5 to 2 days.
- Schema, prompt, cache bump, keyword lexicon: 0.5 day
- Keyword resolver map from the vocabulary (SQL plus hand review): 0.5 day
- Ranking boost, chip, reason line, keep keywords on RankFilm: 0.5 day
- Eval: add 10 place/setting pitches to scripts/eval-pitch.ts with expected films, plus centroid (optional): 0.5 day

Limits to tell the owner: tags cover places and setups well, mood and time of day poorly; TMDB tags are uneven (a single train scene can tag a film "train"), so "set on a train" will sometimes surface films that only have a train in them.
