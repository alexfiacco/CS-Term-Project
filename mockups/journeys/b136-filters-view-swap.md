# b136: Filters into the row, grid / list up top, on every film grid

Owner decision: swap Filters and the grid / list switch everywhere. Filters moves into the row beside the sort and keeps its red count; the view switch moves up to the top bar beside the ⋯.

Read on montage a86222d4 (rules 2063 and 2064). The brief was slightly off: only the list page, lane / theme / person pages and Made for you mixes have Filters in the top bar today. Browse, your Films, Watchlist and someone's Films already have Filters, view and ⋯ in the row. The group watchlist has a Filters chip by its heading on the web and at the end of its chips on the iPhone, so the two already differ.

Fit is measured in the page with the iPhone's real spacing: SwiftUI puts 8 on each side of the Spacer, so lead to cluster is at least 16 (the web's is 8, so the web has 8pt more). By that measure b129's "2pt spare" for the list at 375 was the visible gap only. **Today's list row already cuts "Recently added" with an ellipsis at 375.**

**Recommended, per page type:**
- **List page.** Top bar: Back; view, ⋯. Row: seen stat; then search, sort and Filters right-aligned. This swaps one 44 circle for another, so the fit is exactly today's. At 375 with Recently added it doesn't fit: the sort chip's name takes an ellipsis ("Recently a…"), 20pt short with "Seen 405 of 431" and 54pt with "You've seen 88 of 99". At 393 it is 2pt short with "Seen 405 of 431". List order always fits at 393, and at 375 with three-digit counts. If the ellipsis is not acceptable, the one fix is to put search back up as the bar's third circle, which undoes part of b129.
- **Lane, theme and person pages.** Top bar: Back; view, ⋯. Row: seen stat, sort, Filters. Same fit as today: it fits at 393. At 375, "You've seen 88 of 99" with Highest rated, Most popular or Hidden gems is 3 to 5pt short, so the sort goes to line 2.
- **Made for you mixes.** The same as lanes. Fits at both widths (5pt spare at worst, at 375).
- **Browse (Every film and the doors).** Top bar: Back; search, view, ⋯. Share becomes a row of the ⋯, as on every other page, which keeps the bar to three circles. Row: count, sort, Filters, with the pills under it as before. This one gets better: the row loses two circles, so Highest rated fits on one line at 375 (49pt spare; today it is 39pt short and wraps).
- **Your Films, Watchlist, someone's Films: no change.** Tabbed screens already read count, sort, Filters, view, ⋯, which is the new order. There is no grid top bar to move to: the profile's bar is the person's, and a view switch there would also sit over Diary and Lists. The fit is unchanged, so the sort already wraps at 375 with Average rating (Films 16pt short, Watchlist 32pt) and Highest rated (someone's Films, 9pt).
- **Group watchlist.** Filters becomes the sliders circle with its count, at the right of the "Our watchlist" heading, on web and iPhone alike. It does not go in the chips row: the four chips alone are 8pt too wide at 375 (they scroll on the iPhone and wrap on the web, as today), and a circle in that row would leave Unseen 54pt out of sight. Nothing goes up, because it has rows, not a grid.

Files: b136-filters-view-swap.html / .png. Rendered with `node mockups/journeys/b127-render.js b136`.
