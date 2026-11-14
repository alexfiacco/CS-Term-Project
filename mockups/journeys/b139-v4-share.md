# b139 v4: The full share cards, with the Montage lockup

The owner asked to see a full share card, and said the Montage mark should say Montage: the logo and the word "Montage" somewhere on the card. This version makes three changes.

- **The lockup is in the foot stub of every card.** It is the official one: `public/brand/montage-fan-glyph.svg` (the red and blue fan) and `public/brand/montage-wordmark.svg` ("Montage" in Fraunces SemiBold, outlined), set as the app header's BrandMark sets them. The glyph is at 44 and the wordmark's cap height at 18, 1 apart, here scaled to a 92 px glyph and a 38 px cap. Under it is the card's question in Bodoni; past the tear are @handle and MONTAGEFILM.APP. It is the card's one mark, and the top of the card has no wordmark. It reads at Story size, and at a phone's 393 width it is about 14 pt.
- **The stub is a little taller (232).** It holds the lockup with the question on one line under it, still above the Story's bottom 380.
- **Each card is exported alone at the real Story canvas, 1080 x 1920**, exactly as it would be saved or posted. The empty band at the foot is the bottom 380 that Instagram's and TikTok's chrome covers; nothing is drawn there on purpose (rule 1344).

**Files**
- One PNG per card: b139-v4-card-archetype.png, -blend.png, -night.png, -tonight.png, -pitch.png and -list.png.
- b139-v4-cards.png is the six side by side (6760 x 2040).

**Contrast** is re-measured (b139-v4-contrast.json). All six pass WCAG AA. The lowest is the cream ticket's Date label at 4.6:1. The wordmark sits on the stub's flat ground.

| Card | Small text | Large text |
|---|---|---|
| Archetype | 8.9:1 | 13.6:1 |
| Blend | 9:1 | 8.9:1 |
| Movie night | 4.6:1 | 8.9:1 |
| Tonight | 4.6:1 | 8.9:1 |
| Pitch | 9:1 | 13.9:1 |
| List | 7.9:1 | 12.7:1 |

**Source:** b139-v4-card.html?card=<kind>, b139-v4-share.js (v3's cards with the new stub), b139-v4-brand.js and b139-v4-brand/. Render with `node mockups/journeys/b139-v4-render.js`.
