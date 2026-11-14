// b138: the cards (at 1080 px, scaled) and the one share screen. Shared by the three b138 boards.
// The archetype card is a port of montage lib/type-card.tsx typeCardBody (typeNameSize, typeLayout, the wall, the veil,
// the safe area 256 / 140 / 380 / 80); the other cards are laid out from their mocks and code comments (named per card).
const T = (id, w = 342) => `https://image.tmdb.org/t/p/w${w}/${id}.jpg`;
const FILM = {
  inception: '8ZTVqvKDQ8emSGUEMjsS4yHAwrp', primer: 'xEoq2WmDzpzxhkHEsmOYOg6BPg6', arrival: 'x2FJsf1ElAgr63Y3PNPtJrcmpoe',
  mulholland: 'x7A59t6ySylr1L7aubOQEA480vM', synecdoche: '5UwdhrjXhUgsiDhe1dpS9z4yj7q', shining: 'uAR0AWqhQL1hQa69UDEbb2rE5Wx',
  pastlives: 'k3waqVXSnvCZWfJYNtdamTgTtTA', her: 'eCOtqtfvn7mxGl6nfmq4b1exJRc', mood: 'iYypPT4bhqXfq1b6EnmxvRt6b2Y',
  moonlight: 'qLnfEmPrDjJfPyyddLJPkXmshkp', portrait: '2LquGwEhbg3soxSCs9VNyh5VJd9', anatomy: '1ho0d4LNZw3Y0voeKmSvPSgJOJ2',
};
const WALL = ['z2FnLKpFi1HPO7BEJxdkv6hpJSU','7IiTTgloJzvGI1TAYymCfbfl3vT','zhG3vKWyDRaZYoaww1UVAi29T9h','6FfCtAuVAW8XJjZ7eWeLibRLWTw','ve72VxNqjGM69Uky4WTo2bK6rfq','n0YuM4f5lvGAP6MAW2kBIzugXnc','jSziioSwPVrOy9Yow3XhWIBDjq1','xlaY2zyzMfkhk0HSC5VUwzoZPU1','lxM6kqilAdpdhqUl2biYp5frUxE','602vevIURmpDfzbnv5Ubi6wIkQm','3bhkrj58Vtu7enYsRolD1fZdja1','39wmItIWsg5sZMyRUHLkWBcuVCM','6d5XOczc226jECq0LIX0siKtgHR','9OkCLM73MIU2CrKZbqiT8Ln1wY2','lGCEKlJo2CnWydQj7aamY7s1S7Q','1pdfLvkbY9ohJlCjQH2CZjjYVvJ','fKTPH2WvH8nHTXeBYBVhawtRqtR','dXNAPwY7VrqMAo51EKhhCJfaGb5','15uOEfqBNTVtDUT7hGBVCka0rZz','uAR0AWqhQL1hQa69UDEbb2rE5Wx'];
const K = { INK: '#efe8da', MUTED: '#a9a69e', SOFT: '#d6d0c3', FAINT: '#8a877f', BG: '#0b0b0d', OX: '#7a1220', BLUE: '#8fb3d9' };
const SHADES = ['#7a1220', '#5b8fc4', '#6a6a70', '#4e4e53'];
// public/brand/montage-fan-glyph-small.svg
const FAN = (h) => `<svg viewBox="0 0 48 44" style="height:${h}px;width:${h * 48 / 44}px;flex:none"><g transform="translate(24 40)"><g transform="rotate(-28) scale(0.95)"><rect x="-8" y="-30" width="16" height="27" rx="2.4" fill="#b8424a"/><g fill="#14161d"><rect x="-5.4" y="-28" width="2.4" height="2.4" rx="0.5"/><rect x="1.4" y="-28" width="2.4" height="2.4" rx="0.5"/><rect x="-5.4" y="-6" width="2.4" height="2.4" rx="0.5"/><rect x="1.4" y="-6" width="2.4" height="2.4" rx="0.5"/></g></g><g transform="rotate(-2)"><rect x="-9.5" y="-32" width="19" height="30" rx="2.7" fill="#8198b0"/><g fill="#14161d"><rect x="-6.6" y="-29.8" width="2.6" height="2.6" rx="0.5"/><rect x="1" y="-29.8" width="2.6" height="2.6" rx="0.5"/><rect x="-6.6" y="-6.4" width="2.6" height="2.6" rx="0.5"/><rect x="1" y="-6.4" width="2.6" height="2.6" rx="0.5"/></g></g></g></svg>`;
const lockup = (h = 72) => `<div style="display:flex;align-items:center;height:${h}px;flex:none">${FAN(60)}<div class="bod" style="font-size:46px;margin-left:12px">Montage</div></div>`;
const caps = (size, txt, extra = '') => `<div class="capsN" style="font-size:${size}px;line-height:1.3;letter-spacing:${Math.round(size * 0.2)}px;${extra}">${txt}</div>`;
const tick = (mt = 20) => `<div style="display:flex;width:96px;height:9px;margin-top:${mt}px;flex:none"><div style="width:48px;background:#c24c56;border-radius:4px 0 0 4px"></div><div style="width:48px;background:#5a86bd;border-radius:0 4px 4px 0"></div></div>`;
const wall = (ids, { cols = 4, w = 280, n = 20, gap = 12, left = -40, top = -60, opacity = 0.55 } = {}) =>
  `<div class="wallg" style="left:${left}px;top:${top}px;width:${cols * w + (cols - 1) * gap}px">${Array.from({ length: n }, (_, i) => `<i style="width:${w}px;height:${Math.round(w * 1.5)}px;margin-right:${(i + 1) % cols ? gap : 0}px;margin-bottom:${gap}px;opacity:${opacity};background-image:url(${T(ids[i % ids.length])})"></i>`).join('')}</div>`;
const veilStory = 'linear-gradient(180deg, rgba(11,11,13,0.45) 0%, rgba(11,11,13,0.7) 22%, rgba(11,11,13,0.9) 36%, rgba(11,11,13,0.96) 60%, #0b0b0d 100%)';

// lib/type-card.tsx: the name's size and the vertical budget.
const BODONI_EM = {"a":0.56,"b":0.63,"c":0.53,"d":0.63,"e":0.53,"f":0.41,"g":0.63,"h":0.62,"i":0.32,"j":0.33,"k":0.64,"l":0.36,"m":0.88,"n":0.62,"o":0.57,"p":0.63,"q":0.63,"r":0.48,"s":0.45,"t":0.36,"u":0.62,"v":0.56,"w":0.81,"x":0.59,"y":0.58,"z":0.48,"A":0.79,"B":0.69,"C":0.73,"D":0.76,"E":0.64,"F":0.62,"G":0.76,"H":0.79,"I":0.42,"J":0.51,"K":0.75,"L":0.63,"M":0.9,"N":0.78,"O":0.77,"P":0.67,"Q":0.77,"R":0.75,"S":0.6,"T":0.69,"U":0.74,"V":0.8,"W":1.08,"X":0.8,"Y":0.75,"Z":0.61," ":0.26,"'":0.24,"-":0.36};
const nameW = (t, z) => [...t].reduce((n, c) => n + (BODONI_EM[c] ?? 0.6), 0) * 1.04 * z - 3 * Math.max(0, t.length - 1);
function nameSize(label, col = 860) { let z = 230; while (z > 40 && nameW(label, z) > col) z--; return z; }
function typeLayout(d) {
  const room = 1920 - 256 - 380, col = 860, z = nameSize(d.label), fs = 42;
  const chars = d.streak.reduce((n, r) => n + r[0].length, 0);
  const streakH = 24 + Math.max(1, Math.ceil((chars * fs * 0.52) / col)) * Math.round(fs * 1.3);
  const tagH = 20 + Math.max(1, Math.ceil((d.tag.length * fs * 0.48) / col)) * Math.round(fs * 1.3);
  const statsH = d.stats ? 24 + d.stats.length * 50 : 0;
  const fixed = 72 + 36 + z + 4 + tagH + statsH + 20 + 9 + streakH + 52 + 70 + 20 + 48 + 40;
  let gaps = { caps: 120, films: 72, foot: 48 }, pw = 168;
  const total = () => fixed + gaps.caps + gaps.films + 63 + Math.round(pw * 1.5) + gaps.foot;
  if (total() > room) gaps = { caps: 72, films: 48, foot: 32 };
  if (total() > room) pw = Math.max(120, Math.floor((room - (total() - Math.round(pw * 1.5))) / 1.5));
  return { z, fs, gaps, pw, col };
}
const posters = (ids, pw, gap = 20, shadow = true) => `<div style="display:flex;margin-top:24px;flex:none">${ids.map((p, i) => `<div class="gp" style="width:${pw}px;height:${Math.round(pw * 1.5)}px;margin-left:${i ? gap : 0}px;background-image:url(${T(p)});${shadow ? 'box-shadow:8px 8px 0 rgba(92,21,32,0.7)' : ''}"></div>`).join('')}</div>`;

const ME = { label: 'Overthinker', tag: 'Always piecing it together. You leave with a theory.',
  streak: [['with streaks of ', 0], ['Nihilist', 1], [' and ', 0], ['Lovestruck', 1]], mix: [58, 27, 15],
  films: [FILM.inception, FILM.primer, FILM.arrival, FILM.mulholland, FILM.synecdoche], handle: 'maya' };

// TODAY's archetype Story (1080 x 1920), as /api/share-card?fmt=story draws it.
function archetypeCard(d = ME, opt = {}) {
  const { z, fs, gaps, pw, col } = typeLayout({ ...d, stats: opt.stats });
  const stats = opt.stats ? `<div style="display:flex;flex-direction:column;gap:6px;margin-top:24px;flex:none">${opt.stats.map(([n, w]) => `<div style="font:400 ${fs - 2}px/44px Newsreader;color:${K.SOFT}"><span style="color:${K.INK};font-weight:600">${n}</span> ${w}</div>`).join('')}</div>` : '';
  return `<div class="card" style="height:1920px">${wall(WALL)}<div class="veil" style="background:${veilStory}"></div>
  <div class="in" style="padding:256px 140px 380px 80px">${lockup()}
  ${caps(28, 'My archetype', `margin-top:${gaps.caps}px`)}
  <div class="bod" style="font-size:${z}px;line-height:1;letter-spacing:-3px;margin-top:4px;white-space:nowrap">${d.label}</div>
  <div style="font:400 ${fs}px/1.3 Newsreader;margin-top:20px;color:${K.SOFT};width:${col}px">${d.tag}</div>
  ${opt.stats ? `${stats}${tick(24)}` : tick()}
  <div style="margin-top:24px;font:400 ${fs}px/1.3 Newsreader;color:${K.MUTED};width:${col}px">${d.streak.map(([t, n]) => n ? `<span style="color:${K.INK};font-weight:600">${t}</span>` : t).join('')}</div>
  <div style="display:flex;width:${col}px;height:24px;padding:3px;background:${K.INK};margin-top:28px;flex:none">${d.mix.map((p, i) => `<div style="flex:${p} 0 0;height:18px;background:${SHADES[i]};margin-left:${i ? 3 : 0}px"></div>`).join('')}</div>
  ${caps(24, `Films that define @${d.handle}`, `margin-top:${gaps.films}px`)}
  ${posters(d.films, pw)}
  <div style="margin-top:auto;padding-top:${gaps.foot}px;margin-right:-60px;flex:none">
    <div class="bod" style="font-size:64px;line-height:1.1;letter-spacing:-1px;white-space:nowrap">What's your archetype?</div>
    <div style="display:flex;align-items:center;justify-content:space-between;width:${col + 60}px;margin-top:20px;height:48px"><div class="site">montagefilm.app</div><div style="font:400 34px/1.1 Newsreader;color:${K.MUTED}">@${d.handle}</div></div>
  </div></div></div>`;
}

// PROPOSED (part 3): the house ticket stub at the foot, the handle and date on its torn-off end.
const stub = (left, right, w = 920) => `<div style="position:relative;display:flex;width:${w}px;height:168px;flex:none;border:2px solid rgba(239,232,218,.55);border-radius:14px;
  -webkit-mask:radial-gradient(circle 20px at ${w - 250}px -2px,#0000 98%,#000) top/100% 51% no-repeat,radial-gradient(circle 20px at ${w - 250}px 100%,#0000 98%,#000) bottom/100% 51% no-repeat">
  <div style="flex:1;display:flex;align-items:center;gap:22px;padding:0 30px">${FAN(70)}<div>${left}</div></div>
  <div style="width:0;border-left:3px dashed rgba(239,232,218,.45);margin:26px 0"></div>
  <div style="width:248px;display:flex;flex-direction:column;justify-content:center;padding:0 26px;gap:10px">${right}</div></div>`;
const stubRight = (handle, date = '14 Nov 2026') => `<div style="font:400 34px/1 Newsreader;color:${K.INK}">@${handle}</div><div style="font:600 20px/1 Inter;letter-spacing:2.6px;text-transform:uppercase;color:${K.MUTED}">${date}</div><div style="font:600 18px/1 Inter;letter-spacing:2.4px;text-transform:uppercase;color:${K.FAINT}">montagefilm.app</div>`;
// The still: a full-bleed, graded frame from their #1 film (a TMDB backdrop in the build; a poster crop stands in here).
const still = (id, h = 1040, pos = 'center 22%') => `<div style="position:absolute;left:0;top:0;width:1080px;height:${h}px;background:url(${T(id, 780)}) ${pos}/cover;filter:saturate(.8) contrast(1.05) sepia(.08)"></div>
  <div class="veil" style="background:linear-gradient(180deg,rgba(11,11,13,.4) 0%,rgba(11,11,13,.2) 12%,rgba(11,11,13,.72) ${Math.round(h / 1920 * 55)}%,rgba(11,11,13,.93) ${Math.round(h / 1920 * 85)}%,#0b0b0d ${Math.round(h / 1920 * 100)}%,#0b0b0d 100%)"></div>`;

function archetypeAfter(d = ME) {
  return `<div class="card" style="height:1920px">${still(d.films[0])}
  <div class="in" style="padding:256px 80px 300px 80px">${lockup()}
  ${caps(28, 'My archetype', 'margin-top:300px')}
  <div class="bod" style="font-size:${nameSize(d.label, 920)}px;line-height:1;letter-spacing:-3px;margin-top:4px;white-space:nowrap">${d.label}</div>
  <div style="font:400 42px/1.3 Newsreader;margin-top:20px;color:${K.SOFT};width:860px">${d.tag}</div>
  ${tick()}
  <div style="margin-top:24px;font:400 42px/1.3 Newsreader;color:${K.MUTED};width:880px">${d.streak.map(([t, n]) => n ? `<span style="color:${K.INK};font-weight:600">${t}</span>` : t).join('')}</div>
  ${caps(24, `Films that define @${d.handle}`, 'margin-top:56px')}
  ${posters(d.films, 168)}
  <div style="margin-top:auto">${stub(`<div class="bod" style="font-size:52px;line-height:1.05;letter-spacing:-1px">What's your<br>archetype?</div>`, stubRight(d.handle))}</div>
  </div></div>`;
}

// THE BLEND. Today: the 4:5 Post (lib/match-card.tsx matchCardBody: the spine, both faces, "<you> and <them>", the % in
// blue Bodoni, the band, three films you both love, "What's our Blend?" and the /m pill). No 9:16 exists today.
const face = (l, c, s = 132) => `<div style="width:${s}px;height:${s}px;border-radius:${s * 0.18}px;background:${c};display:flex;align-items:center;justify-content:center;font:600 ${s * 0.46}px Inter;color:#efe8da;flex:none">${l}</div>`;
const BL = { a: 'Maya', b: 'Sam', pct: 94, band: 'Cinematic soulmates', films: [FILM.pastlives, FILM.her, FILM.mood] };
function blendPost() {
  return `<div class="card" style="height:1350px">${wall(WALL.slice(4), { n: 16, opacity: 0.4 })}<div class="veil" style="background:linear-gradient(180deg,rgba(11,11,13,.6),rgba(11,11,13,.95) 40%,#0b0b0d)"></div>
  <div style="position:absolute;left:0;top:0;bottom:0;width:18px;background:${K.OX}"></div>
  <div class="in" style="padding:72px 80px 64px 98px">${lockup()}
  <div style="display:flex;gap:20px;margin-top:64px">${face('M', '#4a3a6b')}${face('S', '#2f4a3f')}</div>
  <div class="bod" style="font-size:72px;line-height:1.1;margin-top:28px">Maya and Sam</div>
  <div style="display:flex;align-items:baseline;gap:24px;margin-top:6px"><div class="bod" style="font-size:190px;line-height:1;color:${K.BLUE}">94%</div><div style="font:400 44px Newsreader;color:${K.SOFT}">${BL.band}</div></div>
  ${caps(24, 'Films you both love', 'margin-top:40px')}${posters(BL.films, 170, 22, false)}
  <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center"><div class="bod" style="font-size:60px">What's our Blend?</div><div class="site" style="font-size:22px;border:2px solid rgba(239,232,218,.4);border-radius:999px;padding:14px 22px">montagefilm.app/m/maya</div></div>
  </div></div>`;
}
// PROPOSED: the Blend as a Story, one hero number set huge.
function blendStory(after = true) {
  return `<div class="card" style="height:1920px">${after ? still(FILM.her, 960, 'center 8%') : wall(WALL.slice(4), { opacity: 0.45 }) + `<div class="veil" style="background:${veilStory}"></div>`}
  <div class="in" style="padding:256px 80px 300px 80px">${lockup()}
  ${caps(28, 'Our Blend', `margin-top:${after ? 150 : 90}px`)}
  <div style="display:flex;align-items:center;gap:20px;margin-top:20px">${face('M', '#4a3a6b', 96)}${face('S', '#2f4a3f', 96)}<div class="bod" style="font-size:60px;margin-left:8px">Maya and Sam</div></div>
  <div class="bod" style="font-size:${after ? 430 : 330}px;line-height:.9;letter-spacing:-12px;color:${K.BLUE};margin-top:24px;margin-left:-14px">94<span style="font-size:220px;letter-spacing:0">%</span></div>
  <div style="font:400 46px/1.3 Newsreader;color:${K.SOFT};margin-top:10px">${BL.band}</div>
  ${tick()}
  ${caps(24, 'Films we both love', 'margin-top:56px')}${posters(BL.films, 176, 24)}
  <div style="margin-top:auto">${after ? stub(`<div class="bod" style="font-size:52px;line-height:1.05">What's our<br>Blend?</div>`, stubRight('maya')) : `<div class="bod" style="font-size:64px;line-height:1.1">What's our Blend?</div><div style="display:flex;justify-content:space-between;margin-top:20px"><div class="site">montagefilm.app/m/maya</div><div style="font:400 34px Newsreader;color:${K.MUTED}">@maya</div></div>`}</div>
  </div></div>`;
}

// PITCH SHORTLIST: /api/recut/card/<id> Story (pitch-share-v1 "the pitch card": the sentence in Bodoni, the shortlist).
function pitchStory() {
  const f = [[FILM.pastlives, 'Past Lives'], [FILM.mood, 'In the Mood for Love'], [FILM.her, 'Her']];
  return `<div class="card" style="height:1920px">${wall([FILM.pastlives, FILM.mood, FILM.her, FILM.moonlight, FILM.portrait, ...WALL], { opacity: 0.4 })}<div class="veil" style="background:${veilStory}"></div>
  <div class="in" style="padding:256px 140px 380px 80px">${lockup()}
  ${caps(28, 'Pitch · @maya', 'margin-top:110px')}
  <div class="bod" style="font-size:118px;line-height:1.02;letter-spacing:-2px;margin-top:16px;width:900px">&ldquo;Feels like a rainy Sunday&rdquo;</div>
  ${tick(28)}
  ${caps(24, 'The shortlist', 'margin-top:64px')}
  <div style="display:flex;gap:24px;margin-top:24px">${f.map(([p, t], i) => `<div style="width:270px"><div class="gp" style="width:270px;height:405px;background-image:url(${T(p)});box-shadow:8px 8px 0 rgba(92,21,32,.7)"></div><div style="font:600 30px/1.2 Newsreader;margin-top:20px">${i + 1}. ${t}</div></div>`).join('')}</div>
  <div style="margin-top:auto"><div class="bod" style="font-size:64px;line-height:1.1">What would you pitch?</div><div class="site" style="margin-top:24px">montagefilm.app/pitch</div></div>
  </div></div>`;
}

// MOVIE NIGHT RESULT: /t/<id>/result-card Story (movienight-share-v1, with v4's ticket stub, rule 1914).
function nightStory() {
  return `<div class="card" style="height:1920px">${wall([FILM.arrival, ...WALL.slice(6)], { opacity: 0.4 })}<div class="veil" style="background:${veilStory}"></div>
  <div class="in" style="padding:256px 140px 380px 80px">
  <div style="display:flex;justify-content:space-between;align-items:center">${lockup()}${caps(24, 'Movie night · Fri 13 Nov')}</div>
  <div class="gp" style="width:340px;height:510px;margin-top:56px;background-image:url(${T(FILM.arrival, 500)});box-shadow:8px 8px 0 rgba(92,21,32,.7)"></div>
  ${caps(26, "Tonight we're watching", 'margin-top:44px')}
  <div class="bod" style="font-size:130px;line-height:1;letter-spacing:-3px;margin-top:8px">Arrival</div>
  <div style="font:400 40px Newsreader;color:${K.MUTED};margin-top:12px">2016 · Denis Villeneuve</div>
  <div class="bod" style="font-size:56px;margin-top:22px">5 people · 4 minutes</div>
  <div style="font:600 36px Newsreader;color:${K.BLUE};margin-top:6px">4 of 5 voted for it</div>
  <div style="margin-top:auto;display:flex;border:2px solid rgba(239,232,218,.45);border-radius:14px;height:150px;align-items:center;padding:0 30px;justify-content:space-between;margin-right:-60px"><div><div class="capsN" style="font-size:22px;letter-spacing:4px">Together we're</div><div class="bod" style="font-size:52px">The Midnight Society</div></div><div class="site" style="font-size:20px">montagefilm.app/mn</div></div>
  </div></div>`;
}

// LIST: /l/<id>/card?fmt=story (built-listcard-story.png: the first film's art, kind and count, the title, the tick, the
// owner, the first five numbered, MONTAGE and the address at the foot).
function listStory() {
  const ids = [FILM.pastlives, FILM.her, FILM.mood, FILM.moonlight, FILM.portrait];
  return `<div class="card" style="height:1920px"><div style="position:absolute;left:0;top:0;width:1080px;height:1100px;background:url(${T(ids[0], 780)}) center 20%/cover;filter:saturate(.35) brightness(.45) sepia(.2) hue-rotate(180deg)"></div><div class="veil" style="background:linear-gradient(180deg,rgba(11,11,13,.2),rgba(11,11,13,.55) 35%,#0b0b0d 58%)"></div>
  <div class="in" style="padding:520px 72px 120px 72px">
  ${caps(34, 'Ranked list · 12 films')}
  <div class="bod" style="font-size:100px;line-height:1.08;margin-top:16px">Rainy Sunday films</div>
  ${tick(40)}
  <div style="display:flex;align-items:center;gap:20px;margin-top:40px">${face('M', '#4a3a6b', 60)}<div style="font:400 38px Newsreader;color:${K.MUTED}">@maya</div></div>
  <div style="display:flex;gap:18px;margin-top:40px">${ids.map((p, i) => `<div class="gp" style="width:172px;height:258px;background-image:url(${T(p)});position:relative"><span class="bod" style="position:absolute;left:8px;top:8px;background:rgba(0,0,0,.72);padding:2px 12px;font-size:38px;border-radius:4px">${i + 1}</span></div>`).join('')}</div>
  <div style="margin-top:auto;display:flex;justify-content:space-between"><div class="site" style="font-size:34px">Montage</div><div class="site" style="font-size:34px">montagefilm.app</div></div>
  </div></div>`;
}

// A LINK-ONLY share given a card (proposed): the movie night invite (today a link, private: Messages, Copy link, More).
function inviteStory() {
  return `<div class="card" style="height:1920px">${wall(WALL.slice(2), { opacity: 0.35 })}<div class="veil" style="background:${veilStory}"></div>
  <div class="in" style="padding:256px 140px 380px 80px">${lockup()}
  ${caps(28, "You're invited", 'margin-top:150px')}
  <div class="bod" style="font-size:150px;line-height:1;letter-spacing:-3px;margin-top:10px">Friday movie night</div>
  ${tick(28)}
  <div style="font:400 44px/1.35 Newsreader;color:${K.SOFT};margin-top:28px">Vote on what we watch. No account needed.</div>
  <div style="display:flex;gap:16px;margin-top:56px;align-items:center">${face('M', '#4a3a6b', 110)}${face('S', '#2f4a3f', 110)}${face('J', '#5a3b2c', 110)}<div style="font:400 36px Newsreader;color:${K.MUTED};margin-left:12px">Hosted by @maya</div></div>
  <div style="margin-top:auto">${stub(`<div class="bod" style="font-size:52px;line-height:1.05">Join the<br>night</div>`, stubRight('maya', 'Fri 13 Nov').replace('montagefilm.app', 'tap the link'), 920)}</div>
  </div></div>`;
}

// ---------- the share screen ----------
const IG = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="#fff" stroke="none"/></svg>';
const IGBG = 'radial-gradient(circle at 30% 107%,#fdf497 0%,#fdf497 5%,#fd5949 45%,#d6249f 60%,#285AEB 90%)';
const TT = '<svg viewBox="0 0 24 24"><path d="M15.6 3c.3 2.4 1.8 3.9 4 4.1v3c-1.5 0-2.8-.4-4-1.2v6.2a5.4 5.4 0 1 1-5.4-5.4l.9.1v3.1a2.4 2.4 0 1 0 1.6 2.2V3h2.9z" fill="#25F4EE" transform="translate(-.8 -.6)"/><path d="M15.6 3c.3 2.4 1.8 3.9 4 4.1v3c-1.5 0-2.8-.4-4-1.2v6.2a5.4 5.4 0 1 1-5.4-5.4l.9.1v3.1a2.4 2.4 0 1 0 1.6 2.2V3h2.9z" fill="#FE2C55" transform="translate(.8 .6)"/><path d="M15.6 3c.3 2.4 1.8 3.9 4 4.1v3c-1.5 0-2.8-.4-4-1.2v6.2a5.4 5.4 0 1 1-5.4-5.4l.9.1v3.1a2.4 2.4 0 1 0 1.6 2.2V3h2.9z" fill="#fff"/></svg>';
const MSG = '<svg viewBox="0 0 24 24"><path d="M12 4C7 4 3 7.1 3 11c0 2.2 1.3 4.2 3.4 5.5-.2 1.2-.8 2.4-1.7 3.2 1.9-.1 3.6-.8 4.8-1.8.8.2 1.6.3 2.5.3 5 0 9-3.1 9-7.2S17 4 12 4z" fill="#fff"/></svg>';
const LINK = '<svg viewBox="0 0 24 24" fill="none" stroke="#EFE8DA" stroke-width="2" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>';
const MORE = '<svg viewBox="0 0 24 24" fill="#141210"><circle cx="5.5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="18.5" cy="12" r="1.9"/></svg>';
const DL = '<svg viewBox="0 0 24 24" fill="none" stroke="#141210" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>';
const PLUS = '<span style="position:absolute;right:-2px;bottom:-2px;width:20px;height:20px;border-radius:50%;background:#3897F0;border:2px solid #F3EEE4;color:#fff;font:700 14px/16px Inter;text-align:center">+</span>';
const TARGETS = {
  story: ['Instagram Story', `background:${IGBG}`, IG + PLUS],
  post: ['Instagram post', `background:${IGBG}`, IG],
  messages: ['Messages', 'background:linear-gradient(#5BF675,#0CBD2A)', MSG],
  copy: ['Copy link', 'background:#141210', LINK],
  tiktok: ['TikTok', 'background:#000', TT],
  more: ['More', 'border:1.5px solid rgba(20,18,16,.35)', MORE],
  saveStory: ['Save Story size', 'border:1.5px solid rgba(20,18,16,.35)', DL],
  savePost: ['Save post size', 'border:1.5px solid rgba(20,18,16,.35)', DL],
};
const ALL = ['story', 'post', 'messages', 'copy', 'tiktok', 'more'];
// tags: { story: ['t1', '1 tap'] }
function bar(keys = ALL, tags = {}, h = 165, home = true) {
  return `<div class="ss-bar" style="height:${h}px"><div class="ss-row">${keys.map((k) => { const [l, bg, g] = TARGETS[k]; const t = tags[k];
    return `<div class="tile">${t ? `<span class="tag ${t[0]}">${t[1]}</span>` : ''}<div class="c" style="${bg}">${g}</div><div class="l">${l}</div></div>`; }).join('')}</div>${keys.length > 5 ? '<div class="ss-fade"></div>' : ''}${home ? '<div class="homeb"></div>' : ''}</div>`;
}
const X = '<div class="ss-x"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></div>';
const chrome = '<div class="sbar"><span>9:41</span><i></i></div><div class="island"></div>';
// card: html at 1080 wide; ratio: 16/9 or 5/4.
function screen({ card, ratio = 16 / 9, title = '', keys = ALL, tags = {}, dots = 0, bgId = WALL[0] }) {
  const barH = 165, cw = 393, ch = cw * ratio, s = cw / 1080;
  const top = ratio > 1.7 ? 0 : Math.round((852 - barH + 20 - ch) / 2) + 10;
  return `${ratio > 1.7 ? '' : `<div class="ss-bg" style="background-image:url(${T(bgId, 500)})"></div>`}
  <div class="ss-card" style="top:${top}px;height:${Math.ceil(ch)}px"><div style="transform:scale(${s});transform-origin:0 0;width:1080px;height:${1080 * ratio}px;position:relative">${card}</div></div>
  ${chrome}${X}${title ? `<div class="ss-t"><span>${title}</span></div>` : ''}
  ${dots ? `<div class="ss-dots" style="top:${852 - barH - 22}px">${Array.from({ length: dots }, (_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>` : ''}
  ${bar(keys, tags, barH)}`;
}
// a card alone, scaled to width w
const cardBox = (card, w, ratio = 16 / 9) => `<div class="cbox" style="width:${w}px;height:${Math.round(w * ratio)}px"><div style="transform:scale(${w / 1080});transform-origin:0 0;width:1080px;height:${1080 * ratio}px;position:relative">${card}</div></div>`;
// fonts ready, then paint
window.whenFonts = async (fn) => { fn(); };
