// owner-v1: posters by name (mockups/img/tmdb) and line icons, filled in on load.
// <i class="po" data-p="WHIP"></i>  ·  <svg data-i="back"></svg>
(function () {
  const T = '../img/tmdb/';
  const P = {
    AF: '1ho0d4LNZw3Y0voeKmSvPSgJOJ2', DUNE: '1pdfLvkbY9ohJlCjQH2CZjjYVvJ', PORT: '2LquGwEhbg3soxSCs9VNyh5VJd9',
    SPIR: '39wmItIWsg5sZMyRUHLkWBcuVCM', GOD: '3bhkrj58Vtu7enYsRolD1fZdja1', NOC: '6d5XOczc226jECq0LIX0siKtgHR',
    PARA: '7IiTTgloJzvGI1TAYymCfbfl3vT', WHIP: '7fn624j5lj3xTme2SgiLCeuedmO', GOOD: '9OkCLM73MIU2CrKZbqiT8Ln1wY2',
    HEAT: 'e09dLw1Ljtccd2P4NsuUvVtS5du', HER: 'eCOtqtfvn7mxGl6nfmq4b1exJRc', GBH: 'eWdyYQreja6JGCzqHWXpWHDrrPo',
    AFTER: 'evKz85EKouVbIr51zy5fOtpNRPg', BR: 'gajva2L0rPYkEWjzgFlBXCAVBE5', MAD: 'hA2ple9q4qnwxp3hKVNhroipsir',
    MOOD: 'iYypPT4bhqXfq1b6EnmxvRt6b2Y', PAST: 'k3waqVXSnvCZWfJYNtdamTgTtTA', BSUN: 'kf1Jb1c2JAOqjuzA3H4oDM263uB',
    CASA: 'lGCEKlJo2CnWydQj7aamY7s1S7Q', SAM: 'lOMGc8bnSwQhS4XyE1S99uH8NXf', SUBS: 'lqoMzCcZYEFK729d6qzt349fB4o',
    CMBYN: 'mZ4gBdfkhP9tvLH1DO4m4HYtiyi', AMEL: 'nSxDa3M9aMvGVLoItzWTepQ5h5d', OLD: 'pWDtjs568ZfOTMbURQBYuT4Qxka',
    MOON: 'qLnfEmPrDjJfPyyddLJPkXmshkp', EEAAO: 'u68AjlvlutfEIcpmbYpKcdi09ut', SHIN: 'uAR0AWqhQL1hQa69UDEbb2rE5Wx',
    LALA: 'uDO8zWDhfWwoFdKS4fzkUJt0Rf0',
  };
  const I = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    chev: '<path d="M9 18l6-6-6-6"/>',
    chevl: '<path d="M15 18l-6-6 6-6"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    msg: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    tv: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 21h8M9 3l3 3 3-3"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',
    share: '<path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    ticket: '<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14 6v12" stroke-dasharray="2 2"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    person: '<circle cx="9" cy="8" r="4"/><path d="M2 21c1.2-3.6 3.8-5.5 7-5.5s5.8 1.9 7 5.5M19 8v6M16 11h6"/>',
    sort: '<path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4"/>',
    film: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M17 8h4M3 16h4M17 16h4"/>',
  };
  document.querySelectorAll('[data-p]').forEach((el) => {
    const id = P[el.dataset.p];
    if (id) el.style.backgroundImage = `url(${T}${id}.jpg)`;
  });
  document.querySelectorAll('svg[data-i]').forEach((el) => {
    el.setAttribute('viewBox', '0 0 24 24');
    el.innerHTML = I[el.dataset.i] || '';
  });
})();
