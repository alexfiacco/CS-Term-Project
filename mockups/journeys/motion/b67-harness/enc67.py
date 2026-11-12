"""b67: join the built Picks-row and grid recordings, then encode b67-open-film-built (.mp4 and .gif)."""
import os, shutil, subprocess
H = os.path.dirname(os.path.abspath(__file__))
OUT = "/home/user/CS-Term-Project/mockups/journeys/motion"
dst = f"{H}/vid/built"
shutil.rmtree(dst, ignore_errors=True); os.makedirs(dst)
k = 0
for part in ["open-row", "open-grid"]:
    for f in sorted(os.listdir(f"{H}/vid/{part}")):
        shutil.copy(f"{H}/vid/{part}/{f}", f"{dst}/f{k:04d}.jpg"); k += 1
src = f"{dst}/f%04d.jpg"; name = "b67-open-film-built"
subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-framerate", "30", "-i", src, "-c:v", "libx264", "-preset", "slow", "-crf", "22",
                "-pix_fmt", "yuv420p", "-movflags", "+faststart", f"{OUT}/{name}.mp4"], check=True)
vf = "fps=15,scale=320:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle"
subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-framerate", "30", "-i", src, "-vf", vf, "-loop", "0", f"{OUT}/{name}.gif"], check=True)
for e in ("mp4", "gif"): print(name + "." + e, os.path.getsize(f"{OUT}/{name}.{e}"))
