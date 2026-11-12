# Launch cost guard: paid-call inventory and caps

2026-11-12. Montage commit `28eb08bd` on `main` (rules 1630, 1631). Base was `17cf3555`, rebased onto `19138aff`.

**Goal:** a traffic spike after launch must not be able to run up a surprise bill.

**Short answer:** a Claude budget already existed (rule 740: $11 a day app-wide, $1 per person, 2,000 anonymous calls, a 60,000-call backstop), and every user-triggered Claude call already passed through it. This change adds what was missing:

- a kill switch for each AI feature;
- a daily call cap for each feature, about 5× normal;
- a $5 daily budget for the batch label crons, which also pause once the user budget is spent;
- a per-account *and* per-address limit on every model-backed route.

No SQL is needed. Everything is stored in `usage_counters` and goes through the existing `bump_usage` / `add_usage` RPCs.

## What normal looks like (usage_counters, 2026-11-05..11-12)

| | Average day | Busiest day |
|---|---|---|
| Gated Claude spend (`claude:usd`) | $0.27 | $0.98 |
| Gated Claude calls (`claude`) | 217 | 757 |

Busiest single day per label (7 days): summary 212, why-loved 73, film-labels 60, pick-blurbs 53, summary-gate 52, take-check 50, seen-why-fast 46, seen-why 32, visitor-third 23, fit 16, tension 11, fit-fallback 11, recut (Pitch) 7, other labels under 7.

Batch label jobs currently out: $0.35 (guide traits) and $0.06 (taste traits).

## 1. Inventory of paid external calls

### Claude (Anthropic), user-triggered

The default model is claude-haiku-5-5 at $0.10 / $0.50 per million tokens in / out. "Our read" and the labels use claude-sonnet-5-5 at $2 / $10. The per-call costs below come from the measured token counts.

| Feature (labels) | Routes | Who can trigger | Per-caller limit (before → now) | Caching | ~Cost / call |
|---|---|---|---|---|---|
| **Pitch** parse + clarifying question (`recut`, `pitch`) | `POST /api/recut` | signed-in; signed-out 1/day | `recut` 20/10 min by address + `recut-user` 30/10 min by account (unchanged); 10 pitches/month | `ai_cache recut:parse:v1` per sentence | $0.00028 (measured) |
| **Why lines** (`fit`, `fit-fallback`, `seen-why*`, `why-loved`, `why-regen`, `similar`, `rec-reason`, `hidden-recs`) | `/api/match-csv`, `/api/similar`, `/api/why-loved`, `/api/match-recs`, `/api/pick-why`, `/api/loved-films`, the film screen | signed-in, guest, signed-out (anonymous sub-budget) | address 30-60/min, or account 60/min → **now both** (rule 1631) | ai_cache per film × taste key | Haiku ~$0.0002-0.0004; Our read on Sonnet ~$0.005 |
| **Taste reads** (`summary`, `summary-gate`, `insights`, `tension`, `hidden-taste`, `visitor-*`, `blend-line`, `dna-*`, `compare-*`) | profile builds (`/api/profile-from-*`), `/api/profile-copy`, `/api/compatibility`, `/api/dna-more`, `/api/summary-preview` | builds are mostly signed-out; the rest signed-in | builds 8-15/10 min by address (plus the import caps of 6,000 / 6,000 / 20,000 a day); account routes 6-60 → **now both** | ai_cache, versioned keys | ~$0.0003 (Haiku) |
| **Groups / movie nights** (`group-*`, `pick-blurbs`) | `/api/theater/*`, `/api/group/*`, `/api/tonight`, `/api/weekly-pick` | signed-in and room guests | account 6-120/min → **now also by address** | ai_cache per group / room | ~$0.0002-0.0003 |
| **Shelve** (`shelve`) | `POST /api/shelve` | signed-in | 30/10 min by account → **now also by address**; `DAILY_SHELVE_CAP` 100 | `shelf-label:<slug>` (once per film ever) | ~$0.01, ~$0.17 on a cold lane list |
| **Moderation** (`take-check`, `photo-check`) | takes, lists, avatars, group photos | signed-in | account-keyed → **now also by address**; `DAILY_TAKE_CHECKS` 1,000, `DAILY_PHOTO_CHECKS` 500 (fail closed) | none | ~$0.0003 |
| **Mixes** (taste mixes, discover deck) | `/api/taste-mixes` | — | — | — | **no live Claude call**: ranking only (lane judgments are cached, written by the ops judge) |

### Claude, crons and ops (all behind `CRON_SECRET`)

| Job | Schedule | Spend bound before | Now |
|---|---|---|---|
| `label-backlog` (Batch API, Sonnet) | every 2 h | ≤4,000 films, ≤$15 a batch, one batch out at a time | + shares **$5/day** cron budget, cut to fit; paused on a spike day / `AI_LABELS=off` |
| `label-traits` (4 batch sets) | every 2 h | per set $20 / $20 / $0.50 / $6 out at once | + same shared $5/day; still collects when paused |
| `ops/new-release-themes` (traits + shelving) | nightly, via a workflow | 40 paid films a day | 0 paid films on a paused day; spend counted in the cron budget |
| `label-films` (Sonnet, gated) | daily | 60 films | already stops with the user budget (`reserveClaudeCall`); `AI_LABELS` |
| `label-recheck` (gated) | weekly (Sun) | ~$0.30 a run | same |
| `film-settings` (gated, `generateJson`) | daily | 800 calls a day | same |
| `model-compare` | daily, but runs once and saves the result | ~$1 once (already spent) | — |
| `ingest-backfill`, `ingest-new-releases`, `upgrade-standins` | 3 h / daily / 4 h | TMDB (free) + Letterboxd scrape + OpenAI embeddings; no Claude (labels are left to label-backlog) | — |
| `film-awards` | monthly | Wikidata (free); no Claude | — |
| `ops/*` previews and rescoring (formula-rescore, summary-rewrite, judge-lanes…) | owner-run only | owner-triggered | not budgeted; behind `CRON_SECRET` |

### Other metered APIs

| API | Where | Bound |
|---|---|---|
| ScrapingBee render service (`SCRAPE_RENDER_URL_TEMPLATE`) | Letterboxd username imports | `DAILY_IMPORT_CAP` 6,000/day, `build-username` 10/10 min per address; fails with RENDER_SERVICE_UNAVAILABLE when out of credits. **At about 18 pages a library, 6,000 imports is about 108k credits: check the plan.** |
| OpenAI embeddings (text-embedding-3-small, $0.02/M tokens) | new films during enrichment and ingest | once per film ever; under $1/day even at the import caps |
| TMDB | everywhere | free; `tmdb-details` capped at 20,000 calls a day |
| Resend email | digest, invites, feedback, ops alerts | `DAILY_FEEDBACK_MAIL_CAP` 50, `DAILY_REPORT_ALERT_CAP` 30; plan quota |
| Vercel, Supabase | — | plan limits; not changed here |

## 2. Caps and kill switches (code defaults; env overrides optional)

Every Claude label belongs to one feature (`lib/ai-features.ts`). A label not in the table counts as `other`, and the invariant check fails if a new label is left unfiled.

| Feature | Kill switch (default on; `off`/`0`/`false`) | Daily call cap (env override) | How it was sized | When refused |
|---|---|---|---|---|
| Pitch | `AI_PITCH` | `RECUT_DAILY_MODEL_CALLS` 20,000 (unchanged, owner-approved, rule 1077) | — | keyword parser |
| Why lines | `AI_WHY` | **950** (`AI_WHY_DAILY_CALLS`) | 5 × 186 | templated why line |
| Taste reads | `AI_READS` | **1,650** (`AI_READS_DAILY_CALLS`) | 5 × ~330 | deterministic read |
| Groups | `AI_GROUPS` | **300** (`AI_GROUPS_DAILY_CALLS`) | 5 × ~60 | templated line |
| Shelve | `AI_SHELVE` | `DAILY_SHELVE_CAP` 100 (unchanged) | — | no shelf chip |
| Catalog crons | `AI_LABELS` | each cron's own cap + **`DAILY_CLAUDE_CRON_USD` $5** for the batch passes | ~5 × a normal day of batches | film waits a day |
| Anything else | `AI_OTHER` | **200** (`AI_OTHER_DAILY_CALLS`) | floor | caller's own |
| (unchanged, rule 740) | — | `DAILY_CLAUDE_USD` $11, `DAILY_CLAUDE_USER_USD` $1, `DAILY_CLAUDE_ANON_CALLS` 2,000, `DAILY_CLAUDE_CALLS` 60,000 | | |

The batch crons stop sending new work when `AI_LABELS` is off or when the day's `claude:usd` reaches `DAILY_CLAUDE_USD`. While stopped they still collect batches that have finished.

Moderation gets no kill switch on purpose. It fails closed (rule 965), so a switch could only ever open it.

**Per-caller limits (rule 1631).** Before this change, model-backed routes were keyed on *either* the address *or* the account. Now `AI_ROUTES` counts both:

- On address-keyed routes, any caller with a verified token (member or guest) is also counted on their account, at the same limit.
- On account-keyed routes, a member is also counted on their address, at 10× the limit.
- Guests already shared an address bucket (rule 1191).

The shared read buckets (`profile-read`, `social-read`) stay single-keyed so the hottest routes don't pay for a second database round trip. The calls they can reach are still bounded by the $1-a-person allowance and the feature caps.

## 3. Worst-case daily spend with the caps

| | Worst case / day |
|---|---|
| All budgeted Claude (why + reads + groups + other + Pitch + the gated crons): the feature caps add up to ~$13 at the costliest model mix, so **`DAILY_CLAUDE_USD` $11 binds** (it can overshoot by the cents of calls in flight) | **≤ $11** |
| Batch label crons (estimated cost; each estimate has headroom) | **≤ $5** |
| Shelve (100 × up to ~$0.04 average; ~$4 on a cold day per its own comment) | **≤ ~$4** |
| Moderation (1,000 take checks + 500 photo checks on Haiku) | **≤ ~$0.50** |
| **Claude total** | **≈ $20 / day** (≈ $600 / month if every day hit every cap) |
| OpenAI embeddings | < $1 |
| ScrapingBee | plan credits; **not a dollar cap**: see below |

Without the caps, a launch day of many builds would have spent up to the $11 user budget anyway. The new part is that the batch crons are now bounded per day rather than only per run. Before, label-backlog and label-traits could in principle send roughly $15 + $46.50 of batches every few hours if the backlog grew (for example after a big catalog seed). Now they share $5 a day.

## Not verified, and what the owner should decide

- **The $11 global budget was not lowered.** It is about 11× the busiest day and 40× an average one. The task asked for roughly 5× normal. That would be about $2.50-5, which is below Pitch's own owner-approved cap ($5.60 at 20,000 calls, rules 740 and 1077), so lowering it would be undoing an owner decision. The feature caps above hold everything except Pitch to about 5×.
  - Recommendation: if launch-day Pitch volume is meant to stay small, set `DAILY_CLAUDE_USD=5` and `RECUT_DAILY_MODEL_CALLS=5000` in Vercel. Only the owner can do this; the env API was off limits to me.
- **The reads cap will bind on a real launch day.** About 2,500 builds × ~5 read calls is about 12,500 calls against a cap of 1,650. After the first ~330 builds of the day, the rest get the deterministic read: same as over budget today, no UI change. This is the trade-off as specified. Raise `AI_READS_DAILY_CALLS` if the reveal's writing matters more than the bill.
- **ScrapingBee credits** are bounded by the import cap, not by a dollar cap. Check whether the plan bills overage or just stops.
- Not run against production traffic. The checks are code-level (`check-invariants` 1630/1631, typecheck, check-security, check-ds-log), plus a local smoke test: `AI_WHY=off` makes `reserveClaudeCall("fit")` return false. The new counters (`claude-feature:<feature>`, `claude-cron:usd`) will appear in `usage_counters` from the first call after deploy.
- **SQL for the owner: none.**
