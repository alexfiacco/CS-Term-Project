#!/usr/bin/env python3
# Builds /home/user/CS-Term-Project/mockups/journeys/simplify-social-v1.html
J = "/home/user/CS-Term-Project/mockups/journeys/"
L1 = "file://" + J + "lists-v1-img/"
L2 = "file://" + J + "lists-v2-img/"
FD = "file://" + J + "film-discussion-v1-img/"
BP = "file://" + J + "browse-popular-v1-img/"
PB = "file://" + J + "poster-badges-v1-img/"
SP = "file://" + J + "simplify-profile-v1-img/"
F = "file:///home/user/montage/assets/fonts/"

CSS = """
@font-face{font-family:BD;src:url(FFFBodoniModa-SemiBold.ttf)}
@font-face{font-family:NR;src:url(FFFNewsreader-Regular.woff);font-weight:400}
@font-face{font-family:NR;src:url(FFFNewsreader-SemiBold.woff);font-weight:600}
:root{--bg:#0b0b0d;--panel:#141417;--panel-2:#18181b;--line:#2a2a2e;--line-2:#3a3a3e;--ink:#efe8da;--muted:#a9a69e;--faint:#8a877f;
--accent-2:#8fb3d9;--select:#5a86bd;--tick:#c24c56;--shadow:#7a1220;--raised:#22262e;--ann:#f2c14e;--hair:rgba(239,232,218,.07)}
*{box-sizing:border-box}
body{margin:0;background:#050506;color:var(--ink);font-family:Inter,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
.part{padding:28px 28px 36px;width:max-content}
.part h1{font:600 30px/36px BD;margin:0 0 4px}
.part .lede{font:400 16px/23px Inter;color:var(--muted);margin:0 0 24px;max-width:1180px}
.row{display:flex;gap:28px;align-items:flex-start}
.col{width:390px}
.cap{margin:0 0 12px;min-height:166px}
.cap b{display:block;font:600 16px/21px Inter}
.cap .tag{display:inline-block;font:700 11px/1 Inter;letter-spacing:.12em;padding:5px 8px;border-radius:2px;margin-bottom:8px}
.tag.now{background:#2a2a2e;color:var(--muted)}.tag.pro{background:#1d3550;color:#cfe0f2}.tag.opt{background:#3a2f12;color:var(--ann)}
.cap span{display:block;font:400 14px/20px Inter;color:var(--muted);margin-top:4px}
.ph{width:390px;background:var(--bg);border:1px solid #26262a;border-radius:28px;overflow:hidden;position:relative}
.sb{height:50px;display:flex;align-items:center;justify-content:space-between;padding:0 30px 0 34px;font:600 16px Inter;position:relative;z-index:3}
.sb i{width:122px;height:34px;border-radius:20px;background:#000;position:absolute;left:134px;top:10px}
.sb .bat{width:26px;height:12px;border:1.5px solid var(--ink);border-radius:4px;opacity:.9}
.g{padding:0 16px}
.bd{font-family:BD;font-weight:600}
.nr{font-family:NR}
.mut{color:var(--muted)}.fnt{color:var(--faint)}.blu{color:var(--accent-2)}
.caps{font:600 11px/14px Inter;letter-spacing:.14em;text-transform:uppercase}
.circ{width:36px;height:36px;border-radius:50%;border:1px solid var(--line-2);display:grid;place-items:center;color:var(--ink);flex:none;background:rgba(11,11,13,.55)}
.av{border-radius:6px;display:grid;place-items:center;font:600 13px BD;color:#141416;flex:none}
.po{border-radius:2px;background:center/cover;flex:none;position:relative;outline:1px solid rgba(255,255,255,.08);outline-offset:-1px}
.stamp{position:absolute;left:4px;bottom:4px;height:22px;padding:0 6px;border-radius:2px;background:#0b0b0d;display:flex;align-items:baseline;gap:1px;line-height:22px;color:var(--accent-2)}
.stamp .n{font:600 16px/22px BD}.stamp .u{font:600 10px BD}
.stamp .s{font:600 15px/22px NR}.stamp .st{font:400 10px Inter}
.btn{height:44px;border-radius:999px;display:flex;align-items:center;justify-content:center;font:600 15px Inter;gap:6px}
.btn.cr{background:var(--ink);color:#111}.btn.ol{border:1px solid var(--line-2);color:var(--ink)}
.chip{display:inline-flex;align-items:center;height:32px;padding:0 12px;border-radius:999px;border:1px solid var(--line-2);font:600 13px Inter;margin:0 8px 8px 0;white-space:nowrap}
.chip em{font-style:normal;font-weight:400;color:var(--muted);margin-left:6px}
.tick{width:24px;height:3px;background:var(--tick);border-radius:1px}
.rule{height:1px;background:var(--line)}
/* annotations */
.an{position:absolute;z-index:20;pointer-events:none}
.vm{position:absolute;width:0;border-left:1.5px solid var(--ann);z-index:20}
.vm:before,.vm:after{content:"";position:absolute;left:-5px;width:9px;height:1.5px;background:var(--ann)}
.vm:before{top:0}.vm:after{bottom:0}
.vm b{position:absolute;left:6px;top:50%;transform:translateY(-50%);font:700 12px/1 Inter;color:#111;background:var(--ann);padding:3px 5px;border-radius:2px;white-space:nowrap}
.vm.l b{left:auto;right:6px}
.hm{position:absolute;height:0;border-top:1.5px solid var(--ann);z-index:20}
.hm:before,.hm:after{content:"";position:absolute;top:-5px;height:9px;width:1.5px;background:var(--ann)}
.hm:before{left:0}.hm:after{right:0}
.hm b{position:absolute;top:5px;left:50%;transform:translateX(-50%);font:700 12px/1 Inter;color:#111;background:var(--ann);padding:3px 5px;border-radius:2px;white-space:nowrap}
.note{font:600 12px/16px Inter;color:#111;background:var(--ann);padding:4px 7px;border-radius:2px;position:absolute;z-index:21;max-width:220px}
.box{position:absolute;border:1.5px dashed var(--ann);border-radius:6px;z-index:19}
.spec{background:#0f0f12;border:1px solid #26262a;border-radius:12px;padding:16px;font:400 13px/19px ui-monospace,Menlo,monospace;color:#d8d2c4;white-space:pre;margin-top:12px}
"""
CSS = CSS.replace("FFF", F)

def sb(over=False):
    return '<div class="sb"%s><span>9:41</span><i></i><span class="bat"></span></div>' % (' style="position:absolute;left:0;right:0;top:0"' if over else '')

def po(img, w, h=None, extra="", inner=""):
    h = h or round(w * 1.5)
    return f'<div class="po" style="width:{w}px;height:{h}px;background-image:url({img});{extra}">{inner}</div>'

def av(letter, size, tint=None, extra=""):
    tint = tint or {**TINT, "L":"#8fb3d9","N":"#b9a3c9","A":"#c9a58f","K":"#a3c4c9","R":"#c9c38f"}.get(letter,"#c3c6d6")
    return f'<span class="av" style="width:{size}px;height:{size}px;background:{tint};font-size:{round(size*.42)}px;{extra}">{letter}</span>'

TINT = {"E": "#c3c6d6", "S": "#d4b37c", "J": "#9fc0a8", "Y": "#8fb3d9"}

CHEV = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 6 6 6-6 6"/></svg>'
CHEVD = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>'
BACK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>'
X = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>'
HEART = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>'
HEARTF = HEART.replace('fill="none"', 'fill="#5a86bd"').replace('stroke="currentColor"', 'stroke="#5a86bd"')
MSG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>'
SEND = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>'
SHARE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8"/></svg>'
BOOK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg>'
PEN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'
SEARCH = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>'

def cap(tag, title, text):
    cls = {"CURRENT": "now", "PROPOSED": "pro"}.get(tag, "opt")
    return f'<p class="cap"><span class="tag {cls}">{tag}</span><b>{title}</b><span>{text}</span></p>'

# ---------------------------------------------------------------- PART 1 GROUPS
DESC = "Every Friday since 2023. We take turns picking; whoever lost the last vote brings snacks. Mostly crime, horror in October, and Sam keeps trying to sneak in three-hour Russian films."
WHY = "You all go for crime that takes its time: professionals at work, cities at night, endings that don't let anyone off. Emma and Jacob pull the group toward the procedural, Sam toward the bleak, and the films you agree on most are the ones where nobody is quite the hero."

def faces(size, n=4, overlap=-8):
    out = ""
    for i, l in enumerate(["E", "S", "J", "Y"][:n]):
        out += av(l, size, TINT[l], f"margin-left:{0 if i == 0 else overlap}px;border:1.5px solid var(--bg);z-index:{9-i};position:relative")
    return f'<span style="display:flex">{out}</span>'

def group_current():
    h = sb()
    h += f'''<div class="g" style="display:flex;align-items:center;gap:12px;margin-top:8px">
      <span class="circ">{BACK}</span>
      <span class="av" style="width:56px;height:56px;background:url({PB}se7en.jpg) center/cover;border-radius:12px"></span>
      <span class="bd" style="font-size:24px;line-height:28px;flex:1">Friday Film Club</span>
      <span style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">{faces(28)}<span style="font-size:13px" class="mut">4 members</span></span></div>
    <p class="g nr mut" style="font-size:16px;line-height:22px;margin:10px 0 0;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden">{DESC}</p>
    <div class="g mut" style="font:600 13px Inter;margin-top:5px">More</div>
    <div class="g" style="display:flex;gap:10px;margin-top:14px"><span class="btn ol" style="flex:1">Edit group</span><span class="btn ol" style="flex:1">Share</span></div>
    <div class="g" style="margin-top:16px"><div style="display:flex;gap:12px;align-items:center;padding:12px;border:1px solid var(--line-2);border-radius:12px;background:var(--panel)">
      {po(FD+"poster-tdk.jpg",44,66)}
      <div style="flex:1;min-width:0"><div class="caps blu">Next night · Up next</div><div class="bd" style="font-size:18px;margin-top:2px">The Dark Knight</div>
      <div style="font-size:11px"><b class="blu">91%</b> <span class="mut">for the group</span></div></div>
      <span class="btn cr" style="height:36px;padding:0 14px;font-size:13px">Start night</span></div></div>
    <div class="g" style="margin-top:12px"><div style="padding:12px;border:1px solid var(--line-2);border-radius:12px;background:var(--panel)">
      <div style="display:flex;justify-content:space-between;align-items:center"><span style="font:700 11px Inter;background:var(--select);padding:3px 7px;border-radius:999px">3 new</span><span class="mut" style="font:600 13px Inter">Open feed ›</span></div>
      <div style="font-size:13px;margin-top:8px"><b>Emma</b> friday: heat or zodiac??</div>
      <div style="font-size:13px;margin-top:4px"><b>Sam</b> rated Prisoners 4.5★</div>
      <div style="font-size:13px;margin-top:4px"><b>Jacob</b> added Heat to the watchlist</div></div></div>
    <div class="g" style="display:flex;gap:24px;margin-top:16px;border-bottom:1px solid var(--line);font:600 15px Inter"><span style="padding:10px 0;border-bottom:2px solid var(--ink)">Taste</span><span class="mut" style="padding:10px 0">Watch</span></div>
    <div class="g" style="margin-top:24px"><div class="caps mut">Your group is</div>
      <div class="bd" style="font-size:40px;line-height:46px;margin-top:6px">Hardboiled</div>
      <p class="nr" style="font-size:16px;line-height:24px;margin:12px 0 0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">{WHY}</p>
      <div class="mut" style="font:600 13px Inter;margin-top:5px">More</div>
      <div style="margin-top:16px"><span class="chip">Crime sagas<em>All 4</em></span><span class="chip">Neo-noir<em>3/4</em></span><span class="chip">Serial killer procedurals<em>3/4</em></span><span class="chip">Heist films<em>2/4</em></span><span class="chip">Slow-burn thrillers<em>2/4</em></span></div>
      <div style="margin-top:8px;font-size:13px;line-height:20px"><div class="mut" style="font-weight:600">Where you split</div><div class="blu" style="font:600 15px Inter;margin:4px 0">Body horror</div>
      <div><span class="blu">▲</span> <b>@emma</b> <span class="mut">rates it above their usual</span></div><div><span style="color:#e8737f">▼</span> <b>@sam</b> <span class="mut">rates it below theirs</span></div></div>
      <div style="margin-top:24px;display:flex;justify-content:space-between;align-items:baseline"><span class="caps mut">Our taste</span><span><span class="mut" style="font-size:11px">In sync </span><span class="bd blu" style="font-size:22px">72%</span></span></div>
      <div style="display:flex;gap:2px;height:8px;border-radius:999px;overflow:hidden;margin-top:12px"><i style="flex:38;background:#7a1220"></i><i style="flex:24;background:#5b8fc4"></i><i style="flex:18;background:#a9a69e"></i><i style="flex:20;background:#3a3a3e"></i></div>
      <div style="display:flex;flex-wrap:wrap;gap:4px 12px;margin-top:12px;font-size:13px" class="mut"><span>● Crime 38%</span><span>● Thriller 24%</span><span>● Drama 18%</span><span>● Others 20%</span></div>
      <div class="mut" style="font:600 13px Inter;margin-top:18px">Films that define us</div>
      <div style="display:flex;gap:8px;margin-top:12px">{po(L1+"heat.jpg",74)}{po(L2+"zodiac.jpg",74)}{po(L2+"prisoners.jpg",74)}{po(L1+"nocountry.jpg",74)}</div>
      <div class="bd" style="font-size:22px;margin-top:32px">Group Film DNA</div>
      <div style="height:150px;margin-top:12px;border-radius:12px;background:radial-gradient(circle at 50% 55%,rgba(91,143,196,.25),transparent 60%),repeating-radial-gradient(circle at 50% 55%,transparent 0 22px,#222 22px 23px)"></div>
      <div class="bd" style="font-size:22px;margin-top:32px">This week</div>
      <div class="mut" style="font-size:13px;margin-top:4px">6 films logged · Emma's on a Mann run</div>
      <div class="bd" style="font-size:22px;margin-top:32px">Superlatives</div>
      <div class="mut" style="font-size:13px;margin:4px 0 40px">Taste leader Emma · +3 more</div>
    </div>'''
    return h

def group_proposed():
    h = f'''<div style="position:relative;height:320px;background:url({SP}tdk.jpg) center 30%/cover">
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,11,13,.45) 0%,rgba(11,11,13,0) 28%,rgba(11,11,13,.2) 55%,#0b0b0d 100%)"></div>
      {sb(True)}
      <div style="position:absolute;top:56px;left:16px;right:16px;display:flex;justify-content:space-between"><span class="circ">{BACK}</span><span style="display:flex;gap:8px"><span class="circ">{SHARE}</span><span class="circ">{PEN}</span></span></div>
      <div style="position:absolute;left:16px;right:16px;bottom:12px;display:flex;align-items:flex-end;gap:12px">
        <span class="av" style="width:56px;height:56px;background:url({PB}se7en.jpg) center/cover;border-radius:12px;border:1.5px solid rgba(239,232,218,.5)"></span>
        <div style="flex:1"><div class="bd" style="font-size:30px;line-height:34px">Friday Film Club</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:6px">{faces(24)}<span class="mut" style="font-size:13px">4 members</span></div></div></div>
    </div>
    <p class="g nr mut" style="font-size:16px;line-height:22px;margin:4px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Every Friday since 2023. We take turns picking…</p>
    <div class="g" style="margin-top:16px"><div style="display:flex;gap:16px;padding:12px;border:1px solid var(--line-2);border-radius:12px;background:var(--panel)">
      {po(FD+"poster-tdk.jpg",88,132)}
      <div style="flex:1;display:flex;flex-direction:column"><div class="caps blu">Up next · Friday</div>
      <div class="bd" style="font-size:22px;line-height:26px;margin-top:6px">The Dark Knight</div>
      <div style="margin-top:6px"><span class="bd blu" style="font-size:22px">91<small style="font-size:13px">%</small></span> <span class="mut" style="font-size:13px">for the group</span></div>
      <span class="btn cr" style="margin-top:auto;height:44px">Start night</span></div></div></div>
    <div class="g" style="margin-top:12px"><div style="display:flex;align-items:center;gap:12px;height:56px;padding:0 12px;border:1px solid var(--line-2);border-radius:12px">
      {av("E",28,TINT["E"])}<span style="flex:1;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><b>Emma</b> <span class="mut">friday: heat or zodiac??</span></span>
      <span style="font:700 11px Inter;background:var(--select);padding:3px 7px;border-radius:999px">3 new</span></div></div>
    <div class="g" style="display:flex;gap:24px;margin-top:16px;border-bottom:1px solid var(--line);font:600 15px Inter"><span style="padding:10px 0;border-bottom:2px solid var(--ink)">Taste</span><span class="mut" style="padding:10px 0">Watch</span></div>
    <div class="g" style="margin-top:24px"><div class="caps mut">Your group is</div>
      <div class="bd" style="font-size:40px;line-height:46px;margin-top:6px">Hardboiled</div><div class="tick" style="margin-top:6px"></div>
      <p class="nr" style="font-size:16px;line-height:24px;margin:12px 0 0">You all go for crime that takes its time. <span class="mut" style="font:400 13px Inter">Read more ›</span></p>
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:24px"><span class="bd" style="font-size:18px">Films that define us</span><span class="mut" style="font-size:13px">All 4 rated 4★+</span></div>
      <div style="display:flex;gap:12px;margin-top:12px">{po(L1+"heat.jpg",106,159,inner='<span class="stamp"><span class="s">4.6</span><span class="st">★</span></span>')}{po(L2+"zodiac.jpg",106,159,inner='<span class="stamp"><span class="s">4.5</span><span class="st">★</span></span>')}{po(L2+"prisoners.jpg",106,159,inner='<span class="stamp"><span class="s">4.4</span><span class="st">★</span></span>')}</div>
      <div style="margin-top:16px"><span class="chip">Crime sagas<em>All 4</em></span><span class="chip">Neo-noir<em>3/4</em></span><span class="chip mut" style="border-style:dashed">+3 lanes</span></div>
      <div style="display:flex;align-items:center;gap:12px;margin-top:8px;padding:12px;border:1px solid var(--line-2);border-radius:12px">
        <div style="flex:1"><div class="mut" style="font-size:13px">You split on</div><div class="blu" style="font:600 15px Inter;margin-top:2px">Body horror</div></div>
        <span style="display:flex;align-items:center;gap:6px;font-size:13px">{av("E",24,TINT["E"])}<span class="blu">▲</span></span>
        <span style="display:flex;align-items:center;gap:6px;font-size:13px">{av("S",24,TINT["S"])}<span style="color:#e8737f">▼</span></span><span class="fnt">{CHEV}</span></div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:24px"><span class="bd" style="font-size:18px">Our taste</span><span><span class="mut" style="font-size:13px">In sync </span><span class="bd blu" style="font-size:22px">72<small style="font-size:13px">%</small></span></span></div>
      <div style="display:flex;gap:2px;height:8px;border-radius:999px;overflow:hidden;margin-top:12px"><i style="flex:38;background:#7a1220"></i><i style="flex:24;background:#5b8fc4"></i><i style="flex:18;background:#a9a69e"></i><i style="flex:20;background:#3a3a3e"></i></div>
      <div class="mut" style="font-size:13px;margin-top:8px">Crime 38% · Thriller 24% · Drama 18%</div>
    </div>
    <div style="margin-top:24px">'''
    for t, sub, extra in [("This week", "6 films logged", f'<span style="display:flex;gap:4px">{po(L1+"heat.jpg",24,36)}{po(L2+"zodiac.jpg",24,36)}{po(L1+"drive.jpg",24,36)}</span>'),
                          ("Superlatives", "Taste leader: Emma", av("E", 28, TINT["E"])),
                          ("Group Film DNA", "Nine strands, averaged", '')]:
        h += f'''<div class="g" style="display:flex;align-items:center;gap:12px;height:64px;border-top:1px solid var(--line)"><div style="flex:1"><div class="bd" style="font-size:18px">{t}</div><div class="mut" style="font-size:13px;margin-top:2px">{sub}</div></div>{extra}<span class="fnt">{CHEV}</span></div>'''
    h += '<div style="height:32px"></div></div>'
    return h

def summary_frame():
    h = sb()
    h += f'''<div class="g" style="margin-top:8px"><div class="caps mut">Closed</div>
      <div style="position:relative;margin-top:12px">
        <div class="bd" style="font-size:40px;line-height:46px">Hardboiled</div><div class="tick" style="margin-top:6px"></div>
        <div style="position:relative;margin-top:12px"><p class="nr" style="font-size:16px;line-height:24px;margin:0">You all go for crime that takes its time. <span class="mut" style="font:400 13px Inter">Read more ›</span></p>
        <span class="box" style="inset:-6px -8px"></span></div>
      </div>
      <div class="note" style="position:relative;margin-top:14px;display:inline-block">The whole paragraph is the button, not only "Read more"</div>
      <div class="caps mut" style="margin-top:32px">After a tap anywhere on it</div>
      <div style="position:relative;margin-top:12px"><p class="nr" style="font-size:16px;line-height:24px;margin:0">{WHY} <span class="mut" style="font:400 13px Inter">Less</span></p><span class="box" style="inset:-6px -8px"></span></div>
      <div class="note" style="position:relative;margin-top:14px;display:inline-block">A second tap anywhere folds it back. Links inside (a lane, a name) keep their own tap.</div>
      <div class="caps mut" style="margin-top:32px">Same for the description</div>
      <p class="nr mut" style="font-size:16px;line-height:22px;margin:12px 0 32px;position:relative">Every Friday since 2023. We take turns picking… <span style="font:400 13px Inter">More</span><span class="box" style="inset:-6px -8px"></span></p>
    </div>'''
    return h

# ---------------------------------------------------------------- PART 2 LATELY
POSTS = [
    dict(l="E", name="Emma", verb="rated", title="Aftersun", meta='1d · you gave it <b style="color:var(--ink)">4.5★</b>', take="The last dance scene wrecked me. Watch it with someone you love.", img=L1+"aftersun.jpg", stamp="4", hearts=1, liked=True, com=2),
    dict(l="S", name="Sam", verb="watched", title="Past Lives", meta='2d · <b class="blu">81%</b> for you', take=None, img=L1+"pastlives.jpg", stamp=None, hearts=0, liked=False, com=0),
    dict(l="J", name="Jacob", verb="rated", title="Prisoners", meta='3d · <b class="blu">88%</b> for you', take="Jake Gyllenhaal blinking is a whole performance.", img=L2+"prisoners.jpg", stamp="4.5", hearts=3, liked=False, com=1),
    dict(l="E", name="Emma", verb="rated", title="Heat", meta='4d · you gave it <b style="color:var(--ink)">5★</b>', take=None, img=L1+"heat.jpg", stamp="5", hearts=0, liked=False, com=0),
]

def actions(p, tight):
    pad = 13 if tight else 12
    ov = -10 if tight else 0
    items = []
    hh = HEARTF if p["liked"] else HEART
    items.append(f'<span style="display:inline-flex;align-items:center;gap:{4 if tight else 5}px;height:44px;min-width:44px;padding:0 {pad}px;justify-content:center;color:{"var(--select)" if p["liked"] else "var(--muted)"}">{hh}{"<span>%d</span>" % p["hearts"] if p["hearts"] else ""}</span>')
    items.append(f'<span style="display:inline-flex;align-items:center;gap:{4 if tight else 5}px;height:44px;min-width:44px;padding:0 {pad}px;justify-content:center;margin-left:{ov}px" class="mut">{MSG}{"<span>%d</span>" % p["com"] if p["com"] else ""}</span>')
    items.append(f'<span style="display:inline-flex;align-items:center;height:44px;min-width:44px;padding:0 {pad}px;justify-content:center;margin-left:{ov}px" class="mut">{SEND}</span>')
    return f'<div style="display:flex;align-items:center;margin-left:-{pad}px;font:500 13px Inter;margin-top:2px">{"".join(items)}</div>'

def post(p, tight):
    stamp = f'<span class="stamp" style="left:auto;right:-6px;bottom:-9px;border:1px solid var(--line-2)"><span class="s">{p["stamp"]}</span><span class="st">★</span></span>' if p["stamp"] else ""
    take = f'<p class="nr" style="font-size:16px;line-height:22px;margin:7px 0 0">{p["take"]}</p>' if p["take"] else ""
    return f'''<div style="display:flex;gap:12px;align-items:flex-start">{av(p["l"],40,TINT[p["l"]])}
      <div style="flex:1;min-width:0;padding-top:1px"><div style="font-size:15px" class="mut"><b style="color:var(--ink)">{p["name"]}</b> {p["verb"]}</div>
      <div class="bd" style="font-size:18px;line-height:23px">{p["title"]}</div>
      <div class="fnt" style="font-size:13px;margin-top:3px">{p["meta"]}</div>{take}{actions(p, tight)}</div>
      <div style="padding-top:2px">{po(p["img"],56,84,inner=stamp)}</div></div>'''

def lately(tight, hair, ask=False):
    h = sb()
    h += f'''<div class="g" style="display:flex;justify-content:space-between;align-items:center;margin-top:4px"><span class="bd" style="font-size:30px">Social</span><span class="circ" style="border:0">{SEARCH}</span></div>
    <div class="g" style="display:flex;gap:16px;margin-top:16px">'''
    for l, n, pct in [("E", "Emma", 84), ("S", "Sam", 71), ("J", "Jacob", 77)]:
        h += f'<div style="width:64px;text-align:center">{av(l,58,TINT[l],"margin:0 auto")}<div class="bd blu" style="font-size:15px;margin-top:6px">{pct}<small style="font-size:11px">%</small></div><div class="mut" style="font-size:13px;margin-top:4px">{n}</div></div>'
    h += '</div><div class="rule" style="margin-top:24px"></div>'
    h += '<div class="g" style="display:flex;justify-content:space-between;align-items:baseline;margin-top:16px"><span class="bd" style="font-size:22px">Lately</span><span class="mut" style="font-size:13px">from your people</span></div>'
    if ask:
        h += f'''<div class="g" style="margin-top:12px"><div style="display:flex;align-items:center;gap:12px;height:52px;padding:0 8px 0 12px;border:1px solid var(--line-2);border-radius:12px">{av("Y",28,TINT["Y"])}<span class="mut" style="flex:1;font-size:15px">Ask your people for a rec</span><span class="btn cr" style="height:36px;padding:0 14px;font-size:13px">Ask</span></div></div>'''
    h += '<div class="g" style="margin-top:16px">'
    for i, p in enumerate(POSTS if not ask else POSTS[:1]):
        if i:
            if hair:
                h += '<div style="height:1px;background:var(--hair);margin:16px 0 16px 52px"></div>'
            else:
                h += '<div style="height:16px"></div>'
        h += post(p, tight)
    h += '<div style="height:28px"></div></div>'
    return h

def action_spec():
    def row(tight, label):
        p = dict(hearts=1, liked=True, com=2)
        return f'''<div style="position:relative;margin-top:12px;height:96px"><div style="transform:scale(2);transform-origin:0 0;position:absolute;left:28px;top:4px">{actions(p, tight)}</div></div>'''
    h = sb()
    h += '<div class="g" style="margin-top:4px"><div class="caps mut">Action row at 2× · Current</div></div>'
    h += '<div style="position:relative">' + row(False, "") + '''
      <span class="hm" style="left:88px;top:96px;width:48px"><b>24</b></span>
      <span class="hm" style="left:198px;top:96px;width:50px"><b>25</b></span>
    </div>'''
    h += '''<div class="g" style="margin-top:44px;font-size:14px;line-height:20px" class="mut"><span class="mut">Each button: 12 padding each side, 44 min width, buttons touching. So 24 to 26pt of air between icons, depending on counts. Heart to plane, with counts: 128pt. The owner's ~100 is the whole row, not each gap.</span></div>'''
    h += '<div class="g" style="margin-top:28px"><div class="caps mut">Proposed</div></div>'
    h += '<div style="position:relative">' + row(True, "") + '''
      <span class="hm" style="left:87px;top:96px;width:32px"><b>16</b></span>
      <span class="hm" style="left:178px;top:96px;width:33px"><b>16</b></span>
    </div>'''
    h += '''<div class="g" style="margin-top:44px"><span class="mut" style="font-size:14px;line-height:20px">16pt between every glyph (or count) and the next glyph. Each target is still 44 tall and 44 wide; neighbours overlap by 10, split down the middle, so a tap goes to the nearest icon. Heart to plane: 110pt (was 128).</span>
<div class="spec">iPhone  SocialScreen.postActions
  HStack(spacing: -10)
  label .padding(.horizontal, 13)
        .frame(minWidth: 44,
               minHeight: 44)
  count spacing 5 -> 4
  row .padding(.leading, -13)

web  globals.css .lf-act / .lf-a
  .lf-act { margin-left: -13px }
  .lf-a { padding: 0 13px; gap: 4px }
  .lf-a + .lf-a { margin-left: -10px }</div><div style="height:24px"></div></div>'''
    return h

# ---------------------------------------------------------------- PART 3 TOOLTIPS
def tip(text, left, top, w, caret_x, below=True):
    # bubble with caret; caret_x relative to bubble left
    caret = f'<span style="position:absolute;left:{caret_x-7}px;{"top:-7px" if below else "bottom:-7px"};width:14px;height:14px;background:var(--raised);transform:rotate(45deg);border-{"left" if below else "right"}:1px solid #3a4150;border-{"top" if below else "bottom"}:1px solid #3a4150"></span>'
    return f'''<div style="position:absolute;left:{left}px;top:{top}px;width:{w}px;background:var(--raised);border:1px solid #3a4150;border-radius:12px;padding:12px 16px;font:400 15px/21px Inter;color:var(--ink);box-shadow:0 12px 32px -8px rgba(0,0,0,.8);z-index:15">{caret}{text}</div>'''

def ring(left, top, w, h, r=999):
    return f'<span style="position:absolute;left:{left}px;top:{top}px;width:{w}px;height:{h}px;border-radius:{r}px;box-shadow:0 0 0 1.5px rgba(143,179,217,.75),0 0 0 6px rgba(90,134,189,.18);z-index:14"></span>'

def tip_spec():
    h = sb()
    h += '<div class="g" style="margin-top:8px"><div class="caps mut">The pattern</div>'
    h += '<div style="position:relative;height:150px;margin-top:16px">'
    h += f'<div style="position:absolute;left:0;top:0">{av("E",40,TINT["E"])}</div><span class="mut" style="position:absolute;left:52px;top:11px">{HEART}</span><span class="mut" style="position:absolute;left:86px;top:11px">{MSG}</span><span style="position:absolute;left:120px;top:11px">{SEND}</span>'
    h += ring(113, 4, 32, 32)
    h += tip("Send this film to a friend on Montage.", 0, 56, 270, 129)
    h += '</div>'
    rows = [("Bubble", "raised #22262e, 1px edge, radius 12, 12 / 16 padding"), ("Text", "UI 15 on 21, one sentence, at most 2 lines, no title"),
            ("Pointer", "a 14 caret on the thing, which gets a soft blue ring"), ("Close", "any tap closes it; the tap still does its job"),
            ("Once", "one tip per screen visit, once ever per account"), ("Never", "on a screen still loading, or over a drawer")]
    for k, v in rows:
        h += f'<div style="display:flex;gap:12px;padding:10px 0;border-top:1px solid var(--line);font-size:14px;line-height:19px"><b style="width:68px;flex:none">{k}</b><span class="mut">{v}</span></div>'
    h += '<div class="caps mut" style="margin-top:24px">The five, in the order someone meets them</div>'
    tips = [("1", "Match stamp on a poster", "91% is how well it fits your taste. Stars are what you rated."),
            ("2", "Bookmark on a film", "Save it for later. It goes on your Watchlist."),
            ("3", "Your people %", "Your Blend: how alike your ratings are."),
            ("4", "Paper plane on a Lately post", "Send this film to a friend on Montage."),
            ("5", "Hold a Lately post", "Hold a post to react to it.")]
    for n, where, txt in tips:
        h += f'<div style="display:flex;gap:12px;padding:12px 0;border-top:1px solid var(--line)"><span class="bd blu" style="font-size:18px;width:16px">{n}</span><div><b style="font-size:14px">{where}</b><div class="mut" style="font-size:14px;line-height:19px;margin-top:2px">"{txt}"</div></div></div>'
    h += '<div style="height:16px"></div></div>'
    return h

def tip_people():
    h = sb()
    h += f'''<div class="g" style="display:flex;justify-content:space-between;align-items:center;margin-top:4px"><span class="bd" style="font-size:30px">Social</span><span class="circ" style="border:0">{SEARCH}</span></div>
    <div class="g" style="display:flex;justify-content:space-between;align-items:baseline;margin-top:16px"><span class="bd" style="font-size:22px">Your people</span><span class="mut" style="font-size:13px">See all 9</span></div>
    <div class="g" style="display:flex;gap:16px;margin-top:12px;position:relative">'''
    for l, n, pct in [("E", "Emma", 84), ("S", "Sam", 71), ("J", "Jacob", 77), ("L", "Lee", 63)]:
        h += f'<div style="width:64px;text-align:center">{av(l,58,None,"margin:0 auto")}<div class="bd blu" style="font-size:15px;margin-top:6px">{pct}<small style="font-size:11px">%</small></div><div class="mut" style="font-size:13px;margin-top:4px">{n}</div></div>'
    h += ring(26, 62, 44, 24, 6)
    h += tip("Your Blend with each person: how alike your ratings are.", 16, 120, 300, 32)
    h += '</div>'
    h += f'''<div class="g" style="margin-top:96px;opacity:.4"><div class="bd" style="font-size:22px">Lately</div><div style="margin-top:16px">{post(POSTS[2], True)}</div><div style="height:24px"></div></div>'''
    return h

def tip_lately():
    h = lately(True, True)
    # overlay tip on first post plane
    h = f'<div style="position:relative">{h}' + ring(150, 434, 32, 32) + tip("Send this film to a friend on Montage.", 40, 476, 300, 126) + '</div>'
    return h

def tip_grid():
    h = sb()
    h += '<div class="g" style="margin-top:4px"><span class="bd" style="font-size:30px">Picks</span><div style="display:flex;gap:8px;margin-top:12px"><span class="chip" style="background:var(--ink);color:#111;border-color:var(--ink)">For you</span><span class="chip">Tonight</span><span class="chip">Lanes</span></div></div>'
    imgs = [("parasite", "91", None), ("drive", None, "4.5"), ("arrival", "88", None), ("oldboy", "84", None), ("ladybird", None, "4"), ("se7en", "79", None), ("pastlives", "82", None), ("socialnet", "77", None), ("midsommar", "74", None)]
    h += '<div class="g" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px;position:relative">'
    for nm, m, s in imgs:
        st = f'<span class="stamp"><span class="n">{m}</span><span class="u">%</span></span>' if m else f'<span class="stamp"><span class="s">{s}</span><span class="st">★</span></span>'
        h += f'<div class="po" style="width:auto;aspect-ratio:2/3;background-image:url({PB}{nm}.jpg)">{st}</div>'
    h += ring(18, 144, 50, 26, 4)
    h += tip("91% is how well it fits your taste. Stars are what you rated.", 16, 184, 300, 26)
    h += '</div><div style="height:24px"></div>'
    return h

def tip_film():
    h = f'''<div style="position:relative;height:250px;background:url({SP}parasite.jpg) center/cover"><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,11,13,.4),rgba(11,11,13,0) 30%,#0b0b0d)"></div>{sb(True)}
      <span class="circ" style="position:absolute;left:16px;top:56px">{BACK}</span></div>
    <div class="g" style="display:flex;gap:16px;margin-top:-56px;position:relative">{po(PB+"parasite.jpg",96)}
      <div style="padding-top:60px"><div class="bd" style="font-size:28px;line-height:32px">Parasite</div><div class="mut" style="font-size:13px;margin-top:4px">2019 · Bong Joon Ho</div></div></div>
    <div class="g" style="display:flex;gap:8px;margin-top:16px;position:relative">
      <span class="btn cr" style="flex:1">Rate</span><span class="btn ol" style="width:52px">{BOOK}</span><span class="btn ol" style="width:52px">{SEND}</span><span class="btn ol" style="width:52px">{SHARE}</span>'''
    h += ring(202, 0, 52, 44)
    h += tip("Save it for later. It goes on your Watchlist.", 72, 58, 270, 156)
    h += f'''</div><div class="g" style="margin-top:96px;opacity:.5"><div class="caps mut">Your match</div><div class="bd blu" style="font-size:40px">91<small style="font-size:19px">%</small></div>
      <p class="nr" style="font-size:16px;line-height:24px">A class war that plays like a heist, then turns. Right in the middle of what you rate highest.</p></div><div style="height:24px"></div>'''
    return h

# ---------------------------------------------------------------- PART 4 DRAWERS
GREAD = "You rated it a notch under what we read. The destruction scenes land the way Minus One's did for you, but you tend to mark down a sequel that repeats the first film's beats, and the middle hour here does exactly that. The ending earns back most of it."

def page_behind():
    return f'''<div style="position:absolute;inset:0;background:url({BP}godzilla.jpg) center 20%/cover;filter:brightness(.35) blur(1px)"></div><div style="position:absolute;inset:0;background:rgba(0,0,0,.55)"></div>{sb(True)}'''

def why_head(proposed):
    return f'''<div style="display:flex;gap:12px;align-items:flex-start">{po(BP+"godzilla.jpg",46,69)}
      <div style="flex:1;min-width:0"><div class="bd" style="font-size:22px;line-height:28px;min-height:36px;display:flex;align-items:center;white-space:nowrap">Godzilla Minus Zero</div>
      <div class="mut" style="font-size:13px;line-height:18px;margin-top:{4 if proposed else 4}px">2026 · Takashi Yamazaki</div><div class="tick" style="margin-top:{8 if proposed else 3}px"></div></div>
      <span class="circ" style="background:var(--panel-2)">{X}</span></div>'''

def strip_row():
    return f'''<div style="display:flex;align-items:center;gap:14px"><span class="bd blu" style="font-size:40px;line-height:44px">3.5<small style="font-size:19px">★</small></span>
      <div style="flex:1"><div class="bd" style="font-size:18px">Our read</div><div class="mut" style="font-size:13px;margin-top:3px">We predicted 74% · Close</div></div>
      <span class="mut" style="display:flex;align-items:center;gap:4px;font:600 13px Inter">{SHARE.replace('18','14')}Share</span></div>'''

def drawer_current():
    top = 360
    h = page_behind()
    h += f'''<div style="position:absolute;left:0;right:0;top:{top}px;bottom:0;background:var(--panel);border-top:1px solid var(--line-2);border-radius:22px 22px 0 0">
      <div style="width:40px;height:5px;border-radius:3px;background:var(--line-2);margin:8px auto 0"></div>
      <div style="padding:20px 16px 0">{why_head(False)}
        <div style="margin-top:16px;padding:12px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)">{strip_row()}</div>
        <p class="nr" style="font-size:16px;line-height:26px;margin:16px 0 0;color:rgba(239,232,218,.92)">{GREAD}</p></div></div>'''
    # annotations: grabber bottom = top+13, poster top = top+33
    a = top
    h += f'<span class="vm l" style="left:300px;top:{a+13}px;height:20px"><b>20</b></span>'
    h += f'<span class="vm l" style="left:300px;top:{a+102}px;height:16px"><b>16</b></span>'
    h += f'<span class="vm l" style="left:300px;top:{a+119}px;height:12px"><b>12</b></span>'
    h += f'<span class="vm l" style="left:300px;top:{a+175}px;height:12px"><b>12</b></span>'
    h += f'<span class="vm l" style="left:300px;top:{a+188}px;height:16px"><b>16</b></span>'
    h += f'<div class="note" style="left:200px;top:{a-140}px">Grab bar 40×5 at 8, then 4 + the drawer\'s own top 16 (WhySheet). Other drawers use 12 (DrawerHeader.top): two values today.</div>'
    return f'<div style="position:relative;height:844px">{h}</div>'

def drawer_proposed():
    top = 360
    h = page_behind()
    h += f'''<div style="position:absolute;left:0;right:0;top:{top}px;bottom:0;background:var(--panel);border-top:1px solid var(--line-2);border-radius:22px 22px 0 0">
      <div style="width:36px;height:4px;border-radius:2px;background:var(--line-2);margin:8px auto 0"></div>
      <div style="padding:16px 16px 0">{why_head(True)}
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--line)">{strip_row()}</div>
        <p class="nr" style="font-size:16px;line-height:26px;margin:16px 0 0;color:rgba(239,232,218,.92)">{GREAD}</p></div></div>'''
    a = top
    h += f'<span class="vm l" style="left:300px;top:{a+12}px;height:16px"><b>16</b></span>'
    h += f'<span class="vm l" style="left:300px;top:{a+97}px;height:16px"><b>16</b></span>'
    h += f'<span class="vm l" style="left:300px;top:{a+114}px;height:16px"><b>16</b></span>'
    h += f'<span class="vm l" style="left:300px;top:{a+174}px;height:16px"><b>16</b></span>'
    h += f'<div class="note" style="left:200px;top:{a-140}px">One gap, 16, from the grab bar down to the read. Grab bar 36×4 at 8 on both platforms. The rule under Our read goes.</div>'
    return f'<div style="position:relative;height:844px">{h}</div>'

def scrolled(strip):
    top = 68
    h = page_behind()
    bg = f'<div style="position:absolute;left:0;right:0;top:0;height:76px;background:url({BP}godzilla.jpg) center 22%/cover;opacity:.5;filter:saturate(.8)"></div><div style="position:absolute;left:0;right:0;top:0;height:76px;background:linear-gradient(180deg,rgba(20,20,23,.2),var(--panel))"></div>' if strip else ""
    h += f'''<div style="position:absolute;left:0;right:0;top:{top}px;bottom:0;background:var(--panel);border-top:1px solid var(--line-2);border-radius:22px 22px 0 0;overflow:hidden">
      <div style="position:absolute;left:0;right:0;top:0;z-index:4;background:var(--panel)">{bg}
        <div style="position:relative;width:36px;height:4px;border-radius:2px;background:{'rgba(239,232,218,.45)' if strip else 'var(--line-2)'};margin:8px auto 0"></div>
        <div style="position:relative;display:flex;align-items:center;gap:12px;height:44px;padding:0 16px;margin-top:8px">{po(BP+"godzilla.jpg",24,36)}<span class="bd" style="flex:1;font-size:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Godzilla Minus Zero</span><span class="circ" style="background:var(--panel-2)">{X}</span></div>
        <div style="position:relative;height:8px"></div><div class="rule" style="position:relative"></div></div>
      <div style="padding:52px 16px 0;margin-top:0">
        <p class="nr" style="font-size:16px;line-height:26px;margin:16px 0 0;color:rgba(239,232,218,.92)">…the middle hour here does exactly that. The ending earns back most of it.</p>
        <div style="margin-top:16px;padding:12px 14px;border:1px solid var(--line-2);border-radius:12px;display:flex;align-items:center;gap:10px"><div style="flex:1"><b style="font-size:15px">What we said before</b><div class="mut" style="font-size:13px;margin-top:2px">Close</div></div><span class="bd blu" style="font-size:18px">74%</span><span class="fnt">{CHEV}</span></div>
        <div style="display:flex;justify-content:space-between;margin-top:24px"><span class="caps mut">Because you enjoyed</span><span class="mut" style="font-size:13px">4 films</span></div>
        <div style="display:flex;gap:8px;margin-top:8px">{po(SP.replace("simplify-profile-v1-img/","lists-v1-img/")+"jurassic.jpg",64)}{po(L1+"akira.jpg",64)}{po(L1+"bladerunner.jpg",64)}{po(L1+"br2049.jpg",64)}</div>
        <div style="margin-top:24px" class="caps mut">More like this</div>
        <div style="display:flex;gap:8px;margin-top:8px">{po(L1+"space2001.jpg",104)}{po(L1+"stalker.jpg",104)}{po(L1+"arrival.jpg",104)}</div>
      </div></div>'''
    return f'<div style="position:relative;height:844px">{h}</div>'

def list_scrolled():
    top = 68
    h = f'<div style="position:absolute;inset:0;background:#08080a"></div>{sb(True)}'
    rows = ""
    for l, n, sub, pct in [("J", "Jacob", "@jacob · 212 rated", 77), ("L", "Lee", "@lee · 98 rated", 63), ("E", "Emma", "@emma · 340 rated", 84), ("S", "Sam", "@sam · 175 rated", 71), ("U", "Jules", "@jules · 61 rated", 58), ("N", "Noor", "@noor · 133 rated", 69), ("A", "Ari", "@ari · 44 rated", 66), ("K", "Kit", "@kit · 290 rated", 74), ("R", "Rae", "@rae · 120 rated", 61)]:
        rows += f'<div style="display:flex;align-items:center;gap:12px;height:64px">{av("J" if l=="U" else l,44,TINT.get(l))}<div style="flex:1"><b style="font-size:15px">{n}</b><div class="mut" style="font-size:13px;margin-top:2px">{sub}</div></div><span class="bd blu" style="font-size:18px">{pct}<small style="font-size:11px">%</small></span></div>'
    h += f'''<div style="position:absolute;left:0;right:0;top:{top}px;bottom:0;background:var(--panel);border-top:1px solid var(--line-2);border-radius:22px 22px 0 0;overflow:hidden">
      <div style="position:absolute;left:0;right:0;top:0;z-index:4;background:var(--panel)">
        <div style="width:36px;height:4px;border-radius:2px;background:var(--line-2);margin:8px auto 0"></div>
        <div style="display:flex;align-items:center;gap:8px;height:44px;padding:0 16px;margin-top:8px"><span class="bd" style="font-size:18px">Your people</span><span class="mut" style="font-size:13px;flex:1">· 24</span><span class="circ" style="background:var(--panel-2)">{X}</span></div>
        <div style="height:8px"></div><div class="rule"></div></div>
      <div style="padding:72px 16px 0">{rows}</div></div>'''
    return f'<div style="position:relative;height:844px">{h}</div>'


TL = "file://" + J + "tier-list-v1-img/"
def ranked(hair):
    h = sb()
    h += f'''<div class="g" style="display:flex;justify-content:space-between;margin-top:4px"><span class="circ">{BACK}</span><span class="circ">{SHARE}</span></div>
    <div class="g" style="margin-top:16px"><div class="bd" style="font-size:30px;line-height:34px">Nolan, ranked</div><div class="mut" style="font-size:13px;margin-top:6px">Ranked list · 12 films · by @jacob</div></div>
    <div class="g" style="margin-top:12px">'''
    films = [("1","darkknight","The Dark Knight","2008 · Christopher Nolan","The bank job alone.","91"),("2","prestige","The Prestige","2006 · Christopher Nolan","Are you watching closely?","88"),
             ("3","interstellar","Interstellar","2014 · Christopher Nolan",None,"4.5"),("4","memento","Memento","2000 · Christopher Nolan","Backwards and still airtight.","84"),("5","oppenheimer","Oppenheimer","2023 · Christopher Nolan",None,"4"),("6","inception","Inception","2010 · Christopher Nolan",None,"86")]
    for i,(n,img,t,m,note,st) in enumerate(films):
        if i and hair: h += '<div style="height:1px;background:var(--hair);margin-left:116px"></div>'
        stamp = f'<span class="stamp"><span class="s">{st}</span><span class="st">★</span></span>' if "." in st or len(st)==1 else f'<span class="stamp"><span class="n">{st}</span><span class="u">%</span></span>'
        nt = f'<p class="nr" style="font-size:16px;line-height:22px;margin:4px 0 0">{note}</p>' if note else ""
        h += f'''<div style="display:flex;gap:12px;padding:12px 0"><span class="nr" style="font-size:28px;width:28px;line-height:32px">{n}</span>{po(TL+img+".jpg",64,96,inner=stamp)}<div style="flex:1"><div class="bd" style="font-size:22px;line-height:27px">{t}</div><div class="mut" style="font-size:13px;margin-top:2px">{m}</div>{nt}</div></div>'''
    h += '<div style="height:16px"></div></div>'
    if hair:
        h = f'<div style="position:relative">{h}<span class="hm" style="left:16px;top:340px;width:116px"><b>116</b></span></div>'
    return h

def token_frame():
    h = sb()
    h += '''<div class="g" style="margin-top:8px"><div class="caps mut">One token, every film list</div>
<div class="spec">web   app/globals.css
  --rule-faint: color-mix(in srgb,
    var(--ink) 7%, transparent);
  /* about #1a1a1b on --bg */
  .row-hair + .row-hair {
    border-top: 1px solid
      var(--rule-faint);
    margin-left: var(--row-inset) }

iPhone  Design/Theme.swift
  Theme.ruleFaint = ink.opacity(0.07)
  RowHair(inset:)
    height 1 / displayScale
  the row keeps its own padding;
  the hair sits between rows, never
  above the first or under the last</div>
<div class="caps mut" style="margin-top:24px">Where it goes</div>'''
    for w, ins in [("Lately posts", "52 (40 face + 12)"), ("List page, ranked / list view", "116 (28 no. + 12 + 64 + 12)"), ("List page, unranked list view", "76 (64 + 12)"), ("Watchlist and library rows", "the thumb + 12"), ("Search results rows", "the thumb + 12"), ("Activity rows with a film", "52")]:
        h += f'<div style="display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid var(--line);font-size:14px"><b>{w}</b><span class="mut" style="text-align:right">{ins}</span></div>'
    h += '''<div class="caps mut" style="margin-top:24px">Never</div><p class="mut" style="font-size:14px;line-height:20px;margin:8px 0 0">Poster grids, carousels, cards, drawers' short lists (under 5 rows), chat. A grid's gaps already part its items; a hairline there is the needless divider the house rule means.</p>
<div class="caps mut" style="margin-top:24px">Why these are not needless</div><p class="mut" style="font-size:14px;line-height:20px;margin:8px 0 24px">A row of text beside a thumb has ragged edges: a two-line note, a one-line title, a take of three lines. Spacing alone makes the eye guess where one film ends; at 7% the line answers that without being seen as a line.</p></div>'''
    return h

def phone(inner, height=None):
    st = f' style="height:{height}px"' if height else ""
    return f'<div class="ph"{st}>{inner}</div>'

def col(capt, inner, height=None):
    return f'<div class="col">{capt}{phone(inner, height)}</div>'

parts = []
parts.append(('1-groups', 'Groups: depth kept, read in one glance',
  'A group page today stacks eleven blocks before the first fold. The proposal keeps every one of them, but leads with pictures (an edge to edge backdrop, an Up next poster twice the size, three big posters for the films that define you) and folds the figures behind one-line rows you tap to open.',
  [col(cap("CURRENT", "iPhone group page, top to bottom", "Real order and copy from GroupScreen.swift + GroupTaste.swift: 44pt Up next poster, 74pt posters, five lane chips, the split, the mix legend, then Film DNA and the folds, all open."), group_current()),
   col(cap("PROPOSED", "Backdrop, bigger posters, folds", "Backdrop of the Up next film runs behind the island; Share and Edit become circles on it. Up next poster 44 → 88. One sentence of the read. Three 106pt posters. Lanes 5 → 2 + \"+3 lanes\". Split, mix, week, superlatives and DNA each one line."), group_proposed()),
   col(cap("PROPOSED", "Tap anywhere on a summary", "The group's read and its description open and close on a tap anywhere on the text, as the profile's read does. Web already does this for the read; iPhone does not; the description does it on neither."), summary_frame())]))
parts.append(('2-lately', 'Lately: faint hairlines, a tighter action row',
  'Hairlines at 7% cream between posts, starting at the text column so faces and posters stay free. The action row tightens from 24 to 26pt between icons to 16, every target still 44.',
  [col(cap("CURRENT", "Lately on Social", "16pt of space between posts and no lines (owner, 2026-11-02, lately-v2 A). Heart, comment, plane each in a 44 box with 12 padding, so 24 to 26pt between icons."), lately(False, False)),
   col(cap("PROPOSED", "Faint hairline, tight actions", "1px line in cream at 7% (≈ #1a1a1b on #0b0b0d), 16 above and 16 below, from the text column (52 in) to the gutter. Action icons 16 apart."), lately(True, True)),
   col(cap("SPEC", "The action row, current and proposed", "Measured from the code; numbers in pt, drawn at 2×."), action_spec()),
   col(cap("BOOKMARK", "Ask for recs (not designed)", "Where it could live: one row under the Lately heading, \"Ask your people for a rec\". Tapping it opens a composer drawer; replies land in Lately. Parked for its own round."), lately(True, True, ask=True))]))
parts.append(('2b-lists', 'The same hairline on film lists',
  'One shared token for every list of film rows (Lately, a list in list or ranked view, Watchlist, search, Activity): cream at 7%, inset to the row\'s text column. Grids stay clean.',
  [col(cap("CURRENT", "A ranked list, list view", "ListScreen rankRow: 12 above and below each row, no lines. Rows with and without a note run together."), ranked(False)),
   col(cap("PROPOSED", "With the shared hairline", "Rows unchanged; a 1px line in --rule-faint between them, starting at the title (116 in), so the number and thumb column stays open."), ranked(True)),
   col(cap("SPEC", "The token", "Defined once on each platform; each list passes only its inset."), token_frame())]))
parts.append(('3-tooltips', 'Tooltips: one sentence, once',
  'Five places a first-time viewer cannot tell what a thing is for. One quiet bubble, pointed at the thing, gone on any tap, shown once per account (the existing AccountHints / acctSet store).',
  [col(cap("PATTERN", "Anatomy and the five tips", "No Got it button and no title: a sentence and a pointer. One per screen visit, so a new account meets them over several days, not in a tour."), tip_spec()),
   col(cap("TIP 1", "The match stamp", "On the first grid with stamps. The stamp shows a % or stars and nothing says which is which."), tip_grid()),
   col(cap("TIP 2", "The bookmark", "On the first film page. The icon alone does not say where a save goes."), tip_film())]))
parts.append(('3b-tooltips', 'Tooltips, continued', '',
  [col(cap("TIP 3", "Your people %", "The Bodoni % under a face reads as a score. It is the Blend."), tip_people()),
   col(cap("TIP 4 · 5", "Send, then hold", "The plane on the first post; the next visit, \"Hold a post to react to it\" on the same spot."), tip_lately())]))
parts.append(('4-drawers', 'Drawers: one 16pt rhythm',
  'The Our read drawer as it opens. Measured from Drawer.swift (grab bar 8 + 5 + 4), WhySheet (top 16, strip 16 + 12 + 12, read 16) and the web\'s .share-sheet / .why3-strip.',
  [col(cap("CURRENT", "Godzilla Minus Zero, Our read", "Grab bar → title row 20; title row → rule 16; rule → Our read 12; Our read → rule 12; rule → read 16. Five gaps, three values, two hairlines."), drawer_current(), 844),
   col(cap("PROPOSED", "Every gap 16", "Grab bar → title row 16; title row → rule 16; rule → Our read 16; Our read → read 16. The rule under Our read goes: the one rule left parts the head from the body and becomes the sticky header's edge."), drawer_proposed(), 844)]))
parts.append(('4b-drawers', 'Drawers: the title stays when you scroll', '',
  [col(cap("OPTION A", "Compact sticky header", "When the title row scrolls under the top, a compact head fades in: grab bar 8 + 4, then 8, a 44 row (24×36 poster, title in Bodoni 18 on one line, close 36), 8, the rule. 72 in all."), scrolled(False), 844),
   col(cap("OPTION B", "With a faint backdrop strip", "The same 72, with the film's backdrop at 50% behind it, fading to the panel by the rule. Only for drawers led by a film; lists stay plain."), scrolled(True), 844),
   col(cap("LISTS", "A list drawer scrolled", "Lists keep their title and count the same way, no picture."), list_scrolled(), 844)]))

html = f'<!doctype html><html><head><meta charset="utf-8"><title>Simplify social</title><style>{CSS}</style></head><body>'
for key, title, lede, cols in parts:
    html += f'<section class="part" data-shot="{key}"><h1>{title}</h1>' + (f'<p class="lede">{lede}</p>' if lede else '<p class="lede"></p>') + '<div class="row">' + "".join(cols) + '</div></section>'
html += '</body></html>'
open(J + "simplify-social-v1.html", "w").write(html)
print("ok", len(html))
