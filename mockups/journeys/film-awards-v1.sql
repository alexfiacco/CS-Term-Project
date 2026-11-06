-- Pitch: award winners (rule 1169, 2026-11-06). "an Oscar winner", "a Palme d'Or winner".
-- Run once in the Supabase SQL editor (project uktamekqqsiijugpaxit). Safe to run again.
-- Until it runs (and the import fills it), Pitch reads an award ask as a note: "Award data isn't
-- loaded yet, so these are from everywhere." Nothing else changes.
--
-- Filled by `npx tsx scripts/import-film-awards.ts` (in the montage repo), a one-time read of
-- Wikidata's public SPARQL endpoint (CC0 data): Academy Award winners and nominees in every
-- category (Best Picture kept as its own award), and the Palme d'Or, Golden Lion and Golden Bear,
-- joined to our films by IMDb id. Re-run it once a year after the ceremonies.
--
-- award: 'oscar' (any Academy Award category), 'best-picture', 'palme', 'golden-lion', 'golden-bear'
--        (lib/recut.ts AWARDS keys). category: the Wikidata label ("Academy Award for Best Actress").
-- won: true for a win, false for a nomination only.
-- Size: about 6,000 rows at about 120 bytes with indexes: under 1 MB.
create table if not exists public.film_awards (
  slug      text not null,
  award     text not null,
  category  text not null default '',
  year      smallint,
  won       boolean not null default true,
  source    text not null default 'wikidata',
  primary key (slug, award, category, won)
);
create index if not exists film_awards_award on public.film_awards (award, won);
alter table public.film_awards enable row level security;
revoke all on public.film_awards from anon, authenticated;
