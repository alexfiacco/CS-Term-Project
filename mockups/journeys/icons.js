// Line icons (stroke 1.75). <i data-i="name" class="s16"></i> becomes an inline SVG.
const P = {
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  ticket: '<path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z"/><path d="M14 6v12" stroke-dasharray="2 2"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  moon: '<path d="M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5z"/>',
  people: '<circle cx="9" cy="8" r="3.2"/><path d="M3 19c.6-3.3 3-5 6-5s5.4 1.7 6 5"/><path d="M15.5 5.2a3 3 0 0 1 0 5.6M17.5 14.2c1.8.6 3 2.2 3.5 4.8"/>',
  person: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-3.8 3.6-6 7-6s6.2 2.2 7 6"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
  bookmark: '<path d="M7 4h10v16l-5-3.6L7 20z"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  chev: '<path d="M9 5l7 7-7 7"/>',
  share: '<path d="M12 15V4M8 8l4-4 4 4"/><path d="M6 12v7h12v-7"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  checkc: '<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.8 2.8L16.2 9.5"/>',
  pct: '<circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/><path d="M18 6L6 18"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  music: '<path d="M14 4v10.5a3.5 3.5 0 1 1-2.5-3.35"/><path d="M14 4c.6 2.6 2.4 4 5 4.3"/>',
  camera: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.8" cy="7.2" r=".6"/>',
  friend: '<circle cx="10" cy="8" r="3.4"/><path d="M3.5 19.5c.7-3.4 3.2-5.4 6.5-5.4 1.6 0 3 .5 4.1 1.3"/><path d="M18 14v6M15 17h6"/>',
  bubble: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17h0A2.5 2.5 0 0 1 4 14.5z"/>',
  dots3: '<circle cx="5.5" cy="12" r="3"/><circle cx="12" cy="12" r="3"/><circle cx="18.5" cy="12" r="3"/>',
  store: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><path d="M12 8v6.5M9 12l3 3 3-3M8.5 17h7"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.2-3.5-8.5S9.6 5.9 12 3.5z"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  more: '<circle cx="6" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18" cy="12" r="1.2"/>',
  save: '<path d="M12 4v11M8 11l4 4 4-4"/><path d="M5 19h14"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  msg: '<path d="M12 4.5c4.7 0 8.5 3 8.5 6.8s-3.8 6.7-8.5 6.7c-1 0-2-.1-2.9-.4L5 19.5l1-3.6c-1.6-1.2-2.5-2.8-2.5-4.6 0-3.8 3.8-6.8 8.5-6.8z"/>',
  sparkle: '<path d="M12 4l1.6 4.8L18.5 10.5l-4.9 1.7L12 17l-1.6-4.8-4.9-1.7 4.9-1.7z"/>',
};
document.querySelectorAll('i[data-i]').forEach(el => {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('class', 'i ' + (el.className || ''));
  if (el.getAttribute('style')) s.setAttribute('style', el.getAttribute('style'));
  s.innerHTML = P[el.dataset.i] || '';
  el.replaceWith(s);
});
// Radar: <svg class="radar" data-v="0.6,0.3,..." data-size="120" data-labels="1"></svg>, nine strands in Dna9 order.
const LBL = ['Human drama','Complexity','Slow burn','Originality','Visual craft','Intensity','Spectacle','Wonder','Comedy'];
document.querySelectorAll('svg.radar').forEach(sv => {
  const v = sv.dataset.v.split(',').map(Number), S = +sv.dataset.size, lab = sv.dataset.labels === '1';
  const pad = lab ? 46 : 4, W = S + pad * 2, c = W / 2, R = S / 2;
  sv.setAttribute('viewBox', `0 0 ${W} ${lab ? W - 10 : W}`); sv.setAttribute('width', W); sv.setAttribute('height', lab ? W - 10 : W);
  const pt = (k, r) => { const a = -Math.PI / 2 + k * 2 * Math.PI / 9; return [c + Math.cos(a) * r, c + Math.sin(a) * r]; };
  let h = '';
  for (const f of [1, .66, .33]) h += `<polygon points="${[...Array(9)].map((_, k) => pt(k, R * f).join(',')).join(' ')}" fill="none" stroke="#3A3A3E" stroke-width="1"/>`;
  h += `<polygon points="${[...Array(9)].map((_, k) => pt(k, R * .5).join(',')).join(' ')}" fill="none" stroke="#5A5A5E" stroke-width="1" stroke-dasharray="3 3"/>`;
  for (let k = 0; k < 9; k++) { const [x, y] = pt(k, R); h += `<line x1="${c}" y1="${c}" x2="${x}" y2="${y}" stroke="#3A3A3E"/>`; }
  const poly = v.map((x, k) => pt(k, R * Math.max(.06, x)).join(',')).join(' ');
  const dash = sv.dataset.forming === '1' ? ' stroke-dasharray="4 3"' : '';
  h += `<polygon points="${poly}" fill="rgba(91,143,196,.22)" stroke="#8FB3D9" stroke-width="${S > 90 ? 2 : 1.5}"${dash} stroke-linejoin="round"/>`;
  const hi = sv.dataset.hi ? sv.dataset.hi.split(',').map(Number) : [];
  v.forEach((x, k) => { const [px, py] = pt(k, R * Math.max(.06, x)); const on = hi.includes(k);
    h += `<circle cx="${px}" cy="${py}" r="${on ? (S > 90 ? 4.5 : 3.5) : (S > 90 ? 3 : 2)}" fill="${on ? '#EFE8DA' : '#8FB3D9'}" stroke="#0B0B0D" stroke-width="1"/>`;
    if (on && sv.dataset.pulse === '1') h += `<circle cx="${px}" cy="${py}" r="8" fill="none" stroke="#EFE8DA" stroke-opacity=".45" stroke-width="1.5"/>`; });
  if (lab) LBL.forEach((t, k) => { const [x, y] = pt(k, R + 18); const anc = Math.abs(x - c) < 8 ? 'middle' : x < c ? 'end' : 'start';
    h += `<text x="${x}" y="${y + 4}" text-anchor="${anc}" font-family="Inter" font-size="11" font-weight="${hi.includes(k) ? 600 : 500}" fill="${hi.includes(k) ? '#EFE8DA' : '#8A877F'}">${t}</text>`; });
  sv.innerHTML = h;
});
