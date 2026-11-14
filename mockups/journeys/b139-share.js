// b139: the one share screen, final version (built on b138-share.js: its lockup, caps, tick, posters, face, TARGETS, chrome).
// Cards at 1080 px, scaled. Stills are each film's real TMDB backdrop (montage films.backdrop_url, read 2026-11-14) through the
// house grade (the SVG filter #house in b139-share.html, HouseGrade.tsx's table, the profile backdrop's B1).
const BD = (id) => `https://image.tmdb.org/t/p/w1280/${id}.jpg`;
const BACK = { inception: '8ZTVqvKDQ8emSGUEMjsS4yHAwrp', her: 'nG5zmbVeYlcDhckrPAe06fArywn', pastlives: '7HR38hMBl23lf38MAN63y4pKsHz', arrival: 'uKPbFF08QkRMvIAsgCh1soeyPhZ', mood: 'ffQFnAUm2Uu4RU0nijpjPRf9TBT' };

// The still: one graded frame from the card's film, full bleed at the top, fading to the ink by the middle.
const still2 = (id, h = 1100, pos = 'center 30%') => `<div style="position:absolute;left:0;top:0;width:1080px;height:${h}px;background:url(${BD(id)}) ${pos}/cover;filter:url(#house)"></div>
  <div class="veil" style="background:linear-gradient(180deg,rgba(11,11,13,.45) 0%,rgba(11,11,13,.18) 10%,rgba(11,11,13,.55) ${Math.round(h / 1920 * 45)}%,rgba(11,11,13,.9) ${Math.round(h / 1920 * 78)}%,#0b0b0d ${Math.round(h / 1920 * 100)}%,#0b0b0d 100%)"></div>`;

// The stub: an outlined ticket at the foot. Left: the fan and the card's question. Past the perforation: @handle and the address. No date.
const stub2 = (left, handle, w = 920) => `<div style="position:relative;display:flex;width:${w}px;height:168px;flex:none;border:2px solid rgba(239,232,218,.55);border-radius:14px;
  -webkit-mask:radial-gradient(circle 20px at ${w - 280}px -2px,#0000 98%,#000) top/100% 51% no-repeat,radial-gradient(circle 20px at ${w - 280}px 100%,#0000 98%,#000) bottom/100% 51% no-repeat">
  <div style="flex:1;display:flex;align-items:center;gap:22px;padding:0 30px">${FAN(70)}<div>${left}</div></div>
  <div style="width:0;border-left:3px dashed rgba(239,232,218,.45);margin:26px 0"></div>
  <div style="width:278px;display:flex;flex-direction:column;justify-content:center;padding:0 28px;gap:16px"><div style="font:400 36px/1 Newsreader;color:${K.INK}">@${handle}</div><div style="font:600 19px/1 Inter;letter-spacing:2.6px;text-transform:uppercase;color:${K.MUTED}">montagefilm.app</div></div></div>`;
const q = (t) => `<div class="bod" style="font-size:52px;line-height:1.05;letter-spacing:-1px">${t}</div>`;
const streakHtml = (d, w = 880) => `<div style="margin-top:24px;font:400 42px/1.3 Newsreader;color:${K.MUTED};width:${w}px">${d.streak.map(([t, n]) => n ? `<span style="color:${K.INK};font-weight:600">${t}</span>` : t).join('')}</div>`;
// Every Story keeps its words 256 from the top and 380 from the foot (Instagram's and TikTok's chrome, rule 1344).
const PAD = 'padding:256px 80px 380px 80px';

function archetype139(d = ME) {
  return `<div class="card" style="height:1920px">${still2(BACK.inception)}
  <div class="in" style="${PAD}">${lockup()}
  ${caps(28, 'My archetype', 'margin-top:150px')}
  <div class="bod" style="font-size:${nameSize(d.label, 920)}px;line-height:1;letter-spacing:-3px;margin-top:4px;white-space:nowrap">${d.label}</div>
  <div style="font:400 42px/1.3 Newsreader;margin-top:20px;color:${K.SOFT};width:860px">${d.tag}</div>
  ${tick()}${streakHtml(d)}
  ${caps(24, `Films that define @${d.handle}`, 'margin-top:56px')}
  ${posters(d.films, 168)}
  <div style="margin-top:auto">${stub2(q("What's your<br>archetype?"), d.handle)}</div>
  </div></div>`;
}
function blend139() {
  return `<div class="card" style="height:1920px">${still2(BACK.her, 1000, 'center 25%')}
  <div class="in" style="${PAD}">${lockup()}
  ${caps(28, 'Our Blend', 'margin-top:60px')}
  <div style="display:flex;align-items:center;gap:20px;margin-top:20px">${face('M', '#4a3a6b', 96)}${face('S', '#2f4a3f', 96)}<div class="bod" style="font-size:60px;margin-left:8px">Maya and Sam</div></div>
  <div class="bod" style="font-size:400px;line-height:.9;letter-spacing:-12px;color:${K.BLUE};margin-top:24px;margin-left:-14px">94<span style="font-size:200px;letter-spacing:0">%</span></div>
  <div style="font:400 46px/1.3 Newsreader;color:${K.SOFT};margin-top:10px">Cinematic soulmates</div>
  ${tick()}
  ${caps(24, 'Films we both love', 'margin-top:40px')}${posters([FILM.her, FILM.pastlives, FILM.mood], 150, 22)}
  <div style="margin-top:auto">${stub2(q("What's our<br>Blend?"), 'maya')}</div>
  </div></div>`;
}
function pitch139() {
  const f = [[FILM.pastlives, 'Past Lives'], [FILM.mood, 'In the Mood for Love'], [FILM.her, 'Her']];
  return `<div class="card" style="height:1920px">${still2(BACK.pastlives, 1000)}
  <div class="in" style="${PAD}">${lockup()}
  ${caps(28, 'Pitch · @maya', 'margin-top:100px')}
  <div class="bod" style="font-size:118px;line-height:1.02;letter-spacing:-2px;margin-top:16px;width:900px">&ldquo;Feels like a rainy Sunday&rdquo;</div>
  ${tick(28)}
  ${caps(24, 'The shortlist', 'margin-top:56px')}
  <div style="display:flex;gap:24px;margin-top:24px">${f.map(([p, t], i) => `<div style="width:270px"><div class="gp" style="width:270px;height:405px;background-image:url(${T(p)});box-shadow:8px 8px 0 rgba(92,21,32,.7)"></div><div style="font:600 30px/1.2 Newsreader;margin-top:20px">${i + 1}. ${t}</div></div>`).join('')}</div>
  <div style="margin-top:auto">${stub2(q('What would<br>you pitch?'), 'maya')}</div>
  </div></div>`;
}
function night139() {
  return `<div class="card" style="height:1920px">${still2(BACK.arrival, 1050)}
  <div class="in" style="${PAD}">
  <div style="display:flex;justify-content:space-between;align-items:center">${lockup()}${caps(24, 'Movie night · Fri 13 Nov', 'color:#d6d0c3')}</div>
  <div class="gp" style="width:300px;height:450px;margin-top:60px;background-image:url(${T(FILM.arrival, 500)});box-shadow:8px 8px 0 rgba(92,21,32,.7)"></div>
  ${caps(26, "Tonight we're watching", 'margin-top:44px')}
  <div class="bod" style="font-size:130px;line-height:1;letter-spacing:-3px;margin-top:8px">Arrival</div>
  <div style="font:400 40px Newsreader;color:${K.MUTED};margin-top:12px">2016 · Denis Villeneuve</div>
  <div class="bod" style="font-size:56px;margin-top:22px">5 people · 4 minutes</div>
  <div style="font:600 36px Newsreader;color:${K.BLUE};margin-top:6px">4 of 5 voted for it</div>
  <div style="margin-top:auto">${stub2(`<div class="capsN" style="font-size:20px;letter-spacing:4px">Together we're</div>${q('The Midnight<br>Society')}`, 'maya')}</div>
  </div></div>`;
}
function list139() {
  const ids = [FILM.mood, FILM.her, FILM.pastlives, FILM.moonlight, FILM.portrait];
  return `<div class="card" style="height:1920px">${still2(BACK.mood, 1100, 'center 35%')}
  <div class="in" style="${PAD}">${lockup()}
  ${caps(28, 'Ranked list · 12 films', 'margin-top:220px')}
  <div class="bod" style="font-size:110px;line-height:1.04;letter-spacing:-2px;margin-top:16px">Rainy Sunday films</div>
  ${tick(32)}
  <div style="display:flex;align-items:center;gap:20px;margin-top:36px">${face('M', '#4a3a6b', 60)}<div style="font:400 38px Newsreader;color:${K.MUTED}">@maya</div></div>
  <div style="display:flex;gap:18px;margin-top:40px">${ids.map((p, i) => `<div class="gp" style="width:168px;height:252px;background-image:url(${T(p)});position:relative"><span class="bod" style="position:absolute;left:8px;top:8px;background:rgba(0,0,0,.72);padding:2px 12px;font-size:38px;border-radius:4px">${i + 1}</span></div>`).join('')}</div>
  <div style="margin-top:auto">${stub2(q('What would<br>you rank?'), 'maya')}</div>
  </div></div>`;
}

// ---------- the bar: "Send in Montage" (recent chats, friends, groups; Search last), then the external row ----------
const PEOPLE = [['Sam', '#2f4a3f', 0, null], ['Jordan', '#5a3b2c', 0, null], ['Friday crew', '#3a4f6b', 1, null], ['Priya', '#4a3a6b', 0, null], ['Lee', '#6b3a4a', 0, null], ['Film club', '#4f5a2c', 1, null]];
const SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="#141210" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>';
function bar139(keys = ALL) {
  const faces = PEOPLE.map(([n, c, grp, img]) => `<div class="tile f"><div class="c" style="width:52px;height:52px;border-radius:${grp ? '14px' : '50%'};background:${img ? `url(${img}) center/cover` : c};font:600 21px/1 'Bodoni Moda',serif;color:#efe8da">${img ? '' : n[0]}</div><div class="l">${n}</div></div>`).join('');
  const search = `<div class="tile f"><div class="c" style="width:52px;height:52px;border:1.5px solid rgba(20,18,16,.35)">${SEARCH}</div><div class="l">Search</div></div>`;
  const ext = keys.map((k) => { const [l, bg, g] = TARGETS[k]; return `<div class="tile"><div class="c" style="${bg}">${g}</div><div class="l">${l}</div></div>`; }).join('');
  return `<div class="ss-bar b139"><div class="b139-k">Send in Montage</div><div class="ss-row b139-in">${faces}${search}</div><div class="b139-rule"></div><div class="ss-row b139-out">${ext}</div><div class="ss-fade"></div><div class="homeb"></div></div>`;
}
function screen139({ card, title }) {
  const s = 393 / 1080;
  return `<div class="ss-card" style="top:0;height:699px"><div style="transform:scale(${s});transform-origin:0 0;width:1080px;height:1920px;position:relative">${card}</div></div>
  ${chrome}${X}<div class="ss-t"><span>${title}</span></div>${bar139()}`;
}
