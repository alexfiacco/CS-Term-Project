# Montage competitor analysis

Written 2026-11-04. Research only, no code changes. Facts are cited inline as [n]; the numbered
sources are at the end. **How the research was done:** web search only. Direct page fetches were
blocked in this session (`apps.apple.com`, `mwm.ai`, `*.substack.com` and others do not resolve
here), so every fact comes from search-result summaries of the cited pages, not from reading them in
full. App Store rating counts in particular come from third-party trackers (AppGoblin, AppFollow,
Chrome-Stats, mwm.ai) and can lag the live store by weeks. Where a number comes only from the
Montage marketing brief and I could not find it independently, it is marked **(brief, not
re-verified)**. Anything I could not confirm is marked **unverified**.

Wording rule used throughout: this document describes competitors in their own terms, and describes
Montage only with the claims the brief allows (section 4 of the brief). Where a competitor's own
marketing uses a phrase Montage has banned, it is quoted and attributed, never reused.

---

## Summary

**Who is winning.** Three kinds of company are doing well, and none of them is fighting for the
group decision moment.

1. **Letterboxd owns the film identity layer and is still compounding.** 30.7M members at the end
   of Q2 2026, up 43% year on year [1]. Its growth runs on identity artefacts people post (reviews,
   four favourites, the yearly Year in Review) [2][3]. It is now in a sale process with Netflix,
   Sony and Paramount among reported suitors, at a reported $250M to $300M [4][5]. It is not a
   decision tool.
2. **The utilities own "where is it streaming" and are moving downstream.** JustWatch (50M+ monthly
   users) launched its own streaming service, JustWatch TV, on 20 Oct 2026 [6][7]. Plex (42M+
   monthly actives) launched a per-title **Match Score**, lists, reactions and discussions on 3 Jun
   2026, with list import from other platforms promised [8][9]. Plex is the biggest new entrant into
   personal prediction this year.
3. **Group-swipe apps prove the "what do we watch" pain is real and monetisable.** MWM's *Movie
   Night - Swipe & Watch* shows 1M+ downloads, 4K+ ratings and a $44.99 annual premium, with QR and
   code-based rooms [10]. Dozens of copycats launched in 2026 [11].

**Where Montage stands.** Montage combines three things that are usually split across products: a
personal prediction on every film (Plex, Taste.io, Criticker, Popcorn do this), a two-person
compatibility number with a written story (MoviePal, Criticker, Beli do versions of this), and a
group pick that guests open from a link (web pickers and swipe apps do versions of this). The
combination is the moat, not any one piece. One correction to the brief: section 2 says Montage is
"the only product in this field whose group flow starts with a link a non-user can open." That is
**not true of the wider market.** SelectMovie Group Pick and Movie Swiper both run no-signup group
links on the web [12], and Teleparty guests join a watch party from a link [13]. Keep the public
claim to "Movie Night by link: guests join with no account and no app," which is accurate, and drop
"only" from internal strategy language too.

**Five moves for the next 90 days** (detail in "How Montage differentiates"):

1. **Make every Movie Night result a share card, and add a QR join.** The result (film, group
   archetype, how many people agreed) becomes the object people post. QR join copies MWM's living-room
   mechanic [10]. Instrument guest to account conversion.
2. **Ship a free Year in Montage before 2 January.** Letterboxd's Year in Review lands around then
   [3]; Montage's recap is already built (behind a flag, per the Beli report). Put the archetype and
   a "Blend with someone" prompt on it.
3. **Publish the calibration ledger.** A public "How we did" page plus one pre-release prediction
   post a week. Nobody in the field publishes misses; Criticker comes closest with its published
   method [14]. This is the only claim on the board no competitor can copy quickly.
4. **Run the Letterboxd import wedge.** "Bring your Letterboxd, see your archetype and your match
   scores in a minute." 30.7M members [1], studio-sale anxiety in that community [4], and existing
   home-made compatibility tools for Letterboxd users [15] all say the demand is there.
5. **Spend $300 to $500 on a measured acquisition test, optimised for Movie Nights created, not
   installs.** Copy the Popcorn founder's method (UGC creators vs one paid channel, hard cost per
   outcome) [16], and claim the "pick a movie with friends, no app" search terms on the web.

---

## The field

Threat levels are relative to Montage's chosen ground: the group decision moment, the Blend, and
calibrated personal scores on film. A huge company can be a low threat if it is not coming for that
ground.

### Comparison table

| Product | Core job | Personal prediction | Two-person compare | Group decision | Guest without account | Scale signal (date) | Price | Threat |
|---|---|---|---|---|---|---|---|---|
| **Montage** | Film discovery around your taste | Match % on every film, with a reason | Taste Blend % + verdict + contrast note | Movie Night: one film + group archetype | Yes, by link | Pre-iOS; web live | Free (Plus later, never gating Movie Night or Blends) | n/a |
| Letterboxd | Film diary and community | No | No (third-party tools only [15]) | No | No | 30.7M members (Q2 2026) [1] | Pro $18.99/yr, Patron $48.99/yr [17] | Medium |
| JustWatch | Where to watch, now also a streamer | Recommendations from feedback [18] | No | Shared lists only [18] | No | 50M+ monthly users (Sep 2026) [6] | Free; Pro tier; JustWatch TV Plus $3.99/mo [7] | Low-Medium |
| Reelgood | Streaming guide | Recs from tracked history [19] | No | No | No | 10M+ users (2019) [20]; ~9.9K iOS ratings at 4.7 [21] | Free, no IAP [19] | Low |
| Plex | Media server + free streaming + social discovery | **Match Score per title (Jun 2026)** [8] | No | No | No | 42M+ MAU (Jun 2026) [22] | Free; Plex Pass; Lifetime $749.99 from 1 Jul 2026 [9] | Medium |
| Popcorn | Social movie + TV app | Match % (free capped at 3) (brief) | Not confirmed | In-app group rooms (brief) | No, every participant needs the app (brief) | 87 iOS ratings, ~14K Android installs (brief, not re-verified) | $24.99/yr Premium (brief) | Medium-High |
| MoviePal | Tier-list tracker | Recs from tiers [23] | "90%+ compatibility" with friends and strangers [23] | Group picks + group compatibility % [24] | No | 426 iOS ratings at 4.4 (brief); 156 at 4.3 on an older tracker snapshot [23] | Subscription, $3.99/wk to $79.99/yr options [25] | Medium |
| Shortlist / Telli / Montir | Head-to-head ranking with friends | Weak or none | Montir: compare with friends [26] | No | No | Shortlist: 19 ratings (Jul 2026) [27]; others too few to show | Free | Low |
| MWM Movie Night | Group swipe-to-match | No | No | Rooms via QR or code, match when all agree [10] | No, app needed | 1M+ downloads, 4K+ ratings at 4.5 [10] | Premium, $44.99/yr option [10] | Medium |
| Web group pickers (SelectMovie, Movie Swiper, polls) | One-off group vote | No | No | Mood/genre vote or swipe [12] | **Yes, by link** [12] | Not published | Free | Medium (to the claim, not the product) |
| Taste.io / Matched | Per-title % from similar users; couples swipe | Yes, % per title [28] | Partner mode [28] | Couples only (Matched) [29] | No | Taste ~2.2K iOS ratings at 4.6 [28]; Matched 245 at 4.72 [29] | Free + Premium [28] | Low-Medium |
| Criticker | Prediction site | PSI predicted score [14] | TCI user similarity [14] | No | No | Not published | Free | Low |
| Netflix (and streamers) | Watching | Mood/natural-language AI search [30] | No | Group features removed elsewhere [31] | n/a | Not comparable | Subscription | Medium (long term) |
| Teleparty | Co-watching in sync | No | No | No (watching, not deciding) | Guests join by link [13] | ~10M Chrome users [13] | Free + Premium [13] | Low |
| TV Time | TV tracker | No | No | No | No | **Shut down 15 Jul 2026** [32] | n/a | None |
| Trakt | Tracking + sync | Basic | No | No | No | "1M+" community claim [33] | VIP $60/yr [34] | Low |
| Serializd | "Letterboxd for TV" | No | No | No | No | 500K+ Android installs (Apr 2026) [35] | Free, ads [35] | Low |
| Beli (benchmark, restaurants) | Ranked lists + friend graph | Personal score | Match Score % | "Recommended for you and @friend" (screenshots) | No | ~1.1M MAU (Oct 2025); 120M+ ratings (Aug 2026) [36] | Free | n/a (adjacent) |

### Letterboxd

- **What it is:** the default film diary and social network. Ratings, reviews, lists, four
  favourites, a yearly Year in Review, and a Video Store for rentals [37].
- **Personalization:** essentially none. Discovery is social and editorial. 2026 app updates were
  Official Lists on Browse (iOS 4.11.3, 28 Apr 2026) and crew-list credits plus dismissible Video
  Store prompts (iOS 4.10.0, 17 Mar 2026) [37].
- **Social/group:** follow graph, likes, comments, lists. No compatibility score and no group
  decision. Users build their own: Obscuriboxd (taste score from a username, Dec 2025) and BoxdBlend
  (two exports to a compatibility report) [15].
- **Scale:** 30.7M members end of Q2 2026, +43% year on year, +185% since Tiny bought in [1]. About
  27M was reported for January 2026 [2]. Year in Review 2025 shipped 2 Jan 2026 [3].
- **Money:** Pro $18.99/yr, Patron $48.99/yr, plus ads [17]. Reported projected 2026 revenue ~$15M
  (one source says earnings; **unverified which**) [4].
- **Corporate:** Tiny holds 60%, founders 40%. LionTree is reported to be running a sale with Netflix,
  Sony, Paramount Skydance, TPG, RedBird and Seven Seven Six named; valuation reported at ~$250M
  (Variety, citing Puck) or ~$300M (SmartWorld) [4][5]. No deal confirmed as of today.
- **Growth loops:** identity posting (reviews as memes, top four, Year in Review screenshots) [2][3].
- **Strengths:** network effect, cultural ownership, data depth. **Weaknesses:** no answer to "what
  should we watch tonight"; community is wary of a studio owner [5].
- **Threat: Medium.** Not a decision tool and slow to ship. The risk is a new owner (a streamer)
  bolting recommendations onto 30M profiles. The opportunity is that Letterboxd users are Montage's
  best-qualified import audience.

### JustWatch

- **What it is:** the where-to-watch utility, now also a streamer. JustWatch TV launched 20 Oct
  2026: a free ad-supported catalogue, a rental store (US, UK, IE, AU, NZ) and JustWatch TV Plus at
  $3.99/mo (with a limited $49.99 lifetime offer), inside the existing apps [7].
- **Personalization:** feedback-driven recommendations; Pro adds filters and hides seen titles [18].
- **Social:** multiple lists that can be shared "for a movie night" [18]. No compare, no group pick.
- **Scale:** 50M+ monthly users in 140 markets (Sep 2026 press) [6]; 60M+ is claimed on its charts
  pages (**undated**) [6]. Android app updated through v26.43.7 (late Oct 2026) [18].
- **Growth loops:** SEO on every title page, streaming-charts press coverage [6].
- **Threat: Low-Medium.** It is going deeper into supply, not into people. Its data and affiliate
  model are what Montage's where-to-watch revenue will be measured against.

### Reelgood

- **What it is:** a streaming guide across 150+ services with tracking, a watchlist, custom lists
  ("Want to See", "Seen It"), the Reelgood Score and Roulette random picks [19][38].
- **Personalized recommendations:** yes, since 2018, but they depend on you tracking your history in
  Reelgood; you can set liked and disliked genres and rating filters [19][38].
- **Reelgood Score:** a proprietary aggregate of other rating systems, sortable alongside IMDb and
  Rotten Tomatoes [19]. It is the same number for everyone; it is not personal.
- **Social:** none found. No friends, no compare, no group decision.
- **Scale:** "over 10 million users" in 2019 when it raised a $6.75M Series A ($11M total) [20];
  ~$10.85M across five rounds incl. $4.1M debt in Mar 2022 [20]. iOS 4.7 stars from ~9.7K to 10.2K
  ratings depending on tracker [21]. Its business has shifted toward B2B data licensing; its data
  blog was active through Mar 2026 [39].
- **Last update:** **conflicting.** AppFollow shows 15 Sep 2025; AppGoblin, App Pricing Lab and
  Chrome-Stats show 2 Sep 2024 (v4.8.3) [21]. The brief's "September 2024" may be a year stale.
- **Pricing:** free, no in-app purchases [19].
- **Threat: Low.** A guide maintained as a data business's shop window. Not coming for social or
  group ground.

### Plex

- **What it is:** a personal media server that became a free streamer and, since 2022, a social
  discovery layer (Discover Together: friends' watch history, ratings, watchlists) [40]. Reviews
  arrived Oct 2024 [40].
- **June 2026 launch:** Match Score (a proprietary per-title prediction from your ratings and
  history), social lists, emoji reactions, Follow Anything alerts, title Discussions, and promised
  list import from other platforms "later this year" [8]. Coverage framed it as competing with
  Letterboxd and Reddit, launched weeks before the Lifetime Plex Pass rose to $749.99 [9].
- **Scale:** 42M+ monthly actives across 180+ countries (Jun 2026) [22].
- **Weaknesses:** privacy backlash history (opt-out sharing) [40]; price-hike resentment [9]; social
  features still rolling out.
- **Threat: Medium.** The largest company putting a personal score on every title, and it plans to
  import lists. No group pick or guest link found.

### Popcorn

- **Identity note:** at least eight unrelated apps use the name (usepopcorn.app, popcorn-movies.app,
  popcornapp.movie, Popcorn List, popcornshare.in and others) [41]. I could not tie the brief's
  Popcorn to a single store listing through search. One candidate: a newsletter profile of a
  21-year-old solo developer whose movie-rating app "Popcorn" passed 26,000 downloads, growing through
  Instagram and TikTok videos with several over 1M views, and testing $500 split between UGC creators
  and Meta ads for a hard cost per install, ahead of a $25K raise; he also wants QR codes in cinemas
  asking people to rate the film [16]. **Unverified that this is the same app.**
- **Per the brief (not re-verified):** launched May 2026, match percentages, TV, a social feed with
  reviews, daily games, in-app group rooms, Premium $24.99/yr with free matches capped at 3; 87 iOS
  ratings, ~14K Android installs, ~2.2K downloads in the last 30 days; thin in-app community; strong
  distribution and posting volume; group flow needs every participant to have the app and an account.
- **Threat: Medium-High.** Closest feature set and the most aggressive marketer. Its paywall on
  matches and its account-required rooms are exactly where Montage is free and open.

### MoviePal

- **What it is:** iPhone tracker that ranks titles into S to F tier lists and recommends from them;
  advertises "90%+ compatibility matching" with friends "and a world of users," group movie-night
  recommendations, messaging, and Letterboxd import [23][24].
- **Pricing:** subscription for full access (recommendations, compatibility, messaging), free trial;
  App Store options reported from $3.99/week up to $79.99/year; one review complains of a trial
  renewing at $30/month [25].
- **Scale:** 426 iOS ratings at 4.4 (brief, not re-verified); an older tracker snapshot showed 156 at
  4.3 (v2.0.1) [23].
- **Threat: Medium.** Feature-for-feature the closest to Blend plus group picks, but strangers-first,
  paywalled, and app-only.

### Shortlist, Telli, Montir (and the ranking cohort)

- **Shortlist** (BLRB Digital): head-to-head placement, friend following, shareable lists, filters
  across 12 services; v3.7 on 23 Jul 2026; 5.0 from 19 ratings [27]. Its own site runs SEO
  comparison pages ("6 Best Movie Ranking Apps in 2026") [42].
- **Telli Rankings:** an App Store listing ("rank every movie and show") with too few ratings to
  display [42]. Effectively invisible.
- **Montir:** markets itself as "The Beli for Movies"; 0 to 10 scores from a comparative system,
  compare with friends, movies and TV ranked separately since v1.1.1; launched June or July 2026
  (sources conflict); no ads, no tracking [26].
- **The rest of the cohort:** Reel, Movi, KinElo, Fliki, OnMo, CircleRanks, Popcorn List (81 ratings),
  Tilt [42][43]. At least ten apps are chasing the same pairwise mechanic.
- **Threat: Low.** Crowded, tiny, and built on the mechanic the owner has ruled out. Their existence
  is the best argument for Montage not being described as a ranking app.

### MWM Movie Night and the swipe apps

- **MWM Movie Night - Swipe & Watch** (also titled "Movie Night: Film & TV Picker"): rooms joined by
  QR code or code; match when the group agrees; filters; 1M+ downloads, 4.5 from 4K+ ratings; weekly
  and $44.99 annual premium [10].
- **2026 cohort:** Match Movie (Feb 2026, 162 installs), FlickPicker, MoviePicker, Movie Night: What
  To Watch, BingeMatch, Swyf Together, CineDuo and more [11]. Matched (Taste Labs) for couples [29].
- **Threat: Medium.** They own the App Store keyword "movie night" and the habit of swiping as a
  group. All need the app. **ASO note:** Montage's App Store title is "Montage: What to Watch" and
  its feature is called Movie Night; both phrases are already crowded in the store.

### Web group pickers (no signup)

- **SelectMovie Group Pick:** share a link, everyone votes on mood and genre from their own phone,
  real-time results, no signup [12]. **Movie Swiper:** group link, join with a nickname, nothing to
  install [12]. Generic polls (VoteGenerator, movienightpolls.com) and spin wheels do the same [12].
- **Threat: Medium to the claim, low to the product.** They show the guest link is not unique. None
  of them knows anyone's taste, so the pick is a vote, not a prediction.

### Taste.io and Matched

- Taste: rate or swipe, recommendations from like-minded users, a % per title, a partner mode,
  streaming filters; free with Premium; ~2.2K iOS ratings at 4.6 [28]. Same company makes Matched,
  a couples swipe app (245 ratings, 4.72) [29].
- **Threat: Low-Medium.** The oldest consumer version of "% per film," but small and quiet.

### Criticker

- The original prediction site: Probable Score Index (PSI) predicts your rating from your most
  similar users, ranked by a Taste Compatibility Index (TCI); it publishes the maths; a site makeover
  was announced May 2025 [14].
- **Threat: Low.** Niche, web-first. Its published method is the precedent for Montage's calibration
  story.

### Netflix and the streamers

- Netflix: OpenAI-powered natural-language search (beta from 2025), mood-based suggestions, and a
  vertical clip feed (Apr 2026) [30]. Disney+ killed GroupWatch (Sep 2023); Prime Video's Watch Party
  was discontinued in 2024 [31].
- **Threat: Medium, long term.** Each streamer can only recommend its own catalogue, and they keep
  removing group features. A streamer buying Letterboxd [4] is the scenario to watch.

### Others checked

- **IMDb:** incremental personalization (Interests widget, pick your services, recs after 5 ratings);
  v9.3.3 Jul 2026 [44]. Low.
- **Teleparty:** synced co-watching; ~10M Chrome users; guests need only the link, host needs the
  extension [13]. Low; complementary (decide on Montage, watch on Teleparty).
- **TV Time:** shut down 15 Jul 2026 after Whip Media pivoted to AI SaaS; 26.4M lifetime installs;
  user data deleted [32]. Its displaced users are mostly TV trackers; Montage has no TV, so do not
  chase them with TV claims.
- **Trakt:** VIP doubled to $60/yr in 2025 with stricter free limits; heavy user backlash; "1M+"
  community claim [33][34]. Low.
- **Serializd:** TV-only diary; 500K+ Android installs (Apr 2026); claims 10K+ DAU [35]. Low.
- **Likewise / Pix:** Gates-backed, AI recommender across media; 6M+ registered (Mar 2024); no 2026
  news found [45]. Low.
- **Moviebase:** tracker with Trakt sync; ad-supported with premium; updated Mar 2026 [46]. Low.
- **Watcha (Korea):** prediction-first pioneer, now a streamer in court-supervised rehabilitation
  since Aug 2025 [47]. Low.
- **MovieLens:** University of Minnesota research recommender; still used for research (SIGIR 2025)
  [48]. Low.
- **Matchfilm, TasteRay, MovieMatcherAI:** surfaced in results with taste-% or couples features;
  could not verify scale [43][49]. Low.

### Traction numbers (for a bar chart)

Two tables, because audience size and ratings count are different metrics. Do not plot them on the
same axis. Audience numbers span four orders of magnitude; use a log scale.

**Audience size**

| App | Metric | Value | Date | Source |
|---|---|---|---|---|
| JustWatch | Monthly users (company claim) | 50,000,000 | Sep 2026 | [6] |
| Plex | Monthly active users | 42,000,000 | Jun 2026 | [22] |
| Letterboxd | Members | 30,700,000 | Q2 2026 (end Jun) | [1] |
| TV Time | Lifetime installs (now shut down) | 26,400,000 | Jul 2026 | [32] |
| Reelgood | Users | 10,000,000 | 2019 | [20] |
| Teleparty | Chrome Web Store users | 10,000,000 | 2026 | [13] |
| Likewise | Registered users | 6,000,000 | Mar 2024 | [45] |
| Beli (benchmark) | Monthly active users | 1,100,000 | Oct 2025 | [36] |
| MWM Movie Night | Downloads | 1,000,000 | 2026 | [10] |
| Trakt | Community (claim) | 1,000,000 | undated | [33] |
| Serializd | Android installs | 500,000 | Apr 2026 | [35] |
| Popcorn (newsletter app, maybe not the brief's) | Downloads | 26,000 | 2026 | [16] |
| Popcorn (brief) | Android installs | 14,000 | Nov 2026 | brief, not re-verified |

**iOS ratings count (the most comparable public signal across small apps)**

| App | iOS ratings | Avg | Date | Source |
|---|---|---|---|---|
| Beli (benchmark) | ~18,000 | n/a | Nov 2026 | brief |
| Reelgood | ~9,900 | 4.7 | 2026 | [21] |
| MWM Movie Night | 4,000+ | 4.5 | 2026 | [10] |
| Taste.io | ~2,200 | 4.6 | 2026 | [28] |
| MoviePal | 426 | 4.4 | Nov 2026 | brief, not re-verified |
| Matched | 245 | 4.72 | 2026 | [29] |
| Popcorn (brief) | 87 | n/a | Nov 2026 | brief, not re-verified |
| Popcorn List | 81 | 4.05 | 2026 | [43] |
| Shortlist | 19 | 5.0 | Jul 2026 | [27] |

---

## Who is doing well and why

**1. Letterboxd: identity you can post.** +43% members in a year with almost no product change [1]
[37]. The engine is that a Letterboxd profile *is* a self-portrait: four favourites, a one-line
review that reads like a meme, a Year in Review screenshot [2][3]. People post it because it says
something about them, and every post is an ad. Lesson for Montage: the archetype, the Blend verdict
and the group archetype are identity artefacts; they need to be designed as screenshots first.

**2. Beli: a number with friends attached, plus deliberate scarcity.** ~200K to ~1.1M monthly
actives in under two years [36]. A Match Score with each friend and a predicted score on every place
gave people a reason to bring friends in. Its invite gating also worked, but reviewers resent it,
and the owner has ruled it out; the Match Score is the transferable part.

**3. JustWatch and Plex: utility at the moment of intent, then expansion.** JustWatch sits on the
search result for "where to stream X" and turned 50M monthly users into a streaming launch [6][7].
Plex used its 42M actives to launch a per-title Match Score and lists [8][22]. Lesson: the
where-to-watch answer is the hook that brings people back nightly; it is also the revenue line.

**4. MWM Movie Night: the decision moment sells.** 1M+ downloads and a $44.99/yr premium for a
swipe-until-match room [10]. Proof that groups will install something to stop arguing, and pay.
Its weakness is that it knows nothing about anyone's taste.

**5. Popcorn: distribution beats product at small scale.** By the brief's numbers, a thin community
still produces ~2.2K downloads a month on the back of posting volume. The newsletter founder's
million-view videos and his $500 cost-per-install test are the template a solo founder can copy:
post constantly, then measure one paid channel with a hard number [16].

**Who is not doing well, and why it matters.** TV Time shut down (cost, pivot) [32]; Trakt doubled
prices and angered its base [34]; Watcha went into rehabilitation [47]; Reelgood's consumer app is
largely static [21][39]; streamers removed group watch features [31]. Trackers without a social or
decision reason to return struggle to pay for themselves. Montage's group and Blend loops are the
reason to return that pure trackers lack.

---

## What we can steal

Ranked by impact for the effort. All adapted to Montage's own words and look; no pairwise ranking,
no invite gates.

| # | Mechanic | Seen at | Montage version | Impact | Effort |
|---|---|---|---|---|---|
| 1 | **Result as a share card** | Letterboxd Year in Review [3], Beli Plated | Every Movie Night ends on a card: the film, the group archetype, "5 people, 4 minutes," where to watch. One tap to the group chat or Stories. The guest who did not create the night shares it too. | High | S |
| 2 | **Free yearly recap at the turn of the year** | Letterboxd (2 Jan) [3] | Year in Montage for everyone in late December: top films, archetype, firsts, and "your best Blend this year." Already built behind a flag per the Beli report. | High | S |
| 3 | **QR join for the room you are in** | MWM Movie Night [10] | A QR code on the host's screen for the couch case; the link stays for the group chat. Guests still need no app and no account. | High | S |
| 4 | **Published method and a public scorecard** | Criticker publishes its PSI/TCI maths [14] | "How we did": a public page of predictions vs outcomes, misses included; one pre-release prediction post a week. | High | S-M |
| 5 | **Import as the front door** | MoviePal and Plex both chase imports [8][24]; Letterboxd fans build compare tools [15] | A landing page and posts aimed at Letterboxd users: import your export, see archetype and scores in a minute, then Blend a friend. Use the official export file, not scraping, and never Letterboxd's logo or anything implying partnership. | High | S (page) |
| 6 | **"On my services" + watch-now deep link** | JustWatch, Reelgood [18][19], Beli's Reserve | A filter chip and a "Watch on X" action on every card; the affiliate surface the brief names as first revenue. | Medium-High | S-M |
| 7 | **Hard-number acquisition test** | Popcorn founder: UGC vs Meta, cost per install [16] | $300-500 split between 3-5 UGC creators and one paid channel, optimised for Movie Nights created (brief section 7), not installs. | Medium | S |
| 8 | **Data-built public lists** | Letterboxd Official Lists [37]; Beli's ranked lists | A monthly list built from Montage ratings, each viewer seeing it re-ranked by their own match. Post it; link to the Browse page. | Medium | S |
| 9 | **Cinema QR prompt** | Popcorn founder's plan [16] | A small card or sticker for local repertory screenings: "Rate it, see who you'd Blend with." Partner with one indie cinema first. | Medium | S |
| 10 | **Optional swipe round inside Movie Night** | MWM and the swipe cohort [10][11] | When the group's top picks are close, guests swipe the final 3 to 5. Keeps the taste-led pick and adds the fun people already know. | Medium | M |
| 11 | **Friends' signal on cards** | Plex Friends History [40], Beli | A quiet "3 of your people rated it" line next to the match %. | Medium | S |
| 12 | **SEO pages for the decision query** | Shortlist's comparison pages [42]; SelectMovie's pages [12] | Pages for "pick a movie with friends, no app" and "movie night picker for groups" that open a real Movie Night. | Medium | S |

Not stolen, on purpose: head-to-head placement (Shortlist, Montir and others) and invite-to-unlock
(Beli); paywalling the core prediction (Popcorn caps free matches at 3, MoviePal paywalls
compatibility); strangers-first matching (MoviePal).

---

## How Montage differentiates

**Positioning.** Film discovery built around your taste, solo or with your people. Against the
field, Montage is the one place where the same taste profile powers three things: your own score on
every film, a compatibility story with one person, and a single pick for a group that guests can open
from a link. Letterboxd remembers what you watched; JustWatch tells you where; swipe apps make a
group vote. Montage predicts, explains, and then shows its record.

**Three pillars and their proof points**

1. **The link that knows the room.** Web pickers have no-signup links [12]; swipe apps have rooms
   [10]. Montage's version returns one film everyone agrees on, plus a group archetype. Say what it
   does; never say it is the only one.
2. **The Blend as a story.** MoviePal and Criticker give a number [14][23]; Montage gives a number,
   a verdict line and a written contrast note, built to be forwarded.
3. **Calibration in public.** Plex, Popcorn, Taste.io and MoviePal all show a predicted score. None
   publishes its misses. This is the claim to lead with in press and partner contexts.

**Claims we can safely make** (each is in the brief's allowed list and verifiable in product):

- A match score on every film, based on your taste.
- Your taste compatibility with a friend, as a percentage (Taste Blend).
- Movie Night by link: guests join with no account and no app.
- Import your full film history.
- Find your cinema archetype.
- Where to watch on every film.
- "We publish our misses" once the public page exists (only then).

**Never say** (brief section 4, plus what this research adds):

- "The only app that does group picks," "the only app with a guest link," or any "only" claim. The
  research shows web pickers already run no-signup links [12], and Popcorn, MoviePal and MWM have
  group features.
- TV support. Even to TV Time refugees [32].
- "Taste matching." Use "compare tastes" or "Blend." Note MoviePal uses that exact phrasing [25].
- Film DNA as unique. Other apps use the term.
- "Beli for movies." Montir already uses "The Beli for Movies" [26], and it promises a ranking
  mechanic Montage does not have.
- Any comparison number about competitors in public copy (for example "30x more than X"). The
  numbers above are for internal planning; many are third-party estimates.
- Anything implying a Letterboxd partnership or endorsement when promoting import.
- An iOS release date.

**Five concrete moves for the next 90 days** (solo founder, evenings and weekends; each fits into
batches)

| # | Move | Why now | What "done" looks like | Metric (brief section 7) |
|---|---|---|---|---|
| 1 | **Movie Night share card + QR join** (weeks 1-3) | It turns every session into an ad seen by people outside the room; MWM shows the couch case is real [10]. | Result card exported as an image; QR on host screen; events for share and guest sign-up. | Guests per session; guests who later create accounts |
| 2 | **Year in Montage, free, live by 26 Dec** (weeks 4-7) | Letterboxd's recap lands about 2 Jan and floods feeds [3]; ride the same week. | Flag flipped for the year recap; archetype on the card; "Blend with someone" button. | Blends created and accepted |
| 3 | **"How we did" calibration page + weekly prediction post** (start week 2, ongoing) | The one pillar no competitor shares; it also feeds the content system's calibration stories. | A public page with predictions and outcomes; one post a week, hits and misses alike. | Imports completed (trust drives sign-up) |
| 4 | **Letterboxd import wedge** (weeks 3-6) | 30.7M members [1], sale anxiety [4][5], and DIY compare tools [15] signal demand. | Landing page; 3 TikToks showing a real import to archetype to Blend; one Reddit post in a relevant community, following its rules. | Imports completed |
| 5 | **$300-500 measured acquisition test + "group picker" SEO pages** (weeks 6-12) | Gives a real cost per Movie Night before the iOS launch decides where to spend [16]. | 3-5 UGC creators vs one paid channel; 2-3 SEO pages that open a live Movie Night. | Movie Nights completed per week; cost per Movie Night |

---

## Sources and what could not be verified

### Could not verify

- **Popcorn as described in the brief.** Name collisions (8+ apps) meant I could not tie the brief's
  Popcorn (May 2026, match %, daily games, $24.99/yr, 87 iOS ratings, ~14K Android installs) to one
  store listing. Whether it is the app in the Harary newsletter [16] is unknown.
- **MoviePal's 426 ratings at 4.4** and **Beli's ~18K iOS ratings** (from the brief; trackers I found
  showed older figures for MoviePal).
- **Reelgood's last update date.** Trackers disagree (Sep 2024 vs Sep 2025) [21].
- **Telli.** Only a bare "Telli Rankings" listing surfaced [42].
- **Letterboxd sale valuation** ($250M vs $300M) and whether ~$15M is revenue or earnings [4][5].
- **Letterboxd Year in Review share metrics** (a "4M views on X" figure exists only on a low-quality
  site, not used) [3].
- **Plex Match Score rollout status.** Announced 3 Jun 2026; I found no confirmation it is live for
  everyone [8].
- **Trakt membership**; only a "1M+" marketing claim exists [33].
- **App Store pages, Substack, mwm.ai, beliapp.com:** direct fetches were blocked in this session;
  `apps.apple.com` would need to be allowed in the session's network settings to read listings
  directly.
- Third-party download and MAU estimates (AppGoblin, mwm.ai, Chrome-Stats) are modelled, not
  reported by the companies.

### Sources

1. Tiny Ltd, "Tiny Reports Q2 2026 Results" (6 Aug 2026): https://www.newsfilecorp.com/release/308288 ; https://www.nasdaq.com/press-release/tiny-reports-q2-2026-results-2026-08-06
2. Newsworthy, Gen Z and Letterboxd (27M users Jan 2026): https://www.newsworthy.org.au/amp/cinema-gen-z-letterboxed-2676958447 ; YPulse (viral reviews): https://www.ypulse.com/?p=109557 ; Wikipedia, Letterboxd: https://en.wikipedia.org/wiki/Letterboxd
3. Letterboxd Year in Review 2025 coverage: https://www.russh.com/when-will-letterboxd-wrapped-2025-drop/ ; https://www.thewrap.com/creative-content/movies/chainsaw-man-sinners-letterboxd-highest-rated-films ; https://www.academicjobs.com/global-news/letterboxd-wrapped-2025-takes-over-social-media-movie-stats-viral-trends-33
4. Variety AU, "Netflix Among Parties in Early Talks to Buy Letterboxd" (Jul 2026): https://au.variety.com/2026/digital/news/letterboxd-sales-talks-netflix-sony-paramount-38453/ ; SmartWorld ($300M): https://www.smartworld.it/tecnologia/letterboxd-vale-300-milioni-netflix-sony-vogliono-comprarla.html ; Law Commentary: https://www.lawcommentary.com/articles/a24-new-york-times-letterboxd-300-million-sale
5. TheWrap, "Letterboxd Sale: Netflix, Sony and Others in Early Talks": https://www.thewrap.com/industry-news/business/letterboxd-sale-netflix-sony-paramount/ ; 9to5Mac (10 Jul 2026): https://9to5mac.com/2026/07/10/netflix-among-many-companies-showing-interest-in-acquiring-letterboxd-report/
6. Martech360, JustWatch TV for its 50M consumers: https://www.martech360.com/news/media-growth/justwatch-group-to-launch-its-first-streaming-service-justwatch-tv-for-its-50-million-consumers ; PPC Land: https://ppc.land/justwatch-tv-opens-to-50-million-guide-users-with-30-content-partners/ ; JustWatch charts (60M+ claim): https://www.justwatch.com/ca/streaming-charts
7. TheWrap, JustWatch TV launch and price: https://thewrap.com/media-platforms/streaming/justwatch-tv-streaming-service-launch-price ; Cord Cutters News: https://cordcuttersnews.com/justwatch-tv-is-here-with-free-movies-rentals-and-an-ad-free-option/?amp=1 ; Senal News (21 Oct 2026): https://senalnews.com/en/digital/justwatch-expands-into-streaming-with-new-service-across-11-markets/amp
8. Plex blog, "Plex Introduces a Social Platform for Entertainment Discovery Across Streaming Services" (3 Jun 2026): https://www.plex.tv/blog/plex-introduces-a-social-platform-for-entertainment-discovery-across-streaming-services/ ; AlternativeTo: https://alternativeto.net/news/2026/6/plex-introduces-social-lists-community-forums-and-personalized-discovery-features/
9. TechCrunch, "Plex adds new social features ahead of a major price hike" (3 Jun 2026): https://techcrunch.com/2026/06/03/plex-launches-new-social-features-amid-a-major-price-hike/ ; MakeUseOf: https://www.makeuseof.com/plex-is-trying-to-justify-its-enormous-price-hike-but-i-dont-think-this-is-the-way/
10. MWM, Movie Night - Swipe & Watch listing: https://mwm.ai/apps/movie-night-swipe-watch/1554471846 ; App Store: https://apps.apple.com/app/id1554471846
11. 2026 swipe cohort: https://appgoblin.info/apps/com.matchmoviecorn ; https://apps.apple.com/us/app/flickpicker/id6759133156 ; https://apps.apple.com/us/app/id6757856312 ; https://apps.apple.com/us/app/id6769997701 ; https://appgoblin.info/apps/com.LoopHole.bingematch ; https://apps.apple.com/us/app/swyf-together/id6451088026
12. No-signup group pickers: https://selectmovie.com/group-pick/ ; https://movieswiper.app/ ; https://votegenerator.com/templates/movie-night-poll ; https://www.movienightpolls.com/features/movie-poll-maker ; https://www.chooseamovie.app/
13. Teleparty: https://chromewebstore.google.com/detail/oocalimimngaihdkbihfgmpkcpnmlaoa ; https://arjankc.com.np/blog/online-group-movie-watching-guide ; https://www.schieb.de/gemeinsam-fernsehen-geht-noch
14. Criticker: https://www.criticker.com/why-use-criticker ; https://www.criticker.com/info ; Neowin review: https://www.neowin.net/news/review-criticker-and-their-awesome-film-rating-predictions ; makeover (May 2025): https://markets.financialcontent.com/pennwell.cabling/article/prlog-2025-5-5-stop-scrolling-and-start-watching-beloved-film-recommendation-site-criticker-gets-a-major-makeover
15. Obscuriboxd: https://www.producthunt.com/products/obscuriboxd ; BoxdBlend: https://gh.r-mj.com/shayan-sethi/boxdblend ; Letterboxd Toolkit: https://addons.mozilla.org/firefox/addon/letterboxd-toolkit/
16. Ronnen Harary, "A 21-year-old with 26,000 downloads used $500 to figure out the cost of growth for his movie-rating app": https://ronnenharary.substack.com/p/a-21-year-old-with-26000-downloads
17. Letterboxd Pro/Patron prices: https://www.apppricinglab.com/app/apple/1054271011 ; https://appgoblin.info/apps/1054271011
18. JustWatch features: https://www.cloudwards.net/how-to-use-justwatch/ ; https://www.apkmirror.com/apk/justwatch-gmbh/justwatch/ ; https://www.geeknative.com/163084/justwatch-lets-you-build-movie-nights-and-reveals-november-shakers
19. Reelgood features and price: https://techcrunch.com/2018/10/05/reelgoods-app-for-cord-cutters-adds-50-services-personalized-recommendations ; https://marlvel.ai/apps/reelgood-streaming-guide ; https://postunreel.com/blog/reelgood-review-streaming-guide ; https://data.reelgood.com/?p=2440
20. Reelgood funding: https://techcrunch.com/?p=1920864 ; https://www.cbinsights.com/company/reelgood/financials ; https://wellfound.com/company/reelgood
21. Reelgood App Store data: https://apps.appfollow.io/ios/reelgood-streaming-guide/1031391869?country=us ; https://appgoblin.info/apps/1031391869 ; https://chrome-stats.com/d/id1031391869 ; https://apppricinglab.com/app/apple/1031391869
22. Plex 42M MAU (Jun 2026 announcement, as summarised): https://www.plex.tv/blog/plex-introduces-a-social-platform-for-entertainment-discovery-across-streaming-services/ ; https://www.pulse.bot/cmo-pulse/news/plex-launches-social-discovery-suite-as-lifetime-pass-price-jumps-to-750-f20336a6-9019-4e7f-85cc-521f5ce24eb7/
23. MoviePal listing data: https://mwm.ai/apps/moviepal-find-movies-shows/6749919789 ; https://chrome-stats.com/d/id6749919789
24. MoviePal features (group compatibility, group pick, Letterboxd import, messaging): https://moviepalapp.com/ ; https://www.tasteray.com/review/best-movie-apps-for-couples
25. MoviePal pricing and reviews: https://apps.apple.com/us/app/moviepal-movie-tv-tracker/id6749919789 ; https://apps.apple.com/us/app/moviepal-movie-tv-tracker/id6749919789?see-all=reviews&platform=iphone
26. Montir: https://www.indiehackers.com/product/montir ; https://www.producthunt.com/products/montir ; https://peerpush.com/p/montir ; https://apps.apple.com/app/id6776378113
27. Shortlist: https://chrome-stats.com/d/id6759330695 ; https://apps.apple.com/us/app/shortlist-rank-movies-tv/id6759330695 ; https://shortlist.watch/
28. Taste.io: https://apps.apple.com/us/app/id1361180197 ; https://alternativeto.net/software/taste-io/about/ ; https://www.wrdw.com/2023/08/14/what-tech-how-taste-app-can-help-you-find-movie-watch
29. Matched (Taste Labs): https://appgoblin.info/apps/1623287922 ; https://apps.apple.com/us/app/-/id1623287922
30. Netflix AI search and feed: https://www.eweek.com/de/news/netflix-ai-search/ ; https://www.brusselstimes.com/1532214/netflix-ai-to-launch-mood-based-suggestions ; https://hn.jakechampion.name/reader/https://techcrunch.com/2026/04/17/netflix-plans-to-add-a-vertical-video-feed-use-ai-for-recommendations/
31. Disney+ GroupWatch ended / Prime Video Watch Party ended: https://www.techradar.com/streaming/disney-plus-just-removed-one-of-its-best-friends-and-family-focused-features ; https://androidauthority.com/amazon-prime-viewing-party-axed-3458167 ; https://www.iphoneincanada.ca/2024/03/15/twitch-ending-support-prime-video-watch-parties-april-2/
32. TV Time shutdown: https://techcrunch.com/2026/07/02/popular-tv-tracking-app-tv-time-is-shutting-down-as-company-focuses-on-ai ; https://www.techdogs.com/tech-news/td-newsdesk/tv-time-to-shut-down-on-july-15-as-whip-media-shifts-focus-to-ai-platform-helix
33. Trakt community claim: https://www.producthunt.com/products/trakt-tv
34. Trakt VIP pricing: https://forums.trakt.tv/t/upcoming-vip-renewal-pricing-changes-effective-june-12-2025/56649 ; https://alternativeto.net/news/2025/5/trakt-announces-all-vip-renewals-will-switch-to-a-new-standard-rate-doubling-prices
35. Serializd: https://appgoblin.info/apps/com.serializdmobile ; https://www.appbrain.com/dev/Serializd/ ; https://www.producthunt.com/products/serializd/launches
36. Beli figures, via `beli-ideas-report.md` in this folder (Boston Globe, 4 Aug 2026): https://www.bostonglobe.com/2026/08/04/lifestyle/beli-restaurant-rating-app/
37. Letterboxd app release notes: https://scout.appaloosa.io/apps/ios/com.letterboxd.LetterboxdApp/history ; https://www.apkmirror.com/?p=14437938
38. Cloudwards, "How to Use Reelgood in 2026": https://www.cloudwards.net/how-to-use-reelgood
39. Reelgood data blog (Mar 2026): https://data.reelgood.com/reelgood-streaming-data-solution-updates-mar-2026/ ; https://data.reelgood.com/blog
40. Plex Discover Together and reviews: https://cordcuttersnews.com/plexs-new-discover-together-makes-the-app-more-like-social-media/ ; https://techcrunch.com/2024/10/09/streamer-plex-rolls-out-movie-and-tv-show-reviews/ ; https://birchtree.me/blog/plex-started-emailing-your-friends-and-family-what-youve-been-watching-people-didnt-like-that
41. Popcorn name collisions: https://usepopcorn.app/ ; https://popcorn-movies.app/ ; https://popcornapp.movie/landing ; https://popcornshare.in/ ; https://apps.apple.com/us/app/popcorn-list-rank-movies-tv/id6744907475
42. Ranking cohort and Telli: https://shortlist.watch/best-movie-ranking-apps ; https://apps.apple.com/us/app/reel/id6760734673 ; https://www.movitaste.com/ ; https://www.kinelo.app/ ; https://tilt.movie/
43. More ranking/taste apps: https://appgoblin.info/apps/6744907475 ; https://apps.apple.com/us/app/circleranks-rate-movies-tv/id6480323927 ; https://apps.apple.com/app/fliki/id6760435711 ; https://matchfilm.app/
44. IMDb: https://apps.apple.com/app/id342792525 ; https://www.apkmirror.com/?p=2416112
45. Likewise / Pix: https://techcrunch.com/?p=2610590 ; https://www.owler.com/reports/likewise-software/likewise-software--entertainment-discovery-platfor/1710400328626 ; https://www.axios.com/2018/10/03/bill-gates-is-backing-a-new-social-recommendation-engine
46. Moviebase: https://moviebase.app ; https://play.google.com/store/apps/details?id=com.moviebase&hl=en_US
47. Watcha rehabilitation: https://v.daum.net/v/20250825140516113 ; https://www.koreaherald.com/article/2797094
48. MovieLens: https://arxiv.org/html/2504.01863
49. TasteRay and MovieMatcherAI: https://www.tasteray.com/for/couples ; https://dev.to/onepassapps/how-moviematcherai-ranks-your-next-watch-match-percentage-match-ring-and-a-four-button-reaction-1hc8
