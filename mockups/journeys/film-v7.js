Object.assign(AVC,{J:'#8FB592',A:'#B8A3D6',H:'#D1B26F',M:'#8FB3D9',R:'#C9A08F',j:'#8FB592',a:'#B8A3D6',h:'#D1B26F',t:'#C9A08F'});
const SB=t=>`<div class="sb"><span>${t}</span><span><span class="bars"><b style="height:5px"></b><b style="height:7px"></b><b style="height:9px"></b><b style="height:11px"></b></span><i></i></span></div>`;
const HDR=`<div class="hdr"><span class="ic2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 6l-6 6 6 6"/></svg></span><b>The Dark Knight</b><span class="ic2"><i data-g="share" data-s="16"></i></span></div>`;
const SYN=`<p class="syn">Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney H… <u>More</u></p>`;
const SP='<path d="M12 1.9c.4 0 .75.23.92.6l2.55 5.3 5.8.8c.82.12 1.15 1.13.55 1.7l-4.2 4.1 1 5.8c.14.82-.72 1.44-1.45 1.05L12 18.5l-5.17 2.75c-.73.39-1.6-.23-1.45-1.05l1-5.8-4.2-4.1c-.6-.57-.27-1.58.55-1.7l5.8-.8 2.55-5.3c.17-.37.52-.6.92-.6z"/>';
const STAR=`<svg viewBox="0 0 24 24">${SP}</svg>`;
const S5=`<span class="st5 on">${STAR.repeat(5)}</span>`;
const EYE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>';
const BM='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M7 4h10v16l-5-4-5 4z"/></svg>';
const CSTAR=`<svg viewBox="0 0 24 24" fill="#EFE8DA">${SP}</svg>`;
const PILLS=`<div class="pls"><span class="pl seen">${EYE}Seen</span><span class="pl">${BM}Rewatch</span><span class="pl canon">${CSTAR}Canon</span></div>`;
const CR='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>';
const CRL='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>';
const CHK='<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const PERSON='<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.2-3.6 4-5.3 7.5-5.3s6.3 1.7 7.5 5.3"/></svg>';
const TICKET='<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linejoin="round"><path d="M3 8a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H5a2 2 0 00-2-2v-2a2 2 0 000-4z"/><path d="M14 6v12" stroke-dasharray="2 2.4"/></svg>';
const LAB=`<div class="lab">Your rating<span class="r">4.5★ on Letterboxd · ${EYE} Widely seen</span></div>`;
const PC=`<div class="pc"><span class="num">92<small>%</small></span><span class="tx"><div class="k">Our read</div><div class="v"><span class="okc">${CHK}</span>Spot on<span class="sub">· you gave it 5★</span></div></span><span class="cv">${CRL}</span></div>`;
const LOG='<span class="lw">+ Log a watch</span>';
// a watch line: [day, year] · who · stars
const W=(md,y,who,st)=>`<div class="wr"><span class="d"><b>${md}</b>${y?`<span>${y}</span>`:''}</span><span class="who">${who}</span><span class="rt${st?'':' mu'}">${st||'Seen'}</span></div>`;
const WITH=h=>`${av(h,22)}<span>with <span class="h">${h}</span></span>`;
const SOLO=`<span class="solo">${PERSON}</span><span>On your own</span>`;
const NIGHT=`<span class="stk">${av('@jules',22)}${av('@ana_r',22)}${av('@hugo',22)}</span><span class="two"><span><span class="h">@jules, @ana_r</span> +2</span><small class="mn">${TICKET}Movie night</small></span>`;
const TOG=(h,n,b,s)=>`<div class="tgc">${av(h,28)}<span class="t">You and ${h}: ${n} nights together · ${b}% Blend<small>Since ${s}</small></span><span class="cv">${CRL}</span></div>`;
const YW=(rows,extra='')=>`<div class="yw"><div class="yk">Your watches</div>${rows}${extra}</div>`;
const rate=(line,watches='')=>`<div class="s2">${LAB}<div class="rw">${S5}<span class="wl">${line}</span></div>${PC}${PILLS}${LOG}${watches}</div>`;
// friends: v4 version 2
const fc=(h,r,s=32)=>`<span class="fc2">${av(h,s)}${r}</span>`;
const HEART='<svg class="hrt" viewBox="0 0 24 24"><path d="M12 20.5S3 14.8 3 8.9A4.6 4.6 0 0112 7a4.6 4.6 0 019 1.9c0 5.9-9 11.6-9 11.6z"/></svg>';
const frB=c=>`<div class="s2 sec"><div class="lab">Friends</div>
<div class="card2 fB"><div class="top"><b>4.5★</b><span>12 friends saw it</span><span class="chev">${CR}</span></div>
<div class="facesR">${fc('J','5★')}${fc('A','4.5★')}${fc('H','4★')}${fc('M','4★')}${fc('R','3.5★')}<span class="fc2"><span class="more2">+7</span><span style="color:#8A877F">all</span></span></div>
<div class="hl">${HEART}<span><b>@jules</b> loved it · put it in their Canon</span></div></div></div>`;
const TL={appletv:['#fff','#000']};
const tile=(k,mine)=>{const im=k==='hbomax'||k==='hboamz';const [bg,fg]=TL[k]||['#000','#fff'];
 return `<span class="lg${mine?' mine':''}" style="background:${im?'#000':bg}">${im?`<img src="../img/logos/${k==='hbomax'?'hbomax':'hbomax-amazon'}.png">`:`<svg viewBox="0 0 24 24" fill="${fg}"><path d="${LOGO[k]}"/></svg>`}${mine?`<span class="ck">${CHK}</span>`:''}</span>`};
const WH=`<div class="s2 sec"><div class="lab">Where to watch</div><div class="wmine">Streaming on Max, one of yours</div>
<div class="wpanel"><div class="wrow">${tile('hboamz',1)}<span class="n">HBO Max Amazon Channel</span><span class="h">Stream</span></div>
<div class="wrow">${tile('hbomax',1)}<span class="n">HBO Max</span><span class="h">Stream</span></div>
<div class="wrow">${tile('appletv')}<span class="n">Apple TV</span><span class="h">Rent or buy</span></div></div>
<div class="wall">All 9 options</div><div class="wjw">Availability via JustWatch</div></div>`;
const WT=`<div class="s2 sec"><div class="lab">Watch together</div><div class="wt"><span class="ic"><i data-g="ticket" data-s="16"></i></span><span class="t">Start a movie night<small>Pick it with friends, vote, press play</small></span><span class="cv">${CRL}</span></div></div>`;
const MLT=`<div class="s2 sec"><div class="lab">More like this</div><div class="mlt"><div><i style="background-image:url(../img/inception.png)"></i><span>Inception</span></div><div><i style="background-image:url(../img/prisoners.png)"></i><span>Prisoners</span></div><div><i style="background-image:url(../img/itnotf.png)"></i><span>In the Name of the Father</span></div></div></div>`;
// v7: the watches line. Left: the watched line (one watch) or "Your watches" with the count; right: "+ Log a watch".
const LW2='<span class="lw2">+ Log a watch</span>';
const YWH=left=>`<div class="ywh">${left}${LW2}</div>`;
const rate7=(starsLine,watchRow,list='')=>`<div class="s2">${LAB}<div class="rw">${S5}${starsLine?`<span class="wl">${starsLine}</span>`:''}</div>${PC}${PILLS}${watchRow}${list}</div>`;
const LIST2=W('Jun 21','2025',WITH('@jules'),'5★')+W('Mar 4','2024',SOLO,'4.5★');
const RATE_TWO=rate7('',YWH('<span class="ywt">Your watches<small>2</small></span>'),`<div class="yw2">${LIST2}${TOG('@jules',3,81,'September')}</div>`);
const RATE_ONE=rate7('',YWH('<span class="lft">Watched once · Jun 21, 2025</span>'));
// full page pieces
const PLAY='<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z"/></svg>';
const HERO=(trailer=true)=>`<div class="fhero"><span class="cb l"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 6l-6 6 6 6"/></svg></span><span class="cb r"><i data-g="share" data-s="16"></i></span><div class="tp">The Dark Knight</div>${trailer?`<span class="trl">${PLAY}Trailer</span>`:''}</div>`;
const HEAD=(acts='')=>`<div class="hd"><h2>The Dark Knight</h2><div class="mt">2008 · 2H 32M · PG-13 · ACTION, CRIME</div><div class="fdir">Directed by <b>Christopher Nolan</b></div>${acts}<div class="fchips"><span class="fchip">DC Superhero Universe</span><span class="fchip">Costumed Vigilante Crime</span></div>${SYN.replace('class="syn"','class="syn" style="margin-top:14px"')}</div>`;
const ACTS=`<div class="acts"><span class="b2 cream">${PLAY.replace('<svg','<svg fill="#0B0B0D"')}Trailer</span><span class="b2"><i data-g="ticket" data-s="15"></i>Watch together</span></div>`;
const PC_UNSEEN=`<div class="pc"><span class="num">92<small>%</small></span><span class="tx"><div class="k">Our read</div><div class="v">You'll likely love it<span class="sub">· like Heat</span></div></span><span class="cv">${CRL}</span></div>`;
const S0=`<span class="st5">${STAR.repeat(5)}</span>`;
const PILLS_U=`<div class="pls"><span class="pl">${EYE}Seen</span><span class="pl">${BM}Watchlist</span><span class="pl">${CSTAR.replace('#EFE8DA','#8A877F')}Canon</span></div>`;
const RATE_U=`<div class="s2 sec"><div class="lab">Your rating<span class="r">4.5★ on Letterboxd · ${EYE} Widely seen</span></div><div class="rw">${S0}<span class="wl">Seen it? Rate it</span></div>${PILLS_U}</div>`;
const PRED_U=`<div class="s2 sec"><div class="lab">Our read<span class="r">4.5★ on Letterboxd · ${EYE} Widely seen</span></div>${PC_UNSEEN}<div class="rw">${S0}<span class="wl">Seen it? Rate it</span></div>${PILLS_U}</div>`;
const SEC=(lab,body,r='')=>`<div class="s2 sec"><div class="lab">${lab}${r?`<span class="r">${r}</span>`:''}</div>${body}</div>`;
const RATE_SEC=RATE_TWO.replace('class="s2"','class="s2 sec"');
const TAKES=(seen=true)=>SEC('Takes',seen?`<div class="card2 tk"><q>The interrogation scene alone is worth the whole trilogy.</q><div class="by">${av('@ana_r',20)}<b>@ana_r</b> · 4.5★ · Friends</div><div class="act"><span>Add your take</span><span style="color:#8A877F">Read all 8 ${CR}</span></div></div>`:`<div class="card2 tk"><div style="font:600 15px Inter;color:#EFE8DA">8 takes, 3 from friends</div><div class="by" style="margin-top:4px">Hidden until you've seen it, so nothing is spoiled.</div><div class="act"><span>Open the takes</span></div></div>`,'8 takes');
const TAB_TH=`<div class="thc"><span>Moral Ambiguity</span><span>Chaos vs Order</span><span>Vigilante Justice</span><span>Sacrifice</span><span>Corruption</span></div>`;
const ABOUT=(det=true,on='Themes')=>{const t=['Themes','Cast','Crew'].concat(det?['Details']:[]);
 return `<div class="s2 sec"><div class="ftabs">${t.map(x=>`<span class="${x===on?'on':''}${x==='Details'&&x!==on?' nw':''}">${x}</span>`).join('')}</div>${on==='Cast'?`<div class="cst"><div><i></i>Christian Bale<small>Bruce Wayne</small></div><div><i></i>Heath Ledger<small>Joker</small></div><div><i></i>Aaron Eckhart<small>Harvey Dent</small></div><div><i></i>Gary Oldman<small>Gordon</small></div></div>`:TAB_TH}</div>`};
const MLT2=MLT.replace('More like this','More like The Dark Knight').replace('../img/itnotf.png','../img/tmdb/e09dLw1Ljtccd2P4NsuUvVtS5du.jpg').replace('In the Name of the Father','Heat');
const LINKS=`<div class="s2 sec"><div class="lnk"><span>IMDb</span><span>Letterboxd</span></div></div>`;
const WTS=`<div class="s2 sec"><div class="lab">Watch together</div><div class="wt">${av('@hugo',36)}<span class="t">hugo<small><span class="bl">78%</span> Blend</small></span><span class="b2" style="padding:0 12px"><i data-g="ticket" data-s="15"></i>Movie night</span></div></div>`;
// Friends with Watch together inside it (and, for C, the top take)
const FR_IN=(take)=>`<div class="s2 sec"><div class="lab">Friends</div>
<div class="card2 fB"><div class="top"><b>4.5★</b><span>12 friends saw it</span><span class="chev">${CR}</span></div>
<div class="facesR">${fc('J','5★')}${fc('A','4.5★')}${fc('H','4★')}${fc('M','4★')}${fc('R','3.5★')}<span class="fc2"><span class="more2">+7</span><span style="color:#8A877F">all</span></span></div>
<div class="hl">${HEART}<span><b>@jules</b> loved it · put it in their Canon</span></div>
${take?`<div class="frq"><q>The interrogation scene alone is worth the whole trilogy.</q><div class="by"><span><b>@ana_r</b> · 4.5★</span><span class="lk">All 8 takes ${CR}</span></div></div>`:''}
<div class="frw">${av('@hugo',30)}<span class="t"><b>Watch with @hugo</b><small>Wants to see it · <span class="bl">78%</span> Blend</small></span><span class="b2"><i data-g="ticket" data-s="15"></i>Movie night</span></div></div></div>`;
