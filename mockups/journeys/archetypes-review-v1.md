# Archetype names: final pass (v1, 2026-11-06)

Review only, no app code. Source of truth read from `montage` origin/main:

- `lib/taste/archetypes.ts`: `LABELS` (id, label, blurb) and `LEGACY_LABELS` (old names remapped on display).
- `lib/archetype-info.ts`: `ARCHETYPES` / `STREAKS` (name, tag, description, kind, defining films), mirrored in `ios/Montage/Resources/Archetypes.json`.
- `lib/taste/graph-archetype.ts`: how the name is chosen (v31 lanes, `laneAllowed` fact gates), `IDENTITY_SCORING_VERSION` 53.

Counts: read-only aggregate SELECTs on Supabase `uktamekqqsiijugpaxit`, `public_profiles.result_json->archetype` (21 profiles; `profiles` is empty, `taste_model_v2` rows carry no label). "Streak" = appears 2nd or 3rd in the stored mix (the two the header can name). 21 people is a small sample, so read the counts as a smell test, not a distribution.

A note first: there is **no "Night Owl"** in the app. "The Night Owl" and "The Quiet Devastator" were placeholder names in the taste-model-trust-v1 mock. The real names have no "The" prefix. Watch dates are stored as days (`w`, YYYY-MM-DD), so a time-of-day archetype has no data behind it.

## The 14 archetypes plus one streak

| Name (id) | Tag / one line | Who it captures | Lead | Streak |
|---|---|---|---|---|
| Auteurist (`auteur_devotee`) | Follows directors, not titles. | Director completists, arthouse | 0 | 0 |
| Globetrotter (`world_cinema_wanderer`) | A passport stamped in subtitles. | World cinema, non-English (fact-gated) | 0 | 0 |
| Old Soul (`cinephile_scholar`) | At home in film history. | Classics, pre-1970 (fact-gated) | 0 | 1 |
| Aesthete (`formalist`) | Style is the substance. | Image, edit and sound first | 0 | 0 |
| Nihilist (`nihilist`) | Drawn to the dark and unresolved. | Bleak, ambiguous, morally grey | 2 | 11 |
| Midnight Cultist (`midnight_cultist`) | Horror, cult, and after-dark. | Horror and cult fans | 2 | 0 |
| Hardboiled (`hardboiled`) | Tough, cynical crime stories. | Crime, heists, noir | 3 | 5 |
| Voyager (`stargazer`) | Other worlds, and the journey there. | Fantasy and space adventure | 1 | 4 |
| IMAX Idealist (`blockbuster_maximalist`) | Built for the big screen. | Action, franchises, opening weekend | 4 | 8 |
| Chronicler (`prestige_hound`) | Drawn to the true story. | History, biopic, documentary (fact-gated) | 0 | 1 |
| Tenderhearted (`humanist`) | Moved by people. | Character drama, family, grief | 1 | 2 |
| Animation Devotee (`animation_devotee`) | Devoted to the drawn frame. | Animation and anime (fact-gated) | 1 | 2 |
| Comic Relief (`jester`) | Here for the laugh. | Comedy fans (fact-gated) | 1 | 0 |
| Lovestruck (`romantic`) | In it for the love story. | Romance | 6 | 2 |
| Contrarian (`contrarian`), streak only | Rates against the grain. | Rates against the crowd; never the name | n/a | 0 |

Lead total 21 of 21.

What the counts say (not about names, but worth knowing before naming is frozen):

- **Lovestruck leads 6 of 21 (29%)**, about twice the ~15% ceiling in `docs/ARCHETYPES.md`. Small sample, but check it is not the new Wholehearted.
- **Nihilist is a streak for 11 of 21.** It is the default "dark" colour on most mixes; that dilutes it as a trait.
- **The whole arthouse side has no lead** (Auteurist, Globetrotter, Old Soul, Aesthete, Chronicler: 0 of 21). Partly the user base, partly the fact gates. Not a naming problem.

## Coverage against the full range of viewers

| Viewer | Home today | Verdict |
|---|---|---|
| Casual / mainstream | None by design (Casual and Wholehearted retired at v29 for over-firing); lands on what they over-index on, usually IMAX Idealist or Lovestruck | Fine. Do not bring a "Casual" back; it became everyone. |
| Cinephile / arthouse | Auteurist, Aesthete, Old Soul, Globetrotter | Covered, maybe over-covered |
| Horror | Midnight Cultist | Covered |
| Action / blockbuster | IMAX Idealist | Covered |
| Sci-fi | Voyager (fantasy and space adventure only since v30) | **Gap:** cerebral sci-fi (Arrival, Ex Machina, Primer, Annihilation) has no home |
| Thriller / mystery / twist | Split across Hardboiled, Nihilist, IMAX | **Gap:** the Nolan / Fincher / Villeneuve viewer (Inception, Memento, Prisoners, Gone Girl, Shutter Island) is a big group with no name |
| Animation | Animation Devotee | Covered |
| Comedy | Comic Relief | Covered |
| Romance | Lovestruck | Covered |
| Documentary | Chronicler | Covered (shares with history and biopic; fine) |
| World cinema | Globetrotter | Covered |
| Classics | Old Soul | Covered |
| Crime | Hardboiled | Covered |
| Comfort rewatchers | None | **Gap** (behavioural). The data exists: Letterboxd `rw` flag (6 of 21 profiles, 328 rows) and the app's Rewatch button; the model already reads rewatches (identity v47, v48). |
| Completists | Auteurist covers director completists | Fine |
| Trend followers | IMAX Idealist ("opening weekend") | Fine |
| Night owl / binge | None | No data (dates only, no times). Do not add. |
| Musicals, westerns, war, family | Lovestruck, Chronicler, Hardboiled, Voyager absorb them | Minor; not worth a slot |

## Overlaps and unclear names

- **Nihilist / Midnight Cultist / Hardboiled** sit close (Se7en, Chinatown, The Thing). The names are clearly different, so this is a scoring overlap, not a naming one. Nihilist's streak rate above is the symptom.
- **Auteurist / Aesthete** both read "arthouse craft". Names are distinct enough ("who made it" vs "how it looks"); keep.
- **Comic Relief** can read as "the sidekick", not "loves comedy". The owner picked it on 2026-10-08 and it is warm and plain; keep.
- **Nihilist** is the one name that can sound try-hard or bleak on a share card. It is also accurate and people like it; keep.
- **IMAX Idealist** carries a trademark in a share card. Low risk, flag only.
- **Old Soul**'s code blurb ("canon-focused and at home deep in film history") says "canon", which is jargon; the directory copy is already plainer.

## Proposed edits (light)

Names: **keep all 14 and Contrarian as they are.** Copy only:

1. Old Soul blurb (`LABELS.cinephile_scholar.blurb`): "canon-focused and at home deep in film history" -> "at home with the classics and the films everything since was built on". No rename, no remap needed.
2. Animation Devotee tag: "Devoted to the drawn frame." -> "Animation is the medium, not the genre." The current tag leaves out stop-motion and CG, which the description includes. Optional.
3. Midnight Cultist tag: "Horror, cult, and after-dark." -> "Horror, cult and the after-dark." Optional, only to drop the odd comma; skip if it is not worth a touch.

## Proposed additions (at most 2)

1. **Mind Bender** (content archetype, a new lane). Tag: "Here for the twist." One line: "Puzzle-box films and smart thrillers: the plot that rewires itself, the idea that keeps you up." Captures: Nolan, Fincher and Villeneuve fans and cerebral sci-fi (Inception, Memento, Arrival, Prisoners, Gone Girl, Shutter Island, Ex Machina, Primer). Today they are split over IMAX Idealist, Hardboiled and Nihilist, which is likely part of why Nihilist streaks so often. Risk: it pulls from three lanes, so the centroid needs a clean exemplar list.
2. **Rewatcher** (a streak like Contrarian: never the name, only "with a streak of Rewatcher"). Tag: "Comes back to the ones they love." One line: "You rewatch your favourites like other people play their favourite album." Captures: comfort rewatchers. Behavioural, from the rewatch flag, so it never competes with a taste lane; show only with a real rewatch share (for example 10%+ of logged watches).

Not proposed: a casual/mainstream lead (it over-fired twice), Night Owl (no data), Musical or Western (too small).

## Renaming and adding: impact

Renaming any name:

- **Stored profiles:** `public_profiles.result_json` stores the label string (and the 4-way mix), as do `taste_snapshots.archetype` (183 monthly rows) and `identity_backup_v45`. Every rename needs a `LEGACY_LABELS` entry plus a `LEGACY_BLURB` entry, and an `IDENTITY_SCORING_VERSION` bump so profiles re-save (as v41 did for Comic Relief / Animation Devotee).
- **Copy tables keyed by name:** `lib/archetype-info.ts` (`ARCHETYPES`, `ARCHETYPE_KIND`), `lib/group-names.ts`, `lib/taste-test/probes.ts`, `lib/card-kit.tsx`, `lib/weekly-picks.ts`, `PosterWall`, `InputScreen`, `TheaterRoom`, `scripts/check-invariants.ts`, marketing copy.
- **iOS:** `ios/Montage/Resources/Archetypes.json` and `RoomScreen.swift` ship with the app, so old builds show the old name until updated.
- **Share cards:** cards already shared or screenshotted keep the old name forever; OG images may be cached. This is the main reason to rename nothing now.

Adding an archetype (Mind Bender):

- New id in `ArchetypeId`, `LABELS`, `archetype-info.ts` (tag, desc, kind, 8 defining films), Archetypes.json, group-names, probes.
- Centroid from the defining films (`scripts/persist-archetype-centroids.mjs`); re-derive `CROWD_ENJOYED`; possibly a `laneAllowed` gate (Thriller / Mystery / Science Fiction genre).
- Identity version bump: **some people's names will change** (mostly IMAX Idealist, Hardboiled and Nihilist leads). Say so in the release; the "Your read got sharper. You were X." moment covers it.

Adding the Rewatcher streak: one id, one label, a streak rule beside Contrarian's (never the lead), no centroid, no lane. Lower risk, no one's name changes.
