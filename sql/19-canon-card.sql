-- 19-canon-card.sql — Montage, b141 (montage rule 2096): a Canon sent in Montage lands in a chat as a card.
--
-- Widens group_messages' card shape check by one kind, 'canon'. Until this runs, a Canon sent in Montage goes as its
-- fallback line (a text row: "Alex's Canon: 10 films montagefilm.app/u/alex/canon"), so nothing breaks; once it has run,
-- the next Canon sent is a card. Needs sql/17-chat-cards.sql to have run first (it adds the column and the 'card' kind).
--
-- Idempotent: safe to run twice. Touches no existing rows (it only widens a check).

alter table public.group_messages drop constraint if exists group_messages_card_shape;
alter table public.group_messages add constraint group_messages_card_shape
  check (kind <> 'card' or (
    card is not null
    and (card ->> 'kind') = any (array['archetype', 'blend', 'night', 'tonight', 'canon'])
    and length(card ->> 'id') between 1 and 120
    and jsonb_typeof(card -> 'snap') = 'object'
  ));
