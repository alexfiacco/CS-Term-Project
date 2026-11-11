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
