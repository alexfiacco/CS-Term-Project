// b66 proposed motion, layered on the real components the harness renders. Nothing here is in the app repo.
// Tone: cinematic and restrained. One curve, ease-out cubic-bezier(.2,.7,.2,1); nothing over ~600ms except the shuffle and the reveal.
(() => {
  const EASE = "cubic-bezier(.2,.7,.2,1)";
  const RM = new URLSearchParams(location.search).get("rm") === "1"; // the reduced-motion variant
  const C = window.CLIP;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const css = (t) => { const s = document.createElement("style"); s.textContent = t; document.head.appendChild(s); };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const anim = (el, kf, o) => el.animate(kf, { easing: EASE, fill: "forwards", ...o }).finished;
  // The finger: a soft ring where the tap lands (recording aid only, not proposed UI).
  css(`.b66-tap{position:fixed;z-index:9999;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(242,234,220,.22);border:1.5px solid rgba(242,234,220,.55);pointer-events:none}
  .coach,.once-tip,.coach-inline{display:none!important}`);
  const tap = async (x, y) => {
    const d = document.createElement("i"); d.className = "b66-tap"; d.style.left = x + "px"; d.style.top = y + "px"; document.body.appendChild(d);
    d.animate([{ transform: "scale(.6)", opacity: 0 }, { transform: "scale(1)", opacity: 1, offset: .35 }, { transform: "scale(1.15)", opacity: 0 }], { duration: 520, easing: "ease-out", fill: "forwards" }).finished.then(() => d.remove());
    await sleep(120);
  };
  const center = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  // ---------------------------------------------------------------- 1. Choose one from these
  if (C === "choose") {
    css(`.b66-deal{position:fixed;inset:0;z-index:5000;pointer-events:none}
    .b66-deal-bg{position:absolute;inset:0;background:var(--bg);opacity:0}
    .b66-card{position:absolute;left:50%;top:44%;width:92px;height:138px;margin:-69px 0 0 -46px;border-radius:var(--radius-poster,4px);overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.55);will-change:transform,opacity}
    .b66-card img{width:100%;height:100%;object-fit:cover;display:block}
    .b66-pick{position:absolute;left:0;right:0;top:calc(44% + 150px);text-align:center;opacity:0}
    .b66-pick-m{font:500 30px/1 var(--serif);color:var(--accent-2);font-variant-numeric:tabular-nums;letter-spacing:-.5px}
    .b66-pick-m small{font-size:15px;margin-left:1px}
    .b66-pick-m span{font:600 11px/1 var(--label,var(--ui));letter-spacing:var(--track-label,.08em);text-transform:uppercase;color:var(--faint);margin-left:8px;vertical-align:4px}
    .b66-pick-t{margin-top:10px;font:600 30px/1.05 var(--serif);color:var(--ink)}
    .b66-pick-s{margin-top:8px;font:400 13px/18px var(--ui);color:var(--muted)}
    .b66-pick-tick{display:block;width:24px;height:2px;margin:14px auto 0;background:var(--red,#c8233a);transform-origin:center}`);
    let layer;
    window.__play = async () => {
      const btn = $$("button").find((b) => /Choose one from these/.test(b.textContent));
      const imgs = $$(".recut-list img").slice(0, 7).map((i) => i.currentSrc || i.src);
      const titles = $$(".recut-list li").slice(0, 7).map((l) => ($(".recut-row-t, h3, b", l) || l).textContent);
      const pct = (($(".recut-list li") || document.body).textContent.match(/(\d+)% match/) || [0, 91])[1];
      await sleep(400);
      await tap(...center(btn));
      layer?.remove();
      layer = document.createElement("div"); layer.className = "b66-deal";
      layer.innerHTML = `<div class="b66-deal-bg"></div>` + imgs.map((s) => `<div class="b66-card"><img src="${s}"></div>`).join("") +
        `<div class="b66-pick"><div class="b66-pick-m">${pct}<small>%</small><span>match</span></div><div class="b66-pick-t">Oldboy</div><div class="b66-pick-s">2003 · 2h · Park Chan-wook</div><i class="b66-pick-tick"></i></div>`;
      document.body.appendChild(layer);
      const bg = $(".b66-deal-bg", layer), cards = $$(".b66-card", layer), pick = $(".b66-pick", layer);
      const fan = (slot) => ({ x: (slot - 3) * 40, y: Math.abs(slot - 3) * 6, r: (slot - 3) * 4.5 });
      const T = (p, extra = "") => `translate(${p.x}px,${p.y}px) rotate(${p.r}deg) ${extra}`;
      const winner = 0;
      if (RM) {
        // Reduced motion: no deal, no shuffle, no lift. The fan fades in, then the choice crossfades in place.
        cards.forEach((c, i) => { c.style.transform = T(fan(i)); c.style.opacity = 0; c.style.zIndex = i === winner ? 20 : 10 - Math.abs(i - 3); });
        anim(bg, [{ opacity: 0 }, { opacity: .9 }], { duration: 200, easing: "linear" });
        await Promise.all(cards.map((c) => anim(c, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "linear" })));
        await sleep(450);
        const big = cards[winner].cloneNode(true); big.style.transform = "translate(0,-40px) scale(1.7)"; big.style.opacity = 0; big.style.zIndex = 30; layer.appendChild(big);
        cards.forEach((c) => anim(c, [{ opacity: 1 }, { opacity: .12 }], { duration: 250, easing: "linear" }));
        anim(big, [{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: "linear" });
        pick.style.top = "calc(44% + 150px)";
        await anim(pick, [{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: "linear" });
        await sleep(1500);
        await anim(layer, [{ opacity: 1 }, { opacity: 0 }], { duration: 250, easing: "linear" });
        layer.remove(); layer = null; return;
      }
      // Deal: from below the screen into a fan, 50ms apart, 360ms each.
      anim(bg, [{ opacity: 0 }, { opacity: .9 }], { duration: 260 });
      cards.forEach((c, i) => { c.style.zIndex = 10 - Math.abs(i - 3); });
      await Promise.all(cards.map((c, i) => anim(c, [{ transform: `translate(0,520px) rotate(${(i - 3) * 12}deg)`, opacity: 0 }, { opacity: 1, offset: .3 }, { transform: T(fan(i)), opacity: 1 }], { duration: 360, delay: i * 50 })));
      // Shuffle: gather to one stack and fan out again in a new order (one riffle).
      const order = [4, 6, 1, 5, 0, 2, 3]; // card i goes to slot order[i]
      await Promise.all(cards.map((c, i) => anim(c, [{ transform: T(fan(i)) }, { transform: `translate(0,0) rotate(${(i - 3) * 1.5}deg)` }], { duration: 200, easing: "cubic-bezier(.4,0,.2,1)" })));
      cards.forEach((c, i) => { c.style.zIndex = 10 - Math.abs(order[i] - 3); });
      await Promise.all(cards.map((c, i) => anim(c, [{ transform: `translate(0,0) rotate(${(i - 3) * 1.5}deg)` }, { transform: T(fan(order[i])) }], { duration: 260 })));
      // Slow down: the light passes over the fan, each step longer, and stops on the winner (slot 4 now).
      const bySlot = []; cards.forEach((c, i) => { bySlot[order[i]] = c; });
      const steps = [0, 1, 2, 3, 4, 5, 6, 5, 4]; const gaps = [55, 60, 65, 75, 90, 110, 140, 180, 230];
      let lit = null;
      const light = (c) => {
        if (lit && lit !== c) { const s = order[cards.indexOf(lit)]; lit.animate([{ transform: T(fan(s), "translateY(-14px)"), filter: "brightness(1)" }, { transform: T(fan(s)), filter: "brightness(.55)" }], { duration: 160, easing: EASE, fill: "forwards" }); }
        const s = order[cards.indexOf(c)]; c.animate([{ transform: T(fan(s)), filter: "brightness(.55)" }, { transform: T(fan(s), "translateY(-14px)"), filter: "brightness(1)" }], { duration: 140, easing: EASE, fill: "forwards" }); lit = c;
      };
      cards.forEach((c, i) => c.animate([{ filter: "brightness(1)" }, { filter: "brightness(.55)" }], { duration: 120, fill: "forwards" }));
      for (let k = 0; k < steps.length; k++) { light(bySlot[steps[k]]); await sleep(gaps[k]); }
      // Land: the winner (Oldboy, 91%) lifts forward; the rest sink back.
      const win = bySlot[4]; win.style.zIndex = 40; const ws = 4;
      cards.forEach((c) => { if (c !== win) { const s = order[cards.indexOf(c)]; anim(c, [{ transform: T(fan(s)), opacity: 1 }, { transform: T(fan(s), "translateY(26px) scale(.94)"), opacity: .14 }], { duration: 480 }); } });
      await anim(win, [{ transform: T(fan(ws), "translateY(-14px)"), filter: "brightness(1)" }, { transform: "translate(0,-40px) rotate(0deg) scale(1.7)", filter: "brightness(1)" }], { duration: 520 });
      await anim(pick, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 380, delay: 0 });
      await sleep(1500);
      await anim(layer, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 });
      layer.remove(); layer = null;
    };
    window.__ready = () => $$(".recut-list img").length >= 7 && $$(".recut-list img").every((i) => i.complete);
  }

  // ---------------------------------------------------------------- 2. Rating a film
  if (C === "rate") {
    css(`.dstar{transition:color .14s ease-out,transform .14s ease-out}
    .dstar.on,.dstar.half{animation:b66pop .26s cubic-bezier(.2,.7,.2,1) both}
    .dstar-wrap:nth-child(1) .dstar{transition-delay:0ms;animation-delay:0ms}.dstar-wrap:nth-child(2) .dstar{transition-delay:55ms;animation-delay:55ms}
    .dstar-wrap:nth-child(3) .dstar{transition-delay:110ms;animation-delay:110ms}.dstar-wrap:nth-child(4) .dstar{transition-delay:165ms;animation-delay:165ms}
    .dstar-wrap:nth-child(5) .dstar{transition-delay:220ms;animation-delay:220ms}
    @keyframes b66pop{0%{transform:scale(.86)}60%{transform:scale(1.06)}100%{transform:scale(1)}}
    .b66-glint .dstar.on{background:linear-gradient(100deg,transparent calc(var(--gx,-200px) - 22px),rgba(255,244,228,.95) var(--gx,-200px),transparent calc(var(--gx,-200px) + 22px)),linear-gradient(var(--accent),var(--accent));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
    .b66-glint .dstar.half{background:linear-gradient(100deg,transparent calc(var(--gx,-200px) - 22px),rgba(255,244,228,.95) var(--gx,-200px),transparent calc(var(--gx,-200px) + 22px)),linear-gradient(90deg,var(--accent) 50%,var(--line-2) 50%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
    .guess-line{opacity:0}
    .guess-line.b66-in{animation:b66up .42s cubic-bezier(.2,.7,.2,1) both}
    @keyframes b66up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`);
    window.__play = async () => {
      await sleep(400);
      const half = $$(".dstar-half-l")[4];
      await tap(...center(half));
      half.click();
      await sleep(420); // the fill reaches the fifth star
      // One quiet glint across the filled stars (4.5 and up only).
      const row = $(".dstars-row"); row.classList.add("b66-glint");
      const stars = $$(".dstar"); const r0 = row.getBoundingClientRect().left;
      const offs = stars.map((s) => s.getBoundingClientRect().left - r0);
      const W = row.getBoundingClientRect().width; const t0 = performance.now(); const D = 600;
      await new Promise((res) => { const f = (now) => { const t = Math.min(1, (now - t0) / D); const e = 1 - Math.pow(1 - t, 3); const gx = -40 + e * (W + 80);
        stars.forEach((s, i) => s.style.setProperty("--gx", (gx - offs[i]) + "px")); if (t < 1) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
      row.classList.remove("b66-glint");
      // The guess check slides up under the stars once the rating is saved.
      let g; for (let i = 0; i < 40 && !(g = $(".guess-line")); i++) await sleep(25);
      if (g) { g.innerHTML = `<span class="guess-g">We said 88%. </span><span class="guess-ok">Called it.</span>`; g.classList.add("b66-in"); }
      await sleep(1800);
    };
    window.__ready = () => !!$(".dstar-half-l") && !!$(".seen-sheet-poster")?.complete;
  }

  // ---------------------------------------------------------------- 3. The reveal
  if (C === "reveal") {
    css(`.wrap,.stage{padding:0!important;margin:0!important;max-width:none!important}
    .b66-reveal{min-height:100vh!important;border-radius:0!important;height:100vh}
    .b66-reveal-fg{position:absolute!important;inset:0;display:flex;align-items:center;justify-content:center;padding:0!important}
    .rvb{min-height:0!important;width:100%}
    .rvb-b1{display:none!important}
    .rvb-ring{display:none!important}
    .rvb-b2 .rvb-name{animation:none!important;letter-spacing:0}
    .rvb-b2 .rvb-you,.rvb-b2 .rvb-tick,.rvb-b2 .rvb-streak{animation:none!important;opacity:0}
    .b66-l{display:inline-block;opacity:0;will-change:opacity,transform,filter}
    .onboard-tilt-plane{transform-origin:50% 45%}
    ${RM ? ".onboard-tilt-col{animation-play-state:paused!important}" : ""}`);
    window.__play = async () => {
      // Wait for the real component's name beat.
      let h; for (let i = 0; i < 200 && !(h = $(".rvb-b2 .rvb-name")); i++) await sleep(20);
      const you = $(".rvb-b2 .rvb-you"), tick = $(".rvb-b2 .rvb-tick"), streak = $(".rvb-b2 .rvb-streak");
      const plane = $(".onboard-tilt-plane");
      window.__t = Date.now();
      if (RM) {
        // Reduced motion: the wall holds still, the name fades in whole, then its line.
        h.style.opacity = 0;
        await sleep(300);
        anim(you, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "linear" });
        await anim(h, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: "linear" });
        tick.style.opacity = 1;
        await anim(streak, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "linear" });
        await sleep(1700);
        return;
      }
      // Slow push-in on the wall, the length of the whole reveal.
      plane.animate([{ scale: "1" }, { scale: "1.075" }], { duration: 3600, easing: "cubic-bezier(.25,.1,.25,1)", fill: "forwards" });
      const text = h.textContent; h.innerHTML = [...text].map((ch) => `<span class="b66-l">${ch}</span>`).join("");
      await sleep(250);
      anim(you, [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 420 });
      await sleep(260);
      // Title-card type: each letter develops in, 85ms apart (about 1.2s for "Hardboiled").
      $$(".b66-l", h).forEach((l, i) => l.animate([{ opacity: 0, transform: "translateY(8px)", filter: "blur(8px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }],
        { duration: 460, delay: i * 85, easing: EASE, fill: "forwards" }));
      await sleep(85 * text.length + 260);
      anim(tick, [{ opacity: 1, scale: "0 1" }, { opacity: 1, scale: "1 1" }], { duration: 380 });
      await sleep(180);
      await anim(streak, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 480 });
      await sleep(1100);
    };
    window.__ready = () => $$(".onboard-tilt-col i").filter((i) => i.style.backgroundImage.includes("url")).length > 30;
  }

  // ---------------------------------------------------------------- 4. Match % counting up
  if (C === "match") {
    css(`.b66-cover{position:fixed;inset:0;z-index:900;background:var(--bg);pointer-events:none}`);
    window.__play = async () => {
      const n = $(".fd-pc-pct"); const node = n.firstChild; const final = parseInt(node.textContent, 10);
      const cover = document.createElement("div"); cover.className = "b66-cover"; document.body.appendChild(cover);
      node.textContent = "0";
      window.scrollTo(0, 0);
      await sleep(300);
      // The page arrives (a plain 240ms fade, standing in for the route change), then the number counts.
      await anim(cover, [{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: "linear" });
      cover.remove();
      await sleep(120);
      const t0 = performance.now(); const D = 400;
      await new Promise((res) => { const f = (now) => { const t = Math.min(1, (now - t0) / D); node.textContent = String(Math.round(final * (1 - Math.pow(1 - t, 3)))); if (t < 1) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
      await sleep(2000);
      const c2 = document.createElement("div"); c2.className = "b66-cover"; document.body.appendChild(c2);
      await anim(c2, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "linear" });
      node.textContent = String(final); window.__cover = c2;
    };
    window.__ready = () => !!$(".fd-pc-pct") && !!$("img")?.complete;
  }

  // ---------------------------------------------------------------- 5. Picks: mark a film Seen
  if (C === "picks") {
    window.__play = async () => {
      const track = $(".pk-track"); const slides = $$(".pk-slide", track);
      const s0 = slides[0], s1 = slides[1];
      const seenBtn = $(".pk-stub button", s0);
      await sleep(500);
      await tap(...center(seenBtn));
      seenBtn.classList.add("on");
      const lbl = [...seenBtn.childNodes].find((x) => x.nodeType === 3); if (lbl) lbl.textContent = "Seen";
      const svg = $("svg", seenBtn); svg.setAttribute("fill", "currentColor");
      await sleep(380); // the answer reads, a beat
      // The card leaves to the left; the next one rises into its place (one continuous move, no jump).
      const h = s0.offsetHeight;
      track.style.scrollSnapType = "none"; track.scrollTop = h;
      s0.style.position = "relative"; s0.style.zIndex = 3;
      s0.style.transform = `translateY(${h}px)`; s1.style.transform = `translateY(${h}px)`;
      const a = anim(s0, [{ transform: `translate(0,${h}px)`, opacity: 1 }, { transform: `translate(-105%,${h}px) rotate(-1.5deg)`, opacity: .4 }], { duration: 320 });
      const b = anim(s1, [{ transform: `translateY(${h}px)`, opacity: .7 }, { transform: "translateY(0)", opacity: 1 }], { duration: 350, delay: 50 });
      await Promise.all([a, b]);
      await sleep(1500);
    };
    window.__ready = () => $$(".pk-slide").length >= 2 && $$(".pk-slide img").slice(0, 3).every((i) => i.complete);
  }

  // ---------------------------------------------------------------- 6. Blend
  if (C === "blend") {
    css(`.b66-blend .mx-av-b{margin-left:-14px}
    .b66-blend .mx-hero:not(.b66-go) .mx-av,.b66-blend .mx-hero:not(.b66-go) .mx-score,.b66-blend .mx-hero:not(.b66-go) .mx-band{opacity:0}`);
    window.__play = async () => {
      const hero = $(".mx-hero");
      $$(".mx-av,.mx-score,.mx-band", hero).forEach((e) => { e.style.opacity = 0; });
      hero.classList.add("b66-go");
      await sleep(350);
      const a = $(".mx-av-a"), b = $(".mx-av-b");
      const pa = anim(a, [{ transform: "translateX(-150px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 560 });
      const pb = anim(b, [{ transform: "translateX(150px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 560 });
      await Promise.all([pa, pb]);
      // The real CountUp, remounted so it counts 0 to 83 in 700ms (ease-out cubic).
      window.__replayBlend(); await sleep(16);
      $(".mx-hero").classList.add("b66-go");
      $(".mx-av-a").style.opacity = 1; $(".mx-av-b").style.opacity = 1; $(".mx-band").style.opacity = 0;
      await sleep(640);
      await anim($(".mx-band"), [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 420 });
      await sleep(1600);
      await anim($(".mx-hero"), [{ opacity: 1 }, { opacity: 0 }], { duration: 250 });
    };
    window.__ready = () => !!$(".mx-av-b");
  }

  // ---------------------------------------------------------------- 7. Saving to your watchlist
  if (C === "save") {
    css(`.b66-fly{position:fixed;z-index:999;left:0;top:0;pointer-events:none;will-change:transform}
    .b66-fly i{display:block;will-change:transform}
    .b66-fly img{display:block;width:100%;height:100%;object-fit:cover;border-radius:3px;box-shadow:0 8px 24px rgba(0,0,0,.5)}`);
    window.__play = async () => {
      const s0 = $(".pk-slide"); const btn = $$(".pk-stub button", s0)[1];
      const po = $$("img", s0).find((i) => { const r = i.getBoundingClientRect(); return r.width > 60 && r.width < 200; });
      const tab = $$(".tabbar button, .tabbar a").find((t) => /Profile/.test(t.textContent));
      await sleep(500);
      await tap(...center(btn));
      btn.click();
      const r = po.getBoundingClientRect(); const ti = $("svg", tab) || tab; const tr = ti.getBoundingClientRect();
      const fly = document.createElement("div"); fly.className = "b66-fly";
      fly.innerHTML = `<i><img src="${po.currentSrc || po.src}"></i>`; document.body.appendChild(fly);
      const inner = fly.firstElementChild;
      fly.style.width = r.width + "px"; fly.style.height = r.height + "px";
      const dx = tr.left + tr.width / 2 - (r.left + r.width / 2), dy = tr.top + tr.height / 2 - (r.top + r.height / 2);
      // An arc: x eases out, y eases in, so the thumbnail rises a little then drops into the tab. 450ms.
      const D = 450;
      fly.animate([{ transform: `translate(${r.left}px,${r.top}px)` }, { transform: `translate(${r.left + dx}px,${r.top}px)` }], { duration: D, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" });
      inner.animate([{ transform: "translateY(0) scale(1)", opacity: 1 }, { transform: `translateY(${dy * .1 - 40}px) scale(.6)`, opacity: 1, offset: .35 }, { transform: `translateY(${dy}px) scale(.16)`, opacity: .2 }],
        { duration: D, easing: "cubic-bezier(.5,0,.75,.5)", fill: "forwards" });
      await sleep(D);
      fly.remove();
      ti.animate([{ transform: "scale(1)" }, { transform: "scale(1.16)", offset: .4 }, { transform: "scale(1)" }], { duration: 300, easing: EASE });
      await sleep(1900);
    };
    window.__ready = () => $$(".pk-slide img").slice(0, 2).every((i) => i.complete) && !!$(".tabbar");
  }

  // ---------------------------------------------------------------- 9. Opening a film
  if (C && C.startsWith("open")) {
    const HEAT = "e09dLw1Ljtccd2P4NsuUvVtS5du";
    css(`.b66-film{position:fixed;inset:0;z-index:6000;overflow:hidden;visibility:hidden}
    .b66-under{position:fixed;inset:0;z-index:5999;background:var(--bg);opacity:0;pointer-events:none}
    .b66-flyp{position:fixed;left:0;top:0;z-index:7000;object-fit:cover;pointer-events:none;will-change:transform,width,height;transform-origin:0 0}`);
    const srcPoster = () => $$("img").find((i) => !i.closest(".b66-film") && (i.currentSrc || i.src).includes(HEAT) && i.getBoundingClientRect().width > 40);
    window.__ready = () => { const l = $(".b66-film"); const d = l && $$("img", l).find((i) => i.classList.contains("fd-hero-poster")); const s = srcPoster(); return !!(d && d.complete && s && s.complete && $(".fd-hero-img", l)?.complete); };
    window.__play = async () => {
      const layer = $(".b66-film"), root = layer.firstElementChild;
      const dst = $(".fd-hero-poster", layer), bd = $(".fd-hero-img", layer), src = srcPoster();
      let under = $(".b66-under"); if (!under) { under = document.createElement("div"); under.className = "b66-under"; document.body.appendChild(under); }
      const back = $$("button,a", layer).find((b) => /back/i.test((b.getAttribute("aria-label") || "") + b.className)) || null;
      await sleep(450);
      await tap(...center(src));
      const s = src.getBoundingClientRect();
      layer.style.visibility = "visible";
      const d = dst.getBoundingClientRect();
      const rs = getComputedStyle(src).borderRadius, rd = getComputedStyle(dst).borderRadius;
      if (RM) {
        // Reduced motion: a plain crossfade, no flight and no rise.
        under.style.opacity = 1;
        await Promise.all([anim(layer, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "linear" }), anim(under, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "linear" })]);
        await sleep(1300);
        if (back) await tap(...center(back)); else await tap(40, 36);
        await Promise.all([anim(layer, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "linear" }), anim(under, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "linear" })]);
        layer.style.visibility = "hidden"; layer.getAnimations().forEach((a) => a.cancel()); under.getAnimations().forEach((a) => a.cancel()); under.style.opacity = 0;
        await sleep(500); return;
      }
      // The flying poster: the source image, from its spot to the header poster's, 450ms.
      const fly = document.createElement("img"); fly.className = "b66-flyp"; fly.src = dst.currentSrc || dst.src; document.body.appendChild(fly);
      const box = (r, rad) => ({ transform: `translate(${r.left}px,${r.top}px)`, width: r.width + "px", height: r.height + "px", borderRadius: rad });
      src.style.visibility = "hidden"; dst.style.visibility = "hidden";
      const D = 450;
      const pf = anim(fly, [box(s, rs), box(d, rd)], { duration: D });
      anim(under, [{ opacity: 0 }, { opacity: 1 }], { duration: 220 });
      // The backdrop fades in behind it; the page rises in under it.
      anim(bd, [{ opacity: 0 }, { opacity: 1 }], { duration: D });
      const rest = [...root.querySelectorAll(".fd-hero-text, .fd-hero-float, .fp-page > *:not(:first-child), .tabbar")];
      anim(root, [{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: "linear" });
      rest.forEach((e) => anim(e, [{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }], { duration: 380, delay: 70 }));
      await pf;
      dst.style.visibility = ""; fly.remove();
      await sleep(1300);
      // Closing reverses it: the page sinks and fades, the backdrop goes, the poster flies home.
      if (back) await tap(...center(back)); else await tap(40, 36);
      const d2 = dst.getBoundingClientRect();
      const fly2 = document.createElement("img"); fly2.className = "b66-flyp"; fly2.src = fly.src; document.body.appendChild(fly2);
      dst.style.visibility = "hidden";
      const pb = anim(fly2, [box(d2, rd), box(s, rs)], { duration: D });
      rest.forEach((e) => anim(e, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(16px)" }], { duration: 260 }));
      anim(bd, [{ opacity: 1 }, { opacity: 0 }], { duration: 320 });
      anim(root, [{ opacity: 1 }, { opacity: 0 }], { duration: 180, delay: 60, easing: "linear" });
      anim(under, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: 60 });
      await pb;
      src.style.visibility = ""; fly2.remove();
      layer.style.visibility = "hidden"; dst.style.visibility = "";
      [root, bd, under, ...rest].forEach((e) => e.getAnimations().forEach((a) => a.cancel())); under.style.opacity = 0;
      await sleep(600);
    };
  }

  // ---------------------------------------------------------------- 8. Pull to refresh
  if (C === "ptr") {
    // The real PullToRefresh's indicator, with a small sprocket reel in place of the strip.
    css(`.ptr-strip>*{display:none!important}
    .ptr-strip{height:30px}
    .b66-reel{width:28px;height:28px;color:var(--ink);display:block!important}`);
    const REEL = `<svg class="b66-reel" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="16" cy="16" r="13.5"/><circle cx="16" cy="16" r="2.2" fill="currentColor" stroke="none"/>` +
      [0, 1, 2, 3, 4].map((k) => { const a = (k * 72 - 90) * Math.PI / 180; return `<circle cx="${(16 + 7.6 * Math.cos(a)).toFixed(2)}" cy="${(16 + 7.6 * Math.sin(a)).toFixed(2)}" r="3.1"/>`; }).join("") + `</svg>`;
    let spin = 0, last = performance.now();
    const tick = (now) => {
      const p = $(".ptr");
      if (p) {
        const strip = $(".ptr-strip", p);
        let reel = $(".b66-reel", strip);
        if (!reel) { strip.insertAdjacentHTML("beforeend", REEL); reel = $(".b66-reel", strip); }
        const busy = /Refreshing/.test($(".ptr-label", p).textContent);
        const h = p.offsetHeight;
        if (busy) spin += (now - last) * (RM ? 0 : 0.36); else spin = h * 2.4; // follows the finger, then turns at ~1 rev/s
        reel.style.transform = `rotate(${spin}deg)`;
      }
      last = now; requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    window.__ready = () => !!$(".tabbar") && document.fonts.status === "loaded";
  }
})();
