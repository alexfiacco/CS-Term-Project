# b132: Watching tonight, from the moment you pick

Owner: show the watching card from the moment you pick, with a way to start the film; after, today's Rate it card. Tonight reopened that night lands on the film; the widget shows it.

Today (montage 965f5787): Picks' WatchingCard shows only from dueAt (pick + runtime + 20 min) with Not yet and Rate it; Tonight reopened shows the cream ticket with Rate it (even minutes after picking) and a full secondary Pick something else; the Tonight widget shows the day's dealt film and its match.

**Recommended:**
- Picks (frame 2 then 4): the same slim card 8 under the tabs from the moment you pick: "Watching Memento tonight", "On Netflix · picked at 8:10 pm", cream Play (opens the service at the film via the pick's TonightWhere url). At dueAt it becomes today's Rate it card unchanged. No service: "Where to watch".
- Tonight reopened (frame 6): before dueAt the cream button is "Play on Netflix" (the words Tonight already uses) and Pick something else drops to a quiet text button; after, Rate it with the same quiet Pick something else.
- Widget (frame 7): once chosen, "Watching tonight", title, director, and "On Netflix" in place of the match. A tap opens the app on the film with Play; a widget can't open Netflix directly.

**Needs:** save the chosen pick's first TonightWhere (label, url) in LastNight.remember and a service name in the widget snapshot (Film.chosen exists). Movie night films (rememberNight) carry no service, so they show "Where to watch". No server change.

**Costs:** before dueAt Picks has two creams (the deck stub and Play). Frame 3 (outline Play) keeps one, but the card would change weight halfway through the evening.
