-- 20-year-card.sql — Montage, b143 (montage rule 2099, MON-39): a year in film sent in Montage lands in a chat as a card.
--
-- Widens group_messages' card shape check by one kind, 'year'. Until this runs, a year sent in Montage goes as its
-- fallback line (a text row: "Alex's 2026 in film: 214 films"), so nothing breaks; once it has run, the next year sent
-- is a card, and its "See their year" opens the sender's cards read-only for that chat's people.
-- Needs sql/17-chat-cards.sql (the column and the 'card' kind); includes 19's 'canon', so 19 may be skipped.
--
-- Idempotent: safe to run twice. Touches no existing rows (it only widens a check).

alter table public.group_messages drop constraint if exists group_messages_card_shape;
alter table public.group_messages add constraint group_messages_card_shape
  check (kind <> 'card' or (
    card is not null
    and (card ->> 'kind') = any (array['archetype', 'blend', 'night', 'tonight', 'canon', 'year'])
    and length(card ->> 'id') between 1 and 120
    and jsonb_typeof(card -> 'snap') = 'object'
  ));
