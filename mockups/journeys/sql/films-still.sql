-- Picks: the film's real still (owner-approved 2026-11-09, mockups/journeys/picks-immersive-v1.html option C; rule 1425).
-- films.backdrop_url is TMDB's first backdrop (sometimes title or logo art). app/api/cron/film-stills picks a text-free
-- backdrop from TMDB /movie/{id}/images and stores its file path here; the Picks card uses it, else backdrop_url.
-- Safe to run more than once. The app works before this runs (it feature-detects the column).
alter table public.films add column if not exists still_path text;
alter table public.films add column if not exists still_checked_at timestamptz;
-- The job's queue: films never checked, most-watched first.
create index if not exists films_still_unchecked_idx on public.films (letterboxd_watch_count desc nulls last, letterboxd_slug)
  where still_checked_at is null and tmdb_id is not null;
notify pgrst, 'reload schema';
