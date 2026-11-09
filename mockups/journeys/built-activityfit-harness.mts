// Activity row fit harness: every Notifications row kind with long names, in the real globals.css, at 390 and 320.
import fs from "node:fs";
import path from "node:path";
const WT = process.argv[2];
const OUT = process.argv[3];
(globalThis as any).React = (await import(path.join(WT, "node_modules/react/index.js"))).default;
const { rowLines } = await import(path.join(WT, "app/_components/Activity.tsx"));
const { circleWatchRowCopy } = await import(path.join(WT, "lib/circle-watch-copy.ts"));
const { releaseRowCopy } = await import(path.join(WT, "lib/release-reminder-copy.ts"));
const { groupedVerb, groupedWho } = await import(path.join(WT, "lib/grouped-activity-shared.ts"));
const { passedVerb, passedWho } = await import(path.join(WT, "lib/blend-copy.ts"));
const ww = await import(path.join(WT, "lib/watched-with-shared.ts"));
const { nudgeLine } = await import(path.join(WT, "lib/sharpen.ts"));

const U = "emma_watches_all"; // 16
const U2 = "sam_the_cinephil"; // 16
const T = "Billy Lynn's Long Halftime Walk: Reprise"; // 40
const T2 = "Godzilla Minus One and the Long Night Out"; // 41 -> trimmed below
const ROOM = "Friday Night Horror Marathon"; // 28
const F40 = T2.slice(0, 40);
if (U.length !== 16 || U2.length !== 16 || T.length !== 40 || F40.length !== 40 || ROOM.length !== 28) throw new Error(`lengths ${U.length} ${U2.length} ${T.length} ${F40.length} ${ROOM.length}`);
const POSTER = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="27" height="40"><rect width="27" height="40" fill="#3a4a5c"/></svg>');
const now = Date.now(), H = 3600e3;

type S = Record<string, any>;
const base = { avatarUrl: null, glyph: null, sub: null, film: false, match: null, actionRef: "x" };
const cw = circleWatchRowCopy({ name: "Emma", title: T, match: 78, rating: 4, showMatch: true });
const cwLong = circleWatchRowCopy({ name: U, title: T, match: 78, rating: 4.5, showMatch: true });
const relT = releaseRowCopy({ moment: "theaters", service: null, title: F40 });
const relS = releaseRowCopy({ moment: "streaming", service: "Paramount Plus with Showtime", title: T });
const rows: S[] = [
  { ...base, k: "followed you", ts: now - 60e3, who: `@${U}`, verb: "followed you", match: 86, action: "followback" },
  { ...base, k: "followed back", ts: now - 2 * H, who: `@${U2}`, verb: "followed you back", match: 91, action: "match" },
  { ...base, k: "following", ts: now - 3 * H, who: `@${U}`, verb: "followed you", match: null, action: "following" },
  { ...base, k: "movie night invite (untouched)", ts: now - 30e3, glyph: 1, who: `@${U}`, verb: "invited you to a movie night", sub: ROOM, action: "join" },
  { ...base, k: "movie night invite joined", ts: now - 40e3, glyph: 1, who: `@${U}`, verb: "invited you to 3 movie nights", sub: ROOM, action: "joined" },
  { ...base, k: "joined your night", ts: now - 50 * 60e3, glyph: 1, who: `@${U}, @${U2} and 2 others`, verb: "joined your movie night", sub: ROOM, action: "open" },
  { ...base, k: "group thread", ts: now - H, glyph: 1, who: ROOM, verb: "· 12 new messages", sub: `@${U} shared ${T}`, action: "view" },
  { ...base, k: "friend's watch", ts: now - 7 * 24 * H, poster: POSTER, verb: cw.title, sub: cw.line, blue: cw.pct, leadName: "Emma", cut: T, action: "watch-open" },
  { ...base, k: "friend's watch long name", ts: now - 7 * 24 * H, poster: POSTER, verb: cwLong.title, sub: cwLong.line, blue: cwLong.pct, leadName: U, cut: T, action: "watch-open" },
  { ...base, k: "release theaters", ts: now - 2 * 24 * H, poster: POSTER, verb: relT.verb, sub: relT.sub, cut: F40, filmTitle: F40, action: "film", actionLabel: relT.action, actionUrl: "#" },
  { ...base, k: "release streaming", ts: now - 2 * 24 * H, poster: POSTER, verb: relS.verb, sub: relS.sub, cut: T, filmTitle: T, action: "film", actionLabel: relS.action },
  { ...base, k: "movie night decided", ts: now - 24 * H, poster: POSTER, verb: `Movie Night: ${T}`, cut: T, sub: `89% for the room · with @${U}, @${U2} and 3 others`, action: "row" },
  { ...base, k: "how was it", ts: now - 5 * H, poster: POSTER, verb: `How was ${T}?`, cut: T, sub: `@${U} and @${U2} have rated`, action: "open", actionLabel: "Rate it" },
  { ...base, k: "rate (followup)", ts: now - 6 * H, poster: POSTER, verb: `Rate ${T}`, cut: T, sub: "Your movie night picked it. How was it?", action: "film", actionLabel: "Rate it" },
  { ...base, k: "take reply", ts: now - 8 * H, poster: POSTER, who: `@${U}`, verb: "replied to your take", sub: T, action: "discussion" },
  { ...base, k: "friend take", ts: now - 9 * H, poster: POSTER, who: `@${U2}`, verb: "posted a take on a film you've seen", sub: T, action: "discussion" },
  { ...base, k: "post comment", ts: now - 10 * H, poster: POSTER, who: `@${U}`, verb: `commented on your ${T}`, cut: T, action: "comments" },
  { ...base, k: "mention", ts: now - 11 * H, poster: POSTER, who: `@${U2}`, verb: `mentioned you in ${ROOM}`, cut: ROOM, action: "view" },
  { ...base, k: "match nudge", ts: now - 12 * H, glyph: 1, who: `@${U}`, verb: "wants to see your Blend.", sub: nudgeLine(4), action: "profile" },
  { ...base, k: "blend invite", ts: now - 13 * H, glyph: 1, who: `@${U}`, verb: "invited you to a Blend", sub: "86% alike · films you'd both love, always fresh", action: "blend", href: "#" },
  { ...base, k: "blend joined", ts: now - 14 * H, glyph: 1, who: `@${U2}`, verb: "joined your Blend", action: "profile" },
  { ...base, k: "blend passed", ts: now - 15 * H, glyph: 1, who: passedWho([`@${U}`, `@${U2}`]), verb: passedVerb(ROOM), action: "profile" },
  { ...base, k: "watched with", ts: now - 16 * H, poster: POSTER, who: `@${U}`, verb: ww.taggedVerb(T, [U2]), cut: T, sub: "Sat, Nov 7 · they gave it 4.5★", action: "tagged" },
  { ...base, k: "watched with joined", ts: now - 17 * H, poster: POSTER, who: `@${U2}`, verb: ww.addedVerb(T), cut: T, sub: "They gave it 4★", action: "film" },
  { ...base, k: "invite joined", ts: now - 18 * H, glyph: 1, who: `@${U}`, verb: "joined Montage from your invite", action: "profile" },
  { ...base, k: "pick reaction", ts: now - 19 * H, glyph: 1, who: `@${U2}`, verb: "reacted 🔥 to your watch", sub: T, action: "view" },
  { ...base, k: "group invite", ts: now - 20 * H, glyph: 1, who: `@${U}`, verb: "invited you to join", sub: ROOM, action: "view" },
  { ...base, k: "group watchlist add", ts: now - 21 * H, glyph: 1, who: `@${U}`, verb: `added ${T} to ${ROOM}'s watchlist`, action: "view" },
  { ...base, k: "group join", ts: now - 22 * H, glyph: 1, who: `@${U}, @${U2} and 3 others`, verb: `joined ${ROOM}`, action: "view" },
  { ...base, k: "grouped likes", ts: now - 23 * H, poster: POSTER, faces: [{ id: "a", name: U }, { id: "b", name: U2 }], who: groupedWho([U, U2], 5), verb: groupedVerb("take_like", { n: 5, e: null, t: T }), cut: T, action: "discussion" },
  { ...base, k: "grouped replies", ts: now - 30 * H, poster: POSTER, faces: [{ id: "a", name: U }, { id: "b", name: U2 }], who: groupedWho([U, U2], 2), verb: groupedVerb("take_replies", { n: 2, e: null, t: T }), cut: T, quote: "This is the long reply that goes on and on about the halftime show", action: "discussion" },
  { ...base, k: "ended night", ts: now - 40 * H, glyph: 1, who: `@${U}`, verb: "invited you to a movie night", sub: ROOM, action: "none" },
];
const esc = (x: string) => String(x ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
function ago(ts: number) { const s = (now - ts) / 1000; if (s < 60) return "now"; const m = s / 60; if (m < 60) return `${Math.floor(m)}m`; const h = m / 60; if (h < 24) return `${Math.floor(h)}h`; const d = h / 24; if (d < 7) return `${Math.floor(d)}d`; return `${Math.floor(d / 7)}w`; }
function pillOf(s: S) {
  if (s.faces) return `<span class="act-col act-col-thumb"><img class="act-thumb" src="${POSTER}" alt=""></span>`;
  const p = (t: string, c = "") => `<button type="button" class="act-pa${c}">${t}</button>`;
  switch (s.action) {
    case "followback": return p("Follow back", " prim");
    case "following": return `<span class="act-pa act-following">✓Following</span>`;
    case "match": return p("See Blend");
    case "join": return p("Join");
    case "joined": return `<a class="act-pa act-following">✓You're in</a>`;
    case "blend": return p("See it");
    case "tagged": return p("Add it");
    case "comments": case "view": case "profile": return p("View");
    case "film": return p(s.actionLabel ?? "View");
    case "watch-open": return p("Watchlist");
    case "open": return s.actionLabel ? p(s.actionLabel) : "";
    case "none": return `<span class="act-pa-ended">Ended</span>`;
  }
  return "";
}
function row(s: S, unread: boolean) {
  const l = rowLines(s as any);
  const dismiss = s.action === "join" ? `<button type="button" class="act-not">Not tonight</button>` : "";
  const second = s.action === "blend" ? `<button type="button" class="act-not">Not now</button>` : s.action === "tagged" ? `<button type="button" class="act-not">Not me</button>` : "";
  const lead = s.faces ? `<span class="act-faces two"><span class="act-face"><span class="act-av friend-av">S</span></span><span class="act-face top"><span class="act-av friend-av">E</span></span></span>`
    : s.poster ? `<img class="act-av act-av-img act-poster" src="${POSTER}" alt="">`
    : s.glyph ? `<span class="act-av act-glyph act-glyph-night">◆</span>`
    : `<span class="act-av friend-av">${esc((s.who ?? "?").replace("@", "")[0].toUpperCase())}</span>`;
  const body = `<span class="act-c-lead">${lead}</span><div class="act-body"><div class="act-l1">${l.name ? `<b>${esc(l.name)}</b>` : ""}${l.pre ? `<span class="act-sp">${esc(l.pre)}</span>` : ""}<span class="act-tr${l.bold ? " b" : ""}">${esc(l.cut)}</span>${l.post ? `<span class="act-sp">${esc(l.post)}</span>` : ""}</div>`
    + `<div class="act-l2"><span class="act-tx${l.quote ? " q" : ""}">${l.blue ? `<span class="act-bl">${esc(l.blue)}</span>` : ""}${l.blue && l.meta ? esc(l.sep) : ""}${esc(l.meta)}</span><span class="act-tm">${l.meta || l.blue ? "\u00a0· " : ""}${ago(s.ts)}</span>${dismiss}</div></div>`;
  const pill = pillOf(s);
  const col = second ? `<span class="act-col act-col-two">${pill}${second}</span>` : pill;
  return `<div class="act-row${unread ? " unread" : ""}" data-kind="${esc(s.k)}"><div class="act-lead">${body}</div>${col}${unread ? '<span class="act-dot"></span>' : ""}</div>`;
}
const css = fs.readFileSync(path.join(WT, "app/globals.css"), "utf8");
export {}; const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style>
<style>body{margin:0;background:var(--bg);font-family:-apple-system,system-ui,sans-serif}:root{--sans:-apple-system,system-ui,"Helvetica Neue",Arial,sans-serif}.drawer{position:static!important;transform:none!important;height:auto!important;min-height:100vh}.drawer-scrim{position:static!important;background:none!important}</style></head>
<body><div class="drawer-scrim"><aside class="drawer"><div class="drawer-head"><span class="drawer-title">Activity</span></div><div class="drawer-body"><div class="act-eyebrow">Today</div><div class="act-rows">${rows.map((r, i) => row(r, i % 3 === 0)).join("")}</div></div></aside></div></body></html>`;
fs.writeFileSync(OUT, html);
console.log("rows", rows.length);
