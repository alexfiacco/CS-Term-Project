# b139 v3: Send in Montage, and one mark per card

The owner's last notes on v2. This is one version with no options.

**1. Send in Montage, in full.** It opens from Search on the share screen's in-app row, or by holding a face. It takes Instagram's ideas but draws them in Montage's language (owner: "have our style and theme, but employ their ideas").

| Instagram's idea | How Montage draws it |
|---|---|
| A send sheet over the content | The app's own bottom drawer (22 top corners, hairline, black ground, rules 671 and 680). Its height is fixed, because it holds a search (rule 680's named case). Bodoni title "Send in Montage" with the red-and-blue AccentTick under it (rule 1254), and the square hairline close at top right. |
| Search at the top | Send to's search icon beside the "Recent" heading opens a field in place (rule 650). The field is our 12-radius field on the panel ground; Cancel closes it. There is no pill search bar. |
| Recent and suggested people and chats | Two sections, each with a Bodoni heading. "Recent" is Send to's tile row: rounded squares in each person's tint with sans initials (rules 142, 1338); a Montage group or group chat is a 12-radius tile holding its members' small faces. "Your people" is hairline rows, each with a face, name, @handle and the Blend % in blue Bodoni. There is no circular avatar grid. |
| Pick several, with a check | Send to's picked state: the blue select ring and its small check badge (rule 650). A picked row says "Picked" in blue. Search results keep the picks in a "Picked" row above the matches. |
| An optional message | Send to's note field, "Add a note (optional)", set in Newsreader. Under it in the sans: "Each gets it in your chat with them." |
| Send to several | One cream button, "Send to 3", the one primary on the panel. Each person gets the card in their own chat, as Send to does today. |
| Make a group from the picks | With two or more picked, an outlined "Make a group chat" sits beside Send at the same height. It opens "New group chat": back, the picked tiles plus Add, an optional Name (it reads as the members' names until someone names it), one line saying who can see it, and cream "Create and send". |

All copy is in sentence case, with no em dashes.

**What exists today (read on main 9aa45af45)**
- A friend chat is a group of kind "dm" with exactly two members, one per pair, with an id derived from the pair (lib/dm.ts). There are no multi-person direct messages.
- Picking several and sending to each at once already exists: SendToGroupSection, with the select ring, check, note and "Send to N" (rule 650).
- Montage groups (kind "group", POST /api/groups) need a name, hold up to 8 including the creator (rule 1359), and friends join by accepting an invite (/api/group/members).

**What's new on the server.** Group chats are new.
- Recommended: build a group chat as a Montage group, not a new kind. That gets the thread, cards, reactions, read marks and blocks for free.
- POST /api/groups would take an optional name and make the shown name from the members.
- Mutual friends would be added straight in rather than invited, so the card lands in a chat everyone already sees.
- The group header and the chats list show the made-up name.
- The same is needed on the iPhone.
- No new table. About a day of work per platform, plus its invariant.
- Open question for the owner: should a group chat get a group's extras (watchlist, picks, movie night)? The default would be yes, since it is a group.
- Cards in a chat: films, lists and pitches go as the card the chat already renders. The archetype, a Blend and a night go as a link to the page, because chats don't carry images yet.

**2. One Montage mark per card.** The fan mark and @handle in the foot stub are the card's one mark, with montagefilm.app beside them. The top-left "Montage" wordmark is gone from all six cards, because it was doubled on all six (archetype, Blend, Pitch, movie night result, Tonight, list). The cream ticket carries no logo. A card's eyebrow (Blend, Pitch, Movie night, Tonight's pick) keeps its solid chip at the top left.

**3. The oxblood shadow.** The cream ticket keeps its oxblood offset shadow (11 at card scale), on Tonight and movie night only. It is the house's one red accent on those two cards. The other cards keep their own single accent: the posters' offset on the archetype, the spine on Blend and Pitch.

**Contrast**, measured as in v2: each text box against the brightest 5% of the pixels behind it, worst line per card. Every card passes WCAG AA; full list in b139-v3-contrast.json.

| Card | Small text | Large text |
|---|---|---|
| Archetype | 10.9:1 | 14.7:1 |
| Blend | 9:1 | 8.9:1 |
| Pitch | 9:1 | 13.9:1 |
| Movie night | 4.6:1 | 8.9:1 |
| Tonight | 4.6:1 | 8.9:1 |
| List | 9.5:1 | 14.2:1 |

**Files**
- b139-v3-share.html, b139-v3-share.js (v2's cards with one mark) and b139-v3-send.js (the panel). They use b138-share.js and .css.
- b139-v3-share.png (4120 x 3882).
- b139-v3-contrast.json.
- Render with `node mockups/journeys/b139-v3-render.js`.
