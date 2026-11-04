-- Invite bonuses (owner, 2026-11-04: "Start all"; "ship all"; rule 1078; mock
-- journeys/beli-8-invite-reward.png). A thank-you on top, never a gate: nothing in Montage is locked
-- behind inviting, and sign-up never needs an invite.
--
-- invites               one row per account that joined from someone's link (or named them in the
--                       iPhone's optional "Who invited you?" step). One inviter per invitee, first wins.
--   invitee_profile_id  the new member's public profile id (text, as public_profiles.id).
--   inviter_profile_id  whose link it was.
--   invitee_user_id     the new member's account (text, as public_profiles.user_id).
--   via                 link | asked.
--   qualified_at        stamped the first time the invitee is seen with 15+ rated films
--                       (lib/invite-bonus.ts inviteStatus); the month it lands in is the month its
--                       +3 Recuts count for. Never cleared.
--
-- Safe on the live database: one new empty table and an index; nothing existing changes. RLS on with
-- no policies: only the server (service role) reads or writes it. Rows go with either profile.

create table if not exists public.invites (
  invitee_profile_id text primary key references public.public_profiles (id) on delete cascade,
  inviter_profile_id text not null references public.public_profiles (id) on delete cascade,
  invitee_user_id    text,
  via                text not null default 'link' check (via in ('link', 'asked')),
  created_at         timestamptz not null default now(),
  qualified_at       timestamptz,
  check (invitee_profile_id <> inviter_profile_id)
);

create index if not exists invites_inviter on public.invites (inviter_profile_id, created_at);

alter table public.invites enable row level security;
