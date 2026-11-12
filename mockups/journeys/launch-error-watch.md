# Launch error watch (2026-11-12)

Montage commit: `5d3511ba` on main (rule 1652).

## What existed
- Ops alerts: `lib/errlog.ts` `sendOpsAlert`, sent to ERROR_WEBHOOK_URL (Slack or Discord) and/or ERROR_ALERT_EMAIL (through Resend). They fire on the 1st, 10th, 100th and 1000th error of a day and on the 20th error in an hour. Errors are kept per day in ai_cache `errlog:<day>` and can be read at `/api/health`.
- `.github/workflows/ops.yml` runs by hand and has only the Supabase secrets. `smoke.yml` runs by hand only, so a failure email from it never arrives.
- iPhone: no crash or error capture of any kind (no MetricKit, no Sentry, no client-error post). Crashes are visible only in Xcode Organizer or TestFlight.
- Onboarding funnel events (`onb_*`) go only to PostHog. The server never stored them.

## Production errors, last 24 h (Vercel)
| Error | Count | What it is |
|---|---|---|
| Runtime timeout (15 s) on `/film/[slug]/v/[variant]` | 2 | The page's deliberate 15 s cap (rule 584). Down from 13,850 on 11-01. Not a bug. |
| cleanup: person index is 11 days old | 1/day | Owner action: run the Person index workflow. |
| cleanup: 1 marked duplicate refused (nymphomaniac) | 1/day | Data notice that has repeated since 09-30. |
| film-identity: 1,741 rows marked duplicate_of still unmerged | 1/day | Data backlog. |
| film-identity: slug/title mismatch (city-of-the-dead-2026) | 1 | Data notice. |
| library-audit: 8 library issues | 1 | Data notice. |

There were no user-facing API 5xx errors and no code bugs to fix. The errlog shows 6 errors on 11-11 and 5 so far on 11-12, all from crons.

## What I built
`/api/cron/ops-digest` runs as a Vercel cron every day at **14:07 UTC**. It uses the same channels as the error alerts. Contents:
- **Server errors:** yesterday's total and today's so far, broken down by scope (new `errlog-scope:` counters), plus the 5 most recent messages.
- **Crons:** ingest-backfill, release-reminders (watchlist alerts), label-recheck and film-awards now record a heartbeat (ai_cache `cron:beat:<name>`). Each shows as failed, stuck (no end after 15 min), overdue (more than 2x its schedule) or "no record".
- **Sign-ups:** new accounts and saved profiles in the last 24 h.
- **Onboarding funnel by screen:** from PostHog if its key is set (people, web and iPhone). Otherwise from new iPhone counters in `/api/app-events`. Those count events, not people, cover only signed-in sends, and cover yesterday's UTC day.
- **Reports:** reports open longer than 12 h, with the age of the oldest.
- **Claude spend:** yesterday and today, measured against the $11 daily budget (`claude:usd`). Any other `:usd` counter shows up automatically, so the coming cost guard needs no change here.

`?dry=1` (with the cron secret) returns the digest as JSON. I checked every query against the live database.

## Owner steps
1. **Required:** in Vercel production, confirm that ERROR_ALERT_EMAIL (plus RESEND_API_KEY and EMAIL_FROM) or ERROR_WEBHOOK_URL is set. I could not check this because the env list returned 403. If neither is set, the digest does nothing.
2. Optional: add POSTHOG_PERSONAL_API_KEY (a personal key with query read) and POSTHOG_PROJECT_ID. With these, the funnel covers web and iPhone and counts people.
3. Optional: the digest can't see true 5xx-by-route or Vercel timeouts without a Vercel log drain or token. Nothing for that is built.
4. iPhone crash reporting doesn't exist yet. Use Xcode Organizer for now.
5. No SQL is needed.
