# b41-reveal: the built screens

**Method.** The real web app from montage branch `b41-reveal` (`8b6002135`, rule 2071), `next dev`, in Playwright at 393x852, 2x, dark. Every `/api` answer is faked by `capture.mjs` (it imports the earlier flow capture's `fake.mjs` from the session scratchpad), so the films, the %, the names and their order are stand-ins; the layout, the copy and which parts show are the app's own. iPhone not built here (Swift does not compile in this session).

| File | What |
|---|---|
| `01-reveal-first-screen.png` | The named reveal's first screen, unchanged (reached by a Letterboxd import signed out; the rate path uses the same branch) |
| `02-reveal-picks-and-save.png` | After See my picks: "Picked for a Disciple", the four picks, the cream "Save and open my picks" and its fine print, nothing else (option B). Two strand reasons without the word: "Slow-burn and complex, the kind you rate highest", "Complex, a kind you rate highly" |
| `03-reveal-full-page.png` | The whole reveal page, top to the footer |
| `04-profile-share-your-archetype.png` | A new account's own profile after the save: "Share your archetype" in the one-card spot under the header (Picks' first-run marks set as seen, so the visit is free; Sharpen your profile waits behind it) |
| `04b-profile-share-my-card-opens-drawer.png` | "Share my card" opens the profile's share drawer on the archetype card, Story. The card image is blank only because `/api/share-card` is faked here |
| `05-picks-day1-for-you.png`, `05b-picks-tab-row.png` | A brand-new account (18 rated, day 1) on Picks: the tab row is **For you · Cozy autumn · New releases**, no Starter picks tab (before: build38/starter-picks/01b-tabs-day1.png) |
| `06-picks-for-you-starter-1-of-6.png` | For you's second card still "Starter · 1 of 6": the starter set feeds For you as before |
