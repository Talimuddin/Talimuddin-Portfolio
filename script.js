(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const backToTop = document.getElementById('backToTop');

  // Theme preference is stored locally in this browser only.
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('talimuddin-theme');
  } catch (_) {}
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
  themeToggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try {
      localStorage.setItem('talimuddin-theme', next);
    } catch (_) {}
    themeToggle.setAttribute('aria-label', next === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  });

  // Mobile navigation
  menuToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });
  navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  // Typing effect
  const typingTarget = document.getElementById('typingText');
  const roles = ['Java Full Stack Developer', 'Software Developer', 'Java Developer'];
  let roleIndex = 0, charIndex = roles[0].length, deleting = false;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && typingTarget) {
    const type = () => {
      const word = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      typingTarget.textContent = word.slice(0, charIndex);
      let delay = deleting ? 48 : 82;
      if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = 1500;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 350;
      }
      window.setTimeout(type, delay);
    };
    window.setTimeout(type, 1800);
  }

  // Scroll reveal and counters
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else revealEls.forEach(el => el.classList.add('is-visible'));

  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target, target = Number(el.dataset.count);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 24));
        const timer = window.setInterval(() => {
          current = Math.min(target, current + step);
          el.textContent = current + (target === 8 ? '' : '+');
          if (current >= target) window.clearInterval(timer);
        }, 45);
        counterObserver.unobserve(el);
      });
    }, { threshold: .7 });
    counters.forEach(el => counterObserver.observe(el));
  } else counters.forEach(el => el.textContent = el.dataset.count + '+');

  // Project filters
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        const categories = card.dataset.category.split(' ');
        card.classList.toggle('hidden', filter !== 'all' && !categories.includes(filter));
      });
    });
  });

  // Back-to-top visibility and active section navigation
  const onScroll = () => {
    backToTop?.classList.toggle('visible', window.scrollY > 500);
    const sections = document.querySelectorAll('main section[id]');
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 150) current = section.id;
    });
    navLinks?.querySelectorAll('a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  document.getElementById('year').textContent = new Date().getFullYear();
})();