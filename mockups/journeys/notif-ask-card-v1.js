// notif-ask-card-v1: draws both parts; the page shell sets window.PART ("a", "b" or both).
const P = '../img/';
const SB = `<div class="sb"><span>9:41</span><span>5G</span></div>`;
const HOME = `<div class="home"></div>`;
const pin = (txt, css, warn) => `<div class="pin${warn ? ' warn' : ''}" style="${css}">${txt}</div>`;

/* ── the screens behind ── */
const filmPage = () => `${SB}
  <div class="fhero" style="background-image:url(${P}wailing.png)"></div>
  <div class="bk">‹</div><div class="bk shr">↑</div>
  <div class="fposter" style="background-image:url(${P}wailing.png)"></div>
  <div class="trailer">▶ Trailer</div>
  <div class="fbody">
    <div class="tt">The Wailing</div>
    <div class="mt">2016 · 2h 36m · Horror, Mystery</div>
    <div class="dir">Directed by <b>Na Hong-jin</b></div>
    <div class="pills"><div class="pl">Seen</div><div class="pl on">✓ Watchlist</div></div>
    <div class="secl">Where to watch</div>
    <div class="svc"><i>N</i><div>Netflix<small>Rent or buy</small></div></div>
  </div>${HOME}`;

const chat = () => `${SB}
  <div class="chd"><div class="x">‹</div><div class="av" style="background:#B8A27F;color:#141416">E</div><div><div class="nm">Emma</div><div class="hd">@emma</div></div></div>
  <div class="msgs">
    <div class="day">Today 9:12 PM</div>
    <div class="bub th">Did you ever watch Prisoners?</div>
    <div class="bub me">Not yet. Is it good?</div>
    <div class="bub th">So good. Friday at mine?</div>
    <div class="bub me">Friday works. I'll bring snacks.</div>
    <div class="sent">Sent</div>
  </div>
  <div class="comp"><div class="fld">Message Emma</div><div class="snd">↑</div></div>${HOME}`;

const tonight = () => `${SB}
  <div class="tn">
    <div class="lab">Tonight</div>
    <div class="t22">Your pick</div>
    <div class="tpo" style="background-image:url(${P}prisoners.png)"></div>
    <div class="ft">Prisoners</div>
    <div class="fm">2013 · 2h 33m · We said 91%</div>
    <div class="stub"><div>▶ Trailer</div><div>✓ Watchlist</div><div>↻ Next fit</div></div>
    <div class="watching">✓ Watching tonight · enjoy</div>
    <div class="und">We'll ask how it was tomorrow. <b>Undo</b></div>
  </div>${HOME}`;

/* ── the ask as built (NotificationAskCard) ── */
const built = (head, title, body, yes) => `<div class="ask"><div class="row"><div class="glyph"></div><div style="flex:1;min-width:0">
  <div class="h1"><b>Montage</b><span>${head}</span></div><div class="ti">${title}</div><div class="bo">${body}</div></div></div>
  <div class="abtns"><div class="no">Not now</div><div class="yes">${yes || 'Turn on'}</div></div></div>`;

/* ── alternative A: the very notification, then what it brings ── */
const app = () => `<div class="lead"><div class="app"></div></div>`;
const face = (l, tint) => `<div class="lead"><div class="face" style="background:${tint}">${l}</div><div class="mini"></div></div>`;
const gl = (lead, t, b, when) => `<div class="gl">${lead}<div class="tx"><div class="l1"><span class="t">${t}</span><span class="tm">${when}</span></div><div class="bd">${b}</div></div></div>`;
const altA = (preview, val, yes) => `<div class="scrim"></div><div class="askA">${preview}<div class="val">${val}</div>
  <div class="abtns"><div class="no">Not now</div><div class="yes">${yes || 'Turn on'}</div></div></div>`;

/* ── alternative B: one banner, no dim, blue Turn on ── */
const altB = (lead, t, b, when) => `<div class="askB"><div class="top">${lead}<div class="tx"><div class="l1"><span class="t">${t}</span><span class="tm">${when}</span></div><div class="bd">${b}</div></div></div>
  <div class="bb"><div class="no">Not now</div><div class="yes">Turn on</div></div></div>`;

const col = (cap, inner, under, capCls) => `<div><div class="cap ${capCls || 'live'}">${cap}</div><div class="ph">${inner}</div><div class="under">${under}</div></div>`;

const partA = `
<h1>Notifications ask: the card as built, and two better ones</h1>
<p class="lede">Our own ask (rule 1157, commit 1b325a21): <code>NotificationAskCard</code> in its own window (<code>NotificationAskWindow</code>) over whatever is open, at most 3 times after the walkthrough, 3+ days apart, only right after a film is saved, Watching this tonight (Tonight, Pitch) or a message is sent. It goes after 15 s or a swipe up. <b>Row 1</b> draws it as built, over a simplified real screen at each of the three moments, plus the "iOS already said no" case. <b>Rows 2 and 3</b> are alternatives that say what you'd get at that moment, in the owner-approved notif-ask-v4 look (big Montage icon, iOS times, the friend's rounded-square face with the small Montage icon). Made-up names only.</p>

<div class="sec">1 · As built today</div>
<div class="mrow four">
  ${col('Saved to the watchlist · film page', filmPage() + built('Notifications', 'Saved for later', 'Turn on notifications to hear when a film you saved comes to one of your services.') + pin('Two cream buttons on one screen', 'top:300px;right:16px', true), '<b>Saved for later</b> restates what you just did, not what you get. The value is in a 3-line body. The cream <b>Turn on</b> and the page\'s cream <b>Trailer</b> are both on screen: two primaries, breaking "one cream per screen".')}
  ${col('A message sent · chat with Emma', chat() + built('Notifications', 'Know when they reply', 'Turn on notifications for replies, invites and movie nights.'), '<b>Know when they reply</b> is the right idea, but "they" when we know it\'s Emma. Covers the chat header, which is fine for 15 s. Nothing cream behind, so no clash.')}
  ${col('Watching this tonight · Tonight', tonight() + built('Tomorrow at 10:00', 'How was Prisoners?', 'Turn on notifications and we\'ll ask you this tomorrow.'), 'The best of the three: it shows tomorrow\'s own question. But it reads like the notification has already arrived; the 24h "10:00" sits where iOS puts the time, and iOS would say 10:00 AM. Behind it the button has turned outlined, so no clash; the red is the poster\'s shadow.')}
  ${col('iOS already said no · film page', filmPage() + built('Notifications', 'Saved for later', 'Notifications are off for Montage. Turn them on in Settings.', 'Turn on in Settings') + pin('"Turn on in Settings" squeezed', 'top:204px;right:24px', true), 'Right call to send them to Settings (Apple\'s prompt only shows once). The label is long for half a row and the title still says "Saved for later". The 38pt fan glyph on black is smaller than the approved 54pt app icon.')}
</div>

<div class="sec">2 · Alternative A · the notification they'd get, then one line on what it brings</div>
<div class="mrow four">
  ${col('Saved to the watchlist', filmPage() + altA(gl(app(), 'The Wailing is on Netflix', 'It\'s on your watchlist. Tonight?', '7:30 PM'), 'Get a nudge when The Wailing comes to one of your services.'), 'The top is a real release reminder, drawn exactly like iOS draws it. The line under it says what Turn on gets you, with the film\'s name. A light dim behind (tap it for Not now) puts the page\'s cream <b>Trailer</b> in shade, so the card\'s <b>Turn on</b> is the one bright button.', 'new')}
  ${col('A message sent to Emma', chat() + altA(gl(face('E', '#B8A27F'), 'Emma', 'Yes! See you Friday.', 'now'), 'Get a nudge when Emma replies.'), 'Emma\'s face with the small Montage icon, as in v4: you see her reply arriving. One line, her name in it. On a real push the face needs Communication Notifications (not built yet); the preview is honest about where it is going.', 'new')}
  ${col('Watching this tonight', tonight() + altA(gl(app(), 'How was Prisoners?', 'We said 91%. Rate it and see if we called it.', '10:00 AM'), 'Get this tomorrow at 10:00 AM.'), 'Tomorrow\'s exact reminder, the same words as <code>DidYouWatchReminder</code>, with an iOS time. Under 15 rated it reads "Did you watch Prisoners?" (rule 202). The poster\'s shadow stays the one red; the card has none.', 'new')}
  ${col('iOS already said no', chat() + altA(gl(face('E', '#B8A27F'), 'Emma', 'Yes! See you Friday.', 'now'), 'Notifications are off for Montage. Turn them on in Settings to get a nudge when Emma replies.', 'Turn on in Settings'), 'Same preview; the line says why Settings. Turn on in Settings gets the wider half of the row (Not now 40%). Never "Open".', 'new')}
</div>

<div class="sec">3 · Alternative B · lighter: one iOS banner, no dim</div>
<div class="mrow four">
  ${col('Saved to the watchlist', filmPage() + altB(app(), 'Know when it\'s streaming', 'We\'ll tell you when The Wailing comes to one of your services.', 'now'), 'Shaped like a real iOS banner: the big icon, a bold value title and "now". The buttons are small; <b>Turn on</b> uses the blue selected style (<code>SecondaryButtonStyle(on:)</code>), so it never competes with a cream button behind and the page needs no dim.')}
  ${col('A message sent to Emma', chat() + altB(app(), 'Get a nudge when Emma replies', 'And when a friend invites you to a movie night.', 'now'), 'The app\'s icon, not Emma\'s face: this is our ask, not her message. Two lines, about 120pt tall against today\'s 170pt.')}
  ${col('Watching this tonight', tonight() + altB(app(), 'How was Prisoners?', 'Turn on and we\'ll ask you this tomorrow at 10:00 AM.', '10:00 AM'), 'Tomorrow\'s question as the title, the promise under it. Lighter than A, but it shows less of what the notification will look like, and small buttons are easier to miss in 15 s.')}
  <div class="notes" style="padding-top:26px">
    <div class="rk">A or B</div>
    <h3>A shows the gift; B stays out of the way</h3>
    <ul>
      <li><b>Value line per moment:</b> both name what they'd get: the film coming to a service, Emma's reply, tomorrow's question at 10:00 AM.</li>
      <li><b>Cream:</b> today's card puts a second cream button over the film page (Trailer). A dims the page while it's up (it is already a modal card for VoiceOver); B makes Turn on blue.</li>
      <li><b>Red:</b> none on any card. The film page has none, the chat none, Tonight's is the poster's shadow.</li>
      <li><b>Times:</b> iOS style, "now", "7:30 PM", "10:00 AM"; no app-name header, as v4.</li>
      <li><b>Unchanged:</b> the count, gap, moments, 15 s, swipe up, Apple's prompt only from Turn on.</li>
    </ul>
  </div>
</div>

<div class="rec">
  <div class="rk">Recommendation · the notifications ask</div>
  <h3>Alternative A</h3>
  <p>Show the very notification Turn on would bring, in the approved v4 look, then one plain line: <b>"Get a nudge when The Wailing comes to one of your services."</b>, <b>"Get a nudge when Emma replies."</b>, <b>"Get this tomorrow at 10:00 AM."</b> Keep Not now and Turn on (Turn on in Settings once iOS said no). Put a light dim behind the card while it's up, so its cream Turn on is the only bright button (today it sits on screen with the film page's cream Trailer). The window becomes full screen for the dim; a tap on the dim is Not now. If the owner prefers the card never dims the app, take B: same lines, blue Turn on.</p>
</div>`;

/* ── part B: Browse's Pitch tip ── */
const glass = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>`;
const TIPS = {
  today: { w: 230, html: `<span><b>New:</b> pitch the film you want, like “Alien, but funny”, and pick from what comes back.</span>` },
  prop: { w: 252, html: `<div><div class="nw">New</div><div class="tt">Pitch a film</div><div>Say it like you'd tell a friend: <span class="q">“set in Tokyo, on Netflix, under 2 hours.”</span></div></div>` },
  alt: { w: 252, html: `<div><div class="nw">New</div><div class="tt">Pitch a film</div><div>Describe the film you want, in your own words. We'll rank every film for you.</div></div>` },
};
const tip = (k, w) => `<div class="tip" style="width:${w || TIPS[k].w}px">${TIPS[k].html}<span class="xx">✕</span></div>`;
const srow = (k, w) => `<div class="srow"><div class="sf">${glass}Search films or people</div><div class="pb"><img src="${P}montage-fan.svg" alt="">Pitch</div>${tip(k, w)}</div>`;
const doors = `<div class="doors"><div>Moods<span>12</span><i>›</i></div><div>Genres<span>19</span><i>›</i></div><div>Decades<span>11</span><i>›</i></div><div>Collections<span>40</span><i>›</i></div><div>World cinema<span>24</span><i>›</i></div><div>Best for you<i style="margin-left:auto">›</i></div></div>`;
const posters = ['witch', 'suspiria', 'midsommar', 'hereditary'];
const browsePhone = k => `${SB}<div class="bw"><div class="t28">Browse</div>${srow(k)}${doors}<div class="strip">${posters.map(p => `<i style="background-image:url(${P}${p}.png)"></i>`).join('')}</div></div>${HOME}`;
const browseWeb = k => `<div class="wbar"><i></i><i></i><i></i><span>montagefilm.app/browse</span></div>
  <div class="wnav"><span class="wm">Montage</span><span>Picks</span><span class="on">Browse</span><span>Lists</span><span>Friends</span></div>
  <div class="wcol"><div class="t28">Browse</div>${srow(k, k === 'today' ? 220 : 258)}${doors}</div>`;

const partB = `
<h1 style="margin-top:${window.PART === 'b' ? 0 : 70}px">Browse's "New" tip for Pitch</h1>
<p class="lede">The first-time tip under the cream Pitch button (web <code>.pitch-tip</code> in Recut.tsx, gone once seen via <code>montage:pitch-tip-seen</code>; iPhone <code>PitchTip</code>, <code>@AppStorage("pitchTipSeen")</code>). It uses the owner's new title <b>Pitch a film</b> (not "Pitch me a film"). Today's tip against the proposed line and one alternative, iPhone then web. Same cream tip, same arrow, same ✕; only the words change, plus a small "New" over a bold title. No red on Browse.</p>

<div class="sec">iPhone · Browse, first visit</div>
<div class="mrow four">
  <div><div class="cap live">Today</div><div class="ph short">${browsePhone('today')}</div><div class="under">“New: pitch the film you want, like ‘Alien, but funny’, and pick from what comes back.” One run-on sentence; no name for the feature beyond the button; "Alien, but funny" is a film-plus-twist example, which search can't do but which also undersells the filters Pitch reads (place, service, length).</div></div>
  <div><div class="cap new">Proposed</div><div class="ph short">${browsePhone('prop')}</div><div class="under"><b>Pitch a film</b> / Say it like you'd tell a friend: "set in Tokyo, on Netflix, under 2 hours." The example is short, concrete, and shows three things Pitch understands at once. 252pt wide so it sits in 4 lines.</div></div>
  <div><div class="cap new">Alternative line</div><div class="ph short">${browsePhone('alt')}</div><div class="under"><b>Pitch a film</b> / Describe the film you want, in your own words. We'll rank every film for you. Clear about the result, but no example, so it tells you what to do without showing how.</div></div>
  <div class="notes" style="padding-top:26px">
    <div class="rk">What changes</div>
    <h3>Words only, same tip</h3>
    <ul>
      <li>"New" moves to a small caps label (cream ink at 55%), the title <b>Pitch a film</b> bold 15, the line 13 medium.</li>
      <li>The quote in the proposed line is a small upright placeholder (12.5), no italics.</li>
      <li>The tip stays cream under the cream Pitch button: it reads as part of that button, and nothing else on Browse is cream.</li>
      <li>Tap ✕, the tip or Pitch: gone for good, as today.</li>
      <li>Also to rename with it: the sheet's heading and field, "Pitch me a film" to "Pitch a film" (rule 1104).</li>
    </ul>
  </div>
</div>

<div class="sec">Web · Browse, first visit</div>
<div class="mrow four" style="gap:16px">
  <div><div class="cap live">Today</div><div class="web">${browseWeb('today')}</div></div>
  <div><div class="cap new">Proposed</div><div class="web">${browseWeb('prop')}</div></div>
  <div><div class="cap new">Alternative line</div><div class="web">${browseWeb('alt')}</div></div>
</div>

<div class="rec">
  <div class="rk">Recommendation · the Pitch tip</div>
  <h3>The proposed line, web and iPhone</h3>
  <p><b>"Pitch a film"</b> over <b>“Say it like you'd tell a friend: ‘set in Tokyo, on Netflix, under 2 hours.’”</b> The example does the teaching: three things in one breath that the search box can't do. The alternative explains the outcome well but gives nothing to copy. Widen the tip from 220/230 to about 258 (web) and 252 (iPhone) so the new line fits in four lines, and rename the sheet's "Pitch me a film" to match.</p>
</div>`;

const part = window.PART || 'all';
document.getElementById('root').innerHTML = (part !== 'b' ? partA : '') + (part !== 'a' ? partB : '');
