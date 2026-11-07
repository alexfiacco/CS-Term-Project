// pitch-options-v1: builds the phones into [data-ph] slots. Posters from ../img/tmdb (as owner-v1.js).
(function () {
  const T = '../img/tmdb/';
  const P = { DUNE: '1pdfLvkbY9ohJlCjQH2CZjjYVvJ', HER: 'eCOtqtfvn7mxGl6nfmq4b1exJRc', PARA: '7IiTTgloJzvGI1TAYymCfbfl3vT', WHIP: '7fn624j5lj3xTme2SgiLCeuedmO',
    LALA: 'uDO8zWDhfWwoFdKS4fzkUJt0Rf0', BR: 'gajva2L0rPYkEWjzgFlBXCAVBE5', MOON: 'qLnfEmPrDjJfPyyddLJPkXmshkp', AMEL: 'nSxDa3M9aMvGVLoItzWTepQ5h5d',
    HEAT: 'e09dLw1Ljtccd2P4NsuUvVtS5du', GOD: '3bhkrj58Vtu7enYsRolD1fZdja1', EEAAO: 'u68AjlvlutfEIcpmbYpKcdi09ut', SPIR: '39wmItIWsg5sZMyRUHLkWBcuVCM',
    OLD: 'pWDtjs568ZfOTMbURQBYuT4Qxka', CASA: 'lGCEKlJo2CnWydQj7aamY7s1S7Q', MAD: 'hA2ple9q4qnwxp3hKVNhroipsir' };
  const ic = (id, cls = '') => `<svg class="i ${cls}"><use href="#${id}"/></svg>`;
  const status = document.getElementById('t-status').innerHTML;

  const wall = () => `<div class="wall"><div class="grid">${['DUNE','HER','PARA','WHIP','LALA','BR','MOON','AMEL','HEAT','GOD','EEAAO','SPIR','OLD','CASA','MAD']
    .map((k) => `<i style="background-image:url(${T}${P[k]}.jpg)"></i>`).join('')}</div></div>`;
  const askHead = `<div class="hdr"><span class="circ">${ic('back')}</span><span class="caps">Pitch</span></div>
    <div class="ttl rdu-b">Set the scene</div>
    <div class="desc">Describe a mood or a film, and we’ll find the films.</div>`;
  const below = `<div class="takes"><span class="take">${ic('clock')}La La Land but with crime<span class="x">${ic('x')}</span></span><span class="take">${ic('clock')}Something cosy with Holland<span class="x">${ic('x')}</span></span></div>
    <div class="sech">From the writers’ room</div>
    <div class="cards"><div class="icard"><div class="no">Logline 01</div><div class="tx">Something for me and <span class="at">@friend</span></div></div><div class="icard"><div class="no">Logline 02</div><div class="tx">Like Arrival but scarier</div></div><div class="icard"><div class="no">Logline 03</div><div class="tx">Feels like a rainy Sunday</div></div></div>`;
  const KINDS = [['user', 'Person'], ['clap', 'Genre'], ['smile', 'Mood'], ['tv', 'Service'], ['cal', 'Decade'], ['timer', 'Length'], ['lang', 'Language']];
  const opt = ([i, n]) => `<span class="o">${ic(i)}${n}</span>`;
  const onOpt = (i, n) => `<span class="o on">${ic(i)}${n}<span class="x">${ic('x')}</span></span>`;

  const askNow = () => `${wall()}<div class="pg">${askHead}
    <div class="ask"><div class="box">It’s Jaws, but in sp<span class="caret"></span><span class="mic">${ic('mic')}</span></div>
    <div class="action">Action!</div><div class="free">2 free pitches left this month</div></div>${below}</div>`;
  const askNew = () => `${wall()}<div class="pg">${askHead}
    <div class="ask"><div class="box">It’s Jaws, but in sp<span class="caret"></span><span class="mic">${ic('mic')}</span></div>
    <div class="opts">${KINDS.map(opt).join('')}</div>
    <div class="action">Action!</div><div class="free">2 free pitches left this month</div></div>${below}</div>`;
  const askBoth = () => `${wall()}<div class="pg">${askHead}
    <div class="ask"><div class="box typed">Something tense for a Friday night<span class="caret"></span><span class="mic">${ic('mic')}</span></div>
    <div class="picked">${onOpt('user', 'Directed by David Fincher')}${onOpt('clap', 'Thriller')}</div><div class="opts">${KINDS.map(opt).join('')}</div>
    <div class="action">Action!</div><div class="free">2 free pitches left this month</div></div>${below}</div>`;

  // The answer: "Robert Redford on Max" (as the owner's screenshot).
  const films = [
    ['All the President’s Men', 76, '1976 · 2h 18m', 'linear-gradient(#5d5348,#2a2622)', 'Redford leads: tense, brainy newsroom thriller.'],
    ['Three Days of the Condor', 72, '1975 · 1h 57m', 'linear-gradient(#3b4a5c,#1b2129)', 'Redford leads: nail-biting spy thriller.'],
    ['The Sting', 81, '1973 · 2h 9m', 'linear-gradient(#a0703f,#4a3420)', 'Redford and Newman: warm, funny caper.'],
    ['Butch Cassidy and the Sundance Kid', 79, '1969 · 1h 50m', 'linear-gradient(#b08a5a,#5c4428)', 'Redford co-leads: funny, bittersweet western.'],
  ];
  const rows = (n = 4, list = films) => `<div class="rows">${list.slice(0, n).map(([t, m, y, bg, r]) => `<div class="fr"><i style="background:${bg}"></i><div class="w"><b>${t}</b><div class="m"><em>${m}% match</em> · ${y} · <span class="svc"><s>M</s>Max</span></div><div class="r">${r}</div></div></div>`).join('')}</div>`;
  const thr = [films[0], films[1],
    ['Sneakers', 74, '1992 · 2h 6m', 'linear-gradient(#4b5a4a,#1f261f)', 'Redford leads: playful heist thriller.'],
    ['Spy Game', 70, '2001 · 2h 6m', 'linear-gradient(#5a4a3a,#231c16)', 'Redford and Pitt: tense spy thriller.']];
  const rowsT = () => rows(4, thr);
  const ansHead = `<div class="bk"><i></i></div><div class="hdr"><span class="circ">${ic('back')}</span><span class="caps">Your pitch</span><span class="sp"></span><span class="over">Start over</span><span class="circ">${ic('bookmark')}</span><span class="circ">${ic('send')}</span></div>
    <div class="quote">“Robert Redford on Max”</div>`;
  const cutRow = `<div class="cut"><h3>Your cut</h3><span class="n">24 films</span><span class="pk">${ic('ticket')}Pick one for me</span></div>`;
  const nowChips = (open) => `<div class="lbl">Understood as</div><div class="chips"><span class="c on">With Robert Redford<span class="x">×</span></span><span class="c on">On Max<span class="x">×</span></span><span class="c add${open ? ' open' : ''}">+ Add</span></div>`;
  const ansNow = () => `<div class="pg">${ansHead}${nowChips(false)}
    <div class="steer">${ic('cdr')}Steer it: older, shorter, no subtitles</div>${cutRow}${rows(4)}</div>`;
  const strands = (labels) => labels.map((l) => `<span class="strand">${l}<span>↑</span><span>↓</span></span>`).join('');
  const ansNowAdd = () => `<div class="pg">${ansHead}${nowChips(true)}
    <div class="addp"><div class="gh">Mood</div><div class="row">${strands(['Romance', 'Heavy', 'Bleakness', 'Tearjerker', 'Funny', 'Warmth', 'Tension', 'Scary', 'Violence'])}</div>
    <div class="gh">Scale and look</div><div class="row">${strands(['Pace', 'Brainy', 'Wonder', 'Visual style', 'Spectacle'])}</div>
    <div class="hint">↑ more of it, ↓ less of it. Each tap re-ranks, free.</div></div>
    <div class="steer">${ic('cdr')}Steer it: older, shorter, no subtitles</div>${cutRow}${rows(1)}</div>`;

  const xc = `<span class="x">${ic('x')}</span>`;
  const newChips = (open, extra = '') => `<div class="lbl">Understood as</div><div class="chips"><span class="c on">With Robert Redford${xc}</span><span class="c on">On Max${xc}</span>${extra}<span class="c add${open ? ' open' : ''}">${ic('plus')}Add</span></div>`;
  const narrow = `<div class="steer">${ic('cdr')}Narrow it: older, shorter, no subtitles</div>`;
  const menu = `<div class="menu" style="right:16px;top:236px">${KINDS.map(([i, n], k) => `<div class="mr${k === 1 ? ' hov' : ''}">${ic(i)}${n}${ic('chev', 'chev')}</div>`).join('')}</div>`;
  const ansMenu = () => `<div class="pg p">${ansHead}${newChips(true)}${narrow}${cutRow}${rows(4)}</div>${menu}`;
  const ansAdded = () => `<div class="pg p">${ansHead}${newChips(false, `<span class="c on hl">Thriller${xc}</span>`)}${narrow}${cutRow.replace("24 films", "11 films")}${rowsT()}</div>`;

  // Pickers: drawers over the ask (words and chips frame).
  const drawer = (title, body) => `<div class="dim"></div><div class="dw"><div class="grab"></div><div class="dh"><div class="dt rdu-b">${title}</div><span class="circ">${ic('x')}</span></div>${body}</div>`;
  const av = (l, bg) => `<span class="av" style="background:${bg}">${l}</span>`;
  const pr = (a, name, sub) => `<div class="pr">${a}<span class="t"><b>${name}</b><span>${sub}</span></span><span class="plus">${ic('plus')}</span></div>`;
  const person = () => `${askBoth().replace(`<div class="picked">${onOpt('user', 'Directed by David Fincher')}${onOpt('clap', 'Thriller')}</div>`, '')}${drawer('Add a person', `
    <div class="srch">${ic('search')}<span>Fin<span class="caret"></span></span></div>
    <div class="dsub">People</div>
    ${pr(av('D', '#c9b79a'), 'David <u>Fin</u>cher', 'Director · 12 films · you rated 7')}
    ${pr(av('A', '#9fb3c8'), 'Albert <u>Fin</u>ney', 'Actor · 48 films')}
    ${pr(av('F', '#b7a6c9'), '<u>Fin</u>n Wolfhard', 'Actor · 14 films')}
    ${pr(av('P', '#a9c2a4'), 'Peter <u>Fin</u>ch', 'Actor · 37 films')}
    <div class="dnote">A director adds “Directed by”, an actor “With”.</div>`)}`;
  const G = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Sci-fi', 'Thriller', 'War', 'Western'];
  const genre = () => `${askBoth().replace(onOpt('clap', 'Thriller'), '')}${drawer('Add a genre', `
    <div class="gch">${G.map((g) => g === 'Thriller' ? `<span class="o on">${ic('check')}${g}</span>` : `<span class="o">${g}</span>`).join('')}</div>
    <div class="dnote">Up to two.</div>
    <div class="dfoot">Done</div>`)}`;

  const B = { 'ask-now': askNow, 'ans-now': ansNow, 'ans-now-add': ansNowAdd, 'ask-new': askNew, 'ask-both': askBoth, person, genre, 'ans-menu': ansMenu, 'ans-added': ansAdded };
  document.querySelectorAll('[data-ph]').forEach((el) => { el.outerHTML = `<div class="phone">${status}${B[el.dataset.ph]()}</div>`; });
  Promise.all([document.fonts.ready, ...[...document.querySelectorAll('.wall i')].map((i) => new Promise((r) => { const im = new Image(); im.onload = im.onerror = r; im.src = getComputedStyle(i).backgroundImage.slice(5, -2); }))])
    .then(() => { document.body.dataset.ready = '1'; });
})();
