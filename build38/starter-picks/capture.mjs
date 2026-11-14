// Starter picks on the real web Picks page (origin/main in /home/user/wt-starter), every /api answer faked here.
import { chromium } from "playwright";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import { profile, films } from "../flow/fake.mjs";
const SP = "/tmp/claude-0/-home-user-CS-Term-Project/3b15a6fd-9770-5491-87a5-4cf8acc3cc2b/scratchpad";
const CACHE = `${SP}/flow/tmdb`;
function tmdb(url) {
  const f = `${CACHE}/${crypto.createHash("md5").update(url).digest("hex")}.jpg`;
  if (!fs.existsSync(f)) { try { execFileSync("curl", ["-sSf", "--max-time", "20", "-o", f, url]); } catch { return Buffer.alloc(0); } }
  return fs.readFileSync(f);
}
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const now = Math.floor(Date.now() / 1000);
const user = { id: "00000000-0000-0000-0000-000000000002", aud: "authenticated", role: "authenticated", email: "new@example.com",
  is_anonymous: false, app_metadata: { provider: "email", providers: ["email"] }, user_metadata: { tour_v: 99, tour_seen: true }, created_at: "2026-11-14T00:00:00Z", identities: [] };
const jwt = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: user.id, aud: "authenticated", role: "authenticated", exp: now + 86400, email: user.email })}.sig`;
const session = { access_token: jwt, token_type: "bearer", expires_in: 86400, expires_at: now + 86400, refresh_token: "r", user };
const RATED = Number(process.env.RATED || 18);
const quiz = { ...profile({ rated: RATED, total: RATED, username: "newviewer" }), quizOrigin: true, fromExport: undefined, letterboxdUsername: undefined, importSummary: undefined, tuneOffers: undefined, watchlistSlugs: [] };
const by = (s) => films.find((f) => f.slug === s);
const card = (s, match, extra = {}) => { const f = by(s); return { slug: f.slug, title: f.title, year: f.year, posterUrl: f.poster, backdropUrl: null, match, ...extra }; };
// Starter: popular, well-loved, ranked by match + crowd (lib/weekly-picks.ts buildStarterSet); ten, as the route sends.
const STARTER = [["the-shawshank-redemption", 88], ["parasite-2019", 91], ["spirited-away", 86], ["interstellar", 87], ["the-dark-knight", 0], ["whiplash", 0], ["good-will-hunting", 84], ["the-prestige", 89], ["inception", 0], ["city-of-god", 85], ["back-to-the-future", 80], ["the-silence-of-the-lambs", 86], ["arrival-2016", 90]]
  .filter(([s]) => by(s)).slice(0, 10).map(([s, m]) => card(s, m));
const FORYOU = [["memories-of-murder", 94], ["chungking-express", 91], ["anatomy-of-a-fall", 89], ["the-handmaiden", 88], ["in-the-mood-for-love", 87], ["decision-to-leave", 86], ["past-lives", 85], ["drive-my-car", 84], ["incendies", 83], ["the-lobster", 82]].filter(([s]) => by(s)).map(([s, m]) => card(s, m));
const NEW = [["sinners-2025", 78], ["hamnet", 81], ["sentimental-value-2025", 84], ["marty-supreme", 74], ["no-other-choice-2025", 80], ["f1", 62]].filter(([s]) => by(s)).map(([s, m]) => card(s, m));
const SEASON = [["fargo", 83], ["the-royal-tenenbaums", 79], ["moonrise-kingdom", 77], ["the-holdovers", 82], ["knives-out-2019", 76]].filter(([s]) => by(s)).map(([s, m]) => card(s, m));
const ALL = [...STARTER, ...FORYOU, ...NEW, ...SEASON];
const D = { director: null, runtime: 120 };
const BASE = "http://localhost:3160";
const OUT = process.env.OUT || `${SP}/starter/out`;
fs.mkdirSync(OUT, { recursive: true });
const log = [];

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: "dark",
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1" });
await ctx.addInitScript(() => { document.addEventListener("DOMContentLoaded", () => { const s = document.createElement("style"); s.textContent = "nextjs-portal{display:none!important}"; document.head.appendChild(s); }); });
await ctx.addInitScript(([k, v]) => { try { localStorage.setItem(k, v); } catch {} }, ["sb-127-auth-token", JSON.stringify(session)]);
await ctx.route("**/*", async (route) => {
  const req = route.request();
  const u = new URL(req.url());
  if (u.hostname === "127.0.0.1" && u.port === "54321") {
    if (u.pathname.startsWith("/auth/v1/user")) return route.fulfill({ json: user });
    return route.fulfill({ json: [] });
  }
  if (u.hostname === "image.tmdb.org") return route.fulfill({ body: tmdb(req.url()), contentType: "image/jpeg" });
  if (u.hostname !== "localhost") return route.abort();
  if (!u.pathname.startsWith("/api/")) return route.continue();
  const p = u.pathname;
  let body = {}; try { body = JSON.parse(req.postData() || "{}"); } catch {}
  log.push(`${p} ${JSON.stringify(body).slice(0, 160)}`);
  if (p === "/api/my-profile") return route.fulfill({ json: { id: "p2", username: "newviewer", jobId: "j2", profile: quiz, displayName: "New viewer", avatarUrl: null } });
  if (p === "/api/weekly-pick") {
    if (body.mode === "starter") return route.fulfill({ json: { picks: STARTER, pick: STARTER[0] } });
    if (body.mode === "today") return route.fulfill({ json: { pick: { ...FORYOU[0], today: body.day } } });
    return route.fulfill({ json: { picks: FORYOU.slice(1, 5), pick: FORYOU[1] } });
  }
  if (p === "/api/browse") {
    if (body.friendsEnjoyed) return route.fulfill({ json: { films: [] } });
    if (body.detailFor) return route.fulfill({ json: { films: body.detailFor.map((s) => ALL.find((x) => x.slug === s)).filter(Boolean).map((x) => ({ ...x, ...D })) } });
    if (body.season) return route.fulfill({ json: { films: body.page ? [] : SEASON, hasMore: false } });
    return route.fulfill({ json: { films: body.page ? [] : FORYOU.slice(4).map((x) => ({ ...x, ...D })), hasMore: false } });
  }
  if (p === "/api/taste-mixes") return route.fulfill({ json: { comfort: null, growth: null, hiddenGem: null, rewatch: null, lanes: [] } });
  if (p === "/api/new-releases") return route.fulfill({ json: { films: NEW } });
  if (p === "/api/in-theaters") return route.fulfill({ json: { films: [] } });
  if (p === "/api/probes") return route.fulfill({ json: { probes: [], wall: films.map((f) => f.poster) } });
  return route.fulfill({ json: {} });
});
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log("pageerror", e.message.slice(0, 300))); page.on("console", (m) => { if (m.type() === "error") console.log("console", m.text().slice(0, 400)); });
const shot = async (name, wait = 800, opts = {}) => { await page.waitForTimeout(wait); await page.screenshot({ path: `${OUT}/${name}.png`, ...opts }); console.log("shot", name); };
await page.goto(`${BASE}${process.env.PATH_ || "/"}`, { waitUntil: "domcontentloaded", timeout: 240000 });
await page.waitForTimeout(Number(process.env.WAIT || 15000));
await shot("00-landing", 0);
const step = process.env.STEP || "explore";
if (step === "picks") {
  await page.click("button.tabbtn[aria-label=Picks]");
  await page.waitForTimeout(9000);
  await shot("01-picks-foryou", 0);
  console.log(await page.evaluate(() => [...document.querySelectorAll(".pk-tags [role=tab]")].map((e) => e.textContent.trim()).join(" | ")));
  const st = page.locator(".pk-tags [role=tab]", { hasText: "Starter" });
  if (await st.count()) { await st.first().click(); await page.waitForTimeout(4000); await shot("02-starter-tab", 0); }
}
if (step === "full") {
  await page.click("button.tabbtn[aria-label=Picks]");
  await page.waitForTimeout(9000);
  await shot("01-picks-day1", 0);
  await shot("01b-tabs-crop", 0, { clip: { x: 0, y: 0, width: 393, height: 110 } });
  console.log("tabs:", await page.evaluate(() => [...document.querySelectorAll(".pk-tags [role=tab]")].map((e) => e.textContent.trim()).join(" | ")));
  if (await page.locator(".pk-pop-coach").count()) await page.click(".pk-pop-coach");
  const next = async () => { await page.evaluate(() => document.querySelector(".pk-nav button[aria-label='Next film']")?.click()); await page.waitForTimeout(1600); };
  await next();
  await shot("02-foryou-card2", 0);
  await next();
  await shot("03-foryou-card3", 0);
  await page.locator(".pk-tags [role=tab]", { hasText: "Starter" }).first().click();
  await page.waitForTimeout(4000);
  await shot("04-starter-card1", 0);
  await shot("04b-tabs-crop-starter", 0, { clip: { x: 0, y: 0, width: 393, height: 110 } });
  await next(); await shot("05-starter-card2", 0);
  await next(); await shot("06-starter-card3", 0);
  console.log("dateline:", await page.evaluate(() => [...document.querySelectorAll("[class*=dateline], .pk-dl, .pk-date")].map((e) => e.textContent.trim()).slice(0, 5).join(" / ")));
}
if (step === "explore") {
  console.log(await page.evaluate(() => [...document.querySelectorAll("nav a, nav button, [role=tab]")].map((e) => `${e.tagName}.${e.className}|${e.getAttribute("aria-label")}|${e.textContent.trim().slice(0, 30)}`).join("\n")));
}
fs.writeFileSync(`${OUT}/api-log.txt`, log.join("\n"));
await browser.close();
