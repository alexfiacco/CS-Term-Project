# Analytics audit, 2026-11-14 (read-only, montage origin/main 965f578)

## Summary
- Onboarding funnel: web has one event per screen; iPhone cannot see drop-off before the save step (no SDK, events held in memory until an account exists, rule 549).
- Sign-up conversion: web counts `account_created` (Apple mislabelled as email); iPhone never sends `account_created`.
- Feature usage: broad. Missing: Tune your picks and its deck card (both platforms); on iPhone `recut_run`, `tonight_pick_made`/`tonight_reroll`, `film_sheet_opened`, `room_joined`/`room_picks_revealed`, `share_completed`, settings and feedback.
- Swipes: no pass/swipe event on either platform.
- Web: autocapture on (clicks), replay off (privacy policy promises it), heatmaps follow the PostHog project setting. iPhone: no heatmaps or replay possible under rules 26 and 549.
- Identity: web signed-out id is a daily-rotating hash, so multi-day anonymous funnels break; signed-in and guest cohorts are exact.
- PostHog: US cloud, proxy t.montagefilm.app; `.env.example` sets the host to us.i.posthog.com, which conflicts with rule 448.
- Privacy page's iPhone paragraph is out of date (about 130 event names now, including onboarding sent after an account exists).

## Gaps ranked by "is the app intuitive"
1. iPhone pre-account drop-off can't be seen.
2. No Picks pass/swipe event.
3. Tune your picks and the deck card send nothing.
4. Save step: no method tap event, no failure/abandon event, Apple counted as email on web, no iPhone `account_created`.
5. The ops digest is per-step counts, not an ordered per-person funnel; no saved PostHog funnel with a platform split.
6. iPhone core features missing events (listed above).
7. "See my picks" shares `reveal_check` with "agreed with the name".
8. Web multi-day anonymous funnels break (inherent to the privacy design).

## Smallest set of events to close the gaps
1. `onb_save_method` {apple, google, email, not_now} and `onb_save_failed` {method, reason}.
2. `account_created` on iPhone; web method fixed for Apple.
3. `onb_see_picks`.
4. `picks_passed` {tab, index} (or picks_acted action=pass) and `onb_first_action` {action, index}.
5. `reveal_picks_shown` on iPhone.
6. iPhone signed-out drop-off: a counts-only endpoint with no id (owner decision, rules 26/549, privacy text).
7. `tune_card_shown` / `tune_card_acted`, `tune_opened` / `tune_changed`.
