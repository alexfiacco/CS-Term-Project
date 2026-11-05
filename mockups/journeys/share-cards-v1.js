// share-cards-v1: posters by name, drawn stars, the word counts, and the inventory every page reads.
const P = {
  anatomy: "1ho0d4LNZw3Y0voeKmSvPSgJOJ2", dune: "1pdfLvkbY9ohJlCjQH2CZjjYVvJ", portrait: "2LquGwEhbg3soxSCs9VNyh5VJd9",
  spirited: "39wmItIWsg5sZMyRUHLkWBcuVCM", godfather: "3bhkrj58Vtu7enYsRolD1fZdja1", nocountry: "6d5XOczc226jECq0LIX0siKtgHR",
  parasite: "7IiTTgloJzvGI1TAYymCfbfl3vT", whiplash: "7fn624j5lj3xTme2SgiLCeuedmO", goodfellas: "9OkCLM73MIU2CrKZbqiT8Ln1wY2",
  heat: "e09dLw1Ljtccd2P4NsuUvVtS5du", her: "eCOtqtfvn7mxGl6nfmq4b1exJRc", budapest: "eWdyYQreja6JGCzqHWXpWHDrrPo",
  aftersun: "evKz85EKouVbIr51zy5fOtpNRPg", br2049: "gajva2L0rPYkEWjzgFlBXCAVBE5", madmax: "hA2ple9q4qnwxp3hKVNhroipsir",
  mood: "iYypPT4bhqXfq1b6EnmxvRt6b2Y", pastlives: "k3waqVXSnvCZWfJYNtdamTgTtTA", sunrise: "kf1Jb1c2JAOqjuzA3H4oDM263uB",
  casablanca: "lGCEKlJo2CnWydQj7aamY7s1S7Q", samurai: "lOMGc8bnSwQhS4XyE1S99uH8NXf", substance: "lqoMzCcZYEFK729d6qzt349fB4o",
  cmbyn: "mZ4gBdfkhP9tvLH1DO4m4HYtiyi", amelie: "nSxDa3M9aMvGVLoItzWTepQ5h5d", oldboy: "pWDtjs568ZfOTMbURQBYuT4Qxka",
  moonlight: "qLnfEmPrDjJfPyyddLJPkXmshkp", eeaao: "u68AjlvlutfEIcpmbYpKcdi09ut", shining: "uAR0AWqhQL1hQa69UDEbb2rE5Wx", lalaland: "uDO8zWDhfWwoFdKS4fzkUJt0Rf0",
};
const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.1l-6.1 3.5 1.5-6.8L2.2 9.2l6.9-.7z"/></svg>';
const url = (k) => `url(../img/tmdb/${P[k]}.jpg)`;

// The inventory (part 1) and the verdicts (parts 2 to 4). Words are counted on the card as drawn,
// initials, numbers and the address included; "proposed" is counted live off the mock.
const CARDS = [
  { id: "mn", proposed: "30", name: "Movie Night result", grade: "A", prio: 15, today: ["mn-story", "mn-post"], words: 29,
    route: "app/t/[id]/result-card · lib/mn-share-card-og.tsx", fmt: "Story 9:16 · Post 4:5", when: "Share the result after a night locks in (web ShareResult, iPhone RoomShareResult)",
    off: "The benchmark. One miss against the system: the initials are circles.", change: "Initials in rounded squares; nothing else." },
  { id: "profile", proposed: "18", name: "Profile / archetype card", grade: "C", prio: 1, today: ["profile-card", "profile-card-forming"], words: 50,
    route: "app/u/[id]/card (in-browser twin: Result.tsx ShareCardGraphic)", fmt: "Post 4:5 (server) · Post and Story (browser capture)", when: "Profile Share card, invite sheets (?mine=1), iPhone ShareCardSheet and InviteSheet sticker",
    off: "50 words: streak, tag, hook, ask and 13 radar labels. Oxblood spine, cream keylines on five posters, footer rule, the handle twice.", change: "Archetype leads, three posters, three strands as words, Maya's square, What's our Blend? and /m pill. 50 to 18 words." },
  { id: "blend", proposed: "18", name: "Blend card", grade: "C", prio: 2, today: ["blend-card"], words: 47,
    route: "app/u/[id]/match/card · lib/match-card.tsx (web CompatShare mirrors it)", fmt: "Post 4:5, also the og:image of /u/&lt;id&gt;/match", when: "Share this Blend, web and iPhone (TasteMatchScreen)",
    off: "47 words: BLEND, faces, lowercase handles, band, films, lanes, a pull quote and a tagline. Oxblood quote bar, keylined posters and lane pills, footer rule.", change: "The % and the two people lead; band, three posters, What's our Blend? and /m pill. 47 to 18 words." },
  { id: "reveal", proposed: "16", name: "Reveal archetype card", grade: "C", prio: 3, today: ["reveal"], words: 24,
    route: "app/api/reveal-card · lib/pick-card.tsx archetypeStoryCardBody", fmt: "Story 9:16", when: "Onboarding reveal, Share my archetype (web, iPhone RevealShare)",
    off: "Bug: names of 13 to 15 letters are set at 172px and run off both edges (Tenderhearted, Hardboiled is fine). Nine caps radar labels.", change: "Name sized to fit, wall kept, Film DNA as its shape alone, strands as words, What's yours? and pill." },
  { id: "invite", proposed: "18", name: "Movie night invite preview", grade: "C", prio: 4, today: ["mn-invite-og"], words: 15,
    route: "app/t/[id]/opengraph-image.tsx", fmt: "OG 1.91:1", when: "The room link unfurling in a group chat (highest-intent preview)",
    off: "28px oxblood rail, an 80px two-line headline, keyline mood chips, a cream Join button drawn into an image, footer rule.", change: "Host in a rounded square, Movie night with Maya, the moods as one line, Tap to join and pill." },
  { id: "year", proposed: "29 · 19 · 13", name: "Year in review (9 cards)", grade: "B", prio: 5, today: ["year-top", "year-blend", "year-share", "year-numbers", "year-take", "year-nights"], words: "24 · 20 · 20",
    route: "app/api/year-review/card · lib/year-card.tsx", fmt: "Story 9:16", when: "Your 2026 in film, Dec 1 to Jan 15, web and iPhone",
    off: "20px oxblood spine and a red offset shadow on the hero poster (CARD_V 16 took both off every other card), footer rule, a circle avatar, star icons, Together you're.", change: "Ships Dec 1: drop spine and red shadow, centre, squares, 4.5★ as text, footer as the benchmark." },
  { id: "pitch", proposed: "32", name: "Pitch card", grade: "C", prio: 6, today: ["pitch"], words: 42,
    route: "app/api/recut/card/[id] · lib/recut-card.tsx (also og:image of /recut/&lt;id&gt;)", fmt: "Story 9:16 (used as the OG too)", when: "Pitch result, Share",
    off: "Bug: the foot runs together (PITCH IT FOR YOUMONTAGEFILM.APP/RECUT/K3X9A2). Pitch over @maya's pitch, oxblood quote bar, empty middle, ↑ not in the card fonts.", change: "The sentence is the title, three posters, Pitch your own and pill. 42 to 32 words; give /recut a 1.91 OG." },
  { id: "ticket", proposed: "17", name: "Pick ticket", grade: "C", prio: 7, today: ["ticket"], words: 18,
    route: "app/pick/[slug]/image · lib/ticket-card.tsx", fmt: "OG 1.91:1, the Instagram tile too", when: "Tonight and movie night picks shared from the film sheet",
    off: "A big oxblood stub with a barcode: red as a block, not an accent. Keyline border, a soft cropped still, ADMIT FOUR.", change: "Keep the ticket shape: poster, title, % for the room; an ink stub with Admit 4 in Bodoni, no barcode." },
  { id: "gtaste", proposed: "27 · OG 16", name: "Group taste card", grade: "C", prio: 8, today: ["group-taste", "group-taste-og"], words: "50 · OG 33",
    route: "app/g/[id]/taste/card · lib/group-taste-card.tsx", fmt: "Post 4:5 · OG 1.91:1 (?size=og)", when: "Group Taste tab, share (image only)",
    off: "50 words. Green, yellow and pink face tiles, oxblood spine and a red mix segment, legend + DNA bars + sync, keylined posters, caps head.", change: "Faces and name, the group's name in Bodoni, tag, three posters, 78% in sync. 50 to 27 words." },
  { id: "grecap", proposed: "35 · OG 21", name: "Group recap card", grade: "C", prio: 9, today: ["group-report", "group-report-og"], words: "39 · OG 39",
    route: "app/g/[id]/report/card · lib/group-report-card.tsx", fmt: "Post 4:5 · OG 1.91:1", when: "Group Report tab, share (image only)",
    off: "Bug: ★ and ½ are typed as text the card fonts lack, so they fall back to another font. A ruled table, caps head, keylined posters.", change: "Three facts as sentences, 1.5★ to 5★ drawn, no rules, faces and pill." },
  { id: "ask", proposed: "8", name: "What's our Blend? card", grade: "B", prio: 10, today: ["blend-ask"], words: 17,
    route: "app/m/[handle]/card · matchAskCardBody", fmt: "OG 1.91:1", when: "What's our Blend? sheet, the /m/&lt;handle&gt; link preview",
    off: "Circle avatar with a keyline, ruled kicker, Maya is a Tenderhearted reads oddly, the wall too dim to read as films.", change: "Square initial, What's our Blend? as the title, Maya · Tenderhearted, /m pill. 17 to 8 words." },
  { id: "pog", proposed: "8", name: "Profile link preview", grade: "B", prio: 11, today: ["profile-og"], words: 15,
    route: "app/u/[id]/opengraph-image.tsx", fmt: "OG 1.91:1", when: "Every /u/&lt;id&gt; link, invite links, Who you watch with",
    off: "28px oxblood rail (red as a frame), posters in a cream keyline strip, caps eyebrow and foot, an arrow.", change: "Same content as the card: name, tag, square, three posters, pill." },
  { id: "film", proposed: "12", name: "Film share card", grade: "B", prio: 12, today: ["film-card"], words: 12,
    route: "app/film/[slug]/card · filmShareCardBody", fmt: "OG 1.91:1, the Instagram tile too", when: "Film share sheet (web ShareFilmSheet, iPhone FilmShareSheet)",
    off: "Close: big poster, big %. No wordmark, a caps CTA with an arrow, the mark floating bottom right, no pill.", change: "Wordmark on top, % with for Alex, What's yours? and pill." },
  { id: "filmog", proposed: "15", name: "Film page link preview", grade: "B", prio: 13, today: ["film-og"], words: 15,
    route: "app/film/[slug]/opengraph-image.tsx · filmPageCardBody", fmt: "OG 1.91:1", when: "Every plain film link (~28k pages)",
    off: "A blue question and a caps CTA say the same thing twice.", change: "One ask in the foot, pill." },
  { id: "read", proposed: "44", name: "Montage's read card", grade: "B", prio: 14, today: ["read"], words: 71,
    route: "app/api/read-card · lib/read-card.tsx", fmt: "Story 9:16", when: "Film page, share Montage's read",
    off: "71 words with a 59-word read. Five star icons, not 4.5★. A rule after the label, caps foot.", change: "Poster centred, 4.5★ from me, the read cut to about 30 words, pill." },
  { id: "canon", proposed: "19", name: "Canon link preview", grade: "B", prio: 16, today: ["canon-og"], words: 22,
    route: "app/u/[id]/canon/opengraph-image.tsx", fmt: "OG 1.91:1", when: "Canon share sheet preview and link",
    off: "Red ★ CANON kicker (★ not in the card fonts), wordmark parked bottom left.", change: "Wordmark on top, blue kicker, pill." },
  { id: "site", proposed: "15 · 11", name: "Site and Browse previews", grade: "B", prio: 17, today: ["site-og", "browse-og"], words: "23 · 14",
    route: "app/opengraph-image.tsx · app/browse/[kind]/[slug]/opengraph-image.tsx", fmt: "OG 1.91:1", when: "Every page without its own card (/mn, /about), the fallback for any failed card, Browse doors",
    off: "Red wash over the top and a pink caps kicker; a sharp, busy wall.", change: "Calmer wall, blue kicker, pill. /mn gets its own preview." },
  { id: "dead", proposed: "0", name: "Old pick card (pickCard)", grade: "–", prio: 18, today: ["pick-old"], words: 0,
    route: "lib/pick-card.tsx pickCard / pickCardBody", fmt: "OG 1.91:1", when: "No caller since the ticket replaced it",
    off: "Still exported, oxblood spine and keyline.", change: "Delete." },
];

function wordsIn(el) {
  const t = el.innerText.replace(/[·•]/g, " ");
  return (t.match(/[A-Za-z0-9%★½@'’.\/&?,:-]+/g) || []).filter((w) => /[A-Za-z0-9%★]/.test(w)).length;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-p]").forEach((e) => { e.style.backgroundImage = url(e.dataset.p); });
  document.querySelectorAll(".wall[data-ps]").forEach((w) => {
    const ks = w.dataset.ps.split(","), n = +(w.dataset.n || 24);
    for (let i = 0; i < n; i++) { const t = document.createElement("i"); t.style.backgroundImage = url(ks[i % ks.length]); w.appendChild(t); }
  });
  // The Film DNA as a shape only (no rings, spokes or labels): nine strands at fixed angles.
  document.querySelectorAll(".dna[data-v]").forEach((e) => {
    const v = e.dataset.v.split(",").map(Number), s = +(e.dataset.s || 320), c = s / 2, R = s / 2 - 6;
    const pts = v.map((x, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / v.length; return `${(c + R * x / 100 * Math.cos(a)).toFixed(1)},${(c + R * x / 100 * Math.sin(a)).toFixed(1)}`; }).join(" ");
    const plate = v.map((x, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / v.length; return `${(c + R * Math.cos(a)).toFixed(1)},${(c + R * Math.sin(a)).toFixed(1)}`; }).join(" ");
    e.innerHTML = `<svg width="${s}" height="${s}"><polygon points="${plate}" fill="rgba(239,232,218,.05)"/><polygon points="${pts}" fill="rgba(91,143,196,.26)" stroke="#8fb3d9" stroke-width="5" stroke-linejoin="round"/></svg>`;
  });
  document.querySelectorAll(".st").forEach((e) => { e.insertAdjacentHTML("beforeend", STAR); });
  document.querySelectorAll(".wc[data-today]").forEach((w) => {
    const k = w.previousElementSibling && w.previousElementSibling.classList.contains("k") ? w.previousElementSibling : w.parentElement.querySelector(".k");
    const n = k ? wordsIn(k) : 0;
    w.innerHTML = `Words: ${w.dataset.today} today <span>→ ${n} proposed</span>`;
  });
});
