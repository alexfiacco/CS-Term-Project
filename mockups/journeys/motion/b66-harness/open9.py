"""Clip 9: join the Picks and grid recordings into one sequence, then encode clip 9 and its reduced version."""
import os, shutil, subprocess
H = os.path.dirname(os.path.abspath(__file__))
OUT = "/home/user/CS-Term-Project/mockups/journeys/motion"
dst = f"{H}/vid/open"
shutil.rmtree(dst, ignore_errors=True); os.makedirs(dst)
k = 0
for part in ["open-row", "open-grid"]:
    for f in sorted(os.listdir(f"{H}/vid/{part}")):
        shutil.copy(f"{H}/vid/{part}/{f}", f"{dst}/f{k:04d}.jpg"); k += 1
print("frames", k, k / 30)
def enc(clip, name, gw=360, fps=15, cols=128):
    src = f"{H}/vid/{clip}/f%04d.jpg"
    subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-framerate", "30", "-i", src, "-c:v", "libx264", "-preset", "slow", "-crf", "22",
                    "-pix_fmt", "yuv420p", "-movflags", "+faststart", f"{OUT}/{name}.mp4"], check=True)
    subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-framerate", "30", "-i", src, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1",
                    f"{OUT}/{name}.webm"], check=True)
    vf = f"fps={fps},scale={gw}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors={cols}:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle"
    subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-framerate", "30", "-i", src, "-vf", vf, "-loop", "0", f"{OUT}/{name}.gif"], check=True)
    for e in ("mp4", "webm", "gif"):
        print(name + "." + e, os.path.getsize(f"{OUT}/{name}.{e}"))
enc("open", "b66-09-open-film", 320, 15, 128)
enc("open-row-rm", "b66-09-open-film-reduced", 320, 15, 128)
