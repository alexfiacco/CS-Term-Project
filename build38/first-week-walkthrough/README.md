# First week in Montage: a new user's walkthrough (2026-11-14)

**Method, and what this is not.** The brief asked for a live walk of https://montagefilm.app at 393x852. From this
session the host is blocked: the egress proxy refuses the CONNECT to `montagefilm.app:443` with a 403 (policy
denial, recorded in the proxy status). So no new screenshots were taken and no account, guest or otherwise, was
created (nothing to delete). Instead:

- **Screenshots** are the most recent real captures already in this repo, renumbered in journey order:
  `01`-`19` are the owner's live onboarding walk of 2026-11-12 (`mockups/journeys/b47-onboarding-full-live`,
  786x1704, a phone width); `20`-`38` are the live audit of 2026-11-10 (`mockups/journeys/audit-b35-r2`), which
  used a **seeded, established test account** ("Alex Reed", 1,260 films), so its counts and people are not a
  day-1 user's. Files marked `-OLD` show screens that have changed since; `M1`-`M5` are the owner-approved mocks of
  what ships now for those screens (labelled as mocks, not captures).
- **Everything else is read from the code on `main` at `965f5787`** (web `app/`, `lib/`; iPhone `ios/Montage/Sources`),
  with `docs/app/*` as a map. Nothing was run. Where I say "fires", I mean the code's conditions allow it.
- `contact-sheet.png` (2090x3520) shows all 43 images with their numbers.

The principle checked against: **three front doors (Picks, Tonight, Pitch); everything else appears when relevant;
at most one nudge per session.**

---

## 1. The journey, screen by screen

Columns: what the user must understand · new terms (bold the first time) · choices.

### Onboarding (rate path, then guest save)

| # | Screen | Asked to understand | New terms | Choices |
|---|---|---|---|---|
| 01 | Welcome, "What kind of viewer are you?" | Montage reads your taste into a type | **viewer type / archetype** ("See the 15 archetypes") | Find your taste · I'm on Letterboxd · See the 15 archetypes · Sign in · Search · "See what Montage does" |
| 02 | Rate films you love | Tap posters you've seen, give stars | **Your kind of films** | Search · Your kind of films › · tap any poster · Pick films for me |
| 03 | Your kind of films sheet | Optional genre, language, era, subtitles filters | (Subtitles preference) | ~40 chips in 4 groups · Done |
| 04 | Rate, 13 rated | The run is kept below | **Your shelf** | tap a shelf poster to edit · Next: rate a few we pick |
| 05-06 | The deck | Rate or skip one film at a time; the ring top right is a locked tease | **Screen DNA** (the dashed ring, `DnaTease`, tappable) | 5 stars (half by tap side) · Haven't seen it · Watchlist · Seen it, no rating · Not for me · × |
| 07 | "Your taste is ready to read" | 15 is enough; more sharpens | — | See my taste now · Keep rating |
| 08 | Reveal beat 1 | "Reading your 15 films." | — | none (timed) |
| 09 | Reveal beat 2 | Your name | the archetype itself ("Overthinker"), **streak** ("with a Nihilist streak") | none (timed) |
| 10 / M1 | Reveal first screen | Why this name; does it fit | "What it means for you: **slow-burn** and **complex** films lift your ratings most" (strands, unnamed), runner-up in Not quite | See my picks · Not quite you? › (drawer: Rate five more / Start your taste over) |
| 11 / M2 | Reveal lower half (since rule 1960) | Four picks with % and a reason | **Screen DNA strands** ("Your top Screen DNA strands"), **match %** ("96% match"), **Blend** | Save and open my picks · Blend with a friend · Share my card · import link · fine print |
| 12 / M4 | Save drawer | Keep it; account or guest | **handle** (@overthinker chip), **guest** ("Not now · keep it in this browser") | Apple · Google · email · Not now (guest) · Sign in |
| 13-14 | Where do you watch? | Picks use your services | (services, theaters: plain) | logo tiles · More services · Go to theaters too? · Show my picks · Skip. **A guest never sees it** until they save (SCREENS-ACCOUNT "Where do you watch?"). |
| 15-18 / M3 | Walkthrough (now v11, 5 cards) | The three doors plus social | **Your pick today**, **Tonight** + the popcorn, **Pitch** + **shortlist**, **Watch together**: Blend %, *Cinematic soulmates* (a Blend band), groups, **movie night**, Invite friends | Next / tap anywhere · Skip to my picks (card 1) · iPhone: 6th card, notifications (Maybe later / Turn on) |
| 19 | Picks, first visit | The % on the card | (match % again, as a tip bubble) | swipe · Trailer · Send · Seen it · Watchlist · Not for me · tabs |

**By the end of onboarding: 16 new Montage terms** (archetype, your kind of films, shelf, Screen DNA, streak, strands,
match %, Blend, Blend band words, handle, guest, pick today, Tonight/popcorn, Pitch/shortlist, movie night, groups).
The guest path skips the services step, so a guest's first Tonight has no "on your services" filter.

### Day 1 (from the seeded captures plus code)

| # | Screen | Asked to understand | New terms | Choices |
|---|---|---|---|---|
| 19-20 | Picks › For you | One film a card; the first is today's, then the week's | **For you**, **Today** ("YOUR PICK TODAY"), **Weekly pick · 1 of 4**, *Because you loved* line | swipe up · tap poster · Trailer (autoplays after 4s) · Send · Seen it · Watchlist · Not for me · sideways swipe = next tab |
| 21 | Picks › Cozy autumn | A season tab (blue dot until opened; intro card on first open) | **season tab**, **Starter picks** tab, **New releases** tab | Start · tabs |
| 22-23 | Film sheet, "Your match" | Why it fits, in bands | **Why this fits your taste** (fit / mixed / low reads), **lanes** (chips like "Slow-burn crime ›") | Watchlist · Lists · **Canon** · Send · stars · Seen it, no rating · Discussion |
| 24-25 | Rating it | Our guess vs your stars | **"We guessed 91% · Called it ✓"**, **Spot on / Close / We undersold it / We overshot it** (verdicts), **take** ("What stuck with you?", Friends/Everyone, Spoilers), first-time **"What did you like?"** chips | stars · half-star coach mark · chips · take box · Done |
| — | After a hit (member only) | More like it | (Spot on drawer, "More like this") | open a film · lane · × |
| — | Not for me (first time) | We can push kinds down | **Sharpen your picks?**, **Show less of** | kind chips · Something else… · Just this film · Done |
| 26-29 | Tonight (popcorn) | Mood + who's watching → one film | **moods** (8 + More moods), **Who's watching**, **Anything else?**, **Popularity / Hidden gems**, **Re-roll** (dice), **↻ Rewatch** stamp, **ticket**, **Watch this tonight** | up to 3 moods · genre · Pick with these · or just pick for me · Re-roll · Watch this tonight · Pitch it › |
| 30 | Browse | The catalog | **Made for you** (taste mixes), **Moods / Genres doors**, **Every film** | search · Pitch button · doors · mixes |
| 31-32 | Pitch | Describe a film in words | **free pitches** ("8 free pitches left this month"; 10 a month, +3 per invite), **We read it as / Understood as** chips, **Steer it / Narrow it**, **Choose one from these** | type or mic · Or try chips · chips × · + Add · Choose one from these · rows |
| 33 | Social | Your people, movie nights | **Your people**, **Blend %** under faces, **Suggested for you**, **Recent takes**, **Lately**, **Groups**, **Admit all** ticket | Find · Follow · Start a movie night · Invite · People / Groups |
| 34-35 | Profile | Your type, stats, DNA | **Your mix**, **Your lanes**, **Films that define you**, **Canon**, **Early read** (dashed DNA), **Where your taste sits**, **Against the crowd**, **Your numbers**, **What opens when** (15/30/50/100), **Nº** member number, and the *second* **streak** ("N-week streak", a watch streak) | Edit profile · Share profile · Taste/Films/Watchlist/Lists · Why <archetype> · ⓘ term drawers |
| 36-37 / M5 | ☰ menu, Settings | Account and tuning | **Tune your picks** (More of this / Less of this / "Changes Picks, not your Screen DNA"), **Tune for you**, **Hidden films** | View public profile · Settings · Tune your picks · How Montage works · Feedback · Sign out |

**Day-1 additions: about 33 more terms**, so **about 49 Montage terms by the end of day 1** for someone who opens every
tab once (the path this brief asked for). A user who only uses Picks meets about 25.

---

## 2. The counts

| Measure | Count | Notes |
|---|---|---|
| New terms by end of onboarding | **16** | listed above |
| New terms by end of day 1 (every tab) | **~49** | ~25 if they stay on Picks |
| Words with two meanings | **1: "streak"** | archetype streak ("with a Nihilist streak", glossary `streak`) and the weekly watch streak ("3-week streak", `WeeklyStreak.tsx`) |
| Nudges a day-1 **member** can meet in one session (beyond the onboarding asks: save, services, walkthrough) | **~17** | match-% tip, season dot + season intro card, term lines (1 per screen: archetype, streak/lean, Screen DNA, Pitch, Tonight), OnceTips (match stamp, Watchlist bookmark), first-rating chips ask, take step, Spot on drawer, Sharpen your picks (after a Not for me), unlock-ladder row ("Rate N more to firm up your Screen DNA"), "Who invited you?" card, "Your read got sharper" (5th Picks rating), Home Screen banner (phone browser only), Watching tonight card (evening, after a Tonight pick) |
| Same for a **guest** | **~15** | no Spot on drawer (rule 1415 excludes guests), no services step; guest save banner waits for visit 2 |
| Distinct "ways to get a recommendation" visible on day 1 | **16** | reveal's four picks · Today's pick · Weekly picks · For you deck · Cozy autumn tab · New releases tab · Starter picks tab · Tonight · Pitch · search's "Pitch this instead" · Browse mood/genre doors (sorted for you) · Made for you mixes · lanes / "Because you like" · More like this (Spot on, film page) · Blend ("a list you'd both love") · movie night. Later: Three for tonight (visit 3), blind spots (30 rated), Friends enjoyed (3+ friends' films), ranked watchlist |

There is **no shared nudge budget** anywhere. Each prompt has its own cap (once per account, once a day, 14-day rest),
plus "one tip per screen" (`InlineHint.tsx`), "one term line per screen" (`TermTip.tsx`) and, on the iPhone only, the
soft-tells ask's own "one nudge a session" (`DaySignals.swift:520`). Nothing stops five different features from asking
in the same session.

---

## 3. First-week nudge timeline (from code)

"Visit" on the web is a page load. On the iPhone it is a launch. Picks' first-visit sequence is
`PicksFeed.tsx:290-335` (web) and `PicksScreen.swift:616-657` (iPhone).

| When | Prompt | Trigger | Platform |
|---|---|---|---|
| Onboarding | Half-star coach mark | first star row ever (the deck) | both |
| Onboarding | Save drawer, Where do you watch?, walkthrough (5 cards) | fixed order (rule 1589) | both; a guest skips services |
| Onboarding | Notifications soft ask (6th tour card) | iOS not yet asked | iPhone |
| Day 1, visit 1 | Match-% tip bubble | first Picks card with a % | both |
| Day 1 | Season tab blue dot + intro card | season running (Cozy autumn, Nov 1-30) and not opened | both |
| Day 1 | Term lines | first time each word is on a screen, one per screen | both |
| Day 1 | OnceTips (stamp, Watchlist bookmark, Blend %, hold a post) | thing first comes into view; Blend needs a person, hold is iPhone only | both |
| Day 1, any rating | Guess line + "What did you like?" chips (first time) + take step + **Spot on drawer** (hit or liked-more, **no daily cap**, `SpotOn.tsx:308-345`) | Seen it on a film with a shown % | both; Spot on not for guests |
| Day 1, every 5th Picks rating | "Your read got sharper" | at most once a day | both |
| Day 1, first Not for me | "Sharpen your picks?" drawer | first ever | both |
| Day 1 | Home Screen banner | after first Tonight pick or first save/rate; once a session, 14-day rest, gone after 2 dismissals | web, phone browser only |
| Day 1 | Unlock-ladder row, "Who invited you?" (14 days), "Is @x your Letterboxd?" (only with that handle) | own profile, one card at a time | both |
| Day 1 evening | Watching tonight card | Tonight's pick time + runtime + 20 min | both |
| Day 2 (visit 2) | **Popcorn coach mark** ("What to watch tonight") | second Picks visit | both |
| Day 2 | "Did you watch it?" as For you's first card | a Tonight pick yesterday (asks for 2 days) | both |
| Day 2 | Local push "Did you watch…" at 10:00 | Watch this tonight and notifications on | iPhone |
| Day 2 | "How did you find Montage?" | a day after sign-up, Social, never answered (`/api/found-via`) | both |
| Day 2 | Guest save banner on Picks | guest's 2nd visit (or 10 more ratings on visit 1); Later rests a day | both |
| Day 2+ | **App Store review prompt** | first happy moment from day 2: rating 4★+ a 70%+ pick, a movie night locked, or an 80%+ Blend | iPhone |
| Day 3 (visit 3) | **Three for tonight** (the reveal's top picks again) + Tonight reminder drawer (Remind me → email at 16:00 UTC next day, or Apple's prompt on iPhone) | welcome owed and both popcorn and swipe marks unseen at launch | both; web swaps Picks for the Browse layout that visit |
| Day 3 (iPhone) / day 4 (web) | Swipe coach mark ("Swipe up for the next film") | after the popcorn visit | both |
| Day 4+ | In-app notification ask card | 3 days after the tour card, at a film saved, Watching tonight or a message sent; 3 at most, 3 days apart | iPhone |
| Any day after 10 deck cards | "Seeing too much <kind>?" deck card | 2 Not for me, or 5 of last 20 passed and over-served; once per kind, 7 days apart | both |
| Days 3-7 typically | "You keep skipping <X>. Show fewer?" | a facet's soft-tell offset reaches -4 (skips over several days) | both |
| Crossing 30 rated | "Your Screen DNA is set" toast | once per account | both |
| Monday 15:00 UTC | Weekly digest email | weekly cron | email |
| Daily 16:00 UTC | "Did you end up watching…" email | Remind me on Three for tonight | email |
| Daily, 9am local | Spot on push + daily Spot on drawer | a Letterboxd diary film rated (import users) | push iPhone; drawer both |
| Friday 5pm local | Blends push | has an unmuted Blend with new picks | iPhone |
| Week 2+ | Weekly streak chip; Friday streak row in Activity (a run of 2+ weeks with this week empty) | not in week 1 | both |
| Starting out | Rate what you've seen card | **hidden** under 50 rated and 100 films (rule 283) | both |

### Collisions (two or more in one session)

1. **One rating, up to five prompts (day 1).** Seen it → guess line → "What did you like?" chips → take step
   ("What stuck with you?", Friends/Everyone) → close → Spot on drawer with More like this → on the 5th Picks rating
   "Your read got sharper" → web phone browser: the Home Screen banner (a rating is its "moment"). On iPhone from
   day 2 the App Store review prompt can follow the same 4★ rating as the Spot on drawer.
2. **Picks visit 2:** popcorn coach mark + "Did you watch it?" card + (guest) the save banner, plus the Home Screen
   banner and, on Social, "How did you find Montage?".
3. **iPhone launch 3:** Three for tonight in Picks' header **and** the swipe coach mark on the first card
   (`PicksScreen.swift:271-276` and `:616-627` both open on `!firstVisit`).
4. **Not for me, early on:** undo toast + "Sharpen your picks?" now; days later the deck card and the
   "You keep skipping" ask target the same kinds (HideAsk makes Not for me's ask go first, but there is no gap
   between that and the deck card beyond the deck card's own 10-card and 7-day rules).
5. **Crossing 30 during a Picks rating:** "Your Screen DNA is set" toast + Spot on drawer + "Your read got sharper".
6. **A Tonight pick in the evening:** Watching tonight card + Home Screen banner (first Tonight pick is a moment) +
   iPhone day 4+: the in-app notification ask (Watching tonight is one of its moments).

---

## 4. Recommendations, ranked

Every feature stays; each change is only *when* or *where* it first appears.

1. **One prompt slot per session, shared by web and iPhone.** A single `claimPrompt(kind)` (web `lib/`, iPhone
   `Core/`) that the proactive prompts ask before showing: Spot on drawer, "Your read got sharper", Sharpen your
   picks, the deck's tune card, soft-tells ask, guest banner, Home Screen banner, FoundVia, Who invited you?,
   Watching tonight, review prompt, iPhone notification ask, season intro, Three for tonight. Priority:
   things the user started (their rating's Spot on) > time-bound (Watching tonight, Did you watch) > asks
   (notifications, review, invite) > education (tips, term lines). Losers wait for the next session; nothing is
   dropped. *Reachable:* everything, unchanged. *iPhone:* the review and notification policies already keep their
   own timers; they would also ask the slot.
2. **Make a rating one step during the first week.** Stars + guess line only. The "What did you like?" chips appear
   from the 10th in-app rating; the take step from the first follow (takes are for friends; a guest's take is
   friends-only anyway). Cap the after-rating Spot on drawer to once a day with the daily drawer's
   `mtg_spot_on_at`, and never in the first session. *Reachable:* the film page's take box and Discussion,
   Your numbers' "How we've done".
3. **Cut the lower reveal to the picks and Save.** Drop "Your top Screen DNA strands" and "Blend with a friend" from
   the reveal (M2). Screen DNA and strands first appear on the Profile with the 30-rated "Your Screen DNA is set"
   moment; Blend first appears on Social, or when someone follows a person. *Reachable:* Profile › Taste, share
   card, Social. This removes 3 of the 16 onboarding terms.
4. **Walkthrough: three cards for the three doors.** Picks, Tonight, Pitch. The Watch together card (Blend %,
   *Cinematic soulmates*, groups, movie night) moves to Social's first visit as its empty-state header (Social
   already teaches with Suggested for you). iPhone: the notifications card stays last (it is the soft ask). Removes 4
   terms from onboarding. *Reachable:* "How Montage works" in ☰ keeps all five.
5. **Picks on day 1: one tab plus New releases.** Hide Starter picks once For you has matches (anyone at 15 rated;
   it is popular-for-everyone and duplicates For you for this user). Hold the season tab's dot and intro card until
   visit 2. Drop the "Weekly pick · 1 of 4" label on day 1 (the week means nothing on day 1); it starts on day 2.
   *Reachable:* Starter picks stays for under-15 newcomers; the season tab is there, just undotted.
6. **Rename the weekly watch streak.** "N-week streak" collides with the archetype's streak, which the owner fixed
   in the reveal (rule 2027). Proposal: "N weeks in a row" on the chip, "Weekly run" in its sheet. Needs the owner.
7. **Fold the Taste tab under 30 rated.** Show the archetype, Films that define you and the dashed Screen DNA; fold
   Where your taste sits, Against the crowd, Your numbers, Canon and lanes under one "More about your taste" row
   until 30 rated or a tap. *Reachable:* the row, every ⓘ.
8. **Three for tonight: fix the drift, then decide.** It now lands on visit 3 (see bugs). For the rate path it repeats
   the reveal's top picks a third time. Show it only to import users (whose reveal had no picks scroll), or make it
   the evening's Tonight entry on day 1. *Reachable:* Tonight, Picks.
9. **Tune your picks enters on the first Not for me.** Hide its ☰ row until the user has a Less of entry or 5 skips
   (its dot logic already exists); keep Settings › Tune for you's row and the Taste tab link. Fine as is on iPhone,
   same change there.
10. **Pitch: hide the allowance until it matters.** "8 free pitches left this month" introduces a currency on the first
    pitch. Show the count from 3 left. *Reachable:* the count in the drawer's foot once low; the invite drawer's
    "+3 Pitches".
11. **Term lines: one per session app-wide**, not one per screen (today a day-1 walk can show five).
12. **Ask a guest's services on their first Tonight open**, inside Tonight's "Streaming on" row, instead of never until
    they save. *Reachable:* Settings › Your services.

---

## 5. Bugs and confusing things found

1. **Live app unreachable from here** (proxy 403 on `montagefilm.app`). The walk was not run; this is a code read.
2. **Three for tonight now comes on the third visit, not the second.** The web decides "first visit" as "popcorn and
   swipe marks both unseen at page load" (`HomeShell.tsx:2316-2322`); rule 1567 moved the popcorn mark to visit 2,
   so visit 2 is still "first" and the welcome waits until visit 3. Same on iPhone (`decideVisit`,
   `PicksScreen.swift:631-639`). The comment still says "waits for the second visit". Probably unintended drift.
3. **iPhone launch 3 shows two first-run things at once:** Three for tonight in the header and the swipe coach mark
   (both gated only on `!firstVisit`), against rule 1392's "one thing".
4. **The after-rating Spot on drawer has no daily cap** (`SpotOnAfterHost`, `SpotOn.tsx:313`), unlike the daily
   drawer (one a calendar day). Five good ratings in Picks can mean five drawers.
5. **Parity gap:** the iPhone never shows the daily Spot on drawer on the first Picks visit
   (`PicksScreen.swift:262-268`); the web's `SpotOnPicks` only excludes the welcome visit (`Discover.tsx:979`).
   For an import user whose diary films are already judged, the web could raise it on visit 1 next to the match tip.
   Not reproduced.
6. **"Streak" means two things** (archetype streak vs weekly watch streak), both on the profile head's first screen.
7. **Guest has no services on day 1**, so Tonight and Picks can't honour "on your services" until they save.
8. **Capture 19 (2026-11-12)** shows a "Friend…" tab for a brand-new account; `FRIENDS_LOVED_MIN = 3` should hide it
   with no friends. It may have been a test account with follows; not verifiable from here.
9. Docs drift: SCREENS-ACCOUNT "Welcome walkthrough" still describes `TOUR_VERSION = 8` in its states, behaviours
   and code lines; code is 11 (`WelcomeTour.tsx:36`, `WelcomeTour.swift:31`). `ProfileMenu.tsx` comment says
   "renamed 2026-11-14 from Tune your picks" (meant What we've learned).

## Files

- Screenshots: `01`-`38` (captures, 2026-11-10/12), `M1`-`M5` (current approved mocks for changed screens).
- `contact-sheet.png`: all 43, numbered, 2090x3520.
