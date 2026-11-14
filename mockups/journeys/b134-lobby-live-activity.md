# b134: movie night on the lock screen from the lobby

Owner: the Live Activity starts only once there are films to vote on; show a lobby state from the moment the night starts.

Today (montage 965f5787): RoomModel.syncActivity starts it only when you are seated and picks exist (`s.leading != nil`); stages are voting and decided; the app updates it itself (`pushType: nil`) and it shows "Not live" after 15 minutes without an update (rule 802).

**Recommended: frames 2 and 3 and the island in section b.** Two new stages in the existing pieces (red live dot kicker, faces, End, Bodoni 19 line, UI 11 sub line, the empty ticket tile where the poster goes): "MOVIE NIGHT · WAITING", "Waiting for everyone", "3 joined · Hugo invited"; then "MOVIE NIGHT · MOODS", "Picking moods", "2 of 4 ready · then the films"; then today's voting view, in the same activity. Compact island: "Movie night" and "3 joined" in the blue where "1/3 voted" sits.

**Needs:** Stage gains lobby and moods, a ready count and invited names or count; syncActivity starts when seated in a live room.

**The honest problem:** the lobby is when you lock the phone and wait, and the activity updates only from the running app. The count would freeze and go Not live in 15 minutes. To be worth shipping it needs push updates (an APNs push token per activity sent to the server, the server pushing on join, ready and dealt). That is real backend work. I would not ship a lobby state without it: a wrong count is worse than none.
