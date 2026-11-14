# b41-chat renders

The b41-chat branch of montage (rules 2076, 2077), rendered from a local `next dev` with every /api answer faked (no real accounts), 393 wide at 2x. The Send in Montage row is mounted on a stand-in share screen (the share-screen agent embeds the real one). The group chat page was mounted directly (the real /g/<id> asks the database for the chat's kind first).

1. `01-row-393.png`: The row on the share screen: Search pinned first, recent faces (a tap sends), More
2. `02-row-sent-393.png`: A face tapped: sent at once, a quiet blue check and Sent
3. `03-panel-393.png`: More: the panel, Recent tiles and Your people with the Blend % in blue
4. `04-three-picked-393.png`: Three picked: Send to's ring and check, Picked on the rows, Make a group chat beside cream Send to 3
5. `05-search-393.png`: Search in place: Picked kept above Matches
6. `06-new-group-chat-393.png`: New group chat: the picked tiles and Add, the name reads as their names, Create and send
7. `07-search-from-row-393.png`: Search on the row: the panel opens with the field focused
8. `08-group-chat-top-393.png`: A group chat: faces and the members' names, then Group Blend, On all your watchlists, Start a movie night
9. `09a-card-archetype-393.png`: The archetype card: Sam's archetype, streak and tagline; opens the profile
10. `09b-card-blend-393.png`: The Blend card: the group's %, the band in italics; opens the Blend
11. `09c-card-night-393.png`: The movie night card: the night's ticket, ADMIT 4, what everyone chose; opens the night
12. `09d-card-tonight-393.png`: The Tonight card: ADMIT 1, 91% match for Priya; opens the film
13. `09e-card-unavailable-393.png`: A card the reader may not see (a blocked or gone profile)
14. `10-group-blend-393.png`: Group Blend: how alike, and the films the whole chat would love
15. `11-on-all-watchlists-393.png`: On all your watchlists: everyone's first, then most
16. `12-chat-details-393.png`: Chat details: name (optional), people, Add friends, Leave

`contact-sheet.png` has all of them.

Not rendered: the iPhone (Swift is not compiled in this session), the pair chat with a card (it draws the same card), the Chats list row for a group chat.
