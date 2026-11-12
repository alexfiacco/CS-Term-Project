# Montage pre-launch audit: onboarding, match trust, archetypes, the why line, simplicity

2026-11-12. Read-only. No app code, data or settings were changed. Sources: `montage` at `05fda487` (web and `ios/`), `docs/INVARIANTS.md` (rules 582, 992, 1080, 1417, 1487, 1507, 1512, 1518 to 1521, 1528), `docs/DATA-SCIENCE-LOG.md`, the backtests in this folder (`accuracy-gap-report.md`, `dna-measure-backtest.md`, `favorite-finding-test.md`, `cerebral-archetype-v1.md`, `archetypes-review-v1.md`), and read-only SELECTs on Supabase `uktamekqqsiijugpaxit` (people appear only as hash prefixes or counts).

What this is not: I did not run the app or watch a person use it. Everything on flow and simplicity is read from code, copy and rules. The live sample is small (23 profiles, 221 rated predictions from 19 people), so treat the live numbers as direction, not measurement.

## The short version

Ranked by expected effect on getting and keeping users.

1. **Cut the stretch between the reveal and the first real screen.** Today a new iPhone account passes about ten screens after the reveal before it can use the app. This is the largest drop-off risk in the product and the cheapest to fix.
2. **Make the why line name a shared quality that the data can back, with an honest fallback.** The stated reasons it should mirror barely exist (2 rows in `rating_reasons`). It has to be built from labels, hooks and neighbours, and it needs guard rails.
3. **Stop showing precise low numbers.** The top of the scale is trustworthy; the bottom is not. Films shown under 40% were liked two times in three. Show words under 65%, digits above.
4. **Add a home-language shelf to "Rate films you love", and backfill the catalog behind it.** Today an Indian viewer sees almost nothing familiar: the rows require 100,000 Letterboxd logs, which 6 Hindi films, 1 Telugu film and 0 Tamil films pass.
5. **Turn the reveal into three beats and a share card made of the person's own films.** The current card is generic; people share what is about them.
6. **Measure model 9 before trusting it, and check that its share cap is not cancelling the cold-start shrink.** Model 9 shipped unmeasured, and its caps are a product decision, not a fit.
7. **Fix five archetype issues**: the "You're a Hardboiled" grammar, Globetrotter for people whose home language is not English, Lovestruck leading 26% of profiles, no home for the plain thriller fan, and the IMAX trademark.
8. **One name per idea, and hide the long tail for a new account.** There are about 25 named features; four of them mean "how accurate were we" and five mean "tune my recommendations".

Answers to the owner's direct questions:

- **(a) Where you watch: after rating, and after the reveal.** Never before. But make it one screen (services only) and remove the two screens that follow it today.
- **(b) Language filter: yes, as shelves that are added, not a filter that replaces.** The taste model does not need a shared deck. The catalog is the real limit, and it needs a backfill first for Telugu, Tamil, Malayalam and Kannada.
- **Overthinker: keep it.** Change the tag to "You leave with a theory." and keep it for puzzle films only. Fallback if the owner still dislikes it: Mastermind.

---

## 1. Onboarding

### 1.1 The flow as built

iPhone (`OnboardingFlow.swift`, `MontageApp.swift` MainShell). The web is the same order (`HomeShell.tsx`: `InputScreen`, `LovedStart`, `TasteTest`, `LockedIdentity`, then `ServicesStep`, `SkipStep`, `WelcomeTour`), without the notifications card.

| # | Screen | What it asks | Notes |
|---|---|---|---|
| 1 | Welcome | "What kind of viewer are you?" Find your taste, Import from Letterboxd, Sign in, See the 15 archetypes | Good. One clear primary. |
| 2 | Rate films you love (`LovedStartScreen`) | Tap posters and give stars, or search. Rows: Trending this week, Everyone's seen these, seven genres, Modern classics. Counter "N of 15" | Good first screen. Ratings count toward 15. "See my taste" appears at 15. |
| 3 | The deck (`TasteDeckScreen`) | One film per card, from a fixed 298-film list, 15 seed cards first, adaptive after 5 ratings. Reveal from 15, done at 30 | Second rating interface. Film DNA tease from rating 3, a progress toast at 8, short "noted" lines every 3. |
| 4 | Reveal (`RevealScreen`) | Name develops from a blur, one why line, three picks fan out (third locked signed out), "Your Film DNA" row, friend row, Save | The payoff. Under 15 rated it shows "A first look" with no name. |
| 5 | Save drawer | Apple, Google, email, or "Not now, keep it on this device" | Fine. |
| 6 | Pick your handle (`HandleScreen`) | Handle, plus "Who invited you?" and a "This is my Letterboxd" switch | Three decisions on one screen. |
| 7 | Where do you watch? (`ServicesStep`) | Six services plus "More services", then nine theater chains tapped in order of favorite | Two tasks on one screen (rule 1520). |
| 8 | Anything you'd rather skip? (`SkipStep`) | Three groups of chips: genres, themes, eras and subtitles | Negative question right after the high. |
| 9 to 14 | Walkthrough (`WelcomeTour`) | Five cards, six on iPhone with notifications. The first run has no Skip and no swipe back | The comment in code is "the first walkthrough has no way out but its last card". |
| 15 | Picks | The app | Then the invite sheet, if the friend row was tapped on the reveal. |

The Letterboxd import path asks "Where do you watch?" and "Anything you'd rather skip?" **before** its reveal (rule 1439). A returning account on a new iPhone gets services, the tour, then skip (rule 1521).

### 1.2 Judgment

**What works.** The first three screens are strong. The welcome asks a question people want answered. Rating posters is fun, the counter is honest, search lets anyone rate what they know, and progress survives a closed app. The reveal has real craft: the developing name, the reason built from the person's own ratings, the fan.

**Time to first payoff.** Fifteen ratings is about two to three minutes for someone who knows the films. That is acceptable for an identity result, and the 15 floor is right (the backtests show the read is noise below it). The welcome should say so: "Takes about two minutes."

**The dull stretch is after the payoff, not before it.** Between the reveal and Picks a new iPhone account passes: save, handle (three decisions), services and theaters (two tasks), skip chips, then five or six cards it cannot skip. That is nine to eleven screens of setup and explanation at the exact moment motivation is highest and the person wants to see what the app does with their taste. Each screen is individually reasonable; together they read as a toll. Expect the worst drop-off of the whole funnel here, and expect people to tap through the tour without reading it.

**Specific risks, in order.**

1. The unskippable walkthrough. It explains tabs the person has not seen yet. People learn an interface by using it.
2. "Anything you'd rather skip?" asks for a negative preference before the person has seen one recommendation. Most people cannot answer it in the abstract, and the app already learns this from "Not for me".
3. The handle screen carries "Who invited you?" and the Letterboxd switch. Neither belongs in the first minute.
4. The theater chains double the services screen for a choice that matters to fewer people and only in a theatrical context.
5. Two rating interfaces back to back (grid, then cards). The seam ("Next: rate a few we pick") is fine for someone at 6 of 15, but a person who rated 15 in the grid should never see the deck.
6. The seed deck is fifteen fixed, mostly American films. A viewer outside that canon taps "Haven't seen" over and over (see 1.4).
7. The import path puts two preference screens in front of its reveal. Same fix as (a): reveal first.
8. The third pick locked behind an account is a small trust cost at the first moment of trust. Lock something bigger instead ("your full list") and show all three.

**Measurement gap.** `public.events` holds only `search_miss` rows for the last 30 days. Funnel events (`onboarding_door`, the deck and reveal events) go to PostHog, which I could not read. Before changing the flow, confirm there is one event per screen from welcome to the first Picks view, so the change can be judged.

### 1.3 (a) Where you watch: before or after rating?

**After rating, and after the reveal. Keep it out of the path to the payoff.**

- It has no effect on the archetype, so asking it first is paperwork before any reward. Every screen before the first payoff costs completions.
- After the reveal the person has a reason to answer: the picks they were just shown become things they can play tonight. The question should say that.
- It is the one setup question that changes the first session (a pick with "Play on Netflix" is far more useful than one without), so it earns its place. The skip chips and the theaters do not, yet.

Recommended form: one screen, right after the save, services only, six tiles plus "More services", titled "Where do you watch?" with the sub-line "So every pick is one you can play tonight." A single collapsed row under it, "Go to theaters too?", opens the chains for the people who want them. Otherwise ask for theaters the first time a theatrical pick is shown. This trims rule 1520, approved yesterday; I think the two-task screen is a mistake at this point in the flow, not in Settings.

For the import path: move both preference screens to after its reveal, so the two paths match.

### 1.4 (b) A language filter on the first rate screen

**Yes. Build it as home-language shelves that are added to the screen, not as a filter that swaps the films.**

What the deck is today:

- "Rate films you love" (`/api/start-films`): every row requires `letterboxd_watch_count > 100000`. Films in the catalog that pass: English 3,376, Japanese 100, French 86, Spanish 37, Korean 33, Hindi 6, Telugu 1, Malayalam 1, Tamil 0. So an Indian viewer sees an almost entirely American screen and has to search.
- The card deck (`lib/taste-test/probes.ts`): 298 films, two of them Indian (RRR, 3 Idiots). The 15 seed cards never change and include one Japanese and one Korean film.
- Search works for any catalog film and the rating counts toward 15.

Does the taste model need a shared deck? **No.**

- The profile is computed from whatever films are rated (`computeProfile`), each film read through its own labels and embedding. Search ratings already work this way.
- What the shared deck does give: an archetype-balanced seed (one card per archetype), the adaptive order (it uses per-card lanes), instant posters, and more films in common between friends, which makes Blend steadier. None of these requires that everyone rate the same 15.

The real limit is the catalog, not the model. Films with at least 5,000 logs that have both an embedding and labels:

| Language | Films in catalog | With 5,000+ logs | Of those, ready (embedding and labels) |
|---|---|---|---|
| Hindi | 1,590 | 418 | 345 |
| Korean | 1,415 | 315 | 266 |
| Japanese | 3,342 | 828 | 770 |
| Tamil | 504 | 115 | 56 |
| Telugu | 288 | 56 | 24 |
| Malayalam | 268 | 51 | 16 |
| Kannada | 30 | 5 | 4 |

Hindi, Korean, Japanese, Spanish and French can ship now. Telugu, Tamil, Malayalam and Kannada cannot carry a row of 18 good films yet, and a film without an embedding or labels teaches the model nothing. Letterboxd log counts also undercount Indian cinema, so the pool should be chosen by TMDB popularity within the language, not by Letterboxd logs.

Recommended design:

1. **A chip row at the top of "Rate films you love": "Also show films in"** with Hindi, Telugu, Tamil, Malayalam, Kannada, Korean, Japanese, Spanish, French, More. Multi-select. Preselect from the device region and languages (region India shows the chooser open; nothing is assumed silently).
2. **Each chosen language adds one row at the top** ("Popular in Telugu"), 18 films, picked by TMDB popularity inside the language from films that are ready. The existing rows stay below. Nobody loses the common films.
3. **Every rating counts toward 15 equally.** Do not force a core deck. Someone who reaches 15 on local films gets "See my taste" at once.
4. **The shared deck stays as the top-up and as an option.** Under 15, the deck fills the remainder as it does now, with cards from the chosen languages mixed into the adaptive part. At 15, one quiet line on the reveal: "Rate five well-known films to sharpen your Blend with friends." Optional.
5. **Store the choice as home languages and use it everywhere**: Picks mixes, Pitch defaults, and the three fixes below.
6. **Before launch of the row for the four southern languages: backfill** embeddings and labels for the top 150 or so films per language.

Three model issues the same change should fix, or the row will produce odd results:

- **Language affinity lumps every non-English film together.** `langKey` in `match-model.mjs` returns `"en"` or `"xx"`. A Telugu fan's lean is spread across French and Korean films. Key it by language once a person has enough films in one.
- **Globetrotter misfires.** Its gate is non-English films. A viewer in Hyderabad who watches Telugu films is told "A passport stamped in subtitles." Gate it on films outside the person's home languages.
- **The "Subtitled films" skip chip** has the same English-default assumption.

### 1.5 (c) A more exciting, more shareable reveal

What it does now: the name develops from a blur, one reason line, three picks, a Film DNA row, a friend row, the save. The share is the archetype card (9:16 or 4:5) with a link to the public archetype page and "What's yours?".

Proposals, strongest first.

1. **Three beats instead of one page.**
   - Beat 1, suspense (about two seconds): the posters they rated five stars slide into a stack. Line: "Reading your 18 films."
   - Beat 2, the name: full screen, one haptic, the name and its tag. Nothing else on screen.
   - Beat 3, the proof: the two or three films that decided it, as posters, under *Because you loved*. Then the picks and the save.
   The pieces all exist; this is staging.
2. **A share card built from their films, not the archetype's.** Four of their own top posters, the name, the tag, the second archetype as "With a streak of Nihilist", and "What's yours? montagefilm.app". The current card looks the same for every Hardboiled. Personal cards get posted; generic ones do not.
3. **Name the pair.** "Hardboiled with a Nihilist streak" gives 15 by 14 combinations instead of 15 results. It reads as more accurate and less like a horoscope. The data is already on the reveal ("Also").
4. **One line that is a little bold.** `lib/taste/hot-take.ts` already finds these. On the reveal: "You gave Twilight more stars than The Godfather." This is the line people screenshot. Rule 853 keeps taste talk out of the deck; the reveal is the right place for it.
5. **Make the friend row a challenge, and make it the main share.** Share text: "I'm Hardboiled with a Nihilist streak. Rate 15 films and see our Blend." The link lands on the invited welcome that already exists (rule 198). This is the growth loop; it should sit above the generic card share, not below the picks.
6. **Ask "Does this feel right?" under the name**, with "Spot on" and "Not quite". "Not quite" shows the runner-up and offers five more cards. Today this lives in a menu at the top right. It builds trust and gives the first accuracy data per account.
7. **Show all three picks; lock the list instead.** "Save to see your full 50" converts on value, not on withholding.
8. **Do not show rarity yet.** "1 in 12 members" is a strong share line, but with 23 profiles any number would be invented. Add it after a few thousand profiles.

### 1.6 Proposed flow, screen by screen

| # | Screen | What it does | Why |
|---|---|---|---|
| 1 | Welcome | "What kind of viewer are you?" One button, "Find your taste". Under it "Takes about two minutes." Import and Sign in stay secondary | Sets the cost honestly. One decision. |
| 2 | Rate films you love | Posters, stars, search, the "Also show films in" chips, counter to 15. "See my taste" at 15 | Fun first. Works for any viewer. |
| 3 | Deck top-up | Only when under 15. Adaptive cards. The Film DNA tease keeps filling | Nobody at 15 sees a second rating interface. |
| 4 | Reveal, three beats | Stack, name, proof. "Does this feel right?" | The payoff, staged. |
| 5 | Reveal, lower half | Three picks (all shown), the bold line, "Challenge a friend", the personal share card | Share while the feeling is fresh. |
| 6 | Save | Apple, Google, email, or keep on this device. Handle is suggested and shown as an editable chip on the same step, one tap to accept | Removes a screen and two decisions. |
| 7 | Where do you watch? | Services only, six tiles. "Go to theaters too?" collapsed. Button: "Show my picks" | The one setup question that improves the first session. |
| 8 | Picks | Real screen. Three coach marks in place, each dismissed by using the thing: the match %, the popcorn, the Blend link | Learning by doing replaces the tour. |

Moved out of the first run and asked in context:

- Skip preferences: after the first "Not for me", one line: "Show fewer like this?" (the Show fewer nudge already exists).
- Theaters: the first time a theatrical pick appears.
- Notifications: the first watchlist add or the first movie night invite, where the benefit is concrete.
- Letterboxd link and "Who invited you?": a profile nudge. An invite link already identifies the inviter.
- The walkthrough: keep it in the menu as "How Montage works", with a Skip.

This takes the reveal-to-app path from about ten screens to two.

---

## 2. Will people trust the match %?

### 2.1 What the number is

`match-model.mjs` (v9) fits a per-person logistic over 13 features (crowd rating, nearest-film residuals, loved and disliked likeness, genre, director, decade and language leans, the label lean), with a population prior worth 20 films. The log-odds are then placed by **rank** against the person's own scores for the 6,000 most-watched films, through fixed anchors: the median film is 50, the top 10% is 70, the top 0.5% is 90, the best is 96. Read time pulls scores toward 50 for thin profiles (`spreadFor`: best about 76 at 10 rated, 80 at 20, 88 at 100, 93 at 300). Last, `shown-match.ts` remaps for display: stored 60 shows 66, 70 shows 82, 85 shows 92.

So the shown % is **where this film ranks for you among popular films**, stretched. It is not the chance you will like it. A shown 82 means "top tenth for you". A shown 50 means "middle of the pack", which for most people is a film they would rate about 3.5.

### 2.2 How accurate it is

From the backtests in this folder (honest, time-split or out-of-fold):

| Profile | Order quality (Spearman, 1 = perfect) | Against sorting by Letterboxd average |
|---|---|---|
| 500+ ratings | about 0.63 | 0.49 |
| 100 ratings | about 0.57 | 0.49 |
| 30 ratings | about 0.48 | 0.49 (no better) |
| New in-app accounts, live | 0.2 to 0.3 | about the same |

Finding favorites, 19 accounts: precision in the top 10 is 0.775 for the model against 0.712 for the crowd average alone (0.925 for heavy libraries). The model is real, and for an established account it is good. For a new account it is, today, mostly the crowd average with a personal accent.

Live check I ran (all 221 rated rows in `match_predictions`, 19 people, the shown % rebuilt with the display curve):

| Shown % | Label shown | Rows | Mean stars | Rated 3.5+ | Rated 2.5 or less |
|---|---|---|---|---|---|
| under 40 | Probably not for you | 29 | 3.59 | 66% | 14% |
| 40 to 64 | A mixed fit for you | 67 | 3.95 | 81% | 3% |
| 65 to 77 | We think you'll like it | 58 | 3.84 | 78% | 5% |
| 78 to 89 | We think you'll really like it | 53 | 4.02 | 85% | 4% |
| 90 and up | We think you'll love it | 14 | 4.11 | 93% | 7% |

Overall correlation between the stored score and the stars is 0.18.

Caveats, stated plainly: this is a small sample; people mostly rate films they chose to watch, which flatters every row; and the under-40 rows were mostly predicted when the account had almost no ratings (mean 2), a state the app now hides behind "Rate N more to unlock your match %". Even so, the shape is the finding: **the top band is right, and the bands below 78 do not separate.** A person who is told "Probably not for you, 34%" and then gives the film four stars has one clear memory of the app being wrong.

### 2.3 Failure modes

1. **False precision at the low end.** Above. The rank scale forces half of all popular films under 50 for everyone, including films the person would rate 3.5 or 4.
2. **The display curve is fitted in-sample.** The log says so, and gives the refit condition (200 out-of-sample rated predictions). Until then the stretch from 70 to 82 is a presentation choice. It makes mid-range numbers look more confident than the evidence.
3. **Cold start reads confident.** At 15 ratings the best match shows about 88% with "We think you'll really like it", on a model that at 30 ratings orders films no better than the crowd average. The spread damping helps; the words do not carry the uncertainty.
4. **Model 9 is unmeasured, and its share cap may cancel the cold-start shrink.** The caps (similar 42, taste 33, crowd 20, other 5) are recorded as "owner product decision, not a tuned value", and the log entry says "not measured on live scores". Only three rated predictions carry version 9. In `v3FitUser` the cap is applied to weights fitted on features that were already shrunk for a thin profile; shrunk personal features have small spread, so the crowd looks over its 20% share and the personal weights are scaled back up. That is the opposite of rule 1080, and of the backtest's first recommendation (lean on the crowd until the person has rated enough). The stored lists for thin profiles still look sensible, so the effect may be modest, but it should be measured with `scripts/eval-cold-start.mjs` and `scripts/eval-match-v9.ts` before it is trusted.
5. **Acclaim bias in the top list.** Across 23 accounts, the correlation between a person's stored score and the film's Letterboxd average runs 0.33 to 0.86 (median about 0.57), and nobody's top 50 contains a film rated under 3.3 by the crowd. Top lists are mostly canon films above 4.0. Safe, but it reads as "the same list everyone gets". The crowd floor (rule 1489) means the crowd can lift a film but a decent crowd rating never lowers one, which pushes the same way.
6. **Things that are not films score at the top.** Stored top-14 lists for thin profiles include "Music by John Williams" 95, "Folklore: The Long Pond Studio Sessions" 95, "Nirvana: Unplugged in New York" 95, "No Half Measures: Creating the Final Season of Breaking Bad" 94, "Interstellar: Nolan's Odyssey" 94. Picks filters most of these, but the film page still shows the number.
7. **Series pile-ups.** One 34-rating profile's top 14 holds eleven direct-to-video Barbie films at 94 to 96. Another holds five Hunger Games films. The nearest-film signal has nothing to stop it. Season tabs group series (rule 1460); the score itself does not.
8. **Duplicate entries.** "12 Angry Men" appears twice in one top list (the remake scored as the original's twin).
9. **The 0% sentinel.** Handled: rule 1508 treats a packed 0 as unscored, and `match_predictions` holds no zero. No action, but keep the invariant check.
10. **Popular-film bias in the usual sense is absent.** Popularity is pinned to zero weight (rule 310). The bias is toward acclaim, not popularity.
11. **Soft tells move the shown number by up to 7 points** from swipes (rule 1474). A number that changes without a rating will be noticed. It needs a visible reason when it happens.

### 2.4 What would raise trust most

Presentation first, because it is cheaper and the effect is larger.

1. **Digits only where they are earned.** At 65 and up show the number. Under 65 show the words alone ("A mixed fit for you", "Probably not for you") with no digits. People forgive a hedge; they remember a wrong number.
2. **Say how well the app knows them.** Under the number, by rated count: "Early read, from 18 films" (under 30), "From 140 films" (30 to 299), nothing at 300. The spread already encodes this; say it.
3. **Lead with the reason, not the number.** The why line is what makes a number believable. See section 5.
4. **Show the track record early and honestly.** The "Called it" count exists. Put it on the profile from three rated guesses, and include the misses: "We called 14 of your last 20." A system that admits misses is trusted more than one that never mentions them.
5. **When a guess misses, say so and ask one question.** After a rating that lands far from the guess: "We guessed lower. What did we miss?" with three chips. This is also the cheapest source of the stated reasons the why line lacks (section 5).
6. **Explain the number once.** A one-line footnote behind the %: "How this film ranks for you among the films people watch most, from your ratings."

Accuracy second.

7. **Measure model 9** against model 8 on the same rated predictions and on the held-out folds, and check the share cap on thin profiles (item 4 above). If thin profiles are worse, apply the cap only from 100 rated films.
8. **Lean on the crowd until 30 ratings, openly.** The backtest's own first recommendation. For a new account the honest label is "Loved by most viewers, and close to what you rated".
9. **Refit the display curve out of sample** when the 200 rows exist, and judge it by the like rate per band, not by eye.
10. **Cap a series at two in any ranked list** and drop concerts, making-of films and recorded shows from scoring displays everywhere, not only in Picks.
11. **Choose onboarding films that teach something.** Also from the backtest: a grid of films that everyone rates 3.8 to 4.2 cannot separate people. The seed deck's splitting films do this; the "Rate films you love" rows mostly do not.

---

## 3. Archetypes

### 3.1 What is there

Fifteen names that can lead and two streaks (`lib/taste/archetypes.ts`, `lib/archetype-info.ts`). Leads in the 23 stored profiles: Lovestruck 6, IMAX Idealist 4, Hardboiled 3, Nihilist 3, Midnight Cultist 2, and one each for Old Soul, Tenderhearted, Comic Relief, Animation Devotee, Voyager. Nobody leads as Disciple, Globetrotter, Aesthete, Eyewitness or Overthinker.

### 3.2 Overall judgment

The set is good. Most names are clear in one read, most flatter, and the tags are well written. The issues are few and specific.

1. **Grammar.** Copy says "You're a <archetype>" (rule 582 and the tour). Three names are adjectives (Hardboiled, Lovestruck, Tenderhearted), so "You're a Hardboiled" and "You're a Lovestruck" read wrong. Use "Your archetype: Hardboiled" or "You're Hardboiled", chosen per name. Check the share text and the handle step too.
2. **Lovestruck leads 26% of profiles**, against a stated ceiling of about 15%. The earlier review flagged this at 6 of 21 and it has not moved. If one in four people gets the same name, it stops feeling like a read. Worth a look at its family weighting before launch traffic arrives.
3. **Globetrotter is defined against English.** See 1.4. For a large share of the world it will be wrong in an obvious way.
4. **The plain thriller fan has no home.** Overthinker takes puzzle films (a film must score 65+ on brain demand). Someone who loves Prisoners, Sicario and Gone Girl for the tension lands on Nihilist or Hardboiled. Widen Hardboiled's wording to cover thrillers (below) so the name fits when it is given.
5. **Three follower words.** Disciple, Midnight Cultist and Animation Devotee all use the same religious metaphor. Individually fine; side by side on the archetypes page they blur.
6. **Two travel words.** Voyager (other worlds) and Globetrotter (other countries). The tags separate them well; keep the tags attached wherever the names appear alone.
7. **IMAX is a trademark.** A personality label on share cards and in App Store screenshots is a different use from mentioning a format. The risk is small but real, and a takedown request after launch would mean renaming the most common mainstream archetype. Have the replacement ready.
8. **Disciple is the least self-explanatory name.** Without its tag it reads as religious. It is acceptable only with "Follows directors, not titles." beside it.
9. **Nihilist is a streak on about half of all profiles** (11 of 21 in the earlier review). Overthinker was meant to relieve this. Re-count after launch.

### 3.3 Overthinker: verdict

**Keep it.**

For:
- It is the one name on the list that people already call themselves. Self-recognition is what gets a result shared.
- It is funny without being an insult, in the same register as Comic Relief and Old Soul.
- It describes the right behavior for this lane: rewatching to see how it was built, arguing about the ending.

Against, and how to handle it:
- It names a personality trait, not a kind of film, and it can read as a mild diagnosis. The tag fixes this. "Always piecing it together." is neutral. "You leave with a theory." (from the lane's own research doc) is flattering and specific. Use that.
- It does not say "thriller". It should not: the lane is puzzles and ideas, and the film gate already keeps plain thrillers out. Describe it to users as mind-benders, never as thrillers.

If the owner still wants to change it, in order:
1. **Mastermind.** Flattering, clear, fits heists of the mind and Nolan. Loses the humor. "One step ahead of the plot."
2. **Theorist.** Precise, matches the internal id, a little dry.
3. **Codebreaker.** Good image, slightly narrow.

Not recommended: Sleuth and Detective (they collide with Hardboiled, whose crowd word is Detectives), Puzzler (reads as a toy), Mind Bender (names the film, not the viewer).

### 3.4 Proposed final list

Names unchanged unless marked. Definitions are written to the brand rules.

| Name | One-line definition |
|---|---|
| Disciple | Follows directors, not titles. |
| Globetrotter | Films from everywhere, well beyond home. (Gate on films outside the person's home languages.) |
| Old Soul | At home in the classics. |
| Aesthete | Watches for the image, the cut and the sound. |
| Nihilist | Drawn to the dark and unresolved. |
| Midnight Cultist | Horror, cult and whatever plays after dark. |
| Hardboiled | Crime, thrillers and the double-cross. (Widened to give thriller fans a fit.) |
| Overthinker | You leave with a theory. (Tag changed.) |
| Voyager | Other worlds, and the journey there. |
| IMAX Idealist | Built for the big screen. (Fallback name if needed: Big Screen Believer.) |
| Eyewitness | Drawn to the true story. |
| Tenderhearted | Moved by people and ordinary lives. |
| Lovestruck | In it for the love story. |
| Comic Relief | Here for the laugh. |
| Animation Devotee | Animation as cinema, not as a kids' genre. |
| Contrarian (streak) | Rates against the grain. |
| Nostalgic (streak) | Still loves what it grew up on. |

---

## 4. Simplicity and depth

Read from the code and copy, not from use. TV is out of scope.

The structure is sound: five tabs (Picks, Browse, Tonight, Social, Profile), with one clear action in the middle. The depth is real and worth keeping. The cost is vocabulary. I count about 25 named ideas a new person can meet in the first week: Picks, Tonight, Three for tonight, Just pick for me, Pitch, mixes, Blend, Cinematic soulmates, Film DNA, strands, archetype, streaks, Canon, Spot on, Called it, How we did, Last night, Sharpen, Teach it your taste, Show less of, movie night, room, groups, lists, film goal, Your numbers, year in review.

**Merge (one name per idea).**

| Today | Proposed | Why |
|---|---|---|
| Spot on, Called it, How we did, "Our guesses for you" | Called it | Four names for "how accurate were we". |
| Sharpen your picks, Sharpen your profile, Teach it your taste, Show less of, Anything you'd rather skip | Tune your picks | Five entry points to one job. One screen in Settings, one name everywhere. |
| Tonight, Three for tonight, Just pick for me | Tonight | Tonight is the place; the others are buttons inside it and need no names of their own. |
| Movie night, room, "The room", theater (in code) | Movie night | "Your theaters" now means cinema chains (rule 1519). Keep "room" and "theater" out of anything a person reads about movie night. |
| Archetype, streak, "Also", "Close behind" | Archetype and streak | Two words, used the same way on the reveal and the profile. |

**Rename.**

- Pitch: the name does not say what it does. Label the field by its action, "Describe what you want to watch", and keep Pitch as the internal name.
- Canon: fine for film people, opaque for others. Sub-label it "Your all-time favorites" wherever it first appears.

**Hide until earned (progressive disclosure).** For an account under 30 rated or under a week old: lists, film goal, Your numbers, the season calendar, year in review, Canon tiers. They are good features for someone who is staying; for someone deciding whether to stay they are noise. Reveal each with one line when its condition is met, as the match unlock bar already does.

**Move.**

- Profile: lead with archetype, Film DNA and Canon. Put counts and charts behind one "Stats" row.
- Film page: above the fold, in this order: the match and the why line, where to watch, one action. Everything else below.
- Social for a newcomer: one screen with one action ("Send your link, see your Blend"), not an empty feed.

**Keep as is.** The five tabs. The match unlock at 15. Film DNA as the deep layer behind the archetype. Blend as the social hook.

---

## 5. The "why this fits your taste" line

The owner's target: name the specific aspect of the film that matches what this person likes, the way the app reads why they liked a film when they rate it, said like a person. "If you loved Whiplash, this has the same push between a brutal teacher and a student who won't break." No star numbers. The verb follows the rating (loved, really liked, liked). Another agent is building it in `lib/claude.ts` and `lib/taste/fit-copy.ts`; this section is about whether the data supports it. Note it reverses part of rule 1507, which asks for "which you gave 4.5★".

### 5.1 Does the data support it?

Partly. It supports "which of their films this one resembles, and in what general way". It does not, today, support "why they liked that film".

What exists:

| Source | Coverage | What it can back |
|---|---|---|
| `rating_reasons` (what a person says about their own rating) | **2 rows, 2 people** | Nothing yet. This is the only direct evidence of why someone liked a film, and it is empty. |
| `film_labels` (26 scored traits, flags, a one-line hook) | 27,919 films, mean confidence 61, 2,699 under 40; 18,397 of the 19,866 films with 5,000+ logs | Tone and form: pace, tension, warmth, humor, bleakness, scale, how much it asks of you. The hook gives the premise in one line. |
| Nanogenres | 15,323 of 19,866 films, three to five each | Shared situations and story types ("Student coming-of-age challenges", "Underdog fighting and boxing stories"). |
| The label lean (`labelFit`, `measuredReasons`) | Needs 30 rated films with a crowd rating | Which traits this person rates above the crowd. The only measured, per-person "what they like". |
| Nearest rated films (embedding and nanogenre overlap) | Any profile with 10+ rated | Which of their films to compare with. |
| Synopsis, cast, director, TMDB keywords | Most films | The film half of the sentence. |

Worked check on the owner's own example. Whiplash labels: propulsion 90, tension 92, warmth 15, character focus 80; hook "A driven drumming student pushes himself to the brink under a terrifyingly demanding mentor's gaze." Black Swan: propulsion 80, tension 90, warmth 10, character focus 80; hook "A ballerina's obsessive quest for perfection unravels into a terrifying descent into madness." The scored traits support "tense, driven, cold, about one obsessed person". The teacher and student dynamic is in Whiplash's hook only. So a sentence about a shared mentor would be the writer's inference from the two hooks, and for Black Swan it would be half right. The data backs the shared **quality**; the shared **dynamic** is the model's guess.

And the deeper gap: nothing says the person loved Whiplash for the mentor. They may have loved the drumming, or the ending. One film is not evidence of a reason.

### 5.2 Where it will fail

1. **Wrong reason for the anchor.** The line asserts why they loved Whiplash. When it is wrong, it is wrong about them, which costs more trust than a vague line.
2. **Invented common ground.** The nearest rated film is near in embedding space, not necessarily in the way a person would name. Asked for a specific shared aspect, the writer will produce one whether or not it is there.
3. **Thin profiles repeat one anchor.** At 15 to 30 ratings there are five or six loved films. Every pick in a row becomes "If you loved Inception". The label lean does not exist under 30, so there is no second source.
4. **The anchor is the same series or the same director.** "If you loved The Two Towers, this is also Middle-earth" is true and empty. `readEvidence` already drops the series; directors are not dropped.
5. **Verb and score disagree.** "If you liked X" (3.5 stars) beside a 91% match reads weak; "If you loved X" beside 58% reads like a contradiction. The anchor's strength has to fit the band.
6. **Stale verbs.** The line is cached (rule 1528). If the person re-rates the anchor, "loved" may no longer be true.
7. **The real reason is acclaim.** For many high scores the crowd term does most of the work (section 2.3, item 5). A taste reason for such a film is a story told after the fact.
8. **Weak labels.** Low-confidence labels and the thin Indian-language coverage (30 labelled Telugu films) mean the film half is guessed for exactly the films the home-language row would add.
9. **Spoilers.** "The same kind of twist" spoils both films. The `twist` flag must never reach the sentence.
10. **Low and mixed bands.** "If you loved X" does not fit a 45% film. Those need the caveat-first form the app already has.

### 5.3 How to make it reliable

1. **Compute the shared ground in code, then let the writer phrase it.** For the candidate and each possible anchor, list what both have: shared nanogenres, traits where both score high or both low (each past a threshold, both labels at confidence 50+), same lead or director. Pass that list as the only allowed basis. The writer may phrase it in human terms using both hooks; it may not add a quality that is not on the list.
2. **Choose the anchor by rule.** Rated 4 or more; among the nearest ten; not the same series; shares at least two items from the list in step 1; not used on more than two lines in the same row or screen.
3. **Triangulate when possible.** If two or three of their loved films share the same item with the candidate, say so: "You loved Whiplash and Black Swan. This has the same obsessive drive." Two films make a pattern; one makes a guess. Prefer this form whenever it is available.
4. **Hedge the reason, assert the likeness.** "If you loved Whiplash, this has the same..." is already the right shape: it claims the films are alike, not that it knows why they loved it. Keep the conditional. Never write "You loved Whiplash for its...".
5. **Use the measured lean as the second source from 30 ratings.** When `measuredReasons` says tense films land above the crowd for this person and the candidate is tense, that is a reason with evidence behind it.
6. **A fallback ladder, so the line is never forced.**
   - Two or more anchors share a listed quality: the pattern form.
   - One anchor shares two or more: the "If you loved" form.
   - No good anchor, 30+ ratings, a measured lean applies: "You go for tense, fast films, and this is both."
   - None of the above: say what is true. "One of the best-loved crime films of the decade, and close to what you've rated so far."
7. **Verb table, enforced by a validator, not by the prompt.** 4.5 and 5 stars: loved. 4: really liked. 3.5: liked, and only when the shown match is under 78. Never anchor on 3 or less. Reject and regenerate if the title is not in their rated list or the verb does not match. Key the cache on the anchor's current rating.
8. **Start collecting the missing evidence.** The stated reasons are the long-term fix.
   - After a rating of 4 or more, one optional tap: "What made it?" with four chips drawn from that film's strongest traits (for Whiplash: "The tension", "The two leads", "The ending", "The music"). The chips exist (`lib/rating-chips.ts`); two rows of data say almost nobody reaches them. Put them in the rating sheet itself, one tap, no second screen.
   - On the why line, a small "Not why" control. A tap is a negative label for that aspect and that anchor.
9. **Test before launch.** Generate 100 lines across thin, medium and heavy profiles. Check each by hand or with a judge prompt on three questions: is the shared quality on the computed list, is the anchor one of their films with the right verb, does it reveal anything past the synopsis. Ship when the first two pass 95 times in 100.

### 5.4 How to make it land

- One sentence. The anchor first, then the shared quality in everyday words.
- Name a feeling or a dynamic, not a genre. "The same slow dread" beats "another psychological thriller".
- Use their most-loved anchor that fits, not the nearest. People respond to their favorites.
- Vary the opening across a row so it does not read as a template.

Sample lines in the brand voice:

- *Because you loved* Whiplash: the same obsessive drive, and nobody backs down.
- If you loved Parasite, this has the same quiet dread under a polite surface.
- You really liked Knives Out and Gone Girl. This plays the same game with who to believe.
- You go for warm, funny films about friends, and this is one of the best.
- One of the best-loved crime films of its decade, and close to what you've rated so far.

---

## Appendix: checks run

- `match_predictions`: 260 rows, 221 rated, 19 people, 2026-09-30 to 2026-11-11; 26 marked displayed, 15 of those rated; no stored 0. Band table in 2.2.
- `user_score_vec` joined to `score_catalog` (position equals `ord`) and `films`: per-profile correlation of stored score with Letterboxd average, top-50 crowd mean, top-14 titles for the five thinnest profiles.
- `films` by `original_language`: catalog size, log thresholds, embedding and label coverage (table in 1.4).
- `rating_reasons`: 2 rows. `film_labels`: 27,919 rows, mean confidence 61.
- `public_profiles`: 23 profiles, 13 with a Letterboxd import, archetype lead counts.
- `events`: `search_miss` only in the last 30 days.

Not checked: anything in PostHog; the app running on a device; model 9 against model 8 on held-out data (needs the service key and the eval scripts).
