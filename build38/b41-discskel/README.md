# b41-discskel: a film Discussion's loading wireframe (web)

Montage branch `b41-discskel`, rule 2058 amended (10). Rendered from a local `next dev` of the branch, every /api answer
faked, 393 wide at deviceScaleFactor 2, dark, sheen paused for the shot.

- `1-skeleton.png`: the first read held. The sheet's head (poster, title, "Discussion ·" with a block for the counts, the tick),
  Friends / Everyone with a block for each count, Top / New, then four take rows (face; name, stars, date; two or three lines;
  the reaction line: heart, React, Reply), the first with one reply under it.
- `2-loaded.png`: the same sheet once the read is in (fake takes).
- `3-side-by-side.png`: both.

Measured in the browser: the head (115, 102 tall), the tabs (217, 34) and the scroll's top (251) are the same in both; the
first take starts at 251 in both; the reaction lines sit at x 63 (takes) and 109 (the reply), 44 tall, in both. Row heights
differ only by how many lines the fake words take. The bottom bar (here the composer) is not drawn while loading, as before,
so the scroll's visible height drops from 601 to 497 when it arrives. The iPhone's `DiscussionSkeleton` was not rendered
(no simulator here; the Swift is not compiled).
