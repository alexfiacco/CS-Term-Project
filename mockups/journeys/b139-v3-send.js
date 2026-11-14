// b139 v3: the Send panel ("Send in Montage", in full), in Montage's own language: the app's bottom drawer (rules 671, 680),
// the Bodoni title with the AccentTick (rule 1254), Send to's tiles in each person's tint with sans initials (rules 142, 650,
// 1338), its picked ring and check, hairline rows for the longer lists (STYLE: groups inside a section split by hairlines),
// Newsreader for the note, and one cream Send (STYLE: one primary).
const TINT = { Sam: '#c9a46a', Jordan: '#a7c4a0', Priya: '#c48f9a', Lee: '#b3a6d9', Ana: '#9fc4c4', Theo: '#c4b48f', Mia: '#d9a6b3', Noor: '#a6b3d9', Joanna: '#d9b38f', Joel: '#9fb3c4' };
const CK = '<b class="mp-ck"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></b>';
const ptile = (n, on, s = 48) => `<span class="mp-face" style="width:${s}px;height:${s}px;background:${TINT[n] || '#8fb3d9'};font-size:${Math.round(s * 0.34)}px">${n[0]}${on ? CK : ''}</span>`;
const gtile = (n, ls, on, s = 48) => `<span class="mp-face mp-grp" style="width:${s}px;height:${s}px">${ls.map((l, i) => `<i style="background:${TINT[l] || '#8fb3d9'};width:${Math.round(s * .42)}px;height:${Math.round(s * .42)}px;font-size:${Math.round(s * .2)}px">${l[0]}</i>`).join('')}${on ? CK : ''}</span>`;
const tile = (n, on, ls) => `<div class="mp-t${on ? ' on' : ''}">${ls ? gtile(n, ls, on) : ptile(n, on)}<span>${on ? n : n}</span></div>`;
const MPX = '<span class="mp-x"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></span>';
const MPBACK = '<span class="mp-x mp-bk"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></span>';
const SRCH = '<span class="mp-sb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg></span>';
const title = (t, back) => `<div class="mp-h">${back ? MPBACK : ""}<div class="rdu"><b>${t}</b></div>${MPX}</div>`;
const sec = (t, extra = '') => `<div class="mp-k"><span>${t}</span>${extra}</div>`;
const row = (face, name, meta, on) => `<div class="mp-r${on ? ' on' : ''}">${face}<span class="mp-rt"><b>${name}</b><em>${meta}</em></span>${on ? '<span class="mp-rck">Picked</span>' : ''}</div>`;
const note = (n, primary, secondary) => `<div class="mp-send">
  <div class="mp-note">Add a note (optional)</div>
  <p>${n > 1 ? 'Each gets it in your chat with them.' : 'It goes in your chat with them.'}</p>
  <div class="mp-btns">${secondary ? `<div class="mp-sec">${secondary}</div>` : ''}<div class="mp-pri">${primary}</div></div></div><div class="homeb"></div>`;
function panelA() {
  return `<div class="mp">${title('Send in Montage')}
    ${sec('Recent', SRCH)}
    <div class="mp-row">${tile('Sam', true)}${tile('Friday crew', false, ['Maya', 'Sam', 'Jordan'])}${tile('Jordan', true)}${tile('Priya', true)}${tile('Lee', false)}${tile('Film club', false, ['Ana', 'Theo', 'Priya'])}</div>
    ${sec('Your people')}
    ${row(ptile('Ana', false, 40), 'Ana', '@ana.k · <span class="mp-pct">82%</span> Blend', false)}
    ${row(ptile('Theo', false, 40), 'Theo', '@theo · <span class="mp-pct">74%</span> Blend', false)}
    ${row(gtile('Sam and Lee', ['Sam', 'Lee'], false, 40), 'Sam and Lee', 'Group chat · 3 people', false)}
    ${note(3, 'Send to 3', 'Make a group chat')}</div>`;
}
function panelB() {
  return `<div class="mp">${title('Send in Montage')}
    <div class="mp-field"><span class="v">jo</span><i class="mp-caret"></i><span class="mp-clr">Cancel</span></div>
    ${sec('Picked')}
    <div class="mp-row mp-row-sm">${tile('Sam', true)}${tile('Jordan', true)}${tile('Priya', true)}</div>
    ${sec('Matches')}
    ${row(ptile('Jordan', true, 40), '<u>Jo</u>rdan', '@jordan · <span class="mp-pct">88%</span> Blend', true)}
    ${row(ptile('Joanna', false, 40), '<u>Jo</u>anna Reyes', '@jo.films · <span class="mp-pct">71%</span> Blend', false)}
    ${row(gtile('Friday crew', ['Maya', 'Sam', 'Jordan'], false, 40), 'Friday crew', 'Group · <u>Jo</u>rdan, Maya and 3 more', false)}
    ${row(ptile('Joel', false, 40), '<u>Jo</u>el', '@joel_k · <span class="mp-pct">65%</span> Blend', false)}
    ${note(3, 'Send to 3', 'Make a group chat')}</div>`;
}
function panelC() {
  return `<div class="mp">${title('New group chat', true)}
    <div class="mp-row mp-row-sm" style="margin-top:16px">${tile('Sam', false)}${tile('Jordan', false)}${tile('Priya', false)}<div class="mp-t"><span class="mp-face mp-add">+</span><span>Add</span></div></div>
    ${sec('Name')}
    <div class="mp-field mp-name"><span>Sam, Jordan and Priya</span></div>
    <p class="mp-p">Optional. Until someone names it, it reads as your names. Up to 8 people, all your friends, so it opens for everyone straight away. Your archetype card is its first message.</p>
    <div class="mp-send"><div class="mp-note">Add a note (optional)</div><div class="mp-btns"><div class="mp-pri">Create and send</div></div></div><div class="homeb"></div></div>`;
}
function sendScreen(panel) {
  return `<div class="ss-card" style="top:0;height:699px"><div style="transform:scale(${393 / 1080});transform-origin:0 0;width:1080px;height:1920px;position:relative">${archetypeV2()}</div></div>
  ${chrome}${barV2()}<div class="mp-dim"></div>${panel}`;
}
