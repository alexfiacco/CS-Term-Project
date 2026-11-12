#!/bin/bash
# encode.sh: frames in vid/<clip>/ to mp4 (H.264, 780x1688, 30fps) and a looping GIF in the mocks repo.
# Columns: clip, output name, GIF width, GIF fps, GIF colours (the poster-wall clips change every pixel, so they go smaller).
H="$(cd "$(dirname "$0")" && pwd)"
OUT=/home/user/CS-Term-Project/mockups/journeys/motion
mkdir -p "$OUT"
while read clip name gw fps cols; do
  [ -z "$clip" ] && continue
  ffmpeg -nostdin -loglevel error -y -framerate 30 -i "$H/vid/$clip/f%04d.jpg" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart "$OUT/$name.mp4"
  ffmpeg -nostdin -loglevel error -y -framerate 30 -i "$H/vid/$clip/f%04d.jpg" -vf "fps=$fps,scale=$gw:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=$cols:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" -loop 0 "$OUT/$name.gif"
done <<LIST
choose b66-01-choose 360 15 128
choose-rm b66-01-choose-reduced 360 15 128
rate b66-02-rate 360 15 128
reveal b66-03-reveal 300 12 64
reveal-rm b66-03-reveal-reduced 300 12 64
match b66-04-match 360 15 128
picks b66-05-seen 360 15 128
blend b66-06-blend 360 15 128
save b66-07-watchlist 360 15 128
ptr b66-08-refresh 360 15 128
LIST
ls -la "$OUT"
