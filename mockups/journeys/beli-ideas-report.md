# Beli, studied for Montage: what it does and what's worth adapting

Written 2026-11-04. Research only, no code changes. Beli facts are cited inline as [n] (sources at
the end). **How the research was done:** web search only. Fetching pages directly was blocked in
this session: `en.wikipedia.org` and `beliapp.com` don't resolve here, because they aren't in the
session's allowed network domains. So every Beli fact below comes from search-result summaries of
the cited pages, not from reading them in full. The Explore details (the sentence search, "Recommended for
you and @friend", the Open now and Reserve chips, the card layout) come from **the owner's
screenshots**. No published source describes that screen yet, so it is marked *(screenshots)*.
Anything I couldn't confirm is marked **unverified**.

Rule throughout: copy the mechanics, never the look. That means no green, yellow or red score
circles, and none of Beli's names ("Been", "Want to Try", "Rec Score", "Plated", "Featured Lists").
Montage keeps its own words (match %, watchlist, Canon, lanes, Blends) and its single-accent style
(docs/NAV.md: "One accent at a time... No rainbow of status colors").

---

## 1. Plain summary

**What Beli is.** Beli is a social restaurant log. Eliot Frost and Judy Thelen, who met at Harvard
Business School, launched it invite-only in June 2021 [1][2][3]. By August 2026 it had over 120
million ratings across 2 million places in more than 50,000 cities [4]. Monthly active users went
from about 200k at the start of 2024 to about 1.1M by October 2025 (Sensor Tower, as cited by the
Boston Globe) [4]. About 80% of users are under 35 [1][5].

**Its core trick: you never pick a score.** You choose one of three sentiments ("I liked it", "It
was fine", "I didn't like it"), then answer a few "which did you prefer?" questions against places
you've already rated. Those answers set the place's position in your list, and the app turns the
position into a 0–10 score [6][4][7]. Every list therefore has a strict order with no ties. Scores
also move as you add more places, and the formula isn't published [4][6].

**Why it grows:**
1. Logging is fast and fun, and you get a ranked list out of it straight away.
2. You see two numbers on every place: a predicted score just for you, and your friends' average [8][9].
3. There is a lot of competition: city and school leaderboards, a ranking by how many places you've
   logged, weekly streaks and yearly goals [1][10][11].
4. Growth is gated on invites. People had to invite others to get in (one account says four people
   before signing up), and invites still unlock features and leaderboard standing [12][1][13].
5. There's a shareable yearly recap ("Plated") [14].

**What's new at Beli:**
- **Resy booking inside the app, October 2026:** a Reserve Now button for US Resy restaurants [15].
  This is almost certainly what the Reserve chip in the screenshots does.
- **Explore** *(screenshots)*: a map with score pins and a sentence search bar. It also has
  recommendations for you and a named friend together, filter chips, and cards showing the score,
  how many people rated it, photos, distance and open-now.
- **Supporting signals:** a 2026 job posting for an AI/ML intern to work on "personalization,
  search, and discovery" [16]. The app is at version 9.18.2, dated 27 Oct 2026 [17].

**What Montage already has.** Montage already covers most of Beli's important mechanics, often more
deeply:
- a match % on every film, with the "why"
- taste match with friends
- recommendations for two people together (Browse "Who's watching", Tonight with a friend, Blends)
- weekly streaks, a friend feed with takes, group superlatives, and recaps (built but switched off)

**What Montage lacks:**
- the comparison-based rating that produces a strict personal order
- friends' scores and a rating count on every card
- a sentence search box (Recut is specced but not built)
- a "watch it now" action as direct as Beli's Reserve button
- yearly goals and leaderboards
- an invite reward
- tagging who you watched a film with

### The top 8, ranked by impact for the effort

| # | Idea | Effort | Cheap? | Why it ranks here |
|---|---|---|---|---|
| 1 | **Friends' score and count on every card**: next to your match %, a quiet "Your people 4.2★ · 3" (or the Montage-wide "12k ratings" count when no friends have seen it). | S, 1–3 days | **Cheap** | It's Beli's second number, and it's the most social signal per pixel. The data already exists: the film sheet shows "People you follow on a film", and `films_pop` and the Letterboxd counts are stored. It answers "is this trustworthy?" right where people are choosing. |
| 2 | **"Which did you like more?" placement after rating**: after the stars, 1–3 optional head-to-heads against your own films with nearby ratings. The result is a strict personal order: "Your order: #14 of 212". | M, about 1–2 weeks | No | This is Beli's core mechanic and it fits film better than restaurants (the 4★ pile-up). It gives the engine a finer signal than half-stars. It's fun, it's quick, and it makes Canon a by-product. It must stay optional and skippable. |
| 3 | **Two-person picks as a one-tap chip in Browse**: "For you and @Sam", with the last friend you watched with already filled in. | S | **Cheap** | Montage already built this (Browse's "Who's watching", Tonight's `with`, Blends). Beli puts it right on Explore, and Montage hides it behind a filter. Raising its visibility is nearly free. |
| 4 | **Availability chips plus a Watch-now action in Browse**: "On my services", "In theaters", "Free"; each card gets "Watch on Netflix ›" or "Showtimes ›". | S–M | **Cheap** (the chips) | Beli's Open now and Reserve chips turn browsing into doing, and the film version is "can I press play now?" Your services already exists in Tonight; Browse needs the chip, and the card needs the deep link. |
| 5 | **Sentence search at the top of Browse**: "something tense and short for a weeknight" fills in the filters and ranks by your match. | M, 1–2 weeks (Recut spec) | No | Explore leads with a sentence bar. Montage has already specced it as **Recut** (BACKLOG, Pro, 3 a month free) and approved it for after launch. Putting it at the top of Browse is the placement lesson. |
| 6 | **A yearly film goal, and switch on the recaps**: "38 of 100 films in 2026" on the profile, plus the year Montage as a share card in December. | S (goal) + flag flip (recaps) | **Cheap** | Beli's yearly goal and Plated recap are its biggest share moments [11][14]. Montage's month, season and year recaps are already built behind `LATELY_ON` and a Pro gate. The year one should be free, because sharing is the growth. |
| 7 | **"Watched with" tags on a log**: tag friends who were there, and the film goes onto their log too (they confirm). | S–M | **Cheap**-ish | Beli lets you tag who you ate with [18]. For film, this is the after-the-night moment. It feeds Lately ("Maya and Sam watched…"), strengthens the friend graph, and points to Blends. |
| 8 | **Invite reward**: "3 friends join → your Canon grows to 15", counting every invite route. | S (mockup exists: `mockups/journeys/referral.html`) | **Cheap** | Invites are Beli's engine [12][1]. Beli gates basic features, and reviewers complain about that [17][19]. Montage should reward invites and never gate the basics. The design is already drawn. |

Next in line (good, but bigger or riskier): a friends' leaderboard for the month; user-made shareable
lists ("guides") unlocked at 30 rated; badges and collections progress ("7 of 24"); a taste map.

---

## 2. Beli, feature by feature (with the Montage mapping)

Columns: **Beli** (what it is, with a source) · **Montage today** (the equivalent, if any, with a
pointer) · **Montage version** (what to build and why it fits film) · **Effort**.

### Rating and scores

| Beli | Montage today | Montage version | Effort |
|---|---|---|---|
| **Three sentiments, then comparisons**: liked it / fine / didn't like it, shown as coloured circles; then "which did you prefer?" against places you've ranked until the new one has a position; that becomes a 0–10 score [6][7][4]. Critics say it compares cheap places to fine dining unfairly [20][21]. | Half-star ratings (`FilmActions.tsx`), the "did we call it?" verdict and chips (`mockups/journeys/rating-verdict-v1`, `rating-flow-v5`). No head-to-head. | **Top 8 #2.** After the stars, the "How was it?" drawer asks "Which stayed with you more?" and shows two posters: the new film and one of yours with a nearby rating. One to three rounds (binary search within the same star band), then Skip. To avoid Beli's fairness problem, compare within the same lane or length when there's enough history. The output is your order, a strict ranking with no 4★ ties. It feeds the engine as pairwise preferences, which are more informative than stars, and makes Canon a top-10 that maintains itself. Never replace stars: Letterboxd round-trips need them. | M |
| **Score from your rank**: the score is derived from the position, so it shifts as you add more; the formula isn't published [4][6]. | Your rating is fixed; the match % is calibrated, capped at 93% and deterministic (README). | Show the order as "#14 of your 212", never as a new 0–10 number. A second score next to stars and match % would be clutter. | — |
| **Score colours**: green high, yellow mid, red low; on the map as coloured pins or flags [7][22]. The screenshots show 8.7 green and 6.4 yellow. **Exact cut-offs unverified.** | One accent; the blue % stamp (`mockups/journeys/match-stamp-*`). | Don't copy. Montage could use a word band ("Strong fit", "Worth a look") or stamp strength, within its single accent. | — |
| **Personal predicted score**: a guess at how much you'd like a place, available after you've ranked enough [8][9][13]. | **Has it, deeper**: match % on every film with a written why (`FilmHero.tsx`, `/api/match`), plus "We guessed 91% · Called it ✓". | Already better. Beli's lesson is to put it on every card, everywhere, which Montage does. | — |
| **Friends' score**: the average of your friends' scores for the place [9][8]. | Partly: "People you follow on a film" on the film sheet (`FilmPeople.tsx`); the friend feed shows your fit. Not on Browse or Picks cards. | **Top 8 #1.** Add a small line on cards: "Your people 4.2★ · 3", tappable to see the faces. With no friends, show the Montage rating count ("12k ratings"), like the count badge in the screenshots. | S |
| **Count badge**: "12k" on the score circle *(screenshots)*. | Not on cards. Browse's Hidden gems uses log counts internally (rule 280). | Use the count as a confidence cue: "Based on 12k ratings". Pairs with #1. | S |

### Lists

| Beli | Montage today | Montage version | Effort |
|---|---|---|---|
| **Places you've been (ranked)**, **Want to Try** (bookmark icon) and a **Recs** tab [23][24][4]. Bookmarking straight from Instagram or TikTok posts into Want to Try [24]. | Films tab (library), Watchlist (To watch and Rewatches, ranked by match), Picks. | The library gains an "Your order" sort (from #2). **Save from a link**: a share extension or paste-a-TikTok/Reel/Letterboxd URL → watchlist (the iOS share extension). | M (share extension) |
| **Featured lists / city guides**: "Top 10 NYC Pancakes" with your progress through each [23][25]; Beli publishes lists built from its ratings (top bakeries, new bars) [26]. User guides unlock after ranking 30 places, at least 10 of them in a city [13]. | Collections in Browse (Hidden gems, Highest rated…); lane, theme and director pages ranked by match; Canon; Taste Mixes. Progress counts ("7 of 24") are only an idea in BACKLOG ("Achievements, badges and collections"). | **Progress on collections**: "Earned, Not Given · 7 of 24 · next: <film>", as BACKLOG already says. **User guides**: unlock at 30 rated. Let a member publish a titled list ("Rainy Sunday films"), and every viewer sees it re-ranked by their own match. That last part is Montage's edge: it beats Beli's fixed lists. | M |
| **Five categories**: restaurants, bakeries, bars, coffee & tea, ice cream & dessert [26]. | Films, with TV and specials kept separate (`IdentityView.tsx`); a TV plan exists (`docs/TV_PLAN.md`). | TV as its own order is the analogue. No action now. | — |
| **Notes, photos, favourite dishes** on each rating [4][23]. | Takes (friends-only or everyone, spoiler flag), "What stuck with you?" chips (rating-flow-v5). | Favourite dishes → **"the scene"**: optionally pin one moment ("the roulette scene") as a chip or short line. Photos don't fit film (copyright stills), so skip them. | S |

### Social

| Beli | Montage today | Montage version | Effort |
|---|---|---|---|
| **Feed** of what friends rated, with photos and notes; comments exist (one reviewer mentions them); no DMs [23][24]. | **Has it**: "Lately · from your people" with likes, reactions, comments and takes (`SCREENS-SOCIAL.md` "From your people"). | Already equal or better. | — |
| **Following, friends, contacts**: onboarding pushes contact sharing [17][19]. | Follow, mutual = friends, suggestions, "Who do you watch films with?" step. | Keep it opt-in; reviewers resent Beli's forced contacts [17]. | — |
| **Match Score with friends**: a % of how alike your taste is, shown on profiles and on the leaderboard as a colour-coded % [27][22]. Method not published. | **Has it, deeper**: a taste match page with shared loves, splits and picks for both (`/u/[id]/match`), plus a share card. | Already better. | — |
| **Tag who you dined with**: a "group review" [18][28]. | No equivalent for a solo log. Movie night rooms record who was there, and there's a follow-up on rooms. | **Top 8 #7.** "Watched with" on the When step: pick friends, and each gets "Maya says you watched *Heat* together · Add it?" It feeds Lately and suggests a Blend after two shared nights. | S–M |
| **Recommendations for you and a friend** ("Recommended for you and @friend") *(screenshots; not in any source found)*. | **Has it**: Browse "Who's watching" (We'd both like it / Where we'd disagree, `SCREENS-DISCOVER.md` Browse), Tonight `with` (`/api/tonight`), Blends (a living pair or group list, Friday push), movie night rooms. | **Top 8 #3.** Make it visible: a header chip in Browse, "For you and @Sam ▾", with the last co-watcher filled in. Each card shows both numbers ("You 91 · Sam 88", the Blend style). | S |
| **Sending recs** to friends: not described in the sources (**unverified**). | **Has it**: film share sheet "Send to N", landing as "@name sent you this, NN% for them". | — | — |

### Discovery: Explore *(screenshots)* and search

| Beli | Montage today | Montage version | Effort |
|---|---|---|---|
| **Map with score pins** *(screenshots)*; the map existed earlier with category filters [22][25]. | No map. A "taste map" (UMAP) is a later idea in BACKLOG. | Geography doesn't matter for film. The closest real analogue is "near me" = **In theaters near you** (showtimes). A taste map is a curiosity, not a priority. | L, low value |
| **Sentence search**: "I want to eat in financial district…" *(screenshots)*. Older search hint: "restaurant, cuisine or occasion" [25]. | Global search (films, people, lanes); Browse search (lanes, themes, people). **Recut** is specced: a sentence becomes adjustable filters, ranked by your match (BACKLOG, Pro, approved post-launch). | **Top 8 #5.** Build Recut, put it as the Browse search field's first suggestion ("Describe a film…"), and show the parsed filters as removable chips, as Explore does. Keep 3 a month free. | M |
| **Filter chips**: Category, Price, Open now, Reserve *(screenshots)*; older filters: score, price, cuisine, location [22][25]. | Browse Filters sheet (genre, decade, length, language, age) and Sort; Tonight has Your services (rule 588). | **Top 8 #4.** Pinned chips in the Browse bar: **On my services** (≈ Open now), **In theaters** (≈ nearby), **Under 2h** (≈ price as a cost to you), **Genre ▾** (≈ Category). | S |
| **Reserve**: Resy booking inside Beli, standard and prepaid, US Resy restaurants, October 2026 [15]. | "Where to watch" on the film sheet (top 3 providers, free first). | **Top 8 #4.** A card-level action, "Watch on Max ›" (deep link) or "Tickets ›" for in-theater films. It's the film equivalent of Reserve, and the obvious first partnership (JustWatch-style links already exist through TMDB providers). | S–M |
| **Sort: Relevance** *(screenshots)*. | Browse sorts: Best for you, Acclaimed, Hidden gems, Highest rated, Most popular, Newest. | Already richer. | — |
| **Result card**: name, price, cuisine, neighbourhood, a big score with a count, a strip of photos, distance, open or closing time, + and bookmark *(screenshots)*. | Poster grid with a % stamp; Reel viewer with Seen it and Watchlist. | A list-mode card for Browse: poster, title, year · runtime · lane, match % with friends' count (#1), a strip of 3–4 stills or the trailer frame, "On Netflix" in place of open-now, and **Seen it** and **Watchlist** in place of + and bookmark. Optional; the grid is Montage's look. | M |
| **Personal recs** unlock once you've ranked enough [13][9]. | Picks, This week, Tonight, Taste Mixes; thresholds at 15 and 30 rated (Sharpen drawer). | Already equal. | — |

### Gamification, retention and growth

| Beli | Montage today | Montage version | Effort |
|---|---|---|---|
| **Weekly streak**, Duolingo-style nudges [1][11]. | **Has it**: weekly streak, Friday nudge, a calm note when a run ends (`WeeklyStreak.tsx`). | Already equal. | — |
| **Yearly goal**: "2024 restaurant challenge", e.g. 50 new places; still in 2026 [11]. | None. Weekly taste quests are mocked (`mockups/journeys/challenges-v2`). | **Top 8 #6.** "Your 2027 in film: set a number" in January, shown as a quiet bar in the profile drawer. Combine it with quests ("3 of this week's are slow burners"). | S |
| **Leaderboards**: by how many places you've logged; city-wide, app-wide and school-wide; the school competition "Dining Hall of Fame" ran across about 187 universities in 2023, with points for ranking and referrals [1][29][10]. | None. Group superlatives and weekly awards exist (Taste leader, Toughest critic). NAV.md: leaderboards, if ever, go inside Social. | A **friends-only month board** inside Social, ranked by things that aren't raw volume: "Called it" accuracy (How we did), most adventurous, longest streak. Optional **club or school** tag later. Volume-only boards push people to log carelessly, which Beli critics call "conspicuous consumption" [20]. | M |
| **Year in review**: "Beli Plated 2025": top 5 places, top 5 moments (first 10.0, 50th place), cuisine ranking, total count, time dining out, playful personality labels [14]. | Month, season and year Montages are **built but off and Pro-gated** (`LatelyCard.tsx`, `LATELY_ON`); group monthly recaps are live. | **Top 8 #6.** Switch on the **year** Montage for everyone in December as a share card: top 5 films, firsts ("your first 5★ of the year"), lane ranking, total films and hours, and an archetype-flavoured label. Keep month and season on Pro. | S |
| **Badges and status**: rank and status grow with logging and referrals [11][1]. **No source lists named badges (unverified).** | BACKLOG "Achievements, badges and collections" (identity-flavoured only, not volume counters). | As BACKLOG says: collection progress first, then rare identity badges. | M |
| **Invite gating and a waitlist**: invite-only launch with a waitlist [3][12]; invite 4 before signing up [12]; 6 invites per user [2]; invites unlock features and leaderboard rank [1]; 2026 reviewers complain features are locked behind invites [17][19]. | Invite sheet, match links, guest movie-night joins; `invite_joined` notification. Referral reward mocked (`mockups/journeys/referral.html`). | **Top 8 #8.** A reward, never a gate: "3 friends join → Canon grows to 15", counting profile, room and match links. A friend counts once they have 15 rated films. | S |
| **Progress unlocks**: a lock icon and a progress bar ("rank 10 to unlock scores") [13][30]. | **Has it**: Sharpen drawer (15 "Your taste appears", 30 "Film DNA firms up"); match unlock bar. | Already equal. | — |
| **Onboarding**: the invite link → rate places you know → recs. | Taste Test (30 films), Letterboxd import, reveal, then account. | Montage's import is a huge advantage (Beli has nothing like it). Lesson from Beli: let the first comparisons (#2) be part of the Taste Test ("which of these two?"); it's quicker and more fun than stars for a cold start. | M |
| **Content marketing**: lists built from Beli data and posted socially ("NYC's top 14 bakeries ranked by millions of Beli ratings") [26]; Resy publishes lists of Beli's top-ranked Resy restaurants [31]. | Public lane, Browse door and Canon pages; SEO pages exist. | "The best-loved slow burners on Montage, ranked by 40k ratings": a monthly public list generated from Montage data, posted to TikTok and Instagram, linking to its Browse page. | S per list |

### Company facts (context)

| Fact | Source |
|---|---|
| Founded by Eliot Frost and Judy Thelen (HBS); launched June 2021, invite-only | [1][3][4] |
| Series A $5.3M from Goodwater, November 2023; about $12M raised by June 2025, including FirstMark | [1][32] |
| PitchBook lists a $46M round in April 2026 (**unverified**, no other source) | [32] |
| Ratings: 6M (Q2 2023) → 58M (Q2 2025, more than Yelp) → 75M+ (September 2025) → 120M+ (August 2026) | [9][5][4] |
| About 1.1M monthly actives in October 2025 (Sensor Tower, as cited by the Boston Globe) | [4] |
| iOS and Android, no web app; free; v9.18.2, 27 October 2026 | [17][19] |

---

## 3. What I couldn't verify

- **The whole Explore screen** (map plus sentence search, "Recommended for you and @friend",
  Category, Price, Open now and Reserve chips, Sort: Relevance, the card layout, the count badge).
  These are from the owner's screenshots only. No article or store note describing them was found.
  The Reserve chip lines up with the Resy launch [15].
- **Score colour cut-offs** (which numbers turn green, yellow or red).
- **How the Match Score and the predicted score are calculated** (not published) [27][4].
- **Named badges**, comment and like features on the feed, sending a recommendation to a friend,
  and notification settings. These weren't described in any source found.
- The **$46M 2026 round** (PitchBook only).
- **Whether Beli integrates with OpenTable**: not found.

## Sources

1. Wikipedia, "Beli (app)", as summarised in search results; the direct fetch was blocked: https://en.wikipedia.org/wiki/Beli_(app)
2. Spoon University (Brown), "Beli: The New App Personalizing Restaurant Reviews and Recommendations": https://spoonuniversity.com/school/brown/beli-the-new-app-personalizing-restaurant-reviews-and-recommendations/
3. Columbia Business School case, "Beli: Heating Up from a Cold Start": https://caseworks.business.columbia.edu/caseworks/beli-heating-cold-start
4. Boston Globe, "Beli, every foodie's favorite platform, turns five" (4 Aug 2026): https://www.bostonglobe.com/2026/08/04/lifestyle/beli-restaurant-rating-app/
5. InsideHook, "Does Dining Out Even Count If It's Not on Beli?": https://www.insidehook.com/food/does-dining-out-count-beli-app
6. Little Thoughts, "Why I Love: Beli App": https://jteesang.substack.com/p/why-i-love-beli-app ; The Harvard Crimson, "An Ode to Beli" (Feb 2026): https://www.thecrimson.com/article/2026/2/26/beli-inquiry/
7. Spoon University (Emory), "Rate, Save, and Recommend Restaurants on App Beli": https://spoonuniversity.com/school/emory/rate-save-and-recommend-restaurants-on-app-beli/
8. TODAY, "How the Beli App Is Turning Dining Out Into a Competitive Sport": https://www.today.com/food/trends/what-is-beli-app-rcna217748
9. Startup Signals, "Beli: your food diary and dining advisor": https://startupsignals.substack.com/p/beli-your-food-diary-and-dining-advisor ; WSJ (Charlotte Druckman) reprint, "The App That Makes Rating Restaurants Fun Again": https://www.tovima.com/wsj/the-app-that-makes-rating-restaurants-fun-again-and-gets-better-the-more-you-use-it/
10. Washington Square News (NYU), Beli and the Dining Hall of Fame (Oct 2023): https://nyunews.com/culture/dining/2023/10/16/beli-app/
11. Taste Cooking, "Beli Invites the Loneliest Generation to Dine Out": https://tastecooking.com/beli-invites-the-loneliest-generation-to-dine-out/ ; The Zillennial Zine, "Beli App Review": https://thezillennialzine.com/2024/01/23/beli-app-review/
12. Demand Curve, "How Beli Is Eating Yelp's Lunch": https://www.demandcurve.com/newsletters/growth-newsletter-285 ; 8x, "How Beli Built a Cult Following": https://www.8x.social/en/blog/beli-built-cult
13. Pratt IXD, "Design Critique: Beli App" (Sep 2024): https://ixd.prattsi.org/2024/09/design-critique-beli-app/ ; Boston Globe [4] for the 30 places / 10 in a city guide unlock
14. Spoon University, "What Your 2025 Beli Plated Says About You": https://spoonuniversity.com/news/what-your-2025-beli-plated-says-about-you/
15. Resy, "Resy Launches Reservations in Beli" (Oct 2026): https://blog.resy.com/newsroom/resy-launches-reservations-in-beli/
16. Built In, Beli AI/ML Engineer Intern, Summer 2026: https://builtin.com/job/ai-ml-engineer-intern-summer-2026/7634925
17. mwm.ai app listing (v9.18.2, reviews): https://mwm.ai/apps/beli/1478375386
18. The Daily Orange (Oct 2026), "SU's self-proclaimed foodies… log hidden gems on Beli": https://dailyorange.com/2026/10/su-foodies-exchange-new-eats-hidden-gems-beli/
19. Crumble, "Is Beli Free?": https://crumble.me/guides/is-beli-free
20. Daily Trojan, "Conspicuous consumption plagues Beli" (Jan 2026): https://dailytrojan.com/2026/01/30/conspicuous-consumption-plagues-beli/
21. Pratt IXD, "A Design Critique of Beli" (Sep 2026): https://ixd.prattsi.org/2026/09/a-design-critique-of-beli-restaurant-discovery-and-social-platform/
22. Pratt IXD, "Design Critique: Beli (iOS app)" (Feb 2022): https://ixd.prattsi.org/2022/02/design-critique-beli-ios-app/
23. App Store listing: https://apps.apple.com/us/app/beli/id1478375386 ; UChicago Bite: https://uchicagobite.com/blog/2023/3/1/beli-app-restaurant-hot-spots
24. Food Network, "A Once Niche Food App Is Now a Social Place for Gen Z": https://www.foodnetwork.com/fn-dish/news/beli-app-trend ; Cuatower (Apr 2026): https://cuatower.com/2026/04/stop-asking-where-should-we-eat-and-just-check-your-beli-feed/
25. Snapshots, "Beli: Food for thought": https://www.readsnapshots.com/p/beli-food-for-thought ; Crumble, "Restaurant ranking apps": https://crumble.me/guides/restaurant-ranking-apps
26. Her Campus (BU), "Beli: The Social Media App For Foodies": https://www.hercampus.com/school/bu/beli-the-social-media-app-for-foodies/ ; Beli's Lemon8 lists: https://www.lemon8-app.com/@beli_eats/7559393624758649357?region=us
27. App Store listing [23] ("Match Score"); Startup Signals [9] ("taste similarity score")
28. New York Eats Here, "Your friends are secretly ranking every dinner…": https://newyorkeatshere.com/p/your-friends-are-ranking-every-dinner
29. Columbia case [3] and Pratt 2024 [13] for city leaderboards
30. Pratt 2024 [13] (lock icon, progress bar, 10 reviews to unlock scores; may be out of date)
31. Resy, "Beli's Top Ranked Resy Restaurants in Boston" (Oct 2026): https://blog.resy.com/2026/10/beli-restaurants-boston
32. Tracxn: https://tracxn.com/d/companies/beli/__dGog-htkIGO9dxx0slXqdOmKWXD_C9Gm8V6ij9YUamA ; PitchBook: https://pitchbook.com/profiles/company/509955-85

Montage references: `/home/user/montage/README.md`, `docs/FEATURE-INVENTORY.md`,
`docs/app/SCREENS-DISCOVER.md` (Browse, Tonight), `docs/app/SCREENS-SOCIAL.md` (Blends, Lately
feed), `docs/BACKLOG.md` (Recut, badges, recaps), `docs/NAV.md` (single accent, no
leaderboard tab), and the mockups in this folder (`referral.html`, `challenges-v2.html`,
`rating-flow-v5.html`, `rating-verdict-v1.html`).
