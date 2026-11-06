# Theorist, Nostalgic and no series: dry run (no save)

2026-11-06. Owner: "go with Theorist, then run numbers on how people will change, and then we'll have to add the nostalgia streak as well." Build list after-build-22, item 9.

Nothing was written anywhere. The data came out of the live database through SELECT-only queries (Supabase SQL, project uktamekqqsiijugpaxit), saved to local JSON, and the read was replayed offline with the one taste model's own code (`computeReport`, `readFilmsWith` in lib/taste/unified/report.ts) in a scratch worktree with no database keys at all, so the replay could not write even by mistake. No migrations, no pushes, no Actions, no AI calls. People are P01 to P21, most rated first. No names, handles, emails or ids appear here.

## Headline

- **The replay is exact.** Today's rules replayed offline give the same archetype as the live profile for 21 of 21, and the same name and streaks as the stored nightly read for 21 of 21. So every difference below is the rule change and nothing else.
- **Nobody becomes a Theorist. Nobody changes archetype name.** Under every Theorist definition tried (five), 0 of 21 are named Theorist, and at most 1 gets it as a streak (only in the two looser versions). The highest Theorist share anyone has is 11% of what they love (P14) under the proposed definition, 16% at the loosest. A streak needs 15% and a name needs to be the strongest side.
- **What Theorist does move is streaks: 6 of 21 headers change, all on knife edges.** Twist thrillers that read as Nihilist today (dark family) now read partly as Theorist. That takes 1 to 3 points off Nihilist, and where Nihilist and Hardboiled were already within the 15% tie band, the tie now goes to Hardboiled (P03, P10, P17), or the dark side drops under the 15% streak bar (P04 loses its Nihilist streak), or a different family takes the second streak (P11 IMAX Idealist, P18 Voyager). 5 gain a streak, 6 lose one; nobody gains Theorist.
- **Dropping series changes nothing visible.** 9 profiles have rated series (28 in all), but the model already leaves them out of the shares, the fact gates and the fit. The only place they still reach is the old Film DNA read blended in under 100 rated, and there the largest strand move is 1 point (P12). It is hygiene, worth doing for rule 1195's sake, with no visible effect today.
- **Nostalgic: 2 of 21 under the proposed rule** (P02 by era, P03 by rewatches). Both keep their name and streaks; Nostalgic is added beside them. The signal is thin: only 7 of 21 libraries carry Letterboxd diary data (rewatches), and Montage has no age or birth year, so "the films you grew up with" can only be read from ratings, not from when someone was a child.
- **No over-capture.** A synthetic noir/crime lover stays Nihilist with a Hardboiled streak; an animation lover stays Animation Devotee; adding a 5-star Inception to either changes nothing, and adding a 5-star Inception to every one of the 21 real profiles changes 0 names. A synthetic puzzle lover (twists and brain demand 75+ loved, the rest middling) does become Theorist, so the archetype is reachable; it just does not describe anyone on Montage today.

**All together: 7 of 21 headers change (6 from Theorist's streak shuffle, 2 gain Nostalgic, P03 has both), 0 names change, 0 Theorists.**

## Recommendation

1. **Ship the series drop now, on its own.** No visible change, removes a rule 1195 inconsistency, and makes later diffs cleaner.
2. **Ship Theorist with the proposed definition (below), but know what it buys.** It is safe (no over-capture, no name changes) and it gives the directory and the taste test a home for twist and ideas-first sci-fi fans, which the backlog flagged in September. On today's members it is invisible as a name and costs 6 streak swaps, mostly Nihilist to Hardboiled. If those swaps are not wanted, the honest alternative is to wait until there are more members (the backlog's "~200") and rerun this script; the same definition will then show whether anyone is a Theorist.
3. **Do not loosen Theorist to make it appear.** The loosest version (the owner's 11 films, no fact, no gate) gives one streak (P14, a Lovestruck) and moves 7 headers, and that streak is not a real puzzle habit: P14's puzzle share of loved films is 20%, the average member's is 19%.
4. **Ship Nostalgic as a streak that never leads, like Contrarian, with the proposed rule**, shown after the content streaks. Expect it on about 1 member in 10. Revisit once more members have diary data; an optional "what year were you born" (or "what decade did you grow up in") question would make it much more honest, and is an owner call.
5. Before launch: a scoring version bump (53 to 54) so every profile is re-read (the 0.06 copy hysteresis in lib/taste/identity-freeze.ts is bypassed by a version bump, so all 7 changes land at once), then the nightly taste-model run to save new norms. Those are database writes for the owner to run, not part of this dry run. The stored taste reads of the 7 changed headers may name a streak that is no longer shown; the stored-read validator (rule 1216) would rewrite those on their owners' next open, which means AI calls. Not done here.

## What a streak is in the model today

Two different things share the word.

1. **Header streaks** ("Lovestruck, with streaks of Old Soul and Nihilist"): the one model (lib/taste/unified/model.ts `readPerson`) groups the 13 film-description archetypes into families of feel (dark, epic, heart, craft). The name is the best archetype of the strongest family. The streaks are the best archetype of up to two other families holding 15% or more of what the person loves; a one-family taste takes streaks from inside its family (60% of the lead's score and 10% share). Inside a family, two archetypes within 15% of each other are a tie, broken by rated films alone (`NEAR_TIE`). That tie rule is why small share moves flip Nihilist and Hardboiled.
2. **Behaviour streaks** (lib/archetype-info.ts `STREAKS`): Contrarian, "how someone rates, not what they love", listed in the directory under "Plus one streak", never the name. In the one-model era it is not computed into the header at all (model.ts: "Auteurist and Contrarian ... keep their own rules"; apply.ts takes streaks only from the one model). Nostalgic belongs here: it is about how someone watches and rates, not a kind of film.

Hysteresis: the only one is lib/taste/identity-freeze.ts (a new name within 0.06 score of the old keeps the old copy), and it applies to copy regeneration, not to the read; a scoring-version bump skips it.

Earlier notes found: docs/BACKLOG.md "Archetypes: revisit with real data after launch" (2026-09-26) already named the gap ("Ideas-first sci-fi has no archetype ... Arrival, 2001, Ex Machina split between Aesthete and IMAX Idealist; Contact, Gattaca, District 9, Primer have no clear home. A 15th ('Thinker'/'Futurist')") and "Nostalgia (loving the films you grew up with, rewatch-heavy) as a badge", to ship alongside Contrarian as badges. lib/taste/features.ts collects `diaryLogs` / `rewatchLogs` "for a future Nostalgic streak; nothing scores them yet". Nothing in docs/DATA-SCIENCE-LOG.md, docs/INVARIANTS.md or git log designs Theorist or Nostalgic further; "cerebral" there is the old, unused Cerebral/Emotional axis.

## The definitions used

**Theorist (proposed):**
- Direction: the mean of 8 defining films (below), contrasted against the other archetypes like every other one.
- Family: its own ("mind"), so it never competes inside dark (Nihilist, Hardboiled) or epic (IMAX Idealist, Voyager) for a name. Putting it in the craft family moved 8 headers instead of 6 and gave P16 a Theorist streak; its own family is cleaner.
- Fact (like Animation Devotee's "animated"): only a puzzle film can count toward Theorist: a twist (`film_labels.twist`) or brain demand 75 or more. Without it Theorist took a share of Se7en-type films (T-bare moved 9 headers).
- Gate (like the other fact archetypes): it may not head the read or be a streak unless puzzle films are at least 1.5 times the average member's share of their loved (4.5+) feature films, and 8% and three films at least. Today the average is 19% and the bar about 29%; 4 of 21 clear it (P15, P16, P17, P20), and none of them has a Theorist share above 10%.
- Film DNA: backed by Complexity; blocked when Complexity sits clearly low for them (35 or under, centred), as the others are.
- Alternatives run: T-bare (no fact, no gate), T-owner11 (the owner's 11 films), T-strict (twist and brain 65+, or brain 80+; gate at 2 times), T-wide (16 films), T-craft. Numbers in the table below.

**Nostalgic (proposed):** either
- the era pull: they rate films from 1980 to 2010 at least 0.30 stars further above Letterboxd's average than films from 2015 on (each film weighted by how many Letterboxd ratings its average rests on, as Film DNA does), with 12 rated films in each era and 10 loved (4.5+) films from 1980 to 2010; or
- the rewatch pull: a quarter or more of their loved films are rewatches in their Letterboxd diary, 5 at least (only where the export has diary data).

Read against Letterboxd so that "older films are better on average" does not count (films people still log from 1980 to 2010 are the ones that lasted). 1980 is where Old Soul's fact ends, so Nostalgic does not double as Old Soul. Alternatives: N-ratio (era gap and loving those films more often: 1), N-loose (2), N-strict (1). The love ratio alone was dropped: it rewards having watched only the good old films.

## The numbers (generated by theorist-dry-run.ts)

### Check: the baseline replay against what is live
Baseline (today's rules, replayed here) names the same archetype as the live profile for 21 of 21; same name and streaks as the stored nightly read (taste_model_v2) for 21 of 21.

### Per profile: today → all three changes together
| | Rated | Today (replay) | Mix today (top 3) | After all changes | Mix after (top 3) | Nostalgic |
|---|---|---|---|---|---|---|
| P01 | 1079 | Nihilist (streaks: Lovestruck, IMAX Idealist) | Nihilist 17% · Lovestruck 8% · IMAX Idealist 12% | same | Nihilist 16% · Lovestruck 8% · IMAX Idealist 12% |  |
| P02 | 877 | Lovestruck (streaks: Old Soul, Nihilist) | Lovestruck 16% · Old Soul 15% · Nihilist 14% | same | Lovestruck 15% · Old Soul 15% · Nihilist 14% | yes |
| P03 | 569 | Animation Devotee (streaks: IMAX Idealist, Nihilist) | Animation Devotee 16% · IMAX Idealist 16% · Nihilist 10% | Animation Devotee (streaks: IMAX Idealist, Hardboiled) | Animation Devotee 16% · IMAX Idealist 16% · Hardboiled 9% | yes |
| P04 | 420 | Tenderhearted (streaks: Nihilist, Lovestruck) | Tenderhearted 20% · Nihilist 8% · Lovestruck 18% | Tenderhearted (streaks: Lovestruck) | Tenderhearted 20% · Lovestruck 18% |  |
| P05 | 394 | Lovestruck (streaks: Hardboiled, IMAX Idealist) | Lovestruck 12% · Hardboiled 10% · IMAX Idealist 15% | same | Lovestruck 11% · Hardboiled 10% · IMAX Idealist 15% |  |
| P06 | 333 | IMAX Idealist (streaks: Nihilist, Voyager) | IMAX Idealist 16% · Nihilist 11% · Voyager 16% | same | IMAX Idealist 16% · Nihilist 9% · Voyager 16% |  |
| P07 | 295 | IMAX Idealist (streaks: Nihilist) | IMAX Idealist 22% · Nihilist 14% | same | IMAX Idealist 21% · Nihilist 12% |  |
| P08 | 252 | Lovestruck (streaks: Voyager, Nihilist) | Lovestruck 14% · Voyager 10% · Nihilist 10% | same | Lovestruck 14% · Voyager 10% · Nihilist 9% |  |
| P09 | 236 | Midnight Cultist (streaks: IMAX Idealist) | Midnight Cultist 28% · IMAX Idealist 23% | same | Midnight Cultist 28% · IMAX Idealist 23% |  |
| P10 | 141 | Lovestruck (streaks: Voyager, Nihilist) | Lovestruck 15% · Voyager 15% · Nihilist 11% | Lovestruck (streaks: Voyager, Hardboiled) | Lovestruck 14% · Voyager 15% · Hardboiled 8% |  |
| P11 | 105 | Voyager (streaks: Animation Devotee, Nihilist) | Voyager 20% · Animation Devotee 10% · Nihilist 9% | Voyager (streaks: Animation Devotee, IMAX Idealist) | Voyager 20% · Animation Devotee 10% · IMAX Idealist 21% |  |
| P12 | 94 | Hardboiled (streaks: Chronicler, Tenderhearted) | Hardboiled 26% · Chronicler 15% · Tenderhearted 9% | same | Hardboiled 26% · Chronicler 14% · Tenderhearted 8% |  |
| P13 | 90 | Lovestruck (streaks: Hardboiled) | Lovestruck 20% · Hardboiled 18% | same | Lovestruck 20% · Hardboiled 18% |  |
| P14 | 83 | Lovestruck (streaks: IMAX Idealist, Nihilist) | Lovestruck 14% · IMAX Idealist 19% · Nihilist 13% | same | Lovestruck 13% · IMAX Idealist 18% · Nihilist 6% |  |
| P15 | 71 | Midnight Cultist (streaks: Nihilist) | Midnight Cultist 32% · Nihilist 26% | same | Midnight Cultist 30% · Nihilist 26% |  |
| P16 | 53 | Nihilist (streaks: Hardboiled) | Nihilist 20% · Hardboiled 15% | same | Nihilist 16% · Hardboiled 15% |  |
| P17 | 33 | IMAX Idealist (streaks: Nihilist) | IMAX Idealist 23% · Nihilist 11% | IMAX Idealist (streaks: Hardboiled) | IMAX Idealist 22% · Hardboiled 9% |  |
| P18 | 32 | Hardboiled (streaks: Lovestruck, IMAX Idealist) | Hardboiled 18% · Lovestruck 13% · IMAX Idealist 11% | Hardboiled (streaks: Lovestruck, Voyager) | Hardboiled 18% · Lovestruck 12% · Voyager 10% |  |
| P19 | 32 | Hardboiled (streaks: Animation Devotee, IMAX Idealist) | Hardboiled 13% · Animation Devotee 14% · IMAX Idealist 15% | same | Hardboiled 13% · Animation Devotee 14% · IMAX Idealist 14% |  |
| P20 | 25 | Comic Relief (streaks: Voyager, Hardboiled) | Comic Relief 17% · Voyager 9% · Hardboiled 10% | same | Comic Relief 17% · Voyager 9% · Hardboiled 10% |  |
| P21 | 13 | IMAX Idealist (streaks: Hardboiled) | IMAX Idealist 36% · Hardboiled 11% | same | IMAX Idealist 36% · Hardboiled 11% |  |

### Which change moves whom (each against today's replay)
| Change | Header changes | Name changes | Become Theorist (from) | Theorist as a streak | Gain a streak | Lose a streak | Nostalgic |
|---|---|---|---|---|---|---|---|
| Drop series alone | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Theorist alone (proposed) | 6 | 0 | 0 | 0 | 5 | 6 | 0 |
| Nostalgic alone (proposed) | 2 | 0 | 0 | 0 | 2 | 0 | 2 |
| All together | 7 | 0 | 0 | 0 | 6 | 6 | 2 |

Series among rated films: 9 profiles rate at least one (P01 1, P02 3, P03 8, P05 4, P07 6, P08 1, P09 2, P12 2, P14 1). Largest Film DNA strand move when they are dropped: P01 0 pts, P02 0 pts, P03 0 pts, P05 0 pts, P07 0 pts, P08 0 pts, P09 0 pts, P12 1 pts, P14 0 pts.

### Theorist definitions compared (each alone, against today's replay)
| Definition | Header changes | Name changes | Become Theorist | Theorist as a streak | Highest Theorist share (who) | Who becomes Theorist (from) |
|---|---|---|---|---|---|---|
| T-bare: 8 films, own family, no fact, no gate | 9 | 0 | 0 | 0 | 13% (P14) | nobody |
| T-owner11: the owner's 11 films, own family, no fact, no gate | 7 | 0 | 0 | 1 (P14) | 16% (P14) | nobody |
| T (proposed): 8 films, own family, puzzle fact, gate 1.5x | 6 | 0 | 0 | 0 | 11% (P14) | nobody |
| T-strict: 8 films, own family, strict puzzle fact, gate 2x | 4 | 0 | 0 | 0 | 10% (P14) | nobody |
| T-wide: owner's 11 + 5 more twist films (16), own family, puzzle fact, no gate | 5 | 0 | 0 | 0 | 13% (P14) | nobody |
| T-craft: as proposed but in the craft family | 8 | 0 | 0 | 1 (P16) | 11% (P14) | nobody |

Theorist share and lift per profile under the proposed definition (share of what they love that reads as Theorist; puzzle = twist or brain demand 75+ among loved feature films):
| | Today | Theorist share | Puzzle share of loved | Loved puzzle films | Gated? | After |
|---|---|---|---|---|---|---|
| P01 | Nihilist | 4% | 17% | 24 | below bar | Nihilist (streaks: Lovestruck, IMAX Idealist) |
| P02 | Lovestruck | 2% | 8% | 14 | below bar | Lovestruck (streaks: Old Soul, Nihilist) |
| P03 | Animation Devotee | 5% | 21% | 22 | below bar | Animation Devotee (streaks: IMAX Idealist, Hardboiled) |
| P04 | Tenderhearted | 5% | 23% | 10 | below bar | Tenderhearted (streaks: Lovestruck) |
| P05 | Lovestruck | 3% | 4% | 2 | below bar | Lovestruck (streaks: Hardboiled, IMAX Idealist) |
| P06 | IMAX Idealist | 5% | 20% | 20 | below bar | IMAX Idealist (streaks: Nihilist, Voyager) |
| P07 | IMAX Idealist | 5% | 18% | 8 | below bar | IMAX Idealist (streaks: Nihilist) |
| P08 | Lovestruck | 2% | 10% | 5 | below bar | Lovestruck (streaks: Voyager, Nihilist) |
| P09 | Midnight Cultist | 3% | 12% | 8 | below bar | Midnight Cultist (streaks: IMAX Idealist) |
| P10 | Lovestruck | 4% | 5% | 2 | below bar | Lovestruck (streaks: Voyager, Hardboiled) |
| P11 | Voyager | 4% | 9% | 7 | below bar | Voyager (streaks: Animation Devotee, IMAX Idealist) |
| P12 | Hardboiled | 10% | 19% | 6 | below bar | Hardboiled (streaks: Chronicler, Tenderhearted) |
| P13 | Lovestruck | 6% | 14% | 1 | below bar | Lovestruck (streaks: Hardboiled) |
| P14 | Lovestruck | 11% | 20% | 4 | below bar | Lovestruck (streaks: IMAX Idealist, Nihilist) |
| P15 | Midnight Cultist | 4% | 29% | 6 |  | Midnight Cultist (streaks: Nihilist) |
| P16 | Nihilist | 10% | 35% | 12 |  | Nihilist (streaks: Hardboiled) |
| P17 | IMAX Idealist | 7% | 43% | 3 |  | IMAX Idealist (streaks: Hardboiled) |
| P18 | Hardboiled | 3% | 17% | 3 | below bar | Hardboiled (streaks: Lovestruck, Voyager) |
| P19 | Hardboiled | 3% | 27% | 4 | below bar | Hardboiled (streaks: Animation Devotee, IMAX Idealist) |
| P20 | Comic Relief | 3% | 30% | 3 |  | Comic Relief (streaks: Voyager, Hardboiled) |
| P21 | IMAX Idealist | 2% | 20% | 2 | below bar | IMAX Idealist (streaks: Hardboiled) |

Where the proposed Theorist moves a header, what it took (shares before → after):
- P03: Animation Devotee (streaks: IMAX Idealist, Nihilist) → Animation Devotee (streaks: IMAX Idealist, Hardboiled). IMAX Idealist 16% → 16%, Nihilist 10% → 9%, Hardboiled 9% → 9%, Theorist 0% → 5%.
- P04: Tenderhearted (streaks: Nihilist, Lovestruck) → Tenderhearted (streaks: Lovestruck). Nihilist 8% → 7%, Lovestruck 18% → 18%, Hardboiled 7% → 6%, Theorist 0% → 5%.
- P10: Lovestruck (streaks: Voyager, Nihilist) → Lovestruck (streaks: Voyager, Hardboiled). Voyager 15% → 15%, Nihilist 11% → 9%, Hardboiled 9% → 8%, Theorist 0% → 4%.
- P11: Voyager (streaks: Animation Devotee, Nihilist) → Voyager (streaks: Animation Devotee, IMAX Idealist). Animation Devotee 10% → 10%, Nihilist 9% → 7%, IMAX Idealist 22% → 21%, Hardboiled 6% → 6%, Theorist 0% → 4%.
- P17: IMAX Idealist (streaks: Nihilist) → IMAX Idealist (streaks: Hardboiled). Nihilist 11% → 8%, Hardboiled 9% → 9%, Theorist 0% → 7%.
- P18: Hardboiled (streaks: Lovestruck, IMAX Idealist) → Hardboiled (streaks: Lovestruck, Voyager). Lovestruck 13% → 13%, IMAX Idealist 11% → 10%, Voyager 10% → 10%, Nihilist 13% → 13%, Hardboiled 18% → 18%, Theorist 0% → 3%.

### Over-capture probes (synthetic libraries, not part of the averages)
| Probe | Today's rules | All changes |
|---|---|---|
| Noir/crime fan (crime films loved, the rest middling) | Nihilist (streaks: Hardboiled) | Nihilist (streaks: Hardboiled) |
| Same noir fan + Inception 5 stars | Nihilist (streaks: Hardboiled) | Nihilist (streaks: Hardboiled) |
| Animation lover | Animation Devotee (streaks: Voyager) | Animation Devotee (streaks: Voyager) |
| Animation lover + Inception 5 stars | Animation Devotee (streaks: Voyager) | Animation Devotee (streaks: Voyager) |
| Big-screen sci-fi fan (spectacle 80+ sci-fi loved) | IMAX Idealist | IMAX Idealist |
| Puzzle fan (twist or brain demand 75+ loved) | Midnight Cultist (streaks: IMAX Idealist, Nihilist) | Theorist (streaks: Midnight Cultist, IMAX Idealist) |

Every real profile with Inception added at 5 stars (all changes on): 0 of 21 change name.

### Nostalgic: the signals per profile
| | Era gap (1980-2010 vs 2015+, stars above Letterboxd) | Love ratio (1980-2010 vs rest) | Loved 1980-2010 | Of them family/animated | Rewatched share of loved | N (proposed) | N-ratio | N-loose | N-strict |
|---|---|---|---|---|---|---|---|---|---|
| P01 | -0.04 | 1.65 | 82 | 18 | no diary |  |  |  |  |
| P02 | +0.75 | 0.95 | 101 | 6 | 10% | yes |  |  |  |
| P03 | -0.21 | 1.20 | 51 | 18 | 58% | yes | yes | yes | yes |
| P04 | +0.09 | 1.01 | 25 | 9 | no diary |  |  |  |  |
| P05 | +0.04 | 2.09 | 27 | 4 | 0% |  |  |  |  |
| P06 | +0.11 | 1.64 | 40 | 12 | 18% |  |  |  |  |
| P07 | +0.08 | 2.29 | 24 | 5 | 0% |  |  |  |  |
| P08 | +0.26 | 1.35 | 26 | 4 | 17% |  |  | yes |  |
| P09 | -0.25 | 1.38 | 29 | 3 | no diary |  |  |  |  |
| P10 | +0.23 | 1.04 | 15 | 4 | 2% |  |  |  |  |
| P11 | +0.14 | 1.33 | 40 | 17 | no diary |  |  |  |  |
| P12 | +0.02 | 0.82 | 12 | 1 | no diary |  |  |  |  |
| P13 | -0.23 | 3.67 | 4 | 0 | no diary |  |  |  |  |
| P14 | -0.06 | 1.42 | 5 | 1 | no diary |  |  |  |  |
| P15 | -0.43 | 0.92 | 7 | 1 | no diary |  |  |  |  |
| P16 | -0.11 | 0.88 | 15 | 3 | no diary |  |  |  |  |
| P17 | - | 0.75 | 3 | 2 | no diary |  |  |  |  |
| P18 | - | 0.88 | 9 | 1 | no diary |  |  |  |  |
| P19 | - | - | 7 | 3 | no diary |  |  |  |  |
| P20 | - | 0.27 | 2 | 0 | no diary |  |  |  |  |
| P21 | - | - | 4 | 0 | no diary |  |  |  |  |
Totals: N (proposed) 2, N-ratio 1, N-loose 2, N-strict 1 of 21.

## Draft copy for the 15th archetype and the new streak

House voice: no em dashes, no italics, plain words. Same shape as lib/archetype-info.ts.

```ts
// ARCHETYPES (15th)
{ name: "Theorist", tag: "Always piecing it together.", desc: "You love a film that makes you work: the twist you should have seen coming, the time loop, the idea that keeps you up. You watch for the clues, argue about the ending, and rewatch to see how it was built.", kind: "Films that make you think and piece things together: twists, puzzles, ideas-first sci-fi.", films: ["Memento", "The Prestige", "Shutter Island", "Gone Girl", "Knives Out", "Arrival", "Primer", "Ex Machina"] },

// ARCHETYPE_KIND
"Theorist": "films that make you think",

// STREAKS (second, after Contrarian)
{ name: "Nostalgic", tag: "Still loves what it grew up on.", desc: "You rate the films of an earlier era higher than most people do, and you go back to them. A comfort rewatch counts for a lot with you.", kind: "Films from an earlier era, rated warmly and watched again: comfort rewatches, old favorites, the ones you grew up with.", films: ["The Goonies", "Home Alone", "Jurassic Park", "The Lion King", "Hook", "The Sandlot", "Toy Story", "Ferris Bueller's Day Off"] },
```

Why these 8 Theorist films: the owner's 11 less Inception, Interstellar and Tenet. Those three are Nolan's biggest films (four of eleven were Nolan) and their scale, spectacle and wonder pull the direction toward IMAX Idealist and Voyager; dropping them leaves twist mysteries and small ideas-first sci-fi, which is what sets Theorist apart. With all 11 the reads barely differ (T-owner11 row), so this is a taste call; if the owner wants Inception in the directory, swap it for Knives Out. The Nostalgic films avoid any title already on another list (Back to the Future and E.T. are Voyager's).

Other copy the launch needs:
- lib/taste/unified/apply.ts `KIND`: `theorist: "twists and puzzles"` ("A good share of your favorites are twists and puzzles, led by Memento and Arrival: ...").
- lib/archetype-streaks.ts kind words: `theorist: "puzzle films"`.
- lib/group-names.ts: `"Theorist": { adj: ["Twist", "Plot-Twist", "Puzzle", "Mind-Bending"], crowd: ["Theorists", "Sleuths", "Puzzlers", "Clue Hunters"] }`, and a Nostalgic entry: `{ adj: ["Rewind", "Throwback", "Old-Favorite", "VHS"], crowd: ["Rewinders", "Throwback Crowd", "Rerun Club", "Comfort Crowd"] }`.
- The directory's "Plus one streak" becomes "Plus two streaks" (web ArchetypesModal.tsx, iPhone ArchetypesScreen.swift), and its line "Not an archetype of its own: it can show up in anyone's mix, but never as the name." becomes "Not archetypes of their own: they can show up in anyone's mix, but never as the name."
- How Nostalgic shows in the header is a design call: proposed "Lovestruck, with streaks of Old Soul and Nihilist, and a Nostalgic streak", at most three streak names, Nostalgic always last and never given a mix share or a defining film (it is not a kind of film).

## What else must change for launch

The owner has not decided whether the iPhone should load the archetype list from the server. Worth knowing: the iPhone directory (ArchetypesScreen.swift) already reads /api/archetype-posters behind the bundled Archetypes.json and shows the newer copy, so a 15th archetype would appear there from the server without an app update; the bundle is the first paint and the offline fallback, and the How you got line falls back to the bundled `kind`. The hardcoded counts and the bundle still need an app update.

Web and server (model and copy):
- lib/archetype-info.ts: the 15th entry, `ARCHETYPE_KIND`, the Nostalgic streak, the "14" comments.
- lib/taste/archetypes.ts: `ArchetypeId` union, label and blurb for `theorist` (and `nostalgic` if it gets an id).
- lib/taste/unified/report.ts: `IDS` ("Theorist": "theorist"), `GATES` (puzzle share), and the series drop: `labelDnaFrom` and the `labels` map read feature films only, `ratedSlugs` feature films only, `rated` counts feature films.
- lib/taste/unified/model.ts: `FAMILY.theorist = "mind"`, `FILM_FACT.theorist` (twist or brain demand 75+).
- lib/taste/taste-dna.ts `ARCHETYPE_STRANDS.theorist = ["narrative_complexity"]` (Complexity).
- lib/taste/unified/apply.ts `KIND`; lib/archetype-streaks.ts kind words.
- Nostalgic: a new reader (as in scripts/theorist-dry-run.ts `nostalgia()`), the header path that appends it (apply.ts `top`/`streaks`, lib/archetype-streaks.ts wording), and its reading of `rc`/`rw`/`lc` from library_json.
- Graph path (still used before 10 rated and by older reads): lib/taste/graph-archetype.ts id lists and popularity weights, scripts/persist-archetype-centroids.mjs (centroid films), lib/taste/film-archetype-overrides.ts.
- Taste test: lib/taste-test/probes.ts (a Theorist seed card; the deck's fixed seed "names all 14 archetypes across the eras", asserted in scripts/check-invariants.ts), `ARCH_PULL`, lib/taste-test/probe-archetypes.json (per-card archetype pulls), lib/taste-test/decide.ts reads ids from it.
- Display: app/archetypes/page.tsx (title and h1 "The 14 Cinema Archetypes"), app/_components/ArchetypesModal.tsx (h2, "Plus one streak", the "Not a 15th archetype" comment), ArchetypeSheet.tsx ("See all 14 archetypes"), InputScreen.tsx ("Explore the 14 archetypes"), Result.tsx ("closest of 14 archetypes" fallback), lib/profile-display.ts ("Your closest of 14 archetypes"), ArchetypesCta.tsx comment.
- Share cards and names: lib/card-ground.tsx (a ground colour for `theorist`), lib/card-kit.tsx `GHOST_POOL` (optional), lib/group-names.ts.
- AI prompts (text only, no new calls): lib/taste/match.ts lists archetype names the writer must never output (two prompts plus the list at line 71); add Theorist and Nostalgic.
- Posters: scripts/bake-archetype-posters.mjs regenerates lib/archetype-posters.json after the copy lands.
- Checks and docs: scripts/check-invariants.ts (rule 200 asserts the landing says 14 and never 15; rule 1033 and the sheet checks assert "See all 14 archetypes"; rule 871 asserts the iPhone welcome line; the deck seed check), a new INVARIANTS rule, docs/DATA-SCIENCE-LOG.md entry (before/after from this report), docs/ALGORITHMS.md "14 archetypes" list, docs/app/SCREENS-ACCOUNT.md and docs/app/IOS.md mentions.
- Rollout (owner, writes): `IDENTITY_SCORING_VERSION` 53 to 54, then the nightly taste-model run (saves new norms and taste_model_v2), then the refresh that rewrites changed headers.

iPhone:
- ios/Montage/Resources/Archetypes.json: `archetypes` (15th), `streaks` (Nostalgic), `slugs` and `posters` for the new films (regenerate from /api/archetype-posters).
- ArchetypesScreen.swift: "The 14 Cinema Archetypes" title, "Plus one streak" and its line, the header comment.
- WelcomeScreen.swift: "Explore the 14 archetypes" (and its doc comment).
- ProfileExtras.swift: "See all 14 archetypes" button and comments; ProfileScreen.swift comment.
- The header's streak names are buttons that open their archetype (rule from bad00a27): Nostalgic must open the streak card, not an archetype lookup that fails.
- RevealScreen.swift and OnboardingFlow.swift previews hardcode "Voyager" (fine as is).

## How the numbers were made

1. SELECT-only exports (Supabase SQL): published profiles (id, user id, library_json.rated, libraryFilmKeys, the live archetype label and top, the stored taste_model_v2 read; never the username); in-app ratings, removed films and Canons for those owners; and the facts the model reads for every film involved (films, film_labels at confidence 40+, lanes of weight 0.5+ in shelves of 7+). 21 profiles, 3,261 films, 3,022 labelled.
2. The script rebuilds each library as withInAppRatingsMany and watchedOnly do (in-app over import, removed films dropped, unrated library keys resolved by normalised title and year, one then two years either side, series left out), runs `computeReport`, rounds the norms as they are saved, and reads each library on its own against them as the profile does (`readFilmsWith`).
3. Variants change only module-level tables (IDS, FAMILY, FILM_FACT, GATES, the strands map) and the defining films, or filter series out of the libraries. Synthetic probe libraries are read against the real members' norms and never join the averages.
4. Approximations: the lane guard (laneGuard) and the series of fallbacks in loadWatchedSet for unmatched keys are not replayed. The baseline still matched the live read 21 of 21, so they did not matter here.

The script is beside this report (theorist-dry-run.ts). To run it, put it in the montage repo's scripts/, export `GATES` in lib/taste/unified/report.ts, and give it a folder with profiles.json, films.json and inapp.json from the queries above: `npx tsx scripts/theorist-dry-run.ts <folder>`.
