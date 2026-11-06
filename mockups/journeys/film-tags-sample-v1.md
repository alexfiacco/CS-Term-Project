# Film setting tags: sample (v1, 2026-11-06)

**This is a HAND CHECK, not model output.** The build machine cannot call the model (no API key, and secrets are never read). I applied the tagging prompt's rules (lib/film-settings-tagger.ts `TAG_SYSTEM`) by hand to 20 of the 60 sample films, using exactly the input the model gets: each film's synopsis, TMDB keywords and genres as stored in `films` (read-only SELECT). It shows what the rules should produce and where they bite. The real gate is in production: until the owner sets the unlock line in film-settings-v1.sql, the cron tags only the 60 `SAMPLE_SLUGS`, and those rows are read back and reviewed before the full run.

Rules applied: tag only what is central (where most of it is set, its main setting or setup, a dominant season, time or atmosphere); ground every tag in the input; never from the title alone; a TMDB keyword alone is weak evidence unless the synopsis agrees or it clearly names the main setting; prefer fewer tags; only "high" confidence is stored; caps 2 places, 3 settings, 1 season, 1 time, 3 atmosphere; no contradictory pairs.

| Film | Kept tags (high) | Dropped (medium/low, or rule) | Why |
|---|---|---|---|
| Lost in Translation (2003) | Tokyo; In a hotel | night (not in input) | Synopsis "visiting Tokyo"; keyword "hotel room", and the hotel is where it lives. |
| Perfect Days (2023) | Tokyo | big city (medium) | Synopsis "toilet cleaner in Tokyo". |
| Strangers on a Train (1951) | (none) | train: TRAP | Title and keywords say train; the synopsis never does (one meeting scene). Rule: never from the title, keyword alone is weak. |
| Before Sunrise (1995) | Vienna; Over one night | train: TRAP | "A meeting on a train" is the start only; "an evening wandering through Vienna ... as the night unfolds". |
| The Darjeeling Limited (2007) | India; On a train | | Synopsis "a train voyage across India". |
| Snowpiercer (2013) | On a train; After the end of the world; Dystopian future | In winter (medium); New Year's Eve: one scene | Synopsis "aboard the Snowpiercer, a train"; keywords dystopia, post-apocalyptic future. |
| Paris, Texas (1984) | Texas; Desert; Road trip | Paris: TRAP (title) | Keywords texas, desert, road trip, on the road; synopsis "out of the desert". |
| Inception (2010) | A heist; Dreamlike | | The TMDB "heist" here is right: the synopsis is a planned job by a thief. Kept, unlike Dirty Dancing's. |
| Dirty Dancing (1987) | In summer; On holiday | heist: TRAP (keyword "robbery"); summer camp (it is a resort) | Synopsis "a summer in the Catskills with her family". |
| Harry Potter and the Prisoner of Azkaban (2004) | Boarding school | At Christmas: TRAP (keyword only); fantasy world (medium) | Keywords school of witchcraft, school; synopsis "heading to Hogwarts". |
| Die Hard (1988) | Los Angeles; Over one night | At Christmas (keyword only, synopsis silent); office (medium) | Synopsis "the city of L.A. ... seized a building"; keyword one night. A real miss by the strict rule: it is a Christmas film, but the input does not say so in the synopsis. |
| The Shining (1980) | In a hotel; In winter; Isolated; Snowy | eerie (medium) | Synopsis "Overlook Hotel ... isolated ... for the winter"; keywords snowstorm, blizzard. |
| The Thing (1982) | Arctic cold; Isolated; Snowy | A lab (medium) | Synopsis "a research team in Antarctica"; keywords isolation, snowstorm. |
| Home Alone (1990) | At Christmas; Suburbs | Chicago (medium: only "suburban chicago") | Synopsis "Christmas vacation ... break into his home". |
| Fargo (1996) | Small town; In winter | Snowy (medium) | Synopsis "small-town Minnesota"; keyword winter. Minnesota is not in the vocabulary. |
| Jaws (1975) | By the sea; Small town; At sea | In summer (medium: only "fourth of july") | Synopsis "the seaside community of Amity"; keywords beach, fishing boat, sea adventure. |
| Call Me by Your Name (2017) | Italy; In summer | A grand house (medium, "villa") | Synopsis "In the summer of 1983 ... villa in Italy". |
| Taxi Driver (1976) | New York; At night; Big city | Gritty (medium) | Synopsis "New York City cabbie, haunting the streets nightly ... the filthy city". |
| My Neighbor Totoro (1988) | Countryside; In the woods | Japan: not named in the input | Synopsis "move to the country ... spirits of the forest"; keywords rural area, village. |
| Titanic (1997) | At sea | | Synopsis and keywords: the ship, ocean liner. |

What this shows:
- The traps hold: Strangers on a Train, Paris, Texas, Before Sunrise's train, Dirty Dancing's "robbery", Harry Potter's "christmas" are not tagged.
- The strict grounding rule costs some true tags (Die Hard at Christmas, Totoro in Japan). That is the trade the owner asked for (no loose tags); TMDB keywords still count for those films at a lower weight until a tag exists, and a film we have tagged without the setting keeps its TMDB keyword at 0.25, not 0.6.
- Atmosphere stays sparse, as expected; it is the weakest category.

Read the real 60 after the first run with:

```sql
select f.title, f.year, s.tags from film_settings s join films f on f.letterboxd_slug = s.slug order by f.title;
```

(ids map to names in lib/film-settings-vocab.ts.)
