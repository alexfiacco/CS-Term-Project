// b130, b131: Tonight's choices as build 40 draws them (ios Features/Tonight/TonightSheet.swift setupHeader, inputs, whoRow,
// moreHeading, pickBar, whoWith, WatchChip, elseSheet; TonightModel.swift TonightOptions upFront, moreMoods, feels, occasions).
const TN = {};
TN.sbar = `<div class="sbar"><span>9:41</span><i></i></div><div class="island"></div>`;
TN.U = (id) => `<svg viewBox="0 0 24 24"><use href="#${id}"/></svg>`;
TN.MOODS = ['Uplifting', 'Funny', 'Light & easy', 'Romantic', 'Cozy', 'Moving', 'Tense', 'Scary'];
TN.GENRES = ['Comedy', 'Drama', 'Thriller', 'Horror', 'Romance', 'Science Fiction'];
TN.chips = (list, on = [], extra = '') => `<div class="cwrap">${list.map((m) => `<span class="chp${on.includes(m) ? ' on' : ''}">${m}</span>`).join('')}${extra}</div>`;
TN.header = (close = true, back = false) => `<div class="tnh">${back ? `<div class="rc" style="margin:0 0 12px -6px">${TN.U('back')}</div>` : ''}<div style="display:flex;align-items:flex-start">
  <div style="flex:1"><div class="lab">Tonight</div><div class="tnt">What are we watching?</div></div>${close ? `<div class="xc">${TN.U('x')}</div>` : ''}</div></div>`;
TN.moods = (on) => `<div class="lab" style="margin-top:16px">Mood${on.length >= 3 ? '<span>3 of 3</span>' : ''}</div>
  <div style="margin-top:12px">${TN.chips(TN.MOODS, on, '<span class="chp dash blue">+ More moods</span>')}</div>`;
TN.genres = (on = []) => `<div class="lab" style="margin-top:24px">Genre</div><div style="margin-top:12px">${TN.chips(TN.GENRES, on, '<span class="chp dash">+ more</span>')}</div>
  <div class="pitch">Know exactly what you want? <b>Pitch it ›</b></div>`;
TN.whoRow = (v = 'Just me') => `<div class="trow" style="margin-top:24px;border-top:1px solid var(--line)"><span class="tl">Who's watching</span><span class="tv">${v}</span>${TN.U('chev')}</div>`;
TN.elseRow = (sub = 'More moods, pace, length and era') => `<div class="trow tall"><span class="tl">Anything else?<small>${sub}</small></span>${TN.U('chev')}</div>`;
TN.pickBar = (title, or = true, id = '') => `<div class="pbar"${id ? ` id="${id}"` : ''}><div class="btn-cream" style="height:52px;line-height:52px;font-size:17px">${title}</div>${or ? '<div class="or">or <b>just pick for me</b></div>' : ''}</div>`;
TN.FRIENDS = [['Emma', 86, '#C9A27E'], ['Sam', 78, '#8FB3D9'], ['Hugo', 74, '#B9C48A'], ['Priya', 71, '#D59AA4']];
TN.tiles = (on = []) => `<div class="tiles"><div class="addt">${TN.U('plus')}<span>Add</span></div>${TN.FRIENDS.map(([n, m, c]) => `<div class="wt${on.includes(n) ? ' on' : ''}"><div class="wf" style="background:${c}">${n[0]}${on.includes(n) ? `<i>${TN.U('check')}</i>` : ''}</div><div><b>${n}</b><em>${m}%</em></div></div>`).join('')}</div>`;
TN.occasion = (on = 'Just me') => `<div class="seg sm">${['Just me', 'Date night', 'Friends', 'Family'].map((o) => `<span${o === on ? ' class="on"' : ''}>${o}</span>`).join('')}</div>`;
TN.css = `
.tnd{position:absolute;left:0;right:0;top:62px;bottom:0;background:var(--bg);border-radius:16px 16px 0 0;box-shadow:inset 0 1px 0 var(--line2);overflow:hidden;z-index:5}
.tnd .grab{top:8px}
.tnp{position:absolute;left:0;right:0;top:54px;bottom:0;background:var(--bg);overflow:hidden}
.tnh{padding:16px 16px 4px}
.tnt{font:500 34px/38px var(--bodoni);color:var(--ink);margin-top:4px}
.xc{width:36px;height:36px;border-radius:50%;border:1px solid var(--line2);display:flex;align-items:center;justify-content:center;flex:none;color:var(--ink)}
.xc svg,.rc svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
.tnb{padding:0 16px}
.pitch{font:400 13px var(--ui);color:var(--faint);margin-top:12px}.pitch b{color:var(--accent2);font-weight:600}
.trow{min-height:56px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--line)}
.trow .tl{flex:1;font:600 15px var(--ui);color:var(--ink)}
.trow .tl small{display:block;font:400 13px var(--ui);color:var(--muted);margin-top:2px}
.trow .tv{font:400 13px var(--ui);color:var(--muted)}
.trow svg{width:18px;height:18px;stroke:var(--faint);stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
.trow.tall{min-height:60px}
.pbar{position:absolute;left:16px;right:16px;bottom:30px;z-index:6}
.pbar:before{content:"";position:absolute;left:-16px;right:-16px;top:-24px;bottom:-30px;background:linear-gradient(rgba(11,11,13,0),var(--bg) 24px);z-index:-1}
.pbar .or{text-align:center;font:400 13px/28px var(--ui);color:var(--muted);margin-top:2px}.pbar .or b{color:var(--ink);font-weight:600}
.tiles{display:flex;gap:8px;margin-top:8px;overflow:hidden;margin-right:-16px}
.addt{width:56px;height:56px;flex:none;border:1px dashed var(--line2);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font:600 11px var(--ui);color:var(--muted)}
.addt svg{width:18px;height:18px;stroke:var(--muted);stroke-width:2;fill:none}
.wt{width:136px;height:56px;flex:none;border-radius:12px;background:var(--p2);border:1px solid var(--line2);display:flex;align-items:center;gap:8px;padding:0 8px 0 4px}
.wt.on{background:var(--selFill);border:2px solid var(--select)}
.wf{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font:600 18px var(--ui);color:#141210;position:relative;flex:none}
.wf i{position:absolute;right:-4px;bottom:-4px;width:18px;height:18px;border-radius:6px;background:var(--select);display:flex;align-items:center;justify-content:center}
.wf i svg{width:12px;height:12px;stroke:#fff;stroke-width:3;fill:none}
.wt b{display:block;font:600 15px var(--ui);color:var(--ink)}.wt em{font:400 15px var(--bodoni);font-style:normal;color:var(--accent2)}
.taste{font:400 13px/19px var(--ui);color:var(--muted);margin-top:12px}
.tabbar2{position:absolute;left:0;right:0;bottom:0;height:84px;background:var(--panel);border-top:1px solid var(--line);display:flex;justify-content:space-around;padding:8px 8px 0;z-index:20}
.tabbar2 div{width:64px;display:flex;flex-direction:column;align-items:center;gap:2px;font:500 10px var(--ui);color:var(--faint)}
.tabbar2 svg{width:20px;height:20px;stroke:currentColor;stroke-width:1.7;fill:none;stroke-linecap:round;stroke-linejoin:round}
.tabbar2 .pop2{width:56px;height:44px;border-radius:12px;background:var(--cream);color:var(--bg);justify-content:center}
.tabbar2 .pop2 svg{width:24px;height:24px}
`;
TN.syms = `<svg width="0" height="0" style="position:absolute"><defs>
 <symbol id="x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>
 <symbol id="back" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></symbol>
 <symbol id="chev" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></symbol>
 <symbol id="plus" viewBox="0 0 24 24"><path d="M5 12h14M12 5v14"/></symbol>
 <symbol id="check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>
 <symbol id="clap" viewBox="0 0 24 24"><path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></symbol>
 <symbol id="search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></symbol>
 <symbol id="popcorn" viewBox="0 0 24 24"><path d="M18 8a2 2 0 0 0 0-4 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0 0 4"/><path d="M10 22 9 8M14 22l1-14"/><path d="M20 8c.5 0 .9.4.8 1l-2.6 12c-.1.5-.7 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L3.2 9c-.1-.6.3-1 .8-1Z"/></symbol>
 <symbol id="users" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></symbol>
 <symbol id="user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></symbol>
 <symbol id="ticket" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/></symbol>
</defs></svg>`;
TN.tabbar = `<div class="tabbar2"><div>${TN.U('clap')}Picks</div><div>${TN.U('search')}Browse</div><div class="pop2">${TN.U('popcorn')}</div><div>${TN.U('users')}Social</div><div>${TN.U('user')}Profile</div></div>`;
TN.mark = function (phId, targetId, label, opt = {}) {
  const ph = document.getElementById(phId), t = document.getElementById(targetId);
  if (!ph || !t) return;
  const a = ph.getBoundingClientRect(), b = t.getBoundingClientRect();
  const n = document.createElement('div'); n.className = 'note';
  Object.assign(n.style, { left: (b.left - a.left - 4) + 'px', top: (b.top - a.top - 4) + 'px', width: (b.width + 8) + 'px', height: (b.height + 8) + 'px' });
  ph.appendChild(n);
  const l = document.createElement('div'); l.className = 'notel'; l.textContent = label;
  Object.assign(l.style, { right: '20px', top: (opt.below ? b.bottom - a.top + 8 : b.top - a.top - 22) + 'px' });
  ph.appendChild(l);
};
