# Match scores: do the three fixes predict the future? A time-split test

2026-11-12. Read-only on Supabase `uktamekqqsiijugpaxit` (SELECT only). Follows `match-calibration-5star.md` and `fable-final-audit.md`.

## The bar (written before any result was run)

The owner's goal is to predict what a person will like **next**, not to fit what they already rated. The owner's bar: films a person rates 5★ should generally show 85% or more.

A fix ships only if, **on the time split** (train on a person's earlier ratings, predict their later ones), it does all three:

1. **Ranking not worse beyond noise.** Per-user Spearman and AUC for 4.5★+ do not fall: the 95% bootstrap interval (over users) of the change must not sit wholly below zero.
2. **Calibration better.** Shown bands (love 90+, really like 78–89, like 65–77, mixed 40–64, probably not under 40) stay ordered by actual mean rating, and band accuracy rises. Band accuracy is the share of held-out films whose stars fall in the range their band names: love 4.5★+, really like 4★, like 3.5★, mixed 2.5–3★, probably not 2★ or less.
3. **More held-out 5★ films at a shown 85% or more.**

If a fix fails any of the three, it does not ship, and the report says why.

Set in advance as well:

- **Fix 1 (share cap)** only changes accounts under 200 ratings in any real way, so it is judged on the thin results: real accounts under 100 ratings, plus thin profiles simulated from dated accounts (their first 15, 30 and 60 ratings predicting the next 40). It must also leave no weight above 10. The pre-set form is the audit's: skip a group with almost no movement, no group grows more than 2×, shares read on the unshrunk features, per-person cap only from 100 rated films. "Cap at every size" and "no cap" are run as sensitivity checks only.
- **Fix 2 (web shows the leave-one-out number on a rated film)** changes no forward prediction, so the three tests cannot move. Its pre-set test: on the films held out by the time split, once they are rated, is the leave-one-out number closer to the forward prediction (what we really said before the rating) than the stored number is? It ships if the leave-one-out number's mean gap to the forward prediction is smaller. Its effect on 5★ at 85%+ on rated films is reported, whichever way it goes.
- **Fix 3 (per-person calibration)** is the audit's fix A, smoothed: the person's held-out score percentile maps to their own rating at that percentile, on a fixed star scale (5★ = 96, 4.5 = 90, 4 = 82, 3.5 = 70, 3 = 55, 2.5 = 40, 2 = 30, 1 = 15), blended with today's curve by n/(n+100). Fitted on training films only. It is monotone per person, so per-user Spearman and AUC cannot move; test 1 is read on the pooled numbers.
- Random 5-fold is a secondary check and cannot overrule the time split.

