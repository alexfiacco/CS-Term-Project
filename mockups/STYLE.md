# Montage style guide

The rules for how Montage looks and sounds, as decided so far. Read this before changing anything
visible. Where a rule came from a specific decision, the date is given; the reasoning behind the
overall look is in `docs/visual-direction.md` (the "Spine" direction, build log 2026-09-20), and
the enforced rules are in `docs/INVARIANTS.md` (checked by `npm run check:invariants`).

**The look in one line:** a black screening room with cream type. The print, not the poster. One
blue, one red, one shadow; everything else is black, cream and rule grey.

---

## 1. Colour

Every colour is a token in `:root` (`app/globals.css`). Never hand-type a hex that has a token.

| Token | Value | Means |
|---|---|---|
| `--bg` | `#0b0b0d` | The ground. Menus and popovers use it too: black, never navy. |
| `--panel`, `--panel-2` | `#141417`, `#18181b` | Panels: opaque and barely lighter than the ground. The rule does the separating. |
| `--line`, `--line-2` | `#2a2a2e`, `#3a3a3e` | Hairlines and keylines. `--line-2` is the button and card border. |
| `--ink` | `#efe8da` | Cream type, and the fill of every **main** button. Cream, not white. |
| `--muted`, `--faint` | `#a9a69e`, `#8a877f` | Secondary and tertiary text. Both AA on `--bg`. |
| `--accent`, `--accent-2` | `#5b8fc4`, `#8fb3d9` | Steel blue: **yours, on, match**. Match numbers, stars, the active tab, links, "you", icons in buttons, and the "on" state. |
| `--accent-soft` | 14% blue | The fill of an "on" button (saved, Following, done). |
| `--shadow` | `#7a1220` | Oxblood. A shadow, never a fill: the 6px offset drop under the ONE hero object on a screen, the spine of archetype and report cards, section marks. |
| `--red` | `#c8233a` | Reserved: the Admit One ticket. Nothing else. |
| danger text | `#e8737f` | Leave, Delete, Block, Remove. Always as text colour, never a red fill. |

Rules:
- **Blue is never a main action** (2026-09-30). It means "yours / on / match". A blue button that
  says "do this" muddies both meanings.
  One exception, the owner's: Discover's "Find something for tonight" button stays blue
  (2026-09-30).
- **Cream is the main action** (2026-09-30), one per screen.
- One oxblood shadow per screen.
- States keep their own semantic colours (green ok, amber pending, pink error), and movie night's
  lanes keep their five hues. Those are the only other colours.
- Posters get the print grade (`--grade`) so mixed-era artwork sits together on the black.
- No gradients on interface elements (flat blue replaced every gradient, 2026-09-20), no blurred
  washes behind content.

## 2. Type

| Face | Token | Used for |
|---|---|---|
| Newsreader (serif) | `--serif` | Film titles, the archetype, section heads, names on profiles and groups, modal titles. |
| Familjen Grotesk | `--sans` | Interface text, buttons and numbers (tabular). |
| Instrument Sans | `--sans-read` | Long reading on the film sheet (the synopsis, the fit copy) and its action buttons. |
| Monospace | `--mono` | The match badge ("86% match") and a few stat captions only. |

- **Labels and eyebrows** are the grotesk in tracked capitals (`--label`, colour `--eyebrow`,
  which is `--muted`): "THIS WEEK, FOR YOU", "YOUR RATING". Not monospace.
- **Sizes come from the scale** `--fs-1` (10px) to `--fs-16` (27px), whole pixels only. No
  12.5px or 13.5px. Big headlines may use a per-component `clamp()`.
- A module uses as few sizes as it can (Browse: two, invariant 96).
- Text inputs and selects are at least 16px on touch screens, or iOS zooms the page (invariant 81).

## 3. Corners, lines and surfaces

- **Buttons are rounded** (2026-09-30): 14px for main and secondary, 10px for compact buttons and
  small chips such as Details.
- **Cards and tiles keep 8px** (`--radius`): profile tiles, the rating box, sheets' inner cards.
  Small tags and keylined chips use 6px (`--radius-sm`).
- **Pills (999px)** only for: the profile header's buttons (owner, 2026-09-28), mood and filter
  chips, and the match badge.
- **The flat look** (profile, group, deepest cut, hot takes, people; invariants 54 and 61):
  hairline keylines, small square corners, the print grade on pictures, tracked caps for labels,
  blue for "you". No blurred wash, no pills inside the content.
- Profile and group avatars are square and keylined.
- The hero object on a screen (the weekly pick, the deck card, a film's poster in its header) gets
  the cream keyline and the oxblood offset shadow.

## 4. Buttons

Five types, and nothing else (2026-09-30, invariant 120; the CSS is the "ONE BUTTON SYSTEM" block
at the end of `app/globals.css`).

| Type | Look | Size | Used for |
|---|---|---|---|
| **Main** | Cream fill, dark text | 46px, 14px corners (34px / 10px in a row or header) | The one action a screen exists for: Where to watch, Just pick for me, Follow on someone's profile, Share, Try again after a failure, Done while editing. |
| **Secondary** | Soft fill `rgba(255,255,255,.05)`, `--line-2` hairline, cream text, blue icons | 46px, 14px corners | Everything else a screen offers: Trailer, Watchlist, Rate, Haven't seen it, Want to watch, Cancel, Show more, Re-roll. |
| **Compact** | The secondary look, smaller | 34px, 10px corners, 13px text | Rows and headers: Follow on a friend row, Follow back, View, Same rating, See it / + Add, ‹ Back, Try again inline, Canon Edit, the film sheet's Mark as seen / Watchlist / Canon. |
| **Link** | Blue text, no box, no underline | Inline | Small in-line extras only: + Log a watch, Show fewer, Change. |
| **Danger** | Secondary or compact with red text | As its type | Leave group, Delete group, Block, Unfollow. |

States:
- **On** (saved, Following, done, rated): the blue fill (`--accent-soft`), `--accent` border,
  `--accent-2` label, usually with a ✓. A border alone is not enough (2026-09-30).
- **Hover**: border `--faint`, fill `rgba(255,255,255,.09)`. **Press**: scale .98.
- **Disabled**: opacity about .5, no hover.

Rules:
- One main (cream) button per screen. A second "do this" is secondary.
- Labels are centred; icons are `--accent-2`; the play icon's view box is centred on the triangle.
- **Try again is always a button**, never a link: something went wrong, so the fix is obvious.
- **One style per job**: Back is a compact "‹ Back" (or "‹ film title"); Show more is a
  full-width secondary; Try again is a compact button with ↻, or the main button when it is the
  only thing on the screen.
- Wording: "Re-roll" (not "Spin again"), "Haven't seen it", "Want to watch" (with the bookmark), "Not interested",
  "Seen it, no rating".
- **The viewer** (Taste Mix, New releases, This week): Trailer, Watchlist, Seen it and Details as
  four equal tiles, icon over label, "Not interested" as a quiet line under them (2026-09-30).
  "Seen it" opens the one rating sheet (HOW WAS IT?, half stars, "Seen it, no rating"): bottom
  sheet on phones, centred popup on desktop; the tile then shows your stars or "Seen".
- **The rating decks** ("Have you seen these?", "Rate what you've seen"): the viewer's twin. Poster,
  match pill, serif title, the stars, then the viewer's tile row (Trailer, Watchlist, Not seen,
  Details; or Trailer, Can't recall, Skip, Details), then "Seen it, no rating · Not interested"
  as one quiet line, SWIPE UP. Trailer on tap only. The quiz keeps "Haven't seen it" and "+ Want
  to watch" side by side; the taste test's big-ones posters open the rating sheet.
- **Over a playing trailer**: a dark fade rises behind the info, tiles go near-solid dark with a
  blur and a brighter edge, quiet links and hints get a text shadow.
- Left alone on purpose: IMDb / Letterboxd links (quiet by design), the crimson Canon ☆, Browse's
  floating ↑ Top / × Close, card-style prompts, × close buttons.

## 5. Chips, menus and icons

- A film's chips are its lanes (Montage's own shelves) or nothing. Never Nanocrowd's nanogenres,
  which are licensed data (invariant 10).
- Menus and popovers (the ••• menu, the avatar menu) sit on `--bg` with a hairline, open above
  their button when they would run off the bottom, and put destructive items in danger red.
- The ⓘ explainers open as a centred panel over the page, never a popover.
- Verdict marks (How we did, 2026-09-30): "called it" is the "on" state (blue check in a blue
  ring); a surprise is a cream arrow on a hairline circle, pointing the way the rating went. A
  miss is news, not an error, so it is never red.
- Icons are line icons at 14 to 18px, in `--accent-2` inside buttons, `currentColor` elsewhere.
- **The watchlist is a bookmark** (2026-09-30): outlined, filled once saved, everywhere a watchlist
  appears. **The check is for seen** and nothing else, so the two never look alike.

## 6. Motion

- One easing (`--ease`) and one duration (`--dur`, 120ms) for interface motion; the reveal and the
  sheet keep their own.
- The archetype reveal "develops" like a print (2026-09-30): the name out of focus and overexposed,
  a projector flicker, then sharp; everything after it fades or rises in, about two seconds in all.
- Reduced motion cuts every animation and transition to an instant single run, with end states
  still applied.

## 7. Layout

- Phone first, 16px side gutters, no horizontal page scroll.
- On the profile, the sections below Defining films match its width; tiles sit in rows of two of
  about the same height (invariant 55).
- Filters on a list (Browse, Films, Watchlist): sort and "Filters · N" on one row, the set filters
  as removable chips under it, the choices in a bottom sheet. Never a wrapping row of selects,
  never a chosen value cut off (2026-09-30).
- Long lists load the next batch before the bottom is reached; nothing says "no films left"
  while the catalog has films (invariants 104, 105, 110).

## 8. Voice

- Second person, plain and specific. One or two short sentences for any generated line.
- **Never** em dashes or semicolons; vary sentence length; no stock phrases ("a testament to",
  "at its core", "a love letter to").
- Never invent specifics the data did not give (no runtimes, counts, dates or plot points).
- Rating talk is rare and never "top marks", "rates highly" or "harder to please"; say what
  someone goes for, not how they score (invariant 111).
- No stand-in text anywhere: a line is the model's writing, stored until replaced, or nothing
  (invariant 109).
- Name people by handle, never a guessed pronoun; they/them when a pronoun is needed.
- Montage's vocabulary: lanes, Film DNA, archetype, Canon, Montages (the month, season and year
  recaps), Tonight, movie night.
- Don't promise what isn't always true ("every film you rate sharpens your picks", not a claim
  about what happens at 100).

## 9. Making a visual change

1. Mock it first, and show the real screens before and after (the owner asked for mockups before
   any visual change).
2. Use the tokens and the five button types; if something needs a new colour, size or corner,
   question the design before adding one.
3. When the owner sets a rule, add it to `docs/INVARIANTS.md` with a check in
   `scripts/check-invariants.ts`, and update this guide.
