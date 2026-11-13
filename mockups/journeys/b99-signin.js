// b99 shared pieces: phone chrome, the tilted wall, sign-in buttons, drawers. Plain globals.
const W = 'https://image.tmdb.org/t/p/w185/', P = 'https://image.tmdb.org/t/p/w342/';
const wallIds = ['z2FnLKpFi1HPO7BEJxdkv6hpJSU','7IiTTgloJzvGI1TAYymCfbfl3vT','uAR0AWqhQL1hQa69UDEbb2rE5Wx','zhG3vKWyDRaZYoaww1UVAi29T9h','6FfCtAuVAW8XJjZ7eWeLibRLWTw','ve72VxNqjGM69Uky4WTo2bK6rfq','n0YuM4f5lvGAP6MAW2kBIzugXnc','jSziioSwPVrOy9Yow3XhWIBDjq1','xlaY2zyzMfkhk0HSC5VUwzoZPU1','k3waqVXSnvCZWfJYNtdamTgTtTA','lxM6kqilAdpdhqUl2biYp5frUxE','602vevIURmpDfzbnv5Ubi6wIkQm','x2FJsf1ElAgr63Y3PNPtJrcmpoe','3bhkrj58Vtu7enYsRolD1fZdja1','39wmItIWsg5sZMyRUHLkWBcuVCM','eCOtqtfvn7mxGl6nfmq4b1exJRc','6d5XOczc226jECq0LIX0siKtgHR','9OkCLM73MIU2CrKZbqiT8Ln1wY2','lGCEKlJo2CnWydQj7aamY7s1S7Q','1pdfLvkbY9ohJlCjQH2CZjjYVvJ','iYypPT4bhqXfq1b6EnmxvRt6b2Y','fKTPH2WvH8nHTXeBYBVhawtRqtR','dXNAPwY7VrqMAo51EKhhCJfaGb5','15uOEfqBNTVtDUT7hGBVCka0rZz'];
// Inception, 2001, The Shining: the guest's top-rated three (fan in the save drawer).
const topIds = ['xlaY2zyzMfkhk0HSC5VUwzoZPU1', 've72VxNqjGM69Uky4WTo2bK6rfq', 'uAR0AWqhQL1hQa69UDEbb2rE5Wx'];
let wk = 0;
const wall = (scrim = '<div class="wscrim"></div>') => `<div style="position:absolute;inset:0;overflow:hidden"><div class="wall">${[0,1,2,3,4,5].map(c => `<div class="col" style="margin-top:${[0,-60,-20,-90,-40,-70][c]}px">${[0,1,2,3,4,5,6].map(() => `<i style="background-image:url(${W}${wallIds[(wk++) % wallIds.length]}.jpg)"></i>`).join('')}</div>`).join('')}</div>${scrim}</div>`;
const chrome = `<div class="sbar"><span>9:41</span><i></i></div><div class="island"></div><div class="homeb"></div>`;
const safari = `<div class="saf"><div class="url"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>montagefilm.app</div></div>`;
const appTag = ``;
const lock = `<div class="lock"><span class="fan3"><i></i><i></i><i></i></span>Montage</div>`;
const wbar = (right) => `<div class="wbar">${lock}${right}</div>`;
const AV = `<div class="av">S</div>`;

const APPLE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.37 12.73c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.19-1.73-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.63 1.11 8.8.73 1.06 1.6 2.25 2.75 2.21 1.1-.04 1.52-.71 2.85-.71s1.71.71 2.88.69c1.19-.02 1.94-1.08 2.67-2.14.84-1.23 1.19-2.42 1.21-2.48-.03-.01-2.32-.89-2.33-3.56zM14.18 6.26c.61-.74 1.02-1.76.91-2.78-.88.04-1.94.58-2.57 1.32-.56.65-1.06 1.7-.93 2.7.98.08 1.98-.5 2.59-1.24z"/></svg>`;
const GOOGLE = `<svg viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>`;
const MAIL = `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
const LOCK = `<svg viewBox="0 0 24 24" stroke-linecap="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;
const CHECK = `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>`;
const X = `<div class="xc"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></div>`;
const oaApple = (label = 'Continue with Apple') => `<div class="oa apple">${APPLE}${label}</div>`;
const oaGoogle = `<div class="oa google">${GOOGLE}Continue with Google</div>`;
const oaMail = `<div class="oa mail">${MAIL}Continue with email</div>`;
const legal = `<div class="legal">By continuing, you agree to the <u>Terms</u> and <u>Privacy Policy</u> and confirm you're 13 or older (or older if your country requires it).</div>`;
const tap = (x, y) => `<div class="tap" style="left:${x - 20}px;top:${y - 20}px"></div>`;
const ann = (x, y, t, bad, w) => `<div class="ann${bad ? ' bad' : ''}" style="left:${x}px;top:${y}px${w ? `;max-width:${w}px` : ''}">${t}</div>`;
const newb = (x, y, t = 'New') => `<div class="newb" style="left:${x}px;top:${y}px">${t}</div>`;
const toast = (bottom, t, s) => `<div class="toast" style="bottom:${bottom}px"><span class="okc">${CHECK}</span><div><div class="tt">${t}</div>${s ? `<div class="ts">${s}</div>` : ''}</div></div>`;
const dots = `<span class="dots"><i style="background:#FF8000"></i><i style="background:#00E054"></i><i style="background:#40BCF4"></i></span>`;

// The reveal behind the guest's save drawer (signed out or guest): the archetype over the wall.
const reveal = `${wall('<div style="position:absolute;inset:0;background:radial-gradient(ellipse 85% 50% at 50% 40%,rgba(11,11,13,.9),rgba(11,11,13,.6) 75%)"></div>')}
<div style="position:absolute;left:16px;right:16px;top:140px;text-align:center"><div class="eyeb">You're an</div><div style="font:500 52px/56px var(--bodoni);margin-top:8px">Overthinker</div><div style="font:400 18px/24px var(--read);color:var(--muted);margin-top:8px">with a Nihilist streak</div></div>`;

// Web handle step (AccountScreen askUsername).
const webHandle = (top = 130) => `${wbar(AV)}
<div style="position:absolute;left:16px;right:16px;top:${top}px">
<div class="eyeb">Your account is ready</div><div class="big">Your handle</div>
<div class="lead">From your Google name. Keep it, or type a new one.</div>
<div class="hfield"><span class="at">@</span>samrivera<span class="ok">${CHECK}Available</span></div>
<div class="bn cream" style="margin-top:16px;height:52px;font-size:16px">Looks good</div>
<div class="fine">You can change it anytime in settings.</div></div>`;

// iPhone HandleScreen.
const iosHandle = (top = 120) => `<div style="position:absolute;left:16px;right:16px;top:${top}px">
<div style="font:500 32px/38px var(--bodoni)">Pick your handle</div>
<div class="lead" style="margin-top:8px">Your profile link, and how friends find you.</div>
<div style="font:500 13px var(--ui);color:var(--muted);margin-top:24px">Sam Rivera</div>
<div class="hfield" style="margin-top:8px"><span class="at">@</span>samrivera<span class="ok">${CHECK}Available</span></div></div>
<div style="position:absolute;left:16px;right:16px;bottom:44px"><div class="bn cream" style="height:52px;font-size:16px">Looks good</div><div class="fine">You can change it anytime in Settings.</div></div>`;
// Place a tap ring or a label on the smallest element in phone `ph` whose text includes `t`.
function find(ph, t) {
  const root = document.getElementById(ph); let best = null;
  root.querySelectorAll('*').forEach((e) => { if (e.textContent.includes(t) && (!best || best.contains(e))) best = e; });
  const r = best.getBoundingClientRect(), o = root.getBoundingClientRect();
  return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height };
}
function tapOn(ph, t) { const b = find(ph, t); document.getElementById(ph).insertAdjacentHTML('beforeend', tap(b.x + b.w / 2, b.y + b.h / 2)); }
function annOn(ph, t, label, bad, where = 'above', dx = 0) {
  const b = find(ph, t), y = where === 'above' ? b.y - 22 : b.y + b.h + 4;
  document.getElementById(ph).insertAdjacentHTML('beforeend', ann(Math.max(8, b.x + dx), y, label, bad));
}
function boxOn(ph, t, pad = 4) { const b = find(ph, t); document.getElementById(ph).insertAdjacentHTML('beforeend', `<div class="note" style="left:${b.x - pad}px;top:${b.y - pad}px;width:${b.w + pad * 2}px;height:${b.h + pad * 2}px"></div>`); }
