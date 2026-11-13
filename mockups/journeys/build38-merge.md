# Build 38 merge (2026-11-13)

Integration branch `build38` (worktree /home/user/wt-b38-merge), started from origin/main 02495db1, with
origin/main fb10502d merged in before the push. Pushed to main as **4e0d5544** (fast-forward from fb10502d).

## Branches merged (in this order, `--no-ff`)

1. build38-film-speed (rule 1811)
2. build38-crash-reports (1760)
3. build38-poster-open (1725)
4. build38-first-rating-chips (1605)
5. build38-enjoyed (1620)
6. build38-empty-states (1680)
7. build38-list-controls (1800)
8. build38-pitch (1700-1702)
9. build38-motion (1730-1733; built on pitch)
10. build38-learned (1780-1783)
11. build38-movienight-bookmark f478ced4 (1850)
12. build38-rated-drawer f4aaf601 (1820)
13. origin/main fb10502d (rules 1830, 1831 and 1840 from other sessions)

## Conflicts and how they were resolved

- **docs/INVARIANTS.md, scripts/check-invariants.ts** (every merge): both sides appended rules and checks. Kept both.
  Three merges left an extra closing `}` in check-invariants.ts (after 1733, 1783 and 1850). tsc caught them and they were removed.
  INVARIANTS 1538/1539 (pitch): enjoyed's change to 1538 and pitch's change to 1539 were each kept.
- **check-invariants.ts rule 1731 check** (motion vs enjoyed): uses enjoyed's "Because you enjoyed" plus motion's soft-impact line.
- **docs/DATA-SCIENCE-LOG.md** (pitch, learned, main): all entries kept, newest first.
- **docs/app/IOS.md** (motion, learned): both sections kept.
- **app/globals.css** (motion, rated-drawer): both blocks appended.
- **scripts/pitch-battery.ts** (pitch vs main's cult work, then learned):
  - imports: the union of all three, with PITCH_DIDNT_CATCH dropped as pitch removed it.
  - `Case`: clarify `"title" | "mood"`, `topMin`/`never` and learned's `prefs`/`warn`/`soft`.
  - Grading:
    - Main's cult `topMin` (n = 7) and `never` checks are graded on pitch's shortlist of seven.
    - Learned's Less of checks still look at the top 10 of the order.
    - The header says 184 asks: 170 from main, 8 from pitch and 6 from learned.
- **app/api/viewing-prefs/route.ts** (learned vs main 1830): main's dated save (`stampPrefDates`) plus learned's `prefs.boost` in the keep test.
- **lib/learned.ts** (learned vs main): both import sets.
- **Rule 1301 (iPhone raw opacity cap 161)**: empty-states and motion each added one, which made 162.
  The reveal's scrim is now `Motion.revealScrim` (0.78). The cap was not raised.

## Rule numbers

No rule number collided. Each of 1605, 1620, 1680, 1700-1702, 1725, 1730-1733, 1760, 1780-1783, 1800, 1811, 1820 and 1850
appears once in INVARIANTS.md and once in check-invariants.ts. No rule was renumbered.

## Other changes

- iPhone build number 37 → 38 (ios/Montage/project.yml, all four CURRENT_PROJECT_VERSION).
- lib/how-we-did.ts `SHOWN_SCALE_FROM` = "2026-11-13T01:35:00Z" (the merge time). Rule 1820's check still requires the `TODO(deploy)` marker, so the doc comment keeps it.

## Gates (on the pushed tree)

- tsc: pass
- check-invariants: exit 0, no ✗
- check-security: ok
- check-ds-log origin/main: ok
- Pitch battery: 184/184. The branches each scored 176/176 (pitch, motion, learned). No ask's result changed against any of them. The only top-3 changes are the cult asks, where main's rule 1661 now applies.
- test-recut-parser and test-recut-rank: output identical to main. Both exit 1 as on main: parser ✗ rule 1178 "up to four friends"; rank "dial violence down not honoured".
- Pre-push hook: typecheck, invariants and ds-log passed. The iPhone compile was not run (no Xcode here).

## Swift files changed in 38 (for the Xcode pass; none compiled here)

New: Core/CrashReporter.swift, Design/Motion.swift, Design/PosterFlight.swift, Features/Account/LearnedScreen.swift

Changed: Core/Library.swift, Core/Notifications.swift, Design/EmptyState.swift, Design/FilmCover.swift, Design/Glossary.swift,
Design/PageStack.swift, Features/Account/AccountScreens.swift, Features/Browse/BrowseListRow.swift, Features/Browse/Recut.swift,
Features/Film/FilmContextMenu.swift, Features/Film/FilmModel.swift, Features/Film/FilmScreen.swift, Features/Film/WatchedWhen.swift,
Features/Lists/ListScreen.swift, Features/Lists/ListsCore.swift, Features/Onboarding/RevealBeats.swift,
Features/Onboarding/RevealScreen.swift, Features/Onboarding/TasteDeckScreen.swift, Features/Onboarding/WelcomeTour.swift,
Features/Picks/PicksScreen.swift, Features/Picks/SpotOn.swift, Features/Profile/ProfileLibrary.swift,
Features/Profile/ProfileNudges.swift, Features/Profile/ProfileScreen.swift, Features/Profile/TasteMatchScreen.swift,
Features/Room/RoomHowWasIt.swift, Features/Room/RoomModel.swift, Features/Room/RoomVote.swift,
Features/Social/ActivityDrawer.swift, Features/Social/NewcomerSocial.swift, Features/Social/PeoplePage.swift,
Features/Social/PostSocial.swift, Features/Social/SocialScreen.swift, Features/Tag/TagModel.swift,
Features/Tag/TagPageScreen.swift, Features/Tonight/TonightModel.swift, Features/Tonight/TonightSheet.swift
(all under ios/Montage/Sources/), plus ios/Montage/project.yml and ios/Montage/Privacy/App/PrivacyInfo.xcprivacy.

Swift files changed by more than one branch, which merged with no conflict:

| File | Branches |
|---|---|
| FilmScreen.swift | first-rating-chips, poster-open, rated-drawer |
| FilmModel.swift | film-speed, rated-drawer |
| WatchedWhen.swift | first-rating-chips, rated-drawer |
| AccountScreens.swift | crash, learned |
| RevealBeats.swift | enjoyed, motion |
| PicksScreen.swift | enjoyed, motion |
| Notifications.swift | enjoyed, crash |
| WelcomeTour.swift | enjoyed, pitch, motion |
| RevealScreen.swift | enjoyed, motion |

Checks run on them without a compiler:
- Brace, parenthesis and duplicate-declaration counts are exactly main's plus each branch's own change.
- No symbol that one branch removed is still used elsewhere. Covered: TagModel.caption, LearnedDrawer, ProfileNudges.word, the rating verbs, PITCH_DIDNT_CATCH.

## Follow-up for the owner

- lib/pref-dates.ts (rule 1830) dates `learnedOff` entries but not learned's new `boost` leans. Decide whether boosts should be dated.
