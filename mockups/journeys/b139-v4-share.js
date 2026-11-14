// b139 v4 (from v3): the official lockup (fan glyph + Montage wordmark) in every card's foot stub, the card's one mark.
// b139 v3 (from v2): one Montage mark per card, the fan in the foot stub; the top-left lockup is gone on every card.
// b139 v2: the share screen and the upgraded cards, on theme and legible. Uses b138-share.js (FILM, ME, FAN, lockup, caps,
// tick, posters, face, TARGETS, ALL, chrome). Every text node that sits on the card carries data-c (its colour) and data-k
// (small | big) so b139-v2-render.js can measure its contrast over the still.
const BD = (id) => `https://image.tmdb.org/t/p/w1280/${id}.jpg`;
const BACK = { inception: '8ZTVqvKDQ8emSGUEMjsS4yHAwrp', her: 'nG5zmbVeYlcDhckrPAe06fArywn', pastlives: '7HR38hMBl23lf38MAN63y4pKsHz', arrival: 'uKPbFF08QkRMvIAsgCh1soeyPhZ', mood: 'ffQFnAUm2Uu4RU0nijpjPRf9TBT' };
const INK = '#efe8da', SOFT = '#d6d0c3', BLUE = '#8fb3d9';
const tx = (c, k = 'small') => `data-c="${c}" data-k="${k}"`;

// The still: the card's own film, its TMDB backdrop in the cards' house grade (rule 1344: saturate .8, contrast 1.05,
// sepia .08, baked in with sharp on the server), clear at the top and under a scrim that is near-solid wherever words sit.
const still3 = (id, { h = 1920, pos = 'center 30%', clear = 20, solid = 36 } = {}) => `<div style="position:absolute;left:0;top:0;width:1080px;height:${h}px;background:url(${BD(id)}) ${pos}/cover;filter:saturate(.8) contrast(1.05) sepia(.08)"></div>
  <div class="veil" style="background:linear-gradient(180deg,rgba(11,11,13,.42) 0%,rgba(11,11,13,.5) 11%,rgba(11,11,13,.64) 13%,rgba(11,11,13,.66) 18%,rgba(11,11,13,.72) ${clear + 2}%,rgba(11,11,13,.86) ${Math.round((clear + solid) / 2)}%,rgba(11,11,13,.93) ${solid}%,#0b0b0d ${solid + 18}%,#0b0b0d 100%)"></div>`;

// The share stub at the foot: the movie night card's ticket stub (rule 1914: #141417 ground, #3a3a3e line, 36 corners, the
// notches at the tear), the fan and the card's question; past the tear, @handle and the address. No date.
// The lockup as the app header draws it (BrandMark): the glyph, then the wordmark at 18/44 of its height, 1/44 apart.
const brandLockup = (glyph) => `<div style="display:flex;align-items:center;flex:none"><img src="b139-v4-brand/montage-fan-glyph.svg" style="width:${glyph}px;height:${glyph}px;display:block"><div data-c="#efe8da" data-k="big" style="height:${Math.round(glyph * 18 / 44)}px;margin-left:${Math.max(1, Math.round(glyph / 44))}px;display:flex">${WORDMARK_SVG.replace('<svg ', `<svg height="${Math.round(glyph * 18 / 44)}" style="display:block;overflow:visible" `)}</div></div>`;
// The share stub at the foot (rule 1914's look): the Montage lockup over the card's question; past the tear, @handle and the address. No date.
function stub3(left, handle, w = 920) {
  const H = 232, END = 276;
  const notch = (top) => `<div style="position:absolute;left:${w - END - 21}px;${top ? 'top:-24px' : 'bottom:-24px'};width:42px;height:42px;border-radius:50%;background:#0b0b0d;border:3px solid #3a3a3e"></div>`;
  return `<div style="position:relative;display:flex;width:${w}px;height:${H}px;flex:none;background:#141417;border:3px solid #3a3a3e;border-radius:36px;overflow:hidden">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:18px;padding:0 36px;text-align:left">${brandLockup(92)}<div>${left}</div></div>
  <div style="width:0;border-left:4px dotted #3a3a3e;margin:30px 0"></div>
  <div style="width:${END}px;background:#18181b;display:flex;flex-direction:column;justify-content:center;padding:0 30px;gap:16px"><div ${tx(INK)} style="font:400 38px/1 Newsreader;color:${INK}">@${handle}</div><div ${tx(SOFT)} style="font:600 19px/1 Inter;letter-spacing:2.6px;text-transform:uppercase;color:${SOFT}">montagefilm.app</div></div>
  ${notch(true)}${notch(false)}</div>`;
}
const q3 = (t) => `<div class="bod" ${tx(INK, 'big')} style="font-size:44px;line-height:1.06;letter-spacing:-.5px;color:${INK};white-space:nowrap">${t.replace(/<br>/g, ' ')}</div>`;
const caps3 = (size, t, extra = '') => `<div class="capsN" ${tx(SOFT)} style="font-size:${size}px;line-height:1.3;letter-spacing:${Math.round(size * 0.2)}px;color:${SOFT};${extra}">${t}</div>`;
// The lockup over the still keeps a soft shadow; the eyebrow sits on a solid ink chip (the read card's head, rule 1475).
const lockup3 = () => '';
const head3 = (eyebrow) => `<div style="display:flex;align-items:center;height:72px;align-self:stretch">${eyebrow ? `<div style="background:#0b0b0d;border-radius:999px;padding:12px 22px 12px 27px"><div class="capsN" ${tx(BLUE)} style="font-size:26px;letter-spacing:5px;color:${BLUE}">${eyebrow}</div></div>` : ''}</div>`;
const PAD3 = 'padding:256px 80px 380px 80px';
const spine = `<div style="position:absolute;left:0;top:0;bottom:0;width:18px;background:#7a1220;z-index:3"></div>`;

// ARCHETYPE, after: the reveal's words (RevealBeats: the name, "with a Nihilist streak", then the tag and the streak's sentence,
// lib/archetype-info.ts tagWithStreak; rule 2027), all in full ink.
function archetypeV2(d = ME) {
  return `<div class="card" style="height:1920px">${still3(BACK.inception, { clear: 18, solid: 34 })}
  <div class="in" style="${PAD3}">${lockup3()}
  ${caps3(28, 'My archetype', 'margin-top:120px')}
  <div class="bod" ${tx(INK, 'big')} style="font-size:${nameSize(d.label, 920)}px;line-height:1;letter-spacing:-3px;margin-top:4px;white-space:nowrap;color:${INK}">${d.label}</div>
  <div ${tx(INK)} style="font:400 42px/1.3 Newsreader;color:${INK};margin-top:12px">with a <b style="font-weight:600">Nihilist</b> streak</div>
  <div ${tx(INK)} style="font:400 42px/1.3 Newsreader;margin-top:20px;color:${INK};width:900px">Always piecing it together. You leave with a theory. And it lands better when the ending doesn't let you off.</div>
  ${tick()}
  ${caps3(24, `Films that define @${d.handle}`, 'margin-top:56px')}
  ${posters(d.films, 168)}
  <div style="margin-top:auto">${stub3(q3("What's your<br>archetype?"), d.handle)}</div>
  </div></div>`;
}
// BLEND, after: today's layout (lib/match-card.tsx: the spine, both faces, the names, the % in blue Bodoni, the band, three
// films) as a 9:16 Story. The % at 250 (the static Bodoni at optical size 11, where the 4 keeps its weight), the band in
// Newsreader italic.
function blendV2() {
  const pct = `<div class="bod" ${tx(BLUE, 'big')} style="display:flex;align-items:flex-start;justify-content:center;color:${BLUE};line-height:.92;margin-top:20px"><span style="font-size:230px;letter-spacing:-6px">94</span><span style="font-size:120px;margin-top:16px">%</span></div>`;
  return `<div class="card" style="height:1920px">${still3(BACK.her, { pos: 'center 20%', clear: 18, solid: 34 })}${spine}
  <div class="in" style="${PAD3};padding-left:98px;align-items:center">${head3('Blend')}
  <div style="display:flex;justify-content:center;margin-top:60px">${face('M', '#8fb3d9', 120).replace('color:#efe8da', 'color:#141210')}<div style="margin-left:-22px">${face('S', '#b3a6d9', 120).replace('color:#efe8da', 'color:#141210')}</div></div>
  <div class="bod" ${tx(INK, 'big')} style="font-size:72px;margin-top:28px;color:${INK}">Maya and Sam</div>
  ${pct}
  <div ${tx(INK)} style="font:italic 400 52px/1.2 Newsreader;color:${INK};margin-top:8px">Cinematic soulmates</div>
  ${caps3(24, 'Films we both love', 'margin-top:64px')}${posters([FILM.pastlives, FILM.her, FILM.mood], 170, 24, false)}
  <div style="margin-top:auto">${stub3(q3("What's our<br>Blend?"), 'maya', 902)}</div>
  </div></div>`;
}
// PITCH, after: today's Story (lib/recut-card.tsx: the spine, PITCH, "@maya's pitch", the sentence centred, three films with
// titles) over the top film's still; the stub takes "Pitch your own".
function pitchV2() {
  const f = [[FILM.pastlives, 'Past Lives'], [FILM.mood, 'In the Mood for Love'], [FILM.her, 'Her']];
  return `<div class="card" style="height:1920px">${still3(BACK.pastlives, { clear: 18, solid: 32 })}${spine}
  <div class="in" style="${PAD3};padding-left:98px;align-items:center;text-align:center">${head3('Pitch')}
  <div ${tx(INK)} style="font:400 40px Newsreader;color:${INK};margin-top:150px">@maya's pitch</div>
  <div class="bod" ${tx(INK, 'big')} style="font-size:104px;line-height:1.04;letter-spacing:-2px;margin-top:16px;width:880px;color:${INK}">&ldquo;Feels like a rainy Sunday&rdquo;</div>
  <div style="display:flex;gap:24px;margin-top:64px">${f.map(([p, t]) => `<div style="width:260px"><div class="gp" style="width:260px;height:390px;background-image:url(${T(p)});box-shadow:8px 8px 0 rgba(92,21,32,.7)"></div><div ${tx(INK)} style="font:400 32px/1.2 Newsreader;margin-top:18px;color:${INK}">${t}</div></div>`).join('')}</div>
  <div style="margin-top:auto">${stub3(q3('Pitch your<br>own'), 'maya', 902)}</div>
  </div></div>`;
}

// THE APP'S TICKET at card scale (web TheaterRoom NightTicket, .nt*: the cream ticket, the graded still on top, the title in
// Bodoni, "year · director", DATE and RUNTIME, the profile ticket's punched holes (.phx-tear) before the stub, ADMIT N in
// the stub with "Night N"; under the tear, What everyone chose). k = 2.55 (a 361 wide ticket drawn 920 wide).
function appTicket({ still, title, meta, date, runtime, admit, night, fold }) {
  const k = 2.55, W = 920, STUB = Math.round(92 * k);
  const holes = `<div style="position:relative;width:0;align-self:stretch">
    <div style="position:absolute;left:-20px;top:-23px;width:36px;height:36px;border-radius:50%;background:#0b0b0d;border:2px solid #3a3a3e;clip-path:inset(50% 0 0 0)"></div>
    <div style="position:absolute;left:-20px;bottom:-23px;width:36px;height:36px;border-radius:50%;background:#0b0b0d;border:2px solid #3a3a3e;clip-path:inset(0 0 50% 0)"></div>
    <div style="position:absolute;left:-4px;top:50%;height:76px;margin-top:-38px;width:8px;background:radial-gradient(circle at 4px 7px,#0b0b0d 4px,transparent 4.5px) 0 0/8px 15px repeat-y"></div></div>`;
  const faces = fold ? fold.faces.map(([l, c], i) => `<div style="width:62px;height:62px;border-radius:15px;background:${c};color:#141210;font:600 26px/62px Inter;text-align:center;margin-left:${i ? -18 : 0}px;box-shadow:0 0 0 5px #efe8da">${l}</div>`).join('') : '';
  return `<div style="width:${W}px;background:#efe8da;color:#141210;border-radius:15px 15px ${fold ? '0 0' : '15px 15px'};box-shadow:11px 11px 0 #5c1520;flex:none">
    <div style="height:330px;border-radius:15px 15px 0 0;background:url(${BD(still)}) center 28%/cover;filter:saturate(.8) contrast(1.05) sepia(.08)"></div>
    <div style="display:flex">
      <div style="flex:1;padding:${Math.round(16 * k)}px">
        <div class="bod" ${tx('#141210', 'big')} style="font-size:${Math.round(28 * k)}px;line-height:1.02;color:#141210">${title}</div>
        <div ${tx('#5b5650')} style="font:400 34px/1.2 Inter;color:#5b5650;margin-top:16px">${meta}</div>
        <div style="display:flex;gap:60px;margin-top:30px">
          <div ${tx('#6e675e')} style="font:600 26px/1 Inter;letter-spacing:3px;text-transform:uppercase;color:#6e675e">Date<div class="bod" style="font-size:44px;letter-spacing:0;text-transform:none;color:#141210;margin-top:8px">${date}</div></div>
          <div ${tx('#6e675e')} style="font:600 26px/1 Inter;letter-spacing:3px;text-transform:uppercase;color:#6e675e">Runtime<div class="bod" style="font-size:44px;letter-spacing:0;text-transform:none;color:#141210;margin-top:8px">${runtime}</div></div>
        </div>
      </div>
      ${holes}
      <div style="width:${STUB}px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#7a1220">
        <div ${tx('#7a1220')} style="font:800 26px/1 Inter;letter-spacing:4px;text-transform:uppercase">Admit</div>
        <div ${tx('#7a1220', 'big')} style="font:600 72px/1 Inter">${admit}</div>
        ${night ? `<div ${tx('#6e675e')} style="font:600 26px/1 Inter;letter-spacing:1px;color:#6e675e;margin-top:8px">Night ${night}</div>` : ''}
      </div>
    </div>
    ${fold ? `<div style="height:8px;margin:0 40px;background:radial-gradient(circle at 8px 4px,#0b0b0d 4px,transparent 4.5px) 0 0/16px 8px repeat-x"></div>
    <div style="display:flex;align-items:center;gap:30px;padding:30px 40px 34px"><div style="display:flex">${faces}</div><div><div ${tx('#7a1220')} style="font:600 26px/1 Inter;letter-spacing:3px;text-transform:uppercase;color:#7a1220">What everyone chose</div><div ${tx('#3a352f')} style="font:600 34px/1.2 Inter;color:#3a352f;margin-top:8px">${fold.line}</div></div></div>` : ''}
  </div>`;
}
const MN_FACES = [['M', '#8fb3d9'], ['S', '#c9a46a'], ['J', '#a7c4a0'], ['P', '#c48f9a'], ['L', '#b3a6d9']];
function nightV2() {
  return `<div class="card" style="height:1920px">${still3(BACK.arrival, { clear: 16, solid: 40 })}
  <div class="in" style="${PAD3}">${head3('Movie night')}
  <div style="margin-top:70px">${appTicket({ still: BACK.arrival, title: 'Arrival', meta: '2016 · Denis Villeneuve', date: 'Fri 13 Nov', runtime: '1h 56m', admit: 5, night: 4, fold: { faces: MN_FACES, line: 'All five got their mood' } })}</div>
  <div ${tx(INK)} style="font:400 40px/1.3 Newsreader;color:${INK};margin-top:44px">The Midnight Society · 4 of 5 voted for it</div>
  <div style="margin-top:auto">${stub3(q3('Start your<br>own night'), 'maya')}</div>
  </div></div>`;
}
function tonightV2() {
  return `<div class="card" style="height:1920px">${still3(BACK.arrival, { pos: 'center 40%', clear: 16, solid: 40 })}
  <div class="in" style="${PAD3}">${head3("Tonight's pick")}
  <div style="margin-top:110px">${appTicket({ still: BACK.arrival, title: 'Arrival', meta: '2016 · Denis Villeneuve', date: 'Fri 13 Nov', runtime: '1h 56m', admit: 1 })}</div>
  <div style="display:flex;align-items:baseline;gap:20px;margin-top:56px"><div class="bod" ${tx(BLUE, 'big')} style="font-size:96px;line-height:1;color:${BLUE}">91%</div><div ${tx(INK)} style="font:400 42px Newsreader;color:${INK}">match for Maya</div></div>
  <div style="margin-top:auto">${stub3(q3("What's on<br>tonight?"), 'maya')}</div>
  </div></div>`;
}
function listV2() {
  const ids = [FILM.mood, FILM.her, FILM.pastlives, FILM.moonlight, FILM.portrait];
  return `<div class="card" style="height:1920px">${still3(BACK.mood, { pos: 'center 35%', clear: 18, solid: 36 })}
  <div class="in" style="${PAD3}">${lockup3()}
  ${caps3(28, 'Ranked list · 12 films', 'margin-top:220px')}
  <div class="bod" ${tx(INK, 'big')} style="font-size:110px;line-height:1.04;letter-spacing:-2px;margin-top:16px;color:${INK}">Rainy Sunday films</div>
  ${tick(32)}
  <div style="display:flex;align-items:center;gap:20px;margin-top:36px">${face('M', '#8fb3d9', 60).replace('color:#efe8da', 'color:#141210')}<div ${tx(INK)} style="font:400 38px Newsreader;color:${INK}">@maya</div></div>
  <div style="display:flex;gap:18px;margin-top:40px">${ids.map((p, i) => `<div class="gp" style="width:168px;height:252px;background-image:url(${T(p)});position:relative"><span class="bod" style="position:absolute;left:8px;top:8px;background:rgba(0,0,0,.72);padding:2px 12px;font-size:38px;border-radius:4px">${i + 1}</span></div>`).join('')}</div>
  <div style="margin-top:auto">${stub3(q3('What would<br>you rank?'), 'maya')}</div>
  </div></div>`;
}

// ---------- the screen: dark drawer bar (the share sheet's ground), the app's own share tiles ----------
const PEOPLE2 = [['Sam', '#c9a46a', 0], ['Jordan', '#a7c4a0', 0], ['Friday crew', '#8fb3d9', 1], ['Priya', '#c48f9a', 0], ['Lee', '#b3a6d9', 0], ['Film club', '#d9b38f', 1]];
const SEARCH2 = '<svg viewBox="0 0 24 24" fill="none" stroke="#efe8da" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>';
const LINK2 = '<svg viewBox="0 0 24 24" fill="none" stroke="#efe8da" stroke-width="2" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>';
const MORE2 = '<svg viewBox="0 0 24 24" fill="#efe8da"><circle cx="5.5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="18.5" cy="12" r="1.9"/></svg>';
const T2 = { ...TARGETS,
  story: ['Instagram Story', 'background:radial-gradient(circle at 30% 107%,#feda75 0%,#fa7e1e 25%,#d62976 50%,#962fbf 75%,#4f5bd5 100%)', TARGETS.story[2].replace('#F3EEE4', '#141417')],
  post: ['Instagram post', 'background:radial-gradient(circle at 30% 107%,#feda75 0%,#fa7e1e 25%,#d62976 50%,#962fbf 75%,#4f5bd5 100%)', TARGETS.post[2]],
  copy: ['Copy link', 'background:rgba(255,255,255,.04);box-shadow:inset 0 0 0 1px #3a3a3e', LINK2],
  tiktok: ['TikTok', 'background:#000;box-shadow:inset 0 0 0 1px #3a3a3e', TARGETS.tiktok[2]],
  more: ['More', 'background:rgba(255,255,255,.04);box-shadow:inset 0 0 0 1px #3a3a3e', MORE2] };
function barV2(keys = ALL) {
  const faces = PEOPLE2.map(([n, c, grp]) => `<div class="tile f"><div class="c" style="width:48px;height:48px;border-radius:${grp ? '6px' : '6px'};background:${c};font:600 15px/1 Inter;color:#141210">${n[0]}</div><div class="l">${n}</div></div>`).join('');
  const search = `<div class="tile f"><div class="c" style="width:48px;height:48px;border-radius:6px;background:rgba(255,255,255,.04);box-shadow:inset 0 0 0 1px #3a3a3e">${SEARCH2}</div><div class="l">Search</div></div>`;
  const ext = keys.map((k) => { const [l, bg, g] = T2[k]; return `<div class="tile"><div class="c" style="${bg}">${g}</div><div class="l">${l}</div></div>`; }).join('');
  return `<div class="ss-bar v2"><div class="v2-k">Send in Montage</div><div class="ss-row v2-in">${faces}${search}</div><div class="v2-rule"></div><div class="ss-row v2-out">${ext}</div><div class="v2-fade"></div><div class="homeb"></div></div>`;
}
const X2 = '<div class="v2-x"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></div>';
function screenV2({ card, title }) {
  const s = 393 / 1080;
  return `<div class="ss-card" style="top:0;height:699px"><div style="transform:scale(${s});transform-origin:0 0;width:1080px;height:1920px;position:relative">${card}</div></div>
  ${chrome}${X2}<div class="v2-t"><span>${title}</span></div>${barV2()}`;
}
const cardBox2 = (card, w) => `<div class="cbox" style="width:${w}px;height:${Math.round(w * 16 / 9)}px"><div style="transform:scale(${w / 1080});transform-origin:0 0;width:1080px;height:1920px;position:relative">${card}</div></div>`;
