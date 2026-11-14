# b135: "Choose one for me", top pick or a little variety

No mock: a note on the tradeoff (owner asked for it as optional).

Today (montage 965f5787): Pitch's "Choose one from these" always lands on the first film (`PitchDeal(at: 0)`), the top match. Tonight's shuffle lands on the ticket the engine chose.

**Option A, keep #1 (today).** Predictable and honest: the shuffle is theatre, the pick is the best match. Cost: the same question gives the same answer, so pressing it twice feels pointless, and "Choose one for me" reads as random when it isn't.

**Option B, pick among the top 3, weighted.** E.g. 60 / 25 / 15 by rank, only among films within a few points of the top match (say 5), and never one the person has passed on this session. Feels alive on a second press and spreads exposure a little. Costs: sometimes gives a worse match than the one shown first; it makes outcome logging noisier (the chosen film is no longer always rank 1, so log the rank); and it would overlap the calibration test running 2026-11-15 to 2026-12-05 if it touched Tonight.

**Recommendation:** B for Pitch only, top 3 within 5 points, rank logged, and only after the calibration read on 2026-12-12. Keep Tonight at #1 because Re-roll already gives variety there.
