// Fills the walls with local posters (the same films in both frames, so only the wall differs).
const POSTERS = [
  'b38-onboarding-fable-img/andhadhun', 'b39-img/arrival', 'b38-onboarding-fable-img/chinatown', 'b39-img/blackswan',
  'b38-onboarding-fable-img/dangal', 'b39-img/dune2', 'b38-onboarding-fable-img/darkknight', 'b39-img/furyroad',
  'b38-onboarding-fable-img/departed', 'b39-img/gonegirl', 'b38-onboarding-fable-img/fargo', 'b39-img/jathi',
  'b38-onboarding-fable-img/godfather', 'b39-img/lionking', 'b38-onboarding-fable-img/gow', 'b39-img/magadheera',
  'b38-onboarding-fable-img/heat', 'b39-img/mahanati', 'b38-onboarding-fable-img/idiots', 'b39-img/memento',
  'b38-onboarding-fable-img/inception', 'b39-img/prestige', 'b38-onboarding-fable-img/infernal', 'b39-img/rangasthalam',
  'b38-onboarding-fable-img/kahaani', 'b39-img/rrr', 'b38-onboarding-fable-img/lagaan', 'b39-img/shutter',
  'b38-onboarding-fable-img/lalaland', 'b39-img/sitaramam', 'b38-onboarding-fable-img/memories', 'b39-img/topgun',
  'b38-onboarding-fable-img/mysticriver', 'b39-img/whiplash', 'b38-onboarding-fable-img/nightcrawler', 'b38-onboarding-fable-img/nocountry',
  'b38-onboarding-fable-img/oldboy', 'b38-onboarding-fable-img/parasite', 'b38-onboarding-fable-img/prisoners', 'b38-onboarding-fable-img/se7en',
  'b38-onboarding-fable-img/sicario', 'b38-onboarding-fable-img/taxidriver', 'b38-onboarding-fable-img/tumbbad', 'b38-onboarding-fable-img/twilight',
  'b38-onboarding-fable-img/znmd', 'b38-onboarding-fable-img/zodiac',
].map((p) => p + '.jpg');

/** Columns of tiles; `shift` moves alternate columns as the drift would have them mid-loop. */
function fill(el, cols, rows, start, shift) {
  for (let c = 0; c < cols; c++) {
    const col = document.createElement('div');
    col.className = 'c';
    if (shift) col.style.marginTop = `${-((c * 37 + 15) % 100) * shift}px`;
    for (let r = 0; r < rows; r++) {
      const i = document.createElement('i');
      i.style.backgroundImage = `url(${POSTERS[(start + c * rows + r) % POSTERS.length]})`;
      col.appendChild(i);
    }
    el.appendChild(col);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // The straight wall: four columns of about six; columns two and four start a part-poster lower.
  document.querySelectorAll('.vwall').forEach((w) => fill(w, 4, 7, Number(w.dataset.start || 0), 0.9));
  // The tilted wall: six columns of seven (TiltedWall.rows for 393 x 852), each column at its own point of its loop.
  document.querySelectorAll('.plane').forEach((w) => fill(w, 6, 8, Number(w.dataset.start || 0), 1.2));
  const imgs = POSTERS.map((src) => new Promise((ok) => { const im = new Image(); im.onload = im.onerror = ok; im.src = src; }));
  Promise.all([...imgs, document.fonts.ready]).then(() => {
    // The scrim starts 56 above the words it sits behind (WelcomeScreen: .padding(.top, -56)).
    document.querySelectorAll('.ph').forEach((ph) => {
      const s = ph.querySelector('.scrim'), t = ph.querySelector('[data-scrim]');
      if (s && t) s.style.top = `${t.getBoundingClientRect().top - ph.getBoundingClientRect().top - 56}px`;
    });
    document.body.dataset.ready = '1';
  });
});
