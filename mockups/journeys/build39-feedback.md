# Build 39 owner feedback (2026-11-13), batch 1

Mock everything visual first.

1. **Blend preview card (Social):** the name ("angelo") and the descriptor (*Cinematic soulmates*) float in no man's land. Fit both within the profile picture's height, and make it look good.
2. **What we've learned:** the summary ("intense dramas, Japanese comedies, 60s comfort") and the chips (Japanese, 60s, 40s, Korean) don't match the owner's actual recent watching. Trace where each comes from. It's likely wrong data or the wrong window ("lately" must mean recent ratings).
3. **Profile → Lists filter** (All 49 / Public 48 / Friends 0 / Only me 1) is clunky. Use a compact control, like the "34 unseen ▾" row.
4. **Deepest cut shows Whip It,** which was rated, then the watch and rating deleted. A deleted rating must drop out of all profile stats and reads. (Bug.)
5. **Import Letterboxd and the taste deck backgrounds:** the posters are vertical, not tilted like the landing and sign-in wall, and the colour/brightness differs. Use the same tilted wall and the same shading.
6. **Taste deck shelf:** the "Rate films you love" grid has a shelf of rated films, but it's gone in the taste deck. Keep the shelf in the deck, and let people change ratings from it.
7. **Archetype reveal:**
   - the tick is still the wrong colour (should be the red/blue tick)
   - the screen is crowded: "Does this feel right? Spot on / Not quite" plus 6 posters. Present it differently.
   - the background is again vertical posters
   - the "Not quite you? Rate more / Start your taste over" menu is a stock Apple pop-up. Use our own design.
8. **"Keep rating" after the reveal:** the counter restarts at 0 of 15. It should continue (16, 17…) or drop the counter.
9. **Letterboxd screen → "Rate films instead"** restarts the whole process. Progress must be kept; X/back keeps state.
10. **"How well this fits your taste"** (Picks hero) sits away from the match %, which is confusing. Put it next to the % or rethink it.
11. **Poster-grow open:** it carries the match % stamp with it, overlays the backdrop, and glitches into place. Fix it so it's smooth with no stamp, or remove it.
12. **Person page (Tom Cruise):**
    - "Actor, writer +1": show every role (2 lines OK)
    - too much empty space in the middle
    - should the film tabs (Acted / Wrote / Produced) sit below or above the stats?
13. **Someone else's DNA strand drawer:** "It works against them" is wrong framing. Strands are what pulls you, not what you dislike. Rewrite it as "it doesn't pull them much".
14. **Someone else's Top rated genres:** the chevron goes to MY War recs. Either open their films filtered to War (if easy) or remove the chevron.
15. **My Top rated genres → War (Seen only):** seen films should show my rating, not the match %.
16. **Movie night moods:** the chips are big squares unlike anywhere else. Make them compact (keep the profile picture beside a picked mood).
17. **Movie night action bar:** pin the action (Pick our film / Next / Vote) and the chat to the bottom.
18. **Movie night "Vote for the film":** it doesn't fit one iPhone screen and needs scrolling. Make it compact; consider matching Tonight's layout for consistency.
19. **Suggest a film:** "We can't find that film." shows in red even while results are listed and one is selected. (Bug: stale error.)
20. **Movie night result / share card:** review (screenshots: share card "The Bleak Nihilists", result ticket "Night 25").
21. **Picks "Why this fits your taste" drawer (The Outfit, Blindspotting):**
    - "It's new ground next to what you usually watch, and a good place to branch out" repeats as boilerplate
    - "Why this fits your taste" heading next to "Your match"
    - review the copy

Owner notes on 19–21:
- 19: picking How to Train Your Dragon and adding it says "We can't find that film". It's unstyled and untrue, and retrying fails. Root cause: `filmExists` in lib/theater-suggest.ts queries `films.slug`, which doesn't exist (the column is `letterboxd_slug`), so every suggestion fails.
- 20: the share card looks bare when there's nowhere to watch. The final movie night screen should be a ticket with stub notches on each side, top and bottom, like the profile page, and show what people picked (here or on the previous screen). Too many buttons; Tonight's result is cleaner.
- 21: every why has a hook that sets up the film but says nothing about you. "It's new ground…" appears on 4+ films at 87%, which can't be true. Find out why and fix it.

More batches coming.
