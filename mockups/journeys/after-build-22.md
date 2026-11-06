# After build 22: build list (2026-11-06)

Approved (building for build 23):
- 13. Onboarding: today's Rate films + Your shelf (fly-in, scrolls, tap to edit), chips trimmed to 3; deck + Noted (neutral choice lines only, once each, stops at 15). onboarding-rate-v2
- 14. Profile summary: personal (own films, one real contrast), never repeats the archetype/streak names already on screen.
- 15. Profile share card layout B (archetype background), username shown. profile-card-v1
- 16. Blend 'Not now' tells the asker, casually (Activity row, no push).
- 11. Loaders: every page/section load on iPhone uses the Montage reel (MontageLoader), not the system spinner; in-button spinners stay plain (match web).

Awaiting the owner's yes:
1. Pitch button: DECIDED, dark with cream outline and the quotes icon (b146ce15).
2. Filters: A (red dash on the title, blue pills for set filters, Show loses its shadow). filters-character-v1
3. Lately: C (share beside heart and comment), long titles option 1 (title on its own line), rating wording ("you gave it 2.5★"). lately-actions-v1
4. Read share card: A (film-tinted blurred background, one sentence, no "you"). read-card-v1
5. Your cut: header A (one row), rows R3 (runtime + own-service chip, greyscale logos). your-cut-header-v1
6. Pitch chips: one Romance chip covers dial + genre; reason leads with the named film's feel.
7. Blend sentence: soften the "clash" wording at 86%+.
8. Pitch start page: A (grouped). pitch-ask-v1
9. Re-score batch: cerebral archetype (name pending) + Nostalgic streak + drop TV series from the archetype/Film DNA build.
10. Grid/list switch on Films and Watchlist (own and others'), shared account choice, Browse's list row.

Owner ran movie-night-languages-v1.sql; picker widened (173b3bf6).

After launch (owner, 2026-11-06):
- Lists, Montage-style: match % on every list and film, best-for-you sort; Pitch cut → list; Letterboxd list import (with match shown).
  Canon moves into Lists, pinned at the top (no longer only on the Films tab).
  Shared lists reuse groups' invite-and-accept flow (rule 159); a group's watchlist is already the first shared list.
  Needs Report/Block on list titles/descriptions (UGC).

## 2026-11-06 late: parked and building
- Building: takes in the profile's History tab, option A (mockups/journeys/takes-history-v2.png).
- Parked by owner: GIFs (provider pick when resumed: KLIPY; Tenor API closed 2026-06-30). History tab name stays "History" for now (Journal rejected as too close to Letterboxd; Timeline the fallback pick).
- Building (owner yes): Browse "For you and…" chip moved into Every film next to Sort/Filters; refresh only profile summaries that fail the summary validator (once each, on the owner's open).
- Done: archetype read opens/shuts on a tap of the text (a4b96be2); Blend pass wait 30 days (764d5b90); watch-with picker fixes (7d8d2536).
- Still open: "Hot takes" fold rename (pick: "Against the crowd"); bell drawer "Activity"; Noted line "You've seen every one so far." at zero skips.

## 2026-11-06: Founder badge (parked)
- Owner: no Founder badge for now; keep "Founding member" + bio + No. 0001 on the share card. If badges are added (e.g. at public launch), use option A: the outlined small-caps "FOUNDER" pill, same style as Founding member, replacing it for the owner's account only (server-set flag). Mock: founder-bio-v1-badge-a.png.
