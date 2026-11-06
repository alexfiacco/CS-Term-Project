# Montage App Store submission kit

Prepared 2026-11-06 from montage `origin/main`. No app code was changed. Paths are in the montage repo. It builds on `marketing/app-store/2026-11-launch.md` (2026-11-03) and updates it: several of that file's risks are now fixed (the `/support` page exists, version is 1.0.0, Apple tokens are revoked on delete, friend chat messages and Lately comments can be reported).

Not checked from here: the live site (the sandbox proxy blocked montagefilm.app), anything inside App Store Connect (ASC), and a device build.

---

## 1. Demo account

Email and password sign-in is supported (`ios/Montage/Sources/Core/Auth.swift` `signIn(email:password:)` and `signUp`, the Email button in `Features/SignIn/SignInScreen.swift`). Sign-up needs an email confirmation, so use inboxes you can read.

### Create two accounts

1. Pick two addresses you control, for example `appreview1@montagefilm.app` (A, the one the reviewer uses) and `appreview2@montagefilm.app` (B, the friend). Use new strong passwords, at least 8 characters, not reused anywhere.
2. On an iPhone with the TestFlight build: Welcome screen, "Have an account? Sign in", Email, then "New here? Create account". Enter the email and password, tap Create account.
3. Open the confirmation email and tap the link. If it does not arrive, mark the user confirmed in Supabase, Authentication, Users.
4. Sign out (Profile tab, the ••• menu, Sign out) and repeat for B.
5. Do not use Apple or Google for these. The reviewer needs a username and password.

### Pre-fill so every feature has content

Do this for A first, then B. Use mainstream films and keep the two tastes a bit different so the match is a real number.

1. **Ratings (15+ needed for match %).** Signed in with no profile, the app opens the deck ("What kind of viewer are you?"). Rate at least 20 films you know, skip the rest, and let the reveal finish. Then rate about 10 more from Picks or a film page, so each account has 30+. No match % shows under 15 rated (rule 202, `Design/MatchViews.swift`).
   - Do not import your own Letterboxd export into a demo account: it would put your personal history in front of the reviewer. Rating in the app is enough.
2. **Watchlist.** Save 5 to 10 films on each, with 2 or 3 in common, so "On both your watchlists" fills.
3. **Follow each other.** Social tab, Add friends, search the other handle, Follow. Do it from both accounts.
4. **Blend.** As A, open B's profile, tap the match pill, then "Invite B to Blend". Sign in as B and tap Join (`Features/Profile/Blend.swift`).
5. **Group.** As A: Social tab, New group, add B, give it a plain name. Post one message in its feed and add two films to its watchlist.
6. **Movie night.** From the group page, "Start a movie night". Sign in as B on a second phone, join, both pick a mood, vote, Lock in. That leaves one decided night in history. The reviewer can start a fresh one.
7. **Pitch and a saved cut.** As A: Browse tab, Pitch, type something like "a cozy mystery under two hours", then tap the bookmark ("Save this cut") on the result.
8. **A public take.** As B, post a short take for Everyone on a popular film, so the reviewer can try Report on a real post.
9. **Note A's match link** for the App Clip test: A's profile, share the match link. It looks like `https://montagefilm.app/u/<A id>/match`.
10. Sign in to both accounts once more on the day you submit and check they work. A broken demo account is the most common avoidable rejection (Guideline 2.1).

### Where to enter it in ASC

ASC, Apps, Montage, the iOS version (1.0.0), scroll to **App Review Information**:
- Tick **Sign-in required**.
- **User name**: A's email. **Password**: A's password.
- **Notes**: the text in section 2, with B's login and A's match link filled in.
- **Contact information**: your name, phone and email.
- Optional **attachment**: a 20 to 30 second screen recording of a movie night on two phones.

---

## 2. Reviewer notes (paste into App Review Information, Notes)

Fill in the brackets first.

```
Thank you for reviewing Montage.

WHAT IT IS
Montage builds a taste model from the films a person rates, then shows a personal match % on every film, picks for this week, one answer for tonight, and a Blend with each friend. Groups can choose a film together in a live movie night room.

DEMO ACCOUNTS (email and password)
Welcome screen > "Have an account? Sign in" > Email.
Account A (use this one): [appreview1@montagefilm.app] / [password]
Account B (A's friend, for Blend and movie night): [appreview2@montagefilm.app] / [password]
Both already have 30+ rated films, a watchlist, a group, a Blend and a past movie night.

KEY FLOWS
- Picks (first tab): this week's films ranked by your match. Tap any match % to see why.
- Tonight (middle tab, moon icon): choose who is watching and a mood, get one film. Re-roll swaps it.
- Pitch (Browse tab, Pitch button): describe what you want in a sentence, for example "a heist film under two hours". Montage reads the sentence and ranks matching films by your match. The bookmark saves the result as a cut. The mic uses Apple's on-device speech recognition; no audio is recorded or sent.
- Blend: Social tab > Your Blends, or open Account B's profile and tap the match pill. Shows the films you would both love and updates when either person rates.
- Movie night: open the group (Social tab) > Start a movie night > Share > Copy link. Open that link on a second device as Account B, or in Safari as a guest (no account needed). Pick a mood, vote, Lock in. While voting, lock the phone to see the Live Activity on the Lock Screen and in the Dynamic Island.
- App Clip: open [https://montagefilm.app/u/<A id>/match] on a device without Montage installed (or via the App Clip experience). Rate a few films and see your match with Account A. No account needed.
- Notifications: never asked at launch. The walkthrough shows our own card first with Turn on and Not now. Apple's prompt appears only after Turn on.

AI USE
Montage's recommendations and match scores come from its own model, not a chatbot. A third-party language model (Anthropic) is used only to: read the sentence typed in Pitch into search terms; write some short descriptions on film pages and profiles; and check public posts and uploaded photos for abuse before they appear. Film descriptions (film text only) are also turned into numbers for "films alike" with OpenAI. No email or name is sent. This is disclosed in the privacy policy.

USER-GENERATED CONTENT (1.2)
- Report: press and hold any message, take, reply or comment > Report. On a profile: ••• > Report. On a group photo: tap it > Report. Each report can also block the person.
- Block: a profile's ••• > Block. Settings > Blocked accounts lists them with Unblock.
- Filtering: public takes and replies are checked before they post. Profile and group photos are checked for nudity before they are saved. Chats are visible only to people the user chose.
- Reports go to a private moderation queue that we review within 24 hours. Contact: contact@montagefilm.app

ACCOUNT DELETION (5.1.1(v))
Profile tab > ••• menu > Settings > Delete account (last row) > type DELETE > Delete forever. It needs a sign-in from the last 15 minutes; if asked, sign out and back in. Please test it on a new account, not the demo accounts. Sign in with Apple accounts also have their Apple token revoked.

CREDITS
Film data and posters come from TMDB; streaming availability comes from JustWatch. The TMDB notice is at the foot of the Profile ••• menu. "Availability via JustWatch" shows under Where to watch on every film page, and in the Streaming filter and Your services.

OTHER
- Privacy, terms, support and trailers open in an in-app sheet, not a general browser.
- Some streaming and ticket links may earn a commission (disclosed beside the TMDB notice when on). No ads, no in-app purchases.
```

---

## 3. App Privacy answers

Sources: `ios/Montage/Privacy/App/PrivacyInfo.xcprivacy`, `Privacy/Clip/PrivacyInfo.xcprivacy`, `Core/Analytics.swift`, `Core/Notifications.swift`, `app/privacy/page.tsx`.

**Tracking: No for every type.** No ATT prompt, no AdSupport or IDFA, no ad SDK (grep for `ATTrackingManager`, `AdSupport`, `advertisingIdentifier`, `SKAdNetwork` finds nothing). `NSPrivacyTracking` is false. Affiliate links (`lib/affiliate.ts`) add only a program tag, no user data.

### Main app

| Data type | Collected | Linked | Purposes | Where it comes from |
|---|---|---|---|---|
| Contact Info: Email Address | Yes | Yes | App Functionality; Developer's Advertising or Marketing | Supabase Auth; weekly picks email via Resend |
| Contact Info: Name | Yes | Yes | App Functionality | Display name; Apple's name on first sign-in |
| User Content: Photos or Videos | Yes | Yes | App Functionality | Profile and group photos |
| User Content: Other User Content | Yes | Yes | App Functionality; Product Personalization | Ratings, rating reasons, watchlist, Canon, takes, replies, messages, comments, mood picks, votes, Pitch sentences |
| User Content: Customer Support | Yes | Yes | App Functionality | Settings, Send feedback (sent with the account) |
| Search History | Yes | Yes | App Functionality | Recent search results kept on the account (`SearchRecents.swift`) and recent pitches |
| Identifiers: User ID | Yes | Yes | App Functionality; Analytics | Supabase user id; analytics events carry it |
| Identifiers: Device ID | Yes | Yes | App Functionality | APNs push token sent to the server |
| Usage Data: Product Interaction | Yes | Yes | Analytics; Product Personalization | PostHog events via `/api/app-events` (signed in only), which picks were shown and acted on |
| Diagnostics | No | | | No crash or performance SDK in the app |

Not collected: location (time zone and a streaming region only, no CoreLocation), contacts, health, financial info, purchases, browsing history, sensitive info, audio (speech is turned into text on the phone; only the words are sent, as Pitch text).

### App Clip (answered separately)

Other User Content (the films rated in the Clip), **not linked**, App Functionality. No sign-in, no analytics.

### Flags

- The manifest lists less than this label: **Customer Support** and **Search History** are missing from `Privacy/App/PrivacyInfo.xcprivacy`. Declare them in ASC anyway; align the manifest in a later build.
- **Diagnostics** is a judgement call. The server logs errors and Vercel keeps request logs, but Apple's label is about data the app collects for diagnostics. "Not collected" is defensible. If you want to be cautious, add Crash Data or Other Diagnostic Data, not linked.
- **Email for marketing** is the cautious answer because of the weekly digest. If the digest is only ever about the user's own picks, App Functionality alone is arguable.

---

## 4. Age rating

Recommended rating: **16+**, to match the Terms ("You must be 16 or older to create an account", `app/terms/page.tsx` line 40). The answers below likely calculate 13+; use ASC's option to set a higher rating.

| Question | Answer | Why |
|---|---|---|
| User-generated content | Yes | Public takes and replies, profile photos, names and bios, group names and photos |
| Messaging and chat | Yes | Friend chats, group feeds, movie night chat |
| Unrestricted web access | No | In-app sheets open only Montage pages, YouTube trailer embeds and the export page |
| Advertising | No | No ad units; affiliate links are not ads |
| Parental controls / age assurance | No | |
| Gambling, contests | No | |
| Cartoon or fantasy violence | Infrequent or mild | Posters, trailers |
| Realistic violence | Infrequent or mild | Posters, trailers, descriptions of R-rated films |
| Horror or fear themes | Infrequent or mild | Horror films are in the catalog |
| Mature or suggestive themes | Infrequent or mild | Posters, titles, descriptions |
| Profanity or crude humor | Infrequent or mild | Film titles; private chats are not filtered |
| Alcohol, tobacco, drugs | Infrequent or mild | Posters, trailers |
| Sexual content or nudity | None | TMDB adult titles are excluded (`include_adult: "false"`, `lib/tmdb.ts`); uploaded photos are checked for nudity |
| Graphic sexual content, prolonged graphic violence | None | |
| Medical information | None | |

---

## 5. Attribution check

### TMDB

| Requirement | Web | iPhone |
|---|---|---|
| Notice "This product uses the TMDB API but is not endorsed or certified by TMDB." | Present: `app/_components/Footer.tsx` line 55 (`Attribution`, on About, Privacy, Support, Terms and desktop pages); `app/terms/page.tsx` line 74 | Present: `ios/Montage/Sources/Features/Account/AccountScreens.swift` line 73 (foot of the Profile ••• menu) |
| TMDB logo | **Missing** | **Missing** |

There is no TMDB logo file anywhere in the repo (`public/brand/` holds only Montage, IMDb and Letterboxd marks; `ios/Montage/Resources/Assets.xcassets/Brand/` has no TMDB asset). TMDB's terms ask for its logo next to the notice, less prominent than Montage's own mark.

**What to add:** an approved TMDB logo (from TMDB's logos and attribution page) beside the notice in `Footer.tsx` `Attribution` and in the menu footer in `AccountScreens.swift`, plus an imageset in `Assets.xcassets/Brand`. This is a TMDB terms issue, not an App Review blocker, but fix it before launch.

### JustWatch

Present:
- Web: `app/_components/Result.tsx` lines 3174 and 3198 and `FilmDetailSheet.tsx` line 386 ("Availability via JustWatch"); `SortFilter.tsx` line 333 and `LibFilters.tsx` line 324 ("Data from JustWatch"); `ProfileMenu.tsx` line 685 (Your services).
- iPhone: `Features/Film/FilmScreen.swift` lines 571 and 1344 ("Availability via JustWatch"); `Features/Browse/FiltersSheet.swift` line 328; `Features/Account/AccountScreens.swift` line 1008 (Your services).

Places that show a streaming service (logo or name) with **no JustWatch credit on the same screen**:
- List rows with a service chip: `app/_components/BrowseListRow.tsx`, `ios/.../Features/Browse/BrowseListRow.swift`.
- The group feed's Watch pill: `app/g/[id]/GroupThread.tsx`, `ios/.../Features/Group/GroupFeed.swift`.
- Possibly Tonight and Picks "on your services" lines: `app/_components/Tonight.tsx`, `PicksFeed.tsx`, `TonightServices.tsx`, `ios/.../Features/Tonight/TonightSheet.swift`. Check whether they name a service.

JustWatch's rule (passed on by TMDB) is a credit wherever its data shows. A small "Availability via JustWatch" line at the foot of those lists, or in the Watch pill's sheet, would close it.

---

## 6. App Store listing drafts

**Name (30):** `Montage: What to Watch` (22). Owner decision from 2026-11-02.

**Subtitle (30):**
- Recommended: `Film picks from a model of you` (30). (Never "taste match": house rule.) Alternate: `Your film taste, modelled` (25).
- Alternate on the tagline: `Film picks from a model of you` (30).

**Promotional text (170):**
> Not a popularity list. A model of you. Rate a few films you know, then see your match on every film, blend tastes with a friend, and settle movie night with one link.

(166 characters.)

**Description:**

```
Not a popularity list. A model of you.

Montage builds a taste model from the films you rate. Every film is scored across dozens of dimensions, and your model learns which of them matter to you. The result is a match on every film: how likely you are to love it, before you press play.

A MATCH ON EVERY FILM
Picks, Browse and every film page show your match. Tap it to see why. The more you rate, the sharper it gets.

TONIGHT
When you just need an answer: say who is watching, pick a mood and how long you have, and get one film on your services. Not feeling it? Re-roll.

PITCH
Describe what you want in a sentence, like "a slow-burn thriller set in winter", and get films that fit it, ranked by your match. Save the ones you like as a cut.

BLEND
Blend with a friend and get films you would both love, kept fresh as either of you rates.

MOVIE NIGHT, SETTLED
Start a movie night and drop one link in the group chat. Everyone picks a mood, Montage finds films that fit the whole room, and you vote until it locks in. Guests can join from the link without an account. The vote shows on your Lock Screen and in the Dynamic Island.

SEE YOUR BLEND WITH ANY FRIEND
Compare tastes with anyone and see your match %, the films you both love and what is on both your watchlists. Send your match link and they can find out where they land, right from the link.

ALSO IN MONTAGE
- Find out what kind of viewer you are, with a card to share
- Where every film is streaming, to rent or to buy, with the trailer one tap away
- Browse by director, actor, decade, mood or theme, sorted by your match
- Groups with their own shared taste, watchlist and chat
- Follow friends and post your takes on films
- Home Screen widgets and Siri
- Bring your rating history in from an export file

Film data and posters from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability via JustWatch.
```

Copy rules kept: no em dashes, no emoji, no "AI", no "free", no other app named, no invented numbers, nothing about how the model works beyond "taste model" and "dozens of dimensions".

**Keywords (100):**
```
film,recommendations,watchlist,picker,group,friends,compatibility,streaming,finder,archetype,ratings
```
(100 characters, no spaces, no words already in the name or the recommended subtitle.) If you use the alternate subtitle, swap `film` and `archetype` for `movie,night` and trim to fit.

**Category:** primary Entertainment, secondary Social Networking.

**URLs** (routes exist in code; open each on a phone before submitting, the live site could not be reached from here):
- Support URL: `https://montagefilm.app/support` (`app/support/page.tsx`: contact email, deleting an account, reporting)
- Marketing URL: `https://montagefilm.app` (`app/page.tsx`)
- Privacy Policy URL: `https://montagefilm.app/privacy` (`app/privacy/page.tsx`, updated November 6, 2026)

---

## 7. Screenshot plan

**Sizes.** The app is iPhone only (`TARGETED_DEVICE_FAMILY: "1"` in `ios/Montage/project.yml` for every target), so **no iPad screenshots**. Portrait only.
- 6.9 inch: 1320 x 2868 (iPhone 16 Pro Max or 17 Pro Max simulator). Required.
- 6.5 inch: 1284 x 2778 (iPhone 14 Plus or 13 Pro Max simulator). Optional once 6.9 is supplied, but capture natively if you upload it.

**Capture rules.** Real screens from the two demo accounts, never staged numbers. Mainstream films. No Letterboxd or IMDb marks in frame. No faces. Clean status bar: `xcrun simctl status_bar booted override --time 9:41 --batteryState charged --batteryLevel 100 --cellularBars 4 --wifiBars 3`.

| # | Caption | Screen |
|---|---|---|
| 1 | Not a popularity list. A model of you. | Picks: this week's films with big match numbers |
| 2 | Your match on every film | A film page with the match row and the why drawer open |
| 3 | One answer for tonight | Tonight's ticket: the film, your match, Re-roll |
| 4 | Pitch it in a sentence | Pitch: the sentence, its chips and the ranked films |
| 5 | Settle movie night with one link | Movie night mid-vote: seats, film cards, "2 of 3 in" |
| 6 | Blend tastes with a friend | Blend page with A and B: films you would both love |
| 7 | See your Blend with any friend | Blend screen: the %, films you both love |
| 8 | Movie night on your Lock Screen | The Live Activity on the Lock Screen during a vote |

If you upload only six, drop 7 and 8.

---

## 8. Pre-submission checklist

| Item | Status | Detail |
|---|---|---|
| Sign in with Apple | OK | "Continue with Apple" shown first, same size as Google (`Features/SignIn/AuthButtons.swift`); entitlement `com.apple.developer.applesignin` in project.yml. Owner: Apple provider on in Supabase, and "Allow manual linking" so Settings' Connect Apple row works. |
| Account deletion in app | OK | Profile, ••• menu, Settings, Delete account (`AccountScreens.swift` line 730, `DeleteAccountView`), `POST /api/delete-account`, which also revokes Apple tokens (`lib/apple-signin.ts`). Needs a sign-in in the last 15 minutes; said in the notes. |
| Push permission timing | OK | Never at launch. Our own card first (walkthrough, then at most a few moments that mean something, `NotifyAskPolicy` in `Core/Notifications.swift`); Apple's prompt only after Turn on. |
| APNs environment | Check | project.yml has `aps-environment: development`. Xcode's App Store export normally signs it as production, and the app registers Release builds as production (`Notifications.swift` line 604). Confirm a real push arrives on a TestFlight build, and that the APNs key, key id and topic are set in Vercel. |
| App Clip: associated domains | OK in code | Clip entitlement `appclips:montagefilm.app`, parent id `app.montagefilm.Montage`; the AASA route lists `appclips` for `<TEAM>.app.montagefilm.Montage.Clip` (`app/api/apple-app-site-association/route.ts`). It returns 404 until `APPLE_TEAM_ID` (5WKL8B8NML) is set in Vercel production. Check `https://montagefilm.app/.well-known/apple-app-site-association` in a browser. |
| App Clip: invocation URL | Owner | Create the App Clip experience in ASC for `https://montagefilm.app/u/` (match links are `/u/<id>/match`; `/m/<handle>` also opens the Clip). Needs a 1800 x 1200 header image, title, subtitle and an action. Also missing: the `apple-itunes-app` meta tag with `app-clip-bundle-id=app.montagefilm.Montage.Clip` on the match page for the Safari banner (no such tag in `app/`). |
| Export compliance | OK | `ITSAppUsesNonExemptEncryption: false` in the app's Info.plist; only HTTPS and a SHA-256 nonce. The Clip plist lacks the key; ASC may ask once, answer No. |
| Version and build | OK | `MARKETING_VERSION 1.0.0`, `CURRENT_PROJECT_VERSION 21`, the same in all four targets. Raise the build number for every upload and keep the targets equal. |
| Privacy manifest | Check | Add Customer Support and Search History in a later build (section 3). |
| TMDB logo | Missing | Section 5. |
| JustWatch credit gaps | Check | Section 5. |
| Reports page | Note | The moderation queue is `app/dev/reports/page.tsx`, owner only (`/api/reports` returns 403 to anyone else). The reviewer will not see it; the notes say reports are reviewed within 24 hours. Watch it daily during review. |
| Stale string | Low | `MontageApp.swift` line 676 "Rate a few films on montagefilm.app to build your Film DNA." points to the website; it is hard to reach, remove later. |
| EU trader status | Owner | ASC asks for it before EU storefronts. A trader's address and phone show on the EU page; get a PO box or virtual address first, or leave the EU out of 1.0. |
| Backend during review | Owner | The whole app reads `https://montagefilm.app`. Avoid risky server deploys during review week. |
| TestFlight external testing | Owner | The first build for external testers goes through Beta App Review. Fill in Test Information (what to test, a feedback email, the same demo account and notes). To test the Clip in TestFlight, add up to three App Clip invocations on the build (for example A's match link). Internal testers need no review. |
