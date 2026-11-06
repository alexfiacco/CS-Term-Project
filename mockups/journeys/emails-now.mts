// Renders every email Montage sends TODAY, from the real template functions, to HTML files for screenshots.
//   npx tsx mockups/journeys/emails-now.ts <montage checkout> <out dir>
// Images: the logo comes from the checkout's public/; TMDB is blocked here, so posters are local copies.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
const [repo, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const T = await import(join(repo, "lib/email-templates.ts"));
const base = "file://" + join(repo, "public");
const HERE = new URL(".", import.meta.url).pathname;
const IMG = (n: string) => "file://" + join(HERE, n);
const unsub = "https://montagefilm.app/api/email/unsubscribe?u=abc&t=123&k=x";

const picks = [
  { slug: "hereditary", title: "Hereditary", year: 2018, posterUrl: IMG("../img/hereditary.png"), reason: "Slow dread that pays off: the family horror you rate highest.", match: 94 },
  { slug: "in-the-name-of-the-father", title: "In the Name of the Father", year: 1993, posterUrl: IMG("../img/itnotf.png"), reason: "You gave My Left Foot 4.5 stars; this is Day-Lewis and Sheridan again.", match: 91 },
  { slug: "inception", title: "Inception", year: 2010, posterUrl: IMG("../img/inception.png"), reason: "A Nolan you haven't logged, and you've rated every other one 4 or higher.", match: 88 },
];
const friends = [
  { handle: "jake", name: "Jake Morales", slug: "inception", title: "Inception", year: 2010, posterUrl: IMG("../img/inception.png"), rating: 4.5, liked: false, rewatch: true, match: 88, yours: null },
  { handle: "bao", name: "Bao Tran", slug: "hereditary", title: "Hereditary", year: 2018, posterUrl: IMG("../img/hereditary.png"), rating: 4, liked: false, rewatch: false, match: null, yours: 4.5 },
  { handle: "rin", name: null, slug: "in-the-name-of-the-father", title: "In the Name of the Father", year: 1993, posterUrl: IMG("../img/itnotf.png"), rating: 3.5, liked: false, rewatch: false, match: null, yours: "seen" },
];
const oneMore = { lead: "a new Ari Aster", text: "", html: "Ari Aster, whose Hereditary you rated 4.5, has a new film in theaters this week: <a href=\"#\" style=\"color:#8fb2dc;\">Eddington</a>." };
const x = { date: "Nov 9", friends, oneMore, week: { rated: 4, watchlisted: 2 }, run: 3 };
const followFilm = { slug: "inception", title: "Inception", year: 2010, posterUrl: IMG("../img/inception.png") };

const emails: Record<string, [string, string]> = {
  digest: [T.digestSubject(picks, false, x), T.digestHtml(picks, "p_123", unsub, base, x)],
  followup: [T.followupSubject(followFilm), T.followupHtml(followFilm, unsub, base)],
  welcome: [T.welcomeSubject(), T.welcomeHtml({ username: "maya", profileId: "p_123", archetype: "The Night Owl", base })],
  "movie-night-invite": [T.inviteSubject({ host: "@jake", roomName: "Friday", roomUrl: "#", film: { title: "Hereditary", year: 2018, posterUrl: IMG("../img/hereditary.png") } }),
    T.inviteHtml({ host: "@jake", roomName: "Friday", roomUrl: "#", film: { title: "Hereditary", year: 2018, posterUrl: IMG("../img/hereditary.png") } }, unsub, base)],
  "group-invite": [T.groupInviteSubject({ host: "@jake", groupName: "Sunday Matinee", groupUrl: "#", others: ["@jake", "@bao", "@rin", "@sol"], club: false }),
    T.groupInviteHtml({ host: "@jake", groupName: "Sunday Matinee", groupUrl: "#", others: ["@jake", "@bao", "@rin", "@sol"], club: false }, unsub, base)],
};
for (const n of ["confirm-signup", "reset-password", "change-email"]) {
  const src = readFileSync(join(repo, "docs/auth-emails", n + ".html"), "utf8")
    .replaceAll("https://montagefilm.app/brand", base + "/brand").replaceAll("{{ .ConfirmationURL }}", "#");
  // Supabase sends the template body as is, with no <html>/<body>: a mail client renders it on its own white page.
  emails["auth-" + n] = ["(Supabase)", `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">${src}</body></html>`];
}
// Owner-only mails (lib/user-feedback.ts, lib/errlog.ts), replicated as built.
const F = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
const row = (k: string, v: string) => `<tr><td style="padding:2px 14px 2px 0;color:#8a8f98;font:12px ${F};white-space:nowrap">${k}</td><td style="padding:2px 0;color:#efe8da;font:13px ${F}">${v}</td></tr>`;
emails["ops-feedback"] = ["Montage feedback: The Tonight button…", `<!doctype html><html><body style="margin:0"><div style="background:#0b0b0d;padding:24px;font:14px ${F};color:#efe8da"><div style="max-width:560px;margin:0 auto"><div style="font:600 11px ${F};letter-spacing:.2em;text-transform:uppercase;color:#8a8f98">Montage feedback</div><div style="white-space:pre-wrap;line-height:1.6;margin:14px 0 20px;font-size:16px">The Tonight button kept giving me the same film three nights running. Love the app otherwise!</div><table cellpadding="0" cellspacing="0" style="border-top:1px solid #2a2a2e;padding-top:12px">${row("From", "@maya") + row("Category", "bug") + row("Archetype", "The Night Owl") + row("Films logged", "212") + row("Page", "/discover")}</table></div></div></body></html>`];
emails["ops-alert"] = ["Montage: 3 server errors today", `<!doctype html><html><body><p><b>3 server errors today</b></p><p>Latest: <code>weekly-digest</code>: fetch failed</p><p>Everything logged today: <code>/api/health</code> with the cron secret, or Vercel → Logs.</p></body></html>`];

for (const [n, [subject, html]] of Object.entries(emails)) {
  writeFileSync(join(out, n + ".html"), html);
  console.log(n.padEnd(22), subject);
}
