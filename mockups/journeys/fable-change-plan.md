# Montage: the change plan for the next build

2026-11-12. A reply to the owner's notes on `fable-final-audit.md`, then every change I think is necessary, with the places to change.

Read-only. Nothing in `/home/user/montage` was edited. Code was read at `0fb885cd` (15 commits after the audit's `05fda487`; the why line, Pitch and the landing moved in between, and this plan accounts for that). Supabase `uktamekqqsiijugpaxit` was read with SELECT only; people appear as counts or hash prefixes.

Sources added since the audit: `match-calibration-5star.md`, `match-time-split.md`, `pitch-battery.md`, `b38-onboarding-fable.png`.

Three things I could not do, said up front:

- **`match-time-split.md` holds only its pre-set bars. No result has been written yet.** Every match change below that touches a number is conditional on that test. I did not guess its outcome.
- I cannot run the archetype rescore or the match evals (they need the service key). For those I give the script, the bar and the count I could read from stored profiles.
- All 23 stored profiles read as English-home (no member has more than 6% of their rated films in any one other language). So nothing about Indian-language viewers can be validated on our own data yet. It has to be tested with recruited raters.

Mocks made for this plan (same folder, built from `b39-next-build.html` by `b39-render.js`):

| File | Shows |
|---|---|
| `b39-home-language.png` | Languages and country on "Rate films you love", the "Your films" sheet, the Settings page |
| `b39-unlocks.png` | A new profile with one next step, the unlock moment at 30, the "What opens when" ladder |
| `b39-archetype-names.png` | The reveal's grammar ("You're an Overthinker"), the changed directory lines, the three candidates to replace IMAX Idealist |
| `b39-match-honesty.png` | "Early read, from 18 films", words with no digits for a thin profile's weak fit, a rated film showing what we'd have said |

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

Agreed. Part 4 is the match plan and Part 5 the archetypes. One change to my own audit: I said numbers under 65% could not be trusted. The larger calibration run (5,573 rated films, 23 accounts) shows the bands are ordered correctly at every level for accounts with history (under 50 shown: mean 2.8 stars, 7% rated 4 or more). The low end is weak only for thin profiles. So I now propose hiding low digits **only under 50 rated films**, not for everyone.

### 4. "TV is not out of scope. TV is coming soon."

Understood, and I was wrong to set it aside. Every change below carries a TV-readiness note, and Part 9 is the TV prep itself. The short version of what TV changes in this plan:

- I recommend renaming **IMAX Idealist** now rather than later. "Built for the big screen" cannot describe someone whose loves are big shows, and the trademark concern was already there.
- New archetype lines avoid the word "films" where they can.
- New fields and tables are keyed so a show fits without a migration (`media_type` already exists on `films`, with 139 TV rows).
- No new feature name in this plan contains "film". I do not propose renaming Film DNA now; see 9.4 for the decision you will face at TV launch.

### 5. Canon as all-time favorites

Good. Nothing to change in the name. The one-line gloss "Your all-time favorites" stays on first sight (it is in `b39-unlocks.png`, frame 1). TV note: the gloss has no "film" in it, so it holds.

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

Agreed. Part 7 has the ladder and `b39-unlocks.png` shows it. The thresholds are the ones `lib/taste/maturity.ts` already uses, so nothing new has to be tuned.

### 8. Triangulating is good

Noted, with one conflict to settle. Since the audit, rule 1542 banned "If you loved X" as a formula and capped films named in the why line at about a third of lines. Triangulation as I wrote it ("You loved Whiplash and Black Swan. This has...") would name two films in most lines, against that rule. Part 6 keeps the triangulation as **evidence** (an aspect counts for more when two or three of their loved films share it) and lets the wording stay varied, so both hold.

---

## Part 2. Onboarding

The shorter flow itself is in `b38-onboarding-fable.png` and section 1.6 of the audit. This part lists the code changes and adds language and country.

### O1. Home languages and country (new)

**What.** On "Rate films you love", one line and one chip row under the search field: "Films in" with chips, preselected, and "India · Change" at the right (`b39-home-language.png`, frame 1). Each selected language other than English adds one row on top ("Popular in Telugu"). "Change" or "More" opens the "Your films" sheet (frame 2): languages, then country, then a privacy line. The same two values live in Settings as "Languages and region" (frame 3).

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

"Takes about two minutes." under the button (`InputScreen.tsx`, `WelcomeScreen.swift`). Copy only.

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

Everything here that changes a number waits on `match-time-split.md`. Its bars were written before any result: on a time split (earlier ratings predict later ones) a fix ships only if ranking is not worse beyond noise, band accuracy rises with the bands still in order, and more held-out 5-star films show 85% or more. I adopt those bars as they are.

### M1. Fix the share cap (a real bug)

**What.** In `constrainShares`: skip a group whose movement is near zero, never scale a group by more than 2 times, read the shares on the unshrunk features so the cold-start shrink survives, and apply the per-person cap only from 100 rated films. Then rescore every account under 100 rated.

**Why.** One 13-film account has stored weights in the 10^15 range and its scores run backward (Spearman −0.60). On ordinary thin accounts the cap multiplies the personal weights by about 1.7, which is exactly the shrink undone (`match-calibration-5star.md`, section 4a). This is the audit's item 6, now confirmed.

**Places.** `lib/taste/match-model.mjs`: `constrainShares` (758), `v3FitUser` (813), the population fit (741), `MODEL_VERSION` (114) to 10, `POPULATION_KEY` gets a new letter so no old fit is read. `lib/taste/full-pass.ts` rescoring. iPhone: none (scores are served).

**Rules to amend.** 1488 (the shares: add the four guards and the 100-film floor), 1080 (say that the shrink is applied after, and survives, the cap). A line in `docs/DATA-SCIENCE-LOG.md` (the DS-log check requires it).

**Data.** No schema change. After deploy, the nightly pass rescored accounts; to confirm the broken account is fixed:

```sql
select left(md5(profile_id), 6) as who, n_rated, model_version,
       (select max(abs(x)) from unnest(weights) x) as largest_weight
from user_match_calibration
order by largest_weight desc
limit 10;   -- bar: nothing above 10
```

**Risk.** Medium: it changes every thin account's scores. The owner's account does not move (at 1,080 films the shrink factor is 1).

**Test.** The time-split bars for fix 1: judged on real accounts under 100 ratings and on thin profiles simulated from dated accounts (first 15, 30, 60 ratings predicting the next 40). Also: no weight above 10; Spearman above 0 on every account. Scripts: `scripts/eval-cold-start.mjs`, `scripts/eval-match-v9.ts` with the cap on, off and fixed.

**TV-ready.** The cap is per feature group, not per kind of title. Holds.

### M2. A rated film shows what we'd have said, on web as on iPhone

**What.** The web film card reads `said ?? predictedMatch ?? score`, as the iPhone does. A rated film never shows the stored score, which mostly echoes the person's own stars (for the owner, Spearman 0.86 stored against 0.60 held out). Label it "What we'd have said" (`b39-match-honesty.png`, frame 3).

**Places.** `app/_components/Result.tsx:3748` (the card's `pct`), and the "What we'd have predicted" row lower in the same file. iPhone already correct (`FilmScreen.swift:599`); change only the label so both read the same.

**Rules to amend.** 1512 (the list of places the shown % is drawn: add that a rated film's number is the held-out one), 1097 (the watch card's words).

**Risk.** Low. Some 5-star films will read lower on web than today (The Lion King 86 to 73 for the owner). That is the honest number, and M3 lifts it.

**Test.** The time-split test for fix 2: on films held out by the split, once rated, the held-out number is closer to the forward prediction than the stored one. Plus a parity check in `check-invariants`: the same account and film give the same number from the web card's source and the iPhone's.

### M3. Each person's shown % is read against their own ratings (fix A)

**What.** The display-only step that today is one fixed curve (`shownMatch`) becomes per person: a film's held-out score percentile maps to the person's own rating at that percentile, then to a fixed star scale (5 stars 96, 4.5 is 90, 4 is 82, 3.5 is 70, 3 is 55, 2.5 is 40, 2 is 30, 1 is 15), blended with today's curve by n/(n+100) held-out rows.

**Why.** It answers the owner's own complaint (loved films reading in the 70s). Random-fold backtest: 5-star films at 90 or more go from 57% to 78%, under 78 from 14% to 6%, pooled AUC 0.804 to 0.828, the love band both larger and more precise. Within a person the order of films cannot change. It also fixes the "level offset" accounts whose loves the crowd rates about 3.6.

**Costs, stated.** It bunches the middle (shown 55 to 75 rises from 30% to 43% of rated films) and lifts some disliked films (the owner's 3-star-and-under median goes 46 to 55).

**Places.**

- `lib/taste/shown-match.ts`: `shownMatch(stored, map?)`; with no map it is today's curve.
- `lib/taste/calibration-io.ts`, `lib/taste/full-pass.ts`: fit the map in the full pass from `rating_predictions` held-out rows; `backfillHeldOut` first for the 15 accounts that have none.
- **The parity problem.** Today the iPhone carries its own copy of the curve (`MatchViews.swift:18`, `MatchFormat.shownPoints`) and remaps locally. A per-person map cannot live in the app. **Every payload that carries a match must carry the shown number too** (`shown` beside `score`), and both clients draw `shown`. This is the larger part of the work and the part that removes a whole class of web-and-iPhone disagreements. Routes: `app/api/screen`, `browse`, `tonight`, `public-film`, `match-recs`, `weekly-pick`, `recut`, `watchlist-ranked`, `how-we-did`, `taste-mixes`, the card routes.
- Kill switch stays (`MATCH_SHOWN_REMAP=off`).

**Rules to amend.** 1512 (rewritten: per-person map, server-drawn; the Swift points become a fallback only), 119 and 1097 (band words read the shown %; unchanged in meaning).

**Data.**

```sql
alter table user_match_calibration
  add column if not exists shown_map jsonb,        -- [[stored, shown], ...], increasing
  add column if not exists shown_map_n integer,    -- held-out rows it was fitted on
  add column if not exists shown_map_at timestamptz;
```

**Risk.** Medium-high: every number every person sees can move by a few points on the day it ships. Mitigate with the blend (a 30-film account moves by under a quarter of the way) and by shipping after M1 and M2 so the inputs are clean.

**Test.** The time-split bars for fix 3, all three. If it fails the time split it does not ship, whatever the random folds said.

**TV-ready.** Fit the map per person **per kind** once shows have ratings (`shown_map` becomes `{movie: [...], tv: [...]}`); until a person has 30 rated shows, shows use their film map. The column is jsonb so this needs no migration.

### M4. Stamp held-out rows

```sql
alter table rating_predictions add column if not exists refreshed_at timestamptz;
-- model_version already exists and is null on every held_out row; write it on each refresh.
```

`lib/taste/match-score-update.ts` (`leaveOneOutScores`, 418) writes both. Without this, stale held-out numbers cannot be found. No risk.

### M5. Honest about thin profiles (changed from the audit)

**What.** (`b39-match-honesty.png`, frames 1 and 2.)

- Under 30 rated: the match card's second line reads "Early read, from 18 films".
- Under 50 rated (`MATCH_TRUST_AT`, which already exists) **and** shown under 65: the band words alone, no digits. From 50 rated, digits at every level.

**Why the change from "never show digits under 65".** The big calibration run shows the low bands are accurate for accounts with history. The misses I found in the live rows came from accounts with a handful of ratings.

**Places.** `lib/taste/fit-band.ts`, `lib/taste/maturity.ts` (one exported `matchDigitsShown(rated, shown)`), web `StampPct` and `MatchWhyBadge`, the film page card in `Result.tsx`; iPhone `Design/MatchViews.swift` (`MatchFormat.pct`). Sorts and thresholds are untouched.

**Rules to amend.** 1512, 119, and rule 202 (no match % under 15 rated).

**Risk.** Low. A poster chip with no number needs a designed empty state so rows do not look broken; `b39` frame 2 shows the card, and the chip should simply be absent.

**Test.** Display only, so no model bar. Check: for the five thinnest stored profiles, list which of their top 50 and bottom 50 lose digits; bar: no film in anyone's top 50 loses its number.

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

### M8. One account to recheck

`n4gfx95v` (26 rated) has Spearman −0.51 and is not explained by the share cap. Rescore after M1; if it stays negative, read its ratings for an import fault. No code change planned.

### What I am not proposing

- No change to the acclaim lean (top lists are mostly films rated 4.0 and up by the crowd). It is safe, and M3 plus the why line do more for trust. Revisit when there are 200 accounts.
- No refit of the fixed display curve. M3 replaces it.

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
| IMAX Idealist | No | No | **No** | **Rename** (trademark, and it means a cinema screen) |
| Eyewitness | No | No | Yes | Keep |
| Tenderhearted | No. A little exposed. | No | Yes | Keep |
| Lovestruck | No. Teasing. | No | Yes | Keep |
| Comic Relief | No. Self-teasing. | No | Yes | Keep |
| Animation Devotee | No | No | Yes | Keep |
| Contrarian (streak) | No | No | Yes | Keep |
| Nostalgic (streak) | No | No | Yes | Keep |
| ~~Mastermind~~ | **Yes** | **Yes, everyone** | n/a | Withdrawn |

What the test shows: the set is already on the right side. Most names tease a little, which is why they read as true. The real risk is not one name being too cool, it is the **set forming a ladder**: the film-buff names (Disciple, Aesthete, Globetrotter, Eyewitness, Overthinker) lead nobody today, while the mainstream names lead most people. If the rare ones read as prizes and the common ones as consolation, the majority gets the lesser result. So the replacement for IMAX Idealist must be as likable as Aesthete, not a put-down. That rules out names like "Crowd Pleaser".

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
| **Opening Nighter** | You're an Opening Nighter | There the night it opens. | **Renamed from IMAX Idealist (owner decides)** |
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

### A6. Rename IMAX Idealist (owner decision)

**What.** `b39-archetype-names.png`, frame 3. My pick is **Opening Nighter** ("There the night it opens."): a habit, not a rank; true of a premiere on a streaming service; no trademark. Second: Blockbuster Believer. Third: Big Screen Believer, which is closest to today's meaning and wrong the day shows arrive.

**Members whose name changes: 8 of 23 see a new word** (4 lead, 4 second). Nobody is reassigned. The id `blockbuster_maximalist` stays.

**Places.** `lib/taste/archetypes.ts:47` (label) and `LEGACY_LABELS` (add the old label so stored profiles display the new one, as was done for Chronicler); `lib/archetype-info.ts` (name, `ARCHETYPE_KIND`); `Archetypes.json`; `ios/.../Core/Guest.swift:168` (`renamed`); `lib/taste/match.ts:79`; `lib/taste/lexicon.ts`, `summary-check.ts`, `summary-judge.ts`, `taste-dna.ts`, `lib/group-names.ts`, `lib/compatibility.ts`, `lib/profile-display.ts`, `lib/weekly-picks.ts`, `lib/archetype-streaks.ts`, `lib/taste-test/probes.ts` and `questions.ts`, `scripts/persist-archetype-centroids.mjs`, `scripts/bake-archetype-posters.mjs`, `lib/card-version.ts`; marketing posts in `marketing/kit/posts/` stay as history. Rule 1436 is the template (three names renamed on 2026-11).

**Risk.** Members who shared "IMAX Idealist" see a different word. With 23 profiles this is the cheapest it will ever be.

**Test.** Grep: the old label appears only in the legacy maps. All 8 affected profiles render the new name on web and iPhone, with no flash of the old one (rule 1540).

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

### W4. Collect the missing evidence

**What.** `rating_reasons` holds 2 rows. Two cheap sources:

- "What did we miss?" after a rating that lands 15 or more points from the guess (`b39-match-honesty.png`, frame 3): four chips from that film's strongest traits.
- "What made it?" inside the rating sheet after 4 stars or more: one tap, no second screen.

**Places.** `lib/rating-chips.ts` (chips exist), `app/api/rating-chips`, web `SpotOn.tsx`, `SeenIt.tsx`, `Result.tsx`; iPhone `Film/FilmScreen.swift`, the rating sheet. Stored in `rating_reasons.reasons` with the existing `pos:` prefix and a new `miss:` prefix. No schema change.

### W5. The test before it is trusted

Generate 100 lines across thin, medium and heavy profiles and score each on three questions: is the named aspect on the computed list; is any cited film one of theirs with the right verb; does the line reveal anything past the synopsis. Bar: the first two pass 95 of 100, the third 100 of 100. `lib/taste/summary-judge.ts` is the pattern for a judge prompt; add `scripts/eval-why.ts`.

**Parity.** Both apps read the same APIs (`pick-why`, `public-film`); no client change except W4's chips.

**TV-ready.** Aspects come from traits, kinds, subjects and people. For a show add "creator" beside "director" in the aspect kinds, and let a show cite a show or a film of theirs. `whyAspects` should take `kind` now, unused.

---

## Part 7. Simplicity and progressive disclosure

### S1. What opens when

`b39-unlocks.png`. A new account sees one next step on its profile, not seven empty sections.

| Trigger | Opens | Today |
|---|---|---|
| 15 rated | Archetype, match %, early Film DNA | Already so (`FULL_ARCHETYPE_AT`) |
| 30 rated | Film DNA firm, blind spots, Your numbers | First two already so (`FILM_DNA_FIRM_AT`); Your numbers is always shown |
| First watchlist add | Lists, release reminders, the notifications ask | Lists always shown |
| First friend (a follow either way) | Blend, the Social feed, movie night | Social shows an empty feed |
| 50 rated | Match digits at every level (M5), Canon tiers | `MATCH_TRUST_AT` exists |
| 100 rated | Picks reach past the well-known | Already so (`BEYOND_POPULAR_AT`) |
| 150 rated | Taste Mixes on your own taste | Already so (`OWN_MIXES_AT`) |
| A year in, or December | Film goal, year in review | Both are off (rule 1086); they come back through this gate |

Rules for the unlock itself: it fires once, right after the action that earned it; one sheet per threshold; never two in a day (the later one waits); an imported account that arrives with 400 ratings gets everything at once and sees no sheets. Anything hidden is still reachable by search and by a direct link, so nothing is locked away, only not advertised.

**Places.** `lib/taste/maturity.ts` (add the non-rating triggers and one `unlocked(profile)` reader so both apps ask the same question), `app/api/setup-status` (serve it), web `ProfileNudges.tsx`, `NewMemberHome.tsx`, `NewcomerSocial.tsx`, `MatchUnlock.tsx` (the pattern to copy), `Lists.tsx`, `YourNumbers.tsx`, `SharpenDrawer.tsx`; iPhone `Profile/ProfileNudges.swift`, `ProfileSections.swift`, `YourNumbers.swift`, `Sharpen.swift`, `Lists/`, `Social/`.

**Rules to amend.** 239 and 853 stay. 1394 (the simplified profile) gains the gates; 1408 (the films figure opens Your numbers: only from 30); 1076 and 1086 (film goal and year in review return through the gate).

**Risk.** A returning member must never lose something they had. Gate on "has ever", not "has now", and treat every account older than the build as fully unlocked.

**Test.** Four stored shapes (0 rated guest, 18 rated, 34 rated with a friend, 1,080 rated import): the list of visible sections matches the table on both platforms. `check-invariants`: the thresholds in Swift equal those in `maturity.ts`.

**TV-ready.** Count "rated" as films plus shows from one helper. Do not add separate show thresholds; a person who rates 15 shows has earned the same things.

### S2. One name per idea

| Today | One name | Places |
|---|---|---|
| Spot on, Called it, How we did, "Our guesses for you" | **Called it** for the track record; "Spot on" stays only as the stamp on a single hit | `CalledIt.tsx`, `HowWeDid.tsx`, `SpotOn.tsx`, `app/api/how-we-did`; iPhone Picks and Profile; `Glossary.swift`; rules 1189, 1415 |
| Sharpen your picks, Sharpen your profile, Teach it your taste, Show less of, Anything you'd rather skip | **Tune your picks** (one Settings page; "Show less of" is a section in it) | `SharpenDrawer.tsx`, `Sharpen.swift`, `SkipChips.tsx`, `SkipStep.swift`, Settings; rules 1417, 1421 |
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
- The names hold once IMAX Idealist is renamed (A6) and Disciple's line says "people" (final list).
- The one fact gate that needs thought is Old Soul ("a release before 1970"): for shows use the first air date and a later year, to be measured when there is data.

### T6. Onboarding and catalog

"Rate films you love" gets a Films and Shows switch above the rows; ratings from both count toward 15. The row API (O1) and the ingest (C2) take `kind` from the start. Budget the same again as Part 3 for a first 4,000 shows.

### 9.4. A naming decision for TV launch, not now

**Film DNA.** With shows in, "Film DNA" is slightly wrong, like "cinema archetype" was. Options then: keep it (Montage is a film-first brand, and "film" can stand for the craft); or rename to Taste DNA. I would keep it until shows are a real share of ratings, and I would not create any new name with "film" or "cinema" in it meanwhile. Also on that list: "Cinematic soulmates", "Not cartoons. Cinema.", and the app's own description. None needs action in the next build.

---

## Part 10. Decisions needed from the owner

1. **IMAX Idealist:** rename to Opening Nighter (my pick), Blockbuster Believer, or keep until TV. 8 of 23 members see the change.
2. **"Where are you from":** I recommend not asking it. Confirm, or say you want it as an optional Settings row.
3. **Country on the App Store privacy label and in the policy:** needs your sign-off, since it is a new declared data type.
4. **M3 (per-person shown %):** it moves every visible number a little. Ship only if the time split passes; confirm you accept the bunched middle as its price.
5. **Low digits hidden only under 50 rated** (my revised position), or for everyone under 65 as the audit said.
6. **Backfill size and spend:** about 3,700 films, under $15. And the recruited raters (five people) for the Indian-language checks.
7. **Hardboiled step 2 and Lovestruck:** both wait on a preview run; you see the counts before anything changes.
8. **"Tune your picks" and "Called it"** as the surviving names in S2.

---

## Part 11. Build order

The current build ships first, unchanged. Then three builds.

### Build A: trust and measurement (small, mostly server)

1. O6: one funnel event per onboarding screen.
2. M1: share cap fix, rescore thin accounts (if the time split passes).
3. M2: rated films show what we'd have said, web as iPhone.
4. M4: stamp held-out rows.
5. M7: clean ranked lists.
6. C1 and C2: the catalog backfill (runs beside the build; no app change).
7. A1 and A2: archetype grammar and Overthinker's line.
8. T1 and T2: the additive TV columns and the kind split, behavior unchanged.
9. P1: the battery on the live model.

Why first: every later change is judged with these in place, and none of them changes a screen a person has learned.

### Build B: the first run and the names

10. O1: home languages and country (after C3's thresholds are met).
11. O2, O4, O5: the shorter path after the reveal.
12. O3: the reveal in three beats.
13. A3: Globetrotter on home languages. A6: the IMAX Idealist rename, if approved.
14. M5: "Early read" and words without digits for thin profiles.
15. W1 to W4: why line ranking, the honest last rung, the guards, the two evidence asks.
16. P2, P3, P5: Pitch languages, home-language default, label.

### Build C: depth, and the numbers that move

17. S1: the unlock ladder.
18. S2 and S3: one name per idea, layout moves.
19. M3: per-person shown %, with the server sending the shown number (if the time split passes).
20. M6: language lean per language and the TMDB crowd fallback.
21. A4 step 2 and A5, if their previews clear the bars.
22. T3 to T6: the noun helper, per-kind model inputs, the Films and Shows switch behind a flag.

### The ten that matter most, in order

1. Funnel events (O6)
2. Share cap fix (M1)
3. Rated films show the honest number on web (M2)
4. Catalog backfill for eight Indian languages (C1, C2)
5. Home languages and country (O1)
6. Shorter path from the reveal to Picks (O2)
7. Archetype grammar, Overthinker's line, Globetrotter's gate, the IMAX rename (A1, A2, A3, A6)
8. Why line: triangulated ranking and the two evidence asks (W1, W4)
9. Unlock ladder (S1)
10. Per-person shown % drawn by the server (M3)
