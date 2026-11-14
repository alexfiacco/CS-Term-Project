# b133 v2: the decided night closes with an X, top right

The owner put the X at the **top right**, matching Tonight's result ×, with nothing at the top left.

**Recommended (frame 2):** the 36pt on-image circle with the close X at the top right, VoiceOver label "Close". It goes on the decided ticket and on the ended room. While a night is still open, the back circle stays at the top left: there it means leave the room, and you can come back.

**What the X closes:** only the room's cover. A room is presented as a full-screen cover (PageStack.openRoom, the app root's screenCover), never pushed, so there is nothing to pop. The X calls the same `dismiss()` the chevron calls today, and you land where the room was opened:
- Social's movie nights, Tonight's drawer, or the group.
- The tab you were on, if the room was opened from a link with nothing under it.

"Start another" swaps rooms inside the same cover, so the X closes all of it. The web already exits to where the room was opened from (lib/return-to.ts, rule 189); only its glyph and position change.

**Watch:** on a bright still, the on-image circle (dark fill, light edge) keeps the X legible.

The landing frames in section b are rough sketches, not exact screens.
