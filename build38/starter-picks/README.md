# Starter picks, as they are today (2026-11-14)

**Method.** The real web Picks page from montage `origin/main` at `1769911b` (a detached worktree, `next dev`), at 393x852, 2x, in Playwright, signed in as a new account at **18 rated / 18 logged** (rate path, day 1). Every `/api` answer is faked by `capture.mjs` (a record of the run; it imports the earlier flow capture's `fake.mjs` from the session scratchpad). The films, their % and their order are stand-ins; the tabs, the cards, the labels and which list feeds which tab are the app's own.

`sheet.png` puts them side by side. The single shots:

| File | What |
|---|---|
| `01b-tabs-day1.png` | The tab row on day 1: **For you · Cozy autumn (dot) · New releases · Starter picks**, the last cut off at the right edge |
| `01-picks-day1-for-you.png` | For you, card 1: "Your pick today", with the popcorn coach mark |
| `02-for-you-card2-starter-1-of-6.png`, `03-...-2-of-6.png` | For you cards 2 and 3, labelled **"Starter · 1 of 6"**, "2 of 6" |
| `04b-tabs-starter-selected.png` | The row with Starter picks selected |
| `04-`, `05-`, `06-starter-picks-card*.png` | The Starter picks tab, cards 1 to 3: the same films as For you's cards 2 to 4 |

## Who sees it

A **newcomer**: fewer than **30 rated**, or fewer than **100 films logged** (web `Discover.tsx` `newcomer` = `ratedFilms < NEWCOMER_RATED (30) || totalFilms < BUILD_LIBRARY_MIN (100)`; iPhone `PicksBanners.swift` `rated < 30 || total < 100`; the route itself does not check, the app decides whether to ask). That is everyone coming out of the 15-film reveal, guests included, and anyone whose import has under 100 films. Never on someone else's Picks. The tab appears only once the list comes back non-empty.

## How its films are chosen

`POST /api/weekly-pick { mode: "starter", reasons: false }` → `lib/weekly-picks.ts buildStarterSet`, rebuilt on every request, no model call:

1. **Pool:** the shared popular and canon lists, plus films in the account's chosen languages.
2. **Kept:** has a poster; popular (rule 89's 400k Letterboxd logs) or in a chosen language (100k); crowd average **3.8★ or more**; passes the first-films floor (`firstFilmsOk`); not on the never-a-weekly-pick list; **not already seen**; fits the viewing preferences.
3. **Ranked:** the person's predicted match **plus about 2 points per tenth of a star above 3.8** (`fallbackRank`), less any Show less of points.
4. **Trimmed to 10:** one film per series, no sequel before its original is seen, at least a quarter in a chosen language.
5. The client sorts the 10 by match, best first. The tab shows up to 12. No reason line.

With no profile behind the request (signed in, nothing rated) it is the same pool ranked by the crowd alone, one list for everyone, cached for the week.

**The same list also fills For you.** For a newcomer, For you's week slots use the Starter list (`week={starterPicks.slice(0, 6)}`, `weekLabel="Starter"`), so For you's cards 2 to 7 read "Starter · N of 6" and are **the Starter tab's first six, in the same order**. The iPhone does the same (`PicksModel.applyStarter`, "Starter pick · N of M"). On day 1 the Starter tab repeats For you. It is not "popular-for-everyone": once there is a profile it is ranked by that person's match, with a crowd bonus.

## When it disappears

When the account stops being a newcomer: **30 rated AND 100 films logged**. Both must hold. A rate-path user who reaches 30 ratings but has logged under 100 films keeps it. Nothing else removes it: not For you having strong matches, not opening it, not time. It also goes if the list comes back empty (everything seen, or the read failed).

This corrects the walkthrough's item 5 premise slightly: Starter picks does not end at 15 rated. Hiding it "once For you has matches" would hide it for everyone leaving onboarding, which is fine, since For you already shows the same six.
