// Emails v1: one system for every email Montage sends. Builds emails-v1.html (each email in a [data-email]
// block, 390px wide, for emails-shot.js) and, with --assets, the wordmark PNG the header uses.
//   node emails-v1.js [--assets]
// Every email is table-only, inline-styled markup that could be pasted into a template as is; the page
// chrome around them (labels, subject lines) is mockup only. Posters are local copies (TMDB is blocked here).
const fs = require('fs'), path = require('path');
const HERE = __dirname;

// ---- Tokens (app/globals.css) ------------------------------------------------------------------------
const C = {
  bg: '#0b0b0d', panel: '#141417', panel2: '#1b1b1f', line: '#2a2a2e', line2: '#3a3a3e',
  ink: '#efe8da', read: '#d3cdc0', muted: '#a9a69e', faint: '#8a877f',
  blue: '#8fb3d9',            // --accent-2: data, stars, match %, eyebrows
  red: '#c24c56', blue2: '#5a86bd', // the icon's two cards: the tick above each eyebrow, nowhere else
  shadow: '#7a1220',          // oxblood: the offset shadow under the ONE hero poster
  btnInk: '#141210',
};
const UI = "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
const READ = "'Newsreader',Georgia,'Times New Roman',serif";
const DISPLAY = "'Bodoni Moda',Didot,'Bodoni 72',Georgia,'Times New Roman',serif";
const FONTS = 'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Bodoni+Moda:opsz,wght@6..96,500;6..96,600&display=swap';

// In production these are https://montagefilm.app/brand/...; here they are the local copies.
const ICON = 'emails-v1-icon.png';          // = public/brand/montage-email-logo.png (192px, shown at 32)
const WORDMARK = 'emails-v1-wordmark.png';  // proposed public/brand/montage-email-wordmark.png (360x102, shown at 120x34)
const IMG = n => `../img/${n}`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---- Pieces ------------------------------------------------------------------------------------------
// The header: ONE line. Icon and wordmark in two cells of a centred table, both vertical-align:middle.
// The wordmark PNG is cropped so its cap height (not the g's descender) sits on the icon's centre line.
// Images off: the icon has empty alt, the wordmark's alt text is set in Bodoni cream, so it still reads "Montage".
const header = (home = 'https://montagefilm.app') => `
<tr><td align="center" style="padding:0 0 24px;">
  <a href="${home}" style="text-decoration:none;display:inline-block;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center"><tr>
    <td valign="middle" style="vertical-align:middle;padding:0 10px 0 0;line-height:0;"><img src="${ICON}" width="32" height="32" alt="" style="display:block;width:32px;height:32px;border:0;border-radius:7px;"></td>
    <td valign="middle" style="vertical-align:middle;line-height:0;"><img src="${WORDMARK}" width="120" height="34" alt="Montage" style="display:block;width:120px;height:34px;border:0;font-family:${DISPLAY};font-size:26px;line-height:34px;font-weight:600;color:${C.ink};"></td>
  </tr></table></a>
</td></tr>`;

// The brand tick: the icon's red and blue cards as two 12px bars, above every eyebrow. The only red in any email.
const tick = `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 12px;"><tr>
  <td width="12" height="3" bgcolor="${C.red}" style="width:12px;height:3px;line-height:3px;font-size:0;background:${C.red};border-radius:2px 0 0 2px;">&nbsp;</td>
  <td width="12" height="3" bgcolor="${C.blue2}" style="width:12px;height:3px;line-height:3px;font-size:0;background:${C.blue2};border-radius:0 2px 2px 0;">&nbsp;</td></tr></table>`;

const eyebrow = t => `<tr><td style="padding:0;">${tick}<div style="font-family:${UI};font-size:11px;line-height:14px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${C.blue};">${esc(t)}</div></td></tr>`;
const headline = h => `<tr><td style="padding:12px 0 14px;font-family:${DISPLAY};font-size:28px;line-height:33px;font-weight:500;color:${C.ink};">${h}</td></tr>`;
const para = (h, pad = '0 0 20px') => `<tr><td style="padding:${pad};font-family:${READ};font-size:17px;line-height:26px;color:${C.read};">${h}</td></tr>`;
const rule = (pad = '22px') => `<tr><td style="padding:${pad} 0 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td height="1" bgcolor="${C.line}" style="height:1px;line-height:1px;font-size:0;background:${C.line};">&nbsp;</td></tr></table></td></tr>`;
const label = t => `<tr><td style="padding:22px 0 10px;font-family:${UI};font-size:11px;line-height:14px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${C.faint};">${esc(t)}</td></tr>`;

// Bulletproof pill: the colour is on the cell (bgcolor too, for Outlook), the link fills it. Full width, 52px,
// the app's .btn (cream, 600, pill).
const button = (href, t) => `<tr><td style="padding:6px 0 0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
    <td align="center" bgcolor="${C.ink}" style="background:${C.ink};border-radius:999px;mso-padding-alt:15px 24px;">
      <a href="${esc(href)}" style="display:block;padding:15px 24px;font-family:${UI};font-size:16px;line-height:22px;font-weight:600;color:${C.btnInk};text-decoration:none;border-radius:999px;">${esc(t)}</a>
    </td></tr></table></td></tr>`;
const under = h => `<tr><td align="center" style="padding:14px 0 0;font-family:${UI};font-size:13px;line-height:19px;color:${C.muted};">${h}</td></tr>`;
const link = (href, t, c = C.ink) => `<a href="${esc(href)}" style="color:${c};text-decoration:underline;text-decoration-color:${C.line2};text-underline-offset:2px;">${t}</a>`;
const note = h => rule('24px') + `<tr><td style="padding:16px 0 0;font-family:${UI};font-size:13px;line-height:19px;color:${C.faint};">${h}</td></tr>`;

// A film: poster left, title block right. `hero` puts the app's oxblood offset shadow under the poster
// (box-shadow: Apple Mail and iOS show it; Gmail drops it and the poster stands alone, which is fine).
const filmCard = (f, o = {}) => {
  const w = o.w ?? 88, h = Math.round(w * 1.5);
  return `<tr><td style="padding:${o.pad ?? '4px 0 22px'};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
    <td width="${w}" valign="top" style="width:${w}px;vertical-align:top;"><a href="#"><img src="${f.poster}" width="${w}" height="${h}" alt="${esc(f.title)} poster" style="display:block;width:${w}px;height:${h}px;border:0;border-radius:6px;${o.hero ? `box-shadow:5px 5px 0 ${C.shadow};` : ''}font-family:${UI};font-size:12px;color:${C.faint};background:${C.panel2};"></a></td>
    <td valign="${o.middle ? 'middle' : 'top'}" style="padding:0 0 0 ${o.hero ? 20 : 16}px;vertical-align:${o.middle ? 'middle' : 'top'};">
      ${o.kicker ? `<div style="font-family:${UI};font-size:11px;line-height:14px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${C.faint};padding:0 0 6px;">${o.kicker}</div>` : ''}
      <div style="font-family:${DISPLAY};font-size:${o.big ? 22 : 18}px;line-height:${o.big ? 26 : 23}px;font-weight:500;color:${C.ink};"><a href="#" style="color:${C.ink};text-decoration:none;">${esc(f.title)}</a></div>
      <div style="font-family:${UI};font-size:13px;line-height:19px;color:${C.faint};padding:3px 0 0;">${[f.year, f.dir].filter(Boolean).join(' · ')}</div>
      ${f.match ? `<div style="font-family:${UI};font-size:13px;line-height:19px;font-weight:600;color:${C.blue};padding:4px 0 0;">${f.match}% match</div>` : ''}
      ${f.reason ? `<div style="font-family:${READ};font-size:15px;line-height:22px;color:${C.read};padding:6px 0 0;">${esc(f.reason)}</div>` : ''}
    </td></tr></table></td></tr>`;
};

// The 1-5 rating row: five equal tiles across the card's full width, each a whole-tile link (>=56px tall,
// above the 44px tap minimum): a blue star, the number it saves under it, and "Not for me" / "Loved it" under
// the ends so the row reads as a scale. U+2605 + U+FE0E keeps the star a text glyph (never an emoji) in the blue.
const stars = (base, slug) => {
  const tile = n => `<td width="20%" align="center" valign="top" style="width:20%;padding:0 ${n === 5 ? 0 : 3}px 0 ${n === 1 ? 0 : 3}px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
        <td align="center" bgcolor="${C.panel2}" style="background:${C.panel2};border:1px solid ${C.line2};border-radius:12px;">
          <a href="${base}/film/${slug}?rate=${n}&amp;src=email" aria-label="Rate it ${n} out of 5" style="display:block;padding:12px 0 10px;text-decoration:none;">
            <span style="display:block;font-family:${UI};font-size:24px;line-height:24px;color:${C.blue};">&#9733;&#xFE0E;</span>
            <span style="display:block;font-family:${UI};font-size:15px;line-height:18px;font-weight:600;color:${C.ink};padding:6px 0 0;">${n}</span>
          </a></td></tr></table></td>`;
  return `<tr><td style="padding:0 0 8px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>${[1, 2, 3, 4, 5].map(tile).join('')}</tr></table></td></tr>
  <tr><td style="padding:0 0 4px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
    <td style="font-family:${UI};font-size:12px;line-height:16px;color:${C.faint};">Not for me</td>
    <td align="right" style="font-family:${UI};font-size:12px;line-height:16px;color:${C.faint};">Loved it</td></tr></table></td></tr>`;
};

// The shell: dark ground on the outer table (with bgcolor, for clients that drop CSS), a 480px column,
// the lockup, one panel, the footer. Dark only, on purpose (see the report): color-scheme says so, so
// Apple Mail and iOS Mail leave it alone.
const shell = o => `
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${C.bg};">${esc(o.preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${C.bg}" style="background:${C.bg};width:100%;min-width:100%;margin:0;padding:0;">
<tr><td align="center" bgcolor="${C.bg}" style="padding:32px 16px 40px;background:${C.bg};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:480px;margin:0 auto;">
    ${header()}
    <tr><td bgcolor="${C.panel}" style="background:${C.panel};border:1px solid ${C.line};border-radius:12px;padding:28px 22px 26px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        ${eyebrow(o.eyebrow)}${headline(o.headline)}${o.body}
      </table>
    </td></tr>
    <tr><td align="center" style="padding:22px 12px 0;font-family:${UI};font-size:12px;line-height:18px;color:${C.faint};">
      ${o.why}<br>${o.links.map(([h, t]) => link(h, t, C.muted)).join(' &nbsp;·&nbsp; ')}
      ${o.postal === false ? '' : `<br><span style="color:#6b6860;">Montage · PO Box 0000 · City, ST 00000</span>`}
    </td></tr>
  </table>
</td></tr></table>`;

// ---- The emails --------------------------------------------------------------------------------------
const B = 'https://montagefilm.app';
const UNSUB = `${B}/api/email/unsubscribe?u=…&t=…`;
const P = {
  hereditary: { title: 'Hereditary', year: 2018, dir: 'Ari Aster', poster: IMG('hereditary.png') },
  father: { title: 'In the Name of the Father', year: 1993, dir: 'Jim Sheridan', poster: IMG('itnotf.png') },
  inception: { title: 'Inception', year: 2010, dir: 'Christopher Nolan', poster: IMG('inception.png') },
};
const chip = (l, c) => `<span style="display:inline-block;width:18px;height:18px;line-height:18px;border-radius:4px;background:${c};color:${C.bg};font-family:${UI};font-size:10px;font-weight:700;text-align:center;vertical-align:1px;margin-right:3px;">${l}</span>`;
const friend = (l, c, handle, did, stars_, f, aside) => `<tr><td style="padding:8px 0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
    <td width="40" valign="top" style="width:40px;vertical-align:top;"><img src="${f.poster}" width="40" height="60" alt="${esc(f.title)} poster" style="display:block;width:40px;height:60px;border:0;border-radius:4px;background:${C.panel2};"></td>
    <td valign="top" style="padding:0 0 0 12px;vertical-align:top;">
      <div style="font-family:${UI};font-size:13px;line-height:19px;color:${C.muted};">${chip(l, c)}&nbsp; <b style="font-weight:600;color:${C.ink};">@${handle}</b> ${did} <span style="color:${C.blue};font-weight:600;">${stars_}</span></div>
      <div style="font-family:${DISPLAY};font-size:17px;line-height:22px;font-weight:500;color:${C.ink};padding:3px 0 0;">${esc(f.title)} <span style="font-family:${UI};font-size:12px;color:${C.faint};font-weight:400;">${f.year}</span></div>
      <div style="font-family:${UI};font-size:12px;line-height:17px;color:${C.faint};padding:2px 0 0;">${aside}</div>
    </td></tr></table></td></tr>`;

const emails = [
  {
    id: 'digest', name: 'Weekly digest', src: 'lib/email-templates.ts digestHtml · cron/weekly-digest (Mondays)',
    subject: 'Three picks, and what Jake and 2 friends watched', preheader: 'Hereditary, In the Name of the Father, Inception, and what Jake and 2 friends watched',
    html: shell({
      preheader: 'Hereditary, In the Name of the Father, Inception, and what Jake and 2 friends watched',
      eyebrow: 'Your week · Nov 9', headline: 'Three for the week',
      body: para('Picked from everything you’ve rated so far.', '0 0 18px') + rule('0')
        + filmCard({ ...P.hereditary, match: 94, reason: 'Slow dread that pays off: the family horror you rate highest.' }, { pad: '18px 0 0', w: 72 })
        + filmCard({ ...P.father, match: 91, reason: 'You gave My Left Foot 4.5 stars; this is Day-Lewis and Sheridan again.' }, { pad: '18px 0 0', w: 72 })
        + filmCard({ ...P.inception, match: 88, reason: 'A Nolan you haven’t logged, and you’ve rated every other one 4 or higher.' }, { pad: '18px 0 0', w: 72 })
        + rule('24px') + label('What your friends watched')
        + friend('J', '#6f93c7', 'jake', 'rewatched', '4.5★', P.inception, '<span style="color:#8fb3d9;font-weight:600;">88% match</span> for you')
        + friend('B', '#5b8a6e', 'bao', 'watched', '4★', P.hereditary, 'You gave it 4.5★')
        + friend('R', '#9a6b8f', 'rin', 'watched', '3.5★', P.father, 'You’ve seen it')
        + rule('18px') + label('One more thing')
        + para(`Ari Aster, whose Hereditary you rated 4.5, has a new film in theaters this week: ${link('#', 'Eddington')}.`, '0 0 24px')
        + button(`${B}/discover`, 'See the rest in Picks')
        + under('Your week: 4 films rated · 2 added to your watchlist.<br>Your 3-week run: any film by Sunday keeps it going.'),
      why: 'Your week on Montage, every Monday.',
      links: [[UNSUB, 'Unsubscribe'], ['#', 'Email settings'], ['#', 'Your profile']],
    }),
  },
  {
    id: 'followup', name: 'Tonight follow-up', src: 'lib/email-templates.ts followupHtml · cron/tonight-followup (16:00 UTC)',
    subject: 'Did you end up watching Inception?', preheader: 'Tap a star and it’s in your ratings.',
    html: shell({
      preheader: 'Tap a star and it’s in your ratings.',
      eyebrow: 'From last night', headline: 'Did you end up watching Inception?',
      body: filmCard({ ...P.inception }, { hero: true, w: 96, big: true, middle: true, kicker: 'Your Tonight pick', pad: '6px 0 26px' })
        + para('How was it? Tap a star and it’s saved to your ratings.', '0 0 16px')
        + stars(B, 'inception')
        + note(`Didn’t get to it? ${link('#', 'Save it for another night', C.muted)}.`),
      why: 'Sent once, the morning after a Tonight pick.',
      links: [[UNSUB, 'Stop these emails'], ['#', 'Email settings']],
    }),
  },
  {
    id: 'welcome', name: 'Welcome', src: 'lib/email-welcome.ts → welcomeHtml (first profile save)',
    subject: 'You’re in: your Montage profile is saved', preheader: 'Your Film DNA is on your account now.',
    html: shell({
      preheader: 'Your Film DNA is on your account now.',
      eyebrow: 'Welcome to Montage', headline: 'You’re in, @maya.',
      body: para('<i>The Night Owl</i> it is. Your profile is saved to your account, so it follows you to any device and gets sharper with every film you rate.', '0 0 16px')
        + para('Stuck on what to watch tonight? Tell Tonight how you feel and it hands you one film.', '0 0 22px')
        + button(`${B}/discover?tonight=1`, 'Pick something for tonight')
        + note(`${link('#', 'Your profile', C.muted)} is the page to share. Send it to a friend and see how your tastes line up.`),
      why: 'Sent once, because you just made an account.',
      links: [[B, 'montagefilm.app'], ['#', 'Email settings']],
    }),
  },
  {
    id: 'movie-night-invite', name: 'Movie night invite', src: 'lib/movie-night-invite-email.ts → inviteHtml',
    subject: '@jake wants to watch Hereditary with you', preheader: 'A movie night for Hereditary. Join and vote it in.',
    html: shell({
      preheader: 'A movie night for Hereditary. Join and vote it in.',
      eyebrow: 'Movie night', headline: '@jake wants to watch Hereditary with you.',
      body: filmCard({ ...P.hereditary, match: 92 }, { hero: true, w: 96, big: true, middle: true, kicker: 'The pick so far', pad: '6px 0 26px' })
        + para('Join to see how it fits you, and vote it in or pitch something else.', '0 0 22px')
        + button('#', 'Join the movie night'),
      why: 'Sent when someone adds you to a movie night.',
      links: [[UNSUB, 'Stop these emails'], ['#', 'Email settings']],
    }),
  },
  {
    id: 'group-invite', name: 'Group invite', src: 'lib/group-invite-email.ts → groupInviteHtml',
    subject: '@jake invited you to join Sunday Matinee', preheader: 'With @jake, @bao, @rin and 1 more.',
    html: shell({
      preheader: 'With @jake, @bao, @rin and 1 more.',
      eyebrow: 'New group', headline: '@jake invited you to join <i>Sunday Matinee</i>.',
      body: `<tr><td style="padding:0 0 18px;font-family:${UI};font-size:13px;line-height:19px;color:${C.muted};">${chip('J', '#6f93c7')}${chip('B', '#5b8a6e')}${chip('R', '#9a6b8f')}${chip('S', '#b08a4f')}&nbsp; With <b style="color:${C.ink};font-weight:600;">@jake, @bao, @rin</b> and 1 more</td></tr>`
        + para('See the films you all love, the ones you split on, and your group’s Film DNA. Start a movie night and Montage finds a film that suits everyone.', '0 0 22px')
        + button('#', 'Join Sunday Matinee'),
      why: 'Sent when someone invites you to a group.',
      links: [[UNSUB, 'Stop these emails'], ['#', 'Email settings']],
    }),
  },
  {
    id: 'auth-reset-password', name: 'Reset password (Supabase)', src: 'docs/auth-emails/reset-password.html',
    subject: 'Reset your Montage password', preheader: 'The link works once and expires in an hour.',
    html: shell({
      preheader: 'The link works once and expires in an hour.',
      eyebrow: 'Your account', headline: 'Set a new password',
      body: para('Someone asked to reset the password for this Montage account. If that was you, choose a new one here. The link works once and expires in an hour.', '0 0 22px')
        + button('{{ .ConfirmationURL }}', 'Set a new password')
        + note('Didn’t ask for this? Ignore it. Your password stays as it is, and nobody can change it without this email.'),
      why: 'Sent to {{ .Email }} because a reset was requested on Montage.', links: [[B, 'montagefilm.app']], postal: false,
    }),
  },
  {
    id: 'auth-change-email', name: 'Change email (Supabase)', src: 'docs/auth-emails/change-email.html (also, likely, a guest saving with email)',
    subject: 'Confirm your email for Montage', preheader: 'One tap and this address is your sign-in.',
    html: shell({
      preheader: 'One tap and this address is your sign-in.',
      eyebrow: 'Your account', headline: 'Confirm this email',
      body: para('Confirm this address and it becomes how you sign in to Montage. Your profile, ratings and Film DNA stay exactly as they are.', '0 0 22px')
        + button('{{ .ConfirmationURL }}', 'Confirm email')
        + note('Didn’t ask for this? Ignore it and nothing changes.'),
      why: 'Sent to {{ .Email }} because it was added to a Montage account.', links: [[B, 'montagefilm.app']], postal: false,
    }),
  },
  {
    id: 'auth-confirm-signup', name: 'Confirm signup (Supabase)', src: 'docs/auth-emails/confirm-signup.html (dormant while Confirm email is off)',
    subject: 'Confirm your Montage email', preheader: 'Your archetype is waiting.',
    html: shell({
      preheader: 'Your archetype is waiting.',
      eyebrow: 'Welcome to Montage', headline: 'Confirm your email',
      body: para('Your archetype is waiting. Confirm this address and your profile, your Film DNA and your weekly picks are yours to keep.', '0 0 22px')
        + button('{{ .ConfirmationURL }}', 'Confirm my email')
        + note('Didn’t make a Montage account? Ignore this and nothing happens.'),
      why: 'Sent to {{ .Email }} because it was used to sign up for Montage.', links: [[B, 'montagefilm.app']], postal: false,
    }),
  },
  {
    id: 'auth-reauth-code', name: 'Verification code (Supabase, NEW)', src: 'no template in repo today: auth.reauthenticate() in ProfileMenu.tsx and GuestSave.tsx sends Supabase’s default',
    subject: 'Your Montage code: {{ .Token }}', preheader: 'Use it to set your password. It expires soon.',
    html: shell({
      preheader: 'Use it to set your password. It expires soon.',
      eyebrow: 'Your account', headline: 'Your code',
      body: para('Enter this in Montage to set your password.', '0 0 18px')
        + `<tr><td align="center" bgcolor="${C.panel2}" style="background:${C.panel2};border:1px solid ${C.line2};border-radius:12px;padding:18px 0;font-family:'SF Mono',ui-monospace,Menlo,Consolas,monospace;font-size:32px;line-height:38px;font-weight:600;letter-spacing:0.3em;color:${C.ink};">482913</td></tr>`
        + note('Didn’t ask for this? Ignore it. Nothing changes without the code.'),
      why: 'Sent to {{ .Email }} from your Montage account settings.', links: [[B, 'montagefilm.app']], postal: false,
    }),
  },
];

// ---- The page ----------------------------------------------------------------------------------------
const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark">
<title>Emails v1</title>
<link href="${FONTS}" rel="stylesheet">
<style>
  :root{color-scheme:dark}
  body{margin:0;background:#050506;color:${C.ink};font-family:${UI}}
  .top{max-width:1240px;margin:0 auto;padding:32px 16px 8px}
  .top h1{font:500 32px/1.15 ${DISPLAY};margin:0 0 8px}
  .top p{font:400 15px/1.5 ${UI};color:${C.muted};max-width:760px;margin:0 0 6px}
  .grid{max-width:1240px;margin:0 auto;padding:16px 16px 60px;display:flex;flex-wrap:wrap;gap:36px 28px}
  .col{width:390px;max-width:100%}
  .meta{font:600 11px/1.4 ${UI};letter-spacing:.16em;text-transform:uppercase;color:${C.blue};margin:0 0 4px}
  .src{font:400 12px/1.4 ${UI};color:${C.faint};margin:0 0 10px;min-height:34px}
  .inbox{border:1px solid ${C.line};border-bottom:0;border-radius:12px 12px 0 0;padding:10px 14px;background:#111113;font:400 13px/1.4 ${UI}}
  .inbox b{display:block;color:${C.ink};font-weight:600}.inbox span{color:${C.faint}}
  [data-email]{width:390px;max-width:100%;border:1px solid ${C.line};border-radius:0 0 12px 12px;overflow:hidden}
</style></head><body>
<div class="top"><h1>Every Montage email, one system</h1>
<p>One lockup (icon and wordmark on one line, centred), one dark panel, one eyebrow with the icon’s red-and-blue tick, Bodoni headlines, Newsreader reading text, system-font labels, one cream pill button, one footer. Table-only, inline-styled, every image sized with alt text. Shown at 390px.</p>
<p>Subject and inbox preview above each email. Supabase templates keep their <code>{{ .ConfirmationURL }}</code> / <code>{{ .Token }}</code> variables.</p></div>
<div class="grid">
${emails.map(e => `<div class="col"><div class="meta">${esc(e.name)}</div><div class="src">${esc(e.src)}</div>
<div class="inbox"><b>${esc(e.subject)}</b><span>${esc(e.preheader)}</span></div>
<div data-email="${e.id}">${e.html}</div></div>`).join('\n')}
</div></body></html>`;
fs.writeFileSync(path.join(HERE, 'emails-v1.html'), page);
console.log('wrote emails-v1.html', emails.length, 'emails');

// ---- The wordmark PNG (--assets) ---------------------------------------------------------------------
// public/brand/montage-wordmark.svg in cream, its viewBox grown 490 units at the top so the box is
// symmetric about the cap height's middle: vertical-align:middle then centres the letters, not the g's tail.
if (process.argv.includes('--assets')) (async () => {
  const { chromium } = require('playwright');
  const svg = fs.readFileSync(process.argv[process.argv.indexOf('--assets') + 1] || '/home/user/wt-emailmock/public/brand/montage-wordmark.svg', 'utf8')
    .replace(/viewBox="0 0 8381 1890"/, 'viewBox="0 -490 8381 2380" width="360" height="102"').replace('currentColor', C.ink);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 360, height: 102 } });
  await p.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
  await p.screenshot({ path: path.join(HERE, WORDMARK), omitBackground: true, clip: { x: 0, y: 0, width: 360, height: 102 } });
  await b.close(); console.log('wrote', WORDMARK);
})();
