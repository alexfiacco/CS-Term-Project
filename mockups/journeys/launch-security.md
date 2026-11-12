# Montage launch security pass (2026-11-12)

Scope: the Supabase project (uktamekqqsiijugpaxit), the Next.js API routes, and the report pipeline.
Database checks were read-only (advisors and SELECTs on pg_class, pg_policies, pg_default_acl and
information_schema). Nothing was run against the database. The SQL the owner needs to run is in the
montage repo at `docs/sql/launch-security.sql`.

Code fix pushed to montage `main`: **562c0113** (rule 1640).

## Findings, most severe first

### High

**H1. RLS is the only thing protecting the data, because the table grants are wide open.**
Every `public` table has RLS on, and every table except `film_cast` has no policies. Clients can't
read or write anything today, and the app works because every query goes through the API with the
service role. Underneath that:
- About 40 public tables still grant `anon` and `authenticated` full rights (SELECT, INSERT,
  UPDATE, DELETE, TRUNCATE). This includes `profiles`, `public_profiles` (with `home_country` and
  `home_languages`), `user_ratings`, `user_watchlist`, `follows`, `groups`, `group_members`,
  `theaters`, `theater_members` and `user_feedback`.
- The default privileges in `public` (for both `postgres` and `supabase_admin`) give `anon` and
  `authenticated` full rights on every new table.
- There is no event trigger that turns RLS on for new tables.

As a result, one migration that forgets `enable row level security`, or one `using (true)` policy,
makes that table readable and writable by anyone with the publishable key. That key ships in every
page.
Fix: `docs/sql/launch-security.sql` steps 1, 2, 5 and 6 revoke the grants and default privileges
and add an event trigger that turns RLS on for new public tables. **The owner needs to run this.**

### Medium

**M1. Before this fix, the 24-hour review promise depended on one optional email.**
A report reached the owner only through the feedback mail (`FEEDBACK_NOTIFY_EMAIL`). That mail is
silent when the variable is unset, and it shares a 50-per-day cap with Send feedback, so a feedback
flood could suppress report mails. `user_reports` has 0 rows ever, so the full path from a report
to the owner has never run in production.
**Fixed** (see below). The new daily ops digest (rule 1652, pushed by another session today) also
lists reports that have been open for 12 hours or more.

**M2. Two copies of profile data are in the API schema.**
`public.backup_public_profiles_20261106` and `public.identity_backup_v45` have RLS on with no
policies, so they can't be read today, but they carry the wide grants from H1.
Fix: SQL step 4 moves both to `archive`, which `anon` and `authenticated` cannot use. No data is
deleted.

**M3. Sign-up and anonymous sign-in limits were not verified.**
Sign-up and guest sign-in go straight from the client to Supabase Auth, so no app rate limit
applies. The MCP can't read the Auth settings, so these were not checked.
Owner: under Dashboard → Authentication → Rate Limits, confirm the per-hour limits for sign-ups,
anonymous sign-ins and OTP, and turn on CAPTCHA (Turnstile or hCaptcha) before launch traffic.
Guest accounts are free to create. The app limits what a guest can do (half limits plus a per-IP
guest bucket, rules 996 and 1191), but it does not limit how many guests are created.

### Low

**L1. Realtime "Allow public access" is probably still on.**
The server still sends `theater:` nudges to the public channel too (`REALTIME_PUBLIC_NUDGES` is not
`off`). Payloads are empty, so a listener learns only that something changed in room X, and can
send empty nudges that make clients refetch.
Owner: in the Dashboard, turn the setting off under Realtime → Settings, then set
`REALTIME_PUBLIC_NUDGES=off` on Vercel. Private channels are correctly gated by
`private.can_hear_topic`: you must be a member or owner of the room or group, or own the activity
topic.

**L2. `film_cast` has an unused `public read` policy.**
This is the advisor's only anon-access warning in `public`. Nothing on the client reads
`film_cast`. SQL step 3 drops the policy.

**L3. `dm-send` is limited per IP, not per account.**
The limit is 30 per 10 minutes, halved for guests. Later chat messages go through `group/thread`
under `group-write`, which is per account (120 per minute). That is fine for now. Note that
households share the first-message limit.

### Info (advisors)

- Security: 131 tables with "RLS enabled, no policy" (INFO). This is intended: the API is
  service-role only. The anon-access warnings cover `cron.job` and `cron.job_run_details` (owner
  policies built into the extension, harmless), `public.film_cast` (L2) and `realtime.messages`
  (the members-only broadcast policy, intended).
- Performance: 6 tables without a primary key (backup and archive tables), 53 unused indexes, and
  the Auth DB connection strategy set to an absolute number (10). Switch it to a percentage before
  scaling the instance.

## What was checked and found sound

- **RLS on the newer tables:** `groups`, `group_members` and `group_messages` (friend chats are
  `groups` rows with kind `dm`), `film_takes` with its replies, reactions and reads,
  `rating_reasons`, `theaters` and the `theater_*` tables, `user_reports`, `user_blocks`,
  `notify_prefs`, `release_reminders_sent`, `user_watchlist` and `public_profiles`
  (home_country/home_languages). All have RLS on and no policies, so anon and other users read
  and write nothing directly.
- **Functions:** no SECURITY DEFINER function in `public` can be executed by `anon` or
  `authenticated`. Only `crew_role` and `search_key` (pure helpers, invoker rights) can.
- **Storage:** `avatars` is public, limited to 4 MB of images. `feedback` and `backups` are
  private. There are no `storage.objects` policies, so all writes go through the server.
- **`home_country` and `home_languages`:** read and written only for the caller's own profile in
  `/api/home-languages`. No public payload selects them, and no route uses `select("*")` on
  `public_profiles`.
- **IDOR:** `node scripts/check-security.mjs` passes (256 routes, 243 methods rate-limited). By
  hand I read report, block, dm, film-takes, recut (Pitch), groups, group/members, group/thread,
  profile-meta, avatar, publish-profile, letterboxd-link, match-recs, pair-watchlist, home-languages,
  rating-chips, feedback and reports (owner page). Every write takes its identity from the verified
  session (`verifiedUserId`, then `getProfileIdByUser`) and compares it with any id in the body.
  Report looks up the author on the server and only accepts content the reporter can see. DMs check
  mutual friends and blocks in `openDm`. The owner Reports page is limited to verified preview user
  ids.
- **Rate limits:** report (10 an hour per user, plus a cap of 10 reports per hour per reporter),
  block (30 a minute per user), take-write (60 a minute per user, halved for guests; Everyone takes
  also pass a model check with its own daily cap), dm-send (30 per 10 minutes), group-write,
  room-write, and recut/Pitch (20 per 10 minutes per IP plus 30 per account, `recut-rank` 120).
  Password change is 5 per 10 minutes and apple-token 10 per 10 minutes. Sign-up itself is Supabase
  Auth's limit (M3).

## What I fixed (montage 562c0113, rule 1640)

- `lib/blocks.ts` `reportUser`: after a report row is stored, `alertReport` sends a message through
  `sendOpsAlert` (lib/errlog.ts), on the same channels as the error alerts and the daily digest:
  `ERROR_WEBHOOK_URL` (Slack or Discord, which pushes to a phone) and/or `ERROR_ALERT_EMAIL`. The
  message is "Montage: new report: <kind> (<@handle>, "<reason>". Review within 24 hours:
  …/dev/reports)". It carries the kind, handle and reason only. The reported words stay on the
  Reports page and never go into a chat webhook. It covers both `/api/report` and the report action
  in `/api/film-takes`.
- These alerts have their own daily cap (`report_alert`, `DAILY_REPORT_ALERT_CAP`, default 30 in
  lib/spend-guard.ts), so feedback mails and report alerts can't use up each other's slots.
- `/api/health` now answers `reportAlert: true|false`, so the owner can confirm a channel is set.
- Docs: rule 1640 in docs/INVARIANTS.md with its check, and docs/app/API.md (report behaviour,
  health output).
- Gates passed: `tsc`, check-invariants (0 ✗), check-security, `check-ds-log origin/main`, and
  the pre-push hook.

**Does the report alert exist now?** In code, yes. In production it works only if `ERROR_WEBHOOK_URL`
or `ERROR_ALERT_EMAIL` is set on Vercel. I couldn't verify that: the Vercel env listing returned 403
and the sandbox can't reach montagefilm.app. Check `GET /api/health` → `reportAlert`. Then file one
test report from a second account to confirm the full path works.

## SQL the owner must run

File: `docs/sql/launch-security.sql` in the montage repo (main). In summary:

1. `revoke all` on all tables and sequences, and `revoke execute` on all functions, in `public`
   from `anon` and `authenticated`.
2. `alter default privileges for role postgres in schema public revoke …` from the same roles.
3. `drop policy "film_cast public read"`.
4. Move `backup_public_profiles_20261106` and `identity_backup_v45` to `archive`.
5. The same default-privilege revoke for `supabase_admin`. This is wrapped so that a "permission
   denied" only prints a notice.
6. An event trigger, `montage_rls_on_new_public_tables`, that enables RLS on any table created in
   `public`.
7. Three verification SELECTs. Each should return no rows.

The SQL deletes or rewrites no user data. The app is unaffected: the server uses the service role,
and the browser only signs in and joins Realtime channels.

Dashboard items that are not SQL: Realtime "Allow public access" off (L1), Auth rate limits and
CAPTCHA (M3), and the Auth DB connection strategy as a percentage.
