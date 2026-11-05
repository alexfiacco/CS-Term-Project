// import-topup-v1: the shared phone parts (the deck, the segment counter, the reveal, a dimmed page).
const P = '../img/';
const FILMS = {
  prisoners: ['Prisoners', '2013 · 2h 33m · Denis Villeneuve', 'prisoners.png'],
  witch: ['The Witch', '2015 · 1h 32m · Robert Eggers', 'witch.png'],
  hereditary: ['Hereditary', '2018 · 2h 7m · Ari Aster', 'hereditary.png'],
  inception: ['Inception', '2010 · 2h 28m · Christopher Nolan', 'inception.png'],
  wailing: ['The Wailing', '2016 · 2h 36m · Na Hong-jin', 'wailing.png'],
  wicker: ['The Wicker Man', '1973 · 1h 28m · Robin Hardy', 'wickerman.png'],
};
// n segments, k on
function segs(n, k) {
  let h = '';
  for (let i = 0; i < n; i++) h += `<i class="${i < k ? 'on' : ''}"></i>`;
  return `<div class="segs">${h}</div>`;
}
// the top-up deck: o = {film, n, k, left (the line beside the bar), tag (logged line or null), why, popular}
function deck(id, o) {
  const f = FILMS[o.film];
  document.getElementById(id).innerHTML = `
  <div class="sb"><span>9:41</span><span>5G</span></div>
  <div class="pad" style="display:flex;align-items:center;gap:12px;height:48px">
    <div style="flex:1">${segs(o.n, o.k)}<div style="font-size:12.5px;margin-top:7px;color:var(--muted)">${o.left}</div></div>
    <div class="x">×</div>
  </div>
  <div style="display:flex;flex-direction:column;align-items:center;margin-top:16px">
    <div style="position:relative">
      <div class="po hero" style="width:200px;height:300px;background-image:url(${P + f[2]})"></div>
      ${o.tag ? `<div class="lbtag">From your Letterboxd</div>` : ''}
    </div>
    <div class="t22" style="margin-top:18px">${f[0]}</div>
    <div class="m13" style="margin-top:3px">${f[1]}</div>
    ${o.tag ? `<div class="f12" style="margin-top:4px">${o.tag}</div>` : ''}
    ${o.why ? `<div style="font-size:13px;color:var(--accent2);margin-top:6px">${o.why}</div>` : ''}
    <div class="stars" style="margin-top:12px"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
    ${o.popular
      ? `<div style="display:flex;gap:10px;margin-top:14px;width:346px"><div class="btn2" style="flex:1;height:46px">Haven't seen it</div><div class="btn2" style="flex:1;height:46px">Want to watch</div></div><div class="m13" style="margin-top:12px">Seen it, no rating</div>`
      : `<div class="btn2" style="margin-top:14px;width:346px;height:46px">Don't remember it</div>`}
  </div>
  ${o.toast ? `<div style="position:absolute;left:16px;right:16px;bottom:30px;z-index:4" class="toast"><div style="flex:1"><div style="font:600 15px Inter">${o.toast[0]}</div><div class="m13" style="margin-top:2px">${o.toast[1]}</div></div></div>` : ''}
  <div class="home"></div>`;
}
// the reveal, as the import's reveal is today; dim: no oxblood rule (a drawer sits over it and carries the red)
function reveal(dim, sub) {
  const fan = [['wailing.png', '94% match', -14, -6], ['witch.png', '92% match', 0, 0], ['midsommar.png', '90% match', 14, -6]];
  return `
  <div class="sb"><span>9:41</span><span>5G</span></div>
  <div class="pad" style="text-align:center;margin-top:26px">
    <div class="lab">Your cinema archetype</div>
    <div style="font:600 40px/1.05 'Bodoni Moda';margin-top:8px">Midnight Cultist</div>
    ${dim ? '<div style="height:14px"></div>' : '<div style="width:40px;height:2px;background:var(--shadow);margin:12px auto 0"></div>'}
    <div style="font-size:15px;color:var(--muted);margin-top:12px"><b class="ink">4 of your top 6</b> are slow-burn horror.</div>
    <div class="lab" style="margin-top:8px;color:var(--accent2)">Streak · Nihilist</div>
    <div class="f12" style="margin-top:4px">${sub || 'Film DNA · early read'}</div>
    <div style="display:flex;justify-content:center;gap:14px;margin-top:24px">
      ${fan.map(f => `<div style="transform:rotate(${f[2] / 3}deg) translateY(${-f[3]}px)"><div class="po" style="width:92px;height:138px;background-image:url(${P + f[0]})"></div><div class="blue" style="font-size:12px;font-weight:600;margin-top:6px">${f[1]}</div></div>`).join('')}
    </div>
  </div>
  <div class="pad" style="margin-top:auto;margin-bottom:40px">
    <div style="display:flex;gap:10px"><div class="btn2" style="flex:1;font-size:14px">Share my archetype</div><div class="btn" style="flex:1;font-size:14px">Save &amp; see my picks</div></div>
    <div class="f12" style="text-align:center;margin-top:10px">Saved with Apple, Google or email</div>
  </div>`;
}
