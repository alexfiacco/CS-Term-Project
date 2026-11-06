// Landing v1: builds the TODAY and PROPOSED landing frames (phone and desktop) from one source.
// TMDB is blocked here, so the code's posters (Pearl, the Globetrotter picks, Sicario) are drawn as title blocks;
// the other posters are the local copies in ../img.
const IMG = n => `../img/${n}`;
const WALL = ['hereditary.png','inception.png','tmdb/1ho0d4LNZw3Y0voeKmSvPSgJOJ2.jpg','bronx.png','midsommar.png','tmdb/2LquGwEhbg3soxSCs9VNyh5VJd9.jpg','prisoners.png','suspiria.png','tmdb/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg','wailing.png','wickerman.png','tmdb/3bhkrj58Vtu7enYsRolD1fZdja1.jpg','witch.png','itnotf.png','tmdb/6d5XOczc226jECq0LIX0siKtgHR.jpg','tmdb/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg','tmdb/7fn624j5lj3xTme2SgiLCeuedmO.jpg','tmdb/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg','tmdb/e09dLw1Ljtccd2P4NsuUvVtS5du.jpg','tmdb/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg','tmdb/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg','tmdb/evKz85EKouVbIr51zy5fOtpNRPg.jpg','tmdb/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg','tmdb/hA2ple9q4qnwxp3hKVNhroipsir.jpg','tmdb/iYypPT4bhqXfq1b6EnmxvRt6b2Y.jpg','tmdb/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg','tmdb/kf1Jb1c2JAOqjuzA3H4oDM263uB.jpg'];
const GHOSTS = [['IMAX Idealist',8,14],['Lovestruck',62,30],['Voyager',-4,44],['Hardboiled',36,58],['Comic Relief',60,50],['Nihilist',6,64]];

// title block: a real film drawn as its title when the poster image cannot load
const TB = {
  pearl:{t:'Pearl',y:'2022',c:'#5a5226'}, handmaiden:{t:'The Handmaiden',y:'2016',c:'#2f3d3a'}, leon:{t:'Léon: The Professional',y:'1994',c:'#363c48'},
  button:{t:'The Curious Case of Benjamin Button',y:'2008',c:'#4a4034'}, sicario:{t:'Sicario',y:'2015',c:'#463b28'},
};
const tb = (k, w, extra = '', cls = '') => { const f = TB[k]; return `<div class="po tb ${cls}" style="width:${w}px;background:${f.c}"><b>${f.t}</b><small>${f.y}</small>${extra}</div>`; };
const po = (img, w, extra = '', cls = '') => `<div class="po ${cls}" style="width:${w}px;background-image:url(${IMG(img)})">${extra}</div>`;
const stamp = (n, cls = '') => `<span class="stamp ${cls}">${n}<small>%</small></span>`;
const AV = { E:'#8FB3D9', S:'#C9C4B8', M:'#5B8FC4' };
const av = (l, z) => `<span class="av" style="width:${z}px;height:${z}px;font-size:${Math.round(z * .44)}px;background:${AV[l]}">${l}</span>`;
// TODAY keeps the code's placeholder initials J, A, M; the brief replaces them with Emma and Sam (E, S)
const avOld = (l, z, c) => `<span class="av" style="width:${z}px;height:${z}px;font-size:${Math.round(z * .44)}px;background:${c}">${l}</span>`;
const DNA = [18,30,12,26,34,16,24,10,28,20,32,14];
const dna = () => `<div class="dna">${DNA.map(h => `<i style="height:${h}px"></i>`).join('')}</div>`;

const header = d => `<div class="hd"><img src="${IMG('montage-fan.svg')}" alt=""><span class="wm">Montage</span>
<span class="ic"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#EFE8DA" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></span><span class="si">Sign in</span></div>`;

const hero = (d, cl) => `<div class="hero"><div class="wall">${(d ? WALL : WALL.slice(0, 16)).map(p => `<i style="background-image:url(${IMG(p)})"></i>`).join('')}</div>
${GHOSTS.map(([n, x, y]) => `<span class="ghost" style="left:${x}%;top:${y}%">${n}</span>`).join('')}<div class="tint"></div>
<div class="fg"><h1 class="h1">What kind of<br>viewer are you?</h1>
<p class="sub">Find out, then see what you'll love and who to watch it with.</p>
<div style="position:relative">${cl || ''}<div class="cta">Discover your taste</div></div>
<div class="lb"><span class="dots"><b style="background:#ff8000"></b><b style="background:#00e054"></b><b style="background:#40bcf4"></b></span><span class="m"><div class="t">I'm on Letterboxd</div><div class="s">Import your ratings · 2–3 min</div></span><span class="ar">→</span></div>
<div class="foot">or <b>Explore the 14 archetypes</b></div>
<div class="chev"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg></div></div></div>`;

const sectionHead = `<div class="k">Once you're in</div><h2 class="st">Films you'll love, and ones you'll all agree on.</h2>`;

function today(d) {
  const picks = [['handmaiden',81,'Heist Crew Caper'],['leon',81,'Hitman Trying to Quit'],['button',79,'Life-Spanning Fables']];
  return `${header(d)}${hero(d, '<span class="cl red" style="right:-4px;top:-22px">oxblood 1 · the landing door</span>')}
<div class="sec">${sectionHead}<p class="le">Which one sounds like you?</p>
<div class="chips"><span>Hardboiled</span><span>Lovestruck</span><span>Midnight Cultist</span><span class="on">Globetrotter</span></div>
<div style="position:relative"><span class="cl red" style="right:0;top:-20px">oxblood 2, 3, 4 · sample posters</span>
<div class="strip">${picks.map(([k, m, l]) => `<div>${tb(k, d ? 150 : 100)}<div class="m">${m}% match</div><div class="t">${TB[k].t}</div><div class="l">${l}</div></div>`).join('')}</div></div>
<p class="snote">Top picks Montage gives someone who loves Parasite and City of God. Yours will be your own.</p>
<div class="mos">
<div class="mo"><div class="vis"><div class="arch"><small>Your cinema archetype</small>Midnight Cultist</div>${dna()}</div><p class="cap">Meet your archetype and Film DNA.</p></div>
<div class="mo"><div class="vis">${tb('pearl', 150, stamp(81), 'lg')}</div><p class="cap">Your match on every film.</p></div>
<div class="mo"><div class="vis"><div class="pair">${avOld('J', 64, '#8FB3D9')}<b class="pct">87<small>%</small></b>${avOld('A', 64, '#A9A69E')}</div></div><p class="cap">See where your tastes meet.</p></div>
<div class="mo"><div class="vis"><div class="night">${tb('sicario', 104)}<span class="faces">${avOld('J', 36, '#8FB3D9')}${avOld('A', 36, '#A9A69E')}${avOld('M', 36, '#5B8FC4')}</span></div></div><p class="cap">Agree on one film.</p></div>
</div>
<div style="position:relative" class="bcta"><span class="cl red" style="right:-10px;top:-22px">oxblood 5</span><div class="cta">Discover your taste</div></div></div>
<div class="ft">About · Privacy · Terms</div>`;
}

function proposed(d) {
  const W = d ? 128 : 136;
  return `${header(d)}${hero(d, '<span class="cl" style="right:-4px;top:-22px">red on this screen: the landing door</span>')}
<div class="sec">${sectionHead}
<div class="mos five" style="margin-top:${d ? 30 : 26}px">
<div class="mo" style="position:relative"><span class="cl" style="left:${d ? 0 : 6}px;top:-4px">the one red here</span><div class="vis">${tb('pearl', W + 14, stamp(81), 'lg sig')}</div><p class="cap">Your match on every film.</p></div>
<div class="mo"><div class="vis"><div class="pitch"><div class="field"><span class="flab">Pitch a film</span>A slow, tense mystery in a small town, under two hours<span class="caret"></span></div>
<div class="res">${po('prisoners.png', 50, stamp(88, 's'))}${po('wailing.png', 50, stamp(84, 's'))}${po('witch.png', 50, stamp(82, 's'))}</div></div></div>
<p class="cap">Search every film, or describe the one you want.</p></div>
<div class="mo"><div class="vis"><div class="tn"><span class="tap"><span class="btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>Tonight</span><span class="ring"></span><span class="ring r2"></span><span class="dot"></span></span>
<span class="arr">→</span>${po('midsommar.png', d ? 92 : 96, stamp(86, 's'))}</div></div><p class="cap">Tonight's film in one tap.</p></div>
<div class="mo"><div class="vis"><div class="night"><div class="pair" style="gap:14px">${av('E', 60)}<b class="pct" style="font-size:36px">87<small>%</small></b>${av('S', 60)}</div>
<div style="font:500 12px Inter;color:#8A877F;margin-top:8px;display:flex;gap:96px;justify-content:center"><span>Emma</span><span>Sam</span></div></div></div>
<p class="cap">Blend with friends and agree on one film.</p></div>
<div class="mo"><div class="vis"><div class="arch"><small>Your cinema archetype</small>Midnight Cultist</div>${dna()}
<div class="rated"><div class="r">${po('suspiria.png', 34)}<span>4.5★</span></div><div class="r">${po('witch.png', 34)}<span>4★</span></div><div class="r">${po('wickerman.png', 34)}<span>5★</span></div><div class="r">${po('hereditary.png', 34)}<span>4.5★</span></div></div></div>
<p class="cap">Meet your archetype and Film DNA.</p><p class="cap2">Built from every film you watch.</p></div>
</div>
<div class="bcta" style="position:relative"><span class="cl" style="right:-10px;top:-22px">same button, no shadow</span><div class="cta flat">Discover your taste</div></div></div>
<div class="ft">About · Privacy · Terms</div>`;
}

const sbar = `<div class="sbar"><span>9:41</span><span class="r"><i></i></span></div>`;
const dbar = `<div class="dbar"><i></i><i></i><i></i><span class="url">montagefilm.app</span></div>`;
document.querySelectorAll('[data-frame]').forEach(el => {
  const [kind, dev] = el.dataset.frame.split('-'); const d = dev === 'dk';
  el.innerHTML = (d ? dbar : sbar) + (kind === 'today' ? today(d) : proposed(d));
});
