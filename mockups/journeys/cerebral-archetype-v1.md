# A 15th archetype for the cerebral viewer (v1, 2026-11-06)

Research and a no-save dry run. Nothing in Montage was changed, pushed or saved, and nothing was written to the database.

Read from `montage` origin/main: `lib/taste/archetypes.ts`, `lib/archetype-info.ts`, `lib/taste/graph-archetype.ts`, `lib/taste/unified/{model,report,apply}.ts`, `lib/taste/identity-version.ts` (version 53), `docs/ARCHETYPES.md`, `ios/Montage/Resources/Archetypes.json`, and `archetypes-review-v1.md` in this folder.

## The short answer

- **Recommended name: Overthinker.** Tag: "You leave with a theory."
- **Who changes, on 21 profiles:** with the recommended setup, nobody is named Overthinker yet. 4 of 21 get it as a streak, and 1 of 21 changes name as a side effect (P13, Lovestruck to Hardboiled). In all, 9 of 21 see some change to the header.
- **Lead share:** 0 of 21 for the new lane (0%), well under the ~15% ceiling. The most permissive setup tested gives it 1 of 21 (5%).
- **Nihilist stops being the default dark streak:** 11 of 21 have it as a streak today, 6 of 21 after. Memento, The Prestige, Gone Girl, Ex Machina and Shutter Island read about 90% Nihilist today. That is where the over-streaking comes from.
- **Why it rarely leads (the main finding):** the name comes from the strongest family of feel (dark, epic, heart, craft). A lane in a family of its own would need 21% to 57% of what someone loves to win (27% for the median profile). The most cerebral profile here is at 17%. So the lane goes inside the dark family, where it only has to beat Nihilist and Hardboiled.
- **Build:** about 2 to 3 days, plus an iOS build. IDENTITY_SCORING_VERSION goes from 53 to 54, and the norms must be recomputed before the lane can show up for anyone.

## 1. How the lane is defined

### Where the name actually comes from

Since identity version 46, the name, streaks and five films come from the one taste model (`lib/taste/unified`), not the v31 graph lanes. The v31 graph read (`graph-archetype.ts`, with `laneAllowed`) still runs as the fallback and for small or old reads, so it needs the lane too (see section 4). The one model works like this:

- Every film is a standardised vector of 241 features: the 24 numeric film labels (`film_labels`), the label categories (ending, audience, humor style, `twist`, `true_story`), genres, decade, non-English, long runtime, and the nanogenre lanes.
- Each archetype is a direction: the mean of its 8 defining films (`archetype-info.ts`), minus the mean of all the archetypes' means.
- A film belongs to its archetypes by cosine, softmaxed at 0.08. Some archetypes only take films with a plain fact (`FILM_FACT`).
- A person's shares are weighted by how far above their own average they rate each film, with watched-only films counted lightly. Shares are then grouped into families of feel (`FAMILY`), and the name comes from the strongest family.

### The new lane

| Piece | Proposal |
|---|---|
| id | `cerebral` (label Overthinker) |
| Defining films (8, the centroid) | Inception, Memento, The Prestige, Interstellar, Arrival, Ex Machina, Gone Girl, Shutter Island |
| What sets the direction | High `brain_demand` (65 to 95 on all 8), `twist` true on 7 of 8, middling `plot_clarity`, high `tension`, genres Science Fiction / Mystery / Thriller, and lanes like Cerebral First Contact, Fractured Psyche Thrillers, Hard Science Exploration Epic, Astronaut Isolation Odyssey |
| Film fact gate (`FILM_FACT.cerebral`) | `brain_demand >= 65` and at least one genre of Thriller, Mystery or Science Fiction. On average, 15% of a profile's loved films pass. |
| Family (`FAMILY`) | `dark` (beside Nihilist, Hardboiled, Midnight Cultist) |
| Film DNA strands (`ARCHETYPE_STRANDS`) | `narrative_complexity` (Complexity). The header never names Overthinker for someone whose Complexity sits clearly low (3 of 21 were blocked this way in the run). |
| Header gate (`GATES`) | None. See the next point. |

Why there is a film gate but no header gate:

- The film gate keeps the lane from absorbing films that only resemble the direction. Without it, Get Out, Oppenheimer, Black Swan and Sicario each gave the lane a slice.
- A header gate (a share of loved films, as Globetrotter and Old Soul have) backfired in the test. A blocked lane's share is dropped from its family's strength, and that flipped two unrelated names, P18 and P19.
- Director facts (Nolan, Fincher, Villeneuve) are not used. Who made a film belongs to Auteurist, which the one model does not read. A director gate would also pull in Dunkirk, Oppenheimer and The Social Network.

### Where the 20 named films land (main lane, share)

| Film | Today | With Overthinker |
|---|---|---|
| Inception | IMAX Idealist 70 | Overthinker 97 |
| Memento | Nihilist 94 | Overthinker 62, Nihilist 36 |
| Interstellar | Aesthete 52, IMAX 43 | Overthinker 52 |
| Tenet | IMAX Idealist 94 | Overthinker 78 |
| The Prestige | Nihilist 88 | Overthinker 98 |
| Arrival | Aesthete 99 | Overthinker 90 |
| Ex Machina | Nihilist 92 | Overthinker 94 |
| Gone Girl | Nihilist 91 | Overthinker 72 |
| Shutter Island | Nihilist 89 | Overthinker 90 |
| Enemy | Nihilist 65 | Overthinker 82 |
| Primer | Aesthete 47 | Overthinker 65 |
| Coherence | Nihilist 66 | Overthinker 98 |
| Moon | Aesthete 83 | Overthinker 73 |
| Blade Runner 2049 | Aesthete 98 | Overthinker 53, Aesthete 46 |
| Prisoners | Nihilist 57, Hardboiled 42 | unchanged (Overthinker 5) |
| Zodiac | Hardboiled 60 | unchanged (Overthinker 3) |
| Se7en | Nihilist 89 | unchanged |
| Fight Club | Nihilist 61 | Nihilist 49, Overthinker 22 |
| Sicario | Nihilist 94 | unchanged |
| Annihilation | Midnight Cultist 73 | Midnight Cultist 54, Overthinker 28 |

14 of the 20 move. The 6 that stay are the procedural, bleak or horror ones, and that is a clean split:

- **Hardboiled** keeps how crime is built and its swagger: Heat 99, Pulp Fiction 100, Zodiac and The Dark Knight unchanged.
- **Nihilist** keeps the bleak and unresolved: Se7en, Prisoners, Sicario, No Country.
- **IMAX Idealist** keeps the scale: Dune: Part Two 63, The Matrix 53. It gives up the Nolan puzzles (Inception, Tenet).
- **Voyager** is untouched: Star Wars 98.
- **Aesthete** also gives up cerebral sci-fi (Arrival, Moon, half of Blade Runner 2049). The brief did not name Aesthete, but it is affected.

Prisoners was first tried as a defining film, but it still read 57% Nihilist. It was replaced by Interstellar.

## 2. Dry run on the 21 stored profiles

### How the run was done

- Inputs were read with read-only SELECTs on `uktamekqqsiijugpaxit`: libraries with in-app ratings merged, watched-only keys, Canons, film facts, labels and lanes.
- The model's own pure function (`computeReport` in `lib/taste/unified/report.ts`) was run in memory in a throwaway worktree. Nothing was saved.
- **Check on the setup:** the baseline reproduces the saved norms exactly (every archetype's average share matches to 3 decimals). It gives the stored name for 20 of 21 profiles and the whole stored header for 16 of 21. The misses are small libraries (production reads some of them against first-deck averages) and the order of the last streak.
- The "Before" column below is the baseline run, so the table shows only what the new lane changes. "Stored" is shown where it differs.
- P1 to P21 are ordered by library size, largest first.

### Recommended setup: dark family, film gate

| P | Rated | Before | After | Change |
|---|---|---|---|---|
| P1 | 1079 | Nihilist > Lovestruck > IMAX Idealist (stored: Tenderhearted second) | same | none |
| P2 | 877 | Lovestruck > Old Soul > Nihilist | same | none |
| P3 | 569 | Animation Devotee > IMAX Idealist > Nihilist | Animation Devotee > IMAX Idealist > Hardboiled | streak Nihilist to Hardboiled |
| P4 | 420 | Tenderhearted > Nihilist > Lovestruck | same | none |
| P5 | 394 | Lovestruck > Hardboiled > IMAX Idealist | same | none |
| P6 | 333 | IMAX Idealist > Nihilist > Voyager | same | none |
| P7 | 295 | IMAX Idealist > Nihilist | same | none |
| P8 | 252 | Lovestruck > Voyager > Nihilist | same | none |
| P9 | 236 | Midnight Cultist > IMAX Idealist | same | none |
| P10 | 141 | Lovestruck > Voyager > Nihilist | Lovestruck > Voyager > Hardboiled | streak Nihilist to Hardboiled |
| P11 | 105 | Voyager > Animation Devotee > Nihilist | Voyager > Animation Devotee > IMAX Idealist | streak Nihilist to IMAX Idealist |
| P12 | 94 | Hardboiled > Chronicler > Tenderhearted | same | none |
| P13 | 90 | Lovestruck > Hardboiled | Hardboiled > Lovestruck | **lead Lovestruck to Hardboiled** |
| P14 | 83 | Lovestruck > IMAX Idealist > Nihilist | Lovestruck > Overthinker > IMAX Idealist | **streak Overthinker** (The Prestige, Shutter Island) |
| P15 | 71 | Midnight Cultist > Nihilist | same | none |
| P16 | 53 | Nihilist > IMAX Idealist > Hardboiled (stored: no IMAX) | Nihilist > Overthinker > Hardboiled | **streak Overthinker** (The Prestige, Inception) |
| P17 | 33 | IMAX Idealist > Nihilist | IMAX Idealist > Overthinker | **streak Overthinker** (Interstellar, The Big Short) |
| P18 | 32 | Hardboiled > Lovestruck > IMAX Idealist | Hardboiled > Lovestruck > Voyager | streak IMAX Idealist to Voyager |
| P19 | 32 | Midnight Cultist > Animation Devotee > IMAX Idealist (stored: Hardboiled lead) | same | none |
| P20 | 25 | Comic Relief > IMAX Idealist > Hardboiled (stored: Voyager second) | Comic Relief > Overthinker > IMAX Idealist | **streak Overthinker** (The Dark Knight, Everything Everywhere All at Once) |
| P21 | 13 | IMAX Idealist > Hardboiled | same | none |

What changes:

- **Names:** 1 of 21 changes (P13, Lovestruck to Hardboiled). Lovestruck loses that lead. Nobody loses a name to Overthinker.
- **Streaks:**

| Archetype | Before | After |
|---|---|---|
| Nihilist | 11 | 6 |
| IMAX Idealist | 9 | 8 |
| Hardboiled | 5 | 5 |
| Overthinker | 0 | 4 |
| Voyager | 3 | 4 |
| Lovestruck | 3 | 4 |

  Others are unchanged.
- **Lead counts after:** Lovestruck 5, IMAX Idealist 4, Midnight Cultist 3, Hardboiled 3, Nihilist 2, and 1 each for the rest. Lovestruck is still over the ceiling (24%), but less than today (29%). That is the existing issue from the review, not this change.
- **Weak streaks (P17 and P20):** a streak stands for its whole family, so the dark side's strongest films can be filed under it (The Big Short, The Dark Knight). Both are small libraries. The fix is in section 4: a streak's "led by" films should prefer its own kind, as the name's films already do.

### The other setups tested (same 21, same baseline)

| Setup | Overthinker leads | Overthinker streaks | Names changed | Headers changed | Nihilist streaks |
|---|---|---|---|---|---|
| Own family, no gate | 0 | 2 (P14, P16) | 1 (P19, a baseline miss: stored is already Hardboiled) | 10 | 5 |
| Own family, film gate | 0 | 0 | 0 | 5 | 8 |
| **Dark family, film gate (recommended)** | **0** | **4** | **1 (P13)** | **9** | **6** |
| Dark family, no gate | 1 (P16, from Nihilist) | 4 | 3 (P13, P16, P19) | 11 | 7 |
| Dark family, gate at brain_demand 60 | 0 | 4 | 2 (P13, P19) | 11 | 6 |
| Header gate instead of film gate (tried with the first defining-film set) | 0 in its own family, 1 in dark | 1 in its own family, 0 in dark | 2 to 3 (P18 and P19 flip) | 10 | 5 |

- The ungated dark setup is the only one that names someone Overthinker today (P16, whose loves are the most cerebral here: 6 of 34 loved films are from the list). It costs a looser lane: Get Out, Oppenheimer, Black Swan and Sicario each give it a slice.
- If the owner wants a cerebral viewer to be named at launch, drop the gate. If launch safety matters more, keep it. It can be loosened later without renaming anyone.
- Either way, the lead share stays far under the ceiling.

## 3. Name options

The name needs to cover ideas, puzzle-box plots and slow-burn intensity. Mind Bender was ruled out as too narrow (twists only).

| Name | Tag | Note |
|---|---|---|
| **Overthinker** (recommended) | You leave with a theory. | Warm and a little self-aware, like Comic Relief and Lovestruck. Covers the puzzle (Memento), the idea (Arrival) and the tension that keeps you turning it over (Gone Girl). Reads well on a card: "Overthinker with a streak of Nihilist". |
| Theorist | Every film is a case to crack. | One word, like Auteurist and Chronicler. Leans to puzzles and mysteries more than to ideas. Can sound academic. |
| Deep Thinker | Films that ask more of you. | The plainest. Covers ideas best, puzzles less. Less fun on a share card. |
| Mastermind | Three moves ahead of the plot. | Strong and short. Reads as twist-spotting (close to Mind Bender), and as a villain. |

Directory copy for Overthinker, in the house voice:

- **tag:** You leave with a theory.
- **desc:** Puzzle-box plots, big ideas and slow-burn tension. You want a film that trusts you to keep up, and keeps working on you after the credits.
- **kind:** Films that make you think: puzzle-box plots, big ideas, slow-burn tension.
- **ARCHETYPE_KIND:** films that make you think
- **KIND** (`apply.ts`, used in "Most of your favorites are ..."): puzzles and big ideas
- **blurb** (`LABELS`): puzzle-box plots, big ideas and slow-burn tension

**6 defining films:** Inception, Memento, Arrival, Gone Girl, Ex Machina, Shutter Island. The directory and the centroid use 8, so add The Prestige and Interstellar. This is the tested set. None of them is in another archetype's list. Se7en (Nihilist), Blade Runner 2049 (Aesthete) and The Dark Knight (IMAX Idealist) stay where they are.

## 4. Build size and risk

### Files to touch

**One model (decides the name):**
- `lib/taste/unified/report.ts`: `IDS` gets "Overthinker": "cerebral".
- `lib/taste/unified/model.ts`: `FAMILY.cerebral = "dark"` and the `FILM_FACT.cerebral` gate.
- `lib/taste/unified/apply.ts`: `KIND`.
- `lib/taste/taste-dna.ts`: `ARCHETYPE_STRANDS.cerebral`.
- `model.ts` `readPerson`: the small fix so a streak's films prefer its own kind.

**Ids and copy:**
- `lib/taste/archetypes.ts`: `ArchetypeId`, `LABELS`, and a `raw` formula for the feature classifier. That formula needs a "cerebral" tag family in `lexicon.ts`; it is used in the quiz and as the fallback.
- `lib/archetype-info.ts`: the `ARCHETYPES` entry and `ARCHETYPE_KIND`.
- `lib/archetype-streaks.ts`, `lib/group-names.ts` (adjectives and crowd words), `marketing/kit/top3.ts`.
- `lib/taste/match.ts`: the "never output archetype names" lists in the AI prompts.

**v31 graph read (fallback):**
- `lib/taste/graph-archetype.ts`: `CONTENT_IDS`, and a `laneAllowed` case. Its facts have no labels, so the gate there is on genre alone.
- `CROWD_ENJOYED`: recompute with the documented query.
- `scripts/persist-archetype-centroids.mjs`: the `DEFINING` list, then run it. This writes `taste_config`, so do it at build time, not now.

**Taste Test:**
- `lib/taste-test/probes.ts`: the seed must name all 15 archetypes, so one card changes or `SEED_SIZE` grows. Inception is already in the deck.
- `probe-archetypes.json`: rebake with `scripts/quiz-personas.ts probe-arch`, which also moves `DECK_SHARE`.

**"14 archetypes" copy, on web and iOS:**
- Web: `ArchetypesCta.tsx`, `ArchetypeSheet.tsx`, `Result.tsx`, `InputScreen.tsx`, `lib/profile-display.ts`.
- iOS: `WelcomeScreen.swift`, `ProfileScreen.swift`, `ProfileExtras.swift`, `ArchetypesScreen.swift`.
- Marketing: the App Store launch copy (`marketing/app-store/2026-11-launch.md`) and the launch samples.
- Docs: `docs/ARCHETYPES.md`, `ALGORITHMS.md`, `TASTE-MODEL.md`, `INVARIANTS.md`.

**iOS mirror:**
- `ios/Montage/Resources/Archetypes.json`: the new entry and its 8 posters (`scripts/bake-archetype-posters.mjs`). This ships in the app bundle.

**Invariants (`scripts/check-invariants.ts`):**
- Update 200 (the landing counts 14), 213 (the seed names all 14) and 583 (the bundled JSON holds 14).
- Update the "See all 14 archetypes" checks (around lines 2541, 6485 and 8427).
- Add a new rule for the lane: its family, gate, strands and defining films kept in sync.

**Version:**
- `lib/taste/identity-version.ts`: 53 to 54.

### What the version bump does to existing people

- Every stored profile re-saves under version 54 on its next build. No `LEGACY_LABELS` entry is needed, because no name is renamed.
- From this run, about 1 in 21 change name, and the change is a side effect (Lovestruck to Hardboiled). About 9 in 21 see a different streak. "Your read got sharper. You were X." covers the changes.
- `taste_snapshots` will show a step in the month it ships. Share cards already shared keep the old header.

### Order matters

The one model reads the archetype directions from the saved norms (`taste_model_norms`), so nobody gets the lane until those are recomputed. The steps:

1. Deploy the code.
2. Run the full taste pass so the norms carry 14 directions.
3. Re-save profiles under version 54.

### Effort

About 2 to 3 days in all:

- 1 day for code and copy.
- Half a day for the data steps (centroids, crowd baseline, deck rebake, norms pass) and the before/after check against this table.
- Half a day for invariants and docs.
- An iOS build for the bundled JSON and the "14" copy.

### Risks

1. **It will mostly be a streak at launch.** On this sample, nobody's loves are cerebral-first enough to lead. If the owner wants it named at launch, take the ungated variant (1 of 21) and accept a looser lane.
2. **Families are uneven.** A lane in a family of its own is close to unreachable (it needs 21% to 57% of loves). That is why it goes in dark. In dark, it competes only with Nihilist, Hardboiled and Midnight Cultist.
3. **Family-wide streak films.** The "led by" films can be dark-side films that are not cerebral (P17, P20). Ship the own-kind fix with the lane.
4. **Older iOS builds** bundle 14 archetypes. They will show the new name from the server without a directory entry or posters until people update.
5. **Launch copy says 14 everywhere,** including the App Store listing. All of it must change in the same release.
6. **Small sample.** 21 profiles, and the 4 with the smallest libraries drive half of the new streaks. Re-run this check on the full base after the norms pass.
7. **Lovestruck is over the ceiling** before and after (29% to 24%). That is separate, and still open from the review.
