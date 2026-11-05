-- Pitch sharing (mockups/journeys/pitch-share-v1.html): a pitch sent to a friend's chat or a group's
-- chat as its own card. MOCK ONLY: not applied. Review, then run in the Supabase SQL editor.
--
-- group_messages gains a fourth kind, 'pitch', and a `pitch` snapshot (a chat with a friend is a
-- group of kind 'dm', so one change covers chats and groups). The snapshot is built by the server
-- from the stored recuts row (lib/recut-server.ts getRecut), never from the client, and holds only
-- what the public /pitch/<id> page shows:
--   { id, sentence, read: [chip labels], top: [{ slug, title, year, posterUrl }] }
-- with the "with" friend stripped from the sentence and the chips, and no match %.
--
-- Safe on the live database: a nullable column and a wider check; existing rows all pass.
-- group_list_previews returns `m.*` (20261029 fix), so the new column cannot break it.
-- RLS stays on with no policies and nothing granted to anon/authenticated (rule 21): only the
-- service role reads and writes, after the route has checked membership.

alter table public.group_messages add column if not exists pitch jsonb;

comment on column public.group_messages.pitch is
  'For kind pitch: a snapshot of a shared pitch {id, sentence, read, top[{slug,title,year,posterUrl}]}, as public as /pitch/<id>; filled by the server from public.recuts.';

alter table public.group_messages drop constraint if exists group_messages_kind_check;
alter table public.group_messages add constraint group_messages_kind_check
  check (kind in ('text', 'film', 'system', 'pitch'));

-- A pitch card always carries its snapshot, with an id shaped like a recuts id.
alter table public.group_messages drop constraint if exists group_messages_pitch_shape;
alter table public.group_messages add constraint group_messages_pitch_shape
  check (kind <> 'pitch' or (pitch is not null and (pitch->>'id') ~ '^[A-Za-z0-9_-]{6,16}$' and length(pitch->>'sentence') between 1 and 200));

alter table public.group_messages enable row level security;
revoke all on table public.group_messages from anon, authenticated;
