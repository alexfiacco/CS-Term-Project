// Generates brand-remock-v1.html (owner remock of tick usage, chosen chips and tags, plus Our read today).
// node mockups/journeys/brand-remock-v1.gen.js && node mockups/journeys/brand-v2b-render.js brand-remock-v1
// Layouts follow montage origin/main 1d83a2cb: TagPage.tsx, Result.tsx (why3 drawer, fd-pc card), FilmHero.tsx,
// SortFilter.tsx (Filters sheet), Tonight.tsx (moods), FilmScreen.swift (LaneChip, WhySheet), globals.css.
const fs = require('fs');
const path = require('path');

const T = (id) => `../img/tmdb/${id}.jpg`;
const P = {
  pastlives: T('k3waqVXSnvCZWfJYNtdamTgTtTA'), sunrise: T('kf1Jb1c2JAOqjuzA3H4oDM263uB'), mood: T('iYypPT4bhqXfq1b6EnmxvRt6b2Y'),
  cmbyn: T('mZ4gBdfkhP9tvLH1DO4m4HYtiyi'), aftersun: T('evKz85EKouVbIr51zy5fOtpNRPg'), parasite: T('7IiTTgloJzvGI1TAYymCfbfl3vT'),
  dune: T('1pdfLvkbY9ohJlCjQH2CZjjYVvJ'), br: T('gajva2L0rPYkEWjzgFlBXCAVBE5'), prisoners: '../img/prisoners.png',
  goodfellas: T('9OkCLM73MIU2CrKZbqiT8Ln1wY2'), godfather: T('3bhkrj58Vtu7enYsRolD1fZdja1'), heat: T('e09dLw1Ljtccd2P4NsuUvVtS5du'),
  oldboy: T('pWDtjs568ZfOTMbURQBYuT4Qxka'), nocountry: T('6d5XOczc226jECq0LIX0siKtgHR'), whiplash: T('7fn624j5lj3xTme2SgiLCeuedmO'),
  moonlight: T('qLnfEmPrDjJfPyyddLJPkXmshkp'), anatomy: T('1ho0d4LNZw3Y0voeKmSvPSgJOJ2'), madmax: T('hA2ple9q4qnwxp3hKVNhroipsir'),
  samurai: T('lOMGc8bnSwQhS4XyE1S99uH8NXf'), shining: T('uAR0AWqhQL1hQa69UDEbb2rE5Wx'), substance: T('lqoMzCcZYEFK729d6qzt349fB4o'),
  casablanca: T('lGCEKlJo2CnWydQj7aamY7s1S7Q'), budapest: T('eWdyYQreja6JGCzqHWXpWHDrrPo'), her: T('eCOtqtfvn7mxGl6nfmq4b1exJRc'),
  midsommar: '../img/midsommar.png', witch: '../img/witch.png', wickerman: '../img/wickerman.png', hereditary: '../img/hereditary.png',
  suspiria: '../img/suspiria.png', wailing: '../img/wailing.png', spirited: T('39wmItIWsg5sZMyRUHLkWBcuVCM'), lalaland: T('uDO8zWDhfWwoFdKS4fzkUJt0Rf0'),
};

const ico = {
  back: '<path d="m15 18-6-6 6-6"/>',
  share: '<path d="M12 3v12"/><path d="m8 7 4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  menu: '<path d="M5 9h14M5 15h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  chat: '<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 10.5h8M8 13.5h5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
  pop: '<path d="M6 9h12l-1.5 11h-9z"/><path d="M8 9a2 2 0 1 1 3-2 2 2 0 1 1 3 0 2 2 0 1 1 3 2"/><path d="M10 9l.5 11M14 9l-.5 11"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21 20c0-2.8-1.8-5-4.5-5.7"/>',
  masks: '<path d="M4 5c3 1 6 1 9 0v6a4.5 4.5 0 0 1-9 0z"/><path d="M13 9c2 .7 4.5.7 7 0v5a4.5 4.5 0 0 1-6.7 3.9"/><path d="M6.5 9h.01M10 9h.01M7 12.5c.8.7 2 .7 2.8 0"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  bookmark: '<path d="M6 4h12v17l-6-4-6 4z"/>',
  play: '<path d="M7 4.5v15l12-7.5z"/>',
  check: '<path d="M3.5 8.5l3 3 6-7"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
};
const svg = (k, cls = 'svg', vb = '0 0 24 24') => `<svg class="${cls}" viewBox="${vb}">${ico[k]}</svg>`;
const circ = (k) => `<span class="icirc">${svg(k)}</span>`;
const sb = (t = '9:41') => `<div class="sb"><span>${t}</span><span class="sb-r"><i style="width:17px;height:11px"></i><i style="width:15px;height:11px;border-radius:3px"></i><i style="width:25px;height:12px;border-radius:4px;opacity:.9"></i></span></div>`;
const po = (src, extra = '', badge = '') => `<span class="pimg ${extra}"><img src="${src}" alt="">${badge}</span>`;
const ph = (title) => `<span class="pimg ph-po"><span>${title}</span></span>`;
const wm = `<div class="hdr"><span class="wm"><img src="../img/montage-fan.svg" width="34" height="34" alt="">Montage</span><span class="hdr-r">${svg('chat')}<span class="icirc big">${svg('menu')}</span></span></div>`;
const nav = (on) => {
  const it = (k, l) => `<span class="nv${on === l ? ' on' : ''}">${svg(k)}<b>${l}</b></span>`;
  return `<div class="nav">${it('pop', 'Picks')}${it('search', 'Browse')}<span class="nv-tn">${svg('moon')}</span>${it('users', 'Social')}${it('masks', 'Profile')}</div>`;
};
const tick = (html, on, cls = 'rdu') => (on ? `<span class="${cls}">${html}</span>` : html);

// Tags: "now" styles as on main, and the proposed one quiet tag.
const tagNowLane = (n) => `<span class="tn-lane">${n}<i>›</i></span>`;      // iPhone LaneChip: filled box + chevron
const tagNowTheme = (n) => `<span class="tn-theme">${n}</span>`;            // FilmThemeChips: outlined box, no chevron
const tagNowProf = (n) => `<span class="tn-prof">${n}</span>`;              // profile's lanes: muted box
const tagNew = (n) => `<span class="tg">${n}<i>›</i></span>`;

// ───────── Screens ─────────
function profile({ nameTick = false, lanes = 'now', compact = false } = {}) {
  const L = ['Slow-Burn Folk Horror', 'Organized Crime Family Saga', 'Personal Revenge Thriller', 'Class Warfare Satire'];
  const lane = lanes === 'now' ? tagNowProf : tagNew;
  return `<div class="ph scr">${sb()}<div class="wrap">${wm}<div class="hr0"></div>
    <div class="pf-row"><span class="pf-av"><img src="../img/owner-avatar-profile.jpg" alt=""><span class="pf-ed">${svg('pencil')}</span></span>
      <div><div class="pf-nm">${tick('Alex Fiacco', nameTick)}</div><div class="pf-h">@alexfiacco</div></div></div>
    <div class="pf-f"><b>14</b> followers · <b>16</b> following</div>
    <div class="pf-bio">creator of Montage</div>
    <div class="pf-streak"><span class="reel"><i></i><i></i><i></i></span>4-week streak</div>
    <div class="pf-btns"><span>Edit profile</span><span>Share card</span></div>
    <div class="tabs"><span class="on">Taste</span><span>Films</span><span>Watchlist</span><span>History</span></div>
    ${compact ? '' : `<div class="arch"><div class="eyebrow">Your cinema archetype</div><div class="arch-n">Nihilist <i>›</i></div>
      <div class="arch-s">Streaks of <u>Tenderhearted</u> and <u>IMAX Idealist</u></div></div>
    <div class="mix"><i style="flex:45"></i><i style="flex:22"></i><i style="flex:31"></i></div>
    <div class="mix-l">Your mix<span>›</span></div>`}
    ${compact ? `<div class="arch sm"><div class="eyebrow">Your cinema archetype</div><div class="arch-n">Nihilist <i>›</i></div></div>` : ''}
    <div class="eyebrow" style="margin:${compact ? 22 : 16}px 0 10px">Your lanes</div>
    <div class="row">${L.map(lane).join('')}</div>
    ${compact ? `<div class="eyebrow" style="margin:22px 0 10px">Stories you go for</div><div class="row">${['Morally gray protagonist', 'Grounded realism', 'Bleak ending'].map(lanes === 'now' ? tagNowTheme : tagNew).join('')}</div>` : ''}
  </div>${nav('Profile')}</div>`;
}

const READ_AFTER = 'You gave it 4.5, about where we had it. The restraint you liked in In the Mood for Love is the whole film here, and the last walk to the car is the kind of ending you rate highest: nothing said, everything settled.';
const READ_BEFORE = 'You go for quiet films about the life you didn\'t live: the long walks of Before Sunrise, the restraint of In the Mood for Love, the ache in Aftersun that never says itself. Past Lives is all three, two people across twenty-four years, and an ending that does almost nothing and lands hard.';
const CAV_BEFORE = 'It is slow and very talky. If you want the story to turn, it never quite does.';
const CAV_AFTER = 'The New York middle stretch is the part people with your taste rate lowest.';
const anchors = (big = false) => `<div class="why-like"><div class="why-like-h"><span class="t-label">Because you enjoyed</span><span class="cap-n">4 films</span></div>
  <div class="why-po">${[[P.sunrise, '5'], [P.mood, '4.5'], [P.aftersun, '5'], [P.cmbyn, '4']].map(([s, r]) => po(s, 'w64', `<b class="badge">${r}★</b>`)).join('')}</div></div>`;

// Film page behind a drawer (dimmed).
const filmBehind = (src, title, meta) => `<div class="fb"><div class="fb-bd" style="background-image:url(${src})"></div>
  <div class="wrap" style="position:relative;padding-top:50px"><div class="toprow">${circ('back')}${circ('share')}</div>
  <div style="height:40px"></div>${po(src, 'hero')}<div class="ft">${title}</div><div class="cap1">${meta}</div></div></div>`;

// The Our read drawer (why3), rated. ourTick: the second tick under "Our read" (now on main).
function ourReadDrawer({ ourTick = true, fold = false, top = 236 } = {}) {
  return `<div class="dr sheet" style="top:${top}px"><div class="grab"></div>
    <div class="w3-hd">${po(P.pastlives, 'w46')}<div class="w3-t rdu-b"><div class="w3-title">Past Lives</div><div class="w3-meta">2023 · Celine Song</div></div>${circ('x')}</div>
    <div class="w3-strip"><span class="w3-big">4.5<small>★</small></span><span class="w3-v${ourTick ? ' rdu-b' : ''}"><b>Our read</b><span>We predicted 88% · Called it</span></span><span class="w3-share">${svg('share')}Share</span></div>
    <p class="w3-read">${READ_AFTER}</p>
    <p class="w3-cav"><b>Where it might lose you</b>${CAV_AFTER}</p>
    ${fold ? `<div class="wb open"><div class="wb-top"><span class="wb-t"><b>What we said before</b><span class="said"><span class="hwd on">${svg('check', 'svg', '0 0 16 16')}</span>Called it</span></span><span class="wb-n">88%</span><span class="wb-ch">⌄</span></div>
      <div class="wb-body"><div class="tile-h">Why this fits your taste</div><p>${READ_BEFORE}</p><p class="wb-cav"><b>Where it might lose you</b>${CAV_BEFORE}</p></div></div>` : `<div class="wb"><div class="wb-top"><span class="wb-t"><b>What we said before</b><span class="said"><span class="hwd on">${svg('check', 'svg', '0 0 16 16')}</span>Called it</span></span><span class="wb-n">88%</span><span class="wb-ch">›</span></div></div>`}
    ${anchors()}
  </div>`;
}

function ratingDrawerScreen({ ourTick }) {
  return `<div class="ph scr">${sb()}${filmBehind(P.pastlives, 'Past Lives', '2023 · 1h 46m · PG-13 · Drama, Romance')}<div class="scrim"></div>${ourReadDrawer({ ourTick, top: 150 })}</div>`;
}

function personPage({ where }) {
  // where: 'role' (now: tick under the role line) | 'title' (proposed: tick under the name)
  return `<div class="ph scr">${sb()}<div class="wrap"><div class="toprow">${circ('back')}${circ('share')}</div>
    <div class="tp-person"><span class="tp-face">DV</span><div class="tp-id"><div class="tp-h1">${tick('Denis Villeneuve', where === 'title')}</div>
      <div class="tp-line">${tick('Director, writer · 1998 to 2026', where === 'role')}</div></div></div>
    <div class="stats"><div><b>3.9<small>★</small></b><span>crowd avg</span></div><div><b>4.3<small>★</small></b><span>your avg here</span></div><div><b>6</b><span>seen of 12</span></div><div><b>94<small>%</small></b><span>best match</span></div></div>
    <div class="tabs"><span class="on">Directed <em>12</em></span><span>Wrote <em>9</em></span></div>
    <div class="h2" style="margin-top:18px">Best for you</div>
    <div class="seg"><span>Unseen</span><span class="on">Seen</span><span>All</span></div>
    <div class="ctl"><span class="c0"><span class="k">Sort</span>Best for you ▾</span><span class="c0">Filters</span><span class="vt"><span class="on">${svg('grid')}</span><span>${svg('list')}</span></span></div>
    <div class="note2">6 seen. Your rating on each poster.</div>
  </div>
  <div class="pgrid">${[[P.dune, '5'], [P.br, '4.5'], [P.prisoners, '4.5']].map(([s, r]) => po(s, '', `<b class="badge">${r}★</b>`)).join('')}${ph('Sicario')}${ph('Arrival')}${ph('Enemy')}${ph('Incendies')}${ph('Polytechnique')}</div>${nav('Browse')}</div>`;
}

function lanePage({ where }) {
  // where: 'kind' (now: tick under "Lane · 25 films") | 'title' (proposed: under the lane's name)
  return `<div class="ph scr">${sb()}<div class="wrap"><div class="toprow">${circ('back')}<span style="display:flex;gap:8px">${circ('info')}${circ('share')}</span></div>
    <div class="tp-h1 lane">${tick('Slow-Burn Folk Horror', where === 'title')}</div>
    <div class="tp-kind">${tick('Lane · 25 films', where === 'kind', 'rdu-b')}</div>
    <p class="tp-blurb">Isolated villages, old rites and a dread that arrives in daylight. Patient pacing, and a last act that doesn't look away.</p>
    <div class="stats"><div><b>3.7<small>★</small></b><span>crowd avg</span></div><div><b>4.1<small>★</small></b><span>your avg here</span></div><div><b>6</b><span>seen of 25</span></div></div>
    <div class="seg" style="margin-top:18px"><span class="on">Unseen</span><span>Seen</span><span>All</span></div>
    <div class="ctl"><span class="c0"><span class="k">Sort</span>Best for you ▾</span><span class="c0">Filters</span><span class="vt"><span class="on">${svg('grid')}</span><span>${svg('list')}</span></span></div>
  </div>
  <div class="pgrid" style="margin-top:14px">${[[P.midsommar, '93%'], [P.witch, '91%'], [P.wickerman, '88%'], [P.hereditary, '87%'], [P.suspiria, '84%'], [P.wailing, '83%']].map(([s]) => po(s)).join('')}${ph('Kill List')}${ph('Apostle')}</div>${nav('Browse')}</div>`;
}

// Section 2: chosen state variants. v: 'now' | 'a' | 'b'
function filterSheet(v) {
  const on = (t) => `<span class="ch on">${t}</span>`; const off = (t) => `<span class="ch">${t}</span>`;
  const setv = (t) => `<span class="fs-set">${t}</span>`;
  const row = (k, val, open = false) => `<div class="fs-row"><span class="fs-k">${k}</span>${val}<span class="fs-chev">${open ? '▴' : '▾'}</span></div>`;
  return `<div class="ph scr v-${v}">${sb()}<div class="wrap"><div class="bh">${tick('Browse', true)}</div><div class="srch">${svg('search')}Films, people, themes</div>
    <div class="ctl"><span class="c0"><span class="k">Sort</span>Best for you ▾</span><span class="ch on">Filters · 3</span></div></div>
    <div class="pgrid" style="margin-top:12px">${[P.godfather, P.goodfellas, P.heat, P.nocountry, P.oldboy, P.parasite, P.prisoners, P.br].map((s) => po(s)).join('')}</div>
    <div class="scrim"></div>
    <div class="dr sheet" style="top:118px"><div class="grab"></div>
      <div class="dr-h"><span class="fs-t rdu-b"><span class="fs-h">Filters</span><span class="fs-kick">Browse · Every film · <b>3 set</b></span></span>${circ('x')}</div>
      ${row('Streaming', setv('Netflix, Max'))}
      ${row('Status', '<span class="fs-v">Any</span>')}
      <div class="fs-gh">The film</div>
      ${row('Genre', setv('Crime, Thriller'), true)}
      <div class="fs-open"><div class="row">${off('Drama')}${on('Crime')}${on('Thriller')}${off('Horror')}${off('Comedy')}${off('Romance')}${off('Sci-fi')}${off('Animation')}${off('War')}${off('Documentary')}</div></div>
      ${row('Decade', setv('1990s'))}
      ${row('Length', '<span class="fs-v">Any</span>')}
      ${row('Language', '<span class="fs-v">Any</span>')}
      <div class="fs-gh">Feel</div>
      ${row('Mood', '<span class="fs-v">Any</span>')}
      <div class="fs-ft"><span class="fs-clear">Clear</span><span class="fs-show">Show 214 films<span> · 3 filters</span></span></div>
    </div></div>`;
}
function tonightSheet(v) {
  const on = (t) => `<span class="ch on">${t}</span>`; const off = (t) => `<span class="ch">${t}</span>`;
  return `<div class="ph scr v-${v}">${sb()}<div class="wrap">${wm}<div class="tabs" style="margin-top:6px"><span class="on">For You</span><span>New Releases</span><span>This Week</span></div></div>
    <div class="scrim"></div>
    <div class="dr sheet" style="top:96px"><div class="grab"></div>
      <div class="dr-h"><span class="rdu-b"><span class="dr-t">Tonight</span><span class="dr-sub">What are we watching?</span></span>${circ('x')}</div>
      <div class="ql">Who's watching</div>
      <div class="segm"><span class="on">Just me</span><span>Date night</span><span>Friends</span></div>
      <div class="ql">In the mood for</div>
      <div class="row">${off('Cozy')}${off('Feel-good')}${on('Funny')}${off('Moving')}${on('Tense')}${off('Scary')}${off('Slow burn')}${off('Mind-bending')}<span class="ch dash">+ 12 more</span></div>
      <div class="ql">How long</div>
      <div class="row">${off('Under 1h 40')}${on('Under 2h')}${off('Any length')}</div>
      <div class="ql">Streaming on</div>
      <div class="row">${on('Netflix')}${on('Max')}${off('Prime Video')}${off('Mubi')}${off('Criterion')}</div>
      <div class="ql">New or rewatch</div>
      <div class="segm"><span class="on">New to me</span><span>Rewatch</span><span>Either</span></div>
      <div class="tn-cta">Pick for me</div>
    </div></div>`;
}

// Section 3 / 4: the film page.
function filmPage({ tags = 'now', tabsOn = 'Themes', rated = false, scroll = 'top' } = {}) {
  const lanes = ['Second-Chance Romance', 'Immigrant Identity Dramas', 'Quiet Longing'];
  const themes = ['Fate and chance', 'Love across time', 'Immigration', 'Bittersweet', 'Restraint', 'Childhood bond'];
  const L = tags === 'now' ? tagNowLane : tagNew; const Th = tags === 'now' ? tagNowTheme : tagNew;
  const more = tags === 'now' ? '<span class="tn-lane">+2</span>' : '<span class="tg">+2</span>';
  const head = `<div class="fh"><div class="fh-bd" style="background-image:url(${P.pastlives})"></div>
    <div class="wrap" style="position:relative">${sb()}<div class="toprow">${circ('back')}${circ('share')}</div><div style="height:${scroll === 'top' ? 14 : 30}px"></div>
    <div class="fh-row">${po(P.pastlives, 'hero')}<span class="trailer">${svg('play')}Trailer</span></div></div></div>`;
  const rating = `<div class="fd-card"><div class="fd-rh"><span class="fd-rl">Your rating</span><span class="fd-lb"><b>4.0★</b> on Letterboxd</span></div>
    <div class="fd-stars"><span class="stars">${[1, 2, 3, 4, 5].map((i) => `<span class="st${rated && i <= 4 ? ' on' : ''}${rated && i === 5 ? ' half' : ''}">★</span>`).join('')}</span><span class="pop">Well loved</span></div>
    ${rated
      ? `<div class="fd-pc"><span class="pc-pct">88<small>%</small></span><span class="pc-t"><span class="pc-k">Our read</span><span class="pc-v"><span class="stamp">Spot on</span><span class="pc-sub">· you gave it 4.5★</span></span></span>${svg('chev', 'svg pc-chev')}</div>`
      : `<div class="fd-pc"><span class="pc-pct">88<small>%</small></span><span class="pc-t"><span class="pc-k">Our read</span><span class="pc-v">We think you'll love it</span></span>${svg('chev', 'svg pc-chev')}</div>`}
    <div class="fd-btns"><span class="${rated ? 'on' : ''}">${svg('eye')}Seen</span><span>${svg('bookmark')}${rated ? 'Rewatch' : 'Watchlist'}</span></div>
    ${rated ? '<div class="fd-watches"><span>Watched once · Nov 2, 2026</span><span class="lg">+ Log a watch</span></div>' : ''}</div>`;
  return `<div class="ph scr fp">${head}<div class="wrap">
    <div class="ft">Past Lives</div><div class="cap1">2023 · 1h 46m · PG-13 · Drama, Romance</div><div class="cap1">Directed by <b>Celine Song</b></div>
    ${scroll === 'rating' ? '' : `<div class="row lanes">${lanes.map(L).join('')}${more}</div>`}
    ${scroll === 'rating' ? rating : `<p class="syn">Nora and Hae Sung, two deeply connected childhood friends, are wrested apart after Nora's family emigrates from South Korea. Twenty years later, they are reunited for one fateful week.</p>
    <div class="tabs"><span${tabsOn === 'Themes' ? ' class="on"' : ''}>Themes</span><span>Cast</span><span>Crew</span><span>Details</span></div>
    <div class="row" style="margin-top:14px">${themes.map(Th).join('')}</div>`}
  </div>${nav('Picks')}</div>`;
}

function whyDrawerBefore() {
  return `<div class="ph scr">${sb()}${filmBehind(P.pastlives, 'Past Lives', '2023 · 1h 46m · PG-13 · Drama, Romance')}<div class="scrim"></div>
  <div class="dr sheet" style="top:150px"><div class="grab"></div>
    <div class="w3-hd">${po(P.pastlives, 'w46')}<div class="w3-t rdu-b"><div class="w3-title">Past Lives</div><div class="w3-meta">2023 · Celine Song</div></div>${circ('x')}</div>
    <div class="w3-strip"><span class="w3-big">88<small>%</small></span><span class="w3-v"><b>Why this fits your taste</b><span>Your match</span></span></div>
    <p class="w3-read">${READ_BEFORE}</p>
    <p class="w3-cav"><b>Where it might lose you</b>${CAV_BEFORE}</p>
    ${anchors()}
  </div></div>`;
}
function ourReadAfter() {
  return `<div class="ph scr">${sb()}${filmBehind(P.pastlives, 'Past Lives', '2023 · 1h 46m · PG-13 · Drama, Romance')}<div class="scrim"></div>${ourReadDrawer({ ourTick: true, fold: true, top: 64 })}</div>`;
}


// ───────── Section 5: profile header A ─────────
const SYM = `<svg width="0" height="0" style="position:absolute"><defs>
  <symbol id="strip" viewBox="0 0 16 16"><rect x="1" y="3" width="14" height="10" rx="2" fill="none" stroke="#a9a69e" stroke-width="1.2"/><rect x="3.5" y="5.5" width="4" height="5" rx=".8" fill="#c24c56"/><rect x="8.5" y="5.5" width="4" height="5" rx=".8" fill="#5a86bd"/></symbol>
  <symbol id="ring" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="#3a3a3e" stroke-width="2"/><circle cx="8" cy="8" r="6" fill="none" stroke="#8fb3d9" stroke-width="2" stroke-dasharray="26 38" stroke-linecap="round" transform="rotate(-90 8 8)"/></symbol></defs></svg>`;
const more = '<svg class="svg" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>';
const archBlock = (who) => `<div class="arch"><div class="eyebrow">${who} cinema archetype</div><div class="arch-n">${who === 'Your' ? 'Nihilist' : 'Animation Devotee'} <i>›</i></div>
  <div class="arch-s">Streaks of <u>${who === 'Your' ? 'Tenderhearted' : 'Feel-Good Loyalist'}</u></div></div>`;
function profileNowOther() {
  return `<div class="ph scr">${sb()}<div class="wrap">${wm}<div class="hr0"></div>
    <div class="toprow" style="margin-top:8px">${circ('back')}<span class="icirc">${more}</span></div>
    <div class="pf-row" style="margin-top:12px"><span class="face-j">J</span><div><div class="pf-nm">Jacob Fiacco</div><div class="pf-h">@jacobfiacco</div></div></div>
    <div class="pf-f"><b>3</b> followers · <b>2</b> following</div>
    <div class="pf-btns" style="grid-template-columns:1fr 1fr 44px"><span>✓ Following</span><span>Share profile</span><span style="border-radius:50%">${svg('users')}</span></div>
    <div class="blend-now"><span class="pc">94%</span><span class="tx">Blend with you</span><span class="go">See the breakdown<i>›</i></span></div>
    <div class="tabs"><span class="on">Taste</span><span>Films</span><span>History</span></div>
    ${archBlock("Jacob's")}
  </div>${nav('Social')}</div>`;
}
function profileA(own) {
  const top = own
    ? `<div class="hA-top"><div class="hA-face"><img src="now/bp2-alex-face.jpg" alt=""></div><div><div class="pf-nm">${tick('Alex Fiacco', true)}</div>
        <div class="hA-figs"><div><b>1,260</b><span>Films</span></div><div><b>14</b><span>Followers</span></div><div><b>17</b><span>Following</span></div></div></div></div>
      <div class="hA-cred">@alexfiacco · <b>Nihilist</b></div>
      <div class="hA-bio">founder of Montage. got tired of searching for something to watch, so I built this 🍿</div>
      <div class="bdgs"><span class="bdg"><svg><use href="#strip"/></svg>4-week streak</span><span class="bdg"><svg><use href="#ring"/></svg><span>76<span class="of">/110 films</span></span></span></div>
      <div class="acts"><span class="btn cream">${svg('share')}Share your card</span><span class="tl">Edit</span></div>
      <div class="tabs"><span class="on">Taste</span><span>Films</span><span>Watchlist</span><span>History</span></div>${archBlock('Your')}`
    : `<div class="toprow" style="margin-top:8px">${circ('back')}<span class="icirc">${more}</span></div>
      <div class="hA-top" style="margin-top:8px"><div class="hA-face">J</div><div><div class="pf-nm">${tick('Jacob Fiacco', true)}</div>
        <div class="hA-figs"><div><b>677</b><span>Films</span></div><div><b>3</b><span>Followers</span></div><div><b>2</b><span>Following</span></div></div></div></div>
      <div class="hA-cred">@jacobfiacco · <b>Animation Devotee</b></div>
      <div class="hA-bio">mostly Ghibli, some Pixar, no horror please</div>
      <div class="bdgs"><span class="bdg"><svg><use href="#strip"/></svg>2-week streak</span><span class="bdg"><svg><use href="#ring"/></svg><span>41<span class="of">/60 films</span></span></span></div>
      <div class="acts"><span class="btn ol grow">✓ Following</span><span class="icirc" style="width:44px;height:44px">${svg('share')}</span></div>
      <div class="blend"><span class="pc">95%</span><span class="tx">Blend with you</span><span class="go">See breakdown<i>›</i></span></div>
      <div class="tabs"><span class="on">Taste</span><span>Films</span><span>History</span></div>${archBlock("Jacob's")}`;
  return `<div class="ph scr">${sb()}<div class="wrap">${wm}<div class="hr0"></div>${top}</div>${nav(own ? 'Profile' : 'Social')}</div>`;
}

// ───────── Section 6: stats on person / lane / theme pages ─────────
const PAGES = {
  person: { title: 'Quentin Tarantino', line: 'Director, actor, writer, producer · 1992 to 2026', crowd: '3.6', you: '4.0', seen: 12, of: 44, best: 95, tabs: '<span class="on">Directed <em>13</em></span><span>Acted <em>38</em></span><span>Wrote <em>17</em></span>',
    posters: [ph('Pulp Fiction'), ph('Django Unchained'), ph('Inglourious Basterds'), ph('Kill Bill: Vol. 1'), ph('Reservoir Dogs'), ph('Jackie Brown'), ph('Once Upon a Time in Hollywood'), ph('The Hateful Eight')] },
  lane: { title: 'Organized Crime Family Saga', kind: 'Lane · 31 films', blurb: 'Families built on loyalty and blood money, told across decades: the rise, the rot, and who is left at the table.', crowd: '3.8', you: '4.4', seen: 9, of: 31, best: 96,
    posters: [po(P.godfather), po(P.goodfellas), ph('The Godfather Part II'), ph('Casino'), ph('The Irishman'), ph('A Prophet'), ph('Gomorrah'), ph('Eastern Promises')] },
  theme: { title: 'Morally gray protagonist', kind: 'Theme · 412 films', blurb: 'Films whose lead does wrong for reasons you half agree with, and never quite gets forgiven or punished.', crowd: '3.7', you: '3.9', seen: 58, of: 412, best: 97,
    posters: [po(P.nocountry), po(P.prisoners), po(P.oldboy), po(P.heat), po(P.parasite), po(P.whiplash), po(P.godfather), po(P.goodfellas)] },
};
function statsBlock(d, v) {
  if (v === 'now') return `<div class="stats"><div><b>${d.crowd}<small>★</small></b><span>crowd avg</span></div><div><b>${d.you}<small>★</small></b><span>your avg here</span></div><div><b>${d.seen}</b><span>seen of ${d.of}</span></div><div><b>${d.best}<small>%</small></b><span>best match</span></div></div>`;
  if (v === 'a') return `<div class="st-a"><div><b>${d.crowd}★</b><span>Crowd</span></div><div><b class="bl">${d.you}★</b><span>You</span></div><div><b>${d.seen}<small>/${d.of}</small></b><span>Seen</span></div><div><b class="bl">${d.best}%</b><span>Best match</span></div></div>`;
  return `<p class="st-b">You've seen <b>${d.seen}</b> of ${d.of} · you rate them <b class="bl">${d.you}★</b> vs ${d.crowd}★ crowd · best match <b class="bl">${d.best}%</b></p>`;
}
function statsPage(kind, v) {
  const d = PAGES[kind];
  const head = kind === 'person'
    ? `<div class="tp-person"><span class="tp-face">QT</span><div class="tp-id"><div class="tp-h1">${d.title}</div><div class="tp-line"><span class="rdu">${d.line}</span></div></div></div>`
    : `<div class="tp-h1 lane">${tick(d.title, true)}</div><div class="tp-kind">${d.kind}</div><p class="tp-blurb">${d.blurb}</p>`;
  return `<div class="ph scr short">${sb()}<div class="wrap"><div class="toprow">${circ('back')}${circ('share')}</div>${head}${statsBlock(d, v)}
    ${d.tabs ? `<div class="tabs">${d.tabs}</div>` : ''}
    <div class="seg" style="margin-top:16px"><span class="on">Unseen</span><span>Seen</span><span>All</span></div>
    <div class="ctl"><span class="c0"><span class="k">Sort</span>Best for you ▾</span><span class="c0">Filters</span></div></div>
    <div class="pgrid" style="margin-top:14px">${d.posters.join('')}</div></div>`;
}

const col = (cap, rec, phone, shot) => `<div><div class="cap${rec ? ' rec' : ''}">${cap}</div>${shot ? phone.replace('<div class="ph scr', `<div data-shot="${shot}" class="ph scr`) : phone}</div>`;
const decide = (t) => `<p class="decide1">${t}</p>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Brand remock v1</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=Inter:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400..600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="brand-v2-base.css">
<link rel="stylesheet" href="brand-remock-v1.css">
</head>
<body>${SYM}<div class="page">
<h1>Brand remock v1</h1>
<p class="lede">Your three points as full screens built from main (1d83a2cb), Now beside Proposed, plus Our read as it is today, the profile header and the tag-page stats. Figures are in the sans throughout (no Bodoni numerals).</p>

<section class="sect sx" data-shot="1-accent"><div class="sx-h"><span class="sx-n">1</span>Accent: one tick per screen</div>
<p class="sx-sub">The red/blue tick only under a page title or a drawer title, one per screen; the person page keeps its tick under the role and years line (you like it there). Gone from Our read, "Lane · N films", onboarding, Saved cuts and the Pitch card rules. Tabs keep a plain blue underline.</p>
<div class="grid4">
${col('Now · Profile', false, profile({ nameTick: false }))}
${col('Now · Our read drawer', false, ratingDrawerScreen({ ourTick: true }))}
${col('Now · Person', false, personPage({ where: 'role' }))}
${col('Now · Lane', false, lanePage({ where: 'kind' }))}
</div>
<div class="grid4" style="margin-top:28px">
${col('Proposed · Profile', true, profile({ nameTick: true }))}
${col('Proposed · Our read drawer', true, ratingDrawerScreen({ ourTick: false }))}
${col('Proposed · Person (kept)', true, personPage({ where: 'role' }))}
${col('Proposed · Lane', true, lanePage({ where: 'title' }))}
</div>
${decide('<b>Decide:</b> one tick per screen: under the page or drawer title (profile name, lane name, drawer head), and the person page keeps it under the role line; never inside a block.')}
</section>

<section class="sect sx" data-shot="2-select"><div class="sx-h"><span class="sx-n">2</span>Chosen filters and choices</div>
<p class="sx-sub">The same Browse Filters sheet and Tonight's moods. Unchosen is a quiet outline (no grey fill). Nothing chosen is cream-filled.</p>
<div class="grid3">
${col('Now · Filters', false, filterSheet('now'))}
${col('A · Blue outline, blue words', true, filterSheet('a'))}
${col('B · Deep-blue tint, cream words', true, filterSheet('b'))}
</div>
<div class="grid3" style="margin-top:28px">
${col('Now · Tonight moods', false, tonightSheet('now'))}
${col('A · Blue outline, blue words', true, tonightSheet('a'))}
${col('B · Deep-blue tint, cream words', true, tonightSheet('b'))}
</div>
${decide('<b>Decide:</b> A (outline) or B (tint). Either way unchosen goes to a plain outline; segments keep their solid blue.')}
</section>

<section class="sect sx" data-shot="3-tags"><div class="sx-h"><span class="sx-n">3</span>Lanes and themes: one quiet tag</div>
<p class="sx-sub">Today a lane is a filled box with a chevron, a theme an empty box without one, a profile lane a grey box. Proposed: one small outlined sans pill with ›, no Bodoni, no "#".</p>
<div class="grid4">
${col('Now · Film page', false, filmPage({ tags: 'now' }))}
${col('Proposed · Film page', true, filmPage({ tags: 'new' }))}
${col('Now · Your lanes', false, profile({ lanes: 'now', compact: true }))}
${col('Proposed · Your lanes', true, profile({ lanes: 'new', compact: true }))}
</div>
${decide('<b>Decide:</b> one 28pt outlined pill with › for every lane and theme, on the film page, the person page and the profile.')}
</section>

<section class="sect sx" data-shot="4-ourread"><div class="sx-h"><span class="sx-n">4</span>Our read, before and after you rate · Today</div>
<p class="sx-sub">As it is on main, not a redesign (Result.tsx why3 drawer and the Prediction card; FilmScreen.swift WhySheet; rules 446, 707, 708, 1097 and the 2026-10-28 "What we said before" fold).</p>
<div class="grid4">
${col('Today · Before · Film page', false, filmPage({ scroll: 'rating' }))}
${col('Today · Before · Why drawer', false, whyDrawerBefore())}
${col('Today · After · Film page', false, filmPage({ scroll: 'rating', rated: true }))}
${col('Today · After · Our read, fold open', false, ourReadAfter())}
</div>
${'<p class="note" style="max-width:1100px">The figures (88%, 4.5★) are Bodoni on main; set in the sans here per your note.</p>'}
${decide('<b>For reference:</b> before, the card says 88% and "We think you\'ll love it"; after, the stars, "Spot on · you gave it 4.5★", and the drawer keeps the old read folded under "What we said before".')}
</section>
<section class="sect sx" data-shot="5-header"><div class="sx-h"><span class="sx-n">5</span>Profile header</div>
<p class="sx-sub">Header v3 option A with your notes: no "since", figures in the sans, the cream 1.5pt photo outline kept, streak and film goal as two pills under the bio, "@handle · Nihilist" in plain sans; on someone else's, one 44pt Blend row with no subtext.</p>
<div class="grid4">
${col('Now · Yours', false, profile({ nameTick: false }))}
${col('Proposed · Yours', true, profileA(true))}
${col('Now · Someone else', false, profileNowOther())}
${col('Proposed · Someone else', true, profileA(false))}
</div>
${decide('<b>Decide:</b> ship A as shown (films, followers, following in the sans; pills under the bio; one-row Blend on others).')}
</section>

<section class="sect sx" data-shot="6-stats"><div class="sx-h"><span class="sx-n">6</span>Stats on person, lane and theme pages</div>
<p class="sx-sub">Now: four figures with two-line caps labels (Bodoni on main, sans here). A: four equal columns, one-word labels, "12/44" for seen. B: one quiet sentence.</p>
<div class="grid3">
${col('Now · Person', false, statsPage('person', 'now'))}
${col('A · Four columns', true, statsPage('person', 'a'))}
${col('B · One line', true, statsPage('person', 'b'))}
</div>
<div class="grid3" style="margin-top:28px">
${col('Now · Lane', false, statsPage('lane', 'now'))}
${col('A · Four columns', true, statsPage('lane', 'a'))}
${col('B · One line', true, statsPage('lane', 'b'))}
</div>
<div class="grid3" style="margin-top:28px">
${col('Now · Theme', false, statsPage('theme', 'now'))}
${col('A · Four columns', true, statsPage('theme', 'a'))}
${col('B · One line', true, statsPage('theme', 'b'))}
</div>
${decide('<b>Decide:</b> A (tidy columns, scannable) or B (a sentence, quietest). Blue only on what is about you: your average and your best match.')}
</section>
</div></body></html>`;

fs.writeFileSync(path.join(__dirname, 'brand-remock-v1.html'), html);
console.log('wrote brand-remock-v1.html');
