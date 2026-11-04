# "Why this fits your taste": before and after (2026-11-04)

Owner report (iPhone, Joint Security Area at 83%): "Generic explanations." Sixteen real (viewer, film) pairs, pulled read-only from Supabase: the reads actually shown (`film_reads_shown`), the "Because you enjoyed" row from the cached sheet (`ai_cache` match payloads) or, where none was cached, the top `anchor_sims` matches over the 0.30 floor, and the viewer's own library (`public_profiles.library_json` joined to `films`). The owner is "owner"; the one other account with stored reads is "viewer B". No database writes.

## How to read this

- **Before**: the line the sheet showed.
- **Detector**: the new `genericFit` (lib/taste/fit-connections.ts) on that line, given this viewer's connections. "generic" means the line is rejected and rewritten.
- **What the writer is now given**: the CONCRETE CONNECTIONS block computed from the library (no model call). The star counts are for the model only and are stripped from any output.
- **After (floor)**: `concreteFit`, the line the code ships when the model's answer still names none of the connections. It is real code output on these inputs. The model's own answer, written from the new prompt and block, replaces it whenever it names the director or a film from the block.

**No model calls were made.** This environment has no Anthropic key (the repo reads `ANTHROPIC_API_KEY`, which is unset here, and secrets were not pulled from Vercel), so the "after" model text could not be generated offline. What is shown for after is (a) exactly what the prompt now receives and (b) the deterministic floor the code guarantees. The prompt-level change is described under each pair.

## Summary

- Before reads flagged generic by the new detector: **12 of 16**.
- Pairs where a concrete connection exists (so the after read must name a person or film): **13 of 16**; in 10 of them it is a shared director or lead, which no before read mentioned.
- Pairs with nothing concrete in the library (La Bola Negra, viewer B's two): the prompt change applies (Film DNA strand demoted to background, the two halves must connect), but there is no deterministic floor and no stored line is overturned except a stock phrase plus a vague opener.

## 1. Joint Security Area (2000) (owner)

**Before**: You're drawn to films about everyday people with real feelings, and this one is a tense political thriller about soldiers on a divided border.

**Before, where it might lose you**: It is heavy on military tension and the bleak weight of its political setting, so it rarely lets up.

**Detector**: generic, rewritten on next open

**What the writer is now given**:

```
CONCRETE CONNECTIONS (strongest first; the star counts are for you, never write them):
- SAME DIRECTOR: Park Chan-wook also directed Oldboy (5 stars), The Handmaiden (4.5 stars), which they enjoyed.
- IN "BECAUSE YOU ENJOYED": Memories of Murder (2003), 4.5 stars; also from South Korea; also in Korean; same era (2003); shared genres: Drama, Thriller
- IN "BECAUSE YOU ENJOYED": Oldboy (2003), 5 stars; same director (Park Chan-wook); also from South Korea; also in Korean; same era (2003); shared genres: Thriller, Mystery
- IN "BECAUSE YOU ENJOYED": The Handmaiden (2016), 4.5 stars; same director (Park Chan-wook); also from South Korea; also in Korean; shared genres: Thriller, Drama
```

**After (floor)**: It's by Park Chan-wook, who also made Oldboy and The Handmaiden, two films you enjoyed.

## 2. A Bronx Tale (1993) (owner)

**Before**: You're drawn to stories about young men caught between two worlds, like Boyz n the Hood, and this one sits in that tension without rushing to resolve it.

**Before, where it might lose you**: The film is a decade old now, and its view of the neighborhood and the girl at its center carries the attitudes of its time.

**Detector**: passes (names a connection, or nothing concrete exists)

**What the writer is now given**:

```
CONCRETE CONNECTIONS (strongest first; the star counts are for you, never write them):
- SAME LEAD: Robert De Niro stars in this and in The Godfather Part II (5 stars), Heat (5 stars), GoodFellas (4.5 stars), which they enjoyed.
- IN "BECAUSE YOU ENJOYED": GoodFellas (1990), 4.5 stars; same era (1990); shared genres: Drama, Crime
- IN "BECAUSE YOU ENJOYED": Boyz n the Hood (1991), 4.5 stars; same era (1991); shared genres: Crime, Drama
- IN "BECAUSE YOU ENJOYED": Casino (1995), 4 stars; same era (1995); shared genres: Crime, Drama
- IN "BECAUSE YOU ENJOYED": Carlito's Way (1993), 4.5 stars; same era (1993); shared genres: Crime, Drama
- IN "BECAUSE YOU ENJOYED": Do the Right Thing (1989), 4.5 stars; same era (1989); shared genres: Drama
```

**After (floor)**: Robert De Niro leads this one, as in The Godfather Part II and Heat, two films you enjoyed.

## 3. Once Upon a Time in America (1984) (owner)

**Before**: You've enjoyed organized crime family sagas like The Godfather and The Irishman, and this one is built on regret and memory rather than action, a slow meditation on what a life in that world costs.

**Detector**: generic, rewritten on next open

**What the writer is now given**:

```
CONCRETE CONNECTIONS (strongest first; the star counts are for you, never write them):
- SAME DIRECTOR: Sergio Leone also directed The Good, the Bad and the Ugly (4.5 stars), For a Few Dollars More (4 stars), Once Upon a Time in the West (4 stars), which they enjoyed.
- SAME LEAD: Robert De Niro stars in this and in GoodFellas (4.5 stars), which they enjoyed.
- IN "BECAUSE YOU ENJOYED": The Godfather (1972), 5 stars; shared genres: Drama, Crime
- IN "BECAUSE YOU ENJOYED": GoodFellas (1990), 4.5 stars; shared genres: Drama, Crime
- IN "BECAUSE YOU ENJOYED": The Irishman, hearted
- IN "BECAUSE YOU ENJOYED": Casino, hearted
- IN "BECAUSE YOU ENJOYED": Carlito's Way, hearted
```

**After (floor)**: It's by Sergio Leone, who also made The Good, the Bad and the Ugly and For a Few Dollars More, two films you enjoyed.

## 4. Witness for the Prosecution (1957) (owner)

**Before**: You're drawn to courtroom dramas where the argument itself is the engine, and this one is a puzzle box that keeps tightening, built on the kind of verbal sparring and procedural logic that made you enjoyed 12 Angry Men.

**Before, where it might lose you**: It's a 1957 film shot in black and white on a soundstage, so the world feels theatrical and contained rather than lived-in.

**Detector**: generic, rewritten on next open

**What the writer is now given**:

```
CONCRETE CONNECTIONS (strongest first; the star counts are for you, never write them):
- SAME DIRECTOR: Billy Wilder also directed Sunset Boulevard (4.5 stars), The Apartment (4.5 stars), Double Indemnity (4 stars), which they enjoyed.
- IN "BECAUSE YOU ENJOYED": 12 Angry Men (1957), 4.5 stars; same era (1957); shared genres: Drama
- IN "BECAUSE YOU ENJOYED": Dial M for Murder, hearted
- IN "BECAUSE YOU ENJOYED": Double Indemnity (1944), 4 stars; same director (Billy Wilder); shared genres: Crime
- IN "BECAUSE YOU ENJOYED": Some Like It Hot, hearted
- IN "BECAUSE YOU ENJOYED": The Apartment (1960), 4.5 stars; same director (Billy Wilder); same era (1960); shared genres: Drama
```

**After (floor)**: It's by Billy Wilder, who also made Sunset Boulevard and The Apartment, two films you enjoyed.

## 5. Dune: Part Three (2026) (owner)

**Before**: You love big, imaginative science fiction, and this one is huge in scale, with a sweeping look that rewards patience.

**Detector**: generic, rewritten on next open

**What the writer is now given**:

```
CONCRETE CONNECTIONS (strongest first; the star counts are for you, never write them):
- SAME DIRECTOR: Denis Villeneuve also directed Incendies (5 stars), Blade Runner 2049 (4.5 stars), Prisoners (4.5 stars), which they enjoyed.
- SAME LEAD: Timothée Chalamet stars in this and in Dune: Part Two (4.5 stars), which they enjoyed.
- IN "BECAUSE YOU ENJOYED": Blade Runner 2049 (2017), 4.5 stars; same director (Denis Villeneuve); shared genres: Science Fiction
- IN "BECAUSE YOU ENJOYED": Star Wars: Episode III - Revenge of the Sith (2005), 4.5 stars; shared genres: Adventure, Action, Science Fiction
- IN "BECAUSE YOU ENJOYED": Guardians of the Galaxy Vol. 3 (2023), 4 stars; same era (2023); shared genres: Science Fiction, Adventure, Action
```

**After (floor)**: It's by Denis Villeneuve, who also made Incendies and Blade Runner 2049, two films you enjoyed.

## 6. Godzilla Minus Zero (2026) (owner)

**Before**: You love big monster clashes, and this one is built around a giant creature and the chaos it brings, the kind of thing you enjoyed in Akira.

**Before, where it might lose you**: The synopsis is short and the setup sits in a hard-hit country still rebuilding, so expect a slower start before the monster arrives.

**Detector**: generic, rewritten on next open

**What the writer is now given**:

```
CONCRETE CONNECTIONS (strongest first; the star counts are for you, never write them):
- SAME DIRECTOR: Takashi Yamazaki also directed Godzilla Minus One (4.5 stars), which they enjoyed.
- SAME LEAD: Ryunosuke Kamiki stars in this and in Your Name. (5 stars), Godzilla Minus One (4.5 stars), which they enjoyed.
- IN "BECAUSE YOU ENJOYED": Akira (1988), 4 stars; also from Japan; also in Japanese; shared genres: Science Fiction, Action
- IN "BECAUSE YOU ENJOYED": Frankenstein (2025), 4 stars; same era (2025); shared genres: Horror
```

**After (floor)**: It's by Takashi Yamazaki, who also made Godzilla Minus One, a film you enjoyed.

## 7. In the Name of the Father (1993) (owner)

**Before**: You're drawn to stories about people fighting through a system that has crushed them, and this one builds its whole weight on a father and son locked in that struggle together.

**Before, where it might lose you**: It's a film from 1993 shot on location in grey light, so the look is dated and the pacing moves at a deliberate crawl.

**Detector**: generic, rewritten on next open

**What the writer is now given**:

```
CONCRETE CONNECTIONS (strongest first; the star counts are for you, never write them):
- SAME LEAD: Daniel Day-Lewis stars in this and in There Will Be Blood (5 stars), Phantom Thread (4 stars), which they enjoyed.
- IN "BECAUSE YOU ENJOYED": The Irishman (2019), 4 stars; shared genres: Drama
```

**After (floor)**: Daniel Day-Lewis leads this one, as in There Will Be Blood and Phantom Thread, two films you enjoyed.

## 8. A Taxi Driver (2017) (owner)

**Before**: You're drawn to moving, human stories, and this one is a political drama with a sober, tragic weight.

**Before, where it might lose you**: It's a political story about real events, so the pace is steady and the talk of power can feel heavy for a casual night.

**Detector**: generic, rewritten on next open

**What the writer is now given**:

```
CONCRETE CONNECTIONS (strongest first; the star counts are for you, never write them):
- SAME LEAD: Song Kang-ho stars in this and in Parasite (5 stars), Memories of Murder (4.5 stars), which they enjoyed.
```

**After (floor)**: Song Kang-ho leads this one, as in Parasite and Memories of Murder, two films you enjoyed.

## 9. Dogville (2003) (owner)

**Before**: You're drawn to stories where a community's true nature gets exposed, and this one lays bare what people will do when they feel safe enough to show it.

**Detector**: generic, rewritten on next open

**What the writer is now given**:

```
CONCRETE CONNECTIONS (strongest first; the star counts are for you, never write them):
- SAME LEAD: Nicole Kidman stars in this and in The Others (4 stars), The Northman (4 stars), which they enjoyed.
```

**After (floor)**: Nicole Kidman leads this one, as in The Others and The Northman, two films you enjoyed.

## 10. Secrets & Lies (1996) (owner)

**Before**: You're drawn to everyday people and real feelings in family drama, and this one stays close to ordinary lives as they fracture and search for connection, without looking away from the hurt.

**Before, where it might lose you**: The film moves slowly through long scenes of people talking and sitting together, which can feel like watching grass grow if you're in the mood for plot to pull you forward.

**Detector**: generic, rewritten on next open

**What the writer is now given**:

```
CONCRETE CONNECTIONS (strongest first; the star counts are for you, never write them):
- SAME LEAD: Brenda Blethyn stars in this and in Pride & Prejudice (4.5 stars), which they enjoyed.
```

**After (floor)**: Brenda Blethyn leads this one, as in Pride & Prejudice, a film you enjoyed.

## 11. Judgment at Nuremberg (1961) (owner)

**Before**: You've enjoyed courtroom dramas like 12 Angry Men, and this one is built entirely on argument and moral reckoning, with no escape into action or sentiment.

**Before, where it might lose you**: It is a three-hour film from 1961 that moves through testimony and cross-examination at a measured pace, so the rhythm is deliberate rather than propulsive.

**Detector**: passes (names a connection, or nothing concrete exists)

**What the writer is now given**:

```
CONCRETE CONNECTIONS (strongest first; the star counts are for you, never write them):
- IN "BECAUSE YOU ENJOYED": 12 Angry Men (1957), 4.5 stars; same era (1957); shared genres: Drama
- IN "BECAUSE YOU ENJOYED": Schindler's List (1993), 5 stars; shared genres: Drama, History
```

**After (floor)**: Of the films you've enjoyed, it sits closest to 12 Angry Men: from the same years, a drama too.

## 12. The Voice of Hind Rajab (2025) (owner)

**Before**: You're drawn to dark, emotional true stories, and this one is raw and unflinching, built around a single desperate phone call.

**Before, where it might lose you**: It's a short, tightly focused docudrama with no broader story to lean on, so the grief can feel relentless.

**Detector**: generic, rewritten on next open

**What the writer is now given**:

```
CONCRETE CONNECTIONS (strongest first; the star counts are for you, never write them):
- IN "BECAUSE YOU ENJOYED": Incendies (2010), 5 stars; shared genres: Drama
```

**After (floor)**: Of the films you've enjoyed, it sits closest to Incendies: a drama too.

## 13. The Fall (2006) (owner)

**Before**: You're drawn to fantastical coming-of-age stories, and this one is a dazzling, handmade fantasy with a real sense of wonder.

**Before, where it might lose you**: It's a slow, sad story told mostly through a hospital bed, and its dreamy visuals may not hold you if you wanted more momentum.

**Detector**: generic, rewritten on next open

**What the writer is now given**:

```
CONCRETE CONNECTIONS (strongest first; the star counts are for you, never write them):
- IN "BECAUSE YOU ENJOYED": The Lord of the Rings: The Return of the King (2003), 5 stars; same era (2003); shared genres: Adventure, Fantasy
- IN "BECAUSE YOU ENJOYED": Normal People (2020), hearted; shared genres: Drama
```

**After (floor)**: Of the films you've enjoyed, it sits closest to The Lord of the Rings: The Return of the King: from the same years, an adventure too.

## 14. La Bola Negra (2026) (owner)

**Before**: You're drawn to drama that centers everyday people and real feelings, and this war story trades spectacle for the human cost, letting the performances carry the weight.

**Before, where it might lose you**: War as subject matter can pull toward bleakness and loss rather than the warmer, more hopeful register you tend to favor.

**Detector**: generic, rewritten on next open

**What the writer is now given**: no concrete connection in the library; the taste profile is marked background-only.

**After (floor)**: (none: the model line stands, with the new prompt)

## 15. Harakiri (1962) (viewer B)

**Before**: You're drawn to period dramas about honor and duty, and you liked High and Low, so this severe, slow-building samurai tale should land well.

**Before, where it might lose you**: It's a long, talky film from 1962 that moves slowly through its story, so the pace may test your patience.

**Detector**: passes (names a connection, or nothing concrete exists)

**What the writer is now given**: no concrete connection in the library; the taste profile is marked background-only.

**After (floor)**: (none: the model line stands, with the new prompt)

## 16. The Year of Awakening (1991) (viewer B)

**Before**: This is a drama, and your taste runs toward gray ethics, twisty puzzles and intense material, which this film doesn't obviously offer.

**Before, where it might lose you**: If you ever want a quieter, character-led drama with real feeling, this could still hold your attention.

**Detector**: passes (names a connection, or nothing concrete exists)

**What the writer is now given**: no concrete connection in the library; the taste profile is marked background-only.

**After (floor)**: (none: the model line stands, with the new prompt)

## Where it might lose you

Both prompts now ask for the caveat FOR THEM: when the library shows friction (films by the same director they rated 2.5 or lower), the caveat is built on that and may name the director, never a film; otherwise it must be one concrete thing about the film (pace, length, how dark or odd it gets), kept short, never a general description of its mood. None of these sixteen pairs has same-director friction in the library, so here the change is the "short and concrete" instruction. JSA's before caveat ("heavy on military tension and the bleak weight of its political setting, so it rarely lets up") is the case it targets: a mood summary with a banned abstraction ("weight").

## Caveats on the measurement

- Rows for pairs with no cached sheet (A Taxi Driver, Dogville, Secrets & Lies, La Bola Negra, Dune: Part Three, both of viewer B's) were rebuilt from raw `anchor_sims` (top 5 over 0.30); the app reranks that list, so the live row can differ. Dune: Part Two was removed from Dune: Part Three's row by hand, as the app's franchise filter would.
- Viewer B's library has no film sharing a director or top-billed lead with Harakiri or The Year of Awakening, and neither film has a row over the floor.
- The libraries are the published `library_json`; ratings logged in the app since the last publish are not included.
