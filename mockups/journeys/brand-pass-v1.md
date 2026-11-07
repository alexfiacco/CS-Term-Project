# Brand pass v1: does Montage look vibe coded?

Owner question (2026-11-07): "a full app pass on whether we look vibe coded at all, or whether we have our own visual brand, feel and style."

Evidence: all 581 screenshots in the session uploads. The 378 from this week (Nov 1 to 7) were read at phone size and the 203 from October at thumbnail size. Code is montage `origin/main` at 463977f8: `app/globals.css` (14,149 lines), 177 web components, and 165 Swift files (67,831 lines). Mocks: `brand-pass-v1.html`, rendered to the PNGs listed at the end. Screens are cited by the first 8 characters of the screenshot file name.

Some of the uploads are not Montage. These were used only for comparison:
- **Popcorn** (the closest competitor): e9f0a5bc, 494804b3, 9cbe54b3, 0256826c, 357ed12a, f68bf9c6 (Settings); 9ffaf4e4, e473f233, 6ecd0a3d, fd6e2eaa, c26794da, 23c6f4f1, 37df4b55, 9af21344, aa30e1c3 (Your Taste); 41c93ff0, 6d5a8cea (Watched); 4b264ee2, 159465dc, ec1034f4, 3e6fcb0e, a7cc3318, 1386a9d4, 361c20d7, b69f71b8, dc28fda9, e8809bd5, 74509d2a, 53c1965b, 3b6d4476, 90285028, 4a3a3f32, a3484cfe, d4bb5387, 7a9dad0c, 1c08821e, f70837e2; October paywall and onboarding 023d753c, 3f313976, fb37b45b, ad27fa1b, b40d6bde, fa08492a, 8a159df9, 03ff851d, e93360e9, d391ea28, 0aa75b31, d17c02f5, b32b086f, 55930385.
- **Beli**: 47408cf3, d4a4a59e, 4909642a, 487ad448, 46bdbdc4.
- **Letterboxd**: 1a57de68, 2fdeb238, 34054c79.
- **Instagram**: 783b4031, 5c7e344b, 72600fd5.
- **X**: d69e0b2b.
- **App Store pages** for Horizon and Cineeva: 54659ad2, 3c37bdbf, 7974d69f, 4bd7475c, a976caee, eaa8f3e5, 079a61fd.
- **Everything else** is tooling or notifications (Supabase, Vercel, GitHub mail, Google sign-in errors).

---

## 1. Verdict

**Montage has its own brand, but only in its hero moments. The everyday screens still look like a well-made template.** Roughly 30% of what a user sees is unmistakably Montage. The other 70% is generic dark-mode iOS that could belong to any app built this year, Popcorn included.

### Where it is unmistakably Montage

These screens could not be mistaken for anyone else. Compare them with Popcorn's Inter-bold, green-ring, yellow-paywall look and the gap is real.

- **Tonight's pick** (1825de60, 9e5400d6/ba717415): poster with the oxblood offset, Bodoni title, the italic lane ("Whimsical Feel-Good Fables"), the `86%` match with the small %, and the cream "Watching this tonight" ticket.
- **The movie-night ticket** (99f53378, d58b4fce, 2f87047a): "Admit 2 · Night Nº 23", dashed tear, cream paper.
- **The archetype hero and share card** (9d303c4d, 77cfcfbb, 140880ad, 89dd7fcc): oxblood spine, Bodoni "Nihilist ›", the three-colour mix bar, "Streaks of Lovestruck and IMAX Idealist".
- **Your 2026 in film** (687fca69), **Blend 94%** (92b8359a, 2bb1915c), **Pitch's "Your cut"** (9fe86075, 18865190) and **the For You card** (498d3043, 69614b0d, 1cede15f).
- **The fan logo, soft-claw loader and film-strip streak** (f75a9a73, 87de43ba, b065a1e2).

### Where it reads as generic or vibe coded

1. **Settings is Popcorn's Settings.** Put ae9528b8 / eaf771be next to e9f0a5bc / 0256826c. Both have bordered grouped cards, a stock outline icon in front of every row, chevrons, and Apple's switch. Ours tints the switch cream; elsewhere in the app the same switch is blue.
2. **The saturated blue segmented capsule is everywhere.** Unseen · Seen · All (3035afe3, 23137610, 5deac781), Notifications · You (aa1613b0, 792a8d5a, e32a5f75), Just me · Date night (f610f9d6, 778d320), Both · Jake · You (583c0d22), To Watch · Rewatches (24a8662f), Red · Blue (4f28963f). It is the single most template-looking control, and it uses blue for "chosen" on screens where blue also means match % and your stars.
3. **Apple defaults leak through:**
   - The Sort menu is the system glass `Menu` with a checkmark (c245852a).
   - Post · Story is a stock `.pickerStyle(.segmented)` (4f28963f, 93324d5b; `PitchShareSheet.swift:102`, `RoomShareResult.swift:143`).
   - Pull to refresh uses the spoke spinner (a2401de1).
   - "Pick a date" opens `DatePicker` (`WatchedWhen.swift:292`).
   - Long-press uses `.contextMenu` (12 call sites).
4. **Pastel letter tiles.** Faces without a photo are 8 pastel swatches with a dark letter (J A H M on Social c381ca4d, Tonight 2bb1915c/3ceafd53, Following 1475dfb3). Each has a % stamped over its foot. This is the default-contacts look, and it is the first thing on the Social tab.
5. **Chips: at least seven looks.**
   - Square-cornered outlined lane tags: "Incarceration Dignity Dramas" (9d303c4d).
   - Rounded mood pills: Cozy, Feel-good (f610f9d6).
   - Bodoni-in-a-pill suggestions: "Like Arrival but scarier" (88d60c4f).
   - Blue "understood as" chips with ↑ and × (18865190).
   - Sort ▾ / Filters pills.
   - "Frontier Revenge Trails ›" link chips (ca32aee6).
   - "# Feel-Good" hash chips (075589ab).
   - A dashed "+ 12 more".

   The Tonight drawer and Pitch's "understood as" grid are walls of grey outlined pills (f610f9d6, 09f91215).
6. **Section-marker inflation.** A section can be marked by:
   - a blue 14×2 dash in front of caps ("— YOUR RATING", b4c32979);
   - a plain caps eyebrow ("YOUR LANES");
   - the red/blue tick under titles (88508697);
   - a red dash in front of "Settings" (ae9528b8, eaf771be);
   - the oxblood spine (archetype);
   - a red 3px quote bar (Pitch, d87c2c1b);
   - an oxblood 4px bar (archetype head);
   - the three-colour progress bar.

   That is eight ways to say "this is a section". On the film page alone you can see three of them at once (b4c32979).
7. **Social and activity are cloned from Instagram and iMessage.**
   - The profile header (9d303c4d, c245852a, 1930f1b9) is Instagram's layout: photo, name, "1,260 films · 14 followers · 17 following", then twin grey Edit profile / Share profile buttons (compare 783b4031).
   - Chats use blue iMessage bubbles with "Delivered" (9a3e18ce, c6bcb929).
   - Activity rows are avatar, two lines, a timestamp and an outlined action pill (792a8d5a: Showtimes, Breakdown, Watchlist, Rate it).
   - The name type changed this week: Bodoni in 7c67051b (Nov 4), system sans in 1930f1b9 / 9d303c4d (Nov 5 to 6), while friends' pages still use Bodoni (62689f3b).
8. **Grey skeleton bars.** These are the most generic loading state in the app, and they still show on the film page, profile and person pages (cd7a9a81, ad88365a, 8f3bf776, c3609cf0). Meanwhile the brand already has the soft-claw fan loader. Edit profile's loader prints two lines over each other ("COMPARING NOTES WITH / REWINDING YOUR TASTE…", 21249f7b), which is a visible bug.
9. **Template empty states.** A centred logo, a Bodoni line and a grey sentence: "No chats yet" (3b1cb85e), "Your activity starts here" (e32a5f75), "No takes yet" in a dashed box (09efe6b1). They are tidy, but they could be anyone's.
10. **Emoji in the product's own UI.** Quick reactions are ❤ 🔥 😂 🤯 😭 (`FilmDiscussion.tsx:35`, `HoldMenu.tsx:18`, `PostSocial.tsx:19`, iOS `quickReactions`). Group stats use 👀 🎯 🧭 🍅 👯 (`GroupPage.tsx:100–989`, `GroupScreen.swift:395–440`). Emoji in user bios is fine; emoji as our own icons is a tell.
11. **Two icon sets.** iOS uses SF Symbols 120 times (42 names: xmark, chevron.right, checkmark, star.fill, info.circle, ticket…) and Lucide 81 times (26 names). The web uses Lucide. On iOS the same "close" glyph comes from both sets, depending on the screen.
12. **Caps-label overload.** 490 uses of `--fs-label` caps on the web, and 98 `CapsLabel` plus 187 `Typo.label` on iOS. Nearly every block starts with a tracked caps eyebrow. That density is a common AI-design tell; it flattens the hierarchy that Bodoni should carry.

**Bottom line:** the identity (Bodoni on ink, cream tickets, oxblood offset, the red/blue tick, the fan) is strong and original. The vibe-coded feel comes from the long tail: controls, settings, faces, chips and loaders still use defaults that sit next to the brand instead of inside it. Fixing about ten patterns, not redesigning, gets Montage to unmistakable.

---

## 2. Inventory of inconsistencies

All counts are from montage `origin/main` 463977f8.

### Type scale
| | Token scale | What is in the code |
|---|---|---|
| Web sizes | 8 tokens (40/28/22/18/16/15/13/11) | **60 distinct `font-size` values**. 101 declarations are not `var(--fs-*)`; 47 distinct off-token values (7, 7.5, 8, 9, 10, 12, 14, 19, 20, 21, 24, 25, 26, 30, 32, 33, 38, 44, 48, 60, 64, 72px, plus calc() and 7 clamp()s). The `font:` shorthand adds 10/12/17/21/36/92px. |
| Web weights | 400/500/600 implied by `--t-*` | **5 weights**: 600 ×826, 500 ×221, 400 ×149, 700 ×198, 800 ×11. |
| Web `--t-*` composites | 8 defined | Only 92 uses across 716 `font:` shorthands. Most text still hand-assembles weight, size and family. |
| Web letter-spacing | none defined | **36 distinct values** (.14em ×83, .12em ×37, .16em ×19, .08em, .1em, .18em, .2em, 1.4px, 1.2px, 1.3px, 1.6px, 1.8px…). |
| iOS sizes | 8 `Typo` steps plus 2 named exceptions (17, 10) | **27 distinct sizes**. 134 raw `.system(size:)` calls (8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 46) and 27 raw `Typo.ui/bodoni(n)` sizes (11.5, 19, 21, 24, 26, 30, 32, 44, 54, 56, 64). |
| iOS weights | semibold / regular | **7 weights**: semibold 450, medium 267, bold 110, regular 108, black 51, light 8, heavy 4. |

### Corner radii
- Web: **51 distinct `border-radius` declarations**. 207 literal px uses are off the poster 6, card 8, field 12, drawer 22 and pill scale: 2px ×67, 4px ×53, 3px ×38, 14px ×17, 5, 7, 9, 16, 18. There are also 118 `50%` circles; faces are squares by rule 142, so these are icon buttons, dots and rings.
- iOS: **25 distinct literal `cornerRadius` values** (12 ×32, 6 ×27, 14 ×21, 4 ×20, 8, 10, 3, 9, 5, 16, 22, 20, 7, 18, 13, 7.5, 40, 28, 26, 2.6, 19, 15, 0.6, 0.4) alongside 277 token uses.
- `Theme.btnR = 12` while the comment above it says buttons are pills: the name and the value disagree.

### Spacing
- Web: 4,737 px values in padding, margin and gap; only 1,002 `var(--sp-*)` uses. 2,129 are off the seven-step scale. Of those, 1,536 are the tolerated 6/10/14, which leaves **593 truly off-scale** (5, 7, 9, 11, 13, 15, 18, 20, 22, 26, 28, 30, 34, 36, 38, 54, 56, 60, 64, 72, 74, 92, 96, 108).
- iOS: 2,959 literal padding and spacing values against 791 `Space.*` uses. **514 are off-scale.**

### Buttons
- iOS: **21 `ButtonStyle`s** plus 393 inline `.pressable` buttons.
- Web: 113 button-like selectors.
- On screen I count **about 14 distinct button looks**:
  1. cream primary pill (Action!, Set goal);
  2. dark outline pill (Edit profile, Open the film);
  3. cream ticket with oxblood offset and notches (Just pick for me, Pick with these);
  4. cream three-up stub (Seen it · On watchlist · Not for me);
  5. dark three-up stub (Trailer · Watchlist · Re-roll);
  6. icon chips (Seen / Watchlist / Canon), with a blue fill when on and an **oxblood fill for Canon** (56046fca, b4c32979);
  7. blue segmented capsule;
  8. small outline action pills (Activity);
  9. blue-tinted "Following" pills;
  10. small cream "Follow" (69133c42);
  11. glass "▶ Trailer" on posters;
  12. cream-outline "Pitch" with an icon (882f0212);
  13. grey disabled "Pitch it" (7be5e174);
  14. 36px icon circles.

  Web button heights in use: 16, 18, 22, 26, 30, 32, 34, 36, 44, 46, 48, 52. The tokens are 34, 44 and 50.

### Chips
- 180 chip, pill or tag selectors on the web. Chip heights: 22, 26, 28, 32, 34, 38, 39, 40 (the token is 32). The seven looks are listed in the verdict, point 5.

### Dividers and section marks
Eight markers (verdict, point 6). The oxblood offset alone comes in **7 sizes**: 3, 4 (×12), 5, 6 (×14), 7, 8 and 12px. The token is `--shadow-offset: 6px`. Left spines and bars come in 3, 4, 5, 6, 8, 10 and 14px.

### Colours outside tokens
- Web: **138 distinct hex literals** outside `:root` (256 uses: #000 ×50, #fff ×17, #6fbf8f, #5b5650, #b9b0a0, #8ed3a8, #e6c884, #e79aa0, #a98fd6…) and **308 distinct `rgba()` literals** (650 uses).
- iOS: **120 distinct hex literals**, 107 of them outside `Theme.swift` (LaunchAnimation 17, WidgetViews 8, TonightSheet 7, PicksBanners 7, RevealScreen 6, GroupFeed 6…).

### Red, oxblood and blue used inconsistently
- **Oxblood used as a fill.** The comment says "Oxblood is a shadow, never a fill", but `.fa-canon.on` fills the Canon button oxblood (globals.css 2357, 6501, 8398; 56046fca shows a red-filled "Canon").
- **`--red` is meant only for Admit One**, but it is also used on:
  - the Canon star (10510, 10927);
  - the Pitch mic fill (13288);
  - the Pitch quote bar (13414, 13562);
  - the "said" bar (11560);
  - a chart bar (5731).

  The same kind of quote bar is `--shadow` elsewhere (`.pv2-archhead`, `.arch-sheet-head`).
- **Unread dots disagree:** red on iOS (`SocialScreen.swift:351`, `MovieNightViews.swift:316`), blue everywhere else.
- **Blue means five things:** match data (`--accent-2`), the chosen state (`--select`), "you" (`--you`), links (underlined film names), and chat bubbles. The chosen state and the data are visually the same blue, so "selected" and "your number" compete.
- **Toggle tints disagree:** `Theme.selectDeep` (`Controls.swift:143`) on most switches, `Theme.ink` cream (`AccountScreens.swift:353`) on Settings.

### Apple defaults still leaking
| Default | Where |
|---|---|
| System `Menu` | Sort on Browse (`BrowseScreen.swift:1004`, c245852a), `TagPageScreen.swift:413`, `ServicesPicker.swift:161`, `GroupWatch.swift:501`, `FilmDiscussion.swift:663`, `RevealScreen.swift:626`, `AvatarEditor.swift:145`, `GroupPhoto.swift:55/62` |
| `.pickerStyle(.segmented)` | `PitchShareSheet.swift:102`, `RoomShareResult.swift:143` (Post · Story) |
| `.contextMenu` | 12 sites (film long-press, takes, social reactions) |
| `Toggle` (Apple capsule and disc) | 9 sites, in two tints |
| `DatePicker` | `WatchedWhen.swift:292, 1243` |
| `ProgressView` | `ImportScreen.swift:311` |
| `.refreshable` spinner | profile (a2401de1) |
| `Slider` | `AvatarEditor.swift:78` |
| `.sheet` with `presentationDetents` | 48 / 37 sites. Acceptable: the drawer chrome is ours. |
| `ShareLink` / `UIActivityViewController` | 8 / 4. Acceptable: this is the system share target. |

Already fixed: alerts and confirmation dialogs go through `ConfirmDrawer` (`.alert` 0 uses).

### Icons
SF Symbols (120 uses, 42 names) and Lucide (81 uses, 26 names) are mixed on iOS. Emoji serve as reaction and stat icons (verdict, point 10).

---

## 3. The ten highest-impact fixes

| # | Fix | Problem | Screens | Proposed fix | Effort |
|---|---|---|---|---|---|
| 1 | **One chosen state: the stub strip** | The filled blue segmented capsule is the most generic control, and it uses data-blue for "selected". | 3035afe3, 23137610, 5deac781, aa1613b0, 792a8d5a, f610f9d6, 583c0d22, 24a8662f, 4f28963f | Every 2 to 4 option switch becomes a ticket strip: 36 tall, the card's 8 corner, dashed perforations, the chosen stub in cream paper with punched corners and cream-ink words, counts in tabular figures. Blue goes back to meaning data and you. `SegmentPill` and `.seg` change once and every caller follows. **Mocked.** | M |
| 2 | **Settings as a programme** | Indistinguishable from Popcorn's Settings: grouped boxes, a stock icon in front of every row, Apple switches in a second tint. | ae9528b8, eaf771be vs Popcorn e9f0a5bc, 0256826c | Caps section labels, hairline rows on the ground, no row icons, the current value on the right, your account card at the top, inline retry in Newsreader italic, danger as text, a colophon at the foot. One Montage switch everywhere (card corner, cream square knob, `--select-deep` track). **Mocked.** | M |
| 3 | **Faces as a contact sheet** | Pastel letter tiles with a stamped % look like a default contacts screen; a redundant "Following" pill on every row. | c381ca4d, 1475dfb3, 2bb1915c, 3ceafd53, 69133c42 | Initial in Bodoni cream on `--panel-2` with a `--line-2` edge. FaceTint shrinks to a 3px foot, so identity is kept. The % moves under the face in Bodoni blue. List rows show the archetype in Bodoni italic, not the follow state. **Mocked.** | S |
| 4 | **Three chips, not seven** | Square lane boxes, round mood pills, serif-in-pill, hash chips, arrow chips, link chips. | 9d303c4d, f610f9d6, 88d60c4f, 18865190, 075589ab, ca32aee6, 09f91215 | (a) The **filter chip**: UI 13, the 32 capsule, `--select-fill` when on. (b) The **lane**: no box, Bodoni italic with a hairline underline and ›, a title card rather than a tag. (c) The **choice chip** for moods and answers: the stub look from fix 1. Retire the "#" and "+12 more" dashed variants, and the Bodoni-in-capsule. | M |
| 5 | **Profile header that isn't Instagram** | Photo, name, followers/following and twin grey buttons copy Instagram; the name font flips between Bodoni and sans. | 9d303c4d, 1930f1b9, 7c67051b, 62689f3b vs 783b4031 | Name in Bodoni title on every profile. A "credits" line: *1,260 films · since 2024 · Nihilist*, with followers and following demoted to a quiet link. One cream "Share card" button and an "Edit" text link instead of two grey pills. The streak and the goal ring move into the archetype hero. | M |
| 6 | **Close the Apple-default leaks** | System Menu, segmented picker, DatePicker, spoke spinner and two toggle tints. | c245852a, 4f28963f, 93324d5b, a2401de1, WatchedWhen | Sort becomes a `BottomDrawer` list with the tick (the app already has `FiltersSheet`). Post · Story becomes the stub strip. Dates use the Today / Yesterday / A while ago chips plus a Montage month grid. Refresh uses the soft-claw fan. One `MontageSwitch`. | M |
| 7 | **One section mark, one red** | Eight section markers; oxblood used as a fill; `--red` leaking out of Admit One; red and blue unread dots. | b4c32979, ae9528b8, d87c2c1b, 56046fca | Page and drawer titles get the tick, sections get a plain caps label (drop the blue "—" dash), and the oxblood spine is used only on the archetype hero. Canon "on" becomes cream with an oxblood star, not an oxblood fill. Quote bars use `--shadow`. Unread dots are always `--accent-2`. One offset (6, plus 4 for small objects). Lint `--red` outside `.tkt`/`.admit`. | S |
| 8 | **Loading and empty states in the brand** | Grey skeleton bars; overlapping loader text; centred logo plus grey sentence. | cd7a9a81, ad88365a, 8f3bf776, c3609cf0, 21249f7b, 3b1cb85e, e32a5f75, 09efe6b1 | Skeletons become poster-frame placeholders: dark 2:3 frames with sprocket edges, the soft-claw strip running on top. Fix the doubled loading line. Empty states become a "coming attractions" card: left-aligned Bodoni line, one Newsreader sentence, one cream action. No centred logo. | S |
| 9 | **Chat, reactions and emoji** | iMessage blue bubbles; emoji reactions; emoji stat icons. | 9a3e18ce, c6bcb929, GroupPage, FilmDiscussion | Your messages are cream-on-ink outlined bubbles; theirs sit on `--panel`; "Delivered" goes. Film-language reactions: ★, "Again", "Called it", "Not for me", as monochrome Lucide plus words. Group stat icons become Lucide. | M |
| 10 | **Token hygiene and a lint gate** | 60 web and 27 iOS font sizes, 7 iOS weights, 36 letter-spacings, 51/25 radii, 593/514 off-scale spacings, 138 hex and 308 rgba literals, 21 button styles, two icon sets. | everywhere | Mechanical sweep onto `--t-*`/`Typo`, `--sp-*`/`Space`, the radius scale, three trackings (.14em caps, .04em meta, 0), three weights (400/500/600). SF Symbols replaced by Lucide. CI fails new literals (stylelint plus a Swift grep). Fold the button styles into Primary, Secondary, Quiet, Chip, Stub and Icon. | L |

---

## 4. Mocks for the top three

`brand-pass-v1.html` holds all three, with before and after side by side. It uses the real `:root` from globals.css, copied verbatim, with Bodoni Moda, Newsreader and Inter (standing in for SF Pro) from Google Fonts. Every phone is 390px wide, rendered at deviceScaleFactor 2.

- Overview: `mockups/journeys/brand-pass-v1.png`
- Fix 1, stub strip: `brand-pass-v1-f1-before.png`, `brand-pass-v1-f1-after.png` (person page plus the Activity drawer)
- Fix 2, Settings as a programme: `brand-pass-v1-f2-before.png`, `brand-pass-v1-f2-after.png`
- Fix 3, faces as a contact sheet: `brand-pass-v1-f3-before.png`, `brand-pass-v1-f3-after.png` (Social, Your people plus Following)

The mocks add no colours or fonts. Every value is an existing token, and the stub's punched corners reuse the ticket motif. Two choices need the owner's call:
- Fix 1 uses cream, not blue, as the chosen state. That would amend rule 1172, which today makes a chosen segment solid `--select-deep`.
- Fix 3 keeps FaceTint only as a 3px foot. Rule 142's palette and hash stay as they are.
