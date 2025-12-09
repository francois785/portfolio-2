// Comportements : navigation mobile, thème, panneau réglages, smooth scroll, reveal on scroll, formulaire
(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navListLinks = document.querySelectorAll('.nav-list a[data-scroll]');
  const themeToggle = document.getElementById('theme-toggle');
  const openSettings = document.getElementById('open-settings');
  const settingsPanel = document.getElementById('settings-panel');
  const closeSettings = document.getElementById('close-settings');
  const prefDark = document.getElementById('pref-dark');
  const prefAvatarRound = document.getElementById('pref-avatar-round');
  const prefReset = document.getElementById('pref-reset');
  const profileFigure = document.getElementById('profile-figure');
  const contactForm = document.getElementById('contact-form');

  // helpers
  const q = sel => document.querySelector(sel);
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

  // Load preferences
  const prefs = JSON.parse(localStorage.getItem('site:prefs') || '{}');
  if (prefs.theme === 'dark' || (!prefs.theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark');
    if (prefDark) prefDark.checked = true;
    if (themeToggle) themeToggle.setAttribute('aria-pressed', 'true');
  }
  if (prefs.avatarRound === false) {
    profileFigure.classList.remove('avatar--round');
    if (prefAvatarRound) prefAvatarRound.checked = false;
  } else {
    profileFigure.classList.add('avatar--round');
  }

  // Mobile nav toggle
  on(navToggle, 'click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('show');
  });

  // Smooth scroll for anchor links
  navListLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const href = a.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
        // close mobile nav if open
        if (mainNav.classList.contains('show')) {
          mainNav.classList.remove('show');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Theme toggle
  on(themeToggle, 'click', () => {
    const using = document.body.classList.toggle('dark');
    themeToggle.setAttribute('aria-pressed', String(using));
    // sync checkbox if settings open
    if (prefDark) prefDark.checked = using;
    savePrefs();
  });

  // Settings panel
  on(openSettings, 'click', () => {
    settingsPanel.classList.toggle('open');
    const hidden = settingsPanel.classList.contains('open') ? 'false' : 'true';
    settingsPanel.setAttribute('aria-hidden', hidden);
  });
  on(closeSettings, 'click', () => {
    settingsPanel.classList.remove('open');
    settingsPanel.setAttribute('aria-hidden', 'true');
  });

  // Preferences checkboxes
  on(prefDark, 'change', () => {
    const checked = prefDark.checked;
    if (checked) document.body.classList.add('dark'); else document.body.classList.remove('dark');
    if (themeToggle) themeToggle.setAttribute('aria-pressed', String(checked));
    savePrefs();
  });
  on(prefAvatarRound, 'change', () => {
    const checked = prefAvatarRound.checked;
    if (checked) profileFigure.classList.add('avatar--round'); else profileFigure.classList.remove('avatar--round');
    savePrefs();
  });

  on(prefReset, 'click', () => {
    localStorage.removeItem('site:prefs');
    // reset to defaults
    document.body.classList.remove('dark');
    if (prefDark) prefDark.checked = false;
    profileFigure.classList.add('avatar--round');
    if (prefAvatarRound) prefAvatarRound.checked = true;
    if (themeToggle) themeToggle.setAttribute('aria-pressed', 'false');
    savePrefs();
  });

  function savePrefs() {
    const state = {
      theme: document.body.classList.contains('dark') ? 'dark' : 'light',
      avatarRound: prefAvatarRound ? prefAvatarRound.checked : true
    };
    localStorage.setItem('site:prefs', JSON.stringify(state));
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('inview');
          obs.unobserve(e.target);
        }
      });
    }, {threshold: 0.12});
    reveals.forEach(r => obs.observe(r));
  } else {
    // fallback
    reveals.forEach(r => r.classList.add('inview'));
  }

  // Basic form handling (client-side)
  if (contactForm) {
    contactForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const email = contactForm.querySelector('#email').value.trim();
      const message = contactForm.querySelector('#message').value.trim();
      if (!email || !message) {
        alert('Merci de renseigner ton email et ton message.');
        return;
      }
      // Ici, tu peux appeler ton endpoint ou service mail (Formspree / Netlify / backend)
      // Pour l'instant on affiche un message convivial
      contactForm.reset();
      alert('Merci ! Ton message a bien été reçu (simulation). Je te répondrai dès que possible.');
    });
  }

  // Close settings on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      settingsPanel.classList.remove('open');
      settingsPanel.setAttribute('aria-hidden', 'true');
      if (mainNav.classList.contains('show')) {
        mainNav.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // small helper to add subtle class when reveal (for CSS)
  // add CSS for .reveal.inview in CSS file (already handled by : animation)
})();
