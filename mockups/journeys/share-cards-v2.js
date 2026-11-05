// share-cards-v2: the character kit's moving parts. Loads after share-cards-v1.js (posters P, url, STAR).
//   .gh[data-g]   ghosted archetype names: "The Old Soul@top,left,size,opacity,rotate;..." in card px
//   .pw[data-ps]  a dimmed wall of upright posters: data-c columns, data-w tile width, data-n tiles, data-gap
//   .reel[data-ps] films on a celluloid band: data-w frame width, data-rank to number the frames
//   .dna2[data-v] the Film DNA silhouette, with the oxblood offset when data-ox is set
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
  document.querySelectorAll(".reel[data-ps]").forEach((r) => {
    const ks = r.dataset.ps.split(","), w = +(r.dataset.w || 200), h = Math.round(w * 1.5), rank = r.dataset.rank;
    const fr = ks.map((k, i) => `<i style="width:${w}px;height:${h}px;background-image:${url(k)}">${rank ? `<b>${i + 1}</b>` : ""}</i>`).join("");
    r.innerHTML = `<div class="perf"></div><div class="frames">${fr}</div><div class="perf"></div>`;
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
  document.querySelectorAll(".wc2[data-v1]").forEach((w) => {
    const k = w.previousElementSibling;
    w.innerHTML = `Words: ${w.dataset.v1} in v1 <span>→ ${count(k)} in v2</span>`;
  });
});
