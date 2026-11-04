# Decade balance: measured before/after (2026-11-04)

**Status: built and shipped switched OFF.** Nothing anyone sees has changed. To turn it on, change one line in `lib/taste/decade-balance.ts`:

```ts
export const DECADE_BALANCE: boolean = true;   // currently false
```

## What it does once it's on

- **Fair share per decade.** Each decade gets at most its share of a lineup, based on the decades of the films you've watched (under 20 dated films, a typical mix is used). The share is n × your share, rounded by largest remainder. In a single 4-film lineup, a decade you watch less than about 10% of the time gets no slot. Across a session it gets its share.
- **Counted across the session.** A Tonight re-roll doesn't start with a fresh allowance. The web and the iPhone already send the films shown this session (`excludeSlugs`), and the server now reads those films' years. No iPhone change was needed.
- **Fair-share history.** The weekly set is treated as one week in a 13-week cycle. A Tonight session's first roll and a movie night turn through the same cycle hour by hour. Without this, a 4-film lineup only ever holds your four biggest decades (for the owner: the 1990s, 2000s, 2010s and 2020s, and never the 1980s).
- **Soft target, as the owner asked.** One film per lineup may go over its decade's share if it's an exceptional fit: at least 80% as shown, and at least 12 points above what a typical viewer would score it. The 12 points is the same "especially for you" bar the weekly picks and Tonight use, so it's stricter than "truly fits" (10). 80% is about the top 2% of a person's list. A decade can never go beyond its slots plus its share of what was really shown (at least one extra). A film whose high % comes mostly from crowd acclaim doesn't qualify, which rules out most acclaimed classics: a typical viewer scores them almost as high as you do.
- **How a film gives way.** When a decade is over its share, its weakest film is replaced by the best remaining film from a decade that has room. Each surface's own rules still apply (one per lane or franchise, one recent release, the match floors). If nothing qualifies, the film stays. A lineup is never left short to keep the balance.
- **Rooms and groups.** For each decade, the room's share is the geometric mean of the members' shares, held at or under the plain average. Whatever is left is split by the average. This stops one classics fan from raising the share for everyone. Example: the owner plus someone who is 32% pre-1970 gives 18.6% pre-1970 by the old average and 14.2% now. Real rooms (the Fiacco family, alexfiacco + jakelorimer, and others) move by less than a point.
- **A decade you pick yourself always overrides the balance.**

## Surfaces

| Surface | Covered | Notes |
|---|---|---|
| Weekly Picks set (4) | yes | Uses the week's place in the 13-week cycle |
| Reveal top 3 | yes | Keeps the lead / close / lead order; a replacement is labelled "best" |
| Starter picks (newcomers) | yes | |
| Tonight: comfort / growth / especially-for-you / top-up | yes | A swapped film stays in its lane, above the same floors |
| Tonight: popular fallback | yes | Swapped only for another well-loved film |
| Tonight: Surprise | yes | Decade limit applied while picking; fills normally if the limit would leave it short |
| Tonight: watchlist save, rewatch | counted, never swapped | Your own choice, which I assumed the owner would want kept |
| Tonight with friends | yes | Uses the room shares |
| Room Movie Night, group picks | yes | Group picks go through the same builder |
| Taste mixes (Picks, Browse) | yes | Each mix on its own; decade and director mixes are exempt |
| Browse "For you" | no | Already era-balanced by `lib/era-mix.ts` (3 eras) |
| More like this | no | Matching the anchor film's era is the point |
| Friend recs | no | Shows what friends loved |
| Weekly digest email | yes, indirectly | Built from the weekly set |
| Rating deck, seasonal mix, watchlist ranking | no | A rating prompt, a theme, and your own list |

## How it was measured

This is an offline replay of the final selection step for Tonight, the weekly set and the top 3. It runs on each user's real stored match scores (`user_score_vec`, read-only SQL) and uses the real helper code. Details:

- **Users:** 12 real accounts.
- **Candidates:** each user's 500 best unseen films, with filmed theatre, concerts and documentaries removed.
- **Tonight:** 20 sessions of 10 re-rolls of 4, with the real band jitter, floors and today's era caps.
- **Weekly:** 13 weeks.
- **Top 3:** without the archetype echo.
- **"Gap":** how far the decade mix shown is from the library's decade mix (total variation, in points). 0 means identical.

| user | rated | library pre-1970 / pre-1990 | Tonight pre-1970 today -> balanced | Tonight pre-1990 | Tonight gap to library (TVD) | Tonight avg match | Weekly pre-1970 | Weekly pre-1990 | Weekly gap (TVD) | Weekly avg match | Top 3 avg match | over-share films / Tonight session (pre-1970, 1970-89, 1990+) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| afiacco | 390 | 5% / 19% | 0% -> 6% | 20% -> 19% | 21 -> 1 pts | 85.9 -> 85.6 | 0% -> 4% | 19% -> 19% | 16 -> 6 pts | 87.8 -> 88.0 | 90.0 -> 89.3 | 1.2 (0.1, 0.2, 1.0) |
| alexfiacco | 1078 | 5% / 16% | 0% -> 5% | 12% -> 17% | 19 -> 2 pts | 82.8 -> 82.7 | 0% -> 4% | 8% -> 13% | 49 -> 8 pts | 86.6 -> 85.9 | 88.0 -> 86.7 | 3.2 (0.0, 0.3, 2.9) |
| allenjue | 249 | 2% / 8% | 4% -> 4% | 5% -> 10% | 10 -> 3 pts | 88.5 -> 88.5 | 0% -> 2% | 0% -> 8% | 12 -> 7 pts | 90.2 -> 90.5 | 93.3 -> 92.0 | 4.0 (1.1, 0.2, 2.8) |
| baohonghf | 420 | 5% / 13% | 16% -> 9% | 33% -> 22% | 24 -> 9 pts | 88.1 -> 87.8 | 0% -> 2% | 6% -> 17% | 33 -> 7 pts | 88.6 -> 89.6 | 90.0 -> 90.0 | 7.8 (2.1, 4.0, 1.6) |
| benhollis | 92 | 0% / 1% | 3% -> 0% | 3% -> 2% | 10 -> 2 pts | 83.8 -> 83.7 | 0% -> 0% | 0% -> 4% | 14 -> 3 pts | 85.2 -> 85.8 | 87.0 -> 87.0 | 1.4 (0.2, 0.0, 1.1) |
| haydenovemiller | 289 | 1% / 5% | 0% -> 0% | 0% -> 5% | 22 -> 1 pts | 89.2 -> 88.6 | 0% -> 0% | 0% -> 4% | 18 -> 4 pts | 92.1 -> 91.6 | 93.7 -> 92.3 | 0.2 (0.0, 0.0, 0.2) |
| jacobfiacco | 561 | 4% / 14% | 2% -> 4% | 6% -> 13% | 18 -> 2 pts | 86.0 -> 85.5 | 0% -> 2% | 4% -> 8% | 15 -> 8 pts | 86.9 -> 87.0 | 88.7 -> 88.7 | 4.2 (0.0, 0.1, 4.2) |
| jakelorimer | 872 | 10% / 28% | 54% -> 33% | 80% -> 59% | 64 -> 32 pts | 87.3 -> 85.5 | 0% -> 10% | 25% -> 35% | 47 -> 41 pts | 85.4 -> 85.8 | 88.7 -> 88.7 | 6.0 (4.3, 1.2, 0.5) |
| lukedille | 140 | 4% / 10% | 1% -> 5% | 6% -> 12% | 46 -> 18 pts | 86.4 -> 85.4 | 0% -> 2% | 4% -> 8% | 44 -> 38 pts | 88.5 -> 88.5 | 90.7 -> 90.0 | 7.8 (0.0, 0.6, 7.2) |
| movies123 | 53 | 9% / 20% | 0% -> 9% | 8% -> 20% | 22 -> 0 pts | 82.0 -> 82.0 | 0% -> 0% | 8% -> 6% | 37 -> 19 pts | 82.8 -> 83.5 | 84.7 -> 84.7 | 0.0 (0.0, 0.0, 0.0) |
| quinlanoc | 81 | 0% / 0% | 0% -> 0% | 0% -> 0% | 47 -> 2 pts | 84.8 -> 82.7 | 0% -> 0% | 0% -> 0% | 51 -> 12 pts | 85.5 -> 86.1 | 88.0 -> 87.7 | 4.5 (0.0, 0.0, 4.5) |
| tybsdgd | 234 | 0% / 7% | 3% -> 2% | 8% -> 9% | 26 -> 7 pts | 90.6 -> 90.0 | 0% -> 0% | 0% -> 6% | 35 -> 22 pts | 92.3 -> 92.4 | 93.7 -> 93.7 | 8.9 (0.9, 0.4, 7.7) |

**Averages across the 12 users:**
- Gap to the library: Tonight **27 → 7 points**, weekly **31 → 15**.
- Match % cost: Tonight **−0.6 points** (range −2.1 to +0.1), weekly **+0.2** (−0.7 to +0.9), top 3 **−0.5** (−1.3 to 0).
- The % shown on any film never changes. Only which films appear.

## The owner (afiacco)

Library: 1930s 0.4%, 1940s 0.6%, 1950s 1.5%, 1960s 2.7%, 1970s 4.2%, 1980s 9.5%, 1990s 18%, 2000s 31%, 2010s 22%, 2020s 10%.

| Tonight, 800 films (20 sessions × 10 rolls × 4) | 50s | 60s | 70s | 80s | 90s | 00s | 10s | 20s |
|---|---|---|---|---|---|---|---|---|
| today | 0 | 0 | 13% | 7% | 18% | 18% | 29% | 15% |
| balanced | 2% | 3% | 4% | 10% | 18% | 31% | 22% | 10% |

| Weekly set, 13 weeks | 60s | 70s | 80s | 90s | 00s | 10s | 20s |
|---|---|---|---|---|---|---|---|
| today | 0 | 8% | 12% | 21% | 21% | 25% | 13% |
| balanced | 4% | 4% | 12% | 19% | 29% | 23% | 10% |

- **Lineups:** at most one pre-1970 film per Tonight lineup, both today and with the balance.
- **Over-share allowance for the owner:** 1.2 films per 10-roll session. Of those, 0.1 are pre-1970 and 0.2 are from 1970 to 1989.
- **Old films that still get through, in one balanced session:**
  - Fair share of their decade: Paths of Glory (1957, 91%), The Leopard (1963, 84%), A Woman Under the Influence (1974, 89%), Scenes from a Marriage (1974, 87%), Das Boot (1981, 88%), Ran (1985, 85%), Grave of the Fireflies (1988, 84%).
  - Over-share exception: Thief (1981, 83%). A typical viewer would score it 70%, so it's 13 points more yours than the crowd's.
- **Old films in the balanced weekly sets:**
  - Fair share: The Great Escape (1963), Who's Afraid of Virginia Woolf? (1966), Paper Moon (1973), Das Boot (1981), Sunday in the Park with George (1986).
  - Exception: Superstar: The Karen Carpenter Story (1987, 85% vs a typical 69%).

So, for the owner: it "does a bit". Acclaimed classics show up at about your own share, and the one over-share slot goes to a film that suits you rather than the crowd. Today's caps let no pre-1970 film through at all (the per-lineup cap rounds to 0), while the 1970s ran at three times their share.

## Surprises and caveats

- **For most users the balance shows more pre-1970 films than today, not fewer.** Today's caps round a 5% share down to zero per lineup and keep it there. The balance gives the share back over a session or a season. The 1970s and 80s are what it trims. In this replay, today's Tonight showed the owner no 1950s films. The three the owner saw most likely came through paths the replay doesn't model: the Surprise lane, mood or genre pools, or the watchlist and popular lanes. All of those are now inside the balance except the watchlist.
- **jakelorimer**, the heaviest classics watcher (10% pre-1970, 28% pre-1990), drops from 54% to 33% pre-1970 on Tonight. It doesn't reach 10% because his 500 best unseen films are 92% pre-1990: after a few re-rolls, the replay runs out of strong newer films, and the floors win. The live Tonight pool (genre and popular pools) is newer than his global top 500, so the live result should land closer to his share.
- **Exceptions are mostly recent decades for modern-leaning users** (lukedille 7.2 of 7.8 per session, tybsdgd 7.7 of 8.9). These are exceptional 2010s and 2020s fits going over their share, not old films.
- **Thin profiles** (movies123, 53 rated) never reach 80% as shown, so they get no exceptions. Their mix follows the library exactly.
- **Not replayed:** the mixes and the Surprise lane (their pools are built live), room lineups with real member scores (only the shares were compared, above), and the reveal's archetype echo.

## Files

- `lib/taste/decade-balance.ts`: the helper and the flag.
- Wiring: `lib/weekly-picks.ts`, `lib/movie-night.ts`, `lib/taste-mixes.ts`, `app/api/tonight/route.ts` (`sessionSlugs`).
- Rule 1018 in `docs/INVARIANTS.md`, checked in `scripts/check-invariants.ts`. Entry in `docs/DATA-SCIENCE-LOG.md` (2026-11-04).
