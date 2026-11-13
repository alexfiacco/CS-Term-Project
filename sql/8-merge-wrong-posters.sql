-- Montage: point 20 wrong-film rows at the famous film they were meant to be (owner, 2026-11-13).
-- Each slug below has no Letterboxd data and nobody has rated it; its title + year (within 1) matches
-- a famous film with 100k+ watches. Marking duplicate_of makes search, lookups and posters follow
-- the right film. Nothing about anyone's ratings or lists is rewritten.
-- Left out on purpose (could be real, different films with the same name): 9-2009, aftermath-2024,
-- backrooms, day-night-2010, eternity-2025, identity-2024-2, loop-2020, play-dirty-2025, salvation-2025-1.
begin;

with fix(slug, established) as (values
  ('about-time-2013','about-time'), ('aftersun-2022','aftersun'), ('annihilation-2018','annihilation'),
  ('brooklyn-2015','brooklyn'), ('chicago-2002','chicago'), ('enemy-2013','enemy'),
  ('flight-2012','flight'), ('hell-or-high-water-2016','hell-or-high-water'), ('krampus-2015','krampus'),
  ('match-point-2005','match-point'), ('old-school-2003','old-school'), ('past-lives-2023','past-lives'),
  ('pocahontas-1995','pocahontas'), ('predator-1987','predator'), ('rocky-1976','rocky'),
  ('scream-1996','scream'), ('selma-2014','selma'), ('silence-2016','silence'),
  ('taxi-driver-1976','taxi-driver'), ('the-apartment-1960','the-apartment')
)
update films f
set duplicate_of = x.established, updated_at = now()
from fix x
join films a on a.letterboxd_slug = x.established and a.duplicate_of is null and coalesce(a.letterboxd_watch_count,0) > 100000
where f.letterboxd_slug = x.slug
  and f.duplicate_of is null
  and coalesce(f.letterboxd_watch_count,0) = 0
  and f.tmdb_id <> a.tmdb_id
returning f.letterboxd_slug, f.duplicate_of;

-- Expect 20 rows back. Then:
commit;
