# b137: A shorter reveal

The first-week walkthrough (build38/first-week-walkthrough/README.md, section 4 item 3) asks to cut the lower reveal to the picks and Save, so Screen DNA strands first appear on the Profile (with "Your Screen DNA is set" at 30 rated) and Blend first appears on Social.

Read on montage 3a344d64: web `LockedIdentity.tsx` (the named branch), `RevealBeats.tsx`, `RevealPicks.tsx`; iPhone `RevealScreen.swift`, `RevealPicks.swift`, `RevealShare.swift` (RevealFoot). The first screen (name, streak, meaning line, proof, tag, See my picks, Not quite you?) is the same in every option.

- **A, today (web, 1742pt tall).** Under the fold: "Picked for an Overthinker", "Your top Screen DNA strands: complex and slow-burn.", four picks (two reasons say "your top strand" / "your top two strands"), the cream Save and open my picks, Blend with a friend and Share my card, the hot take line (web only), fine print, the Letterboxd import link. The iPhone is the same, less the hot take.
- **B, picks and Save (recommended, 1558pt).** Heading, four picks, the cream, its fine print. Strand reasons keep their words without the term: "Complex, the kind you rate highest". The match % stays.
- **C, middle (1658pt).** B plus Share my card (one outlined button) and the import link. Drops only the two new terms and the hot take.

**What B loses, and where each piece is still reached**

| Removed | Lost | Still reached at |
|---|---|---|
| Top strands line | The word "strand" on day 1. The same two words stay in the first screen's meaning line. | Profile › Taste (Screen DNA), "Your Screen DNA is set" at 30, a film's "Why this fits your taste" |
| "your top strand" reasons | Only the term; the words stay | (reworded on the row) |
| Blend with a friend | Sending the archetype to a friend from the reveal. It already routes through the save drawer first. | Social (Blend tile, "Blend with a friend" on the empty Your people row, Invite), someone's profile "What's our Blend?" |
| Share my card | The archetype card before an account exists | Profile › Share profile (same TypeShareSheet card), once saved |
| Hot take line (web) | One bold line when a true one exists, often none at 15 | Profile › Taste › Against the crowd |
| Import link | A rate-path guest's nudge to import before saving | Welcome "I'm on Letterboxd", Profile › Films, Settings |

**Honest costs.** B removes the reveal's only share and Blend asks, so `reveal_card_shown` and `reveal_friend_tapped` stop firing from the reveal. If those ever drove invites, C is the safer step. check-invariants rules 1567 and 1960 assert Blend and Share on the reveal, so they need amending with the change.

Files: b137-shorter-reveal.html / .png (2678x6082). Rendered with `node mockups/journeys/b137-render.js`.
