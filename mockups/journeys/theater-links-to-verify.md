# Theater links to verify (rule 1519)

Today only **Fandango** uses a link for the film itself. Every other chain opens its own front page. That's safe, but it's one extra step for the user.
To switch a chain to a film link, tap its candidate URL below on your iPhone and in a desktop browser, using a film that's in theaters now (replace `TITLE`, e.g. `Wicked%3A%20For%20Good`).
If it works, set `verified: true` for that chain in **both** `lib/provider-links.ts` (THEATER_CHAINS) and `ios/Montage/Sources/Design/Theaters.swift` (TheaterChain.all). If the URL is different, fix `filmPattern` (`{q}` = the encoded title).

What to check for each link:
1. It loads (no 404 and no "page not found").
2. It shows **that film** or a search result with the film first, not just the home page.
3. On iPhone with the chain's app installed: it opens **in the app** (a universal link). Without the app: it opens in Montage's in-app browser.
4. You can get from it to showtimes near you in one or two taps.

| Chain | Live now (home) | Candidate film URL (off until verified) |
|---|---|---|
| Fandango (on) | https://www.fandango.com/ | https://www.fandango.com/search?q=TITLE&mode=general (affiliate-wrapped when the prefix is set) |
| AMC | https://www.amctheatres.com/ | https://www.amctheatres.com/search?q=TITLE |
| Regal | https://www.regmovies.com/ | none yet. Search for a film on the site and send me the URL pattern you get |
| Cinemark | https://www.cinemark.com/ | none yet. Same as Regal |
| Alamo Drafthouse | https://drafthouse.com/ | none yet. Its film pages are per market; send me one |
| Marcus | https://www.marcustheatres.com/ | none yet |
| Harkins | https://www.harkins.com/ | none yet |
| Showcase | https://www.showcasecinemas.com/ | none yet |
| Landmark | https://www.landmarktheatres.com/ | none yet |
| Angelika | https://www.angelikafilmcenter.com/ | none yet |

Also check that every **home** link above loads. If one doesn't, tell me and I'll swap it.

## Results from the automated check (2026-11-12)

Claude checked these with a web fetcher and web search, not a phone. **No new film link could be confirmed, so nothing changed in the code.** Every chain except Fandango still opens its home page, and Fandango keeps its search link. Wicked: For Good has left theaters, so the test used current films, such as The Hunger Games: Sunrise on the Reaping.

| Chain | Home link | Film link | Why |
|---|---|---|---|
| Fandango (on) | not reachable | stays on | This session's network doesn't allow fandango.com. It hasn't been rechecked, and it stays on as before. |
| AMC | blocked (403) | not verified | The site refuses automated fetches. Its film pages are `/movies/<slug>-<id>` (e.g. `/movies/wicked-for-good-69654`). That needs an AMC id, not a title, so `{q}` can't build it. `/search?q=` can't be checked from here. |
| Regal | blocked (403) | not verified | The site refuses automated fetches. Web search found no film or search URL pattern. |
| Cinemark | loads | not verified | `/search` exists ("Cinemark - Search Results"), but `query`, `q`, `term`, `keyword`, `searchTerm`, `searchText` and `s` all came back "No Search Results for ''". The search seems to run in the browser, so a fetch can't show it. Film pages are `/movies/<slug>`, which needs a slug, not `{q}`. Worth one phone test: run a search on the site and send me the URL. |
| Alamo Drafthouse | loads (shows "Movies & showtimes") | not verified | `/search?q=` is a 404. Search filters as you type, with no URL. Film pages are `/show/<slug>`, and showtimes depend on the market. |
| Marcus | page came back empty | not verified | The page loads its content in the browser, so a fetch sees nothing. `/search?q=` came back empty too. |
| Harkins | loads (title "Harkins Theatres \| Home") | not verified | `/search?q=` is a 404. The page loads its content in the browser. |
| Showcase | loads | not verified | `/search?q=` is a 404. Film pages are `/movies/<id>-<slug>` (e.g. `/movies/269068-avengers-doomsday`), which need an id. |
| Landmark | loads | not verified | `/search/?q=` is a 404. The site makes you pick a location, and showtimes are at `/showtimes/`. |
| Angelika | loads (only a bare title, "Movie Information \| Tickets \| Showtimes") | not verified | The page loads its content in the browser. `/search?q=` returned the same bare title. |

**Still needs your phone or desktop:** (1) Universal links: whether a link opens in the chain's app can't be tested here. (2) AMC, Regal and Fandango, which are blocked from this session. (3) For Cinemark, Marcus, Harkins and Angelika, run one search on the site and send me the URL in the address bar. All four home links that loaded are fine to keep. AMC, Regal, Marcus and Fandango were blocked or came back empty for the fetcher, not shown to be broken.
