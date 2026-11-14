# b127: a heart on every take, hold for the rest

Owner, build 40: a heart on each discussion post to like it in one tap, and long-press to react, like iMessage tapbacks.

**What takes support today** (montage 965f5787): five reactions (❤️ 😭 🔥 😂 🤯) stored in `film_take_reactions`, one row per person per emoji. A take shows them as chips only once someone has used one; to like a take you hold it (0.45s) and tap ❤️ in the hold drawer (rule 1287). Replies already have a heart on the right (CommentRow). The web also likes on double tap; iOS doesn't (rule 759).

**Recommended: frame 2 plus frame 4.** A 20pt heart at each take's top right with its count, blue when yours (the reply row's heart at take size); ❤️ leaves the chips; hold stays the existing drawer with the five reactions on top.

- Frame 3 (heart and a smile-plus react button in the action line) makes reactions findable but crowds every take's 28pt line and adds a control used nowhere else.
- Frame 5 (iMessage lift and bubble) is the look rule 1287 removed everywhere; takes would be the one place that holds differently.

**Backend:** nothing new for the like. A like is the ❤️ reaction: same table, the existing `react` action, already counted in Top and notified as `take_like`. Optional later: "who liked this" needs a small read of profile ids for a take's ❤️ (filtered like the take). Client: split ❤️ out of the chips, add the heart column (iOS and web). Decide double tap: I'd drop the web's so both apps match.

**Costs:** the heart column takes 36pt of width, so takes wrap slightly more. A visible like will pull use away from the other four reactions.
