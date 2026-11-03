// Line icons for the growth mocks: <i data-g="name" data-s="18"> becomes an inline SVG.
(function(){const P={x:'<path d="M6 6l12 12M18 6L6 18"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/>',share:'<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6"/>',
ticket:'<path d="M3 8a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H5a2 2 0 00-2-2v-2a2 2 0 000-4z"/>',film:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',plus:'<path d="M12 5v14M5 12h14"/>',cr:'<path d="M9 6l6 6-6 6"/>',cd:'<path d="M6 9l6 6 6-6"/>',
star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.8z"/>',bell:'<path d="M6 9a6 6 0 0112 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z"/><path d="M10 20a2 2 0 004 0"/>',
menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 4.5a3.5 3.5 0 010 7M18 14a6 6 0 013.5 6"/>',link:'<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
msg:'<path d="M21 11.5a8.5 8.5 0 01-12.4 7.6L3.5 20.5l1.4-4.6A8.5 8.5 0 1121 11.5z"/>',clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',dna:'<path d="M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12"/><path d="M8.5 7h7M8.5 17h7"/>',
split:'<path d="M12 3v6M12 9l-6 6v6M12 9l6 6v6"/>',decade:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 6v12M16 6v12"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',sliders:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',gift:'<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18M12 9v11M12 9c-2-4-6-4-6-1.5S9 9 12 9c3 0 6 .5 6-1.5S14 5 12 9"/>',
spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',canon:'<path d="M12 3l2.2 4.6 5 .7-3.6 3.5.9 5L12 14.4 7.5 16.8l.9-5L4.8 8.3l5-.7z"/>',bm:'<path d="M7 4h10v16l-5-4-5 4z"/>',chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
palette:'<circle cx="12" cy="12" r="8.5"/><circle cx="8.5" cy="10" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="15.5" cy="10" r="1"/><path d="M12 20.5c-1.5 0-2-1.5-1-2.5s0-2.5 1.5-2.5H16"/>',
image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',flask:'<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 001.3 2h12.4a1.5 1.5 0 001.3-2L14 9V3"/>',
copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/>',more:'<circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/>',
dl:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'};
document.querySelectorAll('i[data-g]').forEach(e=>{const s=e.dataset.s||18;e.outerHTML=`<svg class="i" viewBox="0 0 24 24" style="width:${s}px;height:${s}px;${e.getAttribute('style')||''}">${P[e.dataset.g]||''}</svg>`});})();
