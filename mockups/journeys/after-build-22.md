# After build 22: build list (2026-11-06)

Approved (building for build 23):
- 13. Onboarding: today's Rate films + Your shelf (fly-in, scrolls, tap to edit), chips trimmed to 3; deck + Noted (neutral choice lines only, once each, stops at 15). onboarding-rate-v2
- 14. Profile summary: personal (own films, one real contrast), never repeats the archetype/streak names already on screen.
- 15. Profile share card layout B (archetype background), username shown. profile-card-v1
- 16. Blend 'Not now' tells the asker, casually (Activity row, no push).
- 11. Loaders: every page/section load on iPhone uses the Montage reel (MontageLoader), not the system spinner; in-button spinners stay plain (match web).

Awaiting the owner's yes:
1. Pitch button: quotes icon, dark with cream outline (B). BUILT 3ff9e170 as a trial; owner may flip to cream.
2. Filters: A (red dash on the title, blue pills for set filters, Show loses its shadow). filters-character-v1
3. Lately: C (share beside heart and comment), long titles option 1 (title on its own line), rating wording ("you gave it 2.5★"). lately-actions-v1
4. Read share card: A (film-tinted blurred background, one sentence, no "you"). read-card-v1
5. Your cut: header A (one row), rows R3 (runtime + own-service chip, greyscale logos). your-cut-header-v1
6. Pitch chips: one Romance chip covers dial + genre; reason leads with the named film's feel.
7. Blend sentence: soften the "clash" wording at 86%+.
8. Pitch start page: A (grouped). pitch-ask-v1
9. Re-score batch: cerebral archetype (name pending) + Nostalgic streak + drop TV series from the archetype/Film DNA build.
10. Grid/list switch on Films and Watchlist (own and others'), shared account choice, Browse's list row.

Owner to run:
- movie-night-languages-v1.sql (then widen movie night's language picker).

After launch (owner, 2026-11-06):
- Lists, Montage-style: match % on every list and film, best-for-you sort; Pitch cut → list; Letterboxd list import (with match shown).
  Canon moves into Lists, pinned at the top (no longer only on the Films tab).
  Shared lists reuse groups' invite-and-accept flow (rule 159); a group's watchlist is already the first shared list.
  Needs Report/Block on list titles/descriptions (UGC).
