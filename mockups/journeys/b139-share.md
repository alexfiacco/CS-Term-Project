# b139: The share screen, one version

One final version after b138, with the owner's decisions (2026-11-14): option A (pop-up on the first profile visit after saving) and B (Share profile opens the same screen), the new in-app row, and card upgrades 2 + 3 with no date, 1 on the Blend only.

**The screen (393 x 852):** the 9:16 card edge to edge, × top left, a pill naming what is shared, and a cream bar:
- **Send in Montage** (top row): recent chats, friends and groups as faces (friends round, groups rounded squares), Search last (opens today's friend picker). One tap sends; the face reads "Sent". Films, lists and pitches go as the card message the chat already renders; the archetype, a Blend and a movie night go as a link to the page, because chats don't carry images yet (lib/dm.ts, /api/dm take a film, list, pitch or text).
- **Elsewhere** (second row): Instagram Story, Instagram post, Messages, Copy link, TikTok, More. Computer: Save Story size, Save post size, Copy link, More.

**The card:** one still from the card's film (your #1 for the archetype) in the house grade, fading to black by the middle; the outlined ticket stub at the foot with the fan, the card's question, @handle and MONTAGEFILM.APP, no date. The mix bar goes. Words stay inside the Story's safe area (256 top, 380 foot).

**Everywhere (strip):** Blend (a new 9:16, the % set huge, the only card with a number), Pitch shortlist (still from the top film), movie night result (the night's film; the room's name moves into the stub, the date stays in the head), a list (its first film). A movie night invite keeps a private bar (Send in Montage, Messages, Copy link, More). Small link shares stay on the system sheet.

Stills are the films' real TMDB backdrops (montage films.backdrop_url). Files: b139-share.html, b139-share.js (uses b138-share.js and .css), b139-share.png (3520 x 4302). Render: `node mockups/journeys/b139-render.js`.
