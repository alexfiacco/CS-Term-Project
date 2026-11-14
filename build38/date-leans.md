# "Date boost leans (rule 1830)": what it means

Explanation only, nothing built (owner: "show me"). Written 2026-11-14 for build 41, against main `e6c7ec0b1`.

## The short version

"Date" here means **a timestamp**, not date night. The item is: record *when* each "boost" lean was
added, the same way rule 1830 already records when every other stated preference was set. Nobody
would see a difference in the app, and no film would move in Picks or Tonight. It is bookkeeping
the taste layer needs before it can learn from boosts without cheating.

## What exists today

**Boost leans (rule 1781).** On Tune your picks, tapping a "Near your taste" chip or "+ Add" adds a
lean. If "Your kind of films" can hold it (a genre while fewer than five are picked, a kind era, a
language) it goes there. Otherwise (a strand like "dream logic", a director, or a genre, era or
language that kind cannot take) it goes into `viewingPrefs.boost`. A film that carries a boosted
lean gets **+4 rank points per lean, 8 at most** (`BOOST_POINTS`, `BOOST_CAP` in
lib/learned-leans.ts `leanPoints`) in Picks, Tonight, In theaters and every ranked list. The match %
and Screen DNA never read it.

**Rule 1830 (dated stated preferences, 2026-11-13).** Beside the plain lists, `viewingPrefs.setAt`
stores `"<list>:<entry>"` → the time the entry was first added. Dated today: Show less of
(`notMine`), Things I'd rather avoid (`avoid`), Tune your picks' removals (`learnedOff`) and its
active chips (`learned`), and Your kind of films (`kind.genres`, `kind.eras`, `kind.langs`,
`kind.subtitles`). Entries that existed before 2026-11-13 read `null` (unknown).

**The gap:** `boost` is not on that list (lib/pref-dates.ts `datedKeys` skips it). So a boost has no
date, ever. Every write path already runs `stampPrefDates`, so it is only the list of keys that
leaves boost out.

## Why it matters

The taste layer (rule 1831, in shadow: logged, never shown) and its backtest can only use what a
person said **before** a rating. If a statement has no date, a test cannot tell whether "more
dream logic" came before or after they rated Mulholland Drive 5★, so using it would leak the answer
into the test. That is why taste-layer-backtest.md could not test Show less of and avoid before
rule 1830 dated them. Boost is in the same position today: the layer does not read boosts at all,
and could not be tested on them honestly if it did.

## What the change would be

- lib/pref-dates.ts `datedKeys`: add `boost`, so `setAt["boost:strand:dream-logic"]` is stamped.
- New boosts get the server's time when they are added; boosts that already exist read `null`
  (unknown), as every pre-1830 entry does. There is no way to recover their real dates.
- Rule 1830's text and check, the `setAt` comment in lib/viewing-prefs.ts, docs/app, and a
  DATA-SCIENCE-LOG entry (it touches what the taste layer can learn from).
- No client change (web and iPhone ignore `setAt`; the server never takes it from a request).

## Before / after, concretely

Sam adds "Dream logic" from Near your taste on 20 November, then rates Mulholland Drive 5★ on
22 November and Synecdoche, New York 4.5★ on 25 November.

| | Today | After the change |
|---|---|---|
| What Sam sees | Dream logic in More of this | The same |
| Picks / Tonight order | Films labelled 60+ on dream logic get +4 rank points | The same +4 |
| Match % | Unchanged by the boost | The same |
| Stored | `boost: ["strand:dream-logic"]` | the same, plus `setAt["boost:strand:dream-logic"]: "2026-11-20T…"` |
| Taste layer backtest | Cannot use the boost (no date: might be after the ratings) | Can use it for the two ratings after 20 Nov, and knows it was not there for anything rated before |

## Honest notes

- No visual or copy change, so no mock.
- It does not make boosts work any better by itself. It is the first of two steps; the second
  (a taste-layer term from boosts, and whether it helps) is not designed or tested.
- Value grows only from the day it ships: boosts added before then stay undated. How many people
  have boosts today was not measured.
- If you meant **date night** (the Tonight occasion): that is a different thing, `occasionLean` in
  lib/occasion.ts (romance × 0.07, +3 warm, +2 funny, −8 crushing, −5 terrifying, −5 brutal, ±12 at
  most, plus the `fitsDate` filter). Nothing in the backlog changes it, and rule 1830 has nothing to
  do with it.
