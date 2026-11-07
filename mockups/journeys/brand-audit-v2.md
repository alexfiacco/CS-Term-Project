# Montage brand audit v2 (2026-11-07)

This was a read-only audit of `/home/user/montage`: the web app (`app/`, `app/globals.css`, 14,230 lines) and the iPhone app (`ios/Montage/Sources`, 167 Swift files). The bar is the approved profile header (profile-header-v19 / v19c / v19e). It has a graded film backdrop, an @handle bar, no card, Newsreader ticket figures, a punched stub, a full-height tick divider and a member Nº. The header files are being rebuilt now, so this audit leaves them out.

## Verdict

- **Vibe-coded score: about 4/10, where lower is better.** The brand layer is real. It has an accent tick, Bodoni display type, a ticket and a strip, our own switch and menus, a hold drawer, a month drawer and Lucide icons. Rules 1253–1290 removed most of the obvious defaults. What still gives it away is the CSS beneath, which has piled up over time: too many radii, opacities and shadows, and two gradient or glow leftovers.
- **Uniqueness: 7/10.** The ticket, strip and tick can't be mistaken for another app. They still appear on only a few screens, though. Picks, Browse, Search and the list screens look like a competent dark streaming app.
- **Brand individuality: 6/10.** The voice is clear on the profile, the emails and Settings (the "printed programme", rule 1284). It is weaker in lists and empty states.
- **Professionalism: 7/10.** The copy is mostly specific and good. The tokens exist, but about half the code bypasses them.

## Rough counts

| Measure | Web (globals.css) | iPhone |
|---|---|---|
| Font-size tokens | 8 (`--fs-card…--fs-ui`) | `Typo.*` scale |
| Raw `font-size: Npx` | 78 uses, 30 distinct px values (72 marked "type scale exception") | 4 raw `.system(size:)` values |
| Font weights | 400/500/600/700/800. 661 uses of 600 and 9 of 800 | similar |
| Border-radius | about 30 distinct values. 9 radius tokens, but 66× `2px`, 56× `12px`, 53× `4px`, 38× `3px`, 34× `8px`, 33× `6px`, 16× `14px`, plus 1/5/9/16/18px | `cornerRadius:` 3,4,5,6,8,9,10,12,14,16 (10 values) |
| Distinct box-shadows | 123 | 32 `shadow(` calls |
| Distinct rgba() colours | 309 | 41 distinct `.opacity()` values |
| Distinct opacity values | 31 | – |
| Gradients / blur | 128 lines mention `gradient`; 78 `blur`; 17 `backdrop-filter` | 16 Linear/RadialGradient |
| Hex colours | 143 distinct | – |
| SF Symbols left | – | 3, all `apple.logo` (acceptable for Sign in with Apple) |
| Default system controls | – | 3 segmented `Picker`s: PitchShareSheet:98, RoomShareResult:139, FilmDiscussion:672 |

The type and radius sprawl is the clearest vibe-coded sign. Each one-off value was locally reasonable, but together they make no system.

## Screen walk (summary)

- **Picks / Home:** strong structure. The match figure is Bodoni (`.pk-stat-n`, globals.css:8608; iOS `MatchStat`, Design/MatchViews.swift:8,129). This **breaks the "no Bodoni numerals" rule**. The same goes for `MatchStamp` (MatchViews.swift:5) and `.fd-stat` (globals.css:3738). The empty line at Discover.tsx:998 is fine.
- **Film page:** poster offset and the rating ledger are good (rule 1281). It still has Bodoni % stats and a mix of 4/6/8/12px radii inside its sections.
- **Browse / Search:** these are the most generic screens: chips, a grid and a sheet. The FiltersSheet works but is anonymous. It has no tick or strip moment. Search has no branded empty or no-result state.
- **Tonight / movie night:** the ticket is used here (rule 1265), which is good. The leftover `.thx-lane-pick` (globals.css:860–864) is a red→blue gradient pill with a red glow, and `.thx-lane.is-pick` has a blue glow. They look like dead CSS (no component reference found), so delete them.
- **Groups / chats:** chat colours were fixed by rule 1285. Group photos follow the rounded-square rule. RoomVote's empty states ("No votes yet", RoomVote.swift:545,575) use two different styles for the same message (`Typo.label` faint vs `Typo.meta` muted).
- **People:** contact-sheet faces (rule 1284) are good. ProfilePeople.swift:47 "No followers yet." is a plain sentence, not a branded empty state.
- **Profile below the header:** `.sigframe-rank` is defined twice. globals.css:2243 sets it as Bodoni 24 and :4167 as sans 11, so a Bodoni numeral survives depending on cascade order. iOS ProfileScreen.swift:1585 documents "Bodoni 64 rank numeral", which also breaks the rule. ProfileLibrary.swift:341,738 empty states are long instruction sentences.
- **Settings / menu:** best-in-class (programme layout, one switch). `AcctToggle` and `NotifyToggle` are both in use, so check that both draw the single blue pill switch (rule 1285).
- **Onboarding / landing:** has the 32px tick and Bodoni. `.tile.warm` (globals.css:2095) and the page wash (globals.css:1491) still use the oxblood `--glow-warm rgba(122,18,32)`. These are washes, not menu shadows, so they are allowed, but they are the last oxblood. The menu ban is met, but `.ttreel-overlay .reel-poster` (globals.css:13055) is a hard 7px oxblood offset shadow. Rules 1267/1283 removed that offset elsewhere.
- **Drawers / sheets:** the tick and the film-led drawer are good. Three default segmented `Picker`s remain (see the counts table).
- **Empty states:** the iOS `EmptyState` component exists (Design/EmptyState.swift), but many screens skip it: TagPageScreen.swift:334 "Nothing here yet / No films to show for this one yet." is a placeholder-sounding double negative. FilmDiscussion.swift:496 is a hand-rolled "No takes yet".
- **Emoji as UI:** none found in tsx. **Generic copy:** none of "Discover amazing…" found. **Everything centred:** mostly avoided; only the empty states centre.

## Top fixes, ranked

| # | Screen | What's wrong | Fix | Effort | Mock first? |
|---|---|---|---|---|---|
| 1 | Picks, decks, film, posters | The match % is set in Bodoni: `.pk-stat-n` globals.css:8608, `.fd-stat` ~3738, iOS `MatchStat`/`MatchStamp` MatchViews.swift:5–8,129. This breaks the banned-Bodoni-numerals rule. | Use Newsreader for the figures in the data blue with the sans `%`, the same as the header's ticket figures | M | Yes |
| 2 | Profile defining films | `.sigframe-rank` is Bodoni 24 at globals.css:2243 and sans at :4167; iOS Bodoni 64 at ProfileScreen.swift:1585 | One rule: a Newsreader numeral, or a stub-style "Nº 1" | S | Yes |
| 3 | Whole web app | About 30 radii (globals.css; 2/3/4/5/6/8/9/12/14/16/18px raw) | Collapse to 4 tokens (2 tick/hairline, 6 chip/field, 12 card/photo, 999 pill) and lint raw px | L | Yes, one sheet of before and after |
| 4 | Whole web app | 78 raw font sizes / 30 values; weight 800 and 700 next to 600 | Map onto the 8 `--fs-*` tokens. Allow only 500/600 in the UI and drop 800 | L | Yes |
| 5 | iPhone everywhere | 10 corner radii, 41 opacities | Add `Radius.*` and `Ink.*` (3 alpha steps) tokens, matching the web | M | Yes |
| 6 | Empty states (Tag, Library, People, Discussion, RoomVote) | Hand-rolled plain sentences in 3 styles, e.g. TagPageScreen.swift:334, ProfileLibrary.swift:341,738, ProfilePeople.swift:47, FilmDiscussion.swift:496, RoomVote.swift:545/575 | Everything goes through `EmptyState` with an "unexposed frame" motif (below) and one action | M | Yes |
| 7 | Browse / Search | No brand moment. It looks like a generic filter grid. | Tick under the title, strip-sprocket chip rail for filters, a branded no-results state | M | Yes |
| 8 | Tonight (dead CSS) | Gradient pill plus glow `.thx-lane-pick`, globals.css:860–864 | Delete it (no component uses it) | S | No (no visual change) |
| 9 | Reel overlay | Oxblood 7px offset shadow, globals.css:13055 | Use the outline treatment from rule 1267/1283 | S | Yes |
| 10 | Sheets (Pitch share, Room share, Discussion audience) | Default segmented `Picker` at PitchShareSheet.swift:98, RoomShareResult.swift:139, FilmDiscussion.swift:672 | Montage chip pair (outline until chosen, rule 1290) | S | Yes |
| 11 | Web shadows | 123 distinct box-shadows | Three elevations (hairline, drawer, poster offset) as tokens | M | Yes |
| 12 | Web colour | 309 rgba, 143 hex | Fold them into the token palette; ink and muted at 3 alphas | L | No for the refactor alone. Yes if anything visibly shifts |
| 13 | Profile below the header | Sections still sit in card containers, while the approved header has none | Use ruled sections (hairline plus a small caps label) | M | Yes |
| 14 | Landing / onboarding | Oxblood `--glow-warm` washes, globals.css:42,1491,2095 | Swap them for the house grade (film grain plus a cool shadow lift) used by the header backdrop | M | Yes |

### Quick copy fixes (no mock needed)

- TagPageScreen.swift:334: change "Nothing here yet / No films to show for this one yet." to "No films carry this tag yet."
- ProfileLibrary.swift:738: shorten "No rewatches saved yet - add an already-seen film…" and use an en dash, not a hyphen.
- ProfileLibrary.swift:341: trim to "No films logged. Rate from Picks or Browse."
- RoomVote.swift:545/575: pick one string ("No votes yet") and one style.
- ProfilePeople.swift:47: change "Not following anyone yet." to "Following no one yet."
- Blend.tsx:170 shows `joinedAt` as a date. Check that it never reads as "since <year>", which is banned.

## Ownable motifs (use sparingly)

1. **The ticket stub as the figure container.** Every important figure appears once per screen as a punched stub with Newsreader figures and a Nº label: match %, group vote tally, tag stats, the Tonight pick. Not on list rows.
2. **The film-strip sprocket edge as the rail.** Horizontal scrollers (Picks rows, Browse filter chips, faces) get a faint sprocket edge on one side only. It marks "this scrolls" in Montage's own way. Never use it as a card border.
3. **The tick plus Nº as wayfinding.** Keep one 24×3 red/blue tick per screen. Pair it with a small "Nº" index on numbered things (defining films, list ranks, member Nº) so numbering feels like a cinema programme, not a leaderboard.

For empty states, an unexposed frame (a blank, rounded film frame with the tick inside) can join motif 2 rather than becoming a fourth motif.
