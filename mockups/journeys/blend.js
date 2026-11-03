// Blend mocks: line icons at stroke 1.75 (<i data-b="name" data-s="18">) and a two-shape radar
// (<svg class="r2" data-a="..9 values" data-b="..9 values" data-size="150">), nine strands in Dna9 order.
(function(){
const P={x:'<path d="M6 6l12 12M18 6L6 18"/>',cr:'<path d="M9 6l6 6-6 6"/>',cl:'<path d="M15 6l-6 6 6 6"/>',
share:'<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6"/>',
bell:'<path d="M6 9a6 6 0 0112 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z"/><path d="M10 20a2 2 0 004 0"/>',
belloff:'<path d="M8.5 4.3A6 6 0 0118 9c0 3 .6 4.9 1.2 6M6 9c0 6-2.5 7.5-2.5 7.5H16"/><path d="M10 20a2 2 0 004 0"/><path d="M3 3l18 18"/>',
leave:'<path d="M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4"/><path d="M10 16l-4-4 4-4M6 12h10"/>',
plus:'<path d="M12 5v14M5 12h14"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
ticket:'<path d="M3 8a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H5a2 2 0 00-2-2v-2a2 2 0 000-4z"/>',
tv:'<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 4.5a3.5 3.5 0 010 7M18 14a6 6 0 013.5 6"/>',
spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
more:'<circle cx="6" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18" cy="12" r="1.2"/>',
lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
film:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
play:'<path d="M8 5.5v13l10.5-6.5z"/>',bm:'<path d="M7 4h10v16l-5-4-5 4z"/>',
cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
msg:'<path d="M21 11.5a8.5 8.5 0 01-12.4 7.6L3.5 20.5l1.4-4.6A8.5 8.5 0 1121 11.5z"/>',
blend:'<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',
refresh:'<path d="M20 11a8 8 0 00-14.6-4.5M4 4v4h4"/><path d="M4 13a8 8 0 0014.6 4.5M20 20v-4h-4"/>',
star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.8z"/>',
search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
home:'<path d="M4 11l8-7 8 7v9H4z"/>',person:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
compass:'<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
pencil:'<path d="M4 20l4-1 11-11-3-3L5 16z"/>',nudge:'<path d="M5 12h10M11 7l5 5-5 5"/><path d="M19 5v14"/>'};
document.querySelectorAll('i[data-b]').forEach(e=>{const s=e.dataset.s||18;e.outerHTML=`<svg class="i" viewBox="0 0 24 24" style="width:${s}px;height:${s}px;${e.getAttribute('style')||''}">${P[e.dataset.b]||''}</svg>`});
const LBL=['Human drama','Complexity','Slow burn','Originality','Visual craft','Intensity','Spectacle','Wonder','Comedy'];
document.querySelectorAll('svg.r2').forEach(sv=>{
  const A=sv.dataset.a.split(',').map(Number),B=sv.dataset.b?sv.dataset.b.split(',').map(Number):null,S=+sv.dataset.size,pad=68,W=S+pad*2,c=W/2,R=S/2;
  sv.setAttribute('viewBox',`0 0 ${W} ${W-20}`);sv.setAttribute('width',W);sv.setAttribute('height',W-20);
  const pt=(k,r)=>{const a=-Math.PI/2+k*2*Math.PI/9;return[c+Math.cos(a)*r,c-10+Math.sin(a)*r]};
  let h='';for(const f of[1,.5])h+=`<polygon points="${[...Array(9)].map((_,k)=>pt(k,R*f).join(',')).join(' ')}" fill="none" stroke="#3A3A3E" stroke-width="1"${f===.5?' stroke-dasharray="3 3"':''}/>`;
  for(let k=0;k<9;k++){const[x,y]=pt(k,R);h+=`<line x1="${c}" y1="${c-10}" x2="${x}" y2="${y}" stroke="#2A2A2E"/>`}
  h+=`<polygon points="${A.map((x,k)=>pt(k,R*x).join(',')).join(' ')}" fill="rgba(201,165,122,.18)" stroke="#C9A57A" stroke-width="1.5" stroke-linejoin="round"/>`;
  if(B)h+=`<polygon points="${B.map((x,k)=>pt(k,R*x).join(',')).join(' ')}" fill="none" stroke="#8FB3D9" stroke-width="2" stroke-linejoin="round"/>`;
  LBL.forEach((t,k)=>{const[x,y]=pt(k,R+14);const anc=Math.abs(x-c)<8?'middle':x<c?'end':'start';h+=`<text x="${x}" y="${y+4}" text-anchor="${anc}" font-family="Inter" font-size="11" font-weight="500" fill="#8A877F">${t}</text>`});
  sv.innerHTML=h;});
})();
