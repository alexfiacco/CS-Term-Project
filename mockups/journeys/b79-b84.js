/* b79-b84 shared helpers: icons (Lucide paths), faces, posters, phone chrome. */
const IC = {
  back: '<path d="m15 18-6-6 6-6"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  msg: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  up: '<path d="m18 15-6-6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  send: '<path d="M14.5 21.7a.5.5 0 0 0 .9-.1l6.5-19a.5.5 0 0 0-.6-.6l-19 6.5a.5.5 0 0 0-.1.9l7.9 3.2a2 2 0 0 1 1.1 1.1z"/><path d="m21.9 2.1-10.9 10.9"/>',
  tv: '<rect width="20" height="15" x="2" y="7" rx="2"/><polyline points="17 2 12 7 7 2"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  vert: '<rect width="12" height="20" x="6" y="2" rx="2"/>',
  rows: '<rect width="18" height="7" x="3" y="3" rx="1"/><rect width="18" height="7" x="3" y="14" rx="1"/>',
  sliders: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
};
const svg = (k, s = 16, extra = '') => `<svg class="svg" viewBox="0 0 24 24" style="width:${s}px;height:${s}px;${extra}">${IC[k]}</svg>`;
const P = {
  prisoners: { t: 'Prisoners', y: 2013, rt: '2h 33m', d: 'Denis Villeneuve', g: 'Thriller', p: 'https://image.tmdb.org/t/p/w500/jsS3a3ep2KyBVmmiwaz3LvK49b1.jpg', b: 'https://image.tmdb.org/t/p/w780/n1ItmvzsDV5yLgDodSCLZpFlsP6.jpg', m: 95 },
  memories: { t: 'Memories of Murder', y: 2003, rt: '2h 12m', d: 'Bong Joon Ho', g: 'Crime', p: 'https://image.tmdb.org/t/p/w500/jcgUjx1QcupGzjntTVlnQ15lHqy.jpg', m: 94 },
  zodiac: { t: 'Zodiac', y: 2007, rt: '2h 37m', d: 'David Fincher', g: 'Crime', p: 'https://image.tmdb.org/t/p/w500/6YmeO4pB7XTh8P8F960O1uA14JO.jpg', m: 93 },
  nightcrawler: { t: 'Nightcrawler', y: 2014, rt: '1h 58m', d: 'Dan Gilroy', g: 'Thriller', p: 'https://image.tmdb.org/t/p/w500/j9HrX8f7GbZQm1BrBiR40uFQZSb.jpg', m: 91 },
  se7en: { t: 'Se7en', y: 1995, rt: '2h 7m', d: 'David Fincher', g: 'Crime', p: 'https://image.tmdb.org/t/p/w500/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg' },
  gonegirl: { t: 'Gone Girl', y: 2014, d: 'David Fincher', p: 'https://image.tmdb.org/t/p/w500/ts996lKsxvjkO2yiYG0ht4qAicO.jpg' },
  heat: { t: 'Heat', y: 1995, d: 'Michael Mann', p: 'https://image.tmdb.org/t/p/w500/e09dLw1Ljtccd2P4NsuUvVtS5du.jpg' },
  departed: { t: 'The Departed', y: 2006, d: 'Martin Scorsese', p: 'https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg' },
};
// The room: you (host), Emma, Sam, Jacob.
const W = { A: ['A', 0], E: ['E', 1], S: ['S', 2], J: ['J', 3] };
const face = (k, size = 24, tick = false, dim = false) => {
  const [l, t] = W[k];
  return `<span class="f f${size} t${t}" style="${dim ? 'opacity:.55' : ''}">${l}${tick ? `<span class="tickb">${IC.check.replace('<path', '<svg viewBox="0 0 24 24"><path')}</svg></span>` : ''}</span>`;
};
const faces = (keys, size = 22, cls = '') => `<span class="stack ${cls}">${keys.map((k) => face(k, size)).join('')}</span>`;
const poster = (f, w, h, extra = '') => `<div class="poster" style="width:${w}px;height:${h}px;background-image:url('${P[f].p}');${extra}"></div>`;
const sbar = '<div class="sbar"><span>9:41</span><i></i></div><div class="homeb"></div>';
function ready(n) { let left = n; const imgs = [...document.images]; const done = () => { document.body.dataset.ready = '1'; }; if (!imgs.length) return done(); }
