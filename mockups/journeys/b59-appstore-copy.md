# b59 · App Store copy and screenshot set (proposed)

Draft for Montage 1.0 on the 6.9" iPhone. Images: `b59-appstore-01.png` to `b59-appstore-06.png` (1320 x 2868) and the contact sheet `b59-appstore-sheet.png`.

## Screenshots

| # | Headline (Bodoni, sentence case) | Screen under it |
|---|---|---|
| 1 | Your match on every film | Picks, For you: Perfect Days, 94% match, "Because you enjoyed Past Lives & Aftersun" |
| 2 | See what pulls you in | Profile, Your Film DNA: the "What pulls you in" radar against most viewers, with the Human drama strand open |
| 3 | Say what you're in the mood for | Pitch: "something warm and romantic for a rainy night, under two hours", the chips it read, and the shortlist with match % |
| 4 | One pick for tonight, together | Tonight with Jo, Funny and Cozy: Paddington 2, 90% for you both, Watch this tonight |
| 5 | See whose taste matches yours | Blend with Jo: 86%, *Strong overlap*, Invite Jo to Blend, Watch together |
| 6 | What kind of viewer are you? | The reveal: You're Tenderhearted, with a Lovestruck streak, *Because you enjoyed* Past Lives, Aftersun and Lady Bird |

How they were made: the real web components (PicksFeed, ProfileDna9, RecutHost, TonightDrawer, the Blend page, RevealBeats) bundled with esbuild and fed sample data through a mocked fetch, shot at 390 x 844 at 3x, then set on the house black under the headline. No device frame. Nothing in the montage repo was changed.

Before these go to App Store Connect:
- The people, numbers and archetype are samples. The launch plan (marketing/app-store/2026-11-launch.md, section 8) says store frames must be real captures from the review accounts on iPhone, with the % the app shows on the day. Use these as the layout and the headlines, then recapture on the simulator (status bar 9:41).
- "Because you enjoyed" in frames 1 and 6 follows the Build 38 patch (rule 1620). Main still reads "Because you loved", so the text was swapped on screen for these mocks.
- Frame 2's strand drawer was held to half height so the radar stays in view. The real drawer is taller.
- Frame 1's first-visit tip ("How well this fits your taste") was hidden.

## App subtitle (30 max)

`Taste match & movie night` (25 characters)

## Promotional text (170 max)

> Find out what kind of viewer you are, see a match % on every film, and blend with a friend to find what you'd both love. Rate a few films you know to start.

(156 characters)

## Keywords (100 max, comma-separated, no app name)

```
film,movie,recommendations,watchlist,picker,friends,group,archetype,compatibility,streaming,tonight
```

(99 characters. None repeat the name. "taste", "match" and "night" are in the subtitle, so they are left out here. No other app's name.)

## Description (600 words max)

```
Montage learns your taste in film and shows how much you'll like a movie before you press play. Then it helps you pick one with the people you watch with.

A MATCH ON EVERY FILM
Every film carries your match %: how well it fits your taste. Tap it to see why. Picks are ranked by it, and the more you rate, the sharper it gets.

FIND OUT WHAT KIND OF VIEWER YOU ARE
Rate films you've seen, and Montage names your archetype, one of 14 kinds of viewer. Your Film DNA shows what pulls you in, against most viewers: human drama, slow burn, spectacle, comedy and more. Share your card when it lands.

PITCH IT
Say what you're in the mood for, the way you'd tell a friend: "something warm and romantic for a rainy night, under two hours." Montage reads it, shows you what it understood, and gives you a shortlist with your match on each.

TONIGHT
When you just need an answer: say who's watching and what you're in the mood for, and get one film with your match on it, or the match for you both. Not feeling it? Re-roll.

BLEND WITH A FRIEND
See how alike your taste is with anyone. Your Blend shows your % together, the films you both love and what you'd both watch next. Join a Blend and a list of films you'd both love stays fresh every Friday.

MOVIE NIGHT, SETTLED
Start a movie night and send one link. Everyone picks a mood, Montage finds films that fit the whole room, and you vote until it locks in.

ALSO IN MONTAGE
- Where each film is streaming, to rent or to buy, in your region
- Browse by director, actor, decade, mood or theme, sorted by your match
- Groups with a shared watchlist and chat
- Follow friends, see what they watch and post your takes
- Already rate films in another app? Bring your history in from its export file

Film data and posters from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability via JustWatch.

Terms of use: montagefilm.app/terms
```

(360 words.)

Copy rules checked: sentence case, American spelling, no em dashes, no emoji, no "free", no other app named, Film DNA lines never mention an import source, match shown as a % (never predicted stars).
