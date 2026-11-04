// Helpers for the beli-* mocks. Call bel.icons() after the DOM is written (growth-icons.js does the SVGs).
const FILMS={prisoners:['Prisoners',2013,'2h 33m','Denis Villeneuve'],inception:['Inception',2010,'2h 28m','Christopher Nolan'],hereditary:['Hereditary',2018,'2h 7m','Ari Aster'],suspiria:['Suspiria',2018,'2h 32m','Luca Guadagnino'],witch:['The Witch',2015,'1h 32m','Robert Eggers'],wickerman:['The Wicker Man',1973,'1h 28m','Robin Hardy'],midsommar:['Midsommar',2019,'2h 28m','Ari Aster'],wailing:['The Wailing',2016,'2h 36m','Na Hong-jin'],bronx:['A Bronx Tale',1993,'2h 1m','Robert De Niro'],itnotf:['In the Name of the Father',1993,'2h 13m','Jim Sheridan']};
const FILT=['none','hue-rotate(40deg) saturate(.7)','grayscale(.6)','hue-rotate(200deg)','sepia(.5)','grayscale(1) contrast(1.1)','hue-rotate(320deg) saturate(1.2)'];
const stamp=(n,s)=>`<span class="stamp${s===12?' s12':''}">${n}<span class="u">%</span></span>`;
// sp(img,{t:overlay title, f:filter index, st:stamp, ss:12|15, cls, style})
const sp=(img,o={})=>`<div class="sp ${o.t?'tg ':''}${o.cls||''}" style="background-image:url(../img/${img}.png);${o.style||''}">${o.f?`<div class="spf" style="background-image:url(../img/${img}.png);filter:${FILT[o.f]}"></div>`:''}${o.t?`<span class="tt">${o.t}</span>`:''}${o.st!=null?stamp(o.st,o.ss):''}</div>`;
const AVC={s:'#8FB3D9',j:'#C9C4B8',m:'#5B8FC4',t:'#A9A69E',r:'#7C93AD',k:'#D9D3C6',p:'#6F8FB0'};
const av=(h,sz=22)=>{const c=h.replace('@','')[0];return `<span class="av" style="width:${sz}px;height:${sz}px;font-size:${Math.round(sz*.48)}px;background:${AVC[c]||'#A9A69E'}">${c.toUpperCase()}</span>`};
const faces=(hs,sz)=>`<span class="faces">${hs.map(h=>av(h,sz)).join('')}</span>`;
const topbar=`<div class="top"><div class="fan"></div><span class="wm">Montage</span><span class="ic2" style="margin-left:auto"><i data-g="menu" data-s="18"></i></span></div>`;
const tabs=(on)=>`<div class="tabs">${[['Picks','film'],['Browse','search'],['',''],['Social','users'],['Profile','user']].map(([n,g])=>n?`<span class="${n===on?'on':''}"><i data-g="${g}" data-s="22"></i>${n}</span>`:`<span class="moon"><svg class="i" viewBox="0 0 24 24" style="width:20px;height:20px;fill:#0B0B0D;stroke:none"><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/></svg></span>`).join('')}</div>`;
const stars=r=>'★'.repeat(Math.floor(r))+(r%1?'½':'');
