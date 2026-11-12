"""Contact sheet: 3 key frames per clip, b66-motion-sheet.png."""
import os, json
from PIL import Image, ImageDraw, ImageFont
H = os.path.dirname(os.path.abspath(__file__))
OUT = "/home/user/CS-Term-Project/mockups/journeys/motion/b66-motion-sheet.png"
BOD = ImageFont.truetype("/home/user/montage/assets/fonts/BodoniModa-SemiBold.ttf", 30)
BODS = ImageFont.truetype("/home/user/montage/assets/fonts/BodoniModa-SemiBold.ttf", 22)
try:
    SANS = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
except OSError:
    SANS = ImageFont.load_default()
CLIPS = [
    ("choose", "1  Choose one from these", "deal, one riffle, slowing light, lift · 1.8s", [(0.30, "dealt"), (0.47, "the light slows"), (0.70, "lands, lifts")]),
    ("choose-rm", "1  Reduced motion", "fade in, crossfade to the choice", [(0.18, "fan fades in"), (0.40, "choice crossfades"), (0.70, "held")]),
    ("rate", "2  Rating a film", "left-to-right fill, one glint, line slides up", [(0.17, "tap 4.5"), (0.27, "glint"), (0.60, "We said 88%. Called it.")]),
    ("reveal", "3  The reveal", "letters set over a slow push-in · 2.5s", [(0.25, "first letters"), (0.42, "the name set"), (0.85, "its line")]),
    ("reveal-rm", "3  Reduced motion", "still wall, name fades in whole", [(0.10, "still wall"), (0.30, "name fades in"), (0.80, "held")]),
    ("match", "4  Match % counting up", "0 to 88 in 400ms", [(0.17, "page in, 0"), (0.22, "counting"), (0.60, "88%")]),
    ("picks", "5  Picks: Seen", "card out left, next rises · 350ms", [(0.25, "Seen"), (0.40, "card leaves"), (0.70, "next in place")]),
    ("blend", "6  Blend", "faces meet, count, descriptor", [(0.13, "faces slide in"), (0.30, "counting"), (0.60, "Strong overlap")]),
    ("save", "7  Saving to your watchlist", "poster arcs to Profile · 450ms", [(0.22, "tap Watchlist"), (0.29, "the arc"), (0.36, "lands")]),
    ("ptr", "8  Pull to refresh", "sprocket reel follows, then turns", [(0.22, "pulling"), (0.33, "release"), (0.55, "refreshing")]),
    ("open", "9  Opening a film", "poster grows into the header, page rises · 450ms; close reverses", [(0.108, "Picks: poster in flight"), (0.20, "film page"), (0.865, "grid: closing home")]),
    ("open-row-rm", "9  Reduced motion", "a plain 200ms crossfade both ways", [(0.15, "tap"), (0.235, "crossfade"), (0.40, "film page")]),
]
FW = 230
fh = int(FW * 1688 / 780)
LEFT = 320
ROWH = fh + 54
W = LEFT + 3 * (FW + 16) + 24
Hh = 110 + ROWH * len(CLIPS)
bg = (14, 14, 17); ink = (238, 230, 214); muted = (150, 146, 138); accent = (176, 42, 48)
im = Image.new("RGB", (W, Hh), bg)
d = ImageDraw.Draw(im)
d.text((24, 28), "b66 · Proposed motion · key frames", font=BOD, fill=ink)
d.rectangle([24, 76, 48, 78], fill=accent)
d.text((60, 68), "ease-out cubic-bezier(.2,.7,.2,1) · real components in a harness · 390x844 @2x", font=SANS, fill=muted)
y = 110
for clip, title, sub, keys in CLIPS:
    files = sorted(f for f in os.listdir(f"{H}/vid/{clip}") if f.endswith(".jpg"))
    d.text((24, y + 10), title, font=BODS, fill=ink)
    words, line, ly = sub.split(" "), "", y + 44
    for w in words:
        if d.textlength(line + " " + w, font=SANS) > LEFT - 48 and line:
            d.text((24, ly), line, font=SANS, fill=muted); ly += 20; line = w
        else:
            line = (line + " " + w).strip()
    d.text((24, ly), line, font=SANS, fill=muted)
    if d.textlength(title, font=BODS) > LEFT - 30:
        pass
    for k, (t, lab) in enumerate(keys):
        f = files[min(len(files) - 1, int(t * len(files)))]
        fr = Image.open(f"{H}/vid/{clip}/{f}").convert("RGB").resize((FW, fh), Image.LANCZOS)
        x = LEFT + k * (FW + 16)
        im.paste(fr, (x, y))
        d.rectangle([x, y, x + FW - 1, y + fh - 1], outline=(40, 40, 46))
        d.text((x, y + fh + 8), lab, font=SANS, fill=muted)
    y += ROWH
im.save(OUT, optimize=True)
print(OUT, im.size, os.path.getsize(OUT))
