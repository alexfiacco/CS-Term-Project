# b128: one Filters drawer on every film grid

Owner, build 40: Browse's Filters is full; a list's ("Seen 405 of 431") is missing filters and mostly empty space.

**What the code does today** (montage 965f5787): there is already one `FiltersSheet`. Two things make lists look broken:
1. Browse opens it as the app's drawer at fit height; every other page (lists, mixes, your Films and Watchlist, person and theme pages, a group's list) opens it with `.sheet` + `.large`, so it fills the screen and the rows float over about 170pt of nothing.
2. Under 8 rows the group headings drop (`headed = rows >= 8`), so a list's sheet has a different shape.

Missing rows are the smaller part. Inventory (iOS):

| Row | Browse | Person, theme | List | Mix | Films | Watchlist | Group |
|---|---|---|---|---|---|---|---|
| Who's watching | yes | personal pages | no | no | no | no | no |
| Streaming | yes | yes | yes | yes | yes | yes | yes |
| Status | yes | yes | seen stat on page | seen stat | no | no | no |
| Your rating | no | no | no | no | yes | no | no |
| Mood, Decade, Age rating | yes | yes | yes | yes | yes | yes | yes |
| Genre, Length | yes | yes | yes | no | yes | yes | yes |
| Popularity | yes | no | no | no | no | no | no |
| People and themes | yes | no | yes | yes | yes | yes | yes |
| Language | any number | any number | one | one | one | one | one |

**Recommended (frames 3 to 5):** open it as Browse does on every page, always show the three headings (Watching, The film, More), and give every grid the same rows in the same order. Rows that can't apply are **hidden**, not greyed:
- Who's watching: hidden on lists, mixes, Films, Watchlist and groups (it needs per-friend matches that only Browse's server route computes).
- Status: added on lists, mixes and groups as the same state as the page's seen stat; hidden on Films (all seen) and Watchlist (all unseen).
- Your rating: Films only.
- People and themes: hidden on a person or theme page (the page already is one).
- New everywhere: Popularity (lists filter from facets that already carry `pop`; person and theme pages need the tag route to support it), Genre and Length on mixes, Language as any number.

Frame 6 shows the greyed alternative: identical drawers, but rows that do nothing, and a taller drawer.

**Costs:** Status in the drawer duplicates the seen stat's menu (I think the drawer should hold every filter, but it is two doors). Changing Language to any number on lists changes a filter some people kept this session.
