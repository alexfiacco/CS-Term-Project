// dm-card-v3: the seven directions, the thread, the states grid and the measured heights.
// Pages call V3.phones(ids, el), V3.states(ids, el), V3.heights(el).
(function(){
const IMG='../img/tmdb/';
const F={
  pl:{t:'Past Lives',y:2023,d:'Celine Song',p:'k3waqVXSnvCZWfJYNtdamTgTtTA.jpg',c:['#3F5A6B','#141D24'],sp:'center 1%'},
  mood:{t:'In the Mood for Love',y:2000,d:'Wong Kar-wai',p:'iYypPT4bhqXfq1b6EnmxvRt6b2Y.jpg',c:['#6E2217','#220B08'],sp:'center 100%',bs:'118%'},
  ee:{t:'Everything Everywhere All at Once',y:2022,d:'Daniel Kwan',p:'u68AjlvlutfEIcpmbYpKcdi09ut.jpg',c:['#4C3A6C','#17122A'],sp:'center 96%'},
  por:{t:'Portrait of a Lady on Fire',y:2019,d:'Céline Sciamma',p:'2LquGwEhbg3soxSCs9VNyh5VJd9.jpg',c:['#5A3820','#160E08'],sp:'center 100%',bs:'135%'}
};
// The thread, as the reader (you) sees it. Sam sends Past Lives with a note (you have not seen it, it
// is on your Hulu); you send In the Mood for Love with "lol" (you rated it 5★, it is on your rewatch
// list); Sam sends the long title (you rated it 4★, not saved); you send Portrait (unseen, saved, newest).
const T=[
  {k:'txt',me:0,t:'ok you have to see this'},
  {k:'card',me:0,f:'pl',m:91,note:'the bar scene. that’s all I’ll say',a:'save',svc:'Hulu'},
  {k:'txt',me:1,t:'adding it. trade you'},
  {k:'card',me:1,f:'mood',r:'5★',note:'lol',a:'onre'},
  {k:'card',me:0,f:'ee',r:'4★',a:'re'},
  {k:'card',me:1,f:'por',m:88,a:'saved',hero:1},
];
const BM='<path d="M6.5 4h11v16l-5.5-4-5.5 4z"/>';
const ic={
  bm:on=>`<svg class="i${on?' f':''}" viewBox="0 0 24 24">${BM}</svg>`,
  play:()=>`<svg class="i f" viewBox="0 0 24 24" style="width:12px;height:12px"><path d="M7 4.5v15l12.5-7.5z"/></svg>`,
  open:()=>`<svg class="i" viewBox="0 0 24 24" style="width:13px;height:13px"><path d="M7 17 17 7M9 7h8v8"/></svg>`,
};
const PRI={save:['Save',0],saved:['Saved',1],re:['Rewatch',0],onre:['Saved',1]};
const btns=c=>{const [w,on]=PRI[c.a];
  const s=c.svc?`<span class="pb s">${ic.play()}Watch on ${c.svc}</span>`:`<span class="pb s">Open${ic.open()}</span>`;
  return `<div class="btns"><span class="pb p${on?' on':''}">${ic.bm(on)}${w}</span>${s}</div>`;};
const line=c=>c.m?`<span class="stp">${c.m}<span class="pq">%</span> for you</span>`:`<span class="rt">Rated <b>${c.r}</b></span>`;
const po=(c,cls='')=>`<img class="po${c.hero?' hero':''}${cls}" src="${IMG+F[c.f].p}">`;
const fx=f=>`${F[f].y} · ${F[f].d}`;
const note=c=>c.note?`<div class="nt">${c.note}</div>`:'';
const bg=(f,pos)=>`background-image:url(${IMG+F[f].p});background-position:${pos||F[f].sp}`+(!pos&&F[f].bs?`;background-size:${F[f].bs}`:'');
const SAM='<span class="fc" style="width:32px;height:32px;background:#7fae8c">S</span>';

const R={
  k1:c=>{const f=F[c.f];return `<div class="k1"><div class="band"><i style="${bg(c.f,'center 30%')}"></i></div><div class="g">${po(c)}<div class="r"><div class="t clamp3">${f.t}</div><div class="fx">${fx(c.f)}</div><div class="ln">${line(c)}</div></div></div>${note(c)}${btns(c)}</div>`;},
  k2:c=>{const f=F[c.f];return `<div class="k2"><div class="g">${po(c)}<div class="r"><div class="kk">${fx(c.f)}</div><div class="t clamp3">${f.t}</div><div class="ln">${line(c)}</div></div></div>${note(c)}${btns(c)}</div>`;},
  k3:c=>{const f=F[c.f];return `<div class="k3${c.hero?' hero':''}"><div class="still" style="${bg(c.f)}"><div class="tag">${line(c)}</div><div class="cp"><div class="t clamp3">${f.t}</div><div class="fx">${fx(c.f)}</div></div></div><div class="bd">${note(c)}${btns(c)}</div></div>`;},
  k4:c=>{const f=F[c.f];return `<div class="k4" style="--c1:${f.c[0]};--c2:${f.c[1]}"><div class="g">${po(c)}<div class="r"><div class="t clamp3">${f.t}</div><div class="fx">${fx(c.f)}</div><div class="ln">${line(c)}</div></div></div>${note(c)}${btns(c)}</div>`;},
  k5:c=>{const f=F[c.f];return `<div class="k5"><div class="mq${c.hero?' hero':''}"><i style="${bg(c.f,'center 30%')}"></i><div class="lt"></div><div class="ey">${c.me?'You sent':'Sam sent'}</div><div class="t">${f.t}</div><div class="fx">${fx(c.f)}</div></div><div class="ln">${line(c)}</div>${note(c)}${btns(c)}</div>`;},
  k6:c=>{const f=F[c.f];return `<div class="k6"><div class="g">${po(c)}<div class="r"><div class="t">${f.t}<small>${f.y}</small></div><div class="sb"><div class="fx">${f.d}</div><div class="ln">${line(c)}</div></div>${btns(c)}</div></div>${note(c)}</div>`;},
  k7:c=>{const f=F[c.f];
    const hero=c.note?`<div class="qm">“</div><div class="q${c.note.length<8?' big':''}">${c.note}</div><div class="by">${c.me?'You':'Sam'}</div>`:`<div class="q">${f.t}</div><div class="by">${fx(c.f)}</div>`;
    const fm=c.note?`<div class="fm">${po(c)}<div><div class="t">${f.t}</div><div class="fx">${fx(c.f)}</div></div></div>`:'';
    return `<div class="k7${c.hero?' hero':''}"><div class="still" style="${bg(c.f)}"><div class="tag">${line(c)}</div><div class="qt">${hero}</div></div><div class="bd">${fm}${c.note?btns(c):btns(c).replace('class="btns"','class="btns" style="margin-top:0"')}</div></div>`;},
  today:c=>{const f=F[c.f];
    const ln=c.r?`<div class="ln">You rated it ${c.r}</div>`:`<div class="ln"><b>${c.m}<span class="pq">%</span></b> <span>you</span></div>`;
    const on=PRI[c.a][1];
    return `<div class="c0"><div class="tp"><img class="po" style="width:64px;height:96px" src="${IMG+f.p}"><div><div class="t">${f.t}</div><div class="fx">${fx(c.f)}</div>${ln}${c.me?'':'<div class="by">sent by Sam</div>'}${c.note?`<div class="nt2">${c.note}</div>`:''}</div></div><div class="ft"><div class="${on?'on':''}">${ic.bm(on)}${on?'Saved':'Save'}</div><div>Details</div></div></div>`;},
};

const D={
  k1:{n:1,h:'Backdrop band',s:'The film\'s backdrop, blurred and darkened, as the card\'s top band. The poster hangs off it with a soft drop, the title sits over the band in white Bodoni, the stamp under it. A cream Save and a quiet second pill.',
      c:['<b>Most "app" of the set</b>: it borrows the film page\'s header, so the card reads as a little film page.','Each card takes the film\'s own colour from the band, so a thread of shares looks varied, not a stack of grey boxes.','<span class="no"></span>Needs the backdrop: <code>backdrop_path</code> at w780 (the mock blurs the poster as a stand in).']},
  k2:{n:2,h:'Editorial',s:'Cream paper on ink, the share card turned inside out: small caps year and director over a Bodoni title, the poster as a print, the stamp in a darker blue for paper. Ink Save, paper second pill.',
      c:['Unmistakably Montage: the cream, the Bodoni, the stamp, the oxblood offset on the newest print.','The brightest thing on the screen; a chat of four shares turns into a column of paper.','Reads best with a note; the note sets like a line in a magazine.']},
  k3:{n:3,h:'Cinema still',s:'A wide 16:9 still across the top, a gradient to the card, the title in big Bodoni on the picture with caps year and director. The stamp sits on the still\'s corner. Note and pills underneath.',
      c:['<b>The most cinematic</b>: a frame from the film, not its marketing.','Long titles have room: two lines of 23pt on a 280 wide picture.','Tallest of the dark set; needs a good still, and TMDB backdrops are sometimes text heavy.']},
  k4:{n:4,h:'Artwork',s:'An Apple Music style share: the card is filled with the poster\'s own colour (sampled, darkened to a gradient), a big 84 by 126 poster, white Bodoni, a white Save and a frosted second pill.',
      c:['The richest single card; each film brings its own colour, like an album share.','Easy to build: one sampled colour per poster (cached), no backdrop needed.','A red poster gives a red card next to the oxblood; the sample would need a cap on saturation.']},
  k5:{n:5,h:'Marquee',s:'The title on a cinema sign: spaced Bodoni capitals on a dim panel of the poster, ringed by small warm bulbs, "Sam sent" in blue caps. The stamp pins the sign, the note and pills sit under it.',
      c:['<b>The most theatrical</b>, and the only one that makes sending a film feel like an event.','No poster thumbnail: the sign carries the title, the dim art carries the colour.','Capitals make long titles take three lines; the bulbs must stay small or it tips into a casino.']},
  k6:{n:6,h:'Diary row',s:'A diary entry: a 50 by 75 poster, the title in Bodoni with the year beside it in Inter, the director, the stamp at the row\'s right, and two small hugging pills under the title.',
      c:['<b>The most compact</b> with real buttons by a wide margin.','Reads as a list item, so four shares in a row look like a shared log.','The least "wow": it is good furniture, not a moment.']},
  k7:{n:7,h:'Still and quote',s:'The sender\'s note is the hero: set big in Bodoni over a darkened still with an open quote mark and "Sam" under it. The film is a small row below (tiny poster, title), then the pills. No note, and the title takes the still.',
      c:['<b>The most personal</b>: what your friend said is the biggest thing on the card.','"lol" as a 40pt quote is funny in a good way; long notes step down to 23pt and three lines.','The film\'s name is second; you need the small row to know what it is.']},
};

function phone(id,rec,meas){
  let h=`<div class="ph2${rec?' rec':''}" id="ph-${id}${meas?'-m':''}"><div class="chd"><svg class="i bk" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>${SAM}<div class="nm">Sam</div></div><div class="msgs">`;
  for(const m of T) h+=`<div class="m ${m.me?'me':'them'}">${m.k==='txt'?`<div class="tb">${m.t}</div>`:R[id](m)+'<span class="hpx"></span>'}</div>`;
  return h+`<div class="rcpt">Read</div></div><div class="cmp">Message<b></b></div></div>`;
}
const REC='k1';
const V3={F,T,R,D,REC,
  phones(ids,el){
    el.innerHTML=ids.map(id=>{
      if(id==='today') return `<div class="fr"><div class="fl">Today, build 21</div><div class="fh">The box with a footer</div><div class="fs">GroupFeed.swift filmCard as it ships: the blue outline, the split footer. For comparison only.</div>${phone('today')}<div class="cap"><ul><li class="no">Two rules and a split footer; Details repeats the tap; it reads as a form.</li></ul></div></div>`;
      const d=D[id],rec=id===REC;
      return `<div class="fr"><div class="fl"${rec?' style="color:#EFE8DA"':''}>Direction ${d.n}${rec?'<span class="pill rec">Recommended</span>':''}</div><div class="fh">${d.h}</div><div class="fs">${d.s}</div>${phone(id,rec)}<div class="cap"><ul>${d.c.map(x=>x.startsWith('<span class="no">')?`<li class="no">${x.replace('<span class="no"></span>','')}</li>`:`<li>${x}</li>`).join('')}</ul></div></div>`;
    }).join('');
    return document.fonts.ready.then(()=>{for(const id of ids){const ph=document.getElementById('ph-'+id);
      ph.querySelectorAll('.hpx').forEach(e=>e.textContent=Math.round(e.previousElementSibling.getBoundingClientRect().height));}});
  },
  states(ids,el){
    const ST=[['Not seen, not saved','save','pl',91,'Saved to your watchlist'],['Not seen, saved','saved','pl',91,'Removed from your watchlist'],
              ['Seen, not saved','re','mood',0,'Saved to your rewatch list'],['Seen, saved','onre','mood',0,'Removed from your rewatch list']];
    let h='<div></div>'+ST.map(s=>`<div class="hdc">${s[0]}</div>`).join('');
    for(const id of ids){const d=D[id];
      h+=`<div class="vl">${d.n} · ${d.h}<small>${id===REC?'Recommended':''}</small></div>`;
      for(const s of ST){const c={f:s[2],a:s[1],me:0,m:s[3],r:'5★',svc:s[2]==='pl'?'Hulu':null};
        h+=`<div class="cell"><div class="them">${R[id](c)}</div><div class="toast">${ic.bm(1)}${s[4]}</div></div>`;}
    }
    el.innerHTML=h;
  },
  heights(el){
    const ids=['today','k1','k2','k3','k4','k5','k6','k7'];
    const off=document.createElement('div');off.className='offscreen';off.innerHTML=ids.map(id=>phone(id,0,1)).join('');document.body.appendChild(off);
    return document.fonts.ready.then(()=>new Promise(r=>setTimeout(r,200))).then(()=>{
      const cols=['Past Lives, note','In the Mood, "lol"','Long title','Portrait, newest'];
      const rows=ids.map(id=>{const ph=document.getElementById('ph-'+id+'-m');
        const cards=[...ph.querySelectorAll('.hpx')].map(e=>e.previousElementSibling.getBoundingClientRect().height);
        return {id,cards,thr:ph.querySelector('.msgs').getBoundingClientRect().height};});
      const base=rows[0],max=Math.max(...rows.map(r=>r.thr));
      let h=`<tr><th>Card</th>${cols.map(c=>`<th>${c}</th>`).join('')}<th>Thread</th><th>vs today</th><th></th></tr>`;
      for(const r of rows){const d=D[r.id];const dd=Math.round((r.thr/base.thr-1)*100);
        h+=`<tr class="${r.id===REC?'rec':''}"><td>${d?d.n+' · '+d.h:'Today, build 21'}</td>${r.cards.map(v=>`<td>${Math.round(v)}</td>`).join('')}<td class="tot">${Math.round(r.thr)}</td><td>${r===base?'':(dd>0?'+':'')+dd+'%'}</td><td style="width:180px"><span class="bar" style="width:${Math.round(170*r.thr/max)}px"></span></td></tr>`;}
      el.innerHTML=h;off.remove();
    });
  }
};
window.V3=V3;
})();
