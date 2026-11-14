// b41-reveal: the built web reveal (option B), the profile's "Share your archetype" card, and Picks' tab row for a new
// account, from a local `next dev` of the b41-reveal branch. Every /api answer is faked here (stand-in films, %, order).
import { chromium } from "playwright";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
const SP = "/tmp/claude-0/-home-user-CS-Term-Project/3b15a6fd-9770-5491-87a5-4cf8acc3cc2b/scratchpad";
const { profile, films } = await import(`${SP}/flow/fake.mjs`);
const CACHE = `${SP}/flow/tmdb`;
function tmdb(url) {
  const f = `${CACHE}/${crypto.createHash("md5").update(url).digest("hex")}.jpg`;
  if (!fs.existsSync(f)) { try { execFileSync("curl", ["-sSf", "--max-time", "20", "-o", f, url]); } catch { return Buffer.alloc(0); } }
  return fs.readFileSync(f);
}
const BASE = process.env.BASE || "http://localhost:3171";
const OUT = process.env.OUT || "/home/user/CS-Term-Project/build38/b41-reveal";
fs.mkdirSync(OUT, { recursive: true });
const ONLY = process.env.ONLY;
const by = (s) => films.find((f) => f.slug === s);
const card = (s, match, extra = {}) => { const f = by(s); return { slug: f.slug, title: f.title, year: f.year, posterUrl: f.poster, backdropUrl: null, match, ...extra }; };

// The reveal's four picks: two with a film of theirs, two with the strands (so the reworded strand reason shows).
const REVEAL = [
  { s: "oldboy", m: 96, strands: ["slow_burn", "narrative_complexity"] },
  { s: "the-zone-of-interest", m: 94, because: { title: "There Will Be Blood", rating: 4.5 }, strands: ["slow_burn"] },
  { s: "interstellar", m: 93, because: { title: "Stalker", rating: 4 }, strands: [] },
  { s: "hereditary", m: 91, strands: ["narrative_complexity"] },
].filter((x) => by(x.s)).map((x) => ({ ...card(x.s, x.m), why: "lead", because: x.because ?? null, strands: x.strands }));

const STARTER = [["the-shawshank-redemption", 88], ["parasite-2019", 91], ["spirited-away", 86], ["interstellar", 87], ["good-will-hunting", 84], ["the-prestige", 89], ["city-of-god", 85], ["back-to-the-future", 80], ["the-silence-of-the-lambs", 86], ["arrival-2016", 90]]
  .filter(([s]) => by(s)).slice(0, 10).map(([s, m]) => card(s, m));
const FORYOU = [["memories-of-murder", 94], ["chungking-express", 91], ["anatomy-of-a-fall", 89], ["the-handmaiden", 88], ["in-the-mood-for-love", 87], ["decision-to-leave", 86], ["past-lives", 85], ["drive-my-car", 84]].filter(([s]) => by(s)).map(([s, m]) => card(s, m));
const NEW = [["sinners-2025", 78], ["hamnet", 81], ["sentimental-value-2025", 84], ["marty-supreme", 74]].filter(([s]) => by(s)).map(([s, m]) => card(s, m));
const ALL = [...STARTER, ...FORYOU, ...NEW];
const D = { director: null, runtime: 120 };

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const now = Math.floor(Date.now() / 1000);
const user = { id: "00000000-0000-0000-0000-000000000003", aud: "authenticated", role: "authenticated", email: "new@example.com",
  is_anonymous: false, app_metadata: { provider: "email", providers: ["email"] }, user_metadata: { tour_v: 99, tour_seen: true }, created_at: "2026-11-14T00:00:00Z", identities: [] };
const jwt = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: user.id, aud: "authenticated", role: "authenticated", exp: now + 86400, email: user.email })}.sig`;
const session = { access_token: jwt, token_type: "bearer", expires_in: 86400, expires_at: now + 86400, refresh_token: "r", user };
const quiz = { ...profile({ rated: 18, total: 18, username: "newviewer" }), quizOrigin: true, fromExport: undefined, letterboxdUsername: undefined, importSummary: undefined, tuneOffers: undefined, watchlistSlugs: [] };

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const job = { done: false, result: null };

async function newPage({ signedIn = false, state = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: "dark",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1" });
  await ctx.addInitScript(() => { document.addEventListener("DOMContentLoaded", () => { const s = document.createElement("style"); s.textContent = "nextjs-portal{display:none!important}"; document.head.appendChild(s); }); });
  if (signedIn) await ctx.addInitScript(([k, v]) => { try { localStorage.setItem(k, v); } catch {} }, ["sb-127-auth-token", JSON.stringify(session)]);
  if (state) await ctx.addInitScript((st) => { try { for (const [k, v] of Object.entries(st)) localStorage.setItem(k, v); } catch {} }, state);
  await ctx.route("**/*", async (route) => {
    const req = route.request();
    const u = new URL(req.url());
    if (u.hostname === "127.0.0.1" && u.port === "54321") {
      if (signedIn && u.pathname.startsWith("/auth/v1/user")) return route.fulfill({ json: user });
      return route.fulfill({ json: signedIn ? [] : {} });
    }
    if (u.hostname === "image.tmdb.org") return route.fulfill({ body: tmdb(req.url()), contentType: "image/jpeg" });
    if (u.hostname !== "localhost") return route.abort();
    if (!u.pathname.startsWith("/api/")) return route.continue();
    const p = u.pathname;
    let body = {}; try { body = JSON.parse(req.postData() || "{}"); } catch {}
    if (p === "/api/profile-from-csv") return route.fulfill({ json: { jobId: "job-lb", totalFilms: 420 } });
    if (p === "/api/profile-status") {
      if (job.done) return route.fulfill({ json: { status: "complete", progress: 100, step: "Done", result: job.result } });
      return route.fulfill({ json: { status: "running", progress: 48, step: "Enriching films" } });
    }
    if (signedIn && p === "/api/my-profile") return route.fulfill({ json: { id: "p3", username: "newviewer", jobId: "j3", profile: quiz, displayName: "New viewer", avatarUrl: null } });
    if (p === "/api/user-state" && req.method() === "GET") return route.fulfill({ json: { state: state ?? {} } });
    if (p === "/api/weekly-pick") {
      if (!signedIn) return route.fulfill({ json: { picks: REVEAL } });
      if (body.mode === "starter") return route.fulfill({ json: { picks: STARTER, pick: STARTER[0] } });
      if (body.mode === "today") return route.fulfill({ json: { pick: { ...FORYOU[0], today: body.day } } });
      return route.fulfill({ json: { picks: FORYOU.slice(1, 5), pick: FORYOU[1] } });
    }
    if (p === "/api/browse") {
      if (body.friendsEnjoyed) return route.fulfill({ json: { films: [] } });
      if (body.detailFor) return route.fulfill({ json: { films: body.detailFor.map((s) => ALL.find((x) => x.slug === s)).filter(Boolean).map((x) => ({ ...x, ...D })) } });
      return route.fulfill({ json: { films: body.page ? [] : FORYOU.slice(4).map((x) => ({ ...x, ...D })), hasMore: false } });
    }
    if (p === "/api/taste-mixes") return route.fulfill({ json: { comfort: null, growth: null, hiddenGem: null, rewatch: null, lanes: [] } });
    if (p === "/api/new-releases") return route.fulfill({ json: { films: NEW } });
    if (p === "/api/in-theaters") return route.fulfill({ json: { films: [] } });
    if (p === "/api/probes") return route.fulfill({ json: { probes: [], wall: films.map((f) => f.poster).filter(Boolean) } });
    return route.fulfill({ json: {} });
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("pageerror", e.message.slice(0, 300)));
  return page;
}
const shot = async (page, name, wait = 800, opts = {}) => { await page.waitForTimeout(wait); await page.screenshot({ path: `${OUT}/${name}.png`, ...opts }); console.log("shot", name); };

if (!ONLY || ONLY === "reveal") {
  // The named reveal, reached by a Letterboxd import signed out (the same LockedIdentity branch as the rate path).
  const page = await newPage();
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 240000 });
  await page.waitForSelector(".onboard-import-row", { timeout: 240000 });
  await page.waitForTimeout(4000);
  await page.click(".onboard-import-row");
  await page.waitForSelector(".isrc");
  await page.click(".isrc-go");
  await page.waitForSelector(".onboard-import");
  await page.setInputFiles(".onboard-import input[type=file]:not([webkitdirectory])", `${SP}/flow/letterboxd-maren_v-2026-11-14-09-12-utc.zip`);
  await page.waitForSelector(".onboard-file.ready", { timeout: 15000 });
  await page.click(".onboard-import-cta");
  await page.waitForSelector(".pfacts-bar", { timeout: 30000 });
  job.result = { ...profile({ username: "maren_v" }), tuneOffers: undefined, contrarianTakes: [{ slug: "the-godfather", title: "The Godfather", userRating: 2, crowdAvg: 4.5 }] };
  job.done = true;
  await page.waitForSelector(".rvb-picks", { timeout: 60000 });
  await shot(page, "01-reveal-first-screen", 3500);
  await page.click(".rvb-picks");
  await page.waitForTimeout(2500);
  await shot(page, "02-reveal-picks-and-save", 600);
  await shot(page, "03-reveal-full-page", 300, { fullPage: true });
  console.log("lower:", await page.evaluate(() => document.querySelector(".rvl")?.innerText.replace(/\n+/g, " | ")));
  await page.context().close();
}

if (!ONLY || ONLY === "profile") {
  // A new account's profile after the save: the card owed, Picks' first-run marks already seen (so the visit is free).
  const state = { "montage:share-archetype": "owed", "montage_hint_seen:popcorn": "1", "montage_hint_seen:match-tip": "1", "montage_hint_seen:picks": "1" };
  const page = await newPage({ signedIn: true, state });
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 240000 });
  await page.waitForTimeout(12000);
  await page.click("button.tabbtn[aria-label=Profile]");
  await page.waitForSelector(".bnr", { timeout: 30000 }).catch(() => console.log("no banner"));
  await shot(page, "04-profile-share-your-archetype", 2500);
  console.log("banner:", await page.evaluate(() => [...document.querySelectorAll(".bnr")].map((b) => b.innerText.replace(/\n+/g, " | ")).join(" // ")));
  console.log("sharpen row up:", await page.evaluate(() => !!document.querySelector(".psetup, .ps-row, [class*=sharpen-row]")));
  await page.click(".bnr-main");
  await shot(page, "04b-profile-share-my-card-opens-drawer", 2500);
  await page.context().close();
}

if (!ONLY || ONLY === "picks") {
  // A brand-new account on day 1 (18 rated, rate path): Picks' tab row, and For you's starter cards.
  const page = await newPage({ signedIn: true });
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 240000 });
  await page.waitForTimeout(15000);
  await page.click("button.tabbtn[aria-label=Picks]").catch(() => {});
  await page.waitForTimeout(9000);
  await shot(page, "05-picks-day1-for-you", 0);
  await shot(page, "05b-picks-tab-row", 0, { clip: { x: 0, y: 0, width: 393, height: 110 } });
  console.log("tabs:", await page.evaluate(() => [...document.querySelectorAll(".pk-tags [role=tab]")].map((e) => e.textContent.trim()).join(" | ")));
  if (await page.locator(".pk-pop-coach").count()) await page.click(".pk-pop-coach");
  await page.evaluate(() => document.querySelector(".pk-nav button[aria-label='Next film']")?.click());
  await shot(page, "06-picks-for-you-starter-1-of-6", 1600);
  await page.context().close();
}
await browser.close();
