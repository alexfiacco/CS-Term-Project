-- 17-chat-cards.sql — Montage build 41, b41-chat (montage rule 2077; group chats are rule 2076 and need no SQL).
--
-- Four new chat cards: an archetype, a Blend, a movie night result and a Tonight pick sent from the share screen's
-- Send in Montage land in a chat as a card (group_messages kind 'card' with a `card` jsonb the SERVER builds from
-- stored data, lib/chat-cards.ts). Until this runs the server sends each card as its fallback line (a text row), so
-- nothing breaks; once it has run, chatCardReady() turns the cards on within a minute, no deploy needed.
--
-- Idempotent: safe to run twice. Touches no existing rows (adds a nullable column and widens a check).

alter table public.group_messages add column if not exists card jsonb;

-- The kind check, widened by one kind ('card'); every existing kind stays.
alter table public.group_messages drop constraint if exists group_messages_kind_check;
alter table public.group_messages add constraint group_messages_kind_check
  check (kind = any (array['text', 'film', 'system', 'pitch', 'list', 'card']));

-- A card row carries its card: one of the four kinds, an id, and a snapshot object.
alter table public.group_messages drop constraint if exists group_messages_card_shape;
alter table public.group_messages add constraint group_messages_card_shape
  check (kind <> 'card' or (
    card is not null
    and (card ->> 'kind') = any (array['archetype', 'blend', 'night', 'tonight'])
    and length(card ->> 'id') between 1 and 120
    and jsonb_typeof(card -> 'snap') = 'object'
  ));

-- group_list_previews (Social's chat list) returns `select m.*`, so it carries the new column with no change.
