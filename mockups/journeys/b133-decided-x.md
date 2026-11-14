# b133: an X on the decided night

Owner: the decided ticket's top-left back chevron leads "back into a finished vote"; replace it with an X that closes to wherever the night started.

**What the code does** (montage 965f5787): a room is presented as a full-screen cover (PageStack.openRoom presents `.room` as a cover; the app root's `screenCover`), never pushed. On a closed night the chevron already calls `dismiss()` ("Back to Montage" for VoiceOver). So the X needs no new navigation: it closes the cover and you are on whatever was under it (Social's movie nights, Tonight's drawer, the group page, or the tab you were on when it was opened from a link). Nothing to pop. "Start another" swaps rooms inside the same host, so the X closes the whole host. A film opened from the ticket sits over the room; closing it returns to the ticket. The web already exits to where the room was opened from (lib/return-to.ts, rule 189).

Tonight's own result already closes with an × at the top right, so only the room needs this.

**Recommended: frame 2,** the X in the same top-left spot, on the decided ticket and the ended room. While a night is open the chevron stays (Back there means leave the room, and you can return). Frame 3 (top right, like drawers) moves the way out at the last step of a flow whose exit has been top left throughout.

The landing frames in section b are schematic, not full screens.
