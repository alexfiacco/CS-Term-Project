// Read-only signed-out sweep of the live Montage site.
// Usage: node sweep.js [baseUrl]   (default https://montagefilm.app)
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = (process.argv[2] || 'https://montagefilm.app').replace(/\/$/, '');
const OUT = __dirname;
const SHOTS = path.join(OUT, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });
const CAP = 150;
const DELAY = 1200;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Anything that could call the model or write data is never requested.
const AI_OR_WRITE = /\/api\/(search|pitch|pick-why|why-loved|summary-preview|save-summary|profile-from|taste-match|compatibility|match-recs|tonight|theater|recut|film-suggest|browse\/suggest|quiz-forming|read-card|client-error|app-events|feedback|user-feedback|report|found-via|search\/miss|search\/ensure|enrich-tail|filmography-fill|dna-more|pair-watchlist|ops|cron|dev|admin)/;
const ANALYTICS = /(vercel-insights|_vercel\/insights|_vercel\/speed-insights|google-analytics|googletagmanager|posthog|plausible|sentry|segment)/;

const STATIC = ['/', '/browse', '/discover', '/people', '/archetypes', '/about', '/privacy', '/terms', '/support',
  '/pitch', '/mn', '/social', '/social/people', '/social/communities', '/profile', '/chats',
  '/this-page-does-not-exist-zz', '/film/this-film-does-not-exist-zz', '/u/does-not-exist-zz', '/t/does-not-exist-zz', '/g/does-not-exist-zz'];
const SKIP_PATH = /^\/(api|dev|auth|reset-password|email|go)\b/;

function norm(href) {
  try {
    const u = new URL(href, BASE);
    if (u.origin !== new URL(BASE).origin) return null;
    if (SKIP_PATH.test(u.pathname)) return null;
    u.hash = '';
    return u.pathname + u.search;
  } catch { return null; }
}

async function checkPage(context, url, idx) {
  const page = await context.newPage();
  const rec = { url, status: null, finalUrl: null, redirects: [], consoleErrors: [], pageErrors: [], failedRequests: [],
    blockedRequests: [], overflow: null, brokenImages: [], ellipsis: [], rules: {}, timing: {}, links: [], title: null, error: null };
  page.on('console', (m) => { if (m.type() === 'error') rec.consoleErrors.push(m.text().slice(0, 400)); });
  page.on('pageerror', (e) => rec.pageErrors.push(String(e).slice(0, 400)));
  page.on('response', (r) => {
    const s = r.status();
    if (s >= 400 && !ANALYTICS.test(r.url())) rec.failedRequests.push({ url: r.url().slice(0, 300), status: s });
  });
  page.on('requestfailed', (r) => {
    const f = r.failure() && r.failure().errorText;
    if (ANALYTICS.test(r.url()) || f === 'net::ERR_ABORTED' && rec.blockedRequests.includes(r.url())) return;
    rec.failedRequests.push({ url: r.url().slice(0, 300), status: 'failed', error: f });
  });
  try {
    const t0 = Date.now();
    const resp = await page.goto(BASE + url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    rec.timing.domcontentloaded = Date.now() - t0;
    await page.waitForLoadState('load', { timeout: 30000 }).catch(() => {});
    rec.timing.load = Date.now() - t0;
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    const nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return n ? { dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd) } : null; });
    if (nav) rec.timing.nav = nav;
    rec.status = resp ? resp.status() : null;
    rec.finalUrl = page.url();
    let r = resp && resp.request().redirectedFrom();
    while (r) { rec.redirects.unshift(r.url()); r = r.redirectedFrom(); }
    rec.title = await page.title();
    const dom = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      const out = {};
      out.overflow = { scrollWidth: document.documentElement.scrollWidth, innerWidth: innerWidth, deviceWidth: 390 };
      const W = Math.min(innerWidth, 390);
      out.overflowers = [];
      if (document.documentElement.scrollWidth > W) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.right > W + 1 && r.width > 0 && vis(el)) { out.overflowers.push((el.tagName + '.' + (el.className && el.className.baseVal === undefined ? el.className : '')).slice(0, 80) + ' right=' + Math.round(r.right)); if (out.overflowers.length > 6) break; }
        }
      }
      out.brokenImages = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && (i.currentSrc || i.src)).map((i) => (i.currentSrc || i.src).slice(0, 250));
      out.ellipsis = [];
      for (const el of document.querySelectorAll('body *')) {
        if (!el.childElementCount && !el.textContent.trim()) continue;
        const cs = getComputedStyle(el);
        const clipped = (cs.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1) ||
          (cs.webkitLineClamp && cs.webkitLineClamp !== 'none' && el.scrollHeight > el.clientHeight + 2);
        if (clipped && vis(el)) out.ellipsis.push({ tag: el.tagName, text: el.textContent.trim().slice(0, 120), cls: String(el.className).slice(0, 60) });
        if (out.ellipsis.length > 25) break;
      }
      const text = document.body.innerText || '';
      out.emDashes = (text.match(/[^\n]{0,40}—[^\n]{0,40}/g) || []).slice(0, 10);
      out.starRows = (text.match(/[^\n]{0,20}[★☆]{2,}[^\n]{0,20}/g) || []).slice(0, 10);
      out.italics = [];
      for (const el of document.querySelectorAll('p, span, div, li, em, i, blockquote')) {
        if (el.childElementCount) continue;
        const t = el.textContent.trim();
        if (t.length > 50 && getComputedStyle(el).fontStyle === 'italic' && vis(el)) out.italics.push(t.slice(0, 100));
        if (out.italics.length > 8) break;
      }
      out.circles = [];
      for (const el of document.querySelectorAll('img, [class*=avatar i]')) {
        const r = el.getBoundingClientRect(); if (!r.width || r.width > 160 || !vis(el)) continue;
        const br = parseFloat(getComputedStyle(el).borderTopLeftRadius);
        if (Math.abs(r.width - r.height) < 2 && br >= r.width / 2 - 1) out.circles.push((el.getAttribute('alt') || el.className || el.tagName).toString().slice(0, 60));
        if (out.circles.length > 8) break;
      }
      // Rough red-accent count: visible elements whose text or background is a saturated red.
      const isRed = (c) => { const m = c.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?/); if (!m) return false; const [r, g, b, a] = [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]]; return a > 0.5 && r > 150 && g < 90 && b < 90; };
      out.redEls = [];
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight || !vis(el)) continue;
        const cs = getComputedStyle(el);
        if (isRed(cs.backgroundColor) || (el.childElementCount === 0 && el.textContent.trim() && isRed(cs.color)) || isRed(cs.borderTopColor) && parseFloat(cs.borderTopWidth) > 0)
          out.redEls.push((el.tagName + ' ' + el.textContent.trim().slice(0, 30)));
        if (out.redEls.length > 12) break;
      }
      out.og = (document.querySelector('meta[property="og:image"]') || {}).content || null;
      out.links = [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.getAttribute('href'), text: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 120) }));
      return out;
    });
    rec.overflow = { ...dom.overflow, horizontal: dom.overflow.scrollWidth > Math.min(dom.overflow.innerWidth, 390), offenders: dom.overflowers };
    rec.brokenImages = dom.brokenImages;
    rec.ellipsis = dom.ellipsis;
    rec.rules = { emDashes: dom.emDashes, starRows: dom.starRows, italics: dom.italics, circularAvatars: dom.circles, redAccentsInFirstScreen: dom.redEls };
    rec.ogImage = dom.og;
    rec.links = dom.links;
    rec.screenshot = path.join(SHOTS, String(idx).padStart(3, '0') + '_' + url.replace(/[^a-z0-9]+/gi, '_').slice(0, 70) + '.png');
    await page.screenshot({ path: rec.screenshot, fullPage: false });
  } catch (e) {
    rec.error = String(e).slice(0, 400);
  }
  await page.close();
  return rec;
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const blocked = [];
  await context.route('**/*', (route) => {
    const req = route.request();
    const u = req.url();
    const sameSite = u.startsWith(BASE);
    if (sameSite && (!['GET', 'HEAD'].includes(req.method()) || AI_OR_WRITE.test(new URL(u).pathname))) {
      blocked.push({ method: req.method(), url: u.slice(0, 200) });
      return route.abort('blockedbyclient');
    }
    if (!sameSite && req.method() !== 'GET' && !ANALYTICS.test(u)) { blocked.push({ method: req.method(), url: u.slice(0, 200) }); return route.abort('blockedbyclient'); }
    return route.continue();
  });

  const results = [];
  const seen = new Set();
  const queue = [...STATIC];
  const visit = async (u) => {
    if (seen.has(u) || results.length >= CAP) return null;
    seen.add(u);
    const before = blocked.length;
    const rec = await checkPage(context, u, results.length);
    rec.blockedRequests = blocked.slice(before).map((b) => b.method + ' ' + b.url);
    results.push(rec);
    console.log(results.length, rec.status, u, rec.error ? 'ERR ' + rec.error.slice(0, 80) : '', rec.overflow && rec.overflow.horizontal ? 'OVERFLOW' : '');
    await sleep(DELAY);
    return rec;
  };

  // Hop 0: static seeds.
  for (const u of queue) await visit(u);
  // Pick varied film pages and other dynamic pages from links found so far.
  const allLinks = results.flatMap((r) => r.links || []);
  const byPrefix = (p) => [...new Map(allLinks.map((l) => [norm(l.href), l]).filter(([k]) => k && k.startsWith(p))).values()];
  const films = byPrefix('/film/');
  const nonAscii = films.filter((l) => /[^\x00-\x7F]/.test(l.text));
  const longT = [...films].sort((a, b) => b.text.length - a.text.length);
  const pickFilms = [...new Set([...nonAscii.slice(0, 4), ...longT.slice(0, 4), ...films.slice(0, 12)].map((l) => norm(l.href)))].slice(0, 15);
  const dyn = [...pickFilms];
  for (const p of ['/person/', '/actor/', '/director/', '/lane/', '/theme/', '/nanogenre/', '/browse/', '/u/', '/t/', '/pitch/', '/pick/', '/m/', '/g/', '/recut/'])
    dyn.push(...byPrefix(p).slice(0, 4).map((l) => norm(l.href)));
  for (const u of dyn) await visit(u);
  // One hop from every page so far, round-robin so no one page eats the cap.
  const hop = [];
  for (const r of [...results]) for (const l of r.links || []) { const n = norm(l.href); if (n && !seen.has(n) && !hop.includes(n)) hop.push(n); }
  for (const u of hop) { if (results.length >= CAP) break; await visit(u); }

  // og:image / share-card checks.
  const req = context.request;
  const ogChecks = [];
  const ogTargets = new Set();
  for (const r of results) if (r.ogImage && /\/(film|pitch|t|u|browse|pick|m)\//.test(new URL(r.url, BASE).pathname)) ogTargets.add(r.ogImage);
  for (const f of pickFilms.slice(0, 5)) { ogTargets.add(BASE + f + '/opengraph-image'); ogTargets.add(BASE + f + '/card'); }
  for (const t of [...ogTargets].slice(0, 20)) {
    try {
      const t0 = Date.now();
      const resp = await req.get(t.startsWith('http') ? t : BASE + t, { timeout: 30000 });
      const body = await resp.body();
      ogChecks.push({ url: t, status: resp.status(), contentType: resp.headers()['content-type'], bytes: body.length, ms: Date.now() - t0 });
    } catch (e) { ogChecks.push({ url: t, error: String(e).slice(0, 200) }); }
    await sleep(DELAY);
  }

  await browser.close();
  for (const r of results) delete r.links;
  const clean = (r) => !r.error && r.status && r.status < 400 && !r.consoleErrors.length && !r.pageErrors.length && !r.failedRequests.length && !(r.overflow && r.overflow.horizontal) && !r.brokenImages.length;
  const summary = {
    base: BASE, when: new Date().toISOString(), pages: results.length, clean: results.filter(clean).length,
    slowest: [...results].filter((r) => r.timing.load).sort((a, b) => b.timing.load - a.timing.load).slice(0, 10).map((r) => ({ url: r.url, dcl: r.timing.domcontentloaded, load: r.timing.load })),
    blockedByUs: blocked.length,
  };
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ summary, ogChecks, results }, null, 2));
  console.log(JSON.stringify(summary, null, 2));
})();
