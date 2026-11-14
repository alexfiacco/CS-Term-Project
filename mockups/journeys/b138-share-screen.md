# b138: One full-screen share screen

The owner wants "Share your archetype" (build 41's one-time ticket card on the profile, rule 2071) to be a full-screen pop-up like a competitor's share screen: the 9:16 card edge to edge, a close at top left, a light bar of round one-tap targets that scrolls sideways. The follow-up: every share in the app should look like that, and the cards could use some inspiration. Montage's own card, not the competitor's look.

Read on montage 8b6002135: iPhone `ProfileNudges.swift` (decideShare, FirstRunSlot, settleShare), `ShareCardSheet.swift`, `ShareElsewhere.swift` (ElsewhereRow); web `ProfileNudges.tsx`, `ShareTypeSheet.tsx`, `ShareFilmSheet.tsx`; `lib/type-card.tsx` (the card, ported into b138-share.js at real size).

**Part 1, the pop-up (b138-share-popup.png)**
- **A, first profile visit after saving (recommended).** The card full screen, × top left, a "Your archetype card is ready" pill, the bar: Instagram Story, Instagram post, Messages, Copy link, TikTok, More. It opens on the first visit to your own profile and doesn't wait for the launch's first-run slot (today it waits behind Picks' coach marks). × or a swipe down closes it for good; so does any send. Shown once.
- **B, later from Profile › Share profile.** The same screen replaces the drawer. Instagram post sends the 4:5 Post; everything else the Story. The profile cover is page 2 (swipe), with its Red / Blue flip there.
- **C, true stats (later).** Up to three lines: films rated, weekly streak, top director, each only when true. Percentile ranks ("Top 5%") aren't meaningful at today's user count.
- Phone browser and computer frames, and a per-target table.

**One tap, honestly**
- Instagram Story, iPhone: 1 tap. Card as `backgroundImage` on the pasteboard + `instagram-stories://share?source_application=<Meta app id>`. Needs the Meta app id shipped; today's code sends a small sticker, and without the id saves to Photos instead.
- Instagram post: no API. One tap saves the 4:5 to Photos and opens Instagram; the person picks it. Say so in a toast.
- Messages: 1 tap. MFMessageComposeViewController with the PNG attached (today: text and link only).
- Copy link: 1 tap everywhere.
- TikTok: 1 tap with TikTok's Share Kit (client key, TikTok review, Photos save first); save and open until then.
- More: 1 tap, the system sheet.
- Web on a phone: brand circles open the system share sheet with the image (`navigator.share({ files })`), one more tap. Computer: Save Story size, Save post size, Copy link, More where supported.

**Part 2, every share (b138-share-everywhere.png).** Inventory of 14 share surfaces (web and iPhone) with what and how they share today. The same screen shown for the archetype card, Blend (a new 9:16), Pitch shortlist, movie night result, a list, and a movie night invite (link only today: a generated card and a private bar of Messages, Copy link, More). Small link-only shares stay the system sheet.

**Part 3, card upgrades (b138-card-upgrades.png).** 1, one hero fact huge in Bodoni; 2, an outlined ticket stub at the foot with the fan, @handle, date and address; 3, one graded still from their #1 film instead of the dim poster wall. Before and after for the archetype and the Blend. Recommended: 2 + 3 on every card, 1 where a card has a true number (Blend's %).

**Honest costs.** A full-screen pop-up on the first profile visit interrupts; shown once, × or swipe down closes it. Opening it there can stack with Picks' coach marks in the same launch (rule 2066 needs amending). The drawer's Story / Post switch and "What's our Blend?" row go. Every share surface has to move together or the app has two share looks for a while. One-tap Instagram and TikTok depend on keys and TikTok's review. The still adds a server fetch per card and a version bump. Rules 147, 1344 and 2071 get amended, web and iPhone together.

Files: b138-share-popup.html / .png (3876x6496), b138-share-everywhere.html / .png (5320x4400), b138-card-upgrades.html / .png (4082x2944); shared b138-share.css, b138-share.js. Rendered with `node mockups/journeys/b138-render.js`.
