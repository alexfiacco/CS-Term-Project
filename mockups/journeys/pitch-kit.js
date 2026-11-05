// Shared builders for pitch-drawer-v1 and pitch-search-v1 (iPhone 390, drawn from Recut.swift,
// TonightSheet.swift and BrowseScreen.swift on main).
const SBAR=t=>`<div class="sb"><span>${t}</span><span><span class="bars"><b style="height:4px"></b><b style="height:6px"></b><b style="height:8px"></b><b style="height:11px"></b></span><i></i></span></div>`;
const X=`<div class="icb"><svg viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8"/></svg></div>`;
const BACK=`<div class="icb"><svg viewBox="0 0 16 16"><path d="M10 3L5 8l5 5"/></svg></div>`;
const MIC=`<div class="mic"><svg viewBox="0 0 16 16"><rect x="5.5" y="1.5" width="5" height="8" rx="2.5"/><path d="M3 8a5 5 0 0010 0M8 13v2"/></svg></div>`;
const GLASS=`<svg viewBox="0 0 18 18"><circle cx="8" cy="8" r="5.5"/><path d="M12 12l4 4"/></svg>`;
const SLIDERS=`<svg viewBox="0 0 16 16"><path d="M2 4h12M2 8h12M2 12h12"/><circle cx="5" cy="4" r="1.6" fill="#EFE8DA"/><circle cx="10" cy="8" r="1.6" fill="#EFE8DA"/><circle cx="6" cy="12" r="1.6" fill="#EFE8DA"/></svg>`;
// recut-v9's Pitch mark (New 6, "fan"): a hand of posters, one lifted
const FAN=`<svg class="ico" viewBox="0 0 24 24"><rect x="3.25" y="8.75" width="7" height="11.5" rx="1.5" transform="rotate(-12 6.75 20.25)"/><rect x="13.75" y="8.75" width="7" height="11.5" rx="1.5" transform="rotate(12 17.25 20.25)"/><rect class="kb" x="8" y="2.75" width="8" height="12" rx="1.5"/><rect class="bf" x="8" y="2.75" width="8" height="12" rx="1.5"/><path class="b" d="M10.6 18.4L12 17l1.4 1.4M10.6 21.2L12 19.8l1.4 1.4"/></svg>`;
const HOME=`<div class="home"></div>`;

const KEYS=(go='go')=>`<div class="kbd">
<div class="r">${'qwertyuiop'.split('').map(k=>`<div class="k">${k}</div>`).join('')}</div>
<div class="r">${'asdfghjkl'.split('').map(k=>`<div class="k">${k}</div>`).join('')}</div>
<div class="r"><div class="k w">⇧</div>${'zxcvbnm'.split('').map(k=>`<div class="k">${k}</div>`).join('')}<div class="k w">⌫</div></div>
<div class="r"><div class="k w">123</div><div class="k sp">space</div><div class="k gk">${go}</div></div></div>`;

// Browse behind the drawer: the pinned search row with the Pitch button, then the poster wall
const BROWSE=`<div style="position:absolute;inset:46px 0 0;padding:0 16px">
<div style="display:flex;justify-content:space-between;align-items:center;height:52px"><span style="font:600 28px 'Bodoni Moda'">Browse</span></div>
<div style="display:flex;gap:8px"><div class="fld" style="height:44px">${GLASS}Search films or people</div><span class="rcbx" style="height:44px;border-radius:12px;border:1px solid #3A3A3E;display:inline-flex;align-items:center;gap:7px;padding:0 13px;font:600 15px Inter">${FAN}Pitch</span></div>
<div class="hrow" style="margin-top:20px"><h4>Made for you</h4><span>See all</span></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px">${['prisoners','wailing','hereditary','witch','wickerman','suspiria','inception','midsommar','itnotf'].map(p=>`<div class="po" style="height:160px;background-image:url(../img/${p}.png)"></div>`).join('')}</div></div>`;

const EXAMPLES=['Like Arrival but scarier','Feels like a rainy Sunday','Knives Out, but older'];

const FILMS=[['pitch-po-patlabor.jpg','Patlabor 2: The Movie',67,1993,'Tense, slow 90s animated thriller.'],['pitch-po-reddawn.jpg','Red Dawn',67,1990,'Tense, bleak 90s thriller.'],['pitch-po-jinroh.jpg','Jin-Roh: The Wolf Brigade',58,1999,'Tense, slow 90s animated thriller.'],['','Torment',56,1994,'Tense, slow 90s thriller.']];
const frow=f=>`<div class="fr"><div class="po" style="${f[0]?`background-image:url(../img/${f[0]})`:'background:#22252B'}"></div><div><div class="ft">${f[1]}</div><div class="fm">${f[2]}% match<span>${f[3]}</span></div><div class="fw">${f[4]}</div></div></div>`;

// the fixed heading: one line, then a meta line with the count left and the link right
const SORTED=(hl)=>`<div class="srt"><h4>Sorted for you</h4><div class="ml"><span class="n">13 films</span><span class="ql${hl?' hl':''}">Just pick one for me ›</span></div></div>`;
