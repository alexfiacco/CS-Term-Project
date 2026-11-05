// share-cards-v2: the character kit's moving parts. Loads after share-cards-v1.js (posters P, url, STAR).
//   .gh[data-g]   ghosted archetype names: "The Old Soul@top,left,size,opacity,rotate;..." in card px
//   .pw[data-ps]  a dimmed wall of upright posters: data-c columns, data-w tile width, data-n tiles, data-gap
//   .reel[data-ps] films on a celluloid band: data-w frame width, data-rank to number the frames
//   .dna2[data-v] the Film DNA silhouette, with the oxblood offset when data-ox is set
//   .dna3[data-v]  v3: the Film DNA as a chart (rings, spokes, the strongest strands named)
//   .col[data-twin] v3: a copy of a card with the plain row (.prow) as the subtle reel (.reel.sub)
//   .wc2[data-v1] word count of the card before it (ghost names excluded), against v1's count
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".gh[data-g]").forEach((g) => {
    g.dataset.g.split(";").filter(Boolean).forEach((s) => {
      const [name, args] = s.split("@");
      const [t, l, size, op, rot] = args.split(",").map(Number);
      const e = document.createElement("span");
      e.textContent = name.trim();
      Object.assign(e.style, { top: t + "px", left: l + "px", fontSize: size + "px", opacity: op, transform: `rotate(${rot}deg)` });
      g.appendChild(e);
    });
  });
  document.querySelectorAll(".pw[data-ps]").forEach((w) => {
    const ks = w.dataset.ps.split(","), n = +(w.dataset.n || 24), c = +(w.dataset.c || 8), tw = +(w.dataset.w || 150), gap = +(w.dataset.gap || 12);
    w.style.gridTemplateColumns = `repeat(${c},${tw}px)`;
    w.style.gap = gap + "px";
    for (let i = 0; i < n; i++) { const t = document.createElement("i"); t.style.backgroundImage = url(ks[i % ks.length]); w.appendChild(t); }
  });
  // v3: [data-twin] columns are a copy of a v3 card with its plain row swapped for the subtle reel
  document.querySelectorAll(".col[data-twin]").forEach((col) => {
    const src = document.getElementById(col.dataset.twin), c = src.cloneNode(true);
    c.removeAttribute("id");
    c.querySelectorAll(".prow").forEach((r) => { r.classList.remove("prow"); r.classList.add("reel", "sub"); });
    col.innerHTML = `<div class="mini">${col.dataset.lab || "v3 · subtle reel"}</div>`;
    col.appendChild(c);
    const w = src.nextElementSibling;
    if (w && w.classList.contains("wc3")) col.appendChild(w.cloneNode(true));
  });
  // films in a row: .reel (celluloid band, or .reel.sub the quiet one) or .prow (plain, gaps);
  // data-split breaks the row into rows of that many (the Canon's 5 + 5)
  document.querySelectorAll(".reel[data-ps],.prow[data-ps]").forEach((r) => {
    const ks = r.dataset.ps.split(","), w = +(r.dataset.w || 200), h = Math.round(w * 1.5), rank = r.dataset.rank, sp = +(r.dataset.split || ks.length);
    const fr = ks.map((k, i) => `<i style="width:${w}px;height:${h}px;background-image:${url(k)}">${rank ? `<b>${i + 1}</b>` : ""}</i>`);
    const rows = [];
    for (let i = 0; i < fr.length; i += sp) rows.push(`<div class="frames">${fr.slice(i, i + sp).join("")}</div>`);
    r.innerHTML = r.classList.contains("prow") ? rows.join("") : `<div class="perf"></div>${rows.join('<div style="height:10px"></div>')}<div class="perf"></div>`;
  });
  // v3 Film DNA: rings at a third, two thirds and full; nine faint spokes; soft fill; the strongest
  // strands get a bright dot and their name (data-lab "0:Human drama,2:Slow burn,4:Visual craft")
  document.querySelectorAll(".dna3[data-v]").forEach((e) => {
    const v = e.dataset.v.split(",").map(Number), s = +(e.dataset.s || 320), c = s / 2, R = s / 2 - 4, fs = +(e.dataset.fs || 30);
    const ang = (i) => -Math.PI / 2 + i * 2 * Math.PI / v.length;
    const P = (r, i) => [c + R * r / 100 * Math.cos(ang(i)), c + R * r / 100 * Math.sin(ang(i))];
    const poly = (f) => v.map((x, i) => P(f(x), i).map((n) => n.toFixed(1)).join(",")).join(" ");
    const sw = Math.max(2, s / 90);
    let svg = `<svg width="${s}" height="${s}">`;
    [100, 66, 33].forEach((r, j) => { svg += `<polygon points="${poly(() => r)}" fill="${j ? "none" : "rgba(239,232,218,.035)"}" stroke="rgba(239,232,218,${j ? .1 : .16})" stroke-width="${sw * .6}"/>`; });
    v.forEach((x, i) => { const [x2, y2] = P(100, i); svg += `<line x1="${c}" y1="${c}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="rgba(239,232,218,.08)" stroke-width="${sw * .6}"/>`; });
    svg += `<polygon points="${poly((x) => x)}" fill="rgba(143,179,217,.24)" stroke="#8fb3d9" stroke-width="${sw}" stroke-linejoin="round"/>`;
    const labs = (e.dataset.lab || "").split(",").filter(Boolean).map((t) => { const [i, n] = t.split(":"); return [+i, n]; });
    labs.forEach(([i]) => { const [x, y] = P(v[i], i); svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(sw * 2.4).toFixed(1)}" fill="#8fb3d9"/>`; });
    svg += `</svg>`;
    let html = svg;
    labs.forEach(([i, n]) => {
      const a = ang(i), [x, y] = P(100, i), g = fs * .5, cs = Math.cos(a), sn = Math.sin(a);
      const lx = x + cs * g, ly = y + sn * g;
      const tx = cs > .3 ? "0" : cs < -.3 ? "-100%" : "-50%", ty = sn < -.8 ? "-100%" : sn > .8 ? "0" : "-50%";
      html += `<span class="lab" style="left:${lx.toFixed(1)}px;top:${ly.toFixed(1)}px;font-size:${fs}px;transform:translate(${tx},${ty})">${n}</span>`;
    });
    e.style.width = s + "px"; e.style.height = s + "px";
    e.innerHTML = html;
  });
  document.querySelectorAll(".dna2[data-v]").forEach((e) => {
    const v = e.dataset.v.split(",").map(Number), s = +(e.dataset.s || 320), c = s / 2, R = s / 2 - 6, ox = +(e.dataset.ox || 0);
    const pt = (x, i, d = 0) => { const a = -Math.PI / 2 + i * 2 * Math.PI / v.length; return `${(c + d + R * x / 100 * Math.cos(a)).toFixed(1)},${(c + d + R * x / 100 * Math.sin(a)).toFixed(1)}`; };
    const pts = (d) => v.map((x, i) => pt(x, i, d)).join(" ");
    const plate = v.map((x, i) => pt(100, i)).join(" ");
    const sw = Math.max(3, s / 64);
    e.innerHTML = `<svg width="${s}" height="${s}"><polygon points="${plate}" fill="rgba(239,232,218,.05)"/>` +
      (ox ? `<polygon points="${pts(ox)}" fill="#7a1220" stroke="#7a1220" stroke-width="${sw}" stroke-linejoin="round"/>` : "") +
      `<polygon points="${pts(0)}" fill="#1e2a38" stroke="#8fb3d9" stroke-width="${sw}" stroke-linejoin="round"/></svg>`;
  });
  const count = (k) => {
    const c = k.cloneNode(true);
    c.querySelectorAll(".gh,.pw").forEach((x) => x.remove());
    c.style.cssText += ";position:absolute;left:-99999px;zoom:1";
    document.body.appendChild(c);
    const n = wordsIn(c);
    c.remove();
    return n;
  };
  document.querySelectorAll(".wc3[data-v2]").forEach((w) => {
    const k = w.previousElementSibling, n = count(k), was = +w.dataset.v2;
    w.innerHTML = `Words: ${was} in v2 <span class="${n === was ? "" : "off"}">→ ${n} in v3</span>`;
  });
  document.querySelectorAll(".wc2[data-v1]").forEach((w) => {
    const k = w.previousElementSibling;
    w.innerHTML = `Words: ${w.dataset.v1} in v1 <span>→ ${count(k)} in v2</span>`;
  });
});

// ================= v4 =================
//   .tkt[data-opt=a|b|c][data-fmt=og|story]  the pick ticket's three new options, drawn from one set of facts
//   .mq[data-w][data-h]                       bulbs placed along the marquee frame
//   .wc4[data-v3]                             word count of the card before it, against v3's count
document.addEventListener("DOMContentLoaded", () => {
  const T = { film: "Heat", yd: "1995 · Michael Mann", when: "Fri 6 Nov · 2h 50m", pct: "91", p: "heat" };
  const fan = (s) => `<img src="fan.svg" style="width:${s}px;height:${s}px;display:block">`;
  const ink = (w, nb, ns, extra = "") => `<div class="inks" style="width:${w}px;height:${w}px;${extra}"><b style="font-size:${nb}px">${T.pct}%</b><small style="font-size:${ns}px">for the room</small></div>`;
  const B = {
    // A · the admission ticket: card stock, perforated ends, a column of holes at the tear, ADMIT ONE after the red dash
    "a-og": () => `<div class="k og v4" style="padding:0;align-items:center;justify-content:center">
      <div class="tka stock" style="width:1064px;height:470px;transform:rotate(-1.6deg)">
        <div style="position:relative;flex:1;padding:60px 66px 0">
          <div class="fr"></div>
          <div class="cap"><i class="rd"></i>Admit one</div>
          <div style="font:600 180px/.92 'Bodoni Moda';letter-spacing:-3px;margin-top:30px">${T.film}</div>
          <div class="meta" style="margin-top:16px">${T.yd}</div>
          <div class="meta" style="position:absolute;left:66px;bottom:58px">${T.when}</div>
          ${ink(212, 66, 13, "right:74px;top:118px")}
        </div>
        <div class="holes"></div>
        <div style="width:214px;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <div class="fr" style="left:6px"></div>${fan(58)}
          <div class="cap" style="writing-mode:vertical-rl;transform:rotate(180deg);margin-top:30px;letter-spacing:8px">Movie night</div>
        </div>
      </div></div>`,
    "a-story": () => `<div class="k story v4">
      <div class="hd"><img src="fan.svg"><div class="wm">Montage</div></div>
      <div class="tka v stock" style="width:820px;height:1290px;margin:70px auto 0;transform:rotate(-1.2deg)">
        <div style="position:relative;flex:1;padding:96px 86px 0">
          <div class="fr" style="inset:22px"></div>
          <div class="cap" style="font-size:26px;letter-spacing:8px;gap:20px"><i class="rd" style="width:84px;height:6px"></i>Admit one</div>
          <div style="font:600 250px/.9 'Bodoni Moda';letter-spacing:-5px;margin-top:70px">${T.film}</div>
          <div class="meta" style="font-size:40px;margin-top:26px">${T.yd}</div>
          <div class="meta" style="font-size:40px;margin-top:12px">${T.when}</div>
          ${ink(290, 92, 17, "right:84px;bottom:84px")}
        </div>
        <div class="holes"></div>
        <div style="height:250px;position:relative;display:flex;align-items:center;justify-content:center;gap:30px">
          <div class="fr" style="inset:6px 22px 22px"></div>${fan(70)}<div class="cap" style="font-size:26px;letter-spacing:9px">Movie night</div>
        </div>
      </div>
      <div class="row" style="justify-content:center;margin-top:auto"><div class="pill">montagefilm.app</div></div></div>`,
    // B · the marquee: a frame of bulbs round the title, the poster as a faint wash; the spine is its red
    "b-og": () => `<div class="k og v4 sp" style="padding:40px 44px 40px 62px">
      <div class="wash" data-p="${T.p}" style="opacity:.15"></div><div class="shade" style="background:rgba(11,11,13,.62)"></div>
      <div class="mq" data-w="1094" data-h="550" style="width:1094px;height:550px">
        ${fan(46)}<div class="ey2" style="margin-top:16px">Movie night · ${T.when.split(" · ")[0]}</div>
        <div style="font:600 196px/.96 'Bodoni Moda';letter-spacing:-4px;margin-top:6px">${T.film}</div>
        <div class="facts" style="font-size:30px;margin-top:6px">${T.yd} · ${T.when.split(" · ")[1]}</div>
        <div class="row" style="margin-top:26px"><div class="stamp sm" style="font-size:44px">${T.pct}<u>%</u></div><div class="soft" style="font-size:30px;margin-left:22px">for the room · Admit 4</div></div>
      </div></div>`,
    "b-story": () => `<div class="k story v4 sp">
      <div class="wash" data-p="${T.p}" style="opacity:.17;top:0"></div><div class="shade" style="background:rgba(11,11,13,.6)"></div>
      <div class="hd"><img src="fan.svg"><div class="wm">Montage</div></div>
      <div class="mq" data-w="900" data-h="1260" style="width:900px;height:1260px;margin:96px auto 0">
        <div class="ey2" style="font-size:30px;letter-spacing:8px">Movie night · ${T.when.split(" · ")[0]}</div>
        <div style="font:600 290px/.95 'Bodoni Moda';letter-spacing:-6px;margin-top:40px">${T.film}</div>
        <div class="facts" style="font-size:42px;margin-top:22px">${T.yd}</div>
        <div class="facts" style="font-size:42px;margin-top:8px">${T.when.split(" · ")[1]}</div>
        <div class="stamp" style="font-size:96px;margin-top:80px">${T.pct}<u>%</u></div>
        <div class="soft" style="font-size:42px;margin-top:34px">for the room · Admit 4</div>
      </div>
      <div class="row" style="justify-content:center;margin-top:auto"><div class="pill">montagefilm.app</div></div></div>`,
    // C · poster first, a slim ticket stub along the bottom; the poster's subtle shadow is its red
    "c-og": () => `<div class="k og v4" style="padding:42px 64px">
      <div class="row" style="align-items:flex-start">
        <div class="pp oxs" data-p="${T.p}" style="width:258px;height:387px;border-radius:12px"></div>
        <div style="margin-left:58px;height:387px;display:flex;flex-direction:column">${fan(50)}
          <div style="margin:auto 0"><div class="ttl" style="font-size:150px;letter-spacing:-3px">${T.film}</div>
          <div class="facts" style="font-size:34px;margin-top:12px">${T.yd}</div></div></div>
      </div>
      <div class="stub stock" style="left:64px;right:64px;bottom:40px;height:112px;padding:0 44px">
        <div style="font:600 46px 'Bodoni Moda';white-space:nowrap;margin-right:34px">Admit 4</div><div class="tear"></div>
        <div class="lab" style="margin-left:34px">Movie night · ${T.when}</div>
        <div class="inks" style="position:relative;width:auto;height:auto;border-radius:10px;padding:8px 18px 7px;margin-left:auto;transform:rotate(-5deg);box-shadow:inset 0 0 0 3px #ece4d2,inset 0 0 0 4.5px currentColor;border-width:4px"><b style="font-size:40px">${T.pct}%</b><small style="font-size:10px;margin-top:3px">for the room</small></div>
      </div></div>`,
    "c-story": () => `<div class="k story v4">
      <div class="hd"><img src="fan.svg"><div class="wm">Montage</div></div>
      <div class="center" style="margin-top:64px">
        <div class="pp oxs" data-p="${T.p}" style="width:620px;height:930px;border-radius:16px"></div>
        <div class="ttl" style="font-size:170px;letter-spacing:-4px;margin-top:66px">${T.film}</div>
        <div class="facts" style="font-size:42px;margin-top:16px">${T.yd}</div>
      </div>
      <div class="stub stock" style="left:72px;right:72px;bottom:110px;height:240px;padding:0 56px 0 60px">
        <div style="display:flex;flex-direction:column;align-items:center;margin-right:46px"><div class="lab" style="font-size:22px">Admit</div><div style="font:600 112px/1 'Bodoni Moda'">4</div></div><div class="tear" style="margin:22px 0"></div>
        <div style="margin-left:46px"><div class="lab" style="font-size:23px">Movie night</div><div style="font:400 38px Newsreader;color:#2c2822;margin-top:10px">${T.when}</div><div class="lab" style="font-size:19px;color:#2e5f92;margin-top:14px">montagefilm.app</div></div>
        ${ink(176, 56, 11, "position:relative;margin-left:auto;flex:none")}
      </div></div>`,
  };
  document.querySelectorAll(".tkt[data-opt]").forEach((e) => {
    e.outerHTML = B[e.dataset.opt + "-" + e.dataset.fmt]().replace('class="k ', `class="k ${e.dataset.z || ""} `);
  });
  document.querySelectorAll(".k [data-p]").forEach((e) => { if (!e.style.backgroundImage) e.style.backgroundImage = url(e.dataset.p); });
  document.querySelectorAll(".prow[data-ox] .frames i").forEach((i) => i.classList.add("oxs"));
  document.querySelectorAll(".mq[data-w]").forEach((m) => {
    const w = +m.dataset.w, h = +m.dataset.h, step = 34, b = 1.5;
    const side = (x0, y0, x1, y1) => { const L = Math.hypot(x1 - x0, y1 - y0), n = Math.round(L / step); const out = []; for (let i = 0; i < n; i++) out.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]); return out; };
    const pts = [...side(b, b, w - b, b), ...side(w - b, b, w - b, h - b), ...side(w - b, h - b, b, h - b), ...side(b, h - b, b, b)];
    m.insertAdjacentHTML("beforeend", pts.map(([x, y], i) => `<i class="bulb${i % 3 === 2 ? " d" : ""}" style="left:${(x - 3).toFixed(1)}px;top:${(y - 3).toFixed(1)}px"></i>`).join(""));
  });
  document.querySelectorAll(".wc4").forEach((w) => {
    const k = w.previousElementSibling, c = k.cloneNode(true);
    c.querySelectorAll(".gh,.pw").forEach((x) => x.remove());
    c.style.cssText += ";position:absolute;left:-99999px;zoom:1";
    document.body.appendChild(c); const n = wordsIn(c); c.remove();
    const was = w.dataset.v3;
    w.innerHTML = was ? `Words: ${was} in v3 <span class="${n === +was ? "" : "off"}">→ ${n} in v4</span>` : `Words: <span>${n}</span>`;
  });
});
