# Horror fix: build, measurements and how it ships (rule 2085)

Date: 2026-11-14. Follows `horror-investigation.md`. Accounts are named by user-id prefix only. Every database read here was a SELECT through the Supabase MCP; nothing was written to the database from this session.

## 1. What was built

Branch `b41-horror` in the montage repo (one commit, rule 2085). The owner first chose "Do this and ship", then "ship with the test", so the fix is **built and off** and its pre-registered test runs on Vercel.

- **Fix 1, `dislikedSim`.** A rated film counts as a dislike only when it is 2.5★ or less **and** at least 0.5★ under its real Letterboxd average. A film with no real crowd keeps the old rule. The set is built in `v3Stats` (lib/taste/match-model.mjs), the one place the nightly pass, the after-rating rescore and the backfill all read, so web and iPhone get the same stored scores.
- **Fix 2, `knnBase`: sign lock.** Its weight can't go below 0, for each person's fit and for the population's. The lock is applied after the fit, the same way rule 1489 locks `langAff`. I chose the sign lock over fitting `knnBase` and `knnLocal` as one contrast for three reasons:
  - it is one entry in the existing lock;
  - the stored 41-number weight layout doesn't change;
  - it is the reading both the SQL estimate below and the eval make.
- **Fix 3 was not built.**
- **The switch.** Both fixes run only when the server env `MATCH_HORROR_FIX` is `on`. While it is off, every line computes exactly what it did before, and the population key stays `match-model:v7n9sfd:population`. When it is on, the key becomes `...n9sfdub...`.
- **Rescoring after the switch.** The full pass now treats a missing population fit under the current key as a model change. That night everyone is due (`why: "new population"`). This replaces moving `CATALOG_FIXED_AT` by hand, as rules 1488, 1545 and 1555 had to.
- **The test.** `/api/cron/eval-horror-fix` (lib/taste/eval-horror-fix.ts) is a resumable cron route. It is in vercel.json with a once-a-year schedule (Jan 2, 15:41 UTC) only so it appears in Vercel's Cron Jobs page, where the owner presses Run.
  - It ends by logging one line, `[eval-horror-fix] PASS ...` or `FAIL ...`.
  - It saves the full result to ai_cache `cron:result:eval-horror-fix`.
  - It writes nothing else and never turns the fix on.
- **The bar** was pre-registered in docs/DATA-SCIENCE-LOG.md (2026-11-14) before any run. In short:
  - recall@50 and recall@200 of later 4★+ films: the 2.5th percentile of the change, bootstrapped over accounts, must be at least −2% of the baseline;
  - heaviest-genre liked films in the top 50: they must not fall by more than 10% overall, and they must rise for `dbd4371e`;
  - `1e98e112` must also rise when it is testable.

## 2. Measured here (read-only SQL, stored weights, in-sample)

**Method.** I rebuilt the terms in SQL as the investigation did, using pgvector inner products over the person's rated films. Each film's logit was read back from its stored score through the person's scale. Then I made two changes:

- removed `knnBase`'s term (it is negative in all 18 accounts);
- recomputed `dislikedSim` with the new disliked set, at the stored weight and the population's scale, with the clamp range rebuilt.

**Not simulated:**

- the refit of every weight;
- the population refit;
- the share cap's rescaling;
- the director cap on the nearest films.

This is an estimate, not the test.

### The two horror fans

| | `dbd4371e` before | after | `1e98e112` before | after |
|---|---|---|---|---|
| Dislikes counted | 4 | 1 | 3 | 3 |
| Horror, mean score (40 most-watched unseen) | 36.5 | **46.8** | 64.1 | **73.3** |
| Animation, mean score (40 most-watched unseen) | 75.9 | 71.6 | 67.7 | 67.3 |
| Horror in the top 50 | 0 (0%) | **3 (6%)** | 3 (6%) | **14 (28%)** |
| Animation in the top 50 | 31 (62%) | 27 (54%) | 5 | 8 |

Notes on the table:

- **How the means were scored.** They are on the person's scale, rebuilt from the reference set. The stored means are 34.9 / 73.9 for `dbd4371e` and 63.6 / 67.4 for `1e98e112`.
- **The top-50 pool.** 1,000+ logs, 40+ minutes, no Documentary or TV Movie, not a duplicate, rated films removed.
- **Fix 1 barely moves `dbd4371e`.** One of its four dislikes is a 2★ horror film with no Letterboxd crowd, so it keeps the old rule. With only that film in the set, `dislikedSim` still favours animation by about 1.15 log-odds, against 1.35 before.
  - Most of the improvement comes from fix 2.
  - A refit with one dislike would likely shrink the weight, but that is not measured.
- **`1e98e112` moves on fix 2 alone.** Its three dislikes are all at least 0.5★ under the crowd, so fix 1 doesn't touch them.

### All 18 accounts with 50+ rated (in-sample)

Each person's own rated films are ranked by score, scored with themselves included, as stored.

| | Before | After |
|---|---|---|
| 4★+ films in the top 50 | 822 of 900 | **843** (7 accounts up, 11 the same, 0 down) |
| Mean recall@50 of 4★+ films | 0.496 | 0.513 |
| Heaviest-genre 4★+ films in the top 50 (guardrail) | 372 | **395** (12 up, 2 the same, 4 down) |
| Films counted as dislikes | 570 | 469 |

- **Where the guardrail fell.** `eee3834e` 17 → 15, `d73ace86` 26 → 20, `322bf90c` 22 → 17, `1b73ada1` 24 → 19. All four are Drama-heavy.
- **Where it rose most.** `1e98e112` (Horror) 18 → 25, `9d78754a` (Comedy) 17 → 23, `032e0fd5` (Comedy) 24 → 29, `dbd4371e` (Horror) 2 → 4.
- **Not measured in SQL:**
  - anything held out (that is the eval's job);
  - recall over the whole unseen pool for all 18. That is about 130 million inner products, past the SQL tool's 60-second limit; I measured about 115k per second.

## 3. How and when it rescores

**Nothing rescores until the flag is on.** Landing `b41-horror` changes no score, because the flag defaults to off.

**The owner's steps:**

1. Run the test: Vercel → Project → Settings → Cron Jobs → `/api/cron/eval-horror-fix` → Run.
   - It hands itself on until done (about a dozen invocations at today's size; see section 4).
   - Pressing Run again carries on an unfinished run.
2. Read the verdict. It is in the function log (`[eval-horror-fix] PASS ...` or `FAIL ...`) and in ai_cache `cron:result:eval-horror-fix`.
3. On a PASS, set `MATCH_HORROR_FIX=on` in Vercel's production env and redeploy. An env change only reaches functions on a new deployment.
4. The next `/api/cron/match-scores` run at **08:33 UTC** finds no population fit under the new key. It then:
   - refits the population;
   - refits and rescores **every** account;
   - saves new calibrations;
   - clears score caches.
   No manual run is needed. To do it sooner, call `GET /api/cron/match-scores?all=1` with `Authorization: Bearer $CRON_SECRET`.
5. Between the redeploy and that pass, stored scores stand. The after-rating rescore waits for the new population fit, so it doesn't read the old fit under the new rules.

**On a FAIL,** the flag stays off and the result is reported. The bar is not changed and the test is not re-run.

## 4. Gates

On the commit:

- tsc: clean.
- check-invariants: exit 0, no ✗ (2081 is new; 149 needed the route in docs/app/API.md).
- check-security: ok.
- check-ds-log origin/main: ok.
- check-scoring-profile-cache: ✓.
- check-taste-cache: ok.
- sim-match-pass --check: equal to the one-shot pass, both with the flag off and with `MATCH_HORROR_FIX=on`.
- test-match-v9: passes off and on.
- test-taste-layer: passes.
- sim-eval-horror-fix --check: each arm's weights equal the production functions' for that arm.

**Full-size timing of the eval** (`scripts/sim-eval-horror-fix.ts`, no database, real model code). The run used a synthetic set built to today's size: 23 accounts at their real rated counts, a 29,000-film catalog, 55 account-folds, and reads costed at 6 ms per vector.

- It took 12 invocations, about 35 minutes in all.
- The slowest invocation took 189 s, against Vercel's 300 s limit, so the job stays inside the 40-invocation cap.
- At 2,000 films per shard, one scoring step took about 150 s. That is too near the limit, so shards are 500 films.
- The synthetic verdict means nothing. The check only proves the pass runs to the end and reports.

Branch commit: `0886ab675` on `b41-horror`, rebased on main `5d65a75d2`.
