# b139 v2: The share screen, one version

The share screen and its cards after the owner's notes on v1. There is one version and no options.

**What changed from v1**
- Every element is checked against the house style (below).
- Every word on a card is full ink over a stronger scrim, with contrast measured (below).
- The reveal's streak lines are back on the archetype card.
- The Blend % is smaller, set in the sturdier cut where the 4 reads, and the band is in italics.
- Tonight and movie night carry the app's cream night ticket as their hero.
- Today's cards sit beside the new ones.

**On theme, element by element** (docs/STYLE.md, rules 1109, 1344, 1914)
- **Card ground and type:** black with cream ink. Bodoni for the display lines, Newsreader for reading lines, the UI sans for MONTAGEFILM.APP. Nothing on the card is grey any more.
- **The still:** the film's own TMDB backdrop in the cards' house grade (saturate .8, contrast 1.05, sepia .08; rule 1344's grade). v1 used the profile backdrop's grey duotone, which is what read as "grayed out".
- **The scrim:** a flat black veil, about 65% behind the lockup and 85 to 93% wherever words sit. It sits on the artwork, not on interface, so the no-gradients-on-UI rule does not apply.
- **The red-and-blue tick:** the app's AccentTick, under the archetype's lines and the list title.
- **One red per card:** the posters' oxblood offset on the archetype, the spine on the Blend and the Pitch (as today), and the ticket's oxblood shadow and ADMIT on the night and Tonight cards.
- **Blue:** only for the Blend %, the 91% match and the eyebrow (rule 1109: blue for the number and the link).
- **The eyebrow:** blue caps on a solid ink chip, the read card's head (rule 1475), so it reads over a bright still.
- **The share stub:** the movie night card's own stub style (rule 1914: #141417 ground, #3a3a3e line, 36 corners, notches at the tear), never cream. Cream on screen is for the one primary, so the stub stays dark. It holds the fan, the card's question in Bodoni, then @handle and the address, with no date.
- **The night ticket:** the app's decided ticket at card scale. That is TheaterRoom's NightTicket: cream, the graded still on top, the title in Bodoni, "year · director", DATE and RUNTIME, the profile ticket's punched holes before the stub, ADMIT N and "Night N", and under the tear "What everyone chose".
- **The bar:** the share sheet's dark drawer ground (#141417, 22 top corners, hairline), not cream. Cream is kept for a main button and there is none here.
- **The faces:** the app's Send to tiles. People and groups are rounded squares (rule 142, the avatar radius) in their own tints, with UI-sans initials and muted names.
- **Search:** an outlined tile, as the app's non-brand share tiles are.
- **The brand discs:** Instagram, Messages and TikTok keep their own colours as on a home screen (rule 717). Copy link and More are outlined.
- **The close:** CloseCircle's square-cornered hairline box on solid black, with no blur. It sits top left as the owner chose in b138. STYLE says a sheet's close is top right, so this is the one named exception.
- **The title chip:** a solid black chip with a hairline in the UI sans, no blurred wash (v1 had a blur).
- **Copy:** sentence case and no em dashes.

**Legibility.** In the mock, the card's Bodoni is pinned at optical size 11, the cut the server draws with (lib/card-fonts.ts). v1 let the browser use the display cut, whose hairlines thinned the 4. Contrast was measured on each new card at 1080 x 1920: each text box against the brightest 5% of the pixels behind it, worst line per card. The full list is in b139-v2-contrast.json.

| Card | Small text | Large text |
|---|---|---|
| Archetype | 10.9:1 | 11.4:1 |
| Blend | 9.0:1 | 8.9:1 |
| Pitch | 9.0:1 | 5.3:1 |
| Movie night | 4.6:1 (Date on the cream ticket) | 5.0:1 |
| Tonight | 4.6:1 (Date on the cream ticket) | 5.0:1 |
| List | 9.5:1 | 5.2:1 |

All pass WCAG AA (4.5:1 small, 3:1 large). The lowest large text is the "Montage" wordmark over the bright top of the still.

**Before and after.** "Today" is drawn by the current card code (main 9aa45af45: lib/type-card.tsx, match-card.tsx, recut-card.tsx, mn-share-card-og.tsx, tonight-pick-card.tsx) with the same sample data, rendered by b139-v2-today/render-today.tsx. The pairs are archetype, Blend, movie night result, Tonight and Pitch, each with a few words on what changed.

**Notes**
- Tonight's card today is the poster pick card (pick-card-v6 B); it becomes the cream ticket with ADMIT 1.
- The Blend gains a 9:16 Story; today it is 4:5 only.
- Files:
  - b139-v2-share.html and b139-v2-share.js (with b138-share.js and .css)
  - b139-v2-today/*.jpg
  - b139-v2-share.png (4378 x 7076)
  - b139-v2-contrast.json
- Render with `node mockups/journeys/b139-v2-render.js`.
