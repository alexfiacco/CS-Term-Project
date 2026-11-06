-- Movie night rooms accept every language Settings offers (owner, 2026-11-06: "more languages").
-- Widens theaters_language_check from the original eight to the shared list (lib/viewing-prefs.ts).
-- Safe: only widens what is allowed; no rows change. Run once in the Supabase SQL editor.
alter table public.theaters drop constraint if exists theaters_language_check;
alter table public.theaters add constraint theaters_language_check check (
  language is null or language = any (array[
    'any','en','ja','fr','es','ko','it','de','hi','zh','pt','ru','da','sv','no','tr','fa','pl','th',
    'ta','te','id','fi','nl','ml','ar','cs','el','ro','hu','is','sr','bn','tl','he','ca','ka'
  ]::text[])
) not valid;
