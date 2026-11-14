# b127 v2: takes and replies get Lately's action line

The owner picked b127 frame 3 "the way it is on Lately", with replies matching. This version uses Lately's real post bar in place of my invented smile-plus circle and chips. Sources: iOS `PostSocial.swift` PostActionBar; web `PostSocial.tsx` PostReactions, plus `.lp-act` / `.lp-pick` in globals.css.

**Lately's bar, used as is:**
- A 20pt heart in ink with its count in muted UI 13. When you've liked it, the heart is filled and the count is blue.
- A 20pt smile reading "React", or the other reactions inline ("🔥2 😂1"), with no chips.
- 16pt between items, 44pt tall.
- Tapping React opens Lately's pill: a panel-2 capsule of the five reactions in 40pt circles, yours ringed, sitting just above the line.

**Recommended (frames 1 to 3):** this line goes under every take and every reply as heart, React, then **Reply** in Lately's comment slot. Replies lose CommentRow's right-side heart and "2 likes" text. Long-press stays the existing hold drawer, with ❤️ first and on when you've liked it. The heart, the pill and the drawer are one state.

The frames show Emma's take with Priya's reply under it, Sam's take that you've liked, and Hugo's take with no reactions.

**Frame 4 (alternative):** Lately's speech-bubble icon with the reply count in place of Reply. On a take the thread is already open underneath, so the count repeats "N more replies"; the word is clearer.

**Left off on purpose:** Lately's hairlines above and below the bar. Under every take in a list they would box the thread up.

**Backend:** none. A like is the ❤️ reaction: `film_take_reactions` for takes, `message_reactions` for replies. It uses the existing react action and the existing `take_like` notification.

**Web double tap:** the web likes takes and replies on double tap; iOS doesn't (rule 759). With a heart on every line, drop the web's double tap so both apps like the same way. If the owner wants double tap, bring it to iOS as well; chat already does it without delaying taps (rule 1370).

**Cost:** each reply grows by about 20pt, so long threads get taller.
