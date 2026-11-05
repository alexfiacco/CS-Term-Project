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
