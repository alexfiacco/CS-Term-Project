# Montage: the change plan for the next build

2026-11-12. A reply to the owner's notes on `fable-final-audit.md`, then every change I think is necessary, with the places to change.

Read-only. Nothing in `/home/user/montage` was edited. Code was read at `0fb885cd` (15 commits after the audit's `05fda487`; the why line, Pitch and the landing moved in between, and this plan accounts for that). The time-split report says three match fixes went in after that, at `33686382` (rules 1545 and 1546). My checkout does not have that commit, so I describe those from the report and did not read their code. Supabase `uktamekqqsiijugpaxit` was read with SELECT only; people appear as counts or hash prefixes.

Sources added since the audit: `match-calibration-5star.md`, `match-time-split.md`, `pitch-battery.md`, `b38-onboarding-fable.png`.

Three things I could not do, said up front:

- `match-time-split.md` was finished while I was writing. Part 4 is written from its results. I did not rerun it.
- I cannot run the archetype rescore or the match evals (they need the service key). For those I give the script, the bar and the count I could read from stored profiles.
- All 23 stored profiles read as English-home (no member has more than 6% of their rated films in any one other language). So nothing about Indian-language viewers can be validated on our own data yet. It has to be tested with recruited raters.

Mocks made for this plan (same folder, built from `b39-next-build.html` by `b39-render.js`):

| File | Shows |
|---|---|
| `b39-home-language.png` | Superseded by v2 below |
| `b39-unlocks.png` | Superseded by v2 below |
| `b39-archetype-names.png` | The reveal's grammar ("You're an Overthinker"), the changed directory lines, the three candidates to replace IMAX Idealist |
| `b39-match-honesty.png` | "Early read, from 18 films", words with no digits for a thin profile's weak fit, a rated film showing what we'd have said |

Revised after the owner's notes on the first set (2026-11-12). Where a v2 exists it replaces the first file:

| File | Shows |
|---|---|
| `b39-home-language-v2.png` | Two plain questions, "Languages you watch in" and "Where you're based"; the country list; "Where do you watch?" outside the US with no theaters row |
| `b39-unlocks-v2.png` | The profile at 18 rated with its header intact, the ladder as the drawer of the row where Sharpen sits, the unlock moment, the row after 30 |
| `b39-post-watch-v2.png` | "What did we miss?", "What did you like?" and "What didn't work?" with chips built from that film; "What we've learned" in Tune for you |

Already mocked and not redone: the shorter onboarding (`b38-onboarding-fable.png`), dropping "cinema" from archetype (`archetypes-page-v1.png`, shipped as rule 1271), Pitch notes (`b37-pitch-followups.png`).

---

## Part 1. Replies to the owner

### 1. "We have to know the home language, where they're based, what their lane is, where they're from."

Agreed on the goal. I would collect it as **two asked values and two derived ones**, and I disagree with asking the fourth as its own question.

| What | How we get it | Asked? |
|---|---|---|
| Home languages (one or more) | Preselected from the phone's preferred languages and region, shown as chips on "Rate films you love", confirmed or changed by the person | Asked, one tap |
| Where they're based (country) | The phone's region on iPhone, the request's country on web; shown, changeable. It is the same value "Where do you watch?" already stores as `viewingPrefs.region` | Shown and confirmed, not typed |
| Their lane | Read from what they rate: the archetype, the taste lanes (`lib/taste/own-lanes.ts`) and the film culture of their loved films | Never asked |
| Where they're from | Carried by the home languages. A Telugu speaker in New Jersey picks Telugu and is based in the US; that pair is everything the product needs | **Not asked** |

Why not ask "Where are you from?": it is a question about national origin, which people rightly treat as more personal than a film preference, and it buys nothing the languages do not already give. Every use I can find for it (which shelf to show, what counts as "home" for Globetrotter, which language lean to learn) is answered better by languages, because cinema divides by language, not by passport. If you still want it, add it later as an optional row in Settings; do not put it in the first run.

On TMDB popularity for Telugu and the others: agreed, with one adjustment. TMDB's popularity figure is a short-term number that favors this month's releases. Use it together with TMDB vote count, so a shelf holds Baahubali and Magadheera as well as last Friday's release. Details in Part 3.

### 2. "Hardboiled → Mastermind? Wouldn't everyone want to be a mastermind? Isn't that too cool?"

One correction first: Mastermind was my fallback for **Overthinker**, not for Hardboiled. Hardboiled keeps its name in both the audit and this plan.

On the point itself: **you are right, and I withdraw Mastermind.** Here is the test I should have applied.

A good archetype name describes a habit. A bad one awards a rank. "Mastermind" says "smarter than the others", and the moment one name in a set is a rank, the other fourteen become "not the smart one". It also fails a simpler check: *would someone who does not watch these films still want the name?* For Mastermind, yes, everyone would. A name anyone would take tells the person nothing about themselves, which is the horoscope problem. It is also wrong on the facts: in a puzzle film the mastermind is the character; the viewer is the one being fooled and loving it.

Overthinker passes the same test. Nobody who dislikes puzzle films wants to be called an overthinker. People who love them say it about themselves, with a smile. The small sting is what makes it believable and worth sharing. **Keep Overthinker. Change only its line to "You leave with a theory."** If you ever do change it, the fallback is now **Theorist** (plain, accurate, no rank). The whole list goes through this test in Part 5.

### 3. "A lot of changes for match score, and fix certain things for archetypes."

Agreed. Part 4 is the match plan and Part 5 the archetypes. Three things you should know before reading it:

- **Two of the fixes are already in** (the share cap made safe, and the honest number on a rated film on web). A third (each person's own display curve) is built and switched off, waiting for you.
- **None of them meets your bar** that 5-star films should generally show 85% or more. On films a person rated later, 43% of 5-star films showed 85%+ before, 44% now, 49% with the curve on.
- **The largest lever is a decision of yours, not a bug.** The rule that forces "personal taste dominates, film quality is a nudge" (rule 1488) costs about 13 of those points and makes the ranking worse. With it off: 57%, and 62% with the curve. That is decision 1 in Part 10.

### 4. "TV is not out of scope. TV is coming soon."

Understood, and I was wrong to set it aside. Every change below carries a TV-readiness note, and Part 9 is the TV prep itself. The short version of what TV changes in this plan:

- **IMAX Idealist stays** (owner decision, 2026-11-12). A backup name is kept on file in A6 in case the trademark or shows ever force the question.
- New archetype lines avoid the word "films" where they can.
- New fields and tables are keyed so a show fits without a migration (`media_type` already exists on `films`, with 139 TV rows).
- No new feature name in this plan contains "film". I do not propose renaming Film DNA now; see 9.4 for the decision you will face at TV launch.

### 5. Canon as all-time favorites

Good. Nothing to change in the name. The one-line gloss "Your all-time favorites" stays on first sight (it sits on the Canon section's first open, rule 1397). TV note: the gloss has no "film" in it, so it holds.

### 6. "What do you mean Pitch doesn't name what it does? What else would you name it?"

**I drop the point. Keep Pitch.** You are right on both counts.

What I got wrong: I treated the feature's name and the field's hint as one thing. A feature needs a short name you can put on a button and say out loud. "Describe what you want to watch" is a hint, not a name, and the app already shows it as a hint: the web field reads "Pitch: describe the film you want" (`Recut.tsx:259`) and the iPhone reads "Pitch · say or type what you want" (`MontageApp.swift:814`). So the thing I asked for exists.

Why Pitch is the right name:

- One word, and it is a verb. "Pitch it" and "Pitch this instead" work as buttons.
- It belongs to film. You pitch an idea and get a film back. It is the only feature name in the app that is film-industry language and still plain English.
- It survives TV untouched. Shows are pitched too.
- Nobody else uses it.

For completeness, the one-word alternatives I weighed and why each loses:

| Name | Verdict |
|---|---|
| Ask | Clearest, but generic. Every app has an Ask. No character. |
| Scout | Good film word, but it says the app goes looking, not that you describe something. |
| Cue | Short and theatrical, but means nothing until explained. |
| Brief | Accurate, sounds like work. |
| Wish | Friendly, but promises magic and reads childish beside Bodoni. |
| Casting | Film word, wrong meaning. |

**Verdict: Pitch.** Two small things remain, neither a rename: keep the hint beside the name wherever a new person first meets it, and change the one label that says "Pitch a film" (`Recut.tsx:1091`, `Recut.swift:1573`) to "Pitch" before shows arrive.

### 7. Progressive disclosure, and steps that unlock things

Agreed. Part 7 has the ladder and `b39-unlocks-v2.png` shows it, in the row where Sharpen your profile sits today.

### 8. Triangulating is good

Noted, with one conflict to settle. Since the audit, rule 1542 banned "If you loved X" as a formula and capped films named in the why line at about a third of lines. Triangulation as I wrote it ("You loved Whiplash and Black Swan. This has...") would name two films in most lines, against that rule. Part 6 keeps the triangulation as **evidence** (an aspect counts for more when two or three of their loved films share it) and lets the wording stay varied, so both hold.

---

## Part 2. Onboarding

The shorter flow itself is in `b38-onboarding-fable.png` and section 1.6 of the audit. This part lists the code changes and adds language and country.

### O1. Home languages and country (new)

**What (revised to the owner's note: the easiest possible).** Two plain questions at the top of "Rate films you love", both already answered from the phone (`b39-home-language-v2.png`, frame 1):

- **Languages you watch in**: chips, more than one allowed, preselected.
- **Where you're based**: one country chip, preselected; a tap opens a plain list with search (frame 2).

There is nothing to do if both are right. The earlier "Films in India · Change" line is gone; it read as one muddled thing. There is no "where are you from" question. Each selected language other than English adds one row on top ("Popular in Telugu"). The same two values live in Settings as "Languages and region".

**How it is inferred.**

- iPhone: `Locale.preferredLanguages` (every language the person added to the phone, in order) and `Locale.current.region`. A phone set to English with Telugu added second preselects English and Telugu.
- Web: `navigator.languages` and the request's country header (`x-vercel-ip-country`, already read in 15 routes).
- Country to languages, used only to **order** the unselected chips, never to select one: India puts Hindi, Telugu, Tamil, Malayalam, Kannada, Bengali, Marathi first; Korea puts Korean first; and so on. A person in India with an English-only phone sees English selected and the Indian languages first in the row, unselected.
- After 15 ratings, a quiet check: if eight or more of their rated films are in one language they did not pick, offer it once ("Add Tamil to your languages?"). Never added silently.

**Privacy.**

- Country only. No city, no coordinates. (Theaters already ask for location separately, when used.)
- Nothing is stored until the person leaves the rate screen, which is the confirmation. For a guest it stays on the device with the rest of the guest state.
- Stored in private preferences only. `viewingPrefs` is already stripped from every public payload (`lib/public-profile.ts:556`); add a check that it stays so.
- Never on the profile, a share card, Blend, or anything a friend sees. Never sent to PostHog as a property; count it in aggregate only.
- App Store privacy label: declare coarse location (country) as used for app functionality, linked to the account, not used for tracking. Add one sentence to the privacy policy.
- Delete-account already removes the profile row, which holds it.

**Where stored.** No schema change. Two new keys in `public_profiles.result_json.viewingPrefs`:

```ts
// lib/viewing-prefs.ts, in ViewingPrefs
/** Languages the person calls home, ISO 639-1, "en" included when chosen. Absent: not asked yet. */
homeLanguages?: string[];
/** How homeLanguages was set: "asked" (they confirmed or changed it) or "guessed" (preselect, never confirmed). */
homeLanguagesFrom?: "asked" | "guessed";
```

`region` already exists there. `homeLanguages` is **not** the same as the existing `languages` (which filters what picks may suggest). Home languages add and explain; they never filter.

**Places.**

| Where | Change |
|---|---|
| `lib/viewing-prefs.ts` | The two keys; a `homeLanguagesOf(prefs)` reader that returns `["en"]` when absent, so every caller has one default |
| `app/api/viewing-prefs/route.ts` | Accept and validate `homeLanguages` against `LANGUAGE_OPTIONS` + `MORE_LANGUAGE_OPTIONS` |
| `app/api/start-films/route.ts` | Take `?langs=te,hi`; one row per language from the shelf query in C3; keep the day's cache keyed by the language set |
| `app/_components/LovedStart.tsx` | The chip row, the rows, the sheet |
| `ios/.../Onboarding/LovedStartScreen.swift` | The same; preselect from `Locale` |
| `app/_components/AccountScreen.tsx`, `ios/.../Account/AccountScreens.swift` | "Languages and region" in Settings (rule 613 covers the chip drawers there) |
| `lib/taste-test/probes.ts`, `app/api/probes`, `app/api/deck-order` | The deck top-up mixes in cards from the home languages after the seed cards |
| Guest state: `ios/.../Core/Guest.swift`, web guest storage | Carry the value until the account exists |

**Rules to amend.** 992 (the rows of "Rate films you love" gain language rows and the chip line), 613 (Settings languages), 1417 (the "Subtitled films" skip chip reads "Films outside your languages" once home languages are set).

**Risk.** Low. The main one is a wrong preselect, which is why it is shown and one tap to fix. Second: a row with too few good films looks worse than no row, so a language shows its row only when it has 18 ready films (C3).

**Test.** (1) Unit: preselect table for eight locale and region pairs, including English-only phone in India, Telugu-first phone in the US, Spanish phone in Mexico. (2) `check-invariants`: `homeLanguages` never appears in the public profile payload, the card payloads or the Blend payload. (3) Five recruited raters whose first language is Telugu, Tamil or Hindi complete the flow; bar: all five reach 15 ratings in under four minutes and at least four rate five or more films from their language row. (4) Funnel event per screen exists before and after (O6).

**Parity.** Same chips, same sheet, same stored keys. The preselect source differs (phone settings against browser and request); the stored shape does not.

**TV-ready.** Languages apply to shows unchanged. The row API takes `kind` beside `langs` from the start (`?kind=movie` today), so "Popular shows in Telugu" is a parameter, not a new route.

### O2. One setup step after the reveal, in the right order

**What.** As `b38` frames 8 to 10: save (handle as an editable chip on the same drawer), then "Where do you watch?" with theaters as a collapsed row, then a four-card tour that can be skipped. "Anything you'd rather skip?" leaves the first run and is offered after the first "Not for me". The import path asks its two preference screens after its reveal, not before.

**Outside the US (owner, 2026-11-12).** The theater chains we hold are US only, so the "Go to theaters too?" row is hidden when the country is not the US, in onboarding and in Settings' "Your theaters" (`b39-home-language-v2.png`, frame 3). The six service tiles come from that country's own provider list (TMDB's watch providers for the region, which `app/api/watch-services` already reads by region), ordered by how many catalog films each carries there. Changing the country redraws the tiles. If a person later moves the country to the US, the theaters row appears. Places for this: `lib/film-watch.ts` (`REGIONS`, `regionOf`), `app/api/watch-services/route.ts`, `app/api/theaters`, `Theaters.tsx` (`YourTheaters`), `ios/.../Tonight/ServicesPicker.swift`, `ios/.../Design/Theaters.swift`. Rules to amend: 1519, 1520, 1533. Also hide "In theaters near you" in Pitch (rule 1530) and the Picks theater tab outside the US, or they will promise what we cannot show. Test: the step rendered for US, IN, GB, MX and JP shows a full set of that country's services and a theaters row only for US.

**Places.** Web `app/_components/HomeShell.tsx` (the step order), `TonightServices.tsx` (`ServicesStep`), `SkipChips.tsx` (`SkipStep`), `WelcomeTour.tsx` (`TOUR_VERSION` 9 to 10), `HandlePicker.tsx`, `GuestSave.tsx`. iPhone `OnboardingFlow.swift` (`importPrefs` and the phase order), `HandleScreen.swift`, `SkipStep.swift`, `WelcomeTour.swift`, `MontageApp.swift` (MainShell's first-run gates), `Tonight/ServicesPicker.swift`.

**Rules to amend.** 582 (the walkthrough: four cards, Skip always shown, kept in the menu as "How Montage works"), 1417 (skip step moves out of the first run), 1439 (import path order), 1520 (theaters collapsed in onboarding), 1521 (a returning account on a new phone: services only, no tour).

**Risk.** Medium, because the first run is the most-tested path and iPhone and web differ in small ways. Fewer people will set skip preferences; the model already learns the same thing from "Not for me" (rule 1417's soft demotion).

**Test.** Fresh-account walk on both platforms for four entry points (find your taste, import, invited link, existing account on a new phone); count screens between the reveal and Picks (bar: four or fewer, was about ten). Funnel: reveal-to-first-Picks completion, compared with the build before.

**TV-ready.** "Where do you watch?" matters more for shows than films. Nothing to redo.

### O3. The reveal in three beats, with the proof and one check

**What.** `b38` frames 4 to 7: the stack, the name alone, the proof (*Because you loved* and their films), "Does this feel right?", then picks, the bold line, "Challenge a friend". All three picks shown; the list is what the account unlocks.

**Places.** Web `LockedIdentity.tsx`, `lib/taste/reveal-pattern.ts`, `lib/taste/hot-take.ts`, `lib/type-card.tsx` and `lib/card-kit.tsx` (the card built from their own posters), `ShareTypeSheet.tsx`. iPhone `RevealScreen.swift`, `RevealShare.swift`. The check writes one row to `events` (`reveal_check`, metadata `{answer, archetype}`).

**Rules to amend.** 585, 595, 1344 (the one archetype card), 853 stays (nothing of the taste before 15).

**Risk.** Low for the staging. The bold line can sting; `hot-take.ts` needs a rule that it never compares against a film the person rated 4.5 or more.

**Test.** The reveal for six stored profiles renders all three beats with real films; the hot take is absent when no safe pair exists. After two weeks: share of "Spot on" answers (bar: 70% or more; under that, the archetype read is the problem, not the staging).

**TV-ready.** "Reading your 18 films." becomes a count noun from one helper (T3). The card layout holds for show posters (same 2:3).

### O4. No second rating interface for someone already at 15

**What.** The deck opens only for people under 15, with cards from their home languages mixed in.

**Places.** `HomeShell.tsx` and `OnboardingFlow.swift` (skip `TasteTest` / `TasteDeckScreen` at 15), `lib/taste-test/probes.ts`.

**Risk.** Low. **Test.** A grid-only run to 15 goes straight to the reveal on both platforms.

### O5. Welcome says the cost

"Takes about two minutes." under the button (`InputScreen.tsx`, `WelcomeScreen.swift`).

**Tilted posters stay on the welcome and the landing; the taste deck stays straight (owner, 2026-11-12).** The tilt is the welcome's character and should be done well, not removed: one angle for the whole wall (about 6 degrees, as `b38` frame 1), posters on the 8 grid with even gaps, the wall bleeding off all four edges so no poster edge is cut mid-air, a top and bottom fade so the wordmark and the headline sit on clean ground, and no poster under the headline brighter than 50%. The wall's films should be recognisable at a glance and, once O1 is in, include two or three from the person's languages. The deck's cards are upright with no rotation, because that screen is for reading a title and tapping stars. Places: `PosterWall.tsx`, `ios/.../Onboarding/PosterWall.swift`, the landing hero; `TasteTest.tsx` and `TasteDeckScreen.swift` keep zero rotation, with a line in `check-invariants` so a later restyle does not tilt the deck.

### O7. Deck swaps and a better seed (from `onboarding-deck-check.md`)

That check found every card model-ready but only a third clearly informative (96 of 293): widely seen, rated differently by different people, and far from the middle on the Film DNA strands. The deck is 293 cards, not 298 as my audit said. Three weak spots: 57 cards few people have seen (mostly world films and pre-1970 classics, sitting at position 200 or later), consensus classics that nobody splits on, and near-duplicate pairs.

**The seed (the first 15, rule 213).** Six changes; the rule's own conditions still hold (one card per archetype, eight from before 2000, three from before 1980, a subtitled film inside the first dozen):

| Seat | Out | In | Why |
|---|---|---|---|
| Lovestruck | La La Land | **Titanic** | Splits people more; emotional realism 89 against 66 |
| Nihilist | Se7en | **Fight Club** | Se7en sits almost on top of No Country for Old Men; Fight Club is the most logged card |
| IMAX Idealist | The Dark Knight | **Top Gun: Maverick** | The Dark Knight is loved by nearly everyone, so it tells little; Maverick is a low-originality contrast |
| Aesthete | Drive | **2001: A Space Odyssey** | The only seed card that reads slow burn; today 0 of 15 seed cards do, so a patient-cinema viewer gets no early read |
| Eyewitness | The Social Network | **Oppenheimer** | The Social Network duplicates 12 Angry Men in strand space |
| Tenderhearted | Good Will Hunting | **Forrest Gump** | Consensus favourite out |

Order: Inception first (it was fifth), then Superbad, Titanic, Pulp Fiction, Spirited Away, Fight Club, Top Gun: Maverick, 2001, Star Wars, 12 Angry Men, Parasite, The Shining, Oppenheimer, Forrest Gump, The Grand Budapest Hotel. The most informative and most seen come first because the deck starts adapting at the fifth rating. The six dropped cards stay in the deck as ordinary cards.

**Ten swaps in the body of the deck.** Each incoming film has 3 to 20 times the logs and fills the same seat:

| Out | In |
|---|---|
| Hero | Akira |
| Only God Forgives | The Platform |
| The Lives of Others | Society of the Snow |
| The Assassination of Jesse James | Blade Runner |
| A Separation | I'm Still Here |
| Wild Tales | No Other Choice |
| The Secret in Their Eyes | Once Upon a Time in Hollywood |
| Crouching Tiger, Hidden Dragon | The Boy and the Heron |
| To Kill a Mockingbird | The Sound of Music |
| Sunset Boulevard | Rosemary's Baby |

**Also.** Move the second card of each near-duplicate pair late (12 Years a Slave, Shrek 2, Suspiria, Chinatown and the rest listed in the check). Keep the consensus classics as recognisable anchors but never in the seed. The check agrees with O1: the shared deck cannot serve Indian viewers (2 Indian cards, both late), so the home-language rows carry that, and the deck can stay balanced across archetypes.

**One thing I would add to the check.** These swaps are judged on 23 libraries, 9 of them large. Before shipping the new seed, confirm it against the archetype read: run `scripts/quiz-personas.ts` on the old and new seed for the stored profiles. Bar: at least as many profiles keep their full-library archetype from the first 30 cards as today (8 of 14 in the last check, rule 595).

**Places.** `lib/taste-test/probes.ts` (the seed order and the cards), `lib/taste-test/probe-archetypes.json` (rebake with `npx tsx scripts/quiz-personas.ts probe-arch`), `lib/taste-test/probe-posters.json`, `app/api/seed-probes`, the iPhone's bundled copy of the deck (`TasteDeckModel.swift`), then `npx tsx scripts/check-probes.ts`.

**Rules to amend.** 213 (the seed list), 595.

**Members whose archetype changes: 0.** The deck changes what new people are asked, not how stored ratings are read. **Risk.** Low. Friends who took the old seed share fewer first cards with newcomers, which matters only for very thin Blends.

**TV-ready.** A show deck will need its own seed built by the same three tests (seen widely, splits people, far from the middle).

### O6. One event per onboarding screen

**What.** Confirm or add one PostHog event per screen from welcome to the first Picks view, with the same names on web and iPhone, before O2 ships. I could not read PostHog; `public.events` holds only `search_miss`.

**Places.** `app/_components/Analytics.tsx`, `app/api/app-events`, the iPhone's analytics calls in `OnboardingFlow.swift`.

**Why it is first in the build order.** Without it, none of the onboarding changes can be judged.

---

## Part 3. Catalog backfill

### What is there today (films, not shows; duplicates excluded)

"Ready" means the film has both an embedding and labels, so a rating of it teaches the model something.

| Language | In catalog | Ready | Of the top 150 by TMDB popularity, ready | With 50+ TMDB votes | Of those, ready |
|---|---|---|---|---|---|
| Hindi | 1,590 | 394 | 83 | 97 | 58 |
| Tamil | 504 | 56 | 34 | 29 | 21 |
| Telugu | 288 | 28 | 24 | 14 | 10 |
| Malayalam | 268 | 16 | 14 | 8 | 5 |
| Bengali | 47 | 8 | 8 | 4 | 4 |
| Kannada | 30 | 6 | 6 | 4 | 3 |
| Marathi | 10 | 1 | 1 | 1 | 1 |
| Punjabi | 7 | 0 | 0 | 0 | 0 |
| Korean | 1,415 | 396 | 106 | 104 | 67 |
| Japanese | 3,342 | 1,006 | 117 | 226 | 189 |
| Spanish | 3,612 | 820 | 82 | 280 | 139 |
| French | 6,262 | 2,286 | 130 | 492 | 283 |

Two different gaps: films we hold but never embedded or labelled (most of Hindi and Tamil), and films we do not hold at all (most of Telugu, Kannada, Bengali, Marathi, Punjabi; TMDB lists thousands of Telugu films and we hold 288).

### C1. Make ready what we already hold

**What.** Embed and label every held film in the eight Indian languages, and the top 300 by TMDB popularity in Korean, Japanese, Spanish, French that are not ready.

**Counts.** Hindi about 1,200, Tamil 450, Telugu 260, Malayalam 250, the rest about 80; plus about 250 across the four others. About **2,500 films**.

**How.** The existing scripts, pointed at a language: `scripts/embed-films.mjs` (OpenAI `text-embedding-3-small`) and `scripts/label-backlog.mts` (the Message Batches path, half price). Both need a `--lang` filter; today `label-backlog.mts` picks by a Letterboxd log band (`--min`, `--max`), which is exactly what undercounts these films.

The owner runs this to see the list first:

```sql
-- Films held but not ready, per language, in the order they should be done.
select f.original_language, f.letterboxd_slug, f.title, f.year, f.tmdb_popularity,
       (f.raw_tmdb->>'vote_count')::int as tmdb_votes,
       f.embedding is not null as has_embedding, fl.slug is not null as has_labels
from films f
left join film_labels fl on fl.slug = f.letterboxd_slug
where f.duplicate_of is null
  and (f.media_type is null or f.media_type = 'movie')
  and f.original_language in ('hi','te','ta','ml','kn','bn','mr','pa')
  and f.overview is not null and f.poster_url is not null
  and (f.embedding is null or fl.slug is null)
order by f.original_language, coalesce((f.raw_tmdb->>'vote_count')::int, 0) desc, f.tmdb_popularity desc nulls last;
```

### C2. Bring in what we do not hold

**What.** For each language, pull from TMDB discover (`with_original_language=<code>`), **two lists merged**: the top N by `vote_count.desc` (the films people know) and the top N by `popularity.desc` with at least 20 votes (what is current). Skip anything under 60 minutes, without a poster or an overview, or adult. Store with the slug `tmdb-<id>`, as `lib/filmography.ts` already does for films Letterboxd lacks.

**Targets (total held and ready after the run).**

| Language | Target | New rows, about |
|---|---|---|
| Hindi | 1,600 | 0 to 100 |
| Telugu | 600 | 320 |
| Tamil | 600 | 100 |
| Malayalam | 400 | 130 |
| Kannada | 250 | 220 |
| Bengali | 200 | 150 |
| Marathi | 150 | 140 |
| Punjabi | 100 | 95 |

About **1,200 new films**. These are targets, not measurements: how many pass the filters is only known when the script runs with `--dry-run`. If Kannada yields 150 clean films, 150 is the number.

**Places.** `scripts/ingest-tmdb.mjs` already does the whole job for "most-voted films overall" and writes to `film_ingest_staging`. It needs three flags: `--lang`, `--sort popularity|votes|both`, `--kind movie` (so the same script takes `tv` later). Then the usual promote step from staging.

**Risk.**

- **Crowd rating.** These films have few or no Letterboxd logs, so `letterboxd_avg_rating` is empty or thin. The match model's crowd term reads it. The model already treats an unlabelled or uncrowded film as neutral (rule 1489), but a whole language of neutral crowd scores means matches for those films rest on likeness alone. Fill `tmdb_vote_average` (already a column) and let the crowd feature fall back to it, rescaled, when Letterboxd has under 200 logs. That is a model input change, so it goes through the match bars (M6).
- **Duplicates.** A film can exist under a Letterboxd slug and arrive again as `tmdb-<id>`. The ingest dedupes by `tmdb_id`; run `scripts/mark-duplicate-films.mjs` after.
- **Label quality.** Labels for films the labeller knows less well come back with lower confidence. Keep the existing rule that labels under confidence 50 do not feed the why line.

### C3. The shelf rule

A language's row on "Rate films you love" shows when it has **18 ready films with 50 or more TMDB votes**. The row is the top by TMDB vote count, with at most six from the last three years, so it mixes the classics and the current.

```sql
-- The "Popular in <language>" row. :lang is one code.
select letterboxd_slug, title, year, poster_url
from (
  select f.letterboxd_slug, f.title, f.year, f.poster_url,
         (f.raw_tmdb->>'vote_count')::int as votes,
         row_number() over (partition by (f.year >= extract(year from now())::int - 2)
                            order by (f.raw_tmdb->>'vote_count')::int desc) as rk_in_era,
         (f.year >= extract(year from now())::int - 2) as recent
  from films f
  join film_labels fl on fl.slug = f.letterboxd_slug
  where f.original_language = :lang
    and f.duplicate_of is null and (f.media_type is null or f.media_type = 'movie')
    and f.embedding is not null and f.poster_url is not null
    and coalesce((f.raw_tmdb->>'vote_count')::int, 0) >= 50
) t
where (recent and rk_in_era <= 6) or (not recent and rk_in_era <= 18)
order by votes desc
limit 18;
```

Today Hindi, Korean, Japanese, Spanish and French pass. Tamil passes narrowly (21). Telugu (10), Malayalam (5), Kannada (3) and Bengali (4) do not, which is why C1 and C2 come before O1 turns their chips on.

### Cost

| Step | Films | Unit cost | Total |
|---|---|---|---|
| Embeddings (`text-embedding-3-small`, about 400 tokens a film) | 3,700 | about $0.00001 | under $0.10 |
| Labels (batch; the last run was about $25 for 7,800 films) | 3,700 | about $0.0032 | about **$12** |
| TMDB calls | 1,200 details | free | $0 |

Call it **under $15**, and an evening of batch time. The nightly full pass picks the new films up on its own (the score catalog is rebuilt from ready films).

**Test.** After the run: the table at the top of this part, re-run; every one of the eight languages at or over its shelf threshold or reported as short. Spot-read 20 labels per language against the films (bar: 17 of 20 have a hook that is true and a tone a fan would accept). Search for ten well-known titles per language returns each one.

**TV-ready.** `--kind tv` on the same ingest script, the same labeller and the same shelf query with `media_type = 'tv'` is the whole TV catalog job. Roughly the same cost again for a first 4,000 shows.

---

## Part 4. Match score

### Where it stands after the time-split test

The test trained on each person's earlier ratings and predicted their later ones (19 accounts, 1,059 later films, 79 of them 5 stars). Its bars were written before any result.

| | Order of later films (Spearman per person) | Top 10 rated 4.5+ | 5-star films shown 85%+ | Status |
|---|---|---|---|---|
| Before | 0.373 | 43% | 43% | |
| Share cap made safe | 0.400 | 42% | 44% | **Shipped** (`33686382`, rules 1545, 1546) |
| Honest number on a rated film, web | no forward change | | | **Shipped** |
| Each person's own curve | 0.400 | 42% | 49% | **Built, switched off** (`MATCH_PERSONAL_CURVE=on`) |
| No share cap at all | 0.451 | 49% | 57% | Measured, not changed |
| No share cap, with the curve | 0.451 | 49% | **62%** | Measured, not changed |

Three honest readings:

1. Predicting the next film is harder than the earlier reports suggested. For accounts with 100 or more ratings the order quality is 0.47 on later films against 0.58 on a random hold-out. The audit's accuracy table used random hold-outs and so read high.
2. The sample is small. Most of the intervals on "5 stars at 85%+" are 30 to 40 points wide.
3. With order quality near 0.45, no display curve can put most 5-star films at 85% without also putting many 3.5-star films there. The bar is reached by ranking better, which means more and better evidence about each person, not by stretching the scale.

### M0. The share cap: the decision that moves the most (owner)

**What rule 1488 does, in plain words.** A match score is built from four kinds of evidence:

| Signal | What it is |
|---|---|
| Similar films | How you rated the films most like this one |
| Film DNA | How this film's genre, director, decade and traits line up with what you rate highly |
| Crowd | How well viewers in general rate it |
| Other | Small extras, such as its language |

Left alone, the model works out for each person how much each signal should count, from whatever predicts that person's own ratings best. For the owner it gave the crowd the largest weight. Rule 1488 (2026-11-10, "personal taste dominates, film quality is a nudge"; recorded as a product decision, not a tuned value) overrides that: after the fit, the crowd may account for at most 20% of what moves a score and "other" at most 5%, and whatever is taken away is handed to similar films and Film DNA, toward 42% and 33%. Since `33686382` it applies only from 100 rated films.

**What the shares are with the cap, and without it.** I reran the time split's main test (each person's earlier ratings predicting their later ones) with the cap as shipped, with no cap, and with three middle settings. The script is `share-cap-middle.mjs` in this folder; it imports the production model code and the same read-only dump, and it reproduces the report's own numbers for the two settings the report has (0.400 and 44%; 0.451 and 57%). Shares are each signal's part of what moves the score across a person's own rated films; "range" is the lowest and highest account.

| Setting | Similar films | Film DNA | Crowd | Other |
|---|---|---|---|---|
| **Cap as shipped**, accounts with 100+ rated (12) | 45% (41 to 48) | 35% (33 to 41) | 20% (15 to 22) | 0% (0 to 5) |
| Cap as shipped, accounts under 100 (10; the cap does not apply to them) | 40% (28 to 71) | 24% (7 to 32) | 36% (17 to 48) | 0% (0 to 2) |
| **No cap**, 100+ rated | 35% (23 to 48) | 27% (19 to 39) | **42% (17 to 55)** | 0% (0 to 7) |
| No cap, under 100 | 39% (26 to 69) | 20% (5 to 28) | 44% (22 to 55) | 0% (0 to 2) |
| No cap, the fit across everyone | 47% | 27% | 26% | 0% |

Two things stand out. With no cap the crowd's share roughly doubles for established accounts, to about 42%. And personal taste still does most of the work: similar films and Film DNA together are 58% to 62% for the typical account. The crowd passes half on only the most crowd-driven account (55%).

**What each setting does to prediction.** Later films, 19 accounts, 79 of them rated 5 stars.

| Setting | Order of later films, all | Accounts with 100+ rated | Top 10 rated 4.5+ | 5-star films at 85%+ | With the personal curve | Scores track the crowd average (median account) |
|---|---|---|---|---|---|---|
| Cap as shipped (crowd 20%) | 0.400 | 0.467 | 41% | 44% | 49% | 0.77 |
| Crowd capped at 30% | 0.433 | 0.522 | 46% | 51% | 57% | 0.84 |
| Crowd capped at 35% | 0.441 | 0.534 | 48% | 54% | 58% | 0.85 |
| Crowd capped at 40% | 0.447 | 0.545 | 48% | 57% | 61% | 0.85 |
| **No cap** | **0.451** | **0.551** | 48% | **57%** | **62%** | 0.85 |

How to read it:

- The whole gain is in accounts with 100 or more ratings (0.467 to 0.551). Thin accounts do not change, because the cap no longer applies to them.
- The middle settings land in between, in order. A 35% cap gets about four fifths of the gain in ranking and two thirds of the gain in 5-star films.
- The last column is the cost. It is how closely a person's scores follow the Letterboxd average across the films everyone is scored against (1 would mean everyone gets the same list, the best-reviewed films in order). It rises from 0.77 to about 0.85 with **any** loosening, and the middle settings do not buy it back. So a middle cap gives up accuracy without making lists more personal. That makes the real choice two-way: the cap as it is, or off.
- Middle setting, as I defined it: the crowd held to the stated share, "other" to 5%, and what is freed given to similar films and Film DNA in proportion to what they already have (no 42 and 33 targets), no group more than doubled, per person only from 100 rated films.

**My recommendation: turn it off.** It predicts what people rate next clearly better, and the intent of the rule survives in the plain sense: personal signals still carry about 60% of every score. Then honor the rest of the intent where it does not cost accuracy:

- The why line and the Your match drawer lead with the taste reasons and say "widely loved" only when nothing else is true (W2).
- Variety is handled where lists are built, not in the score: the series cap and one-per-lane spacing in Picks (M7), so two people's Picks differ even when their top scores overlap.

If the sameness of lists matters more to you than the accuracy, keep the cap. I would not choose a middle.

**Caveats.** Nineteen accounts; twelve with 100 or more ratings; 79 five-star films. The intervals on "5 stars at 85%+" are 30 to 40 points wide, so 54% against 57% is not a real difference, though 44% against 57% is consistent across every split in the report. The share figures are for the training part of each account (about 80% of its ratings).

**Places.** One environment variable, `MATCH_V9_SHARES=off` (`match-model.mjs:64`), then the nightly pass refits and rescores everyone. If kept off for good: remove `constrainShares` from `v3FitUser` and the population fit, bump `MODEL_VERSION`, change `POPULATION_KEY`.

**Rules to amend.** 1488 (withdrawn), 1545 (the safe cap then has nothing to guard), 1487 stays. A `docs/DATA-SCIENCE-LOG.md` entry.

**Risk.** Every established account's list moves on the day, toward films the crowd rates highly.

**Test.** Run. Before switching: rerun on the day's data; bars: order per person up with the interval clear of zero, bands still in order, 5-star films at 85%+ up. After switching: no weight above 10; the track-the-crowd figure reported per account.

**Parity.** Server only. **TV-ready.** Unaffected; for shows the crowd signal is TMDB's (M6).

### M1. The share cap made safe (shipped; verify)

Done in `33686382`: no per-person cap under 100 rated films; from 100, shares are read on the unshrunk features; a group with almost no movement is left alone; no group grows past 2 times. Thin profiles rank later films better (0.214 to 0.285 on real thin accounts, 0.418 to 0.535 on simulated ones), and the largest weight fell from 9.7e16 to 2.1.

**Left to do.** It was not watched running in production. After the 08:33 UTC pass:

```sql
select left(md5(profile_id), 6) as who, n_rated, model_version, updated_at,
       (select max(abs(x)) from unnest(weights) x) as largest_weight
from user_match_calibration
order by largest_weight desc
limit 10;   -- bar: nothing above 10, and updated_at is after the deploy
```

Then recheck the one account that was backward for another reason (26 rated, Spearman −0.51 before). If it is still negative after the rescore, read its ratings for an import fault.

If M0 is approved this fix becomes moot, and nothing is lost.

### M2. A rated film shows what we'd have said (shipped on web; two small things left)

Done: the web card on a rated film reads the pre-rating guess, else the held-out number, else the stored one, as the iPhone already did. The held-out number sits 5.8 points from what we truly predicted; the stored one sat 13.1.

**The cost, so it is not a surprise.** Across every rated 5-star film the web card used to show 85%+ on 79%; now 60%. For the owner, 40 of 40 becomes 27 of 40. The old number was echoing the person's own stars.

**Left to do.**

- The same label on both apps: "What we'd have said" (`b39-match-honesty.png`, frame 3). Web `Result.tsx`, iPhone `FilmScreen.swift:599`.
- A parity check in `scripts/check-invariants.ts`: the web card's source order equals the iPhone's.
- Held-out rows refresh once a day, so a film can show yesterday's number for a day. Refresh the one row when its film is rated (`lib/taste/match-score-update.ts`, `leaveOneOutScores`).

### M3. Each person's own curve (built, off; owner decides)

**What.** The display step reads each person's scores against their own ratings: the percentile of a film's held-out score maps to the rating they give at that percentile, then to a fixed star scale, blended with the shared curve by n/(n+100).

**What the time split says.** It passed all three bars. 5-star films at 85%+ go 43% to 49%. The share of films whose stars land in the range their band names goes 28% to 36%. Its clearest effect is at the bottom: today, films shown under 40% ("Probably not for you") average 3.1 stars, which is too harsh; with the curve that band shrinks from 168 films to 66 and averages 2.7 stars.

**My recommendation: turn it on, after M0 is decided and after three checks.** Do M0 first because the curve is fitted on the scores, and the scores change if the cap goes.

Checks before the switch (the report lists these as not done):

1. Every threshold set on the stored scale still means what it meant: weekly picks, Taste Mixes, in theaters, "Best for you", the match unlock, band words (`fitBand`, rule 119).
2. "Called it" and "How we did" count hits on one scale, the same before and after for a given account.
3. Blend and Film DNA percentages are untouched (rule 1512 says they are other scales).

**Places.** Already built: `lib/taste/personal-curve.mjs`, `film-scores.ts`, `full-pass.ts`. It is applied on the server, so the report says both apps draw the same number with no client change. Confirm that the iPhone's local copy of the shared curve (`MatchViews.swift:18`) is not applied a second time on top.

**Rules to amend.** 1512 (one shared curve becomes each person's own), 1068 (the owner's go-ahead for a correction to shown numbers), 1546.

**Risk.** Every visible number moves a few points on the day. A thin account moves least, because of the blend.

**TV-ready.** Fit the curve per person per kind once a person has 30 rated shows; until then shows use their film curve. Store it keyed by kind from the start.

### M4. Stamp held-out rows

```sql
alter table rating_predictions add column if not exists refreshed_at timestamptz;
-- model_version already exists and was null on every held_out row; write it on each refresh.
```

Check first whether `33686382` already writes `model_version`; if so only the timestamp is new. Without both, stale held-out numbers cannot be found. No risk.

### M5. Honest about thin profiles, and about the bottom band

My position has moved twice, so here is the evidence for where it ends. The audit said numbers under 65% could not be trusted (from 221 live rows). The random-fold calibration then showed the low bands in good order for accounts with history. The time split, which is the honest test, shows the lowest band is too harsh for everyone today (shown under 40%, rated 3.1 stars on average), and the personal curve repairs most of that.

**What.** (`b39-match-honesty.png`, frames 1 and 2.)

- Under 30 rated: the match card's second line reads "Early read, from 18 films". Always.
- Under 50 rated (`MATCH_TRUST_AT`, which already exists) and shown under 65: the band words alone, no digits.
- From 50 rated: digits at every level **if M3 is on**. If M3 stays off, also show words without digits under 40 for everyone, because that is the band the test found wrong.

**Places.** `lib/taste/fit-band.ts`, `lib/taste/maturity.ts` (one exported `matchDigitsShown(rated, shown)`), web `StampPct` and `MatchWhyBadge`, the film page card in `Result.tsx`; iPhone `Design/MatchViews.swift` (`MatchFormat.pct`). Sorts and thresholds are untouched.

**Rules to amend.** 1512, 119, and rule 202 (no match % under 15 rated).

**Risk.** Low. A poster chip with no number should simply be absent, so rows do not look broken.

**Test.** Display only. For the five thinnest stored profiles, list which of their top 50 lose digits; bar: none.

### M6. Language lean per language, and a crowd fallback for films Letterboxd barely knows

**What.** `langKey` (`match-model.mjs:438`) returns `"en"` or `"xx"`, so a love of Telugu films is spread over French and Korean ones. Key it by the language itself once the person has eight rated films in it; below that, by "home" (any of their home languages) or "other". And let the crowd feature fall back to `tmdb_vote_average` (rescaled to the Letterboxd scale) when a film has under 200 Letterboxd logs.

**Places.** `match-model.mjs` (`langKey`, the tallies at 458, the feature at 646, the crowd read), `lib/taste/full-pass-io.ts` (pass home languages and `tmdb_vote_average` in), a population refit.

**Rules to amend.** 1487, 1489 (the crowd floor of 3.5 needs its TMDB equivalent stated), 310 stays.

**Risk.** Medium, and **it cannot be validated on our members**: nobody has eight rated films in an Indian language. On existing data it can only be shown to do no harm.

**Test.** Bar set now: on the five accounts with eight or more rated films in one non-English language (Japanese and French), time-split Spearman on their non-English films is not worse (bootstrap interval of the change not wholly below zero), and pooled Spearman on everything else is unchanged to two decimals. Then, separately, the five recruited raters from O1: after 30 ratings each, their top 20 in their home language is read by them; bar: at least 12 of 20 judged "yes, I'd watch that" by at least four of five.

**TV-ready.** Language lean is the same for shows. The TMDB crowd fallback is not optional for shows (Letterboxd holds almost none), so building it now is building the TV crowd signal.

### M7. Clean ranked lists

**What.** At most two titles from one series in any ranked list; concerts, making-of films and recorded shows get no match number anywhere (not only in Picks); a remake never scores as the original's twin.

**Places.** `lib/film-kind.mjs` (`isNonFilm`, used by the scorer's `tv` flag at `match-score-update.ts:87`), `lib/candidate-pool.ts`, the franchise cap that already exists for the reveal's first picks (`franchiseKeys`, rule 218) applied in `browse` "Best for you" and `match-recs`. `scripts/mark-duplicate-films.mjs` for the 12 Angry Men pair.

**Rules to amend.** 64 and 116 (the non-film rule), 1500 (Best for you).

**Test.** For the 23 stored top-50 lists: zero non-films, no series more than twice, no duplicate title. Today five thin profiles fail this.

**TV-ready.** This is where "TV" stops meaning "junk to exclude". See T2: split "what kind of title is this" from "may it be recommended".

### What I am not proposing

- No change to the acclaim lean (top lists are mostly films rated 4.0 and up by the crowd). It is safe, and M3 plus the why line do more for trust. Revisit when there are 200 accounts.
- No refit of the shared display curve. M3 replaces it for anyone with history.

---

## Part 5. Archetypes

### The "too cool" test, applied to every name

Two questions per name. **Rank:** does it say "better than the others"? **Outsider:** would someone who does not watch these films want the name anyway? A yes to either is a fail. A third column notes whether the name survives shows.

| Name | Rank? | Outsider wants it? | Holds for shows? | Verdict |
|---|---|---|---|---|
| Disciple | No. A follower. | No | Yes, if the line says "people", not "directors" | Keep; new line |
| Globetrotter | No | Slightly (sounds cultured) | Yes | Keep; new gate and line |
| Old Soul | No. Gently teasing. | No | Yes | Keep |
| Aesthete | Slightly (taste as status) | A few would | Yes | Keep. The nearest thing to a prize in the set; watch it |
| Nihilist | No. Has an edge. | No | Yes | Keep |
| Midnight Cultist | No | No | Yes | Keep |
| Hardboiled | No | No | Yes | Keep; line widened |
| Overthinker | No. Self-teasing. | No | Yes | Keep; new line. Best name in the set |
| Voyager | No | Slightly | Yes | Keep |
| IMAX Idealist | No | No | Not well | **Keep** (owner decision). Backup name on file |
| Eyewitness | No | No | Yes | Keep |
| Tenderhearted | No. A little exposed. | No | Yes | Keep |
| Lovestruck | No. Teasing. | No | Yes | Keep |
| Comic Relief | No. Self-teasing. | No | Yes | Keep |
| Animation Devotee | No | No | Yes | Keep |
| Contrarian (streak) | No | No | Yes | Keep |
| Nostalgic (streak) | No | No | Yes | Keep |
| ~~Mastermind~~ | **Yes** | **Yes, everyone** | n/a | Withdrawn |

What the test shows: the set is already on the right side. Most names tease a little, which is why they read as true. The real risk is not one name being too cool, it is the **set forming a ladder**: the film-buff names (Disciple, Aesthete, Globetrotter, Eyewitness, Overthinker) lead nobody today, while the mainstream names lead most people. If the rare ones read as prizes and the common ones as consolation, the majority gets the lesser result. IMAX Idealist does this job well today: it is affectionate, not a consolation, which is a good reason to keep it.

### The final list

| Name | Said as | One line | Change |
|---|---|---|---|
| Disciple | You're a Disciple | Follows the people who make them. | Line (was "Follows directors, not titles."; a show has a creator) |
| Globetrotter | You're a Globetrotter | Far from home, by choice. | Line and gate |
| Old Soul | You're an Old Soul | At home in the classics. | Line shortened |
| Aesthete | You're an Aesthete | Style is the substance. | None |
| Nihilist | You're a Nihilist | Drawn to the dark and unresolved. | None |
| Midnight Cultist | You're a Midnight Cultist | Happiest when the lights go out. | None |
| Hardboiled | You're Hardboiled | Crime, thrillers and the double-cross. | Line widened |
| Overthinker | You're an Overthinker | You leave with a theory. | Line |
| Voyager | You're a Voyager | Other worlds, and the journey there. | None |
| IMAX Idealist | You're an IMAX Idealist | Built for the big screen. | None (kept by the owner) |
| Eyewitness | You're an Eyewitness | Drawn to the true story. | None |
| Tenderhearted | You're Tenderhearted | Moved by people. | None |
| Lovestruck | You're Lovestruck | In it for the love story. | None |
| Comic Relief | You're the Comic Relief | Here for the laugh. | None |
| Animation Devotee | You're an Animation Devotee | Not cartoons. Cinema. | None now; "Cinema" is a question at TV launch |
| Contrarian | a Contrarian streak | Rates against the grain. | None |
| Nostalgic | a Nostalgic streak | Still loves what it grew up on. | None |

### A1. Grammar: "You're Hardboiled", "You're an Overthinker"

**What.** One `article` per name ("a", "an", "the" or none) and one helper that writes the phrase. `b39-archetype-names.png`, frame 1.

**Places.** `lib/archetype-info.ts` (`ArcheInfo.article`), `ios/Montage/Resources/Archetypes.json` (mirrored), a helper in `lib/taste/archetype-copy.ts`; callers: `LockedIdentity.tsx`, `WelcomeTour.tsx`, `lib/type-card.tsx`, `lib/card-kit.tsx`, share text in `ShareTypeSheet.tsx`; iPhone `RevealScreen.swift`, `RevealShare.swift`, `WelcomeTour.swift`, `ProfileScreen.swift`.

**Rules to amend.** 582 (the tour's "You're a <archetype>"), 1344, 1432.

**Members whose name changes: 0.** Copy only. **Test.** `check-invariants`: for all 17 names, the phrase matches a fixed table; no "You're a Hardboiled" anywhere in web or Swift sources.

### A2. Overthinker's line

"Always piecing it together." becomes "You leave with a theory." in `lib/archetype-info.ts` and `Archetypes.json`. **Members whose name changes: 0** (nobody leads as Overthinker; nobody's name moves). Bump `lib/card-version.ts` so cached cards redraw.

### A3. Globetrotter counts films beyond the person's home languages

**What.** Its fact gate is "not English" (`graph-archetype.ts:201`), its score is `nonEnglishShare` (`archetypes.ts:252`, `features.ts:193`). Both become "not one of this person's home languages" (`homeLanguagesOf(prefs)`, default `["en"]`).

**Places.** `lib/taste/graph-archetype.ts` (`FilmFacts` gate, `FACT_NAME_MIN`), `lib/taste/features.ts` (`nonEnglishShare` renamed `awayShare`, old key still read), `lib/taste/archetypes.ts:252`, `lib/taste/unified/model.ts`, `IDENTITY_SCORING_VERSION` 53 to 54. Copy: "A passport stamped in subtitles." becomes "Far from home, by choice."; `ARCHETYPE_KIND` "films from around the world" stays.

**Rules to amend.** 1250 and the Globetrotter and Old Soul fact rule (the comment block at `graph-archetype.ts:91`).

**Members whose name changes: 0, by construction and by count.** Nobody leads as Globetrotter; one member carries it second; all 23 read as English-home, for whom the gate is identical. **Test.** `scripts/rescore-archetypes.ts` in preview (rule 1252: preview first) before and after; bar: zero changes on the 23. Then three synthetic libraries (Telugu-home with 20 Telugu films; the same with 8 Korean and French loves added; English-home with the same films): expected not Globetrotter, Globetrotter, Globetrotter.

**TV-ready.** Language is a property of shows too. Holds.

### A4. Hardboiled covers thrillers, in words first

**What.** Step 1, copy only: tag "Tough, cynical crime stories." becomes "Crime, thrillers and the double-cross."; `kind` and `desc` gain "tense thrillers". Step 2, only if step 1's count shows the need: let a plain thriller (tension 75 or more, brain demand under 65, crime or thriller genre) count toward Hardboiled's family.

**Members whose name changes: step 1, 0** (3 lead and 4 second keep the name). **Step 2: unknown until the preview runs.** Bar set now: at most 2 of 23 leads change, each one explained by named thriller films in that person's top ten, and Nihilist as a second falls (it sits second on 4 profiles, partly as the catch-all for dark thrillers).

**Places.** `lib/archetype-info.ts`, `Archetypes.json`, `lib/taste/archetypes.ts:41` (blurb); step 2 in `lib/taste/unified/model.ts` (the family weights near the brain-demand gate at 199) and `lib/taste/film-archetype-overrides.ts`.

### A5. Lovestruck leads 6 of 23

**What.** Find out why before changing anything. Run the preview with the per-family scores printed for the six Lovestruck leads and read whether romance is truly their top family or whether `blendedFamilyShare(features, "romance")` (`archetypes.ts:270`) is counting romance as a side genre on films that are mainly something else.

**Bar for any re-weighting.** Lovestruck leads at most 4 of 23; no account keeps it unless at least three of its ten highest-rated films are romance-led; at most 3 accounts change lead in total. Report the count. If the six are honestly romance-first, change nothing: a true 26% is better than a forced 15%.

### A6. IMAX Idealist stays; a backup name on file

**Decided by the owner, 2026-11-12: keep IMAX Idealist.** No rename is in any build. **Members whose name changes: 0.**

Kept on file only: if a trademark request arrives, or once shows are a real share of what people rate and "Built for the big screen" stops fitting, the backup is **Opening Nighter** ("There the night it opens."), then Blockbuster Believer. The mechanics would be the same as rule 1436's renames: the label in `lib/taste/archetypes.ts:47`, the old label added to `LEGACY_LABELS` and to `Guest.swift`'s `renamed` map, `lib/archetype-info.ts`, `Archetypes.json`, and a bump of `lib/card-version.ts`. The id `blockbuster_maximalist` would not change. The third frame of `b39-archetype-names.png` and the "Opening Nighter" row in its second frame are superseded by this decision.

One thing to do now so the backup stays cheap: keep "IMAX" out of App Store screenshots and paid ads, where a trademark holder is most likely to object.

### A7. Tags stay attached

Wherever a name appears alone in a row (people lists, Blend headers), the one-liner is available on tap. Voyager and Globetrotter, and the three follower names, need their lines to be told apart. Rule 1130 already puts the archetype under the handle; add the line to its tap target. Copy and layout only.

---

## Part 6. The why line

The line was rewritten twice since the audit (rules 1538 and 1542). Much of what I asked for is in: aspects are computed in code (`lib/taste/why-aspects.ts`), verbs are checked, stars are gone, the film half comes first, "If you loved X" is banned, and a film of theirs is named in about a third of lines. What is left:

### W1. Triangulation as evidence, not as wording

**What.** In `whyAspects`, an aspect's rank rises with the number of the person's loved films that share it. Three films sharing "a brutal mentor" beats one film sharing it, even if that one is their favorite. Pass the count to the writer as a word ("several of your favorites"), never a number. The line stays free to name no film at all ("It's the brutal-mentor story you keep coming back to.", which is rule 1542's own example).

**Places.** `lib/taste/why-aspects.ts:54` (`whyAspects` scoring), `lib/taste/fit-copy.ts`, `lib/claude.ts` (`whyDataBlock`, `FIT_HOOK`).

**Rules to amend.** 1538 (aspect ranking), 1542 (unchanged in letter; add "an aspect shared by two or more of their films ranks first").

### W2. An honest last rung

**What.** When no aspect clears the bar (thin profile, or a film whose score is mostly the crowd), the second sentence says what is true: "Widely loved, and close to what you've rated so far." Today the template always finds something to say.

**Places.** `lib/taste/fit-copy.ts` (`linkOptionsFromData`), `hookFitProblem`, `storedWhyFault`. **Rule.** 1528 ("every why served carries the taste half") needs the exception written in.

### W3. Three guards

- No aspect from a film label with confidence under 50 (this matters most for the newly backfilled films).
- The `twist` flag and ending labels never reach the writer (spoilers).
- One film of theirs is cited at most twice on one screen or row.

**Places.** `why-aspects.ts`, `lib/taste/read-evidence.ts`, the Picks row builder in `lib/weekly-picks.ts`.

### W4. Collect the missing evidence, with prompts about that film

**What.** `rating_reasons` holds 2 rows. After a rating, one row of chips **built from that film's own traits** (`b39-post-watch-v2.png`):

- "What did we miss?" when the rating lands 15 points or more above the guess.
- "What didn't work?" when it lands 15 or more below.
- "What did you like?" after any rating of 4 or more that we called.

One tap, in the rating sheet itself, no second screen. The general chips (Story, Visuals, Ending and the rest) sit behind "More".

**Examples, from the films' stored data.**

| Film | Stored data used | Chips |
|---|---|---|
| The Lion King, rated 5, we'd have said 73% | keyword "musical"; trait Coming-of-age; tearjerker 75; visual artistry 85 | The songs · Simba growing up · How much it moves you · The animation |
| Whiplash, rated 4.5, called | keywords "music teacher", "drums", "obsession"; tension 92; trait Flawed genius | The teacher and student · The drumming · How tense it gets · The obsession |
| RRR, rated 3, we'd have said 84% | runtime 187 minutes; spectacle 95; trait Buddy pairing; keyword "history of india" | Too long · The spectacle · The two leads · The history |

**More visible (owner, 2026-11-12).** Today the chips sit a step past the rating, and almost nobody reaches them. The row moves directly under the stars in the rating sheet and on the film page, shown the moment a rating of 4 or more lands, with its question in Bodoni as a heading, not as small print. It never blocks: rating and leaving still works.

**The answers must do something.** An answer on a loved film is used in three places, in order of how soon:

1. **The why line, at once.** `whyAspects` already ranks "a film chip they picked when rating a film" first. A line may then say what they told us: "It has the teacher and student at odds that you loved in Whiplash."
2. **What we've learned, after two films.** When the same feature is picked on two films it becomes a learned item, shown in Settings under Tune for you (`b39-post-watch-v2.png`, frame 4): "A teacher and student at odds. You picked it on Whiplash and Good Will Hunting." The person can remove it ("we stop using it") or tap "Not quite" to pick what they meant from that film's chips. A negative one reads the same way ("Long films wear on you").
3. **Picks, as rank points.** A learned item lifts or lowers films that carry the feature in ranked lists, the way "Show less of" already does (`lib/taste/pick-demotions.ts`, rule 1417): it moves the order, never the match %. Start small (the size of one Show less of step) and measure.
4. **The match score, only after a test.** A learned lean becomes a model input only when enough rows exist to backtest it on the time split (bar: order per person not worse, and better on the films that carry the feature). Until then it stays out of the %.

Places for 2 and 3: a `learnedLeans(ownerKey)` reader over `rating_reasons` in `lib/rating-chips.ts`; `app/api/viewing-prefs` (GET returns the list; POST removes or corrects one, stored as `viewingPrefs.learnedOff: string[]` so a removal survives new answers); Settings' Recommendation preferences on web (`AccountScreen.tsx`) and iPhone (`AccountScreens.swift:786`), titled Tune for you; `lib/taste/pick-demotions.ts` for the rank points. Rule 1417 and 1421 gain the section. Private like the rest of `viewingPrefs`.

**How a chip is chosen.** Up to four per film, in this order: a story trait (`films.character_traits`), a subject from the keywords that names something a person would say out loud, the film's two highest labels at 75 or more with confidence 50 or more, the director or lead when the person has rated other films of theirs. Each chip keeps a stable id and maps to film features, which `lib/rating-chips.ts` already requires ("every chip must map to a stable id and to film features") and already half does: it has "a film's own chips ... one per stored trait". The work is widening that list to keywords and labels and writing the labels plainly. Never a chip from the `twist` flag or the ending labels by name; "The ending" as a general chip is fine.

**Places.** `lib/rating-chips.ts`, `app/api/rating-chips`, web `SpotOn.tsx`, `SeenIt.tsx`, `Result.tsx`; iPhone `Film/FilmScreen.swift` and the rating sheet. Stored in `rating_reasons.reasons` with the existing `pos:` and `neg:` prefixes. No schema change.

**Test.** For 50 well-known films across ten genres, print the four chips; bar: for 45 of 50, a person who has seen the film agrees all four are about that film and none is a spoiler. After four weeks live: at least a third of ratings of 4 or more carry a chip (today almost none do).

**TV-ready.** The same sources exist for a show; add "creator" beside director.

### W5. The test before it is trusted

Generate 100 lines across thin, medium and heavy profiles and score each on three questions: is the named aspect on the computed list; is any cited film one of theirs with the right verb; does the line reveal anything past the synopsis. Bar: the first two pass 95 of 100, the third 100 of 100. `lib/taste/summary-judge.ts` is the pattern for a judge prompt; add `scripts/eval-why.ts`.

**Parity.** Both apps read the same APIs (`pick-why`, `public-film`); no client change except W4's chips.

**TV-ready.** Aspects come from traits, kinds, subjects and people. For a show add "creator" beside "director" in the aspect kinds, and let a show cite a show or a film of theirs. `whyAspects` should take `kind` now, unused.

---

## Part 7. Simplicity and progressive disclosure

### S1. What opens when (revised to the owner's notes)

`b39-unlocks-v2.png`.

**Where it lives and how to find it.** The ladder **replaces the "Sharpen your profile" row under the profile header**, in the same place and the same size, and opens the same kind of drawer. This follows the owner's earlier decision that every unlock has one home in that row (`sharpen-v2.png`, rule 84). Three ways in: the row itself; "What opens when" in the profile menu; and any hint elsewhere that says something opens later (the Picks bar, a locked Film DNA outline), which opens the same drawer.

**The header does not change.** At 18 rated the profile still has its backdrop, the photo, the name, the ticket with its three figures and "Share your card" (frame 1). Nothing above the row is hidden for a new account.

**Never gated.** The Social feed (the global feed is there from the first day), movie night (it works with nobody else on Montage: the host sends a link and guests join from it), lists, Pitch, Tonight, the watchlist. Only Blend waits for something, and only because it compares two people.

**The steps, with honest words.**

| At | The row says | What actually changes | Evidence |
|---|---|---|---|
| 15 rated | Your archetype and match % | A first read; Film DNA as an early sketch | Rule 239; already so |
| 30 rated | Film DNA firms up | Blind spots and Your numbers open | `FILM_DNA_FIRM_AT`; already so for the first two |
| 50 rated | A sharper match | Every film gets a number, not only the strong fits (M5) | Thin accounts order later films at about 0.21 to 0.29; the number is not yet good enough to print a low one |
| 100 rated | Match at full strength | The fit runs on the person's own taste; picks reach past the well-known | The measured step is at 100, not 50: order quality on later films is 0.47 for accounts with 100 or more ratings; `BEYOND_POPULAR_AT` is 100 |

**The change from my first version, and from the code.** I had "50 rated: match at full strength", copied from `MATCH_TRUST_AT = 50` and its comment "the match reads at full strength". The time-split data does not support that: accounts under 100 ratings behave differently from those above. So 50 becomes "sharper" and 100 becomes "full strength", in the copy and in the comment in `lib/taste/maturity.ts`. One caveat I will not hide: 100 is where the data shows a step, but the personal weights keep easing in until 200 (`SHRINK_FADE`). "Full strength at 100" is the honest plain-language line; "keeps sharpening after that" is true and is what the quiet row says.

**A conflict to settle.** `sharpen-v2` decided on two named steps only (15 and 30) and that "the later marks are model limits, never shown as goals". This version shows 50 and 100. I think that is right now because they are no longer just model limits: at 50 the digits change (M5) and at 100 the picks change, both things a person can see. They are shown as what happens, with no progress ring after 30 (frame 4 is a quiet line, not a goal). If the owner prefers the earlier rule, drop the 50 and 100 rows from the drawer and keep the quiet line.

**The unlock moment.** Once, right after the rating that crosses 30 (frame 3); one sheet per step; never two in a day. An imported account that arrives past a step sees no sheet for it.

**Places.** `lib/taste/maturity.ts` (rename the comment on `MATCH_TRUST_AT`, add `MATCH_FULL_AT = 100` equal to `BEYOND_POPULAR_AT`, one `ladder(profile)` reader for both apps), `app/api/setup-status`; web `ProfileSetup.tsx` and the Sharpen row and drawer (`SharpenDrawer.tsx`), `ProfileNudges.tsx`, `MatchUnlock.tsx`, `ProfileMenu.tsx`; iPhone `Profile/Sharpen.swift`, `ProfileNudges.swift`, `ProfileSections.swift`. Your numbers behind 30: `YourNumbers.tsx`, `YourNumbers.swift`, and rule 1408's tap on the films figure (under 30 it opens the ladder instead).

**Rules to amend.** 84 and 191 (the Sharpen row and drawer become the ladder), 239 and 853 stay, 1394, 1408.

**Risk.** A returning member must never lose something they had: treat every account older than the build as past every step it has the ratings for, and Your numbers stays open for anyone who has opened it before.

**Test.** Four stored shapes (0 rated guest, 18 rated, 42 rated, 1,080 rated import): the row's text, the drawer's ticks and the visible sections match the table on both platforms; the feed, movie night by link, lists and Pitch open for all four. `check-invariants`: the thresholds in Swift equal those in `maturity.ts`.

**TV-ready.** Count "rated" as films plus shows from one helper. No separate show thresholds.

### S2. One name per idea

| Today | One name | Places |
|---|---|---|
| Spot on, Called it, How we did, "Our guesses for you" | **Called it** for the track record; "Spot on" stays only as the stamp on a single hit | `CalledIt.tsx`, `HowWeDid.tsx`, `SpotOn.tsx`, `app/api/how-we-did`; iPhone Picks and Profile; `Glossary.swift`; rules 1189, 1415 |
| Sharpen your picks, Teach it your taste, Show less of, Anything you'd rather skip | **Tune for you** (one Settings page: "What we've learned" and "Show less of" are sections in it). Sharpen your profile becomes the ladder row (S1) | `SharpenDrawer.tsx`, `Sharpen.swift`, `SkipChips.tsx`, `SkipStep.swift`, Settings; rules 1417, 1421 |
| Tonight, Three for tonight, Just pick for me | **Tonight** (the others are buttons inside it) | `Tonight.tsx`, `Tonight/`; copy only |
| Movie night, room, theater (in code) | **Movie night** in everything a person reads | `Room/`, `TonightHost.tsx`; "Your theaters" now means cinemas (rule 1519) |

The one glossary (`ios/.../Design/Glossary.swift`, web `TermTip.tsx`; rule 1397) is where each surviving term is defined once.

**Risk.** Low, but wide: about 60 strings. Do it in one commit with the invariant strings updated together.

### S3. Layout moves

Profile leads with archetype, Film DNA, Canon, with counts behind one "Stats" row. Film page above the fold: match and why, where to watch, one action (rule 1513 already tightened it; keep that rhythm). Social for someone with no friends: one screen, one action ("Send your link, see your Blend"). Places: `IdentityView.tsx`, `ProfileScreen.swift`, `NewcomerSocial.tsx`, `Social/`.

---

## Part 8. Pitch

The name stays (Part 1, point 6). The battery now passes 126 of 126 on the keyword parser. Its own "still weak" list is the plan:

| # | What | Places | Test |
|---|---|---|---|
| P1 | **Run the battery against the live model parse.** The 100% is for the keyword path and the patch layer; the model's own parse was never run (no key in that environment). | `scripts/pitch-battery.ts` with the key, in the Ops workflow | Bar: 120 of 126 or better on the model path, and every fail read |
| P2 | Two languages in one ask ("Indian and Korean") read as both, not as "Not in English". "Indian" reads as the set of Indian languages. | `lib/recut.ts` (the language fact becomes a list), `lib/recut-server.ts`; rule 1529 | Battery rows 12 and 13 show both chips; add five two-language asks |
| P3 | Home languages as a soft default: with no language in the ask, films in the person's home languages get a small lift, and the reading shows no chip for it. An explicit language always wins. | `lib/recut-server.ts` (`rankPool`), reads `homeLanguagesOf` | Ten asks run as an English-home and a Telugu-home viewer: the top 10 differ, and no fact chip is invented |
| P4 | Free traits ("great soundtrack", "practical effects") go through the embedding fallback, which is unmeasured. | `lib/recut-server.ts:812` | 20 free-trait asks, top 5 judged by hand; bar: 4 of 5 fit on 16 of 20 |
| P5 | "Pitch a film" becomes "Pitch"; the hint stays beside the name on first sight. | `Recut.tsx:1091`, `Recut.swift:1573` | Copy check |
| P6 | Thin answers say so in the person's terms after the backfill ("Only 5 films fit Comedy and Telugu" should stop being true). | Catalog, not Pitch | Re-run rows 7 to 10 after Part 3 |

**Rules to amend.** 1529, 1532 (the battery's size and the model-path bar), 1539.

**TV-ready.** Add a `kind` fact to the parse now (film, show, either; default film until shows are in), so "a show like Severance" has somewhere to land and the battery can grow a TV section. Runtime facts need a show reading later (episode length, number of seasons, finished or still running). The share sheet and the notes row do not change.

---

## Part 9. TV prep

Nothing here ships a show. It makes sure nothing above has to be redone.

### T1. The key

Titles are keyed by `films.letterboxd_slug` everywhere (ratings, labels, the score catalog, predictions). `media_type` already exists (`movie`, `tv`, null); 139 TV rows are in the table, 128 with embeddings. Keep one table. A show's slug is `tv-<tmdb id>`, beside the existing `tmdb-<id>` for films Letterboxd lacks. TMDB ids for films and shows overlap, so any lookup by `tmdb_id` alone must also filter on `media_type` (`lib/filmography.ts:87` does not today; `:149` does).

```sql
-- Additive. Nothing reads these until shows ship.
alter table films
  add column if not exists seasons smallint,
  add column if not exists episodes integer,
  add column if not exists episode_runtime_minutes smallint,
  add column if not exists first_air_date date,
  add column if not exists last_air_date date,
  add column if not exists series_status text;       -- 'returning' | 'ended' | 'canceled' | 'limited'

update films set media_type = 'movie' where media_type is null;   -- 81 rows; check them first
create unique index if not exists films_kind_tmdb on films (media_type, tmdb_id)
  where tmdb_id is not null and duplicate_of is null;             -- will fail if duplicates exist: run the check below first

-- The check to run before the index:
select media_type, tmdb_id, count(*) from films
where tmdb_id is not null and duplicate_of is null
group by 1, 2 having count(*) > 1;
```

Ratings stay one per title (the whole show). A per-season rating, if ever wanted, is a nullable `season` column on `user_ratings` later; do not add it now.

### T2. Split "what is it" from "may we recommend it"

Today `isDocOrTv` and `isNonFilm` (`lib/film-kind.mjs`) mean both "this is TV" and "keep it out". About 40 call sites filter with `.or("media_type.is.null,media_type.eq.movie")`. Before shows, introduce two functions, `kindOf(row)` (film, show, special, stage, short) and `recommendable(row, { kinds })`, and one query helper for the filter, with behavior unchanged. Then turning shows on is passing `kinds: ["movie", "tv"]`, not editing 40 files. Rules 64, 116, 114 (series and specials in the library) and 148 (group lists are for films) are rewritten in those terms.

### T3. One helper for the noun

Strings say "films" in hundreds of places ("Rate 15 films", "Reading your 18 films", "From 140 films"). Add one `titleNoun(count, kinds)` on web and in Swift now, returning "films" for everything today. New strings in this plan use it. Do not sweep the old strings yet.

### T4. The model, per kind

Three things in the match model assume films: the crowd rating is Letterboxd's, the reference scale is the 6,000 most-watched films (`V3_REF_SIZE`), and the population fit is over film ratings. For shows: the crowd is TMDB's (M6 builds the fallback), the reference scale is per kind, and the calibration map is per kind (M3). `match_predictions` and `rating_predictions` need no column: the slug says the kind.

### T5. Archetypes and Film DNA across kinds

- One archetype per person, from films and shows together. The Film DNA traits (tension, warmth, brain demand and the rest) describe a show as well as a film. Two archetypes would double the vocabulary this plan is trying to shrink.
- The names hold once Disciple's line says "people" (final list). IMAX Idealist is kept by the owner's decision; it is the one name that fits shows poorly, and A6 keeps a backup on file.
- The one fact gate that needs thought is Old Soul ("a release before 1970"): for shows use the first air date and a later year, to be measured when there is data.

### T6. Onboarding and catalog

"Rate films you love" gets a Films and Shows switch above the rows; ratings from both count toward 15. The row API (O1) and the ingest (C2) take `kind` from the start. Budget the same again as Part 3 for a first 4,000 shows.

### 9.4. A naming decision for TV launch, not now

**Film DNA.** With shows in, "Film DNA" is slightly wrong, like "cinema archetype" was. Options then: keep it (Montage is a film-first brand, and "film" can stand for the craft); or rename to Taste DNA. I would keep it until shows are a real share of ratings, and I would not create any new name with "film" or "cinema" in it meanwhile. Also on that list: "Cinematic soulmates", "Not cartoons. Cinema.", and the app's own description. None needs action in the next build.

---

## Part 10. Decisions needed from the owner

1. **The share cap (rule 1488).** Turn it off (my recommendation) or keep it. The table in M0 has the shares and the numbers for both and for three middle settings; the middle ones give up accuracy without making lists more personal. Off is the difference between 44% and 57% of later 5-star films showing 85% or more, and it raises how closely scores follow the crowd from 0.77 to 0.85.
2. **The personal curve.** Turn it on after decision 1 and the three checks in M3. It moves every visible number a little.
3. ~~IMAX Idealist~~ **Decided: keep it.** Backup name on file in A6.
4. ~~"Where are you from"~~ **Decided: not asked.** Two questions only: languages and country.
5. **Country on the App Store privacy label and in the policy:** a new declared data type, so it needs your sign-off.
6. **Backfill size and spend:** about 3,700 films, under $15. And five recruited raters for the Indian-language checks.
7. **Hardboiled step 2 and Lovestruck:** both wait on a preview run; you see the counts before anything changes.
8. **"Tune for you" and "Called it"** as the surviving names in S2.
9. **The ladder's 50 and 100 rows:** shown as what changes (my recommendation), or dropped to keep the earlier "two named steps only" rule.
10. **The bar itself.** "5-star films generally at 85%+" is not reachable by display changes at today's ranking quality. I suggest tracking it as a goal (62% is the best measured) and judging each build by whether it rises on the time split.

---

## Part 11. Build order

The current build ships first, unchanged. Then three builds.

### Build A: trust and measurement (small, mostly server)

1. O6: one funnel event per onboarding screen.
2. M0: the share cap decision, applied (one environment variable and a rescore), with the acclaim check.
3. M1 and M2 leftovers: verify production, one label on both apps, refresh the held-out row on rating. M4: stamp held-out rows.
4. M3: the personal curve switched on, after M0 settles and its three checks pass.
5. M7: clean ranked lists.
6. C1 and C2: the catalog backfill (runs beside the build; no app change).
7. A1 and A2: archetype grammar and Overthinker's line.
8. T1 and T2: the additive TV columns and the kind split, behavior unchanged.
9. P1: the battery on the live model.

Why first: every later change is judged with these in place, and almost none of them changes a screen a person has learned.

### Build B: the first run and the names

10. O1: home languages and country (after C3's thresholds are met).
11. O2, O4, O5, O7: the shorter path after the reveal, theaters hidden outside the US, the tilted welcome wall, the new seed and deck swaps.
12. O3: the reveal in three beats.
13. A3: Globetrotter on home languages.
14. M5: "Early read" and words without digits.
15. W1 to W4: why line ranking, the honest last rung, the guards, the two evidence asks.
16. P2, P3, P5: Pitch languages, home-language default, label.

### Build C: depth

17. S1: the unlock ladder.
18. S2 and S3: one name per idea, layout moves.
19. M6: language lean per language and the TMDB crowd fallback.
20. A4 step 2 and A5, if their previews clear the bars.
21. W5: the 100-line why test as a standing check.
22. T3 to T6: the noun helper, per-kind model inputs, the Films and Shows switch behind a flag.

### The ten that matter most, in order

1. Funnel events (O6)
2. The share cap decision (M0)
3. The personal curve on (M3), with "Early read" and no low digits for thin profiles (M5)
4. Catalog backfill for eight Indian languages (C1, C2)
5. Home languages and country (O1)
6. Shorter path from the reveal to Picks (O2)
7. Archetype grammar, Overthinker's line, Globetrotter's gate (A1, A2, A3)
8. Why line: triangulated ranking and the film-specific prompts after a rating (W1, W4)
9. Unlock ladder in the Sharpen row (S1)
10. The kind split and additive columns for TV (T1, T2)
